import React, {useState, useEffect, useRef} from 'react';
import {Image, View, StyleSheet, Text, ActivityIndicator} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
// const images = [‍
//   require('./img/logo-angular.png'),‍
//   require('./img/logo-ember.png'),‍
//   require('./img/logo-node.png'),‍
//   require('./img/logo-python.png'),‍
//   require('./img/logo-react-native.png'),‍
//   require('./img/logo-react.png'),‍
//   require('./img/logo-ruby-on-rails.png'),‍
//   require('./img/logo-vue.png'),
// ‍]
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const FSLTechFilter = props => {
//   const [currentImg, setCurrentImg] = useState(0);
  
//   const alive = useRef(true);  useEffect(() => {
//     for (let index = 0; index < 50; index++) {
//       setTimeout(() => {
//         alive.current && setCurrentImg(randomInteger(0, images.length - 1));
//       }, 100 * index);
//     }
//     return () => {
//       alive.current = false;
//     };
//   }, []);
  return (
    <View style={styles.filter(props)}>
      <View style={{width:'100%', height:'10%', backgroundColor : props.result ? 'Green' : 'Yellow'}}>
        {props.isLoadingFace ? 
          <View style={{flex: 1, padding: 20}}>
            <ActivityIndicator size="large" color="#0c9"/>
          </View>
          :
          <Text style={{fontWeight:'bold', textAlign:'center', color:'white'}}>{props.result ? 'Hi, ' + props.userName : 'Face not recognized'}</Text>
        }
      </View>
    </View>
  );
};

export default FSLTechFilter;
const styles = StyleSheet.create({
  filter: function({width, height, x, y, yawAngle, rollAngle, result}) {
  //  console.log(result)
   
   let col
   if (result==0){
     col='yellow'
   }else{
    col='red'
   }
   if (result){
     col='green'
   }
  //  if(result == false){
  //    col='red'
  //  }
   
    return {
      position: 'absolute',
      top: y , /* place the filter over the head */
      left: x ,
      width : width,
      height : height,
      borderWidth:6,
      borderColor : col,
      transform: [{rotate: `${rollAngle}deg`}] 
    };

  },
})