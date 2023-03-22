import React, { useEffect, useRef, useState } from "react";
import { Image, ScrollView, TouchableNativeFeedback, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Dialog,
  Checkbox,
  IconButton,
  HelperText,
  List,
  Portal,
  RadioButton,
  Searchbar,
  Snackbar,
  Subheading,
  Text,
  TextInput,
  Title,
  Card,
  ActivityIndicator,
} from "react-native-paper";
import Provider from "../../../api/Provider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";
import { RNS3 } from "react-native-aws3";
import { creds } from "../../../utils/credentials";
import uuid from "react-native-uuid";
import Dropdown from "../../../components/Dropdown";
import DropDown2 from "../../../components/Dropdown";

let Sess_UserRefno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_group_refno = 0;
const QuotationAddEditTab = ({ route, navigation }) => {
  //#region Variable
  const [isLoading, setIsLoading] = React.useState(true);
  const [clientName, setClientName] = React.useState("");
  const [errorClientName, setClientNameError] = React.useState(false);

  const [cName, setCName] = React.useState("");
  const [clientNumber, setClientNumber] = React.useState("");

  const [projectName, setProjectName] = useState("");
  const [projectNameInvalid, setProjectNameInvalid] = useState("");
  const projectNameRef = useRef({});

  const [contactPerson, setContactPerson] = useState("");
  const [contactPersonInvalid, setContactPersonInvalid] = useState("");
  const contactPersonRef = useRef({});

  const [contactNumber, setContactNumber] = useState("");
  const [contactNumberInvalid, setContactNumberInvalid] = useState("");
  const contactNumberRef = useRef({});

  const [projectDescription, setProjectDescription] = useState("");
  const [projectDescriptionInvalid, setProjectDescriptionInvalid] =
    useState("");
  const projectDescriptionRef = useRef({});

  const [projectSiteAddress, setProjectSiteAddress] = useState("");
  const [projectSiteAddressInvalid, setProjectSiteAddressInvalid] =
    useState("");
  const projectSiteAddressRef = useRef({});

  const [statesFullData, setStatesFullData] = React.useState([]);
  const [statesData, setStatesData] = React.useState([]);
  const [statesID, setStatesID] = React.useState([]);
  const [stateName, setStateName] = React.useState("");
  const [errorSN, setSNError] = React.useState(false);
  const stateRef = useRef({});

  const [cityFullData, setCityFullData] = React.useState([]);
  const [cityData, setCityData] = React.useState([]);
  const [cityID, setCityID] = React.useState([]);
  const [cityName, setCityName] = React.useState("");
  const [errorCN, setCNError] = React.useState(false);
  const cityRef = useRef({});

  const [unitSalesFullData, setUnitSalesFullData] = React.useState([]);
  const [unitSalesData, setUnitSalesData] = React.useState(["Foot", "Meter"]);
  const [unitSalesName, setUnitSalesName] = React.useState("");
  const [errorUS, setUSError] = React.useState(false);

  // const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);
  const arrProductData = React.useState([]);

  const onClientNameSelected = (selectedItem) => {
    setClientName(selectedItem);
    setClientNameError(false);
  };

  const onProjectNameChanged = (text) => {
    setProjectName(text);
    setProjectNameInvalid(false);
  };

  const onProjectDescriptionChanged = (text) => {
    setProjectDescription(text);
    setProjectDescriptionInvalid(false);
  };

  const onProjectSiteAddressChanged = (text) => {
    setProjectSiteAddress(text);
    setProjectSiteAddressInvalid(false);
  };

  const onCityNameSelected = (selectedItem) => {
    setCityName(selectedItem);
    setCNError(false);
  };

  const onUnitSaleSelected = (selectedItem) => {
    unitSalesName(selectedItem);
    setUSError(false);
  };
  const [visible, setVisible] = React.useState(false);
  const [dropdowndata, setDropDownData] = React.useState({
    clients: [],
    states: [],
    cities1: [],
    cities2: [],
    units: [],
    services: [],
    categories: [],
  });
  const [data, setData] = React.useState({
    client_name: "",
    client_contact_name: "",
    client_contact_number: "",
    project_name: "",
    contact_person: "",
    contact_person_mobile_no: "",
    project_description: "",
    state_refno: "",
    district_refno: "",
    project_site_address: "",
    unit: "",
    quot_unit_type_refno: "",
    product_details: [],
    product_list: [],
    inclusive: false,
  });
  const [errors, setErrors] = React.useState({
    client_name: false,
    project_name: false,
    project_site_address: false,
    unit: false,
  });
  const [newclient, setNewClient] = React.useState({
    company_name: "",
    contact_person: "",
    contact_person_mobile_no: "",
    address: "",
    state_refno: "",
    district_refno: "",
    pincode: "",
    gst_no: "",
    pan_no: "",
    client_role_refno: "",
    buyercategory_refno: "",
    view_status: "1",
  });
  const [newclienterrors, setNewClientErrors] = useState({
    company_name: false,
    contact_person_mobile_no: false,
    address: false,
    state_refno: false,
    district_refno: false,
  });
  const FetchData = async () => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_group_refno: Sess_group_refno,
      },
    };
    try {
      const data = await Provider.getdropdowndata(params);
      setDropDownData((prev) => {
        return {
          ...prev,
          ...data,
        };
      });
      console.log("units", data.units);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClientData = (ref) => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        client_user_refno: ref,
      },
    };
    Provider.createDFContractor(
      Provider.API_URLS.contractor_get_clientdetails_quotationform,
      params
    )
      .then((response) => {
        if (response.data && response.data.data) {
          setData((prev) => {
            return {
              ...prev,
              ...response.data.data[0],
            };
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchDistrictData = (ref, type) => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        state_refno: ref,
      },
    };
    Provider.createDFCommon(
      Provider.API_URLS.getdistrictdetails_by_state_refno,
      params
    )
      .then((response) => {
        if (response.data && response.data.data) {
          setDropDownData((prev) => {
            return {
              ...prev,
              [type == "dropdown1" ? "cities1" : "cities2"]: response.data.data,
            };
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const createnewclient = () => {
    let isValid = true;
    if (newclient.company_name.length < 1) {
      setNewClientErrors((prev) => {
        return {
          ...prev,
          company_name: true,
        };
      });
      isValid = false;
    }
    if (newclient.contact_person_mobile_no.length < 1) {
      setNewClientErrors((prev) => {
        return {
          ...prev,
          contact_person_mobile_no: true,
        };
      });
      isValid = false;
    }
    if (newclient.address.length < 1) {
      setNewClientErrors((prev) => {
        return {
          ...prev,
          address: true,
        };
      });
      isValid = false;
    }
    if (newclient.state_refno.length < 1) {
      setNewClientErrors((prev) => {
        return {
          ...prev,
          state_refno: true,
        };
      });
      isValid = false;
    }
    if (newclient.district_refno.length < 1) {
      setNewClientErrors((prev) => {
        return {
          ...prev,
          district_refno: true,
        };
      });
      isValid = false;
    }
    if (isValid) {
      console.log(newclient);
    }
  };
  const GetUserID = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData !== null) {
        Sess_UserRefno = JSON.parse(userData).UserID;
        Sess_CompanyAdmin_UserRefno =
          JSON.parse(userData).Sess_CompanyAdmin_UserRefno;
        Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
        Sess_company_refno = JSON.parse(userData).Sess_company_refno;
        Sess_group_refno = JSON.parse(userData).Sess_group_refno;
        FetchData();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    GetUserID();
  }, []);
  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      {isLoading ? (
        <View
          style={[
            Styles.flex1,
            Styles.flexJustifyCenter,
            Styles.flexAlignCenter,
          ]}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <>
          <ScrollView
            style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[Styles.padding16]}>
              <View
                style={[
                  Styles.width100per,
                  Styles.borderBottom2,
                  Styles.borderBottom2,
                  Styles.marginBottom16,
                ]}
              >
                <Text
                  style={[
                    Styles.fontSize20,
                    Styles.fontBold,
                    Styles.marginBottom4,
                    Styles.blueFontColor,
                  ]}
                >
                  Client Details
                </Text>
              </View>
              <View
                style={[
                  Styles.width100per,
                  Styles.flexRow,
                  Styles.flexAlignCenter,
                ]}
              >
                <View style={[Styles.width75per]}>
                  <Dropdown
                    label="Client Name"
                    data={
                      dropdowndata?.clients?.length < 1
                        ? []
                        : Object.values(dropdowndata?.clients[0]?.client_data)
                    }
                    onSelected={(selectedItem, idx) => {
                      if (selectedItem !== data.client_name) {
                        setData((prev) => {
                          return {
                            ...prev,
                            client_name: selectedItem,
                          };
                        });
                        setErrors((prev) => {
                          return {
                            ...prev,
                            client_name: false,
                          };
                        });
                        fetchClientData(
                          Object.keys(dropdowndata?.clients[0]?.client_data)[
                            idx
                          ]
                        );
                      }
                    }}
                    isError={errors.client_name}
                    selectedItem={data.client_name}
                  />

                  <HelperText type="error" visible={errors.client_name}>
                    {communication.InvalidClient}
                  </HelperText>
                </View>
                <View
                  style={[
                    Styles.width20per,
                    Styles.flexAlignSelfCenter,
                    Styles.flexJustifyEnd,
                    Styles.marginStart16,
                    Styles.marginBottom24,
                  ]}
                >
                  <IconButton
                    style={[
                      Styles.border2,
                      Styles.borderRadius4,
                      Styles.width72,
                    ]}
                    icon={"account-multiple-plus"}
                    size={35}
                    color="#198754"
                    onPress={() => setVisible(true)}
                  ></IconButton>
                </View>
              </View>

              <TextInput
                mode="outlined"
                dense
                label="Client Name"
                value={data.client_contact_name}
                disabled
              ></TextInput>

              <TextInput
                mode="outlined"
                dense
                label="Client Number"
                value={data.client_contact_number}
                disabled
                style={{ marginTop: 20 }}
              ></TextInput>
            </View>
            <View style={[Styles.padding16]}>
              <View
                style={[
                  Styles.width100per,
                  Styles.borderBottom2,
                  Styles.borderBottom2,
                  Styles.marginBottom16,
                ]}
              >
                <Text
                  style={[
                    Styles.fontSize20,
                    Styles.fontBold,
                    Styles.marginBottom4,
                    Styles.blueFontColor,
                  ]}
                >
                  Project Details
                </Text>
              </View>
              <View
                style={[
                  Styles.width100per,
                  Styles.flexRow,
                  Styles.flexAlignCenter,
                ]}
              >
                <View style={[Styles.width100per]}>
                  <TextInput
                    mode="outlined"
                    dense
                    label="Project Name"
                    value={data.project_name}
                    returnKeyType="next"
                    onChangeText={(text) => {
                      setData((prev) => {
                        return {
                          ...prev,
                          project_name: text,
                        };
                      });
                      setErrors((prev) => {
                        return {
                          ...prev,
                          project_name: false,
                        };
                      });
                    }}
                    style={{ backgroundColor: "white" }}
                    error={errors.project_name}
                  />
                  <HelperText type="error" visible={errors.project_name}>
                    {communication.projectNameInvalid}
                  </HelperText>
                  <TextInput
                    mode="outlined"
                    dense
                    label="Contact Person"
                    value={data.contact_person}
                    returnKeyType="next"
                    onChangeText={(text) => {
                      setData((prev) => {
                        return {
                          ...prev,
                          contact_person: text,
                        };
                      });
                    }}
                    style={{ backgroundColor: "white" }}
                  />
                  <TextInput
                    mode="outlined"
                    dense
                    label="Conatct Number"
                    value={data.contact_person_mobile_no}
                    returnKeyType="next"
                    onChangeText={(text) => {
                      setData((prev) => {
                        return {
                          ...prev,
                          contact_person_mobile_no: text,
                        };
                      });
                    }}
                    style={{ backgroundColor: "white" }}
                  />
                  <TextInput
                    multiline
                    mode="outlined"
                    dense
                    label="Project Description"
                    returnKeyType="next"
                    onChangeText={(text) => {
                      setData((prev) => {
                        return {
                          ...prev,
                          project_description: text,
                        };
                      });
                    }}
                    value={data.project_description}
                    style={{ backgroundColor: "white" }}
                  />
                  <TextInput
                    multiline
                    mode="outlined"
                    dense
                    label="Project Site Address"
                    value={data.project_site_address}
                    returnKeyType="next"
                    onChangeText={(text) => {
                      setData((prev) => {
                        return {
                          ...prev,
                          project_site_address: text,
                        };
                      });
                      setErrors((prev) => {
                        return {
                          ...prev,
                          project_site_address: false,
                        };
                      });
                    }}
                    style={{ backgroundColor: "white" }}
                    error={errors.project_site_address}
                  />
                  <HelperText
                    type="error"
                    visible={errors.project_site_address}
                  >
                    {communication.projectSiteAddressInvalid}
                  </HelperText>
                  <Dropdown
                    label="State"
                    style={{ backgroundColor: "white", marginBottom: "3%" }}
                    data={
                      dropdowndata?.states?.length < 1
                        ? []
                        : dropdowndata.states.map((item) => item.state_name)
                    }
                    onSelected={(selectedItem, idx) => {
                      if (
                        dropdowndata.states[idx].state_refno !==
                        data.state_refno
                      ) {
                        setData((prev) => {
                          return {
                            ...prev,
                            state_refno: dropdowndata.states[idx].state_refno,
                            district_refno: "",
                          };
                        });
                        setDropDownData((prev) => {
                          return {
                            ...prev,
                            cities2: [],
                          };
                        });
                        fetchDistrictData(
                          dropdowndata.states[idx].state_refno,
                          "dropdown2"
                        );
                      }
                    }}
                    selectedItem={
                      dropdowndata.states.find(
                        (item) => item.state_refno === data.state_refno
                      )?.state_name
                    }
                  />
                  <Dropdown
                    label="City"
                    style={{ backgroundColor: "white", marginBottom: "3%" }}
                    data={
                      dropdowndata?.cities2?.length < 1
                        ? []
                        : dropdowndata.cities2.map((item) => item.district_name)
                    }
                    onSelected={(selectedItem, idx) => {
                      if (
                        dropdowndata.cities2[idx].district_refno !==
                        data.district_refno
                      ) {
                        setData((prev) => {
                          return {
                            ...prev,
                            district_refno:
                              dropdowndata.cities2[idx].district_refno,
                          };
                        });
                      }
                    }}
                    selectedItem={
                      dropdowndata.cities2.find(
                        (item) => item.district_refno === data.district_refno
                      )?.district_name
                    }
                  />
                </View>
              </View>
            </View>
            <View style={[Styles.padding16]}>
              <View
                style={[
                  Styles.width100per,
                  Styles.borderBottom2,
                  Styles.borderBottom2,
                  Styles.marginBottom16,
                ]}
              >
                <Text
                  style={[
                    Styles.fontSize20,
                    Styles.fontBold,
                    Styles.marginBottom4,
                    Styles.blueFontColor,
                  ]}
                >
                  Quotation Preparation Type
                </Text>
              </View>
              <View
                style={[
                  Styles.width100per,
                  Styles.flexRow,
                  Styles.flexAlignCenter,
                ]}
              >
                <View style={[Styles.width100per]}>
                  <Dropdown
                    label="Unit Of Sales"
                    data={dropdowndata.units.map(
                      (item) => item.quot_unit_type_name
                    )}
                    onSelected={(selectedItem, idx) => {
                      setErrors((prev) => {
                        return {
                          ...prev,
                          unit: false,
                        };
                      });
                      setData((prev) => {
                        return {
                          ...prev,
                          quot_unit_type_refno:
                            dropdowndata.units[idx].quot_unit_type_refno,
                          unit: dropdowndata.units[idx].quot_unit_type_name,
                        };
                      });
                    }}
                    isError={errors.unit}
                    selectedItem={data.unit}
                  />
                  <HelperText type="error" visible={errors.unit}>
                    {communication.InvalidSalesUnit}
                  </HelperText>
                  <View>
                    <Checkbox.Item
                      label="Inclusive Material"
                      position="leading"
                      disabled={data.product_details.length > 1 ? true : false}
                      onPress={() => {
                        setData((prev) => {
                          return {
                            ...prev,
                          };
                        });
                      }}
                      labelStyle={{ textAlign: "left", paddingLeft: 8 }}
                      color={theme.colors.primary}
                      checked={true}
                    />
                  </View>
                  <Button
                    mode="contained"
                    style={{ marginTop: 20 }}
                    icon="plus"
                  >
                    Add Product
                  </Button>
                </View>
              </View>
            </View>
            <View style={[Styles.padding16]}>
              <View
                style={[
                  Styles.width100per,
                  Styles.borderBottom2,
                  Styles.borderBottom2,
                  Styles.marginBottom16,
                ]}
              >
                <Text
                  style={[
                    Styles.fontSize20,
                    Styles.fontBold,
                    Styles.marginBottom4,
                    Styles.blueFontColor,
                  ]}
                >
                  Product Details
                </Text>
              </View>
            </View>
            <View style={[Styles.padding16]}>
              <View
                style={[
                  Styles.width100per,
                  Styles.borderBottom2,
                  Styles.borderBottom2,
                  Styles.marginBottom16,
                ]}
              >
                <Text
                  style={[
                    Styles.fontSize20,
                    Styles.fontBold,
                    Styles.marginBottom4,
                    Styles.blueFontColor,
                  ]}
                >
                  Terms & Condition
                </Text>
              </View>
            </View>
          </ScrollView>
          {/* // AddClient */}
          <Portal>
            <Dialog
              visible={visible}
              onDismiss={() => setVisible(false)}
              style={[Styles.borderRadius8]}
            >
              <ScrollView>
                <Dialog.Title style={[Styles.fontSize16, Styles.textCenter]}>
                  Add New Client
                </Dialog.Title>
                <Dialog.Content>
                  <View>
                    <TextInput
                      mode="outlined"
                      dense
                      label="Client / Company Name"
                      value={newclient.company_name}
                      returnKeyType="next"
                      onChangeText={(text) => {
                        setNewClient((prev) => {
                          return {
                            ...prev,
                            company_name: text,
                          };
                        });
                        setNewClientErrors((prev) => {
                          return {
                            ...prev,
                            company_name: false,
                          };
                        });
                      }}
                      style={{ backgroundColor: "white", marginBottom: "3%" }}
                      error={newclienterrors.company_name}
                    />
                    <TextInput
                      mode="outlined"
                      dense
                      label="Contact Person"
                      value={newclient.contact_person}
                      returnKeyType="next"
                      onChangeText={(text) => {
                        setNewClient((prev) => {
                          return {
                            ...prev,
                            contact_person: text,
                          };
                        });
                      }}
                      style={{ backgroundColor: "white", marginBottom: "3%" }}
                    />
                    <TextInput
                      mode="outlined"
                      dense
                      label="Contact Mobile No"
                      value={newclient.contact_person_mobile_no}
                      returnKeyType="next"
                      onChangeText={(text) => {
                        setNewClient((prev) => {
                          return {
                            ...prev,
                            contact_person_mobile_no: text,
                          };
                        });
                        setNewClientErrors((prev) => {
                          return {
                            ...prev,
                            contact_person_mobile_no: false,
                          };
                        });
                      }}
                      style={{ backgroundColor: "white", marginBottom: "3%" }}
                      error={newclienterrors.contact_person_mobile_no}
                    />
                    <TextInput
                      mode="outlined"
                      dense
                      label="Address 1"
                      value={newclient.address}
                      returnKeyType="next"
                      onChangeText={(text) => {
                        setNewClient((prev) => {
                          return {
                            ...prev,
                            address: text,
                          };
                        });
                        setNewClientErrors((prev) => {
                          return {
                            ...prev,
                            address: false,
                          };
                        });
                      }}
                      style={{ backgroundColor: "white", marginBottom: "3%" }}
                      error={newclienterrors.address}
                    />

                    <DropDown2
                      label="State"
                      style={{ backgroundColor: "white", marginBottom: "3%" }}
                      data={
                        dropdowndata?.states?.length < 1
                          ? []
                          : dropdowndata.states.map((item) => item.state_name)
                      }
                      onSelected={(selectedItem, idx) => {
                        if (
                          dropdowndata.states[idx].state_refno !==
                          newclient.state_refno
                        ) {
                          setNewClient((prev) => {
                            return {
                              ...prev,
                              state_refno: dropdowndata.states[idx].state_refno,
                              district_refno: "",
                            };
                          });
                          setDropDownData((prev) => {
                            return {
                              ...prev,
                              cities1: [],
                            };
                          });
                          setNewClientErrors((prev) => {
                            return {
                              ...prev,
                              state_refno: false,
                              district_refno: false,
                            };
                          });
                          fetchDistrictData(
                            dropdowndata.states[idx].state_refno,
                            "dropdown1"
                          );
                        }
                      }}
                      isError={newclienterrors.state_refno}
                      selectedItem={
                        dropdowndata.states.find(
                          (item) => item.state_refno === newclient.state_refno
                        )?.state_name
                      }
                    />
                    <DropDown2
                      label="City"
                      style={{ backgroundColor: "white", marginBottom: "3%" }}
                      data={
                        dropdowndata?.cities1?.length < 1
                          ? []
                          : dropdowndata.cities1.map(
                              (item) => item.district_name
                            )
                      }
                      onSelected={(selectedItem, idx) => {
                        if (
                          dropdowndata.cities1[idx].district_refno !==
                          newclient.district_refno
                        ) {
                          setNewClient((prev) => {
                            return {
                              ...prev,
                              district_refno:
                                dropdowndata.cities1[idx].district_refno,
                            };
                          });
                          setNewClientErrors((prev) => {
                            return {
                              ...prev,
                              district_refno: false,
                            };
                          });
                        }
                      }}
                      isError={newclienterrors.district_refno}
                      selectedItem={
                        dropdowndata.cities1.find(
                          (item) =>
                            item.district_refno === newclient.district_refno
                        )?.district_name
                      }
                    />
                    <TextInput
                      mode="outlined"
                      dense
                      label="Pincode"
                      value={newclient.pincode}
                      returnKeyType="next"
                      onChangeText={(text) => {
                        setNewClient((prev) => {
                          return {
                            ...prev,
                            pincode: text,
                          };
                        });
                      }}
                      style={{ backgroundColor: "white", marginBottom: "3%" }}
                    />
                    <TextInput
                      mode="outlined"
                      dense
                      label="GST"
                      value={newclient.gst_no}
                      returnKeyType="next"
                      onChangeText={(text) => {
                        setNewClient((prev) => {
                          return {
                            ...prev,
                            gst_no: text,
                          };
                        });
                      }}
                      style={{ backgroundColor: "white", marginBottom: "3%" }}
                    />
                    <TextInput
                      mode="outlined"
                      dense
                      label="Pan"
                      value={newclient.pan_no}
                      returnKeyType="next"
                      onChangeText={(text) => {
                        setNewClient((prev) => {
                          return {
                            ...prev,
                            pan_no: text,
                          };
                        });
                      }}
                      style={{ backgroundColor: "white", marginBottom: "3%" }}
                    />
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Button
                      mode="contained"
                      onPress={() => setVisible(false)}
                      style={[Styles.marginTop16, { flex: 1 }]}
                    >
                      Cancel
                    </Button>
                    <View style={{ flex: 0.2 }}></View>
                    <Button
                      mode="contained"
                      onPress={() => {
                        createnewclient();
                      }}
                      style={[Styles.marginTop16, { flex: 1 }]}
                    >
                      Add
                    </Button>
                  </View>
                </Dialog.Content>
              </ScrollView>
            </Dialog>
          </Portal>
        </>
      )}
    </View>
  );
};

export default QuotationAddEditTab;
