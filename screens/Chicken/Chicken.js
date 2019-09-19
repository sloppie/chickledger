import React, { Component } from 'react';
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  Button,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';


import Theme from '../../theme/Theme';

import ChickenTab from './Fragments/CasualtiesTab';
import ProduceTab, { WeeklyCard }from './Fragments/ProduceTab';
import FeedsTab, { FeedCard } from './Fragments/FeedsTab';
import FloatingActionButton from './Fragments/FloatingActionButton';

import FileManager from "./../../utilities/FileManager";

const BinaryTree = require("./../../utilities/DataStructures/BinarySearchTrees").BinarySearchTree;
/**
 * !TODO: Redefine the heights from line: 203
 * !TODO export the components to a single file in the Fragments
 */

/**
 * ChickenTab retrieves data from The Engine of the app
 * To avoid Child Components from altering components,
 * all the WRITE queries are sent through the Chicken Component
 * This is done by passing a pipe that will allow open communication between
 * the child components and the Parent
 * Props passed to the component:
 * `this.props.context` is the name of the batch. Used to query the back end using the context as a batchName
 * `` 
 * @method
 */
let now = 0;
export default class Chicken extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: [true, false, false],
      context: 0,
      eggs: null,
      feeds: null,
      casualties: null,
      now: 0,
    };
    this.now = 0;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.now == this.length || nextState.context !== this.state.context
  }
  
  componentDidMount(){
    let batchInformation = this.props.navigation.getParam("batchInformation", {});
    let length = new FileManager(batchInformation).calculateWeek();
    this.length = (length[1])? (length[0] + 1): length[0];
    // console.log((batchInformation)?"batchInfo exists": "batchInfo not found");
    NativeModules.FileManager.fetchBatch(batchInformation.name, (error) => {
      if(error){
        console.log(error);
      }
    });

    this.subscription =  DeviceEventEmitter.addListener("readFile", this.updateState);
    // this.tab = this.renderTab();
  }

  componentWillMount() {

  }

  componentWillUnmount(){
    this.subscription.remove();
  }

  componentWillUpdate() {
    // this.tab = this.renderTab();
  }

  updateState = (data) => {
    let key = Object.keys(data)[0];
    if(key.toLowerCase() == 'brief') return;
    let number = Number(key);
    let refined = JSON.parse(data[key])
    let {eggs, feeds, casualties} = refined;
    let eggData = {}, feedData = {}, casualtyData = {};
    eggData.eggs = <WeeklyCard week={eggs} key={number} weekNumber={number}/>
    feedData.feeds = <FeedCard week={feeds} key={number} weekNumber={number}/>
    eggData.weekNumber = number;
    feedData.weekNumber = number;
    casualtyData.weekNumber = number;

    if(!this.state.eggs) {
      this.setState({
        eggs: new BinaryTree(eggData),
        feeds: new BinaryTree(feedData),
        casualties: new BinaryTree(casualtyData)
      });
    } else if(this.state.eggs instanceof BinaryTree){
      this.state.eggs.add(eggData);
      this.state.feeds.add(feedData);
      this.state.casualties.add(casualtyData);
    } else {
      return;
    }
    // console.log(Object.keys(refined.data));
    this.setState({
      now: this.state.now + 1
    })

    if(this.length == this.state.now) {
      for(let i=0; i<3; i++) {
        let ctxt = (i==0)? "eggs":(i==1)? "feeds": "casualties";
        let answer = [];
        if(ctxt == "eggs"){
          this.state.eggs.visit(answer);
          this.setState({
            eggs: answer.reverse()
          })
        }else if(ctxt == "feeds"){
          this.state.feeds.visit(answer);
          this.setState({
            feeds: answer.reverse()
          })
        } else{
          this.state.casualties.visit(answer);
          this.setState({
            casualties: answer.reverse()
          })
        }
        // console.log(answer);
      }
    }
  }

  switchToTab = (index) => {
    console.log(index);
    let activeTab = [false, false, false];

    for (let i = 0; i < 3; i++) {
      if (i === index) activeTab[i] = true;
    }

    this.setState({
      activeTab,
      context: index,
    });
    // this.tab = this.renderTab();
  }


  fetchData() {

  }

  renderTab() {
    let index = this.state.activeTab.indexOf(true);
    let { batchInformation } = this.props;
    // console.log(`This is index: ${index}`)

    if (index == 0)
      return <ChickenTab />;
    else if (index == 1)
      return (
          <ProduceTab batchInformation={batchInformation} data={this.state.eggs}/>
      );
    else
      return (
          <FeedsTab batchInformation={batchInformation} data={this.state.feeds}/>
      );
  }

  render() {
    let batchInformation = this.props.navigation.getParam("batchInformation", {});
    let tab = this.renderTab();
    return (
      <View style={styles.chickenNav}>
        <View style={styles.header}></View>
        <View style={styles.navigationTab}>
          {(this.state.activeTab[0]) ? <TouchableHighlight underlayColor={Theme.PARAGRAPH_COLOR} onPress={this.switchToTab.bind(this, 0)} style={styles.activeTab}><Text style={styles.tabText}>CHICKEN</Text></TouchableHighlight> : <TouchableHighlight underlayColor={Theme.PARAGRAPH_COLOR} onPress={this.switchToTab.bind(this, 0)} style={styles.dormantTab}><Text style={styles.tabText}>CHICKEN</Text></TouchableHighlight>}
          {(this.state.activeTab[1]) ? <TouchableHighlight underlayColor={Theme.PARAGRAPH_COLOR} onPress={this.switchToTab.bind(this, 1)} style={styles.activeTab}><Text style={styles.tabText}>PRODUCE</Text></TouchableHighlight> : <TouchableHighlight underlayColor={Theme.PARAGRAPH_COLOR} onPress={this.switchToTab.bind(this, 1)} style={styles.dormantTab}><Text style={styles.tabText}>PRODUCE</Text></TouchableHighlight>}
          {(this.state.activeTab[2]) ? <TouchableHighlight underlayColor={Theme.PARAGRAPH_COLOR} onPress={this.switchToTab.bind(this, 2)} style={styles.activeTab}><Text style={styles.tabText}>FEEDS</Text></TouchableHighlight> : <TouchableHighlight underlayColor={Theme.PARAGRAPH_COLOR} onPress={this.switchToTab.bind(this, 2)} style={styles.dormantTab}><Text style={styles.tabText}>FEEDS</Text></TouchableHighlight>}
        </View>

        {tab}

        <View style={{
          position: "absolute",
          bottom: 40,
          right: 16,
          zIndex: 2,
          alignSelf: "flex-end",
          display: ((this.state.context != 0) ? "flex" : "none"),
        }}>
          <FloatingActionButton context={this.state.context} batchInformation={batchInformation} navigation={this.props.navigation} />
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  chickenNav: {
    height: Dimensions.get("window").height,
  },
  header: {
    height: 50,
  },
  navigationTab: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dormantTab: {
    padding: 8,
    flex: 1,
  },
  activeTab: {
    padding: 8,
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: Theme.PRIMARY_COLOR_DARK,
  },
  tabText: {
    fontSize: 18,
    textAlign: "center",
    color: Theme.PRIMARY_COLOR_DARK,
    fontWeight: Theme.HEADER_WEIGHT,
  },
  chickenTab: {
    // display: "none",
  },
  productionCard: {
    flex: 1,
    zIndex: 1,
    elevation: 2,
    marginTop: 8,
  },
  produceTab: {
    maxHeight: (Dimensions.get("window").height - 150),
    // maxHeight: 200,
  },
  FAB: {
    position: "absolute",
    bottom: 40,
    right: 16,
    zIndex: 2,
    alignSelf: "flex-end"
  },
});
