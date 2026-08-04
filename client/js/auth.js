function getElement(id){
    return document.getElementById(id);
}

function isValidEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function clearFieldError(id){
    const errorElement=getElement(`${id}-error`);

    if(errorElement){
        errorElement.textContent="";
    }

    const input=getElement(id);

    if(input){
        input.classList.remove("input-error");
    }
}

function showFieldError(id,message){
    const input=getElement(id);
    const errorElement=getElement(`${id}-error`);

    if(input){
        input.classList.add("input-error");
    }

    if(errorElement){
        errorElement.textContent=message;
    }
}

function clearFormErrors(form){
    form.querySelectorAll("input").forEach((input)=>{
        input.classList.remove("input-error");
    });

    form.querySelectorAll(".field-error").forEach((element)=>{
        element.textContent="";
    });
}

function showMessage(element,message,type){
    element.textContent=message;
    element.className=`auth-message ${type}`;
}

function setButtonLoading(button,isLoading,loadingText,normalText){
    button.disabled=isLoading;
    button.textContent=isLoading
        ?loadingText
        :normalText;
}

async function parseResponse(response){
    const contentType=response.headers.get("content-type")||"";

    if(contentType.includes("application/json")){
        return response.json();
    }

    return{
        success:false,
        message:"The server returned an invalid response."
    };
}

function saveLoggedInUser(result){
    const user=result.data?.user;

    if(user){
        localStorage.setItem(
            "tripfusion_user",
            JSON.stringify(user)
        );
    }

    /*
     * The secure authentication mechanism is the HTTP-only cookie.
     * Saving the token is useful only as an optional fallback for
     * environments that block local development cookies.
     */
    if(result.token){
        localStorage.setItem(
            "tripfusion_token",
            result.token
        );
    }
}

async function registerUser(event){
    event.preventDefault();

    const form=event.currentTarget;
    const messageElement=getElement("register-message");
    const submitButton=getElement("register-button");

    clearFormErrors(form);
    showMessage(messageElement,"","");

    const fullName=getElement("register-name").value.trim();
    const email=getElement("register-email")
        .value
        .trim()
        .toLowerCase();
    const phone=getElement("register-phone").value.trim();
    const password=getElement("register-password").value;
    const confirmPassword=getElement(
        "register-confirm-password"
    ).value;
    const acceptedTerms=getElement("register-terms").checked;

    let hasError=false;

    if(fullName.length<2){
        showFieldError(
            "register-name",
            "Please enter at least 2 characters."
        );

        hasError=true;
    }

    if(!isValidEmail(email)){
        showFieldError(
            "register-email",
            "Please enter a valid email address."
        );

        hasError=true;
    }

    if(phone&&!/^[0-9+\-\s]{7,15}$/.test(phone)){
        showFieldError(
            "register-phone",
            "Please enter a valid phone number."
        );

        hasError=true;
    }

    if(password.length<8){
        showFieldError(
            "register-password",
            "Password must contain at least 8 characters."
        );

        hasError=true;
    }

    if(password!==confirmPassword){
        showFieldError(
            "register-confirm-password",
            "Passwords do not match."
        );

        hasError=true;
    }

    if(!acceptedTerms){
        showMessage(
            messageElement,
            "Please accept the Terms of Service.",
            "error"
        );

        hasError=true;
    }

    if(hasError){
        return;
    }

    setButtonLoading(
        submitButton,
        true,
        "Creating Account...",
        "Create Account"
    );

    try{
        const response=await fetch(
            `${API_BASE_URL}/auth/register`,
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Accept":"application/json"
                },
                credentials:"include",
                body:JSON.stringify({
                    fullName,
                    email,
                    phone,
                    password,
                    country:"India",
                    preferredCurrency:"INR"
                })
            }
        );

        const result=await parseResponse(response);

        if(!response.ok){
            throw new Error(
                result.message||
                "Registration failed. Please try again."
            );
        }

        sessionStorage.setItem(
    "tripfusion_verification_email",
    email
);

