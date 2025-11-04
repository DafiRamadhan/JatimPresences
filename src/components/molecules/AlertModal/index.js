import React, {useState, useRef, useEffect} from 'react';
import {Image, Text, View, Animated, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
// import 'react-native-gesture-handler';

function AlertModal(props) {
const animValue = useRef(new Animated.Value(0)).current;


  useEffect(() => {
    if (props.SHOW) {
        props.HIDE;
      Animated.timing(animValue, {
        duration: 300,
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animValue, {
        duration: 200,
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        props.HIDE;
      });
    }
  }, [props.SHOW, animValue]);

  const bgAnimStyle = {
    backgroundColor: 'rgba(0,0,0,0.3)',
    opacity: animValue,
  };

  const promptAnimStyle = {
    transform: [
      {
        translateY: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [300, 0],
        }),
      },
    ],
  };

  return (
    <Modal transparent={true} visible={props.SHOW}>
      <View style={[styles.wrapper]}>
        <View style={{flex: 1}} />

        <Animated.View style={[styles.prompt, promptAnimStyle]}>
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center', marginTop:RFValue(-40)}}>
                 
                 {props.TYPE == 'error' ?
                    <LottieView source={require('../../../assets/lottie/40483-error.json')} autoPlay loop/>
                 :
                 props.TYPE == 'success' ?
                    <LottieView source={require('../../../assets/lottie/66258-success.json')} autoPlay loop/>
                 :
                    null
                 }
                 
          </View>

          <View style={{width:'80%',height:RFValue(50) , marginTop: RFValue(-50) , justifyContent:'center', alignItems:'center', alignSelf:'center'}}>
            <Text style={{fontSize:RFValue(12), textAlign:'center'}}>{props.MESSAGE == undefined ? '' : props.MESSAGE.toString()}</Text>
          </View>

          {/* {console.log(JSON.stringify(props.MESSAGE))} */}

          <TouchableOpacity style={{marginTop:RFValue(20),width:100, height:RFValue(30), borderWidth:0.5, borderRadius:10, justifyContent:'center', alignItems:'center',alignSelf:'center', backgroundColor: props.TYPE == 'success' ? 'green' : 'red'}} onPress={props.HIDE}>
            <Text style={{fontSize:RFValue(12), color:'white',}}>Ok</Text>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.promptBg, bgAnimStyle]} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  promptBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  prompt: {
    height: 300,
    alignSelf: 'stretch',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 20,
    zIndex: 2,
  },
  root: {flex: 1, padding: 20},
  title: {textAlign: 'center', fontSize: 30},
  codeFieldRoot: {marginTop: 20},
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderColor: '#00000030',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
});

export default AlertModal;
