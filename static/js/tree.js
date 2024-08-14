fetch(treeUrl)
    .then(function(response) {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(function(data) {
        console.log(data);
        runFunction(data);
    })
    .catch(function(error) {
        console.error('There has been a problem with your fetch operation:', error);
    });

function runFunction(jsondata) {
    const athletes = [];
    let rootNode = d3.hierarchy(jsondata, d => d.children);

    var pathLinks = rootNode.links();
    var circleLinks = rootNode.descendants();
    var textLinks = rootNode.descendants();

    let dim = {
        'width': window.screen.width * 2,
        'height': window.screen.height * 4,
        margin: 50
    };

    let svg = d3.select('#tree').append('svg')
        .style('background', 'white')
        .attr('width', dim.width)
        .attr('height', dim.height);

    document.querySelector('#tree').classList.add('center');

    let g = svg.append('g')
        .attr('transform', 'translate(1150,50)');

    let layout = d3.tree().size([dim.height - 2700, dim.width - 2700]);

    layout(rootNode);

    function update(data) {
        let group = g.selectAll('path')
            .data(data, (d, i) => d.target.data.sepalLength)
            .join(
                function(enter) {
                    return enter.append('path')
                        .attr('d', d3.linkVertical()
                            .x(d => d.x)
                            .y(d => d.y))
                        .attr('fill', 'none')
                        .attr('stroke', 'red');
                        
                },
                function(update) {
                    return update;
                },
                function(exit) {
                    return exit.call(path => path.transition().duration(300).remove()
                                    .attr('d', d3.linkVertical()
                                    .x(d => d.x)
                                    .y(d => d.y)))
                }
            )
            .call(path => path.transition().duration(1000).attr('d', d3.linkVertical()
                                    .x(d => d.x)
                                    .y(d => d.y))
                                    .attr("id", function(d,i) {
                                        return "path"+i}));
    }

    update(pathLinks);

    // Initializing the mouse as mouseX to store its coordinates, starting at zero
    let mouseX = 0;
    // Attaching svg event listener
    svg.on('mousemove', function() {
        const [x] = d3.mouse(this); // Gets the mouse X position relative to the SVG
        mouseX = x;
    });

    let buttonTracker = [];
    var valueArray

    function updateCircles(data) {
        g.selectAll('circle')
            .data(data, (d) => d.data.name)
            .join(
                enter => enter.append('circle')
                    // Setting the actual nodes vertically. 
                    .attr('cx',(d) => d.x)
                    .attr('cy',(d) => d.y)
                    .attr('r',12)
                    .attr('fill','red')
                    .attr('id',(d,i) => d.data.name)
                    .attr('class','sel')
                    // Switching node colors to orange when hovering.
                    .on('mouseover', function(d) {
                        d3.select(this)
                        .attr('fill','orange')
                        .transition()
                        .duration(100).attr('r',16)
                    })
                    // Switching back to red + size 12 when removing mouse.
                    .on('mouseout', function(d) {
                        d3.select(this)
                        .attr('fill','red')
                        .transition()
                        .duration(100).attr('r',12)
                    })

                    .on('click', async function(d) {

                        let buttonId = d3.select(this)["_groups"][0][0]["attributes"].id.value;
                        mouseX = d3.select(this)["_groups"][0][0]["attributes"].cx.value;

                        let checkButtonExist = buttonTracker.filter(button => button.buttonId != buttonId);

                        if (checkButtonExist[0] != undefined) {
                            buttonTracker = buttonTracker.filter(button => button.buttonId != buttonId);
                            pathLinks = checkButtonExist[0].buttonPathData.concat(pathLinks);
                            update(pathLinks);

                            // Handling circle update
                            circleLinks = checkButtonExist[0].buttonCircleData.concat(circleLinks);
                            updateCircles(circleLinks);

                            // Handling text update
                            // textLinks = checkButtonExist[0].buttonTextData.concat(textLinks);
                            // updateTextLinks(textLinks);
                        }

                        var valueArray = await processedlinks(d.links());
                        // console.log(valueArray)

                        updatePathLinks = pathLinks.filter(function(item) {
                            return !valueArray.includes(item.target.data.name);
                        });


                        var clickedPathData = pathLinks.filter(function(item) {
                            return valueArray.includes(item.target.data.name);
                        });

                        updateCircleLinks = circleLinks.filter(function(item) {
                            return !valueArray.includes(item.data.name);
                        });


                        var clickedCircleData = circleLinks.filter(function(item) {
                            return valueArray.includes(item.data.name);
                        });

                        // updateTextLinks = textLinks.filter(function(item) {
                        //     return !valueArray.includes(item.data.name);
                        // });


                        // var clickedTextData = textLinks.filter(function(item) {
                        //     return valueArray.includes(item.data.name);
                        // });



                        buttonTracker.push({
                            buttonId:buttonId,
                            buttonPathData:clickedPathData,
                            buttonCircleData:clickedCircleData,
                            // buttonTextData:clickedTextData
                        })
                        
                        update(updatePathLinks);
                        updateCircles(updateCircleLinks);
                        // updateText(updateTextLinks);

                        async function processedlinks(dlinks) {
                            var valueArray = [];

                            return new Promise((resolve, reject) => {
                                dlinks.forEach(async(element) => {
                                    valueArray.push(element.target.data.name);
                                });
                                resolve(valueArray);
                            });
                        }

                    }),
                
                update => update,
                
                exit => exit.transition()
                            .duration(300)
                            .remove()
                            .attr('cx',mouseX)
                            .attr('r',0)
                                
            )
            .transition()
            .duration(1000)
            .attr('cx', d => d.x);
            
    }

    updateCircles(circleLinks);
}


