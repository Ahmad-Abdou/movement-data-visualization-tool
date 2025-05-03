class FeatureBar {
  constructor(containerId, width, height, data) {
    this.containerId = containerId
    this.width = width
    this.height = height
    this.data = data
    if (this.data) {
      this.featureValue = this.data.map((item)=> item.Importance)
      this.featurelabel = this.data.map((item)=> item.Feature )

      this.xScale = d3.scaleLinear().domain([0, d3.max(this.featureValue)]).range([1, 100])
    }
      this.svg = d3.select(containerId).append('svg').attr('id', containerId).attr('width', this.width).attr('height', this.height)

  }

   render (){
    if (this.data !== null) {
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
      let converterY = globalYAxis
      let converterX = globalXAxis
  
      if ( converterX === 'Geometric') {
        converterY = 'Geometric'
        converterX = 'Kinematic'
      }
      if(globalYAxis.toLowerCase() === 'curvature'){
        converterY = 'distance'
      } else if (globalYAxis.toLowerCase() === 'indentation'){
        converterY = 'angles'
      } 
      mapper.filter((obj) => {
        if (obj.name.toLowerCase().includes(converterY.toLowerCase())) {
          geoValue.push(obj.value)
          geoLabel.push(obj.name)
        } else if (geometric.includes(obj.name) && converterY === 'Geometric'){
          geoValue.push(obj.value)
          geoLabel.push(obj.name)
        }
      })
  
      if(globalXAxis.toLowerCase() === 'curvature'){
        converterX = 'distance'
      } else if (globalXAxis.toLowerCase() === 'indentation'){
        converterX = 'angles '
      }
      mapper.filter((obj) => {
        if (obj.name.toLowerCase().includes(converterX.toLowerCase())) {
          kinValue.push(obj.value)
          kinLabel.push(obj.name)
        } else if (kinematic.includes(obj.name)  && converterX === 'Kinematic'){
          kinValue.push(obj.value)
          kinLabel.push(obj.name)
        }
      })
      const geoGroup = this.svg.append('g').attr('id', 'geo-group')
      const kinGroup = this.svg.append('g').attr('id', 'kin-group')
  
      
      const geoRectGroup = geoGroup.append('g').attr('id', 'geo-rect-group')
      const kinRectGroup = kinGroup.append('g').attr('id', 'kin-rect-group')
  
      const geoTextGroup = geoGroup.append('g').attr('id', 'geo-text-group')
      const kinTextGroup = kinGroup.append('g').attr('id', 'kin-text-group')
      const headerGroup = this.svg.append('g').attr('id', 'header-group')
  
      geoRectGroup.selectAll('rect')
      .data(geoValue)
      .join('rect')
      .attr('width', (d)=> this.xScale(d))
      .attr('height', 10)
      .attr('fill', geometricColor)
      .attr('y', (d, i)=> 15 * i +27)
      .attr('x', 415)
      .attr('id', (d,i) => {
        return geoLabel[i]
      })
  
      kinRectGroup.selectAll('rect')
      .data(kinValue)
      .join('rect')
      .attr('width', (d)=> this.xScale(d))
      .attr('height', 10)
      .attr('fill', kinematicColor)
      .attr('y', (d, i)=> 15 * i +27)
      .attr('x', 205)
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
      .attr('id', d => d)
      .attr('class', 'clickable-text')
  
      kinTextGroup.selectAll('text')
      .data(kinLabel)
      .join('text')
      .text(d=> d)
      .attr('fill', 'black')
      .attr('y', (d, i)=> 15 * i +34)
      .attr('font-size', 10)
      .attr('x', 80)
      .attr('id', d => d)
      .attr('class', 'clickable-text')
  
      geoTextGroup.selectAll('.value-label')
      .data(geoValue)
      .join('text')
      .text(d=> d.toString().substring(0,7))
      .attr('fill', 'black')
      .attr('y', (d, i)=> 15 * i +34)
      .attr('font-size', 10)
      .attr('x', 450)
      .attr('font-weight', 700)
      .attr('class', 'value-label clickable-value')
      .attr('id', (d, i) => geoLabel[i])
  
      kinTextGroup.selectAll('.value-label')
      .data(kinValue)
      .join('text')
      .text(d=> d.toString().substring(0,7))
      .attr('fill', 'black')
      .attr('y', (d, i)=> 15 * i +34)
      .attr('font-size', 10)
      .attr('font-weight', 700)
      .attr('x', 220)
      .attr('class', 'value-label clickable-value')
      .attr('id', (d, i) => kinLabel[i])
  
      headerGroup.append('rect')
      .attr('width' , 225)
      .attr('height' , 20)
      .attr('fill' , kinematicColor)
      .attr('x' , 80)
  
  
      headerGroup.append('rect')
      .attr('width' , 210)
      .attr('height' , 20)
      .attr('fill' , geometricColor)
      .attr('x' , 305)
  
  
      headerGroup.append('text')
      .text(globalXAxis === 'Geometric'? 'Kinematic': globalXAxis)
      .attr('font-size', 10)
      .attr('fill', 'black')
      .attr('x', 165)
      .attr('y', 12)
      .attr('font-weight', 700)
  
      headerGroup.append('text')
      .text(globalYAxis === 'Kinematic'? 'Geometric': globalYAxis)
      .attr('font-size', 10)
      .attr('fill', 'black')
      .attr('x', 385)
      .attr('y', 12)
      .attr('font-weight', 700)    
  
      geoRectGroup.selectAll('rect').on('click', async function(e) {
        handleGeoClick(e.target.id, e.target.y.baseVal.value);
      });
      
      geoTextGroup.selectAll('.clickable-text').on('click', async function(e) {
        const rectY = d3.select(`rect#${e.target.id}`).attr('y');
        handleGeoClick(e.target.id, parseInt(rectY));
      });
      
      geoTextGroup.selectAll('.clickable-value').on('click', async function(e) {
        const rectY = d3.select(`rect#${e.target.id}`).attr('y');
        handleGeoClick(e.target.id, parseInt(rectY));
      });
      
      kinRectGroup.selectAll('rect').on('click', async function(e) {
        handleKinClick(e.target.id, e.target.y.baseVal.value);
      });
      
      kinTextGroup.selectAll('.clickable-text').on('click', async function(e) {
        const rectY = d3.select(`rect#${e.target.id}`).attr('y');
        handleKinClick(e.target.id, parseInt(rectY));
      });
      
      kinTextGroup.selectAll('.clickable-value').on('click', async function(e) {
        const rectY = d3.select(`rect#${e.target.id}`).attr('y');
        handleKinClick(e.target.id, parseInt(rectY));
      });
      
      const handleGeoClick = async (id, yPosition) => {
        kinGroup.selectAll('.highlight-group-kin').remove();
        geoGroup.selectAll('.highlight-group-geo').remove();
        const highlightGroup = geoGroup.insert('g', '#geo-text-group').attr('class', 'highlight-group-geo');
        
        highlightGroup.append('rect')
          .attr('fill', 'gold')
          .attr('width', 105)
          .attr('height', 10)
          .attr('x', 310)
          .attr('y', yPosition);
        
        featureDetail.drawAxisLabels(id);
        await featureDetail.drawQuantile(id);
        await featureDetail.showPercentile(id);
      };
      
      const handleKinClick = async (id, yPosition) => {
        kinGroup.selectAll('.highlight-group-kin').remove();
        geoGroup.selectAll('.highlight-group-geo').remove();
        const highlightGroup = kinGroup.insert('g', '#kin-text-group').attr('class', 'highlight-group-kin');
        
        highlightGroup.append('rect')
          .attr('fill', 'gold')
          .attr('width', 120)
          .attr('height', 10)
          .attr('x', 80)
          .attr('y', yPosition);
        
        featureDetail.drawAxisLabels(id);
        await featureDetail.drawQuantile(id);
        await featureDetail.showPercentile(id);
      };
    }

  }
}