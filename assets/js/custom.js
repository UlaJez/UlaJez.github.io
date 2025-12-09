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

//12 LABORAS
const symbols = ['⭐', '❤️', '🔑', '🎵', '⚽', '📚', '☀️', '🌙', '🎮', '🎨', '🚀', '🐱'];

const game = {
    level: 'easy',
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0, 
    isPlaying: false,
    canClick: true,
    timer: 0,
    timerInterval: null
};

let bestScores = {
    easy: { moves: null, time: null },
    hard: { moves: null, time: null }
};

document.addEventListener('DOMContentLoaded', function() {
    console.log('Žaidimas įkeltas');
    loadBestScores();
    setupGame();
});

function loadBestScores() {
    const savedScores = localStorage.getItem('memoryBestScores');
    if (savedScores) {
        bestScores = JSON.parse(savedScores);
        updateBestScoreDisplay();
    }
}

function saveBestScores() {
    localStorage.setItem('memoryBestScores', JSON.stringify(bestScores));
    updateBestScoreDisplay();
}

function updateBestScoreDisplay() {
    const easyBestElement = document.getElementById('easyBestScore');
    if (easyBestElement) {
        if (bestScores.easy.moves) {
            easyBestElement.textContent = `Geriausias: ${bestScores.easy.moves} ėjimai, ${formatTime(bestScores.easy.time)}`;
            easyBestElement.style.display = 'block';
        } else {
            easyBestElement.textContent = 'Geriausio rezultato dar nėra';
            easyBestElement.style.display = 'block';
        }
    }
    const hardBestElement = document.getElementById('hardBestScore');
    if (hardBestElement) {
        if (bestScores.hard.moves) {
            hardBestElement.textContent = `Geriausias: ${bestScores.hard.moves} ėjimai, ${formatTime(bestScores.hard.time)}`;
            hardBestElement.style.display = 'block';
        } else {
            hardBestElement.textContent = 'Geriausio rezultato dar nėra';
            hardBestElement.style.display = 'block';
        }
    }
}

function setupGame() {
    const easyBtn = document.querySelector('.easy');
    const hardBtn = document.querySelector('.hard');
    
    if (easyBtn) {
        easyBtn.addEventListener('click', function() {
            game.level = 'easy';
            this.classList.add('active');
            if (hardBtn) hardBtn.classList.remove('active');
            stopTimer();
            createBoard();
        });
    }
    
    if (hardBtn) {
        hardBtn.addEventListener('click', function() {
            game.level = 'hard';
            this.classList.add('active');
            if (easyBtn) easyBtn.classList.remove('active');
            stopTimer();
            createBoard();
        });
    }
    
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    if (startBtn) {
        startBtn.addEventListener('click', startGame);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetGame);
    }
    
    const playAgainBtn = document.getElementById('playAgainBtn');
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', function() {
            document.getElementById('winMessage').style.display = 'none';
            startGame();
        });
    }
    
    createBoard();
}

function createBoard() {
    const board = document.getElementById('gameBoard');
    if (!board) return;
    
    board.innerHTML = '';

    let rows, cols;
    if (game.level === 'easy') {
        rows = 3;  // 4×3
        cols = 4;
    } else {
        rows = 4;  // 6×4
        cols = 6;
    }

    board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

    const totalCards = rows * cols;
    const pairsNeeded = totalCards / 2;

    let selectedSymbols = symbols.slice(0, pairsNeeded);

    let allCards = [];
    selectedSymbols.forEach(symbol => {
        allCards.push(symbol);  // Pirmas
        allCards.push(symbol);  // Antras
    });
    
    // Sumaišyti
    allCards = shuffle(allCards);
    game.cards = allCards;
    
    // Sukurti korteles
    allCards.forEach((symbol, index) => {
        const card = createCard(symbol, index);
        board.appendChild(card);
    });
    
    // Atnaujinti skaičius
    updateStats();
}

