const resetOTPForm=document.getElementById(
    "reset-otp-form"
);

const resetOTPInput=document.getElementById(
    "reset-otp-input"
);

const resetOTPMessage=document.getElementById(
    "reset-otp-message"
);

const verifyResetOTPButton=document.getElementById(
    "verify-reset-otp-button"
);

const resetEmailDisplay=document.getElementById(
    "reset-email-display"
);

const resetEmail=sessionStorage.getItem(
    "tripfusion_reset_email"
);

if(!resetEmail){
    window.location.href="./forgot-password.html";
}

resetEmailDisplay.textContent=resetEmail||"";

resetOTPInput.addEventListener("input",()=>{
    resetOTPInput.value=resetOTPInput.value
        .replace(/\D/g,"")
        .slice(0,6);
});

resetOTPForm.addEventListener(
    "submit",
    async(event)=>{
        event.preventDefault();

        const otp=resetOTPInput.value.trim();

        resetOTPMessage.textContent="";
        resetOTPMessage.className="auth-message";

        if(!/^[0-9]{6}$/.test(otp)){
            resetOTPMessage.textContent=
                "Enter the complete six-digit OTP.";

            resetOTPMessage.className=
                "auth-message error";

            return;
        }

        verifyResetOTPButton.disabled=true;
        verifyResetOTPButton.textContent=
            "Verifying...";

        try{
            const response=await fetch(
                `${API_BASE_URL}/auth/verify-reset-otp`,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":"application/json",
                        "Accept":"application/json"
                    },

                    body:JSON.stringify({
                        email:resetEmail,
                        otp
                    })
                }
            );

            const result=await response.json();

            if(!response.ok){
                throw new Error(
                    result.message||
                    "Unable to verify the OTP"
                );
            }

            sessionStorage.setItem(
                "tripfusion_reset_verified",
                "true"
            );

            resetOTPMessage.textContent=
                "OTP verified successfully. Redirecting...";

            resetOTPMessage.className=
                "auth-message success";

            setTimeout(()=>{
                window.location.href=
                    "./reset-password.html";
            },900);
        }catch(error){
            resetOTPMessage.textContent=
                error.message;

            resetOTPMessage.className=
                "auth-message error";

            verifyResetOTPButton.disabled=false;
            verifyResetOTPButton.textContent=
                "Verify OTP";
        }
    }
);