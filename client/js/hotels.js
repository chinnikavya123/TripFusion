const hotelList=document.getElementById(
    "hotel-list"
);

const destinationInput=document.getElementById(
    "destination-input"
);

const sortSelect=document.getElementById(
    "sort-select"
);

const searchHotelsButton=document.getElementById(
    "search-hotels-button"
);

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

function escapeHTML(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

function getDestinationFromURL(){
    const parameters=
        new URLSearchParams(
            window.location.search
        );

    return(
        parameters.get("destination")||
        ""
    );
}

function createGoogleMapsURL(hotel){
    const query=[
        hotel.name,
        hotel.location,
        hotel.destination
    ]
        .filter(Boolean)
        .join(", ");

    return(
        "https://www.google.com/maps/search/?api=1&query="+
        encodeURIComponent(query)
    );
}

function renderHotels(hotels){
    if(!hotelList){
        return;
    }

    if(
        !Array.isArray(hotels)||
        hotels.length===0
    ){
        hotelList.innerHTML=`
            <div class="hotel-message">
                No hotel recommendations were found for this destination.
            </div>
        `;

        return;
    }

    hotelList.innerHTML=
        hotels.map((hotel)=>{
            const amenities=
                Array.isArray(
                    hotel.amenities
                )
                    ?hotel.amenities
                    :[];

            const amenitiesHTML=
                amenities
                    .slice(0,5)
                    .map((amenity)=>{
                        return`
                            <span class="hotel-amenity">
                                ${escapeHTML(amenity)}
                            </span>
                        `;
                    })
                    .join("");

            const mapURL=
                createGoogleMapsURL(
                    hotel
                );

            const bookingURL=
                "./hotel-booking.html?hotelId="+
                encodeURIComponent(
                    hotel.id
                );

            return`
                <article class="hotel-card">

                    <div class="hotel-image-wrapper">

                        <img
                            src="${escapeHTML(hotel.image)}"
                            alt="${escapeHTML(hotel.name)}"
                            loading="lazy"
                        >

                        <span class="hotel-demo-badge">
                            Demo Listing
                        </span>

                        <span class="hotel-rating">
                            ⭐ ${Number(
                                hotel.rating||0
                            ).toFixed(1)}

                            <small>
                                (${Number(
                                    hotel.reviewsCount||0
                                )})
                            </small>
                        </span>

                    </div>

                    <div class="hotel-card-body">

                        <span class="hotel-location">
                            📍 ${escapeHTML(
                                hotel.location
                            )},
                            ${escapeHTML(
                                hotel.destination
                            )}
                        </span>

                        <h2>
                            ${escapeHTML(hotel.name)}
                        </h2>

                        <p class="hotel-description">
                            ${escapeHTML(
                                hotel.description||
                                "A comfortable hotel stay near your selected destination."
                            )}
                        </p>

                        <div class="hotel-amenities">
                            ${amenitiesHTML}
                        </div>

                        <div class="hotel-price-row">

                            <div class="hotel-price">
                                <small>
                                    Starting from
                                </small>

                                <strong>
                                    ${formatCurrency(
                                        hotel.price
                                    )}
                                </strong>

                                <span>
                                    per night
                                </span>
                            </div>

                            <span>
                                ${
                                    hotel.available
                                        ?"Available"
                                        :"Unavailable"
                                }
                            </span>

                        </div>

                        <div class="hotel-actions">

                            <a
                                href="${mapURL}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="hotel-view-button"
                            >
                                View on Maps
                            </a>

                            <a
                                href="${bookingURL}"
                                class="hotel-book-button"
                            >
                                Book Now
                            </a>

                        </div>

                    </div>

                </article>
            `;
        }).join("");
}

async function loadHotels(){
    if(!hotelList){
        return;
    }

    hotelList.innerHTML=`
        <div class="hotel-message hotel-loading">
            Loading hotel recommendations...
        </div>
    `;

    const destination=
        destinationInput
            ?.value
            .trim()||
        "";

    const sort=
        sortSelect
            ?.value||
        "";

    const query=
        new URLSearchParams();

    if(destination){
        query.set(
            "destination",
            destination
        );
    }

    if(sort){
        query.set(
            "sort",
            sort
        );
    }

    try{
        const response=await fetch(
            `${API_BASE_URL}/hotels?${
                query.toString()
            }`,
            {
                method:"GET",
                headers:{
                    "Accept":
                        "application/json"
                }
            }
        );

        const result=
            await response.json();

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to load hotel recommendations."
            );
        }

        renderHotels(
            result.data.hotels
        );
    }catch(error){
        console.error(
            "Hotel loading error:",
            error
        );

        hotelList.innerHTML=`
            <div class="hotel-message hotel-error">
                ${
                    escapeHTML(
                        error.message||
                        "Unable to load hotel recommendations."
                    )
                }
            </div>
        `;
    }
}

searchHotelsButton?.addEventListener(
    "click",
    loadHotels
);

sortSelect?.addEventListener(
    "change",
    loadHotels
);

destinationInput?.addEventListener(
    "keydown",
    (event)=>{
        if(event.key==="Enter"){
            event.preventDefault();
            loadHotels();
        }
    }
);

document.addEventListener(
    "DOMContentLoaded",
    ()=>{
        const destination=
            getDestinationFromURL();

        if(
            destination&&
            destinationInput
        ){
            destinationInput.value=
                destination;
        }

        loadHotels();
    }
);