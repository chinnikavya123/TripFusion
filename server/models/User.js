const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");

const userSchema=new mongoose.Schema(
    {
        fullName:{
            type:String,
            required:[true,"Full name is required"],
            trim:true,
            minlength:[2,"Full name must contain at least 2 characters"],
            maxlength:[60,"Full name cannot exceed 60 characters"]
        },

        email:{
            type:String,
            required:[true,"Email is required"],
            unique:true,
            lowercase:true,
            trim:true,
            match:[
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email address"
            ]
        },

        phone:{
            type:String,
            trim:true,
            default:""
        },

        password:{
            type:String,
            required:[true,"Password is required"],
            minlength:[8,"Password must contain at least 8 characters"],
            select:false
        },

        role:{
            type:String,
            enum:["traveler","admin"],
            default:"traveler"
        },

        profileImage:{
            type:String,
            default:""
        },

        country:{
            type:String,
            trim:true,
            default:"India"
        },

        preferredCurrency:{
            type:String,
            trim:true,
            default:"INR"
        },

        isBlocked:{
            type:Boolean,
            default:false
        },
        isEmailVerified:{
            type:Boolean,
            default:false
        },

emailVerificationOTPHash:{
    type:String,
    select:false,
    default:null
},

emailVerificationOTPExpires:{
    type:Date,
    select:false,
    default:null
},

emailVerificationAttempts:{
    type:Number,
    select:false,
    default:0
},

emailVerificationLastSentAt:{
    type:Date,
    select:false,
    default:null
},

passwordResetOTPHash:{
    type:String,
    select:false,
    default:null
},

passwordResetOTPExpires:{
    type:Date,
    select:false,
    default:null
},

passwordResetAttempts:{
    type:Number,
    select:false,
    default:0
},

passwordResetVerified:{
    type:Boolean,
    select:false,
    default:false
}
    },
    {
        timestamps:true
    }
);

userSchema.pre("save",async function(){
    if(!this.isModified("password")){
        return;
    }

    this.password=await bcrypt.hash(this.password,12);
});

userSchema.methods.comparePassword=async function(candidatePassword){
    return bcrypt.compare(candidatePassword,this.password);
};

module.exports=mongoose.model("User",userSchema);