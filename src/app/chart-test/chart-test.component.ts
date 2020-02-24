import {Component, OnInit, ChangeDetectorRef, ViewEncapsulation, EventEmitter, Output} from '@angular/core';;
import {HttpClient, HttpEventType, HttpResponse} from '@angular/common/http';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subject, Observable, of, concat} from 'rxjs';
import {Location} from '@angular/common';
import {MatSnackBar} from '@angular/material';
import {takeUntil, first} from 'rxjs/operators';

import * as D3 from 'd3';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';
import * as d3Zoom from 'd3-zoom';
import * as d3Brush from 'd3-brush';
import * as d3Array from 'd3-array';
import * as d3TimeFormat from 'd3-time-format';
import { DonutChartService, POPULATION } from '../shared';

import { SP500 } from '../shared';
import { Generator } from '../shared';
import { DataService } from '../shared';

interface Stock {
    date: any;
    price: any;
}

@Component({
  selector: 'app-chart-test',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './chart-test.component.html',
  styleUrls: ['./chart-test.component.css']
})

export class ChartTestComponent implements OnInit {

    title = 'Brush & Zoom';

    chartForm: FormGroup;
    private margin: any;
    private margin2: any;

    private width: number;
    private height: number;
    private height2: number;


    private svg: any;     // TODO replace all `any` by the right type
    private drow: any;     // TODO replace all `any` by the right type

    private x: any;
    private x2: any;
    private y: any;
    private y2: any;

    private xAxis: any;
    private xAxis2: any;
    private yAxis: any;

    private xScale:any;
    private color:any;

    private context: any;
    private brush: any;
    private zoom: any;
    private area: any;
    private area2: any;
    private line: any;
    private line2: any;
    private lines: any;
    private focus: any;
    private brushWidth: any;
    public dropDownData: any = ['Year', 'Month', 'Week','Day'];
    public chartTypes: any = ['Bars', 'Lines',];
    public chartType: string = 'Bars';

    private parseYearDate = d3TimeFormat.timeParse('%Y');
    private parseMonthDate = d3TimeFormat.timeParse('%B %Y');
    private parseDayDate = d3TimeFormat.timeParse('%d %B %Y');
    private parseDate = d3TimeFormat.timeParse('%b %d %Y');

    private data: any =  this.getData();
    private currentData: any;

    constructor(
        public generator : Generator,
        public formBuilder : FormBuilder,
        public dataService : DataService,
        public donutChartService : DonutChartService
        ) {
    }

    ngOnInit() {

        this.chartForm = this.formBuilder.group({
            type: [''],
        });

        // console.log(this.generator.mapJson(['01/01/2005','01/01/2010'],[100, 2000]));
        this.initMargins();
        this.initSvg();
        this.getData();
        // this.mapDate();
        // this.drwoPermanent(this.mapDate());
        // this.drawChart(this.mapDate());
    }

    public getData(){
        this.dataService.getData().subscribe(data =>{
            let obj;
            obj= [{
            values : data,
            child : data,
            name: "chart"
            }]
            // console.log(obj);
            this.data = obj;
            this.currentData = obj;
            this.drwoPermanent(obj);
            this.drawChart(obj);
        })
    }

    public drawNode(d){
        this.currentData = d;
        this.drwoPermanent(d);
        this.drawChart(d);
    }

    public selectedDataType($event){
        console.log($event)
    }

    public selectedChartType(type){
        console.log(this.focus)
        this.chartType = type;
        // this.mapDate();
        this.drawNode(this.currentData);
    }

    private mapDate(){
        // this.data = []
        // let obj = this.generator.mapJson(['01/01/2005','02/05/2005'],[100, 500]);
        // this.data = [obj[49].child[0]];
        // console.log(this.data, 'sssssssssssssssss')
        return this.data;

    }

    private initMargins() {
        this.margin = {top: 10, right: 5, bottom: 110, left: 40};
        this.margin2 = {top: 430, right: 20, bottom: 30, left: 40, devided: 10 };
        this.brushWidth = 50;
    }

    // private parseData(data: any[]): Stock[] {
    //     return data.map(v => <Stock>{date: this.parseDate(v.date), price: v.price});
    // }

