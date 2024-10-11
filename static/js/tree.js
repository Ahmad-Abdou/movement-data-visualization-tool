const treeSVG = d3.select('.tree')
.append('svg')
.attr('width', SVGWIDTH  )
.attr('height', (SVGHEIGHT /2 + 200) )


let tree_width = treeSVG.attr('width') - margin.left - margin.right
let tree_height = treeSVG.attr('height') -margin.top - margin.bottom

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
.data(['Movment', 'variables'])
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

tree_lables.forEach((label, i) => {
    tree_group.append('rect')
        .attr('id', `box-${i}`)
        .attr('width', tree_box_width)
        .attr('height', tree_box_height)
        .attr('x', label.position[0])
        .attr('y', label.position[1])
        .attr('transform', `translate(-35, 0)`)
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .on("click", function () {
            toggleColor(d3.select(this));
            showData(label.text)
        });

    tree_group.append('text')
        .attr('x', label.position[0] + 10)
        .attr('y', label.position[1] + 35)
        .text(label.text)
        .attr('font-size', '16')
        .attr('text-anchor', 'middle')
        .on("click", function () {
            toggleColor(d3.select(`#box-${i}`));
            showData(label.text)
        });
});



let tree_sub_labels =[
    {text: "Speed", position:[centered_circle - offset - margin.right ,tree_height]},
    {text: "Accelration", position:[centered_circle - offset + margin.right,tree_height]},

    {text: "Curvature", position:[centered_circle + offset - margin.right,tree_height]},
    {text: "Indentation", position:[centered_circle + offset + margin.right,tree_height]},
]

tree_sub_labels.forEach((label, i)=>{
    tree_group.append('rect')
    .attr('id', `box-lvl-${i}`)
    .attr('width',tree_box_width)
    .attr('height',tree_box_height)
    .attr('x', label.position[0])
    .attr('y' , label.position[1])
    .attr('transform',`translate(-35, 30)`)
    .attr('fill', 'white')
    .attr('stroke', 'black')
    .on("click", function () {
        toggleColor(d3.select(this));
        showData(label.text)
    });

    tree_group.append('text')
    .attr('x', label.position[0] + 10)
    .attr('y', label.position[1] + 70)
    .text(label.text)
    .attr('font-size', '16')
    .attr('text-anchor', 'middle')
    .on("click", function () {
        toggleColor(d3.select(`#box-lvl-${i}`));
        showData(label.text)
    });
})


let selectedRects = [];

function toggleColor(element, text) {
    const currentColor = element.attr('fill');

    if (selectedRects.length < 2) {
        if (currentColor === "white") {
            element.attr('fill', '#00A86B');
            selectedRects.push({ element: element, text: text });
        }
    } else if (currentColor === "white" && selectedRects.length === 2) {
        selectedRects[0].element.attr('fill', 'white');
        selectedRects.shift();
        element.attr('fill', '#00A86B');
        selectedRects.push({ element: element, text: text });
    }

    if (selectedRects.length === 2) {
        const xText = selectedRects[0].text;
        const yText = selectedRects[1].text;
        showData(xText, yText);
    }
}


text_combined = [];

function showData(xAxis, yAxis) {
    let combinedString = `${xAxis} ${yAxis}`;
    let file_mapping = {
        "Kinematic Geometric": '../static/data_combination_foxes/foxes_Xkinematic_Ygeometric_decision_scores.csv',
        "Kinematic Curvature": '../static/data_combination_foxes/foxes_Xkinematic_Ycurvature_decision_scores.csv',
        "Kinematic Indentation": '../static/data_combination_foxes/foxes_Xkinematic_Yindentation_decision_scores.csv',
        "Geometric Speed": '../static/data_combination_foxes/foxes_Xgeometry_Yspeed_decision_scores.csv',
        "Geometric Accelration": '../static/data_combination_foxes/foxes_Xgeometry_Yacceleration_decision_scores.csv',
        "Speed Accelration": '../static/data_combination_foxes/foxes_Xspeed_Yacceleration_decision_scores.csv',
        "Speed Curvature": '../static/data_combination_foxes/foxes_Xcurvature_Yspeed_decision_scores.csv',
        "Speed Indentation": '../static/data_combination_foxes/foxes_Xindentation_Yspeed_decision_scores.csv',
        "Accelration Curvature": '../static/data_combination_foxes/foxes_Xcurvature_Yacceleration_decision_scores.csv',
        "Accelration Indentation": '../static/data_combination_foxes/foxes_Xindentation_Yacceleration_decision_scores.csv',
        "Curvature Indentation": '../static/data_combination_foxes/foxes_Xindentation_Ycurvature_decision_scores.csv',
    };

    if (file_mapping.hasOwnProperty(combinedString)) {
        let selectedFile = file_mapping[combinedString];

        d3.csv(selectedFile).then(data => {
            showAxes(data)
           
        }).catch(error => {
            console.error("Error loading file: ", error);
        });
    }
}
tree_lables.forEach((label, i) => {
    let rect = tree_group.append('rect')
        .attr('id', `box-${i}`)
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
        .attr('id', `box-lvl-${i}`)
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