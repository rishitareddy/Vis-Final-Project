function drawPieChart(val){

  var text = "";
  var width = 150;
  var height = 150;
  var thickness = 40;
  var duration = 750;
  var padding = 10;
  var opacity = 0.8;
  var opacityHover = 1;
  var otherOpacityOnHover = 0.8;
  var tooltipMargin = 13;

  d3.select("#piechart").select("svg").remove();

  d3.select("#piechart").select("div").remove();


  var radius = Math.min(width - padding, height - padding) / 2;
  var color = d3.scaleOrdinal(d3.schemeReds[7]);

  var svg = d3
    .select("#piechart")
    .append("svg")
    .attr("class", "pie")
    .attr("width", width)
    .attr("height", height);

 var race = ["Hispanic", "White", "Black", "Asian"];

// val = "White"
if(race.includes(val)){
  csvFile = "static/Alleged_weapon_data2.csv"
}else{
  csvFile = "static/Alleged_weapon_data.csv"
}

console.log("pie", csvFile);

    d3.csv(csvFile, function(data) {

      console.log("Inside pie chart ", data)

  var g = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(radius);

  var pie = d3
    .pie()
    .value(function(d) {
        return d[val];
    })
    .sort(null);

    console.log("pie is ", pie);

  var path = g
    .selectAll("path")
    .data(pie(data))
    .enter()
    .append("g")
    .append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i))
    .style("opacity", opacity)
    .style("stroke", "white")
    .on("mouseover", function(d) {
      d3.selectAll("path").style("opacity", otherOpacityOnHover);
      d3.select(this).style("opacity", opacityHover);

      let g = d3
        .select("svg")
        .style("cursor", "pointer")
        .append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);

      g.append("text")
        .attr("class", "name-text")
        .text(`${d.data.Alleged_Weapon} (${d.data[val]})`)
        .attr("text-anchor", "middle");

      let text = g.select("text");
      let bbox = text.node().getBBox();
      let padding = 2;
      g.insert("rect", "text")
        .attr("x", bbox.x - padding)
        .attr("y", bbox.y - padding)
        .attr("width", bbox.width + padding * 2)
        .attr("height", bbox.height + padding * 2)
        .style("fill", "white")
        .style("opacity", 0.75);
    })
    // .on("mousemove", function(d) {
    //   let mousePosition = d3.mouse(this);
    //   let x = mousePosition[0] + width / 2;
    //   let y = mousePosition[1] + height / 2 - tooltipMargin;
    //
    //   let text = d3.select(".tooltip text");
    //   let bbox = text.node().getBBox();
    //   if (x - bbox.width / 2 < 0) {
    //     x = bbox.width / 2;
    //   } else if (width - x - bbox.width / 2 < 0) {
    //     x = width - bbox.width / 2;
    //   }
    //
    //   if (y - bbox.height / 2 < 0) {
    //     y = bbox.height + tooltipMargin * 2;
    //   } else if (height - y - bbox.height / 2 < 0) {
    //     y = height - bbox.height / 2;
    //   }
    //
    //   d3.select(".tooltip")
    //     .style("opacity", 1)
    //     .attr("transform", `translate(${x}, ${y})`);
    // })
    .on("mouseout", function(d) {
      d3.select("svg")
        .style("cursor", "none")
        .select(".tooltip")
        .remove();
      d3.selectAll("path").style("opacity", opacity);
    })
    .on("click",function(d, i) {

      console.log("In on click ", d.data.Alleged_Weapon);

      document.getElementById("variableName").innerHTML="Weapon : "+d.data.Alleged_Weapon;

      json_dictionary = {state :'', race: '', weapon : d.data.Alleged_Weapon}

      // resp = ""
      var multiLine = $.ajax({
               type: "POST",
               contentType: "text/html;charset=utf-8",
               url: "/get_top_pd",
               traditional: "true",
               data : JSON.stringify(json_dictionary),
               dataType: "application/json",
               async : false

              }) ;
              var multiLineResponse = {valid: multiLine.statusText,  data: multiLine.responseText};

              var obj = JSON.parse(multiLineResponse.data)
              console.log(obj.multi)
              drawMultiLineChart(obj)


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
          hbarchart(d.data.Alleged_Weapon)

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

           drawPieChart('All')

  })
    .on("touchstart", function(d) {
      d3.select("svg").style("cursor", "none");
    })

    .each(function(d, i) {
      this._current = i;
    });

  let legend = d3
    .select("#piechart")
    .append("div")
    .attr("class", "legend")
    .style("margin-top", "30px");

  let keys = legend
    .selectAll(".key")
    .data(data)
    .enter()
    .append("div")
    .attr("class", "key")
    .style("display", "flex")
    .style("align-items", "center")
    .style("margin-right", "20px");

  keys
    .append("div")
    .attr("class", "symbol")
    .style("height", "10px")
    .style("width", "10px")
    .style("margin", "5px 5px")
    .style("background-color", (d, i) => color(i));

  keys
    .append("div")
    .attr("class", "name")
    .text(d => `${d.Alleged_Weapon} (${d[val]})`);

  keys.exit().remove();
})
}
