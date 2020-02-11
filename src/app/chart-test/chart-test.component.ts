import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import * as D3 from 'd3';
import * as d3 from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3Shape from 'd3-shape';
import * as d3Axis from 'd3-axis';
import * as d3Zoom from 'd3-zoom';
import * as d3Brush from 'd3-brush';
import * as d3Array from 'd3-array';
import * as d3TimeFormat from 'd3-time-format';

import { SP500 } from '../shared';

interface Margin {
    top: number;
    right: number;
    bottom: number;
    left: number;
}

interface Stock {
    date: any;
    price: any;
}

@Component({
  selector: 'app-chart-test',
  templateUrl: './chart-test.component.html',
  styleUrls: ['./chart-test.component.css']
})

export class ChartTestComponent implements OnInit {

    title = 'Brush & Zoom';

    private margin: Margin;
    private margin2: Margin;

    private width: number;
    private height: number;
    private height2: number;


    private svg: any;     // TODO replace all `any` by the right type

    private x: any;
    private x2: any;
    private y: any;
    private y2: any;

    private xAxis: any;
    private xAxis2: any;
    private yAxis: any;

    private xScale:any;
    private yScale:any;
    private y2Scale:any;
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

    private parseDate = d3TimeFormat.timeParse('%b %Y');

    private data1 = [
        {date: 'Jan 2000', price: 2217.68},
        {date: 'Sep 2000', price: 1436.51},
        {date: 'Oct 2000', price: 1429.4},
        {date: 'Nov 2000', price: 1314.95},
        {date: 'Dec 2000', price: 1320.28},
        {date: 'Jan 2001', price: 1366.01},
        {date: 'Feb 2001', price: 1239.94},
        {date: 'Mar 2001', price: 1160.33},
        {date: 'Apr 2011', price: 1249.46},
        {date: 'May 2001', price: 1255.82},
        {date: 'Jun 2001', price: 1224.38},
        {date: 'Jul 2001', price: 1211.23},
        {date: 'Aug 2001', price: 1133.58},
        {date: 'Sep 2001', price: 1040.94},
        {date: 'Oct 2001', price: 1059.78},
        {date: 'Nov 2001', price: 1139.45},
        {date: 'Dec 2001', price: 1148.08},
        {date: 'Jan 2002', price: 1130.2},
        {date: 'Feb 2002', price: 1106.73},
        {date: 'Mar 2002', price: 1147.39},
        {date: 'Apr 2002', price: 1076.92},
        {date: 'May 2002', price: 1067.14},
        {date: 'Jun 2002', price: 989.82}
    ]
    private data = [
        {
          name: "USA",
          values: [
                 {date: 'Sep 2005', price: 1228.81},
            {date: 'Oct 2005', price: 1207.01},
            {date: 'Nov 2005', price: 1249.48},
            {date: 'Dec 2005', price: 1248.29},
            {date: 'Jan 2006', price: 1280.08},
            {date: 'Feb 2006', price: 1280.66},
            {date: 'Mar 2006', price: 1294.87},
            {date: 'Apr 2006', price: 1310.61},
            {date: 'May 2006', price: 1270.09},
            {date: 'Jun 2006', price: 1270.2},
            {date: 'Jul 2006', price: 1276.66},
            {date: 'Aug 2006', price: 1303.82},
            {date: 'Sep 2006', price: 1335.85},
            {date: 'Oct 2006', price: 1377.94},
            {date: 'Nov 2006', price: 1400.63},
            {date: 'Dec 2006', price: 1418.3},
            {date: 'Jan 2007', price: 1438.24},
            {date: 'Feb 2007', price: 1406.82},
            {date: 'Mar 2007', price: 1420.86},
            {date: 'Apr 2007', price: 1482.37},
            {date: 'May 2007', price: 1530.62},
            {date: 'Jun 2007', price: 1503.35},
            {date: 'Jul 2007', price: 1455.27},
            {date: 'Aug 2007', price: 1473.99},
            {date: 'Sep 2007', price: 1526.75},
            {date: 'Oct 2007', price: 1549.38},
            {date: 'Nov 2007', price: 1481.14},
            {date: 'Dec 2007', price: 1468.36},
            {date: 'Jan 2008', price: 1378.55},
            {date: 'Feb 2008', price: 1330.63},
            {date: 'Mar 2008', price: 1322.7},
            {date: 'Apr 2008', price: 1385.59},
            {date: 'May 2008', price: 1400.38},
            {date: 'Jun 2008', price: 1280},
            {date: 'Jul 2008', price: 1267.38},
            {date: 'Aug 2008', price: 1282.83},
            {date: 'Sep 2008', price: 1166.36},
            {date: 'Oct 2008', price: 968.75},
            {date: 'Nov 2008', price: 896.24},
            {date: 'Dec 2008', price: 903.25},
            {date: 'Jan 2009', price: 825.88},
            {date: 'Feb 2009', price: 735.09},
            {date: 'Mar 2009', price: 797.87},
            {date: 'Apr 2009', price: 872.81},
            {date: 'May 2009', price: 919.14},
            {date: 'Jun 2009', price: 919.32},
            {date: 'Jul 2009', price: 987.48},
            {date: 'Aug 2009', price: 1020.62},
            {date: 'Sep 2009', price: 1057.08},
            {date: 'Oct 2009', price: 1036.19},
            {date: 'Nov 2009', price: 1095.63},
            {date: 'Dec 2009', price: 1115.1},
            {date: 'Jan 2010', price: 1073.87},
            {date: 'Feb 2010', price: 1104.49},
            {date: 'Mar 2010', price: 1140.45}
          ]
        },
        {
          name: "Canada",
          values: [
            {date: 'Jan 2000', price: 1394.46},
            {date: 'Feb 2000', price: 1366.42},
            {date: 'Mar 2000', price: 1498.58},
            {date: 'Apr 2000', price: 1452.43},
            {date: 'May 2000', price: 1420.6},
            {date: 'Jun 2000', price: 1454.6},
            {date: 'Jul 2000', price: 1430.83},
            {date: 'Aug 2000', price: 1517.68},
            {date: 'Sep 2000', price: 1436.51},
            {date: 'Oct 2000', price: 1429.4},
            {date: 'Nov 2000', price: 1314.95},
            {date: 'Dec 2000', price: 1220.28},
            {date: 'Jan 2001', price: 1226.01},
            {date: 'Feb 2001', price: 1229.94},
            {date: 'Mar 2001', price: 1220.33},
            {date: 'Apr 2001', price: 1229.46},
            {date: 'May 2001', price: 1225.82},
            {date: 'Jun 2001', price: 1224.38},
            {date: 'Jul 2001', price: 1221.23},
            {date: 'Aug 2001', price: 1223.58},
            {date: 'Sep 2001', price: 1220.94},
            {date: 'Oct 2001', price: 1229.78},
            {date: 'Nov 2001', price: 1229.45},
            {date: 'Dec 2001', price: 1228.08},
            {date: 'Jan 2002', price: 1220.2},
            {date: 'Feb 2002', price: 1226.73},
            {date: 'Mar 2002', price: 1227.39},
            {date: 'Apr 2002', price: 1226.92},
            {date: 'May 2002', price: 1227.14},
            {date: 'Jun 2002', price: 989.82},
            {date: 'Jul 2002', price: 911.62},
            {date: 'Aug 2002', price: 916.07},
            {date: 'Sep 2002', price: 815.28},
            {date: 'Oct 2002', price: 885.76},
            {date: 'Nov 2002', price: 936.31},
            {date: 'Dec 2002', price: 879.82},
            {date: 'Jan 2003', price: 855.7},
            {date: 'Feb 2003', price: 841.15},
            {date: 'Mar 2003', price: 847.18},
            {date: 'Apr 2003', price: 917.92},
            {date: 'May 2003', price: 967.59},
            {date: 'Jun 2003', price: 977.5},
            {date: 'Jul 2003', price: 997.31},
            {date: 'Aug 2003', price: 1078.01},
            {date: 'Sep 2003', price: 997.97},
            {date: 'Oct 2003', price: 1070.71},
            {date: 'Nov 2003', price: 1078.2},
            {date: 'Dec 2003', price: 1171.92},
            {date: 'Jan 2004', price: 1171.13},
            {date: 'Feb 2004', price: 1174.94},
            {date: 'Mar 2004', price: 1176.21},
            {date: 'Apr 2004', price: 1177.3},
            {date: 'May 2004', price: 1170.68},
            {date: 'Jun 2004', price: 1140.84},
            {date: 'Jul 2004', price: 1101.72},
            {date: 'Aug 2004', price: 1304.24},
            {date: 'Sep 2004', price: 1314.58},
            {date: 'Oct 2004', price: 1330.2},
            {date: 'Nov 2004', price: 1373.82},
            {date: 'Dec 2004', price: 1311.92},
            {date: 'Jan 2005', price: 1381.27},
            {date: 'Feb 2005', price: 1303.6},
            {date: 'Mar 2005', price: 1380.59},
            {date: 'Apr 2005', price: 1356.85},
            {date: 'May 2005', price: 1391.5},
            {date: 'Jun 2005', price: 1391.33},
          ]
        },
        {
          name: "Maxico",
          values: [
            {date: 'Jan 2000', price: 1394.46},
            {date: 'Feb 2000', price: 1666.42},
            {date: 'Mar 2000', price: 1698.58},
            {date: 'Apr 2000', price: 1652.43},
            {date: 'May 2000', price: 1620.6},
            {date: 'Jun 2000', price: 1654.6},
            {date: 'Jul 2000', price: 1630.83},
            {date: 'Aug 2000', price: 1617.68},
            {date: 'Sep 2000', price: 1636.51},
            {date: 'Oct 2000', price: 1629.4},
            {date: 'Nov 2000', price: 1614.95},
            {date: 'Dec 2000', price: 1620.28},
            {date: 'Jan 2001', price: 1366.01},
            {date: 'Feb 2001', price: 1239.94},
            {date: 'Mar 2001', price: 1160.33},
            {date: 'Apr 2001', price: 1249.46},
            {date: 'May 2001', price: 1255.82},
            {date: 'Jun 2001', price: 1224.38},
            {date: 'Jul 2001', price: 1311.23},
            {date: 'Aug 2001', price: 1333.58},
            {date: 'Sep 2001', price: 1340.94},
            {date: 'Oct 2001', price: 1359.78},
            {date: 'Nov 2001', price: 1339.45},
            {date: 'Dec 2001', price: 1348.08},
            {date: 'Jan 2002', price: 1330.2},
            {date: 'Feb 2002', price: 1306.73},
            {date: 'Mar 2002', price: 1347.39},
            {date: 'Apr 2002', price: 1376.92},
            {date: 'May 2002', price: 1367.14},
            {date: 'Jun 2002', price: 939.82},
            {date: 'Jul 2002', price: 931.62},
            {date: 'Aug 2002', price: 936.07},
            {date: 'Sep 2002', price: 835.28},
            {date: 'Oct 2002', price: 835.76},
            {date: 'Nov 2002', price: 936.31},
            {date: 'Dec 2002', price: 879.82},
            {date: 'Jan 2003', price: 855.7},
            {date: 'Feb 2003', price: 841.15},
            {date: 'Mar 2003', price: 848.18},
            {date: 'Apr 2003', price: 916.92},
            {date: 'May 2003', price: 963.59},
            {date: 'Jun 2003', price: 974.5},
            {date: 'Jul 2003', price: 990.31},
            {date: 'Aug 2003', price: 1008.01},
            {date: 'Sep 2003', price: 995.97},
            {date: 'Oct 2003', price: 1050.71},
            {date: 'Nov 2003', price: 1058.2},
            {date: 'Dec 2003', price: 1111.92},
            {date: 'Jan 2004', price: 1131.13},
            {date: 'Feb 2004', price: 1144.94},
            {date: 'Mar 2004', price: 1126.21},
            {date: 'Apr 2004', price: 1107.3},
            {date: 'May 2004', price: 1120.68},
            {date: 'Jun 2004', price: 1140.84},
            {date: 'Jul 2004', price: 1101.72},
            {date: 'Aug 2004', price: 1104.24},
            {date: 'Sep 2004', price: 1114.58},
            {date: 'Oct 2004', price: 1130.2},
            {date: 'Nov 2004', price: 1173.82},
            {date: 'Dec 2004', price: 1211.92},
            {date: 'Jan 2005', price: 1181.27},
            {date: 'Feb 2005', price: 1203.6},
            {date: 'Mar 2005', price: 1180.59},
            {date: 'Apr 2005', price: 1156.85},
            {date: 'May 2005', price: 1191.5},
            {date: 'Jun 2005', price: 1191.33},
            {date: 'Jul 2005', price: 1234.18},
            {date: 'Aug 2005', price: 1220.33},
            {date: 'Sep 2005', price: 1228.81},
            {date: 'Oct 2005', price: 1207.01},
            {date: 'Nov 2005', price: 1249.48},
            {date: 'Dec 2005', price: 1248.29},
            {date: 'Jan 2006', price: 1380.08},
            {date: 'Feb 2006', price: 1380.66},
            {date: 'Mar 2006', price: 1394.87},
            {date: 'Apr 2006', price: 1310.61},
            {date: 'May 2006', price: 1370.09},
            {date: 'Jun 2006', price: 1370.2},
            {date: 'Jul 2006', price: 1376.66},
            {date: 'Aug 2006', price: 1303.82},
            {date: 'Sep 2006', price: 1335.85},
            {date: 'Oct 2006', price: 1377.94},
            {date: 'Nov 2006', price: 1400.63},
            {date: 'Dec 2006', price: 1418.3},
            {date: 'Jan 2007', price: 1438.24},
            {date: 'Feb 2007', price: 1406.82},
            {date: 'Mar 2007', price: 1120.86},
            {date: 'Apr 2007', price: 1182.37},
            {date: 'May 2007', price: 1130.62},
            {date: 'Jun 2007', price: 1103.35},
            {date: 'Jul 2007', price: 1155.27},
            {date: 'Aug 2007', price: 1173.99},
            {date: 'Sep 2007', price: 1126.75},
            {date: 'Oct 2007', price: 1149.38},
            {date: 'Nov 2007', price: 1181.14},
            {date: 'Dec 2007', price: 1468.36},
            {date: 'Jan 2008', price: 1378.55},
            {date: 'Feb 2008', price: 1330.63},
            {date: 'Mar 2008', price: 1322.7},
            {date: 'Apr 2008', price: 1385.59},
            {date: 'May 2008', price: 1400.38},
            {date: 'Jun 2008', price: 1280},
            {date: 'Jul 2008', price: 1267.38},
            {date: 'Aug 2008', price: 1282.83},
            {date: 'Sep 2008', price: 1266.36},
            {date: 'Oct 2008', price: 928.75},
            {date: 'Nov 2008', price: 826.24},
            {date: 'Dec 2008', price: 923.25},
            {date: 'Jan 2009', price: 825.88},
            {date: 'Feb 2009', price: 725.09},
            {date: 'Mar 2009', price: 727.87},
            {date: 'Apr 2009', price: 822.81},
            {date: 'May 2009', price: 929.14},
            {date: 'Jun 2009', price: 929.32},
            {date: 'Jul 2009', price: 987.48},
            {date: 'Aug 2009', price: 1020.62},
            {date: 'Sep 2009', price: 1757.08},
            {date: 'Oct 2009', price: 1736.19},
            {date: 'Nov 2009', price: 1795.63},
            {date: 'Dec 2009', price: 1715.1},
            {date: 'Jan 2010', price: 1773.87},
            {date: 'Feb 2010', price: 1704.49},
            {date: 'Mar 2010', price: 1740.45}
          ]
        },
        // {
        //   name: "Canada",
        //   values: [
        //     {date: "2000", price: "200"},
        //     {date: "2001", price: "120"},
        //     {date: "2001", price: "120"},
        //     {date: "2002", price: "33"},
        //     {date: "2004", price: "51"},
        //     {date: "2003", price: "21"},
        //     {date: "2004", price: "51"},
        //     {date: "2005", price: "190"},
        //     {date: "2004", price: "51"},
        //     {date: "2006", price: "120"},
        //     {date: "2007", price: "85"},
        //     {date: "2009", price: "101"},
        //     {date: "2008", price: "221"},
        //     {date: "2000", price: "200"},
        //     {date: "2001", price: "120"},
        //     {date: "2001", price: "120"},
        //     {date: "2003", price: "71"},
        //     {date: "2004", price: "20"},
        //     {date: "2005", price: "9"},
        //     {date: "2006", price: "220"},
        //     {date: "2007", price: "235"},
        //     {date: "2008", price: "61"},
        //     {date: "2009", price: "10"},
        //     {date: "2000", price: "200"},
        //     {date: "2001", price: "120"},
        //     {date: "2001", price: "120"},
        //     {date: "2002", price: "33"},
        //     {date: "2004", price: "51"},
        //     {date: "2002", price: "33"},
        //     {date: "2004", price: "51"},
        //     {date: "2003", price: "21"},
        //     {date: "2004", price: "51"},
        //     {date: "2005", price: "190"},
        //     {date: "2004", price: "51"},
        //     {date: "2006", price: "120"},
        //     {date: "2007", price: "85"},
        //     {date: "2009", price: "101"},
        //     {date: "2008", price: "221"},
        //   ]
        // },
        // {
        //   name: "Maxico",
        //   values: [
        //     {date: "2000", price: "50"},
        //     {date: "2001", price: "10"},
        //     {date: "2002", price: "5"},
        //     {date: "2003", price: "71"},
        //     {date: "2004", price: "20"},
        //     {date: "2005", price: "9"},
        //     {date: "2006", price: "220"},
        //     {date: "2001", price: "120"},
        //     {date: "2001", price: "120"},
        //     {date: "2002", price: "33"},
        //     {date: "2004", price: "51"},
        //     {date: "2003", price: "21"},
        //     {date: "2004", price: "51"},
        //     {date: "2005", price: "190"},
        //     {date: "2004", price: "51"},
        //     {date: "2006", price: "120"},
        //     {date: "2007", price: "85"},
        //     {date: "2009", price: "101"},
        //     {date: "2007", price: "235"},
        //     {date: "2008", price: "61"},
        //     {date: "2009", price: "10"},
        //     {date: "2000", price: "200"},
        //     {date: "2001", price: "120"},
        //     {date: "2001", price: "120"},
        //     {date: "2002", price: "33"},
        //     {date: "2004", price: "51"},
        //     {date: "2003", price: "21"},
        //     {date: "2004", price: "51"},
        //     {date: "2005", price: "190"},
        //     {date: "2004", price: "51"},
        //     {date: "2006", price: "120"},
        //     {date: "2007", price: "85"},
        //     {date: "2009", price: "101"},
        //     {date: "2008", price: "221"},
        //     {date: "2000", price: "200"},
        //     {date: "2001", price: "120"},
        //     {date: "2001", price: "120"},
        //     {date: "2002", price: "33"},
        //     {date: "2004", price: "51"},
        //     {date: "2003", price: "21"},
        //     {date: "2008", price: "221"},
        //   ]
        // }
      ];

