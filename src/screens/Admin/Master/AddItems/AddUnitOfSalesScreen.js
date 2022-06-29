import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Checkbox, HelperText, Snackbar, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";

const AddUnitOfSalesScreen = ({ route, navigation }) => {
  const [error, setError] = React.useState(false);
  const [errorC, setCError] = React.useState(false);
  const [name, setName] = React.useState(route.params.type === "edit" ? route.params.data.unitName.split(" / ")[0] : "");
  const [conversion, setConversion] = React.useState(route.params.type === "edit" ? route.params.data.unitName.split(" / ")[1] : "");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const onNameChanged = (text) => {
    setName(text);
    setError(false);
  };

  const onConversionChanged = (text) => {
    setConversion(text);
    setCError(false);
  };

  const InsertData = () => {
    Provider.create("master/insertunitofsales", { UnitName: name + " / " + conversion, Display: checked })
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

  const UpdateData = () => {
    Provider.create("master/updateunitofsales", { ID: route.params.data.id, UnitName: name + " / " + conversion, Display: checked })
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

  const ValidateData = () => {
    let isValid = true;
    if (name.length === 0) {
      setError(true);
      isValid = false;
    }
    if (conversion.length === 0) {
      setCError(true);
      isValid = false;
    }
    if (isValid) {
      if (route.params.type === "edit") {
        UpdateData();
      } else {
        InsertData();
      }
    }
  };

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <TextInput mode="flat" label="Unit Name" value={name} onChangeText={onNameChanged} style={{ backgroundColor: "white" }} error={error} />
          <HelperText type="error" visible={error}>
            {communication.InvalidUnitName}
          </HelperText>
          <TextInput mode="flat" label="Conversion Unit" value={conversion} onChangeText={onConversionChanged} style={{ backgroundColor: "white" }} error={errorC} />
          <HelperText type="error" visible={errorC}>
            {communication.InvalidUnitConversionUnit}
          </HelperText>
          <View style={{ paddingTop: 24, width: 160 }}>
            <Checkbox.Item
              label="Display"
              color={theme.colors.primary}
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          </View>
          <Button style={{ marginTop: 32 }} mode="contained" onPress={ValidateData}>
            SAVE
          </Button>
        </View>
      </ScrollView>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddUnitOfSalesScreen;
