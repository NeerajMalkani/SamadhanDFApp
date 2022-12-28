import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, TextInput, Subheading } from "react-native-paper";
import Provider from "../../../../../api/Provider";
import { Styles } from "../../../../../styles/styles";
import { theme } from "../../../../../theme/apptheme";
import { APIConverter } from "../../../../../utils/apiconverter";
import { communication } from "../../../../../utils/communication";

const AddGMyBankScreen = ({ route, navigation }) => {
  //#region Variables
  const [bankNameError, setBankNameError] = React.useState(false);
  const [bankName, setBankName] = React.useState(route.params.type === "edit" ? route.params.data.bankName : "");
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

    let isEdit = route.params.type === "edit" ? true : false;

    FetchTransactionType(isEdit);
  }, []);

  const FetchTransactionType = (edit) => {

    let params = {
      data: {
        Sess_UserRefno: "2",
      },
    };
    Provider.createDFCommon(Provider.API_URLS.gettransactiontype_pckcategoryform_user, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);

            const stateData: any = [];
            response.data.data.map((data: any, i: number) => {
              let checked = false;
              if (edit && route.params.data.transactionTypeName.includes(data.transTypeName)) {
                checked = true;
              }

              stateData.push({
                title: data.transTypeName,
                isChecked: checked,
                id: data.transtypeID
              });
            });
            setTransactionTypeName(stateData);
          }
        } else {
          listData[1]([]);
          setSnackbarText("No data found");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
        //setIsLoading(false);
        setRefreshing(false);
      })
      .catch((e) => {
        //setIsLoading(false);
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
        setRefreshing(false);
      });
  };

  const [cardTypeInvalid, setCardTypeInvalid] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);



  const [isButtonLoading, setIsButtonLoading] = useState(false);
  //#endregion

  //#region Functions
  const onBankNameChanged = (text) => {
    setCategoryName(text);
    setCategoryNameError(false);
  };

  const onBankAccountNoChanged = (text) => {
    setCategoryName(text);
    setCategoryNameError(false);
  };
  const onOpeningBalanceChanged = (text) => {
    setCategoryName(text);
    setCategoryNameError(false);
  };
  const onRemarksChanged = (text) => {
    setCategoryName(text);
    setCategoryNameError(false);
  };
  const InsertCategoryName = () => {
    let tt = [];
    transactionTypeName.map((k, i) => {
      if (k.isChecked) {
        tt.push(k.id);
      }
    });
    let params = {
      data: {
        Sess_UserRefno: "2",
        category_name: categoryName,
        pck_transtype_refno: tt,
        view_status: checked ? "1" : "0",
      }
    };
    Provider.createDFCommon(Provider.API_URLS.pckcategorynamecreate_user, params)
      .then((response) => {
        setIsButtonLoading(false);
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
        setIsButtonLoading(false);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const UpdateActivityName = () => {
    let tt = [];
    transactionTypeName.map((k, i) => {
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
    }
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
    if (categoryName.length === 0) {
      setCategoryNameError(true);
      isValid = false;
    }

    let tt = [];
    transactionTypeName.map((k, i) => {
      if (k.isChecked) {
        tt.push(k.id);
      }
    });

    if (tt.length == 0) {
      isValid = false;
      setTransactionTypeNameInvalid(true);
    }

    if (isValid) {
      setIsButtonLoading(true);
      if (route.params.type === "edit") {
        UpdateActivityName();
      } else {
        InsertCategoryName();
      }
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <TextInput mode="flat" label="Bank Name" value={bankName} onChangeText={onBankNameChanged} style={{ backgroundColor: "white" }} error={bankNameError} />
          <HelperText type="error" visible={bankNameError}>
            {communication.InvalidBankName}
          </HelperText>
          <TextInput mode="flat" label="Bank Account No" value={bankAccountNo} onChangeText={onBankAccountNoChanged} style={{ backgroundColor: "white" }} error={bankAccountNoError} />
          <HelperText type="error" visible={bankAccountNoError}>
            {communication.InvalidBankAccountNo}
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
          <TextInput mode="flat" label="Opening Balance" value={openingBalance} onChangeText={onOpeningBalanceChanged} style={{ backgroundColor: "white" }} error={openingBalanceError} />
          <HelperText type="error" visible={openingBalanceError}>
            {communication.InvalidOpeningBalance}
          </HelperText>
          <TextInput mode="flat" label="Remarks" value={remarks} onChangeText={onRemarksChanged} style={{ backgroundColor: "white" }} error={remarksError} />
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

