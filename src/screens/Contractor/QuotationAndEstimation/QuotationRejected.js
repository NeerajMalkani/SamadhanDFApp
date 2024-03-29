import { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  ActivityIndicator,
  View,
  RefreshControl,
  LogBox,
  ScrollView,
  StyleSheet,
} from "react-native";
import { List, Snackbar, Title, Button, Text } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import RBSheet from "react-native-raw-bottom-sheet";

import Provider from "../../../api/Provider";
import NoItems from "../../../components/NoItems";
import { theme } from "../../../theme/apptheme";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Styles } from "../../../styles/styles";
import Search from "../../../components/Search";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

let userID = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
const QuotationRejected = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [listSearchData, setListSearchData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [current, setCurrent] = useState({});
  const refRBSheet = useRef();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.success);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      Sess_CompanyAdmin_UserRefno =
        JSON.parse(userData).Sess_CompanyAdmin_UserRefno;
      Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
      Sess_company_refno = JSON.parse(userData).Sess_company_refno;
      FetchData();
    }
  };

  const FetchData = () => {
    setIsLoading(true);
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
      },
    };
    Provider.createDFContractor(
      Provider.API_URLS.contractor_quotation_rejected_list,
      params
    )
      .then((response) => {
        if (response.data && response.data.data) {
          setListData(response.data.data);
          setListSearchData(response.data.data);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      GetUserID();
    }
  }, [isFocused]);

  const RenderItems = (data) => {
    return (
      <View
        style={[
          Styles.backgroundColor,
          Styles.paddingHorizontal16,
          Styles.flexJustifyCenter,
          {
            height: 150,
            borderWidth: 1.3,
            marginBottom: 10,
            borderRadius: 8,
            borderColor: theme.colors.primary,
          },
        ]}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              Quotation No :
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              Project Name :
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              Contact Person & Number :
            </Text>
          </View>
          <View style={{ flex: 1.3 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item.cont_quot_no}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item.project_name}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item.contact_person} & {data.item.contact_mobile_no}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item.totalfoot}
            </Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Button
            mode="outlined"
            onPress={() => {
              refRBSheet.current.open();
              console.log(data.item);
              setCurrent(data.item);
            }}
            style={{
              borderColor: theme.colors.primary,
              borderWidth: 1.2,
            }}
          >
            View Details
          </Button>
        </View>
      </View>
    );
  };

  return (
    <View style={[Styles.flex1]}>
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
      ) : listData?.length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Search
            data={listData}
            setData={setListSearchData}
            filterFunction={[
              "cont_quot_no",
              "cont_quot_refno",
              "contact_mobile_no",
              "contact_person",
              "material_status",
              "project_name",
              "quot_status_name",
              "quot_unit_type_name",
            ]}
          />
          {listSearchData?.length > 0 ? (
            <View style={{ padding: 10 }}>
              <SwipeListView
                previewDuration={1000}
                previewOpenValue={-160}
                previewRowKey="1"
                previewOpenDelay={1000}
                refreshControl={
                  <RefreshControl
                    colors={[theme.colors.primary]}
                    refreshing={refreshing}
                    onRefresh={() => {
                      FetchData();
                    }}
                  />
                }
                data={listSearchData}
                useFlatList={true}
                disableRightSwipe={true}
                rightOpenValue={-160}
                renderItem={(data) => RenderItems(data)}
              />
            </View>
          ) : (
            <NoItems
              icon="format-list-bulleted"
              text="No records found for your query"
            />
          )}
        </View>
      ) : (
        <NoItems
          icon="format-list-bulleted"
          text="No records found. Add records by clicking on plus icon."
        />
      )}
      <View style={{ height: 80 }}></View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        // onClose={() => setCurrent({})}
        height={620}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>
            {current.cont_quot_no}
          </Title>
          <ScrollView style={{ marginBottom: 64 }}>
            <List.Item
              title="Quotation No"
              description={current.cont_quot_no}
            />
            <List.Item
              title="Project Name"
              description={current.project_name}
            />
            <List.Item
              title="Contact Person & Number"
              description={`${current.contact_person} & ${current.contact_mobile_no}`}
            />
            <List.Item
              title="Quotation Unit"
              description={current.quot_unit_type_name}
            />
            <List.Item
              title="Materials"
              description={current.material_status}
            />
            <List.Item title="Status" description={current.quot_status_name} />

            <View style={{ height: 20 }}></View>
          </ScrollView>
        </View>
      </RBSheet>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: snackbarColor,
          zIndex: 99999999,
        }}
        zIndex={99999999}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};
const stylesm = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "green",
  },
  button1: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "red",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  modalIndex: {
    zIndex: 999999,
  },
  input: {
    margin: 15,
    height: 40,

    borderColor: "grey",
    borderWidth: 1,
  },
});
export default QuotationRejected;
