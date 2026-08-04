const nodemailer=require("nodemailer");

function getEmailTransporter(){
    if(
        !process.env.GMAIL_USER||
        !process.env.GMAIL_APP_PASSWORD
    ){
        throw new Error(
            "GMAIL_USER or GMAIL_APP_PASSWORD is missing"
        );
    }

    return nodemailer.createTransport({
        host:"smtp.gmail.com",
        port:465,
        secure:true,

        auth:{
            user:process.env.GMAIL_USER,
            pass:process.env.GMAIL_APP_PASSWORD
        },

        connectionTimeout:15000,
        greetingTimeout:15000,
        socketTimeout:20000
    });
}

function getSender(){
    return`TripFusion <${process.env.GMAIL_USER}>`;
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
    const date=new Date(value);

    if(Number.isNaN(date.getTime())){
        return"Not specified";
    }

    return new Intl.DateTimeFormat("en-IN",{
        day:"2-digit",
        month:"long",
        year:"numeric"
    }).format(date);
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
                    <strong>
                        ${formatCurrency(value)}
                    </strong>
                </td>
            </tr>
        `;
    }).join("");
}

function createItineraryHTML(itinerary=[]){
    if(
        !Array.isArray(itinerary)||
        itinerary.length===0
    ){
        return`
            <p style="
                color:#637083;
                line-height:1.7;
            ">
                No itinerary details are available.
            </p>
        `;
    }

    return itinerary.map((item,index)=>{
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
                    Day ${
                        Number(item.day)||
                        index+1
                    }:
                    ${
                        escapeHTML(
                            item.title||
                            "Trip activities"
                        )
                    }
                </div>

                <div style="
                    background:#ffffff;
                    line-height:1.7;
                    padding:16px;
                ">
                    <p style="margin:0 0 10px">
                        <strong>Morning:</strong>
                        ${
                            escapeHTML(
                                item.morning||
                                "No morning activity added."
                            )
                        }
                    </p>

                    <p style="margin:0 0 10px">
                        <strong>Afternoon:</strong>
                        ${
                            escapeHTML(
                                item.afternoon||
                                "No afternoon activity added."
                            )
                        }
                    </p>

                    <p style="margin:0">
                        <strong>Evening:</strong>
                        ${
                            escapeHTML(
                                item.evening||
                                "No evening activity added."
                            )
                        }
                    </p>
                </div>
            </div>
        `;
    }).join("");
}

function createEmailHeader(title,subtitle){
    return`
        <div style="
            background:
                linear-gradient(
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
                TRIPFUSION
            </p>

            <h1 style="
                font-size:30px;
                margin:0 0 10px;
            ">
                ${escapeHTML(title)}
            </h1>

            ${
                subtitle
                    ?`
                        <p style="
                            color:#dce8ef;
                            line-height:1.6;
                            margin:0;
                        ">
                            ${escapeHTML(subtitle)}
                        </p>
                    `
                    :""
            }
        </div>
    `;
}

function createEmailFooter(){
    return`
        <div style="
            background:#082f50;
            color:#dce8ef;
            font-size:13px;
            padding:18px;
            text-align:center;
        ">
            TripFusion — Plan smarter. Travel better.
        </div>
    `;
}

