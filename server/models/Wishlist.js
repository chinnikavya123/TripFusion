const mongoose=require("mongoose");

const wishlistSchema=new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            unique:true,
            index:true
        },

        destinations:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:"Destination"
            }
        ]
    },
    {
        timestamps:true
    }
);

module.exports=mongoose.model(
    "Wishlist",
    wishlistSchema
);