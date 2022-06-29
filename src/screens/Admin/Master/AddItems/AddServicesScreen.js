import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Checkbox, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";

const AddServicesScreen = ({ route, navigation }) => {
  const [servicesError, setServicesError] = React.useState(false);
  const [services, setServices] = React.useState(route.params.type === "edit" ? route.params.data.serviceName : "");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const onServicesChanged = (text) => {
    setServices(text);
    if (text.length === 0) {
      setServicesError(true);
    } else {
      setServicesError(false);
    }
  };

  const InsertServices = () => {
    Provider.create("master/insertservices", { ServiceName: services, Display: checked })
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("add");
          navigation.goBack();
        } else {
          //Show snackbar
        }
      })
      .catch((e) => {
        console.log(e);
        //Show snackbar
      });
  };

  const UpdateServices = () => {
    Provider.create("master/updateservices", { ID: route.params.data.id, ServiceName: services, Display: checked })
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("update");
          navigation.goBack();
        } else {
          //Show snackbar
        }
      })
      .catch((e) => {
        console.log(e);
        //Show snackbar
      });
  };

  const ValidateServices = () => {
    let isValid = true;
    if (services.length === 0) {
      setServicesError(true);
      isValid = false;
    }
    if (isValid) {
      if (route.params.type === "edit") {
        UpdateServices();
      } else {
        InsertServices();
      }
    } else {
      setVisible(true);
    }
  };

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <TextInput mode="flat" label="Service Name" value={services} onChangeText={onServicesChanged} style={{ backgroundColor: "white" }} error={servicesError} />
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
          <Button style={{ marginTop: 32 }} mode="contained" onPress={ValidateServices}>
            SAVE
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddServicesScreen;
