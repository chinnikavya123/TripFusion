const bookingHistoryLoading=document.getElementById(
    "booking-history-loading"
);

const bookingHistoryError=document.getElementById(
    "booking-history-error"
);

const bookingHistoryEmpty=document.getElementById(
    "booking-history-empty"
);

const bookingHistoryList=document.getElementById(
    "booking-history-list"
);

const bookingTabs=document.querySelectorAll(
    ".booking-tab"
);

const logoutButton=document.getElementById(
    "logout-button"
);

let allBookings=[];
let activeFilter="all";

function escapeHTML(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
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
    if(!value){
        return"Not specified";
    }

    const date=new Date(value);

    if(Number.isNaN(date.getTime())){
        return"Not specified";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day:"2-digit",
            month:"short",
            year:"numeric"
        }
    ).format(date);
}

function getAuthHeaders(){
    const token=localStorage.getItem(
        "tripfusion_token"
    );

    const headers={
        "Accept":"application/json",
        "Content-Type":"application/json"
    };

    if(token){
        headers.Authorization=
            `Bearer ${token}`;
    }

    return headers;
}

function getEffectiveStatus(booking){
    if(booking.isDeleted){
        return"deleted";
    }

    if(
        booking.effectiveStatus
    ){
        return booking.effectiveStatus;
    }

    return booking.bookingStatus||
        "pending";
}

function isUpcomingBooking(booking){
    const status=getEffectiveStatus(
        booking
    );

    if(
        status==="cancelled"||
        status==="completed"||
        status==="deleted"
    ){
        return false;
    }

    const relevantDate=
        booking.checkIn||
        booking.visitDate;

    if(!relevantDate){
        return(
            status==="confirmed"||
            status==="pending"
        );
    }

    return new Date(relevantDate)>=
        new Date();
}

function getStatusClass(status){
    const allowedStatuses=[
        "confirmed",
        "pending",
        "completed",
        "cancelled",
        "deleted"
    ];

    return allowedStatuses.includes(
        status
    )
        ?`booking-status-${status}`
        :"booking-status-pending";
}

function getBookingTypeLabel(type){
    const labels={
        hotel:"Hotel",
        attraction:"Attraction",
        activity:"Activity",
        restaurant:"Restaurant"
    };

    return labels[type]||
        "Booking";
}

function getFilteredBookings(){
    if(activeFilter==="all"){
        return allBookings;
    }

    if(activeFilter==="upcoming"){
        return allBookings.filter(
            isUpcomingBooking
        );
    }

    if(activeFilter==="deleted"){
        return allBookings.filter(
            (booking)=>
                booking.isDeleted===true
        );
    }

    return allBookings.filter(
        (booking)=>
            getEffectiveStatus(
                booking
            )===activeFilter
    );
}

function createBookingDetailsHTML(
    booking
){
    const bookingType=
        booking.bookingType;

    if(bookingType==="hotel"){
        return`
            <div class="booking-history-detail">
                <span>Check-in</span>

                <strong>
                    ${formatDate(
                        booking.checkIn
                    )}
                </strong>
            </div>

            <div class="booking-history-detail">
                <span>Check-out</span>

                <strong>
                    ${formatDate(
                        booking.checkOut
                    )}
                </strong>
            </div>

            <div class="booking-history-detail">
                <span>Guests</span>

                <strong>
                    ${Number(
                        booking.guests||1
                    )}
                </strong>
            </div>

            <div class="booking-history-detail">
                <span>Rooms</span>

                <strong>
                    ${Number(
                        booking.rooms||1
                    )}
                </strong>
            </div>
        `;
    }

    return`
        <div class="booking-history-detail">
            <span>Visit date</span>

            <strong>
                ${formatDate(
                    booking.visitDate
                )}
            </strong>
        </div>

        <div class="booking-history-detail">
            <span>Guests</span>

            <strong>
                ${Number(
                    booking.guests||
                    booking.quantity||
                    1
                )}
            </strong>
        </div>
    `;
}

