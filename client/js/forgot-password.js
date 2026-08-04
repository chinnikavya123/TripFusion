const forgotPasswordForm=document.getElementById(
    "forgot-password-form"
);

const forgotEmailInput=document.getElementById(
    "forgot-email"
);

const forgotEmailError=document.getElementById(
    "forgot-email-error"
);

const forgotPasswordMessage=document.getElementById(
    "forgot-password-message"
);

const sendResetOTPButton=document.getElementById(
    "send-reset-otp-button"
);

function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMessage(message,type){
    forgotPasswordMessage.textContent=message;
    forgotPasswordMessage.className=
        `auth-message ${type}`;
}

forgotEmailInput.addEventListener("input",()=>{
    forgotEmailInput.classList.remove("input-error");
    forgotEmailError.textContent="";
});

forgotPasswordForm.addEventListener(
    "submit",
    async(event)=>{
        event.preventDefault();

        const email=forgotEmailInput.value
            .trim()
            .toLowerCase();

        forgotEmailError.textContent="";
        forgotEmailInput.classList.remove("input-error");

        showMessage("","");

        if(!isValidEmail(email)){
            forgotEmailInput.classList.add(
                "input-error"
            );

            forgotEmailError.textContent=
                "Enter a valid registered email address.";

            return;
        }

        sendResetOTPButton.disabled=true;
        sendResetOTPButton.textContent=
            "Sending OTP...";

        try{
            const response=await fetch(
                `${API_BASE_URL}/auth/forgot-password`,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":"application/json",
                        "Accept":"application/json"
                    },

                    body:JSON.stringify({
                        email
                    })
                }
            );

            const result=await response.json();

            if(!response.ok){
                throw new Error(
                    result.message||
                    "Unable to send password reset OTP"
                );
            }

            sessionStorage.setItem(
                "tripfusion_reset_email",
                email
            );

            showMessage(
                "Password reset OTP sent successfully. Redirecting...",
                "success"
            );

            setTimeout(()=>{
                window.location.href=
                    "./verify-reset-otp.html";
            },900);
        }catch(error){
            showMessage(
                error.message,
                "error"
            );

            sendResetOTPButton.disabled=false;
            sendResetOTPButton.textContent=
                "Send Reset OTP";
        }
    }
);