import React, { Component, } from 'react';
import {
    Text, 
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    RefreshControl,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    Alert
    } from 'react-native';
import Modal from 'react-native-modal';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import Moment from 'moment';
import API from '../../../config/services';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay';
import firestore from '@react-native-firebase/firestore';

const { height , width } = Dimensions.get("window");

class RoomChat extends Component{
    
    constructor(props){
        super(props)
        this.state={
            listGroup : [],
            isLoading : false,
            modAddChat : false,
        }

    }

    componentDidMount = async() => {
        try{
            this.setState({isLoading : true});
            const { params } = this.props.navigation.state;
            const group = firestore().collection('GroupChat').doc(this.props.kdBiroSdm);
            const doc = await group.get();
            if (!doc.exists) {
            //   console.log('Biro :' + this.props.kdBiroSdm + ' Tidak ada');
    
              await firestore().collection("GroupChat").doc(this.props.kdBiroSdm).set({
                nama : this.props.namaCabang,
                kdCabCore : this.props.kdCabCore,
                userCreated : this.props.nip,
                latestMessage : {
                    lastDateMsg : new Date().getTime(),
                    lastUserChat : '',
                    latestChat : '',
                },
              })
    
            //   console.log('Sukses tambah data:', this.props.kdBiroSdm);
    
              this.setState({isLoading : false});
            } 
    
            if (this.props.kdBiroSdm == 'A22'){
                await firestore()
                .collection('GroupChat')
                .onSnapshot(querySnapshot => {
                        const threads = querySnapshot.docs.map(documentSnapshot => {
                            return {
                                idGroup : documentSnapshot.id ,
                                nama : documentSnapshot._data.nama ,
                                kdCabCore : documentSnapshot._data.kdCabCore ,
                                userCreated : documentSnapshot._data.userCreated ,
                                latestMessage : {
                                    lastDateMsg : documentSnapshot._data.latestMessage.lastDateMsg,
                                    lastUserChat : documentSnapshot._data.latestMessage.lastUserChat,
                                    latestChat : documentSnapshot._data.latestMessage.latestChat,
                                },
                            }
                        })
                        this.setState({ 
                            listGroup : threads,
                            isLoading : false,
                        })
                        
                    })
                
            }else{
                await firestore()
                .collection('GroupChat')
                .doc(this.props.kdBiroSdm)
                .onSnapshot(querySnapshot => {
                        // console.log(querySnapshot)
                        const threads = [{
                                idGroup : querySnapshot.id ,
                                nama : querySnapshot._data.nama ,
                                kdCabCore : querySnapshot._data.kdCabCore ,
                                userCreated : querySnapshot._data.userCreated ,
                                latestMessage : {
                                    lastDateMsg : querySnapshot._data.latestMessage.lastDateMsg,
                                    lastUserChat : querySnapshot._data.latestMessage.lastUserChat,
                                    latestChat : querySnapshot._data.latestMessage.latestChat,
                                },
                            }]
                        this.setState({ 
                            listGroup : threads,
                            isLoading : false,
                        })
                        
                    })
            }
        }catch(e){
            // console.log('Error : ',e)
        }finally{
            this.setState({ 
                isLoading : false,
            })
        }
    }

