class FeatureBar {
  constructor(containerId, width, height, data) {
    this.containerId = containerId
    this.width = width
    this.height = height
    this.data = data
    this.featureValue = this.data.map((item)=> item.Importance)
    this.featurelabel = this.data.map((item)=> item.Feature )
    this.svg = d3.select(containerId).append('svg').attr('id', containerId).attr('width', this.width).attr('height', this.height)

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

    
    const geoRectGroup = this.svg.append('g').attr('id', 'geo-rect-group')
    const kinRectGroup = this.svg.append('g').attr('id', 'kin-rect-group')

    const geoTextGroup = this.svg.append('g').attr('id', 'geo-text-group')
    const kinTextGroup = this.svg.append('g').attr('id', 'kin-text-group')
    const headerGroup = this.svg.append('g').attr('id', 'header-group')

    geoRectGroup.selectAll('rect')
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

    kinRectGroup.selectAll('rect')
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

    geoTextGroup.selectAll('text')
    .data(geoLabel)
    .join('text')
    .text(d=> d)
    .attr('fill', 'black')
    .attr('y', (d, i)=> 15 * i +34)
    .attr('font-size', 10)
    .attr('x', 310)

    kinTextGroup.selectAll('text')
    .data(kinLabel)
    .join('text')
    .text(d=> d)
    .attr('fill', 'black')
    .attr('y', (d, i)=> 15 * i +34)
    .attr('font-size', 10)
    .attr('x', 80)


    geoTextGroup.selectAll('.value-label')
    .data(geoValue)
    .join('text')
    .text(d=> d.toString().substring(0,7))
    .attr('fill', 'black')
    .attr('y', (d, i)=> 15 * i +34)
    .attr('font-size', 10)
    .attr('x', 450)
    .attr('font-weight', 700)

    kinTextGroup.selectAll('.value-label')
    .data(kinValue)
    .join('text')
    .text(d=> d.toString().substring(0,7))
    .attr('fill', 'black')
    .attr('y', (d, i)=> 15 * i +34)
    .attr('font-size', 10)
    .attr('font-weight', 700)
    .attr('x', 220)

    headerGroup.append('rect')
    .attr('width' , 225)
    .attr('height' , 20)
    .attr('fill' , '#0080FF')
    .attr('opacity', 0.5)
    .attr('x' , 80)


    headerGroup.append('rect')
    .attr('width' , 210)
    .attr('height' , 20)
    .attr('fill' , '#DC143C')
    .attr('x' , 305)
    .attr('opacity', 0.5)


    headerGroup.append('text')
    .text('Kinematic')
    .attr('font-size', 10)
    .attr('fill', 'black')
    .attr('x', 165)
    .attr('y', 12)
    .attr('font-weight', 700)

    headerGroup.append('text')
    .text('Geometric')
    .attr('font-size', 10)
    .attr('fill', 'black')
    .attr('x', 385)
    .attr('y', 12)
    .attr('font-weight', 700)    

    geoRectGroup.on('click', async (e) => {
      this.svg.selectAll('.highlight-group-geo').remove()
      const highlightGroup = this.svg.insert('g', '#geo-text-group').attr('class', 'highlight-group-geo')

      highlightGroup.append('rect')
      .attr('fill', 'gold')
      .attr('width', 105)
      .attr('height', 10)
      .attr('x', e.target.x.baseVal.value - 105)
      .attr('y', e.target.y.baseVal.value)
      
      featureDetail.drawAxisLabels(e.target.id)
      await featureDetail.drawQuantile(e.target.id)
      await featureDetail.showPercentile(e.target.id)

    })
    kinRectGroup.on('click', async (e) => {
      this.svg.selectAll('.highlight-group-kin').remove()

      const highlightGroup = this.svg.insert('g', '#kin-text-group').attr('class', 'highlight-group-kin')

      highlightGroup.append('rect')
      .attr('fill', 'gold')
      .attr('width', 120)
      .attr('height', 10)
      .attr('x', e.target.x.baseVal.value - 125)
      .attr('y', e.target.y.baseVal.value)
      featureDetail.drawAxisLabels(e.target.id)
      await featureDetail.drawQuantile(e.target.id)
      await featureDetail.showPercentile(e.target.id)
    })
  }
}