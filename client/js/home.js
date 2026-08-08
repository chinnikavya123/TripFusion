const menuButton=
    document.getElementById(
        "menu-button"
    );

const navigation=
    document.getElementById(
        "nav-links"
    );

const statusText=
    document.getElementById(
        "server-status-text"
    );

const statusDot=
    document.getElementById(
        "server-status-dot"
    );

menuButton?.addEventListener(
    "click",
    ()=>{
        navigation?.classList.toggle(
            "active"
        );
    }
);

document
    .querySelectorAll(
        ".nav-links a"
    )
    .forEach((link)=>{

        link.addEventListener(
            "click",
            ()=>{
                navigation?.classList.remove(
                    "active"
                );
            }
        );
    });

async function checkBackendConnection(){

    if(
        !statusText||
        !statusDot
    ){
        return;
    }

    statusText.textContent=
        "Connecting to TripFusion...";

    statusDot.classList.remove(
        "connected",
        "disconnected"
    );

    const controller=
        new AbortController();

    const timeoutId=
        setTimeout(
            ()=>{
                controller.abort();
            },
            15000
        );

    try{

        const response=
            await fetch(
                `${API_BASE_URL}/health`,
                {
                    method:"GET",

                    headers:{
                        "Accept":
                            "application/json"
                    },

                    signal:
                        controller.signal,

                    cache:
                        "no-store"
                }
            );

        if(!response.ok){

            throw new Error(
                "Backend returned an error"
            );
        }

        const data=
            await response.json();

        statusText.textContent=
            "Successfully connected to server";

        statusDot.classList.add(
            "connected"
        );

        statusDot.classList.remove(
            "disconnected"
        );

        console.log(
            "TripFusion backend connected:",
            data
        );

    }catch(error){

        if(
            error.name===
            "AbortError"
        ){

            statusText.textContent=
                "Server is taking longer than expected to respond.";

        }else{

            statusText.textContent=
                "Unable to connect to server";
        }

        statusDot.classList.add(
            "disconnected"
        );

        statusDot.classList.remove(
            "connected"
        );

        console.error(
            "Backend connection error:",
            error
        );

    }finally{

        clearTimeout(
            timeoutId
        );
    }
}

document.addEventListener(
    "DOMContentLoaded",
    checkBackendConnection
);