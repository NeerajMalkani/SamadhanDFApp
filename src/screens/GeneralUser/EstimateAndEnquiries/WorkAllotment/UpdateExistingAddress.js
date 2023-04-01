import React, { useEffect, useState, useRef } from "react";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import { ScrollView, View } from "react-native";
import { Styles } from "../../../../styles/styles";
import Dropdown from "../../../../components/Dropdown";
import Provider from "../../../../api/Provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment/moment";
import {
  Button,
  Card,
  HelperText,
  Snackbar,
  TextInput,
} from "react-native-paper";
import { communication } from "../../../../utils/communication";
import { theme } from "../../../../theme/apptheme";

let Sess_UserRefno = 0;
let Sess_group_refno = 0;

function UpdateExistingAddress({ route, navigation }) {
  const [fullData, setFullData] = useState({
    state: [],
    district: [],
  });
  const [data, setData] = useState({
    company_name:
      route.params.type === "edit" ? route.params?.data.company_name : "",
    contact_person:
      route.params.type === "edit" ? route.params?.data.contact_person : "",
    contact_person_mobile_no:
      route.params.type === "edit"
        ? route.params?.data.contact_person_mobile_no
        : "",
    address: route.params.type === "edit" ? route.params?.data.address : "",
    state_name: "",
    district_name: "",
    pincode: route.params.type === "edit" ? route.params?.data.pincode : "",
  });

  const [error, setError] = useState({
    company_name: false,
    contact_person: false,
    contact_person_mobile_no: false,
    address: false,
    state_name: false,
    district_name: false,
    pincode: false,
  });

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const ref_input2 = useRef();
  const ref_input3 = useRef();

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const ValidateData = () => {
    let isValid = true;
    if (data.company_name.length === 0) {
      setError((prev) => {
        return {
          ...prev,
          company_name: true,
        };
      });
      isValid = false;
    }
    if (data.contact_person.length === 0) {
      setError((prev) => {
        return {
          ...prev,
          contact_person: true,
        };
      });
      isValid = false;
    }
    if (data.contact_person_mobile_no.length === 0) {
      setError((prev) => {
        return {
          ...prev,
          contact_person_mobile_no: true,
        };
      });
      isValid = false;
    }
    if (data.address.length === 0) {
      setError((prev) => {
        return {
          ...prev,
          address: true,
        };
      });
      isValid = false;
    }
    if (data.state_name.length === 0) {
      setError((prev) => {
        return {
          ...prev,
          state_name: true,
        };
      });
      isValid = false;
    }
    if (data.district_name.length === 0) {
      setError((prev) => {
        return {
          ...prev,
          district_name: true,
        };
      });
      isValid = false;
    }
    if (data.pincode.length === 0) {
      setError((prev) => {
        return {
          ...prev,
          pincode: true,
        };
      });
      isValid = false;
    }
    if (isValid) {
      setIsButtonLoading(true);
      update();
    }
  };

  const update = () => {
    if (route.params.type === "edit") {
      const params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          Sess_group_refno: Sess_group_refno,
          useraddress_refno: route.params?.data.useraddress_refno,
          company_name: data.company_name,
          contact_person: data.contact_person,
          contact_person_mobile_no: data.contact_person_mobile_no,
          address: data.address,
          state_refno: fullData.state.find(
            (item) => item.state_name === data.state_name
          )?.state_refno,
          district_refno: fullData.district.find(
            (item) => item.district_name === data.district_name
          )?.district_refno,
          pincode: data.pincode,
        },
      };
      Provider.createDFCommon(Provider.API_URLS.deliveryaddress_update, params)
        .then((response) => {
          console.log(response.data);
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
          console.log(e);
          setSnackbarText(communication.NetworkError);
          setSnackbarVisible(true);
        })
        .finally(() => setIsButtonLoading(false));
    } else {
      const params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          Sess_group_refno: Sess_group_refno,
          company_name: data.company_name,
          contact_person: data.contact_person,
          contact_person_mobile_no: data.contact_person_mobile_no,
          address: data.address,
          state_refno: fullData.state.find(
            (item) => item.state_name === data.state_name
          )?.state_refno,
          district_refno: fullData.district.find(
            (item) => item.district_name === data.district_name
          )?.district_refno,
          pincode: data.pincode,
        },
      };
      Provider.createDFCommon(Provider.API_URLS.newdeliveryaddress_add, params)
        .then((response) => {
          console.log(response.data);
          if (response.data && response.data.data.Created == 1) {
            route.params.fetchData("add");
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
    }
  };

  const FetchStates = () => {
    Provider.createDFCommon(Provider.API_URLS.GetStateDetails)
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            console.log("states", response.data.data[0]);
            setFullData((prev) => {
              return {
                ...prev,
                state: response.data.data,
              };
            });
            if (route.params.type == "edit") {
              setData((prev) => {
                return {
                  ...prev,
                  state_name:
                    route.params.type === "edit"
                      ? route.params?.data?.state_name
                      : "",
                };
              });
            }
          }
        }
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    console.log(data.state_name);
    if (data.state_name !== "") {
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          state_refno: fullData.state.find(
            (item) => item.state_name === data.state_name
          )?.state_refno,
        },
      };
      Provider.createDFCommon(
        Provider.API_URLS.GetDistrictDetailsByStateRefno,
        params
      )
        .then((response) => {
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              console.log("districts", response.data.data[0]);
              setFullData((prev) => {
                return {
                  ...prev,
                  district: response.data.data,
                };
              });
              if (route.params.type == "edit") {
                let x = response.data.data.find(
                  (item) =>
                    item.district_name === route.params?.data?.district_name
                );
                setData((prev) => {
                  return {
                    ...prev,
                    district_name: x ? x.district_name : "",
                  };
                });
              }
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [data.state_name]);

  const GetUserID = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData !== null) {
        Sess_UserRefno = JSON.parse(userData).UserID;
        Sess_group_refno = JSON.parse(userData).Sess_group_refno;
        FetchStates();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    GetUserID();
  }, []);

  const EditText = (name, text) => {
    setData((prev) => {
      return { ...prev, [name]: text };
    });
    setError((prev) => {
      return {
        ...prev,
        [name]: false,
      };
    });
  };
  return (
    <View style={[Styles.flex1]}>
      <ScrollView
        style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[Styles.padding16]}>
          <TextInput
           mode="outlined"
            label="Name / Company Name"
            name="company_name"
            value={data.company_name}
            returnKeyType="next"
            onChangeText={(text) => {
              EditText("company_name", text);
            }}
            style={[{ backgroundColor: "white" }]}
            error={error.company_name}
          />
          <HelperText type="error" visible={error.company_name}>
            {communication.InvalidCompanyName}
          </HelperText>

          <TextInput
           mode="outlined"
            label="Contact Person"
            name="contact_person"
            value={data.contact_person}
            returnKeyType="next"
            onChangeText={(text) => {
              EditText("contact_person", text);
            }}
            style={[{ backgroundColor: "white" }]}
            error={error.contact_person}
          />
          <HelperText type="error" visible={error.contact_person}>
            {communication.InvalidContactPerson}
          </HelperText>

          <TextInput
            mode="outlined"
            keyboardType={"number-pad"}
            label="Contact Mobile No."
            name="contact_person_mobile_no"
            value={data.contact_person_mobile_no}
            returnKeyType="next"
            onChangeText={(text) => {
              EditText("contact_person_mobile_no", text);
            }}
            style={[{ backgroundColor: "white" }]}
            error={error.contact_person_mobile_no}
          />
          <HelperText type="error" visible={error.contact_person_mobile_no}>
            {communication.InvalidContactMobileNo}
          </HelperText>

          <TextInput
            mode="outlined"
            label="Address 1"
            name="address"
            value={data.address}
            returnKeyType="next"
            onChangeText={(text) => {
              EditText("address", text);
            }}
            style={[{ backgroundColor: "white" }]}
            error={error.address}
          />
          <HelperText type="error" visible={error.address}>
            {communication.InvalidAddress}
          </HelperText>

          <Dropdown
            label="State"
            data={fullData.state.map((item) => item.state_name)}
            onSelected={(selectedItem) => {
              if (selectedItem !== data.state_name) {
                setData((prev) => {
                  return { ...prev, state_name: selectedItem };
                });
                setError((prev) => {
                  return {
                    ...prev,
                    state_name: false,
                    district_name: false,
                  };
                });
                setFullData((prev) => {
                  return {
                    ...prev,
                    district: [],
                  };
                });
              }
            }}
            isError={error.state_name}
            selectedItem={data.state_name}
            style={[Styles.paddingTop16]}
          />
          <HelperText type="error" visible={error.state_name}>
            {communication.InvalidState}
          </HelperText>

          <Dropdown
            label="City"
            data={fullData.district.map((item) => item.district_name)}
            onSelected={(selectedItem) => {
              if (selectedItem !== data.district_name) {
                setData((prev) => {
                  return { ...prev, district_name: selectedItem };
                });
                setError((prev) => {
                  return {
                    ...prev,
                    district_name: false,
                  };
                });
              }
            }}
            isError={error.district_name}
            selectedItem={data.district_name}
            style={[Styles.paddingTop16]}
          />
          <HelperText type="error" visible={error.district_name}>
            {communication.InvalidCity}
          </HelperText>

          <TextInput
            mode="outlined"
            label="Pincode"
            name="pincode"
            value={data.pincode}
            returnKeyType="next"
            onChangeText={(text) => {
              EditText("pincode", text);
            }}
            style={[{ backgroundColor: "white" }]}
            error={error.pincode}
          />
          <HelperText type="error" visible={error.pincode}>
            {communication.InvalidAddress}
          </HelperText>
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
            mode="contained"
            disabled={isButtonLoading}
            onPress={ValidateData}
          >
            {route.params.type === "edit" ? "Save" : "Add"}
          </Button>
        </Card.Content>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.error }}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
}

export default UpdateExistingAddress;
