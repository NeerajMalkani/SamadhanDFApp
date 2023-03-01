import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  View,
  LogBox,
  RefreshControl,
  ScrollView,
} from "react-native";
import { FAB, List, Snackbar, Searchbar, Title } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Provider from "../../api/Provider";
import Header from "../../components/Header";
import { RenderHiddenItems } from "../../components/ListActions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoItems from "../../components/NoItems";
import { Styles } from "../../styles/styles";
import { theme } from "../../theme/apptheme";
import { NullOrEmpty } from "../../utils/validations";

let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_CompanyAdmin_group_refno = 0;

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
function ProductionOrderList({ navigation }) {
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

  const [reference, setReference] = React.useState({});
  const [current, setCurrent] = React.useState({});
  const refRBSheet = useRef();
  //#endregion

  //#region Functions
  const FetchData = async (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText(
        "Item " + (from === "add" ? "added" : "updated") + " successfully"
      );
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }

    const params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
        mf_po_refno: "all",
      },
    };
    try {
      const data = await Provider.getpurchaseorderlist(
        params,
        () => setIsLoading(false),
        () => {
          setSnackbarText("No data found");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
      );
      listData[1](data.order);
      listSearchData[1](data.order);
      setReference(data);
      console.log(data.order[0]);
      console.log(data.supplier);
      console.log(data.vendor);
    } catch (e) {
      setIsLoading(false);
      setSnackbarText(e.message);
      setSnackbarColor(theme.colors.error);
      setSnackbarVisible(true);
      setRefreshing(false);
    }
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

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      listSearchData[1](listData[0]);
    } else {
      listSearchData[1](
        listData[0].filter((el) => {
          return el.categoryName
            .toString()
            .toLowerCase()
            .includes(query.toLowerCase());
        })
      );
    }
  };

  const RenderItems = (data) => {
    return (
      <View
        style={[
          Styles.backgroundColor,
          Styles.borderBottom1,
          Styles.paddingStart16,
          Styles.flexJustifyCenter,
          { height: 72 },
        ]}
      >
        <List.Item
          title={
            data.item?.supplier_user_refno
              ? reference?.supplier?.find(
                  (item) =>
                    item.client_user_refno === data.item.supplier_user_refno
                ).client_name
              : ""
          }
          titleStyle={{ fontSize: 18 }}
          description={`Vendor Name: ${
            data.item?.vendor_user_refno
              ? reference?.vendor?.find(
                  (item) =>
                    item.client_user_refno === data.item.vendor_user_refno
                ).client_name
              : ""
          }\nService Name: ${
            NullOrEmpty(data.item.service_name) ? "" : data.item.service_name
          } `}
          onPress={() => {
            refRBSheet.current.open();
            console.log(data.item);
            setCurrent(data.item);
          }}
          left={() => (
            <Icon
              style={{ marginVertical: 12, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="file-tree"
            />
          )}
          right={() => (
            <Icon
              style={{ marginVertical: 12, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="eye"
            />
          )}
        />
      </View>
    );
  };

  const AddCallback = () => {
    navigation.navigate("AddProduction", {
      type: "add",
      fetchData: FetchData,
      data: {
        ...reference,
      },
    });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("EditProductOrderList", {
      type: "edit",
      fetchData: FetchData,
      data: {
        ...data.item,
        ...reference,
      },
    });
  };
  //#endregion
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Production Order List" />
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
      ) : listData[0].length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Searchbar
            style={[Styles.margin16]}
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
          <SwipeListView
            previewDuration={1000}
            previewOpenValue={-72}
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
            data={listSearchData[0]}
            disableRightSwipe={true}
            rightOpenValue={-72}
            renderItem={(data) => RenderItems(data)}
            renderHiddenItem={(data, rowMap) =>
              RenderHiddenItems(data, rowMap, [EditCallback])
            }
          />
        </View>
      ) : (
        <NoItems
          icon="format-list-bulleted"
          text="No records found. Add records by clicking on plus icon."
        />
      )}
      <FAB
        style={[
          Styles.margin16,
          Styles.primaryBgColor,
          { position: "absolute", right: 16, bottom: 16 },
        ]}
        icon="plus"
        onPress={AddCallback}
      />
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
        height={580}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>
            {current?.supplier_user_refno
              ? reference?.supplier?.find(
                  (item) =>
                    item.client_user_refno === current.supplier_user_refno
                )?.client_name
              : ""}
          </Title>
          <ScrollView>
            <List.Item
              title="Supplier Name"
              description={
                current?.supplier_user_refno
                  ? reference?.supplier?.find(
                      (item) =>
                        item.client_user_refno === current.supplier_user_refno
                    )?.client_name
                  : ""
              }
            />
            <List.Item
              title="Vendor Name"
              description={
                current?.vendor_user_refno
                  ? reference?.vendor?.find(
                      (item) =>
                        item.client_user_refno === current.vendor_user_refno
                    )?.client_name
                  : ""
              }
            />
            <List.Item
              title="Service Name"
              description={current.service_name}
            />
            <List.Item
              title="Category >> Product >> Brand"
              description={`${current.category_name} >> ${current.product_name} >> ${current.brand_name}`}
            />
            <List.Item
              title="Total Weight"
              description={current.total_weight}
            />
            <List.Item
              title="Total Weight"
              description={current.total_length}
            />
            <List.Item
              title="Display"
              description={current.view_status == "1" ? "Yes" : "No"}
            />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
}

export default ProductionOrderList;
