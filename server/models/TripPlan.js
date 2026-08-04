const mongoose=require("mongoose");

const itineraryDaySchema=new mongoose.Schema(
    {
        day:{
            type:Number,
            required:true,
            min:1
        },
        title:{
            type:String,
            required:true,
            trim:true
        },
        morning:{
            type:String,
            required:true,
            trim:true
        },
        afternoon:{
            type:String,
            required:true,
            trim:true
        },
        evening:{
            type:String,
            required:true,
            trim:true
        }
    },
    {
        _id:false
    }
);

const budgetBreakdownSchema=new mongoose.Schema(
    {
        accommodation:{
            type:Number,
            min:0,
            default:0
        },
        food:{
            type:Number,
            min:0,
            default:0
        },
        localTransport:{
            type:Number,
            min:0,
            default:0
        },
        activities:{
            type:Number,
            min:0,
            default:0
        },
        emergency:{
            type:Number,
            min:0,
            default:0
        }
    },
    {
        _id:false
    }
);

const tripPlanSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            index:true
        },

        destination:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Destination",
            required:true
        },

        destinationName:{
            type:String,
            required:true,
            trim:true
        },

        startDate:{
            type:Date,
            required:true
        },

        days:{
            type:Number,
            required:true,
            min:1,
            max:15
        },

        travelers:{
            type:Number,
            required:true,
            min:1,
            max:20
        },

        totalBudget:{
            type:Number,
            required:true,
            min:1000
        },

        travelStyle:{
            type:String,
            enum:[
                "budget",
                "comfortable",
                "luxury",
                "adventure",
                "relaxation"
            ],
            required:true
        },

        interests:[
            {
                type:String,
                trim:true
            }
        ],

        budgetBreakdown:{
            type:budgetBreakdownSchema,
            required:true
        },

        itinerary:{
            type:[itineraryDaySchema],
            required:true
        },

        status:{
            type:String,
            enum:[
                "planned",
                "upcoming",
                "completed",
                "cancelled"
            ],
            default:"planned"
        }
    },
    {
        timestamps:true
    }
);

tripPlanSchema.index({
    user:1,
    createdAt:-1
});

module.exports=mongoose.model("TripPlan",tripPlanSchema);