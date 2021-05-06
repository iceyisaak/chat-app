import React, { Component } from 'react';
import {
  View,
  Button,
  ImageBackground,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';


export default class Start extends Component {

  constructor(props) {
    super(props);

    this.state = {
      text: ''
    };

  }

  render() {

    return (

      <View style={styles.container}>

        <Text style={styles.Text}>
          Chat App
        </Text>

        <View style={styles.InputBackground}>

          <TextInput
            style={styles.TextInput}
            onChange={
              (text) => this.setState({ text })
            }
            value={this.state.text}
            placeholder='Your Name'
          />

          <Button
            style={styles.Button}
            title='Chat Now'
            onPress={() => {
              this.props.navigation.navigate('Chat');
            }}
          />

        </View>

      </View>

    );

  }
}

const image = { uri: '../assets/Background Image.png' };

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center'
  },

  InputBackground: {
    backgroundColor: '#dadada',
    // width: 6
    // height: 40,
    // padding: 20
  },

  Text: {
    margin: 'auto',
    justifyContent: 'center'
  },

  TextInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    margin: 20
  },

  Button: {
    width: 1,
    padding: 20,
    margin: 30,
    backgroundColor: '#99ffcc'
  }

});
