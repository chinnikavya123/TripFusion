const reviewForm=document.getElementById(
    "review-form"
);

const reviewRatingInput=document.getElementById(
    "review-rating"
);

const reviewCommentInput=document.getElementById(
    "review-comment"
);

const reviewMessage=document.getElementById(
    "review-message"
);

const reviewSubmitButton=document.getElementById(
    "review-submit-button"
);

const reviewDeleteButton=document.getElementById(
    "review-delete-button"
);

const reviewsContainer=document.getElementById(
    "reviews-container"
);

const reviewsLoading=document.getElementById(
    "reviews-loading"
);

const reviewsEmpty=document.getElementById(
    "reviews-empty"
);

const reviewsPagination=document.getElementById(
    "reviews-pagination"
);

const averageRatingElement=document.getElementById(
    "reviews-average-rating"
);

const totalCountElement=document.getElementById(
    "reviews-total-count"
);

const reviewFormTitle=document.getElementById(
    "review-form-title"
);

const starButtons=[
    ...document.querySelectorAll(
        ".star-rating-input button"
    )
];

const parameters=new URLSearchParams(
    window.location.search
);

const destinationId=parameters.get("id");

let selectedRating=0;
let myReview=null;
let currentReviewPage=1;
const reviewLimit=5;

function getReviewAuthHeaders(includeJSON=false){
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

function escapeReviewHTML(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

function formatReviewDate(value){
    return new Intl.DateTimeFormat("en-IN",{
        day:"2-digit",
        month:"short",
        year:"numeric"
    }).format(new Date(value));
}

function renderStars(rating){
    const roundedRating=Math.round(
        Number(rating)||0
    );

    return Array.from(
        {
            length:5
        },
        (_,index)=>{
            return index<roundedRating
                ?'<span class="review-star filled">★</span>'
                :'<span class="review-star">★</span>';
        }
    ).join("");
}

function updateStarSelection(){
    starButtons.forEach((button)=>{
        const rating=Number(
            button.dataset.rating
        );

        button.classList.toggle(
            "selected",
            rating<=selectedRating
        );
    });

    reviewRatingInput.value=String(
        selectedRating
    );
}

starButtons.forEach((button)=>{
    button.addEventListener("click",()=>{
        selectedRating=Number(
            button.dataset.rating
        );

        updateStarSelection();
    });
});

function createReviewCard(review){
    const userName=
        review.user?.fullName||"TripFusion User";

    return`
        <article class="review-card">
            <div class="review-card-header">
                <div class="review-user">
                    <div class="review-avatar">
                        ${
                            escapeReviewHTML(
                                userName.charAt(0).toUpperCase()
                            )
                        }
                    </div>

                    <div>
                        <h3>
                            ${escapeReviewHTML(userName)}
                        </h3>

                        <p>
                            ${formatReviewDate(
                                review.createdAt
                            )}
                        </p>
                    </div>
                </div>

                <div class="review-card-rating">
                    ${renderStars(review.rating)}

                    <strong>
                        ${Number(review.rating).toFixed(1)}
                    </strong>
                </div>
            </div>

            <p class="review-card-comment">
                ${escapeReviewHTML(review.comment)}
            </p>
        </article>
    `;
}

async function loadReviews(){
    try{
        reviewsLoading.style.display="block";
        reviewsEmpty.style.display="none";
        reviewsContainer.innerHTML="";
        reviewsPagination.innerHTML="";

        const response=await fetch(
            `${API_BASE_URL}/reviews/destination/${
                encodeURIComponent(destinationId)
            }?page=${currentReviewPage}&limit=${reviewLimit}`
        );

        const result=await response.json();

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to load reviews"
            );
        }

        const reviews=result.data?.reviews||[];
        const pagination=result.pagination;

        reviewsLoading.style.display="none";

        const average=
            reviews.length>0
                ?reviews.reduce((total,review)=>{
                    return total+Number(review.rating);
                },0)/reviews.length
                :0;

        averageRatingElement.textContent=
            average.toFixed(1);

        totalCountElement.textContent=
            `${pagination.totalRecords} ${
                pagination.totalRecords===1
                    ?"review"
                    :"reviews"
            }`;

        if(reviews.length===0){
            reviewsEmpty.style.display="block";
            return;
        }

        reviewsContainer.innerHTML=
            reviews
                .map(createReviewCard)
                .join("");

        renderReviewPagination(pagination);
    }catch(error){
        reviewsLoading.textContent=error.message;
        console.error(error);
    }
}

function renderReviewPagination(pagination){
    reviewsPagination.innerHTML="";

    if(pagination.totalPages<=1){
        return;
    }

    const previousButton=document.createElement(
        "button"
    );

    previousButton.textContent="Previous";
    previousButton.disabled=
        pagination.page===1;

    previousButton.addEventListener("click",()=>{
        currentReviewPage--;
        loadReviews();
    });

    reviewsPagination.appendChild(
        previousButton
    );

    for(
        let page=1;
        page<=pagination.totalPages;
        page++
    ){
        const button=document.createElement(
            "button"
        );

        button.textContent=page;

        if(page===pagination.page){
            button.classList.add("active");
        }

        button.addEventListener("click",()=>{
            currentReviewPage=page;
            loadReviews();
        });

        reviewsPagination.appendChild(button);
    }

    const nextButton=document.createElement(
        "button"
    );

    nextButton.textContent="Next";
    nextButton.disabled=
        pagination.page===pagination.totalPages;

    nextButton.addEventListener("click",()=>{
        currentReviewPage++;
        loadReviews();
    });

    reviewsPagination.appendChild(
        nextButton
    );
}

