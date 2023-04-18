import { View, Text } from "react-native";
import React from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Styles } from "../../../../styles/styles";
import { useState } from "react";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Provider from "../../../../api/Provider";
import { useIsFocused } from "@react-navigation/core";
import { useEffect } from "react";
import { Button, RadioButton, Subheading } from "react-native-paper";
import Dropdown from "../../../../components/Dropdown";
import FormInput from "../common/Input";
import { createIconSetFromFontello } from "react-native-vector-icons";

const DailyActivityForm = () => {
  const [entryType, setEntryType] = useState([]);
  const [companyName, setCompanyName] = useState([]);
  const [companyPerson, setCompanyPerson] = useState([]);
  const [activityType, setActivityType] = useState([]);
  const [activityStatus, setActivityStatus] = useState([]);
  const [nextVisitNo, setNextVisitNo] = useState([]);
  const [daysMonthsRefNo, setDaysMonthsRefNo] = useState([]);
  const [helpPerson, setHelpPerson] = useState([]);
  const [referenceRef, setReferenceRef] = useState([]);
  const [marketingExecName, setMarketingExecName] = useState([]);

  const isFocused = useIsFocused();

  const [state, setState] = useState({
    activity_date: new Date(),
    activity_entry_type: "",
    refer_user_refno: "",
    mycustomer_refno: "",
    mycustomer_detail_refno: "",
    contact_person: "",
    designation: "",
    mobile_no: "",
    phone_no: "",
    email_id: "",
    location_name: "",
    activity_refno: "",
    activity_status: "",
    next_visit_no: "",
    daysmonths_refno: "",
    reference_refno: "", //to get
    from_location: "",
    to_location: "",
    total_kms: "",
    help_employee_user_refno: "",
    remarks: "",
    view_status: "",
  });

  const [userRefno, setUserRefno] = React.useState(0);
  const [companyRefno, setCompanyRefno] = React.useState(0);
  const [branchRefno, setBranchRefno] = React.useState(0);
  const [groupRefno, setGroupRefno] = React.useState(0);
  const [companyAdminRefno, setCompanyAdminRefno] = React.useState(0);

  //

  const fetchEntryType = async () => {
    await Provider.createDFEmployee(
      Provider.API_URLS.get_entrytype_employeeactivityform,
      {
        data: {
          Sess_UserRefno: userRefno,
          Sess_CompanyAdmin_UserRefno: companyAdminRefno,
        },
      }
    ).then((res) => setEntryType(res.data?.data));
  };

  const fetchMarketingExecutiveName = async () => {};

  const fetchOtherompanyName = async () => {
    await Provider.createDFEmployee(
      Provider.API_URLS.get_othercustomer_companyname_employeeactivityform,
      {
        data: {
          Sess_UserRefno: userRefno,
          Sess_company_refno: companyRefno,
          refer_user_refno: "0", // to fix
        },
      }
    ).then((res) => setCompanyName(res.data?.data));
  };

  const fetchMyCompanyName = async () => {
    await Provider.createDFEmployee(
      Provider.API_URLS.get_mycustomer_companyname_employeeactivityform,
      {
        data: {
          Sess_UserRefno: userRefno,
          Sess_company_refno: companyRefno,
          activity_entry_type: "1",
        },
      }
    ).then((res) => setCompanyName(res.data?.data));
  };

  const fetchCompanyPerson = async (companyId) => {
    if (companyId) {
      await Provider.createDFEmployee(
        Provider.API_URLS.get_contactpersonname_employeeactivityform,
        {
          data: {
            Sess_UserRefno: userRefno,
            Sess_company_refno: companyRefno,
            mycustomer_refno: companyId,
          },
        }
      ).then((res) => setCompanyPerson(res?.data?.data));
    }
  };

  const fetchActivityType = async () => {
    await Provider.createDFEmployee(
      Provider.API_URLS.get_activitytype_employeeactivityform,
      {
        data: {
          Sess_UserRefno: userRefno,
          Sess_company_refno: companyRefno,
        },
      }
    ).then((res) => setActivityType(res.data?.data));
  };

  const fetchActivityStatus = async () => {
    await Provider.createDFEmployee(
      Provider.API_URLS.get_activitystatus_employeeactivityform,
      {
        data: {
          Sess_UserRefno: userRefno,
          Sess_company_refno: companyRefno,
        },
      }
    ).then((res) => setActivityStatus(res.data?.data));
  };

  const fetchNextVisitNo = async () => {
    await Provider.createDFEmployee(
      Provider.API_URLS.get_nextvisitno_employeeactivityform,
      {
        data: {
          Sess_UserRefno: userRefno,
          Sess_company_refno: companyRefno,
        },
      }
    ).then((res) => setNextVisitNo(res.data?.data));
  };

  const fetchReferenceRef = async () => {
    await Provider.createDFEmployee(
      Provider.API_URLS.get_referencerefno_employeeactivityform,
      {
        data: {
          Sess_UserRefno: userRefno,
          Sess_company_refno: companyRefno,
        },
      }
    ).then((res) => setReferenceRef(res.data?.data));
  };

  const fetchDaysMonthsRefNo = async () => {
    await Provider.createDFEmployee(
      Provider.API_URLS.get_daysmonthsrefno_employeeactivityform,
      {
        data: {
          Sess_UserRefno: userRefno,
          Sess_company_refno: companyRefno,
        },
      }
    ).then((res) => setDaysMonthsRefNo(res.data?.data));
  };

  const fetchHelpPerson = async () => {
    await Provider.createDFEmployee(
      Provider.API_URLS.get_helpperson_employeeactivityform,
      {
        data: {
          Sess_UserRefno: userRefno,
          Sess_company_refno: companyRefno,
        },
      }
    ).then((res) => setHelpPerson(res.data?.data));
  };

  const fetchMarketingExecName = async () => {
    await Provider.createDFEmployee(
      Provider.API_URLS.get_marketingexecutivename_employeeactivityform,
      {
        data: {
          Sess_UserRefno: userRefno,
          Sess_company_refno: companyRefno,
          Sess_branch_refno: branchRefno,
          activity_entry_type: "2",
        },
      }
    ).then((res) => setMarketingExecName(res.data?.data));
  };
  //   const fetchCompanyPersonName = async () => {
  //     await Provider.createDFEmployee(
  //       Provider.API_URLS.get_entrytype_employeeactivityform,
  //       {
  //         data: {
  //           Sess_UserRefno:userRefno,
  //           Sess_company_refno:companyRefno,
  //           mycustomer_refno: "0",
  //         },
  //       }
  //     ).then((res) => setCompanyPerson(res.data?.data));
  //   };
  //   const fetchCompanyPersonName = async () => {
  //     await Provider.createDFEmployee(
  //       Provider.API_URLS.get_entrytype_employeeactivityform,
  //       {
  //         data: {
  //           Sess_UserRefno:userRefno,
  //           Sess_company_refno:companyRefno,
  //           mycustomer_refno: "0",
  //         },
  //       }
  //     ).then((res) => setCompanyPerson(res.data?.data));
  //   };

  const handleSubmit = async () => {
    await Provider.createDFEmployee(Provider.API_URLS.employeeactivity_create, {
      data: {
        Sess_UserRefno: userRefno,
        Sess_company_refno: companyRefno,
        Sess_branch_refno: branchRefno,
        ...state,
      },
    })
      .then((res) => console.log(res))
      .catch(console.log);
  };
  const fetchUser = async () => {
    const data = JSON.parse(await AsyncStorage.getItem("user"));
    setUserRefno(data.UserID);
    setCompanyRefno(data.Sess_company_refno);
    setBranchRefno(data.Sess_branch_refno);
    setGroupRefno(data.Sess_group_refno);
    setCompanyAdminRefno(data.Sess_CompanyAdmin_UserRefno);

    console.log("--------");
    await fetchEntryType();
    console.log("--------");

    console.log("--------");

    await fetchMyCompanyName();
    // yfjcvl
    console.log("--------");

    await fetchActivityType();
    console.log("--------");

    await fetchActivityStatus();
    console.log("--------");

    await fetchNextVisitNo();
    console.log("--------");

    await fetchDaysMonthsRefNo();
    console.log("--------");

    await fetchHelpPerson();
    console.log("--------");

    await fetchReferenceRef();
    console.log("--------");

    await fetchMarketingExecName();
    console.log("--------");
  };

  useEffect(() => {
    if (isFocused) {
      fetchUser();
    }
  }, [isFocused]);

  console.log(
    // entryType,

    // companyName,
    companyPerson,
    // activityType,
    // activityStatus,
    // nextVisitNo,
    // daysMonthsRefNo,
    // helpPerson,
    // referenceRef,
    state,
    // "state"
    // userRefno,
    "urn"
  );
  //

  return (
    <ScrollView>
      <View style={[Styles.flex1, Styles.padding16, { background: "#fff" }]}>
        <Text>DailyActivityForm</Text>
        <DateTimePicker
          style={Styles.backgroundColorWhite}
          label="Activity Date"
          type="date"
          value={state?.activity_date}
          onChangeDate={(date) => setState({ ...state, activity_date: date })}
        />

        <Subheading style={[Styles.marginBottom12]}>
          Activity Entry Type
        </Subheading>
        <RadioButton.Group
          onValueChange={(value) => {
            setState({ ...state, activity_entry_type: value });
          }}
          value={state.activity_entry_type}
        >
          {entryType?.map((item, idx) => (
            <RadioButton.Item
              key={idx}
              position="leading"
              style={[Styles.paddingVertical2]}
              labelStyle={[Styles.textLeft, Styles.paddingStart4]}
              label={item.activity_entry_type_name}
              value={item.activity_entry_type}
            />
          ))}
        </RadioButton.Group>

        {state.activity_entry_type === 1 ? (
          <>
            <FormInput
              label="Company Name"
              type="dropdown"
              data={companyName?.map(({ company_name }) => company_name)}
              onChangeText={(text) => {
                fetchCompanyPerson(
                  companyName.find((item) => item.company_name === text)
                    .mycustomer_refno
                );
                setState((state) => ({
                  ...state,
                  company_name: text,
                }));
              }}
              value={state.company_name}
              // error={error.district_refno}
            />

            <FormInput
              label="Contact Person"
              type="dropdown"
              data={companyPerson.map(({ contact_person }) => contact_person)}
              onChangeText={(text) => {
                const currPerson = companyPerson.find(
                  (item) => item.contact_person === text
                );

                setState((state) => ({
                  ...state,
                  designation: currPerson?.designation,
                  mobile_no: currPerson?.mobile_no,
                  mycustomer_detail_refno: currPerson?.mycustomer_detail_refno,
                  contact_person: text,
                }));
              }}
              value={state.contact_person}
              // error={error.district_refno}
            />
            <FormInput
              label="Visit Location Name"
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  location_name: text,
                }));

                // setError((state) => ({
                //   ...state,
                //   company_name: false,
                // }));
              }}
              // error={error.company_name}
              value={state.location_name}
            />
            <FormInput
              label="Activity Type"
              type="dropdown"
              data={activityType?.map((obj) => obj.activity_name)}
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  activity_refno: text,
                }));

                // setError((state) => ({
                //   ...state,
                //   district_refno: false,
                // }));
              }}
              value={state.activity_refno}
              // error={error.district_refno}
            />
            <Subheading style={[Styles.marginBottom12]}>
              Activity Status
            </Subheading>
            <RadioButton.Group
              onValueChange={(value) => {
                setState({ ...state, activity_status: value });
                // setErrorCAT(false);
              }}
              value={state.activity_status}
            >
              {activityStatus?.map((item, idx) => (
                <RadioButton.Item
                  key={idx}
                  position="leading"
                  style={[Styles.paddingVertical2]}
                  labelStyle={[Styles.textLeft, Styles.paddingStart4]}
                  label={item.activity_status_name}
                  value={item.activity_status}
                />
              ))}
            </RadioButton.Group>

            <FormInput
              label="Reference Ref"
              type="dropdown"
              data={referenceRef?.map((obj) => obj.reference_name)}
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  reference_refno: text,
                }));
              }}
              value={state.reference_refno}
              // error={error.district_refno}
            />

            <FormInput
              label="Next Visit No"
              type="dropdown"
              data={nextVisitNo?.map((obj) => obj.next_visit_no_name)}
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  next_visit_no: text,
                }));

                // setError((state) => ({
                //   ...state,
                //   district_refno: false,
                // }));
              }}
              value={state.next_visit_no}
              // error={error.district_refno}
            />
            <FormInput
              label="Days/Month/Year (Next Visit No)"
              type="dropdown"
              data={daysMonthsRefNo?.map((obj) => obj.daysmonths_name)}
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  daysmonths_refno: text,
                }));

                // setError((state) => ({
                //   ...state,
                //   district_refno: false,
                // }));
              }}
              value={state.daysmonths_refno}
              // error={error.district_refno}
            />
            <FormInput
              label="Location From"
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  from_location: text,
                }));

                // setError((state) => ({
                //   ...state,
                //   company_name: false,
                // }));
              }}
              // error={error.company_name}
              value={state.from_location}
            />
            <FormInput
              label="Location To"
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  to_location: text,
                }));

                // setError((state) => ({
                //   ...state,
                //   company_name: false,
                // }));
              }}
              // error={error.company_name}
              value={state.to_location}
            />
            <FormInput
              label="Total KMs"
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  total_kms: text,
                }));

                // setError((state) => ({
                //   ...state,
                //   company_name: false,
                // }));
              }}
              // error={error.company_name}
              value={state.total_kms}
            />
            <FormInput
              label="Help Employee"
              type="dropdown"
              data={helpPerson?.map((obj) => obj.employee_user_name)}
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  help_employee_user_refno: text,
                }));
              }}
              value={state.help_employee_user_refno}
            />
            <FormInput
              label="Remarks"
              type="textarea"
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  remarks: text,
                }));
              }}
              value={state.remarks}
            />
          </>
        ) : (
          <>
            <FormInput
              label="Marketing Exec Name"
              type="dropdown"
              data={helpPerson?.map((obj) => obj.employee_user_name)}
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  help_employee_user_refno: text,
                }));
              }}
              value={state.help_employee_user_refno}
            />
            <FormInput
              label="Company Name"
              type="dropdown"
              data={companyName?.map(({ company_name }) => company_name)}
              onChangeText={(text) => {
                fetchCompanyPerson(
                  companyName.find((item) => item.company_name === text)
                    .mycustomer_refno
                );
                setState((state) => ({
                  ...state,
                  company_name: text,
                }));
              }}
              value={state.company_name}
              // error={error.district_refno}
            />

            <FormInput
              label="Contact Person"
              type="dropdown"
              data={companyPerson.map(({ contact_person }) => contact_person)}
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  contact_person: text,
                }));
              }}
              value={state.contact_person}
              // error={error.district_refno}
            />
            <FormInput
              label="Visit Location Name"
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  location_name: text,
                }));

                // setError((state) => ({
                //   ...state,
                //   company_name: false,
                // }));
              }}
              // error={error.company_name}
              value={state.location_name}
            />
            <FormInput
              label="Activity Type"
              type="dropdown"
              data={activityType?.map((obj) => obj.activity_name)}
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  activity_refno: text,
                }));

                // setError((state) => ({
                //   ...state,
                //   district_refno: false,
                // }));
              }}
              value={state.activity_refno}
              // error={error.district_refno}
            />
            <Subheading style={[Styles.marginBottom12]}>
              Activity Status
            </Subheading>
            <RadioButton.Group
              onValueChange={(value) => {
                setState({ ...state, activity_status: value });
                // setErrorCAT(false);
              }}
              value={state.activity_status}
            >
              {activityStatus?.map((item, idx) => (
                <RadioButton.Item
                  key={idx}
                  position="leading"
                  style={[Styles.paddingVertical2]}
                  labelStyle={[Styles.textLeft, Styles.paddingStart4]}
                  label={item.activity_status_name}
                  value={item.activity_status}
                />
              ))}
            </RadioButton.Group>

            <FormInput
              label="Reference Ref"
              type="dropdown"
              data={referenceRef?.map((obj) => obj.reference_name)}
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  reference_refno: text,
                }));
              }}
              value={state.reference_refno}
              // error={error.district_refno}
            />

            <FormInput
              label="Next Visit No"
              type="dropdown"
              data={nextVisitNo?.map((obj) => obj.next_visit_no_name)}
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  next_visit_no: text,
                }));

                // setError((state) => ({
                //   ...state,
                //   district_refno: false,
                // }));
              }}
              value={state.next_visit_no}
              // error={error.district_refno}
            />
            <FormInput
              label="Days/Month/Year (Next Visit No)"
              type="dropdown"
              data={daysMonthsRefNo?.map((obj) => obj.daysmonths_name)}
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  daysmonths_refno: text,
                }));

                // setError((state) => ({
                //   ...state,
                //   district_refno: false,
                // }));
              }}
              value={state.daysmonths_refno}
              // error={error.district_refno}
            />
            <FormInput
              label="Location From"
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  from_location: text,
                }));

                // setError((state) => ({
                //   ...state,
                //   company_name: false,
                // }));
              }}
              // error={error.company_name}
              value={state.from_location}
            />
            <FormInput
              label="Location To"
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  to_location: text,
                }));

                // setError((state) => ({
                //   ...state,
                //   company_name: false,
                // }));
              }}
              // error={error.company_name}
              value={state.to_location}
            />
            <FormInput
              label="Total KMs"
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  total_kms: text,
                }));

                // setError((state) => ({
                //   ...state,
                //   company_name: false,
                // }));
              }}
              // error={error.company_name}
              value={state.total_kms}
            />
            <FormInput
              label="Help Employee"
              type="dropdown"
              data={helpPerson?.map((obj) => obj.employee_user_name)}
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  help_employee_user_refno: text,
                }));
              }}
              value={state.help_employee_user_refno}
            />
            <FormInput
              label="Remarks"
              type="textarea"
              onChangeText={(text) => {
                setState((state) => ({
                  ...state,
                  remarks: text,
                }));
              }}
              value={state.remarks}
            />
          </>
        )}
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

export default DailyActivityForm;