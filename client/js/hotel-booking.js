const bookingLoading=document.getElementById(
    "hotel-booking-loading"
);

const bookingError=document.getElementById(
    "hotel-booking-error"
);

const bookingContainer=document.getElementById(
    "hotel-booking-container"
);

const selectedHotelCard=document.getElementById(
    "selected-hotel-card"
);

const bookingForm=document.getElementById(
    "hotel-booking-form"
);

const checkInInput=document.getElementById(
    "booking-check-in"
);

const checkOutInput=document.getElementById(
    "booking-check-out"
);

const guestsInput=document.getElementById(
    "booking-guests"
);

const roomsInput=document.getElementById(
    "booking-rooms"
);

const roomTypeSelect=document.getElementById(
    "booking-room-type"
);

const specialRequestInput=document.getElementById(
    "booking-special-request"
);

const pricePerNightElement=document.getElementById(
    "booking-price-per-night"
);

const nightCountElement=document.getElementById(
    "booking-night-count"
);

const roomCountElement=document.getElementById(
    "booking-room-count"
);

const totalAmountElement=document.getElementById(
    "booking-total-amount"
);

const bookingFormMessage=document.getElementById(
    "booking-form-message"
);

const confirmBookingButton=document.getElementById(
    "confirm-booking-button"
);

const logoutButton=document.getElementById(
    "logout-button"
);

let selectedHotel=null;

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

function getAuthHeaders(){
    const token=localStorage.getItem(
        "tripfusion_token"
    );

    const headers={
        "Content-Type":"application/json",
        "Accept":"application/json"
    };

    if(token){
        headers.Authorization=
            `Bearer ${token}`;
    }

    return headers;
}

function getHotelId(){
    const parameters=
        new URLSearchParams(
            window.location.search
        );

    return parameters.get(
        "hotelId"
    );
}

function getTodayString(){
    const today=new Date();

    today.setMinutes(
        today.getMinutes()-
        today.getTimezoneOffset()
    );

    return today
        .toISOString()
        .split("T")[0];
}

function getSelectedRoom(){
    const roomIndex=Number(
        roomTypeSelect.value
    );

    return selectedHotel
        ?.roomTypes?.[roomIndex]||
        null;
}

function calculateNights(){
    if(
        !checkInInput.value||
        !checkOutInput.value
    ){
        return 0;
    }

    const checkIn=new Date(
        `${checkInInput.value}T12:00:00`
    );

    const checkOut=new Date(
        `${checkOutInput.value}T12:00:00`
    );

    const difference=
        checkOut.getTime()-
        checkIn.getTime();

    if(difference<=0){
        return 0;
    }

    return Math.ceil(
        difference/
        (1000*60*60*24)
    );
}

function updateBookingTotal(){
    const room=getSelectedRoom();

    const pricePerNight=
        Number(
            room?.price||
            selectedHotel?.price||
            0
        );

    const nights=calculateNights();

    const rooms=Math.max(
        Number(roomsInput.value)||1,
        1
    );

    const total=
        pricePerNight*
        nights*
        rooms;

    pricePerNightElement.textContent=
        formatCurrency(pricePerNight);

    nightCountElement.textContent=
        String(nights);

    roomCountElement.textContent=
        String(rooms);

    totalAmountElement.textContent=
        formatCurrency(total);

    return{
        room,
        pricePerNight,
        nights,
        rooms,
        total
    };
}

function showFormMessage(
    message,
    type
){
    bookingFormMessage.textContent=
        message;

    bookingFormMessage.className=
        `booking-form-message ${type}`;
}

function renderSelectedHotel(hotel){
    const amenitiesHTML=
        (hotel.amenities||[])
            .map((amenity)=>{
                return`
                    <span class="selected-hotel-amenity">
                        ${escapeHTML(amenity)}
                    </span>
                `;
            })
            .join("");

    selectedHotelCard.innerHTML=`
        <div class="selected-hotel-image">
            <img
                src="${escapeHTML(hotel.image)}"
                alt="${escapeHTML(hotel.name)}"
            >
        </div>

        <div class="selected-hotel-content">

            <div class="selected-hotel-meta">

                <span class="selected-hotel-location">
                    📍 ${escapeHTML(hotel.location)},
                    ${escapeHTML(hotel.destination)}
                </span>

                <span class="selected-hotel-rating">
                    ⭐ ${Number(
                        hotel.rating||0
                    ).toFixed(1)}
                    (${Number(
                        hotel.reviewsCount||0
                    )})
                </span>

            </div>

            <h2>
                ${escapeHTML(hotel.name)}
            </h2>

            <p>
                ${escapeHTML(hotel.description)}
            </p>

            <div class="selected-hotel-amenities">
                ${amenitiesHTML}
            </div>

        </div>
    `;

    roomTypeSelect.innerHTML=
        (hotel.roomTypes||[])
            .map((room,index)=>{
                return`
                    <option value="${index}">
                        ${escapeHTML(room.name)}
                        — ${formatCurrency(room.price)}
                        per night
                    </option>
                `;
            })
            .join("");

    updateBookingTotal();
}

