import React, { useEffect, useRef, useState } from "react";
import FormData from "form-data";
import { View, Dimensions, ScrollView, Image, Platform } from "react-native";
import { ActivityIndicator, Button, Card, HelperText, Snackbar, Subheading, Switch, TextInput } from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import { AWSImagePath } from "../../../utils/paths";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { APIConverter } from "../../../utils/apiconverter";

const windowWidth = Dimensions.get("window").width;
let userID = 0;

const BasicDetailsScreen = ({ route, navigation }) => {

  //#region Variables
  const isFocused = useIsFocused();
  const [index, setIndex] = useState(route.params && route.params.from === "brand" ? 2 : 0);

  const [companyID, setCompanyID] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyNameInvalid, setCompanyNameInvalid] = useState("");
  const companyNameRef = useRef({});

  const [contactName, setContactName] = useState("");
  const [contactNameInvalid, setContactNameInvalid] = useState("");
  const contactNameRef = useRef({});

  const [contactNumber, setContactNumber] = useState("");
  const [contactNumberInvalid, setContactNumberInvalid] = useState("");
  const contactNumberRef = useRef({});

  const [gstNumber, setGSTNumber] = useState("");
  const [gstNumberInvalid, setGSTNumberInvalid] = useState("");
  const gstNumberRef = useRef({});

  const [panNumber, setPANNumber] = useState("");
  const [panNumberInvalid, setPANNumberInvalid] = useState("");
  const panNumberRef = useRef({});

  const [address, setAddress] = useState("");
  const [addressInvalid, setAddressInvalid] = useState("");
  const addressRef = useRef({});

  const [location, setLocation] = useState("");
  const [locationInvalid, setLocationInvalid] = useState("");
  const locationRef = useRef({});

  const [cityFullData, setCityFullData] = React.useState([]);
  const [cityData, setCityData] = React.useState([]);
  const [cityName, setCityName] = React.useState("");
  const [cityID, setCityID] = React.useState(0);
  const [errorCN, setCNError] = React.useState(false);
  const cityRef = useRef({});

  const [statesFullData, setStatesFullData] = React.useState([]);
  const [statesData, setStatesData] = React.useState([]);
  const [stateName, setStateName] = React.useState("");
  const [stateID, setStateID] = React.useState(0);
  const [errorSN, setSNError] = React.useState(false);

  const [pincode, setPincode] = useState("");
  const [pincodeInvalid, setPincodeInvalid] = useState("");
  const pincodenRef = useRef({});

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

  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const [cnPrefix, setCNPrefix] = useState("");
  const [cnPrefixInvalid, setCNPrefixInvalid] = useState("");
  const cnPrefixRef = useRef({});

  const [ecPrefix, setECPrefix] = useState("");
  const [ecPrefixInvalid, setECPrefixInvalid] = useState("");
  const ecPrefixRef = useRef({});

  const [poPrefix, setPOPrefix] = useState("");
  const [poPrefixInvalid, setPOPrefixInvalid] = useState("");
  const poPrefixRef = useRef({});

  const [soPrefix, setSOPrefix] = useState("");
  const [soPrefixInvalid, setSOPrefixInvalid] = useState("");
  const soPrefixRef = useRef({});

  const [logoImage, setLogoImage] = useState("");
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

  //#region Functions
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      FetchBasicDetails();
    }
  };
  let tempStateName = "";
  let tempCityID = "";
  const FetchBasicDetails = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.GetDealerCompanyBasicDetails, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setCompanyName(response.data.data[0].companyName ? response.data.data[0].companyName : "");
            setCompanyID(response.data.data[0].id ? response.data.data[0].id : "0");
            setContactName(response.data.data[0].contactPersonName ? response.data.data[0].contactPersonName : "");
            setContactNumber(response.data.data[0].contactPersonNumber ? response.data.data[0].contactPersonNumber : "");
            setGSTNumber(response.data.data[0].gstNumber ? response.data.data[0].gstNumber : "");
            setPANNumber(response.data.data[0].pan ? response.data.data[0].pan : "");
            setLocation(response.data.data[0].locationName ? response.data.data[0].locationName : "");
            setAddress(response.data.data[0].addressLine ? response.data.data[0].addressLine : "");
            setStateName(response.data.data[0].stateName === null ? "" : response.data.data[0].stateName);
            setStateID(response.data.data[0].stateID === null ? "" : response.data.data[0].stateID);
            tempStateName = response.data.data[0].stateName === null ? "" : response.data.data[0].stateName;
            setCityName(response.data.data[0].cityName === null ? "" : response.data.data[0].cityName);
            setCityID(response.data.data[0].cityID === null ? "" : response.data.data[0].cityID);
            tempCityID = response.data.data[0].cityID === null ? "" : response.data.data[0].cityID;
            setPincode(response.data.data[0].pincode === null || response.data.data[0].pincode === 0 ? "" : response.data.data[0].pincode.toString());
            setAccountNo(response.data.data[0].accountNumber === null || response.data.data[0].accountNumber === 0 ? "" : response.data.data[0].accountNumber.toString());
            setBankName(response.data.data[0].bankName ? response.data.data[0].bankName : "");
            setBankBranchName(response.data.data[0].branchName ? response.data.data[0].branchName : "");
            setIfscCode(response.data.data[0].ifscCode ? response.data.data[0].ifscCode : "");
            setCNPrefix(response.data.data[0].companyNamePrefix ? response.data.data[0].companyNamePrefix : "");
            setECPrefix(response.data.data[0].employeeCodePrefix ? response.data.data[0].employeeCodePrefix : "");
            setPOPrefix(response.data.data[0].purchaseOrderPrefix ? response.data.data[0].purchaseOrderPrefix : "");
            setSOPrefix(response.data.data[0].salesOrderPrefix ? response.data.data[0].salesOrderPrefix : "");
            setIsSwitchOn(response.data.data[0].showBrand ? (response.data.data[0].showBrand == "1" ? true : false) : false);
            setLogoImage(response.data.data[0].companyLogo);
            setImage(response.data.data[0].companyLogo ? response.data.data[0].companyLogo : AWSImagePath + "placeholder-image.png");
            setFilePath(response.data.data[0].companyLogo ? response.data.data[0].companyLogo : null);
          }
          FetchStates(response.data.data[0].stateID);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const FetchStates = (stateID) => {
    Provider.createDFCommon(Provider.API_URLS.GetStateDetails, null)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setStatesFullData(response.data.data);
            const states = response.data.data.map((data) => data.stateName);
            setStatesData(states);

            if (stateID != "") {
              setStateName(
                response.data.data.find((el) => {
                  return el.stateID == stateID;
                }).stateName
              );
            }
            if (tempStateName) {
              FetchCities(tempStateName, response.data.data);
            } else {
              FetchCities(response.data.data.find((el) => {
                return el.stateID == stateID;
              }).stateName, response.data.data);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchCities = (tempStateName, stateData) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        state_refno: stateData
          ? stateData.find((el) => {
            return el.stateName == tempStateName;
          }).stateID
          : statesFullData.find((el) => {
            return el.stateName == tempStateName;
          }).stateID,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.GetDistrictDetailsByStateRefno, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setCityFullData(response.data.data);
            const cities = response.data.data.map((data) => data.cityName);
            setCityData(cities);
            if (tempCityID) {
              setCityName(
                response.data.data.find((el) => {
                  return el.cityID == tempCityID;
                }).cityName
              );
            }
          }
        }
      })
      .catch((e) => { });
  };

  useEffect(() => {
    GetUserID();
  }, []);

  const onCompanyNameChanged = (text) => {
    setCompanyName(text);
    setCompanyNameInvalid(false);
  };
  const onContactNameChanged = (text) => {
    setContactName(text);
    setContactNameInvalid(false);
  };
  const onContactNumberChanged = (text) => {
    setContactNumber(text);
    setContactNumberInvalid(false);
  };
  const onGSTNumberChanged = (text) => {
    setGSTNumber(text);
    setGSTNumberInvalid(false);
  };
  const onPANNumberChanged = (text) => {
    setPANNumber(text);
    setPANNumberInvalid(false);
  };
  const onAddressChanged = (text) => {
    setAddress(text);
    setAddressInvalid(false);
  };
  const onLocationChanged = (text) => {
    setLocation(text);
    setLocationInvalid(false);
  };
  const onCityNameSelected = (selectedItem) => {
    setCityName(selectedItem);
    setCNError(false);
  };
  const onStateNameSelected = (selectedItem) => {
    setStateName(selectedItem);
    setSNError(false);
    cityRef.current.reset();
    setCityName("");
    FetchCities(selectedItem);
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

  const onCNPChanged = (text) => {
    setCNPrefix(text);
    setCNPrefixInvalid(false);
  };
  const onECPChanged = (text) => {
    setECPrefix(text);
    setECPrefixInvalid(false);
  };
  const onPOPChanged = (text) => {
    setPOPrefix(text);
    setPOPrefixInvalid(false);
  };
  const onSOPChanged = (text) => {
    setSOPrefix(text);
    setSOPrefixInvalid(false);
  };

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

  const InsertData = () => {
    const datas = new FormData();
    const stateData = statesFullData.find((el) => {
      return el.stateName == stateName;
    });
    const cityData = cityFullData.find((el) => {
      return el.cityName == cityName;
    });
    const params = {
      Sess_UserRefno: userID,
      company_refno: companyID,
      company_name: companyName,
      firstname: contactName,
      mobile_no: contactNumber,
      gst_no: gstNumber,
      pan_no: panNumber,
      location_name: location,
      address: address,
      state_refno: stateData ? stateData.stateID : "0",
      district_refno: cityData ? cityData.cityID : "0",
      pincode: pincode,
      bank_account_no: accountNo,
      bank_name: bankName,
      bank_branch_name: bankBranchName,
      ifsc_code: ifscCode,
      if_create_brand: isSwitchOn ? 1 : 0,
      company_name_prefix: cnPrefix,
      quotation_no_prefix: "",
      employee_code_prefix: ecPrefix,
      po_prefix: poPrefix,
      so_prefix: soPrefix,
    };
    datas.append("data", JSON.stringify(params));
    datas.append(
      "company_logo",
      filePath != null && filePath != undefined && filePath.type != undefined && filePath.type != null
        ? {
          name: "appimage1212.jpg",
          type: filePath.type + "/*",
          uri: Platform.OS === "android" ? filePath.uri : filePath.uri.replace("file://", ""),
        }
        : ""
    );
    Provider.createDFCommonWithHeader(Provider.API_URLS.DealerCompanyBasicDetailsUpdate, datas)
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
      InsertData();
    }
  };

  //#endregion

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "companyDetails":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.padding16]}>
              <TextInput ref={companyNameRef} mode="flat" dense label="Company / Firm Name" value={companyName} returnKeyType="next" onSubmitEditing={() => contactNameRef.current.focus()} onChangeText={onCompanyNameChanged} style={{ backgroundColor: "white" }} error={companyNameInvalid} />
              <HelperText type="error" visible={companyNameInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={contactNameRef} mode="flat" dense label="Contact Person Name" value={contactName} returnKeyType="next" onSubmitEditing={() => contactNumberRef.current.focus()} onChangeText={onContactNameChanged} style={{ backgroundColor: "white" }} error={contactNameInvalid} />
              <HelperText type="error" visible={contactNameInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={contactNumberRef} mode="flat" dense keyboardType="number-pad" label="Contact Number" value={contactNumber} returnKeyType="next" onSubmitEditing={() => gstNumberRef.current.focus()} onChangeText={onContactNumberChanged} style={{ backgroundColor: "white" }} error={contactNumberInvalid} />
              <HelperText type="error" visible={contactNumberInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={gstNumberRef} mode="flat" dense label="GST No." value={gstNumber} returnKeyType="next" onSubmitEditing={() => panNumberRef.current.focus()} onChangeText={onGSTNumberChanged} style={{ backgroundColor: "white" }} error={gstNumberInvalid} />
              <HelperText type="error" visible={gstNumberInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={panNumberRef} mode="flat" dense label="PAN No." value={panNumber} returnKeyType="next" onSubmitEditing={() => addressRef.current.focus()} onChangeText={onPANNumberChanged} style={{ backgroundColor: "white" }} error={panNumberInvalid} />
              <HelperText type="error" visible={panNumberInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={addressRef} mode="flat" dense label="Location Name" value={location} returnKeyType="next" onSubmitEditing={() => locationRef.current.focus()} onChangeText={onLocationChanged} style={{ backgroundColor: "white" }} error={locationInvalid} />
              <HelperText type="error" visible={locationInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={locationRef} mode="flat" dense label="Address" value={address} returnKeyType="next" onSubmitEditing={() => pincodenRef.current.focus()} onChangeText={onAddressChanged} style={{ backgroundColor: "white" }} error={addressInvalid} />
              <HelperText type="error" visible={addressInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <Dropdown label="State" data={statesData} onSelected={onStateNameSelected} isError={errorSN} selectedItem={stateName} />
              <HelperText type="error" visible={errorSN}>
                {communication.InvalidStateName}
              </HelperText>
              <Dropdown label="City" data={cityData} onSelected={onCityNameSelected} isError={errorCN} selectedItem={cityName} reference={cityRef} />
              <HelperText type="error" visible={errorCN}>
                {communication.InvalidStateName}
              </HelperText>
              <TextInput ref={pincodenRef} mode="flat" dense keyboardType="number-pad" label="Pincode" value={pincode} returnKeyType="done" onChangeText={onPincodeChanged} style={{ backgroundColor: "white" }} error={pincodeInvalid} />
              <HelperText type="error" visible={pincodeInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
            </View>
          </ScrollView>
        );
      case "bankDetails":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.padding16]}>
              <TextInput ref={accountNoRef} mode="flat" dense label="Account Number" value={accountNo} returnKeyType="next" onSubmitEditing={() => bankNameRef.current.focus()} onChangeText={onAccountNoChanged} style={{ backgroundColor: "white" }} error={accountNoInvalid} />
              <HelperText type="error" visible={accountNoInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={bankNameRef} mode="flat" dense label="Bank Name" value={bankName} returnKeyType="next" onSubmitEditing={() => bankBranchNameRef.current.focus()} onChangeText={onBankNameChanged} style={{ backgroundColor: "white" }} error={bankNameInvalid} />
              <HelperText type="error" visible={bankNameInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={bankBranchNameRef} mode="flat" dense label="Bank Branch Name" value={bankBranchName} returnKeyType="next" onSubmitEditing={() => ifscCodeRef.current.focus()} onChangeText={onBankBranchNameChanged} style={{ backgroundColor: "white" }} error={bankBranchNameInvalid} />
              <HelperText type="error" visible={bankBranchNameInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={ifscCodeRef} mode="flat" dense label="IFSC Code" value={ifscCode} returnKeyType="done" onChangeText={onIfscCodeChanged} style={{ backgroundColor: "white" }} error={ifscCodeInvalid} />
              <HelperText type="error" visible={ifscCodeInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
            </View>
          </ScrollView>
        );
      case "commonSetup":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.padding16]}>
              <View style={[Styles.flexRow, Styles.flexAlignCenter, Styles.marginBottom16]}>
                <Subheading style={[Styles.flexGrow]}>Create Brand & Product</Subheading>
                <Switch value={isSwitchOn} onValueChange={() => setIsSwitchOn(!isSwitchOn)} />
              </View>
              <TextInput ref={cnPrefixRef} mode="flat" dense label="Company Name Prefix" value={cnPrefix} returnKeyType="next" onSubmitEditing={() => ecPrefixRef.current.focus()} onChangeText={onCNPChanged} style={{ backgroundColor: "white" }} error={cnPrefixInvalid} />
              <HelperText type="error" visible={cnPrefixInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={ecPrefixRef} mode="flat" dense label="Employee Code Prefix" value={ecPrefix} returnKeyType="next" onSubmitEditing={() => poPrefixRef.current.focus()} onChangeText={onECPChanged} style={{ backgroundColor: "white" }} error={ecPrefixInvalid} />
              <HelperText type="error" visible={ecPrefixInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={poPrefixRef} mode="flat" dense label="Purchase Order Prefix" value={poPrefix} returnKeyType="next" onSubmitEditing={() => soPrefixRef.current.focus()} onChangeText={onPOPChanged} style={{ backgroundColor: "white" }} error={poPrefixInvalid} />
              <HelperText type="error" visible={poPrefixInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={soPrefixRef} mode="flat" dense label="Sales Order Prefix" value={soPrefix} returnKeyType="done" onChangeText={onSOPChanged} style={{ backgroundColor: "white" }} error={soPrefixInvalid} />
              <HelperText type="error" visible={soPrefixInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
            </View>
          </ScrollView>
        );
      case "logo":
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
  const renderTabBar = (props) =>
    <TabBar {...props} indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{ backgroundColor: theme.colors.textLight }} inactiveColor={theme.colors.textSecondary}
      activeColor={theme.colors.primary} scrollEnabled={true} tabStyle={{ width: windowWidth / 4 }}
      labelStyle={[Styles.fontSize12, Styles.fontBold]} />;

  const [routes] = React.useState([
    { key: "companyDetails", title: "Company" },
    { key: "bankDetails", title: "Bank" },
    { key: "commonSetup", title: "Common" },
    { key: "logo", title: "Logo" },
  ]);
  return (
    isFocused && (
      <View style={[Styles.flex1]}>
        <Header navigation={navigation} title="Basic Details" isDrawer="false" />
        {isLoading ? (
          <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <TabView style={{ marginBottom: 64, }}
            renderTabBar={renderTabBar} navigationState={{ index, routes }}
            renderScene={renderScene} onIndexChange={setIndex} />
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

export default BasicDetailsScreen;
