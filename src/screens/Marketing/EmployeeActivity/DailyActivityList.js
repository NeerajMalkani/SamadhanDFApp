import { View, Text } from "react-native";
import React from "react";
import LabelInput from "./common/LabelInput";
import HDivider from "./common/HDivider";
import DisplayButton from "./common/DisplayButton";
import { ScrollView } from "react-native-gesture-handler";
import { Styles } from "../../../styles/styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useState } from "react";
import Provider from "../../../api/Provider";
import { Button } from "react-native-paper";

const sample = [
  {
    activity: "Sample Kit",
    date: "30-03-2023",
    companyName: "ABC ",
    contactPerson: "Naveen",
    mobileNo: "9898989898",
    location: "Bangalore",
    status: true,
    display: [],
  },
  {
    activity: "Sample Kit",
    date: "30-03-2023",
    companyName: "ABC ",
    contactPerson: "Naveen",
    mobileNo: "9898989898",
    location: "Bangalore",
    status: true,
    display: [],
  },
  {
    activity: "Sample Kit",
    date: "30-03-2023",
    companyName: "ABC ",
    contactPerson: "Naveen",
    mobileNo: "9898989898",
    location: "Bangalore",
    status: true,
    display: [],
  },
  {
    activity: "Sample Kit",
    date: "30-03-2023",
    companyName: "ABC ",
    contactPerson: "Naveen",
    mobileNo: "9898989898",
    location: "Bangalore",
    status: true,
    display: [],
  },
  {
    activity: "Sample Kit",
    date: "30-03-2023",
    companyName: "ABC ",
    contactPerson: "Naveen",
    mobileNo: "9898989898",
    location: "Bangalore",
    status: true,
    display: [],
  },
];

const PersonCard = ({
  activity,
  date,
  companyName,
  contactPerson,
  mobileNo,
  location,
  status = true,
  display,
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
    <LabelInput label="Activity" value={activity} />
    <HDivider />
    <LabelInput label="Date" value={date} />
    <HDivider />
    <LabelInput label="Company / Firm Name" value={companyName} />
    <HDivider />
    <LabelInput label="Contact Person" value={contactPerson} />
    <HDivider />
    <View style={[{ flexDirection: "row", justifyContent: "space-between" }]}>
      <LabelInput label="Mobile" value={mobileNo} />
      <LabelInput label="Location" value={location} />
    </View>
    <HDivider />

    <View style={[{ flexDirection: "row", justifyContent: "space-between" }]}>
      <LabelInput
        label="Activity Status"
        value={
          <DisplayButton
            text="Success"
            width={100}
            isGreen={status}
            onPress={() => {}}
          />
        }
      />

      <LabelInput
        label="Display"
        value={
          <DisplayButton
            text="YES"
            width={12}
            isGreen={status}
            onPress={() => {}}
          />
        }
      />
    </View>
    <DisplayButton
      style={{ marginTop: 12 }}
      text="Edit Details"
      onPress={() => {}}
    />
  </View>
);
let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_group_refno = 0;
const DailyActivityList = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const fetchUser = async () => {
    const data = JSON.parse(await AsyncStorage.getItem("user"));
    Sess_UserRefno = data.UserID;
    Sess_company_refno = data.Sess_company_refno;
    Sess_branch_refno = data.Sess_branch_refno;
    Sess_group_refno = data.Sess_group_refno;
    fetchData();
  };

  useEffect(() => {
    if (isFocused) {
      fetchUser();
    }
  }, [isFocused]);
  const fetchData = () => {
    Provider.createDFEmployee(
      Provider.API_URLS.employeeactivity_myemployeeactivityrefnocheck,
      {
        data: {
          Sess_UserRefno,
          Sess_company_refno,
          Sess_branch_refno,
          Sess_group_refno,
          myemployee_activity_refno: "0",
        },
      }
    ).then((res) => console.log(res.data));
  };
  return (
    <ScrollView
      style={[Styles.flex1, { backgroundColor: "#fff" }, Styles.padding16]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[Styles.flex1, { background: "#fff" }]}>
        <View style={{ justifyContent: "flex-end" }}>
          <Button onPress={() => navigation.navigate("DailyActivityForm")}>
            Add
          </Button>
        </View>
        {data.map((person, i) => (
          <PersonCard
            key={i}
            activity={person.activity}
            date={person.date}
            location={person.location}
            companyName={person.companyName}
            mobileNo={person.mobileNo}
            contactPerson={person.contactPerson}
            status={person.status}
            display={person.display}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default DailyActivityList;
