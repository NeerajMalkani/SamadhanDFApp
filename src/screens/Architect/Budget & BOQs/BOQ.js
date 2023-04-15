import { View, Text, StyleSheet } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Provider from "../../../api/Provider";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useState } from "react";
import { theme } from "../../../theme/apptheme";
import { ScrollView } from "react-native-gesture-handler";
import {
  Table,
  TableWrapper,
  Row,
  Col,
  Rows,
} from "react-native-table-component";
import { Styles } from "../../../styles/styles";

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
let Sess_UserRefno = 0;
const BOQ = ({ route, navigation }) => {
  const [data, setData] = useState({});
  console.log(JSON.stringify(data, null, 2));

  const isFocused = useIsFocused();
  const fetchUser = async () => {
    const data = JSON.parse(await AsyncStorage.getItem("user"));
    Sess_UserRefno = data.UserID;
    fetchBOQ();
  };
  const fetchBOQ = () => {
    Provider.createDFArchitect(Provider.API_URLS.architect_boq_view, {
      data: {
        Sess_UserRefno,
        budget_refno: route.params.data.budget_refno,
      },
    }).then((res) => setData(res.data.data));
  };
  useEffect(() => {
    if (isFocused) fetchUser();
  }, [isFocused]);
  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={{ flex: 1, padding: 16 }}>
        <Text
          style={[
            Styles.fontSize20,
            Styles.fontBold,
            Styles.marginBottom4,
            Styles.primaryColor,
            { marginBottom: "3%" },
          ]}
        >
          Budget Details
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
                    "Budget No",
                    "Project Name",
                    "Client Person & Contact",
                    "Budget Unit",
                    "BOQ Type",
                  ]}
                  widthArr={[60, 140, 200, 100, 100]}
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
                  <TableWrapper>
                    <Row
                      style={styles.row}
                      textStyle={styles.text}
                      data={[
                        data?.budget_details?.budget_refno,
                        data?.budget_details?.project_name,
                        `${data?.budget_details?.contact_person} & ${data?.budget_details?.contact_mobile_no}`,
                        data?.budget_details?.quot_unit_type_name,
                        data?.budget_details?.boqtype_name,
                      ]}
                      widthArr={[60, 140, 200, 100, 100]}
                    />
                  </TableWrapper>
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
        <Text
          style={[
            Styles.fontSize20,
            Styles.fontBold,
            Styles.marginBottom4,
            Styles.primaryColor,
            { marginVertical: "5%" },
          ]}
        >
          BOQ Details
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
                    "",
                    "S.No",
                    "BOQ No",
                    "Service Name",
                    "Product Name",
                    "BOQ Sent Status",
                    "Action",
                  ]}
                  widthArr={[100, 60, 80, 200, 300, 150, 100]}
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
                  <TableWrapper>
                    {data?.boq_details?.map((obj, index) => {
                      return (
                        <Row
                          key={index}
                          style={styles.row}
                          textStyle={styles.text}
                          data={[
                            "OPEN",
                            index,
                            obj.boq_no,
                            obj.service_name,
                            obj.product_name.join("\n"),
                            obj.boq_status_name,
                            "Send BOQ",
                          ]}
                          widthArr={[100, 60, 80, 200, 300, 150, 100]}
                        />
                      );
                    })}
                  </TableWrapper>
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
};

export default BOQ;
