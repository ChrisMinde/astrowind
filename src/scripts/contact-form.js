/* ==========================================
   CONTACT FORM CONFIGURATION
========================================== */

/*
 * Temporary:
 * Replace this with your actual Cloudflare Worker URL.
 *
 * Example:
 * https://contact-api-xxxx.your-subdomain.workers.dev/contact
 *
 * After configuring a custom domain:
 * https://api.mindetech.ch/contact
 */

const CONTACT_API_URL =
    "https://api.mindetech.ch/contact";


/* ==========================================
   ELEMENTS
========================================== */

const form =
    document.getElementById("contactForm");

const formMessage =
    document.getElementById("formMessage");

const firmaInput =
    document.getElementById("firma");

const nameInput =
    document.getElementById("name");

const vornameInput =
    document.getElementById("vorname");

const emailInput =
    document.getElementById("email");

const nachrichtInput =
    document.getElementById("nachricht");

const telefonInput =
    document.getElementById("telefon");

const mobileInput =
    document.getElementById("mobile");

const adresseInput =
    document.getElementById("adresse");

const plzInput =
    document.getElementById("plz");

const ortInput =
    document.getElementById("ort");

const captchaQuestion =
    document.getElementById("captchaQuestion");

const captchaAnswer =
    document.getElementById("captchaAnswer");

const captchaRefresh =
    document.getElementById("captchaRefresh");

const submitButton =
    document.getElementById("submitButton");

const resetButton =
    document.getElementById("resetButton");

const firmaError =
    document.getElementById("firmaError");

const nameError =
    document.getElementById("nameError");

const vornameError =
    document.getElementById("vornameError");

const emailError =
    document.getElementById("emailError");

const nachrichtError =
    document.getElementById("nachrichtError");

const captchaError =
    document.getElementById("captchaError");


/* ==========================================
   SAFETY CHECK
========================================== */

if (!form) {
    console.error(
        "Contact form was not found."
    );
}


/* ==========================================
   FIELD COLOR HANDLING
========================================== */

function updateFieldState(input) {

    if (!input) {
        return;
    }

    if (input.value.trim() !== "") {

        input.classList.add(
            "input-filled"
        );

    } else {

        input.classList.remove(
            "input-filled"
        );
    }
}


const allInputFields = [

    firmaInput,
    nameInput,
    vornameInput,
    emailInput,
    telefonInput,
    mobileInput,
    adresseInput,
    plzInput,
    ortInput,
    nachrichtInput,
    captchaAnswer

].filter(Boolean);


allInputFields.forEach(function(input) {

    input.addEventListener(
        "input",
        function() {

            updateFieldState(input);

        }
    );

});


/* ==========================================
   CAPTCHA
========================================== */

let captchaResult = 0;


function generateCaptcha() {

    const number1 =
        Math.floor(
            Math.random() * 10
        ) + 1;

    const number2 =
        Math.floor(
            Math.random() * 10
        ) + 1;

    captchaResult =
        number1 + number2;


    captchaQuestion.textContent =
        number1 +
        " + " +
        number2 +
        " = ?";


    captchaAnswer.value = "";


    captchaAnswer.classList.remove(
        "error"
    );

    captchaAnswer.classList.remove(
        "input-filled"
    );

    captchaError.classList.remove(
        "visible"
    );
}


captchaRefresh.addEventListener(
    "click",
    generateCaptcha
);


generateCaptcha();


/* ==========================================
   HELPER FUNCTIONS
========================================== */

function showError(
    input,
    errorElement
) {

    input.classList.add(
        "error"
    );

    errorElement.classList.add(
        "visible"
    );
}


function hideError(
    input,
    errorElement
) {

    input.classList.remove(
        "error"
    );

    errorElement.classList.remove(
        "visible"
    );
}


function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/* ==========================================
   LIVE VALIDATION
========================================== */

firmaInput.addEventListener(
    "input",
    function() {

        if (
            firmaInput.value.trim() !== ""
        ) {

            hideError(
                firmaInput,
                firmaError
            );

        }

    }
);


nameInput.addEventListener(
    "input",
    function() {

        if (
            nameInput.value.trim() !== ""
        ) {

            hideError(
                nameInput,
                nameError
            );

        }

    }
);


vornameInput.addEventListener(
    "input",
    function() {

        if (
            vornameInput.value.trim() !== ""
        ) {

            hideError(
                vornameInput,
                vornameError
            );

        }

    }
);


emailInput.addEventListener(
    "input",
    function() {

        if (
            isValidEmail(
                emailInput.value.trim()
            )
        ) {

            hideError(
                emailInput,
                emailError
            );

        }

    }
);


nachrichtInput.addEventListener(
    "input",
    function() {

        if (
            nachrichtInput.value.trim() !== ""
        ) {

            hideError(
                nachrichtInput,
                nachrichtError
            );

        }

    }
);


captchaAnswer.addEventListener(
    "input",
    function() {

        const answer =
            parseInt(
                captchaAnswer.value,
                10
            );


        if (
            answer === captchaResult
        ) {

            captchaAnswer.classList.remove(
                "error"
            );

            captchaError.classList.remove(
                "visible"
            );

        }

    }
);


