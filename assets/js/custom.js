function initSliders() {
    const sliders = [
        { slider: 'slider1', value: 'serviceValue1' },
        { slider: 'slider2', value: 'serviceValue2' },
        { slider: 'slider3', value: 'serviceValue3' }
    ];

    sliders.forEach(item => {
        const slider = document.getElementById(item.slider);
        const value = document.getElementById(item.value);

        if (slider && value) {
            value.textContent = slider.value;
            slider.addEventListener('input', () => {
                value.textContent = slider.value;
            });
        }
    });
}

function rodytiPranesima(zinute, spalva = "#28a745") {
    const popup = document.createElement("div");
    popup.style = `
        position: fixed; top: 20px; right: 20px; background: ${spalva};
        color: white; padding: 15px 25px; border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0,0,0,.2); z-index: 999999;
        animation: fadeIn 0.3s ease;
    `;
    popup.textContent = zinute;
    document.body.appendChild(popup);

    setTimeout(() => {
        popup.style.animation = "fadeOut 0.5s ease";
        setTimeout(() => popup.remove(), 500);
    }, 2500);
}

function skaiciuotiVidurki(v1, v2, v3) {
    return ((parseFloat(v1) + parseFloat(v2) + parseFloat(v3)) / 3).toFixed(1);
}

const validators = {
    name: value => /^[A-Za-zÀ-ž\s]+$/.test(value) || "Vardas turi būti sudarytas tik iš raidžių.",
    lastName: value => /^[A-Za-zÀ-ž\s]+$/.test(value) || "Pavardė turi būti sudaryta tik iš raidžių.",
    email: value => /^\S+@\S+\.\S+$/.test(value) || "Neteisingas el. pašto formatas.",
    address: value => value.trim() !== "" || "Adresas negali būti tuščias."
};

function setFieldError(input, message) {
    let errorBox = input.nextElementSibling;

    if (!errorBox || !errorBox.classList.contains("error-msg")) {
        errorBox = document.createElement("div");
        errorBox.classList.add("error-msg");
        errorBox.style.color = "red";
        errorBox.style.fontSize = "13px";
        errorBox.style.marginTop = "3px";
        input.insertAdjacentElement("afterend", errorBox);
    }

    if (message) {
        input.classList.add("input-error");
        input.style.border = "2px solid red";
        errorBox.textContent = message;
    } else {
        input.classList.remove("input-error");
        input.style.border = "";
        errorBox.textContent = "";
    }

    checkSubmitStatus();
}

function validateField(input) {
    const name = input.name;
    const value = input.value;

    if (!value.trim()) {
        setFieldError(input, "Šis laukas negali būti tuščias.");
        return false;
    }

    if (validators[name]) {
        const valid = validators[name](value);
        if (valid !== true) {
            setFieldError(input, valid);
            return false;
        }
    }

    setFieldError(input, "");
    return true;
}

function validatePhone(input) {
    let cleaned = input.value.replace(/\s+/g, "");

    const valid = /^\+3706\d{7}$/.test(cleaned);

    if (!valid) {
        setFieldError(input, "Telefono numeris turi būti formatu: +370 6xx xxxxx");
        return false;
    }

    setFieldError(input, "");
    return true;
}


function handlePhoneFormatting() {
    const phoneInput = document.querySelector('input[name="number"]');

    phoneInput.addEventListener("input", function () {
        let digits = this.value.replace(/\D/g, "");

        if (digits.startsWith("8")) {
            digits = "370" + digits.substring(1);
        }

        if (!digits.startsWith("370")) {
            digits = "370" + digits;
        }

        digits = digits.substring(0, 11);

        if (digits.length <= 3) {
            this.value = "+" + digits;
        } else if (digits.length <= 4) {
            this.value = `+${digits.substring(0,3)} ${digits.substring(3)}`;
        } else if (digits.length <= 7) {
            this.value = `+${digits.substring(0,3)} ${digits.substring(3,4)}${digits.substring(4)}`;
        } else {
            this.value = `+${digits.substring(0,3)} ${digits.substring(3,4)}${digits.substring(4,7)} ${digits.substring(7)}`;
        }

        validatePhone(this);
    });
}


function checkSubmitStatus() {
    const submitBtn = document.querySelector("button[type='submit']");
    const errors = document.querySelectorAll(".input-error");

    if (errors.length === 0) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.style.cursor = "pointer";
    } else {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
        submitBtn.style.cursor = "not-allowed";
    }
}

function handleFormSubmit(event) {
    event.preventDefault();

    const formData = {
        vardas: document.querySelector('[name="name"]').value,
        pavarde: document.querySelector('[name="lastName"]').value,
        email: document.querySelector('[name="email"]').value,
        telefonas: document.querySelector('[name="number"]').value,
        adresas: document.querySelector('[name="address"]').value,
        klausimas1: document.querySelector('[name="rating_service1"]').value,
        klausimas2: document.querySelector('[name="rating_service2"]').value,
        klausimas3: document.querySelector('[name="rating_service3"]').value
    };

    console.log("Gauti duomenys:", formData);

    const vidurkis = skaiciuotiVidurki(
        formData.klausimas1,
        formData.klausimas2,
        formData.klausimas3
    );

    const results = document.getElementById("results");
    results.style.display = "block";
    results.innerHTML = `
        <h4>Jūsų įvesti duomenys:</h4>
        <p><b>Vardas:</b> ${formData.vardas}</p>
        <p><b>Pavardė:</b> ${formData.pavarde}</p>
        <p><b>El. paštas:</b> ${formData.email}</p>
        <p><b>Tel. numeris:</b> ${formData.telefonas}</p>
        <p><b>Adresas:</b> ${formData.adresas}</p>
        <p><b>Klausimas 1:</b> ${formData.klausimas1}/10</p>
        <p><b>Klausimas 2:</b> ${formData.klausimas2}/10</p>
        <p><b>Klausimas 3:</b> ${formData.klausimas3}/10</p>
        <hr>
        <h5>Vidurkis:</h5>
        <p style="font-size:18px;font-weight:bold;color:#28a745;">
            ${formData.vardas} ${formData.pavarde}: ${vidurkis}
        </p>
    `;

    rodytiPranesima("Duomenys pateikti sėkmingai!");
}

document.addEventListener("DOMContentLoaded", () => {
    initSliders();
    handlePhoneFormatting();

    document.querySelectorAll("input[name], textarea[name]").forEach(input => {
        if (input.name !== "number") {
            input.addEventListener("input", () => validateField(input));
        }
    });

    const forma = document.querySelector("form");
    forma.addEventListener("submit", handleFormSubmit);

    checkSubmitStatus();
});
