class AxesPlot {
    constructor(containerId, width, height, margin) {
      
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.colorsList = [];
        this.allPlots = null
        this.availableWidth = width;
        this.availableHeight = height;
        this.svgWidth = 0.7 * this.availableWidth;
        this.svgHeight = 0.7 * this.availableHeight;
        
        this.offsetX = (this.availableWidth - this.svgWidth) / 2;
        this.offsetY = (this.availableHeight - this.svgHeight) / 2;
        this.svg = d3.select(containerId).append('svg').attr('width', this.availableWidth).attr('height', this.availableHeight).attr('display', "flex").attr('justify-content', "center").append("g").attr("transform", `translate(${this.offsetX},${this.offsetY-20})`);

        this.xScale = d3.scaleLinear().domain([0, 1]).range([0, this.svgWidth]);
        this.yScale = d3.scaleLinear().domain([0, 1]).range([this.svgHeight, 0]);
        this.xAxis = d3.axisBottom(this.xScale);
        this.gx = this.svg.append('g').attr('transform', `translate(${margin.left},${this.svgHeight + margin.top})`);

        this.yAxis = d3.axisLeft(this.yScale);

        this.gy = this.svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);
        this.axesLineGenerator = d3.line().x(d=>this.xScale(d[0] )).y(d=>this.yScale(d[1]))
        this.colorScale = d3.scaleOrdinal().domain([0, 1]).range(['#1f77b4', '#ff7f0e']);
        this.colorsList = []
 

        this.axesLines = [
          {points: [[0,0.5], [0.5, 1]]},
          {points: [[0,0.5], [0.5,0.5], [0.5,0]]},
          {points: [[0.5,0] , [1,0.5]]},
          {points:[[0,0], [1,1]]}
        ]
        
        this.axes_zone_0  = [
          {points: [[0,0.5], [0.5,0.5], [0.5,0],[0,0], [0,0.5]]},  //0
        ]
        
        this.axes_zone_1  = [
          {points: [[0,0.5], [0.5, 1], [0, 1], [0,0.5]]},  //1
        ]
        
        this.axes_zone_2  = [
          {points: [[0.5,0] , [1,0.5], [1,0], [0.5,0]]}, //2
        ]
        
        this.axes_zone_3  = [
          {points:[[0,0.5], [0.5, 1],[1,1],[1,0.5], [0.5,0],[0.5,0.5], [0,0.5]]} //3
        ]
        
        this.axesLabels = [
          {text:'0', position:[0.22, 0.22]},
          {text:'1', position:[0.15, 0.85]},
          {text:"2", position:[0.85, 0.15 ]},
          {text:"3" , position:[0.7, 0.7]}
        ]
        
