const mongoose=require("mongoose");

const reviewSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

        destination:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Destination",
            required:true
        },

        rating:{
            type:Number,
            required:true,
            min:1,
            max:5
        },

        comment:{
            type:String,
            required:true,
            trim:true,
            minlength:5,
            maxlength:1000
        }
    },
    {
        timestamps:true
    }
);

reviewSchema.index(
    {
        user:1,
        destination:1
    },
    {
        unique:true
    }
);

module.exports=mongoose.model(
    "Review",
    reviewSchema
);