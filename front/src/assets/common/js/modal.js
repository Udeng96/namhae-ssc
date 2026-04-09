
function modalPopup(modalId){
  const modal = document.querySelector(`#${modalId}`);
  const btn_close = modal.querySelectorAll('.btn-close');
  const head = modal.querySelector('.modal__cctv__content__head');

  //열기
  if(!modal.classList.contains('modal--open')){
    modal.classList.add('modal--open');
    modal.classList.remove('modal--hidden');
  };

  //닫기
  btn_close.forEach((close) => {
    close.addEventListener('click', () => {
      modal.classList.remove('modal--open');
      modal.classList.add('modal--hidden');
    });
  });

  head.addEventListener('dblclick', () => {
    modal.classList.remove('modal--open');
    modal.classList.add('modal--hidden');
  });

  window.addEventListener("keyup", (e) => {
    const keyCode = e.keyCode;
    if (keyCode  == 27) {
      modal.classList.remove('modal--open');
      modal.classList.add('modal--hidden');
    }
  });
}

function toastPopup(toastId){
  const toast = document.querySelector(`#${toastId}`);
  const btn_close = toast.querySelectorAll('.btn__toast--close');

  //열기
  if(!toast.classList.contains('toast--open')){
    toast.classList.add('toast--open');
    toast.classList.remove('toast--hidden');
  };

  //닫기
  btn_close.forEach((close) => {
    close.addEventListener('click', () => {
      toast.classList.remove('toast--open');
      toast.classList.add('toast--hidden');
    });
  });
  
  setTimeout( ()=>{ 
    toast.classList.remove('toast--open');
    toast.classList.add('toast--hidden');
  }, 2000);
  
  clearTimeout(toast);
}


const toast = document.querySelectorAll('toast');
const btn_close = document.querySelectorAll('.btn__toast--close');

//닫기
btn_close.forEach((close) => {
  close.addEventListener('click', (e) => {
    e.target.parentNode.classList.remove('toast--open');
    e.target.parentNode.classList.add('toast--hidden');
  });
});