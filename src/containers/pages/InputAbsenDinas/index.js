import React, { Component,useState } from 'react';
import {Text, View, ScrollView, Alert, Image, TouchableOpacity,StatusBar,StyleSheet } from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import API from '../../../config/services';
import ComboBox from '../../../components/molecules/ComboBox';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
import TextBox from '../../../components/molecules/TextBox';
import ButtonIcon from '../../../components/molecules/ButtonIcon';
import { RFValue } from 'react-native-responsive-fontsize';
import Geolocation from 'react-native-geolocation-service';
import AlertModal from '../../../components/molecules/AlertModal';
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import ImgToBase64 from 'react-native-image-base64'
import Camera from '../../../components/Camera';


const pictDefault = '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'


class InputAbsenDinas extends Component{
    constructor(props){
        super(props)
        this.state={
            isLoading : false,
            nip : this.props.nip,
            jnsDinas : 'DDK',
            keterangan : '',
            latitude : 0,
            longitude: 0,
            isMocked : false,
            showAlert : false,
            alertMessage : '',
            alertType : 'success',
            perihal : '',
            nip_atasan : '',
            fotoDinas : '',
            isTakeCam : false,
    
        }
    }

    componentDidMount = async() => {
        this.setState({
          nip_atasan : this.props.nip_otor,
          fotoDinas:pictDefault
        })
    }

    _handleTextInput(name) {
        return (text) => {
            this.setState({[name]: text })
        }
    }

    // TakePhoto = async(kiriman) => {
    //   var options = {
    //     title: 'Select Image',
    //     storageOptions: {
    //       skipBackup: true,
    //       path: 'JatimPresences',
    //     },
    //   };

    //   ImagePicker.launchCamera(options, Response => {
    //           if (Response.didCancel) {
    //             // console.log('User cancelled image picker');
    //           } else if (Response.error) {
    //             // console.log('ImagePicker Error: ', Response.error);
    //           } else if (Response.customButton) {
    //             // console.log('User tapped custom button: ', Response.customButton);
    //             // alert(Response.customButton);
    //           } else {
    //                 ImageResizer.createResizedImage(Platform.OS == 'ios' ? Response.uri : Response.path, 500, 500, "JPEG", 50).then((resizedImageUri) => {
    //                   ImgToBase64.getBase64String(resizedImageUri.uri)
    //                           .then(base64String => {
    //                               this.setState({
    //                                       [kiriman]: base64String,
    //                                 });
    //                           })
    //                           .catch(err =>  alert('ERROR : \n' + err));                    
    //                 }).catch((err) => {
    //                   alert('ERROR : \n' + err)
    //                 });       
    //             }
    //         });
    // }

    savePhoto = async(obj) => {
      await Geolocation.getCurrentPosition(
        (position) => {

            const koor = JSON.parse(JSON.stringify(position)).coords;
            this.setState({
                latitude : koor.latitude,
                longitude : koor.longitude,
                isMocked : JSON.parse(JSON.stringify(position)).mocked,
                isTakeCam : false
            });

            if (koor.latitude == 0 || koor.longitude == 0){
              this.setState({
                showAlert : true,
                alertMessage : 'GPS Offline. Harap enable GPS perangkat Anda / allow permission GPS untuk aplikasi ini guna perekaman koordinat posisi Anda. Apabila sudah dilakukan, harap logout terlebih dahulu lalu login kembali.',
                alertType : 'error',
              })
              return;
            }
  
            if (JSON.parse(JSON.stringify(position)).mocked){
              this.setState({
                showAlert : true,
                alertMessage : 'Fake GPS / Mocked Location ditemukan ! Aktifitas Anda akan kami catat di log system e-Human Capital!',
                alertType : 'error',
              })
              return;
            }

            this.setState({
              fotoDinas : obj.data
            })
          
        },
        (error) => {
            this.setState({
              showAlert : true,
              alertMessage : 'GPS Error! (' + error.message + ')',
              alertType : 'error',
              isLoading : false
            })
            return;
        },
        {timeout: 20000}
      );
      //await this.ShowRekapAbsensi();
  };


