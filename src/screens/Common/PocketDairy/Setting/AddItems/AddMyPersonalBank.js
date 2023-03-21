import React, { useEffect, useRef, useState } from "react";
import { View, LogBox, Dimensions, RefreshControl, ScrollView, Image } from "react-native";
import { ActivityIndicator, Title, Button, List, Card, HelperText, Searchbar, Checkbox, Snackbar, Subheading, Switch, FAB, TextInput }
    from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";

import Provider from "../../../../../api/Provider";
import Header from "../../../../../components/Header";
import { Styles } from "../../../../../styles/styles";
import { theme } from "../../../../../theme/apptheme";
import { communication } from "../../../../../utils/communication";
import { RNS3 } from "react-native-aws3";
import * as ImagePicker from "expo-image-picker";
import { creds } from "../../../../../utils/credentials";
import uuid from "react-native-uuid";
import { AWSImagePath } from "../../../../../utils/paths";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { NullOrEmpty } from "../../../../../utils/validations";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import { RenderHiddenItems } from "../../../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../../../components/NoItems";
import { APIConverter, RemoveUnwantedParameters } from "../../../../../utils/apiconverter";


const AddMyPersonalBank = ({ route, navigation }) => {
    //#region Variables
    const [selectedID, setSelectedID] = React.useState(route.params.type === "edit" ? route.params.data.bankID : "");

    const [accountHolderName, setAccountHolderName] = useState(route.params.type === "edit" ? route.params.data.accountHolderName : "");
    const [accountHolderNameInvalid, setAccountHolderNameInvalid] = useState("");
    const accountHolderNameRef = useRef({});

    const [accountNo, setAccountNo] = useState(route.params.type === "edit" ? route.params.data.accountNo : "");
    const [accountNoInvalid, setAccountNoInvalid] = useState("");
    const accountNoRef = useRef({});

    const [bankName, setBankName] = useState(route.params.type === "edit" ? route.params.data.bankName : "");
    const [bankNameInvalid, setBankNameInvalid] = useState("");
    const bankNameRef = useRef({});

    const [bankBranchName, setBankBranchName] = useState(route.params.type === "edit" ? route.params.data.bankBranchName : "");
    const [bankBranchNameInvalid, setBankBranchNameInvalid] = useState("");
    const bankBranchNameRef = useRef({});

    const [ifscCode, setIfscCode] = useState(route.params.type === "edit" ? route.params.data.ifscCode : "");
    const [ifscCodeInvalid, setIfscCodeInvalid] = useState("");
    const ifscCodeRef = useRef({});

    const [openingBalance, setOpeningBalance] = useState(route.params.type === "edit" ? route.params.data.openingBalance : "");
    const [openingBalanceInvalid, setOpeningBalanceInvalid] = useState("");
    const openingBalanceRef = useRef({});

    const [remarks, setRemarks] = useState(route.params.type === "edit" ? route.params.data.remarks : "");
    const [remarksInvalid, setRemarksInvalid] = useState("");
    const remarksRef = useRef({});

    const [checked, setChecked] = useState(true);

    const [cardType, setCardType] = useState([
        {
            title: "Debit Card",
            isChecked: route.params.type === "edit" && route.params.data.cardType && route.params.data.cardType.toString().includes("1") ? true : false,
            id: "1",
        },
        {
            title: "Credit Card",
            isChecked: route.params.type === "edit" && route.params.data.cardType && route.params.data.cardType.toString().includes("2") ? true : false,
            id: "2",
        },
    ]);

    const [cardTypeInvalid, setCardTypeInvalid] = useState(false);


    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState("");
    //#endregion

    //#region Functions

    const GetUserID = async () => {
        const userData = await AsyncStorage.getItem("user");
        if (userData !== null) {
            userID = JSON.parse(userData).UserID;
          
            if (route.params.type === "edit") {
                FetchCardType(route.params.data.cardtypeID);

            }
            else {
                FetchCardType();
            }
        }
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
    const onOpeningBalanceChanged = (text) => {
        setOpeningBalance(text);
        setOpeningBalanceInvalid(false);
    };
    const onRemarksChanged = (text) => {
        setRemarks(text);
        setRemarksInvalid(false);
    };

    useEffect(() => {
        GetUserID();
    }, []);

    const FetchCardType = (selectedCards) => {
       
        let params = {
            data: {
                Sess_UserRefno: userID
            }
        }
        Provider.createDFPocketDairy(Provider.API_URLS.getcardtype_pckmypersonalbankform, params)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        const cardType = [];

                        response.data.data.map((data) => {
                            let selected = false;
                            if (selectedCards !== null) {
                                if (selectedCards.includes(data.cardtype_refno.toString())) {
                                    selected = true;
                                }

                            }
                            cardType.push(
                                {
                                    title: data.cardtype_name,
                                    isChecked: selected,
                                    id: data.cardtype_refno
                                }
                            );
                        });

                        setCardType(cardType);
                    }
                }
            })
            .catch((e) => { });
    };

    const ValidateSubmitButton = () => {
        
        let isValid = true;
        if (accountHolderName.length === 0) {
            setAccountNoInvalid(true);
            isValid = false;
        }
        if (bankName.length === 0) {
            setBankNameInvalid(true);
            isValid = false;
        }
        if (isValid) {
            if (route.params.type === "edit") {
                UpdateData();
            } else {
                InsertData();
            }
        }
    };

    const InsertData = () => {
        let ct = [];
        cardType.map((k, i) => {
            if (k.isChecked) {
                ct.push(k.id);
            }
        });
        let params = {
            data: {
                Sess_UserRefno: userID,
                bank_ac_holder_name: accountHolderName,
                bank_account_no: accountHolderName,
                bank_name: bankName,
                bank_branch_name: bankBranchName,
                ifsc_code: ifscCode,
                cardtype_refno: ct,
                opening_balance: openingBalance,
                remarks: remarks,
                view_status: checked ? "1" : "0",
            },
        };
        Provider.createDFPocketDairy(Provider.API_URLS.pckmypersonalbankcreate, params)
            .then((response) => {
               
                if (response.data && response.data.code === 200) {
                    route.params.fetchData("add");
                    navigation.goBack();
                } else if (response.data.code === 304) {
                    // console.log(response.data.code);
                    setSnackbarText(communication.AlreadyExists);
                    setSnackbarVisible(true);
                } else {
                    setSnackbarText(communication.InsertError);
                    setSnackbarVisible(true);
                }
            })
            .catch((e) => {
                // console.log(e);
                setSnackbarText(communication.NetworkError);
                setSnackbarVisible(true);
            });
    };

    const UpdateData = () => {
        let ct = [];
        cardType.map((k, i) => {
            if (k.isChecked) {
                ct.push(k.id);
            }
        });
        let params = {
            data: {
                Sess_UserRefno: userID,
                bank_refno: selectedID,
                bank_ac_holder_name: accountHolderName,
                bank_account_no: accountNo,
                bank_name: bankName,
                bank_branch_name: bankBranchName,
                ifsc_code: ifscCode,
                cardtype_refno: ct,
                opening_balance: openingBalance,
                remarks: remarks,
                view_status: checked ? "1" : "0",
            },
        };
        Provider.createDFPocketDairy(Provider.API_URLS.pckmypersonalbankupdate, params)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    route.params.fetchData("update");
                    navigation.goBack();
                } else if (response.data.code === 304) {
                    setSnackbarText(communication.AlreadyExists);
                    setSnackbarVisible(true);
                } else {
                    setSnackbarText(communication.UpdateError);
                    setSnackbarVisible(true);
                }
            })
            .catch((e) => {
                console.log(e);
                setSnackbarText(communication.NetworkError);
                setSnackbarVisible(true);
            });
    };
    //#endregion



    return (
        <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.padding16]}>
                <TextInput ref={accountHolderNameRef} mode="outlined" dense label="Account Holder Name" value={accountHolderName} returnKeyType="next" onSubmitEditing={() => bankNameRef.current.focus()} onChangeText={onAccountHolderNameChanged} style={{ backgroundColor: "white" }} error={accountHolderNameInvalid} />
                <HelperText type="error" visible={accountHolderNameInvalid}>
                    {communication.InvalidActivityName}
                </HelperText>
                <TextInput ref={accountNoRef} mode="outlined" dense label="Account Number" value={accountNo} returnKeyType="next" onSubmitEditing={() => bankNameRef.current.focus()} onChangeText={onAccountNoChanged} style={{ backgroundColor: "white" }} error={accountNoInvalid} />
                <HelperText type="error" visible={accountNoInvalid}>
                    {communication.InvalidActivityName}
                </HelperText>
                <TextInput ref={bankNameRef} mode="outlined" dense label="Bank Name" value={bankName} returnKeyType="next" onSubmitEditing={() => bankBranchNameRef.current.focus()} onChangeText={onBankNameChanged} style={{ backgroundColor: "white" }} error={bankNameInvalid} />
                <HelperText type="error" visible={bankNameInvalid}>
                    {communication.InvalidActivityName}
                </HelperText>
                <TextInput ref={bankBranchNameRef} mode="outlined" dense label="Bank Branch Name" value={bankBranchName} returnKeyType="next" onSubmitEditing={() => ifscCodeRef.current.focus()} onChangeText={onBankBranchNameChanged} style={{ backgroundColor: "white" }} error={bankBranchNameInvalid} />
                <HelperText type="error" visible={bankBranchNameInvalid}>
                    {communication.InvalidActivityName}
                </HelperText>
                <TextInput ref={ifscCodeRef} mode="outlined" dense label="IFSC Code" value={ifscCode} returnKeyType="done" onChangeText={onIfscCodeChanged} style={{ backgroundColor: "white" }} error={ifscCodeInvalid} />
                <HelperText type="error" visible={ifscCodeInvalid}>
                    {communication.InvalidActivityName}
                </HelperText>
                <Subheading style={{ paddingTop: 8, fontWeight: "bold" }}>Card Type</Subheading>
                <View style={[Styles.flexRow]}>
                    {cardType.map((k, i) => {
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
                                        let temp = cardType.map((u) => {
                                            if (k.title === u.title) {
                                                return { ...u, isChecked: !u.isChecked };
                                            }
                                            return u;
                                        });
                                        setCardTypeInvalid(false);
                                        setCardType(temp);
                                    }}
                                />
                            </View>
                        );
                    })}
                </View>
                <HelperText type="error" visible={cardTypeInvalid}>
                    Please select card Type
                </HelperText>
                <TextInput ref={openingBalanceRef} mode="outlined"dense label="Opening Balance" value={openingBalance} returnKeyType="done" onChangeText={onOpeningBalanceChanged} style={{ backgroundColor: "white" }} error={openingBalanceInvalid} />
                <HelperText type="error" visible={openingBalanceInvalid}>
                    {communication.InvalidActivityName}
                </HelperText>
                <TextInput ref={remarksRef} mode="outlined" dense label="Remarks" value={remarks} returnKeyType="done" onChangeText={onRemarksChanged} style={{ backgroundColor: "white" }} error={remarksInvalid} />
                <HelperText type="error" visible={remarksInvalid}>
                    {communication.InvalidActivityName}
                </HelperText>
                <View style={{ width: 160 }}>
                    <Checkbox.Item
                        label="Display"
                        color={theme.colors.primary}
                        position="leading"
                        labelStyle={{ textAlign: "left", paddingLeft: 8 }}
                        status={checked ? "checked" : "unchecked"}
                        onPress={() => {
                            setChecked(!checked);
                        }}
                    />
                </View>
                <Button mode="contained" style={[Styles.marginTop24]} loading={isButtonLoading} disabled={isButtonLoading} onPress={ValidateSubmitButton}>
                    Submit
                </Button>
            </View>
        </ScrollView>

    );
};

export default AddMyPersonalBank;