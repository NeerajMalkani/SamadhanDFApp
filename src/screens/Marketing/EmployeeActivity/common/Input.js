import { View, Text } from "react-native";
import React from "react";
import { Checkbox, TextInput } from "react-native-paper";
import { Styles } from "../../../../styles/styles";
import Dropdown from "../../../../components/Dropdown";
import { theme } from "../../../../theme/apptheme";

const FormInput = ({
  onChangeText,
  label,
  value,
  style,
  type = "input",
  data = [],
  keyboardType,
  error,
}) => {
  return (
    <View style={[Styles.marginTop8]}>
      {type !== "check-box" && (
        <Text style={{ color: error ? theme.colors.error : "" }}>{label}</Text>
      )}
      {type === "input" ? (
        <TextInput
          onChangeText={onChangeText}
          style={{ ...style }}
          mode="outlined"
          value={value}
          error={error}
          keyboardType={keyboardType}
        />
      ) : type === "dropdown" ? (
        <Dropdown
          data={data}
          style={{ ...style }}
          isError={error}
          onSelected={onChangeText}
        />
      ) : type === "check-box" ? (
        <Checkbox.Item
          label={label}
          color={theme.colors.primary}
          position="leading"
          labelStyle={{ textAlign: "left", paddingLeft: 8 }}
          status={value === "1" ? "checked" : "unchecked"}
          onPress={() => {
            onChangeText();
          }}
        />
      ) : (
        <></>
      )}
    </View>
  );
};

export default FormInput;
