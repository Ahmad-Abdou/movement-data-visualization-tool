const boxSVG = d3.select('.box')
.append('svg')
.attr('width', SVGWIDTH/2)
.attr('height', SVGHEIGHT/2)

let box_width = boxSVG.attr('width') - margin.left - margin.right
let box_height = boxSVG.attr('height') - margin.top - margin.bottom

const xScale_box = d3.scaleLinear().domain([0,100]).range([margin.left + margin.right, box_width/2])
const yScale_box = d3.scaleLinear().domain([0,100]).range([box_height, 0])

let boxSVG_group = boxSVG.append('g')
.attr('transform', `translate(${margin.left}, ${margin.top})`)

boxSVG_group.append('rect')
.attr('width', box_width/2 )
.attr('height', box_height/2)
.attr('fill', 'none')
.attr('stroke', 'black')
.attr('x', margin.left)
.attr('y', margin.top)

const box_lineGenerator = d3.line().x(d=>d[0]).y(d=>d[1])


const box_lines = [
  {points: [[xScale_box(50), yScale_box(100) + margin.top], [xScale_box(50), yScale_box(100)], [xScale_box(15), yScale_box(100)], [xScale_box(85), yScale_box(100)]]},
  {points: [[xScale_box(50), yScale_box(50) + margin.bottom], [xScale_box(50), yScale_box(20)], [xScale_box(15), yScale_box(20)], [xScale_box(85), yScale_box(20)]]},
]


boxSVG_group.selectAll('path')
.data(box_lines).join('path')
.attr('d', d=> box_lineGenerator(d.points))
.attr('stroke', 'black')
.attr('fill', 'none')


