/*
 * [simple d3.js bar chart](https://nick3499.medium.com/d3-scaleband-rangeround-padding-ordinal-scale-with-range-bands-including-padding-f4af1e3c96ab)
 */
var state_population_tsv_url = 'https://raw.githubusercontent.com/datduyng/cs411-data-modeling/master/hw04/assignment4_dataset/state_population_gdp.tsv';

create_barchart(state_population_tsv_url, '.partb-population-chart', 'state', 'population');
create_barchart(state_population_tsv_url, '.partb-gdp-chart', 'state', 'gdp');

function create_barchart(url, selector, xfield, yfield) {

    // create sort asc and desc button  
    $(selector).append(`
            <button class='sort-asc' >Sort asc</button>
            <button class='sort-desc'>Sort desc</button>
    `);

    let margin = { top: 40, right: 20, bottom: 120, left: 70 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;





    d3.tsv(url, type, function(error, data) {
        if (error) {
            throw error;
        }

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

        // x.domain(data.map(d => d[xfield]));

        x.domain(d3.range(data.length));
        y.domain([0, d3.max(data, d => d[yfield])]);

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