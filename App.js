import React, {Component} from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Platform,
  PermissionsAndroid,
  ImageBackground,
  StatusBar,
} from 'react-native';

import Router from './src/config/router'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createStore} from 'redux'
import {Provider} from 'react-redux';
import rootReducer from './src/config/redux/globalReducer';
import LottieView from 'lottie-react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import OneSignal from 'react-native-onesignal';

console.disableYellowBox = true
const storeRedux = createStore(rootReducer);

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      LogoAnime: new Animated.Value(0),
      LogoText: new Animated.Value(0),
      loadingSpinner: false,
      tampilkan : false,
      name: props.name,
        isSubscribed: false,
        requiresPrivacyConsent: false,
        isLocationShared: false,
        inputValue: "",
        consoleValue: ""
    };
  }

  componentDidMount =  async() => {
  /* O N E S I G N A L   S E T U P */
  OneSignal.setAppId("119f2e99-d648-40eb-b441-70dec721300f");
  OneSignal.setLogLevel(6, 0);
  OneSignal.setRequiresUserPrivacyConsent(this.state.requiresPrivacyConsent);
  OneSignal.promptForPushNotificationsWithUserResponse(response => {
      this.OSLog("Prompt response:", response);
  });

  /* O N E S I G N A L  H A N D L E R S */
  OneSignal.setNotificationWillShowInForegroundHandler(notifReceivedEvent => {
      this.OSLog("OneSignal: notification will show in foreground:", notifReceivedEvent);
      let notif = notifReceivedEvent.getNotification();
     

      const button1 = {
          text: "Cancel",
          onPress: () => { notifReceivedEvent.complete(); },
          style: "cancel"
      };

      const button2 = { text: "Complete", onPress: () => { notifReceivedEvent.complete(notif); }};

      Alert.alert("Complete notification?", "Test", [ button1, button2], { cancelable: true });
      });

      OneSignal.setNotificationOpenedHandler(notification => {
          this.OSLog("OneSignal: notification opened:", notification);
      });

      OneSignal.setInAppMessageClickHandler(event => {
          this.OSLog("OneSignal IAM clicked:", event);
      });

      OneSignal.addEmailSubscriptionObserver((event) => {
          this.OSLog("OneSignal: email subscription changed: ", event);
      });

      OneSignal.addSubscriptionObserver(event => {
          this.OSLog("OneSignal: subscription changed:", event);
          this.setState({ isSubscribed: event.to.isSubscribed})
      });

      OneSignal.addPermissionObserver(event => {
          this.OSLog("OneSignal: permission changed:", event);
      });
      
      const state = await OneSignal.getDeviceState();
      this.setState({
          name : state.emailAddress,
          isSubscribed : state.isSubscribed
      });

    const {LogoAnime, LogoText} = this.state;
    Animated.parallel([
      Animated.spring(LogoAnime, {
        toValue: 1,
        tension: 20,
        friction: 2,
        duration: 1000,
      }).start(),

      Animated.timing(LogoText, {
        toValue: 1,
        duration: 1200,
      }),
    ]).start(() => {
      this.setState({
        //loadingSpinner: true,
      });

      setTimeout(() => {
          this.setState({
           // loadingSpinner: false,
            tampilkan: true,
          });

        }, 3000);
    });

    if (Platform.OS == 'android'){
      const granted1 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'GPS',
          message:'Izinkan aplikasi akses GPS anda?',
          buttonNeutral: 'Ntar aja...',
          buttonNegative: 'Jangan',
          buttonPositive: 'Oke Bosque',
        },
      );
      if (granted1 === PermissionsAndroid.RESULTS.GRANTED) {
        //console.log('You can use the GPS');
      } else {
        // console.log('GPS permission denied');
      }

      const granted3 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'CAMERA',
          message:'Izinkan aplikasi akses CAMERA anda?',
          buttonNeutral: 'Ntar aja...',
          buttonNegative: 'Jangan',
          buttonPositive: 'Oke Bosque',
        },
      );
      if (granted3 === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('You can use the CAMERA');
      } else {
        // console.log('CAMERA permission denied');
      }

      const granted5 = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'WRITE_EXTERNAL_STORAGE',
          message:'Izinkan aplikasi akses WRITE_EXTERNAL_STORAGE anda?',
          buttonNeutral: 'Ntar aja...',
          buttonNegative: 'Jangan',
          buttonPositive: 'Oke Bosque',
        },
      );
      if (granted5 === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log('You can use the WRITE_EXTERNAL_STORAGE');
      } else {
        // console.log('WRITE_EXTERNAL_STORAGE permission denied');
      }
    }

  }

  componentWillUnmount() {
    //OneSignal.clearHandlers();
  }
  
  OSLog = (message, optionalArg) => {
  
    if (optionalArg) {
        message = message + JSON.stringify(optionalArg);
    }
  
    // console.log(message.notificationId);
  
    let consoleValue;
  
    if (this.state.consoleValue) {
        consoleValue = this.state.consoleValue+"\n"+message
    } else {
        consoleValue = message;
    }
    this.setState({ consoleValue });
  }

  render(){
    return(
      <>
      {this.state.tampilkan ? 
       <Provider store={storeRedux}>
          <Router/>
      </Provider>
      : 
      <ImageBackground resizeMode ='cover' style={{flex:1,justifyContent:'center',alignItems:'center'}} source={require('./src/assets/images/Background-BW.png')}>
        <StatusBar translucent backgroundColor='transparent' />
          <View style={{alignItems: 'center', justifyContent: 'center',height:RFValue(350),width:RFValue(350)}}>
              <LottieView source={require('./src/assets/lottie/working-on-laptop-lottie-animation.json')} autoPlay loop/>
          </View>
        <Animated.View style={{opacity: this.state.LogoText}}>
          <Text style={styles.logoText}> Jatim Presences </Text>
        </Animated.View>
      </ImageBackground>
      }
    </>
    );
  }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoText: {
    color: '#9D1D20',
    fontFamily: 'GoogleSans-Bold',
    fontSize: RFValue(30),
    marginTop: RFValue(5),
    fontWeight: '200',
    fontStyle:'italic'
  },
});


