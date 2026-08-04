const express=require("express");

const{
    getDestinations,
    getDestinationById,
    getPopularDestinations,
    getFeaturedDestinations,
    createDestination,
    updateDestination,
    deleteDestination
}=require("../controllers/destinationController");

const{
    protect,
    authorize
}=require("../middleware/authMiddleware");

const router=express.Router();

// Public Routes
router.get("/",getDestinations);

router.get("/popular",getPopularDestinations);

router.get("/featured",getFeaturedDestinations);

router.get("/:id",getDestinationById);

// Admin Routes
router.post(
    "/",
    protect,
    authorize("admin"),
    createDestination
);

router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateDestination
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteDestination
);

module.exports=router;