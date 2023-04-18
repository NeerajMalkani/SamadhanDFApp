import { ScrollView, Text, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import { theme } from "../../../theme/apptheme";
import { Styles } from "../../../styles/styles";
import LabelInput from "./common/LabelInput";
import HDivider from "./common/HDivider";
import DisplayButton from "./common/DisplayButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import Provider from "../../../api/Provider";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

// borderColor: theme.colors.greenBorder,

const isNo = false;
const CardComponent = ({ companyName, address, display, navigation }) => {
  return (
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
      <LabelInput label="Company Name" value={companyName} lg />
      <HDivider />
      <LabelInput label="Address" value={address} />
      <HDivider />
      <Text
        style={[
          Styles.marginBottom4,
          Styles.fontSize12,
          Styles.fontBold,
          { color: "darkgray" },
        ]}
      >
        Display
      </Text>
      <View style={[Styles.marginTop6, { flexDirection: "row" }]}>
        <DisplayButton width="20%" text="YES" isGreen onPress={() => {}} />
        <DisplayButton
          text="Edit"
          width="30%"
          isGreen={true}
          onPress={() => {}}
        />
        <DisplayButton
          text="Meeting Person"
          width="44%"
          isGreen={true}
          onPress={() =>
            navigation.navigate("MeetingPerson", { data: display })
          }
        />
      </View>
    </View>
  );
};
let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_group_refno = 0;
const CustomerList = ({ navigation }) => {
  const [data, setData] = useState([]);
  const isFocused = useIsFocused();

  const fetchCustomers = () => {
    Provider.createDFEmployee(Provider.API_URLS.employee_mycustomerlist, {
      data: {
        Sess_UserRefno,
        Sess_company_refno,
        Sess_branch_refno,
        Sess_group_refno,
      },
    })
      .then((res) => {
        setData(res?.data?.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchUser = async () => {
    const data = JSON.parse(await AsyncStorage.getItem("user"));
    Sess_UserRefno = data.UserID;
    Sess_company_refno = data.Sess_company_refno;
    Sess_branch_refno = data.Sess_branch_refno;
    Sess_group_refno = data.Sess_group_refno;
    fetchCustomers();
  };
  useEffect(() => {
    if (isFocused) {
      fetchUser();
    }
  }, [isFocused]);

  return (
    <ScrollView
      style={[Styles.flex1, { backgroundColor: "#fff" }, Styles.padding16]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ justifyContent: "flex-end" }}>
        <Button onPress={() => navigation.navigate("EmployeeCustomerForm")}>
          Add
        </Button>
      </View>
      <View style={[Styles.flex1, { background: "#fff" }]}>
        {data?.map((com, i) => (
          <CardComponent
            key={i}
            companyName={com.company_name}
            address={com.address}
            display={com.ContactDetails}
            navigation={navigation}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default CustomerList;
