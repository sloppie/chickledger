import { NativeModules } from 'react-native';

const brief = require('./../../data/brief.json');
const casualties = require('./../../data/casualties.json');
const eggs = require('./../../data/eggs.json');
const feeds = require('./../../data/feeds.json');

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

        return [Math.floor(offset/7), offset%7];
    }

    static choices = {
        "casualties": "casualties",
        "eggs": "eggs",
        "feeds": "feeds"
    };

    /**
     * 
     * @param {Object} batchInformation is the informatio pertaining to the relevant batch
     * @param {Object} data is the data to be added to the feeds store
     * 
     * data received is in the form below: (the data is stringified)
     * ```js
     *  {
     *      normalEggs: Number,
     *      smallerEggs: Number,
     *      largerEggs: Number,
     *      brokenEggs: Number
     *  }
     * ```
     * the data added to the pre-existing matrix is in the form: 
     * ```js
     *  [normalEggs, brokenEggs, smallerEggs, largerEggs, sum] 
     * ```
     */
    static addEggs(batchInformation, data) {
        const key = FileManager.choices.eggs;
        let batch = new FileManager(batchInformation);
        let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        let currentDay = days[new Date().getDay()];
        let weekInfo = batch.calculateWeek();
        let parsedData = JSON.parse(data);
        let previousData;
        NativeModules.FileManager.fetchData(batch.context, "eggs", (oldData) => {
            let {normalEggs, smallerEggs, largerEggs, brokenEggs} = parsedData;
            previousData = JSON.parse(oldData);
            let newDay = [normalEggs, brokenEggs, smallerEggs, largerEggs];
            let sum = newDay[0] + newDay[1] + newDay[2] + newDay[3];
            newDay.push(sum);

            if(weekInfo[1]) {
                let cd = (weekInfo[1] - 1);
                // adds to the current day offset to the newly incomplete week
                previousData[weekInfo[0]][cd] = newDay;
            } else {
                let pi = (weekInfo[0] - 1);
                // adds to the last day of the unfinished week
                previousData[pi][6] = newDay;
            }

            NativeModules.FileManager.addData("Batch II", "eggs", JSON.stringify(previousData, null, 2));
        });

    }

    /**
     * 
     * @param {Object} batchInformation is the informatio pertaining to the relevant batch
     * @param {Object} data is the data to be added to the feeds store
     * 
     * data received is in the form below: (the data is stringified)
     * ```js
     *  {
     *      date: Date,
     *      number: Number
     *  }
     * ```
     * the resultant stored matrix is in the form:
     * ```js 
     * [number:Number, date:Date]
     * ```
     */
    static addFeeds(batchInformation, data){
        const key = FileManager.choices.feeds;
        let batch = new FileManager(batchInformation);
        let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        let currentDay = days[new Date().getDay()];
        let weekInfo = batch.calculateWeek();
        let {date, number} = JSON.parse(data);
        let previousData;
        let newData = [number, date];

        NativeModules.FileManager.fetchData(batch.context, "feeds", (oldData) => {
            if(oldData) {
                previousData = JSON.parse(oldData);
                if(weekInfo[1]) {
                    if(previousData[weekInfo[0]] instanceof Array) {
                        previousData[weekInfo[0]].push();
                    } else {
                        previousData[weekInfo[0]] = [];
                        previousData[weekInfo[0]].push(newData);
                    }
                } else {
                    let pi = (weekInfo[0] - 1);
                    if(previousData[pi] instanceof Array) {
                        previousData[pi].push(newData);
                    } else {
                        previousData[pi] = [];
                        previousData[pi].push(newData);
                    }
                }
            } else {
                previousData = [[]];
                previousData[0].push(newData);
            }

            NativeModules.FileManager.addData("Batch II", "feeds", JSON.stringify(previousData, null, 2));
        });

    }

    /**
     * 
     * @param {Object} batchInformation is the informatio pertaining to the relevant batch
     * @param {Object} data is the data to be added to the feeds store
     * 
     * data received is in the form below: (the data is stringified)
     * ```js
     *  {
     *      date: Date,
     *      number: Number,
     *      description: String
     *  }
     * ```
     * The new data to be added to the matrix is in the form:
     * ```js
     *  [date:String, number:Number, description:String]
     * ```
     */
    static addCasualties(batchInformation, data){
        const key = FileManager.choices.casualties;
        let batch = new FileManager(batchInformation);
        let days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        let currentDay = days[new Date().getDay()];
        let weekInfo = batch.calculateWeek();
        let parsedData = JSON.parse(data);
        let {date, number, description} = parsedData;
        let previousData;
        let newData = [date, number, description];

        NativeModules.FileManager.fetchData(batch.context, "casualties", (oldData) => {
            if (oldData) {
                previousData = JSON.parse(oldData);
                if (weekInfo[1]) {
                    if (previousData[weekInfo[0]] instanceof Array) {
                        previousData[weekInfo[0]].push(newData);
                    } else {
                        previousData[weekInfo[0]] = [];
                        previousData[weekInfo[0]].push(newData);
                    }
                } else {
                    let pi = (weekInfo[0] - 1);
                    if (previousData[pi] instanceof Array) {
                        previousData[pi].push(newData);
                    } else {
                        previousData[pi] = [];
                        previousData[pi].push(newData);
                    }
                }
            } else {
                previousData = [[]];
                previousData[0].push(newData);
            }

            NativeModules.FileManager.addData("Batch II", "casualties", JSON.stringify(previousData, null, 2));
        });
    }

    static checkForRecords(batchInformation, type){
        
    }

    static batchExists(name) {
        return NativeModules.FileManager.batchExists(name);
    }

    static write() {
        NativeModules.FileManager.create(brief.name, JSON.stringify(brief, null, 2), (success, err) => {
            if(success) {
                NativeModules.FileManager.addData(brief.name, "feeds", JSON.stringify(feeds));
                NativeModules.FileManager.addData(brief.name, "eggs", JSON.stringify(eggs));
                NativeModules.FileManager.addData(brief.name, "casualties", JSON.stringify(casualties));
            }
        });
    }
}
