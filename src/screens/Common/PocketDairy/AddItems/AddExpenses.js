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
        setEmployeeTypeID(r.value);
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
  //   const [subCategoryName, setSubCategoryName] = React.useState(route.params.type === "edit" ? route.params.data.subCategoryName : "");
  const [errorSCN, setSCNError] = React.useState(false);

  const [payModeFullData, setPayModeFullData] = React.useState([]);
  const [payModeData, setPayModeData] = React.useState([]);
  const [payMode, setPayMode] = React.useState([]);
  //   const [payMode, setPayMode] = React.useState(route.params.type === "edit" ? route.params.data.payMode : "");
  const [errorPM, setPMError] = React.useState(false);

  const [cardTypeData, setCardTypeData] = React.useState([]);
  const [cardType, setCardType] = React.useState([]);
  //   const [cardType, setCardType] = React.useState(route.params.type === "edit" ? route.params.data.cardType : "");
  const [errorCT, setCTError] = React.useState(false);

  const [cardBankData, setCardBankData] = React.useState([]);
  const [cardBank, setCardBank] = React.useState([]);
  //   const [cardBank, setCardBank] = React.useState(route.params.type === "edit" ? route.params.data.payMode : "");
  const [errorCB, setCBError] = React.useState(false);

  const [cardRepayment, setCardRepayment] = useState(new Date());
  const [cardRepaymentInvalid, setCardRepaymentInvalid] = useState("");
  const cardRepaymentRef = useRef({});

  const [expensesFullData, setExpensesFullData] = React.useState([]);
  const [expensesData, setExpensesData] = React.useState([]);
  const [expenses, setExpenses] = React.useState([]);
  //   const [expenses, setExpenses] = React.useState(route.params.type === "edit" ? route.params.data.expenses : "");
  const [errorEX, setEXError] = React.useState(false);

  const [amountError, setAmountError] = React.useState(false);
  const [amount, settAmount] = React.useState(route.params.type === "edit" ? route.params.data.amount : "");

  const [paidToData, setPaidToData] = React.useState([]);
  const [paidTo, setPaidTo] = React.useState([]);
  //   const [paidTo, setPaidToName] = React.useState(route.params.type === "edit" ? route.params.data.paidTo : "");
  const [errorPT, setPTError] = React.useState(false);

  const [recurringDate, setRecurringDate] = useState(new Date());
  const [recurringDateInvalid, setRecurringDateInvalid] = useState("");
  const recurringDateRef = useRef({});

  const [depositeTypeData, setDepositeTypeData] = React.useState([]);
  const [depositeType, setDepositeType] = React.useState([]);
  //   const [depositeType, setDepositeTypeName] = React.useState(route.params.type === "edit" ? route.params.data.depositeType : "");
  const [errorDT, setDTError] = React.useState(false);

  const [myBankData, setMyBankData] = React.useState([]);
  const [MyBank, setMyBank] = React.useState([]);
  //   const [MyBank, setMyBank] = React.useState(route.params.type === "edit" ? route.params.data.MyBank : "");
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
  const [cardRepaymentDate, setCardRepaymentDate] = React.useState(false);
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
            FetchPaymentMode(2);//expense=2 need to confirm from balaji
          }
        }
      })
      .catch((e) => { });
  };

  const FetchPaymentMode = (pktEntryTypeID) => {
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
            response.data.data = APIConverter(response.data.data);
            setPayModeFullData(response.data.data);
            const receiptMode = response.data.data.map((data) => data.pckModeName);
            setPayModeData(receiptMode);
          }
        }
      })
      .catch((e) => { });
  };

  const FetchExpenseCategory = (receiptModeID, categoryID) => {
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

  const FetchExpenseSubCategory = (categoryID, subCategoryID) => {
console.log('start sub category');
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
            console.log(response.data.data);
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

  const onPayModeChanged = (text) => {
    setPayMode(text);
    setPMError(false);
    let a = payModeFullData.filter((el) => {
      return el.pckModeName === text;
    });

    FetchExpenseCategory(a[0].pckModeID);

  };

  const onExpensesChanged = (text) => {
    console.log('category change');
    setExpenses(text);
    setEXError(false);
    console.log(expensesFullData);
    let a = expensesFullData.filter((el) => {
      return el.categoryName === text;
    });

    console.log(a);
    FetchExpenseSubCategory(a[0].pckCategoryID);

  };

  const onCardTypeChanged = (text) => {
    setCardType(text);
    setCTError(false);
  };

  const onCardBankNameChanged = (text) => {
    setCardBank(text);
    setCBError(false);
  };

  const onSubCategoryNameChanged = (text) => {
    setSubCategoryName(text);
    setSCNError(false);
  };


  const onEntryType = (text) => {
    setEntryType(text);
    setEntryTypeError(false);
  };


  const onAmount = (text) => {
    setAmount(text);
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

  const onDepositeTypeChanged = (text) => {
    setDepositeType(text);
    setDTError(false);
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
    let arrunitOfSalesName = [];
    unitOfSalesData.map((o) => {
      if (o.isChecked) {
        arrunitOfSalesName.push(o.id);
      }
    });
    Provider.create("master/insertcategory", {
      CategoryName: name,
      RoleID: activityFullData.find((el) => {
        return el.activityRoleName === acivityName;
      }).id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      HSNSACCode: hsn,
      GSTRate: parseFloat(gst),
      UnitID: arrunitOfSalesName.join(","),
      Display: checked,
    })
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

  const UpdateData = () => {
    let arrunitOfSalesName = [];
    unitOfSalesData.map((o) => {
      if (o.isChecked) {
        arrunitOfSalesName.push(o.id);
      }
    });
    const params = {
      ID: route.params.data.id,
      CategoryName: name,
      RoleID: activityFullData.find((el) => {
        return el.activityRoleName === acivityName;
      }).id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      HSNSACCode: hsn,
      GSTRate: parseFloat(gst),
      UnitID: arrunitOfSalesName.join(","),
      Display: checked,
    };
    Provider.create("master/updatecategory", {
      ID: route.params.data.id,
      CategoryName: name,
      RoleID: activityFullData.find((el) => {
        return el.activityRoleName === acivityName;
      }).id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      HSNSACCode: hsn,
      GSTRate: parseFloat(gst),
      UnitID: arrunitOfSalesName.join(","),
      Display: checked,
    })
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
    if (name.length === 0) {
      setError(true);
      isValid = false;
    }
    const objActivities = activityFullData.find((el) => {
      return el.activityRoleName && el.activityRoleName === acivityName;
    });
    if (acivityName.length === 0 || !objActivities) {
      setANError(true);
      isValid = false;
    }
    const objServices = servicesFullData.find((el) => {
      return el.serviceName && el.serviceName === serviceName;
    });
    if (serviceName.length === 0 || !objServices) {
      setSNError(true);
      isValid = false;
    }
    if (hsn.length === 0) {
      setHSNError(true);
      isValid = false;
    }
    if (gst.length === 0) {
      setGSTError(true);
      isValid = false;
    }
    const objUnitOfSales = unitOfSalesData.find((el) => {
      return el.isChecked;
    });
    if (!objUnitOfSales) {
      setUNError(true);
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

          <TextInput mode="flat" label="Amount" value={amount} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onAmount} style={{ backgroundColor: "white" }} error={amountError} />
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

          {cardRepaymentDate &&

            <>
              <View >
                <DateTimePicker style={Styles.backgroundColorWhite} label="Credit Card Repayment Due Date" type="date" value={cardRepayment} onChangeDate={setCardRepayment} />
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
              <Dropdown label="Paid To" data={paidToData} onSelected={onPaidToChanged} isError={errorPT} selectedItem={paidTo} />
              <HelperText type="error" visible={errorPT}>
                Please select valid recepient
              </HelperText>
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
              <View  >
                <DateTimePicker style={Styles.backgroundColorWhite, Styles.marginBottom12} label="Recurring Reminder Date" type="date" value={recurringDate} onChangeDate={setRecurringDate} />
              </View>
            </>

          }

          {depositTypeStatus &&
            <>
              <Dropdown label="Desposite Type" data={depositeTypeData} onSelected={onDepositeTypeChanged} isError={errorDT} selectedItem={depositeType} />
              <HelperText type="error" visible={errorDT}>
                {communication.InvalidDepositeType}
              </HelperText>
            </>
          }

          {bankStatus &&

            <>
              <Dropdown label="My Bank List" data={myBankData} onSelected={onMyBankChanged} isError={errorMB} selectedItem={MyBank} />
              <HelperText type="error" visible={errorMB}>
                Please select valid bank
              </HelperText>
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
