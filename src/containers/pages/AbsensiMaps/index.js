import React, { Component } from 'react';
import {Text, View, ScrollView, Platform,TouchableOpacity, StyleSheet,StatusBar} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Moment from 'moment';
import { RFValue } from 'react-native-responsive-fontsize';
import API from '../../../config/services';

import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
import MapView ,{ Marker } from 'react-native-maps';
import { showLocation } from 'react-native-map-link'

class AbsensiMaps extends Component{
    constructor(props){
        super(props)
        this.state={
            isLoading : false,
            nip : this.props.nip,
            tanggal : '',
            latMasuk : 0,
            longMasuk : 0,
            latRehatStart : 0,
            longRehatStart : 0,
            latRehatEnd : 0,
            longRehatEnd : 0,
            latPulang : 0,
            longPulang : 0,

        }
    }

    componentDidMount = async() => {
        const { params } = this.props.navigation.state;
         this.setState({
            tanggal : params.tanggal,
            isLoading : true,
        })

        const bodyData ={
            nip : this.props.nip,
            tgl : params.tanggal
        }

        const inqAbsensi = await API.InquiryAbsen(bodyData).then((ResponseJson) => {   
            return ResponseJson
        },(err) => {this.setState({isLoading:false}) 
                    alert('ERROR : \n' + err)})
    
        if (inqAbsensi.ResponseCode == '00'){  
            this.setState({
                isLoading:false,
                latMasuk : inqAbsensi.data[0].LAT_MASUK == null || inqAbsensi.data[0].LAT_MASUK == '' ? 0 : Number(inqAbsensi.data[0].LAT_MASUK),
                longMasuk : inqAbsensi.data[0].LONG_MASUK == null || inqAbsensi.data[0].LONG_MASUK == '' ? 0 : Number(inqAbsensi.data[0].LONG_MASUK),
                latRehatStart : inqAbsensi.data[0].LAT_REHAT_START == null || inqAbsensi.data[0].LAT_REHAT_START == '' ? 0 : Number(inqAbsensi.data[0].LAT_REHAT_START),
                longRehatStart : inqAbsensi.data[0].LONG_REHAT_START == null || inqAbsensi.data[0].LONG_REHAT_START == '' ? 0 : Number(inqAbsensi.data[0].LONG_REHAT_START),
                latRehatEnd : inqAbsensi.data[0].LAT_REHAT_END == null || inqAbsensi.data[0].LAT_REHAT_END == '' ? 0 : Number(inqAbsensi.data[0].LAT_REHAT_END),
                longRehatEnd : inqAbsensi.data[0].LONG_REHAT_END == null || inqAbsensi.data[0].LONG_REHAT_END == '' ? 0 : Number(inqAbsensi.data[0].LONG_REHAT_END),
                latPulang : inqAbsensi.data[0].LAT_PULANG == null || inqAbsensi.data[0].LAT_PULANG == '' ? 0 : Number(inqAbsensi.data[0].LAT_PULANG),
                longPulang : inqAbsensi.data[0].LONG_PULANG == null || inqAbsensi.data[0].LONG_PULANG == '' ? 0 : Number(inqAbsensi.data[0].LONG_PULANG),
            })
        }else{
            this.setState({
                isLoading:false,
                latMasuk : 0,
                longMasuk : 0,
                latRehatStart : 0,
                longRehatStart : 0,
                latRehatEnd : 0,
                longRehatEnd : 0,
                latPulang : 0,
                longPulang : 0,
            })
        }
    }


