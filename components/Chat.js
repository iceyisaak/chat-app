import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

export default class Chat extends Component {

  render() {

    let { name, color } = this.props.route.params;

    return (

      <View style={styles.container}>
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
    alignItems: 'center',
    backgroundColor: color
  }

});