import { Injectable } from '@angular/core';
// import { ApiEnv } from '../utils';
// import { HandelAPIsRequestService } from './handel-apis-request.service';
// import { AuthenticationService } from './authentication.service';
import {retry, catchError, tap, map } from 'rxjs/operators';
import { HttpClient, HttpEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';



import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import * as D3 from 'd3';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import { POPULATION } from '../population';

@Injectable({
  providedIn: 'root'
})
export class DonutChartService {

  title = 'Donut Chart';

  private width: number;
  private height: number;

  private svg: any;     // TODO replace all `any` by the right type

  private radius: number;

  private arc: any;
  private pie: any;
  private color: any;

  private g: any;

  constructor() {}

  // ngOnInit() {
      // this.initSvg();
      // this.drawChart(POPULATION, this.svg);
  // }

  // public initSvg() {
  //     this.svg = d3.select('svg');

  //     this.width = +this.svg.attr('width');
  //     this.height = +this.svg.attr('height');
  //     this.radius = Math.min(this.width, this.height) / 2;

  //     this.color = d3Scale.scaleOrdinal()
  //         .range(['#98abc5', '#8a89a6', '#7b6888', '#6b486b', '#a05d56', '#d0743c', '#ff8c00']);

  //     this.arc = d3Shape.arc()
  //         .outerRadius(this.radius - 10)
  //         .innerRadius(this.radius - 70);

  //     this.pie = d3Shape.pie()
  //         .sort(null)
  //         .value((d: any) => d.population);

  //     this.svg = d3.select('svg')
  //         .append('g')
  //         .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
  // }

  public textRadius(d, radius) {
    const PI = Math.PI
    const angle90 = Math.PI * 90 / 180
    let angleBand = (d.endAngle - d.startAngle)/2;
    let angle = (d.startAngle + angleBand) - angle90;
    console.log(angle)
    let x = radius * Math.cos(angle);
    let y = radius * Math.sin(angle);
    return [x, y]; 
  }

  public drawChart(data: any[], svg, title, value, fontSize) {

    // this.svg = d3.select('svg');

    this.width = +svg.attr('width');
    this.height = +svg.attr('height');
    this.radius = Math.min(this.width, this.height) / 2;

    this.color = D3.scaleOrdinal(D3.schemeCategory10)


      this.arc = d3Shape.arc()
          .outerRadius(this.radius - 10)
          .innerRadius(this.radius - 70);

      this.pie = d3Shape.pie()
          .sort(null)
          .value((d: any) => d[value]);

      // svg = d3.select('svg')
      //     .append('g')
      //     .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');


      let g = svg.selectAll('.arc')
          .data(this.pie(data))
          .enter().append('g')
          .attr('class', 'arc');

      g.append('path')
          .attr('d', this.arc)
          .style('fill', (d,i) => this.color(i))
          .style('opacity', 0.7);

      g.append('text')
          .attr('transform', (d) => {console.log(this.textRadius(d, this.radius)); return 'translate(' +  this.textRadius(d, this.radius)  + ')'})
          .attr('text-anchor',"middle")
          .attr('font-size', fontSize + 'px')
          .text(d => d.data[title]);
  }

}