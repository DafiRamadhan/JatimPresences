import React, {Component} from 'react';
import {FlatList,ActivityIndicator,View,Text,TouchableOpacity} from 'react-native';
import ListItemOTS  from '../../../components/molecules/ListItemOTS'
import { withNavigation } from 'react-navigation';
import {connect} from 'react-redux';

import API from '../../../config/services'
import FormatMoney from '../../../utils/FormatMoney'

class ListAbsensi extends Component {
    constructor (props) {
        super(props)
        this.state={
          absensi : [],
          isLoading: true,
          page:1,
        };
      }

    componentDidMount(){
        this._getData(this.state.page);
    }

    _pagePrev= () => {
      let pageBef= this.state.page 
      if (pageBef ===1){
          alert('Halaman Pertama!');
      }else{
          this.setState({
              page: pageBef - 1,
              isLoading: true,
          })
          this._getData(pageBef - 1);
      }
    }

    _pageNext=() => {
        let pageBef = this.state.page 
        this.setState({
            page: pageBef + 1,
            isLoading: true,
        })
         this._getData(pageBef + 1);
    }

    footerThis=()=> {
      return(
        <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:10, marginTop:5}}>
              <TouchableOpacity style={{ flex:1,borderRadius:10, backgroundColor:'#9D1D20', width:100, height:30, justifyContent:'center', alignItems:'center'}}
                      onPress={this._pagePrev}>
                      <Text style={{fontWeight:'bold', fontSize:13, color:'white' ,textAlign:'center'}}>{"<<"}</Text>
              </TouchableOpacity>
              <View style={{justifyContent:'center',alignItems:'center', marginHorizontal:20}}>
                <Text style={{fontWeight:'bold', fontSize:13, color:'#9D1D20' ,textAlign:'center', alignItems:'center' }}>Hal : {this.state.page}</Text>
              </View>
              <TouchableOpacity style={{flex:1,borderRadius:10, backgroundColor:'#9D1D20', width:100, height:30, justifyContent:'center', alignItems:'center' }}
                      onPress={this._pageNext}>
                      <Text style={{fontWeight:'bold', fontSize:13, color:'white' ,textAlign:'center', alignItems:'center' }}>{">>"}</Text>
              </TouchableOpacity>
        </View>
      )
    }

    headerThis = () => {
      return (
        <View>
            <View style={{alignItems:'center', marginVertical:5}}>
              <Text style={{fontSize:14, fontWeight:'bold', textAlign:'center', color:'#9D1D20'}}>History Absensi</Text>
            </View>

            <View style={{backgroundColor:'#F7F7F7',marginHorizontal:8, flexDirection:'row',marginVertical:3}}>  
              <Text style={{fontSize:12, fontWeight:'bold', width:65}}>Tanggal</Text>
              <Text style={{fontSize:12, fontWeight:'bold', width:125}}>Jam Masuk</Text>
              <Text style={{fontSize:12, fontWeight:'bold', width:64}}>Jam Istirahat</Text>
              <Text style={{fontSize:12, fontWeight:'bold', width:65}}>Jam Pulang </Text>
            </View>
        </View>
      )
    }
    
    _getData = (hal) => {
      //console.log(hal)
      let bodyFormData = new FormData();
      bodyFormData.append('kd_cab', this.props.kdCab)
      bodyFormData.append('userLogin', this.props.nip)
      bodyFormData.append('hal', hal)

      if (this.props.lvlUser == '1' && this.props.lvlGrp == '2'){
        API.ListOtsAdm(bodyFormData).then((ResponseJson) => {
          if (ResponseJson.ResponseCode == "04"){
            // alert("Tidak ada data !");
            this.setState({
              debitur: [],
              isLoading: false,
            })
          }else{
              if (ResponseJson.data && ResponseJson.data.length > 0){
                this.setState({
                  debitur: ResponseJson.data,
                  isLoading: false,
                })
              }else {
                // alert("Tidak ada data !");
                this.setState({
                  debitur: [],
                  isLoading: false,
                })
              } 
          }
        },(err) => { alert('error : ', err) })
      }else if (this.props.lvlUser == '1' && this.props.lvlGrp == '1'){
        API.ListOtsAnalis(bodyFormData).then((ResponseJson) => {
          if (ResponseJson.ResponseCode == "04"){
            // alert("Tidak ada data !");
            this.setState({
              debitur: [],
              isLoading: false,
            })
          }else{
              if (ResponseJson.data && ResponseJson.data.length > 0){
                this.setState({
                  debitur: ResponseJson.data,
                  isLoading: false,
                })
              }else {
                // alert("Tidak ada data !");
                this.setState({
                  debitur: [],
                  isLoading: false,
                })
              } 
          }
        },(err) => { alert('error : ', err) })
      }
    }

    render(){
      if(this.state.isLoading){
          return(
            <View style={{flex:1, backgroundColor:'#F7F7F7'}}>
               {this.headerThis()} 
               <View style={{flex: 1, padding: 20}}>
                <ActivityIndicator size="large" color="#0c9"/>
              </View>
              {this.footerThis()}
            </View>
          )
        }

        if (!this.state.isLoading && this.state.debitur && this.state.debitur.length == 0){
          return(
            <View style={{flex:1, backgroundColor:'#F7F7F7'}}>
              {this.headerThis()}
              <View style={{flex: 1, padding: 20, justifyContent:'center'}}>
                <Text style={{textAlign:'center'}}>Tidak ada data !</Text>
              </View>
              {this.footerThis()}
            </View>
          )
        }
        return(
            <View style={{flex:1, backgroundColor:'#F7F7F7'}}>
                    {this.headerThis()}
                    <FlatList
                        data={this.state.debitur}
                        keyExtractor={item => item.NO_AJU}
                        renderItem={({ item }) => (<ListItemOTS
                                                    {...item}
                                                    noAju={item.NO_AJU}
                                                    nama={item.NAMA}
                                                    nama_usaha={item.NAMA_USAHA}
                                                    skim={item.SKIM}
                                                    plafon={FormatMoney(Number(item.PLAF_AJU).toFixed())}
                                                    jw={Number(item.JW).toFixed()}
                                                    jnsUsaha={item.JNS_USAHA}
                                                    onLeftPress={() => this.props.lvlUser == '1' && this.props.lvlGrp == '2' ? this.props.navigation.navigate('InputOTSAgunan', {
                                                      noAju : item.NO_AJU,
                                                      nama : item.NAMA,
                                                      nama_usaha : item.NAMA_USAHA,
                                                      alamat : item.ALAMAT,
                                                      skim : item.SKIM,
                                                      plafon : item.PLAF_AJU,
                                                      jw : item.JW,
                                                      jnsUsaha : item.JNS_USAHA
                                                    }) : this.props.navigation.navigate('InputOTSUsaha', {
                                                      noAju : item.NO_AJU,
                                                      nama : item.NAMA,
                                                      nama_usaha : item.NAMA_USAHA,
                                                      alamat : item.ALAMAT,
                                                      skim : item.SKIM,
                                                      plafon : item.PLAF_AJU,
                                                      jw : item.JW,
                                                      jnsUsaha : item.JNS_USAHA
                                                    })} 
                                                    onRightPress={() => alert('pressed right!')}
                                                  />
                        )}
                      />
                  {this.footerThis()}
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
      kdCab:state.kdCab,
      kdWil:state.kdWil,
      nip : state.nip,
      lvlUser: state.lvlUser,
      lvlGrp : state.lvlGrp,
  }
};

export default withNavigation(connect(mapStateToProps,null) (ListAbsensi));


