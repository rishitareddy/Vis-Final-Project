// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#hdata")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("PFDataset1.csv", function(data) {
  var countObj = {};

// count how much each gender occurs in list and store in countObj
data.forEach(function(d) {

  if(countObj[d.State] == undefined) {
      countObj[d.State] = 0;
  } else {
      countObj[d.State] = countObj[d.State] + 1;

  }
});
// now store the count in each data member
data.forEach(function(d) {
  d.count = countObj[d.State];
  // console.log(d.count);
});


data.sort(function(b, a) {
  return a.count - b.count;

});

data = data.slice(1,10)


  // Add X axis
  var x = d3.scaleLinear()
    .domain([0,d3.max(data, function(d) { return d.count; })])
    .range([ 0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

  // Y axis
  var y = d3.scaleBand()
    .range([ 0, height ])
    .domain(data.map(function(d) { return d.State; }))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.State); })
    .attr("width", function(d) { return x(d.count); })
    .attr("height", y.bandwidth() )
    .attr("fill", "#69b3a2")


    // .attr("x", function(d) { return x(d.Country); })
    // .attr("y", function(d) { return y(d.Value); })
    // .attr("width", x.bandwidth())
    // .attr("height", function(d) { return height - y(d.Value); })
    // .attr("fill", "#69b3a2")

})
