import { View } from "react-native";
import Header from "../../../components/Header";
import { Styles } from "../../../styles/styles";

const DealerPresentationScreen = ({ navigation }) => {
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Presentation" />
    </View>
  );
};

export default DealerPresentationScreen;
