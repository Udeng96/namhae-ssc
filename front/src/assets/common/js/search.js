
const btn_drop = document.querySelectorAll('.btn__search__select--drop');
const search_select_head = document.querySelectorAll('.search__select__head');

btn_drop.forEach((btn_drop) => {
  btn_drop.addEventListener("click", (e) => {
    e.target.parentNode.classList.toggle('active');
  });
});