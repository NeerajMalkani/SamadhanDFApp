import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";

const AddSubCategoryNameScreen = ({ route, navigation }) => {
  //#region Variables
  
  const [transactionTypeFullData, setTransactionTypeFullData] = React.useState([]);
  const [transactionTypeData, setTransactionTypeData] = React.useState([]);
  const [transactionTypeName, setTransactionTypeName] = React.useState(route.params.type === "edit" ? route.params.data.TransactionType : "");
  const [errorTTN, setTTNError] = React.useState(false);

  const [categoryFullData, setCategoryFullData] = React.useState([]);
  const [categoryData, setCategoryData] = React.useState([]);
  const [categoryName, setCategoryName] = React.useState(route.params.type === "edit" ? route.params.data.categoryName : "");
  const [errorCT, setCTError] = React.useState(false);

  const [subCategoryNameError, setSubCategoryNameError] = React.useState(false);
  const [subCategoryName, setSubCategoryName] = React.useState(route.params.type === "edit" ? route.params.data.subCategoryName : "");

  const [notesError, setNotesError] = React.useState(false);
  const [notes, setNotes] = React.useState(route.params.type === "edit" ? route.params.data.Notes.toString() : "");

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  //#endregion

  //#region Functions
  const onTransactionTypeName = (selectedItem) => {
    setTransactionTypeName(selectedItem);
    setTTNError(false);
  };

  const onCategoryNameSelected = (selectedItem) => {
    setCategoryName(selectedItem);
    setCTError(false);
  };

  const onSubCategoryNameChanged = (text) => {
    setSubCategoryName(text);
    setSubCategoryNameError(false);
  };

  const onNotesChanged = (text) => {
    setNotes(text);
    setNotesError(false);
  };

  const InsertActivityName = () => {
    Provider.createDFAdmin(Provider.API_URLS.GroupNameCreate, {
      data: {
        Sess_UserRefno: "2",
        group_name: activityName,
        view_status: checked ? 1 : 0,
      },
    })
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
    Provider.createDFAdmin(Provider.API_URLS.GroupNameUpdate, {
      data: {
        Sess_UserRefno: "2",
        group_refno: route.params.data.id,
        group_name: activityName,
        view_status: checked ? 1 : 0,
      },
    })
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
    if (activityName.length === 0) {
      setActivityNameError(true);
      isValid = false;
    }
    if (isValid) {
      setIsButtonLoading(true);
      if (route.params.type === "edit") {
        UpdateActivityName();
      } else {
        InsertActivityName();
      }
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
        <View style={[Styles.padding16]}>
          <Dropdown label="Transaction Type" data={transactionTypeData} onSelected={onTransactionTypeName} isError={errorTTN} selectedItem={transactionTypeName} />
          <HelperText type="error" visible={errorTTN}>
            {communication.InvalidTransactionTypeName}
          </HelperText>
          <Dropdown label="Category Name" data={categoryData} onSelected={onCategoryNameSelected} isError={errorCT} selectedItem={categoryName} />
          <HelperText type="error" visible={errorCT}>
            {communication.InvalidCategoryName}
          </HelperText>
          <TextInput mode="flat" label="Sub Category Name" value={subCategoryName} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onSubCategoryNameChanged} style={{ backgroundColor: "white" }} error={subCategoryNameError} />
          <HelperText type="error" visible={subCategoryNameError}>
            {communication.InvalidSubCategoryName}
          </HelperText>
          <TextInput  mode="flat" label="Notes" value={notes} returnKeyType="next" onSubmitEditing={() => ref_input3.current.focus()} onChangeText={onNotesChanged} style={{ backgroundColor: "white" }} error={notesError} />
          <HelperText type="error" visible={notesError}>
            {communication.InvalidNotes}
          </HelperText>
          <View style={{ width: 160 }}>
            <Checkbox.Item
              label="Display"
              color={theme.colors.primary}
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
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

export default AddSubCategoryNameScreen;

