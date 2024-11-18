
const margin = {left: 50, right: 50, top: 50, bottom: 65};
const tree = new Tree('#taxonomy-element', 450, 450, margin);
const barChart = new BarChart('.bar-chart', 450, 450);
const axesPlot = new AxesPlot('#scatter-plot', 450, 450, margin);

// Use them like:
barChart.generateBars(idFilter1, idFilter2);
axesPlot.showPlots(data);