//탭메뉴
const tab_btn = document.querySelectorAll(".scheduling__tab .btn__tab");
const tab_content = document.querySelectorAll(".scheduling__content__item");

tab_btn.forEach((tab, idx) => {
  tab.addEventListener("click", function () {
    tab_content.forEach((inner) => {
      inner.classList.remove("active");
    });

    tab_btn.forEach((item) => {
      item.classList.remove("active");
    });

    tab_btn[idx].classList.add("active");
    tab_content[idx].classList.add("active");
  });
});
