const crypto=require("crypto");

const Booking=require("../models/Booking");

function createBookingReference(){
    const randomPart=crypto
        .randomBytes(3)
        .toString("hex")
        .toUpperCase();

    return(
        `TF-${Date.now()}-${randomPart}`
    );
}

function calculateBookingStatus(booking){
    if(
        booking.bookingStatus==="cancelled"||
        booking.isDeleted
    ){
        return booking.bookingStatus;
    }

    const now=new Date();

    const relevantDate=
        booking.checkOut||
        booking.visitDate||
        booking.checkIn;

    if(
        relevantDate&&
        new Date(relevantDate)<now
    ){
        return"completed";
    }

    return booking.bookingStatus;
}

const createBooking=async(req,res,next)=>{
    try{
        const{
            bookingType,
            itemName,
            destination,
            image,
            address,
            checkIn,
            checkOut,
            visitDate,
            guests,
            rooms,
            quantity,
            pricePerUnit,
            totalAmount,
            currency,
            specialRequest,
            paymentStatus
        }=req.body;

        if(
            !bookingType||
            !itemName||
            !destination
        ){
            return res.status(400).json({
                success:false,
                message:
                    "Booking type, item name and destination are required"
            });
        }

        const allowedTypes=[
            "hotel",
            "attraction",
            "activity",
            "restaurant"
        ];

        if(
            !allowedTypes.includes(
                bookingType
            )
        ){
            return res.status(400).json({
                success:false,
                message:"Invalid booking type"
            });
        }

        if(
            bookingType==="hotel"&&
            (!checkIn||!checkOut)
        ){
            return res.status(400).json({
                success:false,
                message:
                    "Check-in and check-out dates are required for hotel bookings"
            });
        }

        if(
            bookingType!=="hotel"&&
            !visitDate
        ){
            return res.status(400).json({
                success:false,
                message:
                    "Visit date is required for this booking"
            });
        }

        if(
            checkIn&&
            checkOut&&
            new Date(checkOut)<=
            new Date(checkIn)
        ){
            return res.status(400).json({
                success:false,
                message:
                    "Check-out date must be after check-in date"
            });
        }

        const parsedAmount=
            Number(totalAmount);

        if(
            !Number.isFinite(parsedAmount)||
            parsedAmount<0
        ){
            return res.status(400).json({
                success:false,
                message:
                    "Enter a valid total amount"
            });
        }

        const booking=await Booking.create({
            user:req.user._id,
            bookingType,
            itemName:String(itemName).trim(),
            destination:
                String(destination).trim(),
            image:image||"",
            address:address||"",
            checkIn:
                checkIn
                    ?new Date(checkIn)
                    :null,
            checkOut:
                checkOut
                    ?new Date(checkOut)
                    :null,
            visitDate:
                visitDate
                    ?new Date(visitDate)
                    :null,
            guests:Number(guests)||1,
            rooms:Number(rooms)||1,
            quantity:Number(quantity)||1,
            pricePerUnit:
                Number(pricePerUnit)||0,
            totalAmount:parsedAmount,
            currency:currency||"INR",
            specialRequest:
                specialRequest||"",
            paymentStatus:
                paymentStatus||"unpaid",
            bookingReference:
                createBookingReference()
        });

        res.status(201).json({
            success:true,
            message:
                "Booking created successfully",
            data:{
                booking
            }
        });
    }catch(error){
        next(error);
    }
};

