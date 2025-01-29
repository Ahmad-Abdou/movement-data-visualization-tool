class FeatureBar {
  constructor(containerId, width, height, data) {
    this.containerId = containerId
    this.width = width
    this.height = height
    this.data = data
    this.featureValue = this.data.map((item)=> item.Importance)
    this.featurelabel = this.data.map((item)=> item.Feature )
    this.svg = d3.select(containerId)
    .append('svg')
    .attr('width', this.width)
    .attr('height', this.height)

    this.xScale = d3.scaleLinear().domain([0, d3.max(this.featureValue)]).range([1, 450])

  }

   render (){
    const allRect = this.svg.selectAll('rect')
    .data(this.featureValue)
    .join('rect')
    .attr('width', (d)=> this.xScale(d))
    .attr('height', 10)
    .attr('fill', (d,i) => {
      let feature = this.featurelabel[i]
      return geometric.includes(feature) ? '#DC143C' : '#0080FF'
    })
    .attr('y', (d, i)=> 15 * i +27)
    .attr('x', 150)
    .attr('opacity', 0.5)
    .attr('id', (d,i) => {
      return this.featurelabel[i]
    })

    this.svg.selectAll('label')
    .data(this.featurelabel)
    .join('text')
    .text(d=> d)
    .attr('fill', 'black')
    .attr('y', (d, i)=> 15 * i +34)
    .attr('font-size', 10)
    .attr('x', 10)

    this.svg.selectAll('label')
    .data(this.featureValue)
    .join('text')
    .text(d=> d.toString().substring(0,7))
    .attr('fill', 'black')
    .attr('y', (d, i)=> 15 * i +34)
    .attr('font-size', 11)
    .attr('x', 160)
    .attr('font-weight', 700)

    this.svg.append('rect')
    .attr('width' , 56)
    .attr('height' , 20)
    .attr('fill' , '#0080FF')
    .attr('opacity', 0.5)


    this.svg.append('rect')
    .attr('width' , 56)
    .attr('height' , 20)
    .attr('fill' , '#DC143C')
    .attr('x' , 70)
    .attr('opacity', 0.5)


    this.svg.append('text')
    .text('Kinematic')
    .attr('font-size', 10)
    .attr('fill', 'black')
    .attr('x', 5)
    .attr('y', 12)
    .attr('font-weight', 700)

    this.svg.append('text')
    .text('Curvature')
    .attr('font-size', 10)
    .attr('fill', 'black')
    .attr('x', 75)
    .attr('y', 12)
    .attr('font-weight', 700)

    allRect.on('click', function(e) {
      featureDetail.drawAxisLabels(e.target.id)
    })
  }
}