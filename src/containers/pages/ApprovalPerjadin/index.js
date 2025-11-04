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
import { TextInput } from 'react-native-gesture-handler';

class ApprovalPerjadin extends Component{
    constructor(props){
        super(props)
        this.state={
            isLoading : false,
            nip : this.props.nip,
            ID : 0,
            nip_bawahan : '',
            tanggal : '',
            jnsDinas : 'DDK',
            perihal :'',
            keterangan : '',
            latitude : 0,
            longitude: 0,
            isMocked : false,
            showAlert : false,
            alertMessage : '',
            alertType : 'success',
            ket_approve : '',
        }
    }

    componentDidMount = async() => {
      const { params } = this.props.navigation.state;
      this.setState({
        ID : params.ID,
        nip_bawahan : params.NIP,
        tanggal : params.TANGGAL,
        perihal : params.PERIHAL,
        keterangan : params.KETERANGAN,
      })
    }

    _handleTextInput(name) {
        return (text) => {
            this.setState({[name]: text })
        }
    }

    Otorisasi = async({sts_otor}) => {

              const bodyData = {
                ID : this.state.ID,
                NIP : this.props.nip,
                STS_OTOR : sts_otor,
                KET_OTOR : this.state.ket_approve,
              }
              // console.log('REQ SAVE OTOR PERJADIN :', bodyData)
              API.SaveOtorPerjadin(bodyData).then((ResponseJson) => {   
                // console.log('RESP SAVE OTOR PERJADIN :', ResponseJson)
                if (ResponseJson.ResponseCode == '00'){
                  this.setState({
                    showAlert : true,
                    alertMessage : 'Otorisasi sukses.',
                    alertType : 'success',
                    isLoading : false,
                  })
                  setTimeout(() => {
                    this.props.navigation.goBack();  
                  }, 1500);

                  const bodyData2 = {
                    NIP : this.props.nip,
                  }

                  // console.log('REQ GETBADGE',bodyData2);
                  API.GetBadge(bodyData).then((ResponseJson) => {
                    // console.log('RESP GETBADGE',ResponseJson);
                    if (ResponseJson.ResponseCode == '00'){
                      this.props.setBadge(ResponseJson.Jumlah); 
                      setTimeout(() => {
                        this.props.navigation.navigate('Home');
                      }, 1500);
                      
                    }
                  })
                           
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
            
    };

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
            <StatusBar  barStyle="light-content" translucent backgroundColor='#9D1D20' />
            <View style={{backgroundColor:'#9D1D20', marginTop:RFValue(25)}}>
                    <View style={{height:RFValue(50), marginHorizontal:RFValue(17), flexDirection:'row'}}>
                            <View style={{flexDirection:'row',marginTop:RFValue(10),marginBottom:RFValue(10)}}>
                                <TouchableOpacity onPress={() => goBack()}>
                                    <Icon name='chevron-double-left' size={RFValue(30)} color="#F7F7F7" style={{color:'white'}} />
                                </TouchableOpacity>
                                <Text style={{fontSize:RFValue(16),marginLeft:RFValue(4),marginTop:RFValue(3), color:'#F7F7F7'}}>Otorisasi Absen Luar Kantor </Text>
                            </View>
                        </View>
           </View>
            <ScrollView style={{flex:1,backgroundColor:'#FFF'}}>
                    <View style={{marginTop:RFValue(5)}} >
    
                        <TextBox
                          JUDUL={'NIP'}
                          VALUE={this.state.nip_bawahan}
                          ONCHANGETEXT={this._handleTextInput('keterangan')}
                          KEYBOARDTYPE={'default'}
                          MAXLENGTH={100}
                          PLACEHOLDER={''}
                          ISVALID={true}
                          DESKRIPSI={""}
                          EDITABLE={false}
                          HEIGHT={35}
                        />
                        <TextBox
                          JUDUL={'Perihal'}
                          VALUE={this.state.perihal}
                          ONCHANGETEXT={this._handleTextInput('keterangan')}
                          KEYBOARDTYPE={'default'}
                          MAXLENGTH={100}
                          PLACEHOLDER={''}
                          ISVALID={true}
                          DESKRIPSI={""}
                          EDITABLE={false}
                          HEIGHT={35}
                        />
                        <TextBox
                          JUDUL={'Keterangan'}
                          VALUE={this.state.keterangan}
                          ONCHANGETEXT={this._handleTextInput('keterangan')}
                          KEYBOARDTYPE={'default'}
                          MAXLENGTH={150}
                          PLACEHOLDER={''}
                          ISVALID={true}
                          DESKRIPSI={""}
                          EDITABLE={false}
                          HEIGHT={75}
                        />

                        <TextBox
                          JUDUL={'Keterangan Approve / Reject'}
                          VALUE={this.state.ket_approve}
                          ONCHANGETEXT={this._handleTextInput('ket_approve')}
                          KEYBOARDTYPE={'default'}
                          MAXLENGTH={150}
                          PLACEHOLDER={''}
                          ISVALID={true}
                          DESKRIPSI={""}
                          EDITABLE={true}
                          HEIGHT={75}
                        />
                          {/* <TextInput style={{paddingLeft:5,width:'95%',color:'black', height:100, borderColor: 'grey', borderWidth: 0.5, borderRadius:5, fontSize:RFValue(12), paddingVertical:0}}
                              placeholderTextColor={'grey'}
                              autoCapitalize={'words'}
                              autoCompleteType={'name'}
                              placeholder={'Input keterangan approve'}
                              placeholderTextColor={'grey'}
                              value={this.state.ket_approve}
                              onChangeText={this._handleTextInput('ket_approve')}
                              keyboardType={'default'}
                              //maxLength={}
                              editable={true}
                          /> */}

                    <View style={{width:'80%',height:RFValue(50), alignItems:'center', justifyContent:'center',  alignSelf:'center', marginTop:RFValue(20), flexDirection : 'row'}}>
                              <ButtonIcon
                                    ONPRESS={async() => this.state.keterangan.trim() == '' ? 
                                      this.setState({
                                        showAlert : true,
                                        alertMessage : 'Keterangan tidak boleh kosong.',
                                        alertType : 'error',
                                        isLoading : false,
                                      })
                                     : await this.Otorisasi({sts_otor : 'Approved'})
                                    }
                                    HEIGHT={30}
                                    WIDTH={75}
                                    COLOR={'green'}
                                    ICON={'checkbox-marked-outline'}
                                    JUDUL={'Approve'}
                                    LOADING={this.state.isLoadingVerKtp || this.state.isLoading}
                                  />
                                   <ButtonIcon
                                    ONPRESS={async() => this.state.keterangan.trim() == '' ? 
                                      this.setState({
                                        showAlert : true,
                                        alertMessage : 'Keterangan tidak boleh kosong.',
                                        alertType : 'error',
                                        isLoading : false,
                                      })
                                     : await this.Otorisasi({sts_otor : 'Reject'})
                                    }
                                    HEIGHT={30}
                                    WIDTH={100}
                                    COLOR={'#9D1D20'}
                                    ICON={'close-box-outline'}
                                    JUDUL={'Reject'}
                                    LOADING={this.state.isLoadingVerKtp || this.state.isLoading}
                                  />
                            </View>

                
                    </View>
            </ScrollView>
                    
                       
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
      borderRadius : RFValue(10), 
      alignContent : 'center',
      shadowColor: 'black',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: RFValue(1),
      shadowRadius: RFValue(5),
      alignSelf:'center',
      width:'95%',
      height: RFValue(230), 
      elevation :RFValue(5), 
      backgroundColor:'white', 
      marginBottom:RFValue(20),
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
    }
  };

  const mapDispatchToProps = (dispatch) => ({
    setBadge: (val) => dispatch({
      type: 'SETBADGE', 
      badgeOtorPerjadin : val,
  }),
  })
  
  export default connect(mapStateToProps,mapDispatchToProps) (ApprovalPerjadin);