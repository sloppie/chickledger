import React, { Component } from 'react';
import {
    View,
    TextInput,
    Text,
    Alert,
    StyleSheet,
    Button,
    Dimensions,
} from 'react-native';

import FileManager from '../../utilities/FileManager';
import Theme from '../../theme/Theme';

// !TODO add an instructional View at the end of the AddInventory Component to help the user fill in data correctly

export default class AddInventory extends Component{
    constructor(props){
        super(props);
    }

    render(){
        const { navigation } = this.props;
        const batchInformation = navigation.getParam("batchInformation", {});
        let context = navigation.getParam("context", "Not Founnd");
        console.log(context);
        return(
            <View>
                {(context.toLowerCase() === "eggs")? <Eggs batchInformation={batchInformation} navigation={navigation}/>: <Feeds batchInformation={batchInformation} navigation={navigation}/>}
            </View>
        );
    }
}

class Feeds extends Component{
    constructor(props){
        super(props);

        this.state = {
            number: 0,
            date: new Date().toLocaleDateString(),
        };
    }

    onInput = (value) => {
        this.setState({
            number: Number(value),
        });
    }

    formatData = () => {
        let {number, date} = this.state
        let data = {
            date,
            number,
        };

        return JSON.stringify(data, null, 2);
    }

    sendData = (data) => {
        let { batchInformation } = this.props;
        FileManager.addFeeds(batchInformation, data);
        this.props.navigation.goBack();
    }

    alert = () => {
        let data = this.formatData();
        Alert.alert(
            "Confirm Submission",
            `Date: ${this.state.date}\nFeeds Consumed: ${this.state.number}`,
            [
                {
                    text: "Cancel",
                    onPress: () => {
                        console.log("Button Cancelled");
                    },
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: () => {
                        this.sendData(data);
                    },
                }
            ],
            { cancelable: false }
        );
    }

    render(){
        return (
            <View>
                <Text>Date: {this.state.date}</Text>
                <TextInput
                    style={styles.number}
                    onChangeText={this.onInput}
                    keyboardType="numeric"/>
                <Button 
                    style={styles.button}
                    title="Submit"
                    onPress={this.alert}
                />
            </View>
        );
    }
}

class Eggs extends Component{
    constructor(props){
        super(props);

        this.state = {
            normalEggs: 0,
            brokenEggs: 0,
            smallerEggs: 0,
            largerEggs: 0,
        };
    }

    NEChange = (value) => {
        this.setState({
            normalEggs: Number(value),
        });
    }

    BEChange = (value) => {
        this.setState({
            brokenEggs: Number(value),
        });
    }

    SEChange = (value) => {
        this.setState({
            smallerEggs: Number(value),
        });
    }

    LEChange = (value) => {
        this.setState({
            largerEggs: Number(value),
        });
    }

    formatData = () => {
        let { batchInformation } = this.props;
        console.log(`This is batch information from AI:\n${batchInformation}`)
        let { population } = batchInformation.population[0];
        console.log(population);

        let {
            normalEggs,
            brokenEggs,
            largerEggs,
            smallerEggs
        } = this.state;

        let data = {
            normalEggs,
            brokenEggs,
            largerEggs,
            smallerEggs
        };

        console.log(JSON.stringify(data, null, 2));

        var sum = 0;
        for (let key in data) {
            console.log(data[key]);
            sum += data[key];
        }

        console.log(sum);
        if(sum <= population)
            return JSON.stringify(data, null, 2);
        else{
            this.reenterValues(sum);
            return null;
        }
    }

    reenterValues(sum){
        Alert.alert(
            "Too Many Eggs",
            `The total number of eggs entered: ${sum} exceed the population of the chicken`,
            [
                {
                    text: "Revise Values",
                    onPress: () => { console.log("Agreed to revise") }
                }
            ]
        );
    }

    sendData(data){
        let { batchInformation } = this.props;
        FileManager.addEggs(batchInformation, data);
        this.props.navigation.goBack();
    }

    alert = () => {
        let finalData = this.formatData();
        if(finalData){
            Alert.alert(
                "Confirm Submission",
                `Normal Eggs: ${this.state.normalEggs}\nBroken Eggs: ${this.state.brokenEggs}\nLarger Eggs: ${this.state.largerEggs}\nSmaller Eggs: ${this.state.smallerEggs}`,
                [
                    {
                        text: "Cancel",
                        onPress: () => {
                            console.log("Cancel Pressed");
                        },
                        style: "cancel",
                    },
                    {
                        text: "Confirm",
                        onPress: () => {
                            this.sendData(finalData);
                        },
                        style: "default",
                    },
                ],
                { cancelable: false }
            );
        }
    }

    render(){
        return (
            <View>
                <Text>Normal Eggs: </Text>
                <TextInput 
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.NEChange}
                />
                <Text>Broken Eggs: </Text>
                <TextInput 
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.BEChange}
                />
                <Text>Larger Eggs: </Text>
                <TextInput 
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.LEChange}
                />
                <Text>Smaller Eggs: </Text>
                <TextInput 
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.SEChange}
                />
                <Button
                    style={styles.button}
                    title="Submit"
                    onPress={this.alert}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    eggs: {
        borderBottomColor: Theme.PRIMARY_COLOR_DARK,
        borderBottomWidth: 2,
    },
    textInput: {
        borderBottomColor: Theme.PRIMARY_COLOR_DARK,
        borderBottomWidth: 2,
    },   
});



/**
 * ```js
 *  let weekData = {
 *      // week starts at monday
 *    eggs: {
 *      "monday": {
 *          normalEggs: 30.15,
 *          brokenEggs: 0.40,
 *          smallerEggs: 0.50,
 *          largerEggs: 0.30          
 *      },
 *      "tuesday": {
 *          normalEggs: 30.15,
 *          brokenEggs: 0.40,
 *          smallerEggs: 0.50,
 *          largerEggs: 0.30          
 *      },
 *      "wednesday": {
 *          normalEggs: 30.15,
 *          brokenEggs: 0.40,
 *          smallerEggs: 0.50,
 *          largerEggs: 0.30          
 *      },
 *      "thursday": {
 *          normalEggs: 30.15,
 *          brokenEggs: 0.40,
 *          smallerEggs: 0.50,
 *          largerEggs: 0.30          
 *      },
 *      "friday": {
 *          normalEggs: 30.15,
 *          brokenEggs: 0.40,
 *          smallerEggs: 0.50,
 *          largerEggs: 0.30          
 *      },
 *      "saturday": {
 *          normalEggs: 30.15,
 *          brokenEggs: 0.40,
 *          smallerEggs: 0.50,
 *          largerEggs: 0.30          
 *      },
 *      "sunday": {
 *          normalEggs: 30.15,
 *          brokenEggs: 0.40,
 *          smallerEggs: 0.50,
 *          largerEggs: 0.30          
 *      }
 *    },
 *    feeds: {
 *      "monday": 8,
 *      "wednesday": 7,
 *      "friday": 8,
 *      "sunday": 8,
 *    },  
 *  };
 * ```
 */
