const User=require("../models/User");
const generateToken=require("../utils/generateToken");
const crypto=require("crypto");

const{
    sendOTPEmail,
    sendPasswordResetOTPEmail
}=require("../services/emailService");

function generateOTP(){
    return crypto
        .randomInt(100000,1000000)
        .toString();
}

function hashOTP(otp){
    return crypto
        .createHash("sha256")
        .update(String(otp))
        .digest("hex");
}

async function assignAndSendVerificationOTP(user){
    const otp=generateOTP();

    user.emailVerificationOTPHash=hashOTP(otp);

    user.emailVerificationOTPExpires=new Date(
        Date.now()+10*60*1000
    );

    user.emailVerificationAttempts=0;

    user.emailVerificationLastSentAt=new Date();

    await user.save();

    await sendOTPEmail({
        email:user.email,
        fullName:user.fullName,
        otp
    });
}

const sendTokenResponse=(user,statusCode,res,message)=>{
    const token=generateToken(user._id,user.role);

    const cookieDays=Number(process.env.COOKIE_EXPIRES_IN)||7;

    const cookieOptions={
        expires:new Date(
            Date.now()+cookieDays*24*60*60*1000
        ),
        httpOnly:true,
        sameSite:"lax",
        secure:process.env.NODE_ENV==="production"
    };

    res.cookie("token",token,cookieOptions);

    res.status(statusCode).json({
        success:true,
        message,
        token,
        data:{
            user:{
                id:user._id,
                fullName:user.fullName,
                email:user.email,
                phone:user.phone,
                role:user.role,
                country:user.country,
                preferredCurrency:user.preferredCurrency,
                profileImage:user.profileImage
            }
        }
    });
};

const register=async(req,res,next)=>{
    try{
        const{
            fullName,
            email,
            phone,
            password,
            country,
            preferredCurrency
        }=req.body;

        if(!fullName||!email||!password){
            return res.status(400).json({
                success:false,
                message:
                    "Full name, email, and password are required"
            });
        }

        const normalizedEmail=email
            .trim()
            .toLowerCase();

        const existingUser=await User.findOne({
            email:normalizedEmail
        }).select(
            "+emailVerificationOTPHash "+
            "+emailVerificationOTPExpires "+
            "+emailVerificationAttempts "+
            "+emailVerificationLastSentAt"
        );

        if(existingUser){
            if(existingUser.isEmailVerified){
                return res.status(409).json({
                    success:false,
                    message:
                        "An account already exists with this email"
                });
            }

            await assignAndSendVerificationOTP(
                existingUser
            );

            return res.status(200).json({
                success:true,
                requiresVerification:true,
                message:
                    "Your account already exists but is not verified. A new OTP has been sent.",
                data:{
                    email:existingUser.email
                }
            });
        }

        const user=await User.create({
            fullName,
            email:normalizedEmail,
            phone,
            password,
            country,
            preferredCurrency,
            isEmailVerified:false
        });

        await assignAndSendVerificationOTP(user);

        res.status(201).json({
            success:true,
            requiresVerification:true,
            message:
                "Registration successful. Check your email for the verification OTP.",
            data:{
                email:user.email
            }
        });
    }catch(error){
        next(error);
    }
};

const login=async(req,res,next)=>{
    try{
        const{email,password}=req.body;

        if(!email||!password){
            return res.status(400).json({
                success:false,
                message:"Email and password are required"
            });
        }

        const user=await User.findOne({
            email:email.toLowerCase()
        }).select("+password");

        if(!user){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }

        const passwordMatches=await user.comparePassword(password);

        if(!passwordMatches){
            return res.status(401).json({
                success:false,
                message:"Invalid email or password"
            });
        }

        if(user.isBlocked){
            return res.status(403).json({
                success:false,
                message:"Your account has been blocked"
            });
        }

        if(!user.isEmailVerified){
    return res.status(403).json({
        success:false,
        requiresVerification:true,
        message:
            "Please verify your email before logging in",
        data:{
            email:user.email
        }
    });
}

        sendTokenResponse(
            user,
            200,
            res,
            "Login successful"
        );
    }catch(error){
        next(error);
    }
};