    render(){
        const { goBack } = this.props.navigation;
        const {  latMasuk,
                longMasuk,
                latRehatStart ,
                longRehatStart ,
                latRehatEnd ,
                longRehatEnd ,
                latPulang ,
                longPulang , } = this.state;

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
                                <Text style={{fontSize:RFValue(18),marginLeft:RFValue(4),marginTop:RFValue(3), color:'#F7F7F7'}}>List Maps Tanggal {Moment(this.state.tanggal, 'YYYYMMDD').format('DD MMM YYYY')}</Text>
                            </View>
                        </View>
           </View>
            <ScrollView style={{flex:1,backgroundColor:'#FFF'}}>
                    <View style={{marginTop:5}} >
                        {latMasuk == 0 || longMasuk == 0 ? null :
                        <View style={{marginTop:RFValue(5)}} >
                            <View style={{alignItems:'center', justifyContent:'center', marginTop:RFValue(10)}}>
                                <View style={{alignItems:'center', justifyContent:'center',borderWidth:1, width:'95%', height: RFValue(30), backgroundColor:'#9D1D20'}}>
                                    <Text style={{textAlign:'center',fontSize:RFValue(16), fontWeight:'bold', color: 'white'}}>Maps Absen Masuk</Text>
                                </View> 
                            </View>
                            <View style={[styles.contentSignature,{ flexDirection: "column",borderWidth:1 }]}>
                            <MapView
                                style={styles.map}
                                region={{
                                latitude: latMasuk,
                                longitude: longMasuk,
                                latitudeDelta: 0.0922 * 0.05, 
                                longitudeDelta: 0.0421 * 0.05,
                                }}>
                                <Marker
                                    coordinate={{latitude: latMasuk, longitude: longMasuk}}
                                    title="Absen Masuk"/>
                                </MapView>
                            </View>
                            {Platform.OS == 'android' ? 
                            <View>
                            <TouchableOpacity onPress={() => showLocation({
                                                                    latitude: latMasuk,
                                                                    longitude: longMasuk,
                                                                    // sourceLatitude: -8.0870631,  // optionally specify starting location for directions
                                                                    // sourceLongitude: -34.8941619,  // not optional if sourceLatitude is specified
                                                                    title: latMasuk.toString()+','+longMasuk.toString() ,  // optional
                                                                    googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
                                                                    // googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
                                                                    // alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
                                                                    // dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
                                                                    // dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
                                                                    // cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
                                                                    appsWhiteList: ['google-maps'] // optionally you can set which apps to show (default: will show all supported apps installed on device)
                                                                    // appTitles: { 'google-maps': 'My custom Google Maps title' } // optionally you can override default app titles
                                                                    // app: 'uber'  // optionally specify specific app to use
                                                                })} style={{borderRadius:5,height:29,width:'95%', backgroundColor:'#D0242A', alignSelf:'center',alignContent:'center',justifyContent:'center', marginBottom: 20}}>
                                        <Text style={{fontWeight:'bold', fontSize:13, color:'white' ,textAlign:'center' }}>Show On Google Maps</Text>
                            </TouchableOpacity>
                            </View>: null }
                        </View> } 

                        {latRehatStart == 0 || longRehatStart == 0 ? null :
                        <View style={{marginTop:5}} >
                            <View style={{alignItems:'center', justifyContent:'center', marginTop:10}}>
                                <View style={{alignItems:'center', justifyContent:'center',borderWidth:1, width:'95%', height: 30, backgroundColor:'#9D1D20'}}>
                                    <Text style={{textAlign:'center',fontSize:RFValue(16), fontWeight:'bold', color: 'white'}}>Maps Absen Istirahat Mulai</Text>
                                </View> 
                            </View>
                            <View style={[styles.contentSignature,{ flexDirection: "column",borderWidth:1 }]}>
                            <MapView
                                style={styles.map}
                                region={{
                                latitude: latRehatStart,
                                longitude: longRehatStart,
                                latitudeDelta: 0.0922 * 0.05, 
                                longitudeDelta: 0.0421 * 0.05,
                                }}>
                                <Marker
                                    coordinate={{latitude: latRehatStart, longitude: longRehatStart}}
                                    title="Absen Masuk"/>
                                </MapView>
                            </View>
                            {Platform.OS == 'android' ? 
                            <View>
                            <TouchableOpacity onPress={() => showLocation({
                                                                    latitude: latRehatStart,
                                                                    longitude: longRehatStart,
                                                                    // sourceLatitude: -8.0870631,  // optionally specify starting location for directions
                                                                    // sourceLongitude: -34.8941619,  // not optional if sourceLatitude is specified
                                                                    title: latRehatStart.toString()+','+longRehatStart.toString() ,  // optional
                                                                    googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
                                                                    // googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
                                                                    // alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
                                                                    // dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
                                                                    // dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
                                                                    // cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
                                                                    appsWhiteList: ['google-maps'] // optionally you can set which apps to show (default: will show all supported apps installed on device)
                                                                    // appTitles: { 'google-maps': 'My custom Google Maps title' } // optionally you can override default app titles
                                                                    // app: 'uber'  // optionally specify specific app to use
                                                                })} style={{borderRadius:5,height:29,width:'95%', backgroundColor:'#D0242A', alignSelf:'center',alignContent:'center',justifyContent:'center', marginBottom: 20}}>
                                        <Text style={{fontWeight:'bold', fontSize:13, color:'white' ,textAlign:'center' }}>Show On Google Maps</Text>
                            </TouchableOpacity>
                            </View>: null }
                        </View>} 

                        {latRehatEnd == 0 || longRehatEnd == 0 ? null :
                        <View style={{marginTop:5}} >
                            <View style={{alignItems:'center', justifyContent:'center', marginTop:10}}>
                                <View style={{alignItems:'center', justifyContent:'center',borderWidth:1, width:'95%', height: 30, backgroundColor:'#9D1D20'}}>
                                    <Text style={{textAlign:'center',fontSize:RFValue(16), fontWeight:'bold', color: 'white'}}>Maps Absen Istirahat Selesai</Text>
                                </View> 
                            </View>
                            <View style={[styles.contentSignature,{ flexDirection: "column",borderWidth:1 }]}>
                            <MapView
                                style={styles.map}
                                region={{
                                latitude: latRehatEnd,
                                longitude: longRehatEnd,
                                latitudeDelta: 0.0922 * 0.05, 
                                longitudeDelta: 0.0421 * 0.05,
                                }}>
                                <Marker
                                    coordinate={{latitude: latRehatEnd, longitude: longRehatEnd}}
                                    title="Absen Masuk"/>
                                </MapView>
                            </View>
                            {Platform.OS == 'android' ? 
                            <View>
                            <TouchableOpacity onPress={() => showLocation({
                                                                    latitude: latRehatEnd,
                                                                    longitude: longRehatEnd,
                                                                    // sourceLatitude: -8.0870631,  // optionally specify starting location for directions
                                                                    // sourceLongitude: -34.8941619,  // not optional if sourceLatitude is specified
                                                                    title: latRehatEnd.toString()+','+longRehatEnd.toString() ,  // optional
                                                                    googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
                                                                    // googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
                                                                    // alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
                                                                    // dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
                                                                    // dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
                                                                    // cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
                                                                    appsWhiteList: ['google-maps'] // optionally you can set which apps to show (default: will show all supported apps installed on device)
                                                                    // appTitles: { 'google-maps': 'My custom Google Maps title' } // optionally you can override default app titles
                                                                    // app: 'uber'  // optionally specify specific app to use
                                                                })} style={{borderRadius:5,height:29,width:'95%', backgroundColor:'#D0242A', alignSelf:'center',alignContent:'center',justifyContent:'center', marginBottom: 20}}>
                                        <Text style={{fontWeight:'bold', fontSize:13, color:'white' ,textAlign:'center' }}>Show On Google Maps</Text>
                            </TouchableOpacity>
                            </View>: null }
                        </View>} 

                        {latPulang == 0 || longPulang == 0 ? null :
                        <View style={{marginTop:5}} >
                            <View style={{alignItems:'center', justifyContent:'center', marginTop:10}}>
                                <View style={{alignItems:'center', justifyContent:'center',borderWidth:1, width:'95%', height: 30, backgroundColor:'#9D1D20'}}>
                                    <Text style={{textAlign:'center',fontSize:RFValue(16), fontWeight:'bold', color: 'white'}}>Maps Absen Pulang</Text>
                                </View> 
                            </View>
                            <View style={[styles.contentSignature,{ flexDirection: "column",borderWidth:1 }]}>
                            <MapView
                                style={styles.map}
                                region={{
                                latitude: latPulang,
                                longitude: longPulang,
                                latitudeDelta: 0.0922 * 0.05, 
                                longitudeDelta: 0.0421 * 0.05,
                                }}>
                                <Marker
                                    coordinate={{latitude: latPulang, longitude: longPulang}}
                                    title="Absen Masuk"/>
                                </MapView>
                            </View>
                            {Platform.OS == 'android' ? 
                            <View>
                            <TouchableOpacity onPress={() => showLocation({
                                                                    latitude: latPulang,
                                                                    longitude: longPulang,
                                                                    // sourceLatitude: -8.0870631,  // optionally specify starting location for directions
                                                                    // sourceLongitude: -34.8941619,  // not optional if sourceLatitude is specified
                                                                    title: latPulang.toString()+','+longPulang.toString() ,  // optional
                                                                    googleForceLatLon: false,  // optionally force GoogleMaps to use the latlon for the query instead of the title
                                                                    // googlePlaceId: 'ChIJGVtI4by3t4kRr51d_Qm_x58',  // optionally specify the google-place-id
                                                                    // alwaysIncludeGoogle: true, // optional, true will always add Google Maps to iOS and open in Safari, even if app is not installed (default: false)
                                                                    // dialogTitle: 'This is the dialog Title', // optional (default: 'Open in Maps')
                                                                    // dialogMessage: 'This is the amazing dialog Message', // optional (default: 'What app would you like to use?')
                                                                    // cancelText: 'This is the cancel button text', // optional (default: 'Cancel')
                                                                    appsWhiteList: ['google-maps'] // optionally you can set which apps to show (default: will show all supported apps installed on device)
                                                                    // appTitles: { 'google-maps': 'My custom Google Maps title' } // optionally you can override default app titles
                                                                    // app: 'uber'  // optionally specify specific app to use
                                                                })} style={{borderRadius:5,height:29,width:'95%', backgroundColor:'#D0242A', alignSelf:'center',alignContent:'center',justifyContent:'center', marginBottom: 20}}>
                                        <Text style={{fontWeight:'bold', fontSize:13, color:'white' ,textAlign:'center' }}>Show On Google Maps</Text>
                            </TouchableOpacity>
                            </View>: null }
                        </View>} 
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
    contentSignature: {
        flexDirection:'row', 
        width:'95%', 
        alignItems:'stretch', 
        marginHorizontal:10, 
        height:250
    },
    signature: {
        flex: 1,
        borderColor: '#000033',
        borderWidth: 1,
    },
    buttonStyle: {
        flex: 1, justifyContent: "center", alignItems: "center", height: 50,
        backgroundColor: "#eeeeee",
        margin: 10
    },
    kolomJudul: {
        paddingLeft:5,
        borderWidth:1,
        justifyContent:'space-between',
        flexDirection:'row', 
        width:'95%',
        alignItems:'center', 
        marginHorizontal:10, 
        marginTop:10,
    },
    kolomContent: {
        flexDirection:'row', 
        width:'95%', 
        alignItems:'stretch', 
        marginHorizontal:10, 
        height:30
    },
    rowKiri: {
        width:'45%',
        borderWidth:1, 
        justifyContent:'center',
        paddingLeft:5,
    },
    rowKanan: {
        width:'55%',    
        alignItems:'center', 
        borderWidth:1, 
        justifyContent:'center', 
        backgroundColor:'#FFFAD6',
    },
    rowKananReadOnly: {
        width:'55%', 
        borderWidth:1, 
        justifyContent:'center', 
        paddingLeft : 5
    },
    rowKananPicker: {
        width:'55%', 
        alignItems:'center', 
        borderWidth:1, 
        justifyContent:'center',
     
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
  
  export default connect(mapStateToProps,null) (AbsensiMaps);