import {createBottomTabNavigator, createAppContainer} from 'react-navigation';

import Chicken from '../screens/Chicken/Chicken';
import Feeds from '../screens/Feeds/Feeds';
import Period from '../screens/Period/Period'
import Produce from '../screens/Produce/Produce'

const bottomTabNavigator = createBottomTabNavigator(
  {
    Chicken,
    Feeds,
    Period,
    Produce,
  },
);

export default createAppContainer(bottomTabNavigator);
