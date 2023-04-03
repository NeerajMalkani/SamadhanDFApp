import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, TextInput, Subheading } from "react-native-paper";
import Provider from "../../../../../api/Provider";
import { Styles } from "../../../../../styles/styles";
import { theme } from "../../../../../theme/apptheme";
import { APIConverter } from "../../../../../utils/apiconverter";
import { communication } from "../../../../../utils/communication";

let userID = 0;

const AddGMyBankScreen = ({ route, navigation }) => {
  //#region Variables
  const [bankNameError, setBankNameError] = React.useState(false);
  const [bankName, setBankName] = React.useState(route.params.type === "edit" ? route.params.data.bankName : "");

  const [accountHolderNameError, setAccountHolderNameError] = React.useState(false);
  const [accountHolderName, setAccountHolderName] = React.useState("");

  const [bankBranchNameError, setbankBranchNameError] = React.useState(false);
  const [bankBranchName, setbankBranchName] = React.useState("");

  const [ifscCodeError, setIfscCodeError] = React.useState(false);
  const [ifscCode, setIfscCode] = React.useState("");

  const [bankAccountNoError, setBankAccountNoError] = React.useState(false);
  const [bankAccountNo, setBankAccountNo] = React.useState(route.params.type === "edit" ? route.params.data.bankAccountNo : "");
  const [openingBalanceError, setOpeningBalanceError] = React.useState(false);
  const [openingBalance, setOpeningBalance] = React.useState(route.params.type === "edit" ? route.params.data.openingBalance : "");
  const [remarksError, setRemarksError] = React.useState(false);
  const [remarks, setRemarks] = React.useState(route.params.type === "edit" ? route.params.data.remarks : "");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);
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

  useEffect(() => {
    GetUserID();
  }, []);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      FetchCardType();
    }
  };


  const FetchCardType = () => {
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
              cardType.push(
                {
                  title: data.cardtype_name,
                  isChecked: false,
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

  const [cardTypeInvalid, setCardTypeInvalid] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  //#endregion

  //#region Functions
  const onAccountHolderNameChanged = (text) => {
    setAccountHolderName(text);
    setAccountHolderNameError(false);
  };

  const onIfscCodeChanged = (text) => {
    setIfscCode(text);
    setIfscCodeError(false);
  };

  const onBankBranchNameChanged = (text) => {
    setbankBranchName(text);
    setbankBranchNameError(false);
  };

  const onBankNameChanged = (text) => {
    setBankName(text);
    setBankNameError(false);
  };

  const onBankAccountNoChanged = (text) => {
    setBankAccountNo(text);
    setBankAccountNoError(false);
  };
  const onOpeningBalanceChanged = (text) => {
    setOpeningBalance(text);
    setOpeningBalanceError(false);
  };
  const onRemarksChanged = (text) => {
    setRemarks(text);
    setRemarksError(false);
  };
  const InsertBankAccount = () => {
    let ct = [];
    cardType.map((k, i) => {
      if (k.isChecked) {
        ct.push(k.id);
      }
    });

    let params = {
      data: {
        Sess_UserRefno: userID,
        view_status: checked ? "1" : "0",
        bank_ac_holder_name: accountHolderName,
        bank_account_no: bankAccountNo,
        bank_name: bankName,
        bank_branch_name: bankBranchName,
        ifsc_code: ifscCode,
        cardtype_refno: ct,
        opening_balance: openingBalance,
        remarks: remarks,
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.pckmypersonalbankcreate, params)
      .then((response) => {
        setIsButtonLoading(false);
        if (response.data && response.data.code === 200) {
          route.params.fetchBankList();
          navigation.goBack();
        } else if (response.data.data.Created === 0) {
          setSnackbarText(response.data.message);
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
        setIsButtonLoading(false);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const UpdateBankAccount = () => {
    let tt = [];
    cardType.map((k, i) => {
      if (k.isChecked) {
        tt.push(k.id);
      }
    });

    let params = {
      data: {
        Sess_UserRefno: "2",
        pck_category_refno: route.params.data.pckCategoryID,
        category_name: categoryName,
        pck_transtype_refno: tt,
        view_status: checked ? "1" : "0",
      },
    };
    Provider.createDFCommon(Provider.API_URLS.pckcategorynameupdate_user, params)
      .then((response) => {
        
        setIsButtonLoading(false);
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
        setIsButtonLoading(false);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const ValidateActivityName = () => {
    let isValid = true;

    if (accountHolderName.trim() == "") {
      setAccountHolderNameError(true);
      isValid = false;
    }

    if (bankName.trim() == "") {
      setBankNameError(true);
      isValid = false;
    }

    if (isValid) {
      setIsButtonLoading(true);
      if (route.params.type === "edit") {
        UpdateBankAccount();
      } else {
        InsertBankAccount();
      }
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <TextInput mode="outlined" label="Account Holder Name" value={accountHolderName} onChangeText={onAccountHolderNameChanged} style={{ backgroundColor: "white" }} error={accountHolderNameError} />
          <HelperText type="error" visible={accountHolderNameError}>
            Please enter valid name
          </HelperText>

          <TextInput mode="outlined" label="Bank Account No" value={bankAccountNo} keyboardType="number-pad" onChangeText={onBankAccountNoChanged} style={{ backgroundColor: "white" }} error={bankAccountNoError} />
          <HelperText type="error" visible={bankAccountNoError}>
            Please enter valid account number
          </HelperText>

          <TextInput mode="outlined" label="Bank Name" value={bankName} onChangeText={onBankNameChanged} style={{ backgroundColor: "white" }} error={bankNameError} />
          <HelperText type="error" visible={bankNameError}>
            {communication.InvalidBrandName}
          </HelperText>

          <TextInput mode="outlined" label="Bank Branch Name" value={bankBranchName} onChangeText={onBankBranchNameChanged} style={{ backgroundColor: "white" }} error={bankBranchNameError} />
          <HelperText type="error" visible={bankBranchNameError}>
            Please enter valid branch name
          </HelperText>

          <TextInput mode="outlined" label="IFSC Code" value={ifscCode} onChangeText={onIfscCodeChanged} style={{ backgroundColor: "white" }} error={ifscCodeError} />
          <HelperText type="error" visible={ifscCodeError}>
            Please enter valid IFSC Code
          </HelperText>

          <Subheading style={{ paddingTop: 24, fontWeight: "bold" }}>Card Type</Subheading>
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
            Please select Card Type
          </HelperText>
          <TextInput mode="outlined" keyboardType={"number-pad"} label="Opening Balance" value={openingBalance} onChangeText={onOpeningBalanceChanged} style={{ backgroundColor: "white" }} error={openingBalanceError} />
          <HelperText type="error" visible={openingBalanceError}>
            {communication.InvalidOpeningBalance}
          </HelperText>
          <TextInput mode="outlined" label="Remarks" value={remarks} onChangeText={onRemarksChanged} style={{ backgroundColor: "white" }} error={remarksError} />
          <HelperText type="error" visible={remarksError}>
            {communication.InvalidRemarks}
          </HelperText>
          <View style={[Styles.flexRow, Styles.marginTop16]}>
            <Checkbox.Item
              label="Display"
              color={theme.colors.primary}
              style={[Styles.paddingHorizontal0]}
              position="leading"
              labelStyle={[Styles.textLeft, Styles.paddingStart4, Styles.fontSize14]}
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content>
          <Button mode="contained" loading={isButtonLoading} disabled={isButtonLoading} onPress={ValidateActivityName}>
            SAVE
          </Button>
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddGMyBankScreen;
