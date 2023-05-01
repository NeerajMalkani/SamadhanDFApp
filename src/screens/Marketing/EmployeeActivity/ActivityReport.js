import { View, Text } from "react-native";
import React from "react";
import LabelInput from "./common/LabelInput";
import HDivider from "./common/HDivider";
import { Styles } from "../../../styles/styles";
import { ScrollView } from "react-native-gesture-handler";
import DisplayButton from "./common/DisplayButton";
import { TextInput, Title, List } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useState, useRef } from "react";
import Provider from "../../../api/Provider";
import RBSheet from "react-native-raw-bottom-sheet";

const ActivityCard = ({
  name,
  date,
  supportPerson,
  companyName,
  expensesAmount,
  salesAmount,
  receivedAmount,
  navigation,
  OpenRBSheet,
}) => (
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
    <LabelInput label="Activity Name" value={name} lg />
    <HDivider />
    <LabelInput label="Company Name" value={companyName} />
    <HDivider />
    <LabelInput label="Date" value={date} />
    <HDivider />
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        // textAlignVertical: "top",
      }}
    >
      <LabelInput label="Expenses Amount" value={expensesAmount} />
      <LabelInput label="Sales Amount" value={salesAmount} />

    </View>
    <HDivider />
    <LabelInput label="Received Amount" value={receivedAmount} />
    <HDivider />

    <LabelInput label="Support Person" value={supportPerson} />
    <HDivider />

    <DisplayButton
      text="View Company Details & Notes"
      width="100%"
      isGreen
      onPress={OpenRBSheet}
    />
  </View>
);
let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_group_refno = 0;
const ActivityReport = ({ navigation }) => {
  const refRBSheet = useRef();
  const isFocused = useIsFocused();
  const [tableValues, setTableValues] = useState([
    { label: "Expenses Amount", value: 0 },
    { label: "Sales Amount", value: 0 },
    { label: "Received Amount", value: 0 },
  ]);
  const [data, setData] = useState([]);

  const [contactName, setContactName] = React.useState("");
  const [contactNo, setContactNo] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [notes, setNotes] = React.useState("");

  const fetchUser = async () => {
    const data = JSON.parse(await AsyncStorage.getItem("user"));
    Sess_UserRefno = data.UserID;
    Sess_company_refno = data.Sess_company_refno;
    Sess_branch_refno = data.Sess_branch_refno;
    Sess_group_refno = data.Sess_group_refno;
    fetchData();
  };
  const fetchData = () => {
    Provider.createDFEmployee(Provider.API_URLS.employee_activity_report, {
      data: {
        Sess_UserRefno,
        Sess_company_refno,
        Sess_branch_refno,
        Sess_group_refno,
      },
    }).then((res) => {
      setData(res.data.data);
      setTableValues([
        {
          label: "Expenses Amount",
          value: res.data.data.reduce((a, b) => {
            if (!isNaN(b.expenses_amount)) {
              return a + Number(b.expenses_amount);
            }
            return a;
          }, 0),
        },
        {
          label: "Sales Amount",
          value: res.data.data.reduce((a, b) => {
            if (!isNaN(b.sales_amount)) {
              return a + Number(b.sales_amount);
            }
            return a;
          }, 0),
        },
        {
          label: "Received Amount",
          value: res.data.data.reduce((a, b) => {
            if (!isNaN(b.received_amount)) {
              return a + Number(b.received_amount);
            }
            return a;
          }, 0),
        },
      ]);
    });
  };

  const openSheet = (data) => {
    refRBSheet.current.open();
    setContactName(data.activity_details["Contact Name"]);
    setContactNo(data.activity_details["Contact No"]);
    setLocation(data.activity_details["Location"]);
    setStatus(data.activity_details["Status"]);
    setNotes(data.notes);
  };

  useEffect(() => {
    if (isFocused) fetchUser();
  }, [isFocused]);

  return (
    <View style={[Styles.flex1, { backgroundColor: "#fff" }, Styles.padding16]}>
      <View style={[Styles.paddingVertical8]}>
        {tableValues.map((t, i) => (
          <View
            style={{
              alignSelf: "center",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
            key={i}
          >
            <Text
              style={[
                Styles.width50per,
                Styles.paddingVertical8,
                Styles.margin2,
                Styles.textCenter,
                {
                  backgroundColor: "#a9a9a9",
                },
              ]}
            >
              {t.label}
            </Text>
            <Text
              style={[
                Styles.width50per,
                Styles.paddingVertical8,
                Styles.margin2,
                Styles.textCenter,
                { backgroundColor: "#eee", marginLeft: "2%" },
              ]}
            >
              {t.value}
            </Text>
          </View>
        ))}
      </View>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={[Styles.flex1, { background: "#fff" }]}>
          {data != null && data.map((com, i) => (
            <ActivityCard
              key={i}
              name={com.activity_name}
              date={com.activity_date}
              supportPerson={com.activity_details["Contact Name"]}
              companyName={com.activity_details["Company Name"]}
              expensesAmount={com.expenses_amount}
              salesAmount={com.sales_amount}
              receivedAmount={com.received_amount}
              navigation={navigation}
              OpenRBSheet={() => {
                openSheet(com)
              }}
            />
          ))}
        </View>
      </ScrollView>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true}
        height={380} animationType="fade"
        customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{contactName}</Title>
          <ScrollView style={{ marginBottom: 64 }}>
            <List.Item title="contact No" description={contactNo} />
            <List.Item title="Location" description={location} />
            <List.Item title="Status" description={status} />
            <List.Item title="Notes" description={notes} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default ActivityReport;
