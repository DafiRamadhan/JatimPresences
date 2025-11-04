import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { call, cond, eq, useCode } from "react-native-reanimated";
// import { MaterialIcons as Icon } from "@expo/vector-icons";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { mix } from "react-native-redash";
import CircularProgress from "../../../components/molecules/CircularProgress";
import StyleGuide from "../../../components/StyleGuide";

const SIZE = 150;
const STROKE_WIDTH = 10;
const ICON_SIZE = 96;
const CONTENT_SIZE = SIZE - STROKE_WIDTH * 2;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: STROKE_WIDTH,
    left: STROKE_WIDTH,
    right: STROKE_WIDTH,
    bottom: STROKE_WIDTH,
    backgroundColor: "white",
    borderRadius: CONTENT_SIZE / 2,
    zIndex: 100,
  },
  icon: {
    top: (CONTENT_SIZE - ICON_SIZE) / 2,
    left: (CONTENT_SIZE - ICON_SIZE) / 2,
  },
  activeIcon: {
    position: "absolute",
    top: (CONTENT_SIZE - ICON_SIZE) / 2,
    left: (CONTENT_SIZE - ICON_SIZE) / 2,
  },
});

interface ButtonProps {
  progress: Animated.Node<number>;
}

export default ({ progress }: ButtonProps) => {
  const [active, setActive] = useState(false);
  const height = mix(progress, 0, ICON_SIZE);
  useCode(
    () =>
      cond(
        eq(progress, 1),
        call([], () => setActive(true))
      ),
    [progress]
  );
  return (
    <View>
      <CircularProgress
        radius={SIZE / 2}
        bg="white"
        fg={'#9D1D20'}
        {...{ progress }}
      />
      <View style={styles.container}>
        {/* {active ? console.log('FINISH') : null} */}
        <Icon
          name={active ? "check-circle" : "alarm"}
          size={ICON_SIZE}
          color={
            active ? '#9D1D20' : StyleGuide.palette.background
          }
          style={styles.icon}
        />
        <Animated.View
          style={[styles.activeIcon, { height, opacity: active ? 0 : 1 }]}
        >
          <Icon
            name="alarm"
            size={ICON_SIZE}
            color='#9D1D20'
          />
         
        </Animated.View>
      </View>
    </View>
  );
};