import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";

const AddCategoryNameScreen = ({ route, navigation }) => {
  //#region Variables
  const [categoryNameError, setCategoryNameError] = React.useState(false);
  const [categoryName, setCategoryName] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const [transactionTypeName, setTransactionTypeName] = useState([
    {
      title: "Sucess",
      isChecked: route.params.type === "edit" && route.params.data.transactionType && route.params.data.transactionType.toString().includes("1") ? true : false,
    },
    {
      title: "Expenses",
      isChecked: route.params.type === "edit" && route.params.data.transactionType && route.params.data.transactionType.toString().includes("2") ? true : false,
    },
    
  ]);
  const [transactionTypeNameInvalid, setTransactionTypeNameInvalid] = useState(false);

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  //#endregion

  //#region Functions
  const onCategoryNameChanged = (text) => {
    setCategoryName(text);
    setCategoryNameError(false);
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
          <TextInput mode="flat" label="Category Name" value={categoryName} onChangeText={onCategoryNameChanged} style={{ backgroundColor: "white" }} error={activityNameError} />
          <HelperText type="error" visible={categoryNameError}>
            {communication.InvalidCategoryName}
          </HelperText>
          <View key={i} style={[Styles.flex1]}>
              <Checkbox.Item
                label={k.title}
                position="Transaction Type Name"
                style={[Styles.paddingHorizontal0]}
                labelStyle={[Styles.textLeft, Styles.paddingStart4, Styles.fontSize14]}
                color={theme.colors.primary}
                status={k.isChecked ? "checked" : "unchecked"}
                onPress={() => {
                  let temp = serviceTypeRoles.map((u) => {
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

export default AddCategoryNameScreen;

