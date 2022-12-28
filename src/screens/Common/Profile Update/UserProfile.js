import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions, ScrollView, Image } from "react-native";
import { ActivityIndicator, Button, Card, HelperText, Snackbar, Subheading, Switch, TextInput } from "react-native-paper";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { NullOrEmpty } from "../../../utils/validations";
import { APIConverter } from "../../../utils/apiconverter";

const windowWidth = Dimensions.get("window").width;
let userID = 0,
  groupID = 0;

let st_ID = 0,
  ci_ID = 0;

const UserProfile = ({ route, navigation }) => {
  //#region Variables
  const isFocused = useIsFocused();
  const [index, setIndex] = useState(route.params && route.params.from === "brand" ? 2 : 0);

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

  //const [cityNameList, setCityNameList] = useState<Array<CityModel>>([]);
  const [cityFullData, setCityFullData] = React.useState([]);
  const [cityData, setCityData] = React.useState([]);
  const [cityName, setCityName] = React.useState("");
  const [errorCN, setCNError] = React.useState(false);
  const cityRef = useRef({});

  //const [stateNameList, setStateNameList] = useState<Array<StateModel>>([]);
  const [statesFullData, setStatesFullData] = React.useState([]);
  const [statesData, setStatesData] = React.useState([]);
  const [stateName, setStateName] = React.useState("");
  const [errorSN, setSNError] = React.useState(false);

  const [pincode, setPincode] = useState("");
  const [pincodeInvalid, setPincodeInvalid] = useState("");
  const pincodenRef = useRef({});

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
  const FetchBasicDetails = () => {
    let params = {
      UserID: userID,
    };
    Provider.getAll(`master/getusergeneralprofile?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            if (response.data.data[0] != null) {
              setCompanyName(!NullOrEmpty(response.data.data[0].companyName) ? response.data.data[0].companyName : "");
              setContactName(!NullOrEmpty(response.data.data[0].contactPersonName) ? response.data.data[0].contactPersonName : "");
              setContactNumber(!NullOrEmpty(response.data.data[0].contactPersonNumber) ? response.data.data[0].contactPersonNumber : "");
              setGSTNumber(!NullOrEmpty(response.data.data[0].gstNumber) ? response.data.data[0].gstNumber : "");
              setPANNumber(!NullOrEmpty(response.data.data[0].pan) ? response.data.data[0].pan : "");
              setAddress(!NullOrEmpty(response.data.data[0].addressLine) ? response.data.data[0].addressLine : "");
              setPincode(!NullOrEmpty(response.data.data[0].pincode) ? response.data.data[0].pincode.toString() : "");

              if (!NullOrEmpty(response.data.data[0].stateID)) {
                st_ID = response.data.data[0].stateID;
              }
              if (!NullOrEmpty(response.data.data[0].cityID)) {
                ct_ID = response.data.data[0].cityID;
              }
            }
          }
        }
        FetchStates();
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const FetchStates = () => {
    Provider.getAll("master/getstates")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setStatesFullData(response.data.data);

            const states = response.data.data.map((data) => data.stateName);
            setStatesData(states);

            const stateData = [];
            response.data.data.map((data, i) => {
              stateData.push({
                id: data.id,
                label: data.stateName,
              });
            });
            if (st_ID > 0) {
              let a = stateData.filter((el) => {
                return el.id === st_ID;
              });
              setStateName(a[0].label);
            }
          }

          FetchCities(st_ID);
        }
      })
      .catch((e) => {});
  };

  const FetchCities = (stateID) => {
    let params = {
      ID: stateID,
    };
    Provider.getAll(`master/getcitiesbyid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setCityFullData(response.data.data);
            const cities = response.data.data.map((data) => data.cityName);
            setCityData(cities);

            const cityData = [];
            response.data.data.map((data, i) => {
              cityData.push({
                id: data.id,
                label: data.cityName,
              });
            });

            if (ct_ID > 0) {
              let a = cityData.filter((el) => {
                return el.id === ct_ID;
              });
              setCityName(a[0].label);
            } else {
              setCityNameList([]);
              setCity("");
              ct_ID = 0;
              setCityID(0);
            }
          } else {
            setCityNameList([]);
            setCity("");
            ct_ID = 0;
            setCityID(0);
          }
        }
      })
      .catch((e) => {});
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

  const onCityNameSelected = (selectedItem) => {
    setCityName(selectedItem);
    setCNError(false);
  };

  const onStateNameSelected = (selectedItem) => {
    setStateName(selectedItem);
    setSNError(false);
    cityRef.current.reset();
    setCityName("");

    let s = statesFullData.filter((el) => {
      return el.stateName === selectedItem;
    });

    FetchCities(s[0].id);
  };
  const onPincodeChanged = (text) => {
    setPincode(text);
    setPincodeInvalid(false);
  };

  const InsertData = () => {
    const params = {
      UserID: userID,
      CompanyName: companyName,
      ContactPersonName: contactName,
      ContactPersonNumber: contactNumber,
      AddressLine: address,
      StateID: stateName ? statesFullData.find((el) => el.stateName === stateName).id : 0,
      CityID: cityName ? cityFullData.find((el) => el.cityName === cityName).id : 0,
      Pincode: pincode ? pincode : 0,
      GSTNumber: gstNumber,
      PAN: panNumber,
      ShowBrand: false,
    };
    Provider.create("master/updategeneraluserprofile", params)
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
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Update Profile" isDrawer="false" />
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
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
          <TextInput ref={addressRef} mode="flat" dense label="Location Name" value={address} returnKeyType="next" onSubmitEditing={() => locationRef.current.focus()} onChangeText={onAddressChanged} style={{ backgroundColor: "white" }} error={addressInvalid} />
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
          <TextInput ref={gstNumberRef} mode="flat" dense label="GST No." value={gstNumber} returnKeyType="next" onSubmitEditing={() => panNumberRef.current.focus()} onChangeText={onGSTNumberChanged} style={{ backgroundColor: "white" }} error={gstNumberInvalid} />
          <HelperText type="error" visible={gstNumberInvalid}>
            {communication.InvalidActivityName}
          </HelperText>
          <TextInput ref={panNumberRef} mode="flat" dense label="PAN No." value={panNumber} returnKeyType="next" onSubmitEditing={() => addressRef.current.focus()} onChangeText={onPANNumberChanged} style={{ backgroundColor: "white" }} error={panNumberInvalid} />
          <HelperText type="error" visible={panNumberInvalid}>
            {communication.InvalidActivityName}
          </HelperText>
        </View>
      </ScrollView>
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
  );
};

export default UserProfile;
