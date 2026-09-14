/* ==========================================
   Minde Technologies
   Contact Form Cloudflare Worker
========================================== */


const ALLOWED_ORIGINS = [
    "https://www.mindetech.ch",
    "https://mindetech.ch"
];


const RECIPIENT_EMAIL =
    "christof.zihlmann@mindetech.ch";


const FROM_EMAIL =
    "Minde Technologies <info@mindetech.ch>";


/* ==========================================
   CORS
========================================== */

function getCorsHeaders(origin) {

    const headers = {

        "Access-Control-Allow-Methods":
            "POST, OPTIONS",

        "Access-Control-Allow-Headers":
            "Content-Type",

        "Vary":
            "Origin"

    };


    if (
        origin &&
        ALLOWED_ORIGINS.includes(origin)
    ) {

        headers[
            "Access-Control-Allow-Origin"
        ] = origin;

    }


    return headers;
}


/* ==========================================
   JSON RESPONSE
========================================== */

function jsonResponse(
    data,
    status,
    origin
) {

    return new Response(
        JSON.stringify(data),
        {
            status,

            headers: {

                "Content-Type":
                    "application/json; charset=utf-8",

                ...getCorsHeaders(origin)

            }
        }
    );

}


/* ==========================================
   HTML ESCAPE
========================================== */

function escapeHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


/* ==========================================
   TEXT CLEANING
========================================== */

function cleanText(value, maxLength = 5000) {

    if (
        typeof value !== "string"
    ) {

        return "";

    }


    return value
        .replace(/\r/g, "")
        .replace(/\0/g, "")
        .trim()
        .slice(0, maxLength);

}


/* ==========================================
   EMAIL VALIDATION
========================================== */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* ==========================================
   REQUEST HANDLER
========================================== */

