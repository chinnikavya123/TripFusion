const plannerForm=document.getElementById("planner-form");

const destinationInput=document.getElementById(
    "destination-input"
);

const saveTripButton=document.getElementById(
    "save-trip-button"
);

const saveTripMessage=document.getElementById(
    "save-trip-message"
);

let generatedTripPlan=null;

const startDateInput=document.getElementById("start-date");
const daysInput=document.getElementById("days-input");
const travelersInput=document.getElementById(
    "travelers-input"
);
const budgetInput=document.getElementById("budget-input");
const travelStyleInput=document.getElementById(
    "travel-style"
);

const plannerMessage=document.getElementById(
    "planner-message"
);

const itinerarySection=document.getElementById(
    "itinerary-section"
);

const itineraryContainer=document.getElementById(
    "itinerary-container"
);

const budgetBreakdown=document.getElementById(
    "budget-breakdown"
);

let destinations=[];

function formatCurrency(value){
    return new Intl.NumberFormat("en-IN",{
        style:"currency",
        currency:"INR",
        maximumFractionDigits:0
    }).format(Number(value)||0);
}

async function loadDestinationOptions(){
    try{
        const response=await fetch(
            `${API_BASE_URL}/destinations?limit=50&sort=nameAsc`
        );

        const result=await response.json();

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to load destinations"
            );
        }

        destinations=result.data.destinations;

        destinationInput.innerHTML=`
            <option value="">
                Select a destination
            </option>

            ${destinations.map((destination)=>{
                return`
                    <option value="${destination._id}">
                        ${destination.name}, ${destination.state}
                    </option>
                `;
            }).join("")}
        `;
    }catch(error){
        plannerMessage.textContent=error.message;
        plannerMessage.classList.add("error");
    }
}

function getSelectedInterests(){
    return[
        ...document.querySelectorAll(
            'input[name="interests"]:checked'
        )
    ].map((item)=>item.value);
}

function updatePreview(){
    const selectedOption=
        destinationInput.options[
            destinationInput.selectedIndex
        ];

    document.getElementById(
        "preview-destination"
    ).textContent=
        destinationInput.value
            ?selectedOption.textContent.trim()
            :"Not selected";

    const days=Number(daysInput.value)||0;

    document.getElementById(
        "preview-days"
    ).textContent=
        `${days} ${days===1?"day":"days"}`;

    const travelers=Number(travelersInput.value)||0;

    document.getElementById(
        "preview-travelers"
    ).textContent=
        `${travelers} ${
            travelers===1?"traveler":"travelers"
        }`;

    document.getElementById(
        "preview-budget"
    ).textContent=
        budgetInput.value
            ?formatCurrency(budgetInput.value)
            :"Not entered";

    document.getElementById(
        "preview-style"
    ).textContent=
        travelStyleInput.options[
            travelStyleInput.selectedIndex
        ].textContent.trim();
}

function calculateBudget(totalBudget){
    return{
        accommodation:Math.round(totalBudget*0.35),
        food:Math.round(totalBudget*0.20),
        localTransport:Math.round(totalBudget*0.15),
        activities:Math.round(totalBudget*0.20),
        emergency:Math.round(totalBudget*0.10)
    };
}

