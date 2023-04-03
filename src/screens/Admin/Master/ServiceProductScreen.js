import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView } from "react-native";
import { FAB, List, Snackbar, Searchbar, Title, IconButton } from "react-native-paper";
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
import Dropdown from "../../../components/Dropdown";
import DFButton from "../../../components/Button";

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

  const [filterServicesFullData, setFilterServicesFullData] = React.useState([]);
  const [filterServicesData, setFilterServicesData] = React.useState([]);
  const [filterServiceName, setFilterServiceName] = React.useState("");
  const servicesDDRef = useRef({});

  const [filterCategoriesFullData, setFilterCategoriesFullData] = React.useState([]);
  const [filterCategoriesData, setFilterCategoriesData] = React.useState([]);
  const [filterCategoriesName, setFilterCategoriesName] = React.useState("");
  const categoriesDDRef = useRef({});

  const [filterProductsFullData, setFilterProductsFullData] = React.useState([]);
  const [filterProductsData, setFilterProductsData] = React.useState([]);
  const [filterProductsName, setFilterProductsName] = React.useState("");
  const productsDDRef = useRef({});

  const [activityID, setActivityID] = React.useState("");
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [isButtonClearFilterLoading, setIsButtonClearFilterLoading] = React.useState(false);
  const [pageFilterEnable, setPageFilterEnable] = React.useState(true);

  const refRBSheet = useRef();
  const refRBSFilter = useRef();
  //#endregion

  //#region Functions
  const FetchData = (from) => {
    setIsButtonClearFilterLoading(true);
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      data: {
        Sess_UserRefno: "2",
        service_product_refno: "all",
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.ServiceProductrefNoCheck, params)
      .then((response) => {
        setPageFilterEnable(true);
        setIsButtonClearFilterLoading(false);
        refRBSFilter.current.close();
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

  const FilterData = () => {

    let category = filterCategoriesFullData.find((el) => {
      return el.categoryName === filterCategoriesName;
    });

    let product = filterProductsFullData.find((el) => {
      return el.productName === filterProductsName;
    });

    let params = {
      data: {
        Sess_UserRefno: "2",
        service_refno: filterServicesFullData.find((el) => {
          return el.serviceName === filterServiceName;
        }).id,
      },
    };

    if (category != null && category != undefined) {
      params.data.category_refno = category.id;
    }
    else {
      params.data.category_refno = "0";
    }

    if (product != null && product != undefined) {
      params.data.product_refno = product.id;
    }
    else {
      params.data.product_refno = "0";
    }

    Provider.createDFAdmin(Provider.API_URLS.ServiceProductFilter, params)
      .then((response) => {
        setIsButtonLoading(false);
        setPageFilterEnable(false);
        refRBSFilter.current.close();
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

  const FetchServicesFromActivity = (actID) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        group_refno: actID,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.ServiceNameServiceProduct, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setFilterServicesFullData(response.data.data);
            const services = response.data.data.map((data) => data.serviceName);
            setFilterServicesData(services);
          }
        }
      })
      .catch((e) => { });
  };

  const FetchCategoriesFromServices = (selectedItem) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        group_refno: activityID,
        service_refno: filterServicesFullData.find((el) => {
          return el.serviceName === selectedItem;
        }).id
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.CategoryNameServiceProduct, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setFilterCategoriesFullData(response.data.data);
            const categories = response.data.data.map((data) => data.categoryName);
            setFilterCategoriesData(categories);
          }
        }
      })
      .catch((e) => { });
  };

  const FetchProductsFromCategory = (selectedItem) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        group_refno: activityID,
        category_refno: filterCategoriesFullData.find((el) => {
          return el.categoryName === selectedItem;
        }).id
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.ProductServiceProduct, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setFilterProductsFullData(response.data.data);
            const products = response.data.data.map((data) => data.productName);
            setFilterProductsData(products);
          }
        }
      })
      .catch((e) => { });
  };

  const FetchActvityRoles = () => {
    Provider.createDFAdmin(Provider.API_URLS.ActivityRoleServiceProduct)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            //servicesDDRef.current.reset();
            setActivityID(response.data.data[0].id);
            FetchServicesFromActivity(response.data.data[0].id);
          }
        }
      })
      .catch((e) => { });
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
        id: data.item.id,
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
        unitId: data.item.unitId,
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

  const onServiceNameSelected = (selectedItem) => {
    setFilterServiceName(selectedItem);
    categoriesDDRef.current.reset();
    setFilterCategoriesData([]);
    setFilterCategoriesName("");
    setFilterProductsName("");
    FetchCategoriesFromServices(selectedItem);
  };

  const onCategoriesNameSelected = (selectedItem) => {
    setFilterCategoriesName(selectedItem);
    productsDDRef.current.reset();
    setFilterProductsName("");
    FetchProductsFromCategory(selectedItem);
  };

  const onProductsNameSelected = (selectedItem) => {
    setFilterProductsName(selectedItem);
  };

  const ValidateData = () => {
    let isValid = true;

    if (filterServiceName == "") {
      isValid = false;
    }

    if (isValid) {
      setIsButtonLoading(true);
      FilterData();
    }
    else {
      setSnackbarText("Please select atleast one filter");
      setSnackbarColor(theme.colors.error);
      setSnackbarVisible(true);
    }
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
          <View style={[Styles.flexRow, Styles.flexAlignCenter, Styles.flexSpaceBetween]}>
            <Searchbar editable={pageFilterEnable}
              style={[Styles.margin16, Styles.flex1, pageFilterEnable ? Styles.backgroundColorFullWhite : Styles.backgroundColorGrey]}
              placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
            <IconButton icon="filter-check" onPress={() => {
              setFilterServicesData([]);
              setFilterServiceName("");
              setFilterCategoriesData([]);
              setFilterCategoriesName("");
              setFilterProductsData([]);
              setFilterProductsName("");
              setIsButtonLoading(false);
              FetchActvityRoles();
              refRBSFilter.current.open();
            }} color={theme.colors.accent} size={32} />
          </View>

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
      <FAB style={[Styles.fabStyle]} icon="plus" onPress={AddCallback} />
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
      <RBSheet ref={refRBSFilter} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={340} 
      animationType="fade" 
      customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View style={[Styles.paddingHorizontal16, { paddingBottom: 64 }]}>
          <ScrollView>
            <View style={[Styles.marginTop8]}>
              <Dropdown label="Service Name" data={filterServicesData} onSelected={onServiceNameSelected}
                selectedItem={filterServiceName} reference={servicesDDRef} />
            </View>
            <View style={[Styles.marginTop16]}>
              <Dropdown label="Category Name" data={filterCategoriesData} onSelected={onCategoriesNameSelected}
                selectedItem={filterCategoriesName} reference={categoriesDDRef} />
            </View>
            <View style={[Styles.marginTop16]}>
              <Dropdown label="Product Name" data={filterProductsData} onSelected={onProductsNameSelected}
                selectedItem={filterProductsName} reference={productsDDRef} />
            </View>
            <View style={[Styles.marginTop16, Styles.flexRow, Styles.flexSpaceBetween]}>
              <DFButton mode="contained" onPress={ValidateData} title="Filter Products" loader={isButtonLoading} />
              <DFButton mode="contained"
                onPress={() => {
                  FetchData();
                }}
                title="Clear Filter" loader={isButtonClearFilterLoading} />
            </View>
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default ServiceProductScreen;
