
const lnb_item = document.querySelectorAll('.lnb__menu__item');

lnb_item.forEach((item) => {
  item.addEventListener('click', () => {
    lnb_item.forEach((item) => {item.classList.remove('active');})
    item.classList.add('active');
  });
});
