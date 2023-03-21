import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions, ScrollView, Image, Keyboard } from "react-native";
import {
    ActivityIndicator,Button, Card, HelperText, Snackbar, Subheading, Switch, TextInput, Checkbox, RadioButton, Text
} from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import RadioGroup from "react-native-radio-buttons-group";
import DropDown from "react-native-paper-dropdown";
import moment from "moment";
import Provider from "../../../../api/Provider";
import Header from "../../../../components/Header";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { creds } from "../../../../utils/credentials";
import { NullOrEmpty } from "../../../../utils/validations";
import { styles } from "react-native-image-slider-banner/src/style";
import { color } from "react-native-reanimated";
import DFButton from "../../../../components/Button";

let st_ID = 0, ct_ID = 0;

const windowWidth = Dimensions.get("window").width;
let userID = 0;

const ClientEditScreen = ({ route, navigation }) => {

   //#region Variables  
    const [index, setIndex] = useState(0);
    const [serviceTypeRoles, setServiceTypeRoles] = useState([
        {
            title: "Vendor",
            isChecked: false,
            value: 1,
        },
        {
            title: "Supplier",
            isChecked: false,
            value: 2,
        },
        {
            title: "Client",
            isChecked: false,
            value: 3,
        },
    ]);

    const [serviceTypeInvalid, setServiceTypeInvalid] = useState(false);

    const [addedBy, setAddedBy] = useState(false);

    const [companyName, setCompanyName] = useState("");
    const [companyNameInvalid, setCompanyNameInvalid] = useState(false);
    const companyNameRef = useRef({});

    const [contactName, setContactName] = useState("");
    const [contactNameInvalid, setContactNameInvalid] = useState(false);
    const contactNameRef = useRef({});

    const [contactNumber, setContactNumber] = useState("");
    const [contactNumberInvalid, setContactNumberInvalid] = useState(false);
    const contactNumberRef = useRef({});

    const [address, setAddress] = useState("");
    const [addressInvalid, setAddressInvalid] = useState("");
    const addressRef = useRef({});

    const [cityFullData, setCityFullData] = React.useState([]);
    const [cityData, setCityData] = React.useState([]);
    const [cityName, setCityName] = React.useState("");
    const [errorCN, setCNError] = React.useState(false);
    const [cityID, setCityID] = React.useState(0);
    const cityRef = useRef({});

    const [statesFullData, setStatesFullData] = React.useState([]);
    const [statesData, setStatesData] = React.useState([]);
    const [statesID, setStatesID] = React.useState(0);
    const [stateName, setStateName] = React.useState("");
    const [errorSN, setSNError] = React.useState(false);

    const [pincode, setPincode] = useState("");
    const [pincodeInvalid, setPincodeInvalid] = useState(false);
    const pincodenRef = useRef({});

    const [gstNumber, setGSTNumber] = useState("");
    const [gstNumberInvalid, setGSTNumberInvalid] = useState(false);
    const gstNumberRef = useRef({});

    const [panNumber, setPANNumber] = useState("");
    const [panNumberInvalid, setPANNumberInvalid] = useState(false);
    const panNumberRef = useRef({});
    const [checked, setChecked] = React.useState(true);

    const isFocused = useIsFocused();

    const [isButtonLoading, setIsButtonLoading] = React.useState(false);

    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.error);
    const [snackbarText, setSnackbarText] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [serviceType, setServiceType] = React.useState(0);
 //#endregion 

 //#region Functions
    useEffect(() => {
        GetUserID();
    }, []);

    const GetUserID = async () => {
        const userData = await AsyncStorage.getItem("user");
        if (userData !== null) {
            userID = JSON.parse(userData).UserID;
            FetchClientDetails();
        }
    };

    let tempStateName = "";
    const FetchClientDetails = () => {
        let params = {
            ID: route.params.data.id,
            AddedByUserID: userID
        };
        Provider.getAll(`contractorquotationestimation/getclientbyid?${new URLSearchParams(params)}`)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        setAddedBy(!NullOrEmpty(response.data.data[0].addedBy) ? !(response.data.data[0].addedBy) : false);
                        setCompanyName(!NullOrEmpty(response.data.data[0].companyName) ? response.data.data[0].companyName : "");
                        setContactName(!NullOrEmpty(response.data.data[0].contactPerson) ? response.data.data[0].contactPerson : "");
                        setContactNumber(!NullOrEmpty(response.data.data[0].contactMobileNumber) ? response.data.data[0].contactMobileNumber : "");
                        setAddress(!NullOrEmpty(response.data.data[0].address1) ? response.data.data[0].address1 : "");
                        setPincode(NullOrEmpty(response.data.data[0].pincode) ? "" : response.data.data[0].pincode !== 0 ? response.data.data[0].pincode.toString() : "");
                        setGSTNumber(!NullOrEmpty(response.data.data[0].gstNumber) ? response.data.data[0].gstNumber : "");
                        setPANNumber(!NullOrEmpty(response.data.data[0].pan) ? response.data.data[0].pan : "");

                        setST(!NullOrEmpty(response.data.data[0].serviceType) ? response.data.data[0].serviceType : "");

                        if (!NullOrEmpty(response.data.data[0].stateID)) {
                            setStatesID(response.data.data[0].stateID);
                            st_ID = response.data.data[0].stateID;
                        }

                        if (!NullOrEmpty(response.data.data[0].cityID)) {
                            setCityID(response.data.data[0].cityID);
                            ct_ID = response.data.data[0].cityID;
                        }



                        FetchStates();
                        setIsLoading(false);
                    }
                }
            })
            .catch((e) => {
                console.log(e);
                setIsLoading(false);
            });
    };

    //#region Dropdown Functions

    const FetchCities = (stateID) => {
        let params = {
            ID: stateID
        };
        Provider.getAll(`master/getcitiesbyid?${new URLSearchParams(params)}`)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        setCityFullData(response.data.data);

                        const cities = response.data.data.map((data) => data.cityName);
                        setCityData(cities);

                        if (ct_ID > 0) {
                            let a = response.data.data.filter((el) => {
                                return el.id === ct_ID;
                            });
                            setCityName(a[0].cityName);
                            setCityID(a[0].id);
                        }
                        else {
                            setCityNameList([]);
                            setCityName("");
                            setCity("");
                            ct_ID = 0;
                            setCityID(0);
                        }

                    }
                }
            })
            .catch((e) => { });
    };

    const FetchStates = () => {
        Provider.getAll("master/getstates")
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {

                        setStatesFullData(response.data.data);

                        const states = response.data.data.map((data) => data.stateName);
                        setStatesData(states);
                        if (st_ID > 0) {
                            let s = response.data.data.filter((el) => {
                                return el.id === st_ID;
                            });

                            setStateName(s[0].stateName);
                            setStatesID(s[0].id);
                            tempStateName = s[0].stateName;
                        }

                        if (tempStateName !== "") {
                            FetchCities(st_ID);
                        }
                    }
                }
            })
            .catch((e) => { });
    };

    const setST = (serviceType) => {
        let st = serviceType.toString().split('');
        serviceTypeRoles.map((k, i) => {
            if(st.includes(k.value.toString())) {
                k.isChecked = true;
            }
            else {
                k.isChecked = false;
            }
        });
    };

    //#endregion

    //#region OnChange Function

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

    //#endregion

    const UpdateData = () => {
        let arrServiceTypeRole = [];
        serviceTypeRoles.map((k, i) => {
            if (k.isChecked) {
                arrServiceTypeRole.push(parseInt(i) + 1);
            }
        });

        const params = {
            ID: route.params.data.id,
            CompanyName: companyName,
            ContactPerson: contactName,
            ContactMobileNumber: contactNumber,
            Address1: address,
            StateID: stateName ? statesFullData.find((el) => el.stateName === stateName).id : 0,
            CityID: cityName ? cityFullData.find((el) => el.cityName === cityName).id : 0,
            Pincode: pincode,
            GSTNumber: gstNumber,
            PAN: panNumber,
            ServiceType: arrServiceTypeRole.join(""),
            Display: NullOrEmpty(checked) ? false : checked,
        };
        Provider.create("contractorquotationestimation/updateclient", params)
            .then((response) => {
                setIsButtonLoading(false);
                if (response.data && response.data.code === 200) {
                    setSnackbarColor(theme.colors.success);
                    setSnackbarText("Data updated successfully");
                    setSnackbarVisible(true);
                    setTimeout(() => { navigation.navigate("ClientScreen") }, 500)
                    
                } else {
                    setSnackbarColor(theme.colors.error);
                    setSnackbarText(communication.UpdateError);
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
        const isValid = true;

        if (NullOrEmpty(companyName.trim())) {
            isValid = false;
            setCompanyNameInvalid(true);
        }

        if (NullOrEmpty(contactNumber.trim())) {
            isvalid = false;
            setContactNumberInvalid(true);
        }

        if (NullOrEmpty(address.trim())) {
            isvalid = false;
            setAddressInvalid(true);
        }

        if (NullOrEmpty(stateName.trim())) {
            isvalid = false;
            setSNError(true);
        }

        if (NullOrEmpty(cityName.trim())) {
            isvalid = false;
            setCNError(true);
        }

        if (isValid) {
            setIsButtonLoading(true);
            UpdateData();
        }
    };
 //#endregion 
    return (
        isFocused && (
            <View style={[Styles.flex1]}>
                {isLoading ? (
                    <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                ) : (
                    <ScrollView style={[Styles.flex1, Styles.backgroundColor, Styles.marginBottom64]}>
                        <View style={[Styles.padding16]}>
                            <TextInput ref={companyNameRef} disabled={addedBy} mode="outlined" dense label="Name / Company Name" value={companyName} returnKeyType="next"
                                onSubmitEditing={() => contactNameRef.current.focus()} onChangeText={onCompanyNameChanged} style={{ backgroundColor: "white" }}
                                error={companyNameInvalid} />
                            <HelperText type="error" visible={companyNameInvalid}>
                                {communication.InvalidCompanyName}
                            </HelperText>
                            <TextInput ref={contactNameRef} disabled={addedBy} mode="outlined" dense label="Contact Person" value={contactName} returnKeyType="next"
                                onSubmitEditing={() => contactNumberRef.current.focus()} onChangeText={onContactNameChanged} style={{ backgroundColor: "white" }}
                                error={contactNameInvalid} />
                            <HelperText type="error" visible={contactNameInvalid}>
                                {communication.contactNameInvalid}
                            </HelperText>

                            <TextInput ref={contactNumberRef} disabled={addedBy} mode="outlined" dense keyboardType="number-pad" label="Contact Mobile No." value={contactNumber}
                                returnKeyType="next" onSubmitEditing={() => addressRef.current.focus()} onChangeText={onContactNumberChanged} style={{ backgroundColor: "white" }}
                                error={contactNumberInvalid} />
                            <HelperText type="error" visible={contactNumberInvalid}>
                                {communication.InvalidContactMobileNo}
                            </HelperText>
                            <TextInput ref={addressRef} disabled={addedBy} mode="flat" dense label="Address" value={address} returnKeyType="next"
                                onSubmitEditing={() => pincodenRef.current.focus()} onChangeText={onAddressChanged} style={{ backgroundColor: "white" }} error={addressInvalid} />
                            <HelperText type="error" visible={addressInvalid}>
                                {communication.InvalidAddress}
                            </HelperText>
                            <Dropdown label="State" data={statesData} forceDisable={addedBy} onSelected={onStateNameSelected} isError={errorSN} selectedItem={stateName} />
                            <HelperText type="error" visible={errorSN}>
                                {communication.InvalidState}
                            </HelperText>
                            <Dropdown label="City" data={cityData} forceDisable={addedBy} onSelected={onCityNameSelected} isError={errorCN} selectedItem={cityName}
                                reference={cityRef} />
                            <HelperText type="error" visible={errorCN}>
                                {communication.InvalidCity}
                            </HelperText>
                            <TextInput ref={pincodenRef} mode="outlined" disabled={addedBy} dense keyboardType="number-pad" label="Pincode" value={pincode} returnKeyType="next"
                                onSubmitEditing={() => gstNumberRef.current.focus()} onChangeText={onPincodeChanged} style={{ backgroundColor: "white" }} error={pincodeInvalid} />
                            <HelperText type="error" visible={pincodeInvalid}>
                                {communication.InvalidPincode}
                            </HelperText>
                            <TextInput ref={gstNumberRef} mode="outlined" disabled={addedBy} dense label="GST No." value={gstNumber} returnKeyType="next"
                                onSubmitEditing={() => panNumberRef.current.focus()} onChangeText={onGSTNumberChanged} style={{ backgroundColor: "white" }}
                                error={gstNumberInvalid} />
                            <HelperText type="error" visible={gstNumberInvalid}>
                                {communication.InvalidGSTNo}
                            </HelperText>

                            <TextInput ref={panNumberRef} mode="outlined" disabled={addedBy} dense label="PAN No." value={panNumber} returnKeyType="done"
                                onChangeText={onPANNumberChanged} style={{ backgroundColor: "white" }} error={panNumberInvalid} />
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

                            <View style={{ width: 160 }}>
                                <Checkbox.Item label="Display" position="leading" style={[Styles.paddingHorizontal0]} labelStyle={[Styles.textLeft, Styles.paddingStart4]} color={theme.colors.primary} status={checked ? "checked" : "unchecked"} onPress={() => setChecked(!checked)} />
                            </View>
                        </View>
                    </ScrollView>
                )}
                <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
                    <Card.Content>
                        {/* <Button mode="contained" onPress={ValidateData} loading={isButtonLoading}>
                            Update
                        </Button> */}
                        <DFButton mode="contained" onPress={ValidateData} title="Update" loader={isButtonLoading} />

                    </Card.Content>
                </View>
                <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
                    {snackbarText}
                </Snackbar>
            </View>
        )
    );

};

export default ClientEditScreen;
