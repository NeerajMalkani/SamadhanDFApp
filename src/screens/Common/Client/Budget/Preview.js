import { View, Text, StyleSheet } from "react-native";
import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Styles } from "../../../../styles/styles";
import { useIsFocused } from "@react-navigation/native";
import Provider from "../../../../api/Provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LabelInput from "../../../Marketing/EmployeeActivity/common/LabelInput";
import { Checkbox, TextInput, Button, Snackbar } from "react-native-paper";
import { theme } from "../../../../theme/apptheme";
import { Table, TableWrapper, Row, Col } from "react-native-table-component";
import WebView from "react-native-webview";
// import RenderHTML from "react-native-render-html";
let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_group_refno = 0;
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

const Preview = ({ navigation, route }) => {
  const [state, setState] = useState({ ProductDetails: [] });
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [units, setUnits] = useState([]);
  const [open, setOpen] = useState(false);
  const [color, setColor] = useState("");
  const [text, setText] = useState("");
  const getUserData = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      Sess_UserRefno = JSON.parse(userData).UserID;
      Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
      Sess_company_refno = JSON.parse(userData).Sess_company_refno;
      Sess_group_refno = JSON.parse(userData).Sess_group_refno;
      await fetchBudget();
      await fetchState();
      await fetchUnits();
    }
  };

  const fetchUnits = () => {
    Provider.createDFArchitect(
      Provider.API_URLS.architect_get_unitofsales_budgetform,
      { data: { Sess_UserRefno } }
    ).then((res) => {
      setUnits(res.data.data);
    });
  };
  const fetchState = () => {
    Provider.createDFCommon(Provider.API_URLS.GetStateDetails)
      .then((res) => {
        if (res.data.data) setStates(res.data.data);
      })
      .catch((error) => console.log(error));
  };
  const fetchDistricts = (state_refno) => {
    Provider.createDFCommon(Provider.API_URLS.GetDistrictDetailsByStateRefno, {
      data: {
        Sess_UserRefno,
        state_refno,
      },
    })
      .then((res) => {
        if (res.data.data) setDistricts(res.data.data);
      })
      .catch((error) => console.log(error));
  };
  console.log(JSON.stringify(route.params.data, null, 2));
  const fetchBudget = () => {
    Provider.createDFClient(Provider.API_URLS.client_budget_view, {
      data: {
        Sess_UserRefno,

        budget_refno: route.params.data.budget_refno,
      },
    }).then((res) => {
      setState(res.data.data[0]);
      fetchDistricts(res.data.data[0].state_refno);
    });
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) getUserData();
  }, [isFocused]);

  const accept = () => {
    Provider.createDFClient(Provider.API_URLS.client_budget_popup_approve, {
      data: { Sess_UserRefno, budget_refno: route.params.data.budget_refno },
    })
      .then((res) => {
        setColor(theme.colors.success);
        setText("Budget Approved");
        setOpen(true);
        navigation.goBack();
      })
      .catch((error) => {
        setColor(theme.colors.error);
        setText("Something Went Wrong");
        setOpen(true);
      });
  };

  const reject = () => {
    Provider.createDFClient(Provider.API_URLS.client_budget_popup_reject, {
      data: { Sess_UserRefno, budget_refno: route.params.data.budget_refno },
    })
      .then((res) => {
        setColor(theme.colors.success);
        setText("Budget Rejected");
        setOpen(true);
        navigation.goBack();
      })
      .catch((error) => {
        setColor(theme.colors.error);
        setText("Something Went Wrong");
        setOpen(true);
      });
  };
  return (
    <ScrollView
      style={[Styles.padding16, Styles.flex1, { backgroundColor: "white" }]}
    >
      <View style={[Styles.flex1, Styles.marginBottom12]}>
        <Text
          style={[
            Styles.fontSize20,
            Styles.fontBold,
            Styles.marginBottom4,
            Styles.primaryColor,
            { marginBottom: "3%" },
          ]}
        >
          Project Details
        </Text>
        <LabelInput label="Project Name" value={state.project_name} />

        <LabelInput label="Contact Person" value={state.contact_person} />
        <LabelInput
          label="Client Contact Number"
          value={state.contact_mobile_no}
        />
        <LabelInput label="Project Description" value={state.project_desc} />
        <LabelInput label="Project Address" value={state.project_address} />
        <LabelInput
          label="State"
          value={
            states?.find((item) => item.state_refno === state.state_refno)
              ?.state_name
          }
        />
        <LabelInput
          label="City"
          value={
            districts?.find(
              (item) => item.district_refno === state.district_refno
            )?.district_name
          }
        />
        <Text
          style={[
            Styles.fontSize20,
            Styles.fontBold,
            Styles.marginBottom4,
            Styles.primaryColor,
            { marginBottom: "3%" },
          ]}
        >
          Budget Preparation Type
        </Text>
        <LabelInput
          label="Unit of Sales"
          value={
            units?.find(
              (item) =>
                String(item.quot_unit_type_refno) ===
                String(state.quot_unit_type_refno)
            )?.quot_unit_type_name
          }
        />
        <Checkbox.Item
          label={"Material Inclusive"}
          color={theme.colors.primary}
          // position="leading"

          labelStyle={{ textAlign: "left" }}
          status={state.quot_type_refno === "1" ? "checked" : "unchecked"}
        />
        <Text
          style={[
            Styles.fontSize20,
            Styles.fontBold,
            Styles.marginBottom4,
            Styles.primaryColor,
            { marginBottom: "3%" },
          ]}
        >
          Product Details
        </Text>
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
                    "Product Name",
                    "Unit",
                    "Quantity",
                    "Rate",
                    "Amount",
                    "Remarks",
                    "Image Pattern Show",
                  ]}
                  widthArr={[150, 100, 100, 100, 100, 140, 120]}
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
                  <TableWrapper style={{ flexDirection: "row" }}>
                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={150}
                      data={[
                        ...state.ProductDetails?.map((obj) => obj.product_name),
                      ]}
                    />
                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={100}
                      data={[
                        ...state.ProductDetails?.map((obj) => obj.unit_name),
                      ]}
                    />
                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={100}
                      data={[
                        ...state.ProductDetails?.map((obj, index) => (
                          <View key={index} style={{ padding: 10 }}>
                            <TextInput
                              disabled={true}
                              mode="outlined"
                              value={obj.qty}
                              key={index}
                              keyboardType="numeric"
                            />
                          </View>
                        )),
                      ]}
                      mode="outlined"
                    />

                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={100}
                      data={[
                        ...state.ProductDetails?.map((obj, index) => (
                          <View key={index} style={{ padding: 10 }}>
                            <TextInput
                              disabled={true}
                              mode="outlined"
                              value={obj.rate}
                              key={index}
                              keyboardType="numeric"
                            />
                          </View>
                        )),
                      ]}
                    />
                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={100}
                      data={[
                        ...state.ProductDetails?.map((obj, index) => (
                          <View key={index} style={{ padding: 10 }}>
                            <TextInput
                              mode="outlined"
                              value={obj.amount}
                              disabled={true}
                              key={index}
                              keyboardType="numeric"
                            />
                          </View>
                        )),
                      ]}
                    />
                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={140}
                      data={[
                        ...state.ProductDetails?.map((obj, index) => (
                          <View key={index} style={{ padding: 10 }}>
                            <TextInput
                              disabled={true}
                              value={obj.remarks}
                              key={index}
                            />
                          </View>
                        )),
                      ]}
                    />
                    <Col
                      height={80}
                      textStyle={styles.text}
                      width={120}
                      data={[
                        ...state.ProductDetails?.map((obj, index) => (
                          <View key={index} style={{ padding: 10 }}>
                            <Button
                              mode="contained"
                              onPress={async () => await chooseFile(index)}
                            >
                              Add Image
                            </Button>
                          </View>
                        )),
                      ]}
                    />
                  </TableWrapper>
                </Table>
              </ScrollView>
              <Table
                borderStyle={{
                  borderWidth: 1,
                  borderColor: "#C1C0B9",
                }}
              >
                <Row
                  data={[
                    "Sub Total",
                    state.ProductDetails.reduce(
                      (a, obj) => a + Number(obj.amount),
                      0
                    ),
                  ]}
                  widthArr={[450, 360]}
                  style={styles.row}
                  textStyle={{ paddingHorizontal: 25 }}
                />
              </Table>
            </View>
          </ScrollView>
        </View>
        <Text
          style={[
            Styles.fontSize20,
            Styles.fontBold,
            Styles.marginBottom4,
            Styles.primaryColor,
            { marginBottom: "3%" },
          ]}
        >
          Terms & Conditions
        </Text>
        <WebView
          originWhitelist={"*"}
          source={{ html: state.terms_condition }}
        />
        <View style={{ marginVertical: 24 }}>
          {route.params.data.boq_message_button.includes(
            "Architect Not Generated BOQ's"
          ) && (
            <Text
              style={{
                textAlign: "center",
                marginVertical: 9,
                color: "red",
                fontSize: 20,
              }}
            >
              Architect Not Generated BOQ's
            </Text>
          )}
          {route?.params?.data?.budget_action_button?.includes(
            "View & Approve Budget"
          ) && (
            <View
              style={{
                flexDirection: "row",
                marginTop: 5,
                justifyContent: "space-around",
              }}
            >
              <Button
                mode="contained"
                onPress={reject}
                style={{ backgroundColor: theme.colors.error }}
              >
                Reject
              </Button>
              <Button onPress={accept} mode="contained">
                Accept
              </Button>
            </View>
          )}
        </View>
      </View>
      <Snackbar
        visible={open}
        onDismiss={() => setOpen(false)}
        duration={3000}
        style={{ backgroundColor: color }}
      >
        {text}
      </Snackbar>
    </ScrollView>
  );
};

export default Preview;
