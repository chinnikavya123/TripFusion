const detailsContainer=document.getElementById(
    "trip-details-container"
);

const loadingElement=document.getElementById(
    "trip-details-loading"
);

const errorElement=document.getElementById(
    "trip-details-error"
);

const notificationMessage=document.getElementById(
    "notification-message"
);

const downloadPdfButton=document.getElementById(
    "download-pdf-button"
);

const weatherButton=document.getElementById(
    "weather-button"
);

const budgetButton=document.getElementById(
    "budget-button"
);

const closeWeatherButton=document.getElementById(
    "close-weather-button"
);

const weatherSection=document.getElementById(
    "weather-section"
);

const weatherTitle=document.getElementById(
    "weather-title"
);

const weatherLoading=document.getElementById(
    "weather-loading"
);

const weatherError=document.getElementById(
    "weather-error"
);

const weatherContainer=document.getElementById(
    "weather-container"
);

const logoutButton=document.getElementById(
    "logout-button"
);

const packingButton=document.getElementById(
    "packing-button"
);

const packingSection=document.getElementById(
    "packing-section"
);

const closePackingButton=document.getElementById(
    "close-packing-button"
);

const packingChecklistContainer=document.getElementById(
    "packing-checklist-container"
);

const packingItemInput=document.getElementById(
    "packing-item-input"
);

const packingCategorySelect=document.getElementById(
    "packing-category-select"
);

const addPackingItemButton=document.getElementById(
    "add-packing-item-button"
);

const resetPackingButton=document.getElementById(
    "reset-packing-button"
);

const packingProgressText=document.getElementById(
    "packing-progress-text"
);

const packingProgressPercent=document.getElementById(
    "packing-progress-percent"
);

const packingProgressFill=document.getElementById(
    "packing-progress-fill"
);

const nearbyPlacesContainer=document.getElementById(
    "nearby-places-container"
);

const nearbyPlacesTitle=document.getElementById(
    "nearby-places-title"
);

const openDestinationMap=document.getElementById(
    "open-destination-map"
);

let packingItems=[];

const fallbackImage=
    "./assets/images/destinations/goa.jpg";

let currentTripId=null;
let loadedTrip=null;
let weatherLoaded=false;

if(downloadPdfButton){
    downloadPdfButton.disabled=true;
}

if(smsTripButton){
    smsTripButton.disabled=true;
}

function formatCurrency(value){
    return new Intl.NumberFormat(
        "en-IN",
        {
            style:"currency",
            currency:"INR",
            maximumFractionDigits:0
        }
    ).format(Number(value)||0);
}

function formatDate(value){
    const date=new Date(value);

    if(Number.isNaN(date.getTime())){
        return"Not specified";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day:"2-digit",
            month:"long",
            year:"numeric"
        }
    ).format(date);
}

