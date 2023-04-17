import React, { useEffect, useState, useRef } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Styles } from "../../../../styles/styles";
import Provider from "../../../../api/Provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment/moment";
import { Button } from "react-native";
import CustomButton from "../Components/CustomButton";
import {
  Card,
  HelperText,
  Snackbar,
  Divider,
  Text,
  Title,
  FAB,
} from "react-native-paper";
import { communication } from "../../../../utils/communication";
import { theme } from "../../../../theme/apptheme";

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 10, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: theme.colors.primary },
  subheader: { height: 30, backgroundColor: "white" },
  text: { textAlign: "center", fontWeight: "100" },
  headertext: { textAlign: "center", fontWeight: "800", color: "white" },
  dataWrapper: { marginTop: -1 },
  row: { height: 50, backgroundColor: "white" },
});

let Sess_UserRefno = 0;
let Sess_group_refno = 0;

function AddressList({ route, navigation }) {
  const AddCallback = () => {
    navigation.navigate("AddNewAddress", {
      type: "add",
      fetchData: FetchData,
    });
  };
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const [addressList, setAddressList] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState({});
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const ValidateData = () => {
    setIsButtonLoading(true);
    update();
  };

  const update = () => {
    const params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_group_refno: Sess_group_refno,
        estimation_refno: route.params.data.estimation_refno,
        estimation_enquiry_refno: route.params.data.estimation_enquiry_refno,
        useraddress_refno: selectedItem.useraddress_refno,
      },
    };

    Provider.createDFCommon(
      Provider.API_URLS.estimation_accept_workallotupdate,
      params
    )
      .then((response) => {
        if (response.data && response.data.data.Updated == 1) {
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
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      })
      .finally(() => setIsButtonLoading(false));
  };

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText(
        "Item " + (from === "add" ? "added" : "updated") + " successfully"
      );
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    const params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_group_refno: Sess_group_refno,
        useraddress_refno: "all",
      },
    };

    Provider.createDFCommon(Provider.API_URLS.deliveryaddress_list, params)
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            setAddressList(response.data.data);
            setSelectedItem(response.data?.data[0]);
          }
        }
      })
      .catch((e) => console.log(e));
  };

  const GetUserID = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData !== null) {
        Sess_UserRefno = JSON.parse(userData).UserID;
        Sess_group_refno = JSON.parse(userData).Sess_group_refno;
        FetchData();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    GetUserID();
  }, []);
  return (
    <View style={[Styles.flex1]}>
      <ScrollView
        style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[Styles.padding16]}>
          <Title
            style={[Styles.primaryColor, Styles.fontSize20, Styles.fontBold]}
          >
            Select a Delivery Address
          </Title>
        </View>
        <View style={[Styles.padding16]}>
          {addressList.map((item, index) => (
            <View
              key={index}
              style={{
                borderWidth: 2,
                borderRadius: 5,
                ...Styles.padding16,
                borderColor: theme.colors.primary,
                marginBottom: 15,
              }}
            >
              <View style={{ marginBottom: 8 }}>
                <Text>
                  {`${item?.contact_person}, ${item?.company_name}, ${item?.address}, ${item?.state_name}, ${item?.district_name}, ${item?.pincode}, Phone No: ${item?.contact_person_mobile_no}`}
                </Text>
              </View>
              <View style={{ marginBottom: 8 }}>
                <Divider style={{ height: 1.6 }} />
              </View>
              <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 1 }}>
                  <CustomButton
                    disabled={isButtonLoading}
                    onPress={() => setSelectedItem(item)}
                    color={
                      selectedItem === item ? theme.colors.primary : "#e1f7e2"
                    }
                    title={`Select Address`}
                    textcolor={selectedItem === item ? "white" : "black"}
                  />
                </View>
                <View style={{ flex: 0.2 }}></View>
                <View style={{ flex: 1 }}>
                  <CustomButton
                    disabled={isButtonLoading}
                    onPress={() =>
                      navigation.navigate("UpdateExistingAddress", {
                        type: "edit",
                        fetchData: FetchData,
                        data: {
                          ...item,
                        },
                      })
                    }
                    color={"grey"}
                    title="Update Address"
                    textcolor={"white"}
                  />
                </View>
              </View>
            </View>
          ))}
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
            disabled={isButtonLoading}
            onPress={ValidateData}
            color={theme.colors.primary}
            title={`Confirm Address & Work Allotment`}
          />
        </Card.Content>
      </View>

      <FAB
        style={[
          Styles.margin16,
          Styles.primaryBgColor,
          { position: "absolute", right: 16, bottom: 50 },
        ]}
        icon="plus"
        onPress={AddCallback}
      />
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
}

export default AddressList;
