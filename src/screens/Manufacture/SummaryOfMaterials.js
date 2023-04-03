import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  View,
  LogBox,
  RefreshControl,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import {
  FAB,
  List,
  Snackbar,
  Searchbar,
  Title,
  TextInput,
  Button,
} from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Provider from "../../api/Provider";
import Header from "../../components/Header";
import { RenderHiddenItems } from "../../components/ListActions";
import NoItems from "../../components/NoItems";
import { Styles } from "../../styles/styles";
import { theme } from "../../theme/apptheme";
import { NullOrEmpty } from "../../utils/validations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Table, TableWrapper, Row, Col } from "react-native-table-component";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 10, backgroundColor: "#fff" },
  header: { height: 50, backgroundColor: theme.colors.primary },
  subheader: { height: 30, backgroundColor: "white" },
  text: { textAlign: "center", fontWeight: "100" },
  headertext: { textAlign: "center", fontWeight: "800", color: "white" },
  dataWrapper: { marginTop: -1 },
  row: { height: 50, backgroundColor: "white" },
});

let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_CompanyAdmin_group_refno = 0;

function SummaryOfMaterials({ navigation }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );

  const [current, setCurrent] = React.useState({});
  const refRBSheet = useRef();

  const [tableData, setTableData] = React.useState([]);

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText(
        "Item " + (from === "add" ? "added" : "updated") + " successfully"
      );
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        shiftproduction_refno: "all",
      },
    };
    Provider.createDFManufacturer(
      Provider.API_URLS.summaryofmaterial_gridlist,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            let temp = [];
            Object.entries(response.data.data).map(([key, value], index) => {
              if (!isNaN(key)) {
                temp.push([
                  index + 1,
                  `${value.product_name} >> \n ${value.brand_name}`,
                  value.thick_product_name,
                  value.coil_in_hand,
                  value.total_coils_used,
                  value.Available_Raw_Materials_Kg,
                  value.Available_Raw_Materials_Nos,
                  value.Production_Done_Kg,
                  value.Production_Done_Nos,
                  value.total_openingstock_productiondone_kg,
                  value.total_openingstock_productiondone_nos,
                  value.total_productiondone_scrap,
                  value.grid_status,
                ]);
              } else {
                console.log(key);
              }
            });
            setTableData(temp);
            listData[1](response.data.data);
            listSearchData[1](response.data.data);
          }
        } else {
          listData[1]([]);
          setSnackbarText("No data found");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
        setIsLoading(false);
        setRefreshing(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
        setRefreshing(false);
      });
  };

  const GetUserID = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData !== null) {
        Sess_UserRefno = JSON.parse(userData).UserID;
        Sess_company_refno = JSON.parse(userData).Sess_company_refno;
        Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
        Sess_CompanyAdmin_UserRefno =
          JSON.parse(userData).Sess_CompanyAdmin_UserRefno;
        FetchData();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    GetUserID();
  }, []);

  //#endregion
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Summary Of Materials" />
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
      ) : true ? (
        <View
          style={[
            Styles.flex1,
            Styles.flexColumn,
            Styles.backgroundColor,
            { height: 600 },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              padding: 10,
              justifyContent: "flex-end",
            }}
          >
            <Button
              width={"100%"}
              mode="contained"
              onPress={() => refRBSheet.current.open()}
            >
              Check Total Available Materials
            </Button>
          </View>
          <View style={styles.container}>
            <ScrollView horizontal={true}>
              <View>
                <Table borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}>
                  <Row
                    data={[
                      "Sr.No",
                      "Product Name >> \n Brand Name",
                      "Thickness",
                      "Coils in \n Hand",
                      "Coils \n Used",
                      "Available Raw Material",
                      "Production Done",
                      "Opening Stock",
                      "Scrap Wastage",
                      "Status",
                    ]}
                    widthArr={[40, 180, 80, 80, 80, 200, 200, 200, 80, 80]}
                    style={styles.header}
                    textStyle={styles.headertext}
                  />
                  <TableWrapper style={{ flexDirection: "row" }}>
                    <Col
                      data={[""]}
                      height={30}
                      textStyle={styles.text}
                      width={40}
                    />
                    <Col
                      data={[""]}
                      height={30}
                      textStyle={styles.text}
                      width={180}
                    />
                    <Col
                      data={[""]}
                      height={30}
                      textStyle={styles.text}
                      width={80}
                    />
                    <Col
                      data={[""]}
                      height={30}
                      textStyle={styles.text}
                      width={80}
                    />
                    <Col
                      data={[""]}
                      height={30}
                      textStyle={styles.text}
                      width={80}
                    />
                    <Col
                      data={["Kg"]}
                      height={30}
                      textStyle={{
                        textAlign: "center",
                        fontWeight: "700",
                      }}
                      width={100}
                      style={{
                        borderTopWidth: 2,
                        borderLeftWidth: 2,
                        borderColor: "#ff9933",
                      }}
                    />
                    <Col
                      data={["No"]}
                      height={30}
                      textStyle={{
                        textAlign: "center",
                        fontWeight: "700",
                      }}
                      width={100}
                      style={{
                        borderTopWidth: 2,
                        borderRightWidth: 2,
                        borderColor: "#ff9933",
                      }}
                    />
                    <Col
                      data={["Kg"]}
                      height={30}
                      textStyle={styles.text}
                      width={100}
                    />
                    <Col
                      data={["No"]}
                      height={30}
                      textStyle={styles.text}
                      width={100}
                    />
                    <Col
                      data={["Kg"]}
                      height={30}
                      textStyle={{
                        textAlign: "center",
                        fontWeight: "700",
                      }}
                      width={100}
                      style={{
                        borderTopWidth: 2,
                        borderLeftWidth: 2,
                        borderColor: "#138808",
                      }}
                    />
                    <Col
                      data={["No"]}
                      height={30}
                      textStyle={{
                        textAlign: "center",
                        fontWeight: "700",
                      }}
                      width={100}
                      style={{
                        borderTopWidth: 2,
                        borderRightWidth: 2,
                        borderColor: "#138808",
                      }}
                    />
                    <Col
                      data={[""]}
                      height={30}
                      textStyle={styles.text}
                      width={80}
                    />
                    <Col
                      data={[""]}
                      height={30}
                      textStyle={styles.text}
                      width={80}
                    />
                  </TableWrapper>
                </Table>
                <ScrollView style={styles.dataWrapper}>
                  <Table
                    borderStyle={{ borderWidth: 1, borderColor: "#C1C0B9" }}
                  >
                    <TableWrapper style={{ flexDirection: "row" }}>
                      <Col
                        data={tableData?.map((item) => item[0])}
                        height={50}
                        textStyle={styles.text}
                        width={40}
                      />
                      <Col
                        data={tableData?.map((item) => item[1])}
                        height={50}
                        textStyle={styles.text}
                        width={180}
                      />
                      <Col
                        data={tableData?.map((item) => item[2])}
                        height={50}
                        textStyle={styles.text}
                        width={80}
                      />
                      <Col
                        data={tableData?.map((item) => item[3])}
                        height={50}
                        textStyle={styles.text}
                        width={80}
                      />
                      <Col
                        data={tableData?.map((item) => item[4])}
                        height={50}
                        textStyle={styles.text}
                        width={80}
                      />
                      <Col
                        data={tableData?.map((item) => item[5])}
                        height={50}
                        textStyle={{
                          textAlign: "center",
                          fontWeight: "100",
                        }}
                        width={100}
                        style={{ borderLeftWidth: 2, borderColor: "#ff9933" }}
                      />
                      <Col
                        data={tableData?.map((item) => item[6])}
                        height={50}
                        textStyle={{
                          textAlign: "center",
                          fontWeight: "100",
                        }}
                        width={100}
                        style={{ borderRightWidth: 2, borderColor: "#ff9933" }}
                      />
                      <Col
                        data={tableData?.map((item) => item[7])}
                        height={50}
                        textStyle={styles.text}
                        width={100}
                      />
                      <Col
                        data={tableData?.map((item) => item[8])}
                        height={50}
                        textStyle={styles.text}
                        width={100}
                      />
                      <Col
                        data={tableData?.map((item) => item[9])}
                        height={50}
                        textStyle={{
                          textAlign: "center",
                          fontWeight: "100",
                        }}
                        width={100}
                        style={{ borderLeftWidth: 2, borderColor: "#138808" }}
                      />
                      <Col
                        data={tableData?.map((item) => item[10])}
                        height={50}
                        textStyle={{
                          textAlign: "center",
                          fontWeight: "100",
                        }}
                        width={100}
                        style={{ borderRightWidth: 2, borderColor: "#138808" }}
                      />
                      <Col
                        data={tableData?.map((item) => item[11])}
                        height={50}
                        textStyle={styles.text}
                        width={80}
                      />
                      <Col
                        data={tableData?.map((item) => item[12])}
                        height={50}
                        textStyle={styles.text}
                        width={80}
                      />
                    </TableWrapper>
                    <TableWrapper style={{ flexDirection: "row" }}>
                      <Col
                        data={["Total"]}
                        height={50}
                        textStyle={styles.text}
                        width={460}
                      />
                      <Col
                        data={[listData[0].Available_Raw_Materials_Kg_Total]}
                        height={50}
                        textStyle={{
                          textAlign: "center",
                          fontWeight: "700",
                          color: "white",
                        }}
                        width={100}
                        style={{
                          borderBottomWidth: 2,
                          borderLeftWidth: 2,
                          borderColor: "#ff9933",
                          backgroundColor: "#ff9933",
                        }}
                      />
                      <Col
                        data={[listData[0].Available_Raw_Materials_Nos_Total]}
                        height={50}
                        textStyle={{
                          textAlign: "center",
                          fontWeight: "700",
                          color: "white",
                        }}
                        width={100}
                        style={{
                          borderBottomWidth: 2,
                          borderRightWidth: 2,
                          borderColor: "#ff9933",
                          backgroundColor: "#ff9933",
                        }}
                      />
                      <Col
                        data={[listData[0].Production_Done_Kg_Total]}
                        height={50}
                        textStyle={styles.text}
                        width={100}
                      />
                      <Col
                        data={[listData[0].Production_Done_Nos_Total]}
                        height={50}
                        textStyle={styles.text}
                        width={100}
                      />
                      <Col
                        data={[
                          listData[0].OpeningStock_Production_Done_Kg_Total,
                        ]}
                        height={50}
                        textStyle={{
                          textAlign: "center",
                          fontWeight: "700",
                          color: "white",
                        }}
                        width={100}
                        style={{
                          borderBottomWidth: 2,
                          borderLeftWidth: 2,
                          borderColor: "#138808",
                          backgroundColor: "#138808",
                        }}
                      />
                      <Col
                        data={[
                          listData[0].OpeningStock_Production_Done_Nos_Total,
                        ]}
                        height={50}
                        textStyle={{
                          textAlign: "center",
                          fontWeight: "700",
                          color: "white",
                        }}
                        width={100}
                        style={{
                          borderBottomWidth: 2,
                          borderRightWidth: 2,
                          borderColor: "#138808",
                          backgroundColor: "#138808",
                        }}
                      />
                      <Col
                        data={[listData[0].Scrap_Total]}
                        height={50}
                        textStyle={styles.text}
                        width={80}
                      />
                      <Col
                        data={[""]}
                        height={50}
                        textStyle={styles.text}
                        width={80}
                      />
                    </TableWrapper>
                  </Table>
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </View>
      ) : (
        <NoItems
          icon="format-list-bulleted"
          text="No records found. Add records by clicking on plus icon."
        />
      )}

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarColor }}
      >
        {snackbarText}
      </Snackbar>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={420}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View style={{ marginTop: 20, padding: 10 }}>
          <View>
            <View
              style={[
                Styles.borderTopRadius4,
                { backgroundColor: theme.colors.primary, marginBottom: 5 },
              ]}
            >
              <Text
                style={[
                  Styles.marginBottom24,
                  Styles.marginTop16,
                  Styles.textColorWhite,
                  Styles.marginHorizontal8,
                ]}
              >
                Slitting Invoice Scrap Total
              </Text>
            </View>
          </View>
          <TextInput
            mode="outlined"
            dense
            label="Slitting Invoice Scrap Total"
            value={listData[0].slitting_invoice_scrap_total}
            editable={false}
            selectTextOnFocus={false}
            style={{ marginBottom: 10 }}
          />
          <TextInput
            mode="outlined"
            dense
            label="Total Scrap"
            value={listData[0].net_scrab_wastage}
            editable={false}
            selectTextOnFocus={false}
            style={{ marginBottom: 10 }}
          />
          <TextInput
            mode="outlined"
            dense
            label="Total Materials Available"
            value={listData[0].total_materials_available}
            editable={false}
            selectTextOnFocus={false}
            style={{ marginBottom: 10 }}
          />
        </View>
      </RBSheet>
    </View>
  );
}

export default SummaryOfMaterials;
