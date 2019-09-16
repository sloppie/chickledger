import React, { Component } from 'react';
import {
    View,
    TextInput,
    Text,
    Alert,
    StyleSheet,
    Button,
    TouchableHighlight,
    Dimensions,
} from 'react-native';

import Icon from 'react-native-ionicons';

import FileManager from '../../utilities/FileManager';
import Theme from '../../theme/Theme';

// !TODO add an instructional View at the end of the AddInventory Component to help the user fill in data correctly

export default class AddInventory extends Component{
    constructor(props){
        super(props);
        this.state = {
            exists: false,
        };
        this._isMounted = false;
    }

    componentDidMount(){
        this._isMounted = true;
        let context = this.props.navigation.getParam('context', 'eggs');
        let batchInformation = this.props.navigation.getParam('batchInformation', null)
        this.setState({
            exists: this._isMounted && FileManager.checkForRecords(batchInformation, context.toLowerCase())
        });
    }

    displayForm = () => {
        this.setState({
            exists: false,
        });
    }
    renderPage = (context, batchInformation, navigation) => {
        if (this.state.exists) {
            return (
                <View style={styles.lockedPage}>
                    <TouchableHighlight
                        onPress={this.displayForm}
                    >
                        <Icon style={{textAlign: "center"}} name="lock" size={45}/>
                    </TouchableHighlight>
                    <Text style={styles.info}>{`This icon appears because you already input data for today\nIf you would like to reenter the data, please press the lock icon`}</Text>
                </View>
            )
        } else {
            return (
                <View >
                    {(context.toLowerCase() === "eggs") ? <Eggs batchInformation={batchInformation} navigation={navigation} /> : <Feeds batchInformation={batchInformation} navigation={navigation} />}
                </View>
            );
        }
    }

    render(){
        const { navigation } = this.props;
        const batchInformation = navigation.getParam("batchInformation", {});
        let context = navigation.getParam("context", "Not Founnd");
        console.log(context);
        return (
            this.renderPage(context, batchInformation, navigation)
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
            normalEggs: "0.0",
            brokenEggs: "0.0",
            smallerEggs: "0.0",
            largerEggs: "0.0",
        };
    }

    NEChange = (value) => {
        this.setState({
            normalEggs: value,
        });
    }

    BEChange = (value) => {
        this.setState({
            brokenEggs: value,
        });
    }

    SEChange = (value) => {
        this.setState({
            smallerEggs: value,
        });
    }

    LEChange = (value) => {
        this.setState({
            largerEggs: value,
        });
    }

    formValidation = () => {
        let data = this.state;
        let validatedData = {};
        let globalSum = 0;
        for(let key in data){
            let inputData = data[key];
            let splitData = inputData.split(".");
            inputData = splitData;
            inputData[0] = (Number(inputData[0]) * 30);
            if(inputData[1] > 29) {
                let title = "Invalid Data";
                let message = `The data entered for eggs is invalid\n${splitData.join(".")}; value ${splitData[1]} could fill a tray\nSolution:\n\nTry: ${key} = ${Number(splitData[0]) + Math.floor(Number(splitData[1])/30)}.${Number(splitData[1])%30}`;
                this.reenterValues(title, message);
                return null;
            }
            let sum = inputData[0] + Number(inputData[1]);
            globalSum += sum;
            validatedData[key] = sum;
        }

        return validatedData;
    }

    formatData = () => {
        let { batchInformation } = this.props;
        console.log(`This is batch information from AI:\n${batchInformation}`)
        let { population } = batchInformation.population[0];
        if (this.formValidation()){
            console.log(this.formValidation());
    
            let {
                normalEggs,
                brokenEggs,
                largerEggs,
                smallerEggs
            } = this.formValidation();
    
            let data = {
                normalEggs,
                brokenEggs,
                largerEggs,
                smallerEggs
            };
    
            console.log("Egg Number below");
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
                let title = "Too many eggs";
                let message = "The values you entered add up to an excess value of eggs: " + sum + "eggs.\n\nConsider revising the values "
                this.reenterValues(title, message);
                return null;
            }
        }
    }

    reenterValues(title, message){
        Alert.alert(
            title,
            message,
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
        this.formValidation();
        let finalData = this.formatData();
        if(finalData){
            Alert.alert(
                "Confirm Submission",
                `Normal Eggs: ${this.state.normalEggs.split(".")[0]} trays, ${this.state.normalEggs.split(".")[1]} eggs\nBroken Eggs: ${this.state.brokenEggs.split(".")[0]} trays, ${this.state.brokenEggs.split(".")[1]} eggs\nLarger Eggs: ${this.state.largerEggs.split(".")[0]} trays, ${this.state.largerEggs.split(".")[1]} eggs\nSmaller Eggs: ${this.state.smallerEggs.split(".")[0]} trays, ${this.state.smallerEggs.split(".")[1]} eggs`,
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
    lockedPage: {
        minHeight: Dimensions.get("window").height,
        alignContent: "center",
        justifyContent: "center",
    },
    info: {
        textAlign: "center",
        color: Theme.HEADER_COLOR,
        fontWeight: Theme.NORMAL_WEIGHT,
    },
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