function renderBookings(){
    const bookings=
        getFilteredBookings();

    bookingHistoryLoading.style.display=
        "none";

    bookingHistoryError.style.display=
        "none";

    bookingHistoryList.innerHTML="";

    if(bookings.length===0){
        bookingHistoryEmpty.style.display=
            "block";

        return;
    }

    bookingHistoryEmpty.style.display=
        "none";

    bookingHistoryList.innerHTML=
        bookings.map((booking)=>{
            const status=
                getEffectiveStatus(
                    booking
                );

            const canCancel=
                !booking.isDeleted&&
                (
                    status==="confirmed"||
                    status==="pending"
                );

            const canRemove=
                !booking.isDeleted;

            const noteHTML=
                booking.isDeleted
                    ?`
                        <p class="booking-history-note">
                            Removed from active bookings on
                            ${formatDate(
                                booking.deletedAt
                            )}.
                            This record remains visible in your history.
                        </p>
                    `
                    :status==="cancelled"
                        ?`
                            <p class="booking-history-note">
                                Cancelled on
                                ${formatDate(
                                    booking.cancelledAt
                                )}.
                                ${
                                    booking.cancellationReason
                                        ?escapeHTML(
                                            booking.cancellationReason
                                        )
                                        :""
                                }
                            </p>
                        `
                        :"";

            return`
                <article
                    class="booking-history-card"
                    data-booking-id="${escapeHTML(
                        booking._id
                    )}"
                >
                    <div class="booking-history-image">
                        <img
                            src="${escapeHTML(
                                booking.image||
                                "./assets/images/destinations/goa.jpg"
                            )}"
                            alt="${escapeHTML(
                                booking.itemName
                            )}"
                            loading="lazy"
                        >
                    </div>

                    <div class="booking-history-content">

                        <div class="booking-history-top">
                            <div>
                                <p class="booking-history-type">
                                    ${escapeHTML(
                                        getBookingTypeLabel(
                                            booking.bookingType
                                        )
                                    )}
                                    BOOKING
                                </p>

                                <h2>
                                    ${escapeHTML(
                                        booking.itemName
                                    )}
                                </h2>
                            </div>

                            <span
                                class="
                                    booking-status-badge
                                    ${getStatusClass(
                                        status
                                    )}
                                "
                            >
                                ${escapeHTML(status)}
                            </span>
                        </div>

                        <div class="booking-history-reference">
                            Reference:
                            <strong>
                                ${escapeHTML(
                                    booking.bookingReference
                                )}
                            </strong>
                        </div>

                        <div class="booking-history-details">

                            <div class="booking-history-detail">
                                <span>Destination</span>

                                <strong>
                                    ${escapeHTML(
                                        booking.destination
                                    )}
                                </strong>
                            </div>

                            <div class="booking-history-detail">
                                <span>Booked on</span>

                                <strong>
                                    ${formatDate(
                                        booking.createdAt
                                    )}
                                </strong>
                            </div>

                            ${createBookingDetailsHTML(
                                booking
                            )}

                        </div>

                        <div class="booking-history-price">
                            <span>Total amount</span>

                            <strong>
                                ${formatCurrency(
                                    booking.totalAmount
                                )}
                            </strong>
                        </div>

                        <div class="booking-history-actions">

                            ${
                                booking.bookingType==="hotel"
                                    ?`
                                        <a
                                            href="./hotels.html?destination=${
                                                encodeURIComponent(
                                                    booking.destination
                                                )
                                            }"
                                            class="
                                                booking-action-button
                                                booking-view-button
                                            "
                                        >
                                            View Hotels
                                        </a>
                                    `
                                    :""
                            }

                            ${
                                canCancel
                                    ?`
                                        <button
                                            type="button"
                                            class="
                                                booking-action-button
                                                booking-cancel-button
                                            "
                                            data-cancel-id="${escapeHTML(
                                                booking._id
                                            )}"
                                        >
                                            Cancel Booking
                                        </button>
                                    `
                                    :""
                            }

                            ${
                                canRemove
                                    ?`
                                        <button
                                            type="button"
                                            class="
                                                booking-action-button
                                                booking-remove-button
                                            "
                                            data-remove-id="${escapeHTML(
                                                booking._id
                                            )}"
                                        >
                                            Remove
                                        </button>
                                    `
                                    :""
                            }

                        </div>

                        ${noteHTML}

                    </div>
                </article>
            `;
        }).join("");
}

