import React, { Component,useState } from 'react';
import {Text, View, ScrollView, Alert, Image, TouchableOpacity,StatusBar, StyleSheet} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import { RFValue } from 'react-native-responsive-fontsize';
import API from '../../../config/services';

import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';


// import AgunanTnb from '../../pages/AgunanTanahBangunan'
const pictDefault = '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'

class AbsensiFoto extends Component{
    constructor(props){
        super(props)
        this.state={
            isLoading : false,
            nip : this.props.nip,
            tanggal : '',
            foto1 : '',
            foto2 : '',
            foto3 : '',
            foto4 : '',

        }
    }

    componentDidMount = async() => {
        const { params } = this.props.navigation.state;
         this.setState({
            tanggal : params.tanggal,
            isLoading : true,
            foto1 : pictDefault,
            foto2 : pictDefault,
            foto3 : pictDefault,
            foto4 : pictDefault,
        })

        const bodyData ={
            nip : this.props.nip,
            tgl : params.tanggal
        }
        // console.log('REQ FOTO:',bodyData)
        const fotoAbsen = await API.InquiryAbsen(bodyData).then((ResponseJson) => {   
            // console.log('RESP FOTO:',ResponseJson)
            return ResponseJson
        },(err) => {this.setState({isLoading:false}) 
                    alert('ERROR : \n' + err)})

        if (fotoAbsen.ResponseCode == '00'){  
            this.setState({
                isLoading:false,
                foto1 : fotoAbsen.data[0].FOTO_MASUK == null || fotoAbsen.data[0].FOTO_MASUK == '' ? pictDefault : fotoAbsen.data[0].FOTO_MASUK,
                foto2 : fotoAbsen.data[0].FOTO_REHAT_START == null || fotoAbsen.data[0].FOTO_REHAT_START == '' ? pictDefault : fotoAbsen.data[0].FOTO_REHAT_START,
                foto3 : fotoAbsen.data[0].FOTO_REHAT_END == null || fotoAbsen.data[0].FOTO_REHAT_END == '' ? pictDefault : fotoAbsen.data[0].FOTO_REHAT_END,
                foto4 : fotoAbsen.data[0].FOTO_PULANG == null || fotoAbsen.data[0].FOTO_PULANG == '' ? pictDefault : fotoAbsen.data[0].FOTO_PULANG,
            })
        }else{
            this.setState({
                isLoading:false,
                foto1 : pictDefault,
                foto2 : pictDefault,
                foto3 : pictDefault,
                foto4 : pictDefault,
            })
        }
    }


    render(){
        const { goBack } = this.props.navigation;
        const { isView } = this.state;

        return (
            <View style={{flex:1,backgroundColor:'#9D1D20'}}>
            {/* HEADER */}
            <StatusBar  barStyle="light-content" translucent backgroundColor='#9D1D20' />
            <View style={{backgroundColor:'#9D1D20', marginTop:RFValue(25)}}>
                    <View style={{height:RFValue(50), marginHorizontal:RFValue(17), flexDirection:'row'}}>
                            <View style={{flexDirection:'row',marginTop:RFValue(10),marginBottom:RFValue(10)}}>
                                <TouchableOpacity onPress={() => goBack()}>
                                    <Icon name='chevron-double-left' size={RFValue(30)} color="#F7F7F7" style={{color:'white'}} />
                                </TouchableOpacity>
                                <Text style={{fontSize:RFValue(18),marginLeft:RFValue(4),marginTop:RFValue(3), color:'#F7F7F7'}}>Foto Absensi Tanggal {Moment(this.state.tanggal, 'YYYYMMDD').format('DD MMM YYYY')}</Text>
                            </View>
                        </View>
           </View>
            <ScrollView style={{flex:1,backgroundColor:'#FFF'}}>
                    <View style={{marginTop:RFValue(5)}} >
                        <View style={styles.JudulFoto}>
                            <Text style={styles.TextJudul}>Foto Absen Masuk</Text>
                        </View>
                        <View style={styles.BoxFoto}>
                            <Image style={styles.ImgContainer} source={{uri:`data:image/png;base64,${this.state.foto1}`}}></Image>
                        </View>
                        <View style={styles.JudulFoto}>
                            <Text style={styles.TextJudul}>Foto Absen Istirahat Mulai</Text>
                        </View>
                        <View style={styles.BoxFoto}>
                            <Image style={styles.ImgContainer} source={{uri:`data:image/png;base64,${this.state.foto2}`}}></Image>
                        </View>
                        <View style={styles.JudulFoto}>
                            <Text style={styles.TextJudul}>Foto Absen Istirahat Selesai</Text>
                        </View>
                        <View style={styles.BoxFoto}>
                            <Image style={styles.ImgContainer} source={{uri:`data:image/png;base64,${this.state.foto3}`}}></Image>
                        </View>
                        <View style={styles.JudulFoto}>
                            <Text style={styles.TextJudul}>Foto Absen Pulang</Text>
                        </View>
                        <View style={styles.BoxFoto}>
                            <Image style={styles.ImgContainer} source={{uri:`data:image/png;base64,${this.state.foto4}`}}></Image>
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
    ImgContainer : {
        width:RFValue(320), height:RFValue(200),resizeMode:'stretch'
    },
    BoxFoto : {
        marginTop:RFValue(5),  alignItems:'center'
    },
    JudulFoto:{
        marginLeft:RFValue(20), marginTop:RFValue(5), marginRight:RFValue(20)
    },
    TextJudul : {
        fontSize:RFValue(14), color:'#D0242A',fontWeight:'bold'
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
  
  export default connect(mapStateToProps,null) (AbsensiFoto);