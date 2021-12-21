import React from 'react';
import { StyleSheet, Text, View ,Image} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import firebase from 'firebase';
import { DrawerContentScrollView,DrawerItemList } from '@react-navigation/drawer';

export default class CustomSideBarMenu extends React.Component{
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
            <View style={{
                flex:1,
                backgroundColor:this.state.light_theme?"white":"black"
            }}>
              <Image
              source={require('../assets/logo.png')}
              style={styles.sideMenuProfileIcon}
              
              />  
              <DrawerContentScrollView {...props}>
                  <DrawerItemList {...props}/>
              </DrawerContentScrollView>

            </View>

        )
    }
}

const styles=StyleSheet.create({
    sideMenuProfileIcon:{
      width:RFValue(140),
      height:RFValue(140),
      borderRadius:RFValue(70),
      alignSelf:"center",
      marginTop:RFValue(60),
      resizeMode:'contain' 
    }
})