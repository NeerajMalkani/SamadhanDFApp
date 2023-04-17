import { View } from "react-native";
import { Menu, TextInput } from "react-native-paper";
import React, { useState } from "react";

const Autocomplete = ({
  value: origValue,
  label,
  data,
  containerStyle,
  onChange,
  menuStyle = {},
  right = () => {},
  left = () => {},
  ref,
  error,
  onSubmitEditing,
  keyboardType,
  key,
}) => {
  const [value, setValue] = useState(origValue);
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <View style={[containerStyle]}>
      <TextInput
        ref={ref}
        mode="outlined"
        keyboardType={keyboardType ? keyboardType : ""}
        onFocus={() => {
          if (value.length === 0) {
            setMenuVisible(true);
          }
        }}
        label={label}
        right={right}
        left={left}
        dense
        returnKeyType="next"
        style={{ backgroundColor: "white" }}
        onChangeText={(text) => {
          onChange(text);
          // if (text.length === 0) {
          //   setFilteredData([]);
          // } else {
          //   setFilteredData(data);
          // }
          setMenuVisible(true);
          setValue(text);
        }}
        value={value}
        error={error}
        onSubmitEditing={onSubmitEditing}
      />
      {menuVisible && data && (
        <View
          style={{
            flex: 1,
            backgroundColor: "white",
            borderWidth: 0.2,
            flexDirection: "column",
            borderColor: "green",
          }}
        >
          {value.length > 0 &&
            data.map((datum, i) => (
              <Menu.Item
                key={i}
                style={[{ width: "100%" }, menuStyle]}
                onPress={() => {
                  setValue(() =>
                    datum?.mobile_no_Result
                      ? datum.mobile_no_Result
                      : datum.aadharno_Result
                  );
                  onChange(() =>
                    datum?.mobile_no_Result
                      ? datum.mobile_no_Result
                      : datum.aadharno_Result
                  );
                  setMenuVisible(false);
                }}
                title={
                  datum.mobile_no_Result
                    ? datum.mobile_no_Result
                    : datum.aadharno_Result
                }
              />
            ))}
        </View>
      )}
    </View>
  );
};

export default Autocomplete;
