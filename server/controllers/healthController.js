const health=(req,res)=>{
    res.status(200).json({
        success:true,
        message:"TripFusion Server Running Successfully"
    });
};

module.exports={
    health
};