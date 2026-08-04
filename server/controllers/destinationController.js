const mongoose=require("mongoose");
const Destination=require("../models/Destination");
const asyncHandler=require("../utils/asyncHandler");

const escapeRegex=(value)=>{
    return value.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
};

const getDestinations=asyncHandler(async(req,res)=>{
    const{
        search,
        category,
        state,
        country,
        minPrice,
        maxPrice,
        featured,
        popular,
        sort="newest",
        page=1,
        limit=9
    }=req.query;

    const query={
        isPublished:true
    };

    if(search){
        const safeSearch=escapeRegex(search.trim());

        query.$or=[
            {
                name:{
                    $regex:safeSearch,
                    $options:"i"
                }
            },
            {
                city:{
                    $regex:safeSearch,
                    $options:"i"
                }
            },
            {
                state:{
                    $regex:safeSearch,
                    $options:"i"
                }
            },
            {
                country:{
                    $regex:safeSearch,
                    $options:"i"
                }
            },
            {
                tags:{
                    $in:[
                        new RegExp(safeSearch,"i")
                    ]
                }
            }
        ];
    }

    if(category){
        query.category=category;
    }

    if(state){
        query.state={
            $regex:`^${escapeRegex(state)}$`,
            $options:"i"
        };
    }

    if(country){
        query.country={
            $regex:`^${escapeRegex(country)}$`,
            $options:"i"
        };
    }

    if(featured==="true"){
        query.featured=true;
    }

    if(popular==="true"){
        query.popular=true;
    }

    if(minPrice||maxPrice){
        query.startingPrice={};

        if(minPrice){
            query.startingPrice.$gte=Number(minPrice);
        }

        if(maxPrice){
            query.startingPrice.$lte=Number(maxPrice);
        }
    }

    const pageNumber=Math.max(Number(page)||1,1);
    const limitNumber=Math.min(
        Math.max(Number(limit)||9,1),
        50
    );

    const skip=(pageNumber-1)*limitNumber;

    const sortOptions={
        newest:{createdAt:-1},
        oldest:{createdAt:1},
        priceLow:{startingPrice:1},
        priceHigh:{startingPrice:-1},
        rating:{rating:-1},
        popular:{popular:-1,rating:-1},
        nameAsc:{name:1},
        nameDesc:{name:-1}
    };

    const selectedSort=sortOptions[sort]||sortOptions.newest;

    const[
        destinations,
        totalRecords
    ]=await Promise.all([
        Destination.find(query)
            .sort(selectedSort)
            .skip(skip)
            .limit(limitNumber),

        Destination.countDocuments(query)
    ]);

    res.status(200).json({
        success:true,
        message:"Destinations retrieved successfully",
        data:{
            destinations
        },
        pagination:{
            page:pageNumber,
            limit:limitNumber,
            totalRecords,
            totalPages:Math.ceil(totalRecords/limitNumber)
        }
    });
});

const getDestinationById=asyncHandler(async(req,res)=>{
    const identifier=req.params.id;

    let destination;

    if(mongoose.Types.ObjectId.isValid(identifier)){
        destination=await Destination.findById(identifier);
    }else{
        destination=await Destination.findOne({
            slug:identifier.toLowerCase(),
            isPublished:true
        });
    }

    if(!destination){
        return res.status(404).json({
            success:false,
            message:"Destination not found"
        });
    }

    res.status(200).json({
        success:true,
        message:"Destination retrieved successfully",
        data:{
            destination
        }
    });
});

const getPopularDestinations=asyncHandler(async(req,res)=>{
    const limitNumber=Math.min(
        Math.max(Number(req.query.limit)||6,1),
        20
    );

    const destinations=await Destination.find({
        isPublished:true,
        popular:true
    })
        .sort({
            rating:-1,
            reviewsCount:-1
        })
        .limit(limitNumber);

    res.status(200).json({
        success:true,
        message:"Popular destinations retrieved successfully",
        data:{
            destinations
        }
    });
});

const getFeaturedDestinations=asyncHandler(async(req,res)=>{
    const limitNumber=Math.min(
        Math.max(Number(req.query.limit)||6,1),
        20
    );

    const destinations=await Destination.find({
        isPublished:true,
        featured:true
    })
        .sort({
            createdAt:-1
        })
        .limit(limitNumber);

    res.status(200).json({
        success:true,
        message:"Featured destinations retrieved successfully",
        data:{
            destinations
        }
    });
});

const createDestination=asyncHandler(async(req,res)=>{
    const destinationData={
        ...req.body,
        createdBy:req.user?req.user._id:null
    };

    const destination=await Destination.create(destinationData);

    res.status(201).json({
        success:true,
        message:"Destination created successfully",
        data:{
            destination
        }
    });
});

const updateDestination=asyncHandler(async(req,res)=>{
    const destination=await Destination.findById(req.params.id);

    if(!destination){
        return res.status(404).json({
            success:false,
            message:"Destination not found"
        });
    }

    const allowedFields=[
        "name",
        "country",
        "state",
        "city",
        "category",
        "shortDescription",
        "description",
        "rating",
        "reviewsCount",
        "startingPrice",
        "currency",
        "bestSeason",
        "duration",
        "image",
        "gallery",
        "latitude",
        "longitude",
        "popular",
        "featured",
        "activities",
        "nearbyPlaces",
        "tags",
        "languages",
        "localFood",
        "safetyTips",
        "transportationInfo",
        "isPublished"
    ];

    allowedFields.forEach((field)=>{
        if(req.body[field]!==undefined){
            destination[field]=req.body[field];
        }
    });

    const updatedDestination=await destination.save();

    res.status(200).json({
        success:true,
        message:"Destination updated successfully",
        data:{
            destination:updatedDestination
        }
    });
});

const deleteDestination=asyncHandler(async(req,res)=>{
    const destination=await Destination.findById(req.params.id);

    if(!destination){
        return res.status(404).json({
            success:false,
            message:"Destination not found"
        });
    }

    await destination.deleteOne();

    res.status(200).json({
        success:true,
        message:"Destination deleted successfully"
    });
});

module.exports={
    getDestinations,
    getDestinationById,
    getPopularDestinations,
    getFeaturedDestinations,
    createDestination,
    updateDestination,
    deleteDestination
};