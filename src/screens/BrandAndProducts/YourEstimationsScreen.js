import { Text, View } from "react-native";
import Header from "../../components/Header";
import { Styles } from "../../styles/styles";

const YourEstimationsScreen = ({ navigation }) => {
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Your Estimations" />
      <Text>YE</Text>
    </View>
  );
};

export default YourEstimationsScreen;
