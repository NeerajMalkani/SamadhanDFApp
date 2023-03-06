import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  View,
  LogBox,
  RefreshControl,
  ScrollView,
} from "react-native";
import { FAB, List, Searchbar, Title, Snackbar } from "react-native-paper";
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
import Coil from "./Components/VendorCoil";
import Slitting from "./Components/VendorSlitting";
let user = null;
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
function ProductforProduction({ navigation }) {
  const isFocused = useIsFocused();
  const refRBSheet = useRef();
  const [orders, setOrders] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [otherData, setOtherData] = useState({});
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );

  const fetchUserID = async () => {
    const data = await AsyncStorage.getItem("user");

    if (data) {
      user = JSON.parse(data);
      fetchOrder(JSON.parse(data));
    }
  };
  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();

    navigation.navigate("EditVendorOrderForm", {
      type: "edit",
      fetchData: (from) => fetchOrder(user, from),
      data: {
        ...data.item,
      },
    });
  };

  const AddCallback = () => {
    navigation.navigate("AddVendorOrderForm", {
      type: "add",
      fetchData: (from) => fetchOrder(user, from),
    });
  };

  const fetchOrder = (user, from) => {
    if (from === "add" || from === "update") {
      setSnackbarText(
        "Item " + (from === "add" ? "added" : "updated") + " successfully"
      );
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }

    Provider.createDFManufacturer(Provider.API_URLS.mfvorefnocheck, {
      data: {
        Sess_UserRefno: user.UserID,
        Sess_company_refno: user.Sess_company_refno,
        Sess_branch_refno: user.Sess_branch_refno,
        mf_po_refno: "all",
        mf_vo_refno: "all",
      },
    })
      .then((res) => {
        if (res.data.data) {
          console.log('orders:', res.data.data);
          setOrders(res.data.data);
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchOrderOtherData = (po) => {
    Provider.createDFManufacturer(
      Provider.API_URLS.get_purchaseorderno_otherdata_vendororderform,
      {
        data: {
          Sess_UserRefno: user.UserID,
          Sess_company_refno: user.Sess_company_refno,
          Sess_branch_refno: user.Sess_branch_refno,
          mf_po_refno: po,
        },
      }
    )
      .then((res) => {
        setOtherData(res.data.data);
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    if (isFocused) {
      fetchUserID();
    }
  }, [isFocused]);

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
          title={data.item.job_order_no}
          titleStyle={{ fontSize: 18 }}
          description={data.item.vendor_company_name}
          onPress={() => {
            setSelectedItem(data.item);
            fetchOrderOtherData(data.item.mf_po_refno);
            refRBSheet.current.open();
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

  //#endregion
  return (
    <View style={[Styles.flex1, Styles.positionRelative]}>
      <Header
        navigation={navigation}
        title="Vendor Order Form List"
      />
      {orders.length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          {/* <Searchbar
            style={[Styles.margin16]}
            placeholder='Search'
            onChangeText={onChangeSearch}
            value={searchQuery}
          /> */}
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
                  fetchUserID();
                }}
              />
            }
            data={orders}
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
        <View style={[Styles.flex1]}>
          <Title style={[Styles.paddingHorizontal16]}>Order Details</Title>
          <ScrollView style={[Styles.flex1]}>
            <List.Item
              title="Vendor Order No."
              description={selectedItem.job_order_no}
            />
            <List.Item
              title="Vendor name & address"
              description={otherData[0]?.vendor_address?.user_company_name}
            />
            <List.Item
              title="Number of GP Coil"
              description={selectedItem.no_gpcoil}
            />
            <List.Item
              title="Thickness of Raw Material"
              description={selectedItem.product_name}
            />
            <Coil
              user={user}
              mf_po_no={selectedItem?.mf_po_refno}
              width={selectedItem?.gpcoil_width_value}
            />
            <Slitting user={user} mf_po_no={selectedItem?.mf_po_refno} />
          </ScrollView>
        </View>
      </RBSheet>
      <FAB
        style={[
          Styles.margin16,
          Styles.primaryBgColor,
          { position: "absolute", right: 16, bottom: 16 },
        ]}
        icon="plus"
        onPress={AddCallback}
      />
    </View>
  );
}

export default ProductforProduction;
