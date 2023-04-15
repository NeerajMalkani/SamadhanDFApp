import { View, Text } from "react-native";
import React from "react";
import FormInput from "../common/Input";
import { ScrollView } from "react-native-gesture-handler";
import { Styles } from "../../../../styles/styles";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import Provider from "../../../../api/Provider";
import { Button } from "react-native-paper";
let userID = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
const EmployeeCustomerForm = () => {
  const isFocused = useIsFocused();
  const [state, setState] = useState({
    company_name: "",
    contact_person: "",
    designation: "",
    mobile_no: "",
    phone_no: "",
    email_id: "",
    address: "",
    pincode: "",
    district_refno: "",
    state_refno: "",
    view_status: "0",
  });

  const [error, setError] = useState({
    company_name: false,
    contact_person: false,
    designation: false,
    mobile_no: false,
    phone_no: false,
    email_id: false,
    address: false,
    pincode: false,
    district_refno: false,
    state_refno: false,
  });
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const fetchUser = async () => {
    const data = JSON.parse(await AsyncStorage.getItem("user"));
    userID = data.UserID;
    Sess_branch_refno = data.Sess_branch_refno;
    Sess_company_refno = data.Sess_company_refno;
    fetchState();
  };
  useEffect(() => {
    if (isFocused) {
      fetchUser();
    }
  }, [isFocused]);
  const fetchState = () => {
    Provider.createDFCommon(Provider.API_URLS.GetStateDetails)
      .then((res) => {
        if (res.data.data) setStates(res.data.data);
      })
      .catch((error) => console.log(error));
  };
  const fetchDistricts = (state_refno) => {
    Provider.createDFCommon(Provider.API_URLS.GetDistrictDetailsByStateRefno, {
      data: {
        Sess_UserRefno: userID,
        state_refno,
      },
    })
      .then((res) => {
        console.log(res.data);
        if (res.data.data) setDistricts(res.data.data);
      })
      .catch((error) => console.log(error));
  };

  const handleSubmit = () => {
    let errors = false;
    if (state.company_name.length === 0) {
      setError((state) => ({ ...state, company_name: true }));
      errors = true;
    }
    if (state.contact_person.length === 0) {
      setError((state) => ({ ...state, contact_person: true }));
      errors = true;
    }
    if (state.designation.length === 0) {
      setError((state) => ({ ...state, designation: true }));
      errors = true;
    }
    if (state.mobile_no.length !== 10) {
      setError((state) => ({ ...state, mobile_no: true }));
      errors = true;
    }
    if (state.phone_no.length !== 10) {
      setError((state) => ({ ...state, phone_no: true }));
      errors = true;
    }
    if (
      state.email_id.length === 0 &&
      !String(state.email_id)
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setError((state) => ({ ...state, email_id: true }));
      errors = true;
    }
    if (state.address.length !== 10) {
      setError((state) => ({ ...state, address: true }));
      errors = true;
    }
    if (state.state_refno.length !== 10) {
      setError((state) => ({ ...state, state_refno: true }));
      errors = true;
    }
    if (state.district_refno.length !== 10) {
      setError((state) => ({ ...state, district_refno: true }));
      errors = true;
    }
    if (state.pincode.length !== 10) {
      setError((state) => ({ ...state, pincode: true }));
      errors = true;
    }
    if (!errors) {
      Provider.createDFEmployee(
        Provider.API_URLS.employee_create_customerdata,
        {
          data: {
            Sess_UserRefno: userID,
            Sess_company_refno,
            Sess_branch_refno,
            ...state,
          },
        }
      );
    }
  };

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
      <View style={[Styles.flex1, Styles.padding16, { background: "#fff" }]}>
        <FormInput
          label="Company Name"
          onChangeText={(text) => {
            setState((state) => ({
              ...state,
              company_name: text,
            }));

            setError((state) => ({
              ...state,
              company_name: false,
            }));
          }}
          error={error.company_name}
          value={state.company_name}
        />
        <FormInput
          label="Contact Person"
          value={state.contact_person}
          onChangeText={(text) => {
            setState((state) => ({
              ...state,
              contact_person: text,
            }));

            setError((state) => ({
              ...state,
              contact_person: false,
            }));
          }}
          error={error.contact_person}
        />
        <FormInput
          label="Designation"
          value={state.designation}
          onChangeText={(text) => {
            setState((state) => ({
              ...state,
              designation: text,
            }));

            setError((state) => ({
              ...state,
              designation: false,
            }));
          }}
          error={error.designation}
        />
        <FormInput
          label="Mobile Number"
          onChangeText={(text) => {
            if (text.length < 11)
              setState((state) => ({
                ...state,
                mobile_no: text,
              }));

            setError((state) => ({
              ...state,
              mobile_no: false,
            }));
          }}
          keyboardType={"phone-pad"}
          value={state.mobile_no}
          error={error.mobile_no}
        />
        <FormInput
          value={state.phone_no}
          label="Telephone Number"
          onChangeText={(text) => {
            if (text.length < 11)
              setState((state) => ({
                ...state,
                phone_no: text,
              }));

            setError((state) => ({
              ...state,
              phone_no: false,
            }));
          }}
          error={error.phone_no}
          keyboardType={"phone-pad"}
        />
        <FormInput
          label="Email ID"
          onChangeText={(text) => {
            setState((state) => ({
              ...state,
              email_id: text,
            }));

            setError((state) => ({
              ...state,
              email_id: false,
            }));
          }}
          value={state.email_id}
          error={error.email_id}
        />
        <FormInput
          label="Address 1 "
          onChangeText={(text) => {
            setState((state) => ({
              ...state,
              address: text,
            }));

            setError((state) => ({
              ...state,
              address: false,
            }));
          }}
          value={state.address}
          error={error.address}
        />
        <FormInput
          label="State"
          type="dropdown"
          data={states.map((obj) => obj.state_name)}
          onChangeText={(text) => {
            setState((state) => ({
              ...state,
              state_refno: text,
              district_refno: "",
            }));

            setError((state) => ({
              ...state,
              state_refno: false,
            }));
            fetchDistricts(
              states.find((item) => item.state_name === text).state_refno
            );
          }}
          value={state.state_refno}
          error={error.state_refno}
        />
        <FormInput
          label="City"
          type="dropdown"
          data={districts.map((obj) => obj.district_name)}
          onChangeText={(text) => {
            setState((state) => ({
              ...state,
              district_refno: text,
            }));

            setError((state) => ({
              ...state,
              district_refno: false,
            }));
          }}
          value={state.district_refno}
          error={error.district_refno}
        />
        <FormInput
          label="Pincode"
          onChangeText={(text) => {
            setState((state) => ({
              ...state,
              pincode: text,
            }));

            setError((state) => ({
              ...state,
              pincode: false,
            }));
          }}
          error={error.pincode}
          value={state.pincode}
          keyboardType="numeric"
        />
        <FormInput
          label="Display"
          type="check-box"
          onChangeText={(text) => {
            setState((state) => ({
              ...state,
              view_status: state.view_status === "0" ? "1" : "0",
            }));
          }}
          value={state.view_status}
        />

        <Button
          onPress={handleSubmit}
          mode="contained"
          style={{ width: "40%", alignSelf: "center" }}
        >
          Submit
        </Button>
      </View>
    </ScrollView>
  );
};

export default EmployeeCustomerForm;
