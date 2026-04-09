//닫기
// const icon_btn_close = document.querySelectorAll('.gis__icon__box .btn-close');

// icon_btn_close.forEach((btn) => {
//   btn.addEventListener('click', () => {
//     const iconisActive = btn.parentNode.parentNode.parentNode.firstElementChild;
//     const cctvisActive = btn.parentNode.parentNode.parentNode.previousElementSibling;
//     const factilityisActive = btn.parentNode.parentNode.previousElementSibling;

//     if(iconisActive.classList.contains('active') || cctvisActive.classList.contains('active') || factilityisActive.classList.contains('active')){
//       iconisActive.classList.remove('active');
//       cctvisActive.classList.remove('active');
//       factilityisActive.classList.remove('active');
//     }
//   });
// });



//맵 컨트롤러
const btn_func = document.querySelectorAll('.btn__func');

btn_func.forEach((btn) => {
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
  });
});

var map = L.map("map").setView([34.8377, 127.8924], 13);

L.tileLayer("https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

//위성지도
const map_type = document.querySelectorAll('.btn__gis__map--type');
map_type.forEach((btn) => {
  btn.addEventListener('click', () => {
    map_type.forEach((btn) => btn.classList.remove('active'));
    
    if(!btn.classList.contains('active')){
      btn.classList.add('active');
      if(btn.classList.contains('sate') && btn.classList.contains('active')){
        L.tileLayer("https://xdworld.vworld.kr/2d/Satellite/service/{z}/{x}/{y}.jpeg", {
          maxZoom: 19,
        }).addTo(map);
      }else{
        L.tileLayer("https://xdworld.vworld.kr/2d/Base/service/{z}/{x}/{y}.png", {
          maxZoom: 19,
        }).addTo(map);
      }
    }   
  });
});

//히트맵
const map_heatmap = document.querySelector('.btn__gis__map--heatmap');
addToggle(map_heatmap);

const gis_legend_heatmap = document.querySelector('.gis__legend__heatmap');

map_heatmap.addEventListener('click', () => {
  
  if(map_heatmap.classList.contains('active')){
    gis_legend_heatmap.classList.add('active');
  }else{
    gis_legend_heatmap.classList.remove('active');
  }
})

