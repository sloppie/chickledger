import { NativeModules } from 'react-native';

// Date format = MM/DD/YY

/**
 * This class helps link the FileManager NativeModule to the react-native app
 */
export default class FileManager {
    constructor(batchInformation){
        this.batchInformation = batchInformation;
        this.context = this.batchInformation.name;
        let length = this.batchInformation.population.length - 1;
        // timestamp
        this.initialTimestamp = this.batchInformation.population[length].date;
        // initial Date Obj
        this.dateObj = new Date(this.initialTimestamp);
        this.initialDay = this.dateObj.getDay();
        this.initialYear = this.dateObj.getFullYear();
        this.initialDate = this.dateObj.getDate();
        this.initialMonth = this.dateObj.getMonth();
        
        this.days = [
            "sunday",
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday"
        ];
        let current = new Date();
        this.months = [
            ["january", 31],
            ["february", (current.getFullYear() % 4) ? 28: 29],
            ["march", 31],
            ["april", 30],
            ["may", 31],
            ["june", 30],
            ["july", 31],
            ["august", 31],
            ["september", 30],
            ["october", 31],
            ["november", 30],
            ["december", 31]
        ];
        this.currentDate = current.getDate();
        this.currentDay = current.getDay();
        this.currentYear = current.getFullYear();
        this.currentMonth = current.getMonth();
    }

    /**
     * @returns Array holding the values of `CompleteNumberOfWeeks` and `NumberOfDaysPassedInTheIncompleteWeek`
     */
    calculateWeek(){
        let day = this.dateObj.getDay();
        let currentDay = this.initialDay;
        let offset = 0;
        let weekNumber = 0;
        for(let y=this.initialYear; y<=this.currentYear; y++){
            let initialMonths = (y == this.initialYear)?this.initialMonth: 0;
            let lastMonth = (y == this.currentYear)? this.currentMonth: 11;
            for(let m=initialMonths; m<=lastMonth; m++){
                // console.log("loop 2 i month: " + m + " which has: " + this.months[m][1] + " days");
                // d should account for initial month
                let days = (((y == this.currentYear && m==this.currentMonth))? this.currentDate: this.months[m][1]);
                let initial = (y== this.initialYear && m==this.initialMonth)? this.initialDate: 1;
                for(let d=initial; d<=days; d++){
                    // if(this.days[currentDay] == "sunday"){
                    //     currentDay = 0;
                    // }else{
                    //     currentDay++;
                    // }
                    offset++;

                    if(!(offset % 7)){
                        weekNumber++;
                    }
                } // days loop
            } //month loop
        } //year loop

        // console.log(`${weekNumber} weeks, ${offset%7}`);
        return [Math.floor(offset/7), offset%7];
    }

    static addWeek(batchInformation, data){
        let batch = new FileManager(batchInformation);
        let weekInfo = batch.calculateWeek();
        if(weekInfo[1]){
            NativeModules.FileManager.addDay(batch.context, (weekInfo[0] + 1), data);
        }else{
            NativeModules.FileManager.addDay(batch.context, weekInfo[0], data);
        }
    }

    static addEggs(batchInformation, data) {
        let batch = new FileManager(batchInformation);
        let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        let currentDay = days[new Date().getDay()];
        let weekInfo = batch.calculateWeek();
        if (weekInfo[1]) {
            NativeModules.FileManager.fetchWeek(batch.context, (weekInfo[0] + 1), (stored)=>{
                let newData;
                if (stored) {
                    newData = JSON.parse(stored);
                    newData.eggs[currentDay] = JSON.parse(data);
                } else {
                    newData = FileManager.createTemplate();
                    newData.eggs[currentDay] = JSON.parse(data);
                }

                newData = JSON.stringify(newData, null, 2);
                // console.log(newData);
                NativeModules.FileManager.addDay(batch.context, (weekInfo[0] + 1), newData);
            });
        } else {
            NativeModules.FileManager.fetchWeek(batch.context, (weekInfo[0]), (stored) => {
                let newData;
                if (stored) {
                    newData = JSON.parse(stored);
                    newData.eggs[currentDay] = JSON.parse(data);
                } else {
                    newData = FileManager.createTemplate();
                    newData.eggs[currentDay] - JSON.parse(data);
                }

                newData = JSON.stringify(newData, null, 2);
                // console.log(newData);
                NativeModules.FileManager.addDay(batch.context, (weekInfo[0]), newData);
            });
        }
    }

