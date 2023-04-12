import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  TouchableNativeFeedback,
  View,
  StyleSheet,
} from "react-native";
// import RichTextBox from "./RichTextBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Table, TableWrapper, Row, Col } from "react-native-table-component";
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
import Provider from "../../../../api/Provider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../../components/NoItems";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { RNS3 } from "react-native-aws3";
import { creds } from "../../../../utils/credentials";
import uuid from "react-native-uuid";
import Dropdown from "../../../../components/Dropdown";
import DropDown2 from "../../../../components/Dropdown";

let Sess_UserRefno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_group_refno = 0;
const styles = StyleSheet.create({
  container: { marginTop: 10, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: theme.colors.primary },
  subheader: { height: 30, backgroundColor: "white" },
  text: { textAlign: "center", fontWeight: "400" },
  headertext: { textAlign: "center", fontWeight: "800", color: "white" },
  dataWrapper: { marginTop: -1 },
  row: { height: 50, backgroundColor: "white" },
});
const AddSendRateCard = ({ route, navigation }) => {
  const unload = (msg) => {
    setIsLoading(false);
    setSnackbarText(msg);
    setSnackbarColor(theme.colors.error);
    setSnackbarVisible(true);
  };
  const snack = (msg, color) => {
    setSnackbarText(msg);
    setSnackbarColor(color);
    setSnackbarVisible(true);
  };
  const [isLoading, setIsLoading] = React.useState(true);
  const [IsButtonLoading2, setIsButtonLoading2] = React.useState(false);
  const [temp, setTemp] = React.useState({
    fn: () => {},
    unit: { unit: "", quot_type_refno: "" },
  });

  const [unitdialogue, setUnitDialogue] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );
  const dropdownRef = useRef({});
  // const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);
  const [visible, setVisible] = React.useState(false);
  const [visible2, setVisible2] = React.useState(false);
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
    rc_unit_type_refno: "",
    product_details: [],
    inclusive: false,
    terms: "",
    send_to_client: true,
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
      const data = await Provider.getdropdownratecarddata(params);
      setDropDownData((prev) => {
        return {
          ...prev,
          ...data,
        };
      });
      console.log(data.units);
      if (route.params.type == "add") {
        setIsLoading(false);
      } else {
        fetchQuotationData(data);
      }
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };
  const fetchQuotationData = (data) => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_group_refno: Sess_group_refno,
        cont_rc_refno: route.params.data.cont_rc_refno,
      },
    };
    Provider.createDFContractor(
      Provider.API_URLS.contractor_sendratecard_contrcrefnocheck,
      params
    )
      .then((response) => {
        if (response.data && response.data.data) {
          console.log(response.data.data);
          setData((prev) => {
            return {
              ...prev,
              client_name:
                data.clients[0].client_data[
                  response.data.data[0].client_user_refno
                ],
              client_contact_name: response.data.data[0].client_firstname,
              client_contact_number: response.data.data[0].client_mobile_no,
              unit: data.units.find(
                (item) =>
                  item.rc_unit_type_refno ==
                  response.data.data[0].rc_unit_type_refno
              ).rc_unit_type_name,
              rc_unit_type_refno: response.data.data[0].rc_unit_type_refno,
              inclusive:
                response.data.data[0].rc_type_refno == "1" ? true : false,
              product_details: response.data.data[0].ProductDetails,
            };
          });
        }
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => setIsLoading(false));
  };
  const fetchClientData = (ref) => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        client_user_refno: ref,
      },
    };
    Provider.createDFContractor(
      Provider.API_URLS.contractor_get_clientdetails_sendratecardform,
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
  const [IsButtonLoading, setIsButtonLoading] = useState(false);

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
      setIsButtonLoading(true);
      setVisible(false);
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          Sess_group_refno: Sess_group_refno,
          company_name: newclient.company_name,
          contact_person: newclient.contact_person,
          contact_person_mobile_no: newclient.contact_person_mobile_no,
          address: newclient.address,
          state_refno: newclient.state_refno,
          district_refno: newclient.district_refno,
          pincode: newclient.pincode,
          gst_no: newclient.gst_no,
          pan_no: newclient.pan_no,
          client_role_refno: ["8"],
          buyercategory_refno: "0",
          view_status: "1",
        },
      };
      Provider.createDFCommon(Provider.API_URLS.clientcreate, params)
        .then((response) => {
          if (response.data && response.data.data.Created == 1) {
            setNewClient((prev) => {
              return {
                ...prev,
                company_name: "",
                contact_person: "",
                contact_person_mobile_no: "",
                address: "",
                pincode: "",
                gst_no: "",
                pan_no: "",
                client_role_refno: "",
                buyercategory_refno: "",
                view_status: "1",
              };
            });
            setNewClientErrors({
              company_name: false,
              contact_person_mobile_no: false,
              address: false,
              state_refno: false,
              district_refno: false,
            });
            Provider.createDFContractor(
              Provider.API_URLS.contractor_get_clientname_quotationform,
              params
            )
              .then((rep) => {
                if (rep.data && rep.data.data) {
                  setDropDownData((prev) => {
                    return {
                      ...prev,
                      clients: rep.data.data,
                    };
                  });
                }
              })
              .catch((e) => console.log(e))
              .finally(() =>
                snack(response.data.message, theme.colors.success)
              );
          } else {
            snack(response.data.message, theme.colors.error);
          }
        })
        .catch((e) => {
          snack(e.message, theme.colors.error);
        })
        .finally(() => setIsButtonLoading(false));
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

  const [productlist, setProductList] = React.useState({
    list: [],
    service_refno: "",
    category_refno: "",
  });

  const fetchCategoriesData = (ref) => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        service_refno: ref,
      },
    };
    Provider.createDFContractor(
      Provider.API_URLS.contractor_getcategoryname_popup_sendratecardform,
      params
    )
      .then((response) => {
        if (response.data && response.data.data) {
          setDropDownData((prev) => {
            return {
              ...prev,
              categories: response.data.data,
            };
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchProductList = (ref) => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        service_refno: productlist.service_refno,
        category_refno: ref,
        rc_type_refno: data.inclusive ? "1" : "2",
        rc_unit_type_refno: data.rc_unit_type_refno,
      },
    };
    Provider.createDFContractor(
      Provider.API_URLS.contractor_getproductlist_popup_sendratecardform,
      params
    )
      .then((response) => {
        console.log(response.data);
        if (response.data && response.data.data) {
          setProductList((prev) => {
            return {
              ...prev,
              list: response.data.data,
            };
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const fetchProductDetails = (ref) => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        rc_unit_type_refno: ref,
        product_refno: [],
        unit_category_refno: [],
        unit_refno: [],
        rate: [],
      },
    };
    data.product_details.map((item, idx) => {
      params.data.product_refno[idx] = item.product_refno;
      params.data.unit_category_refno[idx] = item.unit_category_refno;
      params.data.unit_refno[idx] = item.unit_refno;
      params.data.rate[idx] = item.rate;
    });
    Provider.createDFContractor(
      Provider.API_URLS
        .contractor_getproductlist_rc_unit_type_refno_onchange_sendratecardform,
      params
    )
      .then((response) => {
        console.log(response.data);
        if (response.data && response.data.data) {
          setData((prev) => {
            return {
              ...prev,
              product_details: response.data.data,
            };
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const [total, setTotal] = React.useState("");

  const AddQuotation = () => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
        client_user_refno: Object.entries(
          dropdowndata?.clients[0]?.client_data
        ).find(([key, value]) => data.client_name == value)[0],
        rc_unit_type_refno: data.rc_unit_type_refno,
        rc_type_refno: data.inclusive ? "1" : "2",
        product_refno: [],
        unit_refno: [],
        rate: [],
      },
    };
    data.product_details.map((item, idx) => {
      params.data.product_refno[idx] = item.product_refno;
      params.data.unit_refno[idx] = item.unit_refno;
      params.data.rate[idx] = item.rate;
    });
    console.log(params);
    setIsButtonLoading2(true);
    Provider.createDFContractor(
      Provider.API_URLS.contractor_sendratecard_create,
      params
    )
      .then((response) => {
        if (response.data && response.data.data.Created == 1) {
          route.params.fetchData("add");
          navigation.navigate("SendRateCard");
        } else {
          unload(response.data.message);
        }
      })
      .catch((e) => {
        unload("Quotation Add error");
        console.log(e);
      })
      .finally(() => {
        setIsButtonLoading2(false);
      });
  };

  const EditQuotation = () => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
        client_user_refno: Object.entries(
          dropdowndata?.clients[0]?.client_data
        ).find(([key, value]) => data.client_name == value)[0],
        rc_unit_type_refno: data.rc_unit_type_refno,
        rc_type_refno: data.inclusive ? "1" : "2",
        product_refno: [],
        unit_refno: [],
        rate: [],
        cont_rc_refno: route.params.data.cont_rc_refno,
      },
    };
    data.product_details.map((item, idx) => {
      params.data.product_refno[idx] = item.product_refno;
      params.data.unit_refno[idx] = item.unit_refno;
      params.data.rate[idx] = item.rate;
    });
    console.log("updateparams", params);
    setIsButtonLoading2(true);
    Provider.createDFContractor(
      Provider.API_URLS.contractor_sendratecard_update,
      params
    )
      .then((response) => {
        if (response.data && response.data.data.Updated == 1) {
          route.params.fetchData("update");
          navigation.navigate("SendRateCard");
        } else {
          unload(response.data.message);
        }
      })
      .catch((e) => {
        unload("Quotation Edit Error");
        console.log(e);
      })
      .finally(() => {
        setIsButtonLoading2(false);
      });
  };
  const checkform = () => {
    let isValid = true;
    if (data.client_name.length < 1) {
      setErrors((prev) => {
        return {
          ...prev,
          client_name: true,
        };
      });
      isValid = false;
    }
    if (data.unit.length < 1) {
      setErrors((prev) => {
        return {
          ...prev,
          unit: true,
        };
      });
      isValid = false;
    }

    if (isValid) {
      if (route.params.type == "add") {
        AddQuotation();
      } else {
        EditQuotation();
      }
    }
  };
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
                        : dropdowndata?.clients[0]?.client_data == null
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
                maxLength={10}
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
                  RATE CARD PREPARATION TYPE
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
                      (item) => item.rc_unit_type_name
                    )}
                    onSelected={(selectedItem, idx) => {
                      if (selectedItem !== data.unit) {
                        if (data.product_details.length > 0) {
                          setTemp((prev) => {
                            return {
                              ...prev,
                              fn: () => {
                                setProductList({
                                  list: [],
                                  service_refno: "",
                                  category_refno: "",
                                });
                                fetchProductDetails(
                                  dropdowndata.units[idx].rc_unit_type_refno
                                );
                              },
                              unit: {
                                unit: data.unit,
                                rc_unit_type_refno: data.rc_unit_type_refno,
                              },
                            };
                          });
                          setErrors((prev) => {
                            return {
                              ...prev,
                              unit: false,
                            };
                          });
                          setData((prev) => {
                            return {
                              ...prev,
                              rc_unit_type_refno:
                                dropdowndata.units[idx].rc_unit_type_refno,
                              unit: dropdowndata.units[idx].rc_unit_type_name,
                            };
                          });
                          setUnitDialogue(true);
                        } else {
                          setErrors((prev) => {
                            return {
                              ...prev,
                              unit: false,
                            };
                          });
                          setData((prev) => {
                            return {
                              ...prev,
                              rc_unit_type_refno:
                                dropdowndata.units[idx].rc_unit_type_refno,
                              unit: dropdowndata.units[idx].rc_unit_type_name,
                            };
                          });
                          setProductList({
                            list: [],
                            service_refno: "",
                            category_refno: "",
                          });
                        }
                      }
                    }}
                    isError={errors.unit}
                    selectedItem={data.unit}
                    reference={dropdownRef}
                  />
                  <HelperText type="error" visible={errors.unit}>
                    {communication.InvalidSalesUnit}
                  </HelperText>
                  <View>
                    <Checkbox.Item
                      label="Inclusive Material"
                      position="leading"
                      disabled={data.product_details.length > 0 ? true : false}
                      onPress={() => {
                        setData((prev) => {
                          return {
                            ...prev,
                            inclusive: !prev.inclusive,
                          };
                        });
                        setProductList({
                          list: [],
                          service_refno: "",
                          category_refno: "",
                        });
                      }}
                      labelStyle={{ textAlign: "left", paddingLeft: 8 }}
                      color={theme.colors.primary}
                      status={data.inclusive ? "checked" : "unchecked"}
                    />
                  </View>
                  <Button
                    mode="contained"
                    style={{ marginTop: 20 }}
                    icon="plus"
                    onPress={() => {
                      if (data.unit.length < 1) {
                        setErrors((prev) => {
                          return {
                            ...prev,
                            unit: true,
                          };
                        });
                      } else {
                        setProductList({
                          list: [],
                          service_refno: "",
                          category_refno: "",
                        });
                        setVisible2(true);
                      }
                    }}
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
              <View style={styles.container}>
                <ScrollView horizontal={true}>
                  <View>
                    <Table
                      borderStyle={{
                        borderWidth: 1,
                        borderColor: "#C1C0B9",
                      }}
                    >
                      <Row
                        data={[
                          "Service Product Name",
                          "Unit",
                          "Rate",
                          "Action",
                        ]}
                        widthArr={[150, 50, 110, 80]}
                        style={styles.header}
                        textStyle={styles.headertext}
                      />
                    </Table>
                    <ScrollView style={styles.dataWrapper}>
                      <Table
                        borderStyle={{
                          borderWidth: 1,
                          borderColor: "#C1C0B9",
                        }}
                      >
                        {data.product_details?.map((item, idx) => (
                          <TableWrapper
                            style={{ flexDirection: "row" }}
                            key={idx}
                          >
                            <Col
                              data={[item.product_name]}
                              height={50}
                              textStyle={styles.text}
                              width={150}
                            />
                            <Col
                              data={[item.unit_name]}
                              height={50}
                              textStyle={styles.text}
                              width={50}
                            />

                            <Col
                              data={[
                                <View style={{ padding: "6%" }}>
                                  <TextInput
                                    mode="outlined"
                                    dense
                                    disabled
                                    value={item.rate}
                                  />
                                </View>,
                              ]}
                              height={50}
                              textStyle={styles.text}
                              width={110}
                            />
                            <Col
                              data={[
                                <View style={{ padding: "6%" }}>
                                  <IconButton
                                    icon={"delete"}
                                    size={35}
                                    color="#198754"
                                    onPress={() => {
                                      setData((prev) => {
                                        return {
                                          ...prev,
                                          product_details: [
                                            ...prev.product_details.filter(
                                              (i) =>
                                                i.product_refno !==
                                                item.product_refno
                                            ),
                                          ],
                                        };
                                      });
                                    }}
                                  />
                                </View>,
                              ]}
                              height={50}
                              textStyle={styles.text}
                              width={80}
                            />
                          </TableWrapper>
                        ))}
                      </Table>
                    </ScrollView>
                  </View>
                </ScrollView>
              </View>
            </View>
            {data.product_details.length > 0 && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  mode="contained"
                  onPress={() => {
                    checkform();
                  }}
                  disabled={IsButtonLoading2}
                  style={[Styles.marginTop16, { width: "80%" }]}
                >
                  Submit
                </Button>
              </View>
            )}
          </ScrollView>
          <Snackbar
            visible={snackbarVisible}
            onDismiss={() => setSnackbarVisible(false)}
            duration={3000}
            style={{ backgroundColor: snackbarColor }}
          >
            {snackbarText}
          </Snackbar>
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
                      keyboardType={"number-pad"}
                      label="Contact Mobile No"
                      maxLength={10}
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
                    <View style={[Styles.marginTop8]}>
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
                    </View>

                    <TextInput
                      mode="outlined"
                      dense
                      label="Pincode"
                      maxLength={6}
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
                      maxLength={15}
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
                      maxLength={10}
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
                      disabled={IsButtonLoading}
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
          {/* Add ProductDetail */}
          <Portal>
            <Dialog
              visible={visible2}
              onDismiss={() => setVisible2(false)}
              style={[Styles.borderRadius8, { height: 600 }]}
            >
              <ScrollView>
                <Dialog.Title style={[Styles.fontSize16, Styles.textCenter]}>
                  Product List
                </Dialog.Title>
                <Dialog.Content>
                  <View>
                    <DropDown2
                      label="Service Name"
                      style={{ backgroundColor: "white", marginBottom: "3%" }}
                      data={
                        dropdowndata?.services?.length < 1
                          ? []
                          : dropdowndata.services.map(
                              (item) => item.service_name
                            )
                      }
                      onSelected={(selectedItem, idx) => {
                        if (
                          dropdowndata.services[idx].service_refno !==
                          productlist.service_refno
                        ) {
                          setProductList((prev) => {
                            return {
                              ...prev,
                              service_refno:
                                dropdowndata.services[idx].service_refno,
                              category_refno: "",
                              list: [],
                            };
                          });
                          setDropDownData((prev) => {
                            return {
                              ...prev,
                              categories: [],
                            };
                          });

                          fetchCategoriesData(
                            dropdowndata.services[idx].service_refno
                          );
                        }
                      }}
                      selectedItem={
                        dropdowndata.services.find(
                          (item) =>
                            item.service_refno === productlist.service_refno
                        )?.service_name
                      }
                    />
                    <View style={[Styles.marginTop8]}>
                      <DropDown2
                        label="Category Name"
                        style={{ backgroundColor: "white", marginBottom: "3%" }}
                        data={
                          dropdowndata?.categories?.length < 1
                            ? []
                            : dropdowndata.categories.map(
                                (item) => item.category_name
                              )
                        }
                        onSelected={(selectedItem, idx) => {
                          if (
                            dropdowndata.categories[idx].category_refno !==
                            productlist.category_refno
                          ) {
                            setProductList((prev) => {
                              return {
                                ...prev,
                                category_refno:
                                  dropdowndata.categories[idx].category_refno,
                                list: [],
                              };
                            });
                            fetchProductList(
                              dropdowndata.categories[idx].category_refno
                            );
                          }
                        }}
                        selectedItem={
                          dropdowndata.categories.find(
                            (item) =>
                              item.category_refno === productlist.category_refno
                          )?.category_name
                        }
                      />
                    </View>
                  </View>
                  <View style={styles.container}>
                    <ScrollView horizontal={true}>
                      <View>
                        <Table
                          borderStyle={{
                            borderWidth: 1,
                            borderColor: "#C1C0B9",
                          }}
                        >
                          <Row
                            data={[
                              "Service Product Name",
                              "Unit",
                              "Rate",
                              "Action",
                            ]}
                            widthArr={[150, 50, 110, 80]}
                            style={styles.header}
                            textStyle={styles.headertext}
                          />
                        </Table>
                        <ScrollView style={styles.dataWrapper}>
                          <Table
                            borderStyle={{
                              borderWidth: 1,
                              borderColor: "#C1C0B9",
                            }}
                          >
                            {productlist?.list?.map((item, idx) => (
                              <TableWrapper
                                style={{ flexDirection: "row" }}
                                key={idx}
                              >
                                <Col
                                  data={[item.product_name]}
                                  height={50}
                                  textStyle={styles.text}
                                  width={150}
                                />
                                <Col
                                  data={[item.unit_name]}
                                  height={50}
                                  textStyle={styles.text}
                                  width={50}
                                />
                                <Col
                                  data={[
                                    <View style={{ padding: "6%" }}>
                                      <TextInput
                                        mode="outlined"
                                        dense
                                        onChangeText={(text) => {
                                          setProductList((prev) => {
                                            let temp = [...prev.list];
                                            temp[idx].rate = text;
                                            return {
                                              ...prev,
                                              list: [...temp],
                                            };
                                          });
                                        }}
                                        value={item.rate}
                                      />
                                    </View>,
                                  ]}
                                  height={50}
                                  textStyle={styles.text}
                                  width={110}
                                />
                                <Col
                                  data={[
                                    <View style={{ padding: "6%" }}>
                                      <IconButton
                                        icon={"plus"}
                                        size={35}
                                        color="#198754"
                                        onPress={() => {
                                          if (
                                            item?.rate &&
                                            item?.rate.length > 0
                                          ) {
                                            if (
                                              data.product_details.find(
                                                (i) =>
                                                  i.product_refno ===
                                                  item.product_refno
                                              ) === undefined
                                            ) {
                                              setData((prev) => {
                                                return {
                                                  ...prev,
                                                  product_details: [
                                                    ...prev.product_details,
                                                    {
                                                      ...item,
                                                    },
                                                  ],
                                                };
                                              });
                                              setProductList((prev) => {
                                                return {
                                                  ...prev,
                                                  list: [
                                                    ...prev.list.filter(
                                                      (i) =>
                                                        i.product_refno !==
                                                        item.product_refno
                                                    ),
                                                  ],
                                                };
                                              });
                                            }
                                          } else {
                                            setSnackbarText(
                                              "Please enter rate."
                                            );
                                            setSnackbarColor(
                                              theme.colors.error
                                            );
                                            setSnackbarVisible(true);
                                          }
                                        }}
                                      />
                                    </View>,
                                  ]}
                                  height={50}
                                  textStyle={styles.text}
                                  width={80}
                                />
                              </TableWrapper>
                            ))}
                          </Table>
                        </ScrollView>
                      </View>
                    </ScrollView>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <Button
                      mode="contained"
                      onPress={() => {
                        setVisible2(false);
                      }}
                      style={[Styles.marginTop16, { flex: 1 }]}
                    >
                      Done
                    </Button>
                  </View>
                </Dialog.Content>
              </ScrollView>
            </Dialog>
          </Portal>

          {/* Change unit */}
          <Portal>
            <Dialog
              visible={unitdialogue}
              onDismiss={() => setUnitDialogue(false)}
              style={[Styles.borderRadius8]}
            >
              <Dialog.Title style={[Styles.fontSize16, Styles.textCenter]}>
                Do you confirm to change the Unit Of Sales? If OK, then your
                already added all products values automatically changed.
              </Dialog.Title>
              <Dialog.Content>
                <View
                  style={[
                    Styles.flexRow,
                    Styles.flexJustifyCenter,
                    Styles.flexAlignCenter,
                    Styles.marginTop16,
                  ]}
                ></View>
                <View></View>
                <Card.Content style={[Styles.marginTop16]}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      temp.fn();
                      setUnitDialogue(false);
                    }}
                  >
                    Ok
                  </Button>
                </Card.Content>
                <Card.Content style={[Styles.marginTop16]}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      setData((prev) => {
                        return {
                          ...prev,
                          unit: temp.unit.unit,
                          rc_unit_type_refno: temp.unit.quot_type_refno,
                        };
                      });
                      setUnitDialogue(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Card.Content>
              </Dialog.Content>
            </Dialog>
          </Portal>
          {console.log(data.unit)}
        </>
      )}
    </View>
  );
};

export default AddSendRateCard;