    simpanAbsensi = async() => {
      if (this.state.fotoDinas == pictDefault){
        this.setState({
          showAlert : true,
          alertMessage : 'Foto kosong !',
          alertType : 'error',
        })
        return;
      }
        await Geolocation.getCurrentPosition(
          (position) => {
              const koor = JSON.parse(JSON.stringify(position)).coords;
              this.setState({
                  latitude : koor.latitude,
                  longitude : koor.longitude,
                  isMocked : JSON.parse(JSON.stringify(position)).mocked,
              });

              if (koor.latitude == 0 || koor.longitude == 0){
                this.setState({
                  showAlert : true,
                  alertMessage : 'GPS Offline. Harap enable GPS perangkat Anda / allow permission GPS untuk aplikasi ini guna perekaman koordinat posisi Anda. Apabila sudah dilakukan, harap logout terlebih dahulu lalu login kembali.',
                  alertType : 'error',
                })
                return;
              }
    
              if (JSON.parse(JSON.stringify(position)).mocked){
                this.setState({
                  showAlert : true,
                  alertMessage : 'Fake GPS / Mocked Location ditemukan! Aktifitas Anda akan kami catat di log system e-Human Capital!',
                  alertType : 'error',
                })
                this.saveInfoDevices();
                return;
              }

              const bodyData = {
                nip : this.props.nip,
                lat : this.state.latitude,
                long : this.state.longitude,
                foto : this.state.fotoDinas,
                status : this.state.jnsDinas,
                keterangan : this.state.keterangan,
                perihal : this.state.perihal,
                nip_otor : this.state.nip_atasan,

            }
         
              // this.setState({
              //   isLoading : true,
              // })
             
              API.InsertAbsensi(bodyData).then((ResponseJson) => {   
                  //console.log('INSABS :', ResponseJson)
                if (ResponseJson.ResponseCode == '00'){
                  this.setState({
                    showAlert : true,
                    alertMessage : 'Absen berhasil.',
                    alertType : 'success',
                    isLoading : false,
                  })
                  setTimeout(() => {
                    this.props.navigation.goBack();  
                  }, 1500);
                           
                }else{
                  this.setState({
                    showAlert : true,
                    alertMessage : ResponseJson.ResponseDesc.toString(),
                    alertType : 'error',
                    isLoading : false,
                  })
                }
              },(err) => {
                          this.setState({
                            showAlert : true,
                            alertMessage : err.message,
                            alertType : 'error',
                            isLoading : false,
                          })
              })
            
          },
          (error) => {
              this.setState({
                showAlert : true,
                alertMessage : 'GPS Error (' + error.message + ')',
                alertType : 'error',
                isLoading : false,
              })
              return;
          },
          {timeout: 20000}
        );
    };

    simpanNipAtasan = async() => {
      const bodyData = {
        nip : this.props.nip,
        nip_atasan : this.state.nip_atasan
    }
     
      // console.log('REQ SAVE NIP ATASAN :', bodyData)
      API.SaveNIPAtasan(bodyData).then((ResponseJson) => {   
        // console.log('RESP SAVE NIP ATASAN :', ResponseJson)
        if (ResponseJson.ResponseCode == '00'){
                   
        }else{
          this.setState({
            showAlert : true,
            alertMessage : ResponseJson.ResponseDesc.toString(),
            alertType : 'error',
            isLoading : false,
          })
        }
      },(err) => {
                  this.setState({
                    showAlert : true,
                    alertMessage : err.message,
                    alertType : 'error',
                    isLoading : false,
                  })
      })
    }

