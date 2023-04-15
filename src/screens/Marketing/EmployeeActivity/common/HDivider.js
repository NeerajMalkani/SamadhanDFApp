import { View, Text } from "react-native";
import React from "react";
import { Styles } from "../../../../styles/styles";

const HDivider = () => {
  return (
    <View
      style={[
        Styles.width100per,
        Styles.marginVertical12,
        { backgroundColor: "#d3d3d3", height: 2 },
      ]}
    ></View>
  );
};

export default HDivider;
