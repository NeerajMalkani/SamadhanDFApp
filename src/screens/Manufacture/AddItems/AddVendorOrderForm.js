import React, { useEffect, useState, useRef, useMemo } from "react";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import { ScrollView, View, StyleSheet } from "react-native";
import { Styles } from "../../../styles/styles";
import Dropdown from "../../../components/Dropdown";
import Provider from "../../../api/Provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Table, TableWrapper, Row, Col } from "react-native-table-component";
import RBSheet from "react-native-raw-bottom-sheet";
import moment from "moment/moment";
import {
  Button,
  Card,
  HelperText,
  Snackbar,
  TextInput,
  Title,
  List,
} from "react-native-paper";
import { communication } from "../../../utils/communication";
import { theme } from "../../../theme/apptheme";

let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_CompanyAdmin_group_refno = 0;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: { height: 80, backgroundColor: theme.colors.primary },
  subheader: { height: 30, backgroundColor: "white" },
  text: { textAlign: "center", fontWeight: "400" },
  headertext: { textAlign: "center", fontWeight: "800", color: "white" },
  dataWrapper: { marginTop: -1 },
  row: { height: 50, backgroundColor: "white" },
});

function AddVendorOrderForm({ route, navigation }) {
  const refRBSheet = useRef();
  const [purchaseFullData, setPurchaseFullData] = React.useState([]);

  const [data, setData] = useState({
    mf_po_no: "",
    otherdata: {},
    coils_data: [],
    slitting_data: [],
    actual_ss_mm: "",
    total_weight: "",
    ss_mm: "",
    ss_kg: "",
  });

  const [error, setError] = useState({
    mf_po_no: false,
  });

  const [total, setTotal] = useState("");
  useEffect(() => {
    if (data.slitting_data.length > 0) {
      let x = parseFloat(0);
      data.slitting_data.map((item) => {
        x = parseFloat(parseFloat(x) + parseFloat(item.total));
      });
      setTotal(String(x));
    }
  }, [data.slitting_data]);

  useEffect(() => {
    if (total.length > 0 && data.actual_ss_mm.length > 0) {
      setData((prev) => {
        return {
          ...prev,
          ss_mm: String(
            parseFloat(parseFloat(prev.actual_ss_mm) - parseFloat(total))
          ),
        };
      });
    }
  }, [total, data.actual_ss_mm]);
  useEffect(() => {
    if (
      String(data.total_weight).length > 0 &&
      String(data.otherdata.gpcoil_width_value).length > 0 &&
      String(data.ss_mm).length > 0
    ) {
      setData((prev) => {
        return {
          ...prev,
          ss_kg: String(
            parseFloat((parseFloat(data.total_weight) /
            (parseFloat(data.otherdata.gpcoil_width_value) * 1000)) *
            parseFloat(data.ss_mm)).toFixed(3)
          ),
        };
      });
    }
  }, [data.total_weight, data.otherdata.gpcoil_width_value, data.ss_mm]);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const ValidateData = () => {
    let isValid = true;
    if (data.mf_po_no.length === 0) {
      setError((prev) => {
        return {
          ...prev,
          mf_po_no: true,
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
      let temp = purchaseFullData.find(
        (item) => item.purchaseorderno === data.mf_po_no
      );
      const params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          mf_po_refno: temp ? temp.mf_po_refno : route.params.data.mf_po_refno,
          mf_vo_refno: route.params.data.mf_vo_refno,
          total_weight: data.total_weight,
          scrab_wastage: data.ss_mm,
          scrab_wastage_kg: data.ss_kg,
          product_refno: {},
          brand_refno: {},
          no_of_qty: {},
          width_mm_value: {},
          total: {},
          length_mtr_value: {},
        },
      };
      data.slitting_data.map((item, i) => {
        params.data.product_refno[i + 1] = item.product_refno;
        params.data.brand_refno[i + 1] = item.brand_refno;
        params.data.no_of_qty[i + 1] =
          parseInt(item.total) == 0 ? "Select" : item.no_of_qty;
        params.data.width_mm_value[i + 1] = item.width_mm_value;
        params.data.total[i + 1] = item.total;
        params.data.length_mtr_value[i + 1] = item.length_mtr_value;
      });
      console.log("api", params);
      Provider.createDFManufacturer(
        Provider.API_URLS.vendororderformupdate,
        params
      )
        .then((response) => {
          console.log("resp", response.data);
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
          setSnackbarText(communication.NetworkError);
          setSnackbarVisible(true);
        })
        .finally(() => setIsButtonLoading(false));
    } else {
      let temp = purchaseFullData.find(
        (item) => item.purchaseorderno === data.mf_po_no
      );
      const params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          mf_po_refno: temp ? temp.mf_po_refno : route.params.data.mf_po_refno,
          total_weight: data.total_weight,
          scrab_wastage: data.ss_mm,
          scrab_wastage_kg: data.ss_kg,
          product_refno: {},
          brand_refno: {},
          no_of_qty: {},
          width_mm_value: {},
          total: {},
          length_mtr_value: {},
        },
      };
      data.slitting_data.map((item, i) => {
        params.data.product_refno[i + 1] = item.product_refno;
        params.data.brand_refno[i + 1] = item.brand_refno;
        params.data.no_of_qty[i + 1] =
          parseInt(item.total) == 0 ? "Select" : item.no_of_qty;
        params.data.width_mm_value[i + 1] = item.width_mm_value;
        params.data.total[i + 1] = item.total;
        params.data.length_mtr_value[i + 1] = item.length_mtr_value;
      });
      Provider.createDFManufacturer(
        Provider.API_URLS.vendororderformcreate,
        params
      )
        .then((response) => {
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

  const FetchServiceNames = () => {
    const params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
      },
    };
    Provider.createDFManufacturer(
      Provider.API_URLS.get_purchaseorderno_vendororderform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            console.log("purchase order no", response.data.data);
            setPurchaseFullData(() => {
              return response.data.data;
            });
          }
        }
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    if (data.mf_po_no !== "") {
      let temp = purchaseFullData.find(
        (item) => item.purchaseorderno === data.mf_po_no
      );
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          mf_po_refno: temp ? temp.mf_po_refno : route.params.data.mf_po_refno,
          mf_vo_refno:
            route.params.type == "edit"
              ? data.mf_po_no === route.params.data.mf_po_no
                ? route.params.data.mf_vo_refno
                : "0"
              : "0",
        },
      };

      Provider.createDFManufacturer(
        Provider.API_URLS.get_purchaseorderno_otherdata_vendororderform,
        params
      )
        .then((response) => {
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              setData((prev) => {
                return {
                  ...prev,
                  otherdata: response.data.data[0],
                  actual_ss_mm: String(
                    parseFloat(
                      parseFloat(response.data.data[0].gpcoil_width_value) *
                        1000
                    )
                  ),
                };
              });
            }
          }
        })
        .catch((e) => console.log(e));

      Provider.createDFManufacturer(
        Provider.API_URLS.get_coildetails_vendororderform,
        params
      )
        .then((response) => {
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              let x = parseFloat(0);
              response.data.data.map((item) => {
                x = parseFloat(item.weight) + x;
              });
              setData((prev) => {
                return {
                  ...prev,
                  coils_data: response.data.data,
                  total_weight: String(x),
                };
              });
            }
          }
        })
        .catch((e) => console.log(e));

      Provider.createDFManufacturer(
        Provider.API_URLS.get_slittingdetails_vendororderform,
        params
      )
        .then((response) => {
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              setData((prev) => {
                return {
                  ...prev,
                  slitting_data: response.data.data,
                };
              });
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [data.mf_po_no]);

  const GetUserID = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData !== null) {
        Sess_UserRefno = JSON.parse(userData).UserID;
        Sess_company_refno = JSON.parse(userData).Sess_company_refno;
        Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
        Sess_CompanyAdmin_UserRefno =
          JSON.parse(userData).Sess_CompanyAdmin_UserRefno;
        Sess_CompanyAdmin_group_refno =
          JSON.parse(userData).Sess_CompanyAdmin_group_refno;
        FetchServiceNames();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    GetUserID();
  }, []);

  return (
    <View style={[Styles.flex1]}>
      <ScrollView
        style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[Styles.padding16]}>
          <View style={[Styles.paddingTop16]}>
            <Dropdown
              label="Purchase Order No"
              data={
                route.params.type === "edit"
                  ? [
                      ...new Set([
                        route.params.data.mf_po_no,
                        ...purchaseFullData.map((item) => item.purchaseorderno),
                      ]),
                    ]
                  : purchaseFullData.map((item) => item.purchaseorderno)
              }
              onSelected={(selectedItem) => {
                if (selectedItem !== data.mf_po_no) {
                  setData((prev) => {
                    return {
                      ...prev,
                      mf_po_no: selectedItem === "Select" ? "" : selectedItem,
                      otherdata: {},
                      coils_data: [],
                      slitting_data: [],
                    };
                  });
                  setError((prev) => {
                    return {
                      ...prev,
                      mf_po_no: false,
                    };
                  });
                }
              }}
              isError={error.mf_po_no}
              selectedItem={data.mf_po_no}
            />
          </View>
          <HelperText type="error" visible={error.mf_po_no}>
            {communication.InvalidServiceName}
          </HelperText>
          {route.params.type == "edit" && (
            <TextInput
              mode="outlined"
              label="Job Order No"
              value={route.params.data?.job_order_no}
              disabled={true}
              dense
              style={{ marginBottom: 10 }}
            />
          )}
          {data.otherdata?.order_date && (
            <Button mode="contained" onPress={() => refRBSheet.current.open()}>
              View Full Details
            </Button>
          )}

          {data.coils_data.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Title
                style={{
                  textAlign: "left",
                  fontSize: 15,
                  color: theme.colors.primary,
                }}
              >
                COIL DETAILS
              </Title>
              <View style={styles.container}>
                <ScrollView horizontal={true}>
                  <View>
                    <Table
                      borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}
                    >
                      <Row
                        data={["Coils #", "Weight (Kg)", "Length (Mtr)"]}
                        widthArr={[50, 100, 100]}
                        style={styles.header}
                        textStyle={styles.headertext}
                      />
                    </Table>

                    <ScrollView style={styles.dataWrapper}>
                      <Table
                        borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}
                      >
                        {data.coils_data.map((item, index) => {
                          return (
                            <TableWrapper
                              style={{ flexDirection: "row" }}
                              key={index}
                            >
                              <Col
                                data={[index + 1]}
                                height={40}
                                textStyle={styles.text}
                                width={50}
                              />
                              <Col
                                data={[item.weight]}
                                height={40}
                                textStyle={styles.text}
                                width={100}
                              />
                              <Col
                                data={[item.length]}
                                height={40}
                                textStyle={styles.text}
                                width={100}
                              />
                            </TableWrapper>
                          );
                        })}
                      </Table>
                    </ScrollView>
                  </View>
                </ScrollView>
              </View>
            </View>
          )}

          <View style={{ marginTop: 10 }}>
            <Title
              style={{
                textAlign: "left",
                fontSize: 15,
                color: theme.colors.primary,
              }}
            >
              Slitting Details
            </Title>
            {/* {data.slitting_data.length > 0 && (
              <View>
                <Button
                  onPress={() => {
                    setData((prev) => {
                      return {
                        ...prev,
                        slitting_data: prev.slitting_data.map((item) => {
                          return {
                            ...item,
                            total: "0",
                            no_of_qty: "Select",
                          };
                        }),
                      };
                    });
                  }}
                >
                  Reset Slitting Details
                </Button>
              </View>
            )} */}
            <View style={styles.container}>
              <ScrollView horizontal={true}>
                <View>
                  <Table
                    borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}
                  >
                    <Row
                      data={[
                        "Sr.\nNo",
                        "Product Name » \n Brand",
                        "No.",
                        "Raw \nMaterial \nwidth \n(MM)",
                        "Total",
                      ]}
                      widthArr={[30, 150, 90, 100, 100]}
                      style={styles.header}
                      textStyle={styles.headertext}
                    />
                  </Table>
                  <ScrollView style={styles.dataWrapper}>
                    <Table
                      borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}
                    >
                      {data.slitting_data.length > 0 ? (
                        data.slitting_data.map((item, index) => {
                          return (
                            <TableWrapper
                              style={{ flexDirection: "row" }}
                              key={index}
                            >
                              <Col
                                data={[index + 1]}
                                height={60}
                                textStyle={styles.text}
                                width={30}
                              />
                              <Col
                                data={[
                                  `${item.product_name} >>\n ${item.brand_name}`,
                                ]}
                                height={60}
                                textStyle={styles.text}
                                width={150}
                              />
                              <Col
                                data={[
                                  <View style={{ padding: 10 }}>
                                    <Dropdown
                                      data={[
                                        "Select",
                                        ...Array.from(
                                          {
                                            length: 100,
                                          },
                                          (_, i) => String(i + 1)
                                        ),
                                      ]}
                                      label=""
                                      selectedItem={
                                        parseInt(item.total) == 0
                                          ? "Select"
                                          : item.no_of_qty
                                      }
                                      onSelected={(selectedItem) => {
                                        if (selectedItem !== "Select") {
                                          setData((prev) => {
                                            return {
                                              ...prev,
                                              slitting_data:
                                                prev.slitting_data.map(
                                                  (current, idx) => {
                                                    if (idx !== index) {
                                                      return current;
                                                    } else {
                                                      return {
                                                        ...current,
                                                        total: String(
                                                          parseFloat(
                                                            item.width_mm_value
                                                          ) *
                                                            parseFloat(
                                                              selectedItem
                                                            )
                                                        ),
                                                        no_of_qty: selectedItem,
                                                      };
                                                    }
                                                  }
                                                ),
                                            };
                                          });
                                        } else {
                                          setData((prev) => {
                                            return {
                                              ...prev,
                                              slitting_data:
                                                prev.slitting_data.map(
                                                  (current, idx) => {
                                                    if (idx !== index) {
                                                      return current;
                                                    } else {
                                                      return {
                                                        ...current,
                                                        total: 0,
                                                        no_of_qty: selectedItem,
                                                      };
                                                    }
                                                  }
                                                ),
                                            };
                                          });
                                        }
                                      }}
                                    />
                                  </View>,
                                ]}
                                height={60}
                                textStyle={styles.text}
                                width={90}
                              />
                              <Col
                                data={[item.width_mm_value]}
                                height={60}
                                textStyle={styles.text}
                                width={100}
                              />
                              <Col
                                data={[item.total]}
                                height={60}
                                textStyle={styles.text}
                                width={100}
                              />
                            </TableWrapper>
                          );
                        })
                      ) : (
                        <></>
                      )}
                      <TableWrapper style={{ flexDirection: "row" }}>
                        <Col
                          data={["Total (mm)"]}
                          height={60}
                          textStyle={styles.text}
                          width={370}
                        />
                        <Col
                          data={[total]}
                          height={60}
                          textStyle={styles.text}
                          width={100}
                        />
                      </TableWrapper>
                    </Table>
                  </ScrollView>
                </View>
              </ScrollView>
            </View>
          </View>

          <TextInput
            mode="outlined"
            style={{ marginTop: 10 }}
            label="Slitting Scrap (mm)"
            value={data.ss_mm}
            disabled={true}
            dense
          />
          <TextInput
            mode="outlined"
            style={{ marginTop: 10 }}
            label="Slitting Scrap (kg)"
            value={data.ss_kg}
            disabled={true}
            dense
          />
          <TextInput
            mode="outlined"
            style={{ marginTop: 10 }}
            label="Total Weight"
            value={data.total_weight}
            disabled={true}
            dense
          />
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
            Save
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
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={600}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>
            {data.otherdata.order_date}
          </Title>
          <ScrollView>
            <List.Item
              title="Order Date"
              description={data.otherdata.order_date}
            />
            <List.Item
              title="Vendor Address"
              description={`${data.otherdata?.vendor_address?.user_company_name}, ${data.otherdata?.vendor_address?.user_address}, ${data.otherdata?.vendor_address?.user_districtname}, ${data.otherdata?.vendor_address?.user_statename}\nPhone No: ${data.otherdata?.vendor_address?.user_contact_person_mobile_no}.`}
            />
            <List.Item
              title="Delivery / Factory Address ( MFG Unit )"
              description={`${data.otherdata?.delivery_address?.delivery_company_name}, ${data.otherdata?.delivery_address?.delivery_address}, ${data.otherdata?.delivery_address?.delivery_location_name} - ${data.otherdata?.delivery_address?.delivery_pincode}, ${data.otherdata?.delivery_address?.user_statename}, GSTIN: ${data.otherdata?.delivery_address?.delivery_gst_no}`}
            />
            <List.Item
              title="Manufacturer Brand"
              description={data.otherdata.manufacturer_brand}
            />
            <List.Item
              title="Total Weight of Coil (Kg)"
              description={data.otherdata.total_weight}
            />
            <List.Item
              title="Average Thickness"
              description={data.otherdata.avg_thickness}
            />
            <List.Item
              title="Thickness Of Raw Material (mm)"
              description={data.otherdata.thickness_raw_material}
            />
            <List.Item
              title="Width of GP Coil (Mtr)"
              description={data.otherdata.gpcoil_width_value}
            />
            <List.Item
              title="Number of GP Coil"
              description={data.otherdata.no_gpcoil}
            />
            <List.Item
              title="Total Length of Coil (Mtr)"
              description={data.otherdata.total_length}
            />
            <List.Item
              title="Order Description"
              description={data.otherdata.order_description}
            />
            <List.Item title="" description={""} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
}

export default AddVendorOrderForm;
