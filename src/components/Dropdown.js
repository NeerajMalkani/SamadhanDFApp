import { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Styles } from "../styles/styles";
import { theme } from "../theme/apptheme";

export default Dropdown = ({ data, label, onSelected, isError, selectedItem, reference, forceDisable }) => {
  const [isFocused, setFocused] = useState(false);
  return (
    <SelectDropdown
      data={data}
      ref={reference}
      defaultValueByIndex={data.indexOf(selectedItem)}
      dropdownOverlayColor="rgba(0,0,0,0.2)"
      defaultButtonText={label}
      disabled={forceDisable ? true : data.length === 0 ? true : false}
      buttonStyle={{
        width: "100%",
        height: 56,
        borderBottomWidth: 1,
        backgroundColor: "transparent",
        borderBottomColor: isError ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.textfield,
      }}
      renderCustomizedButtonChild={(selectedItem) => {
        return (
          <View style={[Styles.flex1, Styles.flexRow, Styles.flexAlignCenter, Styles.paddingHorizontal8, { justifyContent: "space-between" }]}>
            <Text style={selectedItem ? { color: isError ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.text, fontSize: 16 } : { color: isError ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.textSecondary, fontSize: 16 }}>{selectedItem ? selectedItem : label}</Text>
          </View>
        );
      }}
      dropdownStyle={{ marginTop: -38, elevation: 23 }}
      renderDropdownIcon={(isOpened) => {
        return <FontAwesome name={isOpened ? "caret-up" : "caret-down"} color={isError ? theme.colors.error : isFocused ? theme.colors.primary : theme.colors.textSecondary} size={18} />;
      }}
      onSelect={(selectedItem, index) => {
        onSelected(selectedItem, index);
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      rowStyle={{ borderBottomWidth: 1, borderBottomColor: theme.colors.textLightSecondary, backgroundColor: theme.colors.textLight }}
      selectedRowTextStyle={{ color: theme.colors.primary, textAlign: "left", fontSize: 16 }}
      rowTextStyle={{ color: theme.colors.text, textAlign: "left", fontSize: 16 }}
    />
  );
};
