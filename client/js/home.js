const menuButton=document.getElementById("menu-button");
const navigation=document.getElementById("nav-links");

const statusText=document.getElementById("server-status");
const statusDot=document.getElementById("status-dot");

menuButton.addEventListener("click",()=>{
    navigation.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach((link)=>{
    link.addEventListener("click",()=>{
        navigation.classList.remove("active");
    });
});

async function checkBackendConnection(){
    try{
        const response=await fetch(`${API_BASE_URL}/health`);

        if(!response.ok){
            throw new Error("Backend returned an error");
        }

        const data=await response.json();

        statusText.textContent=data.message;
        statusDot.classList.add("connected");
        statusDot.classList.remove("disconnected");
    }catch(error){
        statusText.textContent=
            "Unable to connect to the TripFusion backend";

        statusDot.classList.add("disconnected");
        statusDot.classList.remove("connected");

        console.error("Backend connection error:",error);
    }
}

checkBackendConnection();