import React, { Component } from 'react';
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
      messages: []
    };

  }

  componentDidMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hi Dev',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Sam Green',
            avatar: 'https://placeimg.com/140/140/any'
          }
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true
        }
      ]
    });
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
      })
    );
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

    let name = this.props.route.params.name;
    this.props.navigation.setOptions({
      title: name
    });

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
            _id: 1
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


const styles = StyleSheet.create({

  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center'
  }

});