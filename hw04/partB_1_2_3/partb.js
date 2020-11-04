/*
 * [simple d3.js bar chart](https://nick3499.medium.com/d3-scaleband-rangeround-padding-ordinal-scale-with-range-bands-including-padding-f4af1e3c96ab)
 */
var state_population_tsv_url = 'https://raw.githubusercontent.com/datduyng/cs411-data-modeling/master/hw04/assignment4_dataset/state_population_gdp.tsv';

// PART B_1
create_barchart(state_population_tsv_url, '.partb-population-chart', 'state', 'population');

// PART B_2
create_barchart(state_population_tsv_url, '.partb-gdp-chart', 'state', 'gdp');

// PART B_3
scatter_plot_gdb_population();

function create_barchart(url, selector, xfield, yfield) {

    // create sort asc and desc button  
    $(selector).append(`
            <button class='sort-asc' >Sort asc</button>
            <button class='sort-desc'>Sort desc</button>
    `);

    let margin = { top: 40, right: 20, bottom: 120, left: 70 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    let x = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    let y = d3.scale.linear()
        .range([height, 0]);

    let xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    let yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    let tip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
            return `<strong>${yfield}</strong> <span style='color:red'>` + d[yfield] + "</span>";
        })

    let svg = d3.select(selector).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.call(tip);
    d3.tsv(url, type, function(error, data) {
        if (error) {
            throw error;
        }
        x.domain(d3.range(data.length));
        y.domain([0, d3.max(data, d => d[yfield])]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .selectAll("text")
            .text(i => data[i][xfield])
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", "-.55em")
            .attr("transform", "rotate(-90)");

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(yfield);

        let groups = svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "bar")
            .attr("transform", (d, i) => "translate(" + x(i) + ",0)")
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide)

        let rects = groups.append('rect')
            .attr("x", 0)
            .attr("y", d => height)
            .attr("width", x.rangeBand())
            .attr("height", 0)

        rects.transition()
            .delay(function(d, i) {
                return i * 10;
            })
            .duration(100)
            .attr("y", function(d) {
                return y(d[yfield]);
            })
            .attr("height", function(d) {
                return height - y(d[yfield]);
            });

        d3.select(`${selector} .sort-asc`)
            .on("click", function() {
                let newSortedData = [];
                groups.sort(function(g1, g2) {
                        return d3.ascending(g1[yfield], g2[yfield]);
                    })
                    .each((d, i) => {
                        newSortedData.push({
                            [xfield]: d[xfield],
                            [yfield]: d[yfield],
                            index: i
                        })
                    })
                    .transition()
                    .delay((d, i) => i * 50)
                    .duration(1000)
                    .attr("transform", (d, i) => {
                        // console.log('data', d, i);
                        return "translate(" + x(i) + ",0)";
                    })
                    .select('g.x.axis')
                    .text((d, i) => {
                        console.log('testing', d, i);
                    })

                x.domain(newSortedData.map(function(d) {
                    return d.index;
                }))

                svg.selectAll('g.x.axis')
                    .call(xAxis)
                    .selectAll("text")
                    .text(i => newSortedData[i][xfield])
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", "-.55em")
                    .attr("transform", "rotate(-90)");
            });


        d3.select(`${selector} .sort-desc`)
            .on("click", function() {
                let newSortedData = [];
                groups.sort(function(g1, g2) {
                        return d3.descending(g1[yfield], g2[yfield]);
                    })
                    .each((d, i) => {
                        newSortedData.push({
                            [xfield]: d[xfield],
                            [yfield]: d[yfield],
                            index: i
                        })
                    })
                    .transition()
                    .delay((d, i) => i * 50)
                    .duration(1000)
                    .attr("transform", (d, i) => {
                        // console.log('data', d, i);
                        return "translate(" + x(i) + ",0)";
                    })
                    .select('g.x.axis')
                    .text((d, i) => {
                        console.log('testing', d, i);
                    })

                x.domain(newSortedData.map(function(d) {
                    return d.index;
                }))

                svg.selectAll('g.x.axis')
                    .call(xAxis)
                    .selectAll("text")
                    .text(i => newSortedData[i][xfield])
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", "-.55em")
                    .attr("transform", "rotate(-90)");

            });
    });

    function type(d) {
        d[yfield] = +d[yfield];
        return d;
    }
}


function scatter_plot_gdb_population() {
    let margin = { top: 40, right: 20, bottom: 120, left: 70 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // setup x 
    let xValue = (d) => d.population, // data -> value
        xScale = d3.scale.linear().range([0, width]), // value -> display
        xMap = (d) => xScale(xValue(d)), // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    // setup y
    let yValue = (d) => d.gdp, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = (d) => yScale(yValue(d)), // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    let svg = d3.select(".partb-pop-gdp-scatter").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    let tooltip = d3.select(".partb-pop-gdp-scatter").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    d3.tsv(state_population_tsv_url, function(error, data) {
        if (error) { throw error; }
        // change string (from CSV) into number format
        data.forEach(function(d) {
            d.population = +d.population;
            d.gdp = +d.gdp;
        });

        // don't want dots overlapping axis, so add in buffer(+/- 1) to data domain
        xScale.domain([d3.min(data, xValue) - 1, d3.max(data, xValue) + 1]);
        yScale.domain([d3.min(data, yValue) - 1, d3.max(data, yValue) + 1]);


        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text("Population");
        // y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("GDP");

        // draw dots
        svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            // .style('fill', 'steelblue')
            .attr("r", 3.5)
            .attr("cx", xMap)
            .attr("cy", yMap)
            .on("mouseover", function(d) {
                tooltip.transition()
                    .duration(200)
                    .style("fill", 'orange')
                    .style("opacity", .9);
                tooltip.html(`${d.state}: ${(d.gdp/d.population).toFixed(2)}`)
                    .style("left", (d3.event.pageX - 10) + "px")
                    .style("top", (d3.event.pageY - 15) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.transition()
                    .duration(500)
                    .style("opacity", 0);
            });

    });
}