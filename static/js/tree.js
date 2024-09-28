const treeSVG = d3.select('.tree')
.append('svg')
.attr('width', SVGWIDTH /2)
.attr('height', SVGHEIGHT /2)


let tree_width = treeSVG.attr('width') - margin.left - margin.right
let tree_height = treeSVG.attr('height') -margin.top - margin.bottom

const centered_circle = (tree_width /2) + margin.right
let tree_group = treeSVG.append('g')

tree_group.append('rect')
.attr('width',' 70')
.attr('height',' 45')
.attr('x', centered_circle - 35)
.attr('y' , 50)
.attr('fill', 'none')
.attr('stroke', 'black')

tree_group.append('text')
.attr('x', centered_circle - 25)
.attr('y', 80)
.attr('text-anchor', 'middle')
.selectAll('tspan')
.data(['Movment', 'variables'])
.enter()
.append('tspan')
.attr('x', centered_circle)
.attr('y', 65)
.attr('dy', (d, i) => i * 20) 
.text(d => d)
.attr('font-size', 12)

const offset = 110
let treeLineGenerator = d3.line().x(d=>d[0]).y(d=>d[1]).curve(d3.curveBasis)

let tree_lines = [
    {points: [[centered_circle, 95], [centered_circle,tree_height/2], [centered_circle - offset, tree_height - offset]]},
    {points: [[centered_circle, 95], [centered_circle,tree_height/2], [centered_circle + offset, tree_height - offset]]},
] 


tree_lines.forEach((shape,index)=>{
    tree_group.append('path')
    .attr('d', treeLineGenerator(shape.points))
    .attr('stroke', 'black')
    .attr('stroke-width', '1')
    .attr('fill', 'none')
})

let tree_sub_lines = [
    {points: [[centered_circle - offset, tree_height - offset],[centered_circle - offset - margin.right,tree_height-15]]},
    {points: [[centered_circle - offset, tree_height - offset],[centered_circle - offset + margin.right,tree_height-15]]},
    {points: [[centered_circle + offset, tree_height - offset],[centered_circle + offset - margin.right,tree_height-15]]},
    {points: [[centered_circle + offset, tree_height - offset],[centered_circle + offset + margin.right,tree_height -15]]}
]

tree_sub_lines.forEach((shape,index)=>{
    tree_group.append('path')
    .attr('d', treeLineGenerator(shape.points))
    .attr('stroke', 'black')
    .attr('stroke-width', '1')
    .attr('fill', 'none')
    .attr('transform',`translate(0, 45)`)
})

let tree_lables = [
    {text: "Geometric", position:[centered_circle +offset, tree_height - offset]},
    {text: "Kinematic", position:[centered_circle - offset, tree_height- offset]},
]

tree_lables.forEach((label, i) => {
    tree_group.append('rect')
        .attr('id', i)
        .attr('width', '70')
        .attr('height', '45')
        .attr('x', label.position[0])
        .attr('y', label.position[1])
        .attr('transform', `translate(-35, 0)`)
        .attr('fill', 'transparent')
        .attr('stroke', 'black')
        .on("click", function () {
            const currentColor = d3.select(this).attr('fill')
            d3.select(this)
            .attr('fill',  currentColor === 'white'? ' #00A86B':'white')
        });

    tree_group.append('text')
        .attr('x', label.position[0])
        .attr('y', label.position[1] + 25)
        .text(label.text)
        .attr('font-size', '12')
        .attr('text-anchor', 'middle')
});

let tree_sub_labels =[
    {text: "Speed", position:[centered_circle - offset - margin.right ,tree_height]},
    {text: "Accelration", position:[centered_circle - offset + margin.right,tree_height]},

    {text: "Curvature", position:[centered_circle + offset - margin.right,tree_height]},
    {text: "Indentation", position:[centered_circle + offset + margin.right,tree_height]},
]

tree_sub_labels.forEach((lable)=>{
    tree_group.append('rect')
    .attr('width',' 70')
    .attr('height',' 45')
    .attr('x', lable.position[0])
    .attr('y' , lable.position[1])
    .attr('transform',`translate(-35, 30)`)
    .attr('fill', 'none')
    .attr('stroke', 'black')

    tree_group.append('text')
    .attr('x', lable.position[0])
    .attr('y', lable.position[1] + 55)
    .text(lable.text)
    .attr('font-size', '12')
    .attr('text-anchor', 'middle')
})