const detailsContainer=document.getElementById(
    "destination-details-container"
);

const loadingElement=document.getElementById(
    "details-loading"
);

const errorElement=document.getElementById(
    "details-error"
);

const fallbackImage=
    "./assets/images/destinations/goa.jpg";

function escapeHTML(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

function formatCurrency(value){
    return new Intl.NumberFormat("en-IN",{
        style:"currency",
        currency:"INR",
        maximumFractionDigits:0
    }).format(Number(value)||0);
}

function getImagePath(image){
    if(!image){
        return fallbackImage;
    }

    if(
        image.startsWith("http://")||
        image.startsWith("https://")||
        image.startsWith("data:")
    ){
        return image;
    }

    if(image.startsWith("./")){
        return image;
    }

    if(image.startsWith("assets/")){
        return `./${image}`;
    }

    return image;
}

function createList(items,emptyText){
    if(!Array.isArray(items)||items.length===0){
        return`
            <p class="details-empty-text">
                ${escapeHTML(emptyText)}
            </p>
        `;
    }

    return`
        <ul class="details-list">
            ${items.map((item)=>{
                return`
                    <li>${escapeHTML(item)}</li>
                `;
            }).join("")}
        </ul>
    `;
}

function createActivities(activities){
    if(!Array.isArray(activities)||activities.length===0){
        return`
            <p class="details-empty-text">
                No activities added yet.
            </p>
        `;
    }

    return`
        <div class="activities-grid">
            ${activities.map((activity)=>{
                return`
                    <article class="activity-card">
                        <h3>
                            ${escapeHTML(activity.name)}
                        </h3>

                        <p>
                            ${escapeHTML(activity.description)}
                        </p>

                        <div class="activity-meta">
                            <span>
                                ${
                                    escapeHTML(
                                        activity.duration||
                                        "Flexible"
                                    )
                                }
                            </span>

                            <strong>
                                ${
                                    formatCurrency(
                                        activity.estimatedCost
                                    )
                                }
                            </strong>
                        </div>
                    </article>
                `;
            }).join("")}
        </div>
    `;
}

function createNearbyPlaces(nearbyPlaces){
    if(
        !Array.isArray(nearbyPlaces)||
        nearbyPlaces.length===0
    ){
        return`
            <p class="details-empty-text">
                No nearby places added yet.
            </p>
        `;
    }

    return`
        <div class="nearby-grid">
            ${nearbyPlaces.map((place)=>{
                return`
                    <article class="nearby-card">
                        <div>
                            <h3>
                                ${escapeHTML(place.name)}
                            </h3>

                            <span>
                                ${escapeHTML(place.distance)}
                            </span>
                        </div>

                        <p>
                            ${escapeHTML(place.description)}
                        </p>
                    </article>
                `;
            }).join("")}
        </div>
    `;
}

function createGoogleMapsSearchURL(query){
    return`https://www.google.com/maps/search/?api=1&query=${
        encodeURIComponent(query)
    }`;
}

function createGoogleMapsDirectionsURL(destination){
    return`https://www.google.com/maps/dir/?api=1&destination=${
        encodeURIComponent(destination)
    }&travelmode=driving`;
}

function createNearbySearchCards(
    items,
    destinationName
){
    return`
        <div class="nearby-search-grid">
            ${items.map((item)=>{
                return`
                    <a
                        href="${
                            createGoogleMapsSearchURL(
                                item.query
                            )
                        }"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="nearby-search-card"
                    >
                        <span class="nearby-search-icon">
                            ${item.icon}
                        </span>

                        <span class="nearby-search-content">
                            <strong>
                                ${escapeHTML(item.label)}
                            </strong>

                            <small>
                                Search near ${
                                    escapeHTML(
                                        destinationName
                                    )
                                }
                            </small>
                        </span>

                        <span class="nearby-search-arrow">
                            →
                        </span>
                    </a>
                `;
            }).join("")}
        </div>
    `;
}

