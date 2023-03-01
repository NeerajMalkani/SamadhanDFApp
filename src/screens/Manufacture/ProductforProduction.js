import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  View,
  LogBox,
  RefreshControl,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FAB, List, Snackbar, Searchbar, Title } from "react-native-paper";
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

let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
function ProductforProduction({ navigation }) {
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

  const [addedDate, setAddedDate] = React.useState("");
  const [serviceName, setServiceName] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [productName, setproductName] = React.useState("");
  const [totalProducts, setTotalProducts] = React.useState("");
  const [weightPerPiece, setWeightPerPiece] = React.useState("");
  const [current, setCurrent] = React.useState({});
  const refRBSheet = useRef();
  //#endregion

  //#region Functions
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
        mfpp_refno: "all",
      },
    };
    console.log(params);
    Provider.createDFManufacturer(Provider.API_URLS.mfpprefnocheck, params)
      .then((response) => {
        console.log(response.data.data[0]);
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
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
          title={data.item.service_name}
          titleStyle={{ fontSize: 18 }}
          description={`Category Name: ${
            NullOrEmpty(data.item.category_name) ? "" : data.item.category_name
          }\nProduct Name: ${
            NullOrEmpty(data.item.product_name) ? "" : data.item.product_name
          } `}
          onPress={() => {
            refRBSheet.current.open();
            console.log(data.item);
            setServiceName(data.item.service_name);
            setCategoryName(data.item.category_name);
            setproductName(data.item.product_name);
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
    navigation.navigate("AddProduction", { type: "add", fetchData: FetchData });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();

    navigation.navigate("EditProductForProduction", {
      type: "edit",
      fetchData: FetchData,
      data: {
        ...data.item,
      },
    });
  };
  //#endregion
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Product For Production" />
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
        height={520}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{serviceName}</Title>
          <ScrollView>
            <List.Item title="Service Name" description={serviceName} />
            <List.Item title="Category Name" description={categoryName} />
            <List.Item
              title="Product Name >> Brand"
              description={`${productName} >> ${current.brand_name}`}
            />
            <List.Item
              title="Product length in Mtr"
              description={current.length_mtr_value}
            />
            <List.Item
              title="Product (Thickness of Raw Material) "
              description={current.thick_product_name}
            />
            <List.Item
              title="Raw Material width in mm"
              description={current.width_mm_value}
            />
            <List.Item
              title="Display"
              description={current.view_status == 1 ? "Yes" : "No"}
            />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
}

export default ProductforProduction;
