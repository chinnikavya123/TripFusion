const Booking=require("../models/Booking");
const TripPlan=require("../models/TripPlan");

function normalizeMessage(message){
    return String(message||"")
        .trim()
        .toLowerCase();
}

function createReply(message,context={}){
    const text=normalizeMessage(message);

    if(!text){
        return(
            "Please enter your question. I can help with trips, bookings, hotels, weather, budgets and packing."
        );
    }

    if(
        text.includes("hello")||
        text.includes("hi")||
        text.includes("hey")
    ){
        return(
            "Hello! How can I help with your trip today?"
        );
    }

    if(
        text.includes("hotel")||
        text.includes("stay")||
        text.includes("accommodation")
    ){
        return(
            "I can help you find hotel recommendations based on your destination, budget, travel dates and number of guests."
        );
    }

    if(
        text.includes("booking")||
        text.includes("reservation")
    ){
        return(
            "You can view your confirmed, upcoming, completed and cancelled reservations from Booking History."
        );
    }

    if(
        text.includes("weather")
    ){
        return(
            "Open your saved trip and select View Weather to see the five-day forecast for the destination."
        );
    }

    if(
        text.includes("budget")||
        text.includes("expense")||
        text.includes("cost")
    ){
        return(
            "The Budget Planner can help divide your trip budget across accommodation, food, transport, activities and emergency expenses."
        );
    }

    if(
        text.includes("pack")||
        text.includes("clothes")||
        text.includes("carry")
    ){
        return(
            "Packing Suggestions can recommend clothing, documents, electronics and essentials based on the destination and weather."
        );
    }

    if(
        text.includes("cancel")
    ){
        return(
            "Open Booking History, select the reservation and use Cancel Booking. Cancelled reservations remain visible in your history."
        );
    }

    if(
        text.includes("restaurant")||
        text.includes("food")
    ){
        return(
            "You can find restaurants near your saved destination in the Useful Places Nearby section."
        );
    }

    if(
        text.includes("hospital")||
        text.includes("emergency")
    ){
        return(
            "Open Useful Places Nearby in your saved trip to find hospitals and emergency services around the destination."
        );
    }

    if(
        context.destination
    ){
        return(
            `I can help you with hotels, weather, budget, packing and nearby places for ${context.destination}.`
        );
    }

    return(
        "I can help with hotel recommendations, bookings, saved trips, weather, budgets, packing suggestions and nearby services."
    );
}

const chat=async(req,res,next)=>{
    try{
        const{
            message,
            tripId
        }=req.body;

        if(!message){
            return res.status(400).json({
                success:false,
                message:"Message is required"
            });
        }

        const context={};

        if(tripId){
            const trip=await TripPlan.findOne({
                _id:tripId,
                user:req.user._id
            }).select(
                "destinationName startDate days travelers totalBudget"
            );

            if(trip){
                context.destination=
                    trip.destinationName;

                context.trip=trip;
            }
        }

        const reply=createReply(
            message,
            context
        );

        res.status(200).json({
            success:true,
            data:{
                reply
            }
        });
    }catch(error){
        next(error);
    }
};

const getChatContext=async(
    req,
    res,
    next
)=>{
    try{
        const recentTrips=
            await TripPlan.find({
                user:req.user._id
            })
                .sort({
                    createdAt:-1
                })
                .limit(3)
                .select(
                    "destinationName startDate days totalBudget"
                );

        const recentBookings=
            await Booking.find({
                user:req.user._id
            })
                .sort({
                    createdAt:-1
                })
                .limit(3)
                .select(
                    "itemName destination bookingType bookingStatus bookingReference"
                );

        res.status(200).json({
            success:true,
            data:{
                recentTrips,
                recentBookings
            }
        });
    }catch(error){
        next(error);
    }
};

module.exports={
    chat,
    getChatContext
};