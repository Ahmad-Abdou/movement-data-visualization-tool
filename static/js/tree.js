const treeSVG = d3.select('.tree')
.append('svg')
.attr('width', SVGWIDTH /2)
.attr('height', SVGHEIGHT /2)


let tree_width = treeSVG.attr('width') - margin.left - margin.right
let tree_height = treeSVG.attr('height') -margin.top - margin.bottom

const centered_circle = (tree_width /2) + margin.right
let tree_group = treeSVG.append('g')

tree_group.append('circle')
.attr('r', 25)
.attr('cx', centered_circle)
.attr('cy' , 50)
.attr('fill', 'green')

const offset = 110
let tree_lines = [
    {points: [[centered_circle, 50], [centered_circle,tree_height/2], [centered_circle - offset, tree_height - offset]]},
    {points: [[centered_circle, 50], [centered_circle,tree_height/2], [centered_circle + offset, tree_height - offset]]},
    {points: [[centered_circle - offset, tree_height - offset],[centered_circle - offset - margin.right,tree_height]]},
    {points: [[centered_circle - offset, tree_height - offset],[centered_circle - offset + margin.right,tree_height]]},
    {points: [[centered_circle + offset, tree_height - offset],[centered_circle + offset - margin.right,tree_height]]},
    {points: [[centered_circle + offset, tree_height - offset],[centered_circle + offset + margin.right,tree_height]]},
] 

let tree_lables = [
    {text: "Geometric", postion:[centered_circle +offset, tree_height - offset]},
    {text: "Kinematic", postion:[centered_circle - offset, tree_height- offset]},

    {text: "Speed", postion:[centered_circle - offset - margin.right ,tree_height]},
    {text: "Accelration", postion:[centered_circle - offset + margin.right,tree_height]},

    {text: "Curvature", postion:[centered_circle + offset - margin.right,tree_height]},
    {text: "Indentation", postion:[centered_circle + offset + margin.right,tree_height]},
]
let treeLineGenerator = d3.line().x(d=>d[0]).y(d=>d[1]).curve(d3.curveBasis)
tree_lines.forEach((shape,index)=>{
    tree_group.append('path')
    .attr('d', treeLineGenerator(shape.points))
    .attr('stroke', 'green')
    .attr('stroke-width', '3')
    .attr('fill', 'none')
})

tree_lables.forEach((lable)=>{
    tree_group.append('circle')
    .attr('r', 35)
    .attr('cx', lable.postion[0])
    .attr('cy' , lable.postion[1])
    .attr('fill', 'green')

    tree_group.append('text')
    .attr('x', lable.postion[0] - 25)
    .attr('y', lable.postion[1])
    .text(lable.text)
    .attr('font-size', '12')
    
})