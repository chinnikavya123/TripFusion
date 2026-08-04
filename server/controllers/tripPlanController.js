const TripPlan=require("../models/TripPlan");
const Destination=require("../models/Destination");
const asyncHandler=require("../utils/asyncHandler");

const{
    sendTripDetailsEmail
}=require("../services/emailService");

const{
    sendTripSummarySMS
}=require("../services/smsService");

const createTripPlan=asyncHandler(async(req,res)=>{
    const{
        destinationId,
        startDate,
        days,
        travelers,
        totalBudget,
        travelStyle,
        interests,
        budgetBreakdown,
        itinerary
    }=req.body;

    if(
        !destinationId||
        !startDate||
        !days||
        !travelers||
        !totalBudget||
        !travelStyle||
        !budgetBreakdown||
        !Array.isArray(itinerary)||
        itinerary.length===0
    ){
        return res.status(400).json({
            success:false,
            message:"Complete trip-plan details are required"
        });
    }

    const destination=await Destination.findById(
        destinationId
    );

    if(!destination){
        return res.status(404).json({
            success:false,
            message:"Destination not found"
        });
    }

    const tripPlan=await TripPlan.create({
        user:req.user._id,
        destination:destination._id,
        destinationName:destination.name,
        startDate,
        days,
        travelers,
        totalBudget,
        travelStyle,
        interests:Array.isArray(interests)
            ?interests
            :[],
        budgetBreakdown,
        itinerary
    });

    res.status(201).json({
        success:true,
        message:"Trip plan saved successfully",
        data:{
            tripPlan
        }
    });
});

const getMyTripPlans=asyncHandler(async(req,res)=>{
    const tripPlans=await TripPlan.find({
        user:req.user._id
    })
        .populate(
            "destination",
            "name state city image category"
        )
        .sort({
            createdAt:-1
        });

    res.status(200).json({
        success:true,
        message:"Trip plans retrieved successfully",
        data:{
            tripPlans
        }
    });
});

const getTripPlanById=asyncHandler(async(req,res)=>{
    const tripPlan=await TripPlan.findOne({
        _id:req.params.id,
        user:req.user._id
    }).populate(
        "destination",
        "name state city image category description"
    );

    if(!tripPlan){
        return res.status(404).json({
            success:false,
            message:"Trip plan not found"
        });
    }

    res.status(200).json({
        success:true,
        data:{
            tripPlan
        }
    });
});

const deleteTripPlan=asyncHandler(async(req,res)=>{
    const tripPlan=await TripPlan.findOne({
        _id:req.params.id,
        user:req.user._id
    });

    if(!tripPlan){
        return res.status(404).json({
            success:false,
            message:"Trip plan not found"
        });
    }

    await tripPlan.deleteOne();

    res.status(200).json({
        success:true,
        message:"Trip plan deleted successfully"
    });
});

const emailTripPlan=asyncHandler(async(req,res)=>{
    const tripPlan=await TripPlan.findOne({
        _id:req.params.id,
        user:req.user._id
    });

    if(!tripPlan){
        return res.status(404).json({
            success:false,
            message:"Trip plan not found"
        });
    }

    try{
        await sendTripDetailsEmail({
            user:req.user,
            tripPlan
        });

        return res.status(200).json({
            success:true,
            message:
                `Trip details were sent to ${req.user.email}`
        });
    }catch(emailError){
        console.error(
            "Trip email controller error:",
            emailError
        );

        return res.status(502).json({
            success:false,
            message:
                emailError.message||
                "Unable to send trip details by email"
        });
    }
});

const smsTripPlan=asyncHandler(async(req,res)=>{
    const tripPlan=await TripPlan.findOne({
        _id:req.params.id,
        user:req.user._id
    });

    if(!tripPlan){
        return res.status(404).json({
            success:false,
            message:"Trip plan not found"
        });
    }

    if(!req.user.phone){
        return res.status(400).json({
            success:false,
            message:
                "No phone number is registered with your account"
        });
    }

    const smsResult=await sendTripSummarySMS({
        user:req.user,
        tripPlan
    });

    res.status(200).json({
        success:true,
        message:
            `Trip summary was sent to ${smsResult.recipient}`,
        data:{
            messageSid:smsResult.sid,
            status:smsResult.status
        }
    });
});

module.exports={
    createTripPlan,
    getMyTripPlans,
    getTripPlanById,
    deleteTripPlan,
    emailTripPlan,
    smsTripPlan
};