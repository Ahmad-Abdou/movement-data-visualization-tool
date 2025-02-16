let isChecked = false
let pinned_left = false
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

const leftPanel = document.getElementById('left-container')
const rightPanel = document.getElementById('right-container')
const pin_right= document.getElementById('pin-right')
const pin_left= document.getElementById('pin-left')

rightPanel.addEventListener('mouseover', ()=> {
    if(pin_right.className != 'pinned_right') {
        rightPanel.style.transform = 'translate(0px, 0)'
        pin_right.style.transform = 'translate(-475px, 0)'
        pin_right.style.width = '60px'
        pin_right.style.height = '100px'
    }  
})
rightPanel.addEventListener('mouseout', ()=> {
    if(pin_right.className != 'pinned_right') {
        rightPanel.style.transform = 'translate(99%, 0)'
        pin_right.style.transform = 'translate(0px, 0)'
        pin_right.style.width = '20px'
        pin_right.style.height = '160px'
    }
})
pin_right.addEventListener('mouseover', ()=> {
    if(pin_right.className != 'pinned_right') {
        rightPanel.style.transform = 'translate(0px, 0)'
        pin_right.style.transform = 'translate(-475px, 0)'
        pin_right.style.width = '60px'
        pin_right.style.height = '100px'
    }
})

pin_right.addEventListener('mouseout', ()=> {
    if(pin_right.className != 'pinned_right') {
        rightPanel.style.transform = 'translate(99%, 0)'
        pin_right.style.transform = 'translate(0, 0)'
        pin_right.style.width = '20px'
        pin_right.style.height = '160px'
    }
})

pin_right.addEventListener('click',() => {
    if(pin_right.className == 'pinned_right') {
        pin_right.style.backgroundColor = '#0080FF'
        pin_right.className = ''
        rightPanel.style.animationName = ''
        rightPanel.style.animationDuration = '0s'
    } else {
        pin_right.className = 'pinned_right'
        pin_right.style.backgroundColor = '#DC143C80'
        rightPanel.style.animationName = ' horizontal-shaking'
        rightPanel.style.animationDuration = '0.3s'
    }
})

leftPanel.addEventListener('mouseover', ()=> {
    if(pin_left.className != 'pinned_left') {
        leftPanel.style.transform = 'translate(0px, 0)'
        pin_left.style.transform = 'translate(475px, 0)'
        pin_left.style.width = '60px'
        pin_left.style.height = '100px'
    }
})
leftPanel.addEventListener('mouseout', ()=> {
    if(pin_left.className != 'pinned_left') {
        leftPanel.style.transform = 'translate(-99%, 0)'
        pin_left.style.transform = 'translate(0px, 0)'
        pin_left.style.width = '20px'
        pin_left.style.height = '160px'
    }

})

pin_left.addEventListener('mouseover', ()=> {
    if(pin_left.className != 'pinned_left') {
        leftPanel.style.transform = 'translate(0px, 0)'
        pin_left.style.transform = 'translate(475px, 0)'
        pin_left.style.width = '60px'
        pin_left.style.height = '100px'
    }

})
pin_left.addEventListener('mouseout', ()=> {
    if(pin_left.className != 'pinned_left') {
        leftPanel.style.transform = 'translate(-99%, 0)'
        pin_left.style.transform = 'translate(0px, 0)'
        pin_left.style.width = '20px'
        pin_left.style.height = '160px'
    }
})

pin_left.addEventListener('click',() => {
    if(pin_left.className == 'pinned_left') {
        pin_left.style.backgroundColor = '#0080FF'
        pin_left.className = ''
        leftPanel.style.animationName = ''
        leftPanel.style.animationDuration = '0s'
    } else {
        pin_left.className = 'pinned_left'
        pin_left.style.backgroundColor = '#DC143C80'
        leftPanel.style.animationName = ' horizontal-shaking'
        leftPanel.style.animationDuration = '0.3s'
    }
})