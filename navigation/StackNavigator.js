import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator} from '@react-navigation/stack';
import BottomTabNavigator from './TabNavigator';
import StoryScreen from '../screens/StoryScreen';

const Stack=createStackNavigator();

const StackNavigator=()=>{
return(


   <Stack.Navigator
   screenOptions={{headerShown:false}}
   initialRouteName='Home'
   >

   <Stack.Screen name="Home" component={BottomTabNavigator}/>
    <Stack.Screen name="StoryScreen" component={StoryScreen}/>
    
    </Stack.Navigator>
    




)
}

export default StackNavigator;