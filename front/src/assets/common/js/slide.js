// 사이드 클릭 시
const content_left = document.querySelector('.content--left');
const content_right= document.querySelector('.content--right');

const btn_slide = document.querySelector('.btn__slide');
const slide_left = document.querySelector('.btn__slide--left');
const slide_right = document.querySelector('.btn__slide--right');

const gis_map = document.querySelector('.gis__map');
const gis_controller = document.querySelector('.gis__controller');
const gis_search = document.querySelector('.gis__search');
const gis_legend = document.querySelector('.gis__legend');

slide_left.addEventListener('click', () =>{
  slide_left.classList.toggle('active');
  content_left.classList.toggle('active');
  gis_search.classList.toggle('move');
  
  if(!content_left.classList.contains('active')){
    content_left.classList.remove('active');
  }
});

slide_right.addEventListener('click', () =>{
  content_right.classList.toggle('active');
  slide_right.classList.toggle('active');
  
  gis_map.classList.toggle('move');
  gis_controller.classList.toggle('move');
  // heatmap__legend.classList.toggle('move');
  gis_legend.classList.toggle('move');

  if(!content_right.classList.contains('active')){
    content_right.classList.remove('active');
  }
});