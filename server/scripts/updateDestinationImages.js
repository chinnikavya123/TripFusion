require("dotenv").config();

const mongoose=require("mongoose");

const connectDatabase=require("../config/db");
const Destination=require("../models/Destination");

const FALLBACK_IMAGE=
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";

const searchOverrides={
    "Goa":"Goa tourism India beach",
    "Manali":"Manali Himachal Pradesh tourism",
    "Jaipur":"Jaipur Rajasthan tourism",
    "Munnar":"Munnar Kerala tea plantations",
    "Rishikesh":"Rishikesh Uttarakhand Ganges",
    "Hampi":"Hampi Karnataka ruins",
    "Ooty":"Ooty Tamil Nadu tourism",
    "Kodaikanal":"Kodaikanal Tamil Nadu lake",
    "Coorg":"Kodagu Karnataka tourism",
    "Wayanad":"Wayanad Kerala tourism",
    "Alleppey":"Alappuzha Kerala backwaters",
    "Pondicherry":"Puducherry India tourism",
    "Udaipur":"Udaipur Rajasthan lake palace",
    "Jaisalmer":"Jaisalmer Rajasthan fort",
    "Agra":"Taj Mahal Agra",
    "Varanasi":"Varanasi ghats Ganges",
    "Darjeeling":"Darjeeling West Bengal tea gardens",
    "Gangtok":"Gangtok Sikkim tourism",
    "Shillong":"Shillong Meghalaya tourism",
    "Cherrapunji":"Cherrapunji Meghalaya waterfall",
    "Andaman Islands":"Andaman Islands India beach",
    "Leh Ladakh":"Leh Ladakh India tourism",
    "Srinagar":"Srinagar Dal Lake",
    "Auli":"Auli Uttarakhand skiing",
    "Hyderabad":"Charminar Hyderabad",
    "Visakhapatnam":"Visakhapatnam beach",
    "Araku Valley":"Araku Valley Andhra Pradesh",
    "Tirupati":"Tirupati temple Andhra Pradesh",
    "Gokarna":"Gokarna Karnataka beach",
    "Dandeli":"Dandeli Karnataka river",
    "Chikmagalur":"Chikmagalur Karnataka coffee",
    "Rann of Kutch":"Rann of Kutch Gujarat",
    "Lonavala":"Lonavala Maharashtra tourism",
    "Mahabaleshwar":"Mahabaleshwar Maharashtra tourism",
    "Kanyakumari":"Kanyakumari Tamil Nadu",
    "Rameswaram":"Rameswaram Tamil Nadu temple"
};

function delay(milliseconds){
    return new Promise((resolve)=>{
        setTimeout(resolve,milliseconds);
    });
}

async function fetchDestinationImage(destination){
    const searchTerm=
        searchOverrides[destination.name]||
        `${destination.name} ${destination.state} India tourism`;

    const parameters=new URLSearchParams({
        action:"query",
        generator:"search",
        gsrsearch:searchTerm,
        gsrnamespace:"0",
        gsrlimit:"3",
        prop:"pageimages",
        piprop:"thumbnail|original",
        pithumbsize:"1200",
        format:"json",
        origin:"*"
    });

    const url=
        `https://en.wikipedia.org/w/api.php?${parameters.toString()}`;

    const response=await fetch(url,{
        headers:{
            "User-Agent":
                "TripFusionAI/1.0 travel-project"
        }
    });

    if(!response.ok){
        throw new Error(
            `Image API returned ${response.status}`
        );
    }

    const result=await response.json();

    if(!result.query||!result.query.pages){
        return null;
    }

    const pages=Object.values(result.query.pages);

    const pageWithImage=pages.find((page)=>{
        return page.original?.source||page.thumbnail?.source;
    });

    if(!pageWithImage){
        return null;
    }

    return(
        pageWithImage.original?.source||
        pageWithImage.thumbnail?.source||
        null
    );
}

async function updateImages(){
    try{
        await connectDatabase();

        const destinations=await Destination.find({});

        console.log(
            `Found ${destinations.length} destinations`
        );

        let updatedCount=0;
        let fallbackCount=0;

        for(
            let index=0;
            index<destinations.length;
            index++
        ){
            const destination=destinations[index];

            try{
                console.log(
                    `[${index+1}/${destinations.length}] `+
                    `Finding image for ${destination.name}...`
                );

                const imageUrl=
                    await fetchDestinationImage(destination);

                if(imageUrl){
                    destination.image=imageUrl;

                    destination.gallery=[
                        imageUrl
                    ];

                    await destination.save();

                    updatedCount++;

                    console.log(
                        `Updated ${destination.name}`
                    );
                }else{
                    destination.image=FALLBACK_IMAGE;
                    destination.gallery=[
                        FALLBACK_IMAGE
                    ];

                    await destination.save();

                    fallbackCount++;

                    console.log(
                        `No image found for ${destination.name}`
                    );
                }
            }catch(error){
                fallbackCount++;

                console.error(
                    `Failed for ${destination.name}:`,
                    error.message
                );
            }

            /*
             * Small delay so that many requests are not sent
             * to Wikipedia at exactly the same time.
             */
            await delay(350);
        }

        console.log("");
        console.log("Image update complete");
        console.log(`Updated images: ${updatedCount}`);
        console.log(`Fallback images: ${fallbackCount}`);

        await mongoose.connection.close();

        process.exit(0);
    }catch(error){
        console.error(
            "Image update failed:",
            error.message
        );

        await mongoose.connection.close();

        process.exit(1);
    }
}

updateImages();