import { View } from "react-native";
import Header from "../../components/Header";
import { Styles } from "../../styles/styles";

const UnitOfSalesScreen = ({ navigation }) => {
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Services" />
    </View>
  );
};

export default UnitOfSalesScreen;
