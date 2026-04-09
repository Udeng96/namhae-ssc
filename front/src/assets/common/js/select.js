function loadSelectbox(element) {
  
  const body = document.querySelector('body');
  let currentSelectBox = null;

  // NodeList -> Array
  const selectBoxes = Array.from(element.querySelectorAll('.select-box'));

  selectBoxes.forEach((selectBox) => {
    const btn = selectBox.querySelector('.btn--select');
    const list = selectBox.querySelector('.select__list__wrap');

    // 선택 박스 버튼 클릭 시 리스트 박스 활성화
    btn.addEventListener('click', (event) => {
      currentSelectBox = selectBox;
      selectBox.classList.toggle('active');
    });
    
    list.items = Array.from(list.querySelectorAll('.select__list'));

    list.items.forEach((listItem) => {
      const listBtn = listItem.querySelector('.select__list__item');

      // 리스트 박스에서 아이템 버튼 클릭 시 적용
      listBtn.addEventListener('click', () => {
        if (!listItem.classList.contains('selected')) {
          // 새로 적용된 경우 텍스트 반영
          btn.innerHTML = listBtn.innerHTML;
        }

        // 리스트에 selected 있으면 지움
        list.items.forEach((listItem) => listItem.classList.remove('selected'));

        // 아이템 버튼에 selected 적용
        listItem.classList.add('selected');

        // 리스트 박스 비활성화
        selectBox.classList.remove('active');
      });
    });
  });
  
  body.addEventListener('click', () => {
    selectBoxes.filter((_) => currentSelectBox !== _).forEach((selectBox) => {
      if (selectBox.classList.contains('active')) {
        selectBox.classList.remove('active');
      }
    });
    currentSelectBox = null;
  });
}

loadSelectbox(document);