    private initSvg() {
        this.svg = d3.select('svg');
        this.drow = this.svg.append('g')
                        .attr('class', 'drow')
                        .attr('transform', 'translate(' + this.margin.left + ',' + (0) + ')');

        this.width = +this.svg.attr('width') * 0.6;
        this.height = +this.svg.attr('height') * 0.6;
        this.brushWidth = this.height/8; 
        this.height2 = this.height + this.brushWidth;

        this.x = d3Scale.scaleTime().range([0, this.width - this.margin.right]);  // set the scale dimention that will be appeared depends on the start and the end ( [0, this.width] )
        this.x2 = d3Scale.scaleTime().range([0, this.width - this.margin.right]); // set the scale dimention that will be appeared depends on the start and the end ( [0, this.width] ) its for brush
        this.y = d3Scale.scaleLinear().range([this.height, 0]); // set the scale dimention that will be appeared depends on the start and the end ( [0, this.height] )
        this.y2 = d3Scale.scaleLinear().range([this.brushWidth, 0]); // set the scale dimention that will be appeared depends on the start and the end ( [0, this.height2] ) its for brush

        this.xAxis = d3Axis.axisBottom(this.x); 
        this.xAxis2 = d3Axis.axisBottom(this.x2);
        this.yAxis = d3Axis.axisLeft(this.y);

// console.log(this.height)
// console.log(this.x2)

        this.xScale = D3.scaleTime()
        .domain(D3.extent([2000,2001,2002], d => d))
        .range([0, (this.width - this.margin.right)]);

        this.brush = d3Brush.brushX()
            .extent([[0, 0], [this.width - this.margin.right, this.brushWidth]])
            .on('brush end', this.brushed.bind(this));

        this.zoom = d3Zoom.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [this.width, this.height]])
            .extent([[0, 0], [this.width, this.height]])
            .on('zoom', this.zoomed.bind(this));

        this.line = D3.line()
        .curve(d3Shape.curveMonotoneX)
        .x(d => this.x(d.data.date))
        .y(d => this.y(d.data.price));            

        this.line2 = D3.line()
        .curve(d3Shape.curveMonotoneX)
        .x(d => this.x(d.data.date))
        .y(d => this.y2(d.data.price));            

        this.area = d3Shape.area()
            .curve(d3Shape.curveMonotoneX)
            .x((d: any) => this.x(d.data.date))
            .y0(this.height)
            .y1((d: any) => this.y(d.data.price));

        this.area2 = d3Shape.area()
            .curve(d3Shape.curveMonotoneX)
            .x((d: any) => this.x2(d.data.date))
            .y0(this.brushWidth)
            .y1((d: any) => this.y2(d.data.price));

        this.drow.append('defs').append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', this.width - this.margin.right)
            .attr('height', this.height);         

        this.focus = this.drow.append('g')
            .attr('class', 'focus')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.context = this.drow.append('g')
            .attr('class', 'context')
            .attr('transform', 'translate(' + this.margin2.left + ',' + (this.height2 + this.margin2.devided) + ')');

        this.focus
                .append('rect')
                .attr('class', 'zoom')
                .attr('width', this.width)
                .attr('height', this.height)
                .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
                .on('contextmenu', () => {
                    // console.log(this.focus.select('.bars')._groups[0][0].__data__);
                    this.focus.select('.bars')._groups[0][0].__data__.parent ? 
                    this.drawNode([this.focus.select('.bars')._groups[0][0].__data__.parent]) : null;
                    // this.focus.select('.bars')
                })
                .call(this.zoom);            
    }

    private brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
        let s = d3.event.selection || this.x2.range();
        this.x.domain(s.map(this.x2.invert, this.x2));
        this.xScale.domain(s.map(this.x2.invert, this.x2));

        if(this.chartType == 'Bars'){
            this.focus.selectAll(".zoom-bars")
                  .attr("x", (d) => this.x(d.data.date));
        }else{
            this.focus.selectAll('.zoom-lines').attr('d', d => this.line(d.child));
        };

        this.focus.select('.axis--x').call(this.xAxis); // drow the axis
        this.drow.select('.zoom').call(this.zoom.transform, d3Zoom.zoomIdentity
            .scale(this.width / (s[1] - s[0]))
            .translate(-s[0], 0));
    }

    private zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
        let t = d3.event.transform;

        this.x.domain(t.rescaleX(this.x2).domain());
        this.xScale.domain(t.rescaleX(this.x2).domain());

        if(this.chartType == 'Bars'){
            this.focus.selectAll(".zoom-bars")
                  .attr("x", (d) => this.x(d.data.date))
                  .attr('width', 5 * t.k);
        }else{
            this.focus.selectAll('.zoom-lines').attr('d', d => this.line(d.child));
        };

        this.focus.select('.axis--x').call(this.xAxis); // drow the axis
        this.context.select('.brush').call(this.brush.move, this.x.range().map(t.invertX, t));
    }

    private drawChart(data: any) {
        // if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
        // let t = d3.event.transform;
        // console.log(t)
// data.sort((a, b) => b.date - a.date)

        this.x2.domain(this.x.domain());
        this.y2.domain(this.y.domain());

        if(this.chartType == 'Lines'){

            this.focus.selectAll('.bars').remove();
            this.context.selectAll('.bars').remove();

            this.focus.selectAll('.line')
            .data(data).enter()
            .append('g')
            .attr('class', 'line-group')  
            // .on("mouseover", (d, i) => {
            // this.drow.append("text")
            //     .attr("class", "title-text")
            //     .style("fill", this.color(i))        
            //     .text(d.name)
            //     .attr("text-anchor", "middle")
            //     .attr("x", (this.width - this.margin.top)/2)
            //     .attr("y", 5);
            // })
            .append('path')
            .attr('class', 'zoom-lines')  
            .attr('d', d => this.line(d.child))
            .style("fill", 'none')
            .style('stroke', (d, i) => this.color(i))
            // .style('opacity', this.lineOpacity)

        this.context.selectAll('.line')
        .data(data).enter()
        .append('g')
        .attr('class', 'line-group')  
        //   .on("mouseover", (d, i) => {
        //     this.drow.append("text")
        //         .attr("class", "title-text")
        //         .style("fill", this.color(i))        
        //         .text(d.name)
        //         .attr("text-anchor", "middle")
        //         .attr("x", (this.width - this.margin.top)/2)
        //         .attr("y", 5);
        //     })
        .append('path')
        .attr('class', 'zoom-bars')  
        .attr('d', d => this.line2(d.child))
        .style("fill", 'none')
        .style('stroke', (d, i) => this.color(i))

        // this.context.append('g')
        //             .attr('class', 'brush')
        //             .call(this.brush)
        //             .call(this.brush.move, this.x.range()); 

        // this.focus
        //         .append('rect')
        //         .attr('class', 'zoom')
        //         .attr('width', this.width)
        //         .attr('height', this.height)
        //         // .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
        //         .call(this.zoom);
        }

        // bars section 
        // console.log(this.data[0].values)

        if(this.chartType == 'Bars'){
            
            this.focus.selectAll('.line-group').remove();
            this.context.selectAll('.line-group').remove();
            this.context.selectAll('.brush').remove();
            // this.drow.selectAll('.zoom').remove();

            this.context.selectAll('.bars').remove();
            this.focus.selectAll('.bars').remove();            

            this.focus.selectAll('.bars')
                    .data(data)
                    .enter()
                    .append('g')
                    //   .attr('class', "bars")
                    //  .style('clip-path', 'url(#clip)')
                    .attr('class', (d, i) => "bars rect" + i);

            this.context.append('g')
                        .attr('class', 'brush')
                        .call(this.brush)
                        .call(this.brush.move, this.x.range()); 

            // this.focus.select('.bars' )
            //           .append('rect')
            //           .attr('class', 'zoom')
            //           .attr('width', this.width)
            //           .attr('height', this.height)
            //           .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
            //           .call(this.zoom);
                                         

            data.forEach((element, i) => {
                this.focus.select(".rect" + i)
                        .selectAll('zoom-bars')
                        .data(element.child)
                        .enter()
                        .append('rect')
                        .attr('class', (d,k) =>  'zoom-bars zoom-bars' + k)
                        .attr('x', 0)
                        .attr('y', (d) => this.y(d.data.price))
                        .attr('width', 0)
                        .attr('height', (d) => this.height - this.y(d.data.price))                    
                        // .attr('height', (d) => this.height - this.y(d.data.price)).transition().duration(500)                    
                        .attr('fill', 'none')
                        .attr('fill', this.color(i))
                        .on("click", (d,i,n) => {
// console.log(D3.select(n[i]));
// console.log(this.focus.select('.zoom'));
                        // D3.select(n[i]).transition().duration(1000).attr('height', 10)
                            d.parent = this.focus.select('.bars')._groups[0][0].__data__;
                            this.data = d.parent;
                            d.data.id !== 3 ?  this.drawNode([d]) : null;
                        })
                        .on("mouseover", (d, i) => { 
                        this.drow
                            .selectAll('.title-popup')
                            .remove();

                        let position = D3.event;
                        let popup;
                        
                        // console.log(position.offsetX)
                        // console.log(position.offsetY)

                        popup = this.drow
                            .append("g")
                            .attr("class", "title-popup")       
                            .attr('transform', 'translate(' + (position.offsetX - 45) + ',' + (position.offsetY - 10) + ')');
//'M 0,0 L -10,-10 H -85 Q -90,-10 -90,-15 V -65 Q -90,-70 -85,-70 H 85 Q 90,-70 90,-65 V -15 Q 90,-10 85,-10  H 10 L 0,0 z'
                        popup
                            .append("path")
                            .attr("class", "title-rect")
                            .attr('d', "M 0,0 L -5,-5 H -61.5 Q -66.5,-5 -66.5,-10 V -40 Q -66.5,-55 -61.5,-55 H 61.5 Q 66.5,-55 66.5,-40 V -10 Q 66.5,-5 61.5,-5 H 5 z")
                            .style("fill", '#4ba5ee')        
                            .style("stroke", '#014379')        
                            .style("opacity", 0.7)        
                            // .attr("x", -50)
                            // .attr("y", -15);

                        popup
                            .append("text")
                            .text('Profits: $ ' + d.data.price)
                            .attr("class", "title-text")
                            // .style("fill", this.color(0))        
                            .attr("text-anchor", "middle")
                            .attr("x", 5)
                            .attr("y", -35);
                        })
                        .on("mouseout", () => {
                            this.drow
                                .selectAll('.title-popup')
                                .transition()
                                .duration(1000)
                                .style("opacity", 0)
                                .remove();
                        })                        
                        .on("contextmenu", (d, i) => { 

                            this.drow
                                .selectAll('.title-popup')
                                .remove();
    
                            let position = D3.event;
                            let popup;
                            
                            // console.log(position.offsetX)
                            // console.log(position.offsetY)
    
                            popup = this.drow
                                .append("g")
                                .attr("class", "title-popup")       
                                .attr("width", 250)       
                                .attr("height", 250)       
                                .attr('transform', 'translate(' + (position.offsetX - 45) + ',' + (position.offsetY - 10) + ')');
    // //'M 0,0 L -10,-10 H -85 Q -90,-10 -90,-15 V -65 Q -90,-70 -85,-70 H 85 Q 90,-70 90,-65 V -15 Q 90,-10 85,-10  H 10 L 0,0 z'
    //                         popup
    //                             .append("path")
    //                             .attr("class", "title-rect")
    //                             .attr('d', "M 0,0 L -10,-10 H -85 Q -90,-10 -90,-15 V -65 Q -90,-70 -85,-70 H 85 Q 90,-70 90,-65 V -15 Q 90,-10 85,-10  H 10 L 0,0 z")
    //                             .style("fill", this.color(15))        
    //                             .style("stroke", this.color(10))        
    //                             .style("opacity", 0.7)        
    //                             // .attr("x", -50)
    //                             // .attr("y", -15);
    
    //                         popup
    //                             .append("text")
    //                             .text('More Details')
    //                             .attr("class", "title-text")
    //                             .style("fill", this.color(10))        
    //                             .attr("text-anchor", "middle")
    //                             .attr("x", 5)
    //                             .attr("y", -35);

                        let values = []
                        d.values.forEach((element, i) => {
                            values.push({date:element.date.slice(0,3), price:element.price })
                            i == d.values.length- 1 ? this.donutChartService.drawChart(values, popup, 'date', 'price', 10) : null;
                        })

                                // this.donutChartService.drawChart(values, popup, 'date', 'price');
                        })                    

            });

            data.forEach((element, i) => {
                element.child.forEach((elm,k) => {
                    // console.log(this.focus.select('.zoom-bars' + k))
                    this.focus.select('.zoom-bars' + k)
                // this.focus
                // .select((d,k) =>  '.zoom-bars' + k)
                // .select('rect')
                // .attr('y', (d) =>   this.y(d.data.price))
                .transition().duration(2000 - k * 50 )
                .attr('x', this.x(elm.data.date))
                        .attr('width', 5)
                        // .attr('height', this.height - this.y(elm.data.price) + 30)                    
                        // .attr('height', (d) => this.height - this.y(d.data.price)).transition().duration(500)                    
                        // .attr('fill', 'none')
                        // .attr('fill', this.color(i))               
            });
            });

            this.context.selectAll('.bars')
                    .data(data)
                    .enter()
                    .append('g')
                    //    .attr('class', "bars")
                    //  .style('clip-path', 'url(#clip)')
                    .attr('class', (d, i) => "bars rect" + i);

            // this.context.append('g')
            //     .attr('class', 'brush')
            //     .call(this.brush)
            //     .call(this.brush.move, this.x.range());                  
                
            data.forEach((element, i) => {
                this.context.select(".rect" + i)
                        .selectAll('rect')
                        .data(element.child)
                        .enter()
                        .append('rect')
                        .attr('class', 'zoom-bars')
                        .attr('x', (d) => this.x(d.data.date) )
                        .attr('y', (d) =>   this.y2(d.data.price)  )
                        .attr('width', 3)
                        .attr('height', (d) => this.brushWidth - this.y2(d.data.price))                    
                        .attr('fill', 'none')
                        .attr('fill', this.color(i))
                        // .style('opacity', 0.05)
                        // .style('stroke', this.color(i))
                        // .style('stroke-width', 3)
            });        
        }
    }

    private drwoPermanent(data:any){

        this.focus.selectAll('.axis--x').remove();
        this.focus.selectAll('.axis--y').remove();        
        this.focus.selectAll('.text').remove();        
        this.context.selectAll('.axis--x').remove();        
        this.context.selectAll('.text').remove();        

        let data3 = []
        let time = []
        
        data.forEach((element) =>{ 
            element.child.forEach((elm: any) =>{
                time.push(new Date(elm.data.date).getTime())
                // console.log(elm.date)  
                elm.data.date = new Date(elm.data.date);
                // elm.data.id == 1 ? elm.data.date = this.parseYearDate(elm.data.date) : 
                // elm.data.id == 2 ? elm.data.date = this.parseMonthDate(elm.data.date):
                // elm.data.id == 3 ? elm.data.date = this.parseDayDate(elm.data.date):
                // console.log(this.parseYearDate(elm.data.date))
                // elm.date = this.parseDate(elm.date);
                    // d.data.price = + d.data.price;  // 
                    data3.push(elm); // temporally the origen one id this.data 
                });
        });

        this.color = D3.scaleOrdinal(D3.schemeCategory10);
        let drift = (time[1] - time[0])/2; 

        this.x.domain([Math.min(...time) - drift, Math.max(...time) + drift]); // d3Array.extent(data3, (d: Stock) => d.data.date) returns [Date object, Date object]
        this.y.domain([0, d3Array.max(data3, (d) => d.data.price)]); //  [0, d3Array.max(data3, (d: Stock) => d.data.price)] returns [0, number]
        this.x2.domain(this.x.domain());
        this.y2.domain(this.y.domain());

        // console.log(d3Array.extent(data3, (d) => d.data.date))
        // console.log(time)
        // console.log([0, d3Array.max(data3, (d: Stock) => d.data.price)])
        // console.log(this.data[0].values)        
    
      this.focus.append('g')
                .attr('class', 'axis axis--x')
                .attr('transform', 'translate(0,' + this.height + ')')
                .call(this.xAxis);

      this.focus.append('g')
                .attr('class', 'axis axis--y')
                .call(this.yAxis);
      
      this.focus.append('g')
                .attr('class', 'text')
                .attr('transform', 'translate(' + this.width / 2 + ',' + (this.height + 35)  + ')')
                .append('text')
                .attr('text-anchor',"middle")
                .attr('font-weight',"bold")
                .text('Time')

      this.context.append('g')
                  .attr('class', 'text')
                  .attr('transform', 'translate(-' + 1.5 * this.margin2.left + ',-' + (this.height2/2)  + ')')
                  .append('text')
                  .attr('text-anchor',"middle")
                  .attr('font-weight',"bold")
                  .text('Profits  ( $ )')
                  .attr('transform', 'rotate(90' + ')')

      this.context.append('g')
                  .attr('class', 'axis axis--x')
                  .attr('transform', 'translate(0,' + (this.brushWidth) + ')')
                  .call(this.xAxis2);

    //   this.context.append('g')
    //               .attr('class', 'brush')
    //               .call(this.brush)
    //               .call(this.brush.move, this.x.range());

    //   this.focus.select('.bars')
    //            .append('rect')
    //            .attr('class', 'zoom')
    //            .attr('width', this.width)
    //            .attr('height', this.height)
    //            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
    //            .call(this.zoom);

    //   this.drawChart(data);
    }    

}

