import moment from "moment";
import uuid from "react-native-uuid";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  TextInput,
} from "react-native-paper";
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
import { projectVariables } from "../../../../utils/credentials";
import RadioGroup from "react-native-radio-buttons-group";
import * as Contacts from "expo-contacts";

let userID = 0,
  groupID = 0,
  companyID = 0,
  branchID = 0,
  _pktEntryTypeID = 0,
  designID = 0,
  companyAdminID = 0;

const AddSource = ({ route, navigation }) => {
  //#region Variables

  const [amountError, setAmountError] = React.useState(false);
  const [amount, settAmount] = React.useState("");

  const [entryTypeData, setEntryTypeData] = React.useState([]);
  const [entryTypeFullData, setEntryTypeFullData] = React.useState([]);
  const [entryType, setEntryType] = React.useState("");
  const [entryTypeDisable, setEntryTypeDisable] = React.useState(true);
  const [entryTypeError, setEntryTypeError] = React.useState(false);

  const [receiptModeData, setReceiptModeData] = React.useState([]);
  const [receiptModeFullData, setReceiptModeFullData] = React.useState([]);
  const [receiptMode, setReceiptMode] = React.useState([]);
  const [errorRM, setRMError] = React.useState(false);

  const [sourceFullData, setSourceFullData] = React.useState([]);
  const [sourceData, setSourceData] = React.useState([]);
  const [source, setSource] = React.useState([]);
  const [errorSS, setSSError] = React.useState(false);

  const [subCategoryNameFullData, setSubCategoryNameFullData] = React.useState(
    []
  );
  const [subCategoryNameData, setSubCategoryNameData] = React.useState([]);
  const [subCategoryName, setSubCategoryName] = React.useState([]);
  const [errorSCN, setSCNError] = React.useState(false);

  const [contactTypeFullData, setContactTypeFullData] = React.useState([]);
  const [contactTypeData, setContactTypeData] = React.useState([]);
  const [contactType, setContactType] = React.useState([]);
  const [errorCT, setErrorCT] = React.useState(false);

  const [clientListFullData, setClientListFullData] = React.useState([]);
  const [clientListData, setClientListData] = React.useState([]);
  const [clientList, setClientList] = React.useState([]);
  const [errorCL, setErrorCL] = React.useState(false);

  const [projectListFullData, setProjectListFullData] = React.useState([]);
  const [projectListData, setProjectListData] = React.useState([]);
  const [projectList, setProjectList] = React.useState([]);
  const [errorPL, setErrorPL] = React.useState(false);

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

  const [contactNameError, setContactNameError] = React.useState(false);
  const [contactName, setContactName] = React.useState("");

  const [mobileNoError, setMobileNoError] = React.useState(false);
  const [mobileNumber, setMobileNumber] = React.useState("");

  const [invoiceNoError, setInvoiceNoError] = React.useState(false);
  const [invoiceNo, setInvoiceNo] = React.useState("");

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

  const [image, setImage] = React.useState(
    AWSImagePath + "placeholder-image.png"
  );
  const [filePath, setFilePath] = React.useState(null);
  const [designImage, setDesignImage] = React.useState("");
  const [errorDI, setDIError] = React.useState(false);

  const [notesError, setNotesError] = React.useState(false);
  const [notes, setNotes] = React.useState("");

  const [rentalDescription, setRentalDescription] = React.useState("");

  const [checked, setChecked] = React.useState(true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );
  const ref_input2 = useRef();
  const ref_input3 = useRef();

  const [receivedStatus, setReceivedStatus] = React.useState(false);
  const [depositTypeStatus, setDepositTypeStatus] = React.useState(false);
  const [bankListStatus, setBankListStatus] = React.useState(false);
  const [bankBalanceStatus, setBankBalanceStatus] = React.useState(false);
  const [chequeNoStatus, setChequeNoStatus] = React.useState(false);
  const [newMobileNumberStatus, setNewMobileNumberStatus] = React.useState(false);
  const [newContactNameStatus, setNewContactNameStatus] = React.useState(false);
  const [UTRNoStatus, setUTRNoStatus] = React.useState(false);
  const [chequeDateStatus, setChequeDateStatus] = React.useState(false);
  const [paymentReminderStatus, setPaymentReminderStatus] =
    React.useState(false);
  const [commonStatus, setCommonStatus] = React.useState(false);
  const [buttonStatus, setButtonStatus] = React.useState(true);
  const [subCatStatus, setSubCatStatus] = React.useState(true);
  const [rentalDescriptionStatus, setRentalDescriptionStatus] = React.useState(false);
  const [clientListStatus, setClientListstatus] = React.useState(false);
  const [projectListStatus, setProjectListstatus] = React.useState(false);
  const [invoiceStatus, setInvoiceStatus] = React.useState(false);
  const [paymentTypeStatus, setPaymentTypeStatus] = React.useState(false);
  const [paymentGroupStatus, setPaymentGroupStatus] = React.useState(false);
  const [entryTypeStatus, setEntryTypeStatus] = React.useState(false);
  const [isContactLoading, setIsContactLoading] = useState(false);
  const [contactTypeStatus, setContactTypeStatus] = useState(false);
  const [pktEntryTypeID, setPktEntryTypeID] = React.useState("1");
  const [isImageReplaced, setIsImageReplaced] = React.useState(false);
  const [paymentTypeID, setPaymentTypeID] = useState(0);
  const [paymentGroupID, setPaymentGroupID] = useState(0);
  const [bankBalance, setBankBalance] = useState(0);
  const [errorPG, setErrorPG] = React.useState(false);
  const [errorPT, setErrorPT] = React.useState(false);
  const [paymentRB, setPaymentRB] = useState([
    {
      id: "1",
      label: "Part",
      selected: false,
      value: "1",
    },
    {
      id: "2",
      label: "Full Amount with invoice close",
      selected: false,
      value: "2",
    },
  ]);

  const [paymentGroup, setPaymentGroup] = useState([
    {
      id: "1", // acts as primary key, should be unique and non-empty string
      label: "Advance Amount",
      selected: true,
      value: "1",
    },
    {
      id: "2",
      label: "Invoice Amount",
      selected: false,
      value: "2",
    },
  ]);

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
      companyAdminID = JSON.parse(userData).Sess_CompanyAdmin_UserRefno;

      FetchEntryType();

      if (route.params.type === "edit") {
        SetEditData(route.params.data);
      }
      if (route.params.type === "verify") {
        FetchData_Company(route.params.data.pck_trans_refno);
      }
    }
  };

  const FetchData_Company = (transactionID) => {

    let params = {
      data: {
        Sess_UserRefno: userID,
        pck_trans_refno: transactionID.toString(),
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
          setSnackbarText("No data found, please go back and try again.");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
      });
  };

  const SetEditData = (data) => {
    setPktEntryTypeID(data.pck_entrytype_refno);
    setButtonStatus(false);
    setEntryType(data.pck_entrytype_name);
    settAmount(data.amount);
    setPckTransID(data.pck_trans_refno);
    _pktEntryTypeID = data.pck_entrytype_refno;

    setReceiptMode(data.pck_mode_name);
    setSource(data.pck_category_name);
    FetchReceptCategory(
      data.pck_mode_refno,
      data.pck_category_refno
    );

    if (
      data.pck_sub_category_refno != "" &&
      data.pck_sub_category_refno != "0"
    ) {
      setSubCategoryName(data.pck_sub_category_name);
      FetchReceptSubCategory(
        data.pck_category_refno,
        data.pck_sub_category_refno
      );
    } else {
      setSubCatStatus(false);
    }

    if (
      data.pck_contacttype_refno != "" &&
      data.pck_contacttype_refno != "0"
    ) {
      setContactTypeStatus(true);
      FetchContactType(data.pck_contacttype_refno);
    }

    if (
      data.pck_mycontact_refno != "" &&
      data.pck_mycontact_refno != "0"
    ) {
      setReceivedStatus(true);
      setReceivedEditID(data.pck_mycontact_refno);
      FetchReceiverList(data.pck_mycontact_refno, null, data.pck_sub_category_refno, data.pck_contacttype_refno);
    }

    if (
      data.deposit_type_refno != "" &&
      data.deposit_type_refno != "0"
    ) {
      setDepositTypeStatus(true);
      //setDepositeType(data.deposit_type_refno);
      setDepositeTypeEditID(data.deposit_type_refno);
      FetchDepositType(data.deposit_type_refno);
    }

    if (
      data.pck_mybank_refno != "" &&
      data.pck_mybank_refno != "0"
    ) {
      setBankListStatus(true);
      //setMyBankList(data.pck_mybank_refno);
      setMyBankListEditID(data.pck_mybank_refno);
      FetchBankList(data.pck_mybank_refno, data.pck_mode_refno, data.pck_category_refno);
    }

    if (data.cheque_no != "") {
      setChequeNoStatus(true);
      setChequeNo(data.cheque_no);
    }

    if (data.pck_sub_category_notes != "") {
      setRentalDescriptionStatus(true);
      setRentalDescription(data.pck_sub_category_notes);
    }

    if (data.utr_no != "") {
      setUTRNoStatus(true);
      setUTRNo(data.utr_no);
    }

    if (data.cheque_date != null) {
      setChequeDateStatus(true);
      let dateBreakup = data.cheque_date.split("-");
      setChequeDate(
        new Date(dateBreakup[2] + "/" + dateBreakup[1] + "/" + dateBreakup[0])
      );
    }

    if (data.reminder_date != null) {
      setPaymentReminderStatus(true);
      let dateBreakup = data.reminder_date.split("-");
      setRepaymentDate(
        new Date(dateBreakup[2] + "/" + dateBreakup[1] + "/" + dateBreakup[0])
      );
    }

    if (
      data.myclient_refno != null &&
      data.myclient_refno != "0"
    ) {
      setClientListstatus(true);
      FetchClientList(data.myclient_refno);
    }

    if (
      data.cont_project_refno != null &&
      data.cont_project_refno != "0"
    ) {
      setProjectListstatus(true);
      FetchProjectList(
        data.myclient_refno,
        data.cont_project_refno
      );
    }

    if (data.invoice_no != "") {
      setInvoiceStatus(true);
      setInvoiceNo(data.invoice_no);
    }

    if (data.payment_group_refno != null &&
      data.payment_group_refno != "" &&
      data.payment_group_refno != "0"
    ) {
      setPaymentGroupStatus(true);

      let recc = [...paymentGroup];
      recc.map((r) => {
        r.selected = false;
        if (r.id == data.payment_group_refno) {
          r.selected = true;
          setPaymentGroupID(r.value);
          if (r.id == "2") {
            setPaymentTypeStatus(true);
            setInvoiceStatus(true);
          }
        }

      });

      setPaymentGroup(recc);
    }

    if (data.payment_type_refno != "" && data.payment_type_refno != "0") {

      setPaymentTypeStatus(true);

      let recc = [...paymentRB];
      recc.map((r) => {
        r.selected = false;
        if (r.id == data.payment_type_refno) {
          r.selected = true;
          setPaymentTypeID(r.value);
        }
      });

      setPaymentRB(recc);
    }

    setCommonStatus(true);

    setNotes(data.notes);

    setChecked(data.view_status == "1" ? true : false);

    setImage(data.attach_receipt_url);
    setFilePath(data.attach_receipt_url);
    //setDesignImage(data.attach_receipt_url);
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
            FetchRecepientMode();
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
              if (route.params.type === "add") {

                setEntryType(response.data.data[route.params.tabIndex].pck_entrytype_name);
                setPktEntryTypeID(response.data.data[route.params.tabIndex].pck_entrytype_refno);
                _pktEntryTypeID = response.data.data[route.params.tabIndex].pck_entrytype_refno;
              }
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
      },
    };
    Provider.createDFPocketDairy(
      Provider.API_URLS.get_pckpaymentmodetype,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setReceiptModeFullData(response.data.data);
            const receiptMode = response.data.data.map(
              (data) => data.pckModeName
            );
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
        Sess_designation_refno: designID.toString(),
        pck_entrytype_refno: _pktEntryTypeID,
      },
    };
    Provider.createDFPocketDairy(
      Provider.API_URLS.getcategoryname_pckaddsourceform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setSourceFullData(response.data.data);
            const category = response.data.data.map(
              (data) => data.categoryName
            );
            setSourceData(category);
            if (categoryID != null) {
              setSource(
                response.data.data.filter((el) => {
                  return el.pckCategoryID === categoryID;
                })[0].categoryName
              );
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
      },
    };
    Provider.createDFPocketDairy(
      Provider.API_URLS.getsubcategoryname_pckaddsourceform,
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
            if (subcategoryID != null) {
              setSubCategoryName(
                response.data.data.filter((el) => {
                  return el.subcategoryID === subCategoryID;
                })[0].subCategoryName
              );
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchBankList = (bankID, receiptModeID, categoryID) => {
    
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID.toString(),
        Sess_branch_refno: branchID.toString(),
        Sess_group_refno: groupID.toString(),
        pck_entrytype_refno: _pktEntryTypeID,
        Sess_designation_refno: designID.toString(),
        pck_transtype_refno:
          projectVariables.DEF_PCKDIARY_TRANSTYPE_SOURCE_REFNO,
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckmybankname, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data, "pkt_subcat");
            setMyBankListFullData(response.data.data);

            const bank = response.data.data.map((data) => data.bankName);
            setMyBankListData(bank);
            if (bankID != null) {
              setMyBankList(
                response.data.data.filter((el) => {
                  return el.bank_refno === bankID;
                })[0].bankName
              );

              if (receiptModeID == 1 && categoryID == 1) {
                setBankBalanceStatus(true);
                FetchBankCurrentBalance(bankID);
              }
              else {
                setBankBalanceStatus(false);
                setBankBalance(0);
              }


            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchBankCurrentBalance = (bankID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID.toString(),
        Sess_company_refno: companyID.toString(),
        Sess_branch_refno: branchID.toString(),
        pck_entrytype_refno: _pktEntryTypeID,
        pck_mybank_refno: bankID.toString(),
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.get_availablebalance_cashinbank_sourceform, params)
      .then((response) => {

        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setBankBalance(response.data.data[0].cashinbank.toString());

            let amt = amount == "" ? 0 : parseFloat(amount);
            let bankAmt = response.data.data[0].cashinbank == "" ? 0 : parseFloat(response.data.data[0].cashinbank);

            if (amt > bankAmt) {
              settAmount("");
              setSnackbarText("Your entered amount is greater than for available balance.");
              setSnackbarColor(theme.colors.error);
              setSnackbarVisible(true);

            }

          }
        }
      })
      .catch((e) => { });
  };

  const FetchReceiverList = (contactID, contactName, subCategoryID, contactTypeID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        pck_sub_category_refno: subCategoryID.toString(),
        pck_contacttype_refno: contactTypeID == null ? 0 : contactTypeID == "" ? 0 : contactTypeID.toString(),
        AddNew: "NO",
        UserPhoneBookAllContactList: ""
      }
    };
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckmycontactname, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data, "pkt_subcat");

            setReceivedFormFullData(response.data.data);

            const receiverList = response.data.data.map(
              (data) => data.contactName
            );
            setReceivedFormData(receiverList);
            if (contactID != null) {
              setReceivedForm(
                response.data.data.filter((el) => {
                  return el.mycontactID === contactID;
                })[0].contactName
              );
            }

            if (contactName != null && contactName != "") {
              setReceivedForm(
                response.data.data.filter((el) => {
                  return el.contactName === contactName;
                })[0].contactName
              );
            }
          }
        }
      })
      .catch((e) => { });
  };

  const CheckContactList = (contactList, originalList) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        pck_sub_category_refno: "0",
        pck_contacttype_refno: "0",
        AddNew: "YES",
        UserPhoneBookAllContactList: contactList
      }
    };
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckmycontactname, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            var margedList = [];
            let ct = 0;
            if (contactTypeStatus) {
              ct = contactTypeFullData.filter((el) => {
                return el.pck_contacttype_name === contactType;
              })[0].pck_contacttype_refno;
            }

            originalList.map((data) => {

              let n = response.data.data.find((el) => {
                return el.Actual_no === data.phoneNumbers[0].number;
              });

              if (n != null) {

                if (ct == 1 && n.Is_SamadhanUser == 1) {
                  margedList.push({
                    name: data.name,
                    number: data.phoneNumbers[0].number,
                    Is_MyContactList: n.Is_MyContactList,
                    Is_SamadhanUser: n.Is_SamadhanUser,
                  });
                }
                else if (ct == 2 && n.Is_SamadhanUser == 0) {
                  margedList.push({
                    name: data.name,
                    number: data.phoneNumbers[0].number,
                    Is_MyContactList: n.Is_MyContactList,
                    Is_SamadhanUser: n.Is_SamadhanUser,
                  });
                }
              }
            });

            setIsContactLoading(false);
            navigation.navigate("PhoneContactDirectUpload", {
              phoneNumbers: margedList,
              callback: PhoneClicked,
            });
          }
        }
      })
      .catch((e) => { });
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
      .catch((e) => { });
  };

  const FetchContactType = (editID) => {
    let params = {
      data: {
        Sess_UserRefno: userID
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.get_contacttype, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setContactTypeFullData(response.data.data);
            const ct = response.data.data.map(
              (data) => data.pck_contacttype_name
            );
            setContactTypeData(ct);

            if (editID != null) {
              setContactType(
                response.data.data.filter((el) => {
                  return el.pck_contacttype_refno == editID;
                })[0].pck_contacttype_name
              );
            }
          }
        }
      })
      .catch((e) => { });
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
      .catch((e) => { });
  };

  const FetchDepositType = (depositID) => {
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
            if (depositID != null) {
              setDepositeType(
                response.data.data.filter((el) => {
                  return el.deposit_type_refno == depositID;
                })[0].deposit_type_name
              );
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchPaymentType = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckpaymenttype, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const pType = [];
            response.data.data.map((data) => {
              pType.push({
                label: data.payment_type_name,
                id: data.payment_type_refno,
                selected: false,
                value: data.payment_type_refno,
              });
            });

            setPaymentRB(pType);
          }
        }
      })
      .catch((e) => { });
  };

  const FetchPaymentGroup = (editID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckpaymentgroup, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const pType = [];
            response.data.data.map((data) => {
              pType.push({
                label: data.payment_group_name,
                id: data.payment_group_refno,
                selected: false,
                value: data.payment_group_refno,
              });
            });

            setPaymentGroup(pType);
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

    let a = entryTypeFullData.filter((el) => {
      return el.pck_entrytype_name === selectedItem;
    });

    setPktEntryTypeID(a[0].pck_entrytype_refno);
    _pktEntryTypeID = a[0].pck_entrytype_refno;
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

  const onContactTypeDataChanged = (text) => {
    setContactType(text);
    setErrorCT(false);

    setReceivedFormFullData([]);
    setReceivedFormData([]);
    setReceivedForm([]);
    setSCNError(false);
    setCommonStatus(true);
    setButtonStatus(false);

    let contact = contactTypeFullData.filter((el) => {
      return el.pck_contacttype_name === text;
    });

    let mode = receiptModeFullData.filter((el) => {
      return el.pckModeName === receiptMode;
    });

    let category = sourceFullData.filter((el) => {
      return el.categoryName === source;
    });

    let subcat = subCategoryNameFullData.filter((el) => {
      return el.subCategoryName === subCategoryName;
    });

    FetchReceiverList(null, null, 0, contact[0].pck_contacttype_refno);

    if (contact[0].pck_contacttype_refno == 3) {
      setNewMobileNumberStatus(true);
      setNewContactNameStatus(true);
      setReceivedStatus(false);
    }
    else {
      setNewMobileNumberStatus(false);
      setNewContactNameStatus(false);
      setReceivedStatus(true);
    }

    if (category[0].pckCategoryID == 4) {
      setPaymentReminderStatus(true);
    }
    else {
      setPaymentReminderStatus(false);
    }

    if (mode[0].pckModeID == "2" || mode[0].pckModeID == "4") {

      setBankListStatus(true);
      FetchBankList();
      setUTRNoStatus(true);

    }
    if (mode[0].pckModeID == "3") {

      setDepositTypeStatus(true);
      FetchDepositType();

    }

  };

  const onSourceChanged = (text) => {
    setSource(text);
    setSSError(false);
    resetFields();

    let a = sourceFullData.filter((el) => {
      return el.categoryName === text;
    });

    if (
      a[0].pckCategoryID == projectVariables.DEF_PCKDIARY_CATEGORY_Clients_REFNO
    ) {
      setSubCatStatus(false);
      setClientListstatus(true);
      FetchClientList();
    } else if (a[0].pckCategoryID == 4) {
      setSubCatStatus(false);
      setContactTypeStatus(true);
      FetchContactType();
    }
    else {
      setContactTypeStatus(false);
      setSubCatStatus(true);
      setClientListstatus(false);
      FetchReceptSubCategory(a[0].pckCategoryID);
    }
  };

  const onSubCategoryNameChanged = (text) => {

    setReceivedFormFullData([]);
    setReceivedFormData([]);
    setReceivedForm([]);

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

    if (category[0].pckCategoryID == 13) {
      setRentalDescriptionStatus(true);
    }
    else {
      setRentalDescriptionStatus(false);
    }

    if (mode[0].pckModeID == "1") {
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
      //else if (subcat[0].subcategoryID == "7" || subcat[0].subcategoryID == "9" || subcat[0].subcategoryID == "10" || subcat[0].subcategoryID == "11") {
      else if (subcat[0].subcategoryID == "7") {
        //setReceivedStatus(true);
        setPaymentReminderStatus(true);
        //FetchReceiverList(null, null, subcat[0].subcategoryID, 0);
        setContactTypeStatus(true);
        FetchContactType();
      }
      // My Business
      else if (
        subcat[0].subcategoryID == "9" ||
        subcat[0].subcategoryID == "10" ||
        subcat[0].subcategoryID == "11" ||
        subcat[0].subcategoryID == "12" ||
        subcat[0].subcategoryID == "13" ||
        subcat[0].subcategoryID == "14" ||
        subcat[0].subcategoryID == "15" ||
        subcat[0].subcategoryID == "16" ||
        subcat[0].subcategoryID == "17" ||
        subcat[0].subcategoryID == "18"
      ) {
        //setReceivedStatus(true);
        //FetchReceiverList(null, null, subcat[0].subcategoryID, null);
        setContactTypeStatus(true);
        FetchContactType();
      }
    } else if (mode[0].pckModeID == "2" || mode[0].pckModeID == "4") {
      setUTRNoStatus(true);
      if (subcat[0].subcategoryID == "7") {
        //setReceivedStatus(true);
        //FetchReceiverList(null, null, subcat[0].subcategoryID, null);
        setContactTypeStatus(true);
        FetchContactType();
        FetchBankList();
        setBankListStatus(true);
        setPaymentReminderStatus(true);
      } else if (
        subcat[0].subcategoryID == "9" ||
        subcat[0].subcategoryID == "10" ||
        subcat[0].subcategoryID == "11" ||
        subcat[0].subcategoryID == "12" ||
        subcat[0].subcategoryID == "13" ||
        subcat[0].subcategoryID == "14" ||
        subcat[0].subcategoryID == "15" ||
        subcat[0].subcategoryID == "16" ||
        subcat[0].subcategoryID == "17" ||
        subcat[0].subcategoryID == "18"
      ) {
        //setReceivedStatus(true);
        //FetchReceiverList(null, null, subcat[0].subcategoryID, null);
        setContactTypeStatus(true);
        FetchContactType();
        FetchBankList();
        setBankListStatus(true);
      }
    } else if (mode[0].pckModeID == "3") {
      if (subcat[0].subcategoryID == "7") {
        //setReceivedStatus(true);
        //FetchReceiverList(null, null, subcat[0].subcategoryID, null);
        setContactTypeStatus(true);
        FetchContactType();
        setDepositTypeStatus(true);
        FetchDepositType();
        setPaymentReminderStatus(true);
      } else if (
        subcat[0].subcategoryID == "9" ||
        subcat[0].subcategoryID == "10" ||
        subcat[0].subcategoryID == "11" ||
        subcat[0].subcategoryID == "12" ||
        subcat[0].subcategoryID == "13" ||
        subcat[0].subcategoryID == "14" ||
        subcat[0].subcategoryID == "15" ||
        subcat[0].subcategoryID == "16" ||
        subcat[0].subcategoryID == "17" ||
        subcat[0].subcategoryID == "18"
      ) {
        //setReceivedStatus(true);
        //FetchReceiverList(null, null, subcat[0].subcategoryID, null);
        setContactTypeStatus(true);
        FetchContactType();
        setDepositTypeStatus(true);
        FetchDepositType();
      }
    }
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

  const onProjectListChanged = (text) => {
    setProjectList(text);
    setErrorPL(false);

    setPaymentGroupStatus(true);

    FetchPaymentGroup();
    FetchPaymentType();

    setCommonStatus(true);
    setButtonStatus(false);

    let mode = receiptModeFullData.filter((el) => {
      return el.pckModeName === receiptMode;
    });

    if (mode[0].pckModeID == "2" || mode[0].pckModeID == "4") {
      setUTRNoStatus(true);
      FetchBankList();
      setBankListStatus(true);
    } else if (mode[0].pckModeID == "3") {
      setDepositTypeStatus(true);
      FetchDepositType();
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
    setContactTypeStatus(false);
    setNewContactNameStatus(false);
    setNewMobileNumberStatus(false);
    setRentalDescriptionStatus(false);
    setSubCategoryName("");
    setSubCategoryNameData([]);
    setUTRNoStatus(false);
    setClientListstatus(false);
    setClientListData([]);
    setClientList("");
    setProjectListstatus(false);
    setProjectListData([]);
    setProjectList("");
    setPaymentGroupStatus(false);
  };

  const onReceivedFormChanged = (text) => {
    setReceivedForm(text);
    setRFError(false);
  };

  const onChequeNoChange = (text) => {
    setChequeNo(text);
    setChequeNoError(false);
  };

  const onNewContactChange = (text) => {
    setContactName(text);
    setContactNameError(false);
  };

  const onMobileNoChange = (text) => {
    setMobileNumber(text);
    setMobileNoError(false);
  };

  const onInvoiceNoChange = (text) => {
    setInvoiceNo(text);
    setInvoiceNoError(false);
  };

  function onPaymentTypeChange(radioButtonsArray) {
    setPaymentRB(radioButtonsArray);

    radioButtonsArray.map((r) => {
      if (r.selected === true) {
        setPaymentTypeID(r.value);
      }
    });
  }

  function onPaymentGroupChange(radioButtonsArray) {
    setPaymentGroup(radioButtonsArray);

    radioButtonsArray.map((r) => {
      if (r.selected === true) {
        if (r.id == "2") {
          setPaymentTypeStatus(true);
          setInvoiceStatus(true);
        } else {
          setPaymentTypeStatus(false);
          setInvoiceStatus(false);
        }
        setPaymentGroupID(r.value);
      }
    });
  }

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

    let a = entryTypeFullData.filter((el) => {
      return el.pck_entrytype_name === entryType;
    });

    //if (a[0].pck_entrytype_refno == "2") {

    let depositID = depositeTypeFullData.filter((el) => {
      return el.deposit_type_name === text;
    })[0].deposit_type_refno;

    if (depositID == "1") {
      FetchBankList();
      setBankListStatus(true);
    } else {
      setBankListStatus(false);
    }

    setChequeNoStatus(true);
    setChequeDateStatus(true);

    // }
  };
  const onBankListChanged = (text) => {
    setMyBankList(text);
    setBLError(false);

    let mode = receiptModeFullData.filter((el) => {
      return el.pckModeName === receiptMode;
    });

    let category = sourceFullData.filter((el) => {
      return el.categoryName === source;
    });

    if (mode[0].pckModeID == 1 && category[0].pckCategoryID == 1) {
      setBankBalanceStatus(true);

      let bankID = myBankListFullData.filter((el) => {
        return el.bankName === text;
      })[0].bank_refno;

      FetchBankCurrentBalance(bankID);
    }
    else {
      setBankBalanceStatus(false);
      setBankBalance(0);
    }
  };

  const onAmount = (text) => {
    settAmount(text);
    setAmountError(false);

    let mode = receiptModeFullData.filter((el) => {
      return el.pckModeName === receiptMode;
    });

    let category = sourceFullData.filter((el) => {
      return el.categoryName === source;
    });

    if (mode.length > 0 && category.length > 0) {
      if (mode[0].pckModeID == 1 && category[0].pckCategoryID == 1 && bankBalanceStatus) {
        let amt = text == "" ? 0 : parseFloat(text);
        let bankAmt = bankBalance == "" ? 0 : parseFloat(bankBalance);

        if (amt > bankAmt) {
          settAmount("");
          setSnackbarText("Your entered amount is greater than your available balance.");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
      }
    }

  };

  const onrentalDescriptionChange = (text) => {
    setRentalDescription(text);
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
      // setDesignImage(
      //   AWSImagePath + unique_id + "." + arrExt[arrExt.length - 1]
      // );
      setImage(result.uri);
      setFilePath(result);
      if (route.params.type === "edit" || route.params.type === "verify") {
        setIsImageReplaced(true);
      }
    }
  };

  const InsertData = () => {
    let contactID = "",
      bankID = "",
      depositID = "";

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
      Sess_company_refno: companyID.toString(),
      Sess_branch_refno: branchID.toString(),
      Sess_designation_refno: designID.toString(),
      pck_entrytype_refno: pktEntryTypeID.toString(),
      pck_mode_refno: receiptModeFullData
        .filter((el) => {
          return el.pckModeName === receiptMode;
        })[0]
        .pckModeID.toString(),
      pck_category_refno: sourceFullData.filter((el) => {
        return el.categoryName === source;
      })[0].pckCategoryID,

      amount: amount.trim(),
      notes: notes.trim(),
      view_status: checked ? "1" : "0",
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
      params.cheque_date =
        chequeDate == "" ? "" : moment(chequeDate).format("DD-MM-YYYY");
    }

    if (paymentReminderStatus) {
      params.reminder_date =
        repaymentDate == "" ? "" : moment(repaymentDate).format("DD-MM-YYYY");
    }

    if (subCatStatus) {
      
      params.pck_sub_category_refno = subCategoryNameFullData.filter((el) => {
        return el.subCategoryName === subCategoryName;
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
      })[0].cont_project_refno.toString();
    }

    if (invoiceStatus) {
      params.invoice_no = invoiceNo.trim() == "" ? "" : invoiceNo.trim();
    }

    if (paymentTypeStatus) {
      params.payment_type_refno = paymentTypeID;
    }

    if (paymentGroupStatus) {
      params.payment_group_refno = paymentGroupID.toString();
    }

    if (contactTypeStatus) {
      params.pck_contacttype_refno = contactTypeFullData.filter((el) => {
        return el.pck_contacttype_name === contactType;
      })[0].pck_contacttype_refno;
    }
    else {
      params.pck_contacttype_refno = "0";
    }

    if (newContactNameStatus) {
      params.contact_name = contactName.trim() == "" ? "" : contactName.trim();
    }

    if (newMobileNumberStatus) {
      params.contact_phoneno = mobileNumber.trim() == "" ? "" : mobileNumber.trim();
    }

    if (rentalDescriptionStatus) {
      params.pck_sub_category_notes = rentalDescription.trim() == "" ? "" : rentalDescription.trim();
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
    Provider.createDFPocketDairyWithHeader(
      Provider.API_URLS.pckaddsourcecreate,
      datas
    )
      .then((response) => {
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
    let contactID = "",
      bankID = "",
      depositID = "";

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
      Sess_company_refno: companyID.toString(),
      Sess_branch_refno: branchID.toString(),
      Sess_designation_refno: designID.toString(),
      pck_entrytype_refno: pktEntryTypeID.toString(),
      pck_mode_refno: receiptModeFullData
        .filter((el) => {
          return el.pckModeName === receiptMode;
        })[0]
        .pckModeID.toString(),
      pck_category_refno: sourceFullData.filter((el) => {
        return el.categoryName === source;
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

    if (clientListStatus) {
      params.myclient_refno = clientListFullData.filter((el) => {
        return el.companyName === clientList;
      })[0].myclient_refno;
    }

    if (projectListStatus) {
      params.cont_project_refno = projectListFullData.filter((el) => {
        return el.project_name === projectList;
      })[0].cont_project_refno.toString();
    }

    if (invoiceStatus) {
      params.invoice_no = invoiceNo.trim() == "" ? "" : invoiceNo.trim();
    }

    if (paymentTypeStatus) {
      params.payment_type_refno = paymentTypeID;
    }

    if (paymentGroupStatus) {
      params.payment_group_refno = paymentGroupID.toString();
    }

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
      params.cheque_date =
        chequeDate == "" ? "" : moment(chequeDate).format("DD-MM-YYYY");
    }

    if (paymentReminderStatus) {
      params.reminder_date =
        repaymentDate == "" ? "" : moment(repaymentDate).format("DD-MM-YYYY");
    }

    if (route.params.type === "verify") {
      params.pck_master_trans_refno = pckTransID;
    }

    if (contactTypeStatus) {
      params.pck_contacttype_refno = contactTypeFullData.filter((el) => {
        return el.pck_contacttype_name === contactType;
      })[0].pck_contacttype_refno;
    }
    else {
      params.pck_contacttype_refno = "0";
    }

    if (rentalDescriptionStatus) {
      params.pck_sub_category_notes = rentalDescription.trim() == "" ? "" : rentalDescription.trim();
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
    Provider.createDFPocketDairyWithHeader(
      type == "edit"
        ? Provider.API_URLS.pckaddsourceupdate
        : Provider.API_URLS.pck_companysource_verify_action,
      datas)
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

    if (entryType == "") {
      isValid = false;
      setEntryTypeError(true);
    }

    if (amount.trim() == "" || amount.trim() == "0") {
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
    if (subCatStatus && subCategoryName == "") {
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

    if (paymentTypeStatus && paymentTypeID == 0) {
      isValid = false;
      setErrorPT(true);
    }

    if (paymentGroupStatus && paymentGroupID == 0) {
      isValid = false;
      setErrorPG(true);
    }

    if (invoiceStatus && invoiceNo.trim() == "") {
      isValid = false;
      setInvoiceNoError(true);
    }

    if (isValid) {
      // verify 324 api call
      if (route.params.type === "edit" || route.params.type === "verify") {
        UpdateData(route.params.type);
      } else {
        InsertData();
      }
    }
  };

  const ShowContactList = () => {
    setIsContactLoading(true);
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.PhoneNumbers],
        });
        if (data.length > 0) {
          const arrPhones = [], arrNumbers = [], arrDisplayNumbers = [];
          data.map((k, i) => {
            //if (i < 100) {
            if (Array.isArray(k.phoneNumbers)) {
              arrPhones.push(k);
              if (k.phoneNumbers.length > 1) {
                if (k.phoneNumbers[0].number != null) {
                  arrNumbers.push(
                    k.phoneNumbers[0].number == "" ? "" : k.phoneNumbers[0].number.replace(/\s+/g, '').replace(/[^0-9]/g, '').length <= 10 ? k.phoneNumbers[0].number.replace(/\s+/g, '').replace(/[^0-9]/g, '') : k.phoneNumbers[0].number.replace(/\s+/g, '').replace(/[^0-9]/g, '').slice(-10),
                  );
                  arrDisplayNumbers.push(
                    k.phoneNumbers[0].number
                  );
                }
              }
              else {
                if (k.phoneNumbers.number != null) {
                  arrNumbers.push(
                    k.phoneNumbers.number == "" ? "" : k.phoneNumbers.number.replace(/\s+/g, '').replace(/[^0-9]/g, '').length <= 10 ? k.phoneNumbers.number.replace(/\s+/g, '').replace(/[^0-9]/g, '') : k.phoneNumbers.number.replace(/\s+/g, '').replace(/[^0-9]/g, '').slice(-10),
                  );
                  arrDisplayNumbers.push(
                    k.phoneNumbers.number
                  );
                }
              }
            }
            //}
          });

          let obj = {};
          arrNumbers.map((key, index) => (obj[key] = arrDisplayNumbers[index]));
          CheckContactList(obj, arrPhones);

        }
      }
    })();
  };

  const PhoneClicked = (contact) => {
    
    if (contact != null) {
      InsertNewContact(contact.name, contact.number);
    }
  };

  const InsertNewContact = (name, mobileNo) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        contact_name: name,
        contact_phoneno: mobileNo.length > 10 ? mobileNo.replace(/\s+/g, '').replace(/[^0-9]/g, '').slice(-10) : mobileNo,
        remarks: "",
        view_status: "1",
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.pckmycontactscreate, params)
      .then((response) => {
        setIsContactLoading(false);
        if (response.data && response.data.code === 200) {

          let subcatID = 0, ct = 0;
          if (subCatStatus) {
            subcatID = subCategoryNameFullData.filter((el) => {
              return el.subCategoryName === subCategoryName;
            })[0].subcategoryID;
          }
          if (contactTypeStatus) {
            ct = contactTypeFullData.filter((el) => {
              return el.pck_contacttype_name === contactType;
            })[0].pck_contacttype_refno;
          }

          FetchReceiverList(null, name, subcatID, ct);

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
                onSelected={onEntryTypeChanged}
                isError={entryTypeError}
                selectedItem={entryType}
              />
              <HelperText type="error" visible={entryTypeError}>
                Please select a valid entry type
              </HelperText>
            </>
          )}

          <TextInput
            mode="outlined"
            label="Amount"
            value={amount}
            keyboardType="number-pad"
            returnKeyType="next"
            onSubmitEditing={() => ref_input2.current.focus()}
            onChangeText={onAmount}
            style={{ backgroundColor: "white" }}
            error={amountError}
          />
          <HelperText type="error" visible={amountError}>
            Please enter valid amount
          </HelperText>

          <Dropdown
            label="Receipt Mode"
            data={receiptModeData}
            onSelected={onReceiptModeChanged}
            isError={errorRM}
            selectedItem={receiptMode}
          />

          <HelperText type="error" visible={errorRM}>
            {communication.InvalidReceiptMode}
          </HelperText>

          <Dropdown
            label="Source / Receipt"
            data={sourceData}
            onSelected={onSourceChanged}
            isError={errorSS}
            selectedItem={source}
          />
          <HelperText type="error" visible={errorSS}>
            {communication.InvalidSource}
          </HelperText>

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
                {communication.InvalidSubCategoryName}
              </HelperText>
            </>
          )}

          {rentalDescriptionStatus && (
            <>
              <TextInput
               mode="outlined"
                label="Rental Description"
                value={rentalDescription}
                returnKeyType="next"
                keyboardType="default"
                onSubmitEditing={() => ref_input2.current.focus()}
                onChangeText={onrentalDescriptionChange}
                style={{ backgroundColor: "white" }}
              />
            </>
          )}

          {contactTypeStatus && (
            <>
              <Dropdown
                label="Contact Type"
                data={contactTypeData}
                onSelected={onContactTypeDataChanged}
                isError={errorCT}
                selectedItem={contactType}
              />
              <HelperText type="error" visible={errorCT}>
                Please select valid contact type
              </HelperText>
            </>
          )}

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
                      type: "source_client",
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

          {paymentGroupStatus && (
            <>
              <View
                style={[
                  Styles.marginTop8,
                  Styles.bordergray,
                  Styles.borderRadius4,
                ]}
              >
                <Text>Payment Group:</Text>
                <RadioGroup
                  containerStyle={[Styles.marginTop16]}
                  layout="row"
                  isError={errorPG}
                  radioButtons={paymentGroup}
                  onPress={onPaymentGroupChange}
                />
                <HelperText type="error" visible={errorPG}>
                  Please select payment group
                </HelperText>
              </View>
            </>
          )}

          {paymentTypeStatus && (
            <>
              <View
                style={[
                  Styles.marginTop16,
                  Styles.bordergray,
                  Styles.borderRadius4,
                ]}
              >
                <Text>Payment Type:</Text>
                <RadioGroup
                  containerStyle={[Styles.marginTop16]}
                  layout="row"
                  isError={errorPT}
                  radioButtons={paymentRB}
                  onPress={onPaymentTypeChange}
                />
                <HelperText type="error" visible={errorPT}>
                  Please select payment type
                </HelperText>
              </View>
            </>
          )}

          {invoiceStatus && (
            <>
              <TextInput
                mode="outlined"
                label="Invoice No"
                value={invoiceNo}
                returnKeyType="next"
                onSubmitEditing={() => ref_input2.current.focus()}
                onChangeText={onInvoiceNoChange}
                style={{ backgroundColor: "white" }}
                error={invoiceNoError}
              />
              <HelperText type="error" visible={invoiceNoError}>
                Please enter a valid Invoice number
              </HelperText>
            </>
          )}

          {receivedStatus && (
            <>
              <View
                style={[Styles.border1, Styles.borderRadius4, Styles.padding4]}
              >
                <Dropdown
                  label="Received From"
                  data={receivedFormData}
                  onSelected={onReceivedFormChanged}
                  isError={errorRF}
                  selectedItem={receivedForm}
                />
                <HelperText type="error" visible={errorRF}>
                  {communication.InvalidReceivedForm}
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

              </View>
            </>
          )}

          {newContactNameStatus && (
            <>
              <TextInput
                mode="outlined"
                label="Received From"
                value={contactName}
                returnKeyType="next"
                keyboardType="default"
                onSubmitEditing={() => ref_input2.current.focus()}
                onChangeText={onNewContactChange}
                style={{ backgroundColor: "white" }}
                error={contactNameError}
              />
              <HelperText type="error" visible={contactNameError}>
                Please enter a valid cheque number
              </HelperText>
            </>
          )}

          {newMobileNumberStatus && (
            <>
              <TextInput
               mode="outlined"
                label="Mobile No."
                value={mobileNumber}
                returnKeyType="next"
                keyboardType="number-pad"
                onSubmitEditing={() => ref_input2.current.focus()}
                onChangeText={onMobileNoChange}
                style={{ backgroundColor: "white" }}
                error={mobileNoError}
              />
              <HelperText type="error" visible={mobileNoError}>
                {communication.InvalidMobileNumber}
              </HelperText>
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

          {bankListStatus && (
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
                  data={myBankListData}
                  onSelected={onBankListChanged}
                  isError={errorBL}
                  selectedItem={myBankList}
                />
                <HelperText type="error" visible={errorBL}>
                  Please select a valid bank
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

          {bankBalanceStatus && (
            <>
              <TextInput
                mode="outlined"
                label="Available Balance"
                value={bankBalance}
                returnKeyType="next"
                outlineColor={theme.colors.primary}
                keyboardType="number-pad"
                onSubmitEditing={() => ref_input2.current.focus()}
                disabled={true}
                style={[Styles.marginTop8, { backgroundColor: "white" }]}
              />
            </>
          )}

          {chequeNoStatus && (
            <>
              <TextInput
               mode="outlined"
                label="Cheque No"
                value={chequeNo}
                returnKeyType="next"
                keyboardType="number-pad"
                onSubmitEditing={() => ref_input2.current.focus()}
                onChangeText={onChequeNoChange}
                style={{ backgroundColor: "white" }}
                error={chequeNoError}
              />
              <HelperText type="error" visible={chequeNoError}>
                Please enter a valid Cheque number
              </HelperText>
            </>
          )}

          {UTRNoStatus && (
            <>
              <TextInput
               mode="outlined"
                label="UTR No"
                value={UTRNo}
                returnKeyType="next"
                onSubmitEditing={() => ref_input2.current.focus()}
                onChangeText={onUTRNoChange}
                style={{ backgroundColor: "white" }}
                error={UTRNoError}
              />
              <HelperText type="error" visible={UTRNoError}>
                Please enter valid UTR No
              </HelperText>
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
                <HelperText type="error" visible={chequeDateError}>
                  Please enter a valid date
                </HelperText>
              </View>
            </>
          )}

          {paymentReminderStatus && (
            <>
              <View>
                <DateTimePicker
                  style={(Styles.backgroundColorWhite, Styles.marginTop16)}
                  label="Repayment Reminder Date"
                  type="date"
                  value={repaymentDate}
                  onChangeDate={setRepaymentDate}
                />
                <HelperText type="error" visible={chequeDateError}>
                  Please enter a valid date
                </HelperText>
              </View>
            </>
          )}

          {commonStatus && (
            <>
              <TextInput
               mode="outlined"
                label="Notes"
                value={notes}
                returnKeyType="next"
                onSubmitEditing={() => ref_input2.current.focus()}
                onChangeText={onNotesChange}
                style={{ backgroundColor: "white" }}
                error={notesError}
              />
              <HelperText type="error" visible={notesError}>
                {communication.InvalidNotes}
              </HelperText>
            </>
          )}

          {commonStatus && (
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



          {commonStatus && (
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

export default AddSource;
