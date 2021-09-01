function hbarchart(val){

console.log("In hbarchart woohoo", val);

d3.select("#horizontalbarchart").select("svg").remove();


var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 275 - margin.left - margin.right,
    height = 230 - margin.top - margin.bottom;

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

var colorScale = d3.scaleOrdinal(d3.schemeReds[4]);

console.log(csvFile)

// Parse the Data
d3.csv(csvFile, function(data) {

  data.forEach(function(d) {
    d.val = +d[val];
  });

 console.log("Inside hbar ",data)
 // Add X axis
 var x = d3.scaleLinear()
 .domain([0,d3.max(data, function (d) {
   console.log(d.val)
   return d.val;}) + 20])
   .range([ 0, width]);
  data.sort(function(a, b) {
    return a[val] - b[val];
  });

  console.log("Inside hbar ",data)

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
    .padding(.3);
  svg.append("g")
    .call(d3.axisLeft(y))

  //Bars
  svg.selectAll("myRect")
    .data(data)
    .enter()
    .append("rect")
    // .attr("x", function(d) {return x(d[val]);} )
    .attr("y", function(d) { return y(d.Race); })
    .attr("width", function(d) { return x(d.val) })
    .attr("height", y.bandwidth() )
    .on("click",function(d, i) {

      console.log("In on click bar", d.Race);

      drawPieChart(d.Race)
      json_dictionary = {state : '', race: d.Race, weapon : ''}

      document.getElementById("variableName").innerHTML="Race : "+d.Race;


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

          var stats = $.ajax({
            type: "POST",
            contentType: "text/html;charset=utf-8",
            url: "/get_death_count",
            traditional: "true",
            data : JSON.stringify(json_dictionary),
            dataType: "application/json",
            async : false

           }) ;
           var statsResponse = {valid: stats.statusText,  data: stats.responseText};

           var obj = JSON.parse(statsResponse.data)
           document.getElementById("totalDeaths").innerHTML= 'Total deaths :' +obj.totalDeaths
           document.getElementById("avoidableDeaths").innerHTML= 'Avoidable deaths : ' +obj.avoidableDeaths

           hbarchart('All')

  })
    // .attr("fill", "#5DADE2")

    .style('fill',function(d,i){ return colorScale(i); })


    // .attr("x", function(d) { return x(d.Country); })
    // .attr("y", function(d) { return y(d.Value); })
    // .attr("width", x.bandwidth())
    // .attr("height", function(d) { return height - y(d.Value); })
    // .attr("fill", "#69b3a2")

})
}
