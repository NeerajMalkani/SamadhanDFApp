import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";

let dealerID = 0;
const AddBrandScreen = ({ route, navigation }) => {
  const [brandNameError, setBrandNameError] = React.useState(false);
  const [brandName, setBrandName] = React.useState(route.params.type === "edit" ? route.params.data.brandName : "");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      dealerID = JSON.parse(userData).UserID;
    }
  };

  useEffect(() => {
    GetUserID();
  }, []);

  const onBrandNameChanged = (text) => {
    setBrandName(text);
    setBrandNameError(false);
  };

  const InsertBrandName = () => {
    Provider.create("dealerbrand/insertbrand", { BrandName: brandName, DealerID: dealerID, Display: checked })
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("add");
          navigation.goBack();
        } else {
          setSnackbarText(communication.InsertError);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const UpdateBrandName = () => {
    Provider.create("dealerbrand/updatebrand", { ID: route.params.data.id, BrandName: brandName, DealerID: dealerID, Display: checked })
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("update");
          navigation.goBack();
        } else {
          setSnackbarText(communication.UpdateError);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const ValidateBrandName = () => {
    let isValid = true;
    if (brandName.length === 0) {
      setBrandNameError(true);
      isValid = false;
    }
    if (isValid) {
      if (route.params.type === "edit") {
        UpdateBrandName();
      } else {
        InsertBrandName();
      }
    }
  };

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <TextInput mode="flat" label="Brand Name" value={brandName} onChangeText={onBrandNameChanged} style={{ backgroundColor: "white" }} error={brandNameError} />
          <HelperText type="error" visible={brandNameError}>
            {communication.InvalidBrandName}
          </HelperText>
          <View style={{ width: 160 }}>
            <Checkbox.Item
              label="Display"
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
              color={theme.colors.primary}
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content>
          <Button mode="contained" onPress={ValidateBrandName}>
            SAVE
          </Button>
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddBrandScreen;
