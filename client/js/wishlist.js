const wishlistContainer=document.getElementById(
    "wishlist-container"
);

const wishlistLoading=document.getElementById(
    "wishlist-loading"
);

const wishlistEmpty=document.getElementById(
    "wishlist-empty"
);

const wishlistCount=document.getElementById(
    "wishlist-count"
);

const logoutButton=document.getElementById(
    "logout-button"
);

const fallbackImage=
    "./assets/images/destinations/goa.jpg";

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

function formatCurrency(value){
    return new Intl.NumberFormat("en-IN",{
        style:"currency",
        currency:"INR",
        maximumFractionDigits:0
    }).format(Number(value)||0);
}

function escapeHTML(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
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

function createWishlistCard(destination){
    const imagePath=getImagePath(
        destination.image
    );

    const name=escapeHTML(destination.name);
    const city=escapeHTML(destination.city);
    const state=escapeHTML(destination.state);
    const category=escapeHTML(
        destination.category||"Travel"
    );
    const duration=escapeHTML(
        destination.duration||"Flexible"
    );
    const description=escapeHTML(
        destination.shortDescription||
        "Discover this beautiful destination with TripFusion."
    );

    const rating=Number(
        destination.rating||0
    ).toFixed(1);

    const reviewsCount=Number(
        destination.reviewsCount||0
    );

    return`
        <article
            class="wishlist-destination-card"
            data-card-id="${destination._id}"
        >

            <div class="wishlist-card-image-wrapper">

                <img
                    src="${imagePath}"
                    alt="${name}"
                    class="wishlist-card-image"
                    loading="lazy"
                    decoding="async"
                    onerror="
                        this.onerror=null;
                        this.src='${fallbackImage}';
                    "
                >

                <div class="wishlist-card-overlay"></div>

                <button
                    type="button"
                    class="wishlist-remove-button"
                    data-id="${destination._id}"
                    aria-label="Remove ${name} from wishlist"
                    title="Remove from wishlist"
                >
                    <span>♥</span>
                </button>

                <div class="wishlist-card-badges">

                    ${
                        destination.featured
                            ?`
                                <span class="wishlist-featured-badge">
                                    Featured
                                </span>
                            `
                            :""
                    }

                    ${
                        destination.popular
                            ?`
                                <span class="wishlist-popular-badge">
                                    Popular
                                </span>
                            `
                            :""
                    }

                </div>

                <div class="wishlist-image-location">
                    <span>📍</span>

                    <p>
                        ${city}${state?`, ${state}`:""}
                    </p>
                </div>

            </div>

            <div class="wishlist-card-content">

                <div class="wishlist-card-heading">

                    <div>
                        <p class="wishlist-card-category">
                            ${category}
                        </p>

                        <h3>${name}</h3>
                    </div>

                    <div class="wishlist-rating-box">
                        <strong>${rating}</strong>
                        <span>★</span>
                    </div>

                </div>

                <p class="wishlist-card-description">
                    ${description}
                </p>

                <div class="wishlist-card-meta">

                    <span>
                        <strong>Category</strong>
                        ${category}
                    </span>

                    <span>
                        <strong>Duration</strong>
                        ${duration}
                    </span>

                    <span>
                        <strong>Reviews</strong>
                        ${reviewsCount}
                    </span>

                </div>

                <div class="wishlist-card-footer">

                    <div class="wishlist-card-price">
                        <small>Starting from</small>

                        <strong>
                            ${formatCurrency(
                                destination.startingPrice
                            )}
                        </strong>

                        <span>per trip</span>
                    </div>

                    <a
                        href="./destination-details.html?id=${
                            encodeURIComponent(destination._id)
                        }"
                        class="wishlist-view-button"
                    >
                        View Details
                        <span>→</span>
                    </a>

                </div>

            </div>

        </article>
    `;
}

function showLoadingState(){
    wishlistLoading.style.display="flex";
    wishlistEmpty.style.display="none";
    wishlistContainer.innerHTML="";

    wishlistCount.textContent=
        "Loading your saved destinations...";
}

function showEmptyState(){
    wishlistLoading.style.display="none";
    wishlistEmpty.style.display="block";
    wishlistContainer.innerHTML="";

    wishlistCount.textContent=
        "0 saved destinations";
}

function showErrorState(message){
    wishlistLoading.style.display="flex";

    wishlistLoading.innerHTML=`
        <div class="wishlist-error-state">
            <strong>Unable to load wishlist</strong>

            <p>${escapeHTML(message)}</p>

            <button
                type="button"
                id="retry-wishlist-button"
                class="primary-button"
            >
                Try Again
            </button>
        </div>
    `;

    const retryButton=document.getElementById(
        "retry-wishlist-button"
    );

    retryButton?.addEventListener(
        "click",
        loadWishlist
    );
}

async function loadWishlist(){
    showLoadingState();

    try{
        const response=await fetch(
            `${API_BASE_URL}/wishlist`,
            {
                method:"GET",
                credentials:"include",
                headers:getAuthHeaders()
            }
        );

        const result=await response.json();

        if(response.status===401){
            sessionStorage.setItem(
                "tripfusion_redirect_after_login",
                window.location.href
            );

            window.location.href="./login.html";
            return;
        }

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to load wishlist"
            );
        }

        const destinations=
            result.data?.wishlist?.destinations||[];

        wishlistLoading.style.display="none";

        wishlistCount.textContent=
            `${destinations.length} saved ${
                destinations.length===1
                    ?"destination"
                    :"destinations"
            }`;

        if(destinations.length===0){
            showEmptyState();
            return;
        }

        wishlistEmpty.style.display="none";

        wishlistContainer.innerHTML=
            destinations
                .map(createWishlistCard)
                .join("");

        attachRemoveEvents();
    }catch(error){
        console.error(
            "Wishlist loading error:",
            error
        );

        showErrorState(
            error.message||
            "Something went wrong while loading your wishlist."
        );
    }
}

function attachRemoveEvents(){
    document
        .querySelectorAll(".wishlist-remove-button")
        .forEach((button)=>{
            button.addEventListener(
                "click",
                ()=>{
                    removeDestination(
                        button.dataset.id,
                        button
                    );
                }
            );
        });
}

async function removeDestination(
    destinationId,
    button
){
    const confirmed=window.confirm(
        "Remove this destination from your wishlist?"
    );

    if(!confirmed){
        return;
    }

    button.disabled=true;
    button.classList.add("removing");

    try{
        const response=await fetch(
            `${API_BASE_URL}/wishlist/${
                encodeURIComponent(destinationId)
            }`,
            {
                method:"DELETE",
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
                "Unable to remove destination"
            );
        }

        const card=document.querySelector(
            `[data-card-id="${destinationId}"]`
        );

        if(card){
            card.classList.add(
                "wishlist-card-removing"
            );

            setTimeout(()=>{
                card.remove();

                const remainingCards=
                    wishlistContainer.querySelectorAll(
                        ".wishlist-destination-card"
                    ).length;

                wishlistCount.textContent=
                    `${remainingCards} saved ${
                        remainingCards===1
                            ?"destination"
                            :"destinations"
                    }`;

                if(remainingCards===0){
                    showEmptyState();
                }
            },280);
        }
    }catch(error){
        button.disabled=false;
        button.classList.remove("removing");

        alert(error.message);
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
        }finally{
            localStorage.removeItem(
                "tripfusion_user"
            );

            localStorage.removeItem(
                "tripfusion_token"
            );

            window.location.href="./login.html";
        }
    }
);

document.addEventListener(
    "DOMContentLoaded",
    loadWishlist
);