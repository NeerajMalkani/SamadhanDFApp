import moment from "moment";
import uuid from "react-native-uuid";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Image, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Subheading, Text, RadioButton, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { AWSImagePath } from "../../../../utils/paths";
import RadioGroup from "react-native-radio-buttons-group";
import { PaperSelect } from "react-native-paper-select";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APIConverter } from "../../../../utils/apiconverter";

let userID = 0, groupID = 0, companyID = 0, branchID = 0, _pktEntryTypeID = 0;

const AddExpenses = ({ route, navigation }) => {

  const [RecurringRadioButtons, setRecurringRadioButtons] = useState([
    {
      id: "1", // acts as primary key, should be unique and non-empty string
      label: "Yes",
      selected: true,
      value: "1",
    },
    {
      id: "2",
      label: "No",
      selected: false,
      value: "2",
    },
  ]);

  function onPressRecurringRadioButton(radioButtonsArray) {
    setRecurringRadioButtons(radioButtonsArray);

    radioButtonsArray.map((r) => {

      if (r.selected === true) {

        setrecurringDateFlag(r.value);

        if (r.label == "No") {
          setRecurringReminderDateStatus(false)
        }
        else {
          setRecurringReminderDateStatus(true);
        }
      }
    });
  }

  //#region Variables

  const [date, setDate] = useState(new Date());
  const [dateInvalid, setDateInvalid] = useState("");
  const dateRef = useRef({});

  const [entryTypeError, setEntryTypeError] = React.useState(false);
  const [entryType, setEntryType] = React.useState(route.params.type === "edit" ? route.params.data.entryType : "");

  const [subCategoryNameFullData, setSubCategoryNameFullData] = React.useState([]);
  const [subCategoryNameData, setSubCategoryNameData] = React.useState([]);
  const [subCategoryName, setSubCategoryName] = React.useState([]);
  const [errorSCN, setSCNError] = React.useState(false);

  const [payModeFullData, setPayModeFullData] = React.useState([]);
  const [payModeData, setPayModeData] = React.useState([]);
  const [payMode, setPayMode] = React.useState([]);
  const [errorPM, setPMError] = React.useState(false);

  const [cardTypeFullData, setCardTypeFullData] = React.useState([]);
  const [cardTypeData, setCardTypeData] = React.useState([]);
  const [cardType, setCardType] = React.useState([]);
  const [errorCT, setCTError] = React.useState(false);

  const [cardBankFullData, setCardBankFullData] = React.useState([]);
  const [cardBankData, setCardBankData] = React.useState([]);
  const [cardBank, setCardBank] = React.useState([]);
  const [errorCB, setCBError] = React.useState(false);

  const [cardRepayment, setCardRepayment] = useState(new Date());
  const [cardRepaymentInvalid, setCardRepaymentInvalid] = useState("");
  const [errorCRPayment, setErrorCRPayment] = React.useState(false);
  const cardRepaymentRef = useRef({});

  const [expensesFullData, setExpensesFullData] = React.useState([]);
  const [expensesData, setExpensesData] = React.useState([]);
  const [expenses, setExpenses] = React.useState([]);
  const [errorEX, setEXError] = React.useState(false);

  const [amountError, setAmountError] = React.useState(false);
  const [amount, settAmount] = React.useState(route.params.type === "edit" ? route.params.data.amount : "");

  const [paidToFullData, setPaidToFullData] = React.useState([]);
  const [paidToData, setPaidToData] = React.useState([]);
  const [paidTo, setPaidTo] = React.useState([]);
  const [errorPT, setPTError] = React.useState(false);

  const [recurringDate, setRecurringDate] = useState(new Date());
  const [recurringDateInvalid, setRecurringDateInvalid] = useState("");
  const [errorRD, setErrorRD] = React.useState(false);
  const recurringDateRef = useRef({});

  const [depositeTypeFullData, setDepositeTypeFullData] = React.useState([]);
  const [depositeTypeData, setDepositeTypeData] = React.useState([]);
  const [depositeType, setDepositeType] = React.useState([]);
  const [errorDT, setDTError] = React.useState(false);

  const [myBankFullData, setMyBankFullData] = React.useState([]);
  const [myBankData, setMyBankData] = React.useState([]);
  const [MyBank, setMyBank] = React.useState([]);
  const [errorMB, setMBError] = React.useState(false);

  const [chequeNoError, setChequeNoError] = React.useState(false);
  const [chequeNo, setChequeNo] = React.useState(route.params.type === "edit" ? route.params.data.chequeNo : "");

  const [utrNoError, setUtrNoError] = React.useState(false);
  const [utrNo, setUtrNo] = React.useState(route.params.type === "edit" ? route.params.data.utrNo : "");

  const [chequeDate, setChequeDate] = useState(new Date());
  const [chequeDateInvalid, setChequeDateInvalid] = useState("");
  const chequeDateRef = useRef({});

  const [image, setImage] = React.useState(route.params.type === "edit" ? route.params.data.designImage : AWSImagePath + "placeholder-image.png");
  const [filePath, setFilePath] = React.useState(route.params.type === "edit" ? { name: route.params.data.designImage } : null);
  const [designImage, setDesignImage] = React.useState(route.params.type === "edit" ? route.params.data.designImage : "");
  const [errorDI, setDIError] = React.useState(false);

  const [notesError, setNotesError] = React.useState(false);
  const [notes, setNotes] = React.useState(route.params.type === "edit" ? route.params.data.notes : "");

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const [recurring, setRecurring] = useState({
    value: "",
    list: [],
    selectedList: [],
    error: "",
  });

  const [pktEntryTypeID, setPktEntryTypeID] = React.useState("");

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const ref_input2 = useRef();
  const ref_input3 = useRef();

  const [cardTypeStatus, setCardTypeStatus] = React.useState(false);
  const [cardBankNameStatus, setCardBankNameStatus] = React.useState(false);
  const [cardRepaymentDateStatus, setCardRepaymentDateStatus] = React.useState(false);
  const [paidToStatus, setPaidToStatus] = React.useState(false);
  const [recurringStatus, setRecurringStatus] = React.useState(false);
  const [recurringReminderDateStatus, setRecurringReminderDateStatus] = React.useState(false);
  const [depositTypeStatus, setDepositTypeStatus] = React.useState(false);
  const [bankStatus, setBankStatus] = React.useState(false);
  const [utrNoStatus, setUtrNoStatus] = React.useState(false);
  const [chequeNoStatus, setChequeNoStatus] = React.useState(false);
  const [chequeDateStatus, setChequeDateStatus] = React.useState(false);
  const [commonDisplayStatus, setCommonDisplayStatus] = React.useState(false);
  const [buttonStatus, setButtonStatus] = React.useState(true);
  const [recurringDateFlat, setrecurringDateFlag] = useState("1");
  const [pckTransID, setPckTransID] = React.useState([]);
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
    FetchPaymentMode(route.params.data.pck_mode_refno);

    if (route.params.data.cardtype_refno != "" && route.params.data.cardtype_refno != "0") {
      setCardTypeStatus(true);
      FetchCardType(route.params.data.cardtype_refno);
    }

    if (route.params.data.pck_card_mybank_refno != "" && route.params.data.pck_card_mybank_refno != "0") {
      setCardBankNameStatus(true);
      FetchCardBankList(route.params.data.cardtype_refno, route.params.data.pck_card_mybank_refno);
    }

    if (route.params.data.due_date != "" && route.params.data.due_date != "0" && route.params.data.due_date != null) {
      setCardRepaymentDateStatus(true);
      let dateBreakup = route.params.data.due_date.split('-');
      setCardRepayment(new Date(dateBreakup[2] + '/' + dateBreakup[1] + '/' + dateBreakup[0]));
    }

    FetchExpenseCategory(route.params.data.pck_mode_refno, route.params.data.pck_category_refno);
    FetchExpenseSubCategory(route.params.data.pck_category_refno, route.params.data.pck_sub_category_refno);

    if (route.params.data.pck_mycontact_refno != "" && route.params.data.pck_mycontact_refno != "0") {
      setPaidToStatus(true);
      FetchReceiverList(route.params.data.pck_mycontact_refno);
    }

    if (route.params.data.recurring_status != "" && route.params.data.recurring_status != "0") {
      setRecurringStatus(true);

      let recc = [...RecurringRadioButtons];
      recc.map((r) => {

        if (r.id == route.params.data.recurring_status) {

          setrecurringDateFlag(r.value);

          if (r.label == "No") {
            setRecurringReminderDateStatus(false)
          }
          else {
            setRecurringReminderDateStatus(true);
          }
        }
      });

      setRecurringRadioButtons(recc);
    }

    if (route.params.data.reminder_date != "" && route.params.data.reminder_date != "0" && route.params.data.reminder_date != null) {
      let dateBreakup = route.params.data.reminder_date.split('-');
      setRecurringDate(new Date(dateBreakup[2] + '/' + dateBreakup[1] + '/' + dateBreakup[0]));
    }

    if (route.params.data.deposit_type_refno != "" && route.params.data.deposit_type_refno != "0") {
      setDepositTypeStatus(true);
      FetchDepositType(route.params.data.deposit_type_refno);
    }

    if (route.params.data.pck_mybank_refno != "" && route.params.data.pck_mybank_refno != "0") {
      setBankStatus(true);
      FetchBankList(route.params.data.pck_mybank_refno);
    }

    if (route.params.data.utr_no != "" && route.params.data.utr_no != "0") {
      setUtrNoStatus(true);
      setUtrNo(route.params.data.utr_no);
    }

    if (route.params.data.cheque_no != "" && route.params.data.cheque_no != "0") {
      setChequeNoStatus(true);
      setChequeNo(route.params.data.cheque_no);
    }

    if (route.params.data.cheque_date != "" && route.params.data.cheque_date != "0" && route.params.data.cheque_date != null) {
      let dateBreakup = route.params.data.cheque_date.split('-');
      setChequeDateStatus(true);
      setChequeDate(new Date(dateBreakup[2] + '/' + dateBreakup[1] + '/' + dateBreakup[0]));
    }

    setCommonDisplayStatus(true);

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
        if (response.data && response.data.code === 200) {
          if (response.data.data) {

            setPktEntryTypeID(response.data.data[0].pck_entrytype_refno);
            setEntryType(response.data.data[0].pck_entrytype_name);

            if (route.params.type != "edit") {
              FetchPaymentMode();//expense=2 need to confirm from balaji
            }

          }
        }
      })
      .catch((e) => { });
  };

  const FetchPaymentMode = (editID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        pck_transtype_refno: 2,
      }
    }
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckpaymentmodetype, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            //console.log('payment mode ============');
            //console.log(editID);
            //console.log(response.data.data);
            response.data.data = APIConverter(response.data.data);
            setPayModeFullData(response.data.data);
            const receiptMode = response.data.data.map((data) => data.pckModeName);
            setPayModeData(receiptMode);
           //console.log(response.data.data);
            if (editID != "") {
             //console.log('edit start ****************************');
            //  //console.log(response.data.data.filter((el) => {
            //     return el.pckModeID == editID;
            //   })[0].pckModeName);
              setPayMode(response.data.data.filter((el) => {
                return el.pckModeID == editID;
              })[0].pckModeName);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchExpenseCategory = (receiptModeID, editID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID,
        pck_mode_refno: receiptModeID,
        pck_entrytype_refno: route.params.type === "edit" ? _pktEntryTypeID : pktEntryTypeID
      }
    }
    Provider.createDFPocketDairy(Provider.API_URLS.getcategoryname_pckaddexpensesform, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setExpensesFullData(response.data.data);
            const category = response.data.data.map((data) => data.categoryName);
            setExpensesData(category);

            if (editID != null) {
              setExpenses(response.data.data.filter((el) => {
                return el.pckCategoryID === editID;
              })[0].categoryName);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchExpenseSubCategory = (categoryID, editID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID,
        pck_category_refno: categoryID,
      }
    }
    Provider.createDFPocketDairy(Provider.API_URLS.getsubcategoryname_pckaddexpensesform, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data, "pkt_subcat");
            setSubCategoryNameFullData(response.data.data);
            const subCategory = response.data.data.map((data) => data.subCategoryName);
            setSubCategoryNameData(subCategory);

            if (editID != null) {
              setSubCategoryName(response.data.data.filter((el) => {
                return el.subcategoryID === editID;
              })[0].subCategoryName);

            }

          }
        }
      })
      .catch((e) => { });
  };

  const FetchBankList = (editID) => {
    ////console.log('calling bank======');
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID.toString(),
        Sess_branch_refno: branchID.toString(),
        Sess_group_refno: groupID.toString(),
        pck_entrytype_refno: route.params.type === "edit" ? _pktEntryTypeID : pktEntryTypeID
      }
    }
    ////console.log(params);
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckmybankname, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {

            response.data.data = APIConverter(response.data.data, "pkt_subcat");
            setMyBankFullData(response.data.data);

            const bank = response.data.data.map((data) => data.bankName);
            setMyBankData(bank);

            if (editID != null) {
              setMyBank(response.data.data.filter((el) => {
                return el.bank_refno === editID;
              })[0].bankName)
            }

          }
        }
      })
      .catch((e) => { });
  };

  const FetchDepositType = (editID) => {
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

            if (editID != null) {
              setDepositeType(response.data.data.filter((el) => {
                return el.deposit_type_refno == editID;
              })[0].deposit_type_name);
            }
          }
        }
      })
      .catch((e) => { });
  };


  const FetchReceiverList = (editID) => {
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

            setPaidToFullData(response.data.data);

            const receiverList = response.data.data.map((data) => data.contactName);
            setPaidToData(receiverList);

            if (editID != null) {
              setPaidTo(response.data.data.filter((el) => {
                return el.mycontactID === editID;
              })[0].contactName);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchCardType = (editID) => {
   //console.log('start card type');
    let params = {
      data: {
        Sess_UserRefno: userID
      }
    }
    Provider.createDFPocketDairy(Provider.API_URLS.getcardtype_pckaddexpensesform, params)
      .then((response) => {
       //console.log(response.data.data);
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setCardTypeFullData(response.data.data);
            const cardType = response.data.data.map((data) => data.cardtype_name);
           //console.log(cardType);
            setCardTypeData(cardType);
           //console.log('card type setting===================');
           //console.log(editID);
           //console.log(response.data.data);
            
            if (editID != "") {
              setCardType(response.data.data.filter((el) => {
                return el.cardtype_refno == editID;
              })[0].cardtype_name);
            }

          }
        }
      })
      .catch((e) => { });
  };

  const FetchCardBankList = (cardtypeID, editID) => {
    ////console.log('calling bank======');
    let params = {
      data: {
        Sess_UserRefno: userID,
        cardtype_refno: cardtypeID
      }
    }
    ////console.log(params);
    Provider.createDFPocketDairy(Provider.API_URLS.getcardbankname_pckaddexpensesform, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {

            response.data.data = APIConverter(response.data.data, "pkt_subcat");
            setCardBankFullData(response.data.data);

            const bank = response.data.data.map((data) => data.bankName);
            setCardBankData(bank);

            if (editID != null) {
              setCardBank(response.data.data.filter((el) => {
                return el.bank_refno === editID;
              })[0].bankName)
            }

          }
        }
      })
      .catch((e) => { });
  };

  const onPayModeChanged = (text) => {
    setPayMode(text);
    setPMError(false);
    let a = payModeFullData.filter((el) => {
      return el.pckModeName === text;
    });

    FetchExpenseCategory(a[0].pckModeID);

    if (a[0].pckModeID == 5) {
      setCardTypeStatus(true);
      FetchCardType();
    }
  };


  const onExpensesChanged = (text) => {
    setExpenses(text);
    setEXError(false);
    let a = expensesFullData.filter((el) => {
      return el.categoryName === text;
    });

    FetchExpenseSubCategory(a[0].pckCategoryID);

  };

  const onCardTypeChanged = (text) => {
    setCardType(text);
    setCTError(false);
    setCardBankNameStatus(true);

    let cardID = cardTypeFullData.filter((el) => {
      return el.cardtype_name === text;
    })[0].cardtype_refno;

    FetchCardBankList(cardID);

    if (cardID == 2) {
      setCardRepaymentDateStatus(true);
    }
    else {
      setCardRepaymentDateStatus(false);
    }
  };

  const onCardBankNameChanged = (text) => {
    setCardBank(text);
    setCBError(false);
  };

  const onSubCategoryNameChanged = (text) => {
    setSubCategoryName(text);
    setSCNError(false);

    setCommonDisplayStatus(true);
    setButtonStatus(false);

    let mode = payModeFullData.filter((el) => {
      return el.pckModeName === payMode;
    });

    // let category = expensesFullData.filter((el) => {
    //   return el.categoryName === expenses;
    // });

    let subcat = subCategoryNameFullData.filter((el) => {
      return el.subCategoryName === text;
    });

    let deposit = depositeTypeFullData.filter((el) => {
      return el.deposit_type_name === depositeType;
    });

   //console.log(mode);
    //console.log(category);
   //console.log(subcat);
   //console.log(deposit);

    if (mode[0].pckModeID == "1") {

      if (subcat[0].subcategoryID == "8") {
        setPaidToStatus(true);
        FetchReceiverList();

        setRecurringStatus(true);
        setRecurringReminderDateStatus(true);
      }
      else {
        setPaidToStatus(false);
        setRecurringStatus(false);
        setRecurringReminderDateStatus(false);
      }
    }
    else if (mode[0].pckModeID == "2" || mode[0].pckModeID == "4") {
      FetchBankList();
      setUtrNoStatus(true);
      setBankStatus(true);

      if (subcat[0].subcategoryID == "8") {
        setPaidToStatus(true);
        FetchReceiverList();

        setRecurringStatus(true);
        setRecurringReminderDateStatus(true);

      }
      else {
        setPaidToStatus(false);
        FetchReceiverList();

        setRecurringStatus(false);
        setRecurringReminderDateStatus(false);
      }
    }
    else if (mode[0].pckModeID == "3") {

      setDepositTypeStatus(true);
      FetchDepositType();

      if (subcat[0].subcategoryID == "8") {
        //FetchBankList();
        //setUtrNoStatus(true);
        //setBankStatus(true);

        setPaidToStatus(true);
        FetchReceiverList();

        setRecurringStatus(true);
        setRecurringReminderDateStatus(true);
      }
      else {
        setPaidToStatus(false);
        FetchReceiverList();

        setRecurringStatus(false);
        setRecurringReminderDateStatus(false);
      }
    }

  };

  const onDepositeTypeChanged = (text) => {
    setDepositeType(text);
    setDTError(false);

    let mode = payModeFullData.filter((el) => {
      return el.pckModeName === payMode;
    });

    let subcat = subCategoryNameFullData.filter((el) => {
      return el.subCategoryName === subCategoryName;
    });

    let deposit = depositeTypeFullData.filter((el) => {
      return el.deposit_type_name === text;
    });

   //console.log(mode);
   //console.log(subcat);
   //console.log(deposit);

    FetchBankList();
    setBankStatus(true);
    setChequeNoStatus(true);
    setChequeDateStatus(true);

    if (mode[0].pckModeID == "3") {

      if (subcat[0].subcategoryID == "8") {

        //setUtrNoStatus(true);

        setPaidToStatus(true);
        FetchReceiverList();

        setRecurringStatus(true);
        setRecurringReminderDateStatus(true);
      }
      else {
        setPaidToStatus(false);
        FetchReceiverList();

        setRecurringStatus(false);
        setRecurringReminderDateStatus(false);
      }
    }

  };



  const onEntryType = (text) => {
    setEntryType(text);
    setEntryTypeError(false);
  };


  const onAmount = (text) => {
    settAmount(text);
    setAmountError(false);
  };

  const onChequeNO = (text) => {
    setChequeNo(text);
    setChequeNoError(false);
  };

  const onUtrNo = (text) => {
    setUtrNo(text);
    setUtrNoError(false);
  };

  const onNotes = (text) => {
    setNotes(text);
    setNotesError(false);
  };



  const onPaidToChanged = (text) => {
    setPaidTo(text);
    setPTError(false);
  };


  const onMyBankChanged = (text) => {
    setMyBank(text);
    setMBError(false);
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
    const datas = new FormData();
    let params = {

      Sess_UserRefno: userID,
      pck_entrytype_refno: pktEntryTypeID,
      pck_mode_refno: payModeFullData.filter((el) => {
        return el.pckModeName === payMode;
      })[0].pckModeID,

      pck_category_refno: expensesFullData.filter((el) => {
        return el.categoryName === expenses;
      })[0].pckCategoryID,

      pck_sub_category_refno: subCategoryNameFullData.filter((el) => {
        return el.subCategoryName === subCategoryName;
      })[0].subcategoryID,

      amount: amount.trim(),
      notes: notes.trim(),

      // myclient_refno: 0,
      // cont_project_refno: 0,
      // invoice_no: 0,
      // payment_type_refno: 0,
      // dynamic_expenses_refno: 0,
      view_status: checked ? "1" : "0"

    }

    if (cardTypeStatus) {
      params.cardtype_refno = cardTypeFullData.filter((el) => {
        return el.cardtype_name === cardType;
      })[0].cardtype_refno;
    }

    if (cardBankNameStatus) {
      params.pck_card_mybank_refno = cardBankFullData.filter((el) => {
        return el.bankName === cardBank;
      })[0].bank_refno;
    }

    if (cardRepaymentDateStatus) {
      params.due_date = cardRepayment == "" ? "" : moment(cardRepayment).format("DD-MM-YYYY");
    }

    if (paidToStatus) {
      params.pck_mycontact_refno = paidToFullData.filter((el) => {
        return el.contactName === paidTo;
      })[0].mycontactID;
    }

    if (bankStatus) {
      params.pck_mybank_refno = myBankFullData.filter((el) => {
        return el.bankName === MyBank;
      })[0].bank_refno;
    }

    if (utrNoStatus) {
      params.utr_no = utrNo.trim();
    }

    if (chequeNoStatus) {
      params.cheque_no = chequeNo.trim();
    }

    if (depositTypeStatus) {
      params.deposit_type_refno = depositeTypeFullData.filter((el) => {
        return el.deposit_type_name === depositeType;
      })[0].deposit_type_refno;
    }

    if (chequeDateStatus) {
      params.cheque_date = chequeDate == "" ? "" : moment(chequeDate).format("DD-MM-YYYY");
    }

    if (recurringReminderDateStatus) {
      params.reminder_date = recurringDate == "" ? "" : moment(recurringDate).format("DD-MM-YYYY");
    }

    if (recurringStatus) {
      params.recurring_status = recurringDateFlat
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
   //console.log('data params ================');
   //console.log(datas);
    Provider.createDFPocketDairyWithHeader(Provider.API_URLS.pckaddexpensescreate, datas)
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
       console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const UpdateData = () => {
   //console.log('update===================');
    const datas = new FormData();
    let params = {

      Sess_UserRefno: userID,
      pck_trans_refno: pckTransID,

      pck_entrytype_refno: pktEntryTypeID,
      pck_mode_refno: payModeFullData.filter((el) => {
        return el.pckModeName === payMode;
      })[0].pckModeID,

      pck_category_refno: expensesFullData.filter((el) => {
        return el.categoryName === expenses;
      })[0].pckCategoryID,

      pck_sub_category_refno: subCategoryNameFullData.filter((el) => {
        return el.subCategoryName === subCategoryName;
      })[0].subcategoryID,

      amount: amount.trim(),
      notes: notes.trim(),

      // myclient_refno: 0,
      // cont_project_refno: 0,
      // invoice_no: 0,
      // payment_type_refno: 0,
      // dynamic_expenses_refno: 0,
      view_status: checked ? "1" : "0"

    }

    if (cardTypeStatus) {
      params.cardtype_refno = cardTypeFullData.filter((el) => {
        return el.cardtype_name === cardType;
      })[0].cardtype_refno;
    }

    if (cardBankNameStatus) {
      params.pck_card_mybank_refno = cardBankFullData.filter((el) => {
        return el.bankName === cardBank;
      })[0].bank_refno;
    }

    if (cardRepaymentDateStatus) {
      params.due_date = cardRepayment == "" ? "" : moment(cardRepayment).format("DD-MM-YYYY");
    }

    if (paidToStatus) {
      params.pck_mycontact_refno = paidToFullData.filter((el) => {
        return el.contactName === paidTo;
      })[0].mycontactID;
    }

    if (bankStatus) {
      params.pck_mybank_refno = myBankFullData.filter((el) => {
        return el.bankName === MyBank;
      })[0].bank_refno;
    }

    if (utrNoStatus) {
      params.utr_no = utrNo.trim();
    }

    if (chequeNoStatus) {
      params.cheque_no = chequeNo.trim();
    }

    if (depositTypeStatus) {
      params.deposit_type_refno = depositeTypeFullData.filter((el) => {
        return el.deposit_type_name === depositeType;
      })[0].deposit_type_refno;
    }

    if (chequeDateStatus) {
      params.cheque_date = chequeDate == "" ? "" : moment(chequeDate).format("DD-MM-YYYY");
    }

    if (recurringReminderDateStatus) {
      params.reminder_date = recurringDate == "" ? "" : moment(recurringDate).format("DD-MM-YYYY");
    }

    if (recurringStatus) {
      params.recurring_status = recurringDateFlat
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
    Provider.createDFPocketDairyWithHeader(Provider.API_URLS.pckaddexpensesupdate, datas)
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

    if (amount.trim() === 0) {
      setAmountError(true);
      isValid = false;
    }

    if (payMode == "") {
      isValid = false;
      setPMError(true);
    }

    if (cardTypeStatus && cardType == "") {
      setCTError(true);
      isValid = false;
    }

    if (cardBankNameStatus && cardBank == "") {
      setCBError(true);
      isValid = false;
    }

    if (cardRepaymentDateStatus && cardRepayment == "") {
      setErrorCRPayment(true);
      isValid = false;
    }

    if (expenses == "") {
      setEXError(true);
      isValid = false;
    }

    if (subCategoryName == "") {
      setSCNError(true);
      isValid = false;
    }

    if (paidToStatus && paidTo == "") {
      setPTError(true);
      isValid = false;
    }

    if (recurringReminderDateStatus && recurringDate == "") {
      setErrorRD(true);
      isValid = false;
    }

    if (bankStatus && MyBank == "") {
      setMBError(true);
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

  //#endregion 

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>

          <TextInput mode="flat" label="Entry Type" disabled={true} value={entryType} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onEntryType} style={{ backgroundColor: "white" }} error={entryTypeError} />
          <HelperText type="error" visible={entryTypeError}>
            {communication.InvalidEntryType}
          </HelperText>

          <TextInput mode="flat" label="Amount" value={amount} returnKeyType="next" keyboardType="number-pad" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onAmount} style={{ backgroundColor: "white" }} error={amountError} />
          <HelperText type="error" visible={amountError}>
            {communication.InvalidAmount}
          </HelperText>

          <Dropdown label="Payment Mode" data={payModeData} onSelected={onPayModeChanged} isError={errorPM} selectedItem={payMode} />
          <HelperText type="error" visible={errorPM}>
            Please select valid payment mode
          </HelperText>

          {cardTypeStatus &&
            <>
              <Dropdown label="Card Type" data={cardTypeData} onSelected={onCardTypeChanged} isError={errorCT} selectedItem={cardType} />
              <HelperText type="error" visible={errorCT}>
                Please select a valid card type
              </HelperText>
            </>
          }

          {cardBankNameStatus &&
            <>
              <Dropdown label="Card Bank Name" data={cardBankData} onSelected={onCardBankNameChanged} isError={errorCB} selectedItem={cardBank} />
              <HelperText type="error" visible={errorCB}>
                Please select valid bank
              </HelperText>
            </>
          }

          {cardRepaymentDateStatus &&

            <>
              <View >
                <DateTimePicker style={Styles.backgroundColorWhite} isError={errorCRPayment} label="Credit Card Repayment Due Date" type="date" value={cardRepayment} onChangeDate={setCardRepayment} />
                <HelperText type="error" visible={errorCRPayment}>
                  Please select a valid date
                </HelperText>
              </View>
            </>
          }

          <Dropdown label="Expenses / Payment" data={expensesData} onSelected={onExpensesChanged} isError={errorEX} selectedItem={expenses} />
          <HelperText type="error" visible={errorEX}>
            Please select valid Expenses / Payment
          </HelperText>

          <Dropdown label="Sub Category Name" data={subCategoryNameData} onSelected={onSubCategoryNameChanged} isError={errorSCN} selectedItem={subCategoryName} />
          <HelperText type="error" visible={errorSCN}>
            Please select valid sub category
          </HelperText>

          {paidToStatus &&
            <>
              <View style={[Styles.border1, Styles.borderRadius4, Styles.padding4, Styles.marginBottom16]}>
                <Dropdown label="Paid To" data={paidToData} onSelected={onPaidToChanged} isError={errorPT} selectedItem={paidTo} />
                <HelperText type="error" visible={errorPT}>
                  Please select valid recepient
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

          {recurringStatus &&

            <>
              <View style={[Styles.marginTop0, Styles.marginBottom32]}>
                <Text>Recurring</Text>
                <RadioGroup containerStyle={[Styles.marginTop16]} layout="row" radioButtons={RecurringRadioButtons} onPress={onPressRecurringRadioButton} />
              </View>
            </>

          }

          {recurringReminderDateStatus &&

            <>
              <View>
                <DateTimePicker style={Styles.backgroundColorWhite, Styles.marginBottom12} isError={errorRD} label="Recurring Reminder Date" type="date" value={recurringDate} onChangeDate={setRecurringDate} />
                <HelperText type="error" visible={errorRD}>
                  Please select a valid date
                </HelperText>
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

          {bankStatus &&

            <>
              <View style={[Styles.border1, Styles.borderRadius4, Styles.padding4, Styles.marginTop8]}>
                <Dropdown label="My Bank List" data={myBankData} onSelected={onMyBankChanged} isError={errorMB} selectedItem={MyBank} />
                <HelperText type="error" visible={errorMB}>
                  Please select valid bank
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

          {utrNoStatus &&
            <>
              <TextInput mode="flat" label="UTR No" value={utrNo} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onUtrNo} style={{ backgroundColor: "white" }} />
            </>

          }

          {chequeNoStatus &&

            <>
              <TextInput mode="flat" label="Cheque No" value={chequeNo} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onChequeNO} style={{ backgroundColor: "white" }} error={chequeNoError} />
            </>

          }

          {chequeDateStatus &&
            <>
              <View >
                <DateTimePicker style={Styles.backgroundColorWhite} label="Cheque Date" type="date" value={chequeDate} onChangeDate={setChequeDate} />
              </View>
            </>
          }

          {commonDisplayStatus &&

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

          {commonDisplayStatus &&
            <>
              <TextInput mode="flat" label="Notes" value={notes} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onNotes} style={{ backgroundColor: "white" }} />
            </>
          }

          {commonDisplayStatus &&
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

export default AddExpenses;
