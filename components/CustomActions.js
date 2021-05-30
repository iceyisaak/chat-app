import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
// import { storage } from '../firebase';
import firebase from 'firebase';

export default class CustomActions extends Component {



  onActionPress = () => {

    const options = [
      'Choose From Library',
      'Take Photo',
      'Send Location',
      'Cancel'
    ];

    const cancelButtonIndex = options.length - 1;

    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            console.log('Picking an Image');
            return this.pickImage();

          case 1:
            console.log('Taking a Photo');
            return this.takePhoto();

          case 2:
            console.log('Getting the Location');
            return this.getLocation();

        }
      }
    );

  };

  // uploadImageFetch()
  uploadImageFetch = async (uri) => {

    console.log('uploadImageFetch(): ', uri);
    const blob = await new Promise(

      (resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.onload = function () {
          resolve(xhr.response);
        };

        xhr.onerror = function (e) {
          console.log(e);
          reject(
            new TypeError('Network Request Failed')
          );
        };

        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      }
    );

    const imageNameBefore = uri.split('/');
    const imageName = imageNameBefore[imageNameBefore.length - 1];

    // const ref = storage.ref().child(`images/${imageName}`);
    const ref = firebase.storage().ref().child(`images/${imageName}`);

    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  };


  // pickImage()
  pickImage = async () => {

    try {


      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status === 'granted') {

        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images

        }).catch(
          (error) => console.log(error)
        );

        if (!result.cancelled) {

          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({
            image: imageUrl,
            text: null
          });

        }

      }

    } catch (error) {
      console.log(error);
    }

  };


  // takePhoto()
  takePhoto = async () => {


    const { status } = await Permissions.askAsync(
      Permissions.CAMERA,
      Permissions.CAMERA_ROLL
    );

    try {


      if (status === 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: 'Images'
        }).catch(
          error => console.log(error)
        );

        if (!result.cancelled) {

          const imageUrl = await this.uploadImageFetch(result.uri);
          this.props.onSend({
            image: imageUrl,
            text: null
          });
        }
      }

    } catch (error) {
      console.log(error);
    }

  };


  // getLocation
  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);

    try {

      if (status === 'granted') {
        let result = await Location.getCurrentPositionAsync(
          {}
        ).catch(
          (error) => console.log(error)
        );

        if (result) {
          this.props.onSend({
            location: {
              longitude: result.coords.longitude,
              latitude: result.coords.latitude
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };


  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.onActionPress}
      >
        <View
          style={[
            styles.wrapper,
            this.props.wrapperStyle
          ]}
        >

          <Text
            style={[
              styles.iconText,
              this.props.iconTextStyle
            ]}
          >
            +
          </Text>

        </View>
      </TouchableOpacity>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center'
  }
});


CustomActions.contextTypes = {
  actionSheet: PropTypes.func
};