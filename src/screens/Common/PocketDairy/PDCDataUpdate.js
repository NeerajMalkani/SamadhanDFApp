import moment from "moment";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Image, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Subheading, Text, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Provider from "../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { AWSImagePath } from "../../../../utils/paths";
import { APIConverter } from "../../../../utils/apiconverter";
import { common } from "@material-ui/core/colors";

let userID = 0, groupID = 0, companyID = 0, branchID = 0;

const PDCDataUpdate = ({ route, navigation }) => {

    //#region Variables

    // const [entryTypeError, setEntryTypeError] = React.useState(false);
    // const [entryType, setEntryType] = React.useState("");

    const [myBankListFullData, setMyBankListFullData] = React.useState([]);
    const [myBankListData, setMyBankListData] = React.useState([]);
    const [myBankList, setMyBankList] = React.useState([]);
    const [myBankListEditID, setMyBankListEditID] = React.useState([]);
    const [errorBL, setBLError] = React.useState(false);

    const [depositDate, setDepositDate] = useState(new Date());
    const [depositDateInvalid, setDepositDateInvalid] = useState("");
    const [depositDateError, setDepositDateError] = React.useState(false);
    const depositDateRef = useRef({});

    const [image, setImage] = React.useState(AWSImagePath + "placeholder-image.png");
    const [filePath, setFilePath] = React.useState(null);
    const [designImage, setDesignImage] = React.useState("");
    const [errorDI, setDIError] = React.useState(false);

    const [notesError, setNotesError] = React.useState(false);
    const [notes, setNotes] = React.useState("");

    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState("");
    const ref_input2 = useRef();
    const ref_input3 = useRef();

    const [pktEntryTypeID, setPktEntryTypeID] = React.useState("1");
    const [isImageReplaced, setIsImageReplaced] = React.useState(false);
    //#endregion 

    //#region Functions

    useEffect(() => {
        GetUserID();
    }, []);

    const GetUserID = async () => {
        const userData = await AsyncStorage.getItem("user");
        if (userData !== null) {
            userID = JSON.parse(userData).UserID;
            groupID = JSON.parse(userData).Sess_group_refno;
            companyID = JSON.parse(userData).Sess_company_refno;
            branchID = JSON.parse(userData).Sess_branch_refno;
            FetchBankList();
        }
    };

    

    const FetchBankList = (bankID) => {
        let params = {
            data: {
                Sess_UserRefno: userID,
                Sess_company_refno: companyID.toString(),
                Sess_branch_refno: branchID.toString(),
                Sess_group_refno: groupID.toString(),
                pck_entrytype_refno: pktEntryTypeID
            }
        }
        Provider.createDFPocketDairy(Provider.API_URLS.get_pckmybankname, params)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {

                        response.data.data = APIConverter(response.data.data, "pkt_subcat");
                        setMyBankListFullData(response.data.data);

                        const bank = response.data.data.map((data) => data.bankName);
                        setMyBankListData(bank);
                        if (bankID != null) {
                            setMyBankList(response.data.data.filter((el) => {
                                return el.bank_refno === bankID;
                            })[0].bankName)
                        }
                    }
                }
            })
            .catch((e) => { });
    };

    const onEntryTypeChanged = (selectedItem) => {
        setEntryType(selectedItem);
        resetFields();

    };

    const resetFields = () => {

        setReceivedStatus(false);
        setDepositTypeStatus(false);
        setBankListStatus(false);
        setChequeNoStatus(false);
        setChequeDateStatus(false);
        setPaymentReminderStatus(false);
        setCommonStatus(false);
        setButtonStatus(true);

    };

    const onNotesChange = (text) => {
        setNotes(text);
        setNotesError(false);
    };

    const onBankListChanged = (text) => {
        setMyBankList(text);
        setBLError(false);
    };

    const chooseFile = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            setDIError(false);
            const arrExt = result.uri.split(".");
            const unique_id = uuid.v4();
            setDesignImage(AWSImagePath + unique_id + "." + arrExt[arrExt.length - 1]);
            setImage(result.uri);
            setFilePath(result);
            if (route.params.type === "edit") {
                setIsImageReplaced(true);
            }
        }
    };

    const UpdateData = () => {
        //console.log('update===================');

        let contactID = "", bankID = "", depositID = "";

        if (receivedFormFullData.length > 0) {
            contactID = receivedFormFullData.filter((el) => {
                return el.contactName === receivedForm;
            })[0].mycontactID;
        }

        if (myBankListFullData.length > 0) {
            bankID = myBankListFullData.filter((el) => {
                return el.bankName === myBankList;
            })[0].bank_refno;
        }

        if (depositeTypeFullData.length > 0) {
            depositID = depositeTypeFullData.filter((el) => {
                return el.deposit_type_name === depositeType;
            })[0].deposit_type_refno;
        }

        const datas = new FormData();
        const params = {

            pck_trans_refno: pckTransID,
            Sess_UserRefno: userID,
            pck_entrytype_refno: pktEntryTypeID,
            pck_mode_refno: receiptModeFullData.filter((el) => {
                return el.pckModeName === receiptMode;
            })[0].pckModeID,
            pck_category_refno: sourceFullData.filter((el) => {
                return el.categoryName === source;
            })[0].pckCategoryID,
            pck_sub_category_refno: subCategoryNameFullData.filter((el) => {
                return el.subCategoryName === subCategoryName;
            })[0].subcategoryID,

            amount: amount.trim(),
            notes: notes.trim(),
            view_status: checked ? "1" : "0"

        };

        if (receivedStatus) {
            params.pck_mycontact_refno = contactID;
        }

        if (depositTypeStatus) {
            params.deposit_type_refno = depositID;
        }

        if (bankListStatus) {
            params.pck_mybank_refno = bankID;
        }

        if (chequeNoStatus) {
            params.cheque_no = chequeNo.trim();
        }

        if (UTRNoStatus) {
            params.utr_no = UTRNo.trim();
        }

        if (chequeDateStatus) {
            params.cheque_date = chequeDate == "" ? "" : moment(chequeDate).format("DD-MM-YYYY");
        }

        if (paymentReminderStatus) {
            params.reminder_date = repaymentDate == "" ? "" : moment(repaymentDate).format("DD-MM-YYYY");
        }

        datas.append("data", JSON.stringify(params));
        datas.append(
            "attach_receipt",
            isImageReplaced
                ? {
                    name: "appimage1212.jpg",
                    type: filePath.type + "/*",
                    uri: Platform.OS === "android" ? filePath.uri : filePath.uri.replace("file://", ""),
                }
                : ""
        );
        //console.log(datas);
        Provider.createDFPocketDairyWithHeader(Provider.API_URLS.pckaddsourceupdate, datas)
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

    const ValidateData = () => {
        let isValid = true;

        if (amount.trim() == "") {
            isValid = false;
            setAmountError(true);
        }

        if (receiptMode == "") {
            isValid = false;
            setRMError(true);
        }

        if (source == "") {
            isValid = false;
            setSSError(true);
        }

        if (subCategoryName == "") {
            isValid = false;
            setSCNError(true);
        }

        if (receivedStatus && receivedForm == "") {
            isValid = false;
            setRFError(true);
        }

        if (depositTypeStatus && depositeType == "") {
            isValid = false;
            setDTError(true);
        }

        if (bankListStatus && myBankList == "") {
            isValid = false;
            setBLError(true);
        }

        if (chequeNoStatus && chequeNo.trim() == "") {
            isValid = false;
            setChequeNoError(true);
        }

        if (chequeDateStatus && chequeDate == "") {
            isValid = false;
            setChequeDateError(true);
        }

        if (paymentReminderStatus && repaymentDate == "") {
            isValid = false;
            setChequeDateError(true);
        }


        if (isValid) {
            if (route.params.type === "edit") {
                UpdateData();
            } else {
                InsertData();
            }
        }
    };

    //#endregion 

    return (
        <View style={[Styles.flex1]}>
            <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
                <View style={[Styles.padding16]}>

                    <DateTimePicker style={Styles.backgroundColorWhite} label="Date of Deposit" type="date" value={depositDate} onChangeDate={setDepositDate} />
                    <HelperText type="error" visible={chequeDateError}>
                        Please enter a valid date
                    </HelperText>

                    <View style={[Styles.border1, Styles.borderRadius4, Styles.padding4, Styles.marginTop8]}>
                        <Dropdown label="Bank Name" data={myBankListData} onSelected={onBankListChanged} isError={errorBL} selectedItem={myBankList} />
                        <HelperText type="error" visible={errorBL}>
                            {communication.InvalidBankName}
                        </HelperText>
                        <Button
                            icon={"plus"}
                            mode="contained"
                            onPress={() => {
                                navigation.navigate("AddGMyBankScreen", {
                                    type: "newAccount",
                                    fetchBankList: FetchBankList,
                                });
                            }}
                        >
                            Add Bank Account
                        </Button>
                    </View>

                    <View style={[Styles.flexRow, Styles.flexAlignEnd, Styles.marginTop16]}>
                        <Image source={{ uri: image }} style={[Styles.width104, Styles.height96, Styles.border1]} />
                        <Button mode="text" onPress={chooseFile}>
                            {filePath !== null ? "Replace" : "Attachment / Slip Copy"}
                        </Button>
                    </View>
                    <HelperText type="error" visible={errorDI}>
                        {communication.InvalidDesignImage}
                    </HelperText>

                    <TextInput mode="flat" label="Notes" value={notes} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onNotesChange} style={{ backgroundColor: "white" }} error={notesError} />

                    <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
                        <Card.Content>
                            <Button mode="contained" disabled={buttonStatus} onPress={ValidateData}>
                                Submit
                            </Button>
                        </Card.Content>
                    </View>

                    <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
                        {snackbarText}
                    </Snackbar>

                </View>
            </ScrollView>


        </View>
    );
};

export default PDCDataUpdate;
