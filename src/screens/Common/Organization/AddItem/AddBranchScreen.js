import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions, ScrollView, Keyboard } from "react-native";
import { ActivityIndicator, Button, Card, HelperText, Snackbar, Subheading, Switch, TextInput, Checkbox, RadioButton, Text } from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";
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
import { NullOrEmpty } from "../../../../utils/validations";
import { styles } from "react-native-image-slider-banner/src/style";
import { APIConverter } from "../../../../utils/apiconverter";
import DFButton from "../../../../components/Button";
const windowWidth = Dimensions.get("window").width;
let userID = 0, companyID = 0, groupID = 0;

const BranchEditScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const [index, setIndex] = useState(route.params && route.params.from === "brand" ? 2 : 0);

  //#region Input Variables

  const [companyName, setCompanyName] = useState("");
  const [companyNameId, setCompanyNameId] = useState(0);
  const [companyNameInvalid, setCompanyNameInvalid] = useState("");
  const companyNameRef = useRef({});

  const [branchTypeFullData, setBranchTypeFullData] = React.useState([]);
  const [branchTypeName, setBranchTypeName] = useState("");
  const [branchTypeData, setBranchTypeData] = useState([]);
  const [branchTypeID, setBranchTypeID] = React.useState([]);
  const [branchTypeInvalid, setBranchTypeInvalid] = useState("");
  const [errorBT, setBTError] = React.useState(false);
  const branchTypeRef = useRef({});

  const [regionalOfficeFullData, setRegionalOfficeFullData] = React.useState([]);
  const [regionalOfficeName, setRegionalOfficeName] = useState("");
  const [regionalOfficeData, setRegionalOfficeData] = useState([]);
  const [regionalOfficeID, setRegionalOfficeID] = React.useState([]);
  const [regionalOfficeInvalid, setRegionalOfficeInvalid] = useState("");
  const [errorRO, setROError] = React.useState(false);
  const regionalOfficeRef = useRef({});

  const [assignBranchAdminFullData, setAssignBranchAdminFullData] = React.useState([]);
  const [assignBranchAdminName, setAssignBranchAdminName] = React.useState("");
  const [assignBranchAdminID, setAssignBranchAdminID] = React.useState([]);
  const [assignBranchAdminData, setAssignBranchAdminData] = useState([]);
  const [assignBranchAdminInvalid, setAssignBranchAdminInvalid] = useState("");
  const [errorBA, setBAError] = React.useState(false);
  const assignBranchAdminRef = useRef({});

  const [contactPersonNo, setContactPersonNo] = useState("");
  const [contactPersonNoInvalid, setContactPersonNoInvalid] = useState("");
  const contactPersonNoRef = useRef({});

  const [gstNo, setGSTNo] = useState(route.params.type === "edit" ? route.params.data.gstNo : "");
  const [gstNoInvalid, setGSTNoInvalid] = useState("");
  const gstNoRef = useRef({});

  const [panNo, setPANNo] = useState(route.params.type === "edit" ? route.params.data.panNo : "");
  const [panNoInvalid, setPANNoInvalid] = useState("");
  const panNoRef = useRef({});

  const [display, setDisplay] = useState(route.params.type === "edit" ? route.params.data.display : false);
  const [displayID, setDisplayID] = useState("");
  const [displayInvalid, setDisplayInvalid] = useState("");
  const displayRef = useRef({});

  const [branchLocationName, setBranchLocationName] = useState(route.params.type === "edit" ? route.params.data.locationName.toString() : "");
  const [branchLocationNameInvalid, setBranchLocationNameInvalid] = useState("");
  const branchLocationNameRef = useRef({});

  const [address, setAddress] = useState(route.params.type === "edit" ? route.params.data.address.toString() : "");
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

  const [pincode, setPincode] = useState(route.params.type === "edit" ? route.params.data.pincode.toString() : "");
  const [pincodeInvalid, setPincodeInvalid] = useState("");
  const pincodeRef = useRef({});

  const [accountNo, setAccountNo] = useState(route.params.type === "edit" ? route.params.data.accountNo.toString() : "");
  const [accountNoInvalid, setAccountNoInvalid] = useState("");
  const accountNoRef = useRef({});

  const [bankName, setBankName] = useState(route.params.type === "edit" ? route.params.data.bankName.toString() : "");
  const [bankNameInvalid, setBankNameInvalid] = useState("");
  const bankNameRef = useRef({});

  const [bankBranchName, setBankBranchName] = useState(route.params.type === "edit" ? route.params.data.bankBranchName.toString() : "");
  const [bankBranchNameInvalid, setBankBranchNameInvalid] = useState("");
  const bankBranchNameRef = useRef({});

  const [ifscCode, setIfscCode] = useState(route.params.type === "edit" ? route.params.data.ifscCode.toString() : "");
  const [ifscCodeInvalid, setIfscCodeInvalid] = useState("");
  const ifscCodeRef = useRef({});

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.error);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const [showRO, setShowRO] = React.useState(false);
  const [arnID, setArnID] = useState(0);
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);
  //#endregion

  //#region Functions
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      companyID = JSON.parse(userData).Sess_company_refno;
      groupID = JSON.parse(userData).Sess_group_refno;

      FetchCompanyName();
      FetchBranchType();
      FetchStates();

      if (route.params.type === "edit") {
        FetchAssignBranchAdmin(route.params.data.branchAdminID);
        if (route.params.data.branchTypeID == 3) {
          FetchRegionalOffice(route.params.data.branchTypeID);
          setShowRO(true);
        }
      }
      else {
        FetchAssignBranchAdmin();
      }
      setIsLoading(false);
    }
  };

  let tempStateName = "";

  //#region Dropdown Functions

  const FetchCompanyName = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID
      }
    };
    Provider.createDFCommon(Provider.API_URLS.CompanyBranchForm, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data, false, "addbranch");
            setCompanyName(response.data.data[0].companyName);
            setCompanyNameId(response.data.data[0].companyID);
            //setPANNo(response.data.data[0].pan);
          }
        }
      })
      .catch((e) => { });
  };

  const FetchCities = (stateName, stateData) => {

    let params = {
      data: {
        Sess_UserRefno: userID,
        state_refno: stateData
          ? stateData.find((el) => {
            return el.stateName === stateName;
          }).stateID
          : statesFullData.find((el) => {
            return el.stateName === stateName;
          }).stateID
      }
    };

    Provider.createDFCommon(Provider.API_URLS.GetDistrictDetailsByStateRefno, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);

            setCityFullData(response.data.data);
            const cities = response.data.data.map((data) => data.cityName);
            setCityData(cities);

            if (route.params.type === "edit" && route.params.data.cityID > 0) {

              setCityID(route.params.data.cityID);

              let s = response.data.data.filter((el) => {
                return el.cityID === route.params.data.cityID;
              });
              setCityName(s[0].cityName);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchStates = () => {
    Provider.createDFCommonWithouParam(Provider.API_URLS.GetStateDetails)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setStatesFullData(response.data.data);
            const states = response.data.data.map((data) => data.stateName);
            setStatesData(states);

            if (route.params.type === "edit" && route.params.data.stateID > 0) {
              setStatesID(route.params.data.stateID);
              let s = response.data.data.filter((el) => {
                return el.stateID === route.params.data.stateID;
              });
              setStateName(s[0].stateName);
              FetchCities(s[0].stateName, response.data.data);
            }

            if (tempStateName !== "") {
              FetchCities(tempStateName, response.data.data);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchBranchType = (arnID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID,
        Sess_group_refno: groupID
      }
    };
    Provider.createDFCommon(Provider.API_URLS.MyFetchBranchtype, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data, false, "addbranch");
            const bt = response.data.data.map((data) => data.branchType);
            setBranchTypeData(bt);
            setBranchTypeFullData(response.data.data);
            if (route.params.type === "edit" && route.params.data.branchTypeID > 0) {
              setBranchTypeID(route.params.data.branchTypeID);
              setBranchTypeName(route.params.data.branchType);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchRegionalOffice = (branchTypeID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID,
        Sess_group_refno: groupID,
        locationtype_refno: branchTypeID

      }
    };
    Provider.createDFCommon(Provider.API_URLS.MyFetchRegionalOffice, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {

            response.data.data = APIConverter(response.data.data);

            const ro = response.data.data.map((data) => data.locationName);
            setRegionalOfficeData(ro);
            setRegionalOfficeFullData(response.data.data);

            if (route.params.type === "edit" && route.params.data.regionalOfficeID > 0) {
              setShowRO(true);
              setRegionalOfficeID(route.params.data.cityID);
              let s = response.data.data.filter((el) => {
                return el.id === route.params.data.regionalOfficeID;
              });
              setRegionalOfficeName(s[0].locationName);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchBranchInchargeContactNo = (assignBranchAdminID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID,
        incharge_user_refno: assignBranchAdminID,
      }
    };
    Provider.createDFCommon(Provider.API_URLS.FetchBranchAssignContactNo, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setContactPersonNo(response.data.data[0].incharge_mobile_no);
          }
        }
      })
      .catch((e) => { });
  };


  const FetchAssignBranchAdmin = (inchargeID = null) => {
    let params = null, url = "";
    if (inchargeID == null) {
      url = Provider.API_URLS.MyFetchBranchAssign;
      params = {
        data: {
          Sess_UserRefno: userID,
          Sess_company_refno: companyID,
        }
      };
    }
    else {
      url = Provider.API_URLS.getassignbranchadminedit_branchform;
      params = {
        data: {
          Sess_UserRefno: userID,
          Sess_company_refno: companyID,
          incharge_user_refno: inchargeID
        }
      }
    }

    Provider.createDFCommon(url, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            //response.data.data);
            response.data.data = APIConverter(response.data.data);

            setAssignBranchAdminFullData(response.data.data);
            const ba = response.data.data.map((data) => data.employeeName);
            setAssignBranchAdminData(ba);

            if (route.params.type === "edit" && route.params.data.branchAdminID > 0) {

              setAssignBranchAdminID(route.params.data.branchAdminID);
              let e = response.data.data.filter((el) => {
                return el.id === route.params.data.branchAdminID;
              });
              setAssignBranchAdminName(e[0].employeeName);
              //setContactPersonNo(e[0].mobileNo);
            }
          }
        }
      })
      .catch((e) => { });
  };


  //#endregion

  useEffect(() => {
    GetUserID();
  }, []);

  //#region OnChange Function


  const onBranchTypeChanged = (text) => {
    setBranchType(text);
    setBranchTypeInvalid(false);
  };

  const onAssignBranchChanged = (text) => {
    setAssignBranchAdmin(text);
    setAssignBranchAdminInvalid(false);
    setContactPersonNo(contactPersonNo);
  };


  const onGstNoChanged = (text) => {
    setGSTNo(text);
    setGSTNoInvalid(false);
  };

  const onPanNoChanged = (text) => {
    setPANNo(text);
    setPANNoInvalid(false);
  };

  const onDispalyChanged = (selectedItem) => {
    setDisplay(selectedItem);
    setDisplayInvalid(false);
  };

  const onBranchLocationNameChanged = (text) => {
    setBranchLocationName(text);
    setBranchLocationNameInvalid("");
  };

  const onAddressChanged = (text) => {
    setAddress(text);
    setAddressInvalid(false);
  };

  const onBranchTypeSelected = (selectedItem) => {
    setBranchTypeName(selectedItem);
    setBTError(false);
    let bt = branchTypeFullData.filter((el) => {
      return el.branchType === selectedItem;
    });

    setRegionalOfficeInvalid("");
    setROError(false);

    if (bt[0].branchTypeID == 3) {
      FetchRegionalOffice(bt[0].branchTypeID);
      setShowRO(true);
    }
    else {
      setShowRO(false);
    }

  };

  const onRegionalOfficeSelected = (selectedItem) => {
    setRegionalOfficeName(selectedItem);
    setROError(false);
    //cityRef.current.reset();
    //setCityName("");
    //FetchCities(selectedItem);
  };

  const onBranchAdminSelected = (selectedItem) => {
    setAssignBranchAdminName(selectedItem);
    setBAError(false);

    let e = assignBranchAdminFullData.filter((el) => {
      return el.employeeName === selectedItem;
    });
    //setContactPersonNo(e[0].mobileNo);
    FetchBranchInchargeContactNo(e[0].id);
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

  //#region Functions

  const InsertData = () => {
    let roID = 0;
    if (showRO) {
      roID = regionalOfficeFullData.find((el) => {
        return el.locationName && el.locationName === regionalOfficeName;
      }).id;
    }
    const params = {
      data: {
        Sess_UserRefno: userID,
        company_refno: companyID,
        parent_branch_refno: roID == 0 ? "0" : roID,
        incharge_user_refno: assignBranchAdminFullData.filter((el) => {
          return el.employeeName === assignBranchAdminName;
        })[0].id,
        locationtype_refno: branchTypeFullData.filter((el) => {
          return el.branchType === branchTypeName;
        })[0].branchTypeID,
        location_name: branchTypeName,
        address: address,
        pincode: pincode == "" ? 0 : pincode,
        district_refno: cityFullData.find((el) => {
          return el.cityName && el.cityName === cityName;
        }).cityID,
        state_refno: statesFullData.find((el) => {
          return el.stateName && el.stateName === stateName;
        }).stateID,
        gst_no: gstNo,
        pan_no: panNo,
        bank_account_no: accountNo,
        bank_name: bankName,
        bank_branch_name: bankBranchName,
        ifsc_code: ifscCode,
        view_status: checked ? "1" : "0",
      }
    };
    Provider.createDFCommon(Provider.API_URLS.AddBranch, params)
      .then((response) => {
        setIsButtonLoading(false);
        if (response.data && response.data.code === 200) {
          route.params.fetchData("add");
          navigation.goBack();
        } else {
          setSnackbarColor(theme.colors.error);
          setSnackbarText(response.data.message);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsButtonLoading(false);
        setSnackbarColor(theme.colors.error);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const UpdateData = () => {

    let roID = 0;
    if (showRO) {
      roID = regionalOfficeFullData.find((el) => {
        return el.locationName && el.locationName === regionalOfficeName;
      }).id;
    }

    const params = {

      data: {
        Sess_UserRefno: userID,
        branch_refno: route.params.data.id,
        company_refno: companyID,
        parent_branch_refno: roID == 0 ? "0" : roID,
        incharge_user_refno: assignBranchAdminFullData.filter((el) => {
          return el.employeeName === assignBranchAdminName;
        })[0].id,
        locationtype_refno: branchTypeFullData.filter((el) => {
          return el.branchType === branchTypeName;
        })[0].branchTypeID,

        location_name: branchTypeName,
        address: address == undefined ? "" : address,
        pincode: pincode == "" ? 0 : pincode,
        district_refno: cityFullData.find((el) => {
          return el.cityName && el.cityName === cityName;
        }).cityID,
        state_refno: statesFullData.find((el) => {
          return el.stateName && el.stateName === stateName;
        }).stateID,

        gst_no: gstNo,
        pan_no: panNo,
        bank_account_no: accountNo,
        bank_name: bankName,
        bank_branch_name: bankBranchName,
        ifsc_code: ifscCode,
        view_status: checked ? "1" : "0",
      }
    };
    Provider.createDFCommon(Provider.API_URLS.EditBranch, params)
      .then((response) => {
        setIsButtonLoading(false);
        if (response.data && response.data.code === 200) {
          route.params.fetchData("update");
          navigation.goBack();
        } else {
          setSnackbarColor(theme.colors.error);
          setSnackbarText(response.data.message);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setIsButtonLoading(false);
        setSnackbarColor(theme.colors.error);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const ValidateData = () => {
    let isValid = true;

    if (isValid) {
      if (companyName.trim() === "") {
        setComapnyNameInvalid(true);
        isValid = false;
      }
      if (branchTypeName.length === 0) {
        setBranchTypeInvalid(true);
        isValid = false;
      }
      if (showRO && regionalOfficeName.length === 0) {
        setRegionalOfficeInvalid(true);
        isValid = false;
      }

      if (branchLocationName.trim() === "") {
        setBranchLocationNameInvalid(true);
        isValid = false;
      }

      const objState = statesFullData.find((el) => {
        return el.stateName && el.stateName === stateName;
      });
      if (stateName.length === 0 || !objState) {
        setSNError(true);
        isValid = false;
      }
      const objCity = cityFullData.find((el) => {
        return el.cityName && el.cityName === cityName;
      });
      if (cityName.length === 0 || !objCity) {
        setCNError(true);
        isValid = false;
      }
      if (isValid) {
        setIsButtonLoading(true);
        if (route.params.type === "edit") {
          UpdateData();
        }
        else {
          InsertData();
        }
      }
    }
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "branchDetails":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.padding16]}>
              <TextInput ref={companyNameRef} mode="outlined" dense label="Company / Firm Name"
                value={companyName} returnKeyType="next" onSubmitEditing={() => companyNameRef.current.focus()}
                editable={false} selectTextOnFocus={false} style={[Styles.backgroundSecondaryColor]}
                error={companyNameInvalid} />
              <HelperText type="error" visible={companyNameInvalid}>
                {communication.InvalidCompanyName}
              </HelperText>

              <Dropdown label="Branch Type" data={branchTypeData} onSelected={onBranchTypeSelected} isError={errorBT} selectedItem={branchTypeName} />
              {showRO &&
                <View style={[Styles.marginTop16]}>
                  <Dropdown label="Select Regional Office" data={regionalOfficeData} onSelected={onRegionalOfficeSelected} isError={errorRO} selectedItem={regionalOfficeName} />
                </View>

              }
              <View style={[Styles.marginTop16]}>
                <Dropdown label="Assign Branch Admin" data={assignBranchAdminData} onSelected={onBranchAdminSelected} isError={errorBA} selectedItem={assignBranchAdminName} />
              </View>

              <TextInput ref={contactPersonNoRef} mode="outlined" dense label="Conatct Person No"
                keyboardType="number-pad" maxLength={10} value={contactPersonNo} returnKeyType="next" editable={false}
                selectTextOnFocus={false} onSubmitEditing={() => contactPersonNoRef.current.focus()}
                style={[Styles.backgroundSecondaryColor]} error={contactPersonNoInvalid} />

              <TextInput ref={gstNoRef} mode="outlined" maxLength={15} dense label="GST No" autoCapitalize='characters'
                autoCorrect={false} value={gstNo} returnKeyType="next" onSubmitEditing={() => gstNoRef.current.focus()} onChangeText={onGstNoChanged} style={{ backgroundColor: "white" }} error={gstNoInvalid} />
              <HelperText type="error" visible={gstNoInvalid}>
                {communication.InvalidGSTNo}
              </HelperText>

              <TextInput ref={panNoRef} mode="outlined" dense label="Pan No" autoCapitalize='characters'
            autoCorrect={false} maxLength={10} value={panNo} returnKeyType="next" onSubmitEditing={() => panNoRef.current.focus()} onChangeText={onPanNoChanged} style={{ backgroundColor: "white" }} error={panNoInvalid} />
              <HelperText type="error" visible={panNoInvalid}>
                {communication.InvalidPANNo}
              </HelperText>

              <Checkbox.Item
                style={Styles.marginTop8}
                label="Display"
                status={checked ? "checked" : "unchecked"}
                onPress={() => {
                  setChecked(!checked);
                }}
              />
            </View>
          </ScrollView>
        );
      case "locationDetails":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.padding16]}>

              <TextInput ref={branchLocationNameRef} mode="outlined" dense label="Branch Location Name" value={branchLocationName} returnKeyType="next" onSubmitEditing={() => branchLocationNameRef.current.focus()} onChangeText={onBranchLocationNameChanged} style={{ backgroundColor: "white" }} error={branchLocationNameInvalid} />
              <HelperText type="error" visible={setBranchLocationNameInvalid}>
                {communication.InvalidBranchLocationName}
              </HelperText>

              <TextInput ref={addressRef} mode="outlined" dense label="Address" value={address} returnKeyType="next" onSubmitEditing={() => addressRef.current.focus()} onChangeText={onAddressChanged} style={{ backgroundColor: "white" }} error={addressInvalid} />
              <View style={[Styles.marginTop16]}>
                <Dropdown label="State" data={statesData} onSelected={onStateNameSelected} isError={errorSN} selectedItem={stateName} />
              </View>
              <View style={[Styles.marginTop16]}>
                <Dropdown label="City" data={cityData} onSelected={onCityNameSelected} isError={errorCN} selectedItem={cityName} reference={cityRef} />
              </View>
              <TextInput ref={pincodeRef} mode="outlined" dense keyboardType="number-pad" label="Pincode" value={pincode} returnKeyType="done" onChangeText={onPincodeChanged} style={{ backgroundColor: "white" }} error={pincodeInvalid} />
            </View>
          </ScrollView>
        );
      case "bankDetails":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.padding16]}>
              <TextInput ref={accountNoRef} mode="outlined" keyboardType={"number-pad"} dense label="Account Number" value={accountNo} returnKeyType="next" onSubmitEditing={() => bankNameRef.current.focus()} onChangeText={onAccountNoChanged} style={{ backgroundColor: "white" }} error={accountNoInvalid} />

              <TextInput ref={bankNameRef} mode="outlined" dense label="Bank Name" value={bankName} returnKeyType="next" onSubmitEditing={() => bankBranchNameRef.current.focus()} onChangeText={onBankNameChanged} style={{ backgroundColor: "white" }} error={bankNameInvalid} />

              <TextInput ref={bankBranchNameRef} mode="outlined" dense label="Bank Branch Name" value={bankBranchName} returnKeyType="next" onSubmitEditing={() => ifscCodeRef.current.focus()} onChangeText={onBankBranchNameChanged} style={{ backgroundColor: "white" }} error={bankBranchNameInvalid} />

              <TextInput ref={ifscCodeRef} mode="outlined" dense label="IFSC Code" value={ifscCode} returnKeyType="done" onChangeText={onIfscCodeChanged} style={{ backgroundColor: "white" }} error={ifscCodeInvalid} />

            </View>
          </ScrollView>
        );
      default:
        return null;
    }
  };
  const renderTabBar = (props) => <TabBar {...props} indicatorStyle={{ backgroundColor: theme.colors.primary }} style={{ backgroundColor: theme.colors.textLight }} inactiveColor={theme.colors.textSecondary} activeColor={theme.colors.primary} scrollEnabled={true} tabStyle={{ width: windowWidth / 3 }} labelStyle={[Styles.fontSize13, Styles.fontBold]} />;

  const [routes] = React.useState([
    { key: "branchDetails", title: "Branch Details" },
    { key: "locationDetails", title: "Location Details" },
    { key: "bankDetails", title: "Bank Details" },
  ]);
  //#endregion 

  return (
    isFocused && (
      <View style={[Styles.flex1]}>
        {isLoading ? (
          <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <TabView style={{ marginBottom: 64 }} renderTabBar={renderTabBar} navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} />
        )}
        <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
          <Card.Content>
            {/* <Button mode="contained" onPress={ValidateData} loading={isButtonLoading}>
              {
                route.params.type === "edit" ? "Update" : "Submit"
              }
            </Button> */}
            <DFButton mode="contained" onPress={ValidateData} title="SAVE" loader={isButtonLoading} >
              {
                route.params.type === "edit" ? "Update" : "Submit"
              }
            </DFButton>
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
