import {createAppContainer, createStackNavigator} from 'react-navigation';

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
    Events, 
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
