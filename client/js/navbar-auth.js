(function(){

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

    function initializeSession(){

        const sessionStarted=
            sessionStorage.getItem(
                SESSION_KEY
            );

        if(!sessionStarted){

            clearStoredAuth();

            sessionStorage.setItem(
                SESSION_KEY,
                "true"
            );
        }
    }

    function isLoggedIn(){

        return Boolean(
            getToken()
        );
    }

    function updateNavbarAuth(){

        const loggedIn=
            isLoggedIn();

        document
            .querySelectorAll(
                "[data-auth='login']"
            )
            .forEach((button)=>{

                button.style.display=
                    loggedIn
                        ?"none"
                        :"inline-flex";
            });

        document
            .querySelectorAll(
                "[data-auth='register']"
            )
            .forEach((button)=>{

                button.style.display=
                    loggedIn
                        ?"none"
                        :"inline-flex";
            });

        document
            .querySelectorAll(
                "[data-auth='logout']"
            )
            .forEach((button)=>{

                button.style.display=
                    loggedIn
                        ?"inline-flex"
                        :"none";
            });
    }

    async function logoutUser(){

        const token=
            getToken();

        clearStoredAuth();

        updateNavbarAuth();

        try{

            if(
                token&&
                typeof API_BASE_URL!==
                "undefined"
            ){

                const controller=
                    new AbortController();

                const timeoutId=
                    setTimeout(
                        ()=>{
                            controller.abort();
                        },
                        3000
                    );

                try{

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
                            },

                            signal:
                                controller.signal
                        }
                    );

                }finally{

                    clearTimeout(
                        timeoutId
                    );
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

    function bindLogoutButtons(){

        document
            .querySelectorAll(
                "[data-auth='logout']"
            )
            .forEach((button)=>{

                if(
                    button.dataset
                        .navbarLogoutBound===
                    "true"
                ){
                    return;
                }

                button.dataset
                    .navbarLogoutBound=
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

        bindLogoutButtons();
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

        initialize();
    }

    window.addEventListener(
        "pageshow",
        updateNavbarAuth
    );

    window.addEventListener(
        "storage",
        updateNavbarAuth
    );

    window.TripFusionAuth={
        getToken,
        isLoggedIn,
        updateNavbarAuth,
        logoutUser
    };

})();