const getMyBookings=async(req,res,next)=>{
    try{
        const{
            status,
            type,
            includeDeleted
        }=req.query;

        const filter={
            user:req.user._id
        };

        if(includeDeleted!=="true"){
            filter.isDeleted=false;
        }

        if(
            type&&
            [
                "hotel",
                "attraction",
                "activity",
                "restaurant"
            ].includes(type)
        ){
            filter.bookingType=type;
        }

        if(
            status&&
            [
                "pending",
                "confirmed",
                "completed",
                "cancelled"
            ].includes(status)
        ){
            filter.bookingStatus=status;
        }

        let bookings=await Booking.find(
            filter
        ).sort({
            createdAt:-1
        });

        let changed=false;

        for(const booking of bookings){
            const calculatedStatus=
                calculateBookingStatus(
                    booking
                );

            if(
                calculatedStatus!==
                booking.bookingStatus
            ){
                booking.bookingStatus=
                    calculatedStatus;

                await booking.save();

                changed=true;
            }
        }

        if(changed){
            bookings=await Booking.find(
                filter
            ).sort({
                createdAt:-1
            });
        }

        res.status(200).json({
            success:true,
            count:bookings.length,
            data:{
                bookings
            }
        });
    }catch(error){
        next(error);
    }
};

const getBookingById=async(
    req,
    res,
    next
)=>{
    try{
        const booking=await Booking.findOne({
            _id:req.params.id,
            user:req.user._id
        });

        if(!booking){
            return res.status(404).json({
                success:false,
                message:"Booking not found"
            });
        }

        const calculatedStatus=
            calculateBookingStatus(booking);

        if(
            calculatedStatus!==
            booking.bookingStatus
        ){
            booking.bookingStatus=
                calculatedStatus;

            await booking.save();
        }

        res.status(200).json({
            success:true,
            data:{
                booking
            }
        });
    }catch(error){
        next(error);
    }
};

const cancelBooking=async(
    req,
    res,
    next
)=>{
    try{
        const booking=await Booking.findOne({
            _id:req.params.id,
            user:req.user._id,
            isDeleted:false
        });

        if(!booking){
            return res.status(404).json({
                success:false,
                message:"Booking not found"
            });
        }

        if(
            booking.bookingStatus===
            "cancelled"
        ){
            return res.status(400).json({
                success:false,
                message:
                    "This booking is already cancelled"
            });
        }

        if(
            booking.bookingStatus===
            "completed"
        ){
            return res.status(400).json({
                success:false,
                message:
                    "A completed booking cannot be cancelled"
            });
        }

        booking.bookingStatus=
            "cancelled";

        booking.cancelledAt=
            new Date();

        booking.cancellationReason=
            req.body.reason||
            "Cancelled by user";

        if(
            booking.paymentStatus===
            "paid"
        ){
            booking.paymentStatus=
                "refunded";
        }

        await booking.save();

        res.status(200).json({
            success:true,
            message:
                "Booking cancelled successfully",
            data:{
                booking
            }
        });
    }catch(error){
        next(error);
    }
};

const deleteBooking=async(
    req,
    res,
    next
)=>{
    try{
        const booking=await Booking.findOne({
            _id:req.params.id,
            user:req.user._id
        });

        if(!booking){
            return res.status(404).json({
                success:false,
                message:"Booking not found"
            });
        }

        if(booking.isDeleted){
            return res.status(400).json({
                success:false,
                message:
                    "Booking is already removed"
            });
        }

        booking.isDeleted=true;
        booking.deletedAt=new Date();

        if(
            booking.bookingStatus!==
            "cancelled"&&
            booking.bookingStatus!==
            "completed"
        ){
            booking.bookingStatus=
                "cancelled";

            booking.cancelledAt=
                new Date();

            booking.cancellationReason=
                "Removed by user";
        }

        await booking.save();

        res.status(200).json({
            success:true,
            message:
                "Booking removed from active bookings and preserved in history",
            data:{
                booking
            }
        });
    }catch(error){
        next(error);
    }
};

const getBookingHistory=async(
    req,
    res,
    next
)=>{
    try{
        const bookings=await Booking.find({
            user:req.user._id
        }).sort({
            createdAt:-1
        });

        const history=bookings.map(
            (booking)=>({
                ...booking.toObject(),
                effectiveStatus:
                    calculateBookingStatus(
                        booking
                    )
            })
        );

        res.status(200).json({
            success:true,
            count:history.length,
            data:{
                bookings:history
            }
        });
    }catch(error){
        next(error);
    }
};

module.exports={
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking,
    deleteBooking,
    getBookingHistory
};