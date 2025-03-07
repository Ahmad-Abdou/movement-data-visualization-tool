class AxesPlot {

    constructor(containerId, width, height, margin) {

        this.width = width;
        this.height = height;
        this.margin = margin;
        this.colorsList = [];
        this.allPlots = null
        this.availableWidth = width;
        this.availableHeight = height;
        this.svgWidth = 0.7 * this.availableWidth -20;
        this.svgHeight = 0.7 * this.availableHeight -20;
        this.offsetX = (this.availableWidth - this.svgWidth) / 2  - margin.right;
        this.offsetY = (this.availableHeight - this.svgHeight) / 2 - margin.top;
        this.svg = d3.select(containerId).append('svg').attr('width', this.availableWidth).attr('height', this.availableHeight).attr('display', "flex").attr('justify-content', "center").append("g").attr("transform", `translate(${this.offsetX},${this.offsetY + 10})`);
        this.xScale = d3.scaleLinear().domain([0, 1]).range([0, this.svgWidth]);
        this.yScale = d3.scaleLinear().domain([0, 1]).range([this.svgHeight, 0]);
        this.xAxis = d3.axisBottom(this.xScale);
        this.gx = this.svg.append('g').attr('transform', `translate(${this.margin.left},${this.svgHeight + this.margin.top})`);
        this.yAxis = d3.axisLeft(this.yScale);
        this.gy = this.svg.append('g').attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
        this.axesLineGenerator = d3.line().x(d=>this.xScale(d[0] )).y(d=>this.yScale(d[1]))
        this.colorScale = d3.scaleOrdinal().domain([0, 1]).range(['#1f77b4', '#ff7f0e']);
        this.colorsList = []
        this.zones = this.svg.append('g').attr('class', 'zones')
        this.trajectoryToCompare = false
        this.trajectoriesList = []
        this.axesLines = [
          {points: [[0,0.5], [0.5, 1]]},
          {points: [[0,0.5], [0.5,0.5], [0.5,0]]},
          {points: [[0.5,0] , [1,0.5]]},
          {points:[[0,0], [1,1]]}
        ]
        
        this.axes_zone_0  = [
          {points: [[0,0.5], [0.5,0.5], [0.5,0],[0,0], [0,0.5]]},
        ]
        
        this.axes_zone_1  = [
          {points: [[0,0.5], [0.5, 1], [0, 1], [0,0.5]]},
        ]
        
        this.axes_zone_2  = [
          {points: [[0.5,0] , [1,0.5], [1,0], [0.5,0]]},
        ]
        
        this.axes_zone_3  = [
          {points:[[0,0.5], [0.5, 1],[1,1],[1,0.5], [0.5,0],[0.5,0.5], [0,0.5]]}
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
        const axisGroup = this.svg.append('g').attr('class', 'axis-group');
        
        axesLines.forEach((shape, index)=>{
            axisGroup.append('path')
                .attr('d', this.axesLineGenerator(shape.points))
                .attr('transform', `translate(${this.margin.left}, ${this.margin.bottom + this.margin.top})`)
                .attr('fill', 'none')
                .attr('stroke', index === axesLines.length -1 ? 'grey': 'black')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', index === axesLines.length-1 ? '8': 'none');
        });
        
        axesLabels.forEach((label)=>{
            axisGroup.append('text')
                .attr('x', this.xScale(label.position[0]))
                .attr('y', this.yScale(label.position[1]))
                .attr('transform', `translate(${this.margin.left} , ${this.margin.top})`)
                .attr('font-size', 40)
                .text(label.text);
        });
        
        axisGroup.raise();
    }

    colorZone1(zone_number, all_data) {
        this.zones.selectAll('.zone-1-group').remove();
        let zoneShape;
        switch(zone_number) {
            case 0: zoneShape = this.axes_zone_0[0]; break;
            case 1: zoneShape = this.axes_zone_1[0]; break;
            case 2: zoneShape = this.axes_zone_2[0]; break;
            case 3: zoneShape = this.axes_zone_3[0]; break;
            default: return;
        }
        this.firstZoneGroup = this.zones.append('g').attr('class', 'zone-1-group')
        this.firstZoneGroup.append('path')
            .data([all_data])
            .attr('class', 'axes-zone')
            .attr('d', this.axesLineGenerator(zoneShape.points))
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
            .attr('fill', kinematicColor)

        this.plotGroup.lower();
        this.firstZoneGroup.selectAll('.zone-1-group').raise();
        this.firstZoneGroup.select('.axis-group').raise();
        this.gx.raise();
        this.gy.raise();
    }
    colorZone2(zone_number, all_data) {
      this.zones.selectAll('.zone-2-group').remove();
        let zoneShape;
        switch(zone_number) {
            case 0: zoneShape = this.axes_zone_0[0]; break;
            case 1: zoneShape = this.axes_zone_1[0]; break;
            case 2: zoneShape = this.axes_zone_2[0]; break;
            case 3: zoneShape = this.axes_zone_3[0]; break;
            default: return;
        }
        this.secondZoneGroup = this.zones.append('g').attr('class', 'zone-2-group')

        this.secondZoneGroup.append('path')
            .data([all_data])
            .attr('class', 'axes-zone')
            .attr('d', this.axesLineGenerator(zoneShape.points))
            .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
            .attr('fill', geometricColor)

        this.plotGroup.lower();
        this.secondZoneGroup.selectAll('.zone-2-group').raise();
        this.secondZoneGroup.select('.axis-group').raise();
        this.gx.raise();
        this.gy.raise();
    }

    setAxisTitles(x_title, y_title) {
          this.svg.selectAll('text.axis-title').remove();
          this.svg.append('text')
            .attr('class', 'axis-title')
            .text(x_title)
            .attr('x', (this.svgWidth / 2) + 50)
            .attr('y', this.svgHeight)
            .attr('text-anchor', 'middle')
            .attr('font-size', 20)
            .attr('fill', 'black');
        
          this.svg.append('text')
            .attr('class', 'axis-title')
            .text(y_title)
            .attr('x', 40)
            .attr('y', (this.svgHeight / 2) )
            .attr('text-anchor', 'middle')
            .attr('font-size', 20)
            .attr('transform', `rotate(-90, 13, ${this.svgHeight / 2})`)
            .attr('fill', 'black');
    }

    showPlots(data) {
        this.plotGroup.selectAll("*").remove();
        this.svg.selectAll("#rectangles").remove();
        const self = this

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
      
        this.allPlots = this.plotGroup.append('g')
            .attr('id', 'plots')
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('r', 4)
            .attr('cx', (d,i)=> this.xScale(d.normalizedX) + this.margin.left )
            .attr('cy', (d,i)=> this.yScale(d.normalizedY) + this.margin.top )
            .attr('fill' , 'grey');
      
          this.allPlots.each((d,i,n)=>{
          d3.select(n[i])
          .transition()
          .ease(d3.easeBounce)
          .duration(2000)
          .attr('cy', (d,i) => this.yScale(d.normalizedY) + this.margin.top )
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
            .attr('fill', 'rgba(85, 85, 85, 0.79)')
            .attr('rx', 10)
            .attr('ry', 10);
            
        tooltipContainer.append('text')
            .attr('class', 'tooltip-text')
            .attr('fill', 'white')
            .attr('font-size', '12px');

        const compare_btn = document.querySelector('.compare-btn')

        compare_btn.addEventListener('click',() => {
          this.trajectoryToCompare = !this.trajectoryToCompare
          notifyMessageAlwaysdisplayed("Selecting the second trajectory", this.trajectoryToCompare)
          compare_btn.style.backgroundColor = this.trajectoryToCompare ? geometricColor : kinematicColor
          if(selectingTrajectoryTwo) {
            selectingTrajectoryOne = true
            selectingTrajectoryTwo = false
          } else {
            selectingTrajectoryOne = false
            selectingTrajectoryTwo = true
          }
        })


        this.allPlots
.on('click', async function(event) {
    const selected_circle = d3.select(this);
    const id = event.target.__data__.entity_id;
    if(selectingTrajectoryTwo) {
        selectedTrajectory2 = id
      } else {
        selectedTrajectory1 = id
      }

    if(self.trajectoriesList.length === 2) {
        self.trajectoriesList.pop();
    }
    self.trajectoriesList.push(id);

    if(self.trajectoryToCompare && self.trajectoriesList.length === 1) {
        if(previouslySelectedBlue) {
            previouslySelectedBlue.attr('fill', 'grey').attr('r', 4);
            previouslySelectedBlue = null;
        }
        if(previouslySelectedGreen) {
            previouslySelectedGreen.attr('fill', 'grey').attr('r', 4);
            previouslySelectedGreen = null;
        }
    }

    if(self.trajectoryToCompare) {
        if(self.trajectoriesList.length === 1) {
            selected_circle
                .attr('fill', kinematicColor)
                .attr('r', 8);
            previouslySelectedBlue = selected_circle;
            const trajectories1 = await mapGl.generateMapGl(selectedTrajectory1);
            await mapGl.traject(trajectories1, selectedTrajectory1, null);
        }
        else if(self.trajectoriesList.length === 2) {
            if(previouslySelectedGreen && previouslySelectedGreen !== selected_circle) {
                previouslySelectedGreen.attr('fill', 'grey').attr('r', 4);
            }
            selected_circle
                .attr('fill', geometricColor)
                .attr('r', 8);
            previouslySelectedGreen = selected_circle;
            const trajectories2 = await mapGl2.generateMapGl(selectedTrajectory2);
            await mapGl2.traject(trajectories2, selectedTrajectory2, null);
        }
    } else {
        if(previouslySelectedBlue && previouslySelectedBlue !== selected_circle) {
            previouslySelectedBlue.attr('fill', 'grey').attr('r', 4);
        }
        if(previouslySelectedBlue === selected_circle) {
            selected_circle.attr('fill', 'grey').attr('r', 4);
            previouslySelectedBlue = null;
        } else {
            selected_circle
                .attr('fill', kinematicColor)
                .attr('r', 8);
            previouslySelectedBlue = selected_circle;
        }
        const trajectories = await mapGl.generateMapGl(selectedTrajectory1);
        await mapGl.traject(trajectories, selectedTrajectory1, null);
    } 
}).on('mouseover', function() {
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
                    `ID: ${d.entity_id}`,
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