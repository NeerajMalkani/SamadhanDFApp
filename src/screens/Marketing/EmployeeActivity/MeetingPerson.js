import { View, Text } from "react-native";
import React from "react";
import LabelInput from "./common/LabelInput";
import HDivider from "./common/HDivider";
import { Styles } from "../../../styles/styles";
import { ScrollView } from "react-native-gesture-handler";
import DisplayButton from "./common/DisplayButton";

const MeetingPersonCard = ({
  name,
  designation,
  mobileNo,
  email,
  navigation,
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
    <LabelInput label="Name" value={name} lg />
    <HDivider />
    <LabelInput label="Designation" value={designation} />
    <HDivider />
    <LabelInput label="Mobile No." value={mobileNo} />
    <HDivider />
    <LabelInput label="Email" value={email} />
    <HDivider />
    <DisplayButton text="Edit Details" width={140} isGreen onPress={() => {}} />
  </View>
);
const MeetingPerson = ({ navigation, route }) => {
  return (
    <ScrollView
      style={[Styles.flex1, { backgroundColor: "#fff" }, Styles.padding16]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={[Styles.flex1, { background: "#fff" }]}>
        {route.params.data.map((com, i) => (
          <MeetingPersonCard
            key={i}
            name={com.contact_person}
            designation={com.designation}
            mobileNo={com.mobile_no}
            email={com.email_id}
            navigation={navigation}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default MeetingPerson;