const logout=(req,res)=>{
    res.cookie("token","",{
        expires:new Date(0),
        httpOnly:true,
        sameSite:"lax",
        secure:process.env.NODE_ENV==="production"
    });

    res.status(200).json({
        success:true,
        message:"Logout successful"
    });
};

const getCurrentUser=async(req,res)=>{
    res.status(200).json({
        success:true,
        data:{
            user:req.user
        }
    });
};

const verifyEmailOTP=async(req,res,next)=>{
    try{
        const{
            email,
            otp
        }=req.body;

        if(!email||!otp){
            return res.status(400).json({
                success:false,
                message:"Email and OTP are required"
            });
        }

        const normalizedEmail=email
            .trim()
            .toLowerCase();

        const user=await User.findOne({
            email:normalizedEmail
        }).select(
            "+emailVerificationOTPHash "+
            "+emailVerificationOTPExpires "+
            "+emailVerificationAttempts"
        );

        if(!user){
            return res.status(404).json({
                success:false,
                message:"Account not found"
            });
        }

        if(user.isEmailVerified){
            return res.status(400).json({
                success:false,
                message:"This email is already verified"
            });
        }

        if(
            !user.emailVerificationOTPHash||
            !user.emailVerificationOTPExpires
        ){
            return res.status(400).json({
                success:false,
                message:
                    "No active OTP was found. Request a new OTP."
            });
        }

        if(
            user.emailVerificationOTPExpires.getTime()<
            Date.now()
        ){
            user.emailVerificationOTPHash=null;
            user.emailVerificationOTPExpires=null;
            user.emailVerificationAttempts=0;

            await user.save();

            return res.status(400).json({
                success:false,
                message:
                    "The OTP has expired. Request a new OTP."
            });
        }

        if(user.emailVerificationAttempts>=5){
            return res.status(429).json({
                success:false,
                message:
                    "Too many incorrect attempts. Request a new OTP."
            });
        }

        const suppliedOTPHash=hashOTP(otp);

        if(
            suppliedOTPHash!==
            user.emailVerificationOTPHash
        ){
            user.emailVerificationAttempts+=1;

            await user.save();

            const attemptsRemaining=Math.max(
                5-user.emailVerificationAttempts,
                0
            );

            return res.status(400).json({
                success:false,
                message:
                    `Invalid OTP. ${attemptsRemaining} attempts remaining.`
            });
        }

        user.isEmailVerified=true;
        user.emailVerificationOTPHash=null;
        user.emailVerificationOTPExpires=null;
        user.emailVerificationAttempts=0;
        user.emailVerificationLastSentAt=null;

        await user.save();

        sendTokenResponse(
            user,
            200,
            res,
            "Email verified successfully"
        );
    }catch(error){
        next(error);
    }
};

const resendEmailOTP=async(req,res,next)=>{
    try{
        const{
            email
        }=req.body;

        if(!email){
            return res.status(400).json({
                success:false,
                message:"Email address is required"
            });
        }

        const normalizedEmail=email
            .trim()
            .toLowerCase();

        const user=await User.findOne({
            email:normalizedEmail
        }).select(
            "+emailVerificationOTPHash "+
            "+emailVerificationOTPExpires "+
            "+emailVerificationAttempts "+
            "+emailVerificationLastSentAt"
        );

        if(!user){
            return res.status(404).json({
                success:false,
                message:"Account not found"
            });
        }

        if(user.isEmailVerified){
            return res.status(400).json({
                success:false,
                message:"This email is already verified"
            });
        }

        if(user.emailVerificationLastSentAt){
            const millisecondsSinceLastOTP=
                Date.now()-
                user.emailVerificationLastSentAt.getTime();

            const cooldown=60*1000;

            if(millisecondsSinceLastOTP<cooldown){
                const secondsRemaining=Math.ceil(
                    (
                        cooldown-
                        millisecondsSinceLastOTP
                    )/1000
                );

                return res.status(429).json({
                    success:false,
                    message:
                        `Please wait ${secondsRemaining} seconds before requesting another OTP.`
                });
            }
        }

        await assignAndSendVerificationOTP(user);

        res.status(200).json({
            success:true,
            message:
                "A new verification OTP has been sent"
        });
    }catch(error){
        next(error);
    }
};

