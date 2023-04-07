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
let ContractorID = 0;

const AddContractorDepartmentScreen = ({ route, navigation }) => {
  //#region Variables
  const [departmentFullData, setDepartmentFullData] = React.useState([]);
  const [departmentData, setDepartmentData] = React.useState([]);
  const [departmentName, setDepartmentName] = React.useState(route.params.type === "edit" ? route.params.data.departmentName : "");
  const [departmentError, setDepartmentError] = React.useState(false);

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);
  const [departmentID, setDepartmentID] = useState(0);
  const [myDepartmentID, setMyDepartmentID] = React.useState(route.params.type === "edit" ? route.params.data.departmentID : 0);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  //#endregion

  //#region Functions

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      ContractorID = JSON.parse(userData).UserID;
      FetchDepartments();
    }
  };

  useEffect(() => {
    GetUserID();
  }, []);

  const FetchDepartments = () => {
    let params = {
      data: {
        Sess_UserRefno: ContractorID,
        department_refno: "all",
      },
    };

    Provider.createDFAdmin(Provider.API_URLS.DepartmentRefNoCheck, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setDepartmentFullData(response.data.data);
            const departments = response.data.data.map((data) => data.departmentName);
            setDepartmentData(departments);
          }
        }
      })
      .catch((e) => {});
  };

  const onDepartmentSelected = (selectedItem) => {
    setDepartmentName(selectedItem);
    setDepartmentError(false);
  };

  const InsertDepartment = () => {
    let params = {
      data: {
        Sess_UserRefno: ContractorID,
        department_refno: departmentFullData.find((el) => {
          return el.departmentName === departmentName;
        }).id,

        view_status: checked ? "1" : "0",
      },
    };
    Provider.createDFCommon(Provider.API_URLS.DepartmentCreate, params)
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

  const UpdateDepartment = () => {
    let params = {
      data: {
        Sess_UserRefno: ContractorID,
        mydepartment_refno: myDepartmentID,
        department_refno: departmentFullData.find((el) => {
          return el.departmentName === departmentName;
        }).id,
        view_status: checked ? "1" : "0",
      },
    };
    Provider.createDFCommon(Provider.API_URLS.DepartmentUpdate, params)
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

  const ValidateDepartmentName = () => {
    let isValid = true;
    if (departmentName.length === 0) {
      setDepartmentError(true);
      isValid = false;
    }
    if (isValid) {
      setIsButtonLoading(true);
      if (route.params.type === "edit") {
        UpdateDepartment();
      } else {
        InsertDepartment();
      }
    }
  };

  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <Dropdown label="Department Name" data={departmentData} onSelected={onDepartmentSelected} isError={departmentError} selectedItem={departmentName} />
          <HelperText type="error" visible={departmentError}>
            {communication.InvalidDepartmentID}
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
          
           <DFButton mode="contained" onPress={ValidateDepartmentName} title="SAVE" loader={isButtonLoading} />
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddContractorDepartmentScreen;
