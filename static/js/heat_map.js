const heatMapSVG = d3.select('.heat-map')
.append('svg')
.attr('width', SVGWIDTH)
.attr('height', SVGHEIGHT)

const width_heatMap = heatMapSVG.attr('width') - margin.left - margin.right
const height_heatMap = heatMapSVG.attr('height') - margin.top - margin.bottom


const myGroups = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
const myVars = ["v1", "v2", "v3", "v4", "v5", "v6", "v7", "v8", "v9", "v10"]

xScale_heatMap = d3.scaleBand().domain(myGroups).range([0, width_heatMap]).padding('0.01')
yScale_heatMap =  d3.scaleBand().domain(myVars).range([height_heatMap, 0]).padding('0.01')


heatMapSVG.append('g').attr('transform', `translate(${margin.left}, ${width_heatMap + margin.top})`).call(d3.axisBottom(xScale_heatMap))
heatMapSVG.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`).call(d3.axisLeft(yScale_heatMap))


const myColor = d3.scaleLinear()
  .domain([1,50, 100])
  .range(['white' , 'grey' , 'purple'])



d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv').then((data)=>{
  const all_rect_g = heatMapSVG.append('g')

  const all_rect = all_rect_g.selectAll('rect')
  .data(data, (d) => {d.group + ':' +d.variable})
  .join('rect')
  .attr('x', d=> xScale_heatMap(d.group) + margin.left)
  .attr('y', d=> yScale_heatMap(d.variable) + margin.top)
  .attr('width', xScale_heatMap.bandwidth())
  .attr('height', yScale_heatMap.bandwidth())
  .attr('fill', d=>myColor(d.value))

  all_rect.on('mouseover',()=>{
    heatMapSVG.append('rect')
    .attr('id', 'tooltip2')
    .style('pointers-event', 'none')

    heatMapSVG.append('text')
    .attr('id', 'tooltip1')
    .style('pointer-events', 'none')


  }).on('mousemove', (event,d)=>{
    const [x,y] = d3.pointer(event)

    heatMapSVG
    .select('#tooltip2')
    .attr('width', '50')
    .attr('height', '40')
    .attr('x', x - 20)
    .attr('y', y - 50)
    .attr('fill', 'rgba(230, 15, 124, 0.7)')
    .attr('rx', '15')
    .attr('ry', '15')

    heatMapSVG.select('#tooltip1')
    .attr('x', x + 5)
    .attr('y', y - 25)
    .attr('text-anchor', 'middle')
    .attr('fill', 'black')
    .attr('font-size', '20px')
    .text(d.value);


  }).on('mouseout',()=>{
    heatMapSVG.select('#tooltip2').remove()
    heatMapSVG.select('#tooltip1').remove()
  })

})


