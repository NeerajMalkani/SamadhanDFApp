import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions, ScrollView, Image, Keyboard } from "react-native";
import { ActivityIndicator, Button, Card, HelperText, Snackbar, Subheading, Switch, TextInput, Checkbox, RadioButton, Text } from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";
import { RNS3 } from "react-native-aws3";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import RadioGroup from "react-native-radio-buttons-group";
import DropDown from "react-native-paper-dropdown";
//import moment from "moment";
import Provider from "../../../../api/Provider";
import Header from "../../../../components/Header";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { creds } from "../../../../utils/credentials";
import { AWSImagePath } from "../../../../utils/paths";
import { NullOrEmpty } from "../../../../utils/validations";
import { BloodGroup } from "../../../../utils/validations";
import { styles } from "react-native-image-slider-banner/src/style";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import { color } from "react-native-reanimated";
const windowWidth = Dimensions.get("window").width;
let userID = 0;

const EmployeeEditScreen = ({ route, navigation }) => {
  const [ETRadioButtons, setETRadioButtons] = useState([
    {
      id: "1", // acts as primary key, should be unique and non-empty string
      label: "Permanent",
      selected: true,
      value: "1",
    },
    {
      id: "2",
      label: "Temporary",
      selected: false,
      value: "2",
    },
    {
      id: "3",
      label: "Releave",
      selected: false,
      value: "3",
    },
  ]);

  const [wagesRadioButtons, setWagesRadioButtons] = useState([
    {
      id: "1", // acts as primary key, should be unique and non-empty string
      label: "Daily",
      value: "0",
    },
    {
      id: "2",
      label: "Monthly",
      value: "1",
    },
  ]);

  function onPressETRadioButton(radioButtonsArray) {
    setETRadioButtons(radioButtonsArray);
  }

  function onPressWagesRadioButton(radioButtonsArray) {
    setWagesRadioButtons(radioButtonsArray);
  }

  const [showDropDown, setShowDropDown] = useState(false);
  const [showMultiSelectDropDown, setShowMultiSelectDropDown] = useState(false);
  const [colors, setColors] = React.useState("");

  const isFocused = useIsFocused();
  const [index, setIndex] = useState(route.params && route.params.from === "brand" ? 2 : 0);

  const [empType, setEmpType] = React.useState();

  const [wType, setWType] = React.useState();

  const colorList = [
    {
      label: "White",
      value: "white",
      selected: true,
    },
    {
      label: "Red",
      value: "red",
      selected: true,
    },
    {
      label: "Blue",
      value: "blue",
      selected: false,
    },
    {
      label: "Green",
      value: "green",
      selected: false,
    },
    {
      label: "Orange",
      value: "orange",
      selected: false,
    },
  ];

  //#region Input Variables

  const [employeeName, setEmployeeName] = useState("");
  const [employeeNameInvalid, setEemployeeNameInvalid] = useState("");
  const employeeNameRef = useRef({});

  const [employeeCode, setEemployeeCode] = useState("");
  const [employeeCodeInvalid, setEemployeeCodeInvalid] = useState("");
  const employeeCodeRef = useRef({});

  const [mobileNo, setMobileNo] = useState("");
  const [mobileNoInvalid, setMobileNoInvalid] = useState("");
  const mobileNoRef = useRef({});

  const [aadharNo, setAadharNo] = useState("");
  const [aadharNoInvalid, setAadharNoInvalid] = useState("");
  const aadharNoRef = useRef({});

  const [fatherName, setFatherName] = useState("");
  const [fatherNameInvalid, setFatherNameInvalid] = useState("");
  const fatherNameRef = useRef({});

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

  const [bloodGroupFullData, setBloodGroupFullData] = React.useState([]);
  const [bloodGroupData, setBloodGroupData] = React.useState([]);
  const [bloodGroupID, setBloodGroupID] = React.useState([]);
  const [bloodGroup, setBloodGroup] = React.useState("");
  const [errorBloodGroup, setBloodGroupError] = React.useState(false);
  const bloodGroupRef = useRef({});

  const [dob, setDob] = useState(new Date());
  const [dobInvalid, setDobInvalid] = useState("");
  const dobRef = useRef({});

  const [doj, setDoj] = useState(new Date());
  const [dojInvalid, setDojInvalid] = useState(new Date());
  const dojRef = useRef({});

  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactNameInvalid, setEmergencyContactNameInvalid] = useState("");
  const emergencyContactNameRef = useRef({});

  const [emergencyContactNo, setEmergencyContactNo] = useState("");
  const [emergencyContactNoInvalid, setEmergencyContactNoInvalid] = useState("");
  const emergencyContactNoRef = useRef({});

  const [cardValidity, setCardValidity] = useState(new Date());
  const [cardValidityInvalid, setCardValidityInvalid] = useState("");
  const cardValidityRef = useRef({});

  const [loginActiveStatus, setLoginActiveStatus] = useState("");
  const [loginActiveStatusInvalid, setLoginActiveStatusInvalid] = useState("");
  const loginActiveStatusRef = useRef({});

  const [branchFullData, setBranchFullData] = React.useState([]);
  const [branchData, setBranchData] = React.useState([]);
  const [branchID, setBranchID] = React.useState([]);
  const [branchName, setBranchName] = React.useState("");
  const [errorBranch, setBranchError] = React.useState(false);
  const branchRef = useRef({});

  const [departmentFullData, setDepartmentFullData] = React.useState([]);
  const [departmentData, setDepartmentData] = React.useState([]);
  const [departmentID, setDepartmentID] = React.useState([]);
  const [departmentName, setDepartmentName] = React.useState("");
  const [errorDepartment, setDepartmentError] = React.useState(false);
  const departmentRef = useRef({});

  const [designationFullData, setDesignationFullData] = React.useState([]);
  const [designationData, setDesignationData] = React.useState([]);
  const [designationID, setDesignationID] = React.useState([]);
  const [designationName, setDesignationName] = React.useState("");
  const [errorDesignation, setDesignationError] = React.useState(false);
  const designationRef = useRef({});

  const [reportingFullData, setReportingFullData] = React.useState([]);
  const [reportingData, setReportingData] = React.useState([]);
  const [reportingID, setReportingID] = React.useState([]);
  const [reportingName, setReportingName] = React.useState("");
  const [errorReporting, setReportingError] = React.useState(false);
  const reportingRef = useRef({});

  const [employeeType, setEmployeeType] = useState("");
  const [employeeTypeID, setEmployeeTypeID] = useState("");
  const [employeeTypeInvalid, setEmployeeTypeInvalid] = useState("");
  const employeeTypeRef = useRef({});

  const [lwd, setLwd] = useState(new Date());
  const [lwdInvalid, setLwdInvalid] = useState("");
  const lwdRef = useRef({});

  const [wagesType, setWagesType] = useState("");
  const [wagesTypeID, setWagesTypeID] = useState("");
  const [wagesTypeInvalid, setWagesTypeInvalid] = useState("");
  const wagesTypeRef = useRef({});

  const [salary, setSalary] = useState("");
  const [salaryInvalid, setSalaryInvalid] = useState("");
  const salaryRef = useRef({});

  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountHolderNameInvalid, setAccountHolderNameInvalid] = useState("");
  const accountHolderNameRef = useRef({});

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

  const [logoImage, setLogoImage] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [image, setImage] = useState(AWSImagePath + "placeholder-image.png");
  const [filePath, setFilePath] = useState(null);
  const [errorLogo, setLogoError] = useState(false);

  const [isImageReplaced, setIsImageReplaced] = React.useState(false);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.error);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  //#endregion

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      setBloodGroupFullData(BloodGroup);
      FetchBasicDetails();
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
            let employee_data = response.data.data[0].employee[0];
            let reporting_data = response.data.data[0].employeeReportingAuthority[0];
            let bankDetails_data = response.data.data[0].bankDetails[0];

            if (!NullOrEmpty(employee_data)) {
              setEmployeeName(employee_data.employeeName ? employee_data.employeeName : "");
              setEemployeeCode(employee_data.employeeCode ? employee_data.employeeCode : "");
              setMobileNo(employee_data.mobileNo ? employee_data.mobileNo : "");
              setAadharNo(employee_data.aadharNo ? employee_data.aadharNo : "");
              setFatherName(employee_data.fatherName ? employee_data.fatherName : "");
              setAddress(employee_data.address ? employee_data.address : "");

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
              if (!NullOrEmpty(employee_data.dob)) {
                setDob(new Date(employee_data.dob));
              }

              if (!NullOrEmpty(employee_data.doj)) {
                setDoj(new Date(employee_data.doj));
              }

              if (!NullOrEmpty(employee_data.idCardValidity)) {
                setCardValidity(new Date(employee_data.idCardValidity));
              }

              if (!NullOrEmpty(employee_data.lastWorkDate)) {
                setLwd(new Date(employee_data.lastWorkDate));
              }

              setEmergencyContactName(employee_data.emergencyContactName ? employee_data.emergencyContactName : "");
              setEmergencyContactNo(employee_data.emergencyContactNo ? employee_data.emergencyContactNo : "");

              setLoginActiveStatus(employee_data.loginStatus ? employee_data.loginStatus : "");

              if (!NullOrEmpty(employee_data.branchID)) {
                setBranchID(employee_data.branchID);
              }
              if (!NullOrEmpty(employee_data.departmentID)) {
                setDepartmentID(employee_data.departmentID);
              }
              if (!NullOrEmpty(employee_data.designationID)) {
                setDesignationID(employee_data.designationID);
              }

              if (!NullOrEmpty(employee_data.employeeType)) {
                {
                  ETRadioButtons.map((r) => {
                    r.selected = false;
                    if (r.value === employee_data.employeeType.toString()) {
                      r.selected = true;
                    }
                  });
                }

                onPressETRadioButton(ETRadioButtons);
                setEmployeeTypeID(employee_data.employeeType ? employee_data.employeeType : "");
              }
              if (!NullOrEmpty(employee_data.wagesType)) {
                setWagesTypeID(employee_data.wagesType == true ? "1" : "0");
                {
                  wagesRadioButtons.map((r) => {
                    r.selected = false;

                    if (r.value === wagesTypeID) {
                      r.selected = true;
                    }
                  });
                }

                onPressWagesRadioButton(wagesRadioButtons);
              }

              setSalary(employee_data.salary ? employee_data.salary : "");

              setLogoImage(employee_data.profilePhoto);
              setImage(employee_data.profilePhoto ? employee_data.profilePhoto : AWSImagePath + "placeholder-image.png");
              setFilePath(employee_data.profilePhoto ? employee_data.profilePhoto : null);
            }

            if (!NullOrEmpty(bankDetails_data)) {
              setAccountHolderName(!NullOrEmpty(bankDetails_data.accountHolderName) ? bankDetails_data.accountHolderName.toString() : "");
              setAccountNo(bankDetails_data.accountNumber !== 0 ? bankDetails_data.accountNumber.toString() : "");
              setBankName(bankDetails_data.bankName ? bankDetails_data.bankName : "");
              setBankBranchName(bankDetails_data.branchName ? bankDetails_data.branchName : "");
              setIfscCode(bankDetails_data.ifscCode ? bankDetails_data.ifscCode : "");
            }
          }
          FetchStates();
          BloodGroupDropdown();
          FetchBranch();
          FetchDepartments();
          FetchDesignations();
          // FetchReportingEmployee();
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
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

            let ct = cityFullData.filter((el) => {
              return el.id.toString() === cityID.toString();
            });
            const cities = response.data.data.map((data) => data.cityName);
            setCityData(cities);
            setCityName(ct[0].cityName);
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
            let st = statesFullData.filter((el) => {
              return el.id.toString() === statesID.toString();
            });
            const states = response.data.data.map((data) => data.stateName);
            setStatesData(states);
            setStateName(st[0].stateName);
            tempStateName = st[0].stateName;
            if (tempStateName !== "") {
              FetchCities(tempStateName, response.data.data);
            }
          }
        }
      })
      .catch((e) => {});
  };

  const BloodGroupDropdown = () => {
    let b = bloodGroupFullData.filter((el) => {
      if (!NullOrEmpty(el)) {
        if (el.ID.toString() === bloodGroupID.toString()) {
          return el;
        }
      }
    });

    const bg = bloodGroupFullData.map((data) => data.Name);
    setBloodGroupData(bg);
    if (!NullOrEmpty(b[0])) {
      setBloodGroup(b[0].Name);
    }
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
            let b = branchFullData.filter((el) => {
              return el.id.toString() === branchID.toString();
            });

            const branch = response.data.data.map((data) => data.locationName);
            setBranchData(branch);
            setBranchName(b[0].locationName);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchDepartments = () => {
    let params = {
      AddedByUserID: userID,
    };
    Provider.getAll(`master/getuserdepartmentforbranchemployee?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setDepartmentFullData(response.data.data);
            let d = departmentFullData.filter((el) => {
              return el.departmentID.toString() === departmentID.toString();
            });
            const department = response.data.data.map((data) => data.departmentName);
            setDepartmentData(department);
            setDepartmentName(d[0].departmentName);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchDesignations = () => {
    let params = {
      AddedByUserID: userID,
    };
    Provider.getAll(`master/getuserdesignationforbranchemployee?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setDesignationFullData(response.data.data);
            let d = designationFullData.filter((el) => {
              return el.designationID.toString() === designationID.toString();
            });
            const designation = response.data.data.map((data) => data.designationName);
            setDesignationData(designation);
            setDesignationName(d[0].designationName);
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
  }, []);

  //#region OnChange Function

  const onEmployeeNameChanged = (text) => {
    setEmployeeName(text);
    setEemployeeNameInvalid(false);
  };
  const onEmployeeCodeChanged = (text) => {
    setEemployeeCode(text);
    setEemployeeCodeInvalid(false);
  };
  const onMobileNoChanged = (text) => {
    setMobileNo(text);
    setMobileNoInvalid(false);
  };
  const onAadharNoChanged = (text) => {
    setAadharNo(text);
    setAadharNoInvalid(false);
  };
  const onFatherNameChanged = (text) => {
    setFatherName(text);
    setFatherNameInvalid(false);
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
  const onBloodGroupSelected = (selectedItem) => {
    setBloodGroup(selectedItem);
    setBloodGroupError(false);
  };

  const onEmergencyContactNameChanged = (text) => {
    setEmergencyContactName(text);
    setEmergencyContactNameInvalid(false);
  };

  const onEmergencyContactNoChanged = (text) => {
    setEmergencyContactNo(text);
    setEmergencyContactNoInvalid(false);
  };

  const onLoginActiveStatusChanged = (text) => {
    setLoginActiveStatus(text);
    setLoginActiveStatusInvalid(false);
  };

  const onBranchChanged = (selectedItem) => {
    setBranchName(selectedItem);
    setBranchError(false);
  };

  const onDepartmentChanged = (selectedItem) => {
    setDepartmentName(selectedItem);
    setDepartmentError(false);
  };

  const onDesignationChanged = (selectedItem) => {
    setDesignationName(selectedItem);
    setDesignationError(false);
  };

  const onReportingChanged = (selectedItem) => {
    setReportingName(selectedItem);
    setReportingError(false);
  };

  const onWagesTypeChanged = (selectedItem) => {
    setWagesType(selectedItem);
    setWagesTypeInvalid(false);
  };

  const onSalaryChanged = (selectedItem) => {
    setSalary(selectedItem);
    setSalaryInvalid(false);
  };

  const onAccountHolderNameChanged = (text) => {
    setAccountHolderName(text);
    setAccountHolderNameInvalid(false);
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

  const chooseFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setLogoError(false);
      const arrExt = result.uri.split(".");
      const unique_id = uuid.v4();
      setLogoImage(AWSImagePath + unique_id + "." + arrExt[arrExt.length - 1]);
      setImage(result.uri);
      setFilePath(result);
      setIsImageReplaced(true);
    }
  };

  const ProfilePhoto = () => {
    if (!isImageReplaced) {
      InsertData();
    } else {
      if (filePath.uri) {
        if (Object.keys(filePath).length == 0) {
          setSnackbarText(communication.NoImageSelectedError);
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
          return;
        }
        RNS3.put(
          {
            uri: filePath.uri,
            name: logoImage.split(AWSImagePath)[1],
            type: "image/*",
          },
          {
            keyPrefix: "",
            bucket: creds.awsBucket,
            region: creds.awsRegion,
            accessKey: creds.awsAccessKey,
            secretKey: creds.awsSecretKey,
            successActionStatus: 201,
          }
        )
          .progress((progress) => {
            setIsButtonLoading(true);
            setSnackbarText(`Uploading: ${progress.loaded / progress.total} (${progress.percent}%)`);
          })
          .then((response) => {
            setIsButtonLoading(false);
            if (response.status !== 201) {
              setSnackbarVisible(true);
              setSnackbarColor(theme.colors.error);
              setSnackbarText(communication.FailedUploadError);
            } else {
              InsertData();
            }
          })
          .catch((ex) => {
            console.log(ex);
            setIsButtonLoading(false);
            setSnackbarVisible(true);
            setSnackbarColor(theme.colors.error);
            setSnackbarText(communication.FailedUploadError);
          });
      } else {
        setSnackbarText(communication.NoImageSelectedError);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
      }
    }
  };

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

  const UpdateData = () => {
    const params = {
      ID: id,
      MobileNo: mobileNo.trim(),
      AadharNo: aadharNo.trim(),
      FatherName: fatherName,
      Address: address,
      StateID: stateName ? statesFullData.find((el) => el.stateName === stateName).id : 0,
      CityID: cityName ? cityFullData.find((el) => el.cityName === cityName).id : 0,
      Pincode: pincode ? pincode : 0,
      ProfilePhoto: profilePhoto ? profilePhoto : "",
      BloodGroup: bloodGroup,
      DOB: dob,
      DOJ: doj,
      EmergencyContactName: emergencyContactName,
      EmergencyContactNo: emergencyContactNo,
      IDCardValidity: cardValidity,
      LoginActiveStatus: loginActiveStatus,
      BranchID: branchID,
      DepartmentID: departmentID,
      DesignationID: designationID,
      EmployeeType: employeeType,
      LastWorkDate: lwd,
      WagesType: wagesType,
      Salary: salary,
      AccountHolderName: accountHolderName,
      AccountNumber: accountNo,
      BankName: bankName,
      BranchName: branchName,
      IFSCCode: ifscCode,
    };
    Provider.create("master/updateemployeedetails", params)
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

    if (NullOrEmpty(employeeName.trim())) {
      isValid = false;
      setEemployeeNameInvalid(true);
    }
    if (NullOrEmpty(employeeCode.trim())) {
      isvalid = false;
      setEemployeeCodeInvalid(true);
    }
    if (NullOrEmpty(mobileNo.trim())) {
      isvalid = false;
      setMobileNoInvalid(true);
    }
    if (NullOrEmpty(aadharNo.trim())) {
      isvalid = false;
      setAadharNoInvalid(true);
    }
    if (NullOrEmpty(fatherName.trim())) {
      isvalid = false;
      setFatherNameInvalid(true);
    }

    if (isValid) {
      UpdateData();
    }
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "basicDetails":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.padding16]}>
              <TextInput ref={employeeNameRef} mode="flat" dense label="Employee Name" value={employeeName} returnKeyType="next" onSubmitEditing={() => employeeNameRef.current.focus()} editable={false} selectTextOnFocus={false} onChangeText={onEmployeeNameChanged} style={{ backgroundColor: "#cdcdcd" }} error={employeeNameInvalid} />
              <HelperText type="error" visible={employeeNameInvalid}>
                {communication.InvalidEmployeeName}
              </HelperText>

              <TextInput ref={employeeCodeRef} mode="flat" dense label="Employee Code" value={employeeCode} returnKeyType="next" editable={false} selectTextOnFocus={false} onSubmitEditing={() => employeeCodeRef.current.focus()} onChangeText={onEmployeeCodeChanged} style={{ backgroundColor: "#cdcdcd" }} error={employeeCodeInvalid} />

              <HelperText type="error" visible={employeeCodeInvalid}>
                {communication.InvalidEmployeeCode}
              </HelperText>

              <TextInput ref={mobileNoRef} mode="flat" dense keyboardType="number-pad" label="Mobile No" value={mobileNo} returnKeyType="next" onSubmitEditing={() => mobileNoRef.current.focus()} onChangeText={onMobileNoChanged} style={{ backgroundColor: "white" }} error={mobileNoInvalid} />
              <HelperText type="error" visible={mobileNoInvalid}>
                {communication.mobileNoInvalid}
              </HelperText>
              <TextInput ref={aadharNoRef} mode="flat" dense label="Aadhar No" value={aadharNo} returnKeyType="next" onSubmitEditing={() => aadharNoRef.current.focus()} onChangeText={onAadharNoChanged} style={{ backgroundColor: "white" }} error={aadharNoInvalid} />
              <HelperText type="error" visible={aadharNoInvalid}>
                {communication.InvalidAadharNo}
              </HelperText>
              <TextInput ref={fatherNameRef} mode="flat" dense label="Father Name" value={fatherName} returnKeyType="next" onSubmitEditing={() => fatherNameRef.current.focus()} onChangeText={onFatherNameChanged} style={{ backgroundColor: "white" }} error={fatherNameInvalid} />
              <HelperText type="error" visible={fatherNameInvalid}>
                {communication.InvalidFatherName}
              </HelperText>
              <TextInput ref={addressRef} mode="flat" dense label="Address" value={address} returnKeyType="next" onSubmitEditing={() => addressRef.current.focus()} onChangeText={onAddressChanged} style={[Styles.marginBottom16, { backgroundColor: "white" }]} error={addressInvalid} />

              <Dropdown label="State" data={statesData} onSelected={onStateNameSelected} isError={errorSN} selectedItem={stateName} />
              <View style={[Styles.height24]}></View>
              <Dropdown label="City" data={cityData} onSelected={onCityNameSelected} isError={errorCN} selectedItem={cityName} reference={cityRef} />

              <TextInput ref={pincodeRef} mode="flat" dense keyboardType="number-pad" label="Pincode" value={pincode} returnKeyType="done" onChangeText={onPincodeChanged} style={[Styles.marginTop24, Styles.marginBottom16, { backgroundColor: "white" }]} error={pincodeInvalid} />

              <Dropdown label="Blood Group" data={bloodGroupData} onSelected={onBloodGroupSelected} isError={errorBloodGroup} selectedItem={bloodGroup} reference={bloodGroupRef} />

              <View>
                <DateTimePicker label="Date of Birth" type="date" value={dob} onChangeDate={setDob} />
              </View>

              <View>
                <DateTimePicker label="Date of Joining" type="date" value={doj} onChangeDate={setDoj} />
              </View>

              <TextInput ref={emergencyContactNameRef} mode="flat" dense label="Emergency Contact Name" value={emergencyContactName} returnKeyType="next" onSubmitEditing={() => emergencyContactNameRef.current.focus()} onChangeText={onEmergencyContactNameChanged} style={[Styles.marginTop16, { backgroundColor: "white" }]} error={emergencyContactNameInvalid} />

              <TextInput ref={emergencyContactNoRef} mode="flat" dense label="Emergency Contact No" value={emergencyContactNo} returnKeyType="next" onSubmitEditing={() => emergencyContactNoRef.current.focus()} onChangeText={onEmergencyContactNoChanged} style={[Styles.marginTop16, { backgroundColor: "white" }]} error={emergencyContactNoInvalid} />

              <View>
                <DateTimePicker label="ID Card Valid Upto" type="date" value={cardValidity} onChangeDate={setCardValidity} />
              </View>

              <Checkbox.Item
                style={Styles.marginTop8}
                label="Login Active Status"
                status={loginActiveStatus ? "checked" : "unchecked"}
                onPress={() => {
                  setLoginActiveStatus(!loginActiveStatus);
                }}
              />
            </View>
          </ScrollView>
        );
      case "workDetails":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.padding16]}>
              <Dropdown label="Branch" data={branchData} onSelected={onBranchChanged} isError={errorBranch} selectedItem={branchName} reference={branchRef} />

              <Dropdown label="Department" data={departmentData} onSelected={onDepartmentChanged} isError={errorDepartment} selectedItem={departmentName} reference={departmentRef} />

              <Dropdown label="Designation" data={designationData} onSelected={onDesignationChanged} isError={errorDesignation} selectedItem={designationName} reference={designationRef} />

              <View style={Styles.marginTop16}>
                <Text>Employee Type</Text>
              </View>

              <RadioGroup containerStyle={[Styles.marginTop16]} layout="row" radioButtons={ETRadioButtons} onPress={onPressETRadioButton} />

              <View style={[Styles.marginTop24, Styles.marginBottom8]}>
                <Text>Reporting to</Text>
              </View>

              <DropDown label={"Colors"} mode={"outlined"} visible={showMultiSelectDropDown} showDropDown={() => setShowMultiSelectDropDown(true)} onDismiss={() => setShowMultiSelectDropDown(false)} value={colors} setValue={setColors} list={colorList} multiSelect />

              <View>
                <DateTimePicker label="Last Working Date" type="date" value={lwd} onChangeDate={setLwd} />
              </View>
            </View>
          </ScrollView>
        );
      case "payDetails":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.padding16]}>
              <View style={Styles.marginTop16}>
                <Text>Wages Type</Text>
              </View>

              <RadioGroup containerStyle={[Styles.marginTop16]} layout="row" radioButtons={wagesRadioButtons} onPress={onPressWagesRadioButton} />

              <TextInput ref={salaryRef} mode="flat" dense keyboardType="number-pad" label="Salary" value={salary} returnKeyType="next" onSubmitEditing={() => salaryRef.current.focus()} onChangeText={onSalaryChanged} style={{ backgroundColor: "white" }} error={salaryInvalid} />

              <TextInput ref={accountHolderNameRef} mode="flat" dense label="Account Holder Name" value={accountHolderName} returnKeyType="next" onSubmitEditing={() => accountHolderNameRef.current.focus()} onChangeText={onAccountHolderNameChanged} style={{ backgroundColor: "white" }} error={accountHolderNameInvalid} />

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
      case "photo":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.flexRow, Styles.flexAlignEnd, Styles.marginTop16]}>
              <Image source={{ uri: image }} style={[Styles.width104, Styles.height96, Styles.border1]} />
              <Button mode="text" onPress={chooseFile}>
                {filePath !== null ? "Replace" : "Choose Image"}
              </Button>
            </View>
            <HelperText type="error" visible={errorLogo}>
              {communication.InvalidDesignImage}
            </HelperText>
          </ScrollView>
        );
      default:
        return null;
    }
  };
  const renderTabBar = (props) => <TabBar {...props} indicatorStyle={{ backgroundColor: theme.colors.primary }} style={{ backgroundColor: theme.colors.textLight }} inactiveColor={theme.colors.textSecondary} activeColor={theme.colors.primary} scrollEnabled={true} tabStyle={{ width: windowWidth / 4 }} labelStyle={[Styles.fontSize13, Styles.fontBold]} />;
  const [routes] = React.useState([
    { key: "basicDetails", title: "Basic Details" },
    { key: "workDetails", title: "Work Details" },
    { key: "payDetails", title: "Pay Details" },
    { key: "photo", title: "Profile Photo" },
  ]);
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
            <Button mode="contained" onPress={ValidateData} loading={isButtonLoading}>
              Update
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

export default EmployeeEditScreen;
