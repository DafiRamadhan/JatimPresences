import React, { Component } from 'react';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';

class ScanQRCode extends Component {

    constructor(props){
        super(props)
        this.state = {

        }
    }

  onSuccess = e => {
    this.props.onQRScan(e);
  };

  render() {
    return (
      <>
      <StatusBar  barStyle="dark-content" translucent backgroundColor='transparent' />
      <RNCamera
        onBarCodeRead={this.onSuccess}
        captureAudio={false}
        distance = {200}
      >

          <BarcodeMask edgeColor={'#62B1F6'} showAnimatedLine={true}/>
          <View style={{flexDirection:'row', justifyContent:'flex-end', height:'100%' }}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.btnAlignment}
              onPress={() => this.props.cancelScan()}>
              <Icon name="close" size={50} color="#fff" />
            </TouchableOpacity>
          </View>
        </RNCamera>
      </>
      
    );
  }
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  },
  btnAlignment: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignSelf:'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default ScanQRCode;