import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './TabNavigator';
import Profile from '../screens/Profile";
import Logout from '../screens/Logout';
import StackNavigator from './StackNavigator';
import CustomSideBarMenu from '../screens/CustomSideBarMenu'
import firebase from 'firebase';
const Drawer=createDrawerNavigator();

class DrawerNavigator extends React.Component{

   constructor(props){
       super(props);
       this.state={
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
        //this.props.setUpdatedToFalse()
      }




    render(){ 
        let props=this.props;
        return(
          

            <Drawer.Navigator
            drawerContentOptions={{
              activeTintColor: "#e91e63",
              inactiveTintColor: this.state.light_theme ? "black" : "white",
              itemStyle: { marginVertical: 5 }
            }}
             drawerContent={props=> <CustomSideBarMenu {...props}/>}

            screenOptions={{headerShown:false}}
            
            >
         
            <Drawer.Screen name="Home" component={StackNavigator} options={{unmountOnBlur:true}}/>
             <Drawer.Screen name="Profile" component={Profile} options={{unmountOnBlur:true}}/>
             <Drawer.Screen name="Logout" component={Logout} options={{unmountOnBlur:true}}/>
             
             </Drawer.Navigator>
             
         
         
         
         
         )
         

    }
}

export default DrawerNavigator;