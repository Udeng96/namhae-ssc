
// const tooltip = document.querySelector('.tooltip');
//
// function tooltipBox(element, maxWidth, x, y){
//
//   element.forEach((item) =>{
//     item.addEventListener('mousemove', () => {
//       let elementX = item.getBoundingClientRect().left;
//       let elementY = item.getBoundingClientRect().top;
//
//       let text = item.innerText;
//       // console.log("item x : " + x + ", Y : " + y);
//
//       let tooltipX = elementX + x;
//       let tooltipY = elementY + y;
//
//       tooltip.style.cssText = `display: block; max-width: ${maxWidth}px; transform: translate(${tooltipX}px, ${tooltipY}px);`;
//       tooltip.innerText = text;
//     });
//
//     item.addEventListener('mouseout', () => {
//       tooltip.style.cssText = `display: none;`;
//     });
//   });
// };
//
// const gis_search_name = document.querySelectorAll('.gis__search__name');
// const cctvClustering_item_name = document.querySelectorAll('.cctvClustering__item__name');
// const content_name = document.querySelectorAll('.search__list__item .content__name');
//
// //툴팁
// tooltipBox(gis_search_name, 212, 30, 19);
// tooltipBox(cctvClustering_item_name, 154, 5, 17);
// tooltipBox(content_name, 152, 5, 20);