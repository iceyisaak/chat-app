import React, { Component } from 'react';
import { db, auth } from '../firebase';
import {
  View,
  StyleSheet,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';



export default class Chat extends Component {

  constructor() {
    super();

    this.state = {
      messages: [],
      uid: ''
    };

  }

  onMessageUpdate = (querySnapshot) => {
    const messages = [];

    querySnapshot.forEach(
      (doc) => {

        let data = doc.data();

        // if (data.length === null) {
        //   messages.push({
        //     _id: 1,
        //     text: 'This is the beginning of the Chat',
        //     createdAt: new Date(),
        //     system: true
        //   });
        // }


        messages.push({
          _id: data._id,
          createdAt: data.createdAt.toDate(),
          text: data.text,
          user: data.user,
          image: data.image || '',
          location: data.location || null
        });

      }
    );


    console.log('data: ', data);
    this.setState({
      messages
    });

  };

  componentDidMount() {

    this.referenceChatMessages = db.collection('messages');
    this.unsubscribe = this.referenceChatMessages.onSnapshot(this.onMessageUpdate);

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
      }
    );

  };



  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user
    });
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
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
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
  }

});