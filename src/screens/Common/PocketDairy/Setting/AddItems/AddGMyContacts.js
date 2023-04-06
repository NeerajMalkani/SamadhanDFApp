import { ScrollView, View } from "react-native";
import * as Contacts from "expo-contacts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  Checkbox,
  HelperText,
  Snackbar,
  TextInput,
} from "react-native-paper";
import Provider from "../../../../../api/Provider";
import { Styles } from "../../../../../styles/styles";
import { theme } from "../../../../../theme/apptheme";
import { communication } from "../../../../../utils/communication";
let userID = 0,
  compID = 0;

const AddGMyContactsScreen = ({ route, navigation }) => {
  //#region Variables
  const [nameError, setNameError] = React.useState(false);
  const [name, setName] = React.useState(
    route.params.type === "edit" ? route.params.data.contactName : ""
  );

  const [mobileNoError, setMobileNoError] = React.useState(false);
  const [mobileNo, setMobileNo] = React.useState(
    route.params.type === "edit" ? route.params.data.contactPhoneno : ""
  );

  const [remarkError, setRemarkError] = React.useState(false);
  const [remarkName, setRemarkName] = React.useState(
    route.params.type === "edit" ? route.params.data.remarks : ""
  );
  const [checked, setChecked] = React.useState(
    route.params.type === "edit" ? route.params.data.display : true
  );

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);

  const [snackbarText, setSnackbarText] = React.useState("");
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );

  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isContactLoading, setIsContactLoading] = useState(false);
  //#endregion

  //#region Functions

  useEffect(() => {
    GetUserID();
  }, []);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      compID = JSON.parse(userData).Sess_company_refno;
    }
  };

  const onNameChanged = (text) => {
    setName(text);
    setNameError(false);
  };

  const onMobileNoChanged = (text) => {
    setMobileNo(text);
    setMobileNoError(false);
  };

  const onRemarkChanged = (text) => {
    setRemarkName(text);
    setRemarkError(false);
  };

  const InsertCategoryName = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        contact_name: name,
        contact_phoneno: mobileNo,
        remarks: remarkName,
        view_status: checked ? "1" : "0",
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.pckmycontactscreate, params)
      .then((response) => {
        setIsButtonLoading(false);
        if (response.data && response.data.code === 200) {
          if (route.params.type == "newContact") {
            route.params.fetchReceiverList();
            navigation.goBack();
          } else {
            route.params.fetchData("add");
            navigation.goBack();
          }
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
    let params = {
      data: {
        Sess_UserRefno: userID,
        pck_mycontact_refno: route.params.data.mycontactID,
        contact_name: name,
        contact_phoneno: mobileNo,
        remarks: remarkName,
        view_status: checked ? "1" : "0",
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.pckmycontactsupdate, params)
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

    if (name.trim() === "") {
      setNameError(true);
      isValid = false;
    }

    if (mobileNo.trim() === "") {
      setMobileNoError(true);
      isValid = false;
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

  const PhoneClicked = (contact) => {
    setName(contact.name);
    setMobileNo(contact.phoneNumbers[0].number);
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
        //console.log(data);
        if (data.length > 0) {
          //console.log(data[0]);
          //console.log(data[1]);
          const arrPhones = [];
          const arrNumbers = [];

          data.map((k, i) => {
            // if (i < 100) {
            //console.log('==================================');
            //console.log(k);
            if (Array.isArray(k.phoneNumbers)) {
              arrPhones.push(k);

              if (k.phoneNumbers.length > 1) {

                if (k.phoneNumbers[0].number != null) {
                  arrNumbers.push({
                    number: k.phoneNumbers[0].number == "" ? "" : k.phoneNumbers[0].number.replace(/\s+/g, '').replace(/[^0-9]/g, '').length <= 10 ? k.phoneNumbers[0].number.replace(/\s+/g, '').replace(/[^0-9]/g, '') : k.phoneNumbers[0].number.replace(/\s+/g, '').replace(/[^0-9]/g, '').slice(-10),
                    displayNumber: k.phoneNumbers[0].number
                  });
                }
              }
              else {
                if (k.phoneNumbers.number != null) {
                  arrNumbers.push({
                    number: k.phoneNumbers.number == "" ? "" : k.phoneNumbers.number.replace(/\s+/g, '').replace(/[^0-9]/g, '').length <= 10 ? k.phoneNumbers.number.replace(/\s+/g, '').replace(/[^0-9]/g, '') : k.phoneNumbers.number.replace(/\s+/g, '').replace(/[^0-9]/g, '').slice(-10),
                    displayNumber: k.phoneNumbers.number
                  }

                  );
                }
              }
            }
            // }
          });
          //console.log(arrNumbers[0]);
          //console.log(arrPhones[0]);
          setIsContactLoading(false);
          navigation.navigate("PhoneContacts", {
            phoneNumbers: arrPhones,
            callback: PhoneClicked,
          });
        }
      }
    })();
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView
        style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[Styles.padding16]}>
          <Card.Content>
            <Button
              icon={"card-account-phone-outline"}
              mode="contained"
              loading={isContactLoading}
              disabled={isContactLoading}
              onPress={ShowContactList}
            >
              load from contacts
            </Button>
          </Card.Content>
        </View>
        <View style={[Styles.padding16]}>
          <TextInput
            mode="outlined"
            label=" Name"
            value={name}
            onChangeText={onNameChanged}
            style={{ backgroundColor: "white" }}
            error={nameError}
          />
          <HelperText type="error" visible={nameError}>
            {communication.InvalidCategoryName}
          </HelperText>
          <TextInput
            mode="outlined"
            label="Mobile No"
            maxLength={10}
            keyboardType="number-pad"
            value={mobileNo}
            onChangeText={onMobileNoChanged}
            style={{ backgroundColor: "white" }}
            error={mobileNoError}
          />
          <HelperText type="error" visible={mobileNoError}>
            {communication.InvalidMobileNo}
          </HelperText>
          <TextInput
            mode="outlined"
            label="Remarks"
            value={remarkName}
            onChangeText={onRemarkChanged}
            style={{ backgroundColor: "white" }}
            error={remarkError}
          />
          <HelperText type="error" visible={remarkError}>
            {communication.InvalidRemarks}
          </HelperText>
          <View style={[Styles.flexRow, Styles.marginTop16]}>
            <Checkbox.Item
              label="Display"
              color={theme.colors.primary}
              style={[Styles.paddingHorizontal0]}
              position="leading"
              labelStyle={[
                Styles.textLeft,
                Styles.paddingStart4,
                Styles.fontSize14,
              ]}
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          </View>
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
            loading={isButtonLoading}
            disabled={isButtonLoading}
            onPress={ValidateActivityName}
          >
            SAVE
          </Button>
        </Card.Content>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.error }}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddGMyContactsScreen;
