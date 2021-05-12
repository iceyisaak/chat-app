import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';


export default class Chat extends Component {

  render() {

    const {
      name,
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
        <Text>
          Hello {name}
        </Text>
      </View>

    );

  }
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }

});