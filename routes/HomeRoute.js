import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { NativeModules } from 'react-native';

import Home from '../screens/Home/Home';
import Chicken from './ChickenInfo';
import NewBatch from '../screens/NewBatch/NewBatch';
import AddInventory from '../screens/AddInventory/AddInventory';

import Theme from '../theme/Theme';

let stackNavigator = createStackNavigator(
  {
    Home,
    Chicken: {
      screen: Chicken,
      navigationOptions: {
        title: NativeModules.Sessions.getCurrentSession()
      },
    },
    NewBatch: {
      screen: NewBatch,
      title: "Create New Batch"
    },
    AddInventory: {
      screen: AddInventory,
      title: "Add: " + NativeModules.Sessions.getCurrentSession(),
    },
  },
  {
    defaultNavigationOptions: {
    headerStyle: {
      backgroundColor: Theme.PRIMARY_COLOR_DARK,
      color: "white",
    },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "white",
      },
    },
    headerMode: "screen",
  },
);

export default createAppContainer(stackNavigator);
