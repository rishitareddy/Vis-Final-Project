var data = [
  {
    name: "Asian",
    values: [
      {date: "2013", count: "18"},
      {date: "2014", count: "16"},
      {date: "2015", count: "29"},
      {date: "2016", count: "14"},
      {date: "2017", count: "12"},
      {date: "2018", count: "14"},
      {date: "2019", count: "18"},
      {date: "2020", count: "12"},
      {date: "2021", count: "1"}
    ]
  },
  {
    name: "Black",
    values: [
      {date: "2013", count: "289"},
      {date: "2014", count: "277"},
      {date: "2015", count: "305"},
      {date: "2016", count: "279"},
      {date: "2017", count: "277"},
      {date: "2018", count: "263"},
      {date: "2019", count: "277"},
      {date: "2020", count: "233"},
      {date: "2021", count: "51"}
    ]
  },
  {
    name: "Hispanic",
    values: [
      {date: "2013", count: "168"},
      {date: "2014", count: "182"},
      {date: "2015", count: "195"},
      {date: "2016", count: "193"},
      {date: "2017", count: "255"},
      {date: "2018", count: "196"},
      {date: "2019", count: "199"},
      {date: "2020", count: "165"},
      {date: "2021", count: "19"}
    ]
  },
  {
    name: "Native American",
    values: [
      {date: "2013", count: "4"},
      {date: "2014", count: "10"},
      {date: "2015", count: "13"},
      {date: "2016", count: "23"},
      {date: "2017", count: "28"},
      {date: "2018", count: "20"},
      {date: "2019", count: "13"},
      {date: "2020", count: "11"},
      {date: "2021", count: "4"}
    ]
  },
  {
    name: "Pacific Islander",
    values: [
      {date: "2013", count: "2"},
      {date: "2014", count: "5"},
      {date: "2015", count: "4"},
      {date: "2016", count: "6"},
      {date: "2017", count: "6"},
      {date: "2018", count: "10"},
      {date: "2019", count: "9"},
      {date: "2020", count: "7"},
      {date: "2021", count: "0"}
    ]
  },
  {
    name: "Unknown",
    values: [
      {date: "2013", count: "179"},
      {date: "2014", count: "84"},
      {date: "2015", count: "13"},
      {date: "2016", count: "22"},
      {date: "2017", count: "38"},
      {date: "2018", count: "141"},
      {date: "2019", count: "136"},
      {date: "2020", count: "317"},
      {date: "2021", count: "136"}
    ]
  },
  {
    name: "White",
    values: [
      {date: "2013", count: "428"},
      {date: "2014", count: "476"},
      {date: "2015", count: "543"},
      {date: "2016", count: "533"},
      {date: "2017", count: "505"},
      {date: "2018", count: "501"},
      {date: "2019", count: "444"},
      {date: "2020", count: "382"},
      {date: "2021", count: "97"}
    ]
  }
];



var width = 450;
var height = 300;
var margin = 50;
var duration = 250;

var lineOpacity = "0.25";
var lineOpacityHover = "0.85";
var otherLinesOpacityHover = "0.1";
var lineStroke = "1.5px";
var lineStrokeHover = "2.5px";

var circleOpacity = '0.85';
var circleOpacityOnLineHover = "0.25"
var circleRadius = 3;
var circleRadiusHover = 6;

var keys = []

/* Format Data */
var parseDate = d3.timeParse("%Y");
data.forEach(function(d) {
  d.values.forEach(function(d) {
    d.date = parseDate(d.date);
    d.count = +d.count;
  });
  keys.push(d.name)
});


/* Scale */
var xScale = d3.scaleTime()
  .domain(d3.extent(data[0].values, function(d) { return d.date; }))
  // .domain(d3.extent(data[0].values, d => d.date))
  .range([0, width - margin ]);

var yScale = d3.scaleLinear()
  .domain([0, 650])
  .range([height - margin, 0]);

  var color = d3.scaleOrdinal()
    .domain(keys)
    .range(d3.schemeCategory10);

