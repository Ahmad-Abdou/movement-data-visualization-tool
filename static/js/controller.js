let isChecked = false

d3.select("#checkbox_1").on("change", function() {
    isChecked = d3.select(this).property("checked");
})

const toggle_btn = document.getElementById("toggle-btn")
const trajectory = document.getElementById("trajectory")
const bar_chart = document.getElementById("bar-chart")
let bar = document.querySelector(".bar-chart")

let toggled_pressed = true

if (toggle_btn && trajectory && bar_chart) {
    toggle_btn.addEventListener('click', () => {
        if(toggled_pressed){
            trajectory.style.opacity = 0
            if(bar){
                bar.style.display ="block"
            }
            toggled_pressed = false
        } else {
            trajectory.style.opacity = 100   
            if(bar){
                bar.style.display ="none"
            }
            toggled_pressed = true
        }
    });
}


const rightPanel = document.getElementById('right-container')
rightPanel.addEventListener('mouseover', ()=> {
        rightPanel.style.transform = 'translate(0px, 0)'
        
})
rightPanel.addEventListener('mouseout', ()=> {
    rightPanel.style.transform = 'translate(99%, 0)'
})

const leftPanel = document.getElementById('left-container')
leftPanel.addEventListener('mouseover', ()=> {
        leftPanel.style.transform = 'translate(0px, 0)'
        
})
leftPanel.addEventListener('mouseout', ()=> {
    leftPanel.style.transform = 'translate(-99%, 0)'
})
