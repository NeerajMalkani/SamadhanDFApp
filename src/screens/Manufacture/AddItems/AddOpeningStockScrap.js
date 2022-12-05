import React, { useState,useRef } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Text, TextInput } from "react-native-paper";
import Provider from "../../../api/Provider";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";



const AddOpeningStockScrap = ({ route, navigation }) => {
  const [dob, setDob] = useState(new Date());
  const [dobInvalid, setDobInvalid] = useState("");
  const dobRef = useRef({});
  const [error, setError] = React.useState(false);
  const [name, setName] = React.useState(route.params.type === "edit" ? route.params.data.categoryName : "");

  






  //#region Variables
  const [activityNameError, setActivityNameError] = React.useState(false);
  const [activityName, setActivityName] = React.useState(route.params.type === "edit" ? route.params.data.group_name : "");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? (route.params.data.view_status === "1" ? true : false) : true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  //#endregion

  //#region Functions
  const onActivityNameChanged = (text) => {
    setActivityName(text);
    setActivityNameError(false);
  };

  const InsertActivityName = () => {
    Provider.createDFCommon(Provider.API_URLS.GroupNameCreate, {
      data: {
        Sess_UserRefno: "2",
        group_name: activityName,
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
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const UpdateActivityName = () => {
    Provider.createDFCommon(Provider.API_URLS.GroupNameUpdate, {
      data: {
        Sess_UserRefno: "2",
        group_refno: route.params.data.group_refno,
        group_name: activityName,
        view_status: checked ? 1 : 0,
      },
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

  //Date Time Picker



  const onNameChanged = (text) => {
    setName(text);
    setError(false);
  };





  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <TextInput mode="flat" label="Total Opening Stock Scrap (kg)" value={name} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onNameChanged} style={{ backgroundColor: "white" }} error={error} />
          <HelperText type="error" visible={error}>
            {communication.InvalidCategoryName}
          </HelperText>
          <DateTimePicker style={Styles.backgroundColorWhite} label=" * Date" type="date" value={dob} onChangeDate={setDob} />
          </View>
      </ScrollView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content>
          <Button mode="contained" onPress={ValidateActivityName}>
            Submit
          </Button>
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddOpeningStockScrap;
