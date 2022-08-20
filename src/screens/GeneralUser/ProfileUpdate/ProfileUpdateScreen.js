import { View } from "react-native";
import Header from "../../../components/Header";
import { Styles } from "../../../styles/styles";

const ProfileUpdateScreen = ({ navigation }) => {
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Profile Update" />
    </View>
  );
};

export default ProfileUpdateScreen;
