let index = 0;
const slides = document.querySelectorAll(".slide");
const slider = document.querySelector(".slider");

function showSlide(i) {
    if (i >= slides.length) index = 0;
    if (i < 0) index = slides.length - 1;
    slider.style.transform = `translateX(${-index * 100}%)`;
}

document.querySelector(".prev").addEventListener("click", () => { showSlide(--index); });
document.querySelector(".next").addEventListener("click", () => { showSlide(++index); });

setInterval(() => { showSlide(++index); }, 3000); // Auto-slide every 3 seconds
