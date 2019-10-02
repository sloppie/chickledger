import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Dimensions,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

import Theme from '../../../theme/Theme';
import FileManager from './../../../utilities/FileManager';
const BinaryTree = require("./../../../utilities/DataStructures/BinarySearchTrees").BinarySearchTree;

let length = 0;

export default class Casualties extends Component {
  constructor(props) {
    super(props);
    this.data = [[], []]
    this.state = {
      rendered: false,
    }

    console.log(typeof this.updter);
    // this.updater = this.updater.bind(this);
  }

  componentDidMount() {
    NativeModules.FileManager.fetchCategory(this.props.batchInformation.name, "casualties");
    this.subscription = DeviceEventEmitter.addListener("readcasualties", this.getData);
  }

  componentDidUpdate() {    let batch = this.props.batchInformation;
    console.log("BatchInfo:\n" + JSON.stringify(batch, null, 2)); 
    if(this.props.data instanceof Promise) this.updter();
  }

  componentWillUnmount() {
    this.subscription.remove();
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
      }
    } else {
      this.setState({
        tree: new BinaryTree(data),
      });
      length++;
    }
  }
  
  updter() {
    let labels = [];
    let dat = [];
    this.props.data.then((data) => {
      for(let i=0; i<10; i++){
        labels.push(`W-${data[i].weekNumber}`);
        let total = 0;
        for(let d in data[i].casualties) {
          total += data[i].casualties[d].number;
        }
        dat.push(total);
      }
      this.data = [labels.reverse(), dat.reverse()];
      this.setState({
        rendered: true
      });
    });

    // let data = await this.props.data;

    // data.forEach((week) => {
    //   labels.push(`W-${week.weekNumber}`);
    //   let total = 0;
    //   for(let d in week.casualties) {
    //     total += week.casualties[d];
    //   }
    //   dat.push(total);
    // });

    // this.data = [labels, dat];

    // this.setState({
    //   rendered: true,
    // });
  }

  // componentDidUpdate() {
  //   let labels = [];
  //   let data = [];
  //   if(this.props.data) {
  //     this.props.data.forEach((week) => {
  //       labels.push(`W-${week.weekNumber}`);
  //       let total = 0;
  //       for(let d in week.casualties) {
  //         total += week.casualties[d];
  //       }
  //       data.push(total);
  //     });
  
  //     this.data = [labels, data];
  //     this.setState({
  //       rendered: true
  //     });
  //   }
  // }

  renderGraph = () => {
    return (
      <View style={styles.productionCard}>
        <Text style={{ marginLeft: 8, fontWeight: Theme.HEADER_WEIGHT, fontSize: 18, }}>PRODUCTION CHART</Text>
        <LineChart
          data={{
            labels: [...this.data[0]],
            datasets: [{
              data: [...this.data[1]]
            }]
          }}
          width={Dimensions.get('window').width} // from react-native
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
          
          style={{
            marginVertical: 8,
            alignSelf: "center",
          }}
        />
      </View>
    );
  }

  render() {
    // this.updter();
    return (
      // <Flatlist
      //   data={this.props.data} 
      //   renderItems={({item}) => <WeeklyCas week={item.casualties} weekNumber={item.weekNumber}/>}
      // />
      <View>
        {/* <ScrollView
          style={{
            maxHeight: Dimensions.get("window").height - 150,
            // display: this.state.activeTab[0] ? "flex" : "none",
          }}
        > */}
        {(this.state.rendered)?this.renderGraph(): <Text style={styles.loadText}>loading graph...</Text>}
        {/* </ScrollView> */}
      </View>
    );
  }
}

class WeeklyCas extends React.PureComponent {
  constructor(props) {
    super(props);    
  }

  renderDays() {
    let {week} = this.props;
    let days = [];
    for(let d in week) {
      days.renderDays.push(d);
    }
  }

  render() {
    return(
      <View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  productionCard: {
    flex: 1,
    zIndex: 1,
    elevation: 2,
    marginTop: 8,
  },
  loadText: {
    alignSelf: "center",
    textAlign: "center",
    textAlignVertical: "center",
  },
});