function renderDestination(destination){
    const mainImage=getImagePath(
        destination.image
    );

    const galleryImages=[
        mainImage,
        ...(Array.isArray(destination.gallery)
            ?destination.gallery.map(getImagePath)
            :[])
    ].filter((image,index,array)=>{
        return image&&array.indexOf(image)===index;
    });

    const destinationLocation=[
        destination.name,
        destination.city,
        destination.state,
        destination.country
    ]
        .filter(Boolean)
        .join(", ");

    const latitude=Number(destination.latitude);
    const longitude=Number(destination.longitude);

    const hasCoordinates=
        Number.isFinite(latitude)&&
        Number.isFinite(longitude)&&
        latitude>=-90&&
        latitude<=90&&
        longitude>=-180&&
        longitude<=180;

    const mapQuery=hasCoordinates
        ?`${latitude},${longitude}`
        :destinationLocation;

    const encodedMapQuery=encodeURIComponent(
        mapQuery
    );

    const googleMapsPlaceURL=
        createGoogleMapsSearchURL(mapQuery);

    const googleMapsDirectionsURL=
        createGoogleMapsDirectionsURL(mapQuery);

    const embeddedMapURL=
        `https://maps.google.com/maps?q=${
            encodedMapQuery
        }&z=13&output=embed`;

    const nearbySearches=[
        {
            label:"Nearby Hotels",
            icon:"🏨",
            query:`hotels near ${destinationLocation}`
        },
        {
            label:"Restaurants",
            icon:"🍽️",
            query:
                `restaurants near ${destinationLocation}`
        },
        {
            label:"Hospitals",
            icon:"🏥",
            query:`hospitals near ${destinationLocation}`
        },
        {
            label:"ATMs",
            icon:"🏧",
            query:`ATMs near ${destinationLocation}`
        },
        {
            label:"Petrol Pumps",
            icon:"⛽",
            query:
                `petrol pumps near ${destinationLocation}`
        },
        {
            label:"Railway Stations",
            icon:"🚉",
            query:
                `railway stations near ${
                    destinationLocation
                }`
        },
        {
            label:"Bus Stations",
            icon:"🚌",
            query:
                `bus stations near ${destinationLocation}`
        },
        {
            label:"Airports",
            icon:"✈️",
            query:`airports near ${destinationLocation}`
        }
    ];

    detailsContainer.innerHTML=`
        <section
            class="destination-details-hero"
            style="
                background-image:
                linear-gradient(
                    rgba(5,28,48,0.60),
                    rgba(5,28,48,0.72)
                ),
                url('${mainImage}');
            "
        >
            <div class="destination-details-overlay">

                <a
                    href="./destinations.html"
                    class="back-link"
                >
                    ← Back to destinations
                </a>

                <div class="details-hero-content">

                    <div>
                        <p class="details-category">
                            ${
                                escapeHTML(
                                    destination.category
                                )
                            }
                        </p>

                        <h1>
                            ${
                                escapeHTML(
                                    destination.name
                                )
                            }
                        </h1>

                        <p class="details-location">
                            ${
                                escapeHTML(
                                    destination.city
                                )
                            }, ${
                                escapeHTML(
                                    destination.state
                                )
                            }, ${
                                escapeHTML(
                                    destination.country
                                )
                            }
                        </p>
                    </div>

                    <div class="details-rating-card">
                        <strong>
                            ${
                                Number(
                                    destination.rating||0
                                ).toFixed(1)
                            } ★
                        </strong>

                        <span>
                            ${
                                Number(
                                    destination.reviewsCount||0
                                )
                            } reviews
                        </span>
                    </div>

                </div>

            </div>
        </section>

        <section class="destination-summary-section">

            <div class="summary-card">
                <span>Starting Price</span>

                <strong>
                    ${
                        formatCurrency(
                            destination.startingPrice
                        )
                    }
                </strong>
            </div>

            <div class="summary-card">
                <span>Best Season</span>

                <strong>
                    ${
                        escapeHTML(
                            destination.bestSeason
                        )
                    }
                </strong>
            </div>

            <div class="summary-card">
                <span>Recommended Stay</span>

                <strong>
                    ${
                        escapeHTML(
                            destination.duration
                        )
                    }
                </strong>
            </div>

            <div class="summary-card">
                <span>Travel Category</span>

                <strong>
                    ${
                        escapeHTML(
                            destination.category
                        )
                    }
                </strong>
            </div>

        </section>

        <section class="destination-details-content">

            <div class="details-main-column">

                <section class="details-section">
                    <p class="details-section-label">
                        ABOUT THE DESTINATION
                    </p>

                    <h2>
                        Discover ${
                            escapeHTML(
                                destination.name
                            )
                        }
                    </h2>

                    <p class="details-description">
                        ${
                            escapeHTML(
                                destination.description
                            )
                        }
                    </p>
                </section>

                <section class="details-section">
                    <p class="details-section-label">
                        IMAGE GALLERY
                    </p>

                    <h2>Destination gallery</h2>

                    <div class="details-gallery">
                        ${galleryImages.map((image)=>{
                            return`
                                <img
                                    src="${image}"
                                    alt="${
                                        escapeHTML(
                                            destination.name
                                        )
                                    }"
                                    loading="lazy"
                                    onerror="
                                        this.onerror=null;
                                        this.src='${
                                            fallbackImage
                                        }';
                                    "
                                >
                            `;
                        }).join("")}
                    </div>
                </section>

                <section class="details-section">
                    <p class="details-section-label">
                        THINGS TO DO
                    </p>

                    <h2>Recommended activities</h2>

                    ${
                        createActivities(
                            destination.activities
                        )
                    }
                </section>

                <section class="details-section">
                    <p class="details-section-label">
                        NEARBY ATTRACTIONS
                    </p>

                    <h2>
                        Places around the destination
                    </h2>

                    ${
                        createNearbyPlaces(
                            destination.nearbyPlaces
                        )
                    }
                </section>

                <section
                    class="
                        details-section
                        destination-map-section
                    "
                >

                    <div class="map-section-heading">

                        <div>
                            <p class="details-section-label">
                                LOCATION AND DIRECTIONS
                            </p>

                            <h2>
                                Explore ${
                                    escapeHTML(
                                        destination.name
                                    )
                                } on the map
                            </h2>

                            <p class="map-section-description">
                                View the destination, get
                                directions and find useful
                                services nearby.
                            </p>
                        </div>

                        <div class="map-main-actions">

                            <a
                                href="${googleMapsPlaceURL}"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="map-primary-button"
                            >
                                Open in Google Maps
                            </a>

                            <a
                                href="${
                                    googleMapsDirectionsURL
                                }"
                                target="_blank"
                                rel="noopener noreferrer"
                                class="map-secondary-button"
                            >
                                Get Directions
                            </a>

                        </div>

                    </div>

                    <div class="map-frame-wrapper">
                        <iframe
                            class="destination-map-frame"
                            title="Map of ${
                                escapeHTML(
                                    destination.name
                                )
                            }"
                            src="${embeddedMapURL}"
                            loading="lazy"
                            allowfullscreen
                            referrerpolicy="
                                no-referrer-when-downgrade
                            "
                        ></iframe>
                    </div>

                    <div class="nearby-search-heading">
                        <p class="details-section-label">
                            USEFUL PLACES NEARBY
                        </p>

                        <h3>
                            Find services around the
                            destination
                        </h3>
                    </div>

                    ${
                        createNearbySearchCards(
                            nearbySearches,
                            destination.name
                        )
                    }

                </section>

            </div>

            <aside class="details-sidebar">

                <section class="sidebar-card">
                    <h3>Local food</h3>

                    ${
                        createList(
                            destination.localFood,
                            "No local food information added."
                        )
                    }
                </section>

                <section class="sidebar-card">
                    <h3>Languages</h3>

                    ${
                        createList(
                            destination.languages,
                            "No language information added."
                        )
                    }
                </section>

                <section class="sidebar-card">
                    <h3>Safety tips</h3>

                    ${
                        createList(
                            destination.safetyTips,
                            "No safety tips added."
                        )
                    }
                </section>

                <section class="sidebar-card">
                    <h3>Transportation</h3>

                    <p>
                        ${
                            escapeHTML(
                                destination
                                    .transportationInfo||
                                "Transportation information is not available."
                            )
                        }
                    </p>
                </section>

                <section
                    class="
                        sidebar-card
                        location-sidebar-card
                    "
                >
                    <h3>Destination location</h3>

                    <p>
                        ${
                            escapeHTML(
                                destinationLocation
                            )
                        }
                    </p>

                    ${
                        hasCoordinates
                            ?`
                                <div
                                    class="
                                        coordinates-display
                                    "
                                >
                                    <span>Latitude</span>

                                    <strong>
                                        ${
                                            latitude.toFixed(
                                                4
                                            )
                                        }
                                    </strong>
                                </div>

                                <div
                                    class="
                                        coordinates-display
                                    "
                                >
                                    <span>Longitude</span>

                                    <strong>
                                        ${
                                            longitude.toFixed(
                                                4
                                            )
                                        }
                                    </strong>
                                </div>
                            `
                            :`
                                <p
                                    class="
                                        location-coordinate-note
                                    "
                                >
                                    Exact coordinates are
                                    unavailable, so the map
                                    uses the destination name.
                                </p>
                            `
                    }

                    <a
                        href="${googleMapsDirectionsURL}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="sidebar-map-button"
                    >
                        Start Navigation
                    </a>
                </section>

                <section
                    class="
                        sidebar-card
                        trip-action-card
                    "
                >
                    <h3>Plan this trip</h3>

                    <p>
                        Create a personalized itinerary
                        based on your dates, budget and
                        interests.
                    </p>

                    <button
                        type="button"
                        class="primary-button"
                        id="plan-trip-button"
                    >
                        Plan My Trip
                    </button>
                </section>

            </aside>

        </section>
    `;

    const planTripButton=document.getElementById(
        "plan-trip-button"
    );

    planTripButton.addEventListener("click",()=>{
        sessionStorage.setItem(
            "tripfusion_selected_destination",
            JSON.stringify({
                id:destination._id,
                name:destination.name
            })
        );

        window.location.href=
            `./planner.html?destinationId=${
                encodeURIComponent(
                    destination._id
                )
            }`;
    });
}

async function loadDestinationDetails(){
    try{
        const parameters=new URLSearchParams(
            window.location.search
        );

        const destinationId=parameters.get("id");

        if(!destinationId){
            throw new Error(
                "Destination ID is missing from the URL."
            );
        }

        const response=await fetchTripFusionAPI(
            `${API_BASE_URL}/destinations/${
                encodeURIComponent(destinationId)
            }`,
            {},
            15000
        );

        const result=await response.json();

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to load destination details."
            );
        }

        loadingElement.style.display="none";
        errorElement.style.display="none";

        renderDestination(
            result.data.destination
        );
    }catch(error){
        loadingElement.style.display="none";

        errorElement.style.display="block";
        errorElement.textContent=
            error.name==="AbortError"
                ?"The server is taking longer than expected. Please refresh once."
                :error.message;

        console.error(
            "Destination details error:",
            error
        );
    }
}

document.addEventListener(
    "DOMContentLoaded",
    loadDestinationDetails
);