function drawMultiLineChart(data) {
  console.log("In multiline ", data);
  var dat = data.multi;
  var ext = data.extent + 5;
  var variable = data.variable;

  var width = 350;
  var height = 250;
  var margin = 50;
  var duration = 250;

  var lineOpacity = "0.25";
  var lineOpacityHover = "0.85";
  var otherLinesOpacityHover = "0.1";
  var lineStroke = "1.5px";
  var lineStrokeHover = "2.5px";

  var circleOpacity = "0.85";
  var circleOpacityOnLineHover = "0.25";
  var circleRadius = 3;
  var circleRadiusHover = 6;

  var keys = [];

  console.log("HEREEEE ", dat);

  /* Format Data */
  var parseDate = d3.timeParse("%Y");
  dat.forEach(function (d) {
    d.values.forEach(function (d) {
      d.date = parseDate(d.date);
      d.count = +d.count;
    });
    keys.push(d.name);
  });

  d3.select("#mylinechart").select("svg").remove();

  /* Scale */
  var xScale = d3
    .scaleTime()
    .domain(
      d3.extent(dat[0].values, function (d) {
        return d.date;
      })
    )
    // .domain(d3.extent(data[0].values, d => d.date))
    // .domain([2013,2019])
    .range([0, width - margin]);

  var yScale = d3
    .scaleLinear()
    // .domain(d3.extent(dat[0].values, function(d) { return d.count; }))
    // // .domain(data.map(function(d) { return d.count; }))

    .domain([0, ext])
    .range([height - margin, 0]);

  // var color = d3.scaleOrdinal(d3.schemeReds[6]);
  var color = d3.scaleLinear().range(["#ED988A", "#D74E43"]).interpolate(d3.interpolateLab);

  /* Add SVG */
  var svg = d3
    .select("#mylinechart")
    .append("svg")
    .attr("width", width + margin + "px")
    .attr("height", height + margin + "px")
    .append("g")
    .attr("transform", `translate(${margin}, ${margin})`);

  /* Add line into SVG */
  var line = d3
    .line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.count));

  let lines = svg.append("g").attr("class", "lines");

  lines
    .selectAll(".line-group")
    .data(dat)
    .enter()
    .append("g")
    .attr("class", "line-group")
    .on("mouseover", function (d, i) {
      svg
        .append("text")
        // .attr("class", "title-text")
        .attr("x", 40 - width)
        .attr("y", 40)
        .style("fill", color(i))
        // .text(d.name);
      // .attr("text-anchor", "middle")
    })
    .on("mouseout", function (d) {
      svg.select(".title-text").remove();
    })
    .append("path")
    .attr("class", "line")
    .attr("d", (d) => line(d.values))
    .style("stroke", (d, i) => color(i))
    .style("opacity", lineOpacity)
    .on("mouseover", function (d) {
      d3.selectAll(".line").style("opacity", otherLinesOpacityHover);
      d3.selectAll(".circle").style("opacity", circleOpacityOnLineHover);
      d3.select(this)
        .style("opacity", lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
        .style("cursor", "pointer");
    })
    .on("mouseout", function (d) {
      d3.selectAll(".line").style("opacity", lineOpacity);
      d3.selectAll(".circle").style("opacity", circleOpacity);
      d3.select(this).style("stroke-width", lineStroke).style("cursor", "none");
    });

  /* Add circles in the line */
  lines
    .selectAll("circle-group")
    .data(dat)
    .enter()
    .append("g")
    .style("fill", (d, i) => color(i))
    .selectAll("circle")
    .data((d) => d.values)
    .enter()
    .append("g")
    .attr("class", "circle")
    .on("mouseover", function (d) {
      d3.select(this)
        .style("cursor", "pointer")
        .append("text")
        .attr("class", "text")
        .text(`${d.count}` + " in year " + d.date.getFullYear())
        .attr("x", (d) => xScale(d.date) + 5)
        .attr("y", (d) => yScale(d.count) - 10);
    })
    .on("mouseout", function (d) {
      d3.select(this)
        .style("cursor", "none")
        .transition()
        .duration(duration)
        .selectAll(".text")
        .remove();
    })
    .append("circle")
    .attr("cx", (d) => xScale(d.date))
    .attr("cy", (d) => yScale(d.count))
    .attr("r", circleRadius)
    .style("opacity", circleOpacity)
    .on("mouseover", function (d) {
      d3.select(this)
        .transition()
        .duration(duration)
        .attr("r", circleRadiusHover);
    })
    .on("mouseout", function (d) {
      d3.select(this).transition().duration(duration).attr("r", circleRadius);
    });

  /* Add Axis into SVG */
  var xAxis = d3.axisBottom(xScale).ticks(5);
  var yAxis = d3.axisLeft(yScale).ticks(5);

  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${height - margin})`)
    .call(xAxis)
    .append("text")
    .attr("x", width - 40)
    .attr("y", -height)
    // .attr("transform", "rotate(-180)")
    .attr("fill", "#000")
    .text("Year");

  svg
    .append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")
    .text("Total killings");

  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    // .text(variable);

  // Add one dot in the legend for each name.
  var size = 10;
  svg
    .selectAll("myrect")
    .data(dat)
    .enter()
    .append("rect")
    .attr("x", 330)
    .attr("y", function (d, i) {
      return i * (size + 5) - 3;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("width", size)
    .attr("height", size)
    .style("fill", function (d, i) {
      return color(i);
    });

  // Add one dot in the legend for each name.
  svg
    .selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", 150 + size * 1.2)
    .style("font-size","9px")
    .attr("y", function (d, i) {
      return i * (size + 5) + size / 2 - 3;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function (d, i) {
      return color(i);
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}
