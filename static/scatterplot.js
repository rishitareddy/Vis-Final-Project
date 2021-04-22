    // set the dimensions and margins of the graph
    var margin = {top: 20, right: 40, bottom: 30, left: 70},
        width = 200 ;
        height = 200 ;

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
    d3.csv("Police_Killings_By_PD.csv", function(data) {

     var x = d3.scaleBand()
     // .domain(data.sort(function(a, b) { if(a.Avg_Annual_Police_Homicide_Rate >= b.Avg_Annual_Police_Homicide_Rate) return a.City; }))
     .domain(data.map(function(d) { return d.City; }))
     .rangeRound([0, width]);

     var y0 = d3.scaleLinear()
     .domain([0,20])
     .range([ height,0 ]);


    var y1 = d3.scaleLinear()
    .domain([0,d3.max(data, function (d) {return d.Avg_Annual_Police_Homicide_Rate;})])
    .range([ height,0 ]);

      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add X axis label:
      svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width - 20)
        .attr("y", height + margin.top + 15)
        .text("City")
        .attr("transform", "rotate(-180)" );


      // Add Y axis

      svg.append("g")
        .call(d3.axisLeft(y0));

      // Y axis label:
      svg.append("text")
        .attr("text-anchor", "end")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left+40)
        .attr("x", -margin.top - 10 )
        .text("Avg Violent Crime Rate");

        svg.append("g")
        .attr("transform", "translate("+width+",0)")
          .call(d3.axisRight(y1));

        // Y axis label:
        svg.append("text")
          .attr("text-anchor", "end")
          .attr("transform", "rotate(-90)")
          // .attr("transform", "translate(" + width + " ,0)")
          .attr("y", width + 40)
          .attr("x", -margin.top + 28 )
        .text("Avg Annual Police Homicide Rate")


        // svg.append('g')
        //   .selectAll(".point")
        //   .data(data)
        //   .enter()
        //   .append("path")
        //   .attr("class", "point")
        //   .attr("d", d3.symbol().type(d3.symbolCross))
        //   .attr("transform", function(d) { return "translate(" + x(d.City) + "," + y0(d.Violent_Crime_Rate) + ")"; })
        //     .style("fill", "red");

      // Add dots
      svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
          .attr("cx", function (d) { return x(d.City); } )
          .attr("cy", function (d) { return y1(d.Avg_Annual_Police_Homicide_Rate); } )
          .attr("r", 2.0)
          .style("fill", "#0069B2");


          // Add dots
          svg.append('g')
            .selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
              .attr("cx", function (d) { return x(d.City); } )
              .attr("cy", function (d) { return y0(d.Violent_Crime_Rate); } )
              .attr("r", 2.0)
              .style("fill", "red");



    })
