const mongoose=require("mongoose");

const activitySchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        description:{
            type:String,
            trim:true,
            default:""
        },
        estimatedCost:{
            type:Number,
            min:0,
            default:0
        },
        duration:{
            type:String,
            trim:true,
            default:""
        }
    },
    {
        _id:false
    }
);

const nearbyPlaceSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true
        },
        distance:{
            type:String,
            trim:true,
            default:""
        },
        description:{
            type:String,
            trim:true,
            default:""
        }
    },
    {
        _id:false
    }
);

const destinationSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,"Destination name is required"],
            trim:true,
            minlength:[2,"Destination name must contain at least 2 characters"],
            maxlength:[100,"Destination name cannot exceed 100 characters"]
        },

        slug:{
            type:String,
            unique:true,
            lowercase:true,
            trim:true,
            index:true
        },

        country:{
            type:String,
            required:[true,"Country is required"],
            trim:true,
            default:"India"
        },

        state:{
            type:String,
            required:[true,"State is required"],
            trim:true
        },

        city:{
            type:String,
            required:[true,"City is required"],
            trim:true
        },

        category:{
            type:String,
            required:[true,"Category is required"],
            enum:[
                "Beach",
                "Hill Station",
                "Heritage",
                "Adventure",
                "Wildlife",
                "Pilgrimage",
                "Honeymoon",
                "Family",
                "Solo Travel",
                "Budget Travel",
                "Luxury Travel",
                "Weekend Getaway",
                "Nature",
                "Cultural"
            ],
            trim:true
        },

        shortDescription:{
            type:String,
            required:[true,"Short description is required"],
            trim:true,
            maxlength:[
                250,
                "Short description cannot exceed 250 characters"
            ]
        },

        description:{
            type:String,
            required:[true,"Description is required"],
            trim:true,
            minlength:[
                20,
                "Description must contain at least 20 characters"
            ]
        },

        rating:{
            type:Number,
            min:[0,"Rating cannot be less than 0"],
            max:[5,"Rating cannot be greater than 5"],
            default:0
        },

        reviewsCount:{
            type:Number,
            min:0,
            default:0
        },

        startingPrice:{
            type:Number,
            required:[true,"Starting price is required"],
            min:[0,"Starting price cannot be negative"]
        },

        currency:{
            type:String,
            trim:true,
            uppercase:true,
            default:"INR"
        },

        bestSeason:{
            type:String,
            required:[true,"Best season is required"],
            trim:true
        },

        duration:{
            type:String,
            required:[true,"Recommended duration is required"],
            trim:true
        },

        image:{
            type:String,
            required:[true,"Main image is required"],
            trim:true
        },

        gallery:[
            {
                type:String,
                trim:true
            }
        ],

        latitude:{
            type:Number,
            required:[true,"Latitude is required"],
            min:-90,
            max:90
        },

        longitude:{
            type:Number,
            required:[true,"Longitude is required"],
            min:-180,
            max:180
        },

        location:{
            type:{
                type:String,
                enum:["Point"],
                default:"Point"
            },
            coordinates:{
                type:[Number],
                default:[0,0]
            }
        },

        popular:{
            type:Boolean,
            default:false
        },

        featured:{
            type:Boolean,
            default:false
        },

        activities:{
            type:[activitySchema],
            default:[]
        },

        nearbyPlaces:{
            type:[nearbyPlaceSchema],
            default:[]
        },

        tags:[
            {
                type:String,
                trim:true,
                lowercase:true
            }
        ],

        languages:[
            {
                type:String,
                trim:true
            }
        ],

        localFood:[
            {
                type:String,
                trim:true
            }
        ],

        safetyTips:[
            {
                type:String,
                trim:true
            }
        ],

        transportationInfo:{
            type:String,
            trim:true,
            default:""
        },

        isPublished:{
            type:Boolean,
            default:true
        },

        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            default:null
        }
    },
    {
        timestamps:true
    }
);

destinationSchema.pre("save",function(){
    if(this.isModified("name")){
        this.slug=this.name
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g,"-")
            .replace(/^-+|-+$/g,"");
    }

    this.location={
        type:"Point",
        coordinates:[this.longitude,this.latitude]
    };
});

destinationSchema.index({
    location:"2dsphere"
});

destinationSchema.index({
    name:"text",
    city:"text",
    state:"text",
    country:"text",
    shortDescription:"text",
    description:"text",
    tags:"text"
});

destinationSchema.index({
    category:1,
    featured:1,
    popular:1,
    isPublished:1
});

module.exports=mongoose.model("Destination",destinationSchema);