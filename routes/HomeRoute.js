import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Home from '../screens/Home/Home';
import Events from '../screens/Events/Events'
import ChickenInfo from './ChickenInfo';
import Chicken from '../screens/Chicken/Chicken';
import NewBatch from '../screens/NewBatch/NewBatch';
import AddInventory from '../screens/AddInventory/AddInventory';

let stackNavigator = createStackNavigator(
  {
    Home,
    Chicken,
    NewBatch,
    AddInventory,
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
  },
);

export default createAppContainer(stackNavigator);
