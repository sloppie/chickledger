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

import Icon from 'react-native-ionicons';
import { LineChart } from 'react-native-chart-kit';

import Theme from '../../theme/Theme';
import FloatingActionButton from './Fragments/FloatingActionButton';

import FileManager from "./../../utilities/FileManager";

const BinaryTree = require("./../../utilities/DataStructures/BinarySearchTrees").BinarySearchTree;
/**
 * !TODO: Redefine the heights from line: 203
 * !TODO export the components to a single file in the Fragments
 */

class EWC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
    };
  }

  render() {
    return (
      <View style={{
        elevation: 2,
        display: this.state.visible ? "flex" : "none",
      }}>
        <View style={EWCStyles.card}>
          <Button
            title="Show"
            onPress={() => {
              this.setState({
                visible: !this.state.visible,
              });
            }}
          />
        </View>
      </View>
    );
  }
}

let EWCStyles = StyleSheet.create({
  card: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: Theme.PRIMARY_COLOR_DARK,
  },
});

/**
 * 
 * This Component displays Eggs produce per day and is grouped with weeks
 * `this.props.weekNumber` contains the week's object
 * ```js
 *  this.props.weekNumber = {
 *    weekNumber: Number,
 *    MON: {
 *      normalEggs: Number,
 *      brokenEggs: Number,
 *      largerEggs: Number,
 *      smallerEggs: Number,
 *    },
 *    ...
 *    // Goes on the same for all other days of the week
 *    ...
 *  };
 * ```
 */
class WeeklyCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      expandDayCard: false,
    };
  }

  expand = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  feedsCard = () => {

  }

  renderDay() {

  }

  render() {
    let copiedStyles = Object.create(WCStyles.expanded);
    copiedStyles.display = this.state.expanded ? "flex" : "none";
    return (
      <View style={WCStyles.card}>
        <TouchableHighlight onPress={this.expand} >
          <View style={WCStyles.summary}>
            <View style={WCStyles.cardInfo}>
              <Text style={WCStyles.cardTitle}>WEEK {Math.round(Math.random() * 52)}</Text>
              <Text style={WCStyles.totalTally}>Total Tally: {Math.round(Math.random() * 1500 * 7)}</Text>
            </View>
            <Icon name={this.state.expanded ? "arrow-dropup-circle" : "arrow-dropdown-circle"} style={WCStyles.expand} />
          </View>
        </TouchableHighlight>
        <View style={copiedStyles}>
          <View style={WCStyles.day}>
            <Text style={WCStyles.dayText}>MON: {Math.round(Math.random() * 1500)}</Text>
            <TouchableHighlight onPress={() => { console.log("Hello") }}>
              <Icon name="create" style={WCStyles.editIcon} />
            </TouchableHighlight>
          </View>
          <View style={WCStyles.day}>
            <Text style={WCStyles.dayText}>TUE: {Math.round(Math.random() * 1500)}</Text>
            <TouchableHighlight onPress={() => { console.log("Hello") }}>
              <Icon name="create" style={WCStyles.editIcon} />
            </TouchableHighlight>
          </View>
          <View style={WCStyles.day}>
            <Text style={WCStyles.dayText}>WED: {Math.round(Math.random() * 1500)}</Text>
            <TouchableHighlight onPress={() => { console.log("Hello") }}>
              <Icon name="create" style={WCStyles.editIcon} />
            </TouchableHighlight>
          </View>
          <View style={WCStyles.day}>
            <Text style={WCStyles.dayText}>THU: {Math.round(Math.random() * 1500)}</Text>
            <TouchableHighlight onPress={() => { console.log("Hello") }}>
              <Icon name="create" style={WCStyles.editIcon} />
            </TouchableHighlight>
          </View>
          <View style={WCStyles.day}>
            <Text style={WCStyles.dayText}>FRI: {Math.round(Math.random() * 1500)}</Text>
            <TouchableHighlight onPress={() => { console.log("Hello") }}>
              <Icon name="create" style={WCStyles.editIcon} />
            </TouchableHighlight>
          </View>
          <View style={WCStyles.day}>
            <Text style={WCStyles.dayText}>SAT: {Math.round(Math.random() * 1500)}</Text>
            <TouchableHighlight onPress={() => { console.log("Hello") }}>
              <Icon name="create" style={WCStyles.editIcon} />
            </TouchableHighlight>
          </View>
          <View style={WCStyles.day}>
            <Text style={WCStyles.dayText}>SUN: {Math.round(Math.random() * 1500)}</Text>
            <TouchableHighlight onPress={() => { console.log("Hello") }}>
              <Icon name="create" style={WCStyles.editIcon} />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    );
  }
}

