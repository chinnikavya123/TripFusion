const destinationConfigs=[
    {
        destination:"Goa",
        city:"Panaji",
        basePrice:4500,
        type:"beach"
    },
    {
        destination:"Manali",
        city:"Manali",
        basePrice:3800,
        type:"hill"
    },
    {
        destination:"Jaipur",
        city:"Jaipur",
        basePrice:3200,
        type:"heritage"
    },
    {
        destination:"Munnar",
        city:"Munnar",
        basePrice:3600,
        type:"nature"
    },
    {
        destination:"Rishikesh",
        city:"Rishikesh",
        basePrice:2800,
        type:"adventure"
    },
    {
        destination:"Hampi",
        city:"Hampi",
        basePrice:2600,
        type:"heritage"
    },
    {
        destination:"Shimla",
        city:"Shimla",
        basePrice:4000,
        type:"hill"
    },
    {
        destination:"Ooty",
        city:"Ooty",
        basePrice:3500,
        type:"hill"
    },
    {
        destination:"Kodaikanal",
        city:"Kodaikanal",
        basePrice:3400,
        type:"hill"
    },
    {
        destination:"Coorg",
        city:"Madikeri",
        basePrice:4200,
        type:"nature"
    },
    {
        destination:"Wayanad",
        city:"Kalpetta",
        basePrice:3600,
        type:"nature"
    },
    {
        destination:"Alleppey",
        city:"Alappuzha",
        basePrice:4300,
        type:"waterfront"
    },
    {
        destination:"Kochi",
        city:"Kochi",
        basePrice:3900,
        type:"city"
    },
    {
        destination:"Pondicherry",
        city:"Puducherry",
        basePrice:3800,
        type:"beach"
    },
    {
        destination:"Mahabalipuram",
        city:"Mahabalipuram",
        basePrice:4100,
        type:"beach"
    },
    {
        destination:"Mysuru",
        city:"Mysuru",
        basePrice:3000,
        type:"heritage"
    },
    {
        destination:"Udaipur",
        city:"Udaipur",
        basePrice:4600,
        type:"heritage"
    },
    {
        destination:"Jaisalmer",
        city:"Jaisalmer",
        basePrice:3700,
        type:"desert"
    },
    {
        destination:"Mount Abu",
        city:"Mount Abu",
        basePrice:3500,
        type:"hill"
    },
    {
        destination:"Agra",
        city:"Agra",
        basePrice:3200,
        type:"heritage"
    },
    {
        destination:"Varanasi",
        city:"Varanasi",
        basePrice:2900,
        type:"spiritual"
    },
    {
        destination:"Amritsar",
        city:"Amritsar",
        basePrice:3000,
        type:"spiritual"
    },
    {
        destination:"Darjeeling",
        city:"Darjeeling",
        basePrice:3900,
        type:"hill"
    },
    {
        destination:"Gangtok",
        city:"Gangtok",
        basePrice:3800,
        type:"hill"
    },
    {
        destination:"Shillong",
        city:"Shillong",
        basePrice:3500,
        type:"hill"
    },
    {
        destination:"Cherrapunji",
        city:"Sohra",
        basePrice:3400,
        type:"nature"
    },
    {
        destination:"Kaziranga",
        city:"Kaziranga",
        basePrice:4200,
        type:"wildlife"
    },
    {
        destination:"Andaman Islands",
        city:"Port Blair",
        basePrice:5200,
        type:"island"
    },
    {
        destination:"Lakshadweep",
        city:"Kavaratti",
        basePrice:6000,
        type:"island"
    },
    {
        destination:"Leh Ladakh",
        city:"Leh",
        basePrice:4400,
        type:"mountain"
    },
    {
        destination:"Srinagar",
        city:"Srinagar",
        basePrice:4300,
        type:"waterfront"
    },
    {
        destination:"Gulmarg",
        city:"Gulmarg",
        basePrice:4800,
        type:"mountain"
    },
    {
        destination:"Auli",
        city:"Auli",
        basePrice:4500,
        type:"mountain"
    },
    {
        destination:"Mussoorie",
        city:"Mussoorie",
        basePrice:3900,
        type:"hill"
    },
    {
        destination:"Nainital",
        city:"Nainital",
        basePrice:4000,
        type:"hill"
    },
    {
        destination:"Jim Corbett",
        city:"Ramnagar",
        basePrice:4700,
        type:"wildlife"
    },
    {
        destination:"Khajuraho",
        city:"Khajuraho",
        basePrice:3100,
        type:"heritage"
    },
    {
        destination:"Hyderabad",
        city:"Hyderabad",
        basePrice:3800,
        type:"city"
    },
    {
        destination:"Visakhapatnam",
        city:"Visakhapatnam",
        basePrice:3700,
        type:"beach"
    },
    {
        destination:"Araku Valley",
        city:"Araku",
        basePrice:3200,
        type:"nature"
    },
    {
        destination:"Tirupati",
        city:"Tirupati",
        basePrice:2800,
        type:"spiritual"
    },
    {
        destination:"Puri",
        city:"Puri",
        basePrice:3500,
        type:"beach"
    },
    {
        destination:"Gokarna",
        city:"Gokarna",
        basePrice:3300,
        type:"beach"
    },
    {
        destination:"Dandeli",
        city:"Dandeli",
        basePrice:3400,
        type:"adventure"
    },
    {
        destination:"Chikmagalur",
        city:"Chikmagalur",
        basePrice:3900,
        type:"nature"
    },
    {
        destination:"Rann of Kutch",
        city:"Bhuj",
        basePrice:4100,
        type:"desert"
    },
    {
        destination:"Gir National Park",
        city:"Sasan Gir",
        basePrice:4500,
        type:"wildlife"
    },
    {
        destination:"Lonavala",
        city:"Lonavala",
        basePrice:4200,
        type:"hill"
    },
    {
        destination:"Mahabaleshwar",
        city:"Mahabaleshwar",
        basePrice:4100,
        type:"hill"
    },
    {
        destination:"Mumbai",
        city:"Mumbai",
        basePrice:5500,
        type:"city"
    },
    {
        destination:"Delhi",
        city:"New Delhi",
        basePrice:4800,
        type:"city"
    },
    {
        destination:"Kanyakumari",
        city:"Kanyakumari",
        basePrice:3200,
        type:"coastal"
    },
    {
        destination:"Rameswaram",
        city:"Rameswaram",
        basePrice:3000,
        type:"spiritual"
    }
];

