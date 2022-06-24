import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons/faBarsStaggered";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons/faPowerOff";
import { theme } from "../theme/apptheme";
import { TouchableNativeFeedback, View } from "react-native";
import { Title } from "react-native-paper";
import { Styles } from "../styles/styles";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = ({ navigation, title }) => {
  _storeData = async () => {
    try {
      await AsyncStorage.setItem("isLogin", "false");
      navigation.dispatch(StackActions.replace("Login", "Home"));
    } catch (error) {
      console.log(error);
      // Error saving data
    }
  };
  return (
    <View style={[Styles.height64, Styles.paddingHorizontal16, Styles.flexAlignCenter, Styles.primaryBgColor, Styles.flexRow, { justifyContent: "space-between" }]}>
      <TouchableNativeFeedback>
        <View style={[Styles.width48, Styles.height48, Styles.flexJustifyCenter, Styles.flexAlignCenter]} onTouchStart={() => navigation.toggleDrawer()}>
          <FontAwesomeIcon icon={faBarsStaggered} size={24} color={theme.colors.textLight} />
        </View>
      </TouchableNativeFeedback>
      <Title style={[Styles.textColorWhite, Styles.flexGrow, Styles.paddingStart12]}>{title}</Title>
      <TouchableNativeFeedback>
        <View
          style={[Styles.width48, Styles.height48, Styles.flexJustifyCenter, Styles.flexAlignCenter]}
          onTouchStart={() => {
            _storeData();
          }}
        >
          <FontAwesomeIcon icon={faPowerOff} size={24} color={theme.colors.textLight} />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default Header;
