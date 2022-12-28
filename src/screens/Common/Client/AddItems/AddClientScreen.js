import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { View, ScrollView } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Subheading, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { APIConverter } from "../../../../utils/apiconverter";

let userID = 0;
const AddClientScreen = ({ route, navigation }) => {
  let addedBy = false;
  if (route.params.data) {
    addedBy = route.params.data.addedBy;
  }

  const [companyName, setCompanyName] = useState(route.params.type === "edit" ? route.params.data.companyName : "");
  const [companyNameInvalid, setCompanyNameInvalid] = useState(false);
  const companyNameRef = useRef({});

  const [contactName, setContactName] = useState(route.params.type === "edit" ? route.params.data.contactPerson : "");
  const [contactNameInvalid, setContactNameInvalid] = useState(false);
  const contactNameRef = useRef({});

  const [contactNumber, setContactNumber] = useState(route.params.type === "edit" ? route.params.data.contactMobileNumber : "");
  const [contactNumberInvalid, setContactNumberInvalid] = useState(false);
  const contactNumberRef = useRef({});

  const [address, setAddress] = useState(route.params.type === "edit" ? route.params.data.address1 : "");
  const [addressInvalid, setAddressInvalid] = useState("");
  const addressRef = useRef({});

  const [cityFullData, setCityFullData] = React.useState([]);
  const [cityData, setCityData] = React.useState([]);
  const [cityName, setCityName] = React.useState(route.params.type === "edit" ? route.params.data.cityName : "");
  const [errorCN, setCNError] = React.useState(false);
  const cityRef = useRef({});

  const [statesFullData, setStatesFullData] = React.useState([]);
  const [statesData, setStatesData] = React.useState([]);
  const [stateName, setStateName] = React.useState(route.params.type === "edit" ? route.params.data.stateName : "");
  const [errorSN, setSNError] = React.useState(false);

  const [pincode, setPincode] = useState(route.params.type === "edit" ? route.params.data.pincode : "");
  const [pincodeInvalid, setPincodeInvalid] = useState(false);
  const pincodenRef = useRef({});

  const [gstNumber, setGSTNumber] = useState(route.params.type === "edit" ? route.params.data.gstNumber : "");
  const [gstNumberInvalid, setGSTNumberInvalid] = useState(false);
  const gstNumberRef = useRef({});

  const [panNumber, setPANNumber] = useState(route.params.type === "edit" ? route.params.data.pan : "");
  const [panNumberInvalid, setPANNumberInvalid] = useState(false);
  const panNumberRef = useRef({});

  const [serviceTypeRoles, setServiceTypeRoles] = useState([
    {
      title: "Vendor",
      isChecked: route.params.type === "edit" && route.params.data.serviceType && route.params.data.serviceType.indexOf("14") !== -1 ? true : false,
    },
    {
      title: "Supplier",
      isChecked: route.params.type === "edit" && route.params.data.serviceType && route.params.data.serviceType.indexOf("13") !== -1 ? true : false,
    },
    {
      title: "Client",
      isChecked: route.params.type === "edit" && route.params.data.serviceType && route.params.data.serviceType.indexOf("8") !== -1 ? true : false,
    },
  ]);
  const [serviceTypeInvalid, setServiceTypeInvalid] = useState(false);

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
    }
  };

  const FetchStates = () => {
    Provider.createDFAdmin(Provider.API_URLS.GetStateEWayBillForm)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setStatesFullData(response.data.data);
            const states = response.data.data.map((data) => data.stateName);
            setStatesData(states);
            if (route.params.type === "edit") {
              FetchCities(route.params.data.stateName, response.data.data);
            }
          }
        }
      })
      .catch((e) => {});
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
          }
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    if (route.params.type !== "edit") {
      setCompanyName("");
      setContactName("");
      setContactNumber("");
      setAddress("");
      setStateName("");
      setCityName("");
      setPincode("");
      setGSTNumber("");
      setPANNumber("");
      setCompanyNameInvalid(false);
      setContactNameInvalid(false);
      setContactNumberInvalid(false);
      setAddressInvalid(false);
      setSNError(false);
      setCNError(false);
      setPincodeInvalid(false);
      setGSTNumberInvalid(false);
      setPANNumberInvalid(false);
      setServiceTypeInvalid(false);
    }
    FetchStates();
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
  const onGSTNumberChanged = (text) => {
    setGSTNumber(text);
    setGSTNumberInvalid(false);
  };
  const onPANNumberChanged = (text) => {
    setPANNumber(text);
    setPANNumberInvalid(false);
  };

  const InsertData = () => {
    let arrServiceTypeRole = [];
    serviceTypeRoles.map((k) => {
      if (k.isChecked) {
        if (k.title === "Vendor") {
          arrServiceTypeRole.push("14");
        } else if (k.title === "Supplier") {
          arrServiceTypeRole.push("13");
        } else if (k.title === "Client") {
          arrServiceTypeRole.push("8");
        }
      }
    });
    const params = {
      data: {
        Sess_UserRefno: userID,
        company_name: companyName,
        contact_person: contactName,
        contact_person_mobile_no: contactNumber,
        address: address,
        state_refno: statesFullData.find((el) => {
          return el.stateName && el.stateName === stateName;
        }).stateID,
        district_refno: cityFullData.find((el) => {
          return el.cityName && el.cityName === cityName;
        }).cityID,
        pincode: pincode,
        gst_no: gstNumber,
        pan_no: panNumber,
        client_role_refno: arrServiceTypeRole.join(","),
        buyercategory_refno: "0",
        view_status: checked,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.ClientCreate, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("add");
          navigation.goBack();
        } else {
          setSnackbarText(communication.InsertError);
          setSnackbarVisible(true);
        }
        setIsButtonLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
        setIsButtonLoading(false);
      });
  };

  const UpdateData = () => {
    let arrServiceTypeRole = [];
    serviceTypeRoles.map((k) => {
      if (k.isChecked) {
        if (k.title === "Vendor") {
          arrServiceTypeRole.push("14");
        } else if (k.title === "Supplier") {
          arrServiceTypeRole.push("13");
        } else if (k.title === "Client") {
          arrServiceTypeRole.push("8");
        }
      }
    });
    const params = {
      data: {
        client_user_refno: route.params.data.id,
        Sess_UserRefno: userID,
        company_name: companyName,
        contact_person: contactName,
        contact_person_mobile_no: contactNumber,
        address: address,
        state_refno: statesFullData.find((el) => {
          return el.stateName && el.stateName === stateName;
        }).id,
        district_refno: cityFullData.find((el) => {
          return el.cityName && el.cityName === cityName;
        }).id,
        pincode: pincode,
        gst_no: gstNumber,
        pan_no: panNumber,
        client_role_refno: arrServiceTypeRole.join(","),
        buyercategory_refno: "0",
        view_status: checked,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.ClientUpdate, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("add");
          navigation.goBack();
        } else {
          setSnackbarText(communication.UpdateError);
          setSnackbarVisible(true);
        }
        setIsButtonLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsButtonLoading(false);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const ValidateData = () => {
    let isValid = true;
    if (companyName.length === 0) {
      setCompanyNameInvalid(true);
      isValid = false;
    }
    if (contactNumber.length === 0) {
      setContactNumberInvalid(true);
      isValid = false;
    }
    if (address.length === 0) {
      setAddressInvalid(true);
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

    const objServiceTypeRoles = serviceTypeRoles.find((el) => {
      return el.isChecked;
    });
    if (!objServiceTypeRoles) {
      setServiceTypeInvalid(true);
      isValid = false;
    }
    if (isValid) {
      setIsButtonLoading(true);
      if (route.params.type === "edit") {
        UpdateData();
      } else {
        InsertData();
      }
    }
  };

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.paddingHorizontal16, Styles.paddingTop16]}>
          <TextInput ref={companyNameRef} disabled={addedBy} mode="flat" dense label="Name / Company Name" value={companyName} returnKeyType="next" onSubmitEditing={() => contactNameRef.current.focus()} onChangeText={onCompanyNameChanged} style={{ backgroundColor: "white" }} error={companyNameInvalid} />
          <HelperText type="error" visible={companyNameInvalid}>
            {communication.InvalidCompanyName}
          </HelperText>
          <TextInput ref={contactNameRef} disabled={addedBy} mode="flat" dense label="Contact Person" value={contactName} returnKeyType="next" onSubmitEditing={() => contactNumberRef.current.focus()} onChangeText={onContactNameChanged} style={{ backgroundColor: "white" }} error={contactNameInvalid} />
          <HelperText type="error" visible={contactNameInvalid}>
            {communication.InvalidContactPerson}
          </HelperText>
          <TextInput ref={contactNumberRef} disabled={addedBy} mode="flat" dense keyboardType="number-pad" label="Contact Mobile No." value={contactNumber} returnKeyType="next" onSubmitEditing={() => addressRef.current.focus()} onChangeText={onContactNumberChanged} style={{ backgroundColor: "white" }} error={contactNumberInvalid} />
          <HelperText type="error" visible={contactNumberInvalid}>
            {communication.InvalidContactMobileNo}
          </HelperText>
          <TextInput ref={addressRef} disabled={addedBy} mode="flat" dense label="Address" value={address} returnKeyType="next" onSubmitEditing={() => pincodenRef.current.focus()} onChangeText={onAddressChanged} style={{ backgroundColor: "white" }} error={addressInvalid} />
          <HelperText type="error" visible={addressInvalid}>
            {communication.InvalidAddress}
          </HelperText>
          <Dropdown label="State" data={statesData} forceDisable={addedBy} onSelected={onStateNameSelected} isError={errorSN} selectedItem={stateName} />
          <HelperText type="error" visible={errorSN}>
            {communication.InvalidState}
          </HelperText>
          <Dropdown label="City" data={cityData} forceDisable={addedBy} onSelected={onCityNameSelected} isError={errorCN} selectedItem={cityName} reference={cityRef} />
          <HelperText type="error" visible={errorCN}>
            {communication.InvalidCity}
          </HelperText>
          <TextInput ref={pincodenRef} mode="flat" disabled={addedBy} dense keyboardType="number-pad" label="Pincode" value={pincode} returnKeyType="next" onSubmitEditing={() => gstNumberRef.current.focus()} onChangeText={onPincodeChanged} style={{ backgroundColor: "white" }} error={pincodeInvalid} />
          <HelperText type="error" visible={pincodeInvalid}>
            {communication.InvalidPincode}
          </HelperText>
          <TextInput ref={gstNumberRef} mode="flat" disabled={addedBy} dense label="GST No." value={gstNumber} returnKeyType="next" onSubmitEditing={() => panNumberRef.current.focus()} onChangeText={onGSTNumberChanged} style={{ backgroundColor: "white" }} error={gstNumberInvalid} />
          <HelperText type="error" visible={gstNumberInvalid}>
            {communication.InvalidGSTNo}
          </HelperText>
          <TextInput ref={panNumberRef} mode="flat" disabled={addedBy} dense label="PAN No." value={panNumber} returnKeyType="done" onChangeText={onPANNumberChanged} style={{ backgroundColor: "white" }} error={panNumberInvalid} />
          <HelperText type="error" visible={panNumberInvalid}>
            {communication.InvalidPANNo}
          </HelperText>
          <Subheading style={{ paddingTop: 24, fontWeight: "bold" }}>Service Provider Roles</Subheading>
          <View style={[Styles.flexRow]}>
            {serviceTypeRoles.map((k, i) => {
              return (
                <View key={i} style={[Styles.flex1]}>
                  <Checkbox.Item
                    label={k.title}
                    position="leading"
                    style={[Styles.paddingHorizontal0]}
                    labelStyle={[Styles.textLeft, Styles.paddingStart4, Styles.fontSize14]}
                    color={theme.colors.primary}
                    status={k.isChecked ? "checked" : "unchecked"}
                    onPress={() => {
                      let temp = serviceTypeRoles.map((u) => {
                        if (k.title === u.title) {
                          return { ...u, isChecked: !u.isChecked };
                        }
                        return u;
                      });
                      setServiceTypeInvalid(false);
                      setServiceTypeRoles(temp);
                    }}
                  />
                </View>
              );
            })}
          </View>
          <HelperText type="error" visible={serviceTypeInvalid}>
            {communication.InvalidServiceTypeRole}
          </HelperText>
          <View style={{ width: 160 }}>
            <Checkbox.Item label="Display" position="leading" style={[Styles.paddingHorizontal0]} labelStyle={[Styles.textLeft, Styles.paddingStart4]} color={theme.colors.primary} status={checked ? "checked" : "unchecked"} onPress={() => setChecked(!checked)} />
          </View>
        </View>
      </ScrollView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content>
          <Button mode="contained" loading={isButtonLoading} disabled={isButtonLoading} onPress={ValidateData}>
            SAVE
          </Button>
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};
export default AddClientScreen;
