let isChecked = false

d3.select("#checkbox_1").on("change", function() {
    isChecked = d3.select(this).property("checked");
})

// const toggle_btn = document.getElementById("toggle-btn")
const trajectory = document.getElementById("trajectory")
const bar_chart = document.getElementById("bar-chart")
let bar = document.querySelector(".bar-chart")

// let toggled_pressed = true
// toggle_btn.addEventListener('click',()=>{
//   if(toggled_pressed){
//     trajectory.style.opacity = 1
//     if(bar){
//       bar.style.display ="block"
//     }
//     toggled_pressed = false
//   } else {
//     trajectory.style.opacity = 100   
//     if(bar){
//       bar.style.display ="block"
//       }
//     toggled_pressed = true
//   }
// })

// document.addEventListener('DOMContentLoaded', function() {
//   const controller = document.getElementById('controller');
  
//   controller.addEventListener('click', function() {
//       this.classList.toggle('expanded');
//   });
// });