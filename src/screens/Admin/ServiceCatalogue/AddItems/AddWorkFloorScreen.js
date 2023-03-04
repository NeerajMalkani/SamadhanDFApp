import React from "react";
import { ScrollView, View } from "react-native";
import { Card, Checkbox, HelperText, Snackbar, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import DFButton from "../../../../components/Button";

const AddWorkFloorScreen = ({ route, navigation }) => {
  //#region Variables

  const [workFloorNameError, setWorkFloorNameError] = React.useState(false);
  const [workFloorName, setWorkFloorName] = React.useState(route.params.type === "edit" ? route.params.data.workFloorName : "");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  //#endregion

  //#region Functions
  const onWorkFloorNameChanged = (text) => {
    setWorkFloorName(text);
    setWorkFloorNameError(false);
  };

  const InsertWorkFloorName = () => {
    const params = {
      data: {
        Sess_UserRefno: "2",
        workfloor_name: workFloorName,
        view_status: checked ? 1 : 0,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.WorkFloorCreate, params)
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

  const UpdateWorkFloorName = () => {
    const params = {
      data: {
        Sess_UserRefno: "2",
        workfloor_refno: route.params.data.id,
        workfloor_name: workFloorName,
        view_status: checked ? 1 : 0,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.WorkFloorUpdate, params)
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

  const ValidateWorkFloorName = () => {
    let isValid = true;
    if (workFloorName.length === 0) {
      setWorkFloorNameError(true);
      isValid = false;
    }
    if (isValid) {
      setIsButtonLoading(true);
      if (route.params.type === "edit") {
        UpdateWorkFloorName();
      } else {
        InsertWorkFloorName();
      }
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <TextInput mode="flat" label="Work Floor Name" value={workFloorName} onChangeText={onWorkFloorNameChanged} style={{ backgroundColor: "white" }} error={workFloorNameError} />
          <HelperText type="error" visible={workFloorNameError}>
            {communication.InvalidWorkFloorName}
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
          {/* <Button mode="contained" loading={isButtonLoading} disabled={isButtonLoading} onPress={ValidateWorkFloorName}>
            SAVE
          </Button> */}
           <DFButton mode="contained" onPress={ValidateWorkFloorName} title="SAVE" loader={isButtonLoading} />
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddWorkFloorScreen;