/* ==========================================
   SUBMIT FORM
========================================== */

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        let valid = true;


        formMessage.className =
            "form-message";

        formMessage.textContent =
            "";


        /* ======================================
           COMPANY
        ====================================== */

        if (
            firmaInput.value.trim() === ""
        ) {

            showError(
                firmaInput,
                firmaError
            );

            valid = false;

        } else {

            hideError(
                firmaInput,
                firmaError
            );

        }


        /* ======================================
           LAST NAME
        ====================================== */

        if (
            nameInput.value.trim() === ""
        ) {

            showError(
                nameInput,
                nameError
            );

            valid = false;

        } else {

            hideError(
                nameInput,
                nameError
            );

        }


        /* ======================================
           FIRST NAME
        ====================================== */

        if (
            vornameInput.value.trim() === ""
        ) {

            showError(
                vornameInput,
                vornameError
            );

            valid = false;

        } else {

            hideError(
                vornameInput,
                vornameError
            );

        }


        /* ======================================
           EMAIL
        ====================================== */

        if (
            !isValidEmail(
                emailInput.value.trim()
            )
        ) {

            showError(
                emailInput,
                emailError
            );

            valid = false;

        } else {

            hideError(
                emailInput,
                emailError
            );

        }


        /* ======================================
           MESSAGE
        ====================================== */

        if (
            nachrichtInput.value.trim() === ""
        ) {

            showError(
                nachrichtInput,
                nachrichtError
            );

            valid = false;

        } else {

            hideError(
                nachrichtInput,
                nachrichtError
            );

        }


        /* ======================================
           CAPTCHA
        ====================================== */

        const userCaptchaAnswer =
            parseInt(
                captchaAnswer.value,
                10
            );


        if (
            Number.isNaN(
                userCaptchaAnswer
            ) ||
            userCaptchaAnswer !==
                captchaResult
        ) {

            captchaAnswer.classList.add(
                "error"
            );

            captchaError.classList.add(
                "visible"
            );

            valid = false;

        } else {

            captchaAnswer.classList.remove(
                "error"
            );

            captchaError.classList.remove(
                "visible"
            );

        }


        /* ======================================
           VALIDATION FAILED
        ====================================== */

        if (!valid) {

            formMessage.className =
                "form-message error";

            formMessage.textContent =
                "Please check your entries.";

            return;
        }


        /* ======================================
           PREPARE SUBMISSION
        ====================================== */

        submitButton.disabled = true;

        submitButton.textContent =
            "Sending ...";


        const formData =
            new FormData(form);


        const data = {

            firma:
                formData.get("firma") || "",

            name:
                formData.get("name") || "",

            vorname:
                formData.get("vorname") || "",

            email:
                formData.get("email") || "",

            telefon:
                formData.get("telefon") || "",

            mobile:
                formData.get("mobile") || "",

            adresse:
                formData.get("adresse") || "",

            plz:
                formData.get("plz") || "",

            ort:
                formData.get("ort") || "",

            nachricht:
                formData.get("nachricht") || "",

            requestType:
                formData.getAll(
                    "requestType[]"
                )

        };


        /* ======================================
           SEND TO CLOUDFLARE WORKER
        ====================================== */

        try {

            const response =
                await fetch(
                    CONTACT_API_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(data)
                    }
                );


            let result;


            try {

                result =
                    await response.json();

            } catch (jsonError) {

                throw new Error(
                    "Invalid server response."
                );

            }


            if (
                response.ok &&
                result.success
            ) {

                formMessage.className =
                    "form-message success";

                formMessage.textContent =
                    result.message ||
                    "Thank you. Your message has been sent successfully.";


                form.reset();


                allInputFields.forEach(
                    function(input) {

                        input.classList.remove(
                            "input-filled"
                        );

                    }
                );


                generateCaptcha();


            } else {

                formMessage.className =
                    "form-message error";

                formMessage.textContent =
                    result.message ||
                    "The message could not be sent.";

            }


        } catch (error) {

            console.error(
                "Error while sending contact form:",
                error
            );


            formMessage.className =
                "form-message error";


            formMessage.textContent =
                "A technical error has occurred. " +
                "Please try again later.";

        } finally {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Send";

        }

    }
);


/* ==========================================
   RESET
========================================== */

resetButton.addEventListener(
    "click",
    function() {

        hideError(
            firmaInput,
            firmaError
        );

        hideError(
            nameInput,
            nameError
        );

        hideError(
            vornameInput,
            vornameError
        );

        hideError(
            emailInput,
            emailError
        );

        hideError(
            nachrichtInput,
            nachrichtError
        );


        captchaAnswer.classList.remove(
            "error"
        );

        captchaError.classList.remove(
            "visible"
        );


        formMessage.className =
            "form-message";

        formMessage.textContent =
            "";


        allInputFields.forEach(
            function(input) {

                input.classList.remove(
                    "input-filled"
                );

            }
        );


        generateCaptcha();

    }
);