    constructor() {
    }

    ngOnInit() {
        this.initMargins();
        this.initSvg();
        this.drawChart(this.parseData(SP500), this.parseData(this.data1));
    }

    private initMargins() {
        this.margin = {top: 20, right: 20, bottom: 110, left: 40};
        this.margin2 = {top: 430, right: 20, bottom: 30, left: 40};
    }

    private parseData(data: any[]): Stock[] {
        return data.map(v => <Stock>{date: this.parseDate(v.date), price: v.price});
    }

    private initSvg() {
        this.svg = d3.select('svg');

        this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
        this.height = +this.svg.attr('height') - this.margin.top - this.margin.bottom;
        this.height2 = +this.svg.attr('height') - this.margin2.top - this.margin2.bottom;

        this.x = d3Scale.scaleTime().range([0, this.width]);
        this.x2 = d3Scale.scaleTime().range([0, this.width]);
        this.y = d3Scale.scaleLinear().range([this.height, 0]);
        this.y2 = d3Scale.scaleLinear().range([this.height2, 0]);

        this.xAxis = d3Axis.axisBottom(this.x);
        this.xAxis2 = d3Axis.axisBottom(this.x2);
        this.yAxis = d3Axis.axisLeft(this.y);

        this.xScale = D3.scaleTime()
        .domain(D3.extent([2000,2001,2002], d => d))
        .range([0, (this.width - this.margin.right)]);

        this.brush = d3Brush.brushX()
            .extent([[0, 0], [this.width, this.height2]])
            .on('brush end', this.brushed.bind(this));

        this.zoom = d3Zoom.zoom()
            .scaleExtent([1, Infinity])
            .translateExtent([[0, 0], [this.width, this.height]])
            .extent([[0, 0], [this.width, this.height]])
            .on('zoom', this.zoomed.bind(this));

        this.line = D3.line()
        .x(d => this.x(d.date))
        .y(d => this.y(d.price));            

        this.line2 = D3.line()
        .x(d => this.x(d.date))
        .y(d => this.y2(d.price));            

        this.area = d3Shape.area()
            .curve(d3Shape.curveMonotoneX)
            .x((d: any) => this.x(d.date))
            .y0(this.height)
            .y1((d: any) => this.y(d.price));

        this.area2 = d3Shape.area()
            .curve(d3Shape.curveMonotoneX)
            .x((d: any) => this.x2(d.date))
            .y0(this.height2)
            .y1((d: any) => this.y2(d.price));

        this.svg.append('defs').append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', this.width)
            .attr('height', this.height);

            this.lines = this.svg.append('g')
            .attr('class', 'lines');            

        this.focus = this.svg.append('g')
            .attr('class', 'focus')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.context = this.svg.append('g')
            .attr('class', 'context')
            .attr('transform', 'translate(' + this.margin2.left + ',' + this.margin2.top + ')');
    }

