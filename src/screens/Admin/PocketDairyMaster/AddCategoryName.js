import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Card, Checkbox, HelperText, Snackbar, TextInput, Subheading } from "react-native-paper";
import Provider from "../../../api/Provider";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { APIConverter } from "../../../utils/apiconverter";
import { communication } from "../../../utils/communication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DFButton from "../../../components/Button";  

let userID = 0, groupID = 0;
const AddCategoryNameScreen = ({ route, navigation }) => {
  //#region Variables
  const [categoryNameError, setCategoryNameError] = React.useState(false);
  const [categoryName, setCategoryName] = React.useState(route.params.type === "edit" ? route.params.data.categoryName : "");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const [transactionTypeName, setTransactionTypeName] = useState([
    {
      title: "Source",
      isChecked: route.params.type === "edit" && route.params.data.transactionTypeName && route.params.data.transactionTypeName.toString().includes("Source") ? true : false,
      id: "1",
    },
    {
      title: "Expenses",
      isChecked: route.params.type === "edit" && route.params.data.transactionTypeName && route.params.data.transactionTypeName.toString().includes("Expenses") ? true : false,
      id: "2",
    },
  ]);

  const [entryTypeName, setEntryTypeName] = useState([
    {
      title: "Self",
      isChecked: route.params.type === "edit" && route.params.data.entryType && route.params.data.entryType.toString().includes("Self") ? true : false,
      id: "1",
    },
    {
      title: "Company",
      isChecked: route.params.type === "edit" && route.params.data.entryType && route.params.data.entryType.toString().includes("Company") ? true : false,
      id: "2",
    },
  ]);

  const [transactionTypeNameInvalid, setTransactionTypeNameInvalid] = useState(false);
  const [entryTypeInvalid, setEntryTypeInvalid] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  useEffect(() => {
    GetUserID();
  }, []);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      groupID = JSON.parse(userData).Sess_group_refno;
      // companyID = JSON.parse(userData).Sess_company_refno;
      // branchID = JSON.parse(userData).Sess_branch_refno;
      // designID = JSON.parse(userData).Sess_designation_refno;
      // roleID = JSON.parse(userData).RoleID;
      // FetchEntryType(JSON.parse(userData).RoleID);
      let isEdit = route.params.type === "edit" ? true : false;
      FetchEntryType(isEdit);
      FetchTransactionType(isEdit);
    }
  };

  const FetchTransactionType = (edit) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.gettransactiontype_pckcategoryform_appadmin, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);

            const stateData = [];
            response.data.data.map((data, i) => {
              let checked = false;
              if (edit && route.params.data.transactionTypeName.includes(data.transTypeName)) {
                checked = true;
              }

              stateData.push({
                title: data.transTypeName,
                isChecked: checked,
                id: data.transtypeID,
              });
            });
            setTransactionTypeName(stateData);
          }
        } else {
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

  const FetchEntryType = (edit) => {
    //console.log('start entry');
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID
      },
    };
    //console.log('params', params);
    Provider.createDFPocketDairy(Provider.API_URLS.get_pckentrytype, params)
      .then((response) => {

        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            const entryType = [];
            response.data.data.map((data, i) => {
              let checked = false;
              if (edit && route.params.data.entryType.includes(data.pck_entrytype_name)) {
                checked = true;
              }

              entryType.push({
                title: data.pck_entrytype_name,
                isChecked: checked,
                id: data.pck_entrytype_refno,
              });
            });
            setEntryTypeName(entryType);
          }
        }

      })
      .catch((e) => {
        //setIsLoading(false);
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
        setRefreshing(false);
      });
  };

  //#endregion

  //#region Functions
  const onCategoryNameChanged = (text) => {
    setCategoryName(text);
    setCategoryNameError(false);
  };

  const InsertCategoryName = () => {
    let tt = [], et = [];
    transactionTypeName.map((k, i) => {
      if (k.isChecked) {
        tt.push(k.id.toString());
      }
    });
    entryTypeName.map((k, i) => {
      if (k.isChecked) {
        et.push(k.id.toString());
      }
    });
    let params = {
      data: {
        Sess_UserRefno: userID,
        category_name: categoryName,
        pck_transtype_refno: tt,
        pck_entrytype_refno: et,
        view_status: checked ? "1" : "0",
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.pckcategorynamecreate_appadmin, params)
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
    let tt = [], et = [];
    transactionTypeName.map((k, i) => {
      if (k.isChecked) {
        tt.push(k.id.toString());
      }
    });
    entryTypeName.map((k, i) => {
      if (k.isChecked) {
        et.push(k.id.toString());
      }
    });
    let params = {
      data: {
        Sess_UserRefno: userID,
        pck_category_refno: route.params.data.pckCategoryID,
        category_name: categoryName,
        pck_transtype_refno: tt,
        pck_entrytype_refno: et,
        view_status: checked ? "1" : "0",
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.pckcategorynameupdate_appadmin, params)
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

    let tt = [], et = [];
    transactionTypeName.map((k, i) => {
      if (k.isChecked) {
        tt.push(k.id);
      }
    });
    entryTypeName.map((k, i) => {
      if (k.isChecked) {
        et.push(k.id);
      }
    });

    if (tt.length == 0) {
      isValid = false;
      setTransactionTypeNameInvalid(true);
    }
    if (et.length == 0) {
      isValid = false;
      setEntryTypeInvalid(true);
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
          <Subheading style={{ paddingTop: 24, fontWeight: "bold" }}>Entry Type</Subheading>
          <View style={[Styles.flexRow]}>
            {entryTypeName.map((k, i) => {
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
                      let temp = entryTypeName.map((u) => {
                        if (k.title === u.title) {
                          return { ...u, isChecked: !u.isChecked };
                        }
                        return u;
                      });
                      setEntryTypeInvalid(false);
                      setEntryTypeName(temp);
                    }}
                  />
                </View>
              );
            })}
          </View>
          <HelperText type="error" visible={entryTypeInvalid}>
            Please select Entry Type
          </HelperText>
          <TextInput mode="outlined" label="Category Name" value={categoryName} onChangeText={onCategoryNameChanged} style={{ backgroundColor: "white" }} error={categoryNameError} />
          <HelperText type="error" visible={categoryNameError}>
            {communication.InvalidCategoryName}
          </HelperText>
          <Subheading style={{ paddingTop: 24, fontWeight: "bold" }}>Transaction Type</Subheading>
          <View style={[Styles.flexRow]}>
            {transactionTypeName.map((k, i) => {
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
                      let temp = transactionTypeName.map((u) => {
                        if (k.title === u.title) {
                          return { ...u, isChecked: !u.isChecked };
                        }
                        return u;
                      });
                      setTransactionTypeNameInvalid(false);
                      setTransactionTypeName(temp);
                    }}
                  />
                </View>
              );
            })}
          </View>
          <HelperText type="error" visible={transactionTypeNameInvalid}>
            Please select Transaction Type
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
           <DFButton mode="contained" onPress={ValidateActivityName} title="SAVE" loader={isButtonLoading} />
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddCategoryNameScreen;
