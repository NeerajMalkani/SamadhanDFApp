import { Text, View } from "react-native";
import Header from "../../components/Header";
import { Styles } from "../../styles/styles";

const ImageGalleryScreen = ({ navigation }) => {
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Image Gallery" />
      <Text>Coming Soon</Text>
    </View>
  );
};

export default ImageGalleryScreen;