    private brushed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'zoom') return; // ignore brush-by-zoom
        let s = d3.event.selection || this.x2.range();
        this.x.domain(s.map(this.x2.invert, this.x2));
        this.xScale.domain(s.map(this.x2.invert, this.x2));
        this.focus.select('.area2').attr('d', this.area);
        console.log(this.focus.select('.area2'))
        this.focus.selectAll('.line').attr('d', d => this.line(d.values));
        this.focus.select('.axis--x').call(this.xAxis);
        this.svg.select('.zoom2').call(this.zoom.transform, d3Zoom.zoomIdentity
            .scale(this.width / (s[1] - s[0]))
            .translate(-s[0], 0));
    }

    private zoomed() {
        if (d3.event.sourceEvent && d3.event.sourceEvent.type === 'brush') return; // ignore zoom-by-brush
        let t = d3.event.transform;
        this.x.domain(t.rescaleX(this.x2).domain());
        // this.x.domain(t.rescaleX(this.x2).domain());
        this.xScale.domain(t.rescaleX(this.x2).domain());
        this.focus.select('.area2').attr('d', this.area);
        // console.log(this.focus.select('.area'))
        this.focus.selectAll('.line').attr('d', d => this.line(d.values));
        console.log(this.lines.selectAll('.line'))
        this.focus.select('.axis--x').call(this.xAxis);
        this.context.select('.brush').call(this.brush.move, this.x.range().map(t.invertX, t));
    }

    private drawChart(data: Stock[], data1: Stock[]) {
    console.log(data)

        // this.parseDate = D3.timeParse("%Y");
    let data3 = []
        this.data.forEach((d) =>{ 
            
            d.values.forEach((d: any) =>{
                d.date = this.parseDate(d.date);
                d.price = + d.price;    
                data3.push(d);
            });
        });
      
      // this.yScale = D3.scaleLinear()
      //   .domain([0, D3.max(this.data[2].values, d => d.price)])
      //   .range([(this.height - this.margin.top), 0]);
      
      // this.y2Scale = D3.scaleLinear()
      //   .domain([0, D3.max(this.data[2].values, d => d.price)])
      //   .range([(this.height2 - this.margin.top), 0]);
      
      this.color = D3.scaleOrdinal(D3.schemeCategory10);


        this.x.domain(d3Array.extent(data3, (d: Stock) => d.date));
        this.y.domain([0, d3Array.max(data3, (d: Stock) => d.price)]);
        this.x2.domain(this.x.domain());
        this.y2.domain(this.y.domain());

        this.focus.selectAll('.line')
        .data(this.data).enter()
        // .append('g')
        // .attr('class', 'line-group')  
        // .on("mouseover", (d, i) => {
        //   this.svg.append("text")
        //       .attr("class", "title-text")
        //       .style("fill", this.color(i))        
        //       .text(d.name)
        //       .attr("text-anchor", "middle")
        //       .attr("x", (this.width - this.margin.top)/2)
        //       .attr("y", 5);
        //   })
        .append('path')
        .attr('class', 'line')  
        .attr('d', d => this.line(d.values))
        .style("fill", 'none')
        .style('stroke', (d, i) => this.color(i+1))
        // .style('opacity', this.lineOpacity)

        // this.focus.append('path')
        //     .datum(data)
        //     .attr('class', 'area')
        //     .attr('d', this.area);

        this.focus.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(this.xAxis);

        this.focus.append('g')
            .attr('class', 'axis axis--y')
            .call(this.yAxis);

        // this.context.append('path')
        //     .datum(data)
        //     .attr('class', 'area2')
        //     .attr('d', this.area2);

        this.context.selectAll('.line')
        .data(this.data).enter()
        // .append('g')
        // .attr('class', 'line-group')  
        // .on("mouseover", (d, i) => {
        //   this.svg.append("text")
        //       .attr("class", "title-text")
        //       .style("fill", this.color(i))        
        //       .text(d.name)
        //       .attr("text-anchor", "middle")
        //       .attr("x", (this.width - this.margin.top)/2)
        //       .attr("y", 5);
        //   })
        .append('path')
        .attr('class', 'line')  
        .attr('d', d => this.line2(d.values))
        .style("fill", 'none')
        .style('stroke', (d, i) => this.color(i+1))

        this.context.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + this.height2 + ')')
            .call(this.xAxis2);

        this.context.append('g')
            .attr('class', 'brush')
            .call(this.brush)
            .call(this.brush.move, this.x.range());

        this.svg.append('rect')
            .attr('class', 'zoom2')
            .style('opacity', 0)
            .attr('width', this.width)
            .attr('height', this.height)
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
            .call(this.zoom);
    }

}