/* Add SVG */
var svg = d3.select("#mylinechart").append("svg")
  .attr("width", (width+margin)+"px")
  .attr("height", (height+margin)+"px")
  .append('g')
  .attr("transform", `translate(${margin}, ${margin})`);


/* Add line into SVG */
var line = d3.line()
  .x(d => xScale(d.date))
  .y(d => yScale(d.count));

let lines = svg.append('g')
  .attr('class', 'lines');

lines.selectAll('.line-group')
  .data(data).enter()
  .append('g')
  .attr('class', 'line-group')
  .on("mouseover", function(d, i) {
      svg.append("text")
        // .attr("class", "title-text")
        .attr("x", 40 -width)
        .attr("y",40)
        .style("fill", color(i))
        .text(d.name)
        // .attr("text-anchor", "middle")
      ;
    })
  .on("mouseout", function(d) {
      svg.select(".title-text").remove();
    })
  .append('path')
  .attr('class', 'line')
  .attr('d', d => line(d.values))
  .style('stroke', (d, i) => color(i))
  .style('opacity', lineOpacity)
  .on("mouseover", function(d) {
      d3.selectAll('.line')
					.style('opacity', otherLinesOpacityHover);
      d3.selectAll('.circle')
					.style('opacity', circleOpacityOnLineHover);
      d3.select(this)
        .style('opacity', lineOpacityHover)
        .style("stroke-width", lineStrokeHover)
        .style("cursor", "pointer");
    })
  .on("mouseout", function(d) {
      d3.selectAll(".line")
					.style('opacity', lineOpacity);
      d3.selectAll('.circle')
					.style('opacity', circleOpacity);
      d3.select(this)
        .style("stroke-width", lineStroke)
        .style("cursor", "none");
    });


/* Add circles in the line */
lines.selectAll("circle-group")
  .data(data).enter()
  .append("g")
  .style("fill", (d, i) => color(i))
  .selectAll("circle")
  .data(d => d.values).enter()
  .append("g")
  .attr("class", "circle")
  .on("mouseover", function(d) {
      d3.select(this)
        .style("cursor", "pointer")
        .append("text")
        .attr("class", "text")
        .text(`${d.count}` + " in year "+ (d.date).getFullYear())
        .attr("x", d => xScale(d.date) + 5)
        .attr("y", d => yScale(d.count) - 10);
    })
  .on("mouseout", function(d) {
      d3.select(this)
        .style("cursor", "none")
        .transition()
        .duration(duration)
        .selectAll(".text").remove();
    })
  .append("circle")
  .attr("cx", d => xScale(d.date))
  .attr("cy", d => yScale(d.count))
  .attr("r", circleRadius)
  .style('opacity', circleOpacity)
  .on("mouseover", function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr("r", circleRadiusHover);
      })
    .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr("r", circleRadius);
      });


/* Add Axis into SVG */
var xAxis = d3.axisBottom(xScale).ticks(5);
var yAxis = d3.axisLeft(yScale).ticks(5);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${height-margin})`)
  .call(xAxis)
  .append('text')
  .attr("x", width - 40)
  .attr("y", - height )
  // .attr("transform", "rotate(-180)")
  .attr("fill", "#000")
  .text("Year");

svg.append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append('text')
  .attr("y", 15)
  .attr("transform", "rotate(-90)")
  .attr("fill", "#000")
  .text("Total killings");


  // Add one dot in the legend for each name.
  var size = 10
  svg.selectAll("myrect")
    .data(data)
    .enter()
    .append("rect")
      .attr("x", 330)
      .attr("y", function(d,i){ return i*(size+5) - 3}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("width", size)
      .attr("height", size)
      .style("fill", function(d,i){ return color(i)})

  // Add one dot in the legend for each name.
  svg.selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
      .attr("x", 330 + size*1.2)
      .attr("y", function(d,i){ return i*(size+5) + (size/2) - 3}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d,i){ return color(i)})
      .text(function(d){ return d})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
