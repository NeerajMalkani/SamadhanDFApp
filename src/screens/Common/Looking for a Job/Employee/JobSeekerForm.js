import { View, LogBox, ScrollView, Text } from "react-native";
import { Styles } from "../../../../styles/styles";
import { TextInput, Button, HelperText, Snackbar } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { PaperSelect } from "react-native-paper-select";
import Dropdown from "../../../../components/Dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Provider from "../../../../api/Provider";
import { theme } from "../../../../theme/apptheme";
import { useIsFocused } from "@react-navigation/native";
import * as DocumentPicker from "expo-document-picker";
let userID = null;
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "Material-UI: The `css` function is deprecated. Use the `styleFunctionSx` instead",
  "source.uri should not be an empty string",
]);

const JobSeekerForm = ({ route, navigation }) => {
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
    expected_salary: "",
    subscription_fees: "",
  });
  const [errors, setErrors] = useState({
    designation_refno: false,
    state_refno: false,
    district_refno: false,
    experience_year: false,
    experience_month: false,
    expected_salary: false,
    subscription_fees: false,
    resume: false,
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

  const pickDocument = async () => {
    setErrors((state) => ({ ...state, resume: false }));
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
      });

      setResume(result);
    } catch (error) {
      console.log(error);
    }
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
    if (state.expected_salary === "") {
      error = true;
      setErrors((state) => ({ ...state, expected_salary: true }));
    }
    if (state.subscription_fees === "") {
      error = true;
      setErrors((state) => ({ ...state, subscription_fees: true }));
    }
    if (state.state_refno.length < 1) {
      error = true;
      setErrors((state) => ({ ...state, state_refno: true }));
    }
    if (state.district_refno.length < 1) {
      error = true;
      setErrors((state) => ({ ...state, district_refno: true }));
    }

    if (!resume) {
      error = true;
      setErrors((state) => ({ ...state, resume: true }));
    }

    if (error) {
      setSnackbar(true);
      setSnackbarText("Please fill all the fields");
      setSnackbarType(theme.colors.error);
    } else {
      const formdata = new FormData();

      formdata.append(
        "data",
{
          ...state,
          designation_refno:designations.find(item=>item.designation_name===state.designation_refno).designation_refno,
          state_refno: 
            state.state_refno.map(
              (obj) =>
                states.find((item) => item.state_name === obj).state_refno
            )
          ,
          district_refno: 
            state.district_refno.map((obj) => obj._id)
          ,
          Sess_UserRefno: userID,
          employergroup_refno: route.params.employergroup.employergroup_refno,
        }
      );
      formdata.append("employee_resume", {
        name: resume.name.split("/").pop(),
        type: "multipart/form-data" ,
        uri:
        
        "file:///" + resume.uri.split("file:/").join("")
          
      });

      Provider.createDFCommonWithHeader(
        Provider.API_URLS.employee_job_apply,
        formdata
      )
        .then((response) => {
          if (response.data.data) {
            setSnackbar(true);
            setSnackbarText("Applied Successfully");
            setSnackbarType(theme.colors.greenBorder);
            navigation.navigate("HomeScreen");
          }
        })
        .catch((e) => {
          console.log(e);
          setSnackbar(true);
          setSnackbarText("Something Went Wrong");
          setSnackbarType(theme.colors.error);
        });
    }
  };
  useEffect(() => {
    if (isFocused) GetUserID();
  }, [isFocused]);
  const fetchState = () => {
    Provider.createDFCommon(Provider.API_URLS.GetStateDetails)
      .then((res) => {
        if (res.data.data) setStates(res.data.data);
      })
      .catch((error) => console.log(error));
  };
  const fetchDistricts = (state_refno) => {
    Provider.createDFCommon(
      Provider.API_URLS.GetDistrictDetailsByStateRefno,
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
          <TextInput
            mode="flat"
            label="Job Seeking From"
            disabled={true}
            value={route.params.employergroup.employergroup_name}
            returnKeyType="next"
            style={{ backgroundColor: "white" }}
          />
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
            label="Expected Salary"
            returnKeyType="next"
            onChangeText={(e) => onChange(e, "expected_salary")}
            value={state.expected_salary}
            error={errors.expected_salary}
            keyboardType="numeric"
            style={{ backgroundColor: "white" }}
          />
          <HelperText type="error" visible={errors.expected_salary}>
            Please enter expected salary
          </HelperText>
          <TextInput
            mode="flat"
            label="Subscription Fees"
            onChangeText={(e) => onChange(e, "subscription_fees")}
            value={state.subscription_fees}
            error={errors.subscription_fees}
            returnKeyType="next"
            keyboardType="numeric"
            style={{ backgroundColor: "white" }}
          />
          <HelperText
            type="error"
            visible={errors.subscription_fees}
            style={{ marginBottom: 24 }}
          >
            Please enter subscription fees
          </HelperText>
          <View>
            <Button mode="text" onPress={pickDocument}>
              Resume / CV
            </Button>
            {resume ? <Text>{resume.name}</Text> : null}
            <HelperText type="error" visible={errors.resume}></HelperText>
          </View>
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

export default JobSeekerForm;
