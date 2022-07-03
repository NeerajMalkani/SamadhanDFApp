import React, { useEffect } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl } from "react-native";
import { FAB, List, Snackbar, Dialog, Portal, Button, Searchbar } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const ProductScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [selectedProductName, setSelectedProductName] = React.useState("");
  const [serviceName, setServiceName] = React.useState("");
  const [activityRoleName, setActivityRoleName] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [hsnsacCode, setHsnsacCode] = React.useState("");
  const [gstRate, setGstRate] = React.useState("");
  const [unitName, setUnitName] = React.useState("");

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + "  successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    Provider.getAll("master/getproducts")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const lisData = [...response.data.data];
            lisData.map((k, i) => {
              k.key = (parseInt(i) + 1).toString();
            });
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

  useEffect(() => {
    FetchData();
  }, []);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      listSearchData[1](listData[0]);
    } else {
      listSearchData[1](
        listData[0].filter((el) => {
          return el.productName.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };

  const ShowDialog = () => setDialogVisible(true);

  const HideDialog = () => setDialogVisible(false);

  const AddCallback = () => {
    navigation.navigate("AddProductScreen", { type: "add", fetchData: FetchData });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddProductScreen", {
      type: "edit",
      fetchData: FetchData,
      data: {
        id: data.item.productID,
        activityRoleName: data.item.activityRoleName,
        activityID: data.item.activityID,
        serviceName: data.item.serviceName,
        serviceID: data.item.serviceID,
        unitName: data.item.unitName,
        unitOfSalesID: data.item.unitOfSalesID,
        productName: data.item.productName,
        categoryName: data.item.categoryName,
        categoryID: data.item.categoryID,
        hsnsacCode: data.item.hsnsacCode,
        gstRate: data.item.gstRate.toFixed(2),
        display: data.item.display,
      },
    });
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 72 }]}>
        <List.Item
          title={data.item.productName}
          titleStyle={{ fontSize: 18 }}
          description={"Display: " + (data.item.display ? "Yes" : "No")}
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="toolbox" />}
          right={() => (
            <Icon
              style={{ marginVertical: 12, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="eye"
              onPress={() => {
                ShowDialog();
                setSelectedProductName(data.item.productName);
                setActivityRoleName(data.item.activityRoleName);
                setCategoryName(data.item.categoryName);
                setServiceName(data.item.serviceName);
                setHsnsacCode(data.item.hsnsacCode);
                setGstRate(data.item.gstRate.toFixed(2) + "%");
                setUnitName(data.item.unitName);
              }}
            />
          )}
        />
      </View>
    );
  };

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Product" />
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : listData[0].length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Searchbar style={[Styles.margin16]} placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
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
            renderHiddenItem={(data, rowMap) => RenderHiddenItems(data, rowMap, [EditCallback])}
          />
        </View>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found. Add records by clicking on plus icon." />
      )}
      <FAB style={[Styles.margin16, Styles.primaryBgColor, { position: "absolute", right: 16, bottom: 16 }]} icon="plus" onPress={AddCallback} />
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={HideDialog}>
          <Dialog.Title>{selectedProductName}</Dialog.Title>
          <Dialog.Content>
            <List.Item title="Activity Role Name" description={activityRoleName} />
            <List.Item title="Service Name" description={serviceName} />
            <List.Item title="Category Name" description={categoryName} />
            <List.Item title="HSN / SAC Code" description={hsnsacCode} />
            <List.Item title="GST Rate" description={gstRate} />
            <List.Item title="Unit name" description={unitName} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={HideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default ProductScreen;
