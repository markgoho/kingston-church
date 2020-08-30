const navBar: HTMLDivElement = document.querySelector(".navbar-collapse");
const menuButton: HTMLButtonElement = document.querySelector(".navbar-toggler");
menuButton.addEventListener("click", () => {
  navBar.classList.toggle("show");
});
