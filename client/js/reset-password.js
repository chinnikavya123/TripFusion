const resetPasswordForm=document.getElementById(
    "reset-password-form"
);

const newPasswordInput=document.getElementById(
    "new-password"
);

const confirmNewPasswordInput=document.getElementById(
    "confirm-new-password"
);

const newPasswordError=document.getElementById(
    "new-password-error"
);

const confirmNewPasswordError=document.getElementById(
    "confirm-new-password-error"
);

const resetPasswordMessage=document.getElementById(
    "reset-password-message"
);

const resetPasswordButton=document.getElementById(
    "reset-password-button"
);

const resetAccountEmail=sessionStorage.getItem(
    "tripfusion_reset_email"
);

const resetVerified=sessionStorage.getItem(
    "tripfusion_reset_verified"
);

if(!resetAccountEmail||resetVerified!=="true"){
    window.location.href="./forgot-password.html";
}

document.querySelectorAll(".password-toggle")
    .forEach((button)=>{
        button.addEventListener("click",()=>{
            const input=document.getElementById(
                button.dataset.target
            );

            const isVisible=input.type==="text";

            input.type=isVisible
                ?"password"
                :"text";

            button.textContent=isVisible
                ?"Show"
                :"Hide";
        });
    });

function clearErrors(){
    newPasswordError.textContent="";
    confirmNewPasswordError.textContent="";

    newPasswordInput.classList.remove(
        "input-error"
    );

    confirmNewPasswordInput.classList.remove(
        "input-error"
    );

    resetPasswordMessage.textContent="";
    resetPasswordMessage.className="auth-message";
}

resetPasswordForm.addEventListener(
    "submit",
    async(event)=>{
        event.preventDefault();

        clearErrors();

        const newPassword=newPasswordInput.value;
        const confirmPassword=
            confirmNewPasswordInput.value;

        let hasError=false;

        if(newPassword.length<8){
            newPasswordInput.classList.add(
                "input-error"
            );

            newPasswordError.textContent=
                "Password must contain at least 8 characters.";

            hasError=true;
        }

        if(newPassword!==confirmPassword){
            confirmNewPasswordInput.classList.add(
                "input-error"
            );

            confirmNewPasswordError.textContent=
                "Passwords do not match.";

            hasError=true;
        }

        if(hasError){
            return;
        }

        resetPasswordButton.disabled=true;
        resetPasswordButton.textContent=
            "Resetting Password...";

        try{
            const response=await fetch(
                `${API_BASE_URL}/auth/reset-password`,
                {
                    method:"POST",

                    headers:{
                        "Content-Type":"application/json",
                        "Accept":"application/json"
                    },

                    body:JSON.stringify({
                        email:resetAccountEmail,
                        newPassword,
                        confirmPassword
                    })
                }
            );

            const result=await response.json();

            if(!response.ok){
                throw new Error(
                    result.message||
                    "Unable to reset your password"
                );
            }

            sessionStorage.removeItem(
                "tripfusion_reset_email"
            );

            sessionStorage.removeItem(
                "tripfusion_reset_verified"
            );

            resetPasswordMessage.textContent=
                "Password reset successfully. Redirecting to login...";

            resetPasswordMessage.className=
                "auth-message success";

            setTimeout(()=>{
                window.location.href="./login.html";
            },1000);
        }catch(error){
            resetPasswordMessage.textContent=
                error.message;

            resetPasswordMessage.className=
                "auth-message error";

            resetPasswordButton.disabled=false;
            resetPasswordButton.textContent=
                "Reset Password";
        }
    }
);