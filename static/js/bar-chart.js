barChartSVG = d3.select('.bar-chart')
.append('svg')
.attr('width', SVGWIDTH) 
.attr('height', SVGHEIGHT)



barChartSVG.append('rect')
.attr('fill', '#CACFE3')
.attr('width', SVGWIDTH )
.attr('height', SVGHEIGHT )


const generate_bar = () =>{
  d3.csv('../static/data/df_foxes_with_ID.csv') .then((data)=>{
    let sorted = null
    const filteredData = data.filter(d => +d.ID == idFilter1);
      sorted = Object.entries(filteredData[0])
        .filter(([key, value]) => key !== 'ID')
        .sort((a, b)=>{
        return b[1] - a[1];
    })
    const top_10 = [sorted][0].slice(0,10)
    console.log(top_10)

    // barChartSVG.selectAll('text').data(top_10)
    
  })
}




