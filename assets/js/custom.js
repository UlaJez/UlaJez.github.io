
// Sliderių veikimas
function initSliders() {
  const sliders = [
    { slider: 'slider1', value: 'serviceValue1' },
    { slider: 'slider2', value: 'serviceValue2' },
    { slider: 'slider3', value: 'serviceValue3' }
  ];
  
  sliders.forEach(function(item) {
    const slider = document.getElementById(item.slider);
    const value = document.getElementById(item.value);
    
    if (slider && value) {
      slider.addEventListener('input', function() {
        value.textContent = this.value;
      });
    }
  });
}

// Vidurkio skaičiavimas
function skaiciuotiVidurki(vertinimas1, vertinimas2, vertinimas3) {
  const suma = parseFloat(vertinimas1) + parseFloat(vertinimas2) + parseFloat(vertinimas3);
  const vidurkis = suma / 3;
  return vidurkis.toFixed(1); // 1 skaičius po kablelio
}

// Rodyti pop-up pranešimą
function rodytiPranesima(zinute) {
  // Sukurti pop-up elementą
  const popup = document.createElement('div');
  popup.id = 'sekmesPranesimas';
  popup.innerHTML = `
    <div style="position: fixed; top: 20px; right: 20px; background: #28a745; color: white; 
                padding: 15px 25px; border-radius: 5px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                z-index: 1000; display: flex; align-items: center; animation: slideIn 0.5s ease;">
      <span style="margin-right: 10px;">✅</span>
      ${zinute}
    </div>
  `;
  
  // Pridėti į puslapį
  document.body.appendChild(popup);
  
  // Pridėti CSS animaciją
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  
  // Automatiškai paslėpti po 3 sekundžių
  setTimeout(function() {
    popup.style.animation = 'fadeOut 0.5s ease';
    setTimeout(function() {
      if (popup.parentNode) {
        popup.parentNode.removeChild(popup);
      }
    }, 500);
  }, 3000);
}

// Formos apdorojimas
function handleFormSubmit(event) {
  
  // Visiškai sustabdyti
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  // Surinkti duomenis
  const formData = {
    vardas: document.querySelector('[name="name"]').value,
    pavarde: document.querySelector('[name="last-name"]').value,
    email: document.querySelector('[name="email"]').value,
    telefonas: document.querySelector('[name="number"]').value,
    adresas: document.querySelector('[name="address"]').value,
    klausimas1: document.querySelector('[name="rating_service1"]').value,
    klausimas2: document.querySelector('[name="rating_service2"]').value,
    klausimas3: document.querySelector('[name="rating_service3"]').value
  };
  
  // Į konsolę
  console.log('Gauti duomenys:', formData);
  
  // Apskaičiuoti vidurkį
  const vidurkis = skaiciuotiVidurki(
    formData.klausimas1,
    formData.klausimas2,
    formData.klausimas3
  );
  
  // Atvaizduoti
  const results = document.getElementById('results');
  if (results) {
    results.innerHTML = '<h4>Jūsų įvesti duomenys:</h4>' +
      '<p><b>Vardas:</b> ' + formData.vardas + '</p>' +
      '<p><b>Pavardė:</b> ' + formData.pavarde + '</p>' +
      '<p><b>El. paštas:</b> ' + formData.email + '</p>' +
      '<p><b>Telefono numeris:</b> ' + formData.telefonas + '</p>' +
      '<p><b>Adresas:</b> ' + formData.adresas + '</p>' +
      '<p><b>Klausimas 1:</b> ' + formData.klausimas1 + '/10</p>' +
      '<p><b>Klausimas 2:</b> ' + formData.klausimas2 + '/10</p>' +
      '<p><b>Klausimas 3:</b> ' + formData.klausimas3 + '/10</p>' +
      '<hr style="margin: 15px 0; border-color: #ccc;">' +
      '<h5>Vidurkis:</h5>' +
      '<p style="font-size: 18px; font-weight: bold; color: #28a745;">' +
      formData.vardas + ' ' + formData.pavarde + ': ' + vidurkis + '</p>';
    
    results.style.display = 'block';
    results.style.padding = '20px';
    results.style.background = '#f8f9fa';
    results.style.marginTop = '20px';
    results.style.borderRadius = '5px';
  }
  
  // Rodyti sėkmingo pateikimo pranešimą
  rodytiPranesima('Duomenys pateikti sėkmingai!');
  
  return false;
}

// Kai dokumentas paruoštas
document.addEventListener('DOMContentLoaded', function() {
  
  // Inicijuoti sliderius
  initSliders();
  
  // Rasti ir pririšti formą
  const forms = document.getElementsByTagName('form');
  if (forms.length > 0) {
    const forma = forms[0];
    
    // Pridėti action="#"
    forma.action = '#';
    
    // Pridėti event listener
    forma.addEventListener('submit', handleFormSubmit);
    
    // Pridėti ir prie mygtuko
    const button = forma.querySelector('button[type="submit"]');
    if (button) {
      button.addEventListener('click', handleFormSubmit);
    }
    
  }
});

// Papildomai: pririšti prie window.onload
window.onload = function() {
  console.log('Puslapis visiškai įkeltas');
};