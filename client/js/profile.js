const profileForm=document.getElementById("profile-form");
const changePasswordForm=document.getElementById(
    "change-password-form"
);

const logoutButton=document.getElementById("logout-button");

function getAuthHeaders(includeJSON=false){
    const token=localStorage.getItem("tripfusion_token");

    const headers={
        "Accept":"application/json"
    };

    if(includeJSON){
        headers["Content-Type"]="application/json";
    }

    if(token){
        headers.Authorization=`Bearer ${token}`;
    }

    return headers;
}

function formatDate(value){
    if(!value){
        return"—";
    }

    return new Intl.DateTimeFormat("en-IN",{
        month:"short",
        year:"numeric"
    }).format(new Date(value));
}

function showMessage(element,message,type){
    element.textContent=message;
    element.className=`auth-message ${type}`;
}

function fillProfile(user){
    document.getElementById("profile-name").value=
        user.fullName||"";

    document.getElementById("profile-email").value=
        user.email||"";

    document.getElementById("profile-phone").value=
        user.phone||"";

    document.getElementById("profile-country").value=
        user.country||"India";

    document.getElementById("profile-currency").value=
        user.preferredCurrency||"INR";

    document.getElementById(
        "profile-display-name"
    ).textContent=user.fullName||"TripFusion User";

    document.getElementById(
        "profile-display-email"
    ).textContent=user.email||"";

    document.getElementById(
        "profile-member-since"
    ).textContent=formatDate(user.createdAt);

    const initials=String(user.fullName||"U")
        .split(/\s+/)
        .filter(Boolean)
        .slice(0,2)
        .map((part)=>part[0].toUpperCase())
        .join("");

    document.getElementById(
        "profile-avatar"
    ).textContent=initials||"U";

    const badge=document.getElementById(
        "profile-verification-badge"
    );

    badge.textContent=user.isEmailVerified
        ?"Email Verified"
        :"Email Not Verified";

    badge.className=user.isEmailVerified
        ?"verification-badge verified"
        :"verification-badge unverified";
}

async function loadProfile(){
    try{
        const[
            userResponse,
            tripsResponse
        ]=await Promise.all([
            fetch(`${API_BASE_URL}/auth/me`,{
                credentials:"include",
                headers:getAuthHeaders()
            }),

            fetch(
                `${API_BASE_URL}/trip-plans/my-trips`,
                {
                    credentials:"include",
                    headers:getAuthHeaders()
                }
            )
        ]);

        if(userResponse.status===401){
            window.location.href="./login.html";
            return;
        }

        const userResult=await userResponse.json();
        const tripsResult=await tripsResponse.json();

        if(!userResponse.ok){
            throw new Error(
                userResult.message||
                "Unable to load profile"
            );
        }

        fillProfile(userResult.data.user);

        const trips=tripsResult.data?.tripPlans||[];

        document.getElementById(
            "profile-trip-count"
        ).textContent=trips.length;
    }catch(error){
        console.error(error);
        alert(error.message);
    }
}

profileForm.addEventListener("submit",async(event)=>{
    event.preventDefault();

    const button=document.getElementById(
        "update-profile-button"
    );

    const messageElement=document.getElementById(
        "profile-message"
    );

    button.disabled=true;
    button.textContent="Saving...";

    try{
        const response=await fetch(
            `${API_BASE_URL}/auth/profile`,
            {
                method:"PUT",
                credentials:"include",
                headers:getAuthHeaders(true),

                body:JSON.stringify({
                    fullName:document.getElementById(
                        "profile-name"
                    ).value.trim(),

                    phone:document.getElementById(
                        "profile-phone"
                    ).value.trim(),

                    country:document.getElementById(
                        "profile-country"
                    ).value.trim(),

                    preferredCurrency:
                        document.getElementById(
                            "profile-currency"
                        ).value
                })
            }
        );

        const result=await response.json();

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to update profile"
            );
        }

        localStorage.setItem(
            "tripfusion_user",
            JSON.stringify(result.data.user)
        );

        fillProfile(result.data.user);

        showMessage(
            messageElement,
            result.message,
            "success"
        );
    }catch(error){
        showMessage(
            messageElement,
            error.message,
            "error"
        );
    }finally{
        button.disabled=false;
        button.textContent="Save Changes";
    }
});

changePasswordForm.addEventListener(
    "submit",
    async(event)=>{
        event.preventDefault();

        const messageElement=document.getElementById(
            "password-message"
        );

        const button=document.getElementById(
            "change-password-button"
        );

        const currentPassword=document.getElementById(
            "current-password"
        ).value;

        const newPassword=document.getElementById(
            "profile-new-password"
        ).value;

        const confirmPassword=document.getElementById(
            "profile-confirm-password"
        ).value;

        if(newPassword!==confirmPassword){
            showMessage(
                messageElement,
                "New passwords do not match",
                "error"
            );

            return;
        }

        button.disabled=true;
        button.textContent="Changing...";

        try{
            const response=await fetch(
                `${API_BASE_URL}/auth/change-password`,
                {
                    method:"PUT",
                    credentials:"include",
                    headers:getAuthHeaders(true),

                    body:JSON.stringify({
                        currentPassword,
                        newPassword,
                        confirmPassword
                    })
                }
            );

            const result=await response.json();

            if(!response.ok){
                throw new Error(
                    result.message||
                    "Unable to change password"
                );
            }

            changePasswordForm.reset();

            showMessage(
                messageElement,
                result.message,
                "success"
            );
        }catch(error){
            showMessage(
                messageElement,
                error.message,
                "error"
            );
        }finally{
            button.disabled=false;
            button.textContent="Change Password";
        }
    }
);

logoutButton?.addEventListener("click",async()=>{
    try{
        await fetch(`${API_BASE_URL}/auth/logout`,{
            method:"POST",
            credentials:"include",
            headers:getAuthHeaders()
        });
    }finally{
        localStorage.removeItem("tripfusion_user");
        localStorage.removeItem("tripfusion_token");

        window.location.href="./login.html";
    }
});

document.addEventListener("DOMContentLoaded",loadProfile);