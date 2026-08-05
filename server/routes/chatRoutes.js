const express=require("express");

const{
    chat,
    getChatContext
}=require(
    "../controllers/chatController"
);

const{
    protect
}=require(
    "../middleware/authMiddleware"
);

const router=express.Router();

router.use(protect);

router.post(
    "/",
    chat
);

router.get(
    "/context",
    getChatContext
);

module.exports=router;