import React from 'react';
import {Text,View,StyleSheet,StatusBar,Platform,SafeAreaView,Image} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import {FlatList} from 'react-native-gesture-handler';
import StoryCard from './StoryCard'
import firebase from 'firebase'
let customFont={
    'Bubblegum-Sans':require('../assets/fonts/BubblegumSans-Regular.ttf')
}
let stories=require('../temp.json');
export default class Feed extends React.Component{
    constructor(){
        super();
        this.state={
            fontsLoaded:false,
            light_theme:false,
            stories:[]
        }
    }
    fetchStories(){
      firebase
        .database()
        .ref("/posts/")
        .on("value", (snapshot)=>{
          let stories=[]
          if(snapshot.val()){
            Object.keys(snapshot.val()).forEach(function (key){
              stories.push({
                key:key,
                value:snapshot.val()[key]
              })
              
            })
           this.setState({stories:stories})
           this.props.setUpdatedToFalse()
          }

        }),function errorObject(){
          console.log("Read Failed :"+errorObject.code)
        } 






    }
    async _loadFontsAsync(){
        await Font.loadAsync(customFont);
        this.setState({
            fontsLoaded:true
        })
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
  
    componentDidMount(){
        this._loadFontsAsync();
        this.fetchUser()
        this.fetchStories()
    }
    renderItem = ({ item: story }) => {
        return <StoryCard story={story} navigation={this.props.navigation}/>;
      };
    render(){
        if(!this.state.fontsLoaded){
            return(
                <AppLoading/>
            )
        }
        else{
            return(
               
                <View style={this.state.light_theme?[styles.container,{backgroundColor:'white'}]:styles.container}>
                 <SafeAreaView style={styles.droidSafeArea} />
                 <View style={styles.appTitle}>
                   <View style={styles.appIcon}>
                      <Image
                        source={require("../assets/logo.png")}
                        style={styles.iconImage}
                      ></Image>
                   </View>
                 
                   <View style={styles.appTitleTextContainer}>
                      <Text style={this.state.light_theme?[styles.appTitleText,{color:'#15193c'}]:styles.appTitleText}>Storytelling App</Text>
                   </View>

                  </View>
                  {
                    !this.state.stories[0]?
                    <View style={styles.noStories}>
                      <Text style={this.state.light_theme?[styles.noStoriesText,{color:'black'}]:styles.noStoriesText}>No Stories Available</Text>
                      </View>
                    
                    :
                    <View style={styles.cardContainer}>
                    <FlatList
                       keyExtractor={this.keyExtractor}
                      data={this.state.stories}
                      renderItem={this.renderItem}
                     />
                   </View>





                  }
                 


                </View>








            )
        }
       
    }
}
const styles=StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#15193c"
      },
      droidSafeArea: {
        marginTop: Platform.OS === "android" ? StatusBar.currentHeight : RFValue(35)
      },
      appTitle: {
        flex: 0.07,
        flexDirection: "row"
      },
      appIcon: {
        flex: 0.3,
        justifyContent: "center",
        alignItems: "center"
      },
      iconImage: {
        width: "100%",
        height: "100%",
        resizeMode: "contain"
      },
      appTitleTextContainer: {
        flex: 0.7,
        justifyContent: "center"
      },
      appTitleText: {
        color: "white",
        fontSize: RFValue(28),
        fontFamily: "Bubblegum-Sans"
      },
      cardContainer: {
        flex: 0.93
      },
      noStories: {
        flex: 0.85,
        justifyContent: "center",
        alignItems: "center"
      },
      noStoriesText: {
        color: "white",
        fontSize: RFValue(40),
        fontFamily: "Bubblegum-Sans"
      }
})