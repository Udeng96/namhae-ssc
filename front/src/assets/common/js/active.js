//active 추가
function addToggle(element){
  element.addEventListener('click', (event) => {
    element.classList.toggle('active');
    event.stopPropagation();
  });
}