export default {

    async fetch(request, env) {

        const origin =
            request.headers.get(
                "Origin"
            );


        /* ======================================
           CORS PREFLIGHT
        ====================================== */

        if (
            request.method === "OPTIONS"
        ) {

            if (
                origin &&
                !ALLOWED_ORIGINS.includes(
                    origin
                )
            ) {

                return new Response(
                    null,
                    {
                        status: 403
                    }
                );

            }


            return new Response(
                null,
                {
                    status: 204,

                    headers:
                        getCorsHeaders(
                            origin
                        )
                }
            );

        }


        /* ======================================
           ONLY POST
        ====================================== */

        if (
            request.method !== "POST"
        ) {

            return jsonResponse(
                {
                    success: false,
                    message:
                        "Method not allowed."
                },
                405,
                origin
            );

        }


        /* ======================================
           CHECK ORIGIN
        ====================================== */

        if (
            origin &&
            !ALLOWED_ORIGINS.includes(
                origin
            )
        ) {

            return jsonResponse(
                {
                    success: false,
                    message:
                        "Invalid request origin."
                },
                403,
                origin
            );

        }


        /* ======================================
           CONTENT TYPE
        ====================================== */

        const contentType =
            request.headers.get(
                "Content-Type"
            ) || "";


        if (
            !contentType
                .toLowerCase()
                .includes(
                    "application/json"
                )
        ) {

            return jsonResponse(
                {
                    success: false,
                    message:
                        "Invalid content type."
                },
                400,
                origin
            );

        }


        /* ======================================
           PARSE JSON
        ====================================== */

        let body;


        try {

            body =
                await request.json();

        } catch (error) {

            return jsonResponse(
                {
                    success: false,
                    message:
                        "Invalid request data."
                },
                400,
                origin
            );

        }


        /* ======================================
           READ FIELDS
        ====================================== */

        const firma =
            cleanText(
                body.firma,
                200
            );

        const name =
            cleanText(
                body.name,
                100
            );

        const vorname =
            cleanText(
                body.vorname,
                100
            );

        const email =
            cleanText(
                body.email,
                320
            );

        const telefon =
            cleanText(
                body.telefon,
                100
            );

        const mobile =
            cleanText(
                body.mobile,
                100
            );

        const adresse =
            cleanText(
                body.adresse,
                200
            );

        const plz =
            cleanText(
                body.plz,
                20
            );

        const ort =
            cleanText(
                body.ort,
                100
            );

        const nachricht =
            cleanText(
                body.nachricht,
                5000
            );


        /* ======================================
           REQUEST TYPES
        ====================================== */

        let requestTypes = [];


        if (
            Array.isArray(
                body.requestType
            )
        ) {

            requestTypes =
                body.requestType
                    .filter(
                        value =>
                            typeof value ===
                            "string"
                    )
                    .map(
                        value =>
                            cleanText(
                                value,
                                200
                            )
                    )
                    .filter(
                        Boolean
                    )
                    .slice(0, 10);

        }


        /* ======================================
           REQUIRED VALIDATION
        ====================================== */

        if (
            !firma ||
            !name ||
            !vorname ||
            !email ||
            !nachricht
        ) {

            return jsonResponse(
                {
                    success: false,
                    message:
                        "Please complete all required fields."
                },
                400,
                origin
            );

        }


        /* ======================================
           EMAIL VALIDATION
        ====================================== */

        if (
            !isValidEmail(email)
        ) {

            return jsonResponse(
                {
                    success: false,
                    message:
                        "Please enter a valid email address."
                },
                400,
                origin
            );

        }


        /* ======================================
           HEADER INJECTION PROTECTION
        ====================================== */

        if (
            /[\r\n]/.test(email)
        ) {

            return jsonResponse(
                {
                    success: false,
                    message:
                        "Invalid email address."
                },
                400,
                origin
            );

        }


        /* ======================================
           REQUEST TYPE TEXT
        ====================================== */

        const requestTypeText =
            requestTypes.length > 0
                ? requestTypes.join("\n")
                : "No specific request selected";


        /* ======================================
           EMAIL SUBJECT
        ====================================== */

        const subject =
            `Website Contact Request - ${name} ${vorname}`;


        /* ======================================
           EMAIL HTML
        ====================================== */

        const html = `

<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

<title>
Website Contact Request
</title>

</head>

<body
    style="
        font-family: Arial, Helvetica, sans-serif;
        line-height: 1.5;
        color: #333;
    "
>

<h2>
Website Contact Request
</h2>


<table
    cellpadding="8"
    cellspacing="0"
    border="0"
    style="
        border-collapse: collapse;
        width: 100%;
        max-width: 700px;
    "
>

<tr>
    <td
        style="
            font-weight: bold;
            width: 180px;
        "
    >
        Company
    </td>

    <td>
        ${escapeHtml(firma)}
    </td>
</tr>


<tr>
    <td style="font-weight: bold;">
        Last Name
    </td>

    <td>
        ${escapeHtml(name)}
    </td>
</tr>


<tr>
    <td style="font-weight: bold;">
        First Name
    </td>

    <td>
        ${escapeHtml(vorname)}
    </td>
</tr>


<tr>
    <td style="font-weight: bold;">
        Email
    </td>

    <td>
        ${escapeHtml(email)}
    </td>
</tr>


<tr>
    <td style="font-weight: bold;">
        Telephone
    </td>

    <td>
        ${escapeHtml(telefon)}
    </td>
</tr>


<tr>
    <td style="font-weight: bold;">
        Mobile Phone
    </td>

    <td>
        ${escapeHtml(mobile)}
    </td>
</tr>


<tr>
    <td style="font-weight: bold;">
        Address
    </td>

    <td>
        ${escapeHtml(adresse)}
    </td>
</tr>


<tr>
    <td style="font-weight: bold;">
        Postal Code
    </td>

    <td>
        ${escapeHtml(plz)}
    </td>
</tr>


<tr>
    <td style="font-weight: bold;">
        City
    </td>

    <td>
        ${escapeHtml(ort)}
    </td>
</tr>


<tr>
    <td style="font-weight: bold;">
        Request
    </td>

    <td>
        ${escapeHtml(requestTypeText)}
    </td>
</tr>

</table>


<h3>
Message
</h3>

<div
    style="
        white-space: pre-wrap;
        background: #f5f5f5;
        border: 1px solid #ddd;
        padding: 15px;
        max-width: 700px;
    "
>
${escapeHtml(nachricht)}
</div>


<p
    style="
        color: #777;
        font-size: 12px;
        margin-top: 25px;
    "
>
This message was submitted through the
Minde Technologies website contact form.
</p>


</body>

</html>

`;


        /* ======================================
           EMAIL TEXT VERSION
        ====================================== */

        const text = `

Website Contact Request

Company:
${firma}

Last Name:
${name}

First Name:
${vorname}

Email:
${email}

Telephone:
${telefon}

Mobile Phone:
${mobile}

Address:
${adresse}

Postal Code:
${plz}

City:
${ort}

Request:
${requestTypeText}

Message:
${nachricht}

--------------------------------

This message was submitted through the
Minde Technologies website contact form.

`;


        /* ======================================
           SEND WITH RESEND
        ====================================== */

        const resendResponse =
            await fetch(
                "https://api.resend.com/emails",
                {

                    method: "POST",

                    headers: {

                        "Authorization":
                            `Bearer ${env.RESEND_API_KEY}`,

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            from:
                                FROM_EMAIL,

                            to: [
                                RECIPIENT_EMAIL
                            ],

                            reply_to:
                                email,

                            subject:
                                subject,

                            html:
                                html,

                            text:
                                text

                        })

                }
            );


        /* ======================================
           RESEND RESPONSE
        ====================================== */

        if (
            !resendResponse.ok
        ) {

            const errorText =
                await resendResponse.text();


            console.error(
                "Resend API error:",
                errorText
            );


            return jsonResponse(
                {
                    success: false,
                    message:
                        "The message could not be sent. Please try again later."
                },
                502,
                origin
            );

        }


        /* ======================================
           SUCCESS
        ====================================== */

        return jsonResponse(
            {
                success: true,
                message:
                    "Thank you. Your message has been sent successfully."
            },
            200,
            origin
        );

    }

};
