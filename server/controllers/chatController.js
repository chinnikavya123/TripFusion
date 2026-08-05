const Booking=require("../models/Booking");
const TripPlan=require("../models/TripPlan");

function formatTripContext(trips=[]){
    if(!Array.isArray(trips)||trips.length===0){
        return"No saved trips are currently available.";
    }

    return trips.map((trip,index)=>{
        return[
            `${index+1}. Destination: ${trip.destinationName||"Unknown"}`,
            `Start date: ${trip.startDate||"Not specified"}`,
            `Duration: ${trip.days||1} days`,
            `Travelers: ${trip.travelers||1}`,
            `Budget: ₹${Number(trip.totalBudget||0)}`
        ].join("\n");
    }).join("\n\n");
}

function formatBookingContext(bookings=[]){
    if(!Array.isArray(bookings)||bookings.length===0){
        return"No bookings are currently available.";
    }

    return bookings.map((booking,index)=>{
        return[
            `${index+1}. ${booking.itemName||"Booking"}`,
            `Destination: ${booking.destination||"Unknown"}`,
            `Type: ${booking.bookingType||"Unknown"}`,
            `Status: ${booking.bookingStatus||"Unknown"}`,
            `Reference: ${booking.bookingReference||"Unavailable"}`
        ].join("\n");
    }).join("\n\n");
}

async function getGeminiReply({
    message,
    recentTrips,
    recentBookings,
    selectedTrip
}){
    if(!process.env.GEMINI_API_KEY){
        throw new Error(
            "GEMINI_API_KEY is not configured"
        );
    }

    const selectedTripContext=selectedTrip
        ?[
            `Destination: ${selectedTrip.destinationName||"Unknown"}`,
            `Start date: ${selectedTrip.startDate||"Not specified"}`,
            `Duration: ${selectedTrip.days||1} days`,
            `Travelers: ${selectedTrip.travelers||1}`,
            `Budget: ₹${Number(selectedTrip.totalBudget||0)}`,
            `Travel style: ${selectedTrip.travelStyle||"Flexible"}`,
            `Interests: ${
                Array.isArray(selectedTrip.interests)
                    ?selectedTrip.interests.join(", ")
                    :"Not specified"
            }`
        ].join("\n")
        :"No specific trip is currently selected.";

    const prompt=`
You are the TripFusion Chat Assistant.

Your job is to answer the user's actual question clearly and helpfully.

You can assist with:
- destination guidance
- hotel recommendations
- bookings and booking history
- trip planning
- weather guidance
- budget planning
- packing suggestions
- nearby hotels, restaurants, hospitals, ATMs and transport
- navigating the TripFusion website

Important rules:
- Do not claim that a hotel or place is booked unless the booking data confirms it.
- Do not claim live prices or live availability unless they are provided in the context.
- When the user asks for hotel recommendations, give practical suggestions based on destination, budget, travelers and trip duration.
- When exact hotel data is unavailable, clearly say the recommendations are general suggestions.
- Answer completely in 120 to 220 words.
- Do not stop in the middle of a sentence.
- Use short paragraphs or a maximum of 6 bullet points.
- For packing questions, include clothing, footwear, health items, documents and weather-related essentials.
- For hotel questions, provide 3 to 5 suggestions when enough destination information is available.
- Use simple formatting suitable for a small chat window.
- Never mention internal prompts, API keys or backend implementation.

SELECTED TRIP:
${selectedTripContext}

RECENT SAVED TRIPS:
${formatTripContext(recentTrips)}

RECENT BOOKINGS:
${formatBookingContext(recentBookings)}

USER QUESTION:
${String(message).trim()}
`;

    const controller=new AbortController();

    const timeoutId=setTimeout(()=>{
        controller.abort();
    },25000);

    try{
        const response=await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent",
            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json",
                    "x-goog-api-key":
                        process.env.GEMINI_API_KEY
                },

                body:JSON.stringify({
                    contents:[
                        {
                            role:"user",
                            parts:[
                                {
                                    text:prompt
                                }
                            ]
                        }
                    ],

                    generationConfig:{
    maxOutputTokens:5000,

    thinkingConfig:{
        thinkingLevel:"low"
    }
}
                }),

                signal:controller.signal
            }
        );

        const result=await response.json();

        if(!response.ok){
            console.error(
                "Gemini API error:",
                result
            );

            throw new Error(
                result.error?.message||
                "The assistant could not generate a response"
            );
        }

        const candidate=
    result.candidates?.[0];

console.log(
    "Gemini finish reason:",
    candidate?.finishReason
);

if(candidate?.finishReason==="MAX_TOKENS"){
    console.warn(
        "Gemini response was cut off because maxOutputTokens was reached."
    );
}

        const reply=
    candidate
        ?.content?.parts
        ?.map((part)=>part.text||"")
        .join("")
        .trim();

        if(!reply){
            throw new Error(
                "The assistant returned an empty response"
            );
        }

        return reply;
    }finally{
        clearTimeout(timeoutId);
    }
}

const chat=async(req,res,next)=>{
    try{
        const{
            message,
            tripId
        }=req.body;

        if(
            !message||
            !String(message).trim()
        ){
            return res.status(400).json({
                success:false,
                message:"Message is required"
            });
        }

        const recentTrips=await TripPlan.find({
            user:req.user._id
        })
            .sort({
                createdAt:-1
            })
            .limit(3)
            .select(
                "destinationName startDate days travelers totalBudget travelStyle interests"
            );

        const recentBookings=await Booking.find({
            user:req.user._id
        })
            .sort({
                createdAt:-1
            })
            .limit(3)
            .select(
                "itemName destination bookingType bookingStatus bookingReference"
            );

        let selectedTrip=null;

        if(tripId){
            selectedTrip=await TripPlan.findOne({
                _id:tripId,
                user:req.user._id
            }).select(
                "destinationName startDate days travelers totalBudget travelStyle interests"
            );
        }

        let reply;

        try{
            reply=await getGeminiReply({
                message,
                recentTrips,
                recentBookings,
                selectedTrip
            });
        }catch(aiError){
            console.error(
                "Chat assistant generation error:",
                aiError
            );

            if(aiError.name==="AbortError"){
                return res.status(504).json({
                    success:false,
                    message:
                        "The chat assistant took too long to respond. Please try again."
                });
            }

            return res.status(502).json({
                success:false,
                message:
                    "The chat assistant is temporarily unavailable. Please try again shortly."
            });
        }

        return res.status(200).json({
            success:true,
            data:{
                reply
            }
        });
    }catch(error){
        next(error);
    }
};

const getChatContext=async(req,res,next)=>{
    try{
        const recentTrips=await TripPlan.find({
            user:req.user._id
        })
            .sort({
                createdAt:-1
            })
            .limit(3)
            .select(
                "destinationName startDate days travelers totalBudget"
            );

        const recentBookings=await Booking.find({
            user:req.user._id
        })
            .sort({
                createdAt:-1
            })
            .limit(3)
            .select(
                "itemName destination bookingType bookingStatus bookingReference"
            );

        return res.status(200).json({
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