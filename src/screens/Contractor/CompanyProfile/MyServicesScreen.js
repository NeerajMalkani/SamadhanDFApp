import { Text, View } from "react-native";
import Header from "../../../components/Header";
import { Styles } from "../../../styles/styles";

const MyServicesContractorScreen = ({ navigation }) => {
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="My Services" />
    </View>
  );
};

export default MyServicesContractorScreen;
