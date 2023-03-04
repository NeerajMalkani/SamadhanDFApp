import React, { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, View } from "react-native";
import {
  Card,
  Checkbox,
  HelperText,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { APIConverter } from "../../../../utils/apiconverter";
import { communication } from "../../../../utils/communication";
import DFButton from "../../../../components/Button";

let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
const AddMassOfZincCoating = ({ route, navigation }) => {
  //#region Variables
  const [gsmError, setGsmError] = React.useState(false);
  const [gsm, setGsm] = React.useState(
    route.params.type === "edit" ? route.params.data.gsm_name : ""
  );

  const [descriptionError, setDescriptionError] = React.useState(false);
  const [description, setDescription] = React.useState(
    route.params.type === "edit" ? route.params.data.description : ""
  );

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [checked, setChecked] = React.useState(
    route.params.type === "edit"
      ? route.params.data.view_status == "1"
        ? true
        : false
      : true
  );

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();
  const ref_input5 = useRef();
  //#endregion

  //#region Functions

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

  const onGSMChanged = (text) => {
    setGsm(text);
    setGsmError(false);
  };

  const onDescriptionChanged = (text) => {
    setDescription(text);
    setDescriptionError(false);
  };

  const UpdateData = () => {
    if (route.params.type === "edit") {
      const params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          gsm_refno: route.params.data.gsm_refno,
          gsm_name: gsm,
          description: description,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          view_status: checked ? "1" : "0",
        },
      };
      Provider.createDFManufacturer(Provider.API_URLS.gsmnameupdate, params)
        .then((response) => {
          console.log(response.data);
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
          setSnackbarText(communication.NetworkError);
          setSnackbarVisible(true);
        })
        .finally(() => setIsButtonLoading(false));
    } else {
      const params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          gsm_name: gsm,
          description: description,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          view_status: checked ? "1" : "0",
        },
      };
      Provider.createDFManufacturer(Provider.API_URLS.gsmnamecreate, params)
        .then((response) => {
          console.log(response.data);
          if (response.data && response.data.data.Created == 1) {
            route.params.fetchData("add");
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
          setSnackbarText(communication.NetworkError);
          setSnackbarVisible(true);
        })
        .finally(() => setIsButtonLoading(false));
    }
  };

  const ValidateData = () => {
    let isValid = true;

    if (gsm.length === 0) {
      setGsmError(true);
      isValid = false;
    }
    if (description.length === 0) {
      setDescriptionError(true);
      isValid = false;
    }

    if (isValid) {
      setIsButtonLoading(true);
      UpdateData();
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView
        style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[Styles.padding16]}>
          <TextInput
            mode="flat"
            label="Gsm"
            value={gsm}
            onChangeText={onGSMChanged}
            error={gsmError}
            dense
            style={[Styles.marginTop12, Styles.backgroundSecondaryColor]}
          />
          <HelperText type="error" visible={gsmError}>
            {communication.InvalidUnitGsm}
          </HelperText>
          <TextInput
            mode="flat"
            label="Description"
            value={description}
            onChangeText={onDescriptionChanged}
            error={descriptionError}
            dense
            style={[Styles.marginTop12, Styles.backgroundSecondaryColor]}
          />
          <HelperText type="error" visible={descriptionError}>
            {communication.InvalidUnitdescription}
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
          {/* <Button
            mode="contained"
            loading={isButtonLoading}
            disabled={isButtonLoading}
            onPress={ValidateData}
          >
            Submit
          </Button> */}
           <DFButton mode="contained" onPress={ValidateData} title="Submit" loader={isButtonLoading} />
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

export default AddMassOfZincCoating;
