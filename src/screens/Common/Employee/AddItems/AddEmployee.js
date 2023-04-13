import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  View,
  RefreshControl,
  LogBox,
  ScrollView,
  Text,
  Touchable,
} from "react-native";
import {
  FAB,
  List,
  Searchbar,
  Snackbar,
  TextInput,
  Title,
  HelperText,
  Button,
} from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import { theme } from "../../../../theme/apptheme";
import { Styles } from "../../../../styles/styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { NullOrEmpty } from "../../../../utils/validations";
import { communication } from "../../../../utils/communication";
import Provider from "../../../../api/Provider";
import {
  RenderHiddenItems,
  RenderHiddenItemGeneric,
} from "../../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RBSheet from "react-native-raw-bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoItems from "../../../../components/NoItems";

let userID = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
const AddEmployee = ({ route, navigation }) => {
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );
  const [employeeName, setEmployeeName] = useState("");
  const [employeeNameInvalid, setEemployeeNameInvalid] = useState("");
  const employeeNameRef = useRef({});
  const [addAadharNo, setAddAadharNo] = useState("");
  const [addAadharNoInvalid, setAddAadharNoInvalid] = useState("");
  const addAadharNoRef = useRef({});

  const [addMobileNo, setAddMobileNo] = useState("");
  const [addMobileNoInvalid, setAddMobileNoInvalid] = useState("");
  const addMobileNoRef = useRef({});

  const [companyName, setCompanyName] = React.useState("");
  const [RBEmployeeName, setRBEmployeeName] = useState("");
  const [RBMobileNo, setRBMobileNo] = useState("");
  const [RBAadharNo, setRBAadharNo] = useState("");

  const refRBSheet = useRef();

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      Sess_company_refno = JSON.parse(userData).Sess_company_refno;
      Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
    }
  };

  useEffect(() => {
    GetUserID();
  }, []);

  const onAddAadharNoChanged = (text) => {
    setAddAadharNo(text);
    setAddAadharNoInvalid(false);
  };

  const onAddMobileNoChanged = (text) => {
    setAddMobileNo(text);
    setAddMobileNoInvalid(false);
  };

  const onEmployeeNameChanged = (text) => {
    setEmployeeName(text);
    setEemployeeNameInvalid(false);
  };

  const InsertNewEmployee = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        employee_name: employeeName.trim(),
        aadhar_no: addAadharNo.trim(),
        employee_mobile_no: addMobileNo.trim(),
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
      },
    };
    console.log('add param:', params);
    Provider.createDFCommon(Provider.API_URLS.employeecreate, params)
      .then((response) => {
        console.log('resp:', response.data.data);
        if (
          response.data &&
          response.data.code === 200 &&
          response.data.data.Created === 1
        ) {
          route.params.fetchData("add");
          navigation.navigate("EmployeeListScreen");
        } else {
          setSnackbarColor(theme.colors.error);
          setSnackbarText(response.data.message);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarColor(theme.colors.error);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const OnAddNewEmployee = () => {
    console.log('click button');
    let isValid = true;

    if (NullOrEmpty(employeeName.trim())) {
      isValid = false;
      setEemployeeNameInvalid(true);
    }

    if (NullOrEmpty(addMobileNo.trim())) {
      isValid = false;
      setAddMobileNoInvalid(true);
    }
    if (NullOrEmpty(addAadharNo.trim())) {
      isValid = false;
      setAddAadharNoInvalid(true);
    }

    if (isValid) {
      InsertNewEmployee();
    }
  };

  return (
    <View style={[Styles.flex1]}>
      <ScrollView
        style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 0 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[Styles.padding16]}>
          <View
            style={[
              Styles.width100per,
              Styles.borderBottom2,
              Styles.borderBottom2,
              Styles.marginBottom16,
            ]}
          >
            <Text
              style={[
                Styles.fontSize20,
                Styles.fontBold,
                Styles.marginBottom4,
                Styles.blueFontColor,
              ]}
            >
              Add New Employee
            </Text>
          </View>
          <TextInput
            ref={employeeNameRef}
            mode="outlined"
            dense
            label="Employee Name"
            value={employeeName}
            returnKeyType="next"
            onSubmitEditing={() => employeeNameRef.current.focus()}
            selectTextOnFocus={false}
            onChangeText={onEmployeeNameChanged}
            style={{ backgroundColor: "white" }}
            error={employeeNameInvalid}
          />
          <HelperText type="error" visible={employeeNameInvalid}>
            {communication.InvalidEmployeeName}
          </HelperText>

          <TextInput
            ref={addMobileNoRef}
            mode="outlined"
            dense
            keyboardType="number-pad"
            maxLength={10}
            label="Mobile No"
            value={addMobileNo}
            returnKeyType="next"
            onSubmitEditing={() => addMobileNoRef.current.focus()}
            onChangeText={onAddMobileNoChanged}
            style={{ backgroundColor: "white" }}
            error={addMobileNoInvalid}
          />
          <HelperText type="error" visible={addMobileNoInvalid}>
            {communication.InvalidMobileNumber}
          </HelperText>

          <TextInput
            ref={addAadharNoRef}
            mode="outlined"
            dense
            keyboardType="number-pad"
            maxLength={12}
            label="Aadhar No"
            value={addAadharNo}
            returnKeyType="next"
            onSubmitEditing={() => addAadharNoRef.current.focus()}
            onChangeText={onAddAadharNoChanged}
            style={{ backgroundColor: "white" }}
            error={addAadharNoInvalid}
          />
          <HelperText type="error" visible={addAadharNoInvalid}>
            {communication.InvalidAadharNo}
          </HelperText>

          <TouchableOpacity
            onPress={OnAddNewEmployee}
            style={[
              Styles.marginTop32,
              Styles.primaryBgColor,
              Styles.padding10,
              Styles.flexAlignCenter,
            ]}
          >
            <Text style={[Styles.fontSize14, Styles.textColorWhite]}>
              ADD EMPLOYEE
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarColor }}
      >
        {snackbarText}
      </Snackbar>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={620}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{companyName}</Title>
          <ScrollView style={{ marginBottom: 64 }}>
            <List.Item title="Employee Name" description={RBEmployeeName} />
            <List.Item title="Mobile Number" description={RBMobileNo} />
            <List.Item title="Aadhar Number" description={RBAadharNo} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default AddEmployee;
