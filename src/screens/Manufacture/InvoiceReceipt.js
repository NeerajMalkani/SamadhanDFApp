import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  ActivityIndicator,
  View,
  LogBox,
  RefreshControl,
  ScrollView,
} from "react-native";
import { FAB, List, DataTable, Title, Snackbar } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Provider from "../../api/Provider";
import { RenderHiddenItems } from "../../components/ListActions";
import NoItems from "../../components/NoItems";
import { Styles } from "../../styles/styles";
import { theme } from "../../theme/apptheme";

let user = null;
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
function ProductforProduction({ navigation }) {
  const isFocused = useIsFocused();
  const refRBSheet = useRef();
  const [orders, setOrders] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [otherData, setOtherData] = useState([]);
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

  const fetchOrder = (user, from) => {
    if (from === "add" || from === "update") {
      setSnackbarText(
        "Item " + (from === "add" ? "added" : "updated") + " successfully"
      );
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    Provider.createDFManufacturer(Provider.API_URLS.mfvoinvoicerefnocheck, {
      data: {
        Sess_UserRefno: user.UserID,
        Sess_company_refno: user.Sess_company_refno,
        Sess_branch_refno: user.Sess_branch_refno,
        mf_vo_invoice_refno: "all",
      },
    })
      .then((res) => {
        if (res.data.data) {
          setOrders(res.data.data);
        }
      })
      .catch((error) => console.log(error));
  };

  const fetchOrderData = () => {
    Provider.createDFManufacturer(
      Provider.API_URLS.get_orderproductioncalculation_vendororder_invoiceform,
      {
        data: {
          Sess_UserRefno: user?.UserID,
          Sess_branch_refno: user?.Sess_branch_refno,
          Sess_company_refno: user?.Sess_company_refno,
          mf_po_refno: selectedItem.mf_po_refno,
          mf_vo_refno: selectedItem.mf_vo_refno,
          mf_vo_invoice_refno: selectedItem.mf_vo_invoice_refno,
        },
      }
    ).then((res) => {
      console.log(res.data.data);
      setOtherData(res.data.data);
    });
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
          title={data.item.supplier_company_name}
          titleStyle={{ fontSize: 18 }}
          description={data.item.invoice_entry_date}
          onPress={async () => {
            setSelectedItem(data.item);
            await fetchOrderData();
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
              RenderHiddenItems(data, rowMap, [
                (data, rowMap) => {
                  rowMap[data.item.key].closeRow();
                  navigation.navigate("EditInvoiceReceipt", {
                    type: "edit",
                    fetchData: (item) => fetchOrder(user, item),
                    data: {
                      ...data.item,
                    },
                  });
                },
              ])
            }
          />
        </View>
      ) : (
        <NoItems
          icon="format-list-bulleted"
          text="No records found. Add records by clicking on plus icon."
        />
      )}
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={500}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View style={[Styles.flex1]}>
          <Title style={[Styles.paddingHorizontal16]}>Invoice Details</Title>
          <ScrollView style={[Styles.flex1]}>
            <List.Item
              title="Purchase Order No."
              description={selectedItem.mf_po_no}
            />
            <List.Item
              title="Vendor Order No."
              description={selectedItem.mf_vo_no}
            />
            <List.Item
              title="Invoice No."
              description={selectedItem.invoice_no}
            />
            <List.Item
              title="Invoice Entry Date"
              description={selectedItem.invoice_entry_date}
            />
            <List.Item
              title="Supplier Name"
              description={selectedItem.supplier_company_name}
            />
            <List.Item
              title="Brand Name"
              description={selectedItem.brand_name}
            />
            <List.Item
              title="Brand Conversion Value"
              description={selectedItem.mf_brand_conversionvalue}
            />
            <List.Item
              title="Basic Amount"
              description={selectedItem.basic_amount}
            />
            <List.Item
              title="Transportation Charges"
              description={selectedItem.transport_charges}
            />

            <Text
              style={[
                Styles.fontSize20,
                Styles.fontBold,
                Styles.paddingHorizontal16,
              ]}
            >
              Order Production Calculation
            </Text>
            {otherData?.map((obj, index) => {
              return (
                <List.Item
                  key={index}
                  descriptionNumberOfLines={3}
                  title={`${obj.productname} ${obj.brand_name}`}
                  description={`Weight Per Piece - ${obj.weightper_piece_txt}\nTotal No of Products - ${obj.total_no_products_txt}\nNo of Coils received - ${obj.coils_received}`}
                />
              );
            })}
          </ScrollView>
        </View>
      </RBSheet>
      <FAB
        onPress={() =>
          navigation.navigate("InvoiceReceiptForm", {
            type: "add",
            fetchData: (item) => fetchOrder(user, item),
          })
        }
        style={[
          Styles.margin16,
          Styles.primaryBgColor,
          { position: "absolute", right: 16, bottom: 16 },
        ]}
        icon="plus"
        // onPress={AddCallback}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarColor }}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
}

export default ProductforProduction;
