const destinationsContainer=document.getElementById(
    "destinations-container"
);

const searchInput=document.getElementById("search-input");
const categoryFilter=document.getElementById("category-filter");
const sortFilter=document.getElementById("sort-filter");
const resultsText=document.getElementById("results-text");
const loadingMessage=document.getElementById("loading-message");
const emptyMessage=document.getElementById("empty-message");
const paginationContainer=document.getElementById(
    "pagination-container"
);

let savedDestinationIds=new Set();

function getAuthHeaders(includeJSON=false){
    const token=localStorage.getItem(
        "tripfusion_token"
    );

    const headers={
        "Accept":"application/json"
    };

    if(includeJSON){
        headers["Content-Type"]="application/json";
    }

    if(token){
        headers.Authorization=`Bearer ${token}`;
    }

    return headers;
}

let currentPage=1;
const limit=12;

const fallbackImage=
    "./assets/images/destinations/goa.jpg";

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

function createDestinationCard(destination){
    const imagePath=getImagePath(destination.image);

    const name=escapeHTML(destination.name);
    const city=escapeHTML(destination.city);
    const state=escapeHTML(destination.state);
    const category=escapeHTML(destination.category);
    const duration=escapeHTML(destination.duration);
    const description=escapeHTML(
        destination.shortDescription
    );

    return`
        <article class="destination-card">
            <div class="destination-image-wrapper">
                <img
                    src="${imagePath}"
                    alt="${name}"
                    class="destination-image"
                    loading="lazy"
                    decoding="async"
                    onerror="
                        this.onerror=null;
                        this.src='${fallbackImage}';
                    "
                >
                <button
    type="button"
    class="wishlist-toggle-button"
    data-destination-id="${destination._id}"
    aria-label="Save ${destination.name} to wishlist"
    title="Save to wishlist"
>
    <span class="wishlist-heart-icon">♡</span>
</button>

                ${
                    destination.featured
                        ?`
                            <span class="featured-badge">
                                Featured
                            </span>
                        `
                        :""
                }

                ${
                    destination.popular
                        ?`
                            <span class="popular-badge">
                                Popular
                            </span>
                        `
                        :""
                }
            </div>

            <div class="destination-card-content">
                <div class="destination-card-header">
                    <div>
                        <h3>${name}</h3>

                        <p class="destination-location">
                            ${city}, ${state}
                        </p>
                    </div>

                    <span class="destination-rating">
                        ${Number(destination.rating||0).toFixed(1)} ★
                    </span>
                </div>

                <p class="destination-description">
                    ${description}
                </p>

                <div class="destination-details-row">
                    <span>${category}</span>
                    <span>${duration}</span>
                </div>

                <div class="destination-price-row">
                    <div>
                        <small>Starting from</small>

                        <strong>
                            ${formatCurrency(
                                destination.startingPrice
                            )}
                        </strong>
                    </div>

                    <a
                        href="./destination-details.html?id=${
                            encodeURIComponent(destination._id)
                        }"
                        class="view-details-button"
                    >
                        View Details
                    </a>
                </div>
            </div>
        </article>
    `;
}

function showLoadingState(){
    loadingMessage.style.display="block";
    emptyMessage.style.display="none";
    destinationsContainer.innerHTML="";
    paginationContainer.innerHTML="";
    resultsText.textContent="Loading destinations...";
}

function showErrorState(message){
    loadingMessage.style.display="none";
    emptyMessage.style.display="none";
    paginationContainer.innerHTML="";

    destinationsContainer.innerHTML=`
        <div class="error-message">
            ${escapeHTML(message)}
        </div>
    `;

    resultsText.textContent="Unable to load destinations";
}

async function loadWishlistIds(){
    const token=localStorage.getItem(
        "tripfusion_token"
    );

    if(!token){
        savedDestinationIds=new Set();
        return;
    }

    try{
        const response=await fetch(
            `${API_BASE_URL}/wishlist`,
            {
                credentials:"include",
                headers:getAuthHeaders()
            }
        );

        if(!response.ok){
            return;
        }

        const result=await response.json();

        const destinations=
            result.data?.wishlist?.destinations||[];

        savedDestinationIds=new Set(
            destinations.map((destination)=>{
                return destination._id;
            })
        );
    }catch(error){
        console.error(
            "Unable to load wishlist:",
            error
        );
    }
}

function updateWishlistButtons(){
    document
        .querySelectorAll(".wishlist-toggle-button")
        .forEach((button)=>{
            const destinationId=
                button.dataset.destinationId;

            const isSaved=
                savedDestinationIds.has(destinationId);

            const heartIcon=button.querySelector(
    ".wishlist-heart-icon"
);

if(heartIcon){
    heartIcon.textContent=isSaved?"♥":"♡";
}

            button.classList.toggle(
                "saved",
                isSaved
            );

            button.title=isSaved
                ?"Remove from wishlist"
                :"Save to wishlist";

            button.setAttribute(
                "aria-label",
                button.title
            );
        });
}