async function loadBookingHistory(){
    bookingHistoryLoading.style.display=
        "block";

    bookingHistoryError.style.display=
        "none";

    bookingHistoryEmpty.style.display=
        "none";

    try{
        const response=await fetch(
            `${API_BASE_URL}/bookings/history`,
            {
                method:"GET",
                credentials:"include",
                headers:getAuthHeaders()
            }
        );

        const result=await response.json();

        if(response.status===401){
            localStorage.removeItem(
                "tripfusion_token"
            );

            localStorage.removeItem(
                "tripfusion_user"
            );

            window.location.href=
                "./login.html";

            return;
        }

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to load booking history."
            );
        }

        allBookings=
            result.data.bookings||
            [];

        renderBookings();
    }catch(error){
        console.error(
            "Booking history loading error:",
            error
        );

        bookingHistoryLoading.style.display=
            "none";

        bookingHistoryError.style.display=
            "block";

        bookingHistoryError.textContent=
            error.message||
            "Unable to load booking history.";
    }
}

async function cancelBooking(
    bookingId
){
    const reason=window.prompt(
        "Enter a cancellation reason:",
        "Cancelled by user"
    );

    if(reason===null){
        return;
    }

    try{
        const response=await fetch(
            `${API_BASE_URL}/bookings/${
                encodeURIComponent(
                    bookingId
                )
            }/cancel`,
            {
                method:"PUT",
                credentials:"include",
                headers:getAuthHeaders(),
                body:JSON.stringify({
                    reason:
                        reason.trim()||
                        "Cancelled by user"
                })
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
                "Unable to cancel the booking."
            );
        }

        await loadBookingHistory();
    }catch(error){
        window.alert(
            error.message||
            "Unable to cancel the booking."
        );
    }
}

async function removeBooking(
    bookingId
){
    const confirmed=window.confirm(
        "Remove this booking from active bookings? It will remain visible under Removed history."
    );

    if(!confirmed){
        return;
    }

    try{
        const response=await fetch(
            `${API_BASE_URL}/bookings/${
                encodeURIComponent(
                    bookingId
                )
            }`,
            {
                method:"DELETE",
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
                "Unable to remove the booking."
            );
        }

        await loadBookingHistory();
    }catch(error){
        window.alert(
            error.message||
            "Unable to remove the booking."
        );
    }
}

bookingTabs.forEach((tab)=>{
    tab.addEventListener(
        "click",
        ()=>{
            bookingTabs.forEach(
                (button)=>{
                    button.classList.remove(
                        "active"
                    );
                }
            );

            tab.classList.add(
                "active"
            );

            activeFilter=
                tab.dataset.filter||
                "all";

            renderBookings();
        }
    );
});

bookingHistoryList?.addEventListener(
    "click",
    (event)=>{
        const cancelButton=
            event.target.closest(
                "[data-cancel-id]"
            );

        if(cancelButton){
            cancelBooking(
                cancelButton.dataset
                    .cancelId
            );

            return;
        }

        const removeButton=
            event.target.closest(
                "[data-remove-id]"
            );

        if(removeButton){
            removeBooking(
                removeButton.dataset
                    .removeId
            );
        }
    }
);

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
                "tripfusion_token"
            );

            localStorage.removeItem(
                "tripfusion_user"
            );

            window.location.href=
                "./login.html";
        }
    }
);

document.addEventListener(
    "DOMContentLoaded",
    loadBookingHistory
);