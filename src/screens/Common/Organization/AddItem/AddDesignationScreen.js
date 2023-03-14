import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APIConverter } from "../../../../utils/apiconverter";
import DFButton from "../../../../components/Button";


let ContractorID = 0,
  companyID = 0;
const AddContractorDesignationScreen = ({ route, navigation }) => {
  //#region Variables
  const [designationFullData, setDesignationFullData] = React.useState([]);
  const [myDesignationFullData, setMyDesignationFullData] = React.useState([]);
  const [designationData, setDesignationData] = React.useState([]);
  const [designationName, setDesignationName] = React.useState(route.params.type === "edit" ? route.params.data.designationName : "");

  const [sessionNo, setSessionNo] = React.useState(route.params.type === "edit" ? route.params.data.Sess_company_refno : "");
  const [designationError, setDesignationError] = React.useState(false);
  // const [myDesignationtID, setMyDesignationID] = useState(0);
  // const [myDesignation, setMyDesignation] = React.useState(route.params.type === "edit" ? route.params.data.mydesignation_refno : "");
  const [myDesignationID, setMyDesignationID] = React.useState(route.params.type === "edit" ? route.params.data.designationID : 0);

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);
  const [reportingAuthority, setReportingAuthority] = React.useState(route.params.type === "edit" ? route.params.data.reportingAuthority : true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  //#endregion

  //#region Functions
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      ContractorID = JSON.parse(userData).UserID;
      companyID = JSON.parse(userData).Sess_company_refno;

      FetchDesignations();
    }
  };
  useEffect(() => {
    GetUserID();
  }, []);
  const FetchDesignations = () => {
    let params = {
      data: {
        Sess_UserRefno: ContractorID,
        designation_refno: "all",
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.DesignationRefNoCheck, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setDesignationFullData(response.data.data);
            //fetching fulldata from api
            const designation = response.data.data.map((data) => data.designationName);
            setDesignationData(designation);
          }
        }
      })
      .catch((e) => {});
  };

  const onDesignationSelected = (selectedItem) => {
    setDesignationName(selectedItem);
    setDesignationError(false);
  };

  const InsertDesignation = () => {
    let params = {
      data: {
        Sess_UserRefno: ContractorID,
        Sess_company_refno: companyID,
        designation_refno: designationFullData.find((el) => {
          return el.designationName === designationName;
        }).id,
        view_status: checked ? "1" : "0",
        reporting_status: reportingAuthority ? "1" : "0",
      },
    };
    Provider.createDFCommon(Provider.API_URLS.DesignationCreate, params)
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

  const UpdateDesignation = () => {
    let params = {
      data: {
        Sess_UserRefno: ContractorID,
        Sess_company_refno: companyID,
        mydesignation_refno: myDesignationID,
        designation_refno: designationFullData.find((el) => {
          return el.designationName === designationName;
        }).id,
        view_status: checked ? "1" : "0",
        reporting_status: reportingAuthority ? "1" : "0",
      },
    };
    Provider.createDFCommon(Provider.API_URLS.DesignationUpdate, params)
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

  const ValidateDesignationName = () => {
    let isValid = true;
    if (designationName.length === 0) {
      setDesignationError(true);
      isValid = false;
    }
    if (isValid) {
      setIsButtonLoading(true);
      if (route.params.type === "edit") {
        UpdateDesignation();
      } else {
        InsertDesignation();
      }
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <Dropdown label="Designation Name" data={designationData} onSelected={onDesignationSelected} isError={designationError} selectedItem={designationName} />
          <HelperText type="error" visible={designationError}>
            {communication.InvalidDesignationID}
          </HelperText>
          <View style={{ width: 240 }}>
            <Checkbox.Item
              label="Reporting Authority"
              color={theme.colors.primary}
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
              status={reportingAuthority ? "checked" : "unchecked"}
              onPress={() => {
                setReportingAuthority(!reportingAuthority);
              }}
            />
          </View>
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
          {/* <Button mode="contained" onPress={ValidateDesignationName}>
            SAVE
          </Button> */}
          <DFButton mode="contained" onPress={ValidateDesignationName} title="SAVE" loader={isButtonLoading} />
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddContractorDesignationScreen;
