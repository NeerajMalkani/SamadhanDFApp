import React from "react";
import { ScrollView, View } from "react-native";
import { Card, Checkbox, HelperText, Snackbar, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import DFButton from "../../../../components/Button";

const AddServicesScreen = ({ route, navigation }) => {
  //#region Variables
  const [servicesError, setServicesError] = React.useState(false);
  const [services, setServices] = React.useState(route.params.type === "edit" ? route.params.data.serviceName : "");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  //#endregion

  //#region Functions
  const onServicesChanged = (text) => {
    setServices(text);
    setServicesError(false);
  };

  const InsertServices = () => {
    Provider.createDFAdmin(Provider.API_URLS.ServiceNameCreate, {
      data: {
        Sess_UserRefno: "2",
        service_name: services,
        production_unit: "1",
        view_status: checked ? 1 : 0,
      },
    })
      .then((response) => {
        setIsButtonLoading(false);
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
        console.log(e);
        setIsButtonLoading(false);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const UpdateServices = () => {
    Provider.createDFAdmin(Provider.API_URLS.ServiceNameUpdate, {
      data: {
        Sess_UserRefno: "2",
        service_refno: route.params.data.id,
        service_name: services,
        production_unit: "1",
        view_status: checked ? 1 : 0,
      },
    })
      .then((response) => {
        setIsButtonLoading(false);
        if (response.data && response.data.code === 200) {
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

  const ValidateServices = () => {
    let isValid = true;
    if (services.length === 0) {
      setServicesError(true);
      isValid = false;
    }
    if (isValid) {
      setIsButtonLoading(true);
      if (route.params.type === "edit") {
        UpdateServices();
      } else {
        InsertServices();
      }
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <TextInput mode="flat" label="Service Name" value={services} onChangeText={onServicesChanged} style={{ backgroundColor: "white" }} error={servicesError} />
          <HelperText type="error" visible={servicesError}>
            {communication.InvalidServiceName}
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
          {/* <Button mode="contained" loading={isButtonLoading} disabled={isButtonLoading} onPress={ValidateServices}>
            SAVE
          </Button> */}
          <DFButton mode="contained" onPress={ValidateServices} title="SAVE" loader={isButtonLoading} />
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddServicesScreen;