    showListGroup(){
        if(this.state.isLoading){
            return(
              <View style={{flex:1, backgroundColor:'#F7F7F7'}}>
                 <View style={{flex: 1, padding: 20}}>
                  <ActivityIndicator size="large" color="#0c9"/>
                </View>
              </View>
            )
          }
  
          if (!this.state.isLoading && this.state.absensi && this.state.absensi.length == 0){
            return(
              <View style={{flex:1, backgroundColor:'#F7F7F7'}}>
                <View style={{flex: 1, padding: 20, justifyContent:'center'}}>
                  <Text style={{textAlign:'center'}}>Tidak ada data !</Text>
                </View>
              </View>
            )
          }
          return(
              <View style={{flex:1, backgroundColor:'#F7F7F7'}}>
                  <Modal
                        animationType="slide"
                        coverScreen
                        hasBackdrop
                        visible={this.state.modAddChat}
                        style={{marginVertical: 50, backgroundColor:'#F7F7F7',borderWidth:2,borderRadius:6,}}
                        propagateSwipe>
                        <View style={{marginBottom:10, alignItems:'center',justifyContent:'center', height:50, backgroundColor:'#9D1D20', borderTopLeftRadius:5, borderTopRightRadius:5, flexDirection:'row'}}>
                            <Icon name="comment-text-multiple-outline" size={20} color="#F7F7F7" style={{marginLeft:10}}/>
                            <Text style={{fontSize:14, justifyContent:'center', color:'#F7F7F7',fontWeight:'bold', textAlign:'center'}}> Create Chat </Text>
                        </View>
                        
                        <ScrollView style={{flex:1, height:400}}>
                            {/* {this.listQuestion()} */}
                        </ScrollView>
                    
                        <TouchableOpacity style={{height:45,width:'100%', backgroundColor: "green", justifyContent:'center',borderRadius:5, flexDirection:'row', alignItems:'center', justifyContent:'center'}} onPress={() => this.setState({modAddChat : !this.state.modAddChat})}>
                            <Text style={{textAlign:'center',color:'white', fontWeight:'bold'}}>SIMPAN</Text>
                            {this.state.isLoadingQuestion ?
                            <View style={{marginLeft :20}}>
                                <ActivityIndicator size="small" color="white"/>
                            </View> : null }
                        </TouchableOpacity>
                    
                    </Modal>
                      <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh} />}>
                        <FlatList
                            data={this.state.listGroup}
                            keyExtractor={item => item.idGroup}
                            renderItem={({ item,index }) => (
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Chatting', {
                                    idLawan : item.idGroup,
                                    namaLawan : item.nama, 
                                  })} style={{width: '100%',height: 50, backgroundColor:'white', alignItems:'center', justifyContent:'center',  flexDirection:'row'}}>
                                    <View style={{width: '15%', justifyContent:'center', alignItems:'center'}}>
                                    <Image
                                        style={{resizeMode:'stretch',borderRadius:120, width:40, height:40, backgroundColor:'white'}}
                                        source={require('../../../assets/icons/iconfinder.png')}
                                    />
                                    </View>
                                    <View style={{width: '70%', height:50, marginLeft:0, justifyContent:'center', borderBottomWidth:0.5, borderBottomColor:'grey'}}>
                                        <Text style={{color:'black', fontSize:13, fontWeight:'bold'}}>{item.nama}</Text>
                                        <Text style={{color:'black', fontSize:11,}}>{item.latestMessage.lastUserChat} : {item.latestMessage.latestChat.length > 50 ? item.latestMessage.latestChat.substring(0,40) + '...' : item.latestMessage.latestChat}</Text>
                                    </View>
                                    <View style={{width: '10%', height:50, marginLeft:0, justifyContent:'center', borderBottomWidth:0.5, borderBottomColor:'grey'}}>
                                        <Text style={{color:'black', fontSize:12,}}>{ Moment(new Date()).format('YYYYMMDD') ==  Moment(item.latestMessage.lastDateMsg).format('YYYYMMDD') ? Moment(item.latestMessage.lastDateMsg).format('HH:mm') : Moment(item.latestMessage.lastDateMsg).format('DD MMM')}</Text>
                                    </View>
                                                                                
                                </TouchableOpacity>
                            )}
                        />
                    </ScrollView>
                    <OrientationLoadingOverlay
                      visible={this.state.isLoading}
                      color="white"
                      indicatorSize="large"
                      messageFontSize={24}
                      message=""
                      />

                        <TouchableOpacity style={{...styles.button}} onPress={() => Alert.alert('','On Progress...')}>
                          <View style={{flex:1,alignItems:'center', justifyContent:'center'}}>
                            <View style={{alignItems:'center', justifyContent:'center'}}>
                              <Icon name="plus" size={22} color='white' style={{color:'white'}} />
                            </View>
                          </View>
                        </TouchableOpacity> 
              </View> 
          )
    }

    render(){
        const { goBack } = this.props.navigation;
        return (
            <View style={{flex:1,}}>
            <View style={{backgroundColor:'#9D1D20', }}>
                <View style={{height:50, marginHorizontal:17, flexDirection:'row', marginTop:30}}>
                        <View style={{flexDirection:'row',marginTop:10,marginBottom:10}}>
                            <TouchableOpacity onPress={() => goBack()}>
                                <Icon name='chevron-double-left' size={30} color="#F7F7F7" style={{color:'white'}} />
                            </TouchableOpacity>
                            <Text style={{fontSize:18,marginLeft:4,marginTop:3, color:'#F7F7F7', textAlign:'center'}}>Room Chatting (Beta Testing)</Text>
                        </View>
                    </View>
            </View>
            {this.showListGroup()}
        </View>
        )
    }
}

const styles = StyleSheet.create({
    iconShadow: {
              width:100, height:100,
              borderRadius:20, marginBottom:0, marginHorizontal:0,
              shadowColor: 'black',
              shadowOffset: {
                width: 0,
                height: 0,
              },
              shadowOpacity: 1,
              shadowRadius: 20,
              elevation: 10,
              justifyContent:'center',
              alignItems:'center'
            },
    imageIcon : {
              height:92, width:92, borderRadius:20
            },
    IconBadge: {
              position:'absolute',
              top:1,
              right:1,
              width:20,
              height:20,
              borderRadius:15,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FF0000'
            },
    button: {
              width: 65,
              height: 65,
              borderRadius: 36,
              backgroundColor: "#9D1D20",
              position: "absolute",
              marginTop: height * 0.75,
              marginLeft: width * 0.80,
              shadowColor: "#9D1D20",
              shadowRadius: 5,
              shadowOffset: { height: 10 },
              shadowOpacity: 0.3,
              borderWidth: 3,
              borderColor: "#FFFFFF"
          },
          
  })

const mapStateToProps = (state) => {
    return {
        userLogin : state.userLogin,
        levelDesc : state.levelDesc,
        namaCabang : state.namaCabang,
        fotoUser : state.fotoUser,
        kdCab : state.kdCab,
        nip : state.nip,
        lvlUser : state.lvlUser,
        lvlGrp : state.lvlGrp,
        kodeshift : state.kodeshift,
        kdBiroSdm : state.kdBiroSdm,
        kdCabSdm : state.kdCabSdm,
        kdCabCore : state.kdCabCore,
    }
  };
  
  export default withNavigation(connect(mapStateToProps,null) (RoomChat));