const hotelImagesByType={
    beach:[
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4"
    ],

    coastal:[
        "https://images.unsplash.com/photo-1540541338287-41700207dee6",
        "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb"
    ],

    island:[
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2",
        "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57"
    ],

    hill:[
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "https://images.unsplash.com/photo-1486911278844-a81c5267e227",
        "https://images.unsplash.com/photo-1464278533981-50106e6176b1"
    ],

    mountain:[
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
        "https://images.unsplash.com/photo-1483347756197-71ef80e95f73",
        "https://images.unsplash.com/photo-1519681393784-d120267933ba"
    ],

    nature:[
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
        "https://images.unsplash.com/photo-1472396961693-142e6e269027"
    ],

    wildlife:[
        "https://images.unsplash.com/photo-1516426122078-c23e76319801",
        "https://images.unsplash.com/photo-1549366021-9f761d450615",
        "https://images.unsplash.com/photo-1535338454770-8be927b5a00b"
    ],

    heritage:[
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        "https://images.unsplash.com/photo-1568084680786-a84f91d1153c"
    ],

    spiritual:[
        "https://images.unsplash.com/photo-1591017403286-fd8493524e1e",
        "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
        "https://images.unsplash.com/photo-1584132967334-10e028bd69f7"
    ],

    adventure:[
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
        "https://images.unsplash.com/photo-1521336575822-6da63fb45455",
        "https://images.unsplash.com/photo-1517825738774-7de9363ef735"
    ],

    desert:[
        "https://images.unsplash.com/photo-1509316785289-025f5b846b35",
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
        "https://images.unsplash.com/photo-1548018560-c7196548e84d"
    ],

    waterfront:[
        "https://images.unsplash.com/photo-1501117716987-c8e1ecb210b3",
        "https://images.unsplash.com/photo-1529290130-4ca3753253ae",
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa"
    ],

    city:[
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa",
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1590490360182-c33d57733427"
    ]
};