const requestPasswordReset=async(req,res,next)=>{
    try{
        const{email}=req.body;

        if(!email){
            return res.status(400).json({
                success:false,
                message:"Email address is required"
            });
        }

        const normalizedEmail=email
            .trim()
            .toLowerCase();

        const user=await User.findOne({
            email:normalizedEmail
        }).select(
            "+passwordResetOTPHash "+
            "+passwordResetOTPExpires "+
            "+passwordResetAttempts "+
            "+passwordResetVerified"
        );

        if(!user){
            return res.status(404).json({
                success:false,
                message:
                    "No account was found with this email"
            });
        }

        if(!user.isEmailVerified){
            return res.status(403).json({
                success:false,
                message:
                    "Verify your email before resetting the password"
            });
        }

        const otp=generateOTP();

        user.passwordResetOTPHash=hashOTP(otp);

        user.passwordResetOTPExpires=new Date(
            Date.now()+10*60*1000
        );

        user.passwordResetAttempts=0;
        user.passwordResetVerified=false;

        await user.save();

        await sendPasswordResetOTPEmail({
            email:user.email,
            fullName:user.fullName,
            otp
        });

        res.status(200).json({
            success:true,
            message:
                "Password reset OTP was sent to your email",
            data:{
                email:user.email
            }
        });
    }catch(error){
        next(error);
    }
};

const verifyPasswordResetOTP=async(req,res,next)=>{
    try{
        const{
            email,
            otp
        }=req.body;

        if(!email||!otp){
            return res.status(400).json({
                success:false,
                message:"Email and OTP are required"
            });
        }

        const user=await User.findOne({
            email:email.trim().toLowerCase()
        }).select(
            "+passwordResetOTPHash "+
            "+passwordResetOTPExpires "+
            "+passwordResetAttempts "+
            "+passwordResetVerified"
        );

        if(
            !user||
            !user.passwordResetOTPHash||
            !user.passwordResetOTPExpires
        ){
            return res.status(400).json({
                success:false,
                message:
                    "No active password-reset request was found"
            });
        }

        if(
            user.passwordResetOTPExpires.getTime()<
            Date.now()
        ){
            user.passwordResetOTPHash=null;
            user.passwordResetOTPExpires=null;
            user.passwordResetAttempts=0;
            user.passwordResetVerified=false;

            await user.save();

            return res.status(400).json({
                success:false,
                message:
                    "The OTP has expired. Request a new OTP."
            });
        }

        if(user.passwordResetAttempts>=5){
            return res.status(429).json({
                success:false,
                message:
                    "Too many incorrect attempts. Request a new OTP."
            });
        }

        if(
            hashOTP(otp)!==
            user.passwordResetOTPHash
        ){
            user.passwordResetAttempts+=1;
            await user.save();

            return res.status(400).json({
                success:false,
                message:
                    `Invalid OTP. ${
                        Math.max(
                            5-user.passwordResetAttempts,
                            0
                        )
                    } attempts remaining.`
            });
        }

        user.passwordResetVerified=true;
        user.passwordResetAttempts=0;

        await user.save();

        res.status(200).json({
            success:true,
            message:
                "OTP verified. You can now create a new password."
        });
    }catch(error){
        next(error);
    }
};

