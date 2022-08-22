import { View } from "react-native";
import Header from "../../../components/Header";
import { Styles } from "../../../styles/styles";

const QuotationWiseScreen = ({ navigation }) => {
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Quotation Wise" />
    </View>
  );
};

export default QuotationWiseScreen;
