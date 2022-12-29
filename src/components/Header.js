import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../theme/apptheme";
import { TouchableNativeFeedback, View } from "react-native";
import { Title } from "react-native-paper";
import { Styles } from "../styles/styles";
import { DrawerActions, StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = ({ navigation, title, isDrawer }) => {
  const LogoutUser = async () => {
    try {
      await AsyncStorage.setItem("user", "{}");
      navigation.dispatch(StackActions.replace("Login"));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={[Styles.height64, Styles.paddingHorizontal16, Styles.flexAlignCenter, Styles.primaryBgColor, Styles.flexRow, { justifyContent: "space-between" }]}>
      {(!isDrawer || (isDrawer && isDrawer != "false")) && (
        <TouchableNativeFeedback>
          <View
            style={[Styles.width48, Styles.height48, Styles.flexJustifyCenter, Styles.flexAlignCenter]}
            onTouchStart={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          >
            <Icon name="menu" size={24} color={theme.colors.textLight} />
          </View>
        </TouchableNativeFeedback>
      )}
      <Title style={[Styles.textColorWhite, Styles.flexGrow, Styles.paddingStart12]}>{title}</Title>
      <TouchableNativeFeedback>
        <View
          style={[Styles.width48, Styles.height48, Styles.flexJustifyCenter, Styles.flexAlignCenter]}
          onTouchStart={() => {
            LogoutUser();
          }}
        >
          <Icon name="logout" size={24} color={theme.colors.textLight} />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default Header;