async function toggleWishlist(destinationId,button){
    const token=localStorage.getItem(
        "tripfusion_token"
    );

    if(!token){
        sessionStorage.setItem(
            "tripfusion_redirect_after_login",
            window.location.href
        );

        window.location.href="./login.html";
        return;
    }

    const isSaved=
        savedDestinationIds.has(destinationId);

    button.disabled=true;

    try{
        const response=await fetch(
            `${API_BASE_URL}/wishlist/${destinationId}`,
            {
                method:isSaved?"DELETE":"POST",
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
                "Unable to update wishlist"
            );
        }

        if(isSaved){
            savedDestinationIds.delete(
                destinationId
            );
        }else{
            savedDestinationIds.add(
                destinationId
            );
        }

        updateWishlistButtons();
    }catch(error){
        console.error(error);
        alert(error.message);
    }finally{
        button.disabled=false;
    }
}

function attachWishlistEvents(){
    document
        .querySelectorAll(".wishlist-toggle-button")
        .forEach((button)=>{
            button.addEventListener("click",(event)=>{
                event.preventDefault();
                event.stopPropagation();

                toggleWishlist(
                    button.dataset.destinationId,
                    button
                );
            });
        });
}

async function loadDestinations(){
    showLoadingState();

    try{
        const search=searchInput.value.trim();
        const category=categoryFilter.value;
        const sort=sortFilter.value;

        const params=new URLSearchParams({
            page:String(currentPage),
            limit:String(limit),
            sort
        });

        if(search){
            params.append("search",search);
        }

        if(category){
            params.append("category",category);
        }

        const response=await fetch(
            `${API_BASE_URL}/destinations?${params.toString()}`,
            {
                method:"GET",
                headers:{
                    "Accept":"application/json"
                }
            }
        );

        const result=await response.json();

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to load destinations"
            );
        }

        const destinations=
            result.data?.destinations||[];

        const pagination=result.pagination||{
            page:1,
            totalPages:1,
            totalRecords:destinations.length
        };

        loadingMessage.style.display="none";

        resultsText.textContent=
            `${pagination.totalRecords} destinations found`;

        if(destinations.length===0){
            emptyMessage.style.display="block";
            destinationsContainer.innerHTML="";
            paginationContainer.innerHTML="";
            return;
        }

        emptyMessage.style.display="none";

        destinationsContainer.innerHTML=destinations
            .map(createDestinationCard)
            .join("");

            updateWishlistButtons();
attachWishlistEvents();

        renderPagination(pagination);
    }catch(error){
        console.error("Destination loading error:",error);

        showErrorState(
            error.message||
            "Something went wrong while loading destinations"
        );
    }
}

function createPaginationButton(
    text,
    targetPage,
    isActive=false,
    isDisabled=false
){
    const button=document.createElement("button");

    button.type="button";
    button.textContent=text;
    button.disabled=isDisabled;

    if(isActive){
        button.classList.add("active");
    }

    button.addEventListener("click",()=>{
        if(isDisabled||targetPage===currentPage){
            return;
        }

        currentPage=targetPage;
        loadDestinations();

        window.scrollTo({
            top:0,
            behavior:"smooth"
        });
    });

    return button;
}

function renderPagination(pagination){
    paginationContainer.innerHTML="";

    const page=Number(pagination.page)||1;
    const totalPages=Number(pagination.totalPages)||1;

    if(totalPages<=1){
        return;
    }

    paginationContainer.appendChild(
        createPaginationButton(
            "Previous",
            page-1,
            false,
            page===1
        )
    );

    const visiblePages=new Set([
        1,
        totalPages,
        page-1,
        page,
        page+1
    ]);

    const validPages=[...visiblePages]
        .filter((item)=>{
            return item>=1&&item<=totalPages;
        })
        .sort((a,b)=>a-b);

    let previousPageNumber=0;

    validPages.forEach((pageNumber)=>{
        if(
            previousPageNumber!==0&&
            pageNumber-previousPageNumber>1
        ){
            const dots=document.createElement("span");

            dots.className="pagination-dots";
            dots.textContent="...";

            paginationContainer.appendChild(dots);
        }

        paginationContainer.appendChild(
            createPaginationButton(
                String(pageNumber),
                pageNumber,
                pageNumber===page
            )
        );

        previousPageNumber=pageNumber;
    });

    paginationContainer.appendChild(
        createPaginationButton(
            "Next",
            page+1,
            false,
            page===totalPages
        )
    );
}

let searchTimeout;

searchInput.addEventListener("input",()=>{
    clearTimeout(searchTimeout);

    searchTimeout=setTimeout(()=>{
        currentPage=1;
        loadDestinations();
    },400);
});

categoryFilter.addEventListener("change",()=>{
    currentPage=1;
    loadDestinations();
});

sortFilter.addEventListener("change",()=>{
    currentPage=1;
    loadDestinations();
});

document.addEventListener(
    "DOMContentLoaded",
    async()=>{
        await loadWishlistIds();
        await loadDestinations();
    }
);