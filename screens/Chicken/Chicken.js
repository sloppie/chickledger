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
import ViewPager from '@react-native-community/viewpager';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

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
// let answer2;
export default class Chicken extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: [true, false, false],
      promises : [],
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
    // console.log(JSON.stringify(batchInformation, null, 2));
    let length = new FileManager(batchInformation).calculateWeek();
    this.length = (length[1])? (length[0] + 1): length[0];
    // NativeModules.FileManager.fetchBatch(batchInformation.name, (error) => {
    //   if(error){
    //     console.log(error);
    //   }
    // });

    // this.subscription =  DeviceEventEmitter.addListener("readFile", this.updateState);
  }

  componentWillMount() {

  }

  componentWillUnmount() {
    // this.subscription.remove();
  }

  componentWillUpdate() {
    // this.tab = this.renderTab();
  }

  handleBatches = (data) => {
    this.state.promises.push(this.updateState(data));
  }

  updateState = (data) => {
    let key = Object.keys(data)[0];
    if (key.toLowerCase() == 'brief') return;
    let number = Number(key);
    let refined = JSON.parse(data[key])
    let { eggs, feeds, casualties } = refined;
    let eggData = {}, feedData = {}, casualtyData = {};
    eggData.eggs = eggs;
    feedData.feeds = feeds;
    casualtyData.casualties = casualties;
    eggData.weekNumber = number;
    feedData.weekNumber = number;
    casualtyData.weekNumber = number;

    eggData.key = `${number}`;
    feedData.key = `${number}`;
    casualtyData.key = `${number}`;
    if (!this.state.eggs) {
      this.setState({
        eggs: new BinaryTree(eggData),
        feeds: new BinaryTree(feedData),
        casualties: new BinaryTree(casualtyData)
      });
    } else if (this.state.eggs instanceof BinaryTree) {
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

    if (this.length == this.state.now) {
      for (let i = 0; i < 3; i++) {
        let ctxt = (i == 0) ? "eggs" : (i == 1) ? "feeds" : "casualties";
        let answer = [];
        if (ctxt == "eggs") {
          this.state.eggs.visit(answer);
          this.setState({
            eggs: answer.reverse()
          })
        } else if (ctxt == "feeds") {
          this.state.feeds.visit(answer);
          this.setState({
            feeds: answer.reverse()
          })
        } else {
          this.state.casualties.visit(answer);
          let answer2 = answer;
          let promise;
          this.setState({
            casualties: new Promise((resolve, reject) => {resolve(answer2.reverse())})
          })
        }
        // console.log(answer);
      }
      // resolve();
    } else {
      // resolve();
    }
  }

  switchToTab = (index) => {
    // console.log(Object.keys(index));
    console.log(index.nativeEvent.position);
    // for(let i in index) {
      //   console.log(i + " is a: " +typeof index[i])
      // }
      let activeTab = [false, false, false];
      let tab = index.nativeEvent.position;

    for (let i = 0; i < 3; i++) {
      activeTab[i] = (i === tab);
    }

    this.setState({
      activeTab,
      context: tab,
    });
    // this.tab = this.renderTab();
  }


  fetchData() {

  }

  renderTab() {
    let index = this.state.activeTab.indexOf(true);
    let { batchInformation } = this.props;
    // console.log(`This is index: ${index}`)
        if(index == 0)
          return <ProduceTab batchInformation={batchInformation} data={this.state.eggs}/>
        else if (index == 1)
        return (
              <FeedsTab batchInformation={batchInformation} data={this.state.feeds}/>
          );
          else
          return (
              (this.state.casualties instanceof Promise)?<ChickenTab batchInformation={batchInformation} data={this.state.casualties}/>: <View />
          );
      }
      
    render() {
    let batchInformation = this.props.navigation.getParam("batchInformation", {});

    const TopTab = createAppContainer(createMaterialTopTabNavigator(
      {
        Produce: {
          screen: (props) => <ProduceTab batchInformation={batchInformation} />,
        },
        Feeds: {
          screen: (props) => <FeedsTab batchInformation={batchInformation} />
        },
        Chicken: {
          screen: (props) => <ChickenTab batchInformation={batchInformation}/>
        }
      },
      {
        initialRouteName: "Produce",
        tabBarOptions: {
          style: {
            backgroundColor: Theme.PRIMARY_COLOR_DARK,
          },
          scrollEnabled: true,
        },
        tabBarPosition: 'top',
        swipeEnabled: true,
        backBehavior: "order",
        animationEnabled: true,
        lazy: true,
      }
    ));

    // let tab = this.renderTab();
    // let {promises} = this.state;
    // Promise.all(promises).then((values) => tab = this.renderTab());
    // first change spotted!
    return (
      <View style={styles.chickenNav}>
        {/* <View style={styles.header}></View>
        <View style={styles.navigationTab}>
          <TouchableHighlight 
            underlayColor={Theme.PARAGRAPH_COLOR} 
            onPress={this.switchToTab.bind(this, 0)} 
            style={[styles.dormantTab, (this.state.activeTab[0]) ? styles.activeTab : null]}
            >
              <Text style={styles.tabText}>PRODUCE</Text>
          </TouchableHighlight>
          <TouchableHighlight 
            underlayColor={Theme.PARAGRAPH_COLOR} 
            onPress={this.switchToTab.bind(this, 1)} 
            style={[styles.dormantTab, (this.state.activeTab[1]) ? styles.activeTab : null]}
            >
              <Text style={styles.tabText}>FEEDS</Text>
          </TouchableHighlight>
          <TouchableHighlight 
            underlayColor={Theme.PARAGRAPH_COLOR} 
            onPress={this.switchToTab.bind(this, 2)} 
            style={[styles.dormantTab, (this.state.activeTab[2]) ? styles.activeTab : null]}
            >
              <Text style={styles.tabText}>CHICKEN</Text>
          </TouchableHighlight>
        </View>

        <ViewPager
          style={{flex: 1, maxHeight: (Dimensions.get("window").height -150)}}
          initialPage={0}
          onPageSelected={this.switchToTab}
        >
          <View key="0">
            <ProduceTab batchInformation={batchInformation} data={this.state.eggs} />
          </View>
          <View key="1">
            <FeedsTab batchInformation={batchInformation} data={this.state.feeds} />
          </View>
          <View key="2">
            <ChickenTab batchInformation={batchInformation} data={this.state.casualties}/>
          </View>
        </ViewPager>

        <View style={{
          position: "absolute",
          bottom: 40,
          right: 16,
          zIndex: 2,
          alignSelf: "flex-end",
          display: ((this.state.context != 0) ? "flex" : "none"),
        }}>
          <FloatingActionButton context={this.state.context} batchInformation={batchInformation} navigation={this.props.navigation} />
        </View> */}
        <TopTab />
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
});/*
let data = NativeModules.FileManager.fetchWeeker("Batch II", 67);
if(!data) {
  FileManager.write();
} else {
  console.log(data);
}
*/
