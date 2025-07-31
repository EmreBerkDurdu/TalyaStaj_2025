$(document).ready(function() {
  if (window.flatpickr) {
    flatpickr('#date', {
      dateFormat: 'd.m.Y',
      minDate: 'today',
      locale: 'tr',
      disableMobile: true,
      theme: 'airbnb'
    });
    flatpickr('#time', {
      enableTime: true,
      noCalendar: true,
      dateFormat: 'H:i',
      time_24hr: true,
      minuteIncrement: 5,
      disableMobile: true,
      theme: 'airbnb'
    });
  }

  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    resultDiv.textContent = '';
    const data = {
      name: form.name.value.trim(),
      surname: form.surname.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      date: form.date.value,
      time: form.time.value,
      service: form.service.value
    };
    try {
      const response = await fetch('/spa-rezervasyon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      if (response.ok) {
        resultDiv.style.color = 'green';
        resultDiv.textContent = result.mesaj;
        form.reset();
      } else {
        resultDiv.style.color = 'red';
        resultDiv.textContent = result.mesaj || 'Bir hata oluştu.';
      }
    } catch (err) {
      resultDiv.style.color = 'red';
      resultDiv.textContent = 'Sunucuya bağlanılamadı.';
    }
  });
}); 