(function(){
<<<<<<< HEAD
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
=======

    const SESSION_KEY=
        "tripfusion_session_started";

    function clearStoredAuth(){
        localStorage.removeItem(
            "tripfusion_token"
        );

        localStorage.removeItem(
            "tripfusion_user"
        );

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "authToken"
        );
    }

    function initializeSession(){

        const sessionStarted=
            sessionStorage.getItem(
                SESSION_KEY
            );

        /*
            This runs only when the website is opened
            in a fresh browser/tab session.

            Old login tokens are removed so the user
            initially sees Login + Register.
        */
        if(!sessionStarted){

            clearStoredAuth();

            sessionStorage.setItem(
                SESSION_KEY,
                "true"
            );
        }
    }

    function getToken(){

        return(
            localStorage.getItem(
                "tripfusion_token"
            )||
            localStorage.getItem(
                "token"
            )||
            localStorage.getItem(
                "authToken"
            )||
            ""
        );
    }

    function isLoggedIn(){

        return Boolean(
            getToken()
        );
    }

    function updateNavbarAuth(){

        const loggedIn=
            isLoggedIn();

        const loginButtons=
            document.querySelectorAll(
                "[data-auth='login']"
            );

        const registerButtons=
            document.querySelectorAll(
                "[data-auth='register']"
            );

        const logoutButtons=
            document.querySelectorAll(
                "[data-auth='logout']"
            );

        loginButtons.forEach(
            (button)=>{

                button.style.display=
                    loggedIn
                        ?"none"
                        :"inline-flex";
>>>>>>> 0eb78a4 (Fixed login and logout buttons functionality)
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
<<<<<<< HEAD
    }else{
=======

        registerButtons.forEach(
            (button)=>{

                button.style.display=
                    loggedIn
                        ?"none"
                        :"inline-flex";
            }
        );

        logoutButtons.forEach(
            (button)=>{

                button.style.display=
                    loggedIn
                        ?"inline-flex"
                        :"none";
            }
        );
    }

    async function logoutUser(){

        const token=getToken();

        try{

            if(
                token&&
                typeof API_BASE_URL!==
                "undefined"
            ){

                await fetch(
                    `${API_BASE_URL}/auth/logout`,
                    {
                        method:"POST",

                        credentials:
                            "include",

                        headers:{
                            "Accept":
                                "application/json",

                            "Content-Type":
                                "application/json",

                            "Authorization":
                                `Bearer ${token}`
                        }
                    }
                );
            }

        }catch(error){

            console.log(
                "Logout request failed:",
                error
            );

        }finally{

            clearStoredAuth();

            /*
                Keep SESSION_KEY.

                This means after logout in the
                same browser session the website
                remains logged out.
            */

            window.location.replace(
                "./index.html"
            );
        }
    }

    function bindLogout(){

        document
            .querySelectorAll(
                "[data-auth='logout']"
            )
            .forEach((button)=>{

                if(
                    button.dataset
                        .logoutBound===
                    "true"
                ){
                    return;
                }

                button.dataset
                    .logoutBound=
                    "true";

                button.addEventListener(
                    "click",
                    logoutUser
                );
            });
    }

    function initialize(){

        initializeSession();

        updateNavbarAuth();

        bindLogout();
    }

    if(
        document.readyState===
        "loading"
    ){

        document.addEventListener(
            "DOMContentLoaded",
            initialize
        );

    }else{

>>>>>>> 0eb78a4 (Fixed login and logout buttons functionality)
        initialize();
    }

    window.addEventListener(
        "pageshow",
<<<<<<< HEAD
        updateNavbar
    );

    window.addEventListener(
        "storage",
        updateNavbar
    );
=======
        updateNavbarAuth
    );

    window.TripFusionAuth={
        getToken,
        isLoggedIn,
        updateNavbarAuth,
        logoutUser
    };

>>>>>>> 0eb78a4 (Fixed login and logout buttons functionality)
})();