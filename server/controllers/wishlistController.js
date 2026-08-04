const mongoose=require("mongoose");

const Wishlist=require("../models/Wishlist");
const Destination=require("../models/Destination");
const asyncHandler=require("../utils/asyncHandler");

const getMyWishlist=asyncHandler(async(req,res)=>{
    let wishlist=await Wishlist.findOne({
        user:req.user._id
    }).populate({
        path:"destinations",
        match:{
            isPublished:true
        },
        select:
            "name slug city state country category "+
            "shortDescription rating reviewsCount "+
            "startingPrice currency duration image "+
            "featured popular"
    });

    if(!wishlist){
        wishlist=await Wishlist.create({
            user:req.user._id,
            destinations:[]
        });

        await wishlist.populate({
            path:"destinations",
            select:
                "name slug city state country category "+
                "shortDescription rating reviewsCount "+
                "startingPrice currency duration image "+
                "featured popular"
        });
    }

    res.status(200).json({
        success:true,
        message:"Wishlist retrieved successfully",
        data:{
            wishlist,
            count:wishlist.destinations.length
        }
    });
});

const addToWishlist=asyncHandler(async(req,res)=>{
    const{
        destinationId
    }=req.params;

    if(!mongoose.Types.ObjectId.isValid(destinationId)){
        return res.status(400).json({
            success:false,
            message:"Invalid destination ID"
        });
    }

    const destination=await Destination.findOne({
        _id:destinationId,
        isPublished:true
    });

    if(!destination){
        return res.status(404).json({
            success:false,
            message:"Destination not found"
        });
    }

    const wishlist=await Wishlist.findOneAndUpdate(
        {
            user:req.user._id
        },
        {
            $addToSet:{
                destinations:destination._id
            }
        },
        {
            new:true,
            upsert:true,
            setDefaultsOnInsert:true
        }
    ).populate({
        path:"destinations",
        select:
            "name slug city state country category "+
            "shortDescription rating reviewsCount "+
            "startingPrice currency duration image "+
            "featured popular"
    });

    res.status(200).json({
        success:true,
        message:"Destination added to wishlist",
        data:{
            wishlist,
            count:wishlist.destinations.length
        }
    });
});

const removeFromWishlist=asyncHandler(async(req,res)=>{
    const{
        destinationId
    }=req.params;

    if(!mongoose.Types.ObjectId.isValid(destinationId)){
        return res.status(400).json({
            success:false,
            message:"Invalid destination ID"
        });
    }

    const wishlist=await Wishlist.findOneAndUpdate(
        {
            user:req.user._id
        },
        {
            $pull:{
                destinations:destinationId
            }
        },
        {
            new:true
        }
    ).populate({
        path:"destinations",
        select:
            "name slug city state country category "+
            "shortDescription rating reviewsCount "+
            "startingPrice currency duration image "+
            "featured popular"
    });

    if(!wishlist){
        return res.status(404).json({
            success:false,
            message:"Wishlist not found"
        });
    }

    res.status(200).json({
        success:true,
        message:"Destination removed from wishlist",
        data:{
            wishlist,
            count:wishlist.destinations.length
        }
    });
});

const checkWishlistStatus=asyncHandler(async(req,res)=>{
    const{
        destinationId
    }=req.params;

    if(!mongoose.Types.ObjectId.isValid(destinationId)){
        return res.status(400).json({
            success:false,
            message:"Invalid destination ID"
        });
    }

    const exists=await Wishlist.exists({
        user:req.user._id,
        destinations:destinationId
    });

    res.status(200).json({
        success:true,
        data:{
            isSaved:Boolean(exists)
        }
    });
});

module.exports={
    getMyWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlistStatus
};