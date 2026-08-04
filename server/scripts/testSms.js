require("dotenv").config();

const{
    sendTestSMS
}=require("../services/smsService");

async function testSMS(){
    try{
        /*
         * Replace this with the mobile number you verified
         * in Twilio. Include the country code.
         */
        const verifiedPhoneNumber="+919912610051";

        console.log("Sending test SMS...");

        const result=await sendTestSMS(
            verifiedPhoneNumber
        );

        console.log("SMS request completed successfully");
        console.log("Message SID:",result.sid);
        console.log("Status:",result.status);
        console.log("Recipient:",result.recipient);

        process.exit(0);
    }catch(error){
        console.error(
            "SMS test failed:",
            error.message
        );

        if(error.code){
            console.error(
                "Twilio error code:",
                error.code
            );
        }

        if(error.moreInfo){
            console.error(
                "More information:",
                error.moreInfo
            );
        }

        process.exit(1);
    }
}

testSMS();