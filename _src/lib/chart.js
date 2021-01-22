const width = 500;
const height = 500;
var nodes = d3.range(50).map(function() { return {r: Math.random() * 12 + 4}; });
var root = nodes[0];
var color = d3.schemeCategory10;

root.radius = 0;
root.fixed = true;
root.fx = 0;
root.fy = 0;

var force = d3.forceSimulation()
  .velocityDecay(0.2)
  .force("x", d3.forceX(width / 2).strength(0.05))
  .force("y", d3.forceY(height / 2).strength(0.05))
  .force("collide", d3.forceCollide().radius(function(d){
    if(d === root){
      return Math.random() * 50 + 10;
    }
    return d.r + 0.5;
  }).iterations(5))
  .nodes(nodes)
  .on("tick", ticked);

var svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

svg.selectAll("circle")
  .data(nodes.slice(1))
  .enter().append("circle")
  .attr("r", function(d) { return d.r; })
  .style("fill", function(d, i) { return color[i % 3]; });

function ticked(e) {
  svg.selectAll("circle")
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; });
};

svg.on("mousemove", function() {
    var p1 = d3.mouse(this);
    root.fx = p1[0];
    root.fy = p1[1];
    force.alphaTarget(0.3).restart();
});