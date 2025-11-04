import React from 'react';
import {Text, ActivityIndicator,TouchableOpacity} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ButtonIcon = (props) => {
    const LOADING = props.LOADING
    return (
        <TouchableOpacity onPress={props.ONPRESS} 
            style={{borderRadius:5, height:RFValue(props.HEIGHT), width: '50%', backgroundColor: props.COLOR, alignItems:'center',justifyContent:'center', flexDirection:'row', marginHorizontal:RFValue(10),}}>
            {LOADING ? <ActivityIndicator size="small" color="#0c9" /> : <Icon name={props.ICON} size={RFValue(20)} color="#F7F7F7" style={{color:'white'}} />}
            <Text style={{fontWeight:'bold', fontSize:RFValue(13), color:'white' ,textAlign:'center' }}>{props.JUDUL}</Text>
        </TouchableOpacity>
    )
}

export default ButtonIcon;