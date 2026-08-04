const destinations=[
    {
        name:"Goa",
        country:"India",
        state:"Goa",
        city:"Panaji",
        category:"Beach",
        shortDescription:
            "A lively coastal destination known for beaches, nightlife and Portuguese heritage.",
        description:
            "Goa is one of India's most popular coastal destinations, offering beautiful beaches, water sports, historic churches, local markets and vibrant nightlife.",
        rating:4.8,
        reviewsCount:1250,
        startingPrice:12000,
        currency:"INR",
        bestSeason:"November to February",
        duration:"4 to 5 days",
        image:
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
        gallery:[
            "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2",
            "https://images.unsplash.com/photo-1560179406-1c6c60e0dc76"
        ],
        latitude:15.2993,
        longitude:74.124,
        popular:true,
        featured:true,
        activities:[
            {
                name:"Beach Hopping",
                description:"Explore Baga, Calangute and Anjuna beaches.",
                estimatedCost:1000,
                duration:"Full day"
            },
            {
                name:"Water Sports",
                description:"Enjoy parasailing, jet skiing and banana rides.",
                estimatedCost:2500,
                duration:"3 hours"
            }
        ],
        nearbyPlaces:[
            {
                name:"Dudhsagar Falls",
                distance:"60 km",
                description:"A spectacular four-tiered waterfall."
            },
            {
                name:"Old Goa",
                distance:"10 km",
                description:"Historic churches and Portuguese architecture."
            }
        ],
        tags:[
            "beach",
            "nightlife",
            "water sports",
            "coastal"
        ],
        languages:[
            "Konkani",
            "English",
            "Hindi"
        ],
        localFood:[
            "Goan Fish Curry",
            "Bebinca",
            "Prawn Balchao"
        ],
        safetyTips:[
            "Avoid isolated beaches late at night.",
            "Use licensed taxis and rental vehicles."
        ],
        transportationInfo:
            "Goa is accessible by flight, train and road. Local travel options include taxis, rental scooters and buses."
    },

    {
        name:"Manali",
        country:"India",
        state:"Himachal Pradesh",
        city:"Manali",
        category:"Hill Station",
        shortDescription:
            "A scenic Himalayan town popular for snow, adventure activities and mountain views.",
        description:
            "Manali is a beautiful Himalayan destination surrounded by snow-covered peaks, forests and river valleys. It is popular among couples, families and adventure travelers.",
        rating:4.7,
        reviewsCount:980,
        startingPrice:15000,
        currency:"INR",
        bestSeason:"October to June",
        duration:"5 to 6 days",
        image:
            "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23",
        gallery:[
            "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23",
            "https://images.unsplash.com/photo-1605649487212-47bdab064df7"
        ],
        latitude:32.2432,
        longitude:77.1892,
        popular:true,
        featured:true,
        activities:[
            {
                name:"Solang Valley Adventure",
                description:"Try paragliding, skiing and ropeway rides.",
                estimatedCost:3000,
                duration:"Full day"
            },
            {
                name:"Old Manali Walk",
                description:"Explore cafés, traditional homes and local shops.",
                estimatedCost:500,
                duration:"Half day"
            }
        ],
        nearbyPlaces:[
            {
                name:"Solang Valley",
                distance:"13 km",
                description:"Popular for snow activities and adventure sports."
            },
            {
                name:"Rohtang Pass",
                distance:"51 km",
                description:"A high-altitude mountain pass with snow views."
            }
        ],
        tags:[
            "mountains",
            "snow",
            "adventure",
            "honeymoon"
        ],
        languages:[
            "Hindi",
            "English",
            "Himachali"
        ],
        localFood:[
            "Siddu",
            "Dham",
            "Tudkiya Bhath"
        ],
        safetyTips:[
            "Carry warm clothing even during summer evenings.",
            "Check weather and road conditions before visiting high passes."
        ],
        transportationInfo:
            "Manali is mainly accessible by road. Buses and taxis operate from Chandigarh and Delhi."
    },

    {
        name:"Jaipur",
        country:"India",
        state:"Rajasthan",
        city:"Jaipur",
        category:"Heritage",
        shortDescription:
            "The Pink City is famous for royal palaces, historic forts and colorful markets.",
        description:
            "Jaipur offers a rich combination of royal architecture, cultural traditions, handicraft markets and Rajasthani cuisine. It forms part of India's famous Golden Triangle.",
        rating:4.6,
        reviewsCount:870,
        startingPrice:10000,
        currency:"INR",
        bestSeason:"October to March",
        duration:"3 to 4 days",
        image:
            "https://images.unsplash.com/photo-1599661046289-e31897846e41",
        gallery:[
            "https://images.unsplash.com/photo-1599661046289-e31897846e41",
            "https://images.unsplash.com/photo-1477587458883-47145ed94245"
        ],
        latitude:26.9124,
        longitude:75.7873,
        popular:true,
        featured:true,
        activities:[
            {
                name:"Amber Fort Visit",
                description:"Explore courtyards, palaces and hilltop views.",
                estimatedCost:800,
                duration:"3 hours"
            },
            {
                name:"Old City Market Tour",
                description:"Shop for textiles, jewelry and handicrafts.",
                estimatedCost:1500,
                duration:"Half day"
            }
        ],
        nearbyPlaces:[
            {
                name:"Nahargarh Fort",
                distance:"18 km",
                description:"A hilltop fort offering panoramic city views."
            },
            {
                name:"Jal Mahal",
                distance:"7 km",
                description:"A palace situated in the middle of Man Sagar Lake."
            }
        ],
        tags:[
            "heritage",
            "forts",
            "palaces",
            "culture"
        ],
        languages:[
            "Hindi",
            "English",
            "Rajasthani"
        ],
        localFood:[
            "Dal Baati Churma",
            "Ghewar",
            "Pyaaz Kachori"
        ],
        safetyTips:[
            "Use authorized guides at major monuments.",
            "Carry water while exploring outdoor attractions."
        ],
        transportationInfo:
            "Jaipur is connected by air, rail and road. Auto-rickshaws, buses and taxis are available locally."
    },

    {
        name:"Munnar",
        country:"India",
        state:"Kerala",
        city:"Munnar",
        category:"Nature",
        shortDescription:
            "A peaceful hill destination surrounded by tea plantations, waterfalls and green valleys.",
        description:
            "Munnar is a scenic hill station in Kerala known for vast tea estates, misty mountains, wildlife sanctuaries and pleasant weather.",
        rating:4.7,
        reviewsCount:760,
        startingPrice:13000,
        currency:"INR",
        bestSeason:"September to March",
        duration:"4 to 5 days",
        image:
            "https://images.unsplash.com/photo-1593693411515-c20261bcad6e",
        gallery:[
            "https://images.unsplash.com/photo-1593693411515-c20261bcad6e",
            "https://images.unsplash.com/photo-1544735716-392fe2489ffa"
        ],
        latitude:10.0889,
        longitude:77.0595,
        popular:true,
        featured:true,
        activities:[
            {
                name:"Tea Plantation Tour",
                description:"Learn about tea production and visit green estates.",
                estimatedCost:700,
                duration:"3 hours"
            },
            {
                name:"Eravikulam National Park",
                description:"Explore wildlife and mountain landscapes.",
                estimatedCost:500,
                duration:"Half day"
            }
        ],
        nearbyPlaces:[
            {
                name:"Mattupetty Dam",
                distance:"13 km",
                description:"A scenic reservoir surrounded by hills."
            },
            {
                name:"Top Station",
                distance:"32 km",
                description:"A viewpoint famous for panoramic valley scenery."
            }
        ],
        tags:[
            "tea gardens",
            "nature",
            "hill station",
            "relaxation"
        ],
        languages:[
            "Malayalam",
            "English",
            "Tamil"
        ],
        localFood:[
            "Appam and Stew",
            "Kerala Parotta",
            "Puttu and Kadala"
        ],
        safetyTips:[
            "Drive carefully on winding mountain roads.",
            "Carry rain protection during monsoon months."
        ],
        transportationInfo:
            "The nearest airports are Kochi and Coimbatore. Buses and taxis connect Munnar with nearby cities."
    },

    {
        name:"Rishikesh",
        country:"India",
        state:"Uttarakhand",
        city:"Rishikesh",
        category:"Adventure",
        shortDescription:
            "A riverside destination known for rafting, yoga, spirituality and Himalayan adventures.",
        description:
            "Rishikesh lies along the River Ganges and attracts adventure travelers, yoga practitioners and spiritual visitors from around the world.",
        rating:4.6,
        reviewsCount:690,
        startingPrice:9000,
        currency:"INR",
        bestSeason:"September to April",
        duration:"3 to 4 days",
        image:
            "https://images.unsplash.com/photo-1588286840104-8957b019727f",
        gallery:[
            "https://images.unsplash.com/photo-1588286840104-8957b019727f",
            "https://images.unsplash.com/photo-1603867106100-0d2039fc8757"
        ],
        latitude:30.0869,
        longitude:78.2676,
        popular:true,
        featured:false,
        activities:[
            {
                name:"River Rafting",
                description:"Experience guided white-water rafting on the Ganges.",
                estimatedCost:1800,
                duration:"3 hours"
            },
            {
                name:"Evening Ganga Aarti",
                description:"Attend the spiritual ceremony at Triveni Ghat.",
                estimatedCost:0,
                duration:"2 hours"
            }
        ],
        nearbyPlaces:[
            {
                name:"Neer Garh Waterfall",
                distance:"6 km",
                description:"A waterfall reached through a short trekking route."
            },
            {
                name:"Haridwar",
                distance:"21 km",
                description:"A major pilgrimage city on the River Ganges."
            }
        ],
        tags:[
            "rafting",
            "yoga",
            "spirituality",
            "adventure"
        ],
        languages:[
            "Hindi",
            "English",
            "Garhwali"
        ],
        localFood:[
            "Aloo Puri",
            "Kachori",
            "North Indian Thali"
        ],
        safetyTips:[
            "Use certified operators for rafting and adventure activities.",
            "Follow river-safety instructions carefully."
        ],
        transportationInfo:
            "Rishikesh is connected by road and rail. The nearest airport is Jolly Grant Airport in Dehradun."
    },

    {
        name:"Hampi",
        country:"India",
        state:"Karnataka",
        city:"Hampi",
        category:"Heritage",
        shortDescription:
            "A UNESCO heritage destination featuring ancient ruins, temples and unique rocky landscapes.",
        description:
            "Hampi was once the capital of the Vijayanagara Empire. Today it contains impressive temples, royal structures, monuments and dramatic boulder-covered scenery.",
        rating:4.7,
        reviewsCount:580,
        startingPrice:8000,
        currency:"INR",
        bestSeason:"October to February",
        duration:"3 days",
        image:
            "https://images.unsplash.com/photo-1600100397608-f010f6c1cb85",
        gallery:[
            "https://images.unsplash.com/photo-1600100397608-f010f6c1cb85",
            "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1"
        ],
        latitude:15.335,
        longitude:76.46,
        popular:false,
        featured:true,
        activities:[
            {
                name:"Temple Exploration",
                description:"Visit Virupaksha Temple and Vittala Temple.",
                estimatedCost:500,
                duration:"Full day"
            },
            {
                name:"Matanga Hill Sunrise",
                description:"Hike to a viewpoint overlooking the ruins.",
                estimatedCost:0,
                duration:"2 hours"
            }
        ],
        nearbyPlaces:[
            {
                name:"Anegundi",
                distance:"20 km",
                description:"A historic village across the Tungabhadra River."
            },
            {
                name:"Tungabhadra Dam",
                distance:"25 km",
                description:"A large dam and scenic recreational area."
            }
        ],
        tags:[
            "unesco",
            "history",
            "temples",
            "architecture"
        ],
        languages:[
            "Kannada",
            "English",
            "Hindi"
        ],
        localFood:[
            "South Indian Meals",
            "Ragi Mudde",
            "Bisi Bele Bath"
        ],
        safetyTips:[
            "Wear comfortable shoes while exploring the ruins.",
            "Carry water because many attractions have limited shade."
        ],
        transportationInfo:
            "Hospet is the nearest railway station. Buses, autos and rental bicycles are available for local travel."
    }
];

const additionalPlaces=[
    {
        name:"Ooty",
        state:"Tamil Nadu",
        city:"Ooty",
        category:"Hill Station",
        latitude:11.4064,
        longitude:76.6932,
        startingPrice:12000,
        bestSeason:"October to June",
        duration:"3 to 4 days",
        shortDescription:
            "A beautiful hill station known for tea gardens, lakes and Nilgiri mountain views.",
        activity:"Nilgiri Mountain Railway",
        nearbyPlace:"Coonoor"
    },
    {
        name:"Kodaikanal",
        state:"Tamil Nadu",
        city:"Kodaikanal",
        category:"Hill Station",
        latitude:10.2381,
        longitude:77.4892,
        startingPrice:11000,
        bestSeason:"October to June",
        duration:"3 days",
        shortDescription:
            "A peaceful hill destination featuring forests, waterfalls, viewpoints and a scenic lake.",
        activity:"Kodaikanal Lake Boating",
        nearbyPlace:"Pillar Rocks"
    },
    {
        name:"Coorg",
        state:"Karnataka",
        city:"Madikeri",
        category:"Nature",
        latitude:12.4244,
        longitude:75.7382,
        startingPrice:13000,
        bestSeason:"October to March",
        duration:"3 to 4 days",
        shortDescription:
            "A scenic destination famous for coffee plantations, waterfalls and mist-covered hills.",
        activity:"Coffee Plantation Tour",
        nearbyPlace:"Abbey Falls"
    },
    {
        name:"Wayanad",
        state:"Kerala",
        city:"Kalpetta",
        category:"Nature",
        latitude:11.6854,
        longitude:76.132,
        startingPrice:12000,
        bestSeason:"October to May",
        duration:"3 to 4 days",
        shortDescription:
            "A green travel destination offering forests, caves, waterfalls and wildlife experiences.",
        activity:"Edakkal Caves Trek",
        nearbyPlace:"Banasura Sagar Dam"
    },
    {
        name:"Alleppey",
        state:"Kerala",
        city:"Alappuzha",
        category:"Nature",
        latitude:9.4981,
        longitude:76.3388,
        startingPrice:14000,
        bestSeason:"November to February",
        duration:"2 to 3 days",
        shortDescription:
            "A relaxing backwater destination known for houseboats, canals and village landscapes.",
        activity:"Houseboat Cruise",
        nearbyPlace:"Kumarakom"
    },
    {
        name:"Pondicherry",
        state:"Puducherry",
        city:"Puducherry",
        category:"Beach",
        latitude:11.9416,
        longitude:79.8083,
        startingPrice:10000,
        bestSeason:"October to March",
        duration:"3 days",
        shortDescription:
            "A coastal destination featuring French architecture, peaceful beaches and attractive cafés.",
        activity:"White Town Heritage Walk",
        nearbyPlace:"Auroville"
    },
    {
        name:"Udaipur",
        state:"Rajasthan",
        city:"Udaipur",
        category:"Heritage",
        latitude:24.5854,
        longitude:73.7125,
        startingPrice:13000,
        bestSeason:"October to March",
        duration:"3 to 4 days",
        shortDescription:
            "A romantic heritage city famous for lakes, royal palaces and beautiful architecture.",
        activity:"Lake Pichola Boat Ride",
        nearbyPlace:"Kumbhalgarh Fort"
    },
    {
        name:"Jaisalmer",
        state:"Rajasthan",
        city:"Jaisalmer",
        category:"Cultural",
        latitude:26.9157,
        longitude:70.9083,
        startingPrice:15000,
        bestSeason:"October to March",
        duration:"3 to 4 days",
        shortDescription:
            "A desert city known for its golden fort, sand dunes and traditional Rajasthani culture.",
        activity:"Desert Safari",
        nearbyPlace:"Sam Sand Dunes"
    },
    {
        name:"Agra",
        state:"Uttar Pradesh",
        city:"Agra",
        category:"Heritage",
        latitude:27.1767,
        longitude:78.0081,
        startingPrice:9000,
        bestSeason:"October to March",
        duration:"2 days",
        shortDescription:
            "A historic city containing the Taj Mahal and several important Mughal monuments.",
        activity:"Taj Mahal Visit",
        nearbyPlace:"Fatehpur Sikri"
    },
    {
        name:"Varanasi",
        state:"Uttar Pradesh",
        city:"Varanasi",
        category:"Pilgrimage",
        latitude:25.3176,
        longitude:82.9739,
        startingPrice:9000,
        bestSeason:"October to March",
        duration:"3 days",
        shortDescription:
            "An ancient spiritual destination known for sacred ghats, temples and cultural traditions.",
        activity:"Evening Ganga Aarti",
        nearbyPlace:"Sarnath"
    },
    {
        name:"Darjeeling",
        state:"West Bengal",
        city:"Darjeeling",
        category:"Hill Station",
        latitude:27.041,
        longitude:88.2663,
        startingPrice:13000,
        bestSeason:"March to May and October to December",
        duration:"4 days",
        shortDescription:
            "A Himalayan hill station known for tea gardens, mountain views and heritage railways.",
        activity:"Tiger Hill Sunrise",
        nearbyPlace:"Kalimpong"
    },
    {
        name:"Gangtok",
        state:"Sikkim",
        city:"Gangtok",
        category:"Hill Station",
        latitude:27.3389,
        longitude:88.6065,
        startingPrice:15000,
        bestSeason:"March to June and October to December",
        duration:"4 to 5 days",
        shortDescription:
            "A mountain destination offering monasteries, lakes, viewpoints and peaceful surroundings.",
        activity:"Tsomgo Lake Visit",
        nearbyPlace:"Nathula Pass"
    },
    {
        name:"Shillong",
        state:"Meghalaya",
        city:"Shillong",
        category:"Nature",
        latitude:25.5788,
        longitude:91.8933,
        startingPrice:14000,
        bestSeason:"September to May",
        duration:"4 days",
        shortDescription:
            "A green hill destination known for waterfalls, music culture and pleasant weather.",
        activity:"Shillong Waterfall Tour",
        nearbyPlace:"Cherrapunji"
    },
    {
        name:"Cherrapunji",
        state:"Meghalaya",
        city:"Sohra",
        category:"Nature",
        latitude:25.2702,
        longitude:91.7323,
        startingPrice:13000,
        bestSeason:"October to May",
        duration:"3 days",
        shortDescription:
            "A nature destination famous for living root bridges, caves and spectacular waterfalls.",
        activity:"Living Root Bridge Trek",
        nearbyPlace:"Mawsynram"
    },
    {
        name:"Andaman Islands",
        state:"Andaman and Nicobar Islands",
        city:"Port Blair",
        category:"Beach",
        latitude:11.6234,
        longitude:92.7265,
        startingPrice:25000,
        bestSeason:"October to May",
        duration:"5 to 7 days",
        shortDescription:
            "A tropical island destination offering clear beaches, snorkeling and marine experiences.",
        activity:"Scuba Diving",
        nearbyPlace:"Havelock Island"
    },
    {
        name:"Leh Ladakh",
        state:"Ladakh",
        city:"Leh",
        category:"Adventure",
        latitude:34.1526,
        longitude:77.5771,
        startingPrice:22000,
        bestSeason:"May to September",
        duration:"6 to 8 days",
        shortDescription:
            "A high-altitude destination known for mountain roads, monasteries and dramatic landscapes.",
        activity:"Pangong Lake Road Trip",
        nearbyPlace:"Nubra Valley"
    },
    {
        name:"Srinagar",
        state:"Jammu and Kashmir",
        city:"Srinagar",
        category:"Honeymoon",
        latitude:34.0837,
        longitude:74.7973,
        startingPrice:18000,
        bestSeason:"April to October",
        duration:"5 days",
        shortDescription:
            "A scenic destination famous for Dal Lake, gardens, houseboats and mountain views.",
        activity:"Dal Lake Shikara Ride",
        nearbyPlace:"Gulmarg"
    },
    {
        name:"Auli",
        state:"Uttarakhand",
        city:"Auli",
        category:"Adventure",
        latitude:30.5286,
        longitude:79.5664,
        startingPrice:17000,
        bestSeason:"December to March",
        duration:"4 days",
        shortDescription:
            "A Himalayan destination known for skiing, snow-covered slopes and panoramic views.",
        activity:"Skiing",
        nearbyPlace:"Joshimath"
    },
    {
        name:"Hyderabad",
        state:"Telangana",
        city:"Hyderabad",
        category:"Cultural",
        latitude:17.385,
        longitude:78.4867,
        startingPrice:10000,
        bestSeason:"October to February",
        duration:"3 days",
        shortDescription:
            "A historic city offering monuments, markets, modern attractions and famous cuisine.",
        activity:"Charminar Heritage Tour",
        nearbyPlace:"Ramoji Film City"
    },
    {
        name:"Visakhapatnam",
        state:"Andhra Pradesh",
        city:"Visakhapatnam",
        category:"Beach",
        latitude:17.6868,
        longitude:83.2185,
        startingPrice:10000,
        bestSeason:"October to March",
        duration:"3 days",
        shortDescription:
            "A coastal city featuring beaches, green hills, museums and scenic viewpoints.",
        activity:"RK Beach Visit",
        nearbyPlace:"Araku Valley"
    },
    {
        name:"Araku Valley",
        state:"Andhra Pradesh",
        city:"Araku",
        category:"Nature",
        latitude:18.3273,
        longitude:82.8775,
        startingPrice:9000,
        bestSeason:"October to March",
        duration:"2 to 3 days",
        shortDescription:
            "A peaceful valley known for coffee plantations, caves and tribal cultural experiences.",
        activity:"Borra Caves Visit",
        nearbyPlace:"Lambasingi"
    },
    {
        name:"Tirupati",
        state:"Andhra Pradesh",
        city:"Tirupati",
        category:"Pilgrimage",
        latitude:13.6288,
        longitude:79.4192,
        startingPrice:8000,
        bestSeason:"September to March",
        duration:"2 days",
        shortDescription:
            "A major pilgrimage destination famous for temples, traditions and surrounding hills.",
        activity:"Tirumala Temple Visit",
        nearbyPlace:"Srikalahasti"
    },
    {
        name:"Gokarna",
        state:"Karnataka",
        city:"Gokarna",
        category:"Beach",
        latitude:14.5479,
        longitude:74.3188,
        startingPrice:9000,
        bestSeason:"October to March",
        duration:"3 days",
        shortDescription:
            "A peaceful coastal town offering quiet beaches, temple heritage and coastal trekking.",
        activity:"Gokarna Beach Trek",
        nearbyPlace:"Murudeshwar"
    },
    {
        name:"Dandeli",
        state:"Karnataka",
        city:"Dandeli",
        category:"Adventure",
        latitude:15.2477,
        longitude:74.6297,
        startingPrice:11000,
        bestSeason:"October to May",
        duration:"3 days",
        shortDescription:
            "An adventure destination known for river rafting, forests and wildlife activities.",
        activity:"Kali River Rafting",
        nearbyPlace:"Syntheri Rocks"
    },
    {
        name:"Chikmagalur",
        state:"Karnataka",
        city:"Chikmagalur",
        category:"Nature",
        latitude:13.3161,
        longitude:75.772,
        startingPrice:11000,
        bestSeason:"September to March",
        duration:"3 days",
        shortDescription:
            "A hill destination known for coffee plantations, waterfalls and trekking routes.",
        activity:"Mullayanagiri Trek",
        nearbyPlace:"Bhadra Wildlife Sanctuary"
    },
    {
        name:"Rann of Kutch",
        state:"Gujarat",
        city:"Bhuj",
        category:"Cultural",
        latitude:23.7337,
        longitude:69.8597,
        startingPrice:16000,
        bestSeason:"November to February",
        duration:"3 to 4 days",
        shortDescription:
            "A unique white salt desert famous for handicrafts, festivals and cultural experiences.",
        activity:"White Rann Sunset Visit",
        nearbyPlace:"Mandvi"
    },
    {
        name:"Lonavala",
        state:"Maharashtra",
        city:"Lonavala",
        category:"Weekend Getaway",
        latitude:18.7546,
        longitude:73.4062,
        startingPrice:8000,
        bestSeason:"June to February",
        duration:"2 days",
        shortDescription:
            "A popular weekend destination featuring monsoon greenery, forts and viewpoints.",
        activity:"Tiger Point Visit",
        nearbyPlace:"Khandala"
    },
    {
        name:"Mahabaleshwar",
        state:"Maharashtra",
        city:"Mahabaleshwar",
        category:"Hill Station",
        latitude:17.9307,
        longitude:73.6477,
        startingPrice:10000,
        bestSeason:"October to June",
        duration:"3 days",
        shortDescription:
            "A hill station known for strawberry farms, lakes, viewpoints and cool weather.",
        activity:"Venna Lake Boating",
        nearbyPlace:"Panchgani"
    },
    {
        name:"Kanyakumari",
        state:"Tamil Nadu",
        city:"Kanyakumari",
        category:"Cultural",
        latitude:8.0883,
        longitude:77.5385,
        startingPrice:9000,
        bestSeason:"October to March",
        duration:"2 to 3 days",
        shortDescription:
            "India's southern coastal destination known for sunrise, sunset and ocean viewpoints.",
        activity:"Vivekananda Rock Visit",
        nearbyPlace:"Suchindram"
    },
    {
        name:"Rameswaram",
        state:"Tamil Nadu",
        city:"Rameswaram",
        category:"Pilgrimage",
        latitude:9.2876,
        longitude:79.3129,
        startingPrice:10000,
        bestSeason:"October to April",
        duration:"2 to 3 days",
        shortDescription:
            "A coastal pilgrimage destination known for temples, bridges and spiritual significance.",
        activity:"Ramanathaswamy Temple Visit",
        nearbyPlace:"Dhanushkodi"
    }
];

const fallbackImage=
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee";

const additionalDestinations=additionalPlaces.map(
    (place,index)=>{
        return{
            name:place.name,
            country:"India",
            state:place.state,
            city:place.city,
            category:place.category,

            shortDescription:place.shortDescription,

            description:
                `${place.name} is a popular Indian travel destination. `+
                `${place.shortDescription} The destination provides `+
                `memorable attractions, local cuisine, cultural experiences `+
                `and suitable activities for different travelers.`,

            rating:Number(
                (4.2+(index%7)*0.1).toFixed(1)
            ),

            reviewsCount:300+(index*27),

            startingPrice:place.startingPrice,
            currency:"INR",
            bestSeason:place.bestSeason,
            duration:place.duration,

            image:fallbackImage,

            gallery:[
                fallbackImage
            ],

            latitude:place.latitude,
            longitude:place.longitude,

            popular:index%3===0,
            featured:index%5===0,

            activities:[
                {
                    name:place.activity,
                    description:
                        `Experience ${place.activity} during your visit `+
                        `to ${place.name}.`,
                    estimatedCost:800+(index%5)*400,
                    duration:"Half day"
                }
            ],

            nearbyPlaces:[
                {
                    name:place.nearbyPlace,
                    distance:"Nearby",
                    description:
                        `${place.nearbyPlace} is a recommended attraction `+
                        `near ${place.name}.`
                }
            ],

            tags:[
                place.category.toLowerCase(),
                place.state.toLowerCase(),
                place.city.toLowerCase()
            ],

            languages:[
                "Hindi",
                "English"
            ],

            localFood:[
                "Regional Cuisine",
                "Local Snacks"
            ],

            safetyTips:[
                "Check the local weather before traveling.",
                "Use verified transportation and authorized guides."
            ],

            transportationInfo:
                `${place.name} can be reached by road, rail or air, `+
                `depending on the nearest major transportation hub.`,

            isPublished:true
        };
    }
);

destinations.push(...additionalDestinations);

const imageMap={
    "Goa":"goa.jpg",
    "Manali":"manali.jpg",
    "Jaipur":"jaipur.jpg",
    "Munnar":"munnar.jpg",
    "Rishikesh":"rishikesh.jpg",
    "Hampi":"hampi.jpg",
    "Ooty":"ooty.jpg",
    "Kodaikanal":"kodaikanal.jpg",
    "Coorg":"coorg.jpg",
    "Wayanad":"wayanad.jpg",
    "Alleppey":"alleppey.jpg",
    "Pondicherry":"pondicherry.jpg",
    "Udaipur":"udaipur.jpg",
    "Jaisalmer":"jaisalmer.jpg",
    "Agra":"agra.jpg",
    "Varanasi":"varanasi.jpg",
    "Darjeeling":"darjeeling.jpg",
    "Gangtok":"gangtok.jpg",
    "Shillong":"shillong.jpg",
    "Cherrapunji":"cherrapunji.jpg",
    "Andaman Islands":"andaman-islands.jpg",
    "Leh Ladakh":"leh-ladakh.jpg",
    "Srinagar":"srinagar.jpg",
    "Auli":"auli.jpg",
    "Hyderabad":"hyderabad.jpg",
    "Visakhapatnam":"visakhapatnam.jpg",
    "Araku Valley":"araku-valley.jpg",
    "Tirupati":"tirupati.jpg",
    "Gokarna":"gokarna.jpg",
    "Dandeli":"dandeli.jpg",
    "Chikmagalur":"chikmagalur.jpg",
    "Rann of Kutch":"rann-of-kutch.jpg",
    "Lonavala":"lonavala.jpg",
    "Mahabaleshwar":"mahabaleshwar.jpg",
    "Kanyakumari":"kanyakumari.jpg",
    "Rameswaram":"rameswaram.jpg"
};

destinations.forEach((destination)=>{
    const fileName=imageMap[destination.name];

    if(fileName){
        destination.image=
            `./assets/images/destinations/${fileName}`;

        destination.gallery=[
            `./assets/images/destinations/${fileName}`
        ];
    }
});

module.exports=destinations;