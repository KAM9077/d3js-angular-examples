import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'app-chart-test',
  templateUrl: './chart-test.component.html',
  styleUrls: ['./chart-test.component.css']
})
export class ChartTestComponent implements OnInit {

  private data = [
    {
      name: "USA",
      values: [
        {date: "2000", price: "100"},
        {date: "2001", price: "110"},
        {date: "2002", price: "145"},
        {date: "2003", price: "241"},
        {date: "2004", price: "101"},
        {date: "2005", price: "90"},
        {date: "2006", price: "10"},
        {date: "2007", price: "35"},
        {date: "2008", price: "21"},
        {date: "2009", price: "201"}
      ]
    },
    {
      name: "Canada",
      values: [
        {date: "2000", price: "200"},
        {date: "2001", price: "120"},
        {date: "2002", price: "33"},
        {date: "2003", price: "21"},
        {date: "2004", price: "51"},
        {date: "2005", price: "190"},
        {date: "2006", price: "120"},
        {date: "2007", price: "85"},
        {date: "2008", price: "221"},
        {date: "2009", price: "101"}
      ]
    },
    {
      name: "Maxico",
      values: [
        {date: "2000", price: "50"},
        {date: "2001", price: "10"},
        {date: "2002", price: "5"},
        {date: "2003", price: "71"},
        {date: "2004", price: "20"},
        {date: "2005", price: "9"},
        {date: "2006", price: "220"},
        {date: "2007", price: "235"},
        {date: "2008", price: "61"},
        {date: "2009", price: "10"}
      ]
    }
  ];

  private width = 500;
  private height = 300;
  private margin = 50;
  private duration = 250;
  private svg: any;
  private line: any;
  private lines: any;
  private parseDate: any;
  private lineOpacity = "0.25";
  private lineOpacityHover = "0.85";
  private otherLinesOpacityHover = "0.1";
  private lineStroke = "1.5px";
  private lineStrokeHover = "2.5px";
  private circleOpacity = '0.85';
  private circleOpacityOnLineHover = "0.25"
  private circleRadius = 3;
  private circleRadiusHover = 6;

  /* Scale */
  private xScale:any;
  private yScale:any;
  private color:any;

  constructor() { }

  ngOnInit() {

      /* Format Data */
      this.drowChart()
  }
  
  /* Add SVG */

  
  
  /* Add line into SVG */

public drowChart(){

this.parseDate = d3.timeParse("%Y");
  
  this.data.forEach((d) =>{ 
    d.values.forEach((d) =>{
      d.date = this.parseDate(d.date);
      d.price = + d.price;    
    });
  });


  /* Scale */
  this.xScale = d3.scaleTime()
    .domain(d3.extent(this.data[0].values, d => d.date))
    .range([0, (this.width - this.margin)]);
  
  this.yScale = d3.scaleLinear()
    .domain([0, d3.max(this.data[0].values, d => d.price)])
    .range([(this.height - this.margin), 0]);
  
  this.color = d3.scaleOrdinal(d3.schemeCategory10);

  this.svg = d3.select("#chart").append("svg")
  .attr("width", (this.width + this.margin)+"px")
  .attr("height", (this.height + this.margin)+"px")
  .append('g')
  .attr("transform", `translate(${this.margin}, ${this.margin})`);

  this.line = d3.line()
    .x(d => this.xScale(d.date))
    .y(d => this.yScale(d.price));
  
  this.lines = this.svg.append('g')
    .attr('class', 'lines');
  
  this.lines.selectAll('.line-group')
    .data(this.data).enter()
    .append('g')
    .attr('class', 'line-group')  
    .on("mouseover", (d, i) => {
      this.svg.append("text")
          .attr("class", "title-text")
          .style("fill", this.color(i))        
          .text(d.name)
          .attr("text-anchor", "middle")
          .attr("x", (this.width - this.margin)/2)
          .attr("y", 5);
      })
    .on("mouseout", (d) => {
      this.svg.select(".title-text").remove();
      })
    .append('path')
    .attr('class', 'line')  
    .attr('d', d => this.line(d.values))
    .style("fill", 'none')
    .style('stroke', (d, i) => this.color(i))
    .style('opacity', this.lineOpacity)
    .on("mouseover", (d) => {
        d3.selectAll('.line')
            .style('opacity', this.otherLinesOpacityHover);
        d3.selectAll('.circle')
            .style('opacity', this.circleOpacityOnLineHover);
        d3.select(this)
          .style('opacity', this.lineOpacityHover)
          .style("stroke-width", this.lineStrokeHover)
          .style("cursor", "pointer");
      })
    .on("mouseout", (d) => {
        d3.selectAll(".line")
            .style('opacity', this.lineOpacity);
        d3.selectAll('.circle')
            .style('opacity', this.circleOpacity);
        d3.select(this)
          .style("stroke-width", this.lineStroke)
          .style("cursor", "none");
      });
  
  
  /* Add circles in the line */
  this.lines.selectAll("circle-group")
    .data(this.data).enter()
    .append("g")
    .style("fill", (d, i) => this.color(i))
    .selectAll("circle")
    .data(d => d.values).enter()
    .append("g")
    .attr("class", "circle")  
    .on("mouseover", (d) => {
        d3.select(this)     
          .style("cursor", "pointer")
          .append("text")
          .attr("class", "text")
          .text(`${d.price}`)
          .attr("x", d => this.xScale(d.date) + 5)
          .attr("y", d => this.yScale(d.price) - 10);
      })
    .on("mouseout", (d) => {
        d3.select(this)
          .style("cursor", "none")  
          .transition()
          .duration(this.duration)
          .selectAll(".text").remove();
      })
    .append("circle")
    .attr("cx", d => this.xScale(d.date))
    .attr("cy", d => this.yScale(d.price))
    .attr("r", this.circleRadius)
    .style('opacity', this.circleOpacity)
    .on("mouseover", (d) => {
          d3.select(this)
            .transition()
            .duration(this.duration)
            .attr("r", this.circleRadiusHover);
        })
      .on("mouseout", (d) => {
          d3.select(this) 
            .transition()
            .duration(this.duration)
            .attr("r", this.circleRadius);  
        });
  
  
  /* Add Axis into SVG */
  var xAxis = d3.axisBottom(this.xScale).ticks(5);
  var yAxis = d3.axisLeft(this.yScale).ticks(5);
  
  this.svg.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${(this.height - this.margin)})`)
    .call(xAxis);
  
    this.svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append('text')
    .attr("y", 15)
    .attr("transform", "rotate(-90)")
    .attr("fill", "#000")
    .text("Total values");

}


}

