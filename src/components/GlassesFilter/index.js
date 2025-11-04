import React from 'react';
import {StyleSheet, View, Image} from 'react-native';

const GlassesFilter = ({
  rightEyePosition,
  leftEyePosition,
  yawAngle,
  rollAngle,
}) => {
  return (
    <View>
      <Image
        source={require('../../assets/images/glasses.png')}
        style={styles.glasses({
          rightEyePosition,
          leftEyePosition,
          yawAngle,
          rollAngle,
        })}
      />
    </View>
  );
};

export default GlassesFilter;

const styles = StyleSheet.create({
  glasses: ({rightEyePosition, leftEyePosition, yawAngle, rollAngle}) => {
    const width = Math.abs(leftEyePosition.x - rightEyePosition.x) + 180;
    return {
      position: 'absolute',
      top: rightEyePosition.y - 80,
      left: rightEyePosition.x - 80,
      resizeMode: 'contain',
      width,
      transform: [{rotateX: `${yawAngle}deg`}, {rotateY: `${-rollAngle}deg`}],
    };
  },
});
