
const treeSVG = d3.select('#taxonomy-container')
.append('svg')
.attr('width', SVGWIDTH + 55 )
.attr('height', (SVGHEIGHT /2 + 200) )


let tree_width = treeSVG.attr('width') - (margin.left - 70) - margin.right 
let tree_height = treeSVG.attr('height') -(margin.top + 30) - margin.bottom

const centered_circle = (tree_width /2) + margin.right

let tree_group = treeSVG.append('g')
                        

const tree_box_width = 90
const tree_box_height = 70
tree_group.append('rect')
.attr('width',tree_box_width)
.attr('height',tree_box_height)
.attr('x', centered_circle - 35)
.attr('y' , 50)
.attr('fill', 'none')
.attr('stroke', 'black')

tree_group.append('text')
.attr('text-anchor', 'middle')
.selectAll('tspan')
.data(['Movement', 'variables'])
.enter()
.append('tspan')
.attr('x', centered_circle + 10)
.attr('y', 70)
.attr('dy', (d, i) => i * 20) 
.text(d => d)
.attr('font-size', 16)

const offset = 110
let treeLineGenerator = d3.line().x(d=>d[0]).y(d=>d[1]).curve(d3.curveBasis)

let tree_lines = [
    {points: [[centered_circle + 10, 120], [centered_circle + 10,tree_height/2 + 30], [centered_circle - offset + 10, tree_height - offset]]},
    {points: [[centered_circle + 10, 120], [centered_circle + 10,tree_height/2 + 30], [centered_circle + offset + 10, tree_height - offset ]]},
] 


tree_lines.forEach((shape,index)=>{
    tree_group.append('path')
    .attr('d', treeLineGenerator(shape.points))
    .attr('stroke', 'black')
    .attr('stroke-width', '1')
    .attr('fill', 'none')
})

let tree_sub_lines = [
    {points: [[centered_circle - offset, tree_height - offset],[centered_circle - offset - margin.right,tree_height-40]]},
    {points: [[centered_circle - offset, tree_height - offset],[centered_circle - offset + margin.right,tree_height-40]]},
    {points: [[centered_circle + offset, tree_height - offset],[centered_circle + offset - margin.right,tree_height-40]]},
    {points: [[centered_circle + offset, tree_height - offset],[centered_circle + offset + margin.right,tree_height-40]]}
]

tree_sub_lines.forEach((shape,index)=>{
    tree_group.append('path')
    .attr('d', treeLineGenerator(shape.points))
    .attr('stroke', 'black')
    .attr('stroke-width', '1')
    .attr('fill', 'none')
    .attr('transform',`translate(10, 70)`)
})

let tree_lables = [
    {text: "Geometric", position:[centered_circle +offset , tree_height - offset]},
    {text: "Kinematic", position:[centered_circle - offset, tree_height- offset]},
]

let tree_sub_labels =[
    {text: "Speed", position:[centered_circle - offset - margin.right ,tree_height]},
    {text: "Acceleration", position:[centered_circle - offset + margin.right,tree_height]},

    {text: "Curvature", position:[centered_circle + offset - margin.right,tree_height]},
    {text: "Indentation", position:[centered_circle + offset + margin.right,tree_height]},
]


let selectedRects = [];

function toggleColor(element, text) {
    const currentColor = element.attr('fill');
   
    if (selectedRects.length < 2) {
        if (currentColor === "white") {
            element.attr('fill', '#B9E7F5');
            selectedRects.push({ element: element, text: text });
        }
    } else if (currentColor === "white" && selectedRects.length === 2) {
        selectedRects[0].element.attr('fill', 'white');
        selectedRects.shift();
        element.attr('fill', '#B9E7F5');
        selectedRects.push({ element: element, text: text });
    }

    if (selectedRects.length === 2) {
        const xText = selectedRects[0].text;
        const yText = selectedRects[1].text;
        showData(xText, yText);
    }

    console.log(selectedRects)
}


text_combined = [];
let unsorted_combination = ""
// function standardizeCombination(str1, str2) {
//     return [str1, str2].sort().join(' ');
// }

function showData(xAxis, yAxis) {    
    unsorted_combination = `${xAxis} ${yAxis}`
    // let combinedString = standardizeCombination(xAxis, yAxis);
    let combinedString = unsorted_combination;
    // console.log(combinedString)
    get_title_axis_lables(xAxis, yAxis)    

    if (file_mapping.hasOwnProperty(combinedString)) {        
        let selectedFile = file_mapping[combinedString];
        d3.csv(selectedFile)
            .then(data => {
                showAxes(data);
                combination = combinedString                
                heatmap.render();
            })
            .catch(error => {
                console.error("Error loading file: ", error);
            });
    } 
}
function colorTreeElement(element1, element2) {
    tree_lables.forEach((label, i) => {
        let rect = tree_group.append('rect')
            .attr('id', `${label.text}`)
            .attr('width', tree_box_width)
            .attr('height', tree_box_height)
            .attr('x', label.position[0])
            .attr('y', label.position[1])
            .attr('transform', `translate(-35, 0)`)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .on("click", function () {
                toggleColor(d3.select(this), label.text);  
            });
            if (element1 == rect._groups[0][0].id ) { 
                toggleColor(rect, element1)
            }
            else if ( element2 == rect._groups[0][0].id ) { 
                toggleColor(rect, element2)
            }
        let text = tree_group.append('text')
            .attr('x', label.position[0] + 10)
            .attr('y', label.position[1] + 35)
            .text(label.text)
            .attr('font-size', '16')
            .attr('text-anchor', 'middle')
            .on("click", function () {
                toggleColor(rect, label.text);
            });

    });
    
    tree_sub_labels.forEach((label, i) => {
        let rect = tree_group.append('rect')
            .attr('id', `${label.text}`)
            .attr('width', tree_box_width)
            .attr('height', tree_box_height)
            .attr('x', label.position[0])
            .attr('y', label.position[1])
            .attr('transform', `translate(-35, 30)`)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .on("click", function () {
                toggleColor(d3.select(this), label.text);
            });
            if (element1 == rect._groups[0][0].id ) { 
                toggleColor(rect, element1)
            }
            else if ( element2 == rect._groups[0][0].id ) { 
                toggleColor(rect, element2)
            }
        let text = tree_group.append('text')
            .attr('x', label.position[0] + 10)
            .attr('y', label.position[1] + 70)
            .text(label.text)
            .attr('font-size', '16')
            .attr('text-anchor', 'middle')
            .on("click", function () {
                toggleColor(rect, label.text);
            });
            
    });
}

colorTreeElement(null, null)