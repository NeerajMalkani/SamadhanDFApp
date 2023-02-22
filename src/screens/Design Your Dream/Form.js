import { View, Text, ScrollView } from "react-native";
import { Button, TextInput, HelperText, Snackbar } from "react-native-paper";
import React, { useState, useEffect, useRef } from "react";
import { Styles } from "../../styles/styles";
import Dropdown from "../../components/Dropdown";
import Provider from "../../api/Provider";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../../theme/apptheme";
import { PaperSelect } from "react-native-paper-select";
let userID = null;

const Form = ({ route, navigation }) => {
  const isFocused = useIsFocused();
  const [state, setState] = useState({
    service_refno: [],
    propertycategory_refno: "",
    lengthfoot: "",
    lengthinches: "",
    widthheightfoot: "",
    widthheightinches: "",

    contact_name: "",
    contact_mobile_no: "",
    property_address: "",
  });
  const [total, setTotal] = useState("");
  const refs = {
    category: useRef(),
    address: useRef(),
    lengthfeet: useRef(),
    lengthinches: useRef(),
    widhtfeet: useRef(),
    widthinches: useRef(),
    contact_name: useRef(),
    contact_no: useRef(),
  };

  const [errors, setErrors] = useState({
    service_refno: false,
    propertycategory_refno: false,
    lengthfoot: false,
    lengthinches: false,
    widthheightfoot: false,
    widthheightinches: false,
    contact_name: false,
    contact_mobile_no: false,
    property_address: false,
  });
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState("");
  const [lengthInches, setLengthInches] = useState([]);
  const [lengthFeet, setLengthFeet] = useState([]);

  const [widthInches, setWidthInches] = useState([]);
  const [widthFeet, setWidthFeet] = useState([]);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [changed, setChanged] = useState(false);
  const GetUserID = async () => {
    const data = await AsyncStorage.getItem("user");
    if (data) {
      userID = JSON.parse(data).UserID;
      groupID = JSON.parse(data).Sess_group_refno;
      fetchLength();
      fetchWidth();
      fetchServices();
      fetchCategories();
    }
  };
  const onChange = (text, name) => {
    setState((state) => ({ ...state, [name]: text }));
    setErrors((state) => ({ ...state, [name]: false }));
  };

  const onSubmit = () => {
    
    let errors = false;

    if (state.service_refno.length < 1) {
      errors = true;
      setErrors((state) => ({ ...state, service_refno: true }));
    }
    if (state.propertycategory_refno === "") {
      errors = true;
      setErrors((state) => ({ ...state, propertycategory_refno: true }));
    }
    if (state.property_address === "") {
      errors = true;
      setErrors((state) => ({ ...state, property_address: true }));
    }
    if (state.lengthfoot === "") {
      errors = true;
      setErrors((state) => ({ ...state, lengthfoot: true }));
    }
    if (state.lengthinches === "") {
      errors = true;
      setErrors((state) => ({ ...state, lengthinches: true }));
    }
    if (state.widthheightfoot === "") {
      errors = true;
      setErrors((state) => ({ ...state, widthheightfoot: true }));
    }
    if (state.widthheightinches === "") {
      errors = true;
      setErrors((state) => ({ ...state, widthheightinches: true }));
    }
    if (state.contact_name === "") {
      errors = true;
      setErrors((state) => ({ ...state, contact_name: true }));
    }
    if (
      state.contact_mobile_no === "" ||
      state.contact_mobile_no.length !== 10
    ) {
      errors = true;
      setErrors((state) => ({ ...state, contact_mobile_no: true }));
    }
    if (!errors) {
      setIsButtonLoading(true);
      const params = {
        data: {
          Sess_UserRefno: userID,
          group_refno: route.params.workgiven.group_refno,
          ...state,
          propertytype_refno: route.params.selectedProperty.propertytype_refno,
          totalfoot: total,
          service_refno: state.service_refno?.map((obj) => obj._id),
          propertycategory_refno: categories.find(
            (item) =>
              item.propertycategory_name === state.propertycategory_refno
          ).propertycategory_refno,
        },
      };
      Provider.createDFCommon(
        Provider.API_URLS.designyourdream_enquiry_create,
        params
      )
        .then((res) => {
          if (res.data.data) {
            setIsButtonLoading(false);
            setState({
              service_refno: [],
              propertycategory_refno: "",
              lengthfoot: "",
              lengthinches: "",
              widthheightfoot: "",
              widthheightinches: "",
              contact_name: "",
              contact_mobile_no: "",
              property_address: "",
            });
            setTotal("");
            setSnackbarText("Form Submitted Successfully");
            setSnackbarColor(theme.colors.greenBorder);
            setSnackbarVisible(true);
            navigation.navigate("HomeScreen");
          } else {
            setIsButtonLoading(false);
            throw "Something went wrong";
          }
        })
        .catch((error) => {
          setIsButtonLoading(false);
          setSnackbarText("Something Went Wrong...");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        });
    } else {
      setSnackbarText("Please fill all the fields");
      setSnackbarColor(theme.colors.error);
      setSnackbarVisible(true);
    }
  };
  useEffect(() => {
    if (
      state.lengthfoot !== "" &&
      state.lengthinches !== "" &&
      state.widthheightfoot !== "" &&
      state.widthheightinches !== "" &&
      changed
    ) {
      Provider.createDFCommon(Provider.API_URLS.getsqftcalculation, {
        data: {
          Sess_UserRefno: userID,
          lengthfoot: state.lengthfoot,
          lengthinches: state.lengthinches,
          widthheightfoot: state.widthheightfoot,
          widthheightinches: state.widthheightinches,
        },
      })
        .then((res) => {
          if (res?.data?.data) setTotal(res.data.data[0].totalfoot);
          setChanged(false);
        })
        .catch((error) => console.log(error));
    }
  }, [state, setTotal, userID]);
  useEffect(() => {
    if (isFocused) {
      GetUserID();
    }
  }, [isFocused]);
  const fetchCategories = () => {
    const params = {
      data: {
        Sess_UserRefno: userID,
      },
    };
    Provider.createDFCommon(
      Provider.API_URLS.getpropertycategoryname_designyourdream_enquiryform,
      params
    )
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch((error) => console.log(error));
  };

  const fetchServices = () => {
    const params = {
      data: {
        Sess_UserRefno: userID,
      },
    };
    Provider.createDFCommon(
      Provider.API_URLS.getservicename_designyourdream_enquiryform,
      params
    )
      .then((res) => {
        setServices(res.data.data);
      })
      .catch((error) => console.log(error));
  };

  const fetchLength = () => {
    Provider.createDFAdmin(Provider.API_URLS.getlength)
      .then((res) => {
        setLengthFeet(res.data.data);
      })
      .catch((error) => console.log(error));
    Provider.createDFAdmin(Provider.API_URLS.getlengthinches)
      .then((res) => {
        setLengthInches(res.data.data);
      })
      .catch((error) => console.log(error));
  };

  const fetchWidth = () => {
    Provider.createDFAdmin(Provider.API_URLS.getwidthheightfoot)
      .then((res) => {
        setWidthFeet(res.data.data);
      })
      .catch((error) => console.log(error));
    Provider.createDFAdmin(Provider.API_URLS.getwidthheightinches)
      .then((res) => {
        setWidthInches(res.data.data);
      })
      .catch((error) => console.log(error));
  };

  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <ScrollView style={[Styles.flex1]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <TextInput
            mode="flat"
            label="Property Type"
            disabled={true}
            value={route.params.selectedProperty.propertytype_name}
            returnKeyType="next"
            style={{ backgroundColor: "white" }}
          />

          <TextInput
            mode="flat"
            label="Work Given To"
            disabled={true}
            value={route.params.workgiven.group_name}
            returnKeyType="next"
            style={{ backgroundColor: "white" }}
          />
          {/* <MultiSelect /> */}
          <PaperSelect
            multiEnable={true}
            label="Services"
            textInputMode="flat"
            underlineColor={errors.service_refno ? theme.colors.error : "black"}
            errorStyle={{ color: theme.colors.error }}
            value={state.service_refno?.map((item) => item.value).join(",")}
            arrayList={services?.map((obj) => {
              return { _id: obj.service_refno, value: obj.service_name };
            })}
            selectAllEnable={false}
            selectedItem={state.service_refno}
            selectedArrayList={state.service_refno}
            hideSearchBox={true}
            errorText={errors.service_refno ? "Please Select a service" : ""}
            onSelection={(e) => {
              onChange(e.selectedList, "service_refno");
            }}
          />

          <Dropdown
            data={categories?.map((item) => {
              return item.propertycategory_name;
            })}
            selectedItem={state.propertycategory_refno}
            value={state.propertycategory_refno}
            isError={errors.propertycategory_refno}
            reference={refs.category}
            label="Property Category"
            onSelected={(e) => onChange(e, "propertycategory_refno")}
          />
          <HelperText type="error" visible={errors.propertycategory_refno}>
            Please Select a property category
          </HelperText>
          <View style={[Styles.width100per, Styles.flexRow]}>
            <View style={[Styles.width50per]}>
              <Dropdown
                label="Length (in feet)"
                reference={refs.lengthfeet}
                data={lengthFeet.map((item) => item.lengthfoot)}
                selectedItem={state.lengthfoot}
                isError={errors.lengthfoot}
                onSelected={(e) => {
                  setChanged(true);
                  onChange(e, "lengthfoot");
                }}
              />
              <HelperText type="error" visible={errors.lengthfoot}>
                Please Select a length{" "}
              </HelperText>
            </View>
            <View style={[Styles.width50per]}>
              <Dropdown
                label="Length (in inches)"
                reference={refs.lengthinches}
                isError={errors.lengthinches}
                selectedItem={state.lengthinches}
                onSelected={(e) => {
                  setChanged(true);
                  onChange(e, "lengthinches");
                }}
                data={lengthInches.map((item) => item.lengthinches)}
              />
              <HelperText type="error" visible={errors.lengthinches}>
                Please Select a length{" "}
              </HelperText>
            </View>
          </View>

          <View style={[Styles.width100per, Styles.flexRow]}>
            <View style={[Styles.width50per]}>
              <Dropdown
                label="Width/Height (in feet)"
                reference={refs.widhtfeet}
                isError={errors.widthheightfoot}
                selectedItem={state.widthheightfoot}
                onSelected={(e) => {
                  setChanged(true);
                  onChange(e, "widthheightfoot");
                }}
                data={widthFeet.map((item) => item.widthheightfoot)}
              />
              <HelperText type="error" visible={errors.widthheightfoot}>
                Please Select a width
              </HelperText>
            </View>
            <View style={[Styles.width50per]}>
              <Dropdown
                label="Width/height (in inches)"
                reference={refs.widthinches}
                selectedItem={state.widthheightinches}
                isError={errors.widthheightinches}
                onSelected={(e) => {
                  setChanged(true);
                  onChange(e, "widthheightinches");
                }}
                data={widthInches.map((item) => item.widthheightinches)}
              />
              <HelperText type="error" visible={errors.widthheightinches}>
                Please Select a width
              </HelperText>
            </View>
          </View>



<<<<<<< HEAD
          <Dropdown
            label="Length (in feet)"
            reference={refs.lengthfeet}
            data={lengthFeet?.map((item) => item.lengthfoot)}
            selectedItem={state.lengthfoot}
            isError={errors.lengthfoot}
            onSelected={(e) => {
              setChanged(true);
              onChange(e, "lengthfoot");
            }}
          />
          <HelperText type="error" visible={errors.lengthfoot}>
            Please Select a length{" "}
          </HelperText>
          <Dropdown
            label="Length (in inches)"
            reference={refs.lengthinches}
            isError={errors.lengthinches}
            selectedItem={state.lengthinches}
            onSelected={(e) => {
              setChanged(true);
              onChange(e, "lengthinches");
            }}
            data={lengthInches?.map((item) => item.lengthinches)}
          />
          <HelperText type="error" visible={errors.lengthinches}>
            Please Select a length{" "}
          </HelperText>
          <Dropdown
            label="Width/Height (in feet)"
            reference={refs.widhtfeet}
            isError={errors.widthheightfoot}
            selectedItem={state.widthheightfoot}
            onSelected={(e) => {
              setChanged(true);
              onChange(e, "widthheightfoot");
            }}
            data={widthFeet?.map((item) => item.widthheightfoot)}
          />
          <HelperText type="error" visible={errors.widthheightfoot}>
            Please Select a width
          </HelperText>
          <Dropdown
            label="Width/height (in inches)"
            reference={refs.widthinches}
            selectedItem={state.widthheightinches}
            isError={errors.widthheightinches}
            onSelected={(e) => {
              setChanged(true);
              onChange(e, "widthheightinches");
            }}
            data={widthInches?.map((item) => item.widthheightinches)}
          />
          <HelperText type="error" visible={errors.widthheightinches}>
            Please Select a width
          </HelperText>
=======
>>>>>>> efea31403210a036bab2a5ab59be56c2e62fa8e9
          <TextInput
            mode="flat"
            label="Total (Sq.ft)"
            disabled={true}
            returnKeyType="next"
            isError={errors.contact_name}
            value={total}
            ref={refs.totalfoot}
            helper
            onSubmitEditing={() => refs.contact_name.current.focus()}
            style={{ backgroundColor: "white" }}
          />

          <TextInput
            mode="flat"
            label="Contact Name"
            returnKeyType="next"
            isError={errors.contact_mobile_no}
            style={{ backgroundColor: "white" }}
            ref={refs.contact_name}
            value={state.contact_name}
            error={errors.contact_name}
            onChangeText={(e) => onChange(e, "contact_name")}
            onSubmitEditing={() => refs.contact_no.current.focus()}
          />
          <HelperText type="error" visible={errors.contact_name}>
            Please enter the contact name
          </HelperText>
          <TextInput
            mode="flat"
            ref={refs.contact_no}
            label="Contact Number"
            keyboardType="phone-pad"
            error={errors.contact_mobile_no}
            returnKeyType="next"
            value={state.contact_mobile_no}
            onChangeText={(e) => {
              if (e.length < 11) onChange(e, "contact_mobile_no");
            }}
            style={{ backgroundColor: "white" }}
          />
          <HelperText type="error" visible={errors.contact_mobile_no}>
            Please enter the contact number
          </HelperText>
          <TextInput
            mode="flat"
            label="Property Address"
            multiline={true}
            value={state.property_address}
            error={errors.property_address}
            onChangeText={(e) => onChange(e, "property_address")}
            reference={refs.address}
            returnKeyType="next"
            style={{ backgroundColor: "white" }}
          />
          <HelperText type="error" visible={errors.property_address}>
            Please enter address
          </HelperText>
          <Button
            mode="contained"
            onPress={onSubmit}
            loading={isButtonLoading} disabled={isButtonLoading}
            style={[Styles.width100per, { alignSelf: "center", marginTop: 20 }]}
          >
            Submit
          </Button>
        </View>
      </ScrollView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarColor }}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default Form;
