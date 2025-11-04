import React, {Component} from 'react';
import {FlatList,ActivityIndicator,View,Text,TouchableOpacity, StyleSheet, Alert,StatusBar,RefreshControl, TextInput, ScrollView, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import API from '../../../config/services';
import Moment from 'moment';
import { RFValue } from 'react-native-responsive-fontsize';


const { height , width } = Dimensions.get("window");

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 50;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

var i=0;

class HistoryAbsensi extends Component{
    constructor (props) {
        super(props)
        this.state={
          absensi : [],
          isLoading: false,
          isLoadingBottom : false,
          page:1,
          txtSearch : '',
          jenisAbsen : 'reguler',
        };
      }

    componentDidMount = async() => {
      this.setState({
        isLoading: true,
      })
      await this._getData(this.state.page);
    }

    _pagePrev= () => {
      let pageBef= this.state.page 
      if (pageBef ===1){
          alert('Halaman Pertama!');
      }else{
          this.setState({
              page: pageBef - 1,
          })
          this._getData(pageBef - 1);
      }
    }

    _handleTextInput = (name) => {
      return (text) => {
          this.setState({
              [name]: text,
           })
      }
    }

    _pageNext=() => {
        let pageBef = this.state.page 
        this.setState({
            page: pageBef + 1,
        })
         this._getData(pageBef + 1);
    }

    _getData = async(hal) => {

        const bodyData = {
            NIP : this.props.nip,
            HAL : hal,
            TGL : this.state.txtSearch
        }

        // console.log('REQ LIST HIST ABSENSI',bodyData)
        if (this.state.jenisAbsen == 'reguler'){
          await API.ListHistAbsensi(bodyData).then((ResponseJson) => {
            console.log('ABSENSI REGULER',ResponseJson)
                if (ResponseJson.ResponseCode =='00'){
                    this.setState({
                      absensi : [...this.state.absensi,...ResponseJson.data],
                      isLoading : false,
                      isLoadingBottom : false,
                    })
                }else {
                    this.setState({
                      //absensi: [],
                      isLoading : false,
                      isLoadingBottom : false,
                    })
                  } 
              },(err) => { 
                Alert.alert('Terdapat permasalahan sistem.', err.toString());
                this.setState({
                    isLoading : false,
                    isLoadingBottom : false,
                  });
          })
        }else{
          await API.ListHistAbsensiEvent(bodyData).then((ResponseJson) => {
                console.log('ABSENSI EVENT',ResponseJson)
                if (ResponseJson.ResponseCode =='00'){
                    this.setState({
                      absensi : [...this.state.absensi,...ResponseJson.data],
                      isLoading : false,
                      isLoadingBottom : false,
                    })
                }else {
                    this.setState({
                      //absensi: [],
                      isLoading : false,
                      isLoadingBottom : false,
                    })
                  } 
              },(err) => { 
                Alert.alert('Terdapat permasalahan sistem.', err.toString());
                this.setState({
                    isLoading : false,
                    isLoadingBottom : false,
                  });
          })
        }
        

    }

    CariData = async({jenis}) => {
      this.setState({
        isLoading : true,
        page : 1,
      });

      const bodyData = {
        NIP : this.props.nip,
        HAL : 1,
        TGL : this.state.txtSearch
      }

          if (jenis == 'reguler'){
            await API.ListHistAbsensi(bodyData).then((ResponseJson) => {
              console.log('ListHistAbsensi : ',ResponseJson)
              if (ResponseJson.ResponseCode =='00'){
                  this.setState({
                    absensi : ResponseJson.data,
                    isLoading : false,
                  })
              }else {
                  this.setState({
                    absensi: [],
                    isLoading : false,
                  })
                } 
            },(err) => { 
              Alert.alert('Terdapat permasalahan sistem.', err.toString());
              this.setState({
                  isLoading : false,
                });
            })
          }else{
            await API.ListHistAbsensiEvent(bodyData).then((ResponseJson) => {
              console.log('ListHistAbsensiEvent : ',ResponseJson)
              if (ResponseJson.ResponseCode =='00'){
                  this.setState({
                    absensi : ResponseJson.data,
                    isLoading : false,
                   })
              }else {
                  this.setState({
                    absensi: [],
                    isLoading : false,
                  })
                } 
            },(err) => { 
              Alert.alert('Terdapat permasalahan sistem.', err.toString());
              this.setState({
                  isLoading : false,
                });
            })
          }
      
      }

    
      _onRefresh = async() => {
        this.setState({
          isLoading : true,
          page : 1,
        });

        const bodyData = {
          NIP : this.props.nip,
          HAL : 1,
          TGL : ''
        }

        if (this.state.jenisAbsen == 'reguler'){
          await API.ListHistAbsensi(bodyData).then((ResponseJson) => {
            // console.log('RESP LIST HIST ABSENSI',ResponseJson)
            if (ResponseJson.ResponseCode =='00'){
                this.setState({
                  absensi : ResponseJson.data,
                  isLoading : false,
                 })
            }else {
                this.setState({
                  absensi: [],
                  isLoading : false,
                })
            } 
          },(err) => { 
            Alert.alert('Terdapat permasalahan sistem.', err.toString());
            this.setState({
                isLoading : false,
              });
          })
        }else{
          await API.ListHistAbsensiEvent(bodyData).then((ResponseJson) => {
            // console.log('RESP LIST HIST ABSENSI',ResponseJson)
            if (ResponseJson.ResponseCode =='00'){
                this.setState({
                  absensi : ResponseJson.data,
                  isLoading : false,
                 })
            }else {
                this.setState({
                  absensi: [],
                  isLoading : false,
                })
            } 
          },(err) => { 
            Alert.alert('Terdapat permasalahan sistem.', err.toString());
            this.setState({
                isLoading : false,
              });
          })
        }
        
    }

    ListAbsensi = () => {
            const {jenisAbsen} = this.state
            if(this.state.isLoading){
                return(
                  <View style={{flex:1, backgroundColor:'#F7F7F7'}}>
                     <View style={{flex: 1, padding: RFValue(20)}}>
                      <ActivityIndicator size="large" color="#0c9"/>
                    </View>
                  </View>
                )
              }
      
              if (!this.state.isLoading && this.state.absensi && this.state.absensi.length == 0){
                return(
                  <View style={{flex:1, backgroundColor:'#F7F7F7'}}>
                    <View style={{flex: 1, padding: RFValue(20), justifyContent:'center'}}>
                      <Text style={{textAlign:'center'}}>Tidak ada data !</Text>
                    </View>
                  </View>
                )
              }
              return(
                  <View style={{flex:1, backgroundColor:'#F7F7F7'}}>
                          <ScrollView
                            // ref={ref => {this.scrollView = ref}}
                            // onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
                            refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}
                            onScroll={({nativeEvent}) => {
                              if (isCloseToBottom(nativeEvent)) {
                                i += 1;
                                this.setState({
                                      isLoadingBottom : true
                                    })
                                this._pageNext();
                                
                                //console.log("NGISOR CUK ! -- " , i)
                              }
                            }}
                            scrollEventThrottle={400}>
                          <FlatList
                              data={this.state.absensi}
                              keyExtractor={item => item.TANGGAL}
                              renderItem={({ item,index }) => (
                                <View style={{...styles.boxShadow, marginTop:0, width: width - RFValue(20),height:  RFValue(180), elevation :5, backgroundColor:'white',alignItems:'center', marginTop:RFValue(20), marginBottom:RFValue(10)}}>
                                                              <View style={{width : width - RFValue(40),  marginTop:RFValue(20), height:'17%', justifyContent:'center', alignContent:'center', }}>
                                                                <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                                                                    <View style={{width: '20%', justifyContent:'center', alignItems:'center'}}>
                                                                      <Icon name='calendar-check' size={RFValue(35)} color="#D0242A" />
                                                                    </View>
                                                                    <View style={{width: '80%',marginLeft:0, justifyContent:'center' }}>
                                                                        <Text style={{color:'black', fontSize:RFValue(16), fontWeight:'bold'}}>{Moment(item.TANGGAL, 'YYYYMMDD').format('DD MMM YYYY')}</Text>
                                                                    </View>
                                                                </View>
                                                              </View>

                                                              {jenisAbsen == 'reguler' ? 
                                                              <View style={{width:'100%',height:'65%'}}>
                                                                <View style={{flexDirection:'row', marginTop:RFValue(20)}}>
                                                                  <View style={{width:'25%', height:RFValue(20), paddingLeft:RFValue(20)}}>
                                                                    <Text style={{color:'grey', fontSize:RFValue(10)}}>Masuk</Text>
                                                                  </View>
                                                                  <View style={{width:'35%', height:RFValue(20)}}>
                                                                    <Text style={{color:'black', fontSize:RFValue(10),}}>{item.TIME_MASUK == "-" ? "-" : item.TIME_MASUK + " - (" + item.JARAK_DATANG + " KM)" }</Text>
                                                                  </View>
                                                                  <View style={{width:'15%', height:RFValue(20), }}>
                                                                    <Text style={{color:'grey', fontSize:RFValue(10)}}>Status</Text>
                                                                  </View>
                                                                  <View style={{width:'22%', height:RFValue(20), flexDirection:'row', justifyContent:'space-between', }}>
                                                                    <Text style={{color: item.OTOR_ABSEN_MASUK == 'Approved'|| item.STATUS_ABSEN_MASUK == 'WFH' || item.STATUS_ABSEN_MASUK == 'WFO' || item.STATUS_ABSEN_MASUK == '-' ? 'black' : 'red', fontSize:RFValue(10),}}>{item.STATUS_ABSEN_MASUK == 'DDK' ? 'Absen Luar' : item.STATUS_ABSEN_MASUK}</Text>
                                                                    {item.STATUS_ABSEN_MASUK == 'DDK' ? 
                                                                    <TouchableOpacity onPress={() => Alert.alert('Status Otor Absen Luar','\nStatus : ' + item.OTOR_ABSEN_MASUK + '\nKeterangan : ' + item.KET_OTOR_MASUK)}>
                                                                      <Icon name='eye' size={RFValue(15)} color="#D0242A" />
                                                                    </TouchableOpacity>
                                                                    : null}
                                                                  </View>
                                                                </View>
                                                                <View style={{flexDirection:'row', marginTop:0}}>
                                                                  <View style={{width:'25%', height:RFValue(20), paddingLeft:RFValue(20)}}>
                                                                    <Text style={{color:'grey', fontSize:RFValue(10)}}>Istirahat</Text>
                                                                  </View>
                                                                  <View style={{width:'35%', height:RFValue(20)}}>
                                                                    <Text style={{color:'black', fontSize:RFValue(10),}}>{item.TIME_REHAT_START == "-" ? "-" : item.TIME_REHAT_START + " - (" + item.JARAK_REHAT + " KM)" }</Text>
                                                                  </View>
                                                                  <View style={{width:'15%', height:RFValue(20), }}>
                                                                    <Text style={{color:'grey', fontSize:RFValue(10)}}>Status</Text>
                                                                  </View>
                                                                  <View style={{width:'22%', height:RFValue(20), flexDirection:'row', justifyContent:'space-between', }}>
                                                                    <Text style={{color: item.OTOR_ABSEN_REHAT == 'Approved'|| item.STATUS_ABSEN_REHAT == 'WFH' || item.STATUS_ABSEN_REHAT == 'WFO' || item.STATUS_ABSEN_REHAT == '-'  ? 'black' : 'red', fontSize:RFValue(10),}}>{item.STATUS_ABSEN_REHAT == 'DDK' ? 'Absen Luar' : item.STATUS_ABSEN_REHAT}</Text>
                                                                    {item.STATUS_ABSEN_REHAT == 'DDK' ? 
                                                                    <TouchableOpacity onPress={() => Alert.alert('Status Otor Absen Luar','\nStatus : ' + item.OTOR_ABSEN_REHAT + '\nKeterangan : ' + item.KET_OTOR_REHAT)}>
                                                                      <Icon name='eye' size={RFValue(15)} color="#D0242A" />
                                                                    </TouchableOpacity>
                                                                    : null}
                                                                  </View>
                                                                </View>
                                                                <View style={{flexDirection:'row', marginTop:0}}>
                                                                  <View style={{width:'25%', height:RFValue(20), paddingLeft:RFValue(20)}}>
                                                                    <Text style={{color:'grey', fontSize:RFValue(10)}}>Pulang</Text>
                                                                  </View>
                                                                  <View style={{width:'35%', height:RFValue(20)}}>
                                                                    <Text style={{color:'black', fontSize:RFValue(10),}}>{item.TIME_PULANG == "-" ? "-" : item.TIME_PULANG + " - (" + item.JARAK_PULANG  + " KM)"}</Text>
                                                                  </View>
                                                                  <View style={{width:'15%', height:RFValue(20), }}>
                                                                    <Text style={{color:'grey', fontSize:RFValue(10)}}>Status</Text>
                                                                  </View>
                                                                  <View style={{width:'22%', height:RFValue(20), flexDirection:'row', justifyContent:'space-between', }}>
                                                                    <Text style={{color: item.OTOR_ABSEN_PULANG == 'Approved'|| item.STATUS_ABSEN_PULANG == 'WFH' || item.STATUS_ABSEN_PULANG == 'WFO' || item.STATUS_ABSEN_PULANG == '-'  ? 'black' : 'red', fontSize:RFValue(10),}}>{item.STATUS_ABSEN_PULANG == 'DDK' ? 'Absen Luar' : item.STATUS_ABSEN_PULANG}</Text>
                                                                    {item.STATUS_ABSEN_PULANG == 'DDK' ? 
                                                                    <TouchableOpacity onPress={() => Alert.alert('Status Otor Absen Luar','\nStatus : ' + item.OTOR_ABSEN_PULANG + '\nKeterangan : ' + item.KET_OTOR_PULANG)}>
                                                                      <Icon name='eye' size={RFValue(15)} color="#D0242A" />
                                                                    </TouchableOpacity>
                                                                    : null}
                                                                  </View>
                                                                </View>
                                                              </View>
                                                              : 
                                                              <View style={{width:'100%',height:'65%'}}>
                                                              <View style={{flexDirection:'row', marginTop:RFValue(20)}}>
                                                                <View style={{width:'25%', height:RFValue(20), paddingLeft:RFValue(20)}}>
                                                                  <Text style={{color:'grey', fontSize:RFValue(10)}}>Kegiatan</Text>
                                                                </View>
                                                                <View style={{width:'70%', height:RFValue(65), borderWidth:0.5, borderColor:'lightgrey', borderRadius:10, padding:5}}>
                                                                  <Text style={{color:'black', fontSize:RFValue(10),flexWrap: 'wrap'}}>{item.NAMA_EVENT}</Text>
                                                                </View>
                                                              </View>
                                                              <View style={{flexDirection:'row', marginTop:10}}>
                                                                <View style={{width:'25%', height:RFValue(20), paddingLeft:RFValue(20)}}>
                                                                  <Text style={{color:'grey', fontSize:RFValue(10)}}>Jam Masuk</Text>
                                                                </View>
                                                                <View style={{width:'35%', height:RFValue(20)}}>
                                                                  <Text style={{color:'black', fontSize:RFValue(10),}}>{item.TIME_MASUK}</Text>
                                                                </View>
                                                                <View style={{width:'15%', height:RFValue(20), }}>
                                                                  <Text style={{color:'grey', fontSize:RFValue(10)}}>Jam Keluar</Text>
                                                                </View>
                                                                <View style={{width:'22%', height:RFValue(20), flexDirection:'row', justifyContent:'space-between', }}>
                                                                  <Text style={{color:'black', fontSize:RFValue(10),}}>{item.TIME_KELUAR}</Text>
                                                                </View>
                                                              </View>
                                                            </View>
                                                              }

                                                              {jenisAbsen == 'reguler' ? 
                                                              <View style={{width:'100%',height:'20%', justifyContent:'center', alignItems:'center', flexDirection:'row', marginTop : -RFValue(20)}}>
                                                                <View style={{width: '30%', justifyContent:'center', alignItems:'center', marginHorizontal:RFValue(5)}}>
                                                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('AbsensiFoto', {
                                                                                          tanggal : item.TANGGAL
                                                                                        })} style={{borderRadius:RFValue(5),height:RFValue(27) ,width:'100%', backgroundColor:'green', alignItems:'center',justifyContent:'center', flexDirection:'row',marginBottom:RFValue(15)}}>
                                                                      <Icon name='image-search-outline' size={RFValue(15)} color="#F7F7F7" style={{color:'white'}} />
                                                                      <Text style={{fontWeight:'bold', fontSize:RFValue(12), color:'white' ,textAlign:'center' }}> View Photo </Text>
                                                                  </TouchableOpacity>
                                                                </View>
                                                                <View style={{width: '30%', justifyContent:'center', alignItems:'center', marginHorizontal:5}}>
                                                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('AbsensiMaps', {
                                                                                          tanggal : item.TANGGAL
                                                                                        })} style={{borderRadius:RFValue(5),height:RFValue(27) ,width:'100%', backgroundColor:'#9D1D20', alignItems:'center',justifyContent:'center', flexDirection:'row',marginBottom:RFValue(15)}}>
                                                                      <Icon name='map-search-outline' size={RFValue(15)} color="#F7F7F7" style={{color:'white'}} />
                                                                      <Text style={{fontWeight:'bold', fontSize:RFValue(12), color:'white' ,textAlign:'center' }}> View Maps </Text>
                                                                  </TouchableOpacity>
                                                                </View>
                                                              </View> : null }
                                                                               
                                                            </View>
                              )}
                            />
                            {this.state.isLoadingBottom ? 
                            <View style={{width:'100%', height: RFValue(50), backgroundColor :'#F7F7F7', justifyContent:'center', alignItems:'center'}}>
                                <ActivityIndicator size="large" color="#0c9"/>
                            </View> : 
                            <View style={{width:'100%', height: RFValue(50), backgroundColor :'#F7F7F7', justifyContent:'center', alignItems:'center'}}></View>
                            }
                        </ScrollView>
                  </View> 
              )
    }

    render(){
        const { goBack } = this.props.navigation;
        const { jenisAbsen } = this.state
        return(
          <View style={{flex:1,backgroundColor:'#9D1D20'}}>
            <StatusBar  barStyle="light-content" translucent backgroundColor='#9D1D20' />
          {/* {Platform.OS == 'ios' ? <View style={{marginTop:25}}></View> : null } */}
                {/* HEADER */}
                <View style={{backgroundColor:'#9D1D20', marginTop:RFValue(25),}}>
                    <View style={{height:RFValue(50), marginHorizontal:RFValue(17), flexDirection:'row'}}>
                            <View style={{flexDirection:'row',marginTop:RFValue(10),marginBottom:RFValue(10)}}>
                                <TouchableOpacity onPress={() => goBack()}>
                                    <Icon name='chevron-double-left' size={RFValue(30)} color="#F7F7F7" style={{color:'white'}} />
                                </TouchableOpacity>
                                <Text style={{fontSize:RFValue(18),marginLeft:RFValue(4),marginTop:RFValue(3), color:'#F7F7F7'}}>History Absensi</Text>
                            </View>
                        </View>
                </View>
                <View style={{width:'100%', height:60, backgroundColor:'#F7F7F7', flexDirection:'row', alignItems:'center', justifyContent:'center',}}>
                    <TouchableOpacity onPress={async()=> {this.setState({jenisAbsen : 'reguler'}); await this.CariData({jenis : 'reguler'})}} style={{width:'40%', height:'85%', backgroundColor: this.state.jenisAbsen == 'reguler' ? 'lightgrey' : '#F7F7F7', borderWidth:0.5, borderRadius:10, marginHorizontal:10, marginTop:5, alignItems:'center', justifyContent:'center'}}>
                        <Text style={{fontSize:RFValue(12), fontWeight:'bold'}}>REGULER</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={async()=> {this.setState({jenisAbsen : 'event'}); await this.CariData({jenis : 'event'})}} style={{width:'40%', height:'85%',borderWidth:0.5, borderRadius:10, marginHorizontal:10, marginTop:5, backgroundColor: this.state.jenisAbsen == 'event' ? 'lightgrey' : '#F7F7F7', alignItems:'center', justifyContent:'center'}}>
                        <Text style={{fontSize:RFValue(12), fontWeight:'bold'}}>EVENT</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height:RFValue(45),flexDirection:'row', backgroundColor:'#F7F7F7',}}>
                
                  <View style={{flex:1,marginTop:RFValue(5), marginBottom:RFValue(5)}}>
                      <TextInput 
                        placeholder = "Cari Tanggal Absen (YYYYMMDD)"
                        returnKeyType = 'search'
                        autoCapitalize="characters"
                        value={this.state.txtSearch}
                        onChangeText={this._handleTextInput('txtSearch')}
                        onSubmitEditing={() => this.CariData({jenis : jenisAbsen})}
                        style={{fontSize:RFValue(12),height: RFValue(35), marginLeft:RFValue(10),borderWidth:0.3, borderRadius:30, paddingLeft:RFValue(40), width:'95%'}}/>
                        <TouchableOpacity style={{height:RFValue(29), width:RFValue(29), borderRadius:50, position:'absolute', marginLeft:RFValue(20), marginTop:RFValue(5)}} onPress={() => this.CariData({jenis : jenisAbsen})}>
                          <Icon name='magnify' size={RFValue(25)} color="#000"  />
                        </TouchableOpacity>
                      
                  </View>
                </View>
                {this.ListAbsensi()}
            </View>
        
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userLogin : state.userLogin,
        levelDesc : state.levelDesc,
        namaCabang : state.namaCabang,
        namaWilayah : state.namaWilayah,
        kdCab : state.kdCab,
        kdWil : state.kdWil,
        nip : state.nip,
        lvlUser: state.lvlUser,
        lvlGrp : state.lvlGrp,
    }
  };

  const styles = StyleSheet.create({
    kolomContent: {
        flexDirection:'row', 
        width:'100%', 
        alignItems:'center',
        justifyContent:'center', 
        // marginHorizontal:10, 
        height:40,
        backgroundColor:'#9D1D20'
    },
    kolom1: {
      width:'20%', 
      alignItems:'center', 
      justifyContent:'center',
      fontSize:10, 

  },
  kolom2: {
      width:'20%', 
      alignItems:'center', 
      justifyContent:'center',
      fontSize:10, 

  },
  kolom3: {
      width:'20%', 
      alignItems:'center', 
      justifyContent:'center',
      fontSize:10, 

  },
  kolom4: {
      width:'20%', 
      alignItems:'center', 
      justifyContent:'center',
      fontSize:10, 

  },
  kolom5: {
      width:'20%', 
      alignContent:'center', 
      justifyContent:'center',
      fontSize:10, 

  },
  kolom6: {
      width:'17%', 
      alignContent:'center', 
      justifyContent:'center',
      fontSize:10, 

  },
  boxShadow: {
    marginHorizontal: 10,   
    borderRadius : 10, 
    alignContent : 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    //elevation: 3,
  },
});

export default connect(mapStateToProps,null)(HistoryAbsensi);