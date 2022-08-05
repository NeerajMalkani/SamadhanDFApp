import React from "react";
import { View } from "react-native";
import { FAB, Snackbar } from "react-native-paper";
import Header from "../../../components/Header";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";

const MaterialSetupScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const AddCallback = () => {
    navigation.navigate("AddMaterialSetupScreen", { type: "add" });//, fetchData: FetchData
  };

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Material Setup" />
      <FAB style={[Styles.margin16, Styles.primaryBgColor, { position: "absolute", right: 16, bottom: 16 }]} icon="plus" onPress={AddCallback} />
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default MaterialSetupScreen;
