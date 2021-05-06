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
        <ImageBackground source={image}>


          <Text>
            Please Enter Your Name:
        </Text>

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

        </ImageBackground>
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

  TextInput: {
    height: 40,
    width: 300,
    padding: 12,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 20
  },

  Button: {
    width: 1,
    margin: 30,
    backgroundColor: '#1E6738'
  }

});
