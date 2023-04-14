import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Styles } from "../../../styles/styles";
import { useIsFocused } from "@react-navigation/native";

const Preview = ({ navigation, route }) => {
  const [state, setState] = useState({});
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) setState(route.params.data);
  });
  console.log(state);
  return (
    <ScrollView style={[Styles.padding16, Styles.flex1]}>
      <View style={[Styles.flex1]}>
        <Text>Budget Preview</Text>
      </View>
    </ScrollView>
  );
};

export default Preview;
