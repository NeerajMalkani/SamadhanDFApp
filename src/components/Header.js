import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons/faBarsStaggered";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { theme } from "../theme/apptheme";
import { TouchableNativeFeedback, View } from "react-native";
import { Title } from "react-native-paper";
import { Styles } from "../styles/styles";

const Header = ({ navigation, title }) => {
  return (
    <View style={[Styles.height64, Styles.paddingHorizontal16, Styles.flexAlignCenter, Styles.primaryBgColor, Styles.flexRow, { justifyContent: "space-between" }]}>
      <TouchableNativeFeedback>
        <View style={[Styles.width48, Styles.height48, Styles.flexJustifyCenter, Styles.flexAlignCenter]} onTouchStart={() => navigation.toggleDrawer()}>
          <FontAwesomeIcon icon={faBarsStaggered} size={24} color={theme.colors.textLight} />
        </View>
      </TouchableNativeFeedback>
      <Title style={[Styles.textColorWhite, Styles.flexGrow, Styles.paddingStart12]}>{title}</Title>
      <TouchableNativeFeedback>
        <View style={[Styles.width48, Styles.height48, Styles.flexJustifyCenter, Styles.flexAlignCenter]} onTouchStart={() => {}}>
          <FontAwesomeIcon icon={faBell} size={24} color={theme.colors.textLight} />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

export default Header;