const typeAmenities={
    beach:[
        "Free WiFi",
        "Swimming Pool",
        "Breakfast",
        "Beach Access"
    ],

    coastal:[
        "Free WiFi",
        "Breakfast",
        "Sea View",
        "Parking"
    ],

    island:[
        "Free WiFi",
        "Breakfast",
        "Ocean View",
        "Airport Transfer"
    ],

    hill:[
        "Free WiFi",
        "Breakfast",
        "Mountain View",
        "Parking"
    ],

    mountain:[
        "Room Heater",
        "Free WiFi",
        "Breakfast",
        "Mountain View"
    ],

    nature:[
        "Free WiFi",
        "Breakfast",
        "Garden",
        "Nature View"
    ],

    wildlife:[
        "Breakfast",
        "Nature Walk",
        "Parking",
        "Restaurant"
    ],

    heritage:[
        "Free WiFi",
        "Breakfast",
        "Heritage View",
        "Restaurant"
    ],

    spiritual:[
        "Free WiFi",
        "Breakfast",
        "Temple Transfer",
        "Parking"
    ],

    adventure:[
        "Free WiFi",
        "Breakfast",
        "Adventure Desk",
        "Parking"
    ],

    desert:[
        "Breakfast",
        "Cultural Program",
        "Desert View",
        "Parking"
    ],

    waterfront:[
        "Free WiFi",
        "Breakfast",
        "Water View",
        "Restaurant"
    ],

    city:[
        "Free WiFi",
        "Breakfast",
        "Air Conditioning",
        "Airport Transfer"
    ]
};

function createSlug(value){
    return String(value)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g,"-")
        .replace(/^-|-$/g,"");
}

function createHotelImageURL(
    destination,
    hotelNumber
){
    const seed=createSlug(
        `${destination}-hotel-${hotelNumber}`
    );

    return(
        `https://picsum.photos/seed/${seed}/900/600`
    );
}

function createHotelsForDestination(config){
    const slug=createSlug(
        config.destination
    );

    const amenities=
        typeAmenities[config.type]||
        typeAmenities.city;

    const hotelImages=
    hotelImagesByType[config.type]||
    hotelImagesByType.city;

    return[
        {
            id:`HTL-${slug}-01`,
            destination:config.destination,
            name:`${config.destination} Comfort Inn`,
            location:config.city,
            address:
                `Central ${config.city}, ${config.destination}`,
            price:config.basePrice,
            rating:4.2,
            reviewsCount:186,
            image:hotelImages[0],
            amenities:[
                ...amenities
            ],
            roomTypes:[
                {
                    name:"Standard Room",
                    price:config.basePrice,
                    capacity:2
                },
                {
                    name:"Deluxe Room",
                    price:Math.round(
                        config.basePrice*1.25
                    ),
                    capacity:3
                }
            ],
            description:
                `A comfortable and budget-friendly stay in ${config.destination}, suitable for couples, families and solo travelers.`,
            recommendedFor:[
                "Budget travelers",
                "Couples",
                "Short stays"
            ],
            isDemo:true,
            available:true
        },

        {
            id:`HTL-${slug}-02`,
            destination:config.destination,
            name:`${config.city} Grand Residency`,
            location:config.city,
            address:
                `Main Road, ${config.city}`,
            price:Math.round(
                config.basePrice*1.3
            ),
            rating:4.5,
            reviewsCount:324,
            image:hotelImages[1],
            amenities:[
                ...amenities,
                "Room Service"
            ],
            roomTypes:[
                {
                    name:"Deluxe Room",
                    price:Math.round(
                        config.basePrice*1.3
                    ),
                    capacity:2
                },
                {
                    name:"Family Room",
                    price:Math.round(
                        config.basePrice*1.65
                    ),
                    capacity:4
                }
            ],
            description:
                `A well-rated property offering spacious rooms and convenient access to popular attractions in ${config.destination}.`,
            recommendedFor:[
                "Families",
                "Business travelers",
                "Longer stays"
            ],
            isDemo:true,
            available:true
        },

        {
            id:`HTL-${slug}-03`,
            destination:config.destination,
            name:`${config.destination} Heritage Retreat`,
            location:config.city,
            address:
                `Scenic Area, ${config.city}`,
            price:Math.round(
                config.basePrice*1.75
            ),
            rating:4.7,
            reviewsCount:468,
            image:hotelImages[2],
            amenities:[
                ...amenities,
                "Restaurant",
                "Premium Rooms"
            ],
            roomTypes:[
                {
                    name:"Premium Room",
                    price:Math.round(
                        config.basePrice*1.75
                    ),
                    capacity:2
                },
                {
                    name:"Luxury Suite",
                    price:Math.round(
                        config.basePrice*2.25
                    ),
                    capacity:4
                }
            ],
            description:
                `A premium retreat in ${config.destination} with upgraded facilities, scenic surroundings and personalized hospitality.`,
            recommendedFor:[
                "Luxury travelers",
                "Honeymoon couples",
                "Family vacations"
            ],
            isDemo:true,
            available:true
        }
    ];
}

const hotels=destinationConfigs.flatMap(
    createHotelsForDestination
);

module.exports=hotels;