async function loadHotel(){
    const hotelId=getHotelId();

    if(!hotelId){
        bookingLoading.style.display="none";
        bookingError.style.display="block";
        bookingError.textContent=
            "Hotel ID is missing from the URL.";

        return;
    }

    try{
        const response=await fetch(
            `${API_BASE_URL}/hotels/${
                encodeURIComponent(hotelId)
            }`,
            {
                headers:{
                    "Accept":"application/json"
                }
            }
        );

        const result=await response.json();

        if(!response.ok){
            throw new Error(
                result.message||
                "Unable to load hotel details."
            );
        }

        selectedHotel=result.data.hotel;

        renderSelectedHotel(
            selectedHotel
        );

        bookingLoading.style.display="none";
        bookingContainer.style.display="grid";
    }catch(error){
        bookingLoading.style.display="none";
        bookingError.style.display="block";
        bookingError.textContent=
            error.message;

        console.error(
            "Hotel details loading error:",
            error
        );
    }
}

bookingForm?.addEventListener(
    "submit",
    async(event)=>{
        event.preventDefault();

        if(!selectedHotel){
            return;
        }

        const calculation=
            updateBookingTotal();

        if(
            !checkInInput.value||
            !checkOutInput.value
        ){
            showFormMessage(
                "Select both check-in and check-out dates.",
                "error"
            );

            return;
        }

        if(calculation.nights<1){
            showFormMessage(
                "Check-out must be after the check-in date.",
                "error"
            );

            return;
        }

        const guests=Math.max(
            Number(guestsInput.value)||1,
            1
        );

        if(
            calculation.room?.capacity&&
            guests>
            calculation.room.capacity*
            calculation.rooms
        ){
            showFormMessage(
                `The selected rooms support up to ${
                    calculation.room.capacity*
                    calculation.rooms
                } guests.`,
                "error"
            );

            return;
        }

        confirmBookingButton.disabled=true;
        confirmBookingButton.textContent=
            "Confirming Booking...";

        showFormMessage(
            "",
            ""
        );

        try{
            const response=await fetch(
                `${API_BASE_URL}/bookings`,
                {
                    method:"POST",
                    credentials:"include",
                    headers:getAuthHeaders(),
                    body:JSON.stringify({
                        bookingType:"hotel",
                        itemName:selectedHotel.name,
                        destination:
                            selectedHotel.destination,
                        image:selectedHotel.image,
                        address:selectedHotel.address,
                        checkIn:checkInInput.value,
                        checkOut:checkOutInput.value,
                        guests,
                        rooms:calculation.rooms,
                        quantity:
                            calculation.rooms,
                        pricePerUnit:
                            calculation.pricePerNight,
                        totalAmount:
                            calculation.total,
                        currency:"INR",
                        specialRequest:
                            specialRequestInput.value.trim(),
                        paymentStatus:"unpaid"
                    })
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
                    "Unable to complete the booking."
                );
            }

            showFormMessage(
                `Booking confirmed. Reference: ${
                    result.data.booking
                        .bookingReference
                }`,
                "success"
            );

            setTimeout(()=>{
                window.location.href=
                    "./booking-history.html";
            },1400);
        }catch(error){
            console.error(
                "Hotel booking error:",
                error
            );

            showFormMessage(
                error.message||
                "Unable to complete the booking.",
                "error"
            );
        }finally{
            confirmBookingButton.disabled=false;
            confirmBookingButton.textContent=
                "Confirm Booking";
        }
    }
);

[
    checkInInput,
    checkOutInput,
    roomsInput,
    roomTypeSelect
].forEach((element)=>{
    element?.addEventListener(
        "change",
        updateBookingTotal
    );

    element?.addEventListener(
        "input",
        updateBookingTotal
    );
});

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
    ()=>{
        const today=getTodayString();

        checkInInput.min=today;
        checkOutInput.min=today;

        loadHotel();
    }
);