const User=require("../models/User");
const generateToken=require("../utils/generateToken");
const crypto=require("crypto");

const{
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

function runWithTimeout(
    promise,
    timeout=25000
){
    return Promise.race([
        promise,

        new Promise((_,reject)=>{
            setTimeout(()=>{
                reject(
                    new Error(
                        "Email service took too long to respond"
                    )
                );
            },timeout);
        })
    ]);
}

const sendTokenResponse=(
    user,
    statusCode,
    res,
    message
)=>{
    const token=generateToken(
        user._id,
        user.role
    );

    const cookieDays=
        Number(
            process.env.COOKIE_EXPIRES_IN
        )||7;

    const isProduction=
        process.env.NODE_ENV==="production";

    const cookieOptions={
        expires:new Date(
            Date.now()+
            cookieDays*24*60*60*1000
        ),

        httpOnly:true,

        secure:isProduction,

        sameSite:isProduction
            ?"none"
            :"lax"
    };

    res.cookie(
        "token",
        token,
        cookieOptions
    );

    return res
        .status(statusCode)
        .json({
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

                    preferredCurrency:
                        user.preferredCurrency,

                    profileImage:
                        user.profileImage,

                    isEmailVerified:
                        user.isEmailVerified
                }
            }
        });
};

const register=async(
    req,
    res,
    next
)=>{
    try{
        const{
            fullName,
            email,
            phone,
            password,
            country,
            preferredCurrency
        }=req.body;

        if(
            !fullName||
            !email||
            !password
        ){
            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "Full name, email, and password are required"
                });
        }

        const cleanedName=
            String(fullName).trim();

        const normalizedEmail=
            String(email)
                .trim()
                .toLowerCase();

        const cleanedPhone=
            String(phone||"").trim();

        if(cleanedName.length<2){
            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "Full name must contain at least 2 characters"
                });
        }

        if(
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(normalizedEmail)
        ){
            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "Enter a valid email address"
                });
        }

        if(
            cleanedPhone&&
            !/^(\+91)?[6-9]\d{9}$/
                .test(cleanedPhone)
        ){
            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "Enter a valid Indian mobile number"
                });
        }

        if(String(password).length<8){
            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "Password must contain at least 8 characters"
                });
        }

        const existingUser=
            await User.findOne({
                email:normalizedEmail
            });

        if(existingUser){
            return res
                .status(409)
                .json({
                    success:false,

                    message:
                        "An account already exists with this email"
                });
        }

        const user=await User.create({
            fullName:cleanedName,
            email:normalizedEmail,
            phone:cleanedPhone,
            password,

            country:
                String(country||"India")
                    .trim()||
                "India",

            preferredCurrency:
                preferredCurrency||
                "INR",

            /*
             * Registration email verification
             * has been disabled. The user can
             * access the account immediately.
             */
            isEmailVerified:true
        });

        return sendTokenResponse(
            user,
            201,
            res,
            "Registration successful"
        );
    }catch(error){
        next(error);
    }
};

const login=async(
    req,
    res,
    next
)=>{
    try{
        const{
            email,
            password
        }=req.body;

        if(!email||!password){
            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "Email and password are required"
                });
        }

        const normalizedEmail=
            String(email)
                .trim()
                .toLowerCase();

        const user=await User.findOne({
            email:normalizedEmail
        }).select("+password");

        if(!user){
            return res
                .status(401)
                .json({
                    success:false,
                    message:
                        "Invalid email or password"
                });
        }

        const passwordMatches=
            await user.comparePassword(
                password
            );

        if(!passwordMatches){
            return res
                .status(401)
                .json({
                    success:false,
                    message:
                        "Invalid email or password"
                });
        }

        if(user.isBlocked){
            return res
                .status(403)
                .json({
                    success:false,

                    message:
                        "Your account has been blocked"
                });
        }

        /*
         * There is no isEmailVerified check
         * because registration OTP verification
         * has been removed.
         */
        return sendTokenResponse(
            user,
            200,
            res,
            "Login successful"
        );
    }catch(error){
        next(error);
    }
};

const logout=(
    req,
    res
)=>{
    const isProduction=
        process.env.NODE_ENV==="production";

    res.cookie(
        "token",
        "",
        {
            expires:new Date(0),
            httpOnly:true,
            secure:isProduction,

            sameSite:isProduction
                ?"none"
                :"lax"
        }
    );

    return res
        .status(200)
        .json({
            success:true,
            message:"Logout successful"
        });
};

const getCurrentUser=async(
    req,
    res
)=>{
    return res
        .status(200)
        .json({
            success:true,

            data:{
                user:req.user
            }
        });
};

