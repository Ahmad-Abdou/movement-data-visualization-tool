barChartSVG = d3.select('.bar-chart')
.append('svg')
.attr('width', SVGWIDTH + 250)
.attr('height', SVGHEIGHT );

barChartSVG.append('rect')
.attr('fill', 'white')
.attr('width', SVGWIDTH )
.attr('height', SVGHEIGHT);

const generate_bars = () => {
  d3.csv(`../static/data/${df_with_id}`)
  .then((data) => {
    const filteredData1 = data.filter(d => +d.ID == idFilter1);
    const filteredData2 = data.filter(d => +d.ID == idFilter2);

    if (filteredData1.length === 0 || filteredData2.length === 0) {
      console.error('Filtered data is empty for one of the IDs');
      return;
    }

    const sorted1 = Object.entries(filteredData1[0])
      .filter(([key, value]) => key !== 'ID')
      .sort((a, b) => b[1] - a[1]);
    const sorted2 = Object.entries(filteredData2[0])
      .filter(([key, value]) => key !== 'ID')
      .sort((a, b) => b[1] - a[1]);

    const top_5_1_Geometric = sorted1
      .filter(item => geometric.includes(item[0]))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const top_5_2_Geometric = sorted2
      .filter(item => geometric.includes(item[0]))
      .sort((a, b) => b[1] - a[1])
      

    const top_5_1_Kinematic = sorted1
      .filter(item => kinematic.includes(item[0]))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const top_5_2_Kinematic = sorted2
      .filter(item => kinematic.includes(item[0]))
      .sort((a, b) => b[1] - a[1])
      
    const combinedGeometric = top_5_1_Geometric.map(item => {
      const correspondingItem = top_5_2_Geometric.find(d => d[0] === item[0]);
      return {
        feature: item[0],
        value1: +item[1],
        value2: correspondingItem ? +correspondingItem[1] : 0
      };
    });

    const combinedKinematic = top_5_1_Kinematic.map(item => {
      const correspondingItem = top_5_2_Kinematic.find(d => d[0] === item[0]);
      return {
        feature: item[0],
        value1: +item[1],
        value2: correspondingItem ? +correspondingItem[1] : 0
      };
    });

    const barHeight = 20;
    const barSpacing = 40;
    const offsetY = 80;
    const chartSpacing = SVGWIDTH / 2  +70;

    const widthScale = d3.scaleLinear()
      .domain([0, d3.max([...combinedGeometric, ...combinedKinematic], d => Math.max(d.value1, d.value2))])
      .range([0, (SVGWIDTH/2) -50]);

    barChartSVG.selectAll('*').remove();

    barChartSVG.append('text')
      .attr('x', 20)
      .attr('y', 50)
      .text('Geometric Features')
      .attr('font-size', '25px')
      .attr('font-weight', 'bold');

    barChartSVG.append('text')
      .attr('x', chartSpacing + 20)
      .attr('y', 50)
      .text('Kinematic Features')
      .attr('font-size', '25px')
      .attr('font-weight', 'bold');

    const drawChart = (data, xOffset, className) => {
      barChartSVG.selectAll(`.bar1-${className}`)
        .data(data)
        .join('rect')
        .attr('class', `bar1-${className}`)
        .attr('x', xOffset + 200)
        .attr('y', (d, i) => offsetY + i * (barHeight + barSpacing))
        .attr('width', d => widthScale(d.value1) )
        .attr('height', barHeight)
        .attr('fill', '#69b3a2');

      barChartSVG.selectAll(`.bar2-${className}`)
        .data(data)
        .join('rect')
        .attr('class', `bar2-${className}`)
        .attr('x', xOffset + 200)
        .attr('y', (d, i) => offsetY + i * (barHeight + barSpacing) + barHeight + 5)
        .attr('width', d => widthScale(d.value2))
        .attr('height', barHeight)
        .attr('fill', '#ff8282');

      barChartSVG.selectAll(`.label0-${className}`)
        .data(data)
        .join('text')
        .attr('class', `label0-${className}`)
        .attr('x', xOffset + 80)
        .attr('y', (d, i) => offsetY + i * (barHeight + barSpacing) + barHeight / 1.5)
        .text(d => `${d.feature}`)
        .attr('fill', '#000')
        .attr('font-size', '16px');

      barChartSVG.selectAll(`.label1-${className}`)
        .data(data)
        .join('text')
        .attr('class', `label1-${className}`)
        .attr('x', xOffset + 200)
        .attr('y', (d, i) => offsetY + i * (barHeight + barSpacing) + barHeight / 1.5)
        .text(d => `${d.value1.toFixed(4)}`)
        .attr('fill', '#000')
        .attr('font-size', '16px');

      barChartSVG.selectAll(`.label2-${className}`)
        .data(data)
        .join('text')
        .attr('class', `label2-${className}`)
        .attr('x', xOffset + 200)
        .attr('y', (d, i) => offsetY + i * (barHeight + barSpacing) + barHeight * 2)
        .text(d => `${d.value2.toFixed(4)}`)
        .attr('fill', '#000')
        .attr('font-size', '16px');
    };

    drawChart(combinedGeometric, 0, 'geometric');
    drawChart(combinedKinematic, chartSpacing, 'kinematic');


    const legendY = offsetY + 5 * (barHeight + barSpacing) + 50;
    
    barChartSVG.append('rect')
      .attr('x', 300)
      .attr('y', legendY)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', '#69b3a2');
      
    barChartSVG.append('text')
      .attr('x', 330)
      .attr('y', legendY + 15)
      .text('Trajectory 1')
      .attr('font-size', '16px');


    barChartSVG.append('rect')
      .attr('x', 440)
      .attr('y', legendY)
      .attr('width', 20)
      .attr('height', 20)
      .attr('fill', '#ff8282');
      
    barChartSVG.append('text')
      .attr('x', 470)
      .attr('y', legendY + 15)
      .text('Trajectory 2')
      .attr('font-size', '16px');
  });
};