showMessage(
    messageElement,
    "OTP sent successfully. Redirecting to verification...",
    "success"
);

setTimeout(()=>{
    window.location.href="./verify-otp.html";
},900);
    }catch(error){
        showMessage(
            messageElement,
            error.message,
            "error"
        );

        setButtonLoading(
            submitButton,
            false,
            "Creating Account...",
            "Create Account"
        );
    }
}

async function loginUser(event){
    event.preventDefault();

    const form=event.currentTarget;
    const messageElement=getElement("login-message");
    const submitButton=getElement("login-button");

    clearFormErrors(form);
    showMessage(messageElement,"","");

    const email=getElement("login-email")
        .value
        .trim()
        .toLowerCase();
    const password=getElement("login-password").value;
    const rememberUser=getElement("remember-user").checked;

    let hasError=false;

    if(!isValidEmail(email)){
        showFieldError(
            "login-email",
            "Please enter a valid email address."
        );

        hasError=true;
    }

    if(!password){
        showFieldError(
            "login-password",
            "Please enter your password."
        );

        hasError=true;
    }

    if(hasError){
        return;
    }

    setButtonLoading(
        submitButton,
        true,
        "Logging In...",
        "Login"
    );

    try{
        const response=await fetch(
            `${API_BASE_URL}/auth/login`,
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Accept":"application/json"
                },
                credentials:"include",
                body:JSON.stringify({
                    email,
                    password
                })
            }
        );

        const result=await parseResponse(response);

        if(!response.ok){
    if(
        response.status===403&&
        result.requiresVerification
    ){
        sessionStorage.setItem(
            "tripfusion_verification_email",
            result.data?.email||email
        );

        showMessage(
            messageElement,
            "Your email is not verified. Redirecting...",
            "error"
        );

        setTimeout(()=>{
            window.location.href="./verify-otp.html";
        },900);

        return;
    }

    throw new Error(
        result.message||
        "Login failed. Please check your credentials."
    );
}

        saveLoggedInUser(result);

        if(rememberUser){
            localStorage.setItem(
                "tripfusion_saved_email",
                email
            );
        }else{
            localStorage.removeItem(
                "tripfusion_saved_email"
            );
        }

        showMessage(
            messageElement,
            "Login successful. Redirecting...",
            "success"
        );

        setTimeout(()=>{
            window.location.href="./planner.html";
        },800);
    }catch(error){
        showMessage(
            messageElement,
            error.message,
            "error"
        );

        setButtonLoading(
            submitButton,
            false,
            "Logging In...",
            "Login"
        );
    }
}

function initializePasswordToggles(){
    document.querySelectorAll(".password-toggle")
        .forEach((button)=>{
            button.addEventListener("click",()=>{
                const input=getElement(
                    button.dataset.target
                );

                if(!input){
                    return;
                }

                const passwordIsVisible=
                    input.type==="text";

                input.type=passwordIsVisible
                    ?"password"
                    :"text";

                button.textContent=passwordIsVisible
                    ?"Show"
                    :"Hide";
            });
        });
}

function initializeInputCleanup(){
    document.querySelectorAll(".auth-field input")
        .forEach((input)=>{
            input.addEventListener("input",()=>{
                clearFieldError(input.id);
            });
        });
}

function initializeSavedEmail(){
    const emailInput=getElement("login-email");
    const rememberInput=getElement("remember-user");

    if(!emailInput||!rememberInput){
        return;
    }

    const savedEmail=localStorage.getItem(
        "tripfusion_saved_email"
    );

    if(savedEmail){
        emailInput.value=savedEmail;
        rememberInput.checked=true;
    }
}

document.addEventListener("DOMContentLoaded",()=>{
    initializePasswordToggles();
    initializeInputCleanup();
    initializeSavedEmail();

    const registerForm=getElement("register-form");
    const loginForm=getElement("login-form");

    if(registerForm){
        registerForm.addEventListener(
            "submit",
            registerUser
        );
    }

    if(loginForm){
        loginForm.addEventListener(
            "submit",
            loginUser
        );
    }
});