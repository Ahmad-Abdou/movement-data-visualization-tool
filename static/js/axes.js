class AxesPlot {
    constructor(containerId, width, height, margin) {
      
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.colorsList = [];
        
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
      axesLines.forEach((shape, index)=>{
        this.svg.append('path')
        .attr('d', this.axesLineGenerator(shape.points))
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('fill', 'none')
        .attr('stroke', index === axesLines.length -1 ? 'grey': 'black')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', index === axesLines.length-1 ? '8': 'none')
    })
    
    
    axesLabels.forEach((label)=>{
      this.svg.append('text')
      .attr('x', this.xScale(label.position[0]))
      .attr('y', this.yScale(label.position[1]))
      .attr('transform', `translate(${margin.left} , ${margin.top})`)
      .attr('font-size', 40)
      .text(label.text)
    })
    
    }

    colorZone(zone_number, all_data) {
          if(zone_number == 0 ) {
            this.axes_zone_0.forEach(( shape)=>{
              this.svg.append('path')
              .data(all_data)
              .attr('class', 'axes-zone')
              .attr('d', this.axesLineGenerator(shape.points))
              .attr('transform', `translate(${margin.left}, ${margin.top})`)
              .attr('fill', '#B9E7F5')
              .attr('opacity', 0.4)
              .lower();
            })
            
          } else if (zone_number == 1) {
            this.axes_zone_1.forEach(( shape)=>{
              this.svg.append('path')
              .data(all_data)
              .attr('class', 'axes-zone')
              .attr('d', this.axesLineGenerator(shape.points))
              .attr('transform', `translate(${margin.left}, ${margin.top})`)
              .attr('fill', '#B9E7F5')
              .lower();
            })
          } else if (zone_number == 2) {
            this.axes_zone_2.forEach(( shape)=>{
              this.svg.append('path')
              .data(all_data)
              .attr('class', 'axes-zone')
              .attr('d', this.axesLineGenerator(shape.points))
              .attr('transform', `translate(${margin.left}, ${margin.top})`)
              .attr('fill', '#B9E7F5')
              .lower();
            })
          } else if (zone_number == 3) {
            this.axes_zone_3.forEach(( shape)=>{
              this.svg.append('path')
              .data(all_data)
              .attr('class', 'axes-zone')
              .attr('d', this.axesLineGenerator(shape.points))
              .attr('transform', `translate(${margin.left}, ${margin.top})`)
              .attr('fill', '#B9E7F5')
              .lower();
            })
        }
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
        this.svg.selectAll("#plots").remove();
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
      
        const allPlots = this.svg.append('g')
        .attr('id', 'plots')
        .selectAll('circle')
        .data(data)
        .join('circle')
        .attr('r', 4)
        .attr('cx', (d,i)=> this.xScale(d.normalizedX) + margin.left )
        .attr('cy', (d,i)=> this.yScale(d.normalizedY) + margin.top )
        .attr('fill' , 'grey')
      
        allPlots.each((d,i,n)=>{
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
        
        allPlots
        .on('click', function(event) {
          const selected_circle = d3.select(this);
          
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
          }
      
          const id = event.target.__data__.ID;
          if (!isChecked) {
            get_id(id);
          } else {
            get_id2(id);
          }
          generate_bars();
        })
        .on('mouseover', function() {
          const selected_circle = d3.select(this);
          const isSelected = (isChecked && selected_circle.node() === previouslySelectedGreen?.node()) || 
                            (!isChecked && selected_circle.node() === previouslySelectedBlue?.node());
          
          // Only increase size if not already selected
          if (!isSelected) {
            selected_circle.attr('r', 8);
          }
          
          // Add tooltips
          this.svg.append('rect')
            .attr('id', 'tooltip2')
            .style('pointer-events', 'none');
          
          this.svg.append('text')
            .attr('id', 'tooltip1')
            .style('pointer-events', 'none');
        })
        .on('mousemove', function(event, d) {
          const [x, y] = d3.pointer(event);
          
          // Update tooltip rectangle
          this.svg.select('#tooltip2')
            .attr('width', 120)
            .attr('height', 90)
            .attr('x', x - 20)
            .attr('y', y - 100)
            .attr('fill', 'rgba(230, 224, 124, 0.7)')
            .attr('rx', 10)
            .attr('ry', 10);
          
          // Update tooltip text
          this.svg.select('#tooltip1')
            .attr('x', x)
            .attr('y', y - 65)
            .attr('text-anchor', 'middle')
            .attr('fill', 'black')
            .attr('font-size', '12px')
            .selectAll('tspan')
            .data([
              `Fox ID: ${d.ID.toString()}`,
              `X: ${d.x.toString()}`,
              `Y: ${d.y.toString()}`,
            ])
            .join('tspan')
            .attr('x', x + 5)
            .attr('text-anchor', 'start')
            .attr('dy', (d, i) => i === 0 ? 0 : '1.2em')
            .text(d => d)
            .style("display", "block");
        })
        .on('mouseout', function() {
          const selected_circle = d3.select(this);
          const isSelected = (isChecked && selected_circle.node() === previouslySelectedGreen?.node()) || 
                            (!isChecked && selected_circle.node() === previouslySelectedBlue?.node());
          
          // Return to original size (4) only if not selected
          selected_circle.attr('r', isSelected ? 8 : 4);
          
          // Remove tooltips
          this.svg.select('#tooltip1').remove();
          this.svg.select('#tooltip2').remove();
        });
      
        // Rectangle group event handlers
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
      
    }
}

// ***** V1

// let AxesSvg = d3.select('#scatter-plot')
// .append('svg')
// .attr('width', SVGWIDTH )
// .attr('height', SVGHEIGHT)

// let axes_width = SVGWIDTH - margin.left - margin.right 
// let axes_height = SVGHEIGHT - margin.top - margin.bottom

// let xScale = d3.scaleLinear()
// .domain([0,1])
// .range([0, axes_width])

// let yScale = d3.scaleLinear().domain([0,1]).range([axes_height, 0])


// let xAxis = d3.axisBottom(xScale)
// let gx = AxesSvg.append('g').attr('transform', `translate(${margin.left},${axes_height + margin.top})`)
// xAxis(gx)

// let yAxis = d3.axisLeft(yScale)
// const gy = AxesSvg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`)
// yAxis(gy)

// **** V2

// let availableWidth = SVGWIDTH;
// let availableHeight = SVGHEIGHT;

// // Use 80% of the available space
// let svg_width = 0.8 * availableWidth;
// let svg_height = 0.8 * availableHeight;

// // Calculate offsets to center the SVG
// let offsetX = (availableWidth - svg_width) / 2;
// let offsetY = (availableHeight - svg_height) / 2;

// Append the SVG with adjusted width, height, and offsets for centralization
// let AxesSvg = d3.select('#scatter-plot')
//   .append('svg')
//   .attr('width', availableWidth) // Full width for alignment
//   .attr('height', availableHeight) // Full height for alignment
//   .attr('display', "flex") 
//   .attr('justify-content', "center") 
//   .append("g")
//   .attr("transform", `translate(${offsetX},${offsetY-20})`);

// Define adjusted width and height for axes area
// let axes_width = svg_width - margin.left - margin.right;
// let axes_height = svg_height - margin.top - margin.bottom;

// Scales and axes with reduced range
// let xScale = d3.scaleLinear()
//   .domain([0, 1])
//   .range([0, axes_width]);

// let yScale = d3.scaleLinear()
//   .domain([0, 1])
//   .range([axes_height, 0]);

// let xAxis = d3.axisBottom(xScale);
// let gx = AxesSvg.append('g')
//   .attr('transform', `translate(${margin.left},${axes_height + margin.top})`);
// xAxis(gx);

// let yAxis = d3.axisLeft(yScale);
// let gy = AxesSvg.append('g')
//   .attr('transform', `translate(${margin.left}, ${margin.top})`);
// yAxis(gy);











