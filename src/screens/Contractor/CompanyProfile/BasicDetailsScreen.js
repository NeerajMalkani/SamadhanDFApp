import { Text, View } from "react-native";
import Header from "../../../components/Header";
import { Styles } from "../../../styles/styles";

const BasicDetailsContractorScreen = ({ navigation }) => {
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Basic Details" />
    </View>
  );
};

export default BasicDetailsContractorScreen;