        this.init(containerId);
        this.plotGroup = this.svg.append('g').attr('class', 'plot-group');
    }

    init() {
        this.drawAxes(this.gx,this.gy);
        this.drawZoneLines(this.axesLines, this.axesLabels);
    }

    drawAxes(gx, gy) {

      this.xAxis(gx);
      this.yAxis(gy);
    }

    drawZoneLines(axesLines, axesLabels) {
        // Create a group for all axis-related elements
        const axisGroup = this.svg.append('g').attr('class', 'axis-group');
        
        axesLines.forEach((shape, index)=>{
            axisGroup.append('path')
                .attr('d', this.axesLineGenerator(shape.points))
                .attr('transform', `translate(${margin.left}, ${margin.top})`)
                .attr('fill', 'none')
                .attr('stroke', index === axesLines.length -1 ? 'grey': 'black')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', index === axesLines.length-1 ? '8': 'none');
        });
        
        axesLabels.forEach((label)=>{
            axisGroup.append('text')
                .attr('x', this.xScale(label.position[0]))
                .attr('y', this.yScale(label.position[1]))
                .attr('transform', `translate(${margin.left} , ${margin.top})`)
                .attr('font-size', 40)
                .text(label.text);
        });
        
        axisGroup.raise();
    }

    colorZone(zone_number, all_data) {
        this.svg.selectAll('path.axes-zone').remove();
        const zoneColor = '#FFFF00';
        const zoneOpacity = 0.4; 
        let zoneShape;
        
        switch(zone_number) {
            case 0: zoneShape = this.axes_zone_0[0]; break;
            case 1: zoneShape = this.axes_zone_1[0]; break;
            case 2: zoneShape = this.axes_zone_2[0]; break;
            case 3: zoneShape = this.axes_zone_3[0]; break;
            default: return;
        }
        
        this.svg.append('path')
            .data([all_data])
            .attr('class', 'axes-zone')
            .attr('d', this.axesLineGenerator(zoneShape.points))
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
            .attr('fill', zoneColor)
            .attr('opacity', zoneOpacity);

        this.plotGroup.lower();
        this.svg.selectAll('path.axes-zone').raise();
        this.svg.select('.axis-group').raise();
        this.gx.raise();
        this.gy.raise();
    }

    setAxisTitles(x_title, y_title) {
          this.svg.selectAll('text.axis-title').remove();
          this.svg.append('text')
            .attr('class', 'axis-title')
            .text(x_title)
            .attr('x', (this.svgWidth / 2) + 50)
            .attr('y', this.svgHeight + 90)
            .attr('text-anchor', 'middle')
            .attr('font-size', 20)
            .attr('fill', 'black');
        
          this.svg.append('text')
            .attr('class', 'axis-title')
            .text(y_title)
            .attr('y', (this.svgHeight / 2) + 5 )
            .attr('text-anchor', 'middle')
            .attr('font-size', 20)
            .attr('transform', `rotate(-90, 13, ${this.svgHeight / 2})`)
            .attr('fill', 'black');
    }

    showPlots(data) {
        // Clear existing plots
        this.plotGroup.selectAll("*").remove();
        this.svg.selectAll("#rectangles").remove();
      
        data.forEach((d)=>{
          d.x = +d.x;
          d.y = +d.y
        });
      
        const xExtent = d3.extent(data, d=>d.x)
        const yExtent = d3.extent(data, d=>d.y)
      
        data.forEach((d)=>{
          d.normalizedX = (d.x - xExtent[0]) / (xExtent[1] - xExtent[0]);
          d.normalizedY = (d.y - yExtent[0]) / (yExtent[1] - yExtent[0]);
        })
      
        // Add plots to the plot group instead of directly to svg
        this.allPlots = this.plotGroup.append('g')
            .attr('id', 'plots')
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('r', 4)
            .attr('cx', (d,i)=> this.xScale(d.normalizedX) + margin.left )
            .attr('cy', (d,i)=> this.yScale(d.normalizedY) + margin.top )
            .attr('fill' , 'grey');
      
          this.allPlots.each((d,i,n)=>{
          d3.select(n[i])
          .transition()
          .ease(d3.easeBounce)
          .duration(2000)
          .attr('cy', (d,i) => this.yScale(d.normalizedY) + margin.top )
          this.colorsList.push(d3.select(n[i]).attr('fill'))
        })
      
        const rectGroup = this.svg.append('g')
          .attr('id', 'rectangles');
      
        let previouslySelectedBlue = null;
        let previouslySelectedGreen = null;
        
        const tooltipContainer = this.svg.append('g')
            .attr('class', 'tooltip-container')
            .style('display', 'none');
            
        tooltipContainer.append('rect')
            .attr('class', 'tooltip-bg')
            .attr('width', 120)
            .attr('height', 90)
            .attr('fill', 'rgba(230, 224, 124, 0.7)')
            .attr('rx', 10)
            .attr('ry', 10);
            
        tooltipContainer.append('text')
            .attr('class', 'tooltip-text')
            .attr('fill', 'black')
            .attr('font-size', '12px');

            this.allPlots
        .on('click', function(event) {
          const selected_circle = d3.select(this);
          const id = event.target.__data__.ID;
          
          if (!isChecked) {
            // Handle blue selection
            if (previouslySelectedBlue && previouslySelectedBlue !== selected_circle) {
              previouslySelectedBlue
                .attr('fill', 'grey')
                .attr('r', 4);
            }
            
            if (previouslySelectedBlue === selected_circle) {
              // Deselect if clicking the same circle
              selected_circle
                .attr('fill', 'grey')
                .attr('r', 4);
              previouslySelectedBlue = null;
            } else {
              // Select new circle
              selected_circle
                .attr('fill', '#69b3a2')
                .attr('r', 8);
              previouslySelectedBlue = selected_circle;
            }
            get_id(id);
          } else {
            // Handle green selection
            if (previouslySelectedGreen && previouslySelectedGreen !== selected_circle) {
              previouslySelectedGreen
                .attr('fill', 'grey')
                .attr('r', 4);
            }
            
            if (previouslySelectedGreen === selected_circle) {
              // Deselect if clicking the same circle
              selected_circle
                .attr('fill', 'grey')
                .attr('r', 4);
              previouslySelectedGreen = null;
            } else {
              // Select new circle
              selected_circle
                .attr('fill', '#ff8282')
                .attr('r', 8);
              previouslySelectedGreen = selected_circle;
            }
            get_id2(id);
          }
      
          // Display trajectory on map
          showTrajectoryOnMap(id);
        })
        .on('mouseover', function() {
            const selected_circle = d3.select(this);
            if (!selected_circle.classed('selected')) {
                selected_circle.attr('r', 8);
            }
            tooltipContainer.style('display', null);
        })
        .on('mousemove', function(event, d) {
            const [x, y] = d3.pointer(event);
            tooltipContainer
                .attr('transform', `translate(${x - 20},${y - 100})`);
                
            tooltipContainer.select('.tooltip-text')
                .selectAll('tspan')
                .data([
                    `ID: ${d.ID}`,
                    `X: ${d.x.toFixed(4)}`,
                    `Y: ${d.y.toFixed(4)}`
                ])
                .join('tspan')
                .attr('x', 10)
                .attr('y', (d, i) => 20 + i * 20)
                .text(d => d);
        })
        .on('mouseout', function() {
            const selected_circle = d3.select(this);
            if (!selected_circle.classed('selected')) {
                selected_circle.attr('r', 4);
            }
            tooltipContainer.style('display', 'none');
        });
      
        rectGroup.selectAll('rect')
          .data(data)
          .on('mouseover', (event, d) => {
            const [x, y] = d3.pointer(event);
            this.svg.append('text')
              .attr('id', 'tooltip3')
              .attr('x', x)
              .attr('y', y - 15)
              .attr('fill', 'black')
              .text(d.Identifier);
          })
          .on('mousemove', (event) => {
            const [x, y] = d3.pointer(event);
            this.svg.select('#tooltip3')
              .attr('x', x)
              .attr('y', y - 15);
          })
          .on('mouseout', () => {
            this.svg.select('#tooltip3').remove();
          });
      
        this.svg.select('.axis-group').raise();
        this.gx.raise();
        this.gy.raise();
    }
}