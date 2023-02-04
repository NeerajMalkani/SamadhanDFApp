import { ScrollView } from "react-native";
import { List } from "react-native-paper";
import { Styles } from "../../../../../styles/styles";

const PhoneContactDirectUpload = ({ route, navigation }) => {
  return (
    <ScrollView style={[Styles.flex1]}>
      {route.params.phoneNumbers.map((k, i) => {
        return (
          <List.Item
            key={i}
            title={k.name}
            description={k.phoneNumbers[0].number}
            onPress={() => {
              route.params.callback(k);
              navigation.goBack();
            }}
          />
        );
      })}
    </ScrollView>
  );
};

export default PhoneContactDirectUpload;
