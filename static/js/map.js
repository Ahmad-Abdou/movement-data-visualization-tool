mapSVG = d3.select('#map1')
    .append('svg')
    .attr('width', SVGWIDTH)
    .attr('height', SVGHEIGHT )
    .style('position', 'relative') 
    .style('top', '70px');

mapSVG.append('rect')
    .attr('width', SVGWIDTH)
    .attr('height', SVGHEIGHT )
    .attr('fill', 'white');



mapSVG2 = d3.select('#map2')
    .append('svg')
    .attr('width', SVGWIDTH)
    .attr('height', SVGHEIGHT )
    .style('position', 'relative') 
    .style('top', '70px');

mapSVG2.append('rect')
    .attr('width', SVGWIDTH)
    .attr('height', SVGHEIGHT )
    .attr('fill', 'white');
    

let idFilter1 = 0;
    const get_id = (id) => {
        idFilter1 = id;
        mapSVG.selectAll('path').remove(); 
        if (!isChecked) {
            d3.csv('../static/data/fox_trajectories.csv').then(data => {
                const filteredData = data.filter(d => +d.fox_id == idFilter1);
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
                    .attr('stroke-width', 1);
            });
        } 
}


let idFilter2 = 0;

const get_id2 = (id) => {
    idFilter2 = id;
    mapSVG2.selectAll('path').remove(); 
    if (isChecked) {
        d3.csv('../static/data/fox_trajectories.csv').then(data => {
            const filteredData = data.filter(d => +d.fox_id == idFilter2);
    
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
    
            mapSVG2.append('path')
                .datum(filteredData)
                .attr('d', lineGenerator)
                .attr('fill', 'none')
                .attr('stroke', 'black')
                .attr('stroke-width', 1);
        });
    }
}











