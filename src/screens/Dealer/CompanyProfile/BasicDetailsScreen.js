import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions, ScrollView, Image } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Button, HelperText, Subheading, Switch, TextInput } from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";
import { RNS3 } from "react-native-aws3";
import * as ImagePicker from "expo-image-picker";
import { creds } from "../../../utils/credentials";
import uuid from "react-native-uuid";
import { AWSImagePath } from "../../../utils/paths";

const windowWidth = Dimensions.get("window").width;

const BasicDetailsDealerScreen = ({ navigation }) => {
  const [index, setIndex] = useState(0);

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
  const [citySelectedID, setCitySelectedID] = React.useState("");
  const [errorCN, setCNError] = React.useState(false);

  const [statesFullData, setStatesFullData] = React.useState([]);
  const [statesData, setStatesData] = React.useState([]);
  const [stateName, setStateName] = React.useState("");
  const [stateSelectedID, setStateSelectedID] = React.useState("");
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

  const [logoImage, setLogoImage] = useState(AWSImagePath + "placeholder-image.png");
  const [image, setImage] = useState(AWSImagePath + "placeholder-image.png");
  const [filePath, setFilePath] = useState(null);
  const [errorLogo, setLogoError] = useState(false);

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const FetchCities = () => {
    Provider.getAll("master/getcities")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setCityFullData(response.data.data);
            const cityData = [];
            response.data.data.map((data, i) => {
              if (data.cityName === cityName) {
                setCitySelectedID(i.toString());
              }
              cityData.push({
                id: i.toString(),
                title: data.cityName,
              });
            });
            setCityData(cityData);
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
            const stateData = [];
            response.data.data.map((data, i) => {
              if (data.stateName === stateName) {
                setStateSelectedID(i.toString());
              }
              stateData.push({
                id: i.toString(),
                title: data.stateName,
              });
            });
            setStatesData(stateData);
          }
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    FetchCities();
    FetchStates();
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
    }
  };

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
              <TextInput ref={gstNumberRef} mode="flat" dense keyboardType="decimal-pad" label="GST No." value={gstNumber} returnKeyType="next" onSubmitEditing={() => panNumberRef.current.focus()} onChangeText={onGSTNumberChanged} style={{ backgroundColor: "white" }} error={gstNumberInvalid} />
              <HelperText type="error" visible={gstNumberInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={panNumberRef} mode="flat" dense label="PAN No." value={panNumber} returnKeyType="next" onSubmitEditing={() => addressRef.current.focus()} onChangeText={onPANNumberChanged} style={{ backgroundColor: "white" }} error={panNumberInvalid} />
              <HelperText type="error" visible={panNumberInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={addressRef} mode="flat" dense label="Location Name" value={address} returnKeyType="next" onSubmitEditing={() => locationRef.current.focus()} onChangeText={onAddressChanged} style={{ backgroundColor: "white" }} error={addressInvalid} />
              <HelperText type="error" visible={addressInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={locationRef} mode="flat" dense label="Address" value={location} returnKeyType="next" onSubmitEditing={() => pincodenRef.current.focus()} onChangeText={onLocationChanged} style={{ backgroundColor: "white" }} error={locationInvalid} />
              <HelperText type="error" visible={locationInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <AutocompleteDropdown
                clearOnFocus={false}
                closeOnSubmit={false}
                initialValue={{ id: parseInt(stateSelectedID) }}
                inputContainerStyle={{ backgroundColor: theme.colors.textLight, borderBottomColor: errorSN ? theme.colors.error : theme.colors.textfield, borderBottomWidth: 1 }}
                textInputProps={{
                  value: stateName,
                  placeholder: "State",
                  placeholderTextColor: errorSN ? theme.colors.error : theme.colors.textSecondary,
                }}
                onClear={() => {
                  onStateNameSelected("");
                }}
                onChangeText={(item) => {
                  if (item) {
                    onStateNameSelected(item.title);
                  }
                }}
                onSelectItem={(item) => {
                  if (item) {
                    onStateNameSelected(item.title);
                  }
                }}
                dataSet={statesData}
              />
              <HelperText type="error" visible={errorSN}>
                {communication.InvalidStateName}
              </HelperText>
              <AutocompleteDropdown
                clearOnFocus={false}
                closeOnSubmit={false}
                initialValue={{ id: parseInt(citySelectedID) }}
                inputContainerStyle={{ backgroundColor: theme.colors.textLight, borderBottomColor: errorCN ? theme.colors.error : theme.colors.textfield, borderBottomWidth: 1 }}
                textInputProps={{
                  value: cityName,
                  placeholder: "City",
                  placeholderTextColor: errorCN ? theme.colors.error : theme.colors.textSecondary,
                }}
                onClear={() => {
                  onCityNameSelected("");
                }}
                onChangeText={(item) => {
                  if (item) {
                    onCityNameSelected(item.title);
                  }
                }}
                onSelectItem={(item) => {
                  if (item) {
                    onCityNameSelected(item.title);
                  }
                }}
                dataSet={cityData}
              />
              <HelperText type="error" visible={errorSN}>
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
              <TextInput ref={cnPrefixRef} mode="flat" dense label="Company Name Prefix" value={accountNo} returnKeyType="next" onSubmitEditing={() => ecPrefixRef.current.focus()} onChangeText={onCNPChanged} style={{ backgroundColor: "white" }} error={cnPrefixInvalid} />
              <HelperText type="error" visible={cnPrefixInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={ecPrefixRef} mode="flat" dense label="Employee Code Prefix" value={accountNo} returnKeyType="next" onSubmitEditing={() => poPrefixRef.current.focus()} onChangeText={onECPChanged} style={{ backgroundColor: "white" }} error={ecPrefixInvalid} />
              <HelperText type="error" visible={ecPrefixInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={poPrefixRef} mode="flat" dense label="Purchase Order Prefix" value={accountNo} returnKeyType="next" onSubmitEditing={() => soPrefixRef.current.focus()} onChangeText={onPOPChanged} style={{ backgroundColor: "white" }} error={poPrefixInvalid} />
              <HelperText type="error" visible={poPrefixInvalid}>
                {communication.InvalidActivityName}
              </HelperText>
              <TextInput ref={soPrefixRef} mode="flat" dense label="Sales Order Prefix" value={accountNo} returnKeyType="done" onChangeText={onSOPChanged} style={{ backgroundColor: "white" }} error={soPrefixInvalid} />
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
  const renderTabBar = (props) => <TabBar {...props} indicatorStyle={{ backgroundColor: theme.colors.primary }} style={{ backgroundColor: theme.colors.textLight }} inactiveColor={theme.colors.textSecondary} activeColor={theme.colors.primary} scrollEnabled={true} tabStyle={{ width: windowWidth / 4 }} labelStyle={[Styles.fontSize13, Styles.fontBold]} />;
  const [routes] = React.useState([
    { key: "companyDetails", title: "Company" },
    { key: "bankDetails", title: "Bank" },
    { key: "commonSetup", title: "Common" },
    { key: "logo", title: "Logo" },
  ]);
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Basic Details" />
      <TabView renderTabBar={renderTabBar} navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} />
    </View>
  );
};

export default BasicDetailsDealerScreen;
