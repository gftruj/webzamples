const plotBtn = document.querySelector("#plotBtn")
const plotDiv = document.querySelector("#plot")
plotBtn.addEventListener("click", e => {
  var display = plotDiv.style.display;
  plotDiv.style.display = display === "block" ? "none" : "block"
})

var width = 500,
  height = 500,
  margin = 10;

var svg = d3.select("#plot").append("svg")
  .attr("width", width + 2 * margin)
  .attr("height", height + 2 * margin)

var yScale = d3.scaleLinear().range([height, 0]).domain([-5, 5]);
var xScale = d3.scaleLinear().range([0, width]).domain([-5, 5]);

svg.append("g")
  .attr("transform", "translate(0," + height / 2 + ")")
  .call(d3.axisBottom(xScale));

svg.append("g")
  .attr("transform", "translate(" + width / 2 + ",0)")
  .call(d3.axisLeft(yScale));


var grid_spacing = 0.5;
var vfield = function (d) {
  d.vx = -d.y;
  d.vy = d.x;
  d.magnitude = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
}

var grid_spacing = 0.5
var data = [];

for (var i = -5; i <= 10; i += grid_spacing) {
  for (var j = -5; j <= 10; j += grid_spacing) {
    var pt = {
      x: i,
      y: j
    };
    vfield(pt);
    data.push(pt);
  }
}

var max_magnitude = data.reduce(function (max_, it) {
  return max_ > it.magnitude ? max_ : it.magnitude;
}, 0);

var vscale = d3.scalePow().domain([0, max_magnitude]).range([0, grid_spacing]);

data.forEach(function (p) {

  // we first scale down to a unit vector
  p.vx /= p.magnitude;
  p.vy /= p.magnitude;
  // and now scale it to our own scale
  p.vx *= vscale(p.magnitude);
  p.vy *= vscale(p.magnitude);

  // vector
  svg.append("g")
    .append("path")
    .attr("d", "M" + xScale(0) + " " + yScale(0) + " L" + xScale(p.vx) + " " + yScale(p.vy))
    .attr("stroke", "blue")
    .attr("stroke-width", 1)
    .attr("fill", "none")
    .attr("transform", "translate(" + (xScale(p.x) - xScale(0)) + "," + (yScale(p.y) - yScale(0)) + ")");
  // pinhead
  svg.append("g")
    .append("circle")
    .attr("r", 2)
    .attr("cx", xScale(p.vx))
    .attr("cy", yScale(p.vy))
    .attr("transform", "translate(" + (xScale(p.x) - xScale(0)) + "," + (yScale(p.y) - yScale(0)) + ")");
})

document.querySelector("[foo]").emit("plot-ready", { vector_array: data, mag_max: max_magnitude })

