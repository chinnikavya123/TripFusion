const express=require("express");

const{
    createTripPlan,
    getMyTripPlans,
    getTripPlanById,
    deleteTripPlan,
    emailTripPlan,
    smsTripPlan
}=require("../controllers/tripPlanController");

const{
    protect
}=require("../middleware/authMiddleware");

const router=express.Router();

router.use(protect);

router.post("/",createTripPlan);
router.get("/my-trips",getMyTripPlans);
router.post(
    "/:id/email",
    emailTripPlan
);
router.post(
    "/:id/sms",
    smsTripPlan
);
router.get("/:id",getTripPlanById);
router.delete("/:id",deleteTripPlan);

module.exports=router;