    static addFeeds(batchInformation, data){
        let batch = new FileManager(batchInformation);
        let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        let currentDay = days[new Date().getDay()];
        let weekInfo = batch.calculateWeek();
        if (weekInfo[1]) {
            NativeModules.FileManager.fetchWeek(batch.context, (weekInfo[0] + 1), (stored)=>{
                let newData;
                if (stored) {
                    newData = JSON.parse(stored);
                    newData.feeds[currentDay] = data;
                } else {
                    newData = FileManager.createTemplate();
                    newData.feeds[currentDay] = data;
                }

                newData = JSON.stringify(newData, null, 2);
                // console.log(newData);
                NativeModules.FileManager.addDay(batch.context, (weekInfo[0] + 1), newData);
            });
        } else {
            NativeModules.FileManager.fetchWeek(batch.context, (weekInfo[0]), (stored) => {
                let newData;
                if (stored) {
                    newData = JSON.parse(stored);
                    newData.feeds[currentDay] = data;
                } else {
                    newData = FileManager.createTemplate();
                    newData.feeds[currentDay] - data;
                }

                newData = JSON.stringify(newData, null, 2);
                // console.log(newData);
                NativeModules.FileManager.addDay(batch.context, (weekInfo[0]), newData);
            });
        }
    }

    static addCasualties(batchInformation, data){
        let batch = new FileManager(batchInformation);
        let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        let currentDay = days[new Date().getDay()];
        let weekInfo = batch.calculateWeek();
        if (weekInfo[1]) {
            NativeModules.FileManager.fetchWeek(batch.context, (weekInfo[0] + 1), (stored)=>{
                let newData;
                if (stored) {
                    newData = JSON.parse(stored);
                    newData.casualties[currentDay] = data;
                } else {
                    newData = FileManager.createTemplate();
                    newData.casualties[currentDay] = data;
                }

                newData = JSON.stringify(newData, null, 2);
                // console.log(newData);
                NativeModules.FileManager.addDay(batch.context, (weekInfo[0] + 1), newData);
            });
        } else {
            NativeModules.FileManager.fetchWeek(batch.context, (weekInfo[0]), (stored) => {
                let newData;
                if (stored) {
                    newData = JSON.parse(stored);
                    newData.casualties[currentDay] = data;
                } else {
                    newData = FileManager.createTemplate();
                    newData.casualties[currentDay] - data;
                }

                newData = JSON.stringify(newData, null, 2);
                // console.log(newData);
                NativeModules.FileManager.addDay(batch.context, (weekInfo[0]), newData);
            });
        }
    }

    static checkForRecords(batchInformation, type){
        console.log(type);
        let isMounted = true;
        let batch = new FileManager(batchInformation);
        let weeks = batch.calculateWeek();
        let answer = false;
        if (weeks[1]) {
            let response = NativeModules.FileManager.fetchWeeker(batch.context, (weeks[0] + 1));
            if (response) {
                let parsed = JSON.parse(response);
                answer = (parsed[type][batch.days[batch.currentDay]] != null);
            }
            
        } else {
            let response = NativeModules.FileManager.fetchWeeker(batch.context, weeks[0]);
            if (response) {
                let parsed = JSON.parse(response);
                answer = (parsed[type][batch.days[batch.currentDay]] != null);
            }
        }

        console.log("This is an answer " + answer);
        return answer;
    }

    static createTemplate(){
        return {
            eggs: {},
            feeds: {},
        }
    }
}

