const hotels=require("../data/hotels");

function normalizeText(value){
    return String(value||"")
        .trim()
        .toLowerCase();
}

const getHotels=async(req,res,next)=>{
    try{
        const{
            destination,
            minPrice,
            maxPrice,
            minRating,
            sort
        }=req.query;

        let results=[...hotels];

        if(destination){
            const normalizedDestination=
                normalizeText(destination);

            results=results.filter((hotel)=>{
                return(
                    normalizeText(
                        hotel.destination
                    ).includes(
                        normalizedDestination
                    )||
                    normalizeText(
                        hotel.location
                    ).includes(
                        normalizedDestination
                    )
                );
            });
        }

        if(minPrice!==undefined){
            const parsedMinPrice=
                Number(minPrice);

            if(Number.isFinite(parsedMinPrice)){
                results=results.filter(
                    (hotel)=>
                        hotel.price>=
                        parsedMinPrice
                );
            }
        }

        if(maxPrice!==undefined){
            const parsedMaxPrice=
                Number(maxPrice);

            if(Number.isFinite(parsedMaxPrice)){
                results=results.filter(
                    (hotel)=>
                        hotel.price<=
                        parsedMaxPrice
                );
            }
        }

        if(minRating!==undefined){
            const parsedMinRating=
                Number(minRating);

            if(Number.isFinite(parsedMinRating)){
                results=results.filter(
                    (hotel)=>
                        hotel.rating>=
                        parsedMinRating
                );
            }
        }

        if(sort==="price-low"){
            results.sort(
                (firstHotel,secondHotel)=>
                    firstHotel.price-
                    secondHotel.price
            );
        }else if(sort==="price-high"){
            results.sort(
                (firstHotel,secondHotel)=>
                    secondHotel.price-
                    firstHotel.price
            );
        }else if(sort==="rating"){
            results.sort(
                (firstHotel,secondHotel)=>
                    secondHotel.rating-
                    firstHotel.rating
            );
        }

        return res.status(200).json({
            success:true,
            count:results.length,
            data:{
                hotels:results
            }
        });
    }catch(error){
        next(error);
    }
};

const getHotelById=async(req,res,next)=>{
    try{
        const hotel=hotels.find(
            (item)=>
                item.id===
                req.params.id
        );

        if(!hotel){
            return res.status(404).json({
                success:false,
                message:"Hotel not found"
            });
        }

        return res.status(200).json({
            success:true,
            data:{
                hotel
            }
        });
    }catch(error){
        next(error);
    }
};

const getHotelDestinations=async(
    req,
    res,
    next
)=>{
    try{
        const destinations=[
            ...new Set(
                hotels.map(
                    (hotel)=>
                        hotel.destination
                )
            )
        ].sort();

        return res.status(200).json({
            success:true,
            count:destinations.length,
            data:{
                destinations
            }
        });
    }catch(error){
        next(error);
    }
};

module.exports={
    getHotels,
    getHotelById,
    getHotelDestinations
};