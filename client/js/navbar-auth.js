(function(){
    const token=localStorage.getItem(
        "tripfusion_token"
    );

    const user=localStorage.getItem(
        "tripfusion_user"
    );

    const isLoggedIn=Boolean(
        token&&user
    );

    const loginLinks=document.querySelectorAll(
        "[data-auth='login']"
    );

    const registerLinks=document.querySelectorAll(
        "[data-auth='register']"
    );

    const logoutButtons=document.querySelectorAll(
        "[data-auth='logout']"
    );

    loginLinks.forEach((element)=>{
        element.style.display=
            isLoggedIn
                ?"none"
                :"inline-flex";
    });

    registerLinks.forEach((element)=>{
        element.style.display=
            isLoggedIn
                ?"none"
                :"inline-flex";
    });

    logoutButtons.forEach((element)=>{
        element.style.display=
            isLoggedIn
                ?"inline-flex"
                :"none";

        element.addEventListener(
            "click",
            async()=>{
                try{
                    if(
                        typeof API_BASE_URL!==
                        "undefined"
                    ){
                        await fetch(
                            `${API_BASE_URL}/auth/logout`,
                            {
                                method:"POST",
                                credentials:"include",
                                headers:{
                                    "Content-Type":
                                        "application/json",
                                    Authorization:
                                        `Bearer ${token}`
                                }
                            }
                        );
                    }
                }catch(error){
                    console.error(
                        "Logout error:",
                        error
                    );
                }finally{
                    localStorage.removeItem(
                        "tripfusion_token"
                    );

                    localStorage.removeItem(
                        "tripfusion_user"
                    );

                    window.location.href=
                        "./index.html";
                }
            }
        );
    });
})();