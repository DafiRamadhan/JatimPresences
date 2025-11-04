import React, {Component} from 'react';
import { Text, View, Image,TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import IconBadge from 'react-native-icon-badge';
Icon.loadFont();
// MaterialCommunityIcons

const NavBarIcon= (props) => {
    return (
      <View style={{flex:1,alignItems:'center', justifyContent:'center', marginBottom:RFValue(15)}}>
        <IconBadge
                                MainElement={
                                  <TouchableOpacity onPress={props.onPress}>
                                    <View style={{alignItems:'center', justifyContent:'center'}}>
                                      <Icon name={props.iconImg} size={RFValue(26)} color='#9D1D20' style={{marginTop:RFValue(5),color: props.active ? '#9D1D20' : 'grey'}} />
                                      <Text style={{fontSize:RFValue(10), color:'#9D1D20', marginTop:RFValue(4), color: props.active ? '#9D1D20' : 'grey'}}>{props.title}</Text>
                                    </View>
                                  </TouchableOpacity> 
                                }
                                BadgeElement={
                                  <Text style={{color:'#FFFFFF', fontSize:10, fontWeight:'bold'}}>{props.BADGE}</Text>
                                }
                                IconBadgeStyle={
                                  {width:15,
                                  height:15,
                                  backgroundColor: 'red', }
                                }
                                Hidden={props.BADGE==0}
                                />
      </View>
    )
}

export default NavBarIcon;