let svg = d3.select('.axes').append('svg')

svg.attr('width', 700).attr('height', 650)

const SVGWIDTH = document.querySelector('svg').clientWidth;
const SVGHEIGHT = document.querySelector('svg').clientHeight;
const xPadding = 35
const yPadding = 70

const data = [23,65,12,96,47,75,60]


let yScale = d3.scaleLinear()
  .domain([0, d3.max(data)])
  .range([SVGHEIGHT - 10, 100]);

let yAxisLeft =  d3.axisLeft(yScale)
let yAxisLeftG = svg.append('g')
.attr('id', 'yAxisLeftG')
.attr('transform', 'translate(40,-60)')
yAxisLeft(yAxisLeftG)

let xScale = d3.scaleLinear()
  .domain([0, data.length - 1])
  .range([75, SVGWIDTH - 50]);

let xAxisBottom = d3.axisBottom(xScale); 
let xAxisBottomG = svg.append('g')
.attr('id', 'xAxisBottom')
.attr('transform',`translate(${-xPadding}, ${SVGHEIGHT - yPadding})`)
xAxisBottom(xAxisBottomG)

const lines = [
  {x: 40, y:(SVGHEIGHT / 2)},
  {x: 150, y:(SVGHEIGHT / 2)},
  {x:350, y: 50},
  {x: 150, y:(SVGHEIGHT / 2)}, 
  {x:300, y:(SVGHEIGHT / 2)},
  {x:300, y:(SVGHEIGHT/2) + 150},
  {x:550, y: 150},
  {x:300, y:(SVGHEIGHT/2 ) + 150},
  {x: 300, y:SVGHEIGHT - yPadding},
  
];

const lineGenerator = d3.line().x(d=>d.x).y(d=>d.y)
svg.append('path')
.attr('id','rect-path')
.attr('d', lineGenerator(lines))
.attr('stroke-width', 1)
.attr('fill', 'none')
.style('stroke', 'black')


svg.append('text')
.text('Z1')
.style('font-size', 35)
.attr('fill', 'green')
.attr('transform', 'translate(100, 270)')

svg.append('text')
.text('Z2')
.style('font-size', 35)
.attr('fill', 'green')
.attr('transform', 'translate(140, 470)')


svg.append('text')
.text('Z3')
.style('font-size', 35)
.attr('fill', 'green')
.attr('transform', 'translate(300, 270)')


svg.append('text')
.text('Z4')
.style('font-size', 35)
.attr('fill', 'green')
.attr('transform', 'translate(340, 530)')


const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
let colorsList = []

const allPlots = svg.append('g')
.attr('id', 'plots')
.selectAll('circle')
.data(data)
.join('circle')
.attr('r', 7)
.attr('cx', (d,i)=> (d * 3) + 40)
.attr('fill' , (d,i) =>colorScale(i))

allPlots.on('mouseover', function (event, d) {
  const [x, y] = d3.pointer(event);

  svg.append('rect')
    .attr('id', 'tooltip2')
    .style('pointer-events', 'none');

  svg.append('text')
    .attr('id', 'tooltip1')
    .style('pointer-events', 'none');
  
}).on('mousemove', function (event,d) {
  const [x, y] = d3.pointer(event);

  svg.select('#tooltip2')
    .attr('width', 50)
    .attr('height', 40)
    .attr('x', x - 20)
    .attr('y', y - 50)
    .attr('width', 50)
    .attr('height', 40)
    .attr('fill', 'rgba(230, 224, 124, 0.7)')
    .attr('rx', 10)
    .attr('ry', 10)

  svg.select('#tooltip1')
  .attr('x', x + 5)
  .attr('y', y - 25)
  .attr('text-anchor', 'middle')
  .attr('fill', 'black')
  .attr('font-size', '20px')
  .text(d)
  
}).on('mouseout', function () {
  svg.select('#tooltip1').remove();
  svg.select('#tooltip2').remove();
});


allPlots.each((d,i,n)=>{
  d3.select(n[i])
  .transition()
  .ease(d3.easeBounce)
  .duration(2000)
  .attr('cy', (d,i) => (d * 3) + 80)
  colorsList.push(d3.select(n[i]).attr('fill'))
})

const rectGroup = svg.append('g')
  .attr('id', 'rectangles');

  const padding = 20;
  const rectWidth = 75;
  const margin = 15
  
const allRects = rectGroup.selectAll('rect')
    .data(data)
    .join('rect')
    .attr('height', 20)
    .attr('y', SVGHEIGHT - 20)
    .attr('x', (d, i) => i * (rectWidth + padding) + margin)
    .transition()
    .duration(2000)
    .attr('width', rectWidth)
    .attr('fill', (d, i) => colorsList[i])
    .attr('rx', 10)
    .attr('ry', 10);
  
    const file = d3.csv('../static/data/username.csv').then(data => {
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
            // .ease(d3.easeBounce)
            .duration(1500)
            .attr('x', (d, j) => (i * (rectWidth + padding) + rectWidth / 2) + margin) 
            .text(d => d.Username);
        });
  
      rectGroup.selectAll('rect')
        .data(data)
        .on('mouseover', (event, d) => {
          const [x, y] = d3.pointer(event);
          svg.append('text')
            .attr('id', 'tooltip3')
            .attr('x', x)
            .attr('y', y - 15)
            .attr('fill', 'black')
            .text(d.Identifier);
        })
        .on('mousemove', (event) => {
          const [x, y] = d3.pointer(event);
          svg.select('#tooltip3')
            .attr('x', x)
            .attr('y', y - 15);
        })
        .on('mouseout', () => {
          svg.select('#tooltip3').remove();
        });
  });
