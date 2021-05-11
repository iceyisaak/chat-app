import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

export default class Chat extends Component {

  render() {

    let name = this.props.route.params;
    // const color = this.route.params.color;


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
    // backgroundColor: this.route.params.color
  }

});