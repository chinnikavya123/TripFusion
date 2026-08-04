const mongoose=require("mongoose");

const Review=require("../models/Review");
const Destination=require("../models/Destination");
const asyncHandler=require("../utils/asyncHandler");

async function updateDestinationRating(destinationId){
    const statistics=await Review.aggregate([
        {
            $match:{
                destination:new mongoose.Types.ObjectId(
                    destinationId
                )
            }
        },
        {
            $group:{
                _id:"$destination",
                averageRating:{
                    $avg:"$rating"
                },
                reviewsCount:{
                    $sum:1
                }
            }
        }
    ]);

    const ratingData=statistics[0]||{
        averageRating:0,
        reviewsCount:0
    };

    await Destination.findByIdAndUpdate(
        destinationId,
        {
            rating:Number(
                ratingData.averageRating.toFixed(1)
            ),
            reviewsCount:ratingData.reviewsCount
        }
    );
}

const getDestinationReviews=asyncHandler(
    async(req,res)=>{
        const{
            destinationId
        }=req.params;

        if(
            !mongoose.Types.ObjectId.isValid(
                destinationId
            )
        ){
            return res.status(400).json({
                success:false,
                message:"Invalid destination ID"
            });
        }

        const page=Math.max(
            Number(req.query.page)||1,
            1
        );

        const limit=Math.min(
            Math.max(Number(req.query.limit)||6,1),
            20
        );

        const skip=(page-1)*limit;

        const filter={
            destination:destinationId
        };

        const[
            reviews,
            totalRecords
        ]=await Promise.all([
            Review.find(filter)
                .populate(
                    "user",
                    "fullName"
                )
                .sort({
                    createdAt:-1
                })
                .skip(skip)
                .limit(limit),

            Review.countDocuments(filter)
        ]);

        res.status(200).json({
            success:true,
            message:"Reviews retrieved successfully",
            data:{
                reviews
            },
            pagination:{
                page,
                limit,
                totalRecords,
                totalPages:Math.ceil(
                    totalRecords/limit
                )
            }
        });
    }
);

const getMyReviewForDestination=asyncHandler(
    async(req,res)=>{
        const{
            destinationId
        }=req.params;

        const review=await Review.findOne({
            user:req.user._id,
            destination:destinationId
        });

        res.status(200).json({
            success:true,
            data:{
                review
            }
        });
    }
);

const createReview=asyncHandler(async(req,res)=>{
    const{
        destinationId,
        rating,
        comment
    }=req.body;

    if(
        !destinationId||
        !rating||
        !comment
    ){
        return res.status(400).json({
            success:false,
            message:
                "Destination, rating and comment are required"
        });
    }

    if(
        !mongoose.Types.ObjectId.isValid(
            destinationId
        )
    ){
        return res.status(400).json({
            success:false,
            message:"Invalid destination ID"
        });
    }

    const numericRating=Number(rating);

    if(
        numericRating<1||
        numericRating>5
    ){
        return res.status(400).json({
            success:false,
            message:
                "Rating must be between 1 and 5"
        });
    }

    if(String(comment).trim().length<5){
        return res.status(400).json({
            success:false,
            message:
                "Review must contain at least 5 characters"
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

    const existingReview=await Review.findOne({
        user:req.user._id,
        destination:destinationId
    });

    if(existingReview){
        return res.status(409).json({
            success:false,
            message:
                "You have already reviewed this destination"
        });
    }

    const review=await Review.create({
        user:req.user._id,
        destination:destinationId,
        rating:numericRating,
        comment:String(comment).trim()
    });

    await updateDestinationRating(
        destinationId
    );

    await review.populate(
        "user",
        "fullName"
    );

    res.status(201).json({
        success:true,
        message:"Review added successfully",
        data:{
            review
        }
    });
});

const updateReview=asyncHandler(async(req,res)=>{
    const{
        rating,
        comment
    }=req.body;

    const review=await Review.findOne({
        _id:req.params.reviewId,
        user:req.user._id
    });

    if(!review){
        return res.status(404).json({
            success:false,
            message:
                "Review not found or you cannot edit it"
        });
    }

    if(rating!==undefined){
        const numericRating=Number(rating);

        if(
            numericRating<1||
            numericRating>5
        ){
            return res.status(400).json({
                success:false,
                message:
                    "Rating must be between 1 and 5"
            });
        }

        review.rating=numericRating;
    }

    if(comment!==undefined){
        const cleanedComment=
            String(comment).trim();

        if(cleanedComment.length<5){
            return res.status(400).json({
                success:false,
                message:
                    "Review must contain at least 5 characters"
            });
        }

        review.comment=cleanedComment;
    }

    await review.save();

    await updateDestinationRating(
        review.destination
    );

    await review.populate(
        "user",
        "fullName"
    );

    res.status(200).json({
        success:true,
        message:"Review updated successfully",
        data:{
            review
        }
    });
});

const deleteReview=asyncHandler(async(req,res)=>{
    const review=await Review.findOne({
        _id:req.params.reviewId,
        user:req.user._id
    });

    if(!review){
        return res.status(404).json({
            success:false,
            message:
                "Review not found or you cannot delete it"
        });
    }

    const destinationId=review.destination;

    await review.deleteOne();

    await updateDestinationRating(
        destinationId
    );

    res.status(200).json({
        success:true,
        message:"Review deleted successfully"
    });
});

module.exports={
    getDestinationReviews,
    getMyReviewForDestination,
    createReview,
    updateReview,
    deleteReview
};