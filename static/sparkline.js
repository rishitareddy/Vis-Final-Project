function drawSparkline(data, min, max, geography) {

    WIDTH        = 50;
    HEIGHT       = 30;
    MARGIN       = { top: 20, right: 5, bottom: 0, left: 0 };
    INNER_WIDTH  = WIDTH - MARGIN.left - MARGIN.right;
    INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;
    DATA_COUNT   = 8;
    
    x    = d3.scaleLinear().domain([0, DATA_COUNT]).range([0, INNER_WIDTH]);
    
    y    = d3.scaleLinear().domain([min, max]).range([INNER_HEIGHT, 0]);
    
    console.log("Sparklyyyy ", data)
    svg5 = d3.select('#sparklines').append('svg')
      .attr('width', WIDTH)
      .attr('height', HEIGHT)
      .append('g')
        .attr('transform', 'translate(' + MARGIN.left + ',' + MARGIN.top + ')');
    line = d3.line()
      .x((d, i) => x(i))
      .y(d => y(d));
    svg5.append('path').datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#bbb')
      .attr('stroke-width', 1)
      .attr('d', line);
    svg5.append('circle')
      .attr('r', 2)
      .attr('cx', x(0))
      .attr('cy', y(data[0]))
      .attr('fill', 'steelblue');
    svg5.append('circle')
      .attr('r', 2)
      .attr('cx', x(DATA_COUNT - 1))
      .attr('cy', y(data[DATA_COUNT - 1]))
      .attr('fill', 'tomato');

      svg5.append("text")
       .attr('class', 'val')
       .style("font-size", "10px")
       .text(geography)
       .style("fill","#D74E43");
    }