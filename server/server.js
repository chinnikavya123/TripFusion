require("dotenv").config();

const app=require("./app");
const connectDatabase=require("./config/db");

const PORT=process.env.PORT||5000;

const startServer=async()=>{
    try{
        await connectDatabase();

        app.listen(PORT,()=>{
            console.log(`MongoDB and Express started successfully`);
            console.log(`Root API: http://localhost:${PORT}/`);
            console.log(`Health API: http://localhost:${PORT}/api/health`);
        });
    }catch(error){
        console.error("Server startup failed:",error.message);
        process.exit(1);
    }
};

startServer();