function generateDayPlan(
    destination,
    dayNumber,
    interests,
    totalDays
){
    const activities=Array.isArray(destination.activities)
        ?destination.activities
        :[];

    const nearbyPlaces=Array.isArray(destination.nearbyPlaces)
        ?destination.nearbyPlaces
        :[];

    const localFood=Array.isArray(destination.localFood)
        ?destination.localFood
        :[];

    const morningOptions=[
        `Start the day with breakfast and explore the main attractions of ${destination.name}`,
        `Visit a scenic viewpoint and enjoy the morning atmosphere of ${destination.name}`,
        `Take a guided local sightseeing tour around ${destination.city}`,
        `Explore a famous heritage or cultural attraction in ${destination.name}`,
        `Begin with a peaceful nature walk and photography session`,
        `Visit a local temple, monument or landmark before the crowds arrive`
    ];

    const afternoonOptions=[
        `Enjoy local sightseeing and explore nearby markets in ${destination.name}`,
        `Visit a popular nearby attraction and spend time exploring the area`,
        `Try a regional lunch followed by a relaxed city tour`,
        `Explore museums, gardens or cultural attractions in ${destination.city}`,
        `Spend the afternoon experiencing local traditions and handicrafts`,
        `Visit a nearby lake, waterfall, beach or hill viewpoint`
    ];

    const eveningOptions=[
        `Enjoy sunset views and relax at a popular viewpoint`,
        `Explore the local market and shop for souvenirs`,
        `Try traditional food at a recommended local restaurant`,
        `Take an evening walk and enjoy the atmosphere of ${destination.name}`,
        `Attend a cultural performance or local experience`,
        `Relax at the hotel and prepare for the next day's journey`
    ];

    const activity=
        activities.length>0
            ?activities[
                (dayNumber-1)%activities.length
            ]
            :null;

    const secondActivity=
        activities.length>1
            ?activities[
                dayNumber%activities.length
            ]
            :null;

    const nearbyPlace=
        nearbyPlaces.length>0
            ?nearbyPlaces[
                (dayNumber-1)%nearbyPlaces.length
            ]
            :null;

    const food=
        localFood.length>0
            ?localFood[
                (dayNumber-1)%localFood.length
            ]
            :"regional cuisine";

    const selectedInterests=
        interests.length>0
            ?interests.join(", ")
            :"general sightseeing";

    let morning;
    let afternoon;
    let evening;
    let title;

    if(dayNumber===1){
        title=`Arrival and introduction to ${destination.name}`;

        morning=
            `Arrive in ${destination.name}, travel to the hotel and complete check-in`;

        afternoon=
            `Have lunch, rest briefly and explore nearby attractions around the hotel`;

        evening=
            `Enjoy a relaxed evening walk, try ${food} and review the upcoming itinerary`;
    }else if(dayNumber===totalDays){
        title=`Final experiences and departure from ${destination.name}`;

        morning=
            activity
                ?`${activity.name}: ${activity.description}`
                :morningOptions[
                    (dayNumber-1)%morningOptions.length
                ];

        afternoon=
            `Shop for souvenirs, enjoy a final meal and complete hotel checkout`;

        evening=
            `Travel to the departure point and conclude the trip`;
    }else{
        title=`Explore ${destination.name} — Day ${dayNumber}`;

        morning=
            activity
                ?`${activity.name}: ${activity.description}`
                :morningOptions[
                    (dayNumber-1)%morningOptions.length
                ];

        if(nearbyPlace){
            afternoon=
                `Visit ${nearbyPlace.name}. ${nearbyPlace.description}`;
        }else if(secondActivity){
            afternoon=
                `${secondActivity.name}: ${secondActivity.description}`;
        }else{
            afternoon=
                afternoonOptions[
                    (dayNumber-1)%afternoonOptions.length
                ];
        }

        evening=
            `${eveningOptions[
                (dayNumber-1)%eveningOptions.length
            ]}. Recommended dinner: ${food}. Interests covered: ${selectedInterests}`;
    }

    return{
        day:dayNumber,
        title,
        morning,
        afternoon,
        evening
    };
}

function renderBudgetBreakdown(budget){
    budgetBreakdown.innerHTML=`
        <article>
            <span>Accommodation</span>
            <strong>
                ${formatCurrency(budget.accommodation)}
            </strong>
        </article>

        <article>
            <span>Food</span>
            <strong>
                ${formatCurrency(budget.food)}
            </strong>
        </article>

        <article>
            <span>Local Transport</span>
            <strong>
                ${formatCurrency(budget.localTransport)}
            </strong>
        </article>

        <article>
            <span>Activities</span>
            <strong>
                ${formatCurrency(budget.activities)}
            </strong>
        </article>

        <article>
            <span>Emergency Reserve</span>
            <strong>
                ${formatCurrency(budget.emergency)}
            </strong>
        </article>
    `;
}

