import { View, TouchableNativeFeedback } from "react-native";
import { Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Styles } from "../styles/styles";
import { theme } from "../theme/apptheme";

export const ListHeader = ({ headerText }) => {
  return (
    <View style={[Styles.flexRow, Styles.accentBgColor, Styles.padding16]}>
      <Text style={[Styles.textCenter, { width: 64 }]}>Sr. No.</Text>
      <Text style={[Styles.flexGrow, { paddingStart: 24 }]}>{headerText}</Text>
      <Text style={{ paddingEnd: 24 }}>Actions</Text>
    </View>
  );
};
export const RenderItems = (data) => {
  return (
    <View style={[Styles.flexRow, Styles.height64, Styles.backgroundColor, Styles.borderBottom1, Styles.flexAlignCenter, Styles.paddingStart16]}>
      <Text style={[Styles.textCenter, { width: 64 }]}>{data.item.key}</Text>
      <Text style={[Styles.textCenter, { paddingStart: 24 }]}>{data.item.activityRoleName}</Text>
    </View>
  );
};
export const CreateActionButtons = (icon, color, callback) => {
  return (
    <TouchableNativeFeedback onPress={callback}>
      <View style={[Styles.width72, Styles.height72, Styles.flexJustifyCenter, Styles.flexAlignCenter, { backgroundColor: color }]}>
        <Icon name={icon} color={theme.colors.textLight} size={28} />
      </View>
    </TouchableNativeFeedback>
  );
};
export const RenderHiddenItems = (data, rowMap, callbacks) => {
  return (
    <View style={[Styles.height64, Styles.flexRowReverse, Styles.flexAlignSelfEnd, Styles.flexAlignCenter, { width: 60 }]} >
      {CreateActionButtons("edit", theme.multicolors.yellow, () => callbacks[0](data, rowMap))}
    </View>
  );
};

export const RenderHiddenMultipleItems = (data, rowMap, callbacks) => {
  return (
    <View style={[Styles.height80, Styles.flexRowReverse, Styles.flexAlignSelfEnd, Styles.flexAlignCenter, { width: 60 }]}>
      {CreateActionButtons("edit", theme.multicolors.yellow, () => callbacks[0](data, rowMap, "edit"))}
      {CreateActionButtons("send", theme.multicolors.green, () => callbacks[0](data, rowMap, "otp"))}
    </View>
    
  );
};
