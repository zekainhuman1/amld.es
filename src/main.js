// import './style.css'

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

    // Валідація форми
    document.getElementById("contactForm").addEventListener("submit", function (event) {
        let name = document.getElementById("name").value.trim();
        let email = document.getElementById("email").value.trim();
        let phone = document.getElementById("phone").value.trim();
        let errorMessage = document.getElementById("errorMessage");

        errorMessage.textContent = "";

        if (!name) {
            errorMessage.textContent = "Name is required.";
            event.preventDefault();
            return;
        }

        if (!email && !phone) {
            errorMessage.textContent = "Either Email or Phone is required.";
            event.preventDefault();
            return;
        }

        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errorMessage.textContent = "Invalid Email format.";
            event.preventDefault();
            return;
        }

        if (phone && !/^\d{10,}$/.test(phone)) {
            errorMessage.textContent = "Phone must contain at least 10 digits.";
            event.preventDefault();
            return;
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
        // Отримуємо мову браузера
        let browserLang = navigator.language || navigator.userLanguage;
        browserLang = browserLang.split("-")[0]; // Беремо тільки код мови (es, en)

        // Отримуємо поточну мову з URL
        const isEnglish = window.location.pathname.startsWith("/en");

        // Отримуємо вибрану мову з localStorage
        const selectedLanguage = localStorage.getItem("selectedLanguage");

        // Якщо вибрана мова збережена в localStorage, використовуємо її
        if (selectedLanguage) {
            if (selectedLanguage === "/en" && !isEnglish) {
                window.location.href = "/en";
            } else if (selectedLanguage === "/" && isEnglish) {
                window.location.href = "/";
            }
        } else {
            // Якщо мова браузера не іспанська і сторінка ще не /en → переадресовуємо
            if (!isEnglish && browserLang !== "es") {
                window.location.href = "/en";
            }
        }

        // Обробник натискання на кнопку
        languageButton.addEventListener("click", function () {
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

