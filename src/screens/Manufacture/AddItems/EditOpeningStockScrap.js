import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Card,
  Checkbox,
  HelperText,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import Provider from "../../../api/Provider";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";

let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;

const EditStockScrap = ({ route, navigation }) => {
  const [dob, setDob] = useState(
    route.params.type === "edit"
      ? new Date(`
          ${route.params.data?.production_date.substring(6, 10)}/
          ${route.params.data?.production_date.substring(3, 5)}/
          ${route.params.data?.production_date.substring(0, 2)}
         `)
      : new Date()
  );
  const [dobInvalid, setDobInvalid] = useState("");
  const dobRef = useRef({});
  const [error, setError] = React.useState(false);
  const [name, setName] = React.useState(
    route.params.type === "edit" ? route.params.data.opstock_scrap : ""
  );

  const [activityNameError, setActivityNameError] = React.useState(false);
  const [activityName, setActivityName] = React.useState(
    route.params.type === "edit" ? route.params.data.group_name : ""
  );
  const [checked, setChecked] = React.useState(
    route.params.type === "edit"
      ? route.params.data.view_status === "1"
        ? true
        : false
      : true
  );

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  //#endregion

  //#region Functions
  const onActivityNameChanged = (text) => {
    setActivityName(text);
    setActivityNameError(false);
  };

  const InsertActivityName = () => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        production_date: dob,
        opstock_scrap: name,
      },
    };
    Provider.createDFManufacturer(
      Provider.API_URLS.openingstockscrapcreate,
      params
    )
      .then((response) => {
        if (response.data && response.data.data.Created == 1) {
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
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        shiftproduction_refno: route.params.data.shiftproduction_refno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        production_date: dob,
        opstock_scrap: name,
      },
    };
    Provider.createDFManufacturer(
      Provider.API_URLS.openingstockscrapupdate,
      params
    )
      .then((response) => {
        if (response.data && response.data.data.Updated == 1) {
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
    if (name.length === 0) {
      setError(true);
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

  const GetUserID = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData !== null) {
        Sess_UserRefno = JSON.parse(userData).UserID;
        Sess_company_refno = JSON.parse(userData).Sess_company_refno;
        Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    GetUserID();
  }, []);

  const onNameChanged = (text) => {
    setName(text);
    setError(false);
  };

  return (
    <View style={[Styles.flex1]}>
      <ScrollView
        style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[Styles.padding16]}>
          <TextInput
           mode="outlined"
            label="Total Opening Stock Scrap (kg)"
            value={name}
            keyboardType="number-pad"
            returnKeyType="next"
            onSubmitEditing={() => ref_input2.current.focus()}
            onChangeText={onNameChanged}
            style={{ backgroundColor: "white" }}
            error={error}
          />
          <HelperText type="error" visible={error}>
            {"Invalid value"}
          </HelperText>
          <DateTimePicker
            style={Styles.backgroundColorWhite}
            label=" * Date"
            type="date"
            value={dob}
            onChangeDate={setDob}
          />
        </View>
      </ScrollView>
      <View
        style={[
          Styles.backgroundColor,
          Styles.width100per,
          Styles.marginTop32,
          Styles.padding16,
          { position: "absolute", bottom: 0, elevation: 3 },
        ]}
      >
        <Card.Content>
          <Button mode="contained" onPress={ValidateActivityName}>
            Submit
          </Button>
        </Card.Content>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.error }}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default EditStockScrap;
