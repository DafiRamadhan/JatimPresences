import React, {Component} from 'react';
import { Text, View, Image, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { withNavigation } from 'react-navigation';
import { RFValue } from 'react-native-responsive-fontsize';


const HeaderApp= (props) => {
  const BadgeCount = 0
    return (
        <View style={{height:RFValue(50), marginHorizontal:RFValue(17), flexDirection:'row'}}>
          <View style={{flex:1,marginTop:RFValue(10),marginBottom:RFValue(10), position:'relative'}}>
              <Image style={{height:RFValue(29), width:RFValue(29), borderRadius:50, position:'absolute', marginTop:RFValue(2)}} source={props.imgUser}></Image>
              <Text style={{fontSize:RFValue(14), marginLeft:RFValue(40), color:'#9D1D20'}}>{props.userLoginName}</Text>
              <Text style={{fontSize:RFValue(8), marginLeft:RFValue(40), color:'#9D1D20'}}>{props.userLoginLevel}</Text>
          </View>
          {/* <TouchableOpacity onPress={props.onPressChatting}>
            <View style={{width:RFValue(35), alignItems:'center',marginTop:RFValue(10)}}>
              <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
                <Icon name="comment-text-multiple-outline" size={RFValue(30)} color="grey" style={{color: 'grey'}} />
              </View>
            </View>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={props.onPressLogOut}>
            <View style={{width:RFValue(35), alignItems:'center',marginTop:RFValue(10)}}>
              <View style={{flexDirection: 'row',alignItems: 'center',justifyContent: 'center',}}>
                <Icon name="logout" size={RFValue(30)} color="grey" style={{color: 'grey'}} />
              </View>
            </View>
          </TouchableOpacity>
      </View>
    )
}


export default withNavigation(HeaderApp);