function escapeHTML(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

function getDefaultPackingItems(){
    return[
        {
            id:"passport",
            name:"Passport or ID proof",
            category:"Documents",
            packed:false,
            custom:false
        },
        {
            id:"tickets",
            name:"Travel tickets and booking confirmations",
            category:"Documents",
            packed:false,
            custom:false
        },
        {
            id:"wallet",
            name:"Wallet, cash and bank cards",
            category:"Essentials",
            packed:false,
            custom:false
        },
        {
            id:"water-bottle",
            name:"Reusable water bottle",
            category:"Essentials",
            packed:false,
            custom:false
        },
        {
            id:"comfortable-clothes",
            name:"Comfortable clothes",
            category:"Clothing",
            packed:false,
            custom:false
        },
        {
            id:"extra-clothes",
            name:"Extra pair of clothes",
            category:"Clothing",
            packed:false,
            custom:false
        },
        {
            id:"jacket",
            name:"Jacket or raincoat",
            category:"Clothing",
            packed:false,
            custom:false
        },
        {
            id:"footwear",
            name:"Comfortable footwear",
            category:"Clothing",
            packed:false,
            custom:false
        },
        {
            id:"phone",
            name:"Mobile phone",
            category:"Electronics",
            packed:false,
            custom:false
        },
        {
            id:"charger",
            name:"Phone charger",
            category:"Electronics",
            packed:false,
            custom:false
        },
        {
            id:"power-bank",
            name:"Power bank",
            category:"Electronics",
            packed:false,
            custom:false
        },
        {
            id:"earphones",
            name:"Earphones or headphones",
            category:"Electronics",
            packed:false,
            custom:false
        },
        {
            id:"medicines",
            name:"Required medicines",
            category:"Health",
            packed:false,
            custom:false
        },
        {
            id:"first-aid",
            name:"Basic first-aid kit",
            category:"Health",
            packed:false,
            custom:false
        },
        {
            id:"sanitizer",
            name:"Hand sanitizer",
            category:"Health",
            packed:false,
            custom:false
        },
        {
            id:"toiletries",
            name:"Personal toiletries",
            category:"Essentials",
            packed:false,
            custom:false
        }
    ];
}

function getPackingStorageKey(){
    return currentTripId
        ?`tripfusion_packing_${currentTripId}`
        :"tripfusion_packing_default";
}

function savePackingItems(){
    localStorage.setItem(
        getPackingStorageKey(),
        JSON.stringify(packingItems)
    );
}

function loadPackingItems(){
    const savedItems=localStorage.getItem(
        getPackingStorageKey()
    );

    if(savedItems){
        try{
            const parsedItems=JSON.parse(
                savedItems
            );

            if(Array.isArray(parsedItems)){
                packingItems=parsedItems;
                return;
            }
        }catch(error){
            console.error(
                "Unable to read saved packing checklist:",
                error
            );
        }
    }

    packingItems=getDefaultPackingItems();

    savePackingItems();
}

function updatePackingProgress(){
    const totalItems=packingItems.length;

    const packedItems=packingItems.filter(
        (item)=>item.packed
    ).length;

    const percentage=
        totalItems>0
            ?Math.round(
                (
                    packedItems/
                    totalItems
                )*100
            )
            :0;

    if(packingProgressText){
        packingProgressText.textContent=
            `${packedItems} of ${totalItems} items packed`;
    }

    if(packingProgressPercent){
        packingProgressPercent.textContent=
            `${percentage}%`;
    }

    if(packingProgressFill){
        packingProgressFill.style.width=
            `${percentage}%`;
    }
}

function getPackingCategoryIcon(category){
    const icons={
        Essentials:"🎒",
        Clothing:"👕",
        Electronics:"🔌",
        Health:"💊",
        Documents:"📄",
        Other:"📦"
    };

    return icons[category]||"📦";
}

function renderPackingChecklist(){
    if(!packingChecklistContainer){
        return;
    }

    const categories=[
        "Documents",
        "Essentials",
        "Clothing",
        "Electronics",
        "Health",
        "Other"
    ];

    const sections=categories.map((category)=>{
        const categoryItems=packingItems.filter(
            (item)=>item.category===category
        );

        if(categoryItems.length===0){
            return"";
        }

        const itemsHTML=categoryItems.map((item)=>{
            return`
                <div
                    class="packing-item ${
                        item.packed
                            ?"packing-item-complete"
                            :""
                    }"
                    data-item-id="${escapeHTML(item.id)}"
                >
                    <label class="packing-item-label">
                        <input
                            type="checkbox"
                            class="packing-item-checkbox"
                            data-item-id="${escapeHTML(item.id)}"
                            ${item.packed?"checked":""}
                        >

                        <span class="packing-custom-checkbox"></span>

                        <span class="packing-item-name">
                            ${escapeHTML(item.name)}
                        </span>
                    </label>

                    ${
                        item.custom
                            ?`
                                <button
                                    type="button"
                                    class="packing-delete-button"
                                    data-delete-item-id="${escapeHTML(item.id)}"
                                    aria-label="Remove ${escapeHTML(item.name)}"
                                >
                                    Remove
                                </button>
                            `
                            :""
                    }
                </div>
            `;
        }).join("");

        return`
            <section class="packing-category-card">
                <div class="packing-category-heading">
                    <span class="packing-category-icon">
                        ${getPackingCategoryIcon(category)}
                    </span>

                    <h3>
                        ${escapeHTML(category)}
                    </h3>

                    <span class="packing-category-count">
                        ${categoryItems.filter(
                            (item)=>item.packed
                        ).length}
                        /
                        ${categoryItems.length}
                    </span>
                </div>

                <div class="packing-category-items">
                    ${itemsHTML}
                </div>
            </section>
        `;
    }).join("");

    packingChecklistContainer.innerHTML=
        sections||
        `
            <p class="packing-empty-message">
                No packing items are available.
            </p>
        `;

    updatePackingProgress();
}

function togglePackingItem(itemId){
    const item=packingItems.find(
        (packingItem)=>
            packingItem.id===itemId
    );

    if(!item){
        return;
    }

    item.packed=!item.packed;

    savePackingItems();
    renderPackingChecklist();
}

function addCustomPackingItem(){
    if(
        !packingItemInput||
        !packingCategorySelect
    ){
        return;
    }

    const itemName=
        packingItemInput.value.trim();

    const category=
        packingCategorySelect.value||
        "Other";

    if(itemName.length<2){
        showNotification(
            "Enter a valid packing item.",
            "error"
        );

        packingItemInput.focus();
        return;
    }

    const duplicateItem=packingItems.some(
        (item)=>
            item.name
                .trim()
                .toLowerCase()===
            itemName.toLowerCase()
    );

    if(duplicateItem){
        showNotification(
            "This item is already in your packing list.",
            "error"
        );

        packingItemInput.focus();
        return;
    }

    const customItem={
        id:
            `custom-${Date.now()}-${
                Math.random()
                    .toString(36)
                    .slice(2,8)
            }`,

        name:itemName,
        category,
        packed:false,
        custom:true
    };

    packingItems.push(customItem);

    savePackingItems();
    renderPackingChecklist();

    packingItemInput.value="";

    showNotification(
        "Packing item added successfully.",
        "success"
    );

    packingItemInput.focus();
}

function removeCustomPackingItem(itemId){
    const item=packingItems.find(
        (packingItem)=>
            packingItem.id===itemId
    );

    if(!item||!item.custom){
        return;
    }

    packingItems=packingItems.filter(
        (packingItem)=>
            packingItem.id!==itemId
    );

    savePackingItems();
    renderPackingChecklist();

    showNotification(
        "Packing item removed.",
        "success"
    );
}

function resetPackingChecklist(){
    const confirmed=window.confirm(
        "Reset the complete packing checklist for this trip?"
    );

    if(!confirmed){
        return;
    }

    packingItems=getDefaultPackingItems();

    savePackingItems();
    renderPackingChecklist();

    showNotification(
        "Packing checklist reset successfully.",
        "success"
    );
}

function getAuthHeaders(){
    const token=localStorage.getItem(
        "tripfusion_token"
    );

    const headers={
        "Accept":"application/json"
    };

    if(token){
        headers.Authorization=
            `Bearer ${token}`;
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
        return`./${image}`;
    }

    return image;
}

function showNotification(
    message,
    type="success"
){
    if(!notificationMessage){
        return;
    }

    notificationMessage.textContent=message;

    notificationMessage.className=
        `notification-message ${type}`;

    notificationMessage.style.display="block";

    notificationMessage.scrollIntoView({
        behavior:"smooth",
        block:"nearest"
    });
}

function clearNotification(){
    if(!notificationMessage){
        return;
    }

    notificationMessage.textContent="";
    notificationMessage.className=
        "notification-message";
    notificationMessage.style.display="none";
}

function createGoogleMapsSearchURL(
    searchType,
    destinationName
){
    const query=
        `${searchType} near ${destinationName}`;

    return(
        "https://www.google.com/maps/search/?api=1&query="+
        encodeURIComponent(query)
    );
}

function createDestinationMapURL(
    destinationName
){
    return(
        "https://www.google.com/maps/search/?api=1&query="+
        encodeURIComponent(destinationName)
    );
}

function renderNearbyPlaces(trip){
    if(!nearbyPlacesContainer){
        return;
    }

    const destination=trip.destination||{};

    const destinationName=[
        trip.destinationName,
        destination.city,
        destination.state
    ]
        .filter(Boolean)
        .join(", ");

    if(!destinationName){
        nearbyPlacesContainer.innerHTML=`
            <p class="nearby-places-empty">
                Destination information is unavailable.
            </p>
        `;

        return;
    }

    const places=[
    {
        title:"Nearby Hotels",
        subtitle:"Stay and accommodation",
        description:
            "Find hotels, resorts, homestays and guest houses near your destination.",
        tip:"Compare ratings, prices and distance before booking.",
        icon:"🏨",
        search:"Hotels",
        badge:"Stay"
    },
    {
        title:"Restaurants",
        subtitle:"Food and local cuisine",
        description:
            "Explore nearby restaurants, cafés and popular local food options.",
        tip:"Check recent reviews, opening hours and menu photos.",
        icon:"🍽️",
        search:"Restaurants",
        badge:"Food"
    },
    {
        title:"Hospitals",
        subtitle:"Medical assistance",
        description:
            "Locate hospitals, clinics and emergency medical services nearby.",
        tip:"Save the closest hospital location before beginning your trip.",
        icon:"🏥",
        search:"Hospitals",
        badge:"Emergency"
    },
    {
        title:"ATMs",
        subtitle:"Cash and banking",
        description:
            "Find nearby ATMs and banking services for quick cash withdrawal.",
        tip:"Prefer ATMs located inside banks or trusted public locations.",
        icon:"🏧",
        search:"ATMs",
        badge:"Banking"
    },
    {
        title:"Petrol Pumps",
        subtitle:"Fuel and vehicle support",
        description:
            "Locate petrol pumps and fuel stations close to your destination.",
        tip:"Useful for road trips and journeys to remote locations.",
        icon:"⛽",
        search:"Petrol pumps",
        badge:"Fuel"
    },
    {
        title:"Railway Stations",
        subtitle:"Train transportation",
        description:
            "Find nearby railway stations and important train transport links.",
        tip:"Check travel time from your stay before planning departure.",
        icon:"🚆",
        search:"Railway stations",
        badge:"Train"
    },
    {
        title:"Bus Stations",
        subtitle:"Local and intercity buses",
        description:
            "Locate nearby bus stations, terminals and public transport points.",
        tip:"Confirm bus timings and the last available service.",
        icon:"🚌",
        search:"Bus stations",
        badge:"Bus"
    },
    {
        title:"Airports",
        subtitle:"Flight transportation",
        description:
            "Find the nearest airports and available flight transport options.",
        tip:"Check travel time, traffic and reporting time before departure.",
        icon:"✈️",
        search:"Airports",
        badge:"Flight"
    }
];

    nearbyPlacesContainer.innerHTML=
        places.map((place)=>{
            const mapsURL=
                createGoogleMapsSearchURL(
                    place.search,
                    destinationName
                );

            return`
    <a
        class="nearby-place-card"
        href="${mapsURL}"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Find ${escapeHTML(
            place.title
        )} near ${escapeHTML(
            destinationName
        )}"
    >
        <div class="nearby-place-card-top">
            <div class="nearby-place-icon">
                ${place.icon}
            </div>

            <span class="nearby-place-badge">
                ${escapeHTML(place.badge)}
            </span>
        </div>

        <div class="nearby-place-content">
            <h3>
                ${escapeHTML(place.title)}
            </h3>

            <span class="nearby-place-subtitle">
                ${escapeHTML(place.subtitle)}
            </span>

            <p>
                ${escapeHTML(
                    place.description
                )}
            </p>

            <div class="nearby-place-tip">
                <span>💡</span>

                <small>
                    ${escapeHTML(place.tip)}
                </small>
            </div>

            <div class="nearby-place-link">
                <span>
                    Explore on Google Maps
                </span>

                <strong aria-hidden="true">
                    →
                </strong>
            </div>
        </div>
    </a>
`;
        }).join("");

    if(nearbyPlacesTitle){
        nearbyPlacesTitle.textContent=
            `Useful places near ${destinationName}`;
    }

    if(openDestinationMap){
        openDestinationMap.href=
            createDestinationMapURL(
                destinationName
            );
    }
}

function createBudgetCards(
    budget={},
    totalBudget=0
){
    const items=[
        {
            label:"Accommodation",
            icon:"🏨",
            value:Number(
                budget.accommodation
            )||0
        },
        {
            label:"Food",
            icon:"🍽️",
            value:Number(
                budget.food
            )||0
        },
        {
            label:"Local Transport",
            icon:"🚕",
            value:Number(
                budget.localTransport
            )||0
        },
        {
            label:"Activities",
            icon:"🎟️",
            value:Number(
                budget.activities
            )||0
        },
        {
            label:"Emergency Reserve",
            icon:"🛡️",
            value:Number(
                budget.emergency
            )||0
        }
    ];

    const allocatedAmount=items.reduce(
        (total,item)=>{
            return total+item.value;
        },
        0
    );

    const remainingAmount=Math.max(
        Number(totalBudget||0)-
        allocatedAmount,
        0
    );

    const cards=items.map((item)=>{
        const percentage=
            Number(totalBudget)>0
                ?Math.round(
                    (
                        item.value/
                        Number(totalBudget)
                    )*100
                )
                :0;

        return`
            <article class="saved-budget-card">
                <div class="budget-card-heading">
                    <span class="budget-card-icon">
                        ${item.icon}
                    </span>

                    <span>
                        ${escapeHTML(item.label)}
                    </span>
                </div>

                <strong>
                    ${formatCurrency(item.value)}
                </strong>

                <div class="budget-progress-track">
                    <span
                        class="budget-progress-fill"
                        style="
                            width:${Math.min(
                                percentage,
                                100
                            )}%
                        "
                    ></span>
                </div>

                <small>
                    ${percentage}% of total budget
                </small>
            </article>
        `;
    }).join("");

    return`
        <div class="budget-overview">
            <article>
                <span>Total Budget</span>
                <strong>
                    ${formatCurrency(totalBudget)}
                </strong>
            </article>

            <article>
                <span>Allocated</span>
                <strong>
                    ${formatCurrency(allocatedAmount)}
                </strong>
            </article>

            <article>
                <span>Remaining</span>
                <strong>
                    ${formatCurrency(remainingAmount)}
                </strong>
            </article>
        </div>

        <div class="saved-budget-grid">
            ${cards}
        </div>
    `;
}

function createItineraryCards(
    itinerary=[]
){
    if(
        !Array.isArray(itinerary)||
        itinerary.length===0
    ){
        return`
            <p class="empty-trip-content">
                No itinerary is available.
            </p>
        `;
    }

    return itinerary.map((day,index)=>{
        return`
            <article class="saved-day-card">
                <div class="saved-day-number">
                    Day ${
                        Number(day.day)||
                        index+1
                    }
                </div>

                <div class="saved-day-content">
                    <h3>
                        ${
                            escapeHTML(
                                day.title||
                                "Trip Activities"
                            )
                        }
                    </h3>

                    <div class="saved-day-schedule">
                        <p>
                            <strong>
                                Morning:
                            </strong>

                            ${
                                escapeHTML(
                                    day.morning||
                                    "No morning activity."
                                )
                            }
                        </p>

                        <p>
                            <strong>
                                Afternoon:
                            </strong>

                            ${
                                escapeHTML(
                                    day.afternoon||
                                    "No afternoon activity."
                                )
                            }
                        </p>

                        <p>
                            <strong>
                                Evening:
                            </strong>

                            ${
                                escapeHTML(
                                    day.evening||
                                    "No evening activity."
                                )
                            }
                        </p>
                    </div>
                </div>
            </article>
        `;
    }).join("");
}

function renderTripDetails(trip){
    const destination=
        trip.destination||{};

    const imagePath=getImagePath(
        destination.image
    );

    const destinationLocation=[
        destination.city,
        destination.state
    ]
        .filter(Boolean)
        .map(escapeHTML)
        .join(", ");

    const interestsHTML=
        Array.isArray(trip.interests)&&
        trip.interests.length
            ?trip.interests
                .map((interest)=>{
                    return`
                        <span>
                            ${escapeHTML(interest)}
                        </span>
                    `;
                })
                .join("")
            :`
                <p>
                    No interests selected.
                </p>
            `;

    detailsContainer.innerHTML=`
        <section
            class="saved-trip-hero"
            style="
                background-image:
                    linear-gradient(
                        rgba(6,30,52,0.64),
                        rgba(6,30,52,0.80)
                    ),
                    url('${imagePath}');
            "
        >
            <div class="saved-trip-hero-content">
                <div>
                    <p>
                        YOUR SAVED JOURNEY
                    </p>

                    <h1>
                        ${
                            escapeHTML(
                                trip.destinationName||
                                "Your Trip"
                            )
                        }
                    </h1>

                    <span>
                        ${
                            destinationLocation||
                            "Destination details"
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
                    ${Number(trip.days)||1} days
                </strong>
            </article>

            <article>
                <span>Travelers</span>

                <strong>
                    ${Number(trip.travelers)||1}
                </strong>
            </article>

            <article>
                <span>Total Budget</span>

                <strong>
                    ${
                        formatCurrency(
                            trip.totalBudget
                        )
                    }
                </strong>
            </article>

            <article>
                <span>Travel Style</span>

                <strong>
                    ${
                        escapeHTML(
                            trip.travelStyle||
                            "Flexible"
                        )
                    }
                </strong>
            </article>
        </section>

        <section class="saved-trip-content">

            <div class="saved-trip-main">

                <section
                    class="saved-trip-section"
                    id="budget-section"
                >
                    <p class="saved-trip-label">
                        BUDGET DASHBOARD
                    </p>

                    <h2>
                        Estimated trip expenses
                    </h2>

                    ${
                        createBudgetCards(
                            trip.budgetBreakdown||{},
                            trip.totalBudget
                        )
                    }
                </section>

                <section class="saved-trip-section">
                    <p class="saved-trip-label">
                        DAY-WISE ITINERARY
                    </p>

                    <h2>
                        Your travel schedule
                    </h2>

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
                    <h3>
                        Interests
                    </h3>

                    <div class="saved-interest-list">
                        ${interestsHTML}
                    </div>
                </section>

                <section class="saved-sidebar-card">
                    <h3>
                        Trip Status
                    </h3>

                    <span class="saved-trip-status">
                        ${
                            escapeHTML(
                                trip.status||
                                "planned"
                            )
                        }
                    </span>
                </section>

                <section class="saved-sidebar-card">
                    <h3>
                        Plan Another Trip
                    </h3>

                    <p>
                        Generate another personalized
                        itinerary using your preferred
                        destination and budget.
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

function describeWeatherCode(code){
    const descriptions={
        0:"Clear sky",
        1:"Mainly clear",
        2:"Partly cloudy",
        3:"Overcast",
        45:"Foggy",
        48:"Rime fog",
        51:"Light drizzle",
        53:"Drizzle",
        55:"Heavy drizzle",
        56:"Freezing drizzle",
        57:"Heavy freezing drizzle",
        61:"Light rain",
        63:"Moderate rain",
        65:"Heavy rain",
        66:"Freezing rain",
        67:"Heavy freezing rain",
        71:"Light snowfall",
        73:"Moderate snowfall",
        75:"Heavy snowfall",
        77:"Snow grains",
        80:"Light rain showers",
        81:"Moderate rain showers",
        82:"Heavy rain showers",
        85:"Snow showers",
        86:"Heavy snow showers",
        95:"Thunderstorm",
        96:"Thunderstorm with hail",
        99:"Severe thunderstorm"
    };

    return descriptions[code]||
        "Variable weather";
}

function weatherIcon(code){
    if(code===0){
        return"☀️";
    }

    if([1,2].includes(code)){
        return"🌤️";
    }

    if(code===3){
        return"☁️";
    }

    if([45,48].includes(code)){
        return"🌫️";
    }

    if(code>=51&&code<=67){
        return"🌧️";
    }

    if(code>=71&&code<=77){
        return"❄️";
    }

    if(code>=80&&code<=82){
        return"🌦️";
    }

    if(code>=85&&code<=86){
        return"🌨️";
    }

    if(code>=95){
        return"⛈️";
    }

    return"🌤️";
}

function formatWeatherDay(dateValue){
    const date=new Date(
        `${dateValue}T12:00:00`
    );

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            weekday:"short",
            day:"2-digit",
            month:"short"
        }
    ).format(date);
}

function renderWeatherForecast(
    locationName,
    weather
){
    if(
        !weatherContainer||
        !weather?.daily
    ){
        return;
    }

    const daily=weather.daily;

    const cards=daily.time
        .map((date,index)=>{
            const weatherCode=
                daily.weather_code[index];

            const maximumTemperature=
                Math.round(
                    daily
                        .temperature_2m_max[
                            index
                        ]
                );

            const minimumTemperature=
                Math.round(
                    daily
                        .temperature_2m_min[
                            index
                        ]
                );

            const rainProbability=
                daily
                    .precipitation_probability_max[
                        index
                    ]??0;

            const maximumWindSpeed=
                Math.round(
                    daily
                        .wind_speed_10m_max[
                            index
                        ]||0
                );

            return`
                <article class="weather-card">
                    <span class="weather-date">
                        ${formatWeatherDay(date)}
                    </span>

                    <span class="weather-icon">
                        ${
                            weatherIcon(
                                weatherCode
                            )
                        }
                    </span>

                    <strong>
                        ${maximumTemperature}°C
                    </strong>

                    <small>
                        Minimum:
                        ${minimumTemperature}°C
                    </small>

                    <p>
                        ${
                            describeWeatherCode(
                                weatherCode
                            )
                        }
                    </p>

                    <div class="weather-card-details">
                        <span>
                            Rain:
                            ${rainProbability}%
                        </span>

                        <span>
                            Wind:
                            ${maximumWindSpeed} km/h
                        </span>
                    </div>
                </article>
            `;
        })
        .join("");

    if(weatherTitle){
        weatherTitle.textContent=
            `Weather Forecast for ${locationName}`;
    }

    weatherContainer.innerHTML=cards;

    weatherLoading.style.display="none";
    weatherError.style.display="none";

    weatherContainer.style.display="grid";
}

async function fetchWithTimeout(
    url,
    options={},
    timeout=20000
){
    const controller=
        new AbortController();

    const timeoutId=setTimeout(()=>{
        controller.abort();
    },timeout);

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

async function loadWeatherForTrip(trip){
    if(
        !weatherSection||
        !weatherContainer
    ){
        return;
    }

    weatherLoading.style.display="block";
    weatherError.style.display="none";
    weatherContainer.style.display="none";

    try{
        const destination=
            trip.destination||{};

        const query=
            destination.city||
            trip.destinationName;

        if(!query){
            throw new Error(
                "Destination name is unavailable."
            );
        }

        const geocodeResponse=
            await fetchWithTimeout(
                `https://geocoding-api.open-meteo.com/v1/search?name=${
                    encodeURIComponent(query)
                }&count=1&language=en&format=json`
            );

        const geocode=
            await geocodeResponse.json();

        const place=
            geocode.results?.[0];

        if(
            !geocodeResponse.ok||
            !place
        ){
            throw new Error(
                "Weather location could not be found."
            );
        }

        const forecastURL=
            "https://api.open-meteo.com/v1/forecast"+
            `?latitude=${place.latitude}`+
            `&longitude=${place.longitude}`+
            "&daily="+
            [
                "weather_code",
                "temperature_2m_max",
                "temperature_2m_min",
                "precipitation_probability_max",
                "wind_speed_10m_max"
            ].join(",")+
            "&timezone=auto"+
            "&forecast_days=5";

        const weatherResponse=
            await fetchWithTimeout(
                forecastURL
            );

        const weather=
            await weatherResponse.json();

        if(
            !weatherResponse.ok||
            !weather.daily
        ){
            throw new Error(
                "Weather forecast is unavailable."
            );
        }

        const locationName=[
            place.name,
            place.admin1
        ]
            .filter(Boolean)
            .join(", ");

        renderWeatherForecast(
            locationName,
            weather
        );

        weatherLoaded=true;
    }catch(error){
        console.error(
            "Weather loading error:",
            error
        );

        weatherLoading.style.display="none";
        weatherContainer.style.display="none";

        weatherError.style.display="block";

        weatherError.textContent=
            error.name==="AbortError"
                ?"Weather service took too long to respond."
                :error.message||
                    "Weather information is unavailable.";
    }
}

function scrollToSection(sectionId){
    const section=document.getElementById(
        sectionId
    );

    if(!section){
        return;
    }

    const navbar=
        document.querySelector(
            ".navbar"
        );

    const actionBar=
        document.querySelector(
            ".trip-action-bar"
        );

    const offset=
        (navbar?.offsetHeight||0)+
        (actionBar?.offsetHeight||0)+
        20;

    const top=
        section.getBoundingClientRect().top+
        window.scrollY-
        offset;

    window.scrollTo({
        top,
        behavior:"smooth"
    });
}

async function loadTripDetails(){
    try{
        const parameters=
            new URLSearchParams(
                window.location.search
            );

        const tripId=
            parameters.get("id");

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
            window.location.href=
                "./login.html";

            return;
        }

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to load trip details."
            );
        }

        loadedTrip=result.data.tripPlan;

        renderTripDetails(
            loadedTrip
        );

        renderNearbyPlaces(
    loadedTrip
);

        if(loadingElement){
            loadingElement.style.display=
                "none";
        }

        if(downloadPdfButton){
            downloadPdfButton.disabled=
                false;
        }

        if(smsTripButton){
            smsTripButton.disabled=false;
        }
    }catch(error){
        if(loadingElement){
            loadingElement.style.display=
                "none";
        }

        if(errorElement){
            errorElement.style.display=
                "block";

            errorElement.textContent=
                error.message;
        }

        console.error(
            "Trip details loading error:",
            error
        );
    }
}

logoutButton?.addEventListener(
    "click",
    async()=>{
        try{
            await fetch(
                `${API_BASE_URL}/auth/logout`,
                {
                    method:"POST",
                    credentials:"include",
                    headers:getAuthHeaders()
                }
            );
        }catch(error){
            console.error(
                "Logout error:",
                error
            );
        }finally{
            localStorage.removeItem(
                "tripfusion_user"
            );

            localStorage.removeItem(
                "tripfusion_token"
            );

            window.location.href=
                "./login.html";
        }
    }
);

downloadPdfButton?.addEventListener(
    "click",
    async()=>{
        if(!loadedTrip){
            alert(
                "Please wait until the trip details are loaded."
            );

            return;
        }

        if(typeof html2pdf==="undefined"){
            alert(
                "The PDF library could not be loaded. Check your internet connection and refresh the page."
            );

            return;
        }

        const element=
            document.getElementById(
                "trip-details-container"
            );

        if(!element){
            alert(
                "Trip content could not be found."
            );

            return;
        }

        const originalText=
            downloadPdfButton.textContent;

        downloadPdfButton.disabled=true;

        downloadPdfButton.textContent=
            "Preparing PDF...";

        try{
            const safeDestinationName=
                String(
                    loadedTrip
                        .destinationName||
                    "Trip"
                )
                    .replace(
                        /[<>:"/\\|?*]+/g,
                        ""
                    )
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
                    windowWidth:
                        element.scrollWidth
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
            console.error(
                "PDF generation error:",
                error
            );

            alert(
                "Unable to create the PDF. Open the browser console for more details."
            );
        }finally{
            downloadPdfButton.disabled=
                false;

            downloadPdfButton.textContent=
                originalText;
        }
    }
);

weatherButton?.addEventListener(
    "click",
    async()=>{
        if(!loadedTrip){
            showNotification(
                "Please wait until the trip details are loaded.",
                "error"
            );

            return;
        }

        if(weatherSection){
            weatherSection.style.display=
                "block";
        }

        scrollToSection(
            "weather-section"
        );

        if(!weatherLoaded){
            await loadWeatherForTrip(
                loadedTrip
            );
        }
    }
);

closeWeatherButton?.addEventListener(
    "click",
    ()=>{
        if(weatherSection){
            weatherSection.style.display=
                "none";
        }

        weatherButton?.focus();
    }
);

budgetButton?.addEventListener(
    "click",
    ()=>{
        if(!loadedTrip){
            showNotification(
                "Please wait until the trip details are loaded.",
                "error"
            );

            return;
        }

        scrollToSection(
            "budget-section"
        );
    }
);

packingButton?.addEventListener(
    "click",
    ()=>{
        if(!currentTripId){
            showNotification(
                "Please wait until the trip details are loaded.",
                "error"
            );

            return;
        }

        if(packingSection){
            packingSection.style.display=
                "block";
        }

        loadPackingItems();
        renderPackingChecklist();

        scrollToSection(
            "packing-section"
        );
    }
);

closePackingButton?.addEventListener(
    "click",
    ()=>{
        if(packingSection){
            packingSection.style.display=
                "none";
        }

        packingButton?.focus();
    }
);

addPackingItemButton?.addEventListener(
    "click",
    addCustomPackingItem
);

packingItemInput?.addEventListener(
    "keydown",
    (event)=>{
        if(event.key==="Enter"){
            event.preventDefault();
            addCustomPackingItem();
        }
    }
);

resetPackingButton?.addEventListener(
    "click",
    resetPackingChecklist
);

packingChecklistContainer?.addEventListener(
    "change",
    (event)=>{
        const checkbox=
            event.target.closest(
                ".packing-item-checkbox"
            );

        if(!checkbox){
            return;
        }

        togglePackingItem(
            checkbox.dataset.itemId
        );
    }
);

packingChecklistContainer?.addEventListener(
    "click",
    (event)=>{
        const deleteButton=
            event.target.closest(
                ".packing-delete-button"
            );

        if(!deleteButton){
            return;
        }

        removeCustomPackingItem(
            deleteButton.dataset.deleteItemId
        );
    }
);

document.addEventListener(
    "DOMContentLoaded",
    loadTripDetails
);