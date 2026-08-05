const mongoose=require("mongoose");

const bookingSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            index:true
        },

        bookingType:{
            type:String,
            enum:[
                "hotel",
                "attraction",
                "activity",
                "restaurant"
            ],
            required:true
        },

        itemName:{
            type:String,
            required:true,
            trim:true
        },

        destination:{
            type:String,
            required:true,
            trim:true
        },

        image:{
            type:String,
            default:""
        },

        address:{
            type:String,
            default:"",
            trim:true
        },

        bookingDate:{
            type:Date,
            default:Date.now
        },

        checkIn:{
            type:Date,
            default:null
        },

        checkOut:{
            type:Date,
            default:null
        },

        visitDate:{
            type:Date,
            default:null
        },

        guests:{
            type:Number,
            min:1,
            default:1
        },

        rooms:{
            type:Number,
            min:1,
            default:1
        },

        quantity:{
            type:Number,
            min:1,
            default:1
        },

        pricePerUnit:{
            type:Number,
            min:0,
            default:0
        },

        totalAmount:{
            type:Number,
            min:0,
            required:true
        },

        currency:{
            type:String,
            default:"INR",
            trim:true
        },

        specialRequest:{
            type:String,
            default:"",
            trim:true,
            maxlength:500
        },

        bookingStatus:{
            type:String,
            enum:[
                "pending",
                "confirmed",
                "completed",
                "cancelled"
            ],
            default:"confirmed",
            index:true
        },

        paymentStatus:{
            type:String,
            enum:[
                "unpaid",
                "paid",
                "refunded"
            ],
            default:"unpaid"
        },

        bookingReference:{
            type:String,
            required:true,
            unique:true,
            index:true
        },

        cancelledAt:{
            type:Date,
            default:null
        },

        cancellationReason:{
            type:String,
            default:"",
            trim:true
        },

        isDeleted:{
            type:Boolean,
            default:false,
            index:true
        },

        deletedAt:{
            type:Date,
            default:null
        }
    },
    {
        timestamps:true
    }
);

bookingSchema.index({
    user:1,
    createdAt:-1
});

module.exports=mongoose.model(
    "Booking",
    bookingSchema
);