// Sukurti vieną kortelę
function createCard(symbol, index) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.dataset.symbol = symbol;
    
    // Stilius
    card.style.cssText = `
        background: #86bbdd;
        color: white;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        user-select: none;
        transition: all 0.3s;
    `;
    
    // Tekstas (pradžioje klaustukas)
    card.textContent = '?';
    
    // Paspaudimas
    card.addEventListener('click', function() {
        handleCardClick(index);
    });
    
    return card;
}

// Sumaišyti masyvą
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Pradėti laikmatį
function startTimer() {
    stopTimer(); // Sustabdyti seną laikmatį
    game.timer = 0;
    updateTimerDisplay();
    
    game.timerInterval = setInterval(() => {
        game.timer++;
        updateTimerDisplay();
    }, 1000);
}

// Sustabdyti laikmatį
function stopTimer() {
    if (game.timerInterval) {
        clearInterval(game.timerInterval);
        game.timerInterval = null;
    }
}

// Atnaujinti laikmačio rodymą
function updateTimerDisplay() {
    const timerElement = document.getElementById('timerDisplay');
    if (timerElement) {
        timerElement.textContent = formatTime(game.timer);
    }
}

// Formatas laikui (mm:ss)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Pradėti žaidimą
function startGame() {
    console.log('Žaidimas prasideda');
    
    // Išvalyti seną žaidimą
    game.flippedCards = [];
    game.matchedPairs = 0;
    game.moves = 0;
    game.isPlaying = true;
    game.canClick = true;
    game.timer = 0;
    
    // Sumaišyti korteles
    game.cards = shuffle(game.cards);
    
    // Pradėti laikmatį
    startTimer();
    
    // Atnaujinti lentą
    resetBoard();
    
    // Mygtukai
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    if (startBtn) startBtn.disabled = true;
    if (resetBtn) resetBtn.disabled = false;
    
    // Paslėpti laimėjimo pranešimą
    const winMessage = document.getElementById('winMessage');
    if (winMessage) winMessage.style.display = 'none';
    
    showMessage('Žaidimas prasidėjo!', '#28a745');
}

