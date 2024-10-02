let AxesSvg = d3.select('.axes')
.append('svg')
.attr('width', SVGWIDTH)
.attr('height', SVGHEIGHT)

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
  {text:'0', position:[0.22, 0.22]},
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

AxesSvg.append('text')
.text('Kinematic')
.attr('x', SVGWIDTH /2)
.attr('y', SVGHEIGHT - 5)
.attr('text-anchor', 'middle')
.attr('font-size', 20)
.attr('fill', 'black');

AxesSvg.append('text')
.text("Geometric")
.attr('y', SVGHEIGHT /2)
.attr('font-size', 20)
.attr('text-anchor', 'middle')
.attr('transform', `rotate(-90, 13, ${SVGHEIGHT / 2})`)

const colorScale = d3.scaleOrdinal()
.domain([0, 1])
.range(['#1f77b4', '#ff7f0e']);
let colorsList = []

const file = d3.csv('../static/data/fox_decision_score.csv').then(data => {
  
  data.forEach((d)=>{
    d.x = +d.x;
    d.y = +d.y
  });

  const xExtent = d3.extent(data, d=>d.x)
  const yExtent = d3.extent(data, d=>d.y)

  data.forEach((d)=>{
    d.normalizedX = (d.x - xExtent[0]) / (xExtent[1] - xExtent[0]);
    d.normalizedY = (d.y - yExtent[0]) / (yExtent[1] - yExtent[0]);
  })

  const allPlots = AxesSvg.append('g')
  .attr('id', 'plots')
  .selectAll('circle')
  .data(data)
  .join('circle')
  .attr('r', 4)
  .attr('cx', (d,i)=> xScale(d.normalizedX) + margin.left )
  .attr('cy', (d,i)=> yScale(d.normalizedY) + margin.top )
  .attr('fill' , 'red')

allPlots.each((d,i,n)=>{
  d3.select(n[i])
  .transition()
  .ease(d3.easeBounce)
  .duration(2000)
  .attr('cy', (d,i) => yScale(d.normalizedY) + margin.top )
  colorsList.push(d3.select(n[i]).attr('fill'))
})

const rectGroup = AxesSvg.append('g')
  .attr('id', 'rectangles');

      allPlots.on('click', function(event) {
        const selected_circle = d3.select(this);
        const currentColor = selected_circle.attr('fill');
        
        if (currentColor === 'blue') {
            selected_circle.attr('fill', 'red')
                           .attr('r', 3);
        } else {
            selected_circle.attr('fill', 'blue')
                           .attr('r', 8);
        }
        id = event.target.__data__.ID;
        get_id(id);
    });

      allPlots.on('mouseover', function () {
        d3.select(this)
        .attr('r' , 10)
        
        AxesSvg.append('rect')
          .attr('id', 'tooltip2')
          .style('pointer-events', 'none');
      
        AxesSvg.append('text')
          .attr('id', 'tooltip1')
          .style('pointer-events', 'none');
        
      })
      .on('mousemove', function (event,d) {
        const [x, y] = d3.pointer(event);
      
        AxesSvg.select('#tooltip2')
          .attr('width', 120)
          .attr('height', 90)
          .attr('x', x - 20 )
          .attr('y', y - 100)
          .attr('fill', 'rgba(230, 224, 124, 0.7)')
          .attr('rx', 10)
          .attr('ry', 10)
      
        AxesSvg.select('#tooltip1')
        .attr('x', x )
        .attr('y', y - 65)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black')
        .attr('font-size', '12px')
        .selectAll('tspan')
        .data([
          `Fox ID: ${d.ID.toString()}`,
          `X: ${d.x.toString()}`,
          `Y: ${d.y.toString()}`,
        ])
        .join('tspan')
        .attr('x', x + 5)
        .attr('text-anchor', 'start')
        .attr('dy', (d, i) => i === 0 ? 0 : '1.2em')  // First line stays at initial y, subsequent lines move down
        .text(d => d)
        .style("display", "block");  // Ensure the tooltip is visible
        
      }).on('mouseout', function () {
        d3.select(this).attr('r', 4 )
        AxesSvg.select('#tooltip1').remove();
        AxesSvg.select('#tooltip2').remove();
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
