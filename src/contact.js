document.getElementById('contactForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const errorElem = document.getElementById('errorMessage');
  errorElem.textContent = '';
  errorElem.style.color = '';

  // Перевірка політики конфіденційності
  if (!document.getElementById('privacyPolicy').checked) {
    errorElem.textContent = 'Ви повинні погодитись з політикою конфіденційності.';
    errorElem.style.color = 'red';
    return;
  }

  const formData = new FormData(this);

  try {
    const response = await fetch('/contact.php', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      this.reset();
      errorElem.textContent = 'Повідомлення успішно надіслано!';
      errorElem.style.color = 'green';
    } else {
      errorElem.textContent = result.error || 'Сталася помилка.';
      errorElem.style.color = 'red';
    }
  } catch (err) {
    errorElem.textContent = 'Сервер не відповідає. Спробуйте пізніше.';
    errorElem.style.color = 'red';
  }
});
