//this is javascript that interacts with Eva's navbar html, and styles.css, it won't work unless that code is integrated.

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');

if (menu && menuLinks) {
  menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
  });
}
