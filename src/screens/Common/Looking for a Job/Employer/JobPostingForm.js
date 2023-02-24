import { View, LogBox, ScrollView, Text } from "react-native";
import { Styles } from "../../../../styles/styles";
import {
  TextInput,
  Button,
  HelperText,
  Snackbar,
  Checkbox,
} from "react-native-paper";
import React, { useState, useEffect } from "react";
import { PaperSelect } from "react-native-paper-select";
import Dropdown from "../../../../components/Dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Provider from "../../../../api/Provider";
import { theme } from "../../../../theme/apptheme";
import { useIsFocused } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
let userID = null;
let user = null;
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "Material-UI: The `css` function is deprecated. Use the `styleFunctionSx` instead",
  "source.uri should not be an empty string",
]);

const JobPostingForm = ({ navigation }) => {
  const [snackbar, setSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState("info");
  const [snackbarText, setSnackbarText] = useState("");
  const isFocused = useIsFocused();
  const [resume, setResume] = useState(null);
  const [currentState, setCurrentState] = useState("");
  const [state, setState] = useState({
    designation_refno: "",
    state_refno: [],
    district_refno: [],
    experience_year: "",
    experience_month: "",
    ctc_salary: "",
    job_skills: "",
    job_responsibility: "",
    notes: "",
  });
  const [errors, setErrors] = useState({
    designation_refno: false,
    state_refno: false,
    district_refno: false,
    experience_year: false,
    experience_month: false,
    ctc_salary: false,
    job_skills: false,
    job_responsibility: false,
    notes: false,
  });

  const [designations, setDesignations] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const onChange = (text, name) => {
    if (name === "state_refno") {
      setState((state) => ({
        ...state,
        state_refno:
          state.state_refno.length === 0
            ? [text]
            : [...state.state_refno, text],
      }));

      return setErrors((state) => ({ ...state, [name]: false }));
    }
    setState((state) => ({ ...state, [name]: text }));
    setErrors((state) => ({ ...state, [name]: false }));
  };

  const onSubmit = () => {
    let error = false;
    if (state.designation_refno === "") {
      error = true;
      setErrors((state) => ({ ...state, designation_refno: true }));
    }
    if (state.experience_month === "") {
      error = true;
      setErrors((state) => ({ ...state, experience_month: true }));
    }
    if (state.experience_year === "") {
      error = true;
      setErrors((state) => ({ ...state, experience_year: true }));
    }
    if (state.ctc_salary === "") {
      error = true;
      setErrors((state) => ({ ...state, ctc_salary: true }));
    }
    if (state.job_responsibility === "") {
      error = true;
      setErrors((state) => ({ ...state, job_responsibility: true }));
    }
    if (state.job_skills === "") {
      error = true;
      setErrors((state) => ({ ...state, job_skills: true }));
    }
    if (state.notes === "") {
      error = true;
      setErrors((state) => ({ ...state, notes: true }));
    }
    if (state.state_refno.length < 1) {
      error = true;
      setErrors((state) => ({ ...state, state_refno: true }));
    }
    if (state.district_refno.length < 1) {
      error = true;
      setErrors((state) => ({ ...state, district_refno: true }));
    }

    if (error) {
      setSnackbar(true);
      setSnackbarText("Please fill all the fields");
      setSnackbarType(theme.colors.error);
    } else {
      const params = {
        data: {
          ...state,
          state_refno: JSON.stringify(
            state.state_refno.map(
              (obj) =>
                states.find((item) => item.state_name === obj).state_refno
            )
          ),
          district_refno: JSON.stringify(
            state.district_refno.map((obj) => obj._id)
          ),
          Sess_UserRefno: userID,
          Sess_company_refno: user.Sess_company_refno,
          Sess_branch_refno: user.Sess_branch_refno,
          Sess_group_refno: user.Sess_group_refno,
        },
      };

      Provider.createDFCommon(Provider.API_URLS.employer_post_newjob, params)
        .then((res) => {
          if (res.data.data) {
            setSnackbar(true);
            setSnackbarType(theme.colors.greenBorder);
            setSnackbarText("Form filled Successfully");
            navigation.navigate("HomeScreen");
          } else {
            throw res.data;
          }
        })
        .catch((error) => {
          console.log(error);
          setSnackbar(true);
          setSnackbarType(theme.colors.error);
          setSnackbarText("something went wrong");
        });
    }
  };
  useEffect(() => {
    if (isFocused) GetUserID();
  }, [isFocused]);
  const fetchState = () => {
    Provider.createDFCommon(Provider.API_URLS.getstatedetails)
      .then((res) => {
        if (res.data.data) setStates(res.data.data);
      })
      .catch((error) => console.log(error));
  };
  const fetchDistricts = (state_refno) => {
    Provider.createDFCommon(
      Provider.API_URLS.getdistrictdetails_by_state_refno,
      {
        data: {
          Sess_UserRefno: userID,
          state_refno,
        },
      }
    )
      .then((res) => {
        if (res.data.data) setDistricts(res.data.data);
      })
      .catch((error) => console.log(error));
  };
  const GetUserID = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData !== null) {
        userID = JSON.parse(userData).UserID;
        user = JSON.parse(userData);
        fetchState();
        fetchDesignation();
      } else {
        navigation.navigate("LoginScreen");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDesignation = () => {
    Provider.createDFCommon(Provider.API_URLS.getdesignationname_employeeform, {
      data: {
        Sess_UserRefno: userID,
        designation_refno: "all",
      },
    })
      .then((res) => setDesignations(res.data.data))
      .catch((error) => console.log(error));
  };
  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <ScrollView style={[Styles.flex1]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <Dropdown
            data={designations.map((obj) => obj.designation_name)}
            selectedItem={state.designation_refno}
            value={state.designation_refno}
            isError={errors.designation_refno}
            label="Designation Name"
            onSelected={(e) => onChange(e, "designation_refno")}
          />
          <HelperText type="error" visible={errors.designation_refno}>
            Please Select a designation
          </HelperText>
          <Dropdown
            data={states.map((obj) => obj.state_name)}
            selectedItem={currentState}
            value={currentState}
            isError={errors.state_refno}
            label="State"
            onSelected={(e) => {
              setCurrentState(e);
              onChange(e, "state_refno");
              fetchDistricts(
                states.find((item) => item.state_name === e).state_refno
              );
            }}
          />
          <HelperText type="error" visible={errors.state_refno}>
            Please select states
          </HelperText>
          <PaperSelect
            multiEnable={true}
            label="Cities"
            textInputMode="flat"
            underlineColor={
              errors.district_refno ? theme.colors.error : "black"
            }
            errorStyle={{ color: theme.colors.error }}
            value={state.district_refno?.map((item) => item.value).join(",")}
            arrayList={districts?.map((obj) => {
              return { _id: obj.district_refno, value: obj.district_name };
            })}
            selectAllEnable={false}
            selectedItem={state.district_refno}
            selectedArrayList={state.district_refno}
            hideSearchBox={true}
            errorText={errors.district_refno ? "Please Select cities" : ""}
            onSelection={(e) => {
              onChange(
                [...new Set([...e.selectedList, ...state.district_refno])],
                "district_refno"
              );
            }}
          />
          <HelperText type="error" visible={errors.district_refno}>
            Please select cities
          </HelperText>
          <View style={[Styles.width100per, Styles.flexRow]}>
            <View style={[Styles.width50per]}>
              <Dropdown
                data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                selectedItem={state.experience_year}
                value={state.experience_year}
                isError={errors.experience_year}
                label="Experience (Years)"
                onSelected={(e) => onChange(e, "experience_year")}
              />
              <HelperText type="error" visible={errors.experience_year}>
                Please select experience in years
              </HelperText>
            </View>
            <View style={[Styles.width50per]}>
              <Dropdown
                data={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
                selectedItem={state.experience_month}
                value={state.experience_month}
                isError={errors.experience_month}
                label="Experience (Months)"
                onSelected={(e) => onChange(e, "experience_month")}
              />
              <HelperText type="error" visible={errors.experience_month}>
                Please select experience in months
              </HelperText>
            </View>
          </View>
          <TextInput
            mode="flat"
            label="CTC details"
            returnKeyType="next"
            onChangeText={(e) => onChange(e, "ctc_salary")}
            value={state.ctc_salary}
            error={errors.ctc_salary}
            keyboardType="numeric"
            style={{ backgroundColor: "white" }}
          />
          <HelperText type="error" visible={errors.ctc_salary}>
            Please enter ctc salary
          </HelperText>
          <TextInput
            mode="flat"
            multiline={true}
            label="Job Skills"
            onChangeText={(e) => onChange(e, "job_skills")}
            value={state.job_skills}
            error={errors.job_skills}
            returnKeyType="next"
            style={{ backgroundColor: "white" }}
          />
          <HelperText
            type="error"
            visible={errors.job_skills}
            style={{ marginBottom: 24 }}
          >
            Please enter job skills
          </HelperText>
          <TextInput
            mode="flat"
            label="Job Responsibility"
            onChangeText={(e) => onChange(e, "job_responsibility")}
            value={state.job_responsibility}
            error={errors.job_responsibility}
            returnKeyType="next"
            style={{ backgroundColor: "white" }}
          />
          <HelperText
            type="error"
            visible={errors.job_responsibility}
            style={{ marginBottom: 24 }}
          >
            Please enter job responsibility
          </HelperText>
          <TextInput
            mode="flat"
            label="Notes"
            onChangeText={(e) => onChange(e, "notes")}
            value={state.notes}
            error={errors.notes}
            returnKeyType="next"
            style={{ backgroundColor: "white" }}
          />
          <HelperText
            type="error"
            visible={errors.notes}
            style={{ marginBottom: 24 }}
          >
            Please enter notes
          </HelperText>
          <Button mode="contained" onPress={onSubmit} style={{ marginTop: 25 }}>
            Submit
          </Button>
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbar}
        onDismiss={() => setSnackbar(false)}
        duration={3000}
        style={{ backgroundColor: snackbarType }}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default JobPostingForm;