let WCStyles = StyleSheet.create({
  card: {
    flex: 1,
    width: (Dimensions.get("window").width - 16),
    marginTop: 8,
    padding: 4,
    elevation: 1,
    alignSelf: "center",
  },
  summary: {
    flexDirection: "row",
    backgroundColor: Theme.GRAY,
  },
  cardInfo: {
    flex: 7,
    paddingStart: 8,
  },
  cardTitle: {
    fontWeight: Theme.HEADER_WEIGHT,
    fontSize: 16,
  },
  totalTally: {
    fontSize: 18,
    fontWeight: Theme.HEADER_WEIGHT,
  },
  expand: {
    flex: 1,
    textAlignVertical: "center",
    textAlign: "center",
  },
  expanded: {},
  day: {
    padding: 8,
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: Theme.GRAY,
  },
  dayText: {
    flex: 4,
  },
  editIcon: {
    flex: 1,
    color: Theme.PRIMARY_COLOR,
    // textAlignVertical: "center",
    textAlign: "center",
  },
});

/**
 * This Component displays feeds consumeed respective to the week
 * The object is passed into the Component through `this.props.weekNumber`
 * 
 * ```
 * this.props.weekNumber = {
 *  weekNumber: Number,
 *  MON: Number,
 *  ...
 *  // Goes the same for the whole week for any day that feeds were added
 *  ...
 * };
 * ```
 */
class FeedCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  componentWillMount() {
    this.renderedDays = this.renderDays();
  }

  expand = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  renderDays = () => {
    let {week} = this.props;
    let renderedWeek = [];
    for(let day in week) {
      renderedWeek.push(
        <View style={FCStyles.day} key={day}>
          <Text style={FCStyles.dayText}>{`${day}: ${week[day].number}`}</Text>
          <Icon style={FCStyles.editIcon} name="create" />
        </View>
      );
    }

    return renderedWeek;
  }

  render() {
    return (
      <View style={FCStyles.card}>
        <TouchableHighlight
          onPress={this.expand}
          style={FCStyles.expand}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={FCStyles.cardInfo}>
              <Text style={FCStyles.title}>WEEK {this.props.week.weekNumber}</Text>
              <Text style={FCStyles.subtitle}>Total Feeds Consumed: {30}</Text>
            </View>
            <Icon name={this.state.expanded ? "arrow-dropup-circle" : "arrow-dropdown-circle"} style={FCStyles.icon} />
          </View>
        </TouchableHighlight>
        {(this.state.expanded)?this.renderedDays:<View/>}
      </View>
    );
  }
}

let FCStyles = StyleSheet.create({
  card: {
    marginTop: 8,
    padding: 4,
    width: (Dimensions.get("window").width - 16),
    alignSelf: "center",
  },
  expand: {
    backgroundColor: Theme.GRAY,
  },
  cardInfo: {
    flex: 7,
    paddingStart: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: Theme.HEADER_WEIGHT,
  },
  subtitle: {
    fontWeight: Theme.NORMAL_WEIGHT,
  },
  icon: {
    flex: 1,
    textAlignVertical: "center",
    textAlignVertical: "center",
  },
  day: {
    padding: 8,
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: Theme.GRAY,
  },
  dayText: {
    flex: 4,
  },
  editIcon: {
    flex: 1,
    textAlign: "center",
  },
});

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
export default class Chicken extends Component {

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

