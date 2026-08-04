const detailsContainer=document.getElementById(
    "trip-details-container"
);

const emailTripButton=document.getElementById(
    "email-trip-button"
);

const smsTripButton=document.getElementById(
    "sms-trip-button"
);

const notificationMessage=document.getElementById(
    "notification-message"
);

let currentTripId=null;

const loadingElement=document.getElementById(
    "trip-details-loading"
);

const downloadPdfButton=document.getElementById(
    "download-pdf-button"
);

let loadedTrip=null;

downloadPdfButton.disabled=true;

const errorElement=document.getElementById(
    "trip-details-error"
);

const logoutButton=document.getElementById(
    "logout-button"
);

const fallbackImage=
    "./assets/images/destinations/goa.jpg";

function formatCurrency(value){
    return new Intl.NumberFormat("en-IN",{
        style:"currency",
        currency:"INR",
        maximumFractionDigits:0
    }).format(Number(value)||0);
}

function formatDate(value){
    return new Intl.DateTimeFormat("en-IN",{
        day:"2-digit",
        month:"long",
        year:"numeric"
    }).format(new Date(value));
}

function escapeHTML(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

function getAuthHeaders(){
    const token=localStorage.getItem(
        "tripfusion_token"
    );

    const headers={
        "Accept":"application/json"
    };

    if(token){
        headers.Authorization=`Bearer ${token}`;
    }

    return headers;
}

function getImagePath(image){
    if(!image){
        return fallbackImage;
    }

    if(
        image.startsWith("http://")||
        image.startsWith("https://")||
        image.startsWith("data:")||
        image.startsWith("./")
    ){
        return image;
    }

    if(image.startsWith("assets/")){
        return `./${image}`;
    }

    return image;
}

function createBudgetCards(budget){
    const items=[
        ["Accommodation",budget.accommodation],
        ["Food",budget.food],
        ["Local Transport",budget.localTransport],
        ["Activities",budget.activities],
        ["Emergency",budget.emergency]
    ];

    return items.map(([label,value])=>{
        return`
            <article class="saved-budget-card">
                <span>${label}</span>

                <strong>
                    ${formatCurrency(value)}
                </strong>
            </article>
        `;
    }).join("");
}

function createItineraryCards(itinerary){
    return itinerary.map((day)=>{
        return`
            <article class="saved-day-card">
                <div class="saved-day-number">
                    Day ${day.day}
                </div>

                <div class="saved-day-content">
                    <h3>
                        ${escapeHTML(day.title)}
                    </h3>

                    <div class="saved-day-schedule">
                        <p>
                            <strong>Morning:</strong>
                            ${escapeHTML(day.morning)}
                        </p>

                        <p>
                            <strong>Afternoon:</strong>
                            ${escapeHTML(day.afternoon)}
                        </p>

                        <p>
                            <strong>Evening:</strong>
                            ${escapeHTML(day.evening)}
                        </p>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}

function renderTripDetails(trip){
    const destination=trip.destination||{};

    const imagePath=getImagePath(
        destination.image
    );

    detailsContainer.innerHTML=`
        <section
            class="saved-trip-hero"
            style="
                background-image:
                linear-gradient(
                    rgba(6,30,52,0.65),
                    rgba(6,30,52,0.78)
                ),
                url('${imagePath}');
            "
        >
            <div class="saved-trip-hero-content">
                <a
                    href="./my-trips.html"
                    class="saved-trip-back"
                >
                    ← Back to My Trips
                </a>

                <div>
                    <p>YOUR SAVED JOURNEY</p>

                    <h1>
                        ${escapeHTML(trip.destinationName)}
                    </h1>

                    <span>
                        ${
                            destination.city
                                ?escapeHTML(destination.city)
                                :""
                        }
                        ${
                            destination.state
                                ?`, ${escapeHTML(destination.state)}`
                                :""
                        }
                    </span>
                </div>
            </div>
        </section>

        <section class="saved-trip-summary">
            <article>
                <span>Start Date</span>
                <strong>
                    ${formatDate(trip.startDate)}
                </strong>
            </article>

            <article>
                <span>Duration</span>
                <strong>
                    ${trip.days} days
                </strong>
            </article>

            <article>
                <span>Travelers</span>
                <strong>
                    ${trip.travelers}
                </strong>
            </article>

            <article>
                <span>Total Budget</span>
                <strong>
                    ${formatCurrency(trip.totalBudget)}
                </strong>
            </article>

            <article>
                <span>Travel Style</span>
                <strong>
                    ${escapeHTML(trip.travelStyle)}
                </strong>
            </article>
        </section>

        <section class="saved-trip-content">

            <div class="saved-trip-main">

                <section class="saved-trip-section">
                    <p class="saved-trip-label">
                        BUDGET BREAKDOWN
                    </p>

                    <h2>Estimated trip expenses</h2>

                    <div class="saved-budget-grid">
                        ${
                            createBudgetCards(
                                trip.budgetBreakdown||{}
                            )
                        }
                    </div>
                </section>

                <section class="saved-trip-section">
                    <p class="saved-trip-label">
                        DAY-WISE ITINERARY
                    </p>

                    <h2>Your travel schedule</h2>

                    <div class="saved-itinerary-list">
                        ${
                            createItineraryCards(
                                trip.itinerary||[]
                            )
                        }
                    </div>
                </section>

            </div>

            <aside class="saved-trip-sidebar">

                <section class="saved-sidebar-card">
                    <h3>Interests</h3>

                    <div class="saved-interest-list">
                        ${
                            trip.interests?.length
                                ?trip.interests.map((interest)=>{
                                    return`
                                        <span>
                                            ${escapeHTML(interest)}
                                        </span>
                                    `;
                                }).join("")
                                :"<p>No interests selected.</p>"
                        }
                    </div>
                </section>

                <section class="saved-sidebar-card">
                    <h3>Trip status</h3>

                    <span class="saved-trip-status">
                        ${escapeHTML(trip.status)}
                    </span>
                </section>

                <section class="saved-sidebar-card">
                    <h3>Plan another trip</h3>

                    <p>
                        Generate another personalized itinerary using
                        your preferred destination and budget.
                    </p>

                    <a
                        href="./planner.html"
                        class="primary-button saved-plan-button"
                    >
                        Create New Plan
                    </a>
                </section>

            </aside>

        </section>
    `;
}

async function loadTripDetails(){
    try{
        const parameters=new URLSearchParams(
            window.location.search
        );

        const tripId=parameters.get("id");
        currentTripId=tripId;

        if(!tripId){
            throw new Error(
                "Trip ID is missing from the URL."
            );
        }

        const response=await fetch(
            `${API_BASE_URL}/trip-plans/${
                encodeURIComponent(tripId)
            }`,
            {
                method:"GET",
                credentials:"include",
                headers:getAuthHeaders()
            }
        );

        const result=await response.json();

        if(response.status===401){
            window.location.href="./login.html";
            return;
        }

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to load trip details."
            );
        }

        loadingElement.style.display="none";

        loadedTrip=result.data.tripPlan;

renderTripDetails(loadedTrip);

downloadPdfButton.disabled=false;
        loadedTrip=result.data.tripPlan;
    }catch(error){
        loadingElement.style.display="none";

        errorElement.style.display="block";
        errorElement.textContent=error.message;

        console.error(error);
    }
}

logoutButton.addEventListener("click",async()=>{
    try{
        await fetch(
            `${API_BASE_URL}/auth/logout`,
            {
                method:"POST",
                credentials:"include",
                headers:getAuthHeaders()
            }
        );
    }finally{
        localStorage.removeItem(
            "tripfusion_user"
        );

        localStorage.removeItem(
            "tripfusion_token"
        );

        window.location.href="./login.html";
    }
});

document.addEventListener(
    "DOMContentLoaded",
    loadTripDetails
);

downloadPdfButton.addEventListener("click",async()=>{
    if(!loadedTrip){
        alert("Please wait until the trip details are loaded.");
        return;
    }

    if(typeof html2pdf==="undefined"){
        alert(
            "PDF library could not be loaded. Check your internet connection and refresh the page."
        );

        console.error("html2pdf library is not available");
        return;
    }

    const element=document.getElementById(
        "trip-details-container"
    );

    if(!element){
        alert("Trip content could not be found.");
        return;
    }

    const originalText=downloadPdfButton.textContent;

    downloadPdfButton.disabled=true;
    downloadPdfButton.textContent="Preparing PDF...";

    try{
        const safeDestinationName=String(
            loadedTrip.destinationName||"Trip"
        )
            .replace(/[<>:"/\\|?*]+/g,"")
            .trim();

        const options={
            margin:[
                8,
                8,
                8,
                8
            ],

            filename:
                `${safeDestinationName}-TripFusion-Itinerary.pdf`,

            image:{
                type:"jpeg",
                quality:0.95
            },

            html2canvas:{
                scale:2,
                useCORS:true,
                allowTaint:false,
                logging:false,
                scrollX:0,
                scrollY:0,
                windowWidth:element.scrollWidth
            },

            jsPDF:{
                unit:"mm",
                format:"a4",
                orientation:"portrait"
            },

            pagebreak:{
                mode:[
                    "css",
                    "legacy"
                ],

                avoid:[
                    ".saved-day-card",
                    ".saved-budget-card",
                    ".saved-sidebar-card"
                ]
            }
        };

        await html2pdf()
            .set(options)
            .from(element)
            .save();
    }catch(error){
        console.error("PDF generation error:",error);

        alert(
            "Unable to create the PDF. Open the browser console for more details."
        );
    }finally{
        downloadPdfButton.disabled=false;
        downloadPdfButton.textContent=originalText;
    }
});

emailTripButton.addEventListener("click",async()=>{
    if(!currentTripId){
        return;
    }

    emailTripButton.disabled=true;
    emailTripButton.textContent="Sending...";
    emailTripMessage.textContent="";

    try{
        const response=await fetch(
            `${API_BASE_URL}/trip-plans/${
                encodeURIComponent(currentTripId)
            }/email`,
            {
                method:"POST",
                credentials:"include",
                headers:getAuthHeaders()
            }
        );

        const result=await response.json();

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to send trip email"
            );
        }

        emailTripMessage.textContent=result.message;
        emailTripMessage.className=
            "notification-message success";

        emailTripButton.textContent="Email Sent";
    }catch(error){
        emailTripMessage.textContent=error.message;
        emailTripMessage.className=
            "notification-message error";

        emailTripButton.disabled=false;
        emailTripButton.textContent=
            "Email Trip Details";
    }
});

smsTripButton.addEventListener("click",async()=>{
    if(!currentTripId){
        notificationMessage.textContent=
            "Trip information has not loaded yet.";

        notificationMessage.className=
            "notification-message error";

        return;
    }

    smsTripButton.disabled=true;
    smsTripButton.textContent="Sending SMS...";

    notificationMessage.textContent="";
    notificationMessage.className=
        "notification-message";

    try{
        const response=await fetch(
            `${API_BASE_URL}/trip-plans/${
                encodeURIComponent(currentTripId)
            }/sms`,
            {
                method:"POST",
                credentials:"include",
                headers:getAuthHeaders()
            }
        );

        const result=await response.json();

        if(response.status===401){
            window.location.href="./login.html";
            return;
        }

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to send the SMS summary."
            );
        }

        notificationMessage.textContent=result.message;

        notificationMessage.className=
            "notification-message success";

        smsTripButton.textContent="SMS Sent";
    }catch(error){
        console.error("SMS sending error:",error);

        notificationMessage.textContent=error.message;

        notificationMessage.className=
            "notification-message error";

        smsTripButton.disabled=false;
        smsTripButton.textContent="Send SMS Summary";
    }
});