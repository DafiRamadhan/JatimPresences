import React from 'react';
import {Text, View, TextInput, ActivityIndicator,Platform} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const TextBox = (props) =>{
    
    const VALID = props.ISVALID == undefined ? true : props.ISVALID
    const WIDTH = props.WIDTH == undefined ? '95%' : props.WIDTH
    const HEIGHT = props.HEIGHT == undefined ? 100 : props.HEIGHT

    return (
        <View style={{alignSelf:'center', width:WIDTH,marginTop:RFValue(10)}}>
            <View style={{flexDirection:'row'}}>
                <Text style={{paddingLeft:5, fontSize:RFValue(12), color:'#9D1D20'}}>{props.JUDUL}</Text>
                {!VALID ? 
                <Text style={{paddingLeft:5, fontSize:RFValue(12), color:'red'}}> {" --> "}{props.DESKRIPSI}</Text>
                :null}
                </View>
            {props.LOADING ?
            <View style={{paddingLeft:5,width:'100%', height:HEIGHT, borderColor:'#9D1D20', borderWidth:0.5, borderRadius:5, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size="small" color="#0c9" />
            </View>
            :
            <TextInput style={{paddingLeft:5,width:'100%',color:'black', height: HEIGHT, borderColor: VALID ? 'grey':'red', borderWidth: VALID ? 0.5 : 1, borderRadius:5, fontSize:RFValue(12), paddingVertical:0}}
                placeholderTextColor={'grey'}
                autoCapitalize={'words'}
                autoCompleteType={'name'}
                placeholder={props.PLACEHOLDER}
                placeholderTextColor={'grey'}
                value={props.VALUE}
                onChangeText={props.ONCHANGETEXT}
                keyboardType={props.KEYBOARDTYPE}
                maxLength={props.MAXLENGTH}
                editable={props.EDITABLE}
            />
            }
        </View>
    )
}

export default TextBox;