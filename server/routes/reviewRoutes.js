const express=require("express");

const{
    getDestinationReviews,
    getMyReviewForDestination,
    createReview,
    updateReview,
    deleteReview
}=require("../controllers/reviewController");

const{
    protect
}=require("../middleware/authMiddleware");

const router=express.Router();

router.get(
    "/destination/:destinationId",
    getDestinationReviews
);

router.get(
    "/my-review/:destinationId",
    protect,
    getMyReviewForDestination
);

router.post(
    "/",
    protect,
    createReview
);

router.put(
    "/:reviewId",
    protect,
    updateReview
);

router.delete(
    "/:reviewId",
    protect,
    deleteReview
);

module.exports=router;