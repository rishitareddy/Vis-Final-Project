function pcp(){

var states = "";
$.ajax({
  type: "GET",
  url: "/most_common_states",
  traditional: "true",
  dataType: "json",
  async: false,
  success: function (data) {
    states = Object.keys(data);
  },
  error: function (error) {
    console.log("parallel coordinates common states error ", error);
  },
});

d3.select("#mypcp").select("svg").remove();


// var margin = 0;
// var margin_bottom = 100;
var margin = { top: 30, right: 10, bottom: 100, left: 0 },
  width = 550 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;

var svg7 = d3
  .select("#mypcp")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

console.log("In here");

var x = d3.scalePoint().range([0, width]).padding(1),
  y = {},
  dragging = {};

var line = d3.line(),
  axis = d3.axisRight(),
  background,
  foreground;

var Categorical = ["Geography", "Encounter_Type", "Victim_race", "Year"];

var myArray = [
  "Geography",
  "State",
  "Victim_age",
  "Victim_race",
  "Encounter_Type",
];

// var myArray = ['Geography', 'Victim_age', 'Victim_race', 'State'];

d3.csv("static/PFDataset3.csv", function (data) {
  // d3.csv("../templates/PFDataset2.csv", function(data) {

  x.domain(
    (dimensions = d3.keys(data[0]).filter(function (d) {
      if (d == "State") {
        y[d] = d3.scalePoint().domain(states).range([height, 0]);
      }
      // else if(d == 'Year'){
      //   var parseDate = d3.timeParse("%Y");
      //   y[d] = d3.scaleTime().domain([parseDate(new Date("2013")), parseDate(new Date("2021"))]).range([height, 0])
      // }
      else if (Categorical.includes(d)) {
        y[d] = d3
          .scalePoint()
          .domain(data.map((item) => item[d]))
          .range([height, 0]);
      } else {
        y[d] = d3
          .scaleLinear()
          .domain(
            d3.extent(data, function (p) {
              return +p[d];
            })
          )
          .range([height, 0]);
      }
      return myArray.includes(d) && y[d];
    }))
  );

  var green_to_blue = d3
    .scaleLinear()
    .domain([9, 50])
    .range(["#FEEBE6", "#D74E43"])
    .interpolate(d3.interpolateLab);

  var color = function (d) {
    return green_to_blue(d["Victim_age"]);
  };

  background = svg7
    .append("g")
    .attr("class", "background")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", path);

  foreground = svg7
    .append("g")
    .attr("class", "foreground")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path")
    .attr("d", path)
    .style("stroke", color)
    // .style("stroke", function(d,i) {
    // var color = 'green';
    // if(labels[i] == 1){
    //   color = 'blue';
    // }
    // else if (labels[i] == 2) {
    //   color = 'red';
    // }
    // return color; })
    .style("opacity", 0.2);

  var g = svg7
    .selectAll(".dimension")
    .data(dimensions)
    .enter()
    .append("g")
    .attr("class", "dimension")
    .attr("transform", function (d) {
      return "translate(" + x(d) + ")";
    })
    .call(
      d3
        .drag()
        .on("start", function (d) {
          dragging[d] = x(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function (d) {
          dragging[d] = Math.min(width, Math.max(0, d3.event.x));
          foreground.attr("d", path);
          dimensions.sort(function (a, b) {
            return position(a) - position(b);
          });
          x.domain(dimensions);
          g.attr("transform", function (d) {
            return "translate(" + position(d) + ")";
          });
        })
        .on("end", function (d) {
          delete dragging[d];
          transition(d3.select(this)).attr(
            "transform",
            "translate(" + x(d) + ")"
          );
          transition(foreground).attr("d", path);
          background
            .attr("d", path)
            .transition()
            .delay(500)
            .duration(0)
            .attr("visibility", null);
        })
    );

  g.append("g")
    .attr("class", "axis")
    .each(function (d) {
      d3.select(this).call(axis.scale(y[d]));
    })
    .append("text")
    .style("text-anchor", "middle")
    .attr("y", -9)
    .text(function (d) {
      return d;
    })
    .style("fill", "black");

  g.append("g")
    .attr("class", "brush")
    .each(function (d) {
      d3.select(this).call(
        (y[d].brush = d3
          .brushY()
          .extent([
            [-8, y[d].range()[1]],
            [8, y[d].range()[0]],
          ])
          .on("start", brushstart)
          .on("brush", brush))
      );
    })
    .selectAll("rect")
    .attr("x", -8)
    .attr("width", 16);
});

function position(d) {
  var v = dragging[d];
  return v == null ? x(d) : v;
}

function transition(g) {
  return g.transition().duration(500);
}

function path(d) {
  return line(
    dimensions.map(function (p) {
      return [position(p), y[p](d[p])];
    })
  );
}

function brushstart() {
  d3.event.sourceEvent.stopPropagation();
}

function brush() {
  const actives = [];
  svg7
    .selectAll(".brush")
    .filter(function (d) {
      return d3.brushSelection(this);
    })
    .each(function (d) {
      actives.push({
        dimension: d,
        extent: d3.brushSelection(this),
      });
      console.log(d);
    });
  foreground.style("display", function (d) {
    return actives.every(function (active) {
      const dim = active.dimension;
      return (
        active.extent[0] <= y[dim](d[dim]) && y[dim](d[dim]) <= active.extent[1]
      );
    })
      ? null
      : "none";
  });

  console.log(actives);
}
}