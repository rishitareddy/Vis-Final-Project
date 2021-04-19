function drawScatterPlot(xdata,ydata){

    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 40, bottom: 40, left: 70},
        width = 500 ;
        height = 400 ;
    
    document.getElementById('myscatterplot').innerHTML = "";
    // append the svg object to the body of the page
    var svg = d3.select("#myscatterplot")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
    
    //Read the data
    d3.csv("PFDataset1.csv", function(data) {
    
      categorical = ['Gender', 'Attrition_Flag','Income_Category','Card_Category','Education_Level','Marital_Status'];
        if(categorical.includes(xdata)){
           var x = d3.scaleBand().domain(data.map(function(d) { return d[xdata]; }))
           .rangeRound([0, width]).padding(1);
       } else 
       {
        var x = d3.scaleLinear()
        .domain([0,d3.max(data, function (d) {return d[xdata];})])
        .range([ 0, width ]);
       }
    
        if(categorical.includes(ydata))
        {   var y = d3.scaleBand().domain(data.map(function(d) { return d[ydata]; }))
        .rangeRound([height,0]).padding(1);
    } else 
    {
     var y = d3.scaleLinear()
     .domain([0,d3.max(data, function (d) {return d[ydata];})])
     .range([ height,0 ]);
    }
      
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));
    
      // Add X axis label:
      svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width - 20)
        .attr("y", height + margin.top + 15)
        .text(xdata)
    
      // Add Y axis
      
      svg.append("g")
        .call(d3.axisLeft(y));
    
      // Y axis label:
      svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+20)
        .attr("x", -margin.top)
        .text(ydata)
    
      // Add dots
      svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d[xdata]); } )
          .attr("cy", function (d) { return y(d[ydata]); } )
          .attr("r", 2.0)
          .style("fill", "#0069B2")
    
    })
    }
    