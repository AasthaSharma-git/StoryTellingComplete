import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";
import firebase from 'firebase'
import { TouchableNativeFeedback } from "react-native-web";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class StoryCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      light_theme:false,
      story_id:this.props.story.key,
      story_data:this.props.story.value,
      isliked:this.props.story.value.isliked,
      likes:this.props.story.value.likes
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }
  async fetchUser() {
    await firebase
    .database()
    .ref("/users/" + firebase.auth().currentUser.uid)
    .on("value", (snapshot)=> {
      theme = snapshot.val().current_theme;
      var temp=snapshot.val().isliked;
      this.setState({
        light_theme: theme === "light" ? true : false,
        liked:temp
       
      });
      
    });
  }

  likeAction=()=>{
    if(this.state.isliked){
      firebase
      .database()
      .ref('posts')
      .child(this.state.story_id)
      .child('likes')
      .set(firebase.database.ServerValue.increment(-1))
      firebase
      .database()
      .ref('posts')
      .child(this.state.story_id)
      .child('isliked')
      .set(false)
      
      this.setState({
        likes:this.state.likes-1,
        isliked:false
      })

    }
    else{
      firebase
      .database()
      .ref('posts')
      .child(this.state.story_id)
      .child('likes')
      .set(firebase.database.ServerValue.increment(1))

      firebase
      .database()
      .ref('posts')
      .child(this.state.story_id)
      .child('isliked')
      .set(true)

      this.setState({
        likes:this.state.likes+1,
        isliked:true
      })

    }
   
   
  }
 



  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser();
  }

  render() {
    
    let story=this.state.story_data;
    let images = {
      image_1: require("../assets/story_image_1.png"),
      image_2: require("../assets/story_image_2.png"),
      image_3: require("../assets/story_image_3.png"),
      image_4: require("../assets/story_image_4.png"),
      image_5: require("../assets/story_image_5.png")
    };
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <TouchableOpacity style={styles.container} onPress={
          ()=>{
          
          
            this.props.navigation.navigate("StoryScreen",{liked:this.likeAction,story:this.props.story,isliked:this.state.isliked,likes:this.state.likes})
          }
        }>
          <View style={this.state.light_theme?
            [styles.cardContainer,{backgroundColor:'white',borderColor:'#15193c',borderWidth:1}]:styles.cardContainer}>
            <Image
              source={images[story.previewImage]}
              style={styles.storyImage}
            ></Image>

            <View style={styles.titleContainer}>
              <Text style={this.state.light_theme?
                [styles.storyTitleText,{color:'#15193c'}]:styles.storyTitleText}>
                {story.title}
              </Text>
              <Text style={this.state.light_theme?
                [styles.storyAuthorText,{color:'#15193c'}]:styles.storyAuthorText}>
                {story.author}
              </Text>
              <Text style={this.state.light_theme?
                [styles.storyDescriptionText,{color:'#15193c'}]:styles.storyDescriptionText}>
                {story.description}
              </Text>
            </View>
            <TouchableOpacity onPress={this.likeAction}>
            <View style={styles.actionContainer}>
              <View style={this.state.isliked?styles.likeButtonLiked:styles.likeButtonDisliked}>
                <Ionicons name={"heart"} size={RFValue(30)} color={this.state.light_theme?"gray":"white"}  />
                <Text style={this.state.light_theme?[styles.likeText,{color:'black'}]:styles.likeText}>{this.state.likes}</Text>
              </View>
            </View>

            </TouchableOpacity>
           
          </View>
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cardContainer: {
    margin: RFValue(13),
    backgroundColor: "#2f345d",
    borderRadius: RFValue(20)
  },
  storyImage: {
    resizeMode: "contain",
    width: "95%",
    alignSelf: "center",
    height: RFValue(250)
  },
  titleContainer: {
    paddingLeft: RFValue(20),
    justifyContent: "center"
  },
  storyTitleText: {
    fontSize: RFValue(25),
    fontFamily: "Bubblegum-Sans",
    color: "white"
  },
  storyAuthorText: {
    fontSize: RFValue(18),
    fontFamily: "Bubblegum-Sans",
    color: "white"
  },
  storyDescriptionText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: 13,
    color: "white",
    paddingTop: RFValue(10)
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: RFValue(10)
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eb3948",
    borderRadius: RFValue(30)
  },
  likeText: {
    color: "white",
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    marginLeft: RFValue(5)
  },
  likeButtonLiked:{
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#eb3948",
    borderRadius: RFValue(30)
  },
  likeButtonDisliked:{
    width: RFValue(160),
    height: RFValue(40),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderColor: "#eb3948",
    borderRadius: RFValue(30)

  }
});