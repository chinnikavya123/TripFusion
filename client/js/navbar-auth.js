(function(){
    function getToken(){
        return localStorage.getItem(
            "tripfusion_token"
        );
    }

    function updateNavbar(){
        const isLoggedIn=Boolean(
            getToken()
        );

        document.querySelectorAll(
            "[data-auth='login'],[data-auth='register']"
        ).forEach((element)=>{
            element.style.display=
                isLoggedIn
                    ?"none"
                    :"inline-flex";
        });

        document.querySelectorAll(
            "[data-auth='logout']"
        ).forEach((element)=>{
            element.style.display=
                isLoggedIn
                    ?"inline-flex"
                    :"none";
        });
    }

    async function logout(){
        const token=getToken();

        localStorage.removeItem(
            "tripfusion_token"
        );

        localStorage.removeItem(
            "tripfusion_user"
        );

        updateNavbar();

        try{
            if(
                token&&
                typeof API_BASE_URL!=="undefined"
            ){
                const controller=
                    new AbortController();

                const timeoutId=setTimeout(
                    ()=>controller.abort(),
                    3000
                );

                try{
                    await fetch(
                        `${API_BASE_URL}/auth/logout`,
                        {
                            method:"POST",
                            credentials:"include",
                            headers:{
                                "Accept":"application/json",
                                "Authorization":
                                    `Bearer ${token}`
                            },
                            signal:controller.signal
                        }
                    );
                }finally{
                    clearTimeout(timeoutId);
                }
            }
        }catch(error){
            console.warn(
                "Logout request could not complete:",
                error
            );
        }finally{
            window.location.replace(
                "./index.html"
            );
        }
    }

    function initialize(){
        updateNavbar();

        document.querySelectorAll(
            "[data-auth='logout']"
        ).forEach((button)=>{
            if(
                button.dataset
                    .navbarLogoutBound===
                "true"
            ){
                return;
            }

            button.dataset.navbarLogoutBound=
                "true";

            button.addEventListener(
                "click",
                logout
            );
        });
    }

    if(document.readyState==="loading"){
        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );
    }else{
        initialize();
    }

    window.addEventListener(
        "pageshow",
        updateNavbar
    );

    window.addEventListener(
        "storage",
        updateNavbar
    );
})();