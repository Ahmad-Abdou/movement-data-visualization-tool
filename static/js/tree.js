class Tree {
    constructor(containerId, width, height, margin) {
        this.width = width * 0.9; // Scale down width slightly
        this.height = height * 0.7; // Reduce height to fit better
        this.margin = margin;
        
        this.svg = d3.select(containerId)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);
            
        this.treeGroup = this.svg.append('g')
            .attr('transform', `translate(0, ${margin.top/2})`); // Move tree up slightly
            
        this.selectedRects = [];
        
        // Adjust box dimensions
        this.boxWidth = this.width * 0.2; // Make boxes proportional to container
        this.boxHeight = this.height * 0.12;
        this.centeredCircle = (this.width/2);
        this.offset = this.width * 0.25; // Make offset proportional
        
        this.init();
    }

    init() {
        this.drawMainBox();
        this.drawTreeLines();
        this.drawLabels();
    }

    drawMainBox() {
        // Adjust main box position
        this.treeGroup.append('rect')
            .attr('width', this.boxWidth)
            .attr('height', this.boxHeight)
            .attr('x', this.centeredCircle - this.boxWidth/2)
            .attr('y', 20)
            .attr('fill', 'none')
            .attr('stroke', 'black');

        // Adjust text position
        this.treeGroup.append('text')
            .attr('text-anchor', 'middle')
            .selectAll('tspan')
            .data(['Movement', 'variables'])
            .enter()
            .append('tspan')
            .attr('x', this.centeredCircle)
            .attr('y', d => 45 + (d === 'variables' ? 20 : 0))
            .text(d => d)
            .attr('font-size', 14);
    }

    drawTreeLines() {
        const lineGenerator = d3.line()
            .x(d => d[0])
            .y(d => d[1])
            .curve(d3.curveBasis);

        // Adjust line positions
        let treeLines = [
            {points: [[this.centeredCircle, this.boxHeight + 20], 
                     [this.centeredCircle, this.height/2], 
                     [this.centeredCircle - this.offset, this.height * 0.6]]},
            {points: [[this.centeredCircle, this.boxHeight + 20], 
                     [this.centeredCircle, this.height/2], 
                     [this.centeredCircle + this.offset, this.height * 0.6]]}
        ];

        treeLines.forEach((shape, index) => {
            this.treeGroup.append('path')
                .attr('d', lineGenerator(shape.points))
                .attr('stroke', 'black')
                .attr('stroke-width', '1')
                .attr('fill', 'none');
        });

        let treeSubLines = [
            {points: [[this.centeredCircle - this.offset, this.height * 0.6], [this.centeredCircle - this.offset - this.width * 0.15, this.height * 0.8]]},
            {points: [[this.centeredCircle - this.offset, this.height * 0.6], [this.centeredCircle - this.offset + this.width * 0.15, this.height * 0.8]]},
            {points: [[this.centeredCircle + this.offset, this.height * 0.6], [this.centeredCircle + this.offset - this.width * 0.15, this.height * 0.8]]},
            {points: [[this.centeredCircle + this.offset, this.height * 0.6], [this.centeredCircle + this.offset + this.width * 0.15, this.height * 0.8]]}
        ];

        treeSubLines.forEach((shape, index) => {
            this.treeGroup.append('path')
                .attr('d', lineGenerator(shape.points))
                .attr('stroke', 'black')
                .attr('stroke-width', '1')
                .attr('fill', 'none')
                .attr('transform', `translate(10, 70)`);
        });
    }

    drawLabels() {
        // Adjust label positions
        let treeLabels = [
            {text: "Geometric", position: [this.centeredCircle + this.offset, this.height * 0.6]},
            {text: "Kinematic", position: [this.centeredCircle - this.offset, this.height * 0.6]},
        ];

        let treeSubLabels = [
            {text: "Speed", position: [this.centeredCircle - this.offset - this.width * 0.15, this.height * 0.8]},
            {text: "Acceleration", position: [this.centeredCircle - this.offset + this.width * 0.15, this.height * 0.8]},
            {text: "Curvature", position: [this.centeredCircle + this.offset - this.width * 0.15, this.height * 0.8]},
            {text: "Indentation", position: [this.centeredCircle + this.offset + this.width * 0.15, this.height * 0.8]},
        ];

        // Draw labels with adjusted font size
        treeLabels.forEach((label, i) => {
            let rect = this.treeGroup.append('rect')
                .attr('id', `${label.text}`)
                .attr('width', this.boxWidth)
                .attr('height', this.boxHeight)
                .attr('x', label.position[0] - this.boxWidth/2)
                .attr('y', label.position[1])
                .attr('fill', 'white')
                .attr('stroke', 'black')
                .on("click", () => {
                    this.toggleColor(d3.select(rect.node()), label.text);
                });

            this.treeGroup.append('text')
                .attr('x', label.position[0])
                .attr('y', label.position[1] + this.boxHeight/2)
                .text(label.text)
                .attr('font-size', '16')
                .attr('text-anchor', 'middle')
                .on("click", () => {
                    this.toggleColor(d3.select(rect.node()), label.text);
                });
        });

        treeSubLabels.forEach((label, i) => {
            let rect = this.treeGroup.append('rect')
                .attr('id', `${label.text}`)
                .attr('width', this.boxWidth)
                .attr('height', this.boxHeight)
                .attr('x', label.position[0] - this.boxWidth/2)
                .attr('y', label.position[1])
                .attr('fill', 'white')
                .attr('stroke', 'black')
                .on("click", () => {
                    this.toggleColor(d3.select(rect.node()), label.text);
                });

            this.treeGroup.append('text')
                .attr('x', label.position[0])
                .attr('y', label.position[1] + this.boxHeight/2)
                .text(label.text)
                .attr('font-size', '16')
                .attr('text-anchor', 'middle')
                .on("click", () => {
                    this.toggleColor(d3.select(rect.node()), label.text);
                });
        });
    }

    toggleColor(element, text) {
        const currentColor = element.attr('fill');
       
        if (this.selectedRects.length < 2) {
            if (currentColor === "white") {
                element.attr('fill', '#B9E7F5');
                this.selectedRects.push({ element: element, text: text });
            }
        } else if (currentColor === "white" && this.selectedRects.length === 2) {
            this.selectedRects[0].element.attr('fill', 'white');
            this.selectedRects.shift();
            element.attr('fill', '#B9E7F5');
            this.selectedRects.push({ element: element, text: text });
        }

        if (this.selectedRects.length === 2) {
            const xText = this.selectedRects[0].text;
            const yText = this.selectedRects[1].text;
            showData(xText, yText);
        }
    }

    colorTreeElement(element1, element2) {
        let treeLabels = [
            {text: "Geometric", position: [this.centeredCircle + this.offset, this.height * 0.6]},
            {text: "Kinematic", position: [this.centeredCircle - this.offset, this.height * 0.6]},
        ];

        let treeSubLabels = [
            {text: "Speed", position: [this.centeredCircle - this.offset - this.width * 0.15, this.height * 0.8]},
            {text: "Acceleration", position: [this.centeredCircle - this.offset + this.width * 0.15, this.height * 0.8]},
            {text: "Curvature", position: [this.centeredCircle + this.offset - this.width * 0.15, this.height * 0.8]},
            {text: "Indentation", position: [this.centeredCircle + this.offset + this.width * 0.15, this.height * 0.8]},
        ];

        treeLabels.forEach((label, i) => {
            let rect = this.treeGroup.append('rect')
                .attr('id', `${label.text}`)
                .attr('width', this.boxWidth)
                .attr('height', this.boxHeight)
                .attr('x', label.position[0] - this.boxWidth/2)
                .attr('y', label.position[1])
                .attr('fill', 'white')
                .attr('stroke', 'black')
                .on("click", () => {
                    this.toggleColor(d3.select(rect.node()), label.text);
                });

            if (element1 == rect.node().id) {
                this.toggleColor(d3.select(rect.node()), element1);
            } else if (element2 == rect.node().id) {
                this.toggleColor(d3.select(rect.node()), element2);
            }

            this.treeGroup.append('text')
                .attr('x', label.position[0])
                .attr('y', label.position[1] + this.boxHeight/2)
                .text(label.text)
                .attr('font-size', '16')
                .attr('text-anchor', 'middle')
                .on("click", () => {
                    this.toggleColor(d3.select(rect.node()), label.text);
                });
        });

        treeSubLabels.forEach((label, i) => {
            let rect = this.treeGroup.append('rect')
                .attr('id', `${label.text}`)
                .attr('width', this.boxWidth)
                .attr('height', this.boxHeight)
                .attr('x', label.position[0] - this.boxWidth/2)
                .attr('y', label.position[1])
                .attr('fill', 'white')
                .attr('stroke', 'black')
                .on("click", () => {
                    this.toggleColor(d3.select(rect.node()), label.text);
                });

            if (element1 == rect.node().id) {
                this.toggleColor(d3.select(rect.node()), element1);
            } else if (element2 == rect.node().id) {
                this.toggleColor(d3.select(rect.node()), element2);
            }

            this.treeGroup.append('text')
                .attr('x', label.position[0])
                .attr('y', label.position[1] + this.boxHeight/2)
                .text(label.text)
                .attr('font-size', '16')
                .attr('text-anchor', 'middle')
                .on("click", () => {
                    this.toggleColor(d3.select(rect.node()), label.text);
                });
        });
    }
}

const tree = new Tree('#taxonomy-element', SVGWIDTH, SVGHEIGHT, margin);

text_combined = [];
let unsorted_combination = "";

function showData(xAxis, yAxis) {    
    unsorted_combination = `${xAxis} ${yAxis}`;
    let combinedString = unsorted_combination;
    get_title_axis_lables(xAxis, yAxis);

    if (file_mapping.hasOwnProperty(combinedString)) {        
        let selectedFile = file_mapping[combinedString];
        d3.csv(selectedFile)
            .then(data => {
                showAxes(data);
                combination = combinedString;
                heatmap = new Heatmap('heat-map', 450, 450, margin_heat, frequency_zone_combinations);
                heatmap.render(file_mapping);
            })
            .catch(error => {
                console.error("Error loading file: ", error);
            });
    } 
}

tree.colorTreeElement(null, null);