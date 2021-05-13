var drawGraph = function(){

	//number of circles to color in to visualize percent
	var percentNumber = 9;

	//variables for the font family, and some colors
	var fontFamily = "helvetica";
	var twitterFill = "#87CEEB";
	var twitterFillActive = "#C70039";
	var svgBackgroundColor = '#FFFFFF';

	//width and height of the SVG
	const width = 500;
	const height = 500;

	//create an svg with width and height
	var svg = d3.select('#grid-chart')
		.append('svg')
		.attr("width", width)
		.attr("height", height)
    	.style('background-color', svgBackgroundColor);
    
      /* 
    	this is the human icon path definition 
    */
    
     var human = svg.append("defs")
		.append("g")
		.attr("id","humanIcon");

	human
		.append("path")
        .attr("d","M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z")
        .attr("transform", "translate(0,0) scale(5)");
    
    //end human path definition

	//2 rows and 5 columns 
	var numRows = 2;
	var numCols = 5;

	//x and y axis scales
	var y = d3.scaleBand()
		.range([0,75])
		.domain(d3.range(numRows));

	var x = d3.scaleBand()
		.range([0, 150])
		.domain(d3.range(numCols));

	//the data is just an array of numbers for each cell in the grid
	var data = d3.range(numCols*numRows);

	//container to hold the grid
	var container = svg.append("g")
		.attr("transform", "translate(25,20)");
	

	container.selectAll("use")
			.data(data)
			.enter().append("use")
			.attr("xlink:href", "#humanIcon")
			.attr("id", function(d){return "id"+d;})
			.attr('x', function(d){return x(d%numCols);})
			.attr('y', function(d){return y(Math.floor(d/numCols));})
			.attr('fill', function(d){return d < percentNumber ? twitterFillActive : twitterFill;})
			.style('stroke', 'white');

}

	//call function to draw the graph
	drawGraph();
