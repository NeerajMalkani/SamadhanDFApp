import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView } from "react-native";
import { FAB, List, Snackbar, Searchbar, Title } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { APIConverter } from "../../../utils/apiconverter";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const ServiceProductScreen = ({ navigation }) => {
  //#region Variables
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [selectedServiceProductName, setSelectedServiceProductName] = React.useState("");
  const [serviceName, setServiceName] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [rum, setRUM] = React.useState("");
  const [ruwm, setRUWM] = React.useState("");
  const [shortSpec, setShortSpec] = React.useState("");
  const [spec, setSpec] = React.useState("");
  const [unitName, setUnitName] = React.useState("");

  const refRBSheet = useRef();
  //#endregion

  //#region Functions
  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      data: {
        Sess_UserRefno: "2",
        service_refno: "0",
        category_refno: "0",
        product_refno: "0",
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.ServiceProductFilter, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
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

  const AddCallback = () => {
    navigation.navigate("AddServiceProductScreen", { type: "add", fetchData: FetchData });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddServiceProductScreen", {
      type: "edit",
      fetchData: FetchData,
      data: {
        id: data.item.productID,
        activityRoleName: data.item.activityRoleName,
        serviceName: data.item.serviceName,
        unitName: data.item.unitName,
        categoryName: data.item.categoryName,
        productName: data.item.productName,
        unit1Name: data.item.selectedUnit,
        unit2Name: data.item.convertedUnit,
        rateWithMaterials: data.item.rateWithMaterials,
        rateWithoutMaterials: data.item.rateWithoutMaterials,
        shortSpecification: data.item.shortSpecification,
        specification: data.item.specification,
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
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="bag-checked" />}
          onPress={() => {
            refRBSheet.current.open();
            setSelectedServiceProductName(data.item.productName);
            setCategoryName(data.item.categoryName);
            setServiceName(data.item.serviceName);
            setRUM(data.item.rateWithMaterials);
            setRUWM(data.item.rateWithoutMaterials);
            setShortSpec(data.item.shortSpecification);
            setSpec(data.item.specification);
            setUnitName(data.item.selectedUnit);
          }}
          right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
        />
      </View>
    );
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Service Product" />
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
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={620} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View style={{ paddingBottom: 64 }}>
          <Title style={[Styles.paddingHorizontal16]}>{selectedServiceProductName}</Title>
          <ScrollView>
            <List.Item title="Service Name" description={serviceName} />
            <List.Item title="Category Name" description={categoryName} />
            <List.Item title="Unit name" description={unitName} />
            <List.Item title="Rate / Unit (with materials)" description={rum} />
            <List.Item title="Rate / Unit without materials)" description={ruwm} />
            <List.Item title="Short Specification" description={shortSpec === "" ? "NA" : shortSpec} />
            <List.Item title="Specification" description={spec === "" ? "NA" : spec} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default ServiceProductScreen;