function renderItinerary(
    destination,
    days,
    travelers,
    budget,
    interests
){
    document.getElementById(
        "itinerary-title"
    ).textContent=
        `${days}-day trip to ${destination.name}`;

    document.getElementById(
        "itinerary-summary"
    ).textContent=
        `${travelers} traveler(s) • ${
            formatCurrency(budget)
        } total budget • ${
            interests.length
                ?interests.join(", ")
                :"General travel"
        }`;

    const dayPlans=[];

    const calculatedBudget=calculateBudget(budget);

generatedTripPlan={
    destinationId:destination._id,
    startDate:startDateInput.value,
    days,
    travelers,
    totalBudget:budget,
    travelStyle:travelStyleInput.value,
    interests,
    budgetBreakdown:calculatedBudget,
    itinerary:dayPlans
};

    for(let day=1;day<=days;day++){
        dayPlans.push(
            generateDayPlan(
    destination,
    day,
    interests,
    days
)
        );
    }

    itineraryContainer.innerHTML=dayPlans
        .map((plan)=>{
            return`
                <article class="itinerary-day-card">
                    <div class="day-number">
                        Day ${plan.day}
                    </div>

                    <div class="day-content">
                        <h3>${plan.title}</h3>

                        <div class="day-schedule">
                            <p>
                                <strong>Morning:</strong>
                                ${plan.morning}
                            </p>

                            <p>
                                <strong>Afternoon:</strong>
                                ${plan.afternoon}
                            </p>

                            <p>
                                <strong>Evening:</strong>
                                ${plan.evening}
                            </p>
                        </div>
                    </div>
                </article>
            `;
        })
        .join("");

    renderBudgetBreakdown(calculatedBudget);

    itinerarySection.style.display="block";

    itinerarySection.scrollIntoView({
        behavior:"smooth"
    });
}

plannerForm.addEventListener("submit",(event)=>{
    event.preventDefault();

    plannerMessage.textContent="";
    plannerMessage.className="planner-message";

    const destination=destinations.find((item)=>{
        return item._id===destinationInput.value;
    });

    const days=Number(daysInput.value);
    const travelers=Number(travelersInput.value);
    const budget=Number(budgetInput.value);
    const interests=getSelectedInterests();

    if(!destination){
        plannerMessage.textContent=
            "Please select a destination.";

        plannerMessage.classList.add("error");
        return;
    }

    if(days<1||days>15){
        plannerMessage.textContent=
            "Number of days must be between 1 and 15.";

        plannerMessage.classList.add("error");
        return;
    }

    if(travelers<1){
        plannerMessage.textContent=
            "At least one traveler is required.";

        plannerMessage.classList.add("error");
        return;
    }

    if(budget<1000){
        plannerMessage.textContent=
            "Please enter a valid travel budget.";

        plannerMessage.classList.add("error");
        return;
    }

    renderItinerary(
        destination,
        days,
        travelers,
        budget,
        interests
    );

    saveTripButton.style.display="inline-flex";
    saveTripMessage.textContent="";
});

[
    destinationInput,
    daysInput,
    travelersInput,
    budgetInput,
    travelStyleInput
].forEach((element)=>{
    element.addEventListener("input",updatePreview);
    element.addEventListener("change",updatePreview);
});

document.addEventListener("DOMContentLoaded",()=>{
    const today=new Date().toISOString().split("T")[0];

    startDateInput.min=today;
    startDateInput.value=today;

    updatePreview();
    loadDestinationOptions();
});

saveTripButton.addEventListener("click",async()=>{
    if(!generatedTripPlan){
        return;
    }

    saveTripButton.disabled=true;
    saveTripButton.textContent="Saving...";
    saveTripMessage.textContent="";

    try{
        const response=await fetch(
            `${API_BASE_URL}/trip-plans`,
            {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                credentials:"include",
                body:JSON.stringify(generatedTripPlan)
            }
        );

        const result=await response.json();

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to save trip plan"
            );
        }

        saveTripMessage.textContent=
            "Trip plan saved successfully.";

        saveTripMessage.className=
            "planner-message success";

        saveTripButton.textContent="Trip Saved";
    }catch(error){
        saveTripMessage.textContent=error.message;

        saveTripMessage.className=
            "planner-message error";

        saveTripButton.disabled=false;
        saveTripButton.textContent="Save Trip Plan";
    }
});