/*
    static write(){
        const batch = require("./../../Batch II/brief.json");
        // writes the data and makes a "brief" file
        NativeModules.FileManager.create(batch.name, JSON.stringify(batch, null, 2));
        // writing the data files
        let data = require("./../../Batch II/01.json");
        // writes the individual week data
        NativeModules.FileManager.addDay(batch.name, 1, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/02.json");
        NativeModules.FileManager.addDay(batch.name, 2, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/03.json");
        NativeModules.FileManager.addDay(batch.name, 3, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/04.json");
        NativeModules.FileManager.addDay(batch.name, 4, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/05.json");
        NativeModules.FileManager.addDay(batch.name, 5, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/06.json");
        NativeModules.FileManager.addDay(batch.name, 6, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/07.json");
        NativeModules.FileManager.addDay(batch.name, 7, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/08.json");
        NativeModules.FileManager.addDay(batch.name, 8, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/09.json");
        NativeModules.FileManager.addDay(batch.name, 9, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/10.json");
        NativeModules.FileManager.addDay(batch.name, 10, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/11.json");
        NativeModules.FileManager.addDay(batch.name, 11, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/12.json");
        NativeModules.FileManager.addDay(batch.name, 12, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/13.json");
        NativeModules.FileManager.addDay(batch.name, 13, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/14.json");
        NativeModules.FileManager.addDay(batch.name, 14, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/15.json");
        NativeModules.FileManager.addDay(batch.name, 15, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/16.json");
        NativeModules.FileManager.addDay(batch.name, 16, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/17.json");
        NativeModules.FileManager.addDay(batch.name, 17, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/18.json");
        NativeModules.FileManager.addDay(batch.name, 18, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/19.json");
        NativeModules.FileManager.addDay(batch.name, 19, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/20.json");
        NativeModules.FileManager.addDay(batch.name, 20, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/21.json");
        NativeModules.FileManager.addDay(batch.name, 21, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/22.json");
        NativeModules.FileManager.addDay(batch.name, 22, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/23.json");
        NativeModules.FileManager.addDay(batch.name, 23, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/24.json");
        NativeModules.FileManager.addDay(batch.name, 24, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/25.json");
        NativeModules.FileManager.addDay(batch.name, 25, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/26.json");
        NativeModules.FileManager.addDay(batch.name, 26, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/27.json");
        NativeModules.FileManager.addDay(batch.name, 27, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/28.json");
        NativeModules.FileManager.addDay(batch.name, 28, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/29.json");
        NativeModules.FileManager.addDay(batch.name, 29, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/30.json");
        NativeModules.FileManager.addDay(batch.name, 30, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/31.json");
        NativeModules.FileManager.addDay(batch.name, 31, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/32.json");
        NativeModules.FileManager.addDay(batch.name, 32, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/33.json");
        NativeModules.FileManager.addDay(batch.name, 33, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/34.json");
        NativeModules.FileManager.addDay(batch.name, 34, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/35.json");
        NativeModules.FileManager.addDay(batch.name, 35, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/36.json");
        NativeModules.FileManager.addDay(batch.name, 36, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/37.json");
        NativeModules.FileManager.addDay(batch.name, 37, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/38.json");
        NativeModules.FileManager.addDay(batch.name, 38, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/39.json");
        NativeModules.FileManager.addDay(batch.name, 39, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/40.json");
        NativeModules.FileManager.addDay(batch.name, 40, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/41.json");
        NativeModules.FileManager.addDay(batch.name, 41, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/42.json");
        NativeModules.FileManager.addDay(batch.name, 42, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/43.json");
        NativeModules.FileManager.addDay(batch.name, 43, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/44.json");
        NativeModules.FileManager.addDay(batch.name, 44, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/45.json");
        NativeModules.FileManager.addDay(batch.name, 45, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/46.json");
        NativeModules.FileManager.addDay(batch.name, 46, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/47.json");
        NativeModules.FileManager.addDay(batch.name, 47, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/48.json");
        NativeModules.FileManager.addDay(batch.name, 48, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/49.json");
        NativeModules.FileManager.addDay(batch.name, 49, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/50.json");
        NativeModules.FileManager.addDay(batch.name, 50, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/51.json");
        NativeModules.FileManager.addDay(batch.name, 51, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/52.json");
        NativeModules.FileManager.addDay(batch.name, 52, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/53.json");
        NativeModules.FileManager.addDay(batch.name, 53, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/54.json");
        NativeModules.FileManager.addDay(batch.name, 54, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/55.json");
        NativeModules.FileManager.addDay(batch.name, 55, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/56.json");
        NativeModules.FileManager.addDay(batch.name, 56, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/57.json");
        NativeModules.FileManager.addDay(batch.name, 57, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/58.json");
        NativeModules.FileManager.addDay(batch.name, 58, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/59.json");
        NativeModules.FileManager.addDay(batch.name, 59, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/60.json");
        NativeModules.FileManager.addDay(batch.name, 60, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/61.json");
        NativeModules.FileManager.addDay(batch.name, 61, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/62.json");
        NativeModules.FileManager.addDay(batch.name, 62, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/63.json");
        NativeModules.FileManager.addDay(batch.name, 63, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/64.json");
        NativeModules.FileManager.addDay(batch.name, 64, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/65.json");
        NativeModules.FileManager.addDay(batch.name, 65, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/66.json");
        NativeModules.FileManager.addDay(batch.name, 66, JSON.stringify(data, null, 2));
        data = require("./../../Batch II/67.json");
        NativeModules.FileManager.addDay(batch.name, 67, JSON.stringify(data, null, 2));
        }

}

 let fetch = (number) => Object.create((require(`./../../Batch II/${number}.json`)));
*/
let stringify = (number) => (number<10)? `0${number}`: `${number}`
