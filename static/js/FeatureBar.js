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

    this.xScale = d3.scaleLinear().domain([0, d3.max(this.featureValue)]).range([1, 100])

  }

   render (){

    let mapper = this.featurelabel.map((row, i) => {
      let result = {
        name: row,
        value: this.featureValue[i]
      }
      return result
    })


    let geoValue = []
    let kinValue = []
    let geoLabel = []
    let kinLabel = []

    mapper.filter((obj) => {
      if (geometric.includes(obj.name)) {
        geoValue.push(obj.value)
        geoLabel.push(obj.name)
      }
    })

    mapper.filter((obj) => {
      if (kinematic.includes(obj.name)) {
        kinValue.push(obj.value)
        kinLabel.push(obj.name)

      }
    })

    
    const geoGroup = this.svg.append('g')
    .attr('id', 'geo-group')
    const kinGroup = this.svg.append('g')
    .attr('id', 'kin-group')

    const geoRect = geoGroup.selectAll('rect')
    .data(geoValue)
    .join('rect')
    .attr('width', (d)=> this.xScale(d))
    .attr('height', 10)
    .attr('fill', '#DC143C')
    .attr('y', (d, i)=> 15 * i +27)
    .attr('x', 415)
    .attr('opacity', 0.5)
    .attr('id', (d,i) => {
      return geoLabel[i]
    })

    const kinRect = kinGroup.selectAll('rect')
    .data(kinValue)
    .join('rect')
    .attr('width', (d)=> this.xScale(d))
    .attr('height', 10)
    .attr('fill', '#0080FF')
    .attr('y', (d, i)=> 15 * i +27)
    .attr('x', 205)
    .attr('opacity', 0.5)
    .attr('id', (d,i) => {
      return kinLabel[i]
    })

    geoGroup.selectAll('label')
    .data(geoLabel)
    .join('text')
    .text(d=> d)
    .attr('fill', 'black')
    .attr('y', (d, i)=> 15 * i +34)
    .attr('font-size', 10)
    .attr('x', 310)

    kinGroup.selectAll('label')
    .data(kinLabel)
    .join('text')
    .text(d=> d)
    .attr('fill', 'black')
    .attr('y', (d, i)=> 15 * i +34)
    .attr('font-size', 10)
    .attr('x', 80)


  geoGroup.selectAll('label')
  .data(geoValue)
  .join('text')
  .text(d=> d.toString().substring(0,7))
  .attr('fill', 'black')
  .attr('y', (d, i)=> 15 * i +34)
  .attr('font-size', 8)
  .attr('x', 450)
  .attr('font-weight', 700)

  kinGroup.selectAll('label')
  .data(kinValue)
  .join('text')
  .text(d=> d.toString().substring(0,7))
  .attr('fill', 'black')
  .attr('y', (d, i)=> 15 * i +34)
  .attr('font-size', 8)
  .attr('font-weight', 700)
  .attr('x', 220)

    this.svg.append('rect')
    .attr('width' , 220)
    .attr('height' , 20)
    .attr('fill' , '#0080FF')
    .attr('opacity', 0.5)
    .attr('x' , 80)


    this.svg.append('rect')
    .attr('width' , 220)
    .attr('height' , 20)
    .attr('fill' , '#DC143C')
    .attr('x' , 300)
    .attr('opacity', 0.5)


    this.svg.append('text')
    .text('Kinematic')
    .attr('font-size', 10)
    .attr('fill', 'black')
    .attr('x', 165)
    .attr('y', 12)
    .attr('font-weight', 700)

    this.svg.append('text')
    .text('Geometric')
    .attr('font-size', 10)
    .attr('fill', 'black')
    .attr('x', 385)
    .attr('y', 12)
    .attr('font-weight', 700)    
    const notification = document.getElementById('notification')

    geoRect.on('click', async function(e) {
      featureDetail.drawAxisLabels(e.target.id)
      const features = featureDetail.drawQuantile(e.target.id)
       featureDetail.timeConverter(features, e.target.id)
    })
    kinRect.on('click', async function(e) {
      featureDetail.drawAxisLabels(e.target.id)
      const features = featureDetail.drawQuantile(e.target.id)
       featureDetail.timeConverter(features, e.target.id)
    })
  }
}