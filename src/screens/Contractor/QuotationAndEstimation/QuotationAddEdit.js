import React, { useEffect, useRef, useState } from "react";
import { Image, ScrollView, TouchableNativeFeedback, View } from "react-native";
import { Button, Dialog, Checkbox, IconButton,HelperText, List, Portal, RadioButton, Searchbar, Snackbar, Subheading, Text, TextInput, Title } from "react-native-paper";
import Provider from "../../../api/Provider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";
import { RNS3 } from "react-native-aws3";
import { creds } from "../../../utils/credentials";
import uuid from "react-native-uuid";
import Dropdown from "../../../components/Dropdown";

const QuotationAddEditTab = ({ route, navigation }) => {

    //#region Variable

    const [clientNameFullData, setClientNameFullData] = React.useState([]);
    const [clientNameData, setClientNameData] = React.useState([]);
    const [clientName, setClientName] = React.useState("");
    const [errorClientName, setClientNameError] = React.useState(false);

    const [cName, setCName] = React.useState("");
    const [clientNumber, setClientNumber] = React.useState("");

    const [projectName, setProjectName] = useState("");
    const [projectNameInvalid, setProjectNameInvalid] = useState("");
    const projectNameRef = useRef({});

    const [contactPerson, setContactPerson] = useState("");
    const [contactPersonInvalid, setContactPersonInvalid] = useState("");
    const contactPersonRef = useRef({});

    const [contactNumber, setContactNumber] = useState("");
    const [contactNumberInvalid, setContactNumberInvalid] = useState("");
    const contactNumberRef = useRef({});

    const [projectDescription, setProjectDescription] = useState("");
    const [projectDescriptionInvalid, setProjectDescriptionInvalid] = useState("");
    const projectDescriptionRef = useRef({});

    const [projectSiteAddress, setProjectSiteAddress] = useState("");
    const [projectSiteAddressInvalid, setProjectSiteAddressInvalid] = useState("");
    const projectSiteAddressRef = useRef({});

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

    const [unitSalesFullData, setUnitSalesFullData] = React.useState([]);
    const [unitSalesData, setUnitSalesData] = React.useState(["Foot", "Meter"]);
    const [unitSalesName, setUnitSalesName] = React.useState("");
    const [errorUS, setUSError] = React.useState(false);

    // const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);
    const arrProductData = React.useState([]);

    //#endregion


    //#region Function
    const onClientNameSelected = (selectedItem) => {
        setClientName(selectedItem);
        setClientNameError(false);
    };

  
    const onProjectNameChanged = (text) => {
        setProjectName(text);
        setProjectNameInvalid(false);
    };

    const onProjectDescriptionChanged = (text) => {
        setProjectDescription(text);
        setProjectDescriptionInvalid(false);
    };

    const onProjectSiteAddressChanged = (text) => {
        setProjectSiteAddress(text);
        setProjectSiteAddressInvalid(false);
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
                            setCityName("");
                            setCityID(0);
                        }

                    }
                    else {
                        setCityFullData([]);
                        setCityData([]);
                        setCityName("");
                        setCity("");
                        ct_ID = 0;
                        setCityID(0);
                    }
                }
                else {
                    setCityFullData([]);
                    setCityData([]);
                    setCityName("");
                    setCity("");
                    ct_ID = 0;
                    setCityID(0);
                }
            })
            .catch((e) => { });
    };

    const onStateNameSelected = (selectedItem) => {
        setStateName(selectedItem);
        setSNError(false);
        cityRef.current.reset();
        setCityName("");
        setCityData([]);
        setCityFullData([]);
        let a = statesFullData.filter((el) => {
            return el.stateName === selectedItem;
        });
        FetchCities(a[0].id);
    };

    const onCityNameSelected = (selectedItem) => {
        setCityName(selectedItem);
        setCNError(false);
    };

    const onUnitSaleSelected = (selectedItem) => {
        unitSalesName(selectedItem);
        setUSError(false);
    };

    //endregion

    return (
        <View style={[Styles.flex1]}>
            <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
                <View style={[Styles.padding16]}>
                    <View style={[Styles.width100per, Styles.borderBottom2, Styles.borderBottom2, Styles.marginBottom16]}>
                        <Text style={[Styles.fontSize20, Styles.fontBold, Styles.marginBottom4, Styles.blueFontColor]}>Client Details</Text>
                    </View>
                    <View style={[Styles.width100per, Styles.flexRow, Styles.flexAlignCenter]}>
                        <View style={[Styles.width75per]}>
                            <Dropdown label="Client Name" data={clientNameData} onSelected={onClientNameSelected} isError={errorClientName} selectedItem={clientName} />

                            <HelperText type="error" visible={errorClientName}>
                                {communication.InvalidClientName}
                            </HelperText>

                        </View>
                        <View style={[Styles.width20per, Styles.flexAlignSelfCenter, Styles.flexJustifyEnd, Styles.marginStart16, Styles.marginBottom24]}>
                            {/* <Button icon={'account-multiple-plus'} style={[Styles.width48, Styles.textCenter]} mode="contained" /> */}
                            {/* <IconButton 
              icon={'account-multiple-plus'}
              mode="contained"
              backgroundColor="#000"
              
              ></IconButton> */}
                <IconButton style={[Styles.border2, Styles.borderRadius4, Styles.width72]}
                icon={'account-multiple-plus'}
                size={35}
                color="#198754"></IconButton>
                        </View>
                    </View>

                    <TextInput mode="flat" dense label="Client Name" value={cName} disabled></TextInput>

                    <TextInput mode="flat" dense label="Client Number" value={clientNumber} disabled style={{ marginTop: 20 }}></TextInput>
                </View>
                <View style={[Styles.padding16]}>
                    <View style={[Styles.width100per, Styles.borderBottom2, Styles.borderBottom2, Styles.marginBottom16]}>
                        <Text style={[Styles.fontSize20, Styles.fontBold, Styles.marginBottom4, Styles.blueFontColor]}>Project Details</Text>
                    </View>
                    <View style={[Styles.width100per, Styles.flexRow, Styles.flexAlignCenter]}>
                        <View style={[Styles.width100per]}>
                            <TextInput ref={projectNameRef} mode="flat" dense label="Project Name" value={projectName} returnKeyType="next" onSubmitEditing={() => projectNameRef.current.focus()} onChangeText={onProjectNameChanged} style={{ backgroundColor: "white" }} error={projectNameInvalid} />
                            <HelperText type="error" visible={projectNameInvalid}>
                                {communication.projectNameInvalid}
                            </HelperText>
                            <TextInput ref={contactPersonRef} mode="flat" dense label="Contact Person" value={contactPerson} returnKeyType="next" onSubmitEditing={() => contactPersonRef.current.focus()} onChangeText={onProjectNameChanged} style={{ backgroundColor: "white" }} error={contactPersonInvalid} />
                            <HelperText type="error" visible={contactPersonInvalid}>
                                {communication.contactPersonInvalid}
                            </HelperText>
                            <TextInput ref={contactNumberRef} mode="flat" dense label="Conatct Number" value={contactNumber} returnKeyType="next" onSubmitEditing={() => contactNumberRef.current.focus()} onChangeText={onProjectNameChanged} style={{ backgroundColor: "white" }} error={contactNumberInvalid} />
                            <HelperText type="error" visible={contactNumberInvalid}>
                                {communication.contactNumberInvalid}
                            </HelperText>
                            <TextInput multiline ref={projectDescriptionRef} mode="flat" dense label="Project Description" value={projectDescription} returnKeyType="next" onSubmitEditing={() => projectDescriptionRef.current.focus()} onChangeText={onProjectDescriptionChanged} style={{ backgroundColor: "white" }} error={projectDescriptionInvalid} />
                            <HelperText type="error" visible={projectDescriptionInvalid}>
                                {communication.projectDescriptionInvalid}
                            </HelperText>
                            <TextInput multiline ref={projectSiteAddressRef} mode="flat" dense label="Project Site Address" value={projectSiteAddress} returnKeyType="next" onSubmitEditing={() => projectSiteAddressRef.current.focus()} onChangeText={onProjectSiteAddressChanged} style={{ backgroundColor: "white" }} error={projectSiteAddressInvalid} />
                            <HelperText type="error" visible={projectSiteAddressInvalid}>
                                {communication.projectSiteAddressInvalid}
                            </HelperText>
                            <Dropdown label="State" data={statesData} onSelected={onStateNameSelected} isError={errorSN} selectedItem={stateName} />
                            <View style={[Styles.height24]}></View>
                            <Dropdown label="City" data={cityData} onSelected={onCityNameSelected} isError={errorCN} selectedItem={cityName} reference={cityRef} />
                        </View>

                    </View>
                </View>
                <View style={[Styles.padding16]}>
                    <View style={[Styles.width100per, Styles.borderBottom2, Styles.borderBottom2, Styles.marginBottom16]}>
                        <Text style={[Styles.fontSize20, Styles.fontBold, Styles.marginBottom4, Styles.blueFontColor]}>Quotation Preparation Type</Text>
                    </View>
                    <View style={[Styles.width100per, Styles.flexRow, Styles.flexAlignCenter]}>
                        <View style={[Styles.width100per]}>
                            <Dropdown label="Unit Of Sales" data={unitSalesData} onSelected={onUnitSaleSelected} isError={errorUS} selectedItem={unitSalesName} />
                            <HelperText type="error" visible={errorUS}>
                                {communication.InvalidSalesUnit}
                            </HelperText>
                            <View >
                                <Checkbox.Item
                                    label="Inclusive Material"
                                    position="leading"
                                    labelStyle={{ textAlign: "left", paddingLeft: 8 }}
                                    color={theme.colors.primary}
                                    // status={checked ? "checked" : "unchecked"}
                                    // onPress={() => {
                                    //     setChecked(!checked);
                                    // }}
                                />
                            </View>
                            <Button mode="contained" style={{ marginTop: 20 }} icon="plus">
                                Add Product
                            </Button>
                        </View>
                    </View>
                </View>
                <View style={[Styles.padding16]}>
                    <View style={[Styles.width100per, Styles.borderBottom2, Styles.borderBottom2, Styles.marginBottom16]}>
                        <Text style={[Styles.fontSize20, Styles.fontBold, Styles.marginBottom4, Styles.blueFontColor]}>Product Details</Text>
                    </View>
                </View>
                <View style={[Styles.padding16]}>
                    <View style={[Styles.width100per, Styles.borderBottom2, Styles.borderBottom2, Styles.marginBottom16]}>
                        <Text style={[Styles.fontSize20, Styles.fontBold, Styles.marginBottom4, Styles.blueFontColor]}>Terms & Condition</Text>
                    </View>
                </View>



            </ScrollView>
        </View>
    );
};

export default QuotationAddEditTab;
