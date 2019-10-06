import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home from '../screens/Home/Home';
import Chicken from '../screens/Chicken/Chicken';
import NewBatch from '../screens/NewBatch/NewBatch';
import AddInventory from '../screens/AddInventory/AddInventory';

import Theme from '../theme/Theme'

let stackNavigator = createStackNavigator(
  {
    Home,
    Chicken,
    NewBatch,
    AddInventory,
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
  },
);

export default createAppContainer(stackNavigator);
