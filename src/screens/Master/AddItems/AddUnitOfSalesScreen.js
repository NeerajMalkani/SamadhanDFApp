import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Checkbox, TextInput } from "react-native-paper";
import Provider from "../../../api/Provider";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";

const AddUnitOfSalesScreen = ({ route, navigation }) => {
  const [error, setError] = React.useState(false);
  const [errorC, setCError] = React.useState(false);
  const [name, setName] = React.useState(route.params.type === "edit" ? route.params.data.unitName.split(" / ")[0] : "");
  const [conversion, setConversion] = React.useState(route.params.type === "edit" ? route.params.data.unitName.split(" / ")[1] : "");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const onNameChanged = (text) => {
    setName(text);
    if (text.length === 0) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const onConversionChanged = (text) => {
    setConversion(text);
    if (text.length === 0) {
      setCError(true);
    } else {
      setCError(false);
    }
  };

  const InsertData = () => {
    Provider.create("master/insertunitofsales", { UnitName: name + " / " + conversion, Display: checked })
      .then((response) => {
        console.log(name);
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

  const UpdateData = () => {
    Provider.create("master/updateunitofsales", { ID: route.params.data.id, UnitName: name + " / " + conversion, Display: checked })
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

  const ValidateData = () => {
    let isValid = true;
    if (name.length === 0) {
      setError(true);
      isValid = false;
    }
    if (isValid) {
      if (route.params.type === "edit") {
        UpdateData();
      } else {
        InsertData();
      }
    } else {
      setVisible(true);
    }
  };

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.padding16, Styles.backgroundColor]} keyboardShouldPersistTaps="handled">
        <TextInput mode="flat" label="Unit Name" value={name} onChangeText={onNameChanged} style={{ backgroundColor: "white" }} error={error} />
        <TextInput mode="flat" label="Conversion Unit" value={conversion} onChangeText={onConversionChanged} style={{ backgroundColor: "white" }} error={errorC} />
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
      </ScrollView>
    </View>
  );
};

export default AddUnitOfSalesScreen;
