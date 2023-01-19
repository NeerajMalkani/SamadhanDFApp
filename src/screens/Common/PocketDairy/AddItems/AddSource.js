import moment from "moment";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Image, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Subheading, Text, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { AWSImagePath } from "../../../../utils/paths";
import { APIConverter } from "../../../../utils/apiconverter";
import { common } from "@material-ui/core/colors";


let userID = 0, groupID = 0, companyID = 0, branchID = 0, _pktEntryTypeID = 0, designID = 0;

const AddSource = ({ route, navigation }) => {

  //#region Variables

  // const [entryTypeError, setEntryTypeError] = React.useState(false);
  // const [entryType, setEntryType] = React.useState("");

  const [amountError, setAmountError] = React.useState(false);
  const [amount, settAmount] = React.useState("");

  const [entryTypeData, setEntryTypeData] = React.useState([]);
  const [entryTypeFullData, setEntryTypeFullData] = React.useState([]);
  const [entryType, setEntryType] = React.useState("");
  const [entryTypeDisable, setEntryTypeDisable] = React.useState(true);

  const [receiptModeData, setReceiptModeData] = React.useState([]);
  const [receiptModeFullData, setReceiptModeFullData] = React.useState([]);
  const [receiptMode, setReceiptMode] = React.useState([]);
  const [errorRM, setRMError] = React.useState(false);

  const [sourceFullData, setSourceFullData] = React.useState([]);
  const [sourceData, setSourceData] = React.useState([]);
  const [source, setSource] = React.useState([]);
  const [errorSS, setSSError] = React.useState(false);

  const [subCategoryNameFullData, setSubCategoryNameFullData] = React.useState([]);
  const [subCategoryNameData, setSubCategoryNameData] = React.useState([]);
  const [subCategoryName, setSubCategoryName] = React.useState([]);
  const [errorSCN, setSCNError] = React.useState(false);

  const [receivedFormFullData, setReceivedFormFullData] = React.useState([]);
  const [receivedFormData, setReceivedFormData] = React.useState([]);
  const [receivedForm, setReceivedForm] = React.useState([]);
  const [errorRF, setRFError] = React.useState(false);
  const [receivedEditID, setReceivedEditID] = React.useState([]);
  const [pckTransID, setPckTransID] = React.useState([]);

  const [depositeTypeFullData, setDepositeTypeFullData] = React.useState([]);
  const [depositeTypeData, setDepositeTypeData] = React.useState([]);
  const [depositeType, setDepositeType] = React.useState([]);
  const [depositeTypeEditID, setDepositeTypeEditID] = React.useState([]);
  const [errorDT, setDTError] = React.useState(false);

  const [myBankListFullData, setMyBankListFullData] = React.useState([]);
  const [myBankListData, setMyBankListData] = React.useState([]);
  const [myBankList, setMyBankList] = React.useState([]);
  const [myBankListEditID, setMyBankListEditID] = React.useState([]);
  const [errorBL, setBLError] = React.useState(false);

  const [chequeNoError, setChequeNoError] = React.useState(false);
  const [chequeNo, setChequeNo] = React.useState("");

  const [UTRNoError, setUTRNoError] = React.useState(false);
  const [UTRNo, setUTRNo] = React.useState("");

  const [chequeDate, setChequeDate] = useState(new Date());
  const [chequeDateInvalid, setChequeDateInvalid] = useState("");
  const [chequeDateError, setChequeDateError] = React.useState(false);
  const chequeDateRef = useRef({});

  const [repaymentDate, setRepaymentDate] = useState(new Date());
  const [repaymentDateInvalid, setRepaymentDateInvalid] = useState("");
  const [repaymentDateError, setRepaymentDateError] = React.useState(false);
  const repaymentDateRef = useRef({});


  const [image, setImage] = React.useState(AWSImagePath + "placeholder-image.png");
  const [filePath, setFilePath] = React.useState(null);
  const [designImage, setDesignImage] = React.useState("");
  const [errorDI, setDIError] = React.useState(false);

  const [notesError, setNotesError] = React.useState(false);
  const [notes, setNotes] = React.useState("");

  const [checked, setChecked] = React.useState(true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const ref_input2 = useRef();
  const ref_input3 = useRef();

  const [receivedStatus, setReceivedStatus] = React.useState(false);
  const [depositTypeStatus, setDepositTypeStatus] = React.useState(false);
  const [bankListStatus, setBankListStatus] = React.useState(false);
  const [chequeNoStatus, setChequeNoStatus] = React.useState(false);
  const [UTRNoStatus, setUTRNoStatus] = React.useState(false);
  const [chequeDateStatus, setChequeDateStatus] = React.useState(false);
  const [paymentReminderStatus, setPaymentReminderStatus] = React.useState(false);
  const [commonStatus, setCommonStatus] = React.useState(false);
  const [buttonStatus, setButtonStatus] = React.useState(true);

  const [pktEntryTypeID, setPktEntryTypeID] = React.useState("1");
  const [isImageReplaced, setIsImageReplaced] = React.useState(false);
  //#endregion 

  //#region Functions

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      groupID = JSON.parse(userData).Sess_group_refno;
      companyID = JSON.parse(userData).Sess_company_refno;
      branchID = JSON.parse(userData).Sess_branch_refno;
      designID = JSON.parse(userData).Sess_designation_refno;
      
      FetchEntryType();

      if (route.params.type === "edit") {
        SetEditData();
      }
    }
  };

  const SetEditData = () => {
   //console.log('start edit data =====================');
   //console.log(route.params);
    setButtonStatus(false);
    setEntryType(route.params.data.pck_entrytype_name);
    settAmount(route.params.data.amount);
    setPckTransID(route.params.data.pck_trans_refno);
    _pktEntryTypeID = route.params.data.pck_entrytype_refno;

    setReceiptMode(route.params.data.pck_mode_name);
    setSource(route.params.data.pck_category_name);
    FetchReceptCategory(route.params.data.pck_mode_refno, route.params.data.pck_category_refno);

    setSubCategoryName(route.params.data.pck_sub_category_name);
    FetchReceptSubCategory(route.params.data.pck_category_refno, route.params.data.pck_sub_category_refno);

    if (route.params.data.pck_mycontact_refno != "" && route.params.data.pck_mycontact_refno != "0") {
      setReceivedStatus(true);
      setReceivedEditID(route.params.data.pck_mycontact_refno)
      FetchReceiverList(route.params.data.pck_mycontact_refno);
    }

    if (route.params.data.deposit_type_refno != "" && route.params.data.deposit_type_refno != "0") {
      setDepositTypeStatus(true);
      //setDepositeType(route.params.data.deposit_type_refno);
      setDepositeTypeEditID(route.params.data.deposit_type_refno);
      FetchDepositType(route.params.data.deposit_type_refno);
    }

    if (route.params.data.pck_mybank_refno != "" && route.params.data.pck_mybank_refno != "0") {
      setBankListStatus(true);
      //setMyBankList(route.params.data.pck_mybank_refno);
      setMyBankListEditID(route.params.data.pck_mybank_refno);
      FetchBankList(route.params.data.pck_mybank_refno);
    }

    if (route.params.data.cheque_no != "") {
      setChequeNoStatus(true);
      setChequeNo(route.params.data.cheque_no);
    }

    if (route.params.data.utr_no != "") {
      setUTRNoStatus(true);
      setUTRNo(route.params.data.utr_no);
    }

    if (route.params.data.cheque_date != null) {
      setChequeDateStatus(true);
      setChequeDate(route.params.data.cheque_date);
    }

    if (route.params.data.reminder_date != null) {
      setPaymentReminderStatus(true);
      let dateBreakup = route.params.data.reminder_date.split('-');
      setRepaymentDate(new Date(dateBreakup[2] + '/' + dateBreakup[1] + '/' + dateBreakup[0]));
    }

    setCommonStatus(true);

    setNotes(route.params.data.notes);

    setChecked(route.params.data.view_status == "1" ? true : false);
    //console.log(route.params.data.attach_receipt_url);

    setImage(route.params.data.attach_receipt_url);
    setFilePath(route.params.data.attach_receipt_url);
    setDesignImage(route.params.data.attach_receipt_url);
  }

  const FetchEntryType = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID
      }
    }
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckentrytype, params)
      .then((response) => {
        //console.log(response.data.data);
        if (response.data && response.data.code === 200) {
          if (response.data.data) {

            FetchRecepientMode();
            setEntryTypeFullData(response.data.data);

            const entryTypeData = response.data.data.map((data) => data.pck_entrytype_name);
            setEntryTypeData(entryTypeData);
            //console.log(response.data.data.length);
            if (response.data.data.length == 1) {
              setEntryType(response.data.data[0].pck_entrytype_name);
              setEntryTypeDisable(true);
            }
            else {
              setEntryTypeDisable(false);
            }
            
          }
        }
      })
      .catch((e) => { });
  };

  const FetchRecepientMode = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        pck_transtype_refno: 1,
      }
    }
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckpaymentmodetype, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setReceiptModeFullData(response.data.data);
            const receiptMode = response.data.data.map((data) => data.pckModeName);
            setReceiptModeData(receiptMode);

          }
        }
      })
      .catch((e) => { });
  };

  const FetchReceptCategory = (receiptModeID, categoryID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID,
        pck_mode_refno: receiptModeID,
        pck_entrytype_refno: route.params.type === "edit" ? _pktEntryTypeID : pktEntryTypeID
      }
    }
   //console.log(params);
    Provider.createDFPocketDairy(Provider.API_URLS.getcategoryname_pckaddsourceform, params)
      .then((response) => {
       //console.log(response.data.data);
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setSourceFullData(response.data.data);
            const category = response.data.data.map((data) => data.categoryName);
            setSourceData(category);
            if (categoryID != null) {
              setSource(response.data.data.filter((el) => {
                return el.pckCategoryID === categoryID;
              })[0].categoryName);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchReceptSubCategory = (categoryID, subCategoryID) => {

    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID,
        pck_category_refno: categoryID,
      }
    }
    Provider.createDFPocketDairy(Provider.API_URLS.getsubcategoryname_pckaddsourceform, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {

            response.data.data = APIConverter(response.data.data, "pkt_subcat");

            setSubCategoryNameFullData(response.data.data);

            const subCategory = response.data.data.map((data) => data.subCategoryName);
            setSubCategoryNameData(subCategory);
            if (subcategoryID != null) {
              setSubCategoryName(response.data.data.filter((el) => {
                return el.subcategoryID === subCategoryID;
              })[0].subCategoryName);

            }

          }
        }
      })
      .catch((e) => { });
  };

  const FetchBankList = (bankID) => {
    ////console.log('calling bank======');
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID.toString(),
        Sess_branch_refno: branchID.toString(),
        Sess_group_refno: groupID.toString(),
        pck_entrytype_refno: route.params.type === "edit" ? _pktEntryTypeID : pktEntryTypeID,
        Sess_designation_refno: designID.toString(),
      }
    }
    ////console.log(params);
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckmybankname, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {

            response.data.data = APIConverter(response.data.data, "pkt_subcat");
            ////console.log(response.data.data);
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

  const FetchReceiverList = (contactID) => {
    ////console.log('receiver data start ============');
    let params = {
      data: {
        Sess_UserRefno: userID
      }
    }
    ////console.log(params);
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckmycontactname, params)
      .then((response) => {
        ////console.log('Receiiver contact==============');
        ////console.log(response.data);
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data, "pkt_subcat");

            setReceivedFormFullData(response.data.data);

            const receiverList = response.data.data.map((data) => data.contactName);
            setReceivedFormData(receiverList);
            if (contactID != null) {
              setReceivedForm(response.data.data.filter((el) => {
                return el.mycontactID === contactID;
              })[0].contactName);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchDepositType = (depositID) => {
    let params = {
      data: {
        Sess_UserRefno: userID
      }
    }
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckdeposittype, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data, "pkt_subcat");
            setDepositeTypeFullData(response.data.data);
            const depostiType = response.data.data.map((data) => data.deposit_type_name);
            setDepositeTypeData(depostiType);
            if (depositID != null) {
              setDepositeType(response.data.data.filter((el) => {
                return el.deposit_type_refno == depositID;
              })[0].deposit_type_name);
            }
          }
        }
      })
      .catch((e) => { });
  };

  useEffect(() => {
    GetUserID();
  }, []);

  const onEntryTypeChanged = (selectedItem) => {
    setEntryType(selectedItem);
    resetFields();

  };

  const onReceiptModeChanged = (selectedItem) => {
    setReceiptMode(selectedItem);
    setRMError(false);
    resetFields();

    let a = receiptModeFullData.filter((el) => {
      return el.pckModeName === selectedItem;
    });

    FetchReceptCategory(a[0].pckModeID);

  };

  const onSourceChanged = (text) => {
    setSource(text);
    setSSError(false);
    resetFields();

    let a = sourceFullData.filter((el) => {
      return el.categoryName === text;
    });

    FetchReceptSubCategory(a[0].pckCategoryID);

  };

  const onSubCategoryNameChanged = (text) => {
    resetFields();
    setSubCategoryName(text);
    setSCNError(false);
    setCommonStatus(true);
    setButtonStatus(false);

    let mode = receiptModeFullData.filter((el) => {
      return el.pckModeName === receiptMode;
    });

    let category = sourceFullData.filter((el) => {
      return el.categoryName === source;
    });

    let subcat = subCategoryNameFullData.filter((el) => {
      return el.subCategoryName === text;
    });

    ////console.log(receiptModeFullData);
    ////console.log(mode[0].pckModeID);
    ////console.log(category[0].pckCategoryID);
    ////console.log(subcat[0].subcategoryID);

    if (mode[0].pckModeID == "1") {
      ////console.log('Cash================');
      // cash withdrawal
      if (subcat[0].subcategoryID == "1") {
        FetchBankList();
        setBankListStatus(true);
        setChequeNoStatus(true);
      }
      // atm withdrawal
      else if (subcat[0].subcategoryID == "2") {
        FetchBankList();
        setBankListStatus(true);
      }
      // Phone Book
      else if (subcat[0].subcategoryID == "7" || subcat[0].subcategoryID == "9" || subcat[0].subcategoryID == "10" || subcat[0].subcategoryID == "11") {
        setReceivedStatus(true);
        setPaymentReminderStatus(true);
        FetchReceiverList();
      }
      // My Business
      else if (subcat[0].subcategoryID == "9" || subcat[0].subcategoryID == "10" || subcat[0].subcategoryID == "11" || subcat[0].subcategoryID == "12" ||
        subcat[0].subcategoryID == "13" || subcat[0].subcategoryID == "14" || subcat[0].subcategoryID == "15" || subcat[0].subcategoryID == "16" || subcat[0].subcategoryID == "17" ||
        subcat[0].subcategoryID == "18") {
        setReceivedStatus(true);
        FetchReceiverList();
      }

    }
    else if (mode[0].pckModeID == "2" || mode[0].pckModeID == "4") {
      setUTRNoStatus(true);
      ////console.log('UPI================');
      if (subcat[0].subcategoryID == "7") {
        setReceivedStatus(true);
        FetchReceiverList();
        FetchBankList();
        setBankListStatus(true);
        setPaymentReminderStatus(true);
      }
      else if (subcat[0].subcategoryID == "9" || subcat[0].subcategoryID == "10" || subcat[0].subcategoryID == "11" || subcat[0].subcategoryID == "12"
        || subcat[0].subcategoryID == "13" || subcat[0].subcategoryID == "14" || subcat[0].subcategoryID == "15" || subcat[0].subcategoryID == "16"
        || subcat[0].subcategoryID == "17" || subcat[0].subcategoryID == "18") {
        setReceivedStatus(true);
        FetchReceiverList();
        FetchBankList();
        setBankListStatus(true);
      }
    }
    else if (mode[0].pckModeID == "3") {
      ////console.log('Cheque================');
      if (subcat[0].subcategoryID == "7") {
        setReceivedStatus(true);
        FetchReceiverList();
        setDepositTypeStatus(true);
        FetchDepositType();

      }
      else if (subcat[0].subcategoryID == "9" || subcat[0].subcategoryID == "10" || subcat[0].subcategoryID == "11"
        || subcat[0].subcategoryID == "12"
        || subcat[0].subcategoryID == "13" || subcat[0].subcategoryID == "14" || subcat[0].subcategoryID == "15" || subcat[0].subcategoryID == "16"
        || subcat[0].subcategoryID == "17" || subcat[0].subcategoryID == "18"
      ) {
        setReceivedStatus(true);
        FetchReceiverList();
        setDepositTypeStatus(true);
        FetchDepositType();
      }
    }

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

  }

  const onReceivedFormChanged = (text) => {
    setReceivedForm(text);
    setRFError(false);
  };

  const onChequeNoChange = (text) => {
    setChequeNo(text);
    setChequeNoError(false);
  };

  const onUTRNoChange = (text) => {
    setUTRNo(text);
    setUTRNoError(false);
  };

  const onNotesChange = (text) => {
    setNotes(text);
    setNotesError(false);
  };

  const onDepositeTypeChanged = (text) => {
    setDepositeType(text);
    setDTError(false);
  };
  const onBankListChanged = (text) => {
    setMyBankList(text);
    setBLError(false);
  };


  const onAmount = (text) => {
    settAmount(text);
    setAmountError(false);
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

  const InsertData = () => {
   //console.log('insert===================');
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
      filePath != null && filePath != undefined && filePath.type != undefined && filePath.type != null
        ? {
          name: "appimage1212.jpg",
          type: filePath.type + "/*",
          uri: Platform.OS === "android" ? filePath.uri : filePath.uri.replace("file://", ""),
        }
        : ""
    );
    //console.log(params);
    //console.log(datas);
    Provider.createDFPocketDairyWithHeader(Provider.API_URLS.pckaddsourcecreate, datas)
      .then((response) => {
       //console.log(response.data);
        if (response.data && response.data.code === 200) {
          route.params.fetchData("add");
          navigation.goBack();
        } else if (response.data.code === 304) {
          setSnackbarText(communication.AlreadyExists);
          setSnackbarVisible(true);
        } else {
          setSnackbarText(communication.InsertError);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
       //console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
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
          {/* <TextInput mode="flat" label="Entry Type" disabled={true} value={entryType} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} style={{ backgroundColor: "white" }} error={entryTypeError} /> */}
          <Dropdown label="Entry Type" forceDisable={entryTypeDisable} data={entryTypeData} onSelected={onEntryTypeChanged} selectedItem={entryType} />

          <TextInput mode="flat" label="Amount" value={amount} keyboardType="number-pad" returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onAmount} style={{ backgroundColor: "white" }} error={amountError} />
          <HelperText type="error" visible={amountError}>
            {communication.InvalidAmount}
          </HelperText>

          <Dropdown label="Receipt Mode" data={receiptModeData} onSelected={onReceiptModeChanged} isError={errorRM} selectedItem={receiptMode} />
          <HelperText type="error" visible={errorRM}>
            {communication.InvalidReceiptMode}
          </HelperText>

          <Dropdown label="Source / Receipt " data={sourceData} onSelected={onSourceChanged} isError={errorSS} selectedItem={source} />
          <HelperText type="error" visible={errorSS}>
            {communication.InvalidSource}
          </HelperText>

          <Dropdown label="Sub Category Name" data={subCategoryNameData} onSelected={onSubCategoryNameChanged} isError={errorSCN} selectedItem={subCategoryName} />
          <HelperText type="error" visible={errorSCN}>
            {communication.InvalidSubCategoryName}
          </HelperText>

          {receivedStatus &&
            <>
              <View style={[Styles.border1, Styles.borderRadius4, Styles.padding4]}>
                <Dropdown label="Recevied Form" data={receivedFormData} onSelected={onReceivedFormChanged} isError={errorRF} selectedItem={receivedForm} />
                <HelperText type="error" visible={errorRF}>
                  {communication.InvalidReceivedForm}
                </HelperText>
                <Button
                  icon={"plus"}
                  mode="contained"
                  onPress={() => {
                    navigation.navigate("AddGMyContactsScreen", {
                      type: "newContact",
                      fetchReceiverList: FetchReceiverList,
                    });
                  }}
                >
                  Add New Contact
                </Button>
              </View>
            </>
          }

          {depositTypeStatus &&
            <>
              <Dropdown label="Deposit Type" data={depositeTypeData} onSelected={onDepositeTypeChanged} isError={errorDT} selectedItem={depositeType} />
              <HelperText type="error" visible={errorDT}>
                {communication.InvalidDepositeType}
              </HelperText>
            </>
          }

          {bankListStatus &&
            <>
              <View style={[Styles.border1, Styles.borderRadius4, Styles.padding4, Styles.marginTop8]}>
                <Dropdown label="My Bank List" data={myBankListData} onSelected={onBankListChanged} isError={errorBL} selectedItem={myBankList} />
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
            </>
          }

          {chequeNoStatus &&
            <>
              <TextInput mode="flat" label="Cheque No" value={chequeNo} returnKeyType="next" keyboardType="number-pad" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onChequeNoChange} style={{ backgroundColor: "white" }} error={chequeNoError} />
              <HelperText type="error" visible={chequeNoError}>
                {communication.InvalidChequeNo}
              </HelperText>
            </>
          }

          {UTRNoStatus &&
            <>
              <TextInput mode="flat" label="UTR No" value={UTRNo} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onUTRNoChange} style={{ backgroundColor: "white" }} error={UTRNoError} />
              <HelperText type="error" visible={UTRNoError}>
                Please enter valid UTR No
              </HelperText>
            </>
          }

          {chequeDateStatus &&
            <>
              <View >
                <DateTimePicker style={Styles.backgroundColorWhite} label="Cheque Date" type="date" value={chequeDate} onChangeDate={setChequeDate} />
                <HelperText type="error" visible={chequeDateError}>
                  Please enter a valid date
                </HelperText>
              </View>
            </>
          }

          {paymentReminderStatus &&
            <>
              <View>
                <DateTimePicker style={Styles.backgroundColorWhite, Styles.marginTop16} label="Repayment Reminder Date" type="date" value={repaymentDate} onChangeDate={setRepaymentDate} />
                <HelperText type="error" visible={chequeDateError}>
                  Please enter a valid date
                </HelperText>
              </View>
            </>
          }

          {commonStatus &&
            <>
              <View style={[Styles.flexRow, Styles.flexAlignEnd, Styles.marginTop16]}>
                <Image source={{ uri: image }} style={[Styles.width104, Styles.height96, Styles.border1]} />
                <Button mode="text" onPress={chooseFile}>
                  {filePath !== null ? "Replace" : "Attachment / Slip Copy"}
                </Button>
              </View>
              <HelperText type="error" visible={errorDI}>
                {communication.InvalidDesignImage}
              </HelperText>
            </>
          }

          {commonStatus &&
            <>
              <TextInput mode="flat" label="Notes" value={notes} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onNotesChange} style={{ backgroundColor: "white" }} error={notesError} />
              <HelperText type="error" visible={notesError}>
                {communication.InvalidNotes}
              </HelperText>
            </>
          }

          {commonStatus &&

            <>
              <View style={{ width: 160 }}>
                <Checkbox.Item
                  label="Display"
                  position="leading"
                  style={{ paddingHorizontal: 2 }}
                  labelStyle={{ textAlign: "left", paddingLeft: 8 }}
                  color={theme.colors.primary}
                  status={checked ? "checked" : "unchecked"}
                  onPress={() => {
                    setChecked(!checked);
                  }}
                />
              </View>
            </>
          }

        </View>
      </ScrollView>

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
  );
};

export default AddSource;