import React, {PureComponent,} from 'react';
import {View,StatusBar, Text, TouchableNativeFeedbackBase, Platform, } from 'react-native'
import {RNCamera, FaceDetector} from 'react-native-camera';
import {connect} from 'react-redux';
import { withNavigation } from 'react-navigation';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {TouchableOpacity, Alert, StyleSheet} from 'react-native';
import FSLTechFilter from '../FSLTechFilters';
import GlassesFilter from '../GlassesFilter';
import ImageResizer from 'react-native-image-resizer'; 
import ImgToBase64 from 'react-native-image-base64';
import API from '../../config/services';
import ImageEditor from "@react-native-community/image-editor";
import FaceDetection, { FaceDetectorContourMode, FaceDetectorLandmarkMode, FaceContourType } from "react-native-face-detection";

const timer = require('react-native-timer');

class Camera extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      takingPic: false,
      box: null,
      leftEyePosition: null,
      rightEyePosition: null,
      timerOn : false,
      isLoading : false,
      isLoadingFace : false,
      faceDetection : null,
      canDetectFaces : false,
    };
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  takePicture = async () => {
    if ( this.camera && !this.state.takingPic ) {

      let options = {
        quality: 0.5,
        fixOrientation: true,
        forceUpOrientation: true,
      };

      this.setState({takingPic: true, isLoading :true});

      try {
        const data = await this.camera.takePictureAsync(options);
        await ImageResizer.createResizedImage(data.uri, 500, 500, "JPEG", 50).then((resizedImageUri) => {
          ImgToBase64.getBase64String(resizedImageUri.uri).then(base64String => 
            FaceDetection.processImage(resizedImageUri.uri).then((result) => {
              //console.log(result);
              if (result.length > 0){
                this.setState({
                  isLoading:false,
                  takingPic: false,
                });
                this.props.onPicture(base64String);
              }else{
                this.setState({
                  isLoading:false,
                  takingPic: false,
                });
                Alert.alert('Perhatian', 'Tidak dapat mendeteksi wajah !')
              }
            }) 
          ).catch(err => {
                this.setState({
                  isLoading:false,
                  takingPic: false
                });
          });                     
        }).catch((err) => {
          Alert.alert('Gagal Capture Wajah', (err.message || err));
          this.setState({
            isLoading:false,
            takingPic: false
          });
        });
      } catch (err) {
        this.setState({takingPic: false});
        Alert.alert('Gagal Capture Wajah',(err.message || err));
        return;
      }finally{
        this.setState({ isLoading : false})
      }
    }
  };
  
  render() {
    try{
      return (
          <>
          <StatusBar  barStyle="dark-content" translucent backgroundColor='transparent' />
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              captureAudio={false}
              distance = {200}
              style={{flex: 1}}
              type={RNCamera.Constants.Type.front}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}>
              <View style={{flexDirection:'row', justifyContent:'flex-end', height:'100%' }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.btnAlignment}
                  onPress={() => this.props.cancelCamera()}>
                  <Icon name="close" size={50} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={styles.btnAlignment}
                  onPress={() => {
                    this.takePicture()
                    }}>
                  <Icon name="camera" size={50} color="#fff" />
                </TouchableOpacity>
              </View>
            </RNCamera>
          </>
        );
    }catch(e){
      return(
        <View>
          <Text>{e}</Text>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  btnAlignment: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignSelf:'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
});

const mapStateToProps = (state) => {
  return {
      nip : state.nip,
      userLogin : state.userLogin
  }
};

export default withNavigation(connect(mapStateToProps,null) (Camera));