const {Resend}=require("resend");

function getResendClient(){
    if(!process.env.RESEND_API_KEY){
        throw new Error(
            "RESEND_API_KEY is missing from server/.env"
        );
    }

    return new Resend(process.env.RESEND_API_KEY);
}

function escapeHTML(value){
    return String(value??"")
        .replaceAll("&","&amp;")
        .replaceAll("<","&lt;")
        .replaceAll(">","&gt;")
        .replaceAll('"',"&quot;")
        .replaceAll("'","&#039;");
}

function formatCurrency(value){
    return new Intl.NumberFormat("en-IN",{
        style:"currency",
        currency:"INR",
        maximumFractionDigits:0
    }).format(Number(value)||0);
}

function formatDate(value){
    return new Intl.DateTimeFormat("en-IN",{
        day:"2-digit",
        month:"long",
        year:"numeric"
    }).format(new Date(value));
}

function createBudgetHTML(budget={}){
    const items=[
        ["Accommodation",budget.accommodation],
        ["Food",budget.food],
        ["Local Transport",budget.localTransport],
        ["Activities",budget.activities],
        ["Emergency Reserve",budget.emergency]
    ];

    return items.map(([label,value])=>{
        return`
            <tr>
                <td style="
                    border-bottom:1px solid #e4e8ef;
                    padding:11px;
                ">
                    ${escapeHTML(label)}
                </td>

                <td style="
                    border-bottom:1px solid #e4e8ef;
                    padding:11px;
                    text-align:right;
                ">
                    <strong>${formatCurrency(value)}</strong>
                </td>
            </tr>
        `;
    }).join("");
}

function createItineraryHTML(itinerary=[]){
    if(!Array.isArray(itinerary)||itinerary.length===0){
        return"<p>No itinerary details are available.</p>";
    }

    return itinerary.map((item)=>{
        return`
            <div style="
                border:1px solid #e4e8ef;
                border-radius:12px;
                margin-bottom:16px;
                overflow:hidden;
            ">
                <div style="
                    background:#0f4c81;
                    color:#ffffff;
                    font-weight:700;
                    padding:12px 16px;
                ">
                    Day ${Number(item.day)||1}:
                    ${escapeHTML(item.title)}
                </div>

                <div style="
                    background:#ffffff;
                    line-height:1.6;
                    padding:16px;
                ">
                    <p style="margin:0 0 10px">
                        <strong>Morning:</strong>
                        ${escapeHTML(item.morning)}
                    </p>

                    <p style="margin:0 0 10px">
                        <strong>Afternoon:</strong>
                        ${escapeHTML(item.afternoon)}
                    </p>

                    <p style="margin:0">
                        <strong>Evening:</strong>
                        ${escapeHTML(item.evening)}
                    </p>
                </div>
            </div>
        `;
    }).join("");
}

