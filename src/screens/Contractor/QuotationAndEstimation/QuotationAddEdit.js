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
const styles = StyleSheet.create({
  container: { marginTop: 10, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: theme.colors.primary },
  subheader: { height: 30, backgroundColor: "white" },
  text: { textAlign: "center", fontWeight: "400" },
  headertext: { textAlign: "center", fontWeight: "800", color: "white" },
  dataWrapper: { marginTop: -1 },
  row: { height: 50, backgroundColor: "white" },
});
const QuotationAddEditTab = ({
  route,
  navigation,
  index1,
  type,
  set,
  unload,
  fetch,
  setType,
  snack,
}) => {
  //#region Variable
  const [isLoading, setIsLoading] = React.useState(true);

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
    quot_unit_type_refno: "",
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
      const data = await Provider.getdropdowndata(params);
      setDropDownData((prev) => {
        return {
          ...prev,
          ...data,
        };
      });
      if (type == "add") {
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
        cont_quot_refno: type,
      },
    };
    Provider.createDFContractor(
      Provider.API_URLS.contractor_quotation_contquotrefnocheck,
      params
    )
      .then((response) => {
        if (response.data && response.data.data) {
          fetchClientData(response.data.data[0].client_user_refno);
          fetchDistrictData(response.data.data[0].state_refno, "dropdown2");
          setData((prev) => {
            return {
              ...prev,
              client_name:
                data.clients[0].client_data[
                response.data.data[0].client_user_refno
                ],
              project_name: response.data.data[0].project_name,
              contact_person: response.data.data[0].contact_person,
              contact_person_mobile_no: response.data.data[0].contact_mobile_no,
              project_description: response.data.data[0].project_desc,
              state_refno: response.data.data[0].state_refno,
              district_refno: response.data.data[0].district_refno,
              project_site_address: response.data.data[0].project_address,
              unit: data.units.find(
                (item) =>
                  item.quot_unit_type_refno ==
                  response.data.data[0].quot_unit_type_refno
              ).quot_unit_type_name,
              quot_unit_type_refno: response.data.data[0].quot_unit_type_refno,
              product_details: response.data.data[0].ProductDetails,
              inclusive:
                response.data.data[0].quot_type_refno == "1" ? true : false,
              terms: response.data.data[0].terms_condition,
              send_to_client: true,
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
    if (index1 == 0) {
      setIsLoading(true);
      setDropDownData({
        clients: [],
        states: [],
        cities1: [],
        cities2: [],
        units: [],
        services: [],
        categories: [],
      });
      setProductList({
        list: [],
        service_refno: "",
        category_refno: "",
      });
      setNewClient({
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
      setNewClientErrors({
        company_name: false,
        contact_person_mobile_no: false,
        address: false,
        state_refno: false,
        district_refno: false,
      });
      setErrors({
        client_name: false,
        project_name: false,
        project_site_address: false,
        unit: false,
      });
      setData({
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
        inclusive: false,
        terms: "",
        send_to_client: true,
      });
      setTotal("");
      setIsButtonLoading(false);
      GetUserID();
    }
  }, [index1, type]);

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
      Provider.API_URLS.contractor_getcategoryname_popup_quotationform,
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
        quot_type_refno: data.inclusive ? "1" : "2",
        quot_unit_type_refno: data.quot_unit_type_refno,
      },
    };
    Provider.createDFContractor(
      Provider.API_URLS.contractor_getproductlist_popup_quotationform,
      params
    )
      .then((response) => {
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
        quot_unit_type_refno: ref,
        product_refno: [],
        unit_category_refno: [],
        unit_refno: [],
        qty: [],
        rate: [],
        remarks: [],
      },
    };
    data.product_details.map((item, idx) => {
      params.data.product_refno[idx] = item.product_refno;
      params.data.unit_category_refno[idx] = item.unit_category_refno;
      params.data.unit_refno[idx] = item.unit_refno;
      params.data.qty[idx] = item.qty;
      params.data.rate[idx] = item.rate;
      params.data.remarks[idx] = item.remarks;
    });
    Provider.createDFContractor(
      Provider.API_URLS
        .contractor_getproductlist_quot_unit_type_refno_onchange_quotationform,
      params
    )
      .then((response) => {
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
  useEffect(() => {
    let temp = 0;
    data.product_details.map((item) => {
      temp = parseFloat(temp) + parseFloat(item.qty) * parseFloat(item.rate);
    });
    setTotal(String(temp.toFixed(2)));
  }, [data.product_details]);

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
        project_name: data.project_name,
        contact_person: data.contact_person,
        contact_mobile_no: data.contact_person_mobile_no,
        project_desc: data.project_description,
        project_address: data.project_site_address,
        state_refno: data.state_refno,
        district_refno: data.district_refno,
        quot_unit_type_refno: data.quot_unit_type_refno,
        quot_type_refno: data.inclusive ? "1" : "2",
        product_refno: [],
        unit_refno: [],
        qty: [],
        rate: [],
        amount: [],
        remarks: [],
        terms_condition: data.terms,
        client_send_status: data.send_to_client ? "1" : "0",
      },
    };
    data.product_details.map((item, idx) => {
      params.data.product_refno[idx] = item.product_refno;
      params.data.unit_refno[idx] = item.unit_refno;
      params.data.qty[idx] = item.qty;
      params.data.rate[idx] = item.rate;
      params.data.amount[idx] = String(
        (parseFloat(item.qty) * parseFloat(item.rate)).toFixed(2)
      );
      params.data.remarks[idx] = item.remarks;
    });

    set(true);
    Provider.createDFContractor(
      Provider.API_URLS.contractor_quotation_create,
      params
    )
      .then((response) => {
        if (response.data && response.data.data.Created == 1) {
          data.send_to_client
            ? fetch(2, "Quotation Created & Sent Successfully!")
            : fetch(1, "Quotation Created Successfully!");
          set(false);
        } else {
          unload(response.data.message);
        }
      })
      .catch((e) => {
        unload("Quotation Add error");
        console.log(e);
      });
  };

  const EditQuotation = () => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
        cont_quot_refno: type,
        client_user_refno: Object.entries(
          dropdowndata?.clients[0]?.client_data
        ).find(([key, value]) => data.client_name == value)[0],
        project_name: data.project_name,
        contact_person: data.contact_person,
        contact_mobile_no: data.contact_person_mobile_no,
        project_desc: data.project_description,
        project_address: data.project_site_address,
        state_refno: data.state_refno,
        district_refno: data.district_refno,
        quot_unit_type_refno: data.quot_unit_type_refno,
        quot_type_refno: data.inclusive ? "1" : "2",
        product_refno: [],
        unit_refno: [],
        qty: [],
        rate: [],
        amount: [],
        remarks: [],
        terms_condition: data.terms,
        client_send_status: data.send_to_client ? "1" : "0",
      },
    };
    data.product_details.map((item, idx) => {
      params.data.product_refno[idx] = item.product_refno;
      params.data.unit_refno[idx] = item.unit_refno;
      params.data.qty[idx] = item.qty;
      params.data.rate[idx] = item.rate;
      params.data.amount[idx] = String(
        (parseFloat(item.qty) * parseFloat(item.rate)).toFixed(2)
      );
      params.data.remarks[idx] = item.remarks;
    });

    set(true);
    Provider.createDFContractor(
      Provider.API_URLS.contractor_quotation_update,
      params
    )
      .then((response) => {
        if (response.data && response.data.data.Updated == 1) {
          data.send_to_client
            ? fetch(2, "Quotation Updated & Sent Successfully!")
            : fetch(1, "Quotation Updated Successfully!");
          setIsLoading(true);
          set(false);
        } else {
          setIsLoading(true);
          unload(response.data.message);
        }
      })
      .catch((e) => {
        unload("Quotation Update error");
        console.log(e);
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
    if (data.project_name.length < 1) {
      setErrors((prev) => {
        return {
          ...prev,
          project_name: true,
        };
      });
      isValid = false;
    }
    if (data.project_site_address.length < 1) {
      setErrors((prev) => {
        return {
          ...prev,
          project_site_address: true,
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
      if (type == "add") {
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
                    label="Contact Number"
                    value={data.contact_person_mobile_no}
                    keyboardType={"number-pad"}
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
                  <View style={[Styles.marginTop8]}>
                    <Dropdown
                      label="City"
                      style={{ backgroundColor: "white", marginBottom: "3%" }}
                      data={
                        dropdowndata?.cities2?.length < 1
                          ? []
                          : dropdowndata.cities2.map(
                            (item) => item.district_name
                          )
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
                                  dropdowndata.units[idx].quot_unit_type_refno
                                );
                              },
                              unit: {
                                unit: data.unit,
                                quot_unit_type_refno: data.quot_unit_type_refno,
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
                              quot_unit_type_refno:
                                dropdowndata.units[idx].quot_unit_type_refno,
                              unit: dropdowndata.units[idx].quot_unit_type_name,
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
                              quot_unit_type_refno:
                                dropdowndata.units[idx].quot_unit_type_refno,
                              unit: dropdowndata.units[idx].quot_unit_type_name,
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
                          "Quantity",
                          "Rate",
                          "Amount",
                          "Remarks",
                          "Action",
                        ]}
                        widthArr={[150, 50, 110, 110, 110, 120, 80]}
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
                                    disabled
                                    value={item?.qty ? item.qty : ""}
                                    dense
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
                                  <TextInput
                                    disabled
                                    mode="outlined"
                                    dense
                                    value={String(
                                      (
                                        parseFloat(item.qty) *
                                        parseFloat(item.rate)
                                      ).toFixed(2)
                                    )}
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
                                  <TextInput
                                    mode="outlined"
                                    dense
                                    value={item?.remarks ? item.remarks : ""}
                                  />
                                </View>,
                              ]}
                              height={50}
                              textStyle={styles.text}
                              width={120}
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
                    <Table
                      borderStyle={{
                        borderWidth: 1,
                        borderColor: "#C1C0B9",
                      }}
                    >
                      <Row
                        data={["Sub Total", total, ""]}
                        widthArr={[420, 110, 200]}
                        style={styles.row}
                        textStyle={{ textAlign: "center" }}
                      />
                    </Table>
                  </View>
                </ScrollView>
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
              <TextInput
                multiline
                mode="outlined"
                dense
                label="Terms & Condition"
                returnKeyType="next"
                onChangeText={(text) => {
                  setData((prev) => {
                    return {
                      ...prev,
                      terms: text,
                    };
                  });
                }}
                value={data.terms}
                style={{ backgroundColor: "white" }}
              />
            </View>
            {/* <RichTextBox /> */}
            {data.product_details.length > 0 && (
              <View>
                <Checkbox.Item
                  label="Send To Client"
                  position="leading"
                  onPress={() => {
                    setData((prev) => {
                      return {
                        ...prev,
                        send_to_client: !prev.send_to_client,
                      };
                    });
                  }}
                  labelStyle={{ textAlign: "left", paddingLeft: 8 }}
                  color={theme.colors.primary}
                  status={data.send_to_client ? "checked" : "unchecked"}
                />
              </View>
            )}
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
                      keyboardType={"number-pad"}
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
                              "Quantity",
                              "Rate",
                              "Amount",
                              "Remarks",
                              "Action",
                            ]}
                            widthArr={[150, 50, 110, 110, 110, 120, 80]}
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
                                        keyboardType="number-pad"
                                        onChangeText={(text) => {
                                          setProductList((prev) => {
                                            let temp = [...prev.list];
                                            temp[idx].qty = text;
                                            return {
                                              ...prev,
                                              list: [...temp],
                                            };
                                          });
                                        }}
                                        value={item?.qty ? item.qty : ""}
                                        dense
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
                                      <TextInput
                                        disabled
                                        mode="outlined"
                                        dense
                                        value={
                                          item.qty !== undefined &&
                                            item.qty !== "" &&
                                            item.rate !== ""
                                            ? String(
                                              (
                                                parseFloat(item.qty) *
                                                parseFloat(item.rate)
                                              ).toFixed(2)
                                            )
                                            : ""
                                        }
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
                                      <TextInput
                                        mode="outlined"
                                        dense
                                        onChangeText={(text) => {
                                          setProductList((prev) => {
                                            let temp = [...prev.list];
                                            temp[idx].remarks = text;
                                            return {
                                              ...prev,
                                              list: [...temp],
                                            };
                                          });
                                        }}
                                        value={
                                          item?.remarks ? item.remarks : ""
                                        }
                                      />
                                    </View>,
                                  ]}
                                  height={50}
                                  textStyle={styles.text}
                                  width={120}
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
                                            item?.qty &&
                                            item?.qty.length > 0 &&
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
                                                      remarks: item.remarks
                                                        ? item.remarks
                                                        : "",
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
                                          }
                                          else {
                                            setSnackbarText("Please enter quantity and rate.");
                                            setSnackbarColor(theme.colors.error);
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
                          quot_unit_type_refno: temp.unit.quot_type_refno,
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

export default QuotationAddEditTab;
