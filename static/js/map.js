let mapSVG = d3.select('.map')
    .append('svg')
    .attr('width', SVGWIDTH)
    .attr('height', SVGHEIGHT +200)

// Append a rect to fill the entire SVG and color the background
mapSVG.append('rect')
    .attr('width', SVGWIDTH)
    .attr('height', SVGHEIGHT)
    .attr('fill', 'white');  // Light grey background
    
// Load and process CSV data
d3.csv('../static/data/football_sampe_300.csv').then((data) => {
    // Parse x and y values
    data.forEach(d => {
        d.x = +d.x;
        d.y = +d.y;
    });

    // Create scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.x))
        .range([margin.left, SVGWIDTH - margin.right]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.y))
        .range([SVGHEIGHT - margin.bottom, margin.top]);

    // Create line generator
    const lineGenerator = d3.line()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y));

    // Append the path
    mapSVG.append('path')
        .datum(data)
        .attr('d', lineGenerator)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

    // Add points
    mapSVG.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.x))
        .attr('cy', d => yScale(d.y))
        .attr('r', 3)
        .attr('fill', 'red');
});