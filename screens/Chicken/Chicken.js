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
 * ```
 *  this.props.weekNumber = {
 *    weekNumber: Number,
 *    MON: {
 *      normalEggs: Number,
 *      brokenEggs: Number,
 *      largeEggs: Number,
 *      smallEggs: Number,
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

  expand = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
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
              <Text style={FCStyles.title}>WEEK {Math.round(Math.random() * 52)}</Text>
              <Text style={FCStyles.subtitle}>Total Feeds Consumed: {30}</Text>
            </View>
            <Icon name={this.state.expanded ? "arrow-dropup-circle" : "arrow-dropdown-circle"} style={FCStyles.icon} />
          </View>
        </TouchableHighlight>

        <View style={{
          display: this.state.expanded ? "flex" : "none",
        }}>
          <View style={FCStyles.day}>
            <Text style={FCStyles.dayText}>TUE{" 7"}</Text>
            <Icon style={FCStyles.editIcon} name="create" />
          </View>
          <View style={FCStyles.day}>
            <Text style={FCStyles.dayText}>TUE{" 7"}</Text>
            <Icon style={FCStyles.editIcon} name="create" />
          </View>
          <View style={FCStyles.day}>
            <Text style={FCStyles.dayText}>TUE{" 7"}</Text>
            <Icon style={FCStyles.editIcon} name="create" />
          </View>
        </View>
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
    };

  }

  componentWillMount() {
    // DeviceEventEmitter.addListener("sendFile", this.updateState);

    // NativeModules.FileManager.fetchBatch("batchOne", (err)=>{
    // 	if(err){
    // 		console.log(err);
    // 	}else{
    // 		console.log("No error found from fetching");
    // 	}
    // });
  }

  /**
   * 
   * @param {Object} data data to be written to the batch
   */
  write(data) { }

  /**
   * 
   * @param {Number} weekNumber contains the week number to be altered
   * @param {Object} data contains the data to be added
   * 
   */
  writeWeek(weekNumber, data) { }

  updateState = (data) => {
    console.log(data.file);
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
          <ProduceTab batchInformation={batchInformation} />
        </View>
      );
    else
      return (
        <View>
          <FeedsTab batchInformation={batchInformation} />
        </View>
      );
  }

  render() {
    let batchInformation = this.props.navigation.getParam("batchInformation", {});
    return (
      <View style={styles.chickenNav}>
        <View style={styles.header}></View>
        <View style={styles.navigationTab}>
          {(this.state.activeTab[0]) ? <TouchableHighlight underlayColor={Theme.PARAGRAPH_COLOR} onPress={this.switchToTab.bind(this, 0)} style={styles.activeTab}><Text style={styles.tabText}>CHICKEN</Text></TouchableHighlight> : <TouchableHighlight underlayColor={Theme.PARAGRAPH_COLOR} onPress={this.switchToTab.bind(this, 0)} style={styles.dormantTab}><Text style={styles.tabText}>CHICKEN</Text></TouchableHighlight>}
          {(this.state.activeTab[1]) ? <TouchableHighlight underlayColor={Theme.PARAGRAPH_COLOR} onPress={this.switchToTab.bind(this, 1)} style={styles.activeTab}><Text style={styles.tabText}>PRODUCE</Text></TouchableHighlight> : <TouchableHighlight underlayColor={Theme.PARAGRAPH_COLOR} onPress={this.switchToTab.bind(this, 1)} style={styles.dormantTab}><Text style={styles.tabText}>PRODUCE</Text></TouchableHighlight>}
          {(this.state.activeTab[2]) ? <TouchableHighlight underlayColor={Theme.PARAGRAPH_COLOR} onPress={this.switchToTab.bind(this, 2)} style={styles.activeTab}><Text style={styles.tabText}>FEEDS</Text></TouchableHighlight> : <TouchableHighlight underlayColor={Theme.PARAGRAPH_COLOR} onPress={this.switchToTab.bind(this, 2)} style={styles.dormantTab}><Text style={styles.tabText}>FEEDS</Text></TouchableHighlight>}
        </View>

        {this.renderTab()}

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
  render() {
    return (
      <View>
        <ScrollView
          style={{
            maxHeight: Dimensions.get("window").height - 150,
            // display: this.state.activeTab[2]? "flex": "none",
          }}
        >
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
          <FeedCard />
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
  render() {
    return (
      <View>
        <ScrollView
          style={{
            maxHeight: Dimensions.get("window").height - 150,
            // display: this.state.activeTab[1]? "flex": "none"
          }}>
          <WeeklyCard />
          <WeeklyCard />
          <WeeklyCard />
          <WeeklyCard />
          <WeeklyCard />
          <WeeklyCard />
          <WeeklyCard />
          <WeeklyCard />
          <WeeklyCard />
          <WeeklyCard />
          <WeeklyCard />
          <WeeklyCard />
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