async function loadMyReview(){
    const token=localStorage.getItem(
        "tripfusion_token"
    );

    if(!token){
        reviewFormTitle.textContent=
            "Log in to write a review";

        reviewSubmitButton.textContent=
            "Login to Review";

        return;
    }

    try{
        const response=await fetch(
            `${API_BASE_URL}/reviews/my-review/${
                encodeURIComponent(destinationId)
            }`,
            {
                credentials:"include",
                headers:getReviewAuthHeaders()
            }
        );

        if(!response.ok){
            return;
        }

        const result=await response.json();

        myReview=result.data?.review||null;

        if(myReview){
            selectedRating=Number(
                myReview.rating
            );

            reviewCommentInput.value=
                myReview.comment||"";

            reviewFormTitle.textContent=
                "Edit your review";

            reviewSubmitButton.textContent=
                "Update Review";

            reviewDeleteButton.style.display=
                "inline-flex";

            updateStarSelection();
        }
    }catch(error){
        console.error(
            "Unable to load your review:",
            error
        );
    }
}

reviewForm.addEventListener(
    "submit",
    async(event)=>{
        event.preventDefault();

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

        const comment=
            reviewCommentInput.value.trim();

        reviewMessage.textContent="";
        reviewMessage.className=
            "review-message";

        if(selectedRating<1){
            reviewMessage.textContent=
                "Select a star rating.";

            reviewMessage.className=
                "review-message error";

            return;
        }

        if(comment.length<5){
            reviewMessage.textContent=
                "Write at least 5 characters.";

            reviewMessage.className=
                "review-message error";

            return;
        }

        reviewSubmitButton.disabled=true;
        reviewSubmitButton.textContent=
            myReview
                ?"Updating..."
                :"Submitting...";

        try{
            const endpoint=myReview
                ?`${API_BASE_URL}/reviews/${myReview._id}`
                :`${API_BASE_URL}/reviews`;

            const response=await fetch(
                endpoint,
                {
                    method:myReview?"PUT":"POST",
                    credentials:"include",
                    headers:getReviewAuthHeaders(true),

                    body:JSON.stringify(
                        myReview
                            ?{
                                rating:selectedRating,
                                comment
                            }
                            :{
                                destinationId,
                                rating:selectedRating,
                                comment
                            }
                    )
                }
            );

            const result=await response.json();

            if(!response.ok){
                throw new Error(
                    result.message||
                    "Unable to save review"
                );
            }

            myReview=result.data.review;

            reviewFormTitle.textContent=
                "Edit your review";

            reviewSubmitButton.textContent=
                "Update Review";

            reviewDeleteButton.style.display=
                "inline-flex";

            reviewMessage.textContent=
                result.message;

            reviewMessage.className=
                "review-message success";

            currentReviewPage=1;
            await loadReviews();
        }catch(error){
            reviewMessage.textContent=
                error.message;

            reviewMessage.className=
                "review-message error";

            reviewSubmitButton.textContent=
                myReview
                    ?"Update Review"
                    :"Submit Review";
        }finally{
            reviewSubmitButton.disabled=false;
        }
    }
);

reviewDeleteButton.addEventListener(
    "click",
    async()=>{
        if(!myReview){
            return;
        }

        const confirmed=window.confirm(
            "Delete your review?"
        );

        if(!confirmed){
            return;
        }

        reviewDeleteButton.disabled=true;
        reviewDeleteButton.textContent=
            "Deleting...";

        try{
            const response=await fetch(
                `${API_BASE_URL}/reviews/${myReview._id}`,
                {
                    method:"DELETE",
                    credentials:"include",
                    headers:getReviewAuthHeaders()
                }
            );

            const result=await response.json();

            if(!response.ok){
                throw new Error(
                    result.message||
                    "Unable to delete review"
                );
            }

            myReview=null;
            selectedRating=0;

            reviewCommentInput.value="";
            updateStarSelection();

            reviewFormTitle.textContent=
                "Write a review";

            reviewSubmitButton.textContent=
                "Submit Review";

            reviewDeleteButton.style.display=
                "none";

            reviewMessage.textContent=
                result.message;

            reviewMessage.className=
                "review-message success";

            currentReviewPage=1;
            await loadReviews();
        }catch(error){
            reviewMessage.textContent=
                error.message;

            reviewMessage.className=
                "review-message error";
        }finally{
            reviewDeleteButton.disabled=false;
            reviewDeleteButton.textContent=
                "Delete Review";
        }
    }
);

document.addEventListener(
    "DOMContentLoaded",
    async()=>{
        if(!destinationId){
            reviewsLoading.textContent=
                "Destination ID is missing.";

            return;
        }

        await Promise.all([
            loadReviews(),
            loadMyReview()
        ]);
    }
);