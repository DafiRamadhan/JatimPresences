import React, { Component, } from 'react';
import {
    Text, 
    View,
    TouchableOpacity,
    StatusBar,
    Platform,
    ActivityIndicator,
    } from 'react-native';
import { GiftedChat,Bubble } from 'react-native-gifted-chat'; // 0.3.0
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';

import API from '../../../config/services';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import firestore from '@react-native-firebase/firestore';

class Chatting extends Component {
    constructor (props) {
        super(props)
        this.state={
         isLoading: false,
         message : [],
         idLawan : '',
         namaLawan : '',
         kdBiro : '',

        };
      }

  get user() {
    return {
      _id: this.props.nip,
      name: this.props.userLogin,
      avatar: 'https://cascara.bankjatim.co.id/jp/img/' + this.props.nip + '.jpg',
    };
  }

  onSend = async(messages)  => {
    try{
        await firestore().collection("GroupChat").doc(this.state.idLawan).collection('MSG').add(
        {
              _id: new Date().getTime(),
              text : messages[0].text,
              createdAt: new Date().getTime(),
              user: {
                _id: this.props.nip,
                name: this.props.userLogin,
                avatar: 'https://cascara.bankjatim.co.id/jp/img/' + this.props.nip + '.jpg',
              },
        });
    
        await firestore().collection("GroupChat").doc(this.state.idLawan).set({
          nama : this.state.namaLawan,
          kdCabCore : this.state.idLawan,
          userCreated : this.props.nip,
          latestMessage : {
              lastDateMsg : new Date().getTime(),
              lastUserChat : this.props.nip,
              latestChat : messages[0].text,
          },
        })
    }catch(e){
      // console.log(e)
    }
  }

  getColor(username){
    let sumChars = 0;
    for(let i = 0;i < username.length;i++){
      sumChars += username.charCodeAt(i);
    }

    const colors = [
      '#e67e22', // carrot
      '#2ecc71', // emerald
      '#3498db', // peter river
      '#8e44ad', // wisteria
      '#e74c3c', // alizarin
      '#1abc9c', // turquoise
      '#2c3e50', // midnight blue
    ];
    return colors[sumChars % colors.length];
  }


  componentDidMount = async() => {
    try{
        const { params } = this.props.navigation.state;
        this.setState({
          namaLawan : params.namaLawan,
          idLawan : params.idLawan,
          isLoading : true,
        })

        const group = firestore().collection('GroupChat').doc(this.props.kdBiroSdm);
            const doc = await group.get();
            if (!doc.exists) {
              // console.log('List Messages :' + this.props.kdBiroSdm + ' Tidak ada');
              this.setState({ 
                isLoading : false,
              })

            } else {
                await firestore()
                    .collection('GroupChat')
                    .doc(this.state.idLawan)
                    .collection('MSG')
                    .orderBy('createdAt', 'desc')
                    .onSnapshot(querySnapshot => {
                        //console.log(querySnapshot)
                        const threads = querySnapshot.docs.map(documentSnapshot => {
                            return {
                                _id :  documentSnapshot._data._id,
                                text : documentSnapshot._data.text ,
                                createdAt : documentSnapshot._data.createdAt ,
                                user : {
                                          _id : documentSnapshot._data.user._id,
                                          name : documentSnapshot._data.user.name, 
                                          avatar: documentSnapshot._data.user.avatar,
                                        },
                            }
                        })
                        this.setState({ 
                          message : threads,
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

  render() {
    const { goBack } = this.props.navigation;
    if(this.state.isLoading){
      return(
        <View style={{flex:1,backgroundColor:'white'}}>
            <View style={{backgroundColor:'#9D1D20', }}>
                <View style={{height:50, marginHorizontal:17, flexDirection:'row', marginTop:30}}>
                        <View style={{flexDirection:'row',marginTop:10,marginBottom:10}}>
                            <TouchableOpacity onPress={() => goBack()}>
                                <Icon name='chevron-double-left' size={30} color="#F7F7F7" style={{color:'white'}} />
                            </TouchableOpacity>
                            <Text style={{fontSize:18,marginLeft:4,marginTop:3, color:'#F7F7F7'}}>({this.state.idLawan}) {this.state.namaLawan}</Text>
                        </View>
                    </View>
            </View>
        <View style={{flex:1, backgroundColor:'#F7F7F7'}}>
           <View style={{flex: 1, padding: 20}}>
            <ActivityIndicator size="large" color="#0c9"/>
          </View>
        </View>
      </View>
      )
    }
    return (
        <View style={{flex:1,backgroundColor:'white'}}>
          
            <View style={{backgroundColor:'#9D1D20', }}>
                <View style={{height:50, marginHorizontal:17, flexDirection:'row', marginTop:30}}>
                        <View style={{flexDirection:'row',marginTop:10,marginBottom:10}}>
                            <TouchableOpacity onPress={() => goBack()}>
                                <Icon name='chevron-double-left' size={30} color="#F7F7F7" style={{color:'white'}} />
                            </TouchableOpacity>
                            <Text style={{fontSize:18,marginLeft:4,marginTop:3, color:'#F7F7F7'}}>({this.state.idLawan}) {this.state.namaLawan}</Text>
                        </View>
                    </View>
            </View>
            <GiftedChat
                renderUsernameOnMessage={true}
                messages={this.state.message}
                user={this.user}
                onSend={(messages) => this.onSend(messages)}
                renderBubble={props => {

                 // console.log(JSON.stringify(props.currentMessage.user))
                 let username = JSON.stringify(props.currentMessage.user)
                 let color = this.getColor(username)

                  return (
                    <Bubble
                      {...props}
                      textStyle={{
                        right: {
                          color: 'white',
                        },
                        left: {
                          color: color,
                        },
                      }}
                      wrapperStyle={{
                        left: {
                          backgroundColor: 'white',
                          borderColor:'#e4888b',
                          borderWidth : 2
                        },
                      }}
                    />
                  );
                }}
            />
           
        </View>

        
    
    );
  }

  componentDidMount() {
    // firebaseSDK.refOn(message =>
    //   this.setState(previousState => ({
    //     messages: GiftedChat.append(previousState.messages, message)
    //   }))
    // );
  }
  componentWillUnmount() {
    //firebaseSDK.refOff();
  }
}

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
        idOneSignal : state.idOneSignal,
        latKantor : state.latKantor,
        longKantor : state.longKantor,
        timer : state.timer,
        kodeshift : state.kodeshift,
        ilang :  state.ilang,
        kodeshift : state.kodeshift,
        kdBiroSdm : state.kdBiroSdm,
        kdCabSdm : state.kdCabSdm,
        kdCabCore : state.kdCabCore,
    }
  };
  
  export default withNavigation(connect(mapStateToProps,null) (Chatting));