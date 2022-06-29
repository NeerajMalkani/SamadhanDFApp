import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Checkbox, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";

const AddActivityRolesScreen = ({ route, navigation }) => {
  const [activityNameError, setActivityNameError] = React.useState(false);
  const [activityName, setActivityName] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const onActivityNameChanged = (text) => {
    if (text.length === 0) {
      setActivityNameError(true);
    } else {
      setActivityName(text);
      setActivityNameError(false);
    }
  };

  const InsertActivityName = () => {
    Provider.create("master/insertactivityroles", { ActivityRoleName: activityName, Display: checked })
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

  const UpdateActivityName = () => {
    Provider.create("master/updateactivityroles", { ID: route.params.data.id, ActivityRoleName: activityName, Display: checked })
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

  const ValidateActivityName = () => {
    let isValid = true;
    if (activityName.length === 0) {
      setActivityNameError(true);
      isValid = false;
    }
    if (isValid) {
      if (route.params.type === "edit") {
        UpdateActivityName();
      } else {
        InsertActivityName();
      }
    } else {
      setVisible(true);
    }
  };

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <TextInput mode="flat" label="Activity Name" value={activityName} onChangeText={onActivityNameChanged} style={{ backgroundColor: "white" }} error={activityNameError} />
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
          <Button style={{ marginTop: 32 }} mode="contained" onPress={ValidateActivityName}>
            SAVE
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddActivityRolesScreen;
