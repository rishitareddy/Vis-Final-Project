function hbarchart(data){



  //I like to use the golden rectangle ratio if they work for my charts.

  // var svg = d3.select('#chartArea').append('svg');
  //We add our svg to the div area


  //We will build a basic function to handle window resizing.
  // function resize() {
  //     width = document.getElementById('chartArea').clientWidth;
  //     height = width / 3.236;
  //     d3.select('#chartArea')
  //       .attr('width', width)
  //       .attr('height', height);
  // }

  // window.onresize = resize;
  //Call our resize function if the window size is changed.


  // set the dimensions and margins of the graph
  var margin = {top: 20, right: 0, bottom: 40, left: 50},
      width = 400 - margin.left - margin.right,
      height = 270;

      // const bar = d3.select('svg')
      // .attr("width", "100%")
      // .attr("height", "100%");

      // const svgContainer = d3.select('#container');

  // append the svg object to the body of the page
  var svg = d3.select("#hdata")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


    // Add X axis
    var x = d3.scaleLinear()
      .domain([0, d3.max(data, function(d){return d.killingcount;})])
      .range([ 0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .append("text")
            .attr("transform",
                  "translate(" + (width/2) + " ," +
                                 (height + margin.top + 15) + ")")
            .style("text-anchor", "middle")
            .text("Total Killings");

    // Y axis
    var y = d3.scaleBand()
      .range([ 0, height ])
      .domain(data.map(function(d) { return d.state; }))
      .padding(.1);
    svg.append("g")
      .call(d3.axisLeft(y))
          .append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left)
            .attr("x", -margin.top )
            .text("State")
    //Bars
    svg.selectAll("myRect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", x(0) )
      .attr("y", function(d) { return y(d.state); })
      .attr("width", function(d) { return x(d.killingcount); })
      .attr("height", y.bandwidth() )
      .attr("fill", "#FFC300")


      // .attr("x", function(d) { return x(d.Country); })
      // .attr("y", function(d) { return y(d.Value); })
      // .attr("width", x.bandwidth())
      // .attr("height", function(d) { return height - y(d.Value); })
      // .attr("fill", "#69b3a2")

  }
