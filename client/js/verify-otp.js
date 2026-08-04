const otpForm=document.getElementById("otp-form");
const otpInput=document.getElementById("otp-input");
const otpMessage=document.getElementById("otp-message");

const verifyButton=document.getElementById(
    "verify-otp-button"
);

const resendButton=document.getElementById(
    "resend-otp-button"
);

const resendMessage=document.getElementById(
    "resend-message"
);

const emailDisplay=document.getElementById(
    "verification-email"
);

const verificationEmail=sessionStorage.getItem(
    "tripfusion_verification_email"
);

if(!verificationEmail){
    window.location.href="./register.html";
}

emailDisplay.textContent=verificationEmail||"";

otpInput.addEventListener("input",()=>{
    otpInput.value=otpInput.value
        .replace(/\D/g,"")
        .slice(0,6);
});

otpForm.addEventListener("submit",async(event)=>{
    event.preventDefault();

    const otp=otpInput.value.trim();

    otpMessage.textContent="";
    otpMessage.className="auth-message";

    if(!/^[0-9]{6}$/.test(otp)){
        otpMessage.textContent=
            "Enter the complete six-digit OTP.";

        otpMessage.className=
            "auth-message error";

        return;
    }

    verifyButton.disabled=true;
    verifyButton.textContent="Verifying...";

    try{
        const response=await fetch(
            `${API_BASE_URL}/auth/verify-email`,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json",
                    "Accept":"application/json"
                },

                credentials:"include",

                body:JSON.stringify({
                    email:verificationEmail,
                    otp
                })
            }
        );

        const result=await response.json();

        if(!response.ok){
            throw new Error(
                result.message||
                "Email verification failed"
            );
        }

        if(result.data?.user){
            localStorage.setItem(
                "tripfusion_user",
                JSON.stringify(result.data.user)
            );
        }

        if(result.token){
            localStorage.setItem(
                "tripfusion_token",
                result.token
            );
        }

        sessionStorage.removeItem(
            "tripfusion_verification_email"
        );

        otpMessage.textContent=
            "Email verified successfully. Redirecting...";

        otpMessage.className=
            "auth-message success";

        setTimeout(()=>{
            window.location.href="./planner.html";
        },900);
    }catch(error){
        otpMessage.textContent=error.message;
        otpMessage.className="auth-message error";

        verifyButton.disabled=false;
        verifyButton.textContent="Verify Email";
    }
});

resendButton.addEventListener("click",async()=>{
    resendButton.disabled=true;
    resendButton.textContent="Sending...";

    resendMessage.textContent="";
    resendMessage.className="auth-message";

    try{
        const response=await fetch(
            `${API_BASE_URL}/auth/resend-verification-otp`,
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json",
                    "Accept":"application/json"
                },

                body:JSON.stringify({
                    email:verificationEmail
                })
            }
        );

        const result=await response.json();

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to resend OTP"
            );
        }

        resendMessage.textContent=result.message;
        resendMessage.className=
            "auth-message success";
    }catch(error){
        resendMessage.textContent=error.message;
        resendMessage.className=
            "auth-message error";
    }finally{
        resendButton.disabled=false;
        resendButton.textContent="Resend OTP";
    }
});