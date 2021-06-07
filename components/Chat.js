import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import {
  GiftedChat,
  Bubble,
  InputToolbar
} from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';



const Chat = ({
  navigation,
  props
}) => {

  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState(null);


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

    setMessages(messages);

  };

  useEffect(
    () => {


      // Fetch Internet Connnection Info
      NetInfo.fetch().then(
        connection => {

          // If Internet is connected
          if (connection.isConnected) {
            console.log('online');

            setIsConnected(true);

            // Otherwise
          } else {
            console.log('offline');
            setIsConnected(false);

          }
        }
      );

      getMessages();

      referenceChatMessages = db.collection('messages');

      unsubscribe = referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(onMessageUpdate);

      authUnsubscribe = auth.onAuthStateChanged(

        async (user) => {
          if (!user) {
            await auth.signInAnonymously();
          }


          setUid(user.uid);
          setMessages([]);

          unsubscribe = referenceChatMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(onMessageUpdate);

          referenceChatMessagesUser = db.collection('messages').where(
            'uid',
            '==',
            uid
          );
        }
      );

      // Bring in the prop 'name'
      const name = route.params.name;
      // Bring props to setOptions
      navigation.setOptions({

        // set name as title
        title: name
      });

    }, [

    // When component is about to be removed from DOM

    // Unsubscribe from Firebase
    unsubscribe();

  // Unsubscribe Auth from Firebase
  authUnsubscribe();
  ]
  );


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
      renderCustomView={this.renderCustomView}
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

};

export default Chat;


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