import moment from "moment";
import uuid from "react-native-uuid";
import React, { useEffect, useRef, useState } from "react";
import { ScrollView, Image, View } from "react-native";
import {
  Button,
  Card,
  Checkbox,
  HelperText,
  Snackbar,
  Subheading,
  Text,
  RadioButton,
  TextInput,
  DataTable,
} from "react-native-paper";
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
import { projectVariables } from "../../../../utils/credentials";
import * as Contacts from "expo-contacts";

let userID = 0,
  groupID = 0,
  companyID = 0,
  branchID = 0,
  _pktEntryTypeID = 0,
  designID = 0,
  companyAdminID = 0;

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
          setRecurringReminderDateStatus(false);
        } else {
          setRecurringReminderDateStatus(true);
        }
      }
    });
  }

  //#region Variables

  const [date, setDate] = useState(new Date());
  const [dateInvalid, setDateInvalid] = useState("");
  const dateRef = useRef({});

  const [entryTypeData, setEntryTypeData] = React.useState([]);
  const [entryTypeFullData, setEntryTypeFullData] = React.useState([]);
  const [entryTypeError, setEntryTypeError] = React.useState(false);
  const [entryType, setEntryType] = React.useState(
    route.params?.data?.entryType
  );
  const [entryTypeDisable, setEntryTypeDisable] = React.useState(true);

  const [subCategoryNameFullData, setSubCategoryNameFullData] = React.useState(
    []
  );
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
  const [amount, settAmount] = React.useState(route?.params?.data?.amount);
  const [amountInvalidBalance, setAmountInvalidBalance] = React.useState(
    "Amount can not be more then balance amount"
  );

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

  const [clientListFullData, setClientListFullData] = React.useState([]);
  const [clientListData, setClientListData] = React.useState([]);
  const [clientList, setClientList] = React.useState([]);
  const [errorCL, setErrorCL] = React.useState(false);

  const [projectListFullData, setProjectListFullData] = React.useState([]);
  const [projectListData, setProjectListData] = React.useState([]);
  const [projectList, setProjectList] = React.useState([]);
  const [errorPL, setErrorPL] = React.useState(false);

  const [projectExpenseFullData, setProjectExpenseFullData] = React.useState(
    []
  );
  const [projectExpenseData, setProjectExpenseData] = React.useState([]);
  const [projectExpense, setProjectExpense] = React.useState([]);
  const [errorPE, setErrorPE] = React.useState(false);

  const [chequeNoError, setChequeNoError] = React.useState(false);
  const [chequeNo, setChequeNo] = React.useState(route.params?.data?.chequeNo);

  const [utrNoError, setUtrNoError] = React.useState(false);
  const [utrNo, setUtrNo] = React.useState(route.params?.data?.utrNo);

  const [chequeDate, setChequeDate] = useState(new Date());
  const [chequeDateInvalid, setChequeDateInvalid] = useState("");
  const chequeDateRef = useRef({});

  const [image, setImage] = React.useState(
    route.params.type === "edit" || route.params.type === "verify"
      ? route.params?.data?.designImage
      : AWSImagePath + "placeholder-image.png"
  );
  const [filePath, setFilePath] = React.useState(
    route.params.type === "edit" || route.params.type === "verify"
      ? { name: route.params?.data?.designImage }
      : null
  );
  const [designImage, setDesignImage] = React.useState(
    route.params?.data?.designImage
  );
  const [errorDI, setDIError] = React.useState(false);

  const [notesError, setNotesError] = React.useState(false);
  const [notes, setNotes] = React.useState(route.params?.data?.notes);

  const [checked, setChecked] = React.useState(
    route.params.type === "edit" || route.params.type === "verify"
      ? route.params?.data?.display
      : true
  );

  const [recurring, setRecurring] = useState({
    value: "",
    list: [],
    selectedList: [],
    error: "",
  });

  const [pktEntryTypeID, setPktEntryTypeID] = React.useState("1");

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );

  const ref_input2 = useRef();
  const ref_input3 = useRef();

  const [cardTypeStatus, setCardTypeStatus] = React.useState(false);
  const [cardBankNameStatus, setCardBankNameStatus] = React.useState(false);
  const [cardRepaymentDateStatus, setCardRepaymentDateStatus] =
    React.useState(false);
  const [paidToStatus, setPaidToStatus] = React.useState(false);
  const [recurringStatus, setRecurringStatus] = React.useState(false);
  const [recurringReminderDateStatus, setRecurringReminderDateStatus] =
    React.useState(false);
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
  const [subCatStatus, setSubCatStatus] = React.useState(true);
  const [clientListStatus, setClientListstatus] = React.useState(false);
  const [projectListStatus, setProjectListstatus] = React.useState(false);
  const [projectExpenseStatus, setProjectExpenseStatus] = React.useState(false);
  const [PayToCompanyStatus, setPayToCompanyStatus] = React.useState(false);
  const [projectExpenseDisable, setProjectExpenseDisable] =
    React.useState(false);
  const [entryTypeStatus, setEntryTypeStatus] = React.useState(false);
  const [isContactLoading, setIsContactLoading] = useState(false);

  const [collectedAmount, setcollectedAmount] = React.useState("");
  const [paidAmount, setpaidAmount] = React.useState("");
  const [balanceAmount, setbalanceAmount] = React.useState("");

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
      companyAdminID = JSON.parse(userData).Sess_CompanyAdmin_UserRefno;
      FetchEntryType();

      if (
        route.params.type ===
        projectVariables.DEF_PCKDIARY_Dynamic_Expense_ClientAmountGivenToCompany_FlagText
      ) {
        FetchPayToCompanyData(route.params.data.transactionID);
      } else if (
        route.params.type === "edit" ||
        route.params.type === "verify"
      ) {
        SetEditData(route.params.data);
      }
    }
  };

  const FetchPayToCompanyData = (transactionID) => {
    //console.log('pay to company ============');
    let params = {
      data: {
        Sess_UserRefno: userID,
        pck_trans_refno: transactionID,
        Sess_company_refno: companyID.toString(),
        Sess_branch_refno: branchID.toString(),
        pck_transtype_refno:
          projectVariables.DEF_PCKDIARY_TRANSTYPE_SOURCE_REFNO,
        pck_entrytype_refno:
          projectVariables.DEF_PCKDIARY_ENTRYTYPE_COMPANY_REFNO,
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.pcktransrefnocheck, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            SetEditData(response.data.data[0]);
          }
        } else {
          setSnackbarText("No Company data found");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
        setRefreshing(false);
      });
  };

  const SetEditData = (data) => {
    //console.log('start edit data =====================');
    //console.log(route.params);

    setcollectedAmount(data.Collected_ActualAmount);
    setpaidAmount(data.TotalPaidAmount);
    setbalanceAmount(data.BalanceUnPaidPayment);

    setButtonStatus(false);
    setEntryType(data.pck_entrytype_name);

    if (
      route.params.type ===
      projectVariables.DEF_PCKDIARY_Dynamic_Expense_ClientAmountGivenToCompany_FlagText
    ) {
      settAmount(data.BalanceUnPaidPayment.replace(/,/g, ""));
    } else {
      settAmount(data.amount);
    }

    setPckTransID(data.pck_trans_refno);
    _pktEntryTypeID = data.pck_entrytype_refno;
    setPktEntryTypeID(data.pck_entrytype_refno);
    FetchPaymentMode(data.pck_mode_refno);

    if (data.cardtype_refno != "" && data.cardtype_refno != "0") {
      setCardTypeStatus(true);
      FetchCardType(data.cardtype_refno);
    }

    if (data.pck_card_mybank_refno != "" && data.pck_card_mybank_refno != "0") {
      setCardBankNameStatus(true);
      FetchCardBankList(data.cardtype_refno, data.pck_card_mybank_refno);
    }

    if (data.due_date != "" && data.due_date != "0" && data.due_date != null) {
      setCardRepaymentDateStatus(true);
      let dateBreakup = data.due_date.split("-");
      setCardRepayment(
        new Date(dateBreakup[2] + "/" + dateBreakup[1] + "/" + dateBreakup[0])
      );
    }

    FetchExpenseCategory(data.pck_mode_refno, data.pck_category_refno);

    if (
      data.pck_sub_category_refno != "" &&
      data.pck_sub_category_refno != "0"
    ) {
      setSubCategoryName(data.pck_sub_category_name);
      FetchExpenseSubCategory(
        data.pck_category_refno,
        data.pck_sub_category_refno
      );
    } else {
      setSubCatStatus(false);
    }

    if (data.pck_mycontact_refno != "" && data.pck_mycontact_refno != "0") {
      setPaidToStatus(true);
      FetchReceiverList(data.pck_mycontact_refno);
    }

    if (data.recurring_status != "" && data.recurring_status != "0") {
      setRecurringStatus(true);

      let recc = [...RecurringRadioButtons];
      recc.map((r) => {
        if (r.id == data.recurring_status) {
          setrecurringDateFlag(r.value);

          if (r.label == "No") {
            setRecurringReminderDateStatus(false);
          } else {
            setRecurringReminderDateStatus(true);
          }
        }
      });

      setRecurringRadioButtons(recc);
    }

    if (
      data.reminder_date != "" &&
      data.reminder_date != "0" &&
      data.reminder_date != null
    ) {
      let dateBreakup = data.reminder_date.split("-");
      setRecurringDate(
        new Date(dateBreakup[2] + "/" + dateBreakup[1] + "/" + dateBreakup[0])
      );
    }

    if (data.deposit_type_refno != "" && data.deposit_type_refno != "0") {
      setDepositTypeStatus(true);
      FetchDepositType(data.deposit_type_refno);
    }

    if (data.pck_mybank_refno != "" && data.pck_mybank_refno != "0") {
      setBankStatus(true);
      FetchBankList(data.pck_mybank_refno);
    }

    if (data.utr_no != "" && data.utr_no != "0") {
      setUtrNoStatus(true);
      setUtrNo(data.utr_no);
    }

    if (data.cheque_no != "" && data.cheque_no != "0") {
      setChequeNoStatus(true);
      setChequeNo(data.cheque_no);
    }

    if (
      data.cheque_date != "" &&
      data.cheque_date != "0" &&
      data.cheque_date != null
    ) {
      let dateBreakup = data.cheque_date.split("-");
      setChequeDateStatus(true);
      setChequeDate(
        new Date(dateBreakup[2] + "/" + dateBreakup[1] + "/" + dateBreakup[0])
      );
    }
    if (data.myclient_refno != null && data.myclient_refno != "0") {
      setClientListstatus(true);
      FetchClientList(data.myclient_refno);
    }

    if (data.cont_project_refno != null && data.cont_project_refno != "0") {
      setProjectListstatus(true);
      FetchProjectList(data.myclient_refno, data.cont_project_refno);
    }

    if (
      data.dynamic_expenses_refno != null &&
      data.dynamic_expenses_refno != "0"
    ) {
      setProjectExpenseStatus(true);
      FetchProjectExpense(data.pck_category_refno, data.dynamic_expenses_refno);
    }

    setCommonDisplayStatus(true);

    setNotes(data.notes);

    setChecked(data.view_status == "1" ? true : false);

    if (
      route.params.type !=
      projectVariables.DEF_PCKDIARY_Dynamic_Expense_ClientAmountGivenToCompany_FlagText
    ) {
      setImage(data.attach_receipt_url);
      setFilePath(data.attach_receipt_url);
      setDesignImage(data.attach_receipt_url);
    }
  };

  const FetchEntryType = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID,
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckentrytype, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setEntryTypeFullData(response.data.data);
            const entryTypeData = response.data.data.map(
              (data) => data.pck_entrytype_name
            );
            setEntryTypeData(entryTypeData);

            if (response.data.data.length == 1) {
              setEntryType(response.data.data[0].pck_entrytype_name);
              setEntryTypeDisable(true);
              setPktEntryTypeID(response.data.data[0].pck_entrytype_refno);
              _pktEntryTypeID = response.data.data[0].pck_entrytype_refno;
              setEntryTypeStatus(false);
            } else {
              setEntryTypeDisable(false);
              setEntryTypeStatus(true);
            }

            if (route.params.type != "edit" || route.params.type != "verify") {
              FetchPaymentMode();
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchPaymentMode = (editID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        pck_transtype_refno: 2,
      },
    };
    Provider.createDFPocketDairy(
      Provider.API_URLS.get_pckpaymentmodetype,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            //console.log('payment mode ============');
            //console.log(editID);
            //console.log(response.data.data);
            response.data.data = APIConverter(response.data.data);
            setPayModeFullData(response.data.data);
            const receiptMode = response.data.data.map(
              (data) => data.pckModeName
            );
            setPayModeData(receiptMode);
            //console.log(response.data.data);
            if (editID != "") {
              //console.log('edit start ****************************');
              //  //console.log(response.data.data.filter((el) => {
              //     return el.pckModeID == editID;
              //   })[0].pckModeName);
              setPayMode(
                response.data.data.filter((el) => {
                  return el.pckModeID == editID;
                })[0].pckModeName
              );
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchClientList = (clientID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID.toString(),
        Sess_branch_refno: branchID.toString(),
        Sess_group_refno: groupID.toString(),
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckmyclientname, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setClientListFullData(response.data.data);

            const clientList = response.data.data.map(
              (data) => data.companyName
            );
            setClientListData(clientList);

            if (clientID != null) {
              setClientList(
                response.data.data.filter((el) => {
                  return el.myclient_refno === clientID;
                })[0].companyName
              );
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchExpenseCategory = (receiptModeID, editID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID,
        pck_mode_refno: receiptModeID,
        pck_entrytype_refno: _pktEntryTypeID,
      },
    };
    Provider.createDFPocketDairy(
      Provider.API_URLS.getcategoryname_pckaddexpensesform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setExpensesFullData(response.data.data);
            const category = response.data.data.map(
              (data) => data.categoryName
            );
            setExpensesData(category);

            if (editID != null) {
              setExpenses(
                response.data.data.filter((el) => {
                  return el.pckCategoryID === editID;
                })[0].categoryName
              );
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchExpenseSubCategory = (categoryID, editID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID,
        pck_category_refno: categoryID,
      },
    };
    Provider.createDFPocketDairy(
      Provider.API_URLS.getsubcategoryname_pckaddexpensesform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data, "pkt_subcat");
            setSubCategoryNameFullData(response.data.data);
            const subCategory = response.data.data.map(
              (data) => data.subCategoryName
            );
            setSubCategoryNameData(subCategory);

            if (editID != null) {
              setSubCategoryName(
                response.data.data.filter((el) => {
                  return el.subcategoryID === editID;
                })[0].subCategoryName
              );
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchProjectExpense = (categoryID, editID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID,
        pck_category_refno: categoryID,
      },
    };
    //console.log(params);
    Provider.createDFPocketDairy(
      Provider.API_URLS.getsubcategoryname_pckaddexpensesform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            //console.log('edit data =============');
            //console.log(response.data.data);
            response.data.data = APIConverter(response.data.data, "pkt_subcat");
            setProjectExpenseFullData(response.data.data);
            if (
              route.params.type !=
              projectVariables.DEF_PCKDIARY_Dynamic_Expense_ClientAmountGivenToCompany_FlagText
            ) {
              response.data.data = response.data.data.filter((el) => {
                return (
                  el.subcategoryID !=
                  projectVariables.DEF_PCKDIARY_Dynamic_Expense_ClientAmountGivenToCompany_REFNO
                );
              });
              setProjectExpenseDisable(false);
            } else {
              response.data.data = response.data.data.filter((el) => {
                return (
                  el.subcategoryID ==
                  projectVariables.DEF_PCKDIARY_Dynamic_Expense_ClientAmountGivenToCompany_REFNO
                );
              });
            }
            const subCategory = response.data.data.map(
              (data) => data.subCategoryName
            );
            setProjectExpenseData(subCategory);

            if (
              route.params.type ==
              projectVariables.DEF_PCKDIARY_Dynamic_Expense_ClientAmountGivenToCompany_FlagText
            ) {
              setProjectExpense(
                response.data.data.filter((el) => {
                  return (
                    el.subcategoryID ===
                    projectVariables.DEF_PCKDIARY_Dynamic_Expense_ClientAmountGivenToCompany_REFNO
                  );
                })[0].subCategoryName
              );
              setProjectExpenseDisable(true);
            }

            if (editID != null) {
              setProjectExpense(
                response.data.data.filter((el) => {
                  return el.subcategoryID === editID;
                })[0].subCategoryName
              );
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchBankList = (editID) => {
    ////console.log('calling bank======');
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID.toString(),
        Sess_branch_refno: branchID.toString(),
        Sess_group_refno: groupID.toString(),
        Sess_designation_refno: designID.toString(),
        pck_entrytype_refno: _pktEntryTypeID,
        pck_transtype_refno:
          projectVariables.DEF_PCKDIARY_TRANSTYPE_EXPENSES_REFNO,
      },
    };
    //console.log(params);
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckmybankname, params)
      .then((response) => {
        //console.log(response.data);
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data, "pkt_subcat");
            setMyBankFullData(response.data.data);

            const bank = response.data.data.map((data) => data.bankName);
            setMyBankData(bank);

            if (editID != null) {
              setMyBank(
                response.data.data.filter((el) => {
                  return el.bank_refno === editID;
                })[0].bankName
              );
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchDepositType = (editID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckdeposittype, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data, "pkt_subcat");
            setDepositeTypeFullData(response.data.data);
            const depostiType = response.data.data.map(
              (data) => data.deposit_type_name
            );
            setDepositeTypeData(depostiType);

            if (editID != null) {
              setDepositeType(
                response.data.data.filter((el) => {
                  return el.deposit_type_refno == editID;
                })[0].deposit_type_name
              );
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchReceiverList = (editID, contactName) => {
    ////console.log('receiver data start ============');
    let params = {
      data: {
        Sess_UserRefno: userID,
      },
    };
    ////console.log(params);
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckmycontactname, params)
      .then((response) => {
        ////console.log('Receiiver contact==============');
        ////console.log(response.data);
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data, "pkt_subcat");

            setPaidToFullData(response.data.data);

            const receiverList = response.data.data.map(
              (data) => data.contactName
            );
            setPaidToData(receiverList);

            if (editID != null) {
              setPaidTo(
                response.data.data.filter((el) => {
                  return el.mycontactID === editID;
                })[0].contactName
              );
            }

            if (contactName != null && contactName != "") {
              setPaidTo(
                response.data.data.filter((el) => {
                  return el.contactName === contactName;
                })[0].contactName
              );
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchCardType = (editID) => {
    //console.log('start card type');
    let params = {
      data: {
        Sess_UserRefno: userID,
      },
    };
    Provider.createDFPocketDairy(
      Provider.API_URLS.getcardtype_pckaddexpensesform,
      params
    )
      .then((response) => {
        //console.log(response.data.data);
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setCardTypeFullData(response.data.data);
            const cardType = response.data.data.map(
              (data) => data.cardtype_name
            );
            //console.log(cardType);
            setCardTypeData(cardType);
            //console.log('card type setting===================');
            //console.log(editID);
            //console.log(response.data.data);

            if (editID != "") {
              setCardType(
                response.data.data.filter((el) => {
                  return el.cardtype_refno == editID;
                })[0].cardtype_name
              );
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchCardBankList = (cardtypeID, editID) => {
    ////console.log('calling bank======');
    let params = {
      data: {
        Sess_UserRefno: userID,
        cardtype_refno: cardtypeID,
      },
    };
    ////console.log(params);
    Provider.createDFPocketDairy(
      Provider.API_URLS.getcardbankname_pckaddexpensesform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data, "pkt_subcat");
            setCardBankFullData(response.data.data);

            const bank = response.data.data.map((data) => data.bankName);
            setCardBankData(bank);

            if (editID != null) {
              setCardBank(
                response.data.data.filter((el) => {
                  return el.bank_refno === editID;
                })[0].bankName
              );
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchProjectList = (clientID, editID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID.toString(),
        Sess_branch_refno: branchID.toString(),
        Sess_group_refno: groupID.toString(),
        myclient_refno: clientID,
        Sess_CompanyAdmin_UserRefno: companyAdminID.toString(),
      },
    };
    Provider.createDFPocketDairy(
      Provider.API_URLS.get_pckmyclientprojectname,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);

            setProjectListFullData(response.data.data);

            const projectList = response.data.data.map(
              (data) => data.project_name
            );
            setProjectListData(projectList);

            if (editID != null) {
              setProjectList(
                response.data.data.filter((el) => {
                  return el.cont_project_refno == editID;
                })[0].project_name
              );
            }
          }
        }
      })
      .catch((e) => {});
  };

  const ShowContactList = () => {
    setIsContactLoading(true);
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        //console.log('granted permission =====================');
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        //console.log(data.length);
        if (data.length > 0) {
          //console.log(data[0]);
          //console.log(data[1]);
          const arrPhones = [];
          data.map((k, i) => {
            // if (i < 100) {
            //console.log('==================================');
            //console.log(k);
            if (Array.isArray(k.phoneNumbers)) {
              arrPhones.push(k);
            }
            // }
          });
          //console.log('complete loop');
          //console.log(arrPhones);
          //console.log(arrPhones);
          setIsContactLoading(false);
          navigation.navigate("PhoneContactDirectUpload", {
            phoneNumbers: arrPhones,
            callback: PhoneClicked,
          });
        }
      }
    })();
  };

  const PhoneClicked = (contact) => {
    if (contact != null) {
      InsertNewContact(contact.name, contact.phoneNumbers[0].number);
    }
  };

  const InsertNewContact = (name, mobileNo) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        contact_name: name,
        contact_phoneno: mobileNo,
        remarks: "",
        view_status: "1",
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.pckmycontactscreate, params)
      .then((response) => {
        setIsContactLoading(false);
        if (response.data && response.data.code === 200) {
          FetchReceiverList(null, name);
          setSnackbarText("New Contact Added");
          setSnackbarColor(theme.colors.success);
          setSnackbarVisible(true);
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
        setIsContactLoading(false);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
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

  const onProjectExpenseChanged = (text) => {
    setProjectExpense(text);
    setErrorPE(false);
  };

  const onProjectListChanged = (text) => {
    setProjectList(text);
    setErrorPL(false);

    setCommonDisplayStatus(true);
    setButtonStatus(false);

    setProjectExpenseStatus(true);

    let mode = payModeFullData.filter((el) => {
      return el.pckModeName === payMode;
    });

    let a = expensesFullData.filter((el) => {
      return el.categoryName === expenses;
    });

    if (
      a[0].pckCategoryID == projectVariables.DEF_PCKDIARY_CATEGORY_Clients_REFNO
    ) {
      FetchProjectExpense(a[0].pckCategoryID);
    }

    if (
      mode[0].pckModeID == projectVariables.DEF_PCKDIARY_MODE_Upi_REFNO ||
      mode[0].pckModeID == projectVariables.DEF_PCKDIARY_MODE_RtgsNeft_REFNO
    ) {
      FetchBankList();
      setBankStatus(true);
      setUtrNoStatus(true);
    } else if (
      mode[0].pckModeID == projectVariables.DEF_PCKDIARY_MODE_Cheque_REFNO
    ) {
      setDepositTypeStatus(true);
      FetchDepositType();
    }

    // if (a[0].pckCategoryID == projectVariables.DEF_PCKDIARY_CATEGORY_Clients_REFNO || a[0].pckCategoryID == "4") {

    // }
    // else if (a[0].pckModeID == "3") {
    //   setDepositTypeStatus(true);
    //   FetchDepositType();
    // }
  };

  const onExpensesChanged = (text) => {
    setExpenses(text);
    setEXError(false);
    let a = expensesFullData.filter((el) => {
      return el.categoryName === text;
    });

    if (
      a[0].pckCategoryID == projectVariables.DEF_PCKDIARY_CATEGORY_Clients_REFNO
    ) {
      setSubCatStatus(false);
      setClientListstatus(true);
      FetchClientList();
    } else {
      setSubCatStatus(true);
      setClientListstatus(false);
      FetchExpenseSubCategory(a[0].pckCategoryID);
    }
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
    } else {
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
      } else {
        setPaidToStatus(false);
        setRecurringStatus(false);
        setRecurringReminderDateStatus(false);
      }
    } else if (mode[0].pckModeID == "2" || mode[0].pckModeID == "4") {
      FetchBankList();
      setUtrNoStatus(true);
      setBankStatus(true);

      if (subcat[0].subcategoryID == "8") {
        setPaidToStatus(true);
        FetchReceiverList();

        setRecurringStatus(true);
        setRecurringReminderDateStatus(true);
      } else {
        setPaidToStatus(false);
        FetchReceiverList();

        setRecurringStatus(false);
        setRecurringReminderDateStatus(false);
      }
    } else if (mode[0].pckModeID == "3") {
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
      } else {
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

    if (mode[0].pckModeID == "3" && subCatStatus) {
      if (subcat[0].subcategoryID == "8") {
        //setUtrNoStatus(true);

        setPaidToStatus(true);
        FetchReceiverList();

        setRecurringStatus(true);
        setRecurringReminderDateStatus(true);
      } else {
        setPaidToStatus(false);
        FetchReceiverList();

        setRecurringStatus(false);
        setRecurringReminderDateStatus(false);
      }
    }
  };

  const resetFields = () => {
    setCardTypeStatus(false);
    setCardBankNameStatus(false);
    setCardRepaymentDateStatus(false);
    setPaidToStatus(false);
    setRecurringStatus(false);
    setRecurringReminderDateStatus(false);
    setDepositTypeStatus(false);
    setBankStatus(false);
    setUtrNoStatus(false);
    setChequeNoStatus(false);
    setChequeDateStatus(false);
    setCommonDisplayStatus(false);
    setButtonStatus(true);
    setrecurringDateFlag("1");
    setSubCatStatus(true);
  };

  const onEntryTypeChanged = (selectedItem) => {
    setEntryType(selectedItem);
    resetFields();

    let a = entryTypeFullData.filter((el) => {
      return el.pck_entrytype_name === selectedItem;
    });

    setPktEntryTypeID(a[0].pck_entrytype_refno);
    _pktEntryTypeID = a[0].pck_entrytype_refno;
  };

  const onAmount = (text) => {
    //console.log(parseFloat(text));
    //console.log(route.params);

    if (parseFloat(text) > parseFloat(balanceAmount.replace(/,/g, ""))) {
      settAmount("");
      setAmountError(true);
      setAmountInvalidBalance("Amount can not be more then balance amount");
    } else {
      settAmount(text);
      setAmountError(false);
    }
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

  const onClientListChanged = (text) => {
    setClientList(text);
    setErrorCL(false);

    let a = clientListFullData.filter((el) => {
      return el.companyName === text;
    });

    setProjectListstatus(true);
    FetchProjectList(a[0].myclient_refno);
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
      setDesignImage(
        AWSImagePath + unique_id + "." + arrExt[arrExt.length - 1]
      );
      setImage(result.uri);
      setFilePath(result);
      if (route.params.type === "edit" || route.params.type === "verify") {
        setIsImageReplaced(true);
      }
    }
  };

  const InsertData = () => {
    //console.log('insert===================');
    const datas = new FormData();
    let params = {
      Sess_UserRefno: userID,
      Sess_company_refno: companyID.toString(),
      Sess_branch_refno: branchID.toString(),
      Sess_designation_refno: designID.toString(),
      pck_entrytype_refno: pktEntryTypeID,
      pck_mode_refno: payModeFullData.filter((el) => {
        return el.pckModeName === payMode;
      })[0].pckModeID,

      pck_category_refno: expensesFullData.filter((el) => {
        return el.categoryName === expenses;
      })[0].pckCategoryID,

      amount: amount.trim(),
      notes: notes.trim(),

      view_status: checked ? "1" : "0",
    };

    if (subCatStatus) {
      params.pck_sub_category_refno = subCategoryNameFullData.filter((el) => {
        return el.subCategoryName === subCategoryName;
      })[0].subcategoryID;
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
      params.due_date =
        cardRepayment == "" ? "" : moment(cardRepayment).format("DD-MM-YYYY");
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
      params.cheque_date =
        chequeDate == "" ? "" : moment(chequeDate).format("DD-MM-YYYY");
    }

    if (recurringReminderDateStatus) {
      params.reminder_date =
        recurringDate == "" ? "" : moment(recurringDate).format("DD-MM-YYYY");
    }

    if (recurringStatus) {
      params.recurring_status = recurringDateFlat;
    }

    if (clientListStatus) {
      params.myclient_refno = clientListFullData.filter((el) => {
        return el.companyName === clientList;
      })[0].myclient_refno;
    }

    if (projectListStatus) {
      params.cont_project_refno = projectListFullData.filter((el) => {
        return el.project_name === projectList;
      })[0].cont_project_refno;
    }

    if (projectExpenseStatus) {
      params.dynamic_expenses_refno = projectExpenseFullData.filter((el) => {
        return el.subCategoryName === projectExpense;
      })[0].subcategoryID;
    }

    if (
      route.params.type ===
      projectVariables.DEF_PCKDIARY_Dynamic_Expense_ClientAmountGivenToCompany_FlagText
    ) {
      params.pck_master_trans_refno = route.params.data.transactionID;
    }

    datas.append("data", JSON.stringify(params));
    datas.append(
      "attach_receipt",
      filePath != null &&
        filePath != undefined &&
        filePath.type != undefined &&
        filePath.type != null
        ? {
            name: "appimage1212.jpg",
            type: filePath.type + "/*",
            uri:
              Platform.OS === "android"
                ? filePath.uri
                : filePath.uri.replace("file://", ""),
          }
        : ""
    );

    //console.log(params);
    //console.log('data params ================');
    //console.log(datas);
    Provider.createDFPocketDairyWithHeader(
      Provider.API_URLS.pckaddexpensescreate,
      datas
    )
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

  const UpdateData = (type) => {
    //console.log('update===================');
    const datas = new FormData();
    let params = {
      Sess_UserRefno: userID,
      pck_trans_refno: pckTransID,
      Sess_company_refno: companyID.toString(),
      Sess_branch_refno: branchID.toString(),
      Sess_designation_refno: designID.toString(),
      pck_entrytype_refno: pktEntryTypeID,
      pck_mode_refno: payModeFullData.filter((el) => {
        return el.pckModeName === payMode;
      })[0].pckModeID,

      pck_category_refno: expensesFullData.filter((el) => {
        return el.categoryName === expenses;
      })[0].pckCategoryID,

      amount: amount.trim(),
      notes: notes.trim(),

      view_status: checked ? "1" : "0",
    };

    if (subCatStatus) {
      params.pck_sub_category_refno = subCategoryNameFullData.filter((el) => {
        return el.subCategoryName === subCategoryName;
      })[0].subcategoryID;
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
      params.due_date =
        cardRepayment == "" ? "" : moment(cardRepayment).format("DD-MM-YYYY");
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
      params.cheque_date =
        chequeDate == "" ? "" : moment(chequeDate).format("DD-MM-YYYY");
    }

    if (recurringReminderDateStatus) {
      params.reminder_date =
        recurringDate == "" ? "" : moment(recurringDate).format("DD-MM-YYYY");
    }

    if (recurringStatus) {
      params.recurring_status = recurringDateFlat;
    }

    if (projectExpenseStatus) {
      params.dynamic_expenses_refno = projectExpenseFullData.filter((el) => {
        return el.subCategoryName === projectExpense;
      })[0].subcategoryID;
    }

    if (clientListStatus) {
      params.myclient_refno = clientListFullData.filter((el) => {
        return el.companyName === clientList;
      })[0].myclient_refno;
    }

    if (projectListStatus) {
      params.cont_project_refno = projectListFullData.filter((el) => {
        return el.project_name === projectList;
      })[0].cont_project_refno;
    }

    if (projectExpenseStatus) {
      params.dynamic_expenses_refno = projectExpenseFullData.filter((el) => {
        return el.subCategoryName === projectExpense;
      })[0].subcategoryID;
    }

    datas.append("data", JSON.stringify(params));
    datas.append(
      "attach_receipt",
      isImageReplaced
        ? {
            name: "appimage1212.jpg",
            type: filePath.type + "/*",
            uri:
              Platform.OS === "android"
                ? filePath.uri
                : filePath.uri.replace("file://", ""),
          }
        : ""
    );

    //console.log(datas);
    Provider.createDFPocketDairyWithHeader(
      type === "edit"
        ? Provider.API_URLS.pckaddexpensesupdate
        : Provider.API_URLS.pck_companyexpenses_verify_action,
      datas
    )
      .then((response) => {
        //console.log(response.data);
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

    if (entryType == "") {
      isValid = false;
      setEntryTypeError(true);
    }

    if (amount.trim() == 0 || amount.trim() == "") {
      setAmountError(true);
      isValid = false;
      setAmountInvalidBalance("Please enter a valid amount");
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

    if (subCatStatus && subCategoryName == "") {
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

    if (chequeNoStatus && chequeNo.trim() == "") {
      setChequeNoError(true);
      isValid = false;
    }

    if (chequeDateStatus && chequeDate == "") {
      setChequeDateInvalid(true);
      isValid = false;
    }

    if (clientListStatus && clientList == "") {
      setErrorCL(true);
      isValid = false;
    }

    if (projectListStatus && projectList == "") {
      setErrorPL(true);
      isValid = false;
    }

    if (isValid) {
      if (route.params.type === "edit" || route.params.type === "verify") {
        UpdateData(route.params.type);
      } else {
        InsertData();
      }
    }
  };

  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView
        style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[Styles.padding16]}>
          {entryTypeStatus && (
            <>
              <Dropdown
                label="Entry Type"
                forceDisable={entryTypeDisable}
                data={entryTypeData}
                isError={entryTypeError}
                onSelected={onEntryTypeChanged}
                selectedItem={entryType}
              />
              <HelperText type="error" visible={entryTypeError}>
                Please select a valid entry type
              </HelperText>
            </>
          )}

          <TextInput
            mode="flat"
            label="Amount"
            value={amount}
            returnKeyType="next"
            keyboardType="number-pad"
            onSubmitEditing={() => ref_input2.current.focus()}
            onChangeText={onAmount}
            style={{ backgroundColor: "white" }}
            error={amountError}
          />
          <HelperText type="error" visible={amountError}>
            {amountInvalidBalance}
          </HelperText>

          {route.params.type ===
            projectVariables.DEF_PCKDIARY_Dynamic_Expense_ClientAmountGivenToCompany_FlagText && (
            <>
              <View style={[Styles.padding16]}>
                <DataTable
                  style={[
                    Styles.backgroundSecondaryColor,
                    Styles.borderRadius4,
                    Styles.flexJustifyCenter,
                    Styles.bordergray,
                    Styles.fontBold,
                  ]}
                >
                  <DataTable.Header>
                    <DataTable.Title
                      style={[{ flex: 1, justifyContent: "center" }]}
                    >
                      Collected
                    </DataTable.Title>
                    <DataTable.Title
                      style={[
                        Styles.borderLeft1,
                        { flex: 1, justifyContent: "center" },
                      ]}
                      numeric
                    >
                      Paid
                    </DataTable.Title>
                    <DataTable.Title
                      style={[
                        Styles.borderLeft1,
                        { flex: 1, justifyContent: "center" },
                      ]}
                      numeric
                    >
                      Balance
                    </DataTable.Title>
                  </DataTable.Header>

                  <DataTable.Row style={[Styles.backgroundColor]}>
                    <DataTable.Cell
                      style={[{ flex: 1, justifyContent: "center" }]}
                    >
                      {collectedAmount}
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={[
                        Styles.borderLeft1,
                        { flex: 1, justifyContent: "center" },
                      ]}
                    >
                      {paidAmount}
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={[
                        Styles.borderLeft1,
                        { flex: 1, justifyContent: "center" },
                      ]}
                    >
                      {balanceAmount}
                    </DataTable.Cell>
                  </DataTable.Row>
                </DataTable>
              </View>
            </>
          )}

          <Dropdown
            label="Payment Mode"
            data={payModeData}
            onSelected={onPayModeChanged}
            isError={errorPM}
            selectedItem={payMode}
          />
          <HelperText type="error" visible={errorPM}>
            Please select valid payment mode
          </HelperText>

          {cardTypeStatus && (
            <>
              <Dropdown
                label="Card Type"
                data={cardTypeData}
                onSelected={onCardTypeChanged}
                isError={errorCT}
                selectedItem={cardType}
              />
              <HelperText type="error" visible={errorCT}>
                Please select a valid card type
              </HelperText>
            </>
          )}

          {cardBankNameStatus && (
            <>
              <Dropdown
                label="Card Bank Name"
                data={cardBankData}
                onSelected={onCardBankNameChanged}
                isError={errorCB}
                selectedItem={cardBank}
              />
              <HelperText type="error" visible={errorCB}>
                Please select valid bank
              </HelperText>
            </>
          )}

          {cardRepaymentDateStatus && (
            <>
              <View>
                <DateTimePicker
                  style={Styles.backgroundColorWhite}
                  isError={errorCRPayment}
                  label="Credit Card Repayment Due Date"
                  type="date"
                  value={cardRepayment}
                  onChangeDate={setCardRepayment}
                />
                <HelperText type="error" visible={errorCRPayment}>
                  Please select a valid date
                </HelperText>
              </View>
            </>
          )}

          <Dropdown
            label="Expenses / Payment"
            data={expensesData}
            onSelected={onExpensesChanged}
            isError={errorEX}
            selectedItem={expenses}
          />
          <HelperText type="error" visible={errorEX}>
            Please select valid Expenses / Payment
          </HelperText>

          {clientListStatus && (
            <>
              <View
                style={[Styles.border1, Styles.borderRadius4, Styles.padding4]}
              >
                <Dropdown
                  label="My Client List"
                  data={clientListData}
                  onSelected={onClientListChanged}
                  isError={errorCL}
                  selectedItem={clientList}
                />
                <HelperText type="error" visible={errorCL}>
                  Please select a client
                </HelperText>
                <Button
                  icon={"plus"}
                  mode="contained"
                  onPress={() => {
                    navigation.navigate("AddClientScreen", {
                      type: "expenses_client",
                      data: {
                        serviceType: "8",
                      },
                      fetchClientList: FetchClientList,
                    });
                  }}
                >
                  Add New Client
                </Button>
              </View>
            </>
          )}

          {projectListStatus && (
            <>
              <Dropdown
                label="Project List"
                data={projectListData}
                onSelected={onProjectListChanged}
                isError={errorPL}
                selectedItem={projectList}
              />
              <HelperText type="error" visible={errorPL}>
                Please select a project
              </HelperText>
            </>
          )}

          {projectExpenseStatus && (
            <>
              <Dropdown
                label="Project Expenses"
                data={projectExpenseData}
                forceDisable={projectExpenseDisable}
                onSelected={onProjectExpenseChanged}
                isError={errorPE}
                selectedItem={projectExpense}
              />
              <HelperText type="error" visible={errorPE}>
                Please select a project expense
              </HelperText>
            </>
          )}

          {subCatStatus && (
            <>
              <Dropdown
                label="Sub Category Name"
                data={subCategoryNameData}
                onSelected={onSubCategoryNameChanged}
                isError={errorSCN}
                selectedItem={subCategoryName}
              />
              <HelperText type="error" visible={errorSCN}>
                Please select valid sub category
              </HelperText>
            </>
          )}

          {paidToStatus && (
            <>
              <View
                style={[
                  Styles.border1,
                  Styles.borderRadius4,
                  Styles.padding4,
                  Styles.marginBottom16,
                ]}
              >
                <Dropdown
                  label="Paid To"
                  data={paidToData}
                  onSelected={onPaidToChanged}
                  isError={errorPT}
                  selectedItem={paidTo}
                />
                <HelperText type="error" visible={errorPT}>
                  Please select valid recepient
                </HelperText>
                <Button
                  icon={"card-account-phone-outline"}
                  mode="contained"
                  loading={isContactLoading}
                  disabled={isContactLoading}
                  onPress={ShowContactList}
                >
                  Add New Contact
                </Button>
                {/* <Button
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
                </Button> */}
              </View>
            </>
          )}

          {recurringStatus && (
            <>
              <View style={[Styles.marginTop0, Styles.marginBottom32]}>
                <Text>Recurring</Text>
                <RadioGroup
                  containerStyle={[Styles.marginTop16]}
                  layout="row"
                  radioButtons={RecurringRadioButtons}
                  onPress={onPressRecurringRadioButton}
                />
              </View>
            </>
          )}

          {recurringReminderDateStatus && (
            <>
              <View>
                <DateTimePicker
                  style={(Styles.backgroundColorWhite, Styles.marginBottom12)}
                  isError={errorRD}
                  label="Recurring Reminder Date"
                  type="date"
                  value={recurringDate}
                  onChangeDate={setRecurringDate}
                />
                <HelperText type="error" visible={errorRD}>
                  Please select a valid date
                </HelperText>
              </View>
            </>
          )}

          {depositTypeStatus && (
            <>
              <Dropdown
                label="Deposit Type"
                data={depositeTypeData}
                onSelected={onDepositeTypeChanged}
                isError={errorDT}
                selectedItem={depositeType}
              />
              <HelperText type="error" visible={errorDT}>
                {communication.InvalidDepositeType}
              </HelperText>
            </>
          )}

          {bankStatus && (
            <>
              <View
                style={[
                  Styles.border1,
                  Styles.borderRadius4,
                  Styles.padding4,
                  Styles.marginTop8,
                ]}
              >
                <Dropdown
                  label="My Bank List"
                  data={myBankData}
                  onSelected={onMyBankChanged}
                  isError={errorMB}
                  selectedItem={MyBank}
                />
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
          )}

          {utrNoStatus && (
            <>
              <TextInput
                mode="flat"
                label="UTR No"
                value={utrNo}
                returnKeyType="next"
                onSubmitEditing={() => ref_input2.current.focus()}
                onChangeText={onUtrNo}
                style={{ backgroundColor: "white" }}
              />
            </>
          )}

          {chequeNoStatus && (
            <>
              <TextInput
                mode="flat"
                label="Cheque No"
                value={chequeNo}
                returnKeyType="next"
                onSubmitEditing={() => ref_input2.current.focus()}
                onChangeText={onChequeNO}
                style={{ backgroundColor: "white" }}
                error={chequeNoError}
              />
            </>
          )}

          {chequeDateStatus && (
            <>
              <View>
                <DateTimePicker
                  style={Styles.backgroundColorWhite}
                  label="Cheque Date"
                  type="date"
                  value={chequeDate}
                  onChangeDate={setChequeDate}
                />
              </View>
            </>
          )}

          {commonDisplayStatus && (
            <>
              <View
                style={[
                  Styles.flexRow,
                  Styles.flexAlignEnd,
                  Styles.marginTop16,
                ]}
              >
                <Image
                  source={{ uri: image }}
                  style={[Styles.width104, Styles.height96, Styles.border1]}
                />
                <Button mode="text" onPress={chooseFile}>
                  {filePath !== null ? "Replace" : "Attachment / Slip Copy"}
                </Button>
              </View>
              <HelperText type="error" visible={errorDI}>
                {communication.InvalidDesignImage}
              </HelperText>
            </>
          )}

          {commonDisplayStatus && (
            <>
              <TextInput
                mode="flat"
                label="Notes"
                value={notes}
                returnKeyType="next"
                onSubmitEditing={() => ref_input2.current.focus()}
                onChangeText={onNotes}
                style={{ backgroundColor: "white" }}
              />
            </>
          )}

          {commonDisplayStatus && (
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
          )}
        </View>
      </ScrollView>
      <View
        style={[
          Styles.backgroundColor,
          Styles.width100per,
          Styles.marginTop32,
          Styles.padding16,
          { position: "absolute", bottom: 0, elevation: 3 },
        ]}
      >
        <Card.Content>
          <Button
            mode="contained"
            disabled={buttonStatus}
            onPress={ValidateData}
          >
            Submit
          </Button>
        </Card.Content>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarColor }}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddExpenses;
