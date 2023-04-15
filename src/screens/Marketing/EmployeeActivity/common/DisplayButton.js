import { View, Text } from "react-native";
import React from "react";
import { theme } from "../../../../theme/apptheme";
import { Button } from "react-native-paper";
import { Styles } from "../../../../styles/styles";

const DisplayButton = ({
  text,
  width,
  style,
  isGreen,
  onPress = console.log,
}) => {
  return (
    <Button
      mode="outlined"
      onPress={onPress}
      labelStyle={{
        fontSize: 12,
        color: isGreen ? theme.colors.greenBorder : theme.colors.error,
      }}
      style={[
        {
          width,
          borderWidth: 2,
          borderRadius: 6,
          borderColor: isGreen ? theme.colors.greenBorder : theme.colors.error,
          marginRight: 10,
          ...style,
        },
      ]}
    >
      {text}
    </Button>
  );
};

export default DisplayButton;