async function sendTripDetailsEmail({user,tripPlan}){
    if(!user?.email){
        throw new Error(
            "No registered email address was found"
        );
    }

    const resend=getResendClient();

    const html=`
        <!DOCTYPE html>
        <html lang="en">
        <body style="
            background:#f4f7fb;
            color:#172033;
            font-family:Arial,Helvetica,sans-serif;
            margin:0;
            padding:30px 15px;
        ">
            <div style="
                background:#ffffff;
                border-radius:16px;
                margin:auto;
                max-width:740px;
                overflow:hidden;
            ">
                <div style="
                    background:#0f4c81;
                    color:#ffffff;
                    padding:32px;
                ">
                    <p style="
                        color:#79dddd;
                        font-size:12px;
                        font-weight:700;
                        letter-spacing:2px;
                        margin:0 0 8px;
                    ">
                        TripFusion
                    </p>

                    <h1 style="margin:0 0 10px">
                        ${escapeHTML(
                            tripPlan.destinationName
                        )} Trip Plan
                    </h1>

                    <p style="
                        color:#dce8ef;
                        margin:0;
                    ">
                        Hello ${escapeHTML(user.fullName)},
                        your saved itinerary is ready.
                    </p>
                </div>

                <div style="padding:30px">
                    <table style="
                        border-collapse:collapse;
                        margin-bottom:28px;
                        width:100%;
                    ">
                        <tr>
                            <td style="padding:8px">
                                <strong>Destination</strong>
                            </td>
                            <td style="
                                padding:8px;
                                text-align:right;
                            ">
                                ${escapeHTML(
                                    tripPlan.destinationName
                                )}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:8px">
                                <strong>Start Date</strong>
                            </td>
                            <td style="
                                padding:8px;
                                text-align:right;
                            ">
                                ${formatDate(tripPlan.startDate)}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:8px">
                                <strong>Duration</strong>
                            </td>
                            <td style="
                                padding:8px;
                                text-align:right;
                            ">
                                ${tripPlan.days} days
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:8px">
                                <strong>Travelers</strong>
                            </td>
                            <td style="
                                padding:8px;
                                text-align:right;
                            ">
                                ${tripPlan.travelers}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:8px">
                                <strong>Total Budget</strong>
                            </td>
                            <td style="
                                padding:8px;
                                text-align:right;
                            ">
                                ${formatCurrency(
                                    tripPlan.totalBudget
                                )}
                            </td>
                        </tr>

                        <tr>
                            <td style="padding:8px">
                                <strong>Travel Style</strong>
                            </td>
                            <td style="
                                padding:8px;
                                text-align:right;
                                text-transform:capitalize;
                            ">
                                ${escapeHTML(
                                    tripPlan.travelStyle
                                )}
                            </td>
                        </tr>
                    </table>

                    <h2 style="color:#0f4c81">
                        Budget Breakdown
                    </h2>

                    <table style="
                        border-collapse:collapse;
                        margin-bottom:30px;
                        width:100%;
                    ">
                        ${createBudgetHTML(
                            tripPlan.budgetBreakdown
                        )}
                    </table>

                    <h2 style="color:#0f4c81">
                        Day-wise Itinerary
                    </h2>

                    ${createItineraryHTML(
                        tripPlan.itinerary
                    )}
                </div>

                <div style="
                    background:#082f50;
                    color:#dce8ef;
                    font-size:13px;
                    padding:18px;
                    text-align:center;
                ">
                    TripFusion — Plan smarter. Travel better.
                </div>
            </div>
        </body>
        </html>
    `;

    const {data,error}=await resend.emails.send({
        from:
            process.env.EMAIL_FROM||
            "TripFusion <onboarding@resend.dev>",

        to:[user.email],

        subject:
            `${tripPlan.destinationName} Trip Plan | TripFusion`,

        html
    });

    if(error){
        throw new Error(
            error.message||
            "Unable to send the trip email"
        );
    }

    return data;
}

