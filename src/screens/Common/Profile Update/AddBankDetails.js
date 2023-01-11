import React, { useEffect, useRef, useState } from "react";
import { View, LogBox, Dimensions, RefreshControl, ScrollView, Image } from "react-native";
import { ActivityIndicator, Title, Button, List, Card, HelperText, Searchbar, Checkbox, Snackbar, Subheading, Switch, FAB, TextInput }
    from "react-native-paper";
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
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { APIConverter, RemoveUnwantedParameters } from "../../../utils/apiconverter";


const AddBankDetails = ({ route, navigation }) => {
    //#region Variables
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

    const [openingBalance, setOpeningBalance] = useState("");
    const [openingBalanceInvalid, setOpeningBalanceInvalid] = useState("");
    const openingBalanceRef = useRef({});

    const [remarks, setRemarks] = useState("");
    const [remarksInvalid, setRemarksInvalid] = useState("");
    const remarksRef = useRef({});

    const [checked, setChecked] = useState(true);

    const [cardType, setCardType] = useState([
        {
            title: "Debit Card",
            isChecked: false,
            id: "1",
        },
        {
            title: "Credit Card",
            isChecked: false,
            id: "2",
        },
    ]);

    const [cardTypeInvalid, setCardTypeInvalid] = useState(false);


    const [isButtonLoading, setIsButtonLoading] = useState(false);
    //#endregion

    //#region Functions
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

    const ValidateForgotPassword = () => {
        // Keyboard.dismiss();
        // let isValid = true;
        // if (mobileNumber.length === 0 || !ValidateMobile(mobileNumber)) {
        //   isValid = false;
        //   setIsMobileNumberInvalid(true);
        // }
        // if (otp1.length === 0 && otp2.length === 0 && otp3.length === 0 && otp4.length === 0) {
        //   isValid = false;
        //   setIsOTPInvalid(true);
        // }
        // if (password.length < 3) {
        //   isValid = false;
        //   setIsPasswordInvalid(true);
        // }
        // if (confirmPassword.length < 3) {
        //   isValid = false;
        //   setIsConfirmPasswordInvalid(true);
        // }
        // if (isValid) {
        //   if (password !== confirmPassword) {
        //     setIsConfirmPasswordInvalid(true);
        //     setSnackbarText(communication.InvalidPasswordsMatch);
        //     setIsSnackbarVisible(true);
        //   } else {
        //     VerifyUser();
        //   }
        // }
      };
   

    //#endregion



    return (
        <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <View style={[Styles.padding16]}>
                <TextInput ref={accountHolderNameRef} mode="flat" dense label="Account Holder Name" value={accountHolderName} returnKeyType="next" onSubmitEditing={() => bankNameRef.current.focus()} onChangeText={onAccountHolderNameChanged} style={{ backgroundColor: "white" }} error={accountHolderNameInvalid} />
                <HelperText type="error" visible={accountHolderNameInvalid}>
                    {communication.InvalidActivityName}
                </HelperText>
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
                <TextInput ref={openingBalanceRef} mode="flat" dense label="Opening Balance" value={openingBalance} returnKeyType="done" onChangeText={onOpeningBalanceChanged} style={{ backgroundColor: "white" }} error={openingBalanceInvalid} />
                <HelperText type="error" visible={openingBalanceInvalid}>
                    {communication.InvalidActivityName}
                </HelperText>
                <TextInput ref={remarksRef} mode="flat" dense label="Remarks" value={remarks} returnKeyType="done" onChangeText={onRemarksChanged} style={{ backgroundColor: "white" }} error={remarksInvalid} />
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
                <Button mode="contained" style={[Styles.marginTop24]} loading={isButtonLoading} disabled={isButtonLoading} onPress={() => ValidateForgotPassword()}>
            Submit
          </Button>
            </View>
        </ScrollView>

    );
};

export default AddBankDetails;