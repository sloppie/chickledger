import { NativeModules } from 'react-native';
const batch2 = require("./../../__data__/Batcher.json");

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
                let days = (((y == this.currentYear && m==this.currentMonth))? this.currentDate: this.months[m][1]);
                let initial = (y== this.initialYear && m==this.initialMonth)? this.initialDate: 1;
                for(let d=initial; d<=days; d++){
                    offset++;

                    if(!(offset % 7)){
                        weekNumber++;
                    }
                } // days loop
            } //month loop
        } //year loop
        console.log((offset/7) + " weeks," + (offset%7) + " days.")

        return [Math.floor(offset/7), offset%7];
    }

    static choices = {
        "casualties": "casualties",
        "eggs": "eggs",
        "feeds": "feeds"
    };

    static addEggs(batchInformation, data) {
        const key = FileManager.choices.eggs;
        let batch = new FileManager(batchInformation);
        let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        let currentDay = days[new Date().getDay()];
        let weekInfo = batch.calculateWeek();
        if (weekInfo[1]) {
            let oldData = NativeModules.FileManager.fetchWeek(batch.context, key, (weekInfo[0] + 1));
            oldData[days[currentDay]] = data;
            let newData = JSON.parse(oldData, null, 2);
            NativeModules.FileManager.addData(batch.context, key, (weekInfo[0] + 1), newData);
        } else {
            let oldData = NativeModules.FileManager.fetchWeek(batch.context, key, (weekInfo[0]));
            oldData[days[currentDay]] = data;
            let newData = JSON.parse(oldData, null, 2);
            NativeModules.FileManager.addData(batch.context, key, (weekInfo[0]), newData);
        }
    }

    static addFeeds(batchInformation, data){
        const key = FileManager.choices.feeds;
        let batch = new FileManager(batchInformation);
        let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        let currentDay = days[new Date().getDay()];
        let weekInfo = batch.calculateWeek();
        if (weekInfo[1]) {
            let oldData = NativeModules.FileManager.fetchWeek(batch.context, key, (weekInfo[0] + 1));
            oldData[days[currentDay]] = data;
            let newData = JSON.parse(oldData, null, 2);
            NativeModules.FileManager.addData(batch.context, key, (weekInfo[0] + 1), newData);
        } else {
            let oldData = NativeModules.FileManager.fetchWeek(batch.context, key, (weekInfo[0]));
            oldData[days[currentDay]] = data;
            let newData = JSON.parse(oldData, null, 2);
            NativeModules.FileManager.addData(batch.context, key, (weekInfo[0]), newData);
        }
    }

    static addCasualties(batchInformation, data){
        const key = FileManager.choices.casualties;
        let batch = new FileManager(batchInformation);
        let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        let currentDay = days[new Date().getDay()];
        let weekInfo = batch.calculateWeek();
        if (weekInfo[1]) {
            let oldData = NativeModules.FileManager.fetchWeek(batch.context, key, (weekInfo[0] + 1));
            oldData[days[currentDay]] = data;
            let newData = JSON.parse(oldData, null, 2);
            NativeModules.FileManager.addData(batch.context, key, (weekInfo[0] + 1), newData);
        } else {
            let oldData = NativeModules.FileManager.fetchWeek(batch.context, key, (weekInfo[0]));
            oldData[days[currentDay]] = data;
            let newData = JSON.parse(oldData, null, 2);
            NativeModules.FileManager.addData(batch.context, key, (weekInfo[0]), newData);
        }
    }

    static fetchCategory(name, key) {
        NativeModules.FileManager.fetchCategory(name, key);
    }

    static checkForRecords(batchInformation, type){
        let batch = new FileManager(batchInformation);
        let weeks = batch.calculateWeek();
        let answer = false;
        if (weeks[1]) {
            let response = NativeModules.FileManager.fetchWeek(batch.context, type, (weeks[0] + 1));
            if (response) {
                let parsed = JSON.parse(response);
                answer = (parsed[batch.days[batch.currentDay]] != null);
            }
        } else {
            let response = NativeModules.FileManager.fetchWeek(batch.context, type, weeks[0]);
            if (response) {
                let parsed = JSON.parse(response);
                answer = (parsed[batch.days[batch.currentDay]] != null);
            }
        }

        return answer;
    }

    static batchExists(name) {
        return NativeModules.FileManager.batchExists(name);
    }

    static write() {
        const {batchInformation} = batch2;
        console.log(JSON.stringify(batchInformation, null, 2))
        let data = JSON.stringify(batchInformation, null, 2);

        NativeModules.FileManager.create(batchInformation.name, data, (success, err) => {
            if(success)
                console.log("Success writing batch 2");
            else
                console.log("Error writing to storage");
        });

        const {batchWeeks} = batch2;

        batchWeeks.forEach((element, index) => {
            for(let i in element) {
                let data = JSON.stringify(element[i], null, 2);
                let weekNumber = index + 1;
                NativeModules.FileManager.addData(batchInformation.name, i, weekNumber, data);
            }
        });
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
        data = require("./../../Batch II/68.json");
        NativeModules.FileManager.addDay(batch.name, 68, JSON.stringify(data, null, 2));
        }

}

//  let fetch = (number) => Object.create((require(`./../../Batch II/${number}.json`)));

let stringify = (number) => (number<10)? `0${number}`: `${number}`
*/
