import React, { Component, useState } from "react";
import {
  FlatList,
  Alert,
  BackHandler,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Platform,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  AppState,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import NavBar from "../../organisms/NavBar";
import HeaderApp from "../../../components/molecules/HeaderApp";
import { connect } from "react-redux";
import { withNavigation } from "react-navigation";
import OrientationLoadingOverlay from "react-native-orientation-loading-overlay";
import API from "../../../config/services";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-community/async-storage";
import Moment from "moment";
import FlashMessage, {
  showMessage,
  hideMessage,
} from "react-native-flash-message";
import Geolocation from "react-native-geolocation-service";
import DeviceInfo from "react-native-device-info";
import RNMockLocationDetector from "react-native-mock-location-detector";
import Camera from "../../../components/Camera";
import MapView, { Marker } from "react-native-maps";
import { request, PERMISSIONS } from "react-native-permissions";
import AlertModal from "../../../components/molecules/AlertModal";
import { RFValue } from "react-native-responsive-fontsize";
import ScanQRCode from "../../organisms/ScanQRCode";

const { height, width } = Dimensions.get("window");

function addZeroes(num) {
  var value = Number(num);
  var res = num.split(".");
  if (res.length == 1 || res[1].length < 3) {
    value = value.toFixed(2);
  }
  return value;
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLoadingList: false,
      isLoadingAddress: false,
      isLoadingQuestion: false,
      nip: this.props.nip,
      latitude: 0,
      longitude: 0,
      ketAbsen: "",
      fotoAbsen: "",
      alamatLengkap: "",
      alamatLengkapKantor: "",
      modalSurvey: false,
      jarakKantor: "",
      modalAbsen: true,
      listQuestion: [],
      cboxSetuju: false,
      jam: "",
      tdkAbsenMasuk: 0,
      terlambat: 0,
      tdkAbsenIstirahat: 0,
      tdkAbsenPulang: 0,
      absenPulangAwal: 0,
      jumlahHari: 0,
      shift: [],
      isMocked: false,
      listKantor: [],
      isTakeCam: false,
      takingPic: false,
      faceBox: null,
      stats: "",
      showAlert: false,
      alertMessage: " ",
      alertType: "success",
      isScanQr: false,
    };
  }

  onButtonPress = () => {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
    navigate("NewScreen");
  };

  handleBackButton = () => {
    if (this.props.navigation.isFocused()) {
      Alert.alert(
        "Keluar Aplikasi",
        "Apakah Anda yakin keluar dari aplikasi ini?",
        [
          {
            text: "Batal",
            onPress: () => null,
            style: "cancel",
          },
          {
            text: "Ya",
            onPress: () => BackHandler.exitApp(),
          },
        ],
        {
          cancelable: false,
        }
      );
      return true;
    }
  };

  LogOut = async () => {
    try {
      await AsyncStorage.setItem("uidSes", "");
      await AsyncStorage.setItem("pwdSes", "");
      this.props.navigation.navigate("LoginPage");
    } catch (e) {
      console.log("Error SetToken : ", e);
    }
  };

  getLocation = async () => {
    this.setState({ isLoadingAddress: true });
    await Geolocation.getCurrentPosition(
      (position) => {
        const koor = JSON.parse(JSON.stringify(position)).coords;

        this.setState({
          latitude: koor.latitude,
          longitude: koor.longitude,
        });

        if (koor.latitude != 0 && koor.latitude != 0) {
          this.getListKantor();
          this.setState({
            isMocked: JSON.parse(JSON.stringify(position)).mocked,
          });
        }
      },
      (error) => {
        this.setState({
          showAlert: true,
          alertMessage: error.message,
          alertType: "error",
        });
      },
      { timeout: 20000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  getListKantor = async () => {
    const bodyData = {
      nip: this.props.nip,
      lat: this.state.latitude,
      long: this.state.longitude,
    };

    await API.ListKantor(bodyData).then((ResponseJson) => {
      console.log(ResponseJson);
      if (ResponseJson.ResponseCode == "00") {
        this.setState({
          listKantor: ResponseJson.data,
          jarakKantor: ResponseJson.data.reduce(
            (min, obj) => (obj.JARAK < min ? obj.JARAK : min),
            ResponseJson.data[0].JARAK
          ),
        });
      } else {
        this.setState({
          listKantor: [],
          jarakKantor: "",
        });
      }
    });
  };

  componentWillUnmount() {
    this.appStateListener?.remove();
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
  }

  footerThis = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: RFValue(10),
          marginTop: RFValue(5),
          marginBottom: RFValue(5),
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            borderRadius: RFValue(10),
            backgroundColor: "#9D1D20",
            width: RFValue(100),
            height: RFValue(30),
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={this._pagePrev}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 13,
              color: "white",
              textAlign: "center",
            }}
          >
            {"<< Prev"}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginHorizontal: RFValue(20),
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: RFValue(13),
              color: "#9D1D20",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            Hal : {this.state.page}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            flex: 1,
            borderRadius: RFValue(10),
            backgroundColor: "#9D1D20",
            width: RFValue(100),
            height: RFValue(30),
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={this._pageNext}
        >
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 13,
              color: "white",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            {"Next >>"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  headerThis = () => {
    return (
      <View style={{ marginTop: RFValue(3) }}>
        <View style={styles.kolomContent}>
          <View style={styles.kolom1}>
            <Text
              style={{
                fontSize: RFValue(12),
                fontWeight: "bold",
                textAlign: "center",
                color: "#F7F7F7",
              }}
            >
              Tanggal
            </Text>
          </View>
          <View style={styles.kolom2}>
            <Text
              style={{
                fontSize: RFValue(12),
                fontWeight: "bold",
                textAlign: "center",
                color: "#F7F7F7",
              }}
            >
              Jam Masuk
            </Text>
          </View>
          <View style={styles.kolom3}>
            <Text
              style={{
                fontSize: RFValue(12),
                fontWeight: "bold",
                textAlign: "center",
                color: "#F7F7F7",
              }}
            >
              Jam Rehat Start
            </Text>
          </View>
          <View style={styles.kolom4}>
            <Text
              style={{
                fontSize: RFValue(12),
                fontWeight: "bold",
                textAlign: "center",
                color: "#F7F7F7",
              }}
            >
              Jam Rehat End
            </Text>
          </View>
          <View style={styles.kolom5}>
            <Text
              style={{
                fontSize: RFValue(12),
                fontWeight: "bold",
                textAlign: "center",
                color: "#F7F7F7",
              }}
            >
              Jam Pulang
            </Text>
          </View>
        </View>
      </View>
    );
  };

  capitalizeFirstLetter(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      // You do not need to check if i is larger than splitStr length, as your for does that for you
      // Assign it back to the array
      splitStr[i] =
        splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
    }
    // Directly return the joined string
    return splitStr.join(" ");
  }

  SetAnswerQuestion = (idx, val) => {
    let objTemp = this.state.listQuestion;
    let objIndex = objTemp.findIndex((obj) => obj.ID_QUESTION == idx);
    objTemp[objIndex].ANSWER = val ? "1" : "0";
    this.setState({ listQuestion: objTemp });
  };

  ShowRekapAbsensi = async () => {
    const bodyData = {
      NIP: this.props.nip,
      TGL: Moment(new Date()).format("YYYYMMDD"),
    };
    await API.RekapAbsensi(bodyData).then(
      (ResponseJson) => {
        //console.log(ResponseJson)
        if (ResponseJson.ResponseCode == "00") {
          this.setState({
            tdkAbsenMasuk: ResponseJson.data[0].NO_IN,
            terlambat: ResponseJson.data[0].LATE,
            tdkAbsenPulang: ResponseJson.data[0].NO_OUT,
            tdkAbsenIstirahat: ResponseJson.data[0].NO_BREAK,
            absenPulangAwal: ResponseJson.data[0].PLG_AWAL,
            jumlahHari: ResponseJson.data[0].JML_HARI,
          });
        } else {
          this.setState({
            showAlert: true,
            alertMessage:
              "Gagal Ambil Rekap Absensi. (" +
              ResponseJson.ResponseCode +
              ") " +
              ResponseJson.ResponseDesc,
            alertType: "error",
          });

          this.setState({
            tdkAbsenMasuk: 0,
            terlambat: 0,
            tdkAbsenIstirahat: 0,
            tdkAbsenIstirahat: 0,
            absenPulangAwal: 0,
            jumlahHari: 0,
            isLoading: false,
          });
        }
      },
      (err) => {
        this.setState({
          showAlert: true,
          alertMessage: err.message,
          alertType: "error",
        });
        this.setState({ isLoading: false });
      }
    );
  };

  savePhoto = async (obj) => {
    await Geolocation.getCurrentPosition(
      (position) => {
        const koor = JSON.parse(JSON.stringify(position)).coords;
        this.setState({
          latitude: koor.latitude,
          longitude: koor.longitude,
          isMocked: JSON.parse(JSON.stringify(position)).mocked,
          isTakeCam: false,
        });

        if (koor.latitude == 0 || koor.longitude == 0) {
          this.setState({
            showAlert: true,
            alertMessage:
              "GPS Offline. Harap enable GPS perangkat Anda / allow permission GPS untuk aplikasi ini guna perekaman koordinat posisi Anda. Apabila sudah dilakukan, harap logout terlebih dahulu lalu login kembali.",
            alertType: "error",
          });
          return;
        }

        if (JSON.parse(JSON.stringify(position)).mocked) {
          this.setState({
            showAlert: true,
            alertMessage:
              "Fake GPS / Mocked Location ditemukan ! Aktifitas Anda akan kami catat di log system e-Human Capital!",
            alertType: "error",
          });
          this.saveInfoDevices();
          return;
        }

        const bodyData = {
          nip: this.props.nip,
          lat: this.state.latitude,
          long: this.state.longitude,
          foto: obj.data,
          status: obj.status,
          keterangan: "-",
        };

        if (Platform.OS == "android") {
          this.setState({ isLoading: true });
        }

        API.InsertAbsensi(bodyData).then(
          (ResponseJson) => {
            // Alert.alert("Result Save: ", JSON.stringify(ResponseJson))
            if (ResponseJson.ResponseCode == "00") {
              this.ShowRekapAbsensi();
              this.setState({
                showAlert: true,
                alertMessage: "Absen Berhasil!",
                alertType: "success",
                isLoading: false,
              });
            } else {
              this.setState({
                showAlert: true,
                alertMessage: ResponseJson.ResponseDesc.toString(),
                alertType: "error",
                isLoading: false,
              });
            }
          },
          (err) => {
            //Alert.alert("Save Error: ", JSON.stringify(err))
            //console.log(JSON.stringify(err));
            this.setState({
              showAlert: true,
              alertMessage: err.message,
              alertType: "error",
              isLoading: false,
            });
          }
        );
      },
      (error) => {
        this.setState({
          showAlert: true,
          alertMessage: "GPS Error! (" + error.message + ")",
          alertType: "error",
          isLoading: false,
        });
        return;
      },
      { timeout: 20000, enableHighAccuracy: true, maximumAge: 0 }
    );
    //await this.ShowRekapAbsensi();
  };

  AbsensiEvent = async ({ QREVENT }) => {
    await Geolocation.getCurrentPosition(
      (position) => {
        const koor = JSON.parse(JSON.stringify(position)).coords;
        this.setState({
          latitude: koor.latitude,
          longitude: koor.longitude,
          isMocked: JSON.parse(JSON.stringify(position)).mocked,
          isTakeCam: false,
        });

        if (koor.latitude == 0 || koor.longitude == 0) {
          this.setState({
            showAlert: true,
            alertMessage:
              "GPS Offline. Harap enable GPS perangkat Anda / allow permission GPS untuk aplikasi ini guna perekaman koordinat posisi Anda. Apabila sudah dilakukan, harap logout terlebih dahulu lalu login kembali.",
            alertType: "error",
          });
          return;
        }

        if (JSON.parse(JSON.stringify(position)).mocked) {
          this.setState({
            showAlert: true,
            alertMessage:
              "Fake GPS / Mocked Location ditemukan ! Aktifitas Anda akan kami catat di log system e-Human Capital!",
            alertType: "error",
          });
          this.saveInfoDevices();
          return;
        }

        const bodyData = {
          NIP: this.props.nip,
          Latitude: this.state.latitude,
          Longitude: this.state.longitude,
          QREvent: QREVENT,
        };

        if (Platform.OS == "android") {
          this.setState({ isLoading: true });
        }

        API.AbsensiEvent(bodyData).then(
          (ResponseJson) => {
            // Alert.alert("Result Save: ", JSON.stringify(ResponseJson))
            if (ResponseJson.ResponseCode == "00") {
              this.ShowRekapAbsensi();
              this.setState({
                showAlert: true,
                alertMessage: "Absen Event Berhasil!",
                alertType: "success",
                isLoading: false,
              });
            } else {
              this.setState({
                showAlert: true,
                alertMessage: ResponseJson.ResponseDesc.toString(),
                alertType: "error",
                isLoading: false,
              });
            }
          },
          (err) => {
            //Alert.alert("Save Error: ", JSON.stringify(err))
            //console.log(JSON.stringify(err));
            this.setState({
              showAlert: true,
              alertMessage: err.message,
              alertType: "error",
              isLoading: false,
            });
          }
        );
      },
      (error) => {
        this.setState({
          showAlert: true,
          alertMessage: "GPS Error! (" + error.message + ")",
          alertType: "error",
          isLoading: false,
        });
        return;
      },
      { timeout: 20000, enableHighAccuracy: true, maximumAge: 0 }
    );
    //await this.ShowRekapAbsensi();
  };

  saveInfoDevices = async () => {
    const PHONE_NUMB = await DeviceInfo.getPhoneNumber().then((val) => {
      return val;
    });

    let DEVICE_ID = await DeviceInfo.getUniqueId();

    const BATTERY_LVL = await DeviceInfo.getBatteryLevel().then((val) => {
      return (val * 100).toFixed(2).toString() + "%";
    });

    const BRAND_DEVICE = await DeviceInfo.getBrand();

    const CARRIER = await DeviceInfo.getCarrier().then((val) => {
      return val;
    });

    const IP_ADDRESS = await DeviceInfo.getIpAddress().then((val) => {
      return val;
    });

    const MAC_ADDRESS = await DeviceInfo.getMacAddress().then((val) => {
      return val;
    });

    const LOCATION_ENABLE = await DeviceInfo.isLocationEnabled().then((val) => {
      return val;
    });

    const OS_VER = await DeviceInfo.getBaseOs().then((val) => {
      return val;
    });

    let APP_VER = await DeviceInfo.getBuildNumber();

    const FREE_STORAGE = await DeviceInfo.getFreeDiskStorage().then((val) => {
      return val;
    });

    const dataNya = [];
    dataNya.push({
      NIP: this.props.nip,
      DEVICE_ID,
      BATTERY_LVL,
      FREE_STORAGE,
      BRAND_DEVICE,
      CARRIER,
      ONESIGNAL_ID: this.props.idOneSignal,
      IP_ADDRESS,
      MAC_ADDRESS,
      PHONE_NUMB,
      OS_VER,
      LOCATION_ENABLE,
      GPS_MOCK: this.state.isMocked,
      LATITUDE: this.state.latitude,
      LONGITUDE: this.state.longitude,
      APP_VER,
    });

    //console.log('InsertDeviceInfo : ' + JSON.stringify(dataNya))
    await API.InsertDeviceInfo(dataNya).then(
      (ResponseJson) => {
        this.setState({ isLoading: false });
      },
      (err) => {
        // console.log('Error InsertDeviceInfo : ' + err)
        this.setState({ isLoading: false });
      }
    );
  };

  InqShift = async () => {
    const bodyData = {
      nip: this.props.nip,
      kodeshift: this.props.kodeshift,
    };
    await API.InqShift(bodyData).then(
      (ResponseJson) => {
        if (ResponseJson.ResponseCode == "00") {
          this.setState({
            shift: ResponseJson.data,
          });
        } else {
          this.setState({
            showAlert: true,
            alertMessage:
              "Gagal Ambil Data Shift. (" +
              ResponseJson.ResponseCode +
              ") " +
              ResponseJson.ResponseDesc,
            alertType: "error",
          });
          this.setState({
            shift: [],
          });
        }
      },
      (err) => {
        this.setState({
          showAlert: true,
          alertMessage: "Gagal Ambil Data Shift. (" + err.message + ")",
          alertType: "error",
        });
        this.setState({ isLoading: false });
      }
    );
  };

  handleAppStateChange = (nextState) => {
    if (nextState === "active") {
      this.getLocation();
    }
  };

  componentDidMount = async () => {
    try {
      BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
      this.setState({ isLoading: true });
      request(PERMISSIONS.IOS.LOCATION_ALWAYS).then((result) => {
        //console.log(result);
      });

      const bodyData = {
        NIP: this.props.nip,
      };

      // console.log('REQ GETBADGE',bodyData);
      await API.GetBadge(bodyData).then((ResponseJson) => {
        // console.log('RESP GETBADGE',ResponseJson);
        if (ResponseJson.ResponseCode == "00") {
          this.props.setBadge(ResponseJson.Jumlah);
        }
      });

      if (Platform.OS == "android") {
        await RNMockLocationDetector.checkMockLocationProvider(
          "Fake GPS Ditemukan !",
          "Dimohon untuk mematikan aplikasi Fake GPS / Mock Location pada handphone Anda. ",
          "Baiklah..."
        );
      }

      await this.ShowRekapAbsensi();
      await this.getLocation();
      //await this.getQuestion();
      await this.InqShift();
      await this.saveInfoDevices();

      this.appStateListener = AppState.addEventListener(
        "change",
        this.handleAppStateChange
      );

      this.setState({ isLoading: false });
    } catch (er) {
      // console.log('ERROR :',er);
      this.setState({
        isLoading: false,
      });
    }
  };

  ListKantor = () => {
    return this.state.listKantor.map((data) => {
      return (
        <Marker
          key={data.KD_CAB}
          coordinate={{
            latitude: Number(data.LATITUDE),
            longitude: Number(data.LONGITUDE),
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              width: RFValue(75),
            }}
          >
            <Text
              style={{
                fontSize: RFValue(12),
                textAlign: "center",
                color: "#9D1D20",
              }}
            >
              Bank Jatim {this.capitalizeFirstLetter(data.NAMA_CAB)}
            </Text>
            <Icon
              name="office-building"
              size={35}
              style={{ color: "#9D1D20" }}
            />
          </View>
        </Marker>
      );
    });
  };

  render() {
    return (
      <>
        {/* <Modal
                  animationType="slide"
                  coverScreen
                  hasBackdrop
                  visible={this.props.modalQuestion}
                  style={{marginVertical: RFValue(50), backgroundColor:'#F7F7F7',borderWidth:2,borderRadius:RFValue(6),}}
                  propagateSwipe>
                  <View style={{marginBottom:RFValue(10), alignItems:'center',justifyContent:'center', height:RFValue(50), backgroundColor:'#9D1D20', borderTopLeftRadius:RFValue(5), borderTopRightRadius:RFValue(5), flexDirection:'row'}}>
                    <Icon name="book-open-page-variant" size={RFValue(20)} color="#F7F7F7" style={{marginLeft:RFValue(10)}}/>
                    <Text style={{fontSize:RFValue(14), justifyContent:'center', color:'#F7F7F7',fontWeight:'bold', textAlign:'center'}}> Survey Kesehatan </Text>
                  </View>
                  
                  <ScrollView style={{flex:1}}>
                    {this.listQuestion()}
                  </ScrollView>
            
                  <TouchableOpacity style={{height:45,width:'100%', backgroundColor: "green", justifyContent:'center',borderRadius:RFValue(5), flexDirection:'row', alignItems:'center', justifyContent:'center'}} onPress={() => this.SaveKesehatan()}>
                      <Text style={{textAlign:'center',color:'white', fontWeight:'bold'}}>SIMPAN</Text>
                      {this.state.isLoadingQuestion ?
                      <View style={{marginLeft :RFValue(20)}}>
                        <ActivityIndicator size="small" color="white"/>
                      </View> : null }
                  </TouchableOpacity>
               
            </Modal> */}

        <AlertModal
          SHOW={this.state.showAlert}
          HIDE={() => this.setState({ showAlert: false })}
          MESSAGE={this.state.alertMessage}
          SET_ALERT={(val) => this.setState({ showAlert: val })}
          TYPE={this.state.alertType}
        />
        {this.state.isTakeCam ? (
          <Camera
            onPicture={(data) =>
              this.savePhoto({ data, status: this.state.stats })
            }
            cancelCamera={() => this.setState({ isTakeCam: false })}
          >
            {" "}
          </Camera>
        ) : this.state.isScanQr ? (
          <ScanQRCode
            onQRScan={async (data) => {
              this.setState({ isScanQr: false });
              await this.AbsensiEvent({ QREVENT: data.data });
            }}
            cancelScan={() => this.setState({ isScanQr: false })}
          />
        ) : (
          <View style={{ flex: 1 }}>
            <FlashMessage
              position="top"
              style={{
                height: RFValue(75),
                paddingTop: RFValue(30),
                elevation: RFValue(20),
              }}
            />
            <StatusBar
              barStyle="dark-content"
              translucent
              backgroundColor="transparent"
            />
            <MapView
              style={{ flex: 1 }}
              region={{
                latitude: this.state.latitude,
                longitude: this.state.longitude,
                latitudeDelta: 0.0922 * 0.05,
                longitudeDelta: 0.0421 * 0.05,
              }}
            >
              <MapView.Circle
                key={(this.state.latitude + this.state.longitude).toString()}
                center={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                }}
                radius={75}
                strokeWidth={5}
                strokeColor="transparent"
                fillColor={"rgba(250, 250, 172, 0.5)"}
              />
              <Marker
                coordinate={{
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                }}
                title={this.capitalizeFirstLetter(this.props.userLogin)}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    width: RFValue(75),
                  }}
                >
                  <Text
                    style={{
                      fontSize: RFValue(9),
                      textAlign: "center",
                      color: "#9D1D20",
                    }}
                  >
                    {this.props.userLogin}
                  </Text>
                  <Icon
                    name="human-handsup"
                    size={RFValue(35)}
                    style={{ color: "#9D1D20" }}
                  />
                </View>
              </Marker>
              {this.ListKantor()}
            </MapView>

            <View
              style={{
                ...styles.boxShadow,
                elevation: RFValue(3),
                backgroundColor: "white",
                width: width - RFValue(20),
                marginTop: RFValue(35),
                borderBottomWidth: RFValue(1),
                borderBottomColor: "#DEDEDE",
                position: "absolute",
              }}
            >
              <HeaderApp
                imgUser={{
                  uri: `data:image/png;base64,${this.props.fotoUser}`,
                }}
                userLoginName={this.capitalizeFirstLetter(this.props.userLogin)}
                userLoginLevel={`${this.props.levelDesc} ${
                  this.props.namaCabang
                }`}
                // onPressChatting={() => this.props.navigation.navigate('RoomChat')}
                onPressLogOut={() =>
                  Alert.alert(
                    "Log Out",
                    "Apakah yakin akan Log Out?",
                    [
                      {
                        text: "Batal",
                        style: "cancel",
                      },
                      { text: "Ya", onPress: () => this.LogOut() },
                    ],
                    { cancelable: true }
                  )
                }
              />
            </View>

            {this.props.modalAbsen ? (
              <ScrollView
                style={{
                  position: "absolute",
                  marginTop: RFValue(90),
                  width: width,
                  backgroundColor: "transparent",
                  height: height - (RFValue(35) + RFValue(50) + RFValue(54)),
                  paddingBottom: RFValue(150),
                }}
              >
                <View
                  style={{
                    ...styles.boxShadow,
                    marginTop: RFValue(10),
                    width: width - RFValue(20),
                    height: RFValue(100),
                    backgroundColor: "white",
                    elevation: RFValue(5),
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      height: "80%",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        width: width / 3 - RFValue(25),
                        backgroundColor: "#58A44D",
                        marginHorizontal: RFValue(5),
                        borderRadius: RFValue(10),
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          width: "30%",
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                      >
                        <Icon
                          name="circle-slice-2"
                          size={RFValue(30)}
                          style={{ color: "#EFEFEF" }}
                        />
                      </View>
                      <View style={{ flexDirection: "column", width: "70%" }}>
                        <Text style={{ ...styles.textShiftJudul }}>
                          Jam Masuk
                        </Text>
                        <Text style={{ ...styles.textShiftContent }}>
                          {this.state.shift.length > 0
                            ? this.state.shift[0].jam_masuk.substring(0, 2) +
                              "." +
                              this.state.shift[0].jam_masuk.substring(2, 4)
                            : null}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        width: width / 3 - RFValue(25),
                        backgroundColor: "#E17339",
                        marginHorizontal: RFValue(5),
                        borderRadius: RFValue(10),
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          width: "30%",
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                      >
                        <Icon
                          name="circle-slice-4"
                          size={RFValue(30)}
                          style={{ color: "#EFEFEF" }}
                        />
                      </View>
                      <View style={{ flexDirection: "column", width: "70%" }}>
                        <Text style={{ ...styles.textShiftJudul }}>
                          Jam Istirahat
                        </Text>
                        {this.state.shift.length > 0 ? (
                          <Text style={{ ...styles.textShiftContent }}>
                            {this.state.shift[0].jam_rehat_start.substring(
                              0,
                              2
                            ) +
                              "." +
                              this.state.shift[0].jam_rehat_start.substring(
                                2,
                                4
                              )}{" "}
                            s.d{" "}
                            {this.state.shift[0].jam_rehat_end.substring(0, 2) +
                              "." +
                              this.state.shift[0].jam_rehat_end.substring(2, 4)}
                          </Text>
                        ) : null}
                      </View>
                    </View>

                    <View
                      style={{
                        width: width / 3 - RFValue(25),
                        backgroundColor: "#1C4083",
                        marginHorizontal: RFValue(5),
                        borderRadius: RFValue(10),
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          width: "30%",
                          justifyContent: "center",
                          alignItems: "flex-end",
                        }}
                      >
                        <Icon
                          name="circle-slice-6"
                          size={RFValue(30)}
                          style={{ color: "#EFEFEF" }}
                        />
                      </View>
                      <View style={{ flexDirection: "column", width: "70%" }}>
                        <Text style={{ ...styles.textShiftJudul }}>
                          Jam Pulang
                        </Text>
                        <Text style={{ ...styles.textShiftContent }}>
                          {this.state.shift.length > 0
                            ? this.state.shift[0].jam_pulang.substring(0, 2) +
                              "." +
                              this.state.shift[0].jam_pulang.substring(2, 4)
                            : null}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    ...styles.boxShadow,
                    marginTop: RFValue(10),
                    width: width - RFValue(20),
                    height: RFValue(100),
                    backgroundColor: "white",
                    elevation: RFValue(5),
                  }}
                >
                  <View style={{ height: "80%", marginVertical: 5 }}>
                    <View
                      style={{
                        width: width - RFValue(40),
                        height: "100%",
                        backgroundColor: "#01b8aa",
                        marginHorizontal: RFValue(10),
                        marginVertical: RFValue(5),
                        borderRadius: RFValue(10),
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "50%", paddingLeft: RFValue(30) }}>
                        <Icon
                          name="calendar-clock"
                          size={RFValue(70)}
                          style={{ color: "#EFEFEF" }}
                        />
                      </View>

                      <View style={{ flexDirection: "column", width: "50%" }}>
                        <Text
                          style={{
                            color: "#EFEFEF",
                            fontSize: RFValue(20),
                            marginVertical: 0,
                            fontWeight: "bold",
                            fontStyle: "italic",
                          }}
                        >
                          Jumlah Hari
                        </Text>
                        <Text
                          style={{
                            color: "#EFEFEF",
                            textAlign: "center",
                            fontSize: RFValue(30),
                          }}
                        >
                          {this.state.jumlahHari}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    ...styles.boxShadow,
                    marginTop: RFValue(10),
                    width: width - RFValue(20),
                    height: RFValue(100),
                    backgroundColor: "white",
                    elevation: RFValue(5),
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      height: "80%",
                      marginVertical: 10,
                    }}
                  >
                    <View
                      style={{
                        width: width / 2 - RFValue(25),
                        backgroundColor: "#edb879",
                        marginHorizontal: 5,
                        borderRadius: RFValue(15),
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "50%", paddingLeft: RFValue(30) }}>
                        <Icon
                          name="run-fast"
                          size={RFValue(40)}
                          style={{ color: "#EFEFEF" }}
                        />
                      </View>
                      <View style={{ flexDirection: "column", width: "50%" }}>
                        <Text
                          style={{
                            color: "#EFEFEF",
                            fontSize: RFValue(14),
                            fontWeight: "bold",
                          }}
                        >
                          Terlambat
                        </Text>
                        <Text
                          style={{
                            color: "#EFEFEF",
                            fontSize: RFValue(14),
                            fontWeight: "bold",
                          }}
                        >
                          {this.state.terlambat}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        width: width / 2 - RFValue(25),
                        backgroundColor: "#e4888b",
                        marginHorizontal: RFValue(5),
                        borderRadius: RFValue(15),
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "column",
                          width: "60%",
                          paddingLeft: RFValue(20),
                        }}
                      >
                        <Text
                          style={{
                            color: "#EFEFEF",
                            fontSize: 14,
                            fontWeight: "bold",
                          }}
                        >
                          Pulang Awal
                        </Text>
                        <Text
                          style={{
                            color: "#EFEFEF",
                            textAlign: "right",
                            paddingRight: RFValue(10),
                            fontSize: RFValue(14),
                            fontWeight: "bold",
                          }}
                        >
                          {this.state.absenPulangAwal}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "40%",
                          alignItems: "center",
                          paddingRight: RFValue(10),
                        }}
                      >
                        <Icon
                          name="account-arrow-right-outline"
                          size={RFValue(40)}
                          style={{ color: "#EFEFEF" }}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    ...styles.boxShadow,
                    marginTop: RFValue(10),
                    width: width - RFValue(20),
                    height: RFValue(200),
                    backgroundColor: "white",
                    elevation: RFValue(5),
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      height: "80%",
                      marginVertical: 10,
                    }}
                  >
                    <View style={{ flexDirection: "column" }}>
                      <View
                        style={{
                          width: width / 2 - RFValue(25),
                          height: "50%",
                          backgroundColor: "#5f6b6d",
                          marginHorizontal: RFValue(5),
                          borderRadius: RFValue(15),
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <View
                          style={{ width: "50%", paddingLeft: RFValue(30) }}
                        >
                          <Icon
                            name="account-minus-outline"
                            size={RFValue(40)}
                            style={{ color: "#EFEFEF" }}
                          />
                        </View>
                        <View style={{ flexDirection: "column", width: "50%" }}>
                          <Text
                            style={{
                              color: "#EFEFEF",
                              fontSize: RFValue(14),
                              fontWeight: "bold",
                            }}
                          >
                            Tdk Absen Istirahat
                          </Text>
                          <Text
                            style={{
                              color: "#EFEFEF",
                              fontSize: RFValue(14),
                              fontWeight: "bold",
                            }}
                          >
                            {this.state.tdkAbsenIstirahat}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          width: width / 2 - RFValue(25),
                          height: "50%",
                          backgroundColor: "#01b8aa",
                          marginHorizontal: RFValue(5),
                          marginTop: RFValue(15),
                          borderRadius: RFValue(15),
                          justifyContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                        }}
                      >
                        <View
                          style={{ width: "50%", paddingLeft: RFValue(30) }}
                        >
                          <Icon
                            name="alarm-off"
                            size={RFValue(40)}
                            style={{ color: "#EFEFEF" }}
                          />
                        </View>
                        <View style={{ flexDirection: "column", width: "50%" }}>
                          <Text
                            style={{
                              color: "#EFEFEF",
                              fontSize: RFValue(14),
                              fontWeight: "bold",
                            }}
                          >
                            Tidak Absen Masuk
                          </Text>
                          <Text
                            style={{
                              color: "#EFEFEF",
                              fontSize: RFValue(14),
                              fontWeight: "bold",
                            }}
                          >
                            {this.state.tdkAbsenMasuk}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        width: width / 2 - RFValue(25),
                        height: "110%",
                        backgroundColor: "#4773aa",
                        marginHorizontal: RFValue(5),
                        borderRadius: RFValue(15),
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                      }}
                    >
                      <View
                        style={{
                          width: "70%",
                          height: "25%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "#EFEFEF",
                            fontSize: RFValue(16),
                            textAlign: "center",
                            fontWeight: "bold",
                          }}
                        >
                          Tidak Absen Pulang
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "90%",
                          height: "35%",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "#EFEFEF",
                            textAlign: "center",
                            fontSize: RFValue(30),
                            fontWeight: "bold",
                          }}
                        >
                          {this.state.tdkAbsenPulang}
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "90%",
                          height: "25%",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          name="home-group"
                          size={RFValue(50)}
                          style={{ color: "#EFEFEF" }}
                        />
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    ...styles.boxShadow,
                    marginTop: RFValue(20),
                    width: width - RFValue(20),
                    height: RFValue(100),
                    backgroundColor: "white",
                    elevation: RFValue(5),
                    alignItems: "center",
                    borderRadius: 90,
                    marginBottom: RFValue(60),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      height: "80%",
                      marginVertical: RFValue(10),
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("InputAbsenDinas")
                      }
                      style={{
                        width: width / 3 - RFValue(10),
                        backgroundColor: "#2ca02c",
                        marginHorizontal: RFValue(10),
                        borderTopLeftRadius: 90,
                        borderBottomLeftRadius: 90,
                        borderTopRightRadius: -60,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ width: "30%", marginLeft: RFValue(40) }}>
                        <Icon
                          name="briefcase-edit-outline"
                          size={RFValue(25)}
                          style={{ color: "#EFEFEF" }}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: "column",
                          width: "70%",
                          height: "80%",
                          marginRight: RFValue(20),
                          justifyContent: "center",
                          paddingLeft: 10,
                          paddingRight: 10,
                        }}
                      >
                        <Text
                          style={{
                            color: "#EFEFEF",
                            fontSize: RFValue(12),
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          Luar Kantor
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ isScanQr: true, stats: "EVENT" })
                      }
                      style={{
                        width: width / 3 - RFValue(50),
                        height: "100%",
                        backgroundColor: "#edb879",
                        marginHorizontal: RFValue(0),
                        justifyContent: "center",
                        alignSelf: "center",
                      }}
                    >
                      {/* <View style={{flexDirection:'column', width:'60%', }}>
                                  <Text style={{color:'#EFEFEF', fontSize:RFValue(14), fontWeight:'bold', textAlign:'center'}}> WFH</Text>
                                </View> */}
                      <View
                        style={{
                          width: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Icon
                          name="qrcode"
                          size={RFValue(50)}
                          style={{ color: "#EFEFEF" }}
                        />
                      </View>
                      <Text
                        style={{
                          textAlign: "center",
                          fontSize: RFValue(12),
                          fontWeight: "bold",
                          color: "#EFEFEF",
                        }}
                      >
                        Event
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        this.setState({ isTakeCam: true, stats: "WFO" })
                      }
                      style={{
                        width: width / 3 - RFValue(10),
                        backgroundColor: "#d62728",
                        marginHorizontal: RFValue(10),
                        borderTopRightRadius: 90,
                        borderBottomRightRadius: 90,
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                      }}
                    >
                      <View style={{ flexDirection: "column", width: "60%" }}>
                        <Text
                          style={{
                            color: "#EFEFEF",
                            fontSize: RFValue(12),
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {" "}
                          Work From Office
                        </Text>
                      </View>
                      <View
                        style={{
                          width: "40%",
                          alignItems: "center",
                          paddingRight: RFValue(10),
                        }}
                      >
                        <Icon
                          name="domain"
                          size={RFValue(30)}
                          style={{ color: "#EFEFEF" }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            ) : (
              <TouchableOpacity
                onPress={() => this.getLocation()}
                style={{
                  position: "absolute",
                  marginTop: RFValue(100),
                  marginLeft: width - RFValue(50),
                  borderRadius: RFValue(150),
                  backgroundColor: "white",
                  borderWidth: 0.2,
                  borderColor: "#e4888b",
                }}
              >
                <Icon
                  name="refresh"
                  size={RFValue(40)}
                  color="#edb879"
                  underlayColor="yellow"
                  style={{ color: "#e4888b" }}
                />
              </TouchableOpacity>
            )}

            <NavBar />
          </View>
        )}

        <OrientationLoadingOverlay
          visible={this.state.isLoading}
          color="white"
          indicatorSize="large"
          messageFontSize={RFValue(24)}
          message=""
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  boxShadow: {
    marginHorizontal: RFValue(10),
    borderRadius: RFValue(10),
    alignContent: "center",
    shadowColor: "black",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: RFValue(5),
    //elevation: 3,
  },
  imageIcon: {
    height: RFValue(92),
    width: RFValue(92),
    borderRadius: RFValue(20),
  },
  IconBadge: {
    position: "absolute",
    top: 1,
    right: 1,
    width: RFValue(20),
    height: RFValue(20),
    borderRadius: RFValue(15),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0000",
  },
  kolomContent: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    // marginHorizontal:10,
    height: RFValue(40),
    backgroundColor: "#9D1D20",
  },
  kolom1: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: RFValue(10),
  },
  kolom2: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: RFValue(10),
  },
  kolom3: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: RFValue(10),
  },
  kolom4: {
    width: "20%",
    alignItems: "center",
    justifyContent: "center",
    fontSize: RFValue(10),
  },
  kolom5: {
    width: "20%",
    alignContent: "center",
    justifyContent: "center",
    fontSize: RFValue(10),
  },
  container: {
    flex: 1,
  },
  item: {
    width: width - RFValue(60),
    height: width - RFValue(60),
  },
  imageContainer: {
    flex: 1,
    marginBottom: Platform.select({ ios: 0, android: 1 }), // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderRadius: 8,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
  },
  textShiftJudul: {
    color: "#EFEFEF",
    fontSize: RFValue(13),
    fontWeight: "bold",
    textAlign: "center",
  },
  textShiftContent: {
    color: "#EFEFEF",
    fontSize: RFValue(11),
    fontWeight: "bold",
    textAlign: "center",
  },
  btnAlignment: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: RFValue(20),
  },
});

const mapStateToProps = (state) => {
  return {
    userLogin: state.userLogin,
    levelDesc: state.levelDesc,
    namaCabang: state.namaCabang,
    fotoUser: state.fotoUser,
    kdCab: state.kdCab,
    nip: state.nip,
    lvlUser: state.lvlUser,
    lvlGrp: state.lvlGrp,
    idOneSignal: state.idOneSignal,
    latKantor: state.latKantor,
    longKantor: state.longKantor,
    modalQuestion: state.modalQuestion,
    modalAbsen: state.modalAbsen,
    timer: state.timer,
    kodeshift: state.kodeshift,
    ilang: state.ilang,
  };
};

const mapDispatchToProps = (dispatch) => ({
  setMapping: (val) =>
    dispatch({
      type: "SETMAPPING",
      mapList: val,
    }),
  setModalQuestion: (val) =>
    dispatch({
      type: "SETMDLQSTN",
      modalQuestion: val,
    }),
  setModalAbsen: (val) =>
    dispatch({
      type: "SETMDLABSEN",
      modalAbsen: val,
    }),
  setBadge: (val) =>
    dispatch({
      type: "SETBADGE",
      badgeOtorPerjadin: val,
    }),
});

export default withNavigation(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Home)
);
