const express=require("express");
const cors=require("cors");
const helmet=require("helmet");
const morgan=require("morgan");
const cookieParser=require("cookie-parser");
const rateLimit=require("express-rate-limit");
const authRoutes=require("./routes/authRoutes");
const destinationRoutes=require("./routes/destinationRoutes");
const tripPlanRoutes=require("./routes/tripPlanRoutes");
const wishlistRoutes=require("./routes/wishlistRoutes");
const reviewRoutes=require("./routes/reviewRoutes");

const healthRoutes=require("./routes/healthRoutes");

const{
    notFound,
    errorHandler
}=require("./middleware/errorMiddleware");

const app=express();

app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}));

app.use(helmet());

app.use(express.json({
    limit:"10mb"
}));

app.use(express.urlencoded({
    extended:true,
    limit:"10mb"
}));

app.use(cookieParser());

if(process.env.NODE_ENV==="development"){
    app.use(morgan("dev"));
}

const limiter=rateLimit({
    windowMs:15*60*1000,
    max:200,
    standardHeaders:true,
    legacyHeaders:false,
    message:{
        success:false,
        message:"Too many requests. Please try again later."
    }
});

app.use("/api",limiter);

app.get("/",(req,res)=>{
    res.status(200).json({
        success:true,
        message:"Welcome to TripFusion API"
    });
});

app.use("/api/health",healthRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/destinations",destinationRoutes);
app.use("/api/trip-plans",tripPlanRoutes);
app.use("/api/wishlist",wishlistRoutes);
app.use("/api/reviews",reviewRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports=app;