async function sendOTPEmail({
    email,
    fullName,
    otp
}){
    if(!email){
        throw new Error(
            "Email address is required to send an OTP"
        );
    }

    const resend=getResendClient();

    const{
        data,
        error
    }=await resend.emails.send({
        from:
            process.env.EMAIL_FROM||
            "TripFusion <onboarding@resend.dev>",

        to:[
            email
        ],

        subject:"Verify Your TripFusion Account",

        html:`
            <!DOCTYPE html>
            <html lang="en">
            <body style="
                background:#f4f7fb;
                color:#172033;
                font-family:Arial,Helvetica,sans-serif;
                margin:0;
                padding:30px 15px;
            ">
                <div style="
                    background:#ffffff;
                    border-radius:16px;
                    box-shadow:0 8px 30px rgba(15,76,129,0.10);
                    margin:auto;
                    max-width:600px;
                    overflow:hidden;
                ">
                    <div style="
                        background:linear-gradient(
                            135deg,
                            #082f50,
                            #0f4c81
                        );
                        color:#ffffff;
                        padding:32px;
                        text-align:center;
                    ">
                        <p style="
                            color:#78dddd;
                            font-size:12px;
                            font-weight:700;
                            letter-spacing:2px;
                            margin:0 0 8px;
                        ">
                            TripFusion
                        </p>

                        <h1 style="margin:0">
                            Verify Your Email
                        </h1>
                    </div>

                    <div style="
                        line-height:1.7;
                        padding:34px;
                        text-align:center;
                    ">
                        <p>
                            Hello ${escapeHTML(fullName)},
                        </p>

                        <p>
                            Enter the verification code below to
                            complete your TripFusion registration.
                        </p>

                        <div style="
                            background:#eaf4f8;
                            border:1px solid #d5e8ef;
                            border-radius:12px;
                            color:#0f4c81;
                            display:inline-block;
                            font-size:35px;
                            font-weight:800;
                            letter-spacing:9px;
                            margin:22px 0;
                            padding:17px 24px;
                        ">
                            ${escapeHTML(otp)}
                        </div>

                        <p style="
                            color:#637083;
                            font-size:14px;
                        ">
                            This OTP expires in 10 minutes.
                        </p>

                        <p style="
                            color:#637083;
                            font-size:14px;
                        ">
                            Do not share this verification code
                            with anyone.
                        </p>
                    </div>

                    <div style="
                        background:#082f50;
                        color:#dce8ef;
                        font-size:13px;
                        padding:17px;
                        text-align:center;
                    ">
                        TripFusion — Plan smarter. Travel better.
                    </div>
                </div>
            </body>
            </html>
        `
    });

    if(error){
        throw new Error(
            error.message||
            "Unable to send verification OTP"
        );
    }

    return data;
}

async function sendPasswordResetOTPEmail({
    email,
    fullName,
    otp
}){
    if(!email){
        throw new Error(
            "Email address is required"
        );
    }

    const resend=getResendClient();

    const{
        data,
        error
    }=await resend.emails.send({
        from:
            process.env.EMAIL_FROM||
            "TripFusion <onboarding@resend.dev>",

        to:[email],

        subject:"Reset Your TripFusion Password",

        html:`
            <!DOCTYPE html>
            <html lang="en">
            <body style="
                background:#f4f7fb;
                font-family:Arial,Helvetica,sans-serif;
                margin:0;
                padding:30px 15px;
            ">
                <div style="
                    background:#ffffff;
                    border-radius:16px;
                    margin:auto;
                    max-width:600px;
                    overflow:hidden;
                ">
                    <div style="
                        background:#0f4c81;
                        color:#ffffff;
                        padding:32px;
                        text-align:center;
                    ">
                        <p style="
                            color:#79dddd;
                            font-size:12px;
                            font-weight:700;
                            letter-spacing:2px;
                            margin:0 0 8px;
                        ">
                            TripFusion
                        </p>

                        <h1 style="margin:0">
                            Password Reset
                        </h1>
                    </div>

                    <div style="
                        color:#172033;
                        line-height:1.7;
                        padding:34px;
                        text-align:center;
                    ">
                        <p>
                            Hello ${escapeHTML(fullName)},
                        </p>

                        <p>
                            Use the OTP below to reset your
                            TripFusion password.
                        </p>

                        <div style="
                            background:#eaf4f8;
                            border-radius:12px;
                            color:#0f4c81;
                            display:inline-block;
                            font-size:35px;
                            font-weight:800;
                            letter-spacing:9px;
                            margin:22px 0;
                            padding:17px 24px;
                        ">
                            ${escapeHTML(otp)}
                        </div>

                        <p style="
                            color:#637083;
                            font-size:14px;
                        ">
                            This OTP expires in 10 minutes.
                        </p>

                        <p style="
                            color:#637083;
                            font-size:14px;
                        ">
                            Ignore this email if you did not
                            request a password reset.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `
    });

    if(error){
        throw new Error(
            error.message||
            "Unable to send password reset OTP"
        );
    }

    return data;
}

module.exports={
    sendTripDetailsEmail,
    sendOTPEmail,
    sendPasswordResetOTPEmail
};