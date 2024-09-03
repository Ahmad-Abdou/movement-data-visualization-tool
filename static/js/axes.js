let AxesSvg = d3.select('.axes')
.append('svg')
.attr('width', SVGWIDTH)
.attr('height', SVGHEIGHT)

const data = [23,65,12,96,47,75,60]

let axes_width = SVGWIDTH - margin.left - margin.right
let axes_height = SVGHEIGHT - margin.top - margin.bottom

let xScale = d3.scaleLinear()
.domain([0,1])
.range([0, axes_width])

let yScale = d3.scaleLinear().domain([0,1]).range([axes_height, 0])

let xAxis = d3.axisBottom(xScale)
let gx = AxesSvg.append('g').attr('transform', `translate(${margin.left},${axes_height + margin.top})`)
xAxis(gx)

let yAxis = d3.axisLeft(yScale)
const gy = AxesSvg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
yAxis(gy)

const axesLines = [
  {points: [[0,0.5], [0.5, 1]]},
  {points: [[0,0.5], [0.5,0.5], [0.5,0]]},
  {points: [[0.5,0] , [1,0.5]]},
  {points:[[0,0], [1,1]]}
]

const axesLabels = [
  {text: '0', position:[0.22, 0.22]},
  {text:'1', position:[0.15, 0.85]},
  {text:"2", position:[0.85, 0.15 ]},
  {text:"3" , position:[0.7, 0.7]}
]

let axesLineGenerator = d3.line().x(d=>xScale(d[0] )).y(d=>yScale(d[1]))

axesLines.forEach((shape, index)=>{
    AxesSvg.append('path')
    .attr('d', axesLineGenerator(shape.points))
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
    .attr('fill', 'none')
    .attr('stroke', index === axesLines.length -1 ? 'grey': 'black')
    .attr('stroke-width', 2)
    .attr('stroke-dasharray', index === axesLines.length-1 ? '8': 'none')
})

axesLabels.forEach((label)=>{
  AxesSvg.append('text')
  .attr('x', xScale(label.position[0]))
  .attr('y', yScale(label.position[1]))
  .attr('transform', `translate(${margin.left} , ${margin.top})`)
  .attr('font-size', 40)
  .text(label.text)
})

const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
let colorsList = []

const allPlots = AxesSvg.append('g')
.attr('id', 'plots')
.selectAll('circle')
.data(data)
.join('circle')
.attr('r', 10)
.attr('cx', (d,i)=> (d * 6) + 100  )
.attr('fill' , (d,i) =>colorScale(i))

allPlots.on('mouseover', function (event, d) {
  const [x, y] = d3.pointer(event);

  AxesSvg.append('rect')
    .attr('id', 'tooltip2')
    .style('pointer-events', 'none');

  AxesSvg.append('text')
    .attr('id', 'tooltip1')
    .style('pointer-events', 'none');
  
}).on('mousemove', function (event,d) {
  const [x, y] = d3.pointer(event);

  AxesSvg.select('#tooltip2')
    .attr('width', 50)
    .attr('height', 40)
    .attr('x', x - 20)
    .attr('y', y - 50)
    .attr('width', 50)
    .attr('height', 40)
    .attr('fill', 'rgba(230, 224, 124, 0.7)')
    .attr('rx', 10)
    .attr('ry', 10)

  AxesSvg.select('#tooltip1')
  .attr('x', x + 5)
  .attr('y', y - 25)
  .attr('text-anchor', 'middle')
  .attr('fill', 'black')
  .attr('font-size', '20px')
  .text(d)
  
}).on('mouseout', function () {
  AxesSvg.select('#tooltip1').remove();
  AxesSvg.select('#tooltip2').remove();
});


allPlots.each((d,i,n)=>{
  d3.select(n[i])
  .transition()
  .ease(d3.easeBounce)
  .duration(2000)
  .attr('cy', (d,i) => (d * 3) + 80)
  colorsList.push(d3.select(n[i]).attr('fill'))
})

const rectGroup = AxesSvg.append('g')
  .attr('id', 'rectangles');

  const padding = 20;
  const rectWidth = 75;

  
const allRects = rectGroup.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('height', 20)
    .attr('y', SVGHEIGHT - 20)
    .attr('x', (d, i) => i * (rectWidth + padding) + margin.left - 25)
    .transition()
    .duration(2000)
    .attr('width', rectWidth)
    .attr('fill', (d, i) => colorsList[i])
    .attr('rx', 10)
    .attr('ry', 10);
  
    const file = d3.csv('../static/test_data/username.csv').then(data => {
      rectGroup.selectAll('text')
        .data(data)
        .join('text')
        .attr('y', SVGHEIGHT - 5)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .each((d, i, n) => {
          d3.select(n[i])
            .transition()
            .delay(i * 500)
            .duration(1500)
            .attr('x', (d, j) => (i * (rectWidth + padding) + rectWidth / 2) + margin.left - 25) 
            .text(d => d.Username);
        });
  
      rectGroup.selectAll('rect')
        .data(data)
        .on('mouseover', (event, d) => {
          const [x, y] = d3.pointer(event);
          AxesSvg.append('text')
            .attr('id', 'tooltip3')
            .attr('x', x)
            .attr('y', y - 15)
            .attr('fill', 'black')
            .text(d.Identifier);
        })
        .on('mousemove', (event) => {
          const [x, y] = d3.pointer(event);
          AxesSvg.select('#tooltip3')
            .attr('x', x)
            .attr('y', y - 15);
        })
        .on('mouseout', () => {
          AxesSvg.select('#tooltip3').remove();
        });
  });
