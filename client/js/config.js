const isLocalEnvironment=
    window.location.hostname==="localhost"||
    window.location.hostname==="127.0.0.1";

const API_BASE_URL=
    isLocalEnvironment
        ?"http://localhost:5000/api"
        :"https://tripfusion-backend-ef5i.onrender.com/api";

console.log(
    "Using API:",
    API_BASE_URL
);

async function fetchTripFusionAPI(
    url,
    options={},
    timeout=15000
){
    const controller=
        new AbortController();

    const timeoutId=
        setTimeout(
            ()=>{
                controller.abort();
            },
            timeout
        );

    try{
        return await fetch(
            url,
            {
                ...options,
                signal:controller.signal
            }
        );
    }finally{
        clearTimeout(timeoutId);
    }
}
