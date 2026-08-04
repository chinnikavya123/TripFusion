const express=require("express");

const{
    getMyWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlistStatus
}=require("../controllers/wishlistController");

const{
    protect
}=require("../middleware/authMiddleware");

const router=express.Router();

router.use(protect);

router.get("/",getMyWishlist);

router.get(
    "/status/:destinationId",
    checkWishlistStatus
);

router.post(
    "/:destinationId",
    addToWishlist
);

router.delete(
    "/:destinationId",
    removeFromWishlist
);

module.exports=router;