const resetPassword=async(req,res,next)=>{
    try{
        const{
            email,
            newPassword,
            confirmPassword
        }=req.body;

        if(
            !email||
            !newPassword||
            !confirmPassword
        ){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }

        if(newPassword!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Passwords do not match"
            });
        }

        if(newPassword.length<8){
            return res.status(400).json({
                success:false,
                message:
                    "Password must contain at least 8 characters"
            });
        }

        const user=await User.findOne({
            email:email.trim().toLowerCase()
        }).select(
            "+passwordResetOTPHash "+
            "+passwordResetOTPExpires "+
            "+passwordResetVerified"
        );

        if(!user||!user.passwordResetVerified){
            return res.status(403).json({
                success:false,
                message:
                    "Complete OTP verification before resetting the password"
            });
        }

        if(
            !user.passwordResetOTPExpires||
            user.passwordResetOTPExpires.getTime()<
            Date.now()
        ){
            return res.status(400).json({
                success:false,
                message:
                    "The password-reset session has expired"
            });
        }

        user.password=newPassword;

        user.passwordResetOTPHash=null;
        user.passwordResetOTPExpires=null;
        user.passwordResetAttempts=0;
        user.passwordResetVerified=false;

        await user.save();

        res.status(200).json({
            success:true,
            message:
                "Password reset successfully. You can now log in."
        });
    }catch(error){
        next(error);
    }
};

const updateProfile=async(req,res,next)=>{
    try{
        const{
            fullName,
            phone,
            country,
            preferredCurrency
        }=req.body;

        const user=await User.findById(req.user._id);

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }

        if(fullName!==undefined){
            const cleanedName=String(fullName).trim();

            if(cleanedName.length<2){
                return res.status(400).json({
                    success:false,
                    message:
                        "Full name must contain at least 2 characters"
                });
            }

            user.fullName=cleanedName;
        }

        if(phone!==undefined){
            const cleanedPhone=String(phone).trim();

            if(
                cleanedPhone&&
                !/^(\+91)?[6-9]\d{9}$/.test(cleanedPhone)
            ){
                return res.status(400).json({
                    success:false,
                    message:"Enter a valid Indian mobile number"
                });
            }

            user.phone=cleanedPhone;
        }

        if(country!==undefined){
            user.country=String(country).trim()||"India";
        }

        if(preferredCurrency!==undefined){
            user.preferredCurrency=preferredCurrency;
        }

        await user.save();

        res.status(200).json({
            success:true,
            message:"Profile updated successfully",
            data:{
                user:{
                    _id:user._id,
                    fullName:user.fullName,
                    email:user.email,
                    phone:user.phone,
                    country:user.country,
                    preferredCurrency:user.preferredCurrency,
                    isEmailVerified:user.isEmailVerified,
                    createdAt:user.createdAt
                }
            }
        });
    }catch(error){
        next(error);
    }
};

const changePassword=async(req,res,next)=>{
    try{
        const{
            currentPassword,
            newPassword,
            confirmPassword
        }=req.body;

        if(
            !currentPassword||
            !newPassword||
            !confirmPassword
        ){
            return res.status(400).json({
                success:false,
                message:"All password fields are required"
            });
        }

        if(newPassword!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"New passwords do not match"
            });
        }

        if(newPassword.length<8){
            return res.status(400).json({
                success:false,
                message:
                    "New password must contain at least 8 characters"
            });
        }

        const user=await User.findById(
            req.user._id
        ).select("+password");

        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            });
        }

        const passwordMatches=
            await user.comparePassword(currentPassword);

        if(!passwordMatches){
            return res.status(401).json({
                success:false,
                message:"Current password is incorrect"
            });
        }

        user.password=newPassword;
        await user.save();

        res.status(200).json({
            success:true,
            message:"Password changed successfully"
        });
    }catch(error){
        next(error);
    }
};

module.exports={
    register,
    login,
    logout,
    getCurrentUser,
    verifyEmailOTP,
    resendEmailOTP,
    requestPasswordReset,
    verifyPasswordResetOTP,
    resetPassword,
    updateProfile,
    changePassword
};