import { View, Text } from "react-native";
import { FAB, Snackbar } from "react-native-paper";
import React, { useEffect, useRef, useState } from "react";
import LabelInput from "./common/LabelInput";
import HDivider from "./common/HDivider";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { ScrollView } from "react-native-gesture-handler";
import DisplayButton from "./common/DisplayButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Provider from "../../../api/Provider";

let userID = 0, companyID = 0, groupID = 0, branchID = 0;

const MeetingPersonCard = ({ contactDetails, EditData }) => (
  <View
    style={[
      {
        backgroundColor: "#eee",
        borderRadius: 8,
      },
      Styles.padding16,
      Styles.marginVertical8,
    ]}
  >
    <LabelInput label="Name" value={contactDetails.contact_person} lg />
    <HDivider />
    <LabelInput label="Designation" value={contactDetails.designation} />
    <HDivider />
    <LabelInput label="Mobile No." value={contactDetails.mobile_no} />
    <HDivider />
    <LabelInput label="Email" value={contactDetails.email_id} />
    <HDivider />
    <DisplayButton text="Edit Details" width={140} isGreen onPress={EditData} />
  </View>
);
const MeetingPerson = ({ navigation, route }) => {

  const [listData, setListData] = useState([]);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  useEffect(() => {
    navigation.setOptions({ headerTitle: route.params.headerTitle });
    GetUserID();
  }, []);

  const AddCallback = () => {
    navigation.navigate("AddMeetingPerson", { type: "add", fetchCustomers: fetchCustomers });
  };

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      companyID = JSON.parse(userData).Sess_company_refno;
      groupID = JSON.parse(userData).Sess_group_refno;
      branchID = JSON.parse(userData).Sess_branch_refno;
      fetchCustomers();
    }
  };

  const fetchCustomers = (from) => {
    if (from == "add" || from == "update") {
      setSnackbarText("Item " + (from == "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID,
        Sess_branch_refno: branchID,
        Sess_group_refno: groupID,
        mycustomer_refno: route.params.data.mycustomer_refno
      }
    };
    Provider.createDFEmployee(Provider.API_URLS.employee_mycustomerlist, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setListData(response.data.data[0].ContactDetails)
          }
        } else {
        }
      })
      .catch((e) => {
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
      });
  };

  const EditData = (data) => {
    navigation.navigate("AddMeetingPerson", {
      type: "edit",
      fetchCustomers: fetchCustomers,
      data: data,
    });
  };

  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <ScrollView
        style={[Styles.flex1, { backgroundColor: "#fff" }, Styles.padding16]}
        keyboardShouldPersistTaps="handled">
        <View style={[Styles.flex1, Styles.paddingBottom32, { background: "#fff" }]}>
          {listData != null && listData.length > 0 && listData.map((com, i) => (
            <MeetingPersonCard
              key={i}
              contactDetails={com}
              EditData={() => {
                EditData(com)
              }}
            />
          ))}
        </View>
      </ScrollView>
      {/* <FAB style={[Styles.fabStyle]} icon="plus" onPress={AddCallback} /> */}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default MeetingPerson;
