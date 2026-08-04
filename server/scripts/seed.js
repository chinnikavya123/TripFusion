require("dotenv").config();

const mongoose=require("mongoose");

const connectDatabase=require("../config/db");
const Destination=require("../models/Destination");
const destinations=require("../data/destinations");

const seedDestinations=async()=>{
    try{
        await connectDatabase();

        console.log("Removing existing destination data...");

        await Destination.deleteMany({});

        console.log("Adding destination data...");

        await Destination.create(destinations);

        console.log(
            `${destinations.length} destinations added successfully`
        );

        await mongoose.connection.close();

        process.exit(0);
    }catch(error){
        console.error("Destination seeding failed:",error.message);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedDestinations();