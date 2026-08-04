const twilio=require("twilio");

function getTwilioClient(){
    const accountSid=process.env.TWILIO_ACCOUNT_SID;
    const authToken=process.env.TWILIO_AUTH_TOKEN;

    if(!accountSid||!authToken){
        throw new Error(
            "Twilio Account SID or Auth Token is missing from server/.env"
        );
    }

    return twilio(accountSid,authToken);
}

function normalizePhoneNumber(phone){
    if(!phone){
        return null;
    }

    const cleaned=String(phone)
        .trim()
        .replace(/[\s()-]/g,"");

    // Already contains international country code
    if(/^\+[1-9]\d{7,14}$/.test(cleaned)){
        return cleaned;
    }

    // Convert a valid Indian mobile number into E.164 format
    if(/^[6-9]\d{9}$/.test(cleaned)){
        return `+91${cleaned}`;
    }

    return null;
}

function formatDate(value){
    return new Intl.DateTimeFormat("en-IN",{
        day:"2-digit",
        month:"short",
        year:"numeric"
    }).format(new Date(value));
}

async function sendTestSMS(phone){
    const recipient=normalizePhoneNumber(phone);

    if(!recipient){
        throw new Error(
            "Enter a valid phone number with its country code"
        );
    }

    const sender=process.env.TWILIO_PHONE_NUMBER;

    if(!sender){
        throw new Error(
            "TWILIO_PHONE_NUMBER is missing from server/.env"
        );
    }

    const client=getTwilioClient();

    const message=await client.messages.create({
        body:
            "TripFusion test message. " +
            "Your SMS integration is working successfully.",
        from:sender,
        to:recipient
    });

    return{
        sid:message.sid,
        status:message.status,
        recipient
    };
}

async function sendTripSummarySMS({
    user,
    tripPlan
}){
    const recipient=normalizePhoneNumber(user.phone);

    if(!recipient){
        throw new Error(
            "A valid registered phone number was not found"
        );
    }

    const sender=process.env.TWILIO_PHONE_NUMBER;

    if(!sender){
        throw new Error(
            "TWILIO_PHONE_NUMBER is missing from server/.env"
        );
    }

    const client=getTwilioClient();

    const messageBody=[
        "TripFusion",
        `${tripPlan.destinationName} trip`,
        `Start: ${formatDate(tripPlan.startDate)}`,
        `Duration: ${tripPlan.days} days`,
        `Travelers: ${tripPlan.travelers}`,
        `Budget: INR ${tripPlan.totalBudget}`,
        "Open TripFusion to view the complete itinerary."
    ].join(" | ");

    const message=await client.messages.create({
        body:messageBody,
        from:sender,
        to:recipient
    });

    return{
        sid:message.sid,
        status:message.status,
        recipient
    };
}

module.exports={
    sendTestSMS,
    sendTripSummarySMS,
    normalizePhoneNumber
};