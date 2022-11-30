import React, { useRef } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";

const AddUnitOfSalesScreen = ({ route, navigation }) => {
  //#region Variables

  const [error, setError] = React.useState(false);
  const [errorC, setCError] = React.useState(false);
  const [name, setName] = React.useState(route.params.type === "edit" ? route.params.data.displayUnit : "");
  const [conversion, setConversion] = React.useState(route.params.type === "edit" ? route.params.data.convertUnitName : "");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const ref_input2 = useRef();
  //#endregion

  //#region Functions
  const onNameChanged = (text) => {
    setName(text);
    setError(false);
  };

  const onConversionChanged = (text) => {
    setConversion(text);
    setCError(false);
  };

  const InsertData = () => {
    Provider.createDFAdmin(Provider.API_URLS.UnitNameCreate, {
      data: {
        Sess_UserRefno: "2",
        unit_name: name,
        convert_unit_name: conversion,
        view_status: checked ? 1 : 0,
      },
    })
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("add");
          navigation.goBack();
        } else if (response.data.code === 304) {
          setSnackbarText(communication.AlreadyExists);
          setSnackbarVisible(true);
        } else {
          setSnackbarText(communication.InsertError);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const UpdateData = () => {
    Provider.createDFAdmin(Provider.API_URLS.UnitNameUpdate, {
      data: {
        Sess_UserRefno: "2",
        unit_category_refno: route.params.data.id,
        unit_name: name,
        convert_unit_name: conversion,
        view_status: checked ? 1 : 0,
      },
    })
      .then((response) => {
        setIsButtonLoading(false);
        if (response.data && (response.data.code === 200 || response.data.code === 204)) {
          route.params.fetchData("update");
          navigation.goBack();
        } else if (response.data.code === 304) {
          setSnackbarText(communication.AlreadyExists);
          setSnackbarVisible(true);
        } else {
          setSnackbarText(communication.UpdateError);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsButtonLoading(false);
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
      setIsButtonLoading(true);
      if (route.params.type === "edit") {
        UpdateData();
      } else {
        InsertData();
      }
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <TextInput mode="flat" label="Unit Name" value={name} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onNameChanged} style={{ backgroundColor: "white" }} error={error} />
          <HelperText type="error" visible={error}>
            {communication.InvalidUnitName}
          </HelperText>
          <TextInput ref={ref_input2} mode="flat" label="Conversion Unit" value={conversion} onChangeText={onConversionChanged} style={{ backgroundColor: "white" }} error={errorC} />
          <HelperText type="error" visible={errorC}>
            {communication.InvalidUnitConversionUnit}
          </HelperText>
          <View style={{ width: 160 }}>
            <Checkbox.Item
              label="Display"
              color={theme.colors.primary}
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
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
          <Button mode="contained" loading={isButtonLoading} disabled={isButtonLoading} onPress={ValidateData}>
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

export default AddUnitOfSalesScreen;
