const tripsContainer=document.getElementById("trips-container");
const tripsLoading=document.getElementById("trips-loading");
const tripsEmpty=document.getElementById("trips-empty");
const tripCount=document.getElementById("trip-count");
const logoutButton=document.getElementById("logout-button");

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
        month:"short",
        year:"numeric"
    }).format(new Date(value));
}

function getAuthHeaders(){
    const token=localStorage.getItem("tripfusion_token");

    return token
        ?{
            "Accept":"application/json",
            "Authorization":`Bearer ${token}`
        }
        :{
            "Accept":"application/json"
        };
}

function createTripCard(trip){
    const destination=trip.destination||{};

    return`
        <article class="trip-card">
            <img
                src="${destination.image||"./assets/images/destinations/goa.jpg"}"
                alt="${trip.destinationName}"
                class="trip-card-image"
                onerror="
                    this.onerror=null;
                    this.src='./assets/images/destinations/goa.jpg';
                "
            >

            <div class="trip-card-content">
                <div class="trip-card-heading">
                    <div>
                        <h3>${trip.destinationName}</h3>
                        <p>
                            ${destination.city||""}
                            ${destination.state?`, ${destination.state}`:""}
                        </p>
                    </div>

                    <span class="trip-status">
                        ${trip.status}
                    </span>
                </div>

                <div class="trip-meta-grid">
                    <div>
                        <span>Start Date</span>
                        <strong>${formatDate(trip.startDate)}</strong>
                    </div>

                    <div>
                        <span>Duration</span>
                        <strong>${trip.days} days</strong>
                    </div>

                    <div>
                        <span>Travelers</span>
                        <strong>${trip.travelers}</strong>
                    </div>

                    <div>
                        <span>Budget</span>
                        <strong>
                            ${formatCurrency(trip.totalBudget)}
                        </strong>
                    </div>
                </div>

                <div class="trip-card-actions">
                    <button
                        type="button"
                        class="view-trip-button"
                        data-id="${trip._id}"
                    >
                        View Plan
                    </button>

                    <button
                        type="button"
                        class="delete-trip-button"
                        data-id="${trip._id}"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </article>
    `;
}

async function loadTrips(){
    try{
        const response=await fetchTripFusionAPI(
            `${API_BASE_URL}/trip-plans/my-trips`,
            {
                method:"GET",
                credentials:"include",
                headers:getAuthHeaders()
            },
            15000
        );

        const result=await response.json();

        if(response.status===401){
            window.location.href="./login.html";
            return;
        }

        if(!response.ok){
            throw new Error(
                result.message||"Unable to load saved trips"
            );
        }

        const trips=result.data.tripPlans||[];

        tripsLoading.style.display="none";
        tripCount.textContent=
            `${trips.length} saved ${trips.length===1?"trip":"trips"}`;

        if(trips.length===0){
            tripsEmpty.style.display="block";
            return;
        }

        tripsContainer.innerHTML=trips
            .map(createTripCard)
            .join("");

        attachTripEvents();
    }catch(error){
        tripsLoading.textContent=
            error.name==="AbortError"
                ?"The server is taking longer than expected. Please refresh once."
                :error.message;
        console.error(error);
    }
}

function attachTripEvents(){
    document.querySelectorAll(".view-trip-button")
        .forEach((button)=>{
            button.addEventListener("click",()=>{
                window.location.href=
                    `./trip-details.html?id=${button.dataset.id}`;
            });
        });

    document.querySelectorAll(".delete-trip-button")
        .forEach((button)=>{
            button.addEventListener("click",()=>{
                deleteTrip(button.dataset.id);
            });
        });
}

async function deleteTrip(tripId){
    const confirmed=window.confirm(
        "Are you sure you want to delete this trip?"
    );

    if(!confirmed){
        return;
    }

    try{
        const response=await fetch(
            `${API_BASE_URL}/trip-plans/${tripId}`,
            {
                method:"DELETE",
                credentials:"include",
                headers:getAuthHeaders()
            }
        );

        const result=await response.json();

        if(!response.ok){
            throw new Error(
                result.message||"Unable to delete trip"
            );
        }

        loadTrips();
    }catch(error){
        alert(error.message);
    }
}

logoutButton?.addEventListener("click",async()=>{
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
        localStorage.removeItem("tripfusion_user");
        localStorage.removeItem("tripfusion_token");

        window.location.href="./login.html";
    }
});

document.addEventListener("DOMContentLoaded",loadTrips);