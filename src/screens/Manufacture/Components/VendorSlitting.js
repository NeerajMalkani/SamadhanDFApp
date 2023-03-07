import React from "react";
import { useState, useEffect } from "react";
import Provider from "../../../api/Provider";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { TextInput, List } from "react-native-paper";
import { theme } from "../../../theme/apptheme";
import { Styles } from "../../../styles/styles";
import { Table, TableWrapper, Row, Col } from "react-native-table-component";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  header: { height: 80, backgroundColor: theme.colors.primary },
  subheader: { height: 30, backgroundColor: "white" },
  text: { textAlign: "center", fontWeight: "100" },
  headertext: { textAlign: "center", fontWeight: "800", color: "white" },
  dataWrapper: { marginTop: -1 },
  row: { height: 50, backgroundColor: "white" },
});

function Slitting({ user, mf_po_no, mf_vo_refno }) {
  const [data, setData] = React.useState({ slitting_data: [] });
  const [total, setTotal] = useState("0");
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
    // console.log({
    //   data: {
    //     Sess_UserRefno: user.UserID,
    //     Sess_company_refno: user.Sess_company_refno,
    //     Sess_branch_refno: user.Sess_branch_refno,
    //     mf_po_refno: mf_po_no,
    //     mf_vo_refno: mf_vo_refno,
    //   },
    // });
    let params = {
      data: {
        Sess_UserRefno: user.UserID,
        Sess_company_refno: user.Sess_company_refno,
        Sess_branch_refno: user.Sess_branch_refno,
        mf_po_refno: mf_po_no,
        mf_vo_refno: mf_vo_refno,
      },
    };

    Provider.createDFManufacturer(
      Provider.API_URLS.get_slittingdetails_vendororderform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {

            response.data.data = response.data.data.filter((item) => item.total > 0);
            //console.log("slittingdata", response.data.data);
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
  }, [mf_po_no, user, setData]);

  return (
    <View>
      <Text
        style={[Styles.paddingHorizontal16, Styles.fontBold, Styles.fontSize16]}
      >
        Slitting Details
      </Text>
      <View style={styles.container}>
        <ScrollView horizontal={true}>
          <View>
            <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
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
              <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
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
                            parseInt(item.total) == 0
                              ? "0"
                              : String(
                                  parseFloat(item.total) /
                                    parseFloat(item.width_mm_value)
                                ),
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
  );
}
export default Slitting;
