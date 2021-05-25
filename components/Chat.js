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

    console.log('onMessageUpdate()');

    querySnapshot.forEach(
      (doc) => {

        let data = doc.data();

        console.log('data: ', data);
        // console.log('messages: ', messages);
        if (Object.keys(data).length === 0) {

          console.log('if1: ');

          messages.push({
            _id: 1,
            text: 'This is the beginning of the Chat',
            createdAt: new Date(),
            user: this.state.uid,
            system: true
          });

          console.log('messages: ', messages);


        } else {

          console.log('else1: ');

          messages.push({
            _id: data._id,
            createdAt: data.createdAt.toDate(),
            text: data.text,
            user: data.user,
            image: data.image || '',
            location: data.location || null
          });

        }

      }
    );

    this.setState({
      messages
    });
    console.log('messages-2: ', messages);

  };

  componentDidMount() {

    this.referenceChatMessages = db.collection('messages');


    console.log('before unsubscribe-1', this.state.messages);
    this.unsubscribe = this.referenceChatMessages
      // .orderBy('createdAt', 'desc')
      .onSnapshot(this.onMessageUpdate);
    console.log('after unsubscribe-1', this.state.messages);

    this.authUnsubscribe = auth.onAuthStateChanged(

      async (user) => {
        if (!user) {
          await auth.signInAnonymously();
        }

        this.setState({
          uid: user.uid,
          messages: []
        });

        console.log('before unsubscribe-2: ', this.state.messages);
        this.unsubscribe = this.referenceChatMessages
          // .orderBy('createdAt', 'desc')
          .onSnapshot(this.onMessageUpdate);
        console.log('after unsubscribe-2', this.state.messages);

        this.referenceChatMessagesUser = db.collection('messages').where(
          'uid',
          '==',
          this.state.uid
        );
      }
    );
    console.log('after onAuthStateChanged()', this.state.messages);

    // Bring in the prop 'name'
    const name = this.props.route.params.name;
    // Bring props to setOptions
    this.props.navigation.setOptions({

      // set name as title
      title: name
    });

    console.log('after title name: ', this.state.messages);

    // console.log('messages2: ', this.state.messages);
    // if (this.state.messages.length == 0) {
    //   console.log('AAAAAA');
    //   this.setState({
    //     messages: [
    //       {
    //         _id: 1,
    //         text: 'This is the beginning of the Chat',
    //         createdAt: new Date(),
    //         system: true
    //       }
    //     ]
    //   });
    // }

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


  // Add Message
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