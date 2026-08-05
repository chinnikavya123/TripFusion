const express=require("express");

const{
    getHotels,
    getHotelById,
    getHotelDestinations
}=require(
    "../controllers/hotelController"
);

const router=express.Router();

router.get(
    "/destinations",
    getHotelDestinations
);

router.get(
    "/",
    getHotels
);

router.get(
    "/:id",
    getHotelById
);

module.exports=router;