import React, { Component } from 'react';
import {
  View,
  ImageBackground,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableOpacity
} from 'react-native';

const image = require('../assets/backgroundImage.png');

export default class Start extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      color: '#8A95A5',
      selected: 'swatch3'
    };

  }

  render() {

    return (

      <KeyboardAvoidingView
        style={styles.container}
        behavior='height'
      >

        <ImageBackground
          source={image}
          style={styles.ImageBackground}
        >


          <View style={styles.AppHeadingView}>

            <Text style={styles.AppName}>
              Chat App
            </Text>

            <Text style={styles.AppSlogan}>
              Bringing the World Closer
            </Text>

          </View>

          <View style={styles.InputBackground}>

            <TextInput
              style={styles.TextInput}
              onChangeText={
                (name) => this.setState({
                  name
                })
              }
              value={this.state.name}
              placeholder='Your Name'
            />

            <View style={styles.colorSwatchSection}>

              <Text style={styles.colorSwatchText}>
                Choose Background Colour:
              </Text>

              <View style={styles.colorSwatchContainer}>

                <TouchableOpacity
                  style={
                    this.state.selected === 'swatch1'
                      ? styles.colorSwatch1__selected
                      : styles.colorSwatch1
                  }
                  onPress={
                    () => this.setState({
                      color: '#090C08',
                      selected: 'swatch1'
                    })

                  }
                  accessible={true}
                  accessibilityLabel='swatch1'
                  accessbibilityHint='Black background'
                  accessibilityRole='button'
                ></TouchableOpacity>

                <TouchableOpacity
                  style={
                    this.state.selected === 'swatch2'
                      ? styles.colorSwatch2__selected
                      : styles.colorSwatch2
                  }
                  onPress={
                    () => this.setState({
                      color: '#474056',
                      selected: 'swatch2'
                    })
                  }
                  accessible={true}
                  accessibilityLabel='swatch2'
                  accessibilityHint='Dark Purple background'
                  accessibilityRole='button'
                ></TouchableOpacity>

                <TouchableOpacity
                  style={
                    this.state.selected === 'swatch3'
                      ? styles.colorSwatch3__selected
                      : styles.colorSwatch3
                  }
                  onPress={
                    () => this.setState({
                      color: '#8A95A5',
                      selected: 'swatch3'
                    })
                  }
                  accessible={true}
                  accessibilityLabel='swatch3'
                  accessibilityHint='Grey background'
                  accessibilityRole='button'
                >
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    this.state.selected === 'swatch4'
                      ? styles.colorSwatch4__selected
                      : styles.colorSwatch4
                  }
                  onPress={
                    () => this.setState({
                      color: '#B9C6AE',
                      selected: 'swatch4'
                    })
                  }
                  accessibility={true}
                  accessibilityLabel='swatch4'
                  accessibilityHint='Light Grey background'
                  accessibilityRole='button'
                ></TouchableOpacity>

              </View>

            </View>


            <TouchableOpacity
              style={styles.Button}
              onPress={() => {
                // console.log('StartJS', this.props);
                this.props.navigation.navigate(
                  'Chat',
                  {
                    name: this.state.name,
                    color: this.state.color
                  }
                );
              }}
              accessibility={true}
              accessibilityLabel='Chat Button'
              accessibilityHint='Chat Now'
              accessibilityRole='button'
            >

              <Text style={styles.ButtonText}>
                Chat Now
              </Text>

            </TouchableOpacity>


          </View>

        </ImageBackground>

      </KeyboardAvoidingView >
    );

  }
}

const selectedStateColor = '#1D8E36';

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'space-between'
  },

  ImageBackground: {
    flex: 1,
    height: '100%',
    resizeMode: 'cover',
    justifyContent: 'center',
  },

  InputBackground: {
    backgroundColor: '#DADADA',
    width: '88 %',
    height: 320,
    alignSelf: 'center',
    justifyContent: 'center',
  },

  AppHeadingView: {
    top: 60,
    alignSelf: 'center',
    marginBottom: '75%',
  },

  AppName: {
    alignSelf: 'center',
    justifyContent: 'flex-start',
    fontSize: 45,
    fontWeight: '600',
    color: '#FFF'
  },

  AppSlogan: {
    fontSize: 10,
    marginLeft: 6,
    color: '#FFF'
  },

  TextInput: {
    height: '20%',
    width: '88%',
    alignSelf: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
  },

  Button: {
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#757083',
    width: '88%',
    height: '20%'
  },

  ButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    alignSelf: 'center'
  },

  colorSwatchSection: {
    marginTop: 30,
    marginBottom: 30
  },

  colorSwatchText: {
    marginLeft: 23,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    marginBottom: 10
  },

  colorSwatchContainer: {
    flexDirection: 'row'
  },

  colorSwatch1: {
    backgroundColor: '#090C08',
    marginLeft: 25,
    width: 50,
    height: 50,
    borderRadius: 25
  },
  colorSwatch1__selected: {
    backgroundColor: '#090C08',
    marginLeft: 25,
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 10,
    borderColor: selectedStateColor,
    borderWidth: 3,
    borderStyle: 'solid',
  },

  colorSwatch2: {
    backgroundColor: '#474056',
    marginLeft: 25,
    width: 50,
    height: 50,
    borderRadius: 25
  },

  colorSwatch2__selected: {
    backgroundColor: '#474056',
    marginLeft: 25,
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 10,
    borderColor: selectedStateColor,
    borderWidth: 3,
    borderStyle: 'solid',
  },

  colorSwatch3: {
    backgroundColor: '#8A95A5',
    marginLeft: 25,
    width: 50,
    height: 50,
    borderRadius: 25
  },

  colorSwatch3__selected: {
    backgroundColor: '#8A95A5',
    marginLeft: 25,
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 10,
    borderColor: selectedStateColor,
    borderWidth: 3,
    borderStyle: 'solid',
  },

  colorSwatch4: {
    backgroundColor: '#B9C6AE',
    marginLeft: 25,
    width: 50,
    height: 50,
    borderRadius: 25
  },

  colorSwatch4__selected: {
    backgroundColor: '#B9C6AE',
    marginLeft: 25,
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 10,
    borderColor: selectedStateColor,
    borderWidth: 3,
    borderStyle: 'solid',
  },



});