// Atstatyti žaidimą
function resetGame() {
    console.log('Žaidimas atstatomas');
    stopTimer();
    createBoard();
    
    game.flippedCards = [];
    game.matchedPairs = 0;
    game.moves = 0;
    game.isPlaying = false;
    game.canClick = true;
    game.timer = 0;
    
    const startBtn = document.getElementById('startBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    if (startBtn) startBtn.disabled = false;
    if (resetBtn) resetBtn.disabled = true;
    
    const winMessage = document.getElementById('winMessage');
    if (winMessage) winMessage.style.display = 'none';
    
    updateTimerDisplay();
    updateStats();
    
    showMessage('Žaidimas atstatytas!', '#ffc107');
}

// Atstatyti lentą
function resetBoard() {
    const allCards = document.querySelectorAll('.card');
    allCards.forEach((card, index) => {
        // Atstatyti į pradinę būseną
        card.textContent = '?';
        card.style.background = '#86bbdd';
        card.style.color = 'white';
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';
        
        // Atnaujinti simbolį
        card.dataset.symbol = game.cards[index];
    });
    
    updateStats();
}

// Apdoroti kortelės paspaudimą
function handleCardClick(index) {
    // Patikrinti ar galima spausti
    if (!game.isPlaying || !game.canClick) return;
    
    const card = document.querySelector(`.card[data-index="${index}"]`);
    
    // Patikrinti ar kortelė jau atversta
    if (card.textContent !== '?') return;
    
    // Patikrinti ar jau atvertos 2 kortelės
    if (game.flippedCards.length >= 2) return;
    
    // Atverti kortelę
    card.textContent = card.dataset.symbol;
    card.style.background = getCardColor(card.dataset.symbol);
    card.style.color = 'white';
    
    // Įrašyti į atvertų sąrašą
    game.flippedCards.push({ index, card });
    
    // Jei atvertos 2 kortelės
    if (game.flippedCards.length === 2) {
        game.moves++;
        updateStats();
        game.canClick = false;
        
        // Palaukti ir patikrinti ar sutampa
        setTimeout(checkMatch, 500);
    }
}

// Gauti kortelės spalvą pagal simbolį
function getCardColor(symbol) {
    const colors = {
        '⭐': '#FFD700', '❤️': '#FF6B6B', '🔑': '#FFA500',
        '🎵': '#9B59B6', '⚽': '#2ECC71', '📚': '#3498DB',
        '☀️': '#F1C40F', '🌙': '#34495E', '🎮': '#E74C3C',
        '🎨': '#1ABC9C', '🚀': '#9B59B6', '🐱': '#E67E22'
    };
    return colors[symbol] || '#6a11cb';
}

// Patikrinti ar sutampa kortelės
function checkMatch() {
    const card1 = game.flippedCards[0];
    const card2 = game.flippedCards[1];
    
    const symbol1 = card1.card.dataset.symbol;
    const symbol2 = card2.card.dataset.symbol;
    
    if (symbol1 === symbol2) {
        // Sutampa
        card1.card.style.opacity = '0.7';
        card2.card.style.opacity = '0.7';
        card1.card.style.pointerEvents = 'none';
        card2.card.style.pointerEvents = 'none';
        
        game.matchedPairs++;
        game.flippedCards = [];
        game.canClick = true;
        
        updateStats();
        checkWin();
    } else {
        // Nesutampa - užversti atgal
        card1.card.textContent = '?';
        card2.card.textContent = '?';
        card1.card.style.background = '#86bbdd';
        card2.card.style.background = '#86bbdd';
        
        game.flippedCards = [];
        game.canClick = true;
    }
}

// Atnaujinti statistiką
function updateStats() {
    // Atnaujinti ėjimų skaičių
    const movesCount = document.getElementById('movesCount');
    if (movesCount) movesCount.textContent = game.moves;
    
    // Atnaujinti porų skaičių
    const pairsCount = document.getElementById('pairsCount');
    if (pairsCount) {
        // Maksimalus porų skaičius
        let maxPairs;
        if (game.level === 'easy') {
            maxPairs = 6;  // 12 kortelių = 6 poros
        } else {
            maxPairs = 12; // 24 kortelės = 12 porų
        }
        pairsCount.textContent = `${game.matchedPairs}/${maxPairs}`;
    }
}

// Tikrinti geriausią rezultatą
function checkBestScore() {
    const currentLevel = game.level;
    const currentScore = bestScores[currentLevel];
    
    // Jei dar nėra rezultato arba dabartinis rezultatas geresnis
    if (!currentScore.moves || game.moves < currentScore.moves || 
        (game.moves === currentScore.moves && game.timer < currentScore.time)) {
        
        // Atnaujinti geriausią rezultatą
        bestScores[currentLevel] = {
            moves: game.moves,
            time: game.timer
        };
        
        // Išsaugoti
        saveBestScores();
        
        // Pranešti vartotojui
        showMessage('🎉 Naujas geriausias rezultatas! 🎉', '#28a745');
        return true;
    }
    return false;
}

// Patikrinti ar laimėta
function checkWin() {
    let maxPairs;
    if (game.level === 'easy') {
        maxPairs = 6;
    } else {
        maxPairs = 12;
    }
    
    if (game.matchedPairs >= maxPairs) {
        // Laimėta!
        game.isPlaying = false;
        stopTimer(); // Sustabdyti laikmatį
        
        // Rodyti pranešimą
        const winMessage = document.getElementById('winMessage');
        const finalMoves = document.getElementById('finalMoves');
        const finalTime = document.getElementById('finalTime');
        
        if (winMessage) {
            if (finalMoves) finalMoves.textContent = game.moves;
            if (finalTime) finalTime.textContent = formatTime(game.timer);
            winMessage.style.display = 'block';
        }
        
        // Tikrinti geriausią rezultatą
        const isNewBest = checkBestScore();
        
        showMessage(`Laimėjote! Laikas: ${formatTime(game.timer)}, ėjimai: ${game.moves}`, '#28a745');
    }
}

// Rodyti pranešimą
function showMessage(text, color) {
    const msg = document.createElement('div');
    msg.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        z-index: 9999;
        font-weight: bold;
    `;
    msg.textContent = text;
    document.body.appendChild(msg);
    
    setTimeout(() => msg.remove(), 3000);
}