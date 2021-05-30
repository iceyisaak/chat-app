import React, { Component } from 'react';
import { db, auth } from '../firebase';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  LogBox
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';




export default class Chat extends Component {

  constructor() {
    super();

    this.state = {
      messages: [],
      uid: '',
      isConnected: false,
      image: null,
      location: null
    };

  }



  onMessageUpdate = (querySnapshot) => {
    const messages = [];

    querySnapshot.forEach(
      (doc) => {

        let data = doc.data();

        messages.push({
          _id: data._id,
          createdAt: data.createdAt.toDate(),
          text: data.text || null,
          user: data.user,
          image: data.image || null,
          location: data.location || null
        });


      }
    );

    this.setState({
      messages
    });

  };

  componentDidMount() {

    // Fetch Internet Connnection Info
    NetInfo.fetch().then(
      connection => {

        // If Internet is connected
        if (connection.isConnected) {
          console.log('online');

          this.setState({
            isConnected: true
          });

          // Otherwise
        } else {
          console.log('offline');
          this.setState({
            isConnected: false
          });

        }
      }
    );

    this.getMessages();

    this.referenceChatMessages = db.collection('messages');

    this.unsubscribe = this.referenceChatMessages
      .orderBy('createdAt', 'desc')
      .onSnapshot(this.onMessageUpdate);

    this.authUnsubscribe = auth.onAuthStateChanged(

      async (user) => {
        if (!user) {
          await auth.signInAnonymously();
        }

        this.setState({
          uid: user.uid,
          messages: []
        });

        this.unsubscribe = this.referenceChatMessages
          .orderBy('createdAt', 'desc')
          .onSnapshot(this.onMessageUpdate);

        this.referenceChatMessagesUser = db.collection('messages').where(
          'uid',
          '==',
          this.state.uid
        );
      }
    );

    // Bring in the prop 'name'
    const name = this.props.route.params.name;
    // Bring props to setOptions
    this.props.navigation.setOptions({

      // set name as title
      title: name
    });

    LogBox.ignoreLogs(['Setting a timer for a long period of time', 'undefined']);

  }

  // When component is about to be removed from DOM
  componentWillUnmount() {

    // Unsubscribe from Firebase
    this.unsubscribe();

    // Unsubscribe Auth from Firebase
    this.authUnsubscribe();
  }


  // When sending a message
  onSend(
    // Take in the messages array
    messages = []
  ) {

    // set the state
    this.setState(

      // Whatever the previousState is
      previousState => ({

        // set the messages state to append GiftedChat
        messages: GiftedChat.append(

          // to contain previous messages
          previousState.messages,

          // follow by the messages
          messages
        )
      }),
      () => {
        this.addMessage();
        this.saveMessages();
      }
    );

  };


  // getMessages() from AsyncStorage
  async getMessages() {
    let messages = '';

    // Try 
    try {

      // getting 'messages' item from AsyncStorage or []
      messages = await AsyncStorage.getItem('messages') || [];

      // setState
      this.setState({

        // Put in message in JSON format
        messages: JSON.parse(messages)
      });

      // Catch any error
    } catch (error) {

      // Log error to console
      console.log(error);
    }

  };


  // Add Message
  addMessage() {
    const message = this.state.messages[0];

    console.log('addMessage(): ', message);

    // Add message to Database
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text || null,
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || null,
      location: message.location || null
    });

    console.log('after .add(): ', message);
  };


  // saveMessages() to AsyncStorage
  async saveMessages() {

    // Try
    try {

      // Wait for AsyncStorage to setItem
      await AsyncStorage.setItem(

        // Set in Message
        'messages',

        // Convert JSON messages to String format
        JSON.stringify(this.state.messages)
      );

      // Catch error
    } catch (error) {

      // Log error to console
      console.log(error);
    }
  }


  // deleteMessages() from AsyncStorage
  async deleteMessages() {

    // Try
    try {

      // Wait for AsyncStorage to removeItem
      await AsyncStorage.removeItem(
        'messages'
      );

      // setState of messages to []
      this.setState({
        messages: []
      });

      // Catch Error
    } catch (error) {

      // Log error to console
      console.log(error);
    }
  };


  renderInputToolbar(props) {

    if (this.state.isConnected == true) {

      return (

        <InputToolbar
          {...props}
        />

      );
    }

  }


  // renderCustomActions()
  renderCustomActions(props) {
    return (
      <CustomActions
        {...props}
      />
    );
  };

  // renderCustomView()
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={styles.Map}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
          }}
        />
      );
    }
    return null;
  };


  // renderBubble takes in props
  renderBubble(props) {

    // Return the <Bubble/> component
    return (
      <Bubble
        {...props}
        wrapStyle={{
          right: {
            backgroundColor: '#000'
          }
        }}
      />
    );
  }

  render() {

    // Bring in the color
    const {
      color
    } = this.props.route.params;

    return (

      <View
        style={[
          styles.container,
          {
            backgroundColor: color
          }
        ]}
      >
        <GiftedChat
          renderBubble={this.renderBubble.bind(this)}
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          renderActions={this.renderCustomActions}
          messages={this.state.messages}
          onSend={(messages) => this.onSend(messages)}
          user={{
            _id: this.state.uid,
            // name: this.name,
            avatar: 'https://placeimg.com/140/140/any'
          }}
        />

        {
          Platform.OS === 'android' ?
            <KeyboardAvoidingView
              behavior='height'
            />
            :
            null
        }

      </View>

    );

  }
}


// Styling the Component 
const styles = StyleSheet.create({

  container: {
    flex: 1
  },
  Map: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3
  }

});