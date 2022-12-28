import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions, ScrollView, Image, Keyboard } from "react-native";
import { ActivityIndicator, Button, Card, HelperText, Snackbar, Subheading, Switch, TextInput, Checkbox, RadioButton, Text } from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";
import { RNS3 } from "react-native-aws3";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
//import { DatePickerModal } from 'react-native-paper-dates';
import DropDown from "react-native-paper-dropdown";
//import moment from "moment";
import Provider from "../../../../api/Provider";
import Header from "../../../../components/Header";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { AWSImagePath } from "../../../../utils/paths";
import { NullOrEmpty } from "../../../../utils/validations";
import { BloodGroup } from "../../../../utils/validations";
import { styles } from "react-native-image-slider-banner/src/style";
const windowWidth = Dimensions.get("window").width;
let userID = 0;

const BranchEditScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const [index, setIndex] = useState(route.params && route.params.from === "brand" ? 2 : 0);

  //#region Input Variables

  const [companyName, setComapnyName] = useState("");
  const [companyNameInvalid, setComapnyNameInvalid] = useState("");
  const companyNameRef = useRef({});

  const [branchType, setBranchType] = useState("");
  const [branchTypeInvalid, setBranchTypeInvalid] = useState("");
  const branchTypeRef = useRef({});

  const [assignBranchAdmin, setAssignBranchAdmin] = useState("");
  const [assignBranchAdminInvalid, setAssignBranchAdminInvalid] = useState("");
  const assignBranchAdminRef = useRef({});

  const [contactPersonNo, setContactPersonNo] = useState("");
  const [contactPersonNoInvalid, setContactPersonNoInvalid] = useState("");
  const contactPersonNoRef = useRef({});

  const [gstNo, setGSTNo] = useState("");
  const [gstNoInvalid, setGSTNoInvalid] = useState("");
  const gstNoRef = useRef({});

  const [panNo, setPANNo] = useState("");
  const [panNoInvalid, setPANNoInvalid] = useState("");
  const panNoRef = useRef({});

  const [display, setDisplay] = useState("");
  const [displayID, setDisplayID] = useState("");
  const [displayInvalid, setDispalyInvalid] = useState("");
  const displayRef = useRef({});

  const [branchLocationName, setBranchLocationName] = useState("");
  const [branchLocationNameInvalid, setBranchLocationNameInvalid] = useState("");
  const branchLocationNameRef = useRef({});

  const [address, setAddress] = useState("");
  const [addressInvalid, setAddressInvalid] = useState("");
  const addressRef = useRef({});

  const [statesFullData, setStatesFullData] = React.useState([]);
  const [statesData, setStatesData] = React.useState([]);
  const [statesID, setStatesID] = React.useState([]);
  const [stateName, setStateName] = React.useState("");
  const [errorSN, setSNError] = React.useState(false);
  const stateRef = useRef({});

  const [cityFullData, setCityFullData] = React.useState([]);
  const [cityData, setCityData] = React.useState([]);
  const [cityID, setCityID] = React.useState([]);
  const [cityName, setCityName] = React.useState("");
  const [errorCN, setCNError] = React.useState(false);
  const cityRef = useRef({});

  const [pincode, setPincode] = useState("");
  const [pincodeInvalid, setPincodeInvalid] = useState("");
  const pincodeRef = useRef({});

  const [accountNo, setAccountNo] = useState("");
  const [accountNoInvalid, setAccountNoInvalid] = useState("");
  const accountNoRef = useRef({});

  const [bankName, setBankName] = useState("");
  const [bankNameInvalid, setBankNameInvalid] = useState("");
  const bankNameRef = useRef({});

  const [bankBranchName, setBankBranchName] = useState("");
  const [bankBranchNameInvalid, setBankBranchNameInvalid] = useState("");
  const bankBranchNameRef = useRef({});

  const [ifscCode, setIfscCode] = useState("");
  const [ifscCodeInvalid, setIfscCodeInvalid] = useState("");
  const ifscCodeRef = useRef({});

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.error);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  //#endregion

  //#region Functions
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      FetchBasicDetails();
      setBloodGroupFullData(BloodGroup);
    }
  };

  let tempStateName = "";
  const FetchBasicDetails = () => {
    let params = {
      ID: route.params.data.id,
    };
    Provider.getAll(`master/getemployeedetailsbyid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            let employee_data = _data.employee;
            let reporting_data = response.data.data[1].employee;
            let bankDetails_data = response.data.data[2].employee;

            setEmployeeName(employee_data.companyName ? employee_data.companyName : "");
            setEemployeeCode(employee_data.companyName ? employee_data.companyName : "");
            setMobileNo(employee_data.companyName ? employee_data.companyName : "");
            setAadharNo(employee_data.companyName ? employee_data.companyName : "");
            setFatherName(employee_data.companyName ? employee_data.companyName : "");
            setAddress(employee_data.companyName ? employee_data.companyName : "");

            if (!NullOrEmpty(employee_data.stateID)) {
              setStatesID(employee_data.stateID);
            }
            if (!NullOrEmpty(employee_data.cityID)) {
              setCityID(employee_data.cityID);
            }
            if (!NullOrEmpty(employee_data.bloodGroup)) {
              setBloodGroupID(employee_data.bloodGroup);
            }

            setPincode(employee_data.pincode !== 0 ? employee_data.pincode.toString() : "");

            setDob(employee_data.dob ? employee_data.dob : "");
            setDoj(employee_data.doj ? employee_data.doj : "");
            setCardValidity(employee_data.doj ? employee_data.doj : "");
            setLwd(employee_data.lastWorkDate ? employee_data.lastWorkDate : "");

            setEmergencyContactName(employee_data.companyName ? employee_data.companyName : "");
            setEmergencyContactNo(employee_data.companyName ? employee_data.companyName : "");
            setLoginActiveStatus(employee_data.companyName ? employee_data.companyName : "");

            if (!NullOrEmpty(employee_data.branchID)) {
              setBranchID(employee_data.branchID);
            }
            if (!NullOrEmpty(employee_data.departmentID)) {
              setDepartmentID(employee_data.departmentID);
            }
            if (!NullOrEmpty(employee_data.designationID)) {
              setDesignationID(employee_data.designationID);
            }

            setEmployeeTypeID(_data.companyName ? _data.companyName : "");

            setWagesTypeID(_data.wagesType ? _data.wagesType : "");
            setSalary(_data.salary ? _data.salary : "");

            //setStateName(_data.stateName === null ? "" : _data.stateName);
            //tempStateName = _data.stateName === null ? "" : _data.stateName;
            //setCityName(_data.cityName === null ? "" : _data.cityName);
            setAccountHolderName(bankDetails_data.accountNumber !== 0 ? bankDetails_data.accountNumber.toString() : "");
            setAccountNo(bankDetails_data.accountNumber !== 0 ? bankDetails_data.accountNumber.toString() : "");
            setBankName(bankDetails_data.bankName ? bankDetails_data.bankName : "");
            setBankBranchName(bankDetails_data.branchName ? bankDetails_data.branchName : "");
            setIfscCode(bankDetails_data.ifscCode ? bankDetails_data.ifscCode : "");

            setLogoImage(employee_data.profilePhoto);
            setImage(employee_data.profilePhoto ? employee_data.profilePhoto : AWSImagePath + "placeholder-image.png");
            setFilePath(employee_data.profilePhoto ? employee_data.profilePhoto : null);
          }
          FetchStates();
          FetchBranch();
          FetchDepartments();
          FetchDesignations();
          FetchReportingEmployee();
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  //#region Dropdown Functions

  const FetchCities = (stateName, stateData) => {
    let params = {
      ID: stateData
        ? stateData.find((el) => {
            return el.stateName === stateName;
          }).id
        : statesFullData.find((el) => {
            return el.stateName === stateName;
          }).id,
    };
    Provider.getAll(`master/getcitiesbyid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setCityFullData(response.data.data);
            const cities = response.data.data.map((data) => data.cityName);
            setCityData(cities);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchStates = () => {
    Provider.getAll("master/getstates")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setStatesFullData(response.data.data);
            const states = response.data.data.map((data) => data.stateName);
            setStatesData(states);
            if (tempStateName !== "") {
              FetchCities(tempStateName, response.data.data);
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchBranch = () => {
    let params = {
      AddedByUserID: userID,
    };
    Provider.getAll(`master/getuserbranchforemployee?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setBranchFullData(response.data.data);
            // const states = response.data.data.map((data) => data.stateName);
            // setStatesData(states);
            // if (tempStateName !== "") {
            //   FetchCities(tempStateName, response.data.data);
            // }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchDepartments = () => {
    let params = {
      UserType: 3,
      UserId: userID,
    };
    Provider.getAll(`master/getuserdepartmentforbranchemployee?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setDepartmentFullData(response.data.data);
            // const states = response.data.data.map((data) => data.stateName);
            // setStatesData(states);
            // if (tempStateName !== "") {
            //   FetchCities(tempStateName, response.data.data);
            // }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchDesignations = () => {
    let params = {
      UserType: 3,
      UserId: userID,
    };
    Provider.getAll(`master/getuserdesignationforbranchemployee?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setDesignationFullData(response.data.data);
            // const states = response.data.data.map((data) => data.stateName);
            // setStatesData(states);
            // if (tempStateName !== "") {
            //   FetchCities(tempStateName, response.data.data);
            // }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchReportingEmployee = () => {
    let params = {
      AddedByUserID: userID,
    };
    Provider.getAll(`master/getreportingemployee?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setReportingFullData(response.data.data);
            // const states = response.data.data.map((data) => data.stateName);
            // setStatesData(states);
            // if (tempStateName !== "") {
            //   FetchCities(tempStateName, response.data.data);
            // }
          }
        }
      })
      .catch((e) => {});
  };

  //#endregion

  useEffect(() => {
    GetUserID();
    //FetchBasicDetails();
  }, []);

  //#region OnChange Function

  const onCompanyNameChanged = (text) => {
    setCompanyName(text);
    setCompanyNameInvalid(false);
  };
  const onBranchTypeChanged = (text) => {
    setBranchType(text);
    setBranchTypeInvalid(false);
  };
  const onAssignBranchChanged = (text) => {
    setAssignBranchAdmin(text);
    setAssignBranchAdminInvalid(false);
  };
  const onContactPersonNoChanged = (text) => {
    setContactPersonNo(text);
    setContactPersonNoInvalid(false);
  };
  const onGstNoChanged = (text) => {
    setGSTNo(text);
    setGSTNoInvalid(false);
  };
  const onPanNoChanged = (text) => {
    setPANNo(text);
    setPANNo(false);
  };
  const onDispalyChanged = (selectedItem) => {
    setDispaly(selectedItem);
    setDispalyInvalid(false);
  };
  const onBranchLocationNameChanged = (text) => {
    setBranchLocationName(text);
    setBranchLocationNameInvalid(false);
  };
  const onAddressChanged = (text) => {
    setAddress(text);
    setAddressInvalid(false);
  };
  const onStateNameSelected = (selectedItem) => {
    setStateName(selectedItem);
    setSNError(false);
    cityRef.current.reset();
    setCityName("");
    FetchCities(selectedItem);
  };
  const onCityNameSelected = (selectedItem) => {
    setCityName(selectedItem);
    setCNError(false);
  };
  const onPincodeChanged = (text) => {
    setPincode(text);
    setPincodeInvalid(false);
  };
  const onAccountNoChanged = (text) => {
    setAccountNo(text);
    setAccountNoInvalid(false);
  };
  const onBankNameChanged = (text) => {
    setBankName(text);
    setBankNameInvalid(false);
  };
  const onBankBranchNameChanged = (text) => {
    setBankBranchName(text);
    setBankBranchNameInvalid(false);
  };
  const onIfscCodeChanged = (text) => {
    setIfscCode(text);
    setIfscCodeInvalid(false);
  };

  //#endregion

  const InsertData = () => {
    const params = {
      UserID: userID,
      CompanyName: companyName,
      CompanyLogo: logoImage ? logoImage : "",
      ContactPersonName: contactName,
      ContactPersonNumber: contactNumber,
      AddressLine: address,
      LocationName: location,
      StateID: stateName ? statesFullData.find((el) => el.stateName === stateName).id : 0,
      CityID: cityName ? cityFullData.find((el) => el.cityName === cityName).id : 0,
      Pincode: pincode ? pincode : 0,
      GSTNumber: gstNumber,
      PAN: panNumber,
      AccountNumber: accountNo ? accountNo : 0,
      BankName: bankName,
      BranchName: bankBranchName,
      IFSCCode: ifscCode,
      CompanyNamePrefix: cnPrefix,
      QuotationBudgetPrefix: qbnPrefix,
      EmployeeCodePrefix: ecPrefix,
      PurchaseOrderPrefix: poPrefix,
      SalesOrderPrefix: soPrefix,
      ShowBrand: false,
    };
    Provider.create("master/insertuserprofile", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          setSnackbarColor(theme.colors.success);
          setSnackbarText("Data updated successfully");
          setSnackbarVisible(true);
        } else {
          setSnackbarColor(theme.colors.error);
          setSnackbarText(communication.UpdateError);
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

  const ValidateData = () => {
    const isValid = true;

    if (isValid) {
      if (filePath !== null) {
        uploadFile();
      } else {
        InsertData();
      }
    }
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "branchDetails":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.padding16]}>
              <TextInput ref={companyNameRef} mode="flat" dense label="Company Name" value={CompanyName} returnKeyType="next" onSubmitEditing={() => companyNameRef.current.focus()} editable={false} selectTextOnFocus={false} onChangeText={onCompanyNameChanged} style={{ backgroundColor: "#cdcdcd" }} error={companyNameInvalid} />
              <HelperText type="error" visible={companyNameInvalid}>
                {communication.InvalidCompanyName}
              </HelperText>

              <TextInput ref={branchTypeRef} mode="flat" dense label="Branch Type" value={branchType} returnKeyType="next" editable={false} selectTextOnFocus={false} onSubmitEditing={() => branchTypeRef.current.focus()} onChangeText={onBranchTypeChanged} style={{ backgroundColor: "#cdcdcd" }} error={branchTypeInvalid} />

              <HelperText type="error" visible={branchTypeInvalid}>
                {communication.InvalidBranchType}
              </HelperText>

              <TextInput ref={assignBranchAdminRef} mode="flat" dense keyboardType="number-pad" label="Assign Branch Admin" value={assignBranchAdmin} returnKeyType="next" onSubmitEditing={() => assignBranchAdminRef.current.focus()} onChangeText={onAssignBranchAdminChanged} style={{ backgroundColor: "white" }} error={assignBranchAdminInvalid} />
              <HelperText type="error" visible={assignBranchAdminInvalid}>
                {communication.InvalidAssignBranchAdmin}
              </HelperText>

              <TextInput ref={contactPersonNoRef} mode="flat" dense label="Conatct Person No" value={contactPersonNo} returnKeyType="next" onSubmitEditing={() => contactPersonNoRef.current.focus()} onChangeText={onContactPersonNoChanged} style={{ backgroundColor: "white" }} error={contactPersonNoInvalid} />
              <HelperText type="error" visible={contactPersonNoInvalid}>
                {communication.InvalidContactPersonNo}
              </HelperText>

              <TextInput ref={gstNoRef} mode="flat" dense label="GST No" value={gstNo} returnKeyType="next" onSubmitEditing={() => gstNoRef.current.focus()} onChangeText={onGstNoChanged} style={{ backgroundColor: "white" }} error={gstNoInvalid} />
              <HelperText type="error" visible={gstNoInvalid}>
                {communication.InvalidGSTNo}
              </HelperText>

              <TextInput ref={panNoRef} mode="flat" dense label="Pan No" value={panNo} returnKeyType="next" onSubmitEditing={() => panNoRef.current.focus()} onChangeText={onPanNoChanged} style={{ backgroundColor: "white" }} error={panNoInvalid} />
              <HelperText type="error" visible={panNoInvalid}>
                {communication.InvalidPANNo}
              </HelperText>

              <Checkbox.Item
                style={Styles.marginTop8}
                label="Display"
                status={checkedDisplay ? "checked" : "unchecked"}
                onPress={() => {
                  setChecked(!checkedDisplay);
                }}
              />
            </View>
          </ScrollView>
        );
      case "locationDetails":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.padding16]}>
              <TextInput ref={branchLocationNameRef} mode="flat" dense label="Branch Location Name" value={branchLocationName} returnKeyType="next" onSubmitEditing={() => branchLocationNameRef.current.focus()} onChangeText={onBranchLocationNameChanged} style={{ backgroundColor: "white" }} error={setBranchLocationNameInvalid} />
              <HelperText type="error" visible={setBranchLocationNameInvalid}>
                {communication.InvalidBranchLocationName}
              </HelperText>

              <TextInput ref={addressRef} mode="flat" dense label="Address" value={address} returnKeyType="next" onSubmitEditing={() => addressRef.current.focus()} onChangeText={onAddressChanged} style={{ backgroundColor: "white" }} error={setAddressInvalid} />
              <HelperText type="error" visible={setAddressInvalid}>
                {communication.InvalidAddress}
              </HelperText>

              <Dropdown label="State" data={statesData} onSelected={onStateNameSelected} isError={errorSN} selectedItem={stateName} />

              <Dropdown label="City" data={cityData} onSelected={onCityNameSelected} isError={errorCN} selectedItem={cityName} reference={cityRef} />

              <TextInput ref={pincodeRef} mode="flat" dense keyboardType="number-pad" label="Pincode" value={pincode} returnKeyType="done" onChangeText={onPincodeChanged} style={{ backgroundColor: "white" }} error={pincodeInvalid} />
            </View>
          </ScrollView>
        );
      case "bankDetails":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.padding16]}>
              <TextInput ref={accountNoRef} mode="flat" dense label="Account Number" value={accountNo} returnKeyType="next" onSubmitEditing={() => bankNameRef.current.focus()} onChangeText={onAccountNoChanged} style={{ backgroundColor: "white" }} error={accountNoInvalid} />
              {/* <HelperText type="error" visible={accountNoInvalid}>
                {communication.InvalidActivityName}
              </HelperText> */}
              <TextInput ref={bankNameRef} mode="flat" dense label="Bank Name" value={bankName} returnKeyType="next" onSubmitEditing={() => bankBranchNameRef.current.focus()} onChangeText={onBankNameChanged} style={{ backgroundColor: "white" }} error={bankNameInvalid} />
              {/* <HelperText type="error" visible={bankNameInvalid}>
                {communication.InvalidActivityName}
              </HelperText> */}
              <TextInput ref={bankBranchNameRef} mode="flat" dense label="Bank Branch Name" value={bankBranchName} returnKeyType="next" onSubmitEditing={() => ifscCodeRef.current.focus()} onChangeText={onBankBranchNameChanged} style={{ backgroundColor: "white" }} error={bankBranchNameInvalid} />
              {/* <HelperText type="error" visible={bankBranchNameInvalid}>
                {communication.InvalidActivityName}
              </HelperText> */}
              <TextInput ref={ifscCodeRef} mode="flat" dense label="IFSC Code" value={ifscCode} returnKeyType="done" onChangeText={onIfscCodeChanged} style={{ backgroundColor: "white" }} error={ifscCodeInvalid} />
              {/* <HelperText type="error" visible={ifscCodeInvalid}>
                {communication.InvalidActivityName}
              </HelperText> */}
            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };
  const renderTabBar = (props) => <TabBar {...props} indicatorStyle={{ backgroundColor: theme.colors.primary }} style={{ backgroundColor: theme.colors.textLight }} inactiveColor={theme.colors.textSecondary} activeColor={theme.colors.primary} scrollEnabled={true} tabStyle={{ width: windowWidth / 4 }} labelStyle={[Styles.fontSize13, Styles.fontBold]} />;
  const [routes] = React.useState([
    { key: "branchDetails", title: "Branch Details" },
    { key: "locationDetails", title: "Location Details" },
    { key: "bankDetails", title: "Bank Details" },
  ]);

  //#endregion

  return (
    isFocused && (
      <View style={[Styles.flex1]}>
        <Header navigation={navigation} title="Add Branch" isDrawer="false" />
        {isLoading ? (
          <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <TabView style={{ marginBottom: 64 }} renderTabBar={renderTabBar} navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} />
        )}
        <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
          <Card.Content>
            <Button mode="contained" onPress={ValidateData} loading={isButtonLoading}>
              Submit
            </Button>
          </Card.Content>
        </View>
        <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
          {snackbarText}
        </Snackbar>
      </View>
    )
  );
};

export default BranchEditScreen;
