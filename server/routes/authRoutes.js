const express=require("express");

const{
    register,
    login,
    logout,
    getCurrentUser,
    verifyEmailOTP,
    resendEmailOTP,
    requestPasswordReset,
verifyPasswordResetOTP,
resetPassword,
updateProfile,
changePassword
}=require("../controllers/authController");

const{
    protect
}=require("../middleware/authMiddleware");

const router=express.Router();

router.post("/register",register);
router.post("/login",login);

router.post(
    "/verify-email",
    verifyEmailOTP
);

router.post(
    "/resend-verification-otp",
    resendEmailOTP
);

router.post(
    "/forgot-password",
    requestPasswordReset
);

router.post(
    "/verify-reset-otp",
    verifyPasswordResetOTP
);

router.post(
    "/reset-password",
    resetPassword
);

router.put(
    "/profile",
    protect,
    updateProfile
);

router.put(
    "/change-password",
    protect,
    changePassword
);

router.post("/logout",logout);
router.get("/me",protect,getCurrentUser);

module.exports=router;