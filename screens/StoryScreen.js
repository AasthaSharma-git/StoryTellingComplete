import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RFValue } from "react-native-responsive-fontsize";

import * as Speech from "expo-speech";
import firebase from "firebase";
import AppLoading from "expo-app-loading";
import * as Font from "expo-font";

let customFonts = {
  "Bubblegum-Sans": require("../assets/fonts/BubblegumSans-Regular.ttf")
};

export default class StoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fontsLoaded: false,
      speakerColor: "gray",
      speakerIcon: "volume-high-outline",
      light_theme: true,
      likes:this.props.route.params.story.value.likes,
      isliked:this.props.route.params.isliked
    };
  }
  likeAction=()=>{
    this.props.route.params.liked()
    this.setState({
      likes:this.state.isliked?this.state.likes-1:this.state.likes+1,
      isliked:!this.state.isliked
    })
  
 
  
   
  }


  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount=()=> {
    this._loadFontsAsync();
    this.fetchUser()
  }

  fetchUser=async ()=> {
    let theme;
    firebase
        .database()
        .ref("/users/" + firebase.auth().currentUser.uid)
        .on("value", (snapshot)=> {
          theme = snapshot.val().current_theme;
          this.setState({
            light_theme: theme === "light" ? true : false,
           
          });
          
        });
  }

  async initiateTTS(title, author, story, moral) {
    const current_color = this.state.speakerColor;
    this.setState({
      speakerColor: current_color === "gray" ? "#ee8249" : "gray"
    });
    if (current_color === "gray") {
      Speech.speak(`${title} by ${author}`);
      Speech.speak(story);
      Speech.speak("The moral of the story is!");
      Speech.speak(moral);
    } else {
      Speech.stop();
    }
  }

  render() {
  
    if (!this.props.route.params) {
      this.props.navigation.navigate("Home");
    } else if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <View style={this.state.light_theme ? [styles.container, { backgroundColor: 'white' }] : styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require("../assets/logo.png")}
                style={styles.iconImage}
              ></Image>
            </View>

            <View style={styles.appTitleTextContainer}>
              <Text style={this.state.light_theme ? [styles.appTitleText, { color: '#15193c' }] : styles.appTitleText}>Storytelling App</Text>
            </View>

          </View>
          <View style={styles.storyContainer}>
            <ScrollView 
            style={this.state.light_theme?
            [styles.storyCard,{backgroundColor:'white'}]:styles.storyCard}>
              <Image
                source={require("../assets/story_image_1.png")}
                style={styles.image}
              ></Image>

              <View style={styles.dataContainer}>
                <View style={styles.titleTextContainer}>
                  <Text style={this.state.light_theme?
                  [styles.storyTitleText,{color:'#15193c'}]:styles.storyTitleText}>
                    {this.props.route.params.story.value.title}
                  </Text>
                  <Text style={this.state.light_theme?
                  [styles.storyAuthorText,{color:'#15193c'}]:styles.storyAuthorText}>
                    {this.props.route.params.story.value.author}
                  </Text>
                  <Text style={this.state.light_theme?
                  [styles.storyAuthorText,{color:'#15193c'}]:styles.storyAuthorText}>
                    {this.props.route.params.story.value.created_on}
                  </Text>
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      this.initiateTTS(
                        this.props.route.params.story.title,
                        this.props.route.params.story.author,
                        this.props.route.params.story.story,
                        this.props.route.params.story.moral
                      )
                    }
                  >
                    <Ionicons
                      name={this.state.speakerIcon}
                      size={RFValue(30)}
                      color={this.state.speakerColor}
                      style={{ margin: RFValue(15) }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.storyTextContainer}>
                <Text style={this.state.light_theme?
                  [styles.storyText,{color:'#15193c'}]:styles.storyText}>
                  {this.props.route.params.story.value.story}
                </Text>
                <Text style={this.state.light_theme?
                  [styles.moralText,{color:'#15193c'}]:styles.moralText}>
                  Moral - {this.props.route.params.story.value.moral}
                </Text>
              </View>
             
              <TouchableOpacity onPress={this.likeAction}>
            <View style={styles.actionContainer}>
              <View style={this.state.isliked?
                styles.likeButtonLiked:styles.likeButtonDisliked}>
                <Ionicons name={"heart"} size={RFValue(30)} color={this.state.light_theme?"gray":"white"}  />
                <Text style={this.state.light_theme?[styles.likeText,{color:'black'}]:styles.likeText}>{this.state.likes}</Text>
              </View>
            </View>

            </TouchableOpacity>

           
            </ScrollView>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
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
  storyContainer: {
    flex: 1
  },
  storyCard: {
    margin: RFValue(20),
    backgroundColor: "#2f345d",
    borderRadius: RFValue(20)
  },
  image: {
    width: "100%",
    alignSelf: "center",
    height: RFValue(200),
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20),
    resizeMode: "contain"
  },
  dataContainer: {
    flexDirection: "row",
    padding: RFValue(20)
  },
  titleTextContainer: {
    flex: 0.8
  },
  storyTitleText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(25),
    color: "white"
  },
  storyAuthorText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(18),
    color: "white"
  },
  iconContainer: {
    flex: 0.2
  },
  storyTextContainer: {
    padding: RFValue(20)
  },
  storyText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(15),
    color: "white"
  },
  moralText: {
    fontFamily: "Bubblegum-Sans",
    fontSize: RFValue(20),
    color: "white"
  },
  actionContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: RFValue(10)
  },
  likeButton: {
    width: RFValue(160),
    height: RFValue(40),
    flexDirection: "row",
    backgroundColor: "#eb3948",
    justifyContent: "center",
    alignItems: "center",
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