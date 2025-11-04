import React from 'react';
import {Text, View, StyleSheet, ActivityIndicator} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import RNPickerSelect from 'react-native-picker-select';

const ComboBox = (props) =>{
    const VALID = props.ISVALID == undefined ? true : props.ISVALID
    const WIDTH = props.WIDTH == undefined ? '95%' : props.WIDTH
    return (
        <View style={{alignSelf:'center', width:WIDTH,marginTop:RFValue(10)}}>
            <View style={{flexDirection:'row'}}>
                <Text style={{paddingLeft:5, fontSize:RFValue(12), color:'#9D1D20'}}>{props.JUDUL}</Text>
                {!VALID ? 
                <Text style={{paddingLeft:5, fontSize:RFValue(12), color:'red'}}> {" --> "}{props.DESKRIPSI}</Text>
                :null}
            </View>
            
            {props.LOADING ?
            <View style={{paddingLeft:5,width:'100%', height:RFValue(40), borderColor:'#9D1D20', borderWidth:0.5, borderRadius:5, justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size="small" color="#0c9" />
            </View>
            :
            <View style={{paddingLeft:5,width:'100%', height:RFValue(40), borderColor: VALID ? 'grey':'red', borderWidth: VALID ? 0.5 : 1, borderRadius:5, fontSize:RFValue(12), justifyContent:'center'}}>
                 <RNPickerSelect
                    useNativeAndroidPickerStyle={false}
                    placeholder={{}}
                    style={pickerStyle}
                    value={props.VALUE}
                    onValueChange={props.SELECTEDVALUE}
                    items={props.ITEMS}
                    />
            </View>
            }
        </View>
    )
}

const pickerStyle = {
	inputIOS: {
        color: 'black',
        fontSize : RFValue(14),
	    paddingLeft: 10,
        alignItems:'center',

	},
	inputAndroid: {
        fontSize : RFValue(12),
        color: 'black',
        textAlign:'left',
        height:'100%',
        width:'100%'
  },
	placeholderColor: 'black',
    underline: { borderTopWidth: 0 },
	icon: {
		position: 'absolute',
		backgroundColor: 'transparent',
		borderTopWidth: 5,
		borderTopColor: '#00000099',
		borderRightWidth: 5,
		borderRightColor: 'transparent',
		borderLeftWidth: 5,
		borderLeftColor: 'transparent',
		width: 0,
		height: 0,
		top: 10,
		right: 15,
	},
};


export default ComboBox;