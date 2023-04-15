import { View, Text } from "react-native";
import React from "react";
import { Styles } from "../../../../styles/styles";

const LabelInput = ({ label, lg, value }) => {
  const isLg = lg ? Styles.fontSize24 : Styles.fontSize16;
  return (
    <View style={[Styles.marginTop8]}>
      <Text
        style={[
          Styles.marginBottom4,
          Styles.fontSize12,
          Styles.fontBold,
          { color: "darkgray" },
        ]}
      >
        {label}
      </Text>
      <Text style={[isLg, Styles.marginTop2, { color: "#5a5a5a" }]}>
        {value}
      </Text>
    </View>
  );
};

export default LabelInput;