async function sendTripDetailsEmail({
    user,
    tripPlan
}){
    if(!user?.email){
        throw new Error(
            "No registered email address was found"
        );
    }

    if(!tripPlan){
        throw new Error(
            "Trip information is required"
        );
    }

    const transporter=getEmailTransporter();

    const destinationName=
        tripPlan.destinationName||
        "Your Destination";

    const html=`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
        </head>

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
                box-shadow:
                    0 8px 30px
                    rgba(15,76,129,0.10);
                margin:auto;
                max-width:740px;
                overflow:hidden;
            ">
                ${
                    createEmailHeader(
                        `${destinationName} Trip Plan`,
                        `Hello ${
                            user.fullName||
                            "Traveler"
                        }, your saved itinerary is ready.`
                    )
                }

                <div style="padding:30px">
                    <h2 style="
                        color:#0f4c81;
                        margin-top:0;
                    ">
                        Trip Summary
                    </h2>

                    <table style="
                        border-collapse:collapse;
                        margin-bottom:28px;
                        width:100%;
                    ">
                        <tr>
                            <td style="
                                border-bottom:
                                    1px solid #e4e8ef;
                                padding:11px;
                            ">
                                <strong>
                                    Destination
                                </strong>
                            </td>

                            <td style="
                                border-bottom:
                                    1px solid #e4e8ef;
                                padding:11px;
                                text-align:right;
                            ">
                                ${
                                    escapeHTML(
                                        destinationName
                                    )
                                }
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                border-bottom:
                                    1px solid #e4e8ef;
                                padding:11px;
                            ">
                                <strong>
                                    Start Date
                                </strong>
                            </td>

                            <td style="
                                border-bottom:
                                    1px solid #e4e8ef;
                                padding:11px;
                                text-align:right;
                            ">
                                ${
                                    formatDate(
                                        tripPlan.startDate
                                    )
                                }
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                border-bottom:
                                    1px solid #e4e8ef;
                                padding:11px;
                            ">
                                <strong>
                                    Duration
                                </strong>
                            </td>

                            <td style="
                                border-bottom:
                                    1px solid #e4e8ef;
                                padding:11px;
                                text-align:right;
                            ">
                                ${
                                    Number(
                                        tripPlan.days
                                    )||1
                                } days
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                border-bottom:
                                    1px solid #e4e8ef;
                                padding:11px;
                            ">
                                <strong>
                                    Travelers
                                </strong>
                            </td>

                            <td style="
                                border-bottom:
                                    1px solid #e4e8ef;
                                padding:11px;
                                text-align:right;
                            ">
                                ${
                                    Number(
                                        tripPlan.travelers
                                    )||1
                                }
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                border-bottom:
                                    1px solid #e4e8ef;
                                padding:11px;
                            ">
                                <strong>
                                    Total Budget
                                </strong>
                            </td>

                            <td style="
                                border-bottom:
                                    1px solid #e4e8ef;
                                padding:11px;
                                text-align:right;
                            ">
                                ${
                                    formatCurrency(
                                        tripPlan.totalBudget
                                    )
                                }
                            </td>
                        </tr>

                        <tr>
                            <td style="
                                border-bottom:
                                    1px solid #e4e8ef;
                                padding:11px;
                            ">
                                <strong>
                                    Travel Style
                                </strong>
                            </td>

                            <td style="
                                border-bottom:
                                    1px solid #e4e8ef;
                                padding:11px;
                                text-align:right;
                                text-transform:capitalize;
                            ">
                                ${
                                    escapeHTML(
                                        tripPlan.travelStyle||
                                        "Flexible"
                                    )
                                }
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
                        ${
                            createBudgetHTML(
                                tripPlan.budgetBreakdown
                            )
                        }
                    </table>

                    <h2 style="color:#0f4c81">
                        Day-wise Itinerary
                    </h2>

                    ${
                        createItineraryHTML(
                            tripPlan.itinerary
                        )
                    }
                </div>

                ${createEmailFooter()}
            </div>
        </body>
        </html>
    `;

    let info;

    try{
        info=await transporter.sendMail({
            from:getSender(),
            to:user.email,
            subject:
                `${destinationName} Trip Plan | TripFusion`,
            html
        });
    }catch(error){
        console.error(
            "Trip email sending failed:",
            {
                code:error.code,
                command:error.command,
                message:error.message
            }
        );

        if(error.code==="EAUTH"){
            throw new Error(
                "Gmail authentication failed. Check GMAIL_USER and GMAIL_APP_PASSWORD."
            );
        }

        if(
            error.code==="ETIMEDOUT"||
            error.code==="ESOCKET"||
            error.code==="ECONNECTION"
        ){
            throw new Error(
                "The Gmail server did not respond. Please try again shortly."
            );
        }

        throw new Error(
            error.message||
            "Unable to send trip details by email."
        );
    }

    console.log(
        "Trip email sent:",
        info.messageId
    );

    return info;
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

    if(!otp){
        throw new Error(
            "OTP is required"
        );
    }

    const transporter=getEmailTransporter();

    const html=`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
        </head>

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
                box-shadow:
                    0 8px 30px
                    rgba(15,76,129,0.10);
                margin:auto;
                max-width:600px;
                overflow:hidden;
            ">
                ${
                    createEmailHeader(
                        "Verify Your Email",
                        "Complete your TripFusion registration."
                    )
                }

                <div style="
                    line-height:1.7;
                    padding:34px;
                    text-align:center;
                ">
                    <p>
                        Hello ${
                            escapeHTML(
                                fullName||
                                "Traveler"
                            )
                        },
                    </p>

                    <p>
                        Enter the verification code below
                        to complete your TripFusion
                        registration.
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
                        Do not share this verification
                        code with anyone.
                    </p>
                </div>

                ${createEmailFooter()}
            </div>
        </body>
        </html>
    `;

    const info=await transporter.sendMail({
        from:getSender(),
        to:email,
        subject:"Verify Your TripFusion Account",
        html
    });

    console.log(
        "Verification OTP email sent:",
        info.messageId
    );

    return info;
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

    if(!otp){
        throw new Error(
            "Password reset OTP is required"
        );
    }

    const transporter=getEmailTransporter();

    const html=`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
        </head>

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
                box-shadow:
                    0 8px 30px
                    rgba(15,76,129,0.10);
                margin:auto;
                max-width:600px;
                overflow:hidden;
            ">
                ${
                    createEmailHeader(
                        "Password Reset",
                        "Reset your TripFusion password securely."
                    )
                }

                <div style="
                    line-height:1.7;
                    padding:34px;
                    text-align:center;
                ">
                    <p>
                        Hello ${
                            escapeHTML(
                                fullName||
                                "Traveler"
                            )
                        },
                    </p>

                    <p>
                        Use the OTP below to reset your
                        TripFusion password.
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
                        Ignore this email if you did not
                        request a password reset.
                    </p>
                </div>

                ${createEmailFooter()}
            </div>
        </body>
        </html>
    `;

    const info=await transporter.sendMail({
        from:getSender(),
        to:email,
        subject:"Reset Your TripFusion Password",
        html
    });

    console.log(
        "Password reset OTP email sent:",
        info.messageId
    );

    return info;
}

async function verifyEmailConnection(){
    const transporter=getEmailTransporter();

    await transporter.verify();

    console.log(
        "Gmail SMTP connection verified successfully"
    );
}

module.exports={
    sendTripDetailsEmail,
    sendOTPEmail,
    sendPasswordResetOTPEmail,
    verifyEmailConnection
};