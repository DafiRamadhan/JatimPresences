import React, {Component} from 'react';
import {View, Dimensions, TouchableOpacity, StyleSheet, Text} from 'react-native';
import NavBarIcon from '../../../components/molecules/NavBarIcon'
import { withNavigation } from 'react-navigation';
import AsyncStorage  from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import { RFValue } from 'react-native-responsive-fontsize';

const { height , width } = Dimensions.get("window");

class NavBar extends Component {
  constructor (props) {
    super(props)
    this.state={
     badge : 3,
    };
  }

    LogOut = async () => {
      try{
        await AsyncStorage.setItem('uidSes', '');
        await AsyncStorage.setItem('pwdSes', '');
        this.props.navigation.navigate('LoginPage')
      }catch(e){
        console.log('Error SetToken : ', e)
      }
      
    }

    SetModalAbsen= () => {
      
      this.props.setModalAbsen(!this.props.modalAbsen)
    }
    render(){
        return (
                <View>
                    <View style={{height:RFValue(58), flexDirection:'row', marginTop:0, backgroundColor:'white'}}>
                      <NavBarIcon 
                        onPress={() => this.props.navigation.navigate('HistoryOtorPerjadin')} 
                        title="Otorisasi" 
                        iconImg="beaker-check-outline" 
                        active={(this.props.onView)=='Home'}
                        BADGE={this.props.badgeOtorPerjadin}
                      />
                      <View style={{alignItems :'center', alignSelf: 'center'}} >
                          <TouchableOpacity style={{...styles.button, alignItems :'center', alignSelf: 'center'}} onPress={() => this.SetModalAbsen()}>
                            <View style={{flex:1,alignItems:'center', justifyContent:'center'}}>
                              <View style={{alignItems:'center', justifyContent:'center'}}>
                                <Icon name="account-clock-outline" size={RFValue(26)} color='white' style={{color:'white'}} />
                              </View>
                            </View>
                          </TouchableOpacity> 
                      </View>
                      <NavBarIcon BADGE={0} onPress={() => this.props.navigation.navigate('HistoryAbsensi')} title="History Absensi" iconImg="format-columns" active={(this.props.onView)=='Graphs'}/>                
                    </View>
                </View>
                

        )
    }
}

const styles = StyleSheet.create({
  iconShadow: {
            width:RFValue(100), height:RFValue(100),
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
    
            alignItems: "center",
            justifyContent: "center",
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: "#9D1D20",
            position: "absolute",
            marginTop: -60,
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
      modalQuestion : state.modalQuestion,
      modalAbsen : state.modalAbsen,
      badgeOtorPerjadin : state.badgeOtorPerjadin,
  }
};


const mapDispatchToProps = (dispatch) => ({
  setModalQuestion: (val) => dispatch({
      type: 'SETMDLQSTN', 
      modalQuestion : val,
  }),
  setModalAbsen: (val) => dispatch({
      type: 'SETMDLABSEN', 
      modalAbsen : val,
  }),
})

  export default withNavigation(connect(mapStateToProps, mapDispatchToProps)(NavBar));
