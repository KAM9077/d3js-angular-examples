import { Injectable } from '@angular/core';
import { UsStats } from '../shared/jason-files/'

@Injectable({
  providedIn: 'root'
})

export class Generator {

constructor() { }

    dateFormater = (time, i) => {
        time = new Date(time + i * 2645280000).toDateString().split(' ')
        return '' + time[1] + ' ' +  time[3];
    }

    ArrOfObjs = (dataRang, valueRange) => {

        let startYear: any = new Date(dataRang[0]).getFullYear();
        let endYear: any = new Date(dataRang[1]).getFullYear();
        let startMonth: any = new Date(dataRang[0]).getMonth();
        let endMonth: any = new Date(dataRang[1]).getMonth();
        // let start: any = new Date(dataRang[0]); 
        let end = Math.abs(endYear - startYear) * 12 - startMonth - endMonth;
        let start = new Date(dataRang[0]).getTime();


        let obj: any;
        let arr: any = [];
        let max = Math.max(valueRange[0], valueRange[1])
        let min = Math.min(valueRange[0], valueRange[1])
        let value :number; 



        for (let i = 0; i < end ; i++) {
            // for (let k = 0; k < numb2 ; k++) {
                value =  parseInt(Math.random() * (max - min) + min + '')
            // }
            arr.push({date: this.dateFormater(start, i) , price : value})
        }
        return arr;
    };

    mapJson = (dataRang, valueRange) => {
        
        let obj = [];
        let states = [];
        let state = [];
        let cities = [];
        let string = '';

        UsStats.forEach((element, i) => {

            state.includes(element.state) ? null : 
            (
                state.push(element.state),
                cities = [],
                UsStats.forEach((elm, j) => {
                    element.state == elm.state ? cities.push({name:elm.city, values: this.ArrOfObjs(dataRang, valueRange)}) : null;
                    j == UsStats.length - 1 ? obj.push({name: element.state, child: cities , stateValue: []}) : null;
                })
            );
            // i == UsStats.length - 1 ? console.log(obj) : null; 
        });
        return obj;
    };
}