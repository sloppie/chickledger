import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableHighlight,
    ScrollView,
    FlatList,
    Dimensions,
    DeviceEventEmitter,
    NativeModules,
} from 'react-native';
import Icon from 'react-native-ionicons';

import Theme from '../../../theme/Theme';
import FileManager from '../../../utilities/FileManager';
const BinaryTree = require("./../../../utilities/DataStructures/BinarySearchTrees").BinarySearchTree;

let length = 0;


export default class ProduceTab extends Component {
  constructor(props) {
    super(props);

    this.rendered = false;
    this.state = {
      tree: null,
      items: null,
    };
  }

  static navigationOptions = {
    swipeEnabled: true
  };

  componentDidMount() {
    NativeModules.FileManager.fetchCategory(this.props.batchInformation.name, "eggs");
    this.subscription = DeviceEventEmitter.addListener("readeggs", this.getData)
    let arr = new FileManager(this.props.batchInformation).calculateWeek();
    this.max = (arr[1])? (arr[0] + 1): arr[0];
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.rendered;
  }

  getData = (fetched) => {
    let data = {};
    let key = Object.keys(fetched)[0];
    let number  = Number(key);
    data.eggs = fetched[key];
    data.key = key;
    data.weekNumber = number;
    if(this.state.tree) {
      this.state.tree.add(data);
      length++;
      if(this.max == length) {
        let items = [];
        this.state.tree.visit(items);
        this.setState({
          items: items.reverse(),
        });
        this.rendered = true;
      }
    } else {
      this.setState({
        tree: new BinaryTree(data),
      });
      length++;
    }
  }

  renderWeeks = () => {
    let {data} = this.props;
    let weeks = [];

    for(let i=0; i<data.length; i++){
      weeks.push(data[i].eggs);
    }

    return weeks;
  }

  option = () => {
    if(this.state.items){
      return (
        <FlatList 
            data={this.state.items}
            renderItem={({item}) => <WeeklyCard week={item.eggs} weekNumber={item.weekNumber}/>}/>
      );
    } else {
      return <Text>Loading List...</Text>
    }
  }

  render() {
    return (
      <View>
        {/* <ScrollView
          style={{
            maxHeight: Dimensions.get("window").height - 150,
            // display: this.state.activeTab[1]? "flex": "none"
          }}>
            {this.renderWeeks()}
        </ScrollView> */}
        {this.option()}
      </View>
    );
  }
}


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
export class WeeklyCard extends Component {
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

  renderDays = () => {
    let {week} = this.props;
    let days = [];
    for(let i in week) {
      // !TODO break down object
      days.push(
        <View style={WCStyles.day} key={i}>
          <Text style={WCStyles.dayText}>{i}: {week[i].normalEggs}</Text>
          <TouchableHighlight onPress={() => { console.log("Hello") }}>
            <Icon name="create" style={WCStyles.editIcon} />
          </TouchableHighlight>
        </View>
      );
    }

    return days;
  }

  render() {
    let copiedStyles = Object.create(WCStyles.expanded);
    copiedStyles.display = this.state.expanded ? "flex" : "none";
    return (
      <View style={WCStyles.card}>
        <TouchableHighlight onPress={this.expand} >
          <View style={WCStyles.summary}>
            <View style={WCStyles.cardInfo}>
              <Text style={WCStyles.cardTitle}>WEEK {this.props.weekNumber}</Text>
              <Text style={WCStyles.totalTally}>Total Tally: {Math.round(Math.random() * 1500 * 7)}</Text>
            </View>
            <Icon name={this.state.expanded ? "arrow-dropup-circle" : "arrow-dropdown-circle"} style={WCStyles.expand} />
          </View>
        </TouchableHighlight>
        <View style={copiedStyles}>
          {this.renderDays()}
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
