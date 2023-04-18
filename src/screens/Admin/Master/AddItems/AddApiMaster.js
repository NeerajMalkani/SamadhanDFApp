import React from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";

const AddApiMaster = ({ route, navigation }) => {

  //#region Variables
  
  const [screenChecked, setScreenChecked] = React.useState(route.params.type === "edit" ? route.params.data.view_status === "1" ? true : false : true);
  const [apiChecked, setApiChecked] = React.useState(route.params.type === "edit" ? route.params.data.view_status === "1" ? true : false : true);
  const [integrationChecked, setIntegrationChecked] = React.useState(route.params.type === "edit" ? route.params.data.view_status === "1" ? true : false : true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  //#endregion 

  //#region Functions

  const InsertActivityName = () => {
    Provider.createDFCommon("apiappadmin/spawu7S4urax/tYjD/groupnamecreate/", {
      data: {
        Sess_UserRefno: "2",
        group_name: activityName,
        view_status: checked ? 1 : 0
      }
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
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const UpdateActivityName = () => {
    Provider.createDFCommon("apiappadmin/spawu7S4urax/tYjD/groupnameupdate/",
     { 
      // ID: route.params.data.id, 
      // ActivityRoleName: activityName, 
      // Display: checked 

      data: {
        Sess_UserRefno: "2",
        group_refno: route.params.data.group_refno,
        group_name: activityName,
        view_status: checked ? 1 : 0,
      }
    })
      .then((response) => {
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
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
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
    }
  };
  //#endregion 

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <View style={{ width: 280 }}>
            <Checkbox.Item
              label="Screen Completed"
              color={theme.colors.primary}
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
              status={screenChecked ? "checked" : "unchecked"}
              onPress={() => {
                setScreenChecked(!screenChecked);
              }}
            />
            <Checkbox.Item
              label="Api Completed"
              color={theme.colors.primary}
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
              status={apiChecked ? "checked" : "unchecked"}
              onPress={() => {
                setApiChecked(!apiChecked);
              }}
            />
            <Checkbox.Item
              label="Intergration Done"
              color={theme.colors.primary}
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
              status={integrationChecked ? "checked" : "unchecked"}
              onPress={() => {
                setIntegrationChecked(!integrationChecked);
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content>
          <Button mode="contained" onPress={ValidateActivityName}>
           Update
          </Button>
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddApiMaster;
