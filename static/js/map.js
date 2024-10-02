mapSVG = d3.select('.map')
    .append('svg')
    .attr('width', SVGWIDTH)
    .attr('height', SVGHEIGHT + 200);

mapSVG.append('rect')
    .attr('width', SVGWIDTH)
    .attr('height', SVGHEIGHT)
    .attr('fill', 'white');

let idFilter = 0;

const get_id = (id) => {
    idFilter = id;

    mapSVG.selectAll('path').remove(); 

    d3.csv('../static/data/fox_trajectories.csv').then(data => {
        const filteredData = data.filter(d => +d.fox_id == idFilter);

        filteredData.forEach(d => {
            d.x = +d.x;
            d.y = +d.y;
        });

        const scaleX = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => d.x))
            .range([margin.left, SVGWIDTH - margin.right]);

        const scaleY = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => d.y))
            .range([SVGHEIGHT - margin.top, margin.bottom]);

        const lineGenerator = d3.line()
            .x(d => scaleX(d.x))
            .y(d => scaleY(d.y));

        mapSVG.append('path')
            .datum(filteredData)
            .attr('d', lineGenerator)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', 2);
    });
};