    render(){
        const { goBack } = this.props.navigation;
        const { isView } = this.state;

        return (
            <View style={{flex:1,backgroundColor:'#9D1D20'}}>
                <AlertModal 
                  SHOW={this.state.showAlert} 
                  HIDE={()=> this.setState({showAlert: false})}
                  MESSAGE={this.state.alertMessage}
                  SET_ALERT={val => this.setState({showAlert : val})}
                  TYPE={this.state.alertType}
                />
            {/* HEADER */}

            {this.state.isTakeCam ? <Camera onPicture={(data) => this.savePhoto({data})} cancelCamera={ () => this.setState({isTakeCam : false})}> </Camera> :
              <>
                   <StatusBar  barStyle="light-content" translucent backgroundColor='#9D1D20' />
            <View style={{backgroundColor:'#9D1D20', marginTop:RFValue(25)}}>
                    <View style={{height:RFValue(50), marginHorizontal:RFValue(17), flexDirection:'row'}}>
                            <View style={{flexDirection:'row',marginTop:RFValue(10),marginBottom:RFValue(10)}}>
                                <TouchableOpacity onPress={() => goBack()}>
                                    <Icon name='chevron-double-left' size={RFValue(30)} color="#F7F7F7" style={{color:'white'}} />
                                </TouchableOpacity>
                                <Text style={{fontSize:RFValue(18),marginLeft:RFValue(4),marginTop:RFValue(3), color:'#F7F7F7'}}>Input Absensi Luar Kantor </Text>
                            </View>
                        </View>
           </View>
            <ScrollView style={{flex:1,backgroundColor:'#FFF'}}>
                    <View style={{marginTop:RFValue(5)}} >
    
                        <ComboBox 
                             JUDUL={'Pilih Jenis Perjalanan dinas'}
                             VALUE={this.state.jnsDinas}
                             SELECTEDVALUE={(val) => this.setState({jnsDinas : val})}
                             ITEMS={[{label : 'Dalam Kota', color : 'black', value :'DDK'},]}
                            ISVALID={true}
                            DESKRIPSI={'Pilih Jenis Dinas'}
                        />

                        <TextBox
                          JUDUL={'Perihal'}
                          VALUE={this.state.perihal}
                          ONCHANGETEXT={this._handleTextInput('perihal')}
                          KEYBOARDTYPE={'default'}
                          MAXLENGTH={200}
                          PLACEHOLDER={'Input perihal perjalanan dinas'}
                          ISVALID={true}
                          DESKRIPSI={"Input perihal perjalanan dinas"}
                          HEIGHT={35}
                        />

                        <TextBox
                          JUDUL={'Keterangan'}
                          VALUE={this.state.keterangan}
                          ONCHANGETEXT={this._handleTextInput('keterangan')}
                          KEYBOARDTYPE={'default'}
                          MAXLENGTH={200}
                          PLACEHOLDER={'Input keterangan perjalanan dinas'}
                          ISVALID={true}
                          DESKRIPSI={"Input keterangan perjalanan dinas"}
                          HEIGHT={75}
                        />

                        <TextBox
                          JUDUL={'NIP Atasan langsung'}
                          VALUE={this.state.nip_atasan}
                          ONCHANGETEXT={this._handleTextInput('nip_atasan')}
                          KEYBOARDTYPE={'numeric'}
                          MAXLENGTH={200}
                          PLACEHOLDER={'Input NIP atasan'}
                          ISVALID={true}
                          DESKRIPSI={"Input NIP atasan"}
                          HEIGHT={35}
                        />

                <View style={styles.kolomJudul2}>
                    <Text style={{fontSize:RFValue(14), fontWeight:'bold', color:'#9D1D20'}}>Foto Dinas</Text>
                </View>

                    <View style={{marginTop:5,borderSize:2, alignItems:'center'}}>
                        <TouchableOpacity onPress={() => this.setState({isTakeCam : true,})}>
                                <Image style={{width:RFValue(320), height:RFValue(200),resizeMode:'stretch'}} source={{uri:`data:image/png;base64,${this.state.fotoDinas}`}}></Image>
                        </TouchableOpacity>
                    </View>



                    <View style={{width:'80%',height:RFValue(50), alignItems:'center', justifyContent:'center',  alignSelf:'center', marginTop:RFValue(20)}}>
                              <ButtonIcon
                                    ONPRESS={async() => {
                                      if (this.state.perihal.trim() == ''){
                                        this.setState({
                                          showAlert : true,
                                          alertMessage : 'Perihal tidak boleh kosong.',
                                          alertType : 'error',
                                          isLoading : false,
                                        })
                                      }else if(this.state.keterangan.trim() == ''){
                                        this.setState({
                                          showAlert : true,
                                          alertMessage : 'Keterangan tidak boleh kosong.',
                                          alertType : 'error',
                                          isLoading : false,
                                        })
                                      }else if (this.state.nip_atasan.trim() == ''){
                                        this.setState({
                                          showAlert : true,
                                          alertMessage : 'NIP atasan tidak boleh kosong.',
                                          alertType : 'error',
                                          isLoading : false,
                                        })
                                      }else{
                                        await this.simpanNipAtasan();
                                        await this.simpanAbsensi();
                                      }
                                    }}
                                    HEIGHT={30}
                                    WIDTH={150}
                                    COLOR={'#9D1D20'}
                                    ICON={'checkbox-marked-outline'}
                                    JUDUL={this.state.isEdit ? ' Ubah Data':' Simpan Data'}
                                    LOADING={this.state.isLoadingVerKtp || this.state.isLoading}
                                  />
                            </View>
                
                    </View>
            </ScrollView>
              </>
            }
           
                    
                       
                    <OrientationLoadingOverlay
                    visible={this.state.isLoading}
                    color="white"
                    indicatorSize="large"
                    messageFontSize={24}
                    message=""
                    />

                          
        </View>
       )
    }
}

const styles = StyleSheet.create({
    boxShadow: {
      borderRadius : 10, 
      alignContent : 'center',
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 1,
      shadowRadius: 5,
      alignSelf:'center',
      width:'95%',
      height: RFValue(230), 
      elevation :5, 
      backgroundColor:'white', 
      marginBottom:RFValue(20),
    },
    kolomJudul2: {
      paddingLeft:5,
      // borderWidth:1,
      justifyContent:'space-between',
      flexDirection:'row', 
      width:'95%',
      alignItems:'center', 
      marginHorizontal:10, 
      marginTop:20,
      color:'#9D1D20'
  },
});

const mapStateToProps = (state) => {
    return {
        userLogin : state.userLogin,
        levelDesc : state.levelDesc,
        namaCabang : state.namaCabang,
        nip : state.nip,
        kdCab : state.kdCab,
        dataAgunan : state.dataAgunan,
        mapList : state.mapList,
        totNilaiMarket : state.totNilaiMarket,
        lvlUser : state.lvlUser,
        nip_otor : state.nip_otor,
    }
  };
  
  export default connect(mapStateToProps,null) (InputAbsenDinas);