import { Injectable } from '@angular/core';
import { UsStats } from '../shared/jason-files/'

@Injectable({
  providedIn: 'root'
})

export class Generator {

constructor() { }

    dateFormater = (time) => {
        time = new Date(time).toDateString().split(' ')
        return '' + time[1] + ' ' + time[2] + ' ' +  time[3];
    }

    ArrOfObjs = (dataRang, valueRange) => {

        let startYear: any = new Date(dataRang[0]).getFullYear();
        let endYear: any = new Date(dataRang[1]).getFullYear();
        let startMonth: any = new Date(dataRang[0]).getMonth();
        let endMonth: any = new Date(dataRang[1]).getMonth();
        // let start: any = new Date(dataRang[0]); 
        // let end = Math.abs(endYear - startYear) * 12 - startMonth - endMonth;
        // let start = Math.abs(dataRang[1].getTime());
        let start = new Date(dataRang[0]).getTime();
        let end = new Date(dataRang[1]).getTime();
        // console.log(end);
        // console.log(start);
        let steps = (end - start) / 86400000;
        

        let obj: any;
        let arr: any = [];
        let max = Math.max(valueRange[0], valueRange[1])
        let min = Math.min(valueRange[0], valueRange[1])
        let value :number; 

        for (let i = 0; i < steps ; i++) {
            // for (let k = 0; k < numb2 ; k++) {
                value =  parseInt(Math.random() * (max - min) + min + '')
            // }
            arr.push({date: this.dateFormater(start + i * 86400000) , price : value})
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