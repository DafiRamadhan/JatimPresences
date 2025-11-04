import React, {Component} from 'react';
import API from '../../../config/services';
import md5 from 'md5';
import {connect} from 'react-redux';
import OneSignal from 'react-native-onesignal';
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
//import Toast from 'react-native-toast-native';
import StyleGuide from '../../../components/StyleGuide';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AlertModal from '../../../components/molecules/AlertModal';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';

import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';

const {height, width} = Dimensions.get('window');

var idOneSignal = '';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isLoading: false,
      uidSes: '',
      pwdSes: '',
      gambar: [],
      showAlert: false,
      alertMessage: '',
      alertType: 'success',
      hidePass: true,
    };
    // OneSignal.init("119f2e99-d648-40eb-b441-70dec721300f", {kOSSettingsKeyAutoPrompt : true});// set kOSSettingsKeyAutoPrompt to false prompting manually on iOS
    // OneSignal.addEventListener('received', this.onReceived);
    // OneSignal.addEventListener('opened', this.onOpened);
    // OneSignal.addEventListener('ids', this.onIds);
  }

  // componentWillUnmount() {
  //     OneSignal.removeEventListener('received', this.onReceived);
  //     OneSignal.removeEventListener('opened', this.onOpened);
  //     OneSignal.removeEventListener('ids', this.onIds);
  // }

  // onReceived(notification) {
  //     console.log("Notification received: ", notification);
  // }

  // onOpened(openResult) {
  //     console.log('Message: ', openResult.notification.payload.body);
  //     console.log('Data: ', openResult.notification.payload.additionalData);
  //     console.log('isActive: ', openResult.notification.isAppInFocus);
  //     console.log('openResult: ', openResult);
  // }

  // onIds(device) {
  //     idOneSignal = device.userId;
  //     // console.log('ID ONESIGNAL : ' + idOneSignal)
  // }

  getToken = async () => {
    try {
      let uidToken = await AsyncStorage.getItem('uidSes');
      let pwdToken = await AsyncStorage.getItem('pwdSes');

      this.setState({
        uidSes: uidToken,
        pwdSes: pwdToken,
      });
      if (!uidToken) {
        this.setState({
          uidSes: '',
          pwdSes: '',
        });
      }
    } catch (e) {
      //   console.log('Error GetToker : ', e)
    }
  };

  onLogin = async (username, password) => {
    const deviceState = await OneSignal.getDeviceState();
    // if (username == '' || this.state.password == ''){
    //     this.setState({
    //         showAlert : true,
    //         alertMessage : 'Username / Password tidak boleh kosong!',
    //         alertType : 'error',
    //     })
    //     return;
    // }
    try {
      this.setState({isLoading: true});
      const bodyData = {
        username: username,
        password: password,
        deviceId: deviceState.userId,
        appVersion: this.props.appVersion,
      };
      // console.log("REQ LOGIN :" , bodyData)
      await API.Login(bodyData).then(
        ResponseJson => {
          // console.log("RESP LOGIN :" , ResponseJson)
          if (ResponseJson.ResponseCode == '00') {
            if (ResponseJson.data && ResponseJson.data.length > 0) {
              this.props.loginSuccess(ResponseJson.data);
              AsyncStorage.setItem('uidSes', username);
              AsyncStorage.setItem('pwdSes', password);
              this.props.setApp(deviceState.userId);
              const bdIlang = {
                NIP: username,
              };
              API.Ilang(bdIlang).then(
                ResponseJson => {
                  if (ResponseJson.ResponseCode == '00') {
                    this.props.setIlang(true);
                    this.props.setModalQuestion(false);
                    this.props.navigation.navigate('Home');
                    this.setState({isLoading: false});
                  } else {
                    this.props.setIlang(false);
                    this.props.setModalQuestion(false);
                    this.props.navigation.navigate('Home');
                    this.setState({isLoading: false});
                  }
                },
                err => {
                  //Alert.alert("Gagal Login",err)
                  this.setState({
                    showAlert: true,
                    alertMessage: err.message,
                    alertType: 'error',
                  });
                  //Toast.show('Error : \n' + err, Toast.LONG, Toast.TOP, StyleGuide.toastAlert);
                  this.setState({isLoading: false});
                },
              );
            } else {
              this.setState({isLoading: false});
              //Alert.alert("Gagal Login",'Terjadi Kesalahan Login!')
              this.setState({
                showAlert: true,
                alertMessage: 'Terjadi Kesalahan Login!',
                alertType: 'error',
              });
              //Toast.show('Terjadi Kesalahan Login!', Toast.LONG, Toast.TOP, StyleGuide.toastAlert);
            }
          } else {
            //Toast.show('Login Gagal !\n' + '(' + ResponseJson.ResponseCode + ') ' + ResponseJson.ResponseDesc, Toast.LONG, Toast.TOP, StyleGuide.toastAlert);
            //Alert.alert("Gagal Login",ResponseJson.ResponseDesc)
            this.setState({
              showAlert: true,
              alertMessage: ResponseJson.ResponseDesc,
              alertType: 'error',
            });
            this.setState({isLoading: false});
          }
        },
        err => {
          //Toast.show('Terdapat kesalahan sistem!\n' + err, Toast.LONG, Toast.TOP, StyleGuide.toastAlert);
          this.setState({
            showAlert: true,
            alertMessage: err.toString(),
            alertType: 'error',
          });
          this.setState({isLoading: false});
        },
      );
    } catch (e) {
      this.setState({
        showAlert: true,
        alertMessage: e.message,
        alertType: 'error',
      });
      //Toast.show('Terdapat kesalahan sistem!\n' + e, Toast.LONG, Toast.TOP, StyleGuide.toastAlert);
      this.setState({isLoading: false});
    }
  };

  componentDidMount = async () => {
    await this.getToken();
    if (this.state.uidSes && this.state.uidSes != '') {
      this.onLogin(this.state.uidSes, this.state.pwdSes);
    }
  };

  render() {
    // return(
    //     <View style={{alignItems:'center',  flex:1, backgroundColor:'#fff'}}>
    //         <StatusBar  barStyle="light-content" translucent backgroundColor='transparent' />
    //         <LottieView source={require('../../../assets/loading-2.json')} autoPlay loop/>
    //     </View>
    // )
    if (this.state.isLoading) {
      return (
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            backgroundColor: '#fff',
            width: width,
            height: height,
          }}>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />
          <LottieView
            source={require('../../../assets/loading-2.json')}
            autoPlay
            loop
          />
        </View>
      );
    }
    return (
      <ImageBackground
        style={{width: null, height: null, flex: 1, backgroundColor: 'grey'}}
        resizeMode="stretch"
        source={require('../../../assets/images/jatim2.png')}>
        <AlertModal
          SHOW={this.state.showAlert}
          HIDE={() => this.setState({showAlert: false})}
          MESSAGE={this.state.alertMessage}
          SET_ALERT={val => this.setState({showAlert: val})}
          TYPE={this.state.alertType}
        />
        <StatusBar translucent backgroundColor="transparent" />
        <KeyboardAwareScrollView
          extraScrollHeight={RFValue(120)}
          enableOnAndroid>
          <View
            style={{
              ...styles.container,
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '90%',
                height: RFValue(55),
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 30,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '15%',
                  height: RFValue(50),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon
                  name="account"
                  size={RFValue(30)}
                  style={{color: 'grey'}}
                />
              </View>
              <View
                style={{width: '65%', height: RFValue(45), marginRight: 10}}>
                <TextInput
                  style={{
                    width: '80%',
                    height: '100%',
                    borderBottomColor: 'grey',
                    color: 'black',
                  }}
                  placeholderTextColor={'grey'}
                  autoCapitalize={'words'}
                  autoCompleteType={'name'}
                  placeholder={'Username'}
                  value={this.state.username}
                  onChangeText={val => this.setState({username: val})}
                  keyboardType={'default'}
                  maxLength={16}
                />
              </View>
            </View>
            <View
              style={{
                width: '90%',
                height: RFValue(55),
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                marginTop: RFValue(10),
                borderRadius: 30,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '15%',
                  height: RFValue(50),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="key" size={RFValue(20)} style={{color: 'grey'}} />
              </View>
              <View style={{width: '55%', height: RFValue(45), marginRight: 0}}>
                <TextInput
                  style={{
                    width: '100%',
                    height: '100%',
                    borderBottomColor: 'grey',
                    color: 'black',
                  }}
                  placeholderTextColor={'grey'}
                  placeholder={'Password'}
                  value={this.state.password}
                  onChangeText={val => this.setState({password: val})}
                  keyboardType={'default'}
                  secureTextEntry={this.state.hidePass}
                  autoCapitalize="none"
                  maxLength={16}
                />
              </View>
              <TouchableOpacity
                onPressIn={() => this.setState({hidePass: false})}
                onPressOut={() => this.setState({hidePass: true})}
                style={{
                  width: RFValue(50),
                  height: RFValue(50),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Icon name="eye" size={RFValue(20)} style={{color: 'grey'}} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{...styles.button, marginTop: 10}}
              onPress={() =>
                this.onLogin(this.state.username, md5(this.state.password))
              }>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View>
              <Text style={{color: 'white', fontSize: 10}}>
                Ver. {this.props.appVersion}
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: height * 0.65,
    flex: 1,
    //alignItems:'center',
    //justifyContent :'center',
  },
  containerForm: {
    alignSelf: 'center',
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop : height
  },
  inputBox: {
    width: RFValue(300),
    height: RFValue(50),
    backgroundColor: 'rgba(128, 128,128,0.7)',
    borderRadius: RFValue(25),
    paddingHorizontal: RFValue(16),
    fontSize: RFValue(16),
    color: '#ffffff',
    marginVertical: RFValue(10),
  },
  button: {
    width: RFValue(150),
    backgroundColor: '#edb879',
    borderRadius: RFValue(25),
    marginVertical: RFValue(5),
    height: RFValue(35),
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: RFValue(16),
    fontWeight: '500',
    color: '#ffffff',
    textAlign: 'center',
  },
  containerLogo: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  logoText: {
    marginVertical: RFValue(15),
    fontSize: RFValue(18),
    color: 'rgba(255, 255, 255, 0.7)',
  },
});

const mapDispatchToProps = dispatch => ({
  loginSuccess: val =>
    dispatch({
      type: 'SETLGN',
      nip: val[0].nip,
      userLogin: val[0].nama,
      namaCabang: val[0].namacab,
      kodeshift: val[0].kodeshift,
      namaWilayah: '',
      divisi: '',
      levelDesc: val[0].namajabatan,
      kdCab: '',
      kdWil: '',
      userCode: '',
      lvlUser: val[0].lvlUser,
      fotoUser: val[0].foto,
      lvlGrp: '',
      latKantor: Number(val[0].latkantor),
      longKantor: Number(val[0].longkantor),
      kdBiroSdm: val[0].birosdm,
      kdCabSdm: val[0].kdcabsdm,
      kdCabCore: val[0].kdcabcore,
    }),
  setApp: idSgnl =>
    dispatch({
      type: 'SETTING',
      idOneSignal: idSgnl,
    }),
  setIlang: val =>
    dispatch({
      type: 'SETILANG',
      ilang: val,
    }),
  setModalQuestion: val =>
    dispatch({
      type: 'SETMDLQSTN',
      modalQuestion: val,
    }),
});

const mapStateToProps = state => {
  return {
    appVersion: state.appVersion,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