    let batchInformation = this.props.navigation.getParam("batchInformation", {});
    let length = new FileManager(batchInformation).calculateWeek();
    this.length = (length[1])? (length[0] + 1): length[0];

  }

  componentWillMount(){
    let batchInformation = this.props.navigation.getParam("batchInformation", {});
    // console.log((batchInformation)?"batchInfo exists": "batchInfo not found");
    NativeModules.FileManager.fetchBatch(batchInformation.name, (error) => {
      if(error){
        console.log(error);
      }
    });
    this.subscription =  DeviceEventEmitter.addListener("readFile", this.updateState);
    // this.tab = this.renderTab();
  }

  componentDidMount() {

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
    eggs.weekNumber = number;
    feeds.weekNumber = number;
    casualties.weekNumber = number;

    if(!this.state.eggs) {
      this.setState({
        eggs: new BinaryTree(eggs),
        feeds: new BinaryTree(feeds),
        casualties: new BinaryTree(casualties)
      });
    } else if(this.state.eggs instanceof BinaryTree){
      this.state.eggs.add(eggs);
      this.state.feeds.add(feeds);
      this.state.casualties.add(casualties);
    } else {
      return;
    }
    // console.log(Object.keys(refined.data));
    this.now += 1;

    if(this.length == this.now) {
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
    console.log(`This is index: ${index}`)

    if (index == 0)
      return <ChickenTab />;
    else if (index == 1)
      return (
        <View>
          <ProduceTab batchInformation={batchInformation} data={this.state.eggs}/>
        </View>
      );
    else
      return (
        <View>
          <FeedsTab batchInformation={batchInformation} data={this.state.feeds}/>
        </View>
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

class FeedsTab extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount(){
    this.view = this.renderWeeks();
  }

  renderWeeks = () => {
    let weeks = [];
    for(let w=0; w<this.props.data.length; w++) {
      weeks.push(<FeedCard week={this.props.data[w]} key={w}/>);
    }
    return weeks;
  }
  render() {
    // let view = this.renderWeeks();
    return (
      <View>
        <ScrollView
          style={{
            maxHeight: Dimensions.get("window").height - 150,
            // display: this.state.activeTab[2]? "flex": "none",
          }}
        >
          {this.view}
        </ScrollView>
      </View>
    );
  }
}

class ChickenTab extends Component {
  render() {
    return (
      <View>
        <ScrollView
          style={{
            maxHeight: Dimensions.get("window").height - 150,
            // display: this.state.activeTab[0] ? "flex" : "none",
          }}
        >
          <View style={styles.productionCard}>
            <Text style={{ marginLeft: 8, fontWeight: Theme.HEADER_WEIGHT, fontSize: 18, }}>PRODUCTION CHART</Text>
            <LineChart
              data={{
                labels: ['W01', 'W02', 'W03', 'W04', 'W05', 'W06'],
                datasets: [{
                  data: [
                    1024,
                    999,
                    1111,
                    976,
                    1200,
                    1032,
                  ]
                }]
              }}
              width={Dimensions.get('window').width - 16} // from react-native
              height={220}
              yAxisLabel={''}
              chartConfig={{
                backgroundColor: Theme.PRIMARY_COLOR,
                backgroundGradientFrom: Theme.PRIMARY_COLOR_LIGHT,
                backgroundGradientTo: Theme.PRIMARY_COLOR_LIGHT,
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                alignSelf: "center",
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

class ProduceTab extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <ScrollView
          style={{
            maxHeight: Dimensions.get("window").height - 150,
            // display: this.state.activeTab[1]? "flex": "none"
          }}>

        </ScrollView>

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
