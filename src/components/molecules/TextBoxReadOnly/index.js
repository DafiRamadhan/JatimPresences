import React from 'react'
import {Text, TextInput, View} from 'react-native'

const TextBoxReadOnly = props => {
    return(
        <View style={{marginLeft:20, marginTop:3, marginRight:20, marginBottom:2}}>
            <Text style={{fontSize:14, color:'#D0242A',fontWeight:'bold', marginBottom:0}}>{props.title}</Text>
            <TextInput 
                style={{borderWidth:0.2, borderRadius:5, paddingLeft:12, fontSize:14, paddingVertical:0, backgroundColor:'#ccc',color:'black'}} 
                placeholder={props.desc} 
                value={props.valueParent}
                editable={false}
                multiline={props.multiline}
                pointerEvents="none"
                numberOfLines={props.numberOfLines}/>
        </View>
    )
}

export default TextBoxReadOnly;