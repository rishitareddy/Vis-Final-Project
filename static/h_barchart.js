function hbarchart(val){

console.log("In hbarchart woohoo", val);

d3.select("#horizontalbarchart").select("svg").remove();


var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 350 - margin.left - margin.right,
    height = 275 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#horizontalbarchart")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var weapon = ["Blunt object","Explosives","Gun","Knife","No object","Other","Vehicle"];

if(weapon.includes(val)){
  csvFile = "static/racecount2.csv"
}else{
  csvFile = "static/racecount1.csv"
}


console.log(csvFile)

// Parse the Data
d3.csv(csvFile, function(data) {


  console.log("Inside hbar ",data)
  // Add X axis
  var x = d3.scaleLinear()
  .domain([0,d3.max(data, function (d) {return d[val];}) + 20])

    // .domain([0, 100])
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
    .domain(data.map(function(d) { return d.Race; }))
    .padding(.1);
  svg.append("g")
    .call(d3.axisLeft(y))

  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", x(0) )
    .attr("y", function(d) { return y(d.Race); })
    .attr("width", function(d) { return x(d[val]); })
    .attr("height", y.bandwidth() )
    .on("click",function(d, i) {

      console.log("In on click bar", d.Race);

      drawPieChart(d.Race)
      json_dictionary = {state : '', race: d.Race, weapon : ''}


      $.ajax({
               type: "POST",
               contentType: "text/html;charset=utf-8",
               url: "/get_choro_data",
               traditional: "true",
               data: JSON.stringify(json_dictionary),
               dataType: "application/json",
               async : false,
               success: function (data) {
                drawChoropleth()
                console.log(data, " barchart successful");
            },error: function(error){
              drawChoropleth()
              console.log(error, "barchart unsuccessful");
            }
          })


          // resp = ""
          var jqxhr = $.ajax({
                    type: "POST",
                    contentType: "text/html;charset=utf-8",
                    url: "/get_top_pd",
                    traditional: "true",
                    data : JSON.stringify(json_dictionary),
                    dataType: "application/json",
                    async : false

                  }) ;
                  var response = {valid: jqxhr.statusText,  data: jqxhr.responseText};

                  var obj = JSON.parse(response.data)
                  drawMultiLineChart(obj)

  })
    .attr("fill", "#5DADE2")


    // .attr("x", function(d) { return x(d.Country); })
    // .attr("y", function(d) { return y(d.Value); })
    // .attr("width", x.bandwidth())
    // .attr("height", function(d) { return height - y(d.Value); })
    // .attr("fill", "#69b3a2")

})
}
