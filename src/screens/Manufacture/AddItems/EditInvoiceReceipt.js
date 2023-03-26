import { View, ScrollView, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { TextInput, Button, Snackbar } from "react-native-paper";
import { Styles } from "../../../styles/styles";
import Dropdown from "../../../components/Dropdown";
import { Table, TableWrapper, Row, Col } from "react-native-table-component";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { theme } from "../../../theme/apptheme";
import { useIsFocused } from "@react-navigation/native";
import Provider from "../../../api/Provider";
import { communication } from "../../../utils/communication";
let user = null;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 10, backgroundColor: "#fff" },
  header: { height: 70, backgroundColor: theme.colors.primary },
  subheader: { height: 30, backgroundColor: "white" },
  text: { textAlign: "center", fontWeight: "100" },
  headertext: { textAlign: "center", fontWeight: "800", color: "white" },
  dataWrapper: { marginTop: -1 },
  row: { height: 50, backgroundColor: "white" },
});

const EditInvoiceReceipt = ({ route, navigation }) => {
  console.log("data", route.params.data);
  const [state, setState] = useState({
    mf_po_refno: "",
    mf_vo_refno: "",
    cgst: "",
    sgst: "",
    igst: "",
    invoice_no: route.params.data.invoice_no,
    invoice_entry_date: route.params.data.invoice_entry_date,
    invoice_date: new Date(
      route.params.data.invoice_date.substring(6, 11) +
      "/" +
      route.params.data.invoice_date.substring(3, 5) +
      "/" +
      route.params.data.invoice_date.substring(0, 2)
    ),
    transport_charges: route.params.data.transport_charges,
  });
  const onChange = (text, name) => {
    setState((state) => ({ ...state, [name]: text }));
  };
  const isFocused = useIsFocused();
  const [purchaseno, setPurchaseNo] = useState([]);
  const [joborderno, setJobOrderNo] = useState([]);
  const [production, setProduction] = useState([]);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );
  const [isbuttonLoading, setIsButtonLoading] = useState(false);
  const [errors, setErrors] = useState({
    mf_po_refno: false,
    mf_vo_refno: false,
    invoice_no: false,
    transport_charges: false,
    cgst: false,
    igst: false,
    sgst: false,
  });
  const fetchPurchaseOrderNo = () => {
    Provider.createDFManufacturer(
      Provider.API_URLS.get_purchaseorderno_vendororder_invoiceform,
      {
        data: {
          Sess_UserRefno: user.UserID,
          Sess_company_refno: user.Sess_company_refno,
          Sess_branch_refno: user.Sess_branch_refno,
        },
      }
    ).then((res) => {
      if (res.data.data) {
        setPurchaseNo(res.data.data);
        console.log("data2", route.params.data);
        setState((prev) => {
          return {
            ...prev,
            mf_po_refno: route.params.data.mf_po_no,
            cgst: route.params.data.cgst,
            igst: route.params.data.igst,
            sgst: route.params.data.sgst,
          };
        });
      }
    });
  };

  const fetchOtherData = (mf_po_refno) => {
    Provider.createDFManufacturer(
      Provider.API_URLS.get_purchaseorderno_otherdata_vendororder_invoiceform,
      {
        data: {
          Sess_UserRefno: user.UserID,
          Sess_company_refno: user.Sess_company_refno,
          Sess_branch_refno: user.Sess_branch_refno,
          mf_po_refno,
        },
      }
    ).then((res) => {
      if (res.data.data) {
        console.log(res.data.data);
        setState((state) => ({ ...state, ...res.data.data[0] }));
      }
    });

    Provider.createDFManufacturer(
      Provider.API_URLS.get_joborderno_vendororder_invoiceform,
      {
        data: {
          Sess_UserRefno: user.UserID,
          Sess_company_refno: user.Sess_company_refno,
          Sess_branch_refno: user.Sess_branch_refno,
          mf_po_refno,
        },
      }
    )
      .then((res) => {
        if (res.data.code == "200" && res.data.data) {
          setJobOrderNo(res.data.data);
          let temp = res.data.data.find(
            (item) => item.mf_vo_refno == route.params.data.mf_vo_refno
          );
          setState((prev) => {
            return {
              ...prev,
              mf_vo_refno: temp ? temp.joborderno : "",
            };
          });
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchUser = async () => {
    const data = await AsyncStorage.getItem("user");
    if (data) {
      user = JSON.parse(data);
      fetchPurchaseOrderNo();
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchUser();
    }
  }, [isFocused]);

  const add = () => {
    let params = {
      data: {
        Sess_UserRefno: user.UserID,
        Sess_company_refno: user.Sess_company_refno,
        Sess_branch_refno: user.Sess_branch_refno,
        cgst: state.cgst,
        sgst: state.sgst,
        igst: state.igst,
        mf_po_refno: purchaseno.find(
          (item) => item.purchaseorderno === state.mf_po_refno
        )?.mf_po_refno,
        mf_vo_refno: joborderno.find(
          (item) => item.joborderno === state.mf_vo_refno
        ).mf_vo_refno,
        invoice_no: state.invoice_no,
        invoice_entry_date: state.invoice_entry_date,
        invoice_date: state.invoice_date,
        transport_charges: state.transport_charges,
        product_refno: {},
        brand_refno: {},
        weightper_piece: {},
        total_no_products: {},
        coils_received: {},
        mf_vo_invoice_refno: route.params.data.mf_vo_invoice_refno,
      },
    };
    production.map((item, i) => {
      params.data.product_refno[i] = item.product_refno;
      params.data.brand_refno[i] = item.brand_refno;
      params.data.weightper_piece[i] = item.weightper_piece;
      params.data.total_no_products[i] = item.total_no_products;
      params.data.coils_received[i] = item.coils_received;
    });
    Provider.createDFManufacturer(
      Provider.API_URLS.vendororder_invoiceformupdate,
      params
    )
      .then((response) => {
        if (response.data && response.data.data.Created == 1) {
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
  };

  const ValidateData = () => {
    let isValid = true;
    if (state.cgst === "") {
      setErrors((prev) => {
        return { ...prev, cgst: true };
      });
      isValid = false;
    }
    if (state.sgst === "") {
      setErrors((prev) => {
        return { ...prev, sgst: true };
      });
      isValid = false;
    }
    if (state.igst === "") {
      setErrors((prev) => {
        return { ...prev, igst: true };
      });
      isValid = false;
    }
    if (state.mf_po_refno.length === 0) {
      setErrors((prev) => {
        return { ...prev, mf_po_refno: true };
      });
      isValid = false;
    }
    if (state.mf_vo_refno.length === 0) {
      setErrors((prev) => {
        return { ...prev, mf_vo_refno: true };
      });
      isValid = false;
    }
    if (state.invoice_no.length === 0) {
      setErrors((prev) => {
        return { ...prev, invoice_no: true };
      });
      isValid = false;
    }
    if (state.transport_charges.length === 0) {
      setErrors((prev) => {
        return { ...prev, transport_charges: true };
      });
      isValid = false;
    }

    if (isValid) {
      setIsButtonLoading(true);
      add();
    }
  };
  const fetchProduction = (mf_vo_refno) => {
    let params = {
      data: {
        Sess_UserRefno: user.UserID,
        Sess_company_refno: user.Sess_company_refno,
        Sess_branch_refno: user.Sess_branch_refno,
        mf_po_refno: purchaseno.find(
          (item) => item.purchaseorderno === state.mf_po_refno
        )?.mf_po_refno,
        mf_vo_refno: mf_vo_refno.mf_vo_refno,
        mf_vo_invoice_refno: route.params.data.mf_vo_invoice_refno,
      },
    };
    Provider.createDFManufacturer(
      Provider.API_URLS.get_orderproductioncalculation_vendororder_invoiceform,
      params
    )
      .then((res) => {
        if (res.data.code == "200" && res.data.data) {
          console.log(res.data.data);
          setProduction(res.data.data);
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (state.mf_po_refno.length > 0 && purchaseno.length > 0) {
      fetchOtherData(
        purchaseno.find((item) => item.purchaseorderno === state.mf_po_refno)
          ?.mf_po_refno
      );
    }
  }, [state.mf_po_refno, purchaseno]);

  useEffect(() => {
    if (state.mf_vo_refno.length > 0) {
      fetchProduction(
        joborderno.find((item) => item.joborderno === state.mf_vo_refno)
      );
    }
  }, [state.mf_vo_refno]);
  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={[
          Styles.flex1,
          Styles.paddingHorizontal16,
          Styles.paddingVertical16,
        ]}
      >
        <View style={[Styles.marginTop8]}>
          <Dropdown
            data={purchaseno.map((obj) => obj.purchaseorderno)}
            label="Purchase Order No"
            onSelected={(text) => {
              if (text !== state.mf_po_refno) {
                onChange(text, "mf_po_refno");
                setState((state) => ({ ...state, mf_vo_refno: "" }));
                setJobOrderNo([]);
                setProduction([]);
                setErrors((prev) => {
                  return {
                    ...prev,
                    mf_po_refno: false,
                    mf_vo_refno: false,
                  };
                });
              }
            }}
            isError={errors.mf_po_refno}
            selectedItem={state.mf_po_refno}
          />
        </View>

        <View style={[Styles.marginTop16]}>
          <Dropdown
            data={joborderno?.map((obj) => obj.joborderno)}
            label="Job Order No"
            selectedItem={state.mf_vo_refno}
            onSelected={(text) => {
              if (text !== state.mf_vo_refno) {
                onChange(text, "mf_vo_refno");
                setProduction([]);
                setErrors((prev) => {
                  return {
                    ...prev,
                    mf_vo_refno: false,
                  };
                });
              }
            }}
            isError={errors.mf_vo_refno}
          />
        </View>

        <TextInput
          mode="outlined"
          label="Invoice No"
          style={[Styles.marginTop16,{ backgroundColor: "white" }]}
          value={state.invoice_no}
          onChangeText={(text) => {
            setErrors((prev) => {
              return {
                ...prev,
                invoice_no: false,
              };
            });
            onChange(text, "invoice_no");
          }}
          error={errors.invoice_no}
        />
        <TextInput
          mode="outlined"
          label="Invoice Entry Date"
          disabled={true}
          value={state.invoice_entry_date}
          
          style={[Styles.marginTop16,{ backgroundColor: "white" }]}
        />
        <DateTimePicker
          label="Date of Invoice"
          value={state.invoice_date}
          type="date"
          style={{ backgroundColor: "white" }}
          onChangeDate={(date) => onChange(date, "invoice_date")}
        />
        <TextInput
          mode="outlined"
          label="Supplier Name"
          disabled={true}
          value={state.supplier_name || ""}
          style={[Styles.marginTop16,{ backgroundColor: "white" }]}
        />
        <TextInput
          mode="outlined"
          label="Basic Amount"
          disabled={true}
          value={state.basic_amount || ""}
          style={[Styles.marginTop16,{ backgroundColor: "white" }]}
        />
        <TextInput
          mode="outlined"
          label="CGST(%)"
          value={String(state.cgst) || ""}
          keyboardType="numeric"
          onChangeText={(e) => Number(e) <= 100 && onChange(e, "cgst")}
          style={[Styles.marginTop16,{ backgroundColor: "white" }]}
          error={errors.cgst}
        />
        <TextInput
          mode="outlined"
          label="SGST(%)"
          value={state.sgst || ""}
          keyboardType="numeric"
          onChangeText={(e) => Number(e) <= 100 && onChange(e, "sgst")}
          style={[Styles.marginTop16,{ backgroundColor: "white" }]}
          error={errors.sgst}
        />
        <TextInput
          mode="outlined"
          label="IGST(%)"
          value={state.igst || ""}
          keyboardType="numeric"
          onChangeText={(e) => Number(e) <= 100 && onChange(e, "igst")}
          style={[Styles.marginTop16,{ backgroundColor: "white" }]}
          error={errors.igst}
        />
        <TextInput
          mode="outlined"
          label="Transporation Charges"
          style={[Styles.marginTop16,{ backgroundColor: "white" }]}
          value={state.transport_charges}
          error={errors.transport_charges}
          onChangeText={(text) => {
            setErrors((prev) => {
              return { ...prev, transport_charges: false };
            });
            onChange(text, "transport_charges");
          }}
        />
        {production.length > 0 && (
          <View style={styles.container}>
            <ScrollView horizontal={true}>
              <View>
                <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                  <Row
                    data={[
                      "Product Name \n » Brand",
                      "Weight \n Per Piece",
                      "Total.No. \n of Products",
                      "No.of.Coil (Received)",
                    ]}
                    widthArr={[85, 58, 58, 90]}
                    style={styles.header}
                    textStyle={styles.headertext}
                  />
                </Table>

                <ScrollView style={styles.dataWrapper}>
                  <Table
                    borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}
                  >
                    {production.map((item, index) => {
                      return (
                        <TableWrapper
                          style={{ flexDirection: "row" }}
                          key={index}
                        >
                          <Col
                            data={[
                              `${item.productname}\n>> ${item.brand_name}`,
                            ]}
                            height={80}
                            textStyle={styles.text}
                            width={85}
                          />
                          <Col
                            data={[item.weightper_piece_txt]}
                            height={80}
                            textStyle={styles.text}
                            width={58}
                          />
                          <Col
                            data={[item.total_no_products_txt]}
                            height={80}
                            textStyle={styles.text}
                            width={58}
                          />
                          <Col
                            data={[
                              <View style={{ padding: 10 }}>
                                <Dropdown
                                  data={[
                                    ...Array.from(
                                      {
                                        length:
                                          parseInt(item.coils_received_nos) + 1,
                                      },
                                      (_, i) => String(i + 1)
                                    ),
                                  ]}
                                  label=""
                                  selectedItem={item.coils_received}
                                  onSelected={(selectedItem) =>
                                    setProduction((prev) =>
                                      prev.map((current, idx) => {
                                        if (idx !== index) {
                                          return current;
                                        } else {
                                          return {
                                            ...current,
                                            coils_received: selectedItem,
                                          };
                                        }
                                      })
                                    )
                                  }
                                />
                              </View>,
                            ]}
                            height={80}
                            textStyle={styles.text}
                            width={90}
                          />
                        </TableWrapper>
                      );
                    })}
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        )}
        {production.length > 0 && (
          <View style={{ padding: 5 }}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <TextInput
                  mode="outlined"
                  label="Slitting scrap (mm)"
                  disabled={true}
                  value={production[0].scrab_wastage}
                  style={{ backgroundColor: "white" }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <TextInput
                  mode="outlined"
                  label="Slitting scrap (Kg)"
                  disabled={true}
                  value={production[0].scrab_wastage_kg}
                  style={{ backgroundColor: "white" }}
                />
              </View>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 0.5 }}></View>
              <View style={{ flex: 1 }}>
                <TextInput
                  mode="outlined"
                  label="Total Weight"
                  disabled={true}
                  value={production[0].total_weight}
                  style={{ backgroundColor: "white" }}
                />
              </View>
              <View style={{ flex: 0.5 }}></View>
            </View>
          </View>
        )}
        <Button
          mode="contained"
          style={{ alignSelf: "center", marginTop: 5 }}
          onPress={ValidateData}
          disabled={isbuttonLoading}
        >
          Submit
        </Button>
        <View style={{ height: 25 }}></View>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={3000}
          style={{ backgroundColor: theme.colors.error }}
        >
          {snackbarText}
        </Snackbar>
      </ScrollView>
    </View>
  );
};

export default EditInvoiceReceipt;
