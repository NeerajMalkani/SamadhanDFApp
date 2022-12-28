import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView, Image } from "react-native";
import { FAB, List, Searchbar, Snackbar, Title } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import RBSheet from "react-native-raw-bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
//import { APIConverter } from "../../../utils/apiconverter";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
let dealerID = 0,
  ifBrandCreate = 0;

const DealerProductScreen = ({ navigation }) => {
  //#region Variables
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [brandName, setBrandName] = React.useState("");
  const [brandPrefix, setBrandPrefix] = React.useState("");
  const [productName, setProductName] = React.useState("");
  const [image, setImage] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [unitValue, setUnitValue] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [unitOfSale, setUnitOfSale] = React.useState("");
  const [convertUnit, setUonvertUnit] = React.useState("");
  const [display, setDisplay] = React.useState("");
  const [announceStatus, setAnnounceStatus] = React.useState("");
  const [approveStatus, setApproveStatus] = React.useState("");

  const refRBSheet = useRef();

  //#endregion

  //#region Functions

  const APIConverter = (response) => {
    function renameKey(obj, oldKey, newKey) {
      if (obj.hasOwnProperty(oldKey)) {
        obj[newKey] = obj[oldKey];
        if (newKey === "display") {
          obj[newKey] = obj[newKey] == "1" ? true : false;
        }
        delete obj[oldKey];
      }
    }

    response.forEach((obj) => {
      renameKey(obj, "actual_unit_name", "unitOfSale");
      renameKey(obj, "actual_unit_name_txt", "unitOfSaleText");
      renameKey(obj, "actual_unit_refno", "unitID");
      renameKey(obj, "brand_name", "brandName");
      renameKey(obj, "brand_refno", "brandID");
      renameKey(obj, "company_product_refno", "id");
      renameKey(obj, "convert_unit_name", "convertUnitName");
      renameKey(obj, "product_refno", "productID");
      renameKey(obj, "product_name", "productName");

      renameKey(obj, "brand_prefixname", "brandPrefix");
      renameKey(obj, "convert_unit_refno", "convertedUnitID");
      renameKey(obj, "converted_unit_value", "convertedUnitValue");
      renameKey(obj, "isapprove", "isApprove");
      renameKey(obj, "ispublish", "isPublish");
      renameKey(obj, "product_image_url", "image");
      renameKey(obj, "sales_unit", "unitOfSale");
      renameKey(obj, "view_status", "display");
    });

    return response;
  };

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      dealerID = JSON.parse(userData).UserID;
      ifBrandCreate = JSON.parse(userData).Sess_if_create_brand;
      FetchData();
    }
  };

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }

    let params = {
      data: {
        Sess_UserRefno: dealerID,
        company_product_refno: "all",
        Sess_if_create_brand: ifBrandCreate,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.dealercompanyproductrefnocheck, params)
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
    GetUserID();
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

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 72 }]}>
        <List.Item
          title={`${data.item.brandPrefix} ${data.item.productName}`}
          titleStyle={{ fontSize: 18 }}
          description={"Brand: " + data.item.brandName}
          onPress={() => {
            refRBSheet.current.open();
            setBrandName(data.item.brandName);
            setBrandPrefix(data.item.brandPrefix);
            setProductName(data.item.productName);
            setImage(data.item.image);
            setPrice(data.item.price);
            setUnitValue(data.item.unitValue);
            setDescription(data.item.description);

            setUnitOfSale(data.item.unitOfSale);
            setUonvertUnit(data.item.convertUnitName);
            setDisplay(data.item.display ? "Yes" : "No");
            setAnnounceStatus(data.item.isPublish == "1" ? "Yes" : "No");
            setApproveStatus(data.item.isApprove == "1" ? "Yes" : "No");
          }}
          left={() => <Image source={{ uri: data.item.image }} style={[Styles.width56, Styles.height56]} />}
          // left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="account-group" />}
          right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
        />
      </View>
    );
  };

  const AddCallback = () => {
    navigation.navigate("AddDealerProductScreen", { type: "add", fetchData: FetchData });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddDealerProductScreen", {
      type: "edit",
      fetchData: FetchData,
      data: {
        id: data.item.id,
        brandID: data.item.brandID,
        brandName: data.item.brandName,
        productID: data.item.productID,
        productName: data.item.productName,
        image: data.item.image,
        price: data.item.price,
        unitValue: data.item.convertedUnitValue,
        description: data.item.description,
        display: data.item.display,
      },
    });
  };
  //#endregion

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
            useFlatList={true}
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
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={560} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View style={{ paddingBottom: 32 }}>
          <Title style={[Styles.paddingHorizontal16]}>{`${brandPrefix} ${productName}`}</Title>
          <ScrollView>
            <List.Item title="Brand Name" description={brandName} />
            <List.Item title="Product Image" />
            <Image source={{ uri: image }} style={[Styles.height104, Styles.width104, Styles.marginStart16]} />
            <List.Item title="Unit Of Sales" description={unitOfSale} />
            <List.Item title="Converted Unit" description={convertUnit} />
            <List.Item title="Display" description={display} />
            <List.Item title="Announce Status" description={announceStatus} />
            <List.Item title="Approve Status" description={approveStatus} />
            <List.Item title="Price" description={price} />
            <List.Item title="Description" description={description} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default DealerProductScreen;
