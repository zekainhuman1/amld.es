// import './normalize.min.css';
// import './style.min.css';


document.addEventListener("DOMContentLoaded", function () {
    const content = document.querySelector(".reviews__content");
    const items = document.querySelectorAll(".reviews__item");
    const pagination = document.querySelector(".reviews__pagination");
    const prevButton = document.querySelector(".reviews__nav--prev");
    const nextButton = document.querySelector(".reviews__nav--next");

    let currentIndex = 0;
    let interval;

    items.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("reviews__dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
            currentIndex = index;
            updateCarousel();
        });
        pagination.appendChild(dot);

        items[index].addEventListener("click", () => {
            currentIndex = index;
            updateCarousel();
        });
    });

    function updateCarousel() {
        content.style.transform = `translateX(-${currentIndex * 100}%)`;
        document.querySelectorAll(".reviews__dot").forEach((dot, index) => {
            dot.classList.toggle("active", index === currentIndex);
        });
    }

    function nextItem() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }

    function prevItem() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    }

    function startAutoScroll() {
        interval = setInterval(nextItem, 5000);
    }

    function stopAutoScroll() {
        clearInterval(interval);
    }

    nextButton.addEventListener("click", () => {
        stopAutoScroll();
        nextItem();
        startAutoScroll();
    });

    prevButton.addEventListener("click", () => {
        stopAutoScroll();
        prevItem();
        startAutoScroll();
    });

    startAutoScroll();
    updateCarousel();

    const carouselContent = document.querySelector(".carousel__content");
    const carouselItems = document.querySelectorAll(".carousel__item");
    const carouselPagination = document.querySelector(".carousel__pagination");

    let carouselCurrentIndex = 0;
    let carouselInterval;

    carouselItems.forEach((_, index) => {
        const dot = document.createElement("div");
        dot.classList.add("carousel__dot");
        if (index === 0) dot.classList.add("active");
        dot.addEventListener("click", () => {
            carouselCurrentIndex = index;
            updateHeroCarousel();
        });
        carouselPagination.appendChild(dot);

        carouselItems[index].addEventListener("click", () => {
            carouselCurrentIndex = index;
            updateHeroCarousel();
        });
    });

    function updateHeroCarousel() {
        carouselContent.style.transform = `translateX(-${carouselCurrentIndex * 100}%)`;
        document.querySelectorAll(".carousel__dot").forEach((dot, index) => {
            dot.classList.toggle("active", index === carouselCurrentIndex);
        });
    }

    function nextHeroItem() {
        carouselCurrentIndex = (carouselCurrentIndex + 1) % carouselItems.length;
        updateHeroCarousel();
    }

    function startHeroAutoScroll() {
        carouselInterval = setInterval(nextHeroItem, 3000);
    }

    startHeroAutoScroll();

    // функцію toggleModal
    function toggleModal() {
        const modal = document.getElementById('privacyPolicyModal');
        const isExpanded = modal.getAttribute('aria-hidden') === 'false';
        modal.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
        document.querySelector('.close').setAttribute('aria-expanded', !isExpanded);
        modal.style.display = isExpanded ? "none" : "block";
    }

    // відкриття модального вікна
    var link = document.querySelector("a[href='/privacy-policy']");
    link.addEventListener("click", function (event) {
        event.preventDefault();
        toggleModal();
    });

    // закриття модального вікна
    var span = document.getElementsByClassName("close")[0];
    span.addEventListener("click", function () {
        toggleModal();
    });

    // закриття модального вікна при кліку поза ним
    window.addEventListener("click", function (event) {
        var modal = document.getElementById("privacyPolicyModal");
        if (event.target == modal) {
            toggleModal();
        }
    });

    // Пошта
    document.getElementById('contactForm').addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const privacyChecked = document.getElementById('privacyPolicy').checked;
        const errorElem = document.getElementById('errorMessage');

        errorElem.textContent = '';
        errorElem.style.color = '';

        if (!name) {
            errorElem.textContent = "Name is required.";
            errorElem.style.color = 'red';
            return;
        }

        if (!email && !phone) {
            errorElem.textContent = "Either email or phone is required.";
            errorElem.style.color = 'red';
            return;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorElem.textContent = "Invalid email format.";
            errorElem.style.color = 'red';
            return;
        }

        if (phone && !/^\d{10,}$/.test(phone)) {
            errorElem.textContent = "Phone must contain at least 10 digits.";
            errorElem.style.color = 'red';
            return;
        }

        if (!privacyChecked) {
            errorElem.textContent = "You must agree to the privacy policy.";
            errorElem.style.color = 'red';
            return;
        }

        // Отримати токен Turnstile
        const turnstileToken = document.querySelector('textarea[name="cf-turnstile-response"]')?.value;

        if (!turnstileToken) {
            errorElem.textContent = "Verification failed. Please try again.";
            errorElem.style.color = 'red';
            return;
        }

        const honeypot = document.getElementById('website').value;

        if (honeypot) {
            errorElem.textContent = "Spam detected.";
            errorElem.style.color = 'red';
            return;
        }

        const formData = new FormData(this);
        formData.append("cf-turnstile-response", turnstileToken);

        try {
            const response = await fetch('./contact.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                this.reset();
                errorElem.textContent = "Message sent successfully!";
                errorElem.style.color = 'green';
            } else {
                errorElem.textContent = result.error || "An error occurred.";
                errorElem.style.color = 'red';
            }
        } catch (err) {
            errorElem.textContent = "The server is not responding. Please try again later.";
            errorElem.style.color = 'red';
        }
    });


    // керування бургер-меню
    const burgerMenu = document.querySelector('.burger-menu');
    const navMenu = document.querySelector('.nav__menu');
    const burgerLines = document.querySelectorAll('.burger-menu__line');

    burgerMenu.addEventListener('click', () => {
        navMenu.classList.toggle('nav__menu--open');
        burgerLines.forEach(line => line.classList.toggle('burger-menu__line--open'));
    });

    // керування станом кнопки submit
    const privacyPolicyCheckbox = document.getElementById('privacyPolicy');
    const submitButton = document.querySelector('.contactUs__button');

    privacyPolicyCheckbox.addEventListener('change', function () {
        submitButton.disabled = !this.checked;
    });

    const languageButton = document.getElementById("languageSwitcher");

    // Перевірка наявності елемента languageSwitcher
    if (languageButton) {
        // Обробник натискання на кнопку
        languageButton.addEventListener("click", function () {
            const isEnglish = window.location.pathname.startsWith("/en");
            const newPath = isEnglish ? "/" : "/en"; // Змінюємо мову
            localStorage.setItem("selectedLanguage", newPath); // Запам’ятовуємо вибір
            window.location.href = newPath; // Перенаправляємо
        });
    }

    // Обробники натискання на кнопки "Show more"
    document.getElementById("showMoreBtnServices").addEventListener("click", function () {
        document.getElementById("services").classList.remove("section-hiden");
        this.style.display = "none"; // Ховаємо кнопку після натискання
    });

    document.getElementById("showMoreBtnAboutUs").addEventListener("click", function () {
        document.getElementById("aboutUs").classList.remove("section-hiden");
        this.style.display = "none"; // Ховаємо кнопку після натискання
    });

    document.getElementById("showMoreBtnAdvantages").addEventListener("click", function () {
        document.getElementById("advantages").classList.remove("section-hiden");
        this.style.display = "none"; // Ховаємо кнопку після натискання
    });

    document.getElementById("showMoreBtnTechMeans").addEventListener("click", function () {
        document.getElementById("techMeans").classList.remove("section-hiden");
        this.style.display = "none"; // Ховаємо кнопку після натискання
    });

    document.getElementById("showMoreBtnWorkProces").addEventListener("click", function () {
        document.getElementById("workProces").classList.remove("section-hiden");
        this.style.display = "none"; // Ховаємо кнопку після натискання
    });

    document.getElementById("showMoreBtnDangerous").addEventListener("click", function () {
        document.getElementById("dangerous").classList.remove("section-hiden");
        this.style.display = "none"; // Ховаємо кнопку після натискання
    });

    document.getElementById("showMoreBtnReviews").addEventListener("click", function () {
        document.getElementById("reviews").classList.remove("section-hiden");
        this.style.display = "none"; // Ховаємо кнопку після натискання
    });
});

