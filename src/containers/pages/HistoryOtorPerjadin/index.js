import React, {Component} from 'react';
import {FlatList,ActivityIndicator,View,Text,TouchableOpacity, StyleSheet, Alert,StatusBar,RefreshControl, TextInput, ScrollView, Dimensions, Image} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import API from '../../../config/services';
import Moment from 'moment';
import { RFValue } from 'react-native-responsive-fontsize';
import Modal from 'react-native-modal';
import MapView ,{ Marker } from 'react-native-maps';

const pictDefault = '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'


const { height , width } = Dimensions.get("window");

const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 50;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

var i=0;

class HistoryOtorPerjadin extends Component{
    constructor (props) {
        super(props)
        this.state={
          listOtor : [],
          isLoading: false,
          isLoadingBottom : false,
          page : 1,
          txtSearch : '',
          modalFoto : false,
          modalMaps : false,
          foto : '',
          latitude : 0,
          longitude :0,
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

        // console.log('REQ LIST HIST OTOR',bodyData)
        await API.ListOtorPerjadin(bodyData).then((ResponseJson) => {
          // console.log('RESP LIST HIST OTOR',ResponseJson)
              if (ResponseJson.ResponseCode =='00'){
                  this.setState({
                    listOtor : [...this.state.listOtor,...ResponseJson.data],
                    isLoading : false,
                    isLoadingBottom : false,
                   })
              }else {
                  this.setState({
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

    CariData = async() => {
      this.setState({
        isLoading : true,
        page : 1,
      });

      const bodyData = {
        NIP : this.props.nip,
        HAL : 1,
        TGL : this.state.txtSearch
    }

    // console.log('REQ LIST HIST OTOR',bodyData)
    await API.ListOtorPerjadin(bodyData).then((ResponseJson) => {
      // console.log('RESP LIST HIST OTOR',ResponseJson)
          if (ResponseJson.ResponseCode =='00'){
              this.setState({
                listOtor : ResponseJson.data,
                isLoading : false,
               })
          }else {
              this.setState({
                listOtor: [],
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

    // console.log('REQ LIST HIST OTOR',bodyData)
    await API.ListOtorPerjadin(bodyData).then((ResponseJson) => {
          // console.log('RESP LIST HIST OTOR',ResponseJson)
          if (ResponseJson.ResponseCode =='00'){
              this.setState({
                listOtor : ResponseJson.data,
                isLoading : false,
               })
          }else {
              this.setState({
                listOtor: [],
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

    ListOtor = () => {
            if(this.state.isLoading){
                return(
                  <View style={{flex:1, backgroundColor:'#F7F7F7'}}>
                     <View style={{flex: 1, padding: RFValue(20)}}>
                      <ActivityIndicator size="large" color="#0c9"/>
                    </View>
                  </View>
                )
              }
      
              if (!this.state.isLoading && this.state.listOtor && this.state.listOtor.length == 0){
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
                              data={this.state.listOtor}
                              keyExtractor={item => item.ID}
                              renderItem={({ item,index }) => (
                                <View style={{...styles.boxShadow, marginTop:0, width: width - RFValue(20),height: RFValue(280), elevation :5, backgroundColor:'white',alignItems:'center', marginTop:RFValue(20), marginBottom:RFValue(10)}}>
                                                              <View style={{width : width - RFValue(40), flexDirection:'row', marginTop:RFValue(20), height:'17%',}}>
                                                                <View style={{width: '20%', justifyContent:'center', alignItems:'center'}}>
                                                                  <Icon name='account-supervisor-outline' size={RFValue(35)} color="#D0242A" />
                                                                </View>
                                                                <View style={{width: '80%',marginLeft:0, justifyContent:'center' }}>
                                                                    <Text style={{color:'black', fontSize:RFValue(16), fontWeight:'bold'}}>{Moment(item.TANGGAL, 'YYYYMMDD').format('DD MMM YYYY')}</Text>
                                                                    <Text style={{color:'black', fontSize:RFValue(12),}}>{item.NIP} - {item.NAMA}</Text>
                                                                </View>
                                                                
                                                              </View>

                                                    
                                                              <View style={{width:'100%',height:'65%'}}>
                                                                <View style={{flexDirection:'row', marginTop:RFValue(20)}}>
                                                                  <View style={{width:'30%', height:RFValue(20), paddingLeft:RFValue(20)}}>
                                                                    <Text style={{color:'grey', fontSize:RFValue(12)}}>Perihal</Text>
                                                                  </View>
                                                                  <View style={{width:'70%', height:RFValue(20)}}>
                                                                    <Text style={{color:'black', fontSize:RFValue(12),}}>{item.PERIHAL}</Text>
                                                                  </View>
                                                                </View>
                                                                <View style={{flexDirection:'row', marginTop:0}}>
                                                                  <View style={{width:'30%', height:RFValue(20), paddingLeft:RFValue(20)}}>
                                                                    <Text style={{color:'grey', fontSize:RFValue(12)}}>Keterangan</Text>
                                                                  </View>
                                                                  <View style={{width:'70%', height:RFValue(20), paddingRight:10}}>
                                                                    <Text style={{color:'black', fontSize:RFValue(12),}}>{item.KETERANGAN}</Text>
                                                                  </View>
                                                                </View>
                                                                <View style={{flexDirection:'row', marginTop:30}}>
                                                                  <View style={{width:'30%', height:RFValue(20), paddingLeft:RFValue(20)}}>
                                                                    <Text style={{color:'grey', fontSize:RFValue(12)}}>Status</Text>
                                                                  </View>
                                                                  <View style={{width:'70%', height:RFValue(20)}}>
                                                                    <Text style={{color:'black', fontSize:RFValue(12),}}>{item.STS_OTOR == undefined ? 'Belum Approve' : item.STS_OTOR}</Text>
                                                                  </View>
                                                                </View>
                                                                <View style={{flexDirection:'row', marginTop:0}}>
                                                                  <View style={{width:'30%', height:RFValue(20), paddingLeft:RFValue(20)}}>
                                                                    <Text style={{color:'grey', fontSize:RFValue(12)}}>Tgl Otor</Text>
                                                                  </View>
                                                                  <View style={{width:'70%', height:RFValue(20)}}>
                                                                    <Text style={{color:'black', fontSize:RFValue(12),}}>{item.STS_OTOR == 'Approved' ? item.TGL_OTOR : '-'}</Text>
                                                                  </View>
                                                                </View>
                                                                <View style={{flexDirection:'row', marginTop:0}}>
                                                                  <View style={{width:'30%', height:RFValue(20), paddingLeft:RFValue(20)}}>
                                                                    <Text style={{color:'grey', fontSize:RFValue(12)}}>{item.STS_OTOR == 'Reject' ? 'Ket Reject' : 'Ket. Otor'}</Text>
                                                                  </View>
                                                                  <View style={{width:'70%', height:RFValue(20), }}>
                                                                    <Text style={{color:'black', fontSize:RFValue(12),}}>{item.KET_OTOR == undefined ? '-' : item.KET_OTOR}</Text>
                                                                  </View>
                                                                </View>
                                                              </View>
                                                              <View style={{width:'100%',height:'20%', justifyContent:'center', alignItems:'center', flexDirection:'row', marginTop : -RFValue(20)}}>
                                                                <View style={{width: '30%', justifyContent:'center', alignItems:'center', marginHorizontal:RFValue(5)}}>
                                                                  <TouchableOpacity onPress={() => this.setState({modalFoto : true, foto : item.FOTO})} style={{borderRadius:RFValue(5),height:RFValue(27) ,width:'100%', backgroundColor:'green', alignItems:'center',justifyContent:'center', flexDirection:'row',marginBottom:RFValue(15)}}>
                                                                      <Icon name='image-search-outline' size={RFValue(15)} color="#F7F7F7" style={{color:'white'}} />
                                                                      <Text style={{fontWeight:'bold', fontSize:RFValue(12), color:'white' ,textAlign:'center' }}> View Photo </Text>
                                                                  </TouchableOpacity>
                                                                </View>
                                                                <View style={{width: '30%', justifyContent:'center', alignItems:'center', marginHorizontal:5}}>
                                                                  <TouchableOpacity onPress={() => {this.setState({latitude : item.LAT, longitude : item.LONG,modalMaps : true, }); }} style={{borderRadius:RFValue(5),height:RFValue(27) ,width:'100%', backgroundColor:'#9D1D20', alignItems:'center',justifyContent:'center', flexDirection:'row',marginBottom:RFValue(15)}}>
                                                                      <Icon name='map-search-outline' size={RFValue(15)} color="#F7F7F7" style={{color:'white'}} />
                                                                      <Text style={{fontWeight:'bold', fontSize:RFValue(12), color:'white' ,textAlign:'center' }}> View Maps </Text>
                                                                  </TouchableOpacity>
                                                                </View>
                                                                {item.STS_OTOR == 'Approved' || item.STS_OTOR == 'Reject' ? null :
                                                                <View style={{width: '30%', justifyContent:'center', alignItems:'center', marginHorizontal:5}}>
                                                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('ApprovalPerjadin', {
                                                                                          ID : item.ID,
                                                                                          NIP : item.NIP,
                                                                                          TANGGAL : item.TANGGAL,
                                                                                          PERIHAL : item.PERIHAL,
                                                                                          KETERANGAN : item.KETERANGAN
                                                                                        })} style={{borderRadius:RFValue(5),height:RFValue(27) ,width:'100%', backgroundColor:'#4287f5', alignItems:'center',justifyContent:'center', flexDirection:'row',marginBottom:RFValue(15)}}>
                                                                      <Icon name='map-search-outline' size={RFValue(15)} color="#F7F7F7" style={{color:'white'}} />
                                                                      <Text style={{fontWeight:'bold', fontSize:RFValue(12), color:'white' ,textAlign:'center' }}> Approval </Text>
                                                                  </TouchableOpacity>
                                                                </View>}
                                                              </View>
                                                                    
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
        return(
          <View style={{flex:1,backgroundColor:'#9D1D20'}}>
            <Modal
                  animationType="slide"
                  coverScreen
                  hasBackdrop
                  visible={this.state.modalFoto}
                  style={{marginVertical: height * 0.20, backgroundColor:'#F7F7F7',borderWidth:2,borderRadius:RFValue(6),}}
                  propagateSwipe>
                  <View style={{marginBottom:RFValue(10), alignItems:'center',justifyContent:'center', height:RFValue(50), backgroundColor:'#9D1D20', borderTopLeftRadius:RFValue(5), borderTopRightRadius:RFValue(5), flexDirection:'row'}}>
                    <Icon name="monitor-screenshot" size={RFValue(20)} color="#F7F7F7" style={{marginLeft:RFValue(10)}}/>
                    <Text style={{fontSize:RFValue(14), justifyContent:'center', color:'#F7F7F7',fontWeight:'bold', textAlign:'center'}}> Dokumentasi Foto </Text>
                  </View>
                  
                  <ScrollView style={{flex:1}}>
                    <Image 
                      style={{width:RFValue(320), height:RFValue(200),resizeMode:'stretch', alignSelf:'center'}} 
                      source={{uri:`data:image/png;base64,${this.state.foto}`}}
                    />
                  </ScrollView>
            
                  <TouchableOpacity 
                      style={{height:45,width:'100%', backgroundColor: "green", justifyContent:'center',borderRadius:RFValue(5), flexDirection:'row', alignItems:'center', justifyContent:'center'}} 
                      onPress={() => this.setState({modalFoto : false})}>
                      <Text style={{textAlign:'center',color:'white', fontWeight:'bold'}}>Close</Text>
                  </TouchableOpacity>
               
            </Modal>

            <Modal
                  animationType="slide"
                  coverScreen
                  hasBackdrop
                  visible={this.state.modalMaps}
                  style={{marginVertical: height * 0.20, backgroundColor:'#F7F7F7',borderWidth:2,borderRadius:RFValue(6),}}
                  propagateSwipe>
                  <View style={{marginBottom:RFValue(10), alignItems:'center',justifyContent:'center', height:RFValue(50), backgroundColor:'#9D1D20', borderTopLeftRadius:RFValue(5), borderTopRightRadius:RFValue(5), flexDirection:'row'}}>
                    <Icon name="google-maps" size={RFValue(20)} color="#F7F7F7" style={{marginLeft:RFValue(10)}}/>
                    <Text style={{fontSize:RFValue(14), justifyContent:'center', color:'#F7F7F7',fontWeight:'bold', textAlign:'center'}}> Lokasi Acara </Text>
                  </View>
                  
                  <ScrollView style={{flex:1}}>
                  <View style={[styles.contentSignature,{ flexDirection: "column",borderWidth:1}]}>
                            {this.state.latitude == 0 || this.state.longitude == 0 ? null : 
                                        <MapView
                                            style={styles.map}
                                            region={{
                                            latitude: Number(this.state.latitude),
                                            longitude: Number(this.state.longitude),
                                            latitudeDelta: 0.0922 * 0.07, 
                                            longitudeDelta: 0.0421 * 0.07,
                                            }}
                                            >
                                                <Marker
                                                coordinate={{latitude: Number(this.state.latitude) , longitude: Number(this.state.longitude) }}
                                                title="Lokasi Acara" />
                                            
                                            </MapView>}
                                        </View>
                  </ScrollView>
            
                  <TouchableOpacity 
                      style={{height:45,width:'100%', backgroundColor: "green", justifyContent:'center',borderRadius:RFValue(5), flexDirection:'row', alignItems:'center', justifyContent:'center'}} 
                      onPress={() => this.setState({modalMaps : false})}>
                      <Text style={{textAlign:'center',color:'white', fontWeight:'bold'}}>Close</Text>
                  </TouchableOpacity>
               
            </Modal>
            <StatusBar  barStyle="light-content" translucent backgroundColor='#9D1D20' />
          {/* {Platform.OS == 'ios' ? <View style={{marginTop:25}}></View> : null } */}
                {/* HEADER */}
                <View style={{backgroundColor:'#9D1D20', marginTop:RFValue(25)}}>
                    <View style={{height:RFValue(50), marginHorizontal:RFValue(17), flexDirection:'row'}}>
                            <View style={{flexDirection:'row',marginTop:RFValue(10),marginBottom:RFValue(10)}}>
                                <TouchableOpacity onPress={() => goBack()}>
                                    <Icon name='chevron-double-left' size={RFValue(30)} color="#F7F7F7" style={{color:'white'}} />
                                </TouchableOpacity>
                                <Text style={{fontSize:RFValue(16),marginLeft:RFValue(4),marginTop:RFValue(3), color:'#F7F7F7'}}>History Otor Absen Luar Kantor</Text>
                            </View>
                      </View>
                </View>
                <View style={{height:RFValue(45),flexDirection:'row', backgroundColor:'#F7F7F7',}}>
                  <View style={{flex:1,marginTop:RFValue(5), marginBottom:RFValue(5)}}>
                      <TextInput 
                          placeholder = "Cari Tanggal Absen (YYYYMMDD)"
                          returnKeyType = 'search'
                          autoCapitalize="characters"
                          value={this.state.txtSearch}
                          onChangeText={this._handleTextInput('txtSearch')}
                          onSubmitEditing={() => this.CariData()}
                          style={{fontSize:12,height: RFValue(35), marginLeft:RFValue(10),borderWidth:0.3, borderRadius:30, paddingLeft:RFValue(40), width:'95%'}}/>
                          <TouchableOpacity style={{height:RFValue(29), width:RFValue(29), borderRadius:50, position:'absolute', marginLeft:RFValue(20), marginTop:RFValue(5)}} onPress={() => this.CariData()}>
                            <Icon name='magnify' size={25} color="#000"  />
                          </TouchableOpacity>
                  </View>
                </View>
                {this.ListOtor()}
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
  contentSignature: {
    flexDirection:'row', 
    width:'95%', 
    alignItems:'stretch', 
    marginHorizontal:RFValue(10), 
    height:RFValue(250)
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default connect(mapStateToProps,null)(HistoryOtorPerjadin);