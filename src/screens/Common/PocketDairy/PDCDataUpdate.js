import moment from "moment";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Image, View, Platform } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Subheading, Text, TextInput } from "react-native-paper";
import Provider from "../../../api/Provider";
import Dropdown from "../../../components/Dropdown";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { AWSImagePath } from "../../../utils/paths";
import { APIConverter } from "../../../utils/apiconverter";
import { common } from "@material-ui/core/colors";

let userID = 0, groupID = 0, companyID = 0, branchID = 0, designID = 0;

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

    const [notes, setNotes] = React.useState("");

    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState("");
    const ref_input2 = useRef();
    const ref_input3 = useRef();

    const [transactionID, setTransactionID] = React.useState(route.params.data.transactionID);
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
            designID = JSON.parse(userData).Sess_designation_refno;
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
                Sess_designation_refno: designID.toString(),
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

    const onNotesChange = (text) => {
        setNotes(text);
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

        }
    };

    const UpdateData = () => {
        let bankID = "";

        if (myBankListFullData.length > 0) {
            bankID = myBankListFullData.filter((el) => {
                return el.bankName === myBankList;
            })[0].bank_refno;
        }

        const datas = new FormData();
        const params = {

            pck_trans_refno: transactionID,
            Sess_UserRefno: userID,
            pck_mybank_refno: bankID,
            deposit_date: depositDate == "" ? "" : moment(depositDate).format("DD-MM-YYYY"),
            narration: notes.trim()
        };

        datas.append("data", JSON.stringify(params));
        datas.append(
            "bankchallan_slip",
            filePath != null && filePath != undefined && filePath.type != undefined && filePath.type != null
                ? {
                    name: "appimage1212.jpg",
                    type: filePath.type + "/*",
                    uri: Platform.OS === "android" ? filePath.uri : filePath.uri.replace("file://", ""),
                }
                : ""
        );
        Provider.createDFPocketDairyWithHeader(Provider.API_URLS.pckaddsource_pdc_cheque_update, datas)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    //route.params.fetchData("update");
                    //navigation.goBack();
                    navigation.navigate("AddSourceList", { type: "update", fetchData: null });
                    //navigation.navigate("AddSourceList");
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

        if (depositDate == "") {
            isValid = false;
            setDepositDateError(true);
        }

        if (myBankList == "") {
            isValid = false;
            setBLError(true);
        }

        if (isValid) {
            if (route.params.type === "pdc") {
                UpdateData();
            }
        }
    };

    //#endregion 

    return (
        <View style={[Styles.flex1]}>
            <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 0 }]} keyboardShouldPersistTaps="handled">
                <View style={[Styles.padding16]}>

                    <DateTimePicker style={Styles.backgroundColorWhite} label="Date of Deposit" type="date" value={depositDate} onChangeDate={setDepositDate} />
                    <HelperText type="error" visible={depositDateError}>
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

                    <TextInput mode="flat" label="Notes" value={notes} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onNotesChange} style={{ backgroundColor: "white" }} />

                </View>
            </ScrollView>
            <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
                <Card.Content>
                    <Button mode="contained" onPress={ValidateData}>
                        Submit
                    </Button>
                </Card.Content>
            </View>

            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
                {snackbarText}
            </Snackbar>


        </View>
    );
};

export default PDCDataUpdate;
