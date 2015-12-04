/**
 * Created by sayanh on 12/3/15.
 */

import d3 from 'd3'
import React from 'react'
import ReactFauxDOM from 'react-faux-dom'
import * as sankey from './util/sankey'

class Sankey extends React.Component {
  static propTypes = {
    //width: React.PropTypes.number,
    //height: React.PropTypes.number,
    title: React.PropTypes.string
    //data: React.PropTypes.array.isRequired,
  }

  render() {
    var units = "Widgets";

    var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 100 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    var formatNumber = d3.format(",.0f"),    // zero decimal places
        format = function (d) {
          return formatNumber(d) + " " + units;
        },
        color = d3.scale.category20();

// append the svg canvas to the page
//    var svg = ReactFauxDOM.createElement('svg');
    var someDiv = d3.select(ReactFauxDOM.createElement('svg'))
        //        var svg = d3.select("#content").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
    var sankey = d3.sankey()
        .nodeWidth(36)
        .nodePadding(40)
        .size([width, height]);

    var path = sankey.link();

// load the data
    var graph = {
      "nodes": [
        {
          "name": "Req 2"
        },
        {
          "name": "Req 3"
        },
        {
          "name": "Req 3c"
        },
        {
          "name": "Req 3b"
        },
        {
          "name": "System for managing customers"
        },
        {
          "name": "Req 3a"
        },
        {
          "name": "Req 1"
        },
        {
          "name": "Decision 3a"
        },
        {
          "name": "Cloud Services"
        },
        {
          "name": "Decision 2"
        },
        {
          "name": "Decision 3"
        },
        {
          "name": "Application Server"
        },
        {
          "name": "Architecture 3"
        },
        {
          "name": "Architecture 1"
        },
        {
          "name": "Architecture 2"
        }
      ],
      "links": [
        {
          "source": "Decision 3a",
          "target": "Req 3c",
          "value": 100
        },
        {
          "source": "Cloud Services",
          "target": "Req 1",
          "value": 100
        },
        {
          "source": "Decision 2",
          "target": "Req 2",
          "value": 100
        },
        {
          "source": "Decision 3",
          "target": "Req 3a",
          "value": 33.333333333333336
        },
        {
          "source": "Decision 3",
          "target": "Req 3",
          "value": 33.333333333333336
        },
        {
          "source": "Decision 3",
          "target": "Req 3b",
          "value": 33.333333333333336
        },
        {
          "source": "Architecture 3",
          "target": "Decision 3",
          "value": 50
        },
        {
          "source": "Architecture 3",
          "target": "Decision 3a",
          "value": 50
        },
        {
          "source": "Architecture 1",
          "target": "Cloud Services",
          "value": 100
        },
        {
          "source": "Architecture 2",
          "target": "Decision 2",
          "value": 100
        }
      ]
    };
    var nodeMap = {};
    graph.nodes.forEach(function (x) {
      nodeMap[x.name] = x;
    });
    graph.links = graph.links.map(function (x) {
      return {
        source: nodeMap[x.source],
        target: nodeMap[x.target],
        value: x.value
      };
    });

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

// add in the links
    var link = someDiv.append("g").selectAll(".link")
        .data(graph.links)
        .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function (d) {
          return Math.max(1, d.dy);
        })
        .sort(function (a, b) {
          return b.dy - a.dy;
        });

// add the link titles
    link.append("title")
        .text(function (d) {
          return d.source.name + " → " +
              d.target.name + "\n" + format(d.value);
        });

// add in the nodes
    var node = someDiv.append("g").selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ")";
        });
        //.call(d3.behavior.drag()
        //    .origin(function (d) {
        //      return d;
        //    })
        //    .on("dragstart", function () {
        //      this.parentNode.appendChild(this);
        //    })
        //    .on("drag", dragmove));

// add the rectangles for the nodes
    node.append("rect")
        .attr("height", function (d) {
          return d.dy;
        })
        .attr("width", sankey.nodeWidth())
        .style("fill", function (d) {
          return d.color = color(d.name.replace(/ .*/, ""));
        })
        .style("stroke", function (d) {
          return d3.rgb(d.color).darker(2);
        })
        .append("title")
        .text(function (d) {
          return d.name + "\n" + format(d.value);
        });

// add in the title for the nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function (d) {
          return d.dy / 2;
        })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function (d) {
          return d.name;
        })
        .filter(function (d) {
          return d.x < width / 2;
        })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    //the function for moving the nodes
    //     function dragmove(d) {
    //       d3.select(this).attr("transform",
    //           "translate(" + (
    //               d.x = Math.max(0, Math.min(width - d.dx, d3.event.x))
    //           )
    //           + "," + (
    //               d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))
    //           ) + ")");
    //       sankey.relayout();
    //       link.attr("d", path);
    //     }


    return (
        <div id="chart">
          <svg width="2000" height="1200">
            {someDiv.node().toReact()}
          </svg>
        </div>
    );

  }
}


export default Sankey
