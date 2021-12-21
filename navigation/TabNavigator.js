import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feed from '../screens/Feed';
import CreateStory from '../screens/CreateStory';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';

const Tab=createMaterialBottomTabNavigator();
export default class BottomTabNavigator extends React.Component {


  constructor(){
    super()
    this.state={
      isUpdated:false,
      light_theme:false
    }
  }
  componentDidMount(){
    this.fetchUser();
  }
  async fetchUser() {
    let theme;
    await firebase
      .database()
      .ref("/users/" + firebase.auth().currentUser.uid)
      .on("value", function (snapshot) {
        theme = snapshot.val().current_theme;
        
      });
    this.setState({
      light_theme: theme === "light" ? true : false,
     
    });
  }
  changeUpdated=()=>{
    this.setState({isUpdated:true})

  }
  removeUpdated=()=>{
    this.setState({isUpdated:false})
    
  }
  renderFeed=(props)=>{
    return <Feed setUpdatedToFalse={this.removeUpdated} {...props}/>
  }
  renderStory=(props)=>{
    return <CreateStory setUpdatedToTrue={this.changeUpdated} {...props}/>
  }
  
 
  render(){
    return (

      <Tab.Navigator
         
          labeled={false}
          activeColor='orange'
          barStyle={this.state.light_theme?[styles.bottomTabStyle, {backgroundColor:'white'}]:styles.bottomTabStyle}
      >
        <Tab.Screen name="Feed" component={this.renderFeed} 
         options={
   
          { unmountOnBlur:true,
            tabBarIcon: ({color}) => (
           
             <Ionicons name="book-outline" color={color} size={30} style={styles.icons}></Ionicons>
             
           )}
           
 
         }/>
        <Tab.Screen name="Create Story" component={this.renderStory}
         options={{
           unmountOnBlur:true,
           tabBarIcon: ({color}) => (
             <Ionicons name="clipboard-outline" color={color} size={30} style={styles.icons}></Ionicons>
           )
         }}
        />
      </Tab.Navigator>
   
   
  )
        }
}

const styles=StyleSheet.create({
  bottomTabStyle:{
    backgroundColor:'#002147',
    height:'8%',
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    position:'absolute',
    overflow:'hidden'
    
  },
  icons:{
    width:RFValue(30),
    height:RFValue(30)
  }
})