const requestPasswordReset=async(
    req,
    res,
    next
)=>{
    try{
        const{
            email
        }=req.body;

        if(!email){
            return res
                .status(400)
                .json({
                    success:false,
                    message:
                        "Email address is required"
                });
        }

        const normalizedEmail=
            String(email)
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
            return res
                .status(404)
                .json({
                    success:false,

                    message:
                        "No account was found with this email"
                });
        }

        const otp=generateOTP();

        user.passwordResetOTPHash=
            hashOTP(otp);

        user.passwordResetOTPExpires=
            new Date(
                Date.now()+
                10*60*1000
            );

        user.passwordResetAttempts=0;
        user.passwordResetVerified=false;

        await user.save();

        try{
            await runWithTimeout(
                sendPasswordResetOTPEmail({
                    email:user.email,
                    fullName:user.fullName,
                    otp
                })
            );
        }catch(emailError){
            console.error(
                "Password reset email error:",
                emailError
            );

            return res
                .status(502)
                .json({
                    success:false,

                    message:
                        "The password-reset email could not be sent. Please try again shortly."
                });
        }

        return res
            .status(200)
            .json({
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

const verifyPasswordResetOTP=async(
    req,
    res,
    next
)=>{
    try{
        const{
            email,
            otp
        }=req.body;

        if(!email||!otp){
            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "Email and OTP are required"
                });
        }

        const normalizedEmail=
            String(email)
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

        if(
            !user||
            !user.passwordResetOTPHash||
            !user.passwordResetOTPExpires
        ){
            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "No active password-reset request was found"
                });
        }

        if(
            user.passwordResetOTPExpires
                .getTime()<
            Date.now()
        ){
            user.passwordResetOTPHash=null;
            user.passwordResetOTPExpires=null;
            user.passwordResetAttempts=0;
            user.passwordResetVerified=false;

            await user.save();

            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "The OTP has expired. Request a new OTP."
                });
        }

        if(
            user.passwordResetAttempts>=5
        ){
            return res
                .status(429)
                .json({
                    success:false,

                    message:
                        "Too many incorrect attempts. Request a new OTP."
                });
        }

        const suppliedHash=
            hashOTP(otp);

        if(
            suppliedHash!==
            user.passwordResetOTPHash
        ){
            user.passwordResetAttempts+=1;

            await user.save();

            const attemptsRemaining=
                Math.max(
                    5-
                    user.passwordResetAttempts,
                    0
                );

            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        `Invalid OTP. ${attemptsRemaining} attempts remaining.`
                });
        }

        user.passwordResetVerified=true;
        user.passwordResetAttempts=0;

        await user.save();

        return res
            .status(200)
            .json({
                success:true,

                message:
                    "OTP verified. You can now create a new password."
            });
    }catch(error){
        next(error);
    }
};

const resetPassword=async(
    req,
    res,
    next
)=>{
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
            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "All fields are required"
                });
        }

        if(
            newPassword!==
            confirmPassword
        ){
            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "Passwords do not match"
                });
        }

        if(
            String(newPassword).length<8
        ){
            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "Password must contain at least 8 characters"
                });
        }

        const normalizedEmail=
            String(email)
                .trim()
                .toLowerCase();

        const user=await User.findOne({
            email:normalizedEmail
        }).select(
            "+passwordResetOTPHash "+
            "+passwordResetOTPExpires "+
            "+passwordResetVerified"
        );

        if(
            !user||
            !user.passwordResetVerified
        ){
            return res
                .status(403)
                .json({
                    success:false,

                    message:
                        "Complete OTP verification before resetting the password"
                });
        }

        if(
            !user.passwordResetOTPExpires||
            user.passwordResetOTPExpires
                .getTime()<
            Date.now()
        ){
            return res
                .status(400)
                .json({
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

        return res
            .status(200)
            .json({
                success:true,

                message:
                    "Password reset successfully. You can now log in."
            });
    }catch(error){
        next(error);
    }
};

const updateProfile=async(
    req,
    res,
    next
)=>{
    try{
        const{
            fullName,
            phone,
            country,
            preferredCurrency
        }=req.body;

        const user=await User.findById(
            req.user._id
        );

        if(!user){
            return res
                .status(404)
                .json({
                    success:false,
                    message:"User not found"
                });
        }

        if(fullName!==undefined){
            const cleanedName=
                String(fullName).trim();

            if(cleanedName.length<2){
                return res
                    .status(400)
                    .json({
                        success:false,

                        message:
                            "Full name must contain at least 2 characters"
                    });
            }

            user.fullName=cleanedName;
        }

        if(phone!==undefined){
            const cleanedPhone=
                String(phone).trim();

            if(
                cleanedPhone&&
                !/^(\+91)?[6-9]\d{9}$/
                    .test(cleanedPhone)
            ){
                return res
                    .status(400)
                    .json({
                        success:false,

                        message:
                            "Enter a valid Indian mobile number"
                    });
            }

            user.phone=cleanedPhone;
        }

        if(country!==undefined){
            user.country=
                String(country).trim()||
                "India";
        }

        if(preferredCurrency!==undefined){
            user.preferredCurrency=
                preferredCurrency;
        }

        await user.save();

        return res
            .status(200)
            .json({
                success:true,

                message:
                    "Profile updated successfully",

                data:{
                    user:{
                        _id:user._id,
                        fullName:user.fullName,
                        email:user.email,
                        phone:user.phone,
                        country:user.country,

                        preferredCurrency:
                            user.preferredCurrency,

                        isEmailVerified:
                            user.isEmailVerified,

                        createdAt:
                            user.createdAt
                    }
                }
            });
    }catch(error){
        next(error);
    }
};

const changePassword=async(
    req,
    res,
    next
)=>{
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
            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "All password fields are required"
                });
        }

        if(
            newPassword!==
            confirmPassword
        ){
            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "New passwords do not match"
                });
        }

        if(
            String(newPassword).length<8
        ){
            return res
                .status(400)
                .json({
                    success:false,

                    message:
                        "New password must contain at least 8 characters"
                });
        }

        const user=await User.findById(
            req.user._id
        ).select("+password");

        if(!user){
            return res
                .status(404)
                .json({
                    success:false,
                    message:"User not found"
                });
        }

        const passwordMatches=
            await user.comparePassword(
                currentPassword
            );

        if(!passwordMatches){
            return res
                .status(401)
                .json({
                    success:false,

                    message:
                        "Current password is incorrect"
                });
        }

        user.password=newPassword;

        await user.save();

        return res
            .status(200)
            .json({
                success:true,

                message:
                    "Password changed successfully"
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
    requestPasswordReset,
    verifyPasswordResetOTP,
    resetPassword,
    updateProfile,
    changePassword
};