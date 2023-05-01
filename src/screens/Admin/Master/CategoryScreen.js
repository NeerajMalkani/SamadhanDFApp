import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  View,
  LogBox,
  RefreshControl,
  ScrollView,
} from "react-native";
import { FAB, List, Snackbar, Title } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import {
  APIConverter,
  RemoveUnwantedParameters,
} from "../../../utils/apiconverter";
import Search from "../../../components/Search";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const CategoryScreen = ({ navigation }) => {
  //#region Variables
  const [isLoading, setIsLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [listSearchData, setListSearchData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.success);

  const [selectedCategoryName, setSelectedCategoryName] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [activityRoleName, setActivityRoleName] = useState("");
  const [hsnsacCode, setHsnsacCode] = useState("");
  const [gstRate, setGstRate] = useState("");
  const [unitName, setUnitName] = useState("");

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
        Sess_UserRefno: "2",
        category_refno: "all",
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.CategoryFromRefNo, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = RemoveUnwantedParameters(response.data.data, [
              "group_refno",
              "service_refno",
            ]);
            response.data.data = APIConverter(
              response.data.data,
              null,
              "master_category"
            );
            const lisData = [...response.data.data];
            lisData.map((k, i) => {
              k.key = (parseInt(i) + 1).toString();
            });
            setListData(response.data.data);
            setListSearchData(response.data.data);
          }
        } else {
          setListData([]);
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
          title={data.item.categoryName}
          titleStyle={{ fontSize: 18 }}
          description={"Display: " + (data.item.display ? "Yes" : "No")}
          onPress={() => {
            refRBSheet.current.open();
            setActivityRoleName(data.item.activityRoleName);
            setSelectedCategoryName(data.item.categoryName);
            setServiceName(data.item.serviceName);
            setHsnsacCode(data.item.hsnsacCode);
            setGstRate(data.item.gstRate + "%");
            setUnitName(
              data.item.unitName ? data.item.unitName.join(", ") : ""
            );
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
    navigation.navigate("AddCategoryScreen", {
      type: "add",
      fetchData: FetchData,
    });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddCategoryScreen", {
      type: "edit",
      fetchData: FetchData,
      data: {
        id: data.item.id,
        activityRoleName: data.item.activityRoleName,
        serviceName: data.item.serviceName,
        unitName: data.item.unitName,
        unitOfSalesID: data.item.unitOfSalesID,
        categoryName: data.item.categoryName,
        hsnsacCode: data.item.hsnsacCode,
        gstRate: data.item.gstRate,
        display: data.item.display,
      },
    });
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Category" />
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
      ) : listData.length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Search
            data={listData}
            setData={setListSearchData}
            filterFunction={[
              "activityRoleName",
              "categoryName",
              "display",
              "gstRate",
              "hsnsacCode",
              "serviceName",
              // ! how'll do to this?
              // "unitName[0]",
            ]}
          />
          {listSearchData?.length > 0 ? (
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
              data={listSearchData}
              disableRightSwipe={true}
              rightOpenValue={-72}
              renderItem={(data) => RenderItems(data)}
              renderHiddenItem={(data, rowMap) =>
                RenderHiddenItems(data, rowMap, [EditCallback])
              }
            />
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
        height={420}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>
            {selectedCategoryName}
          </Title>
          <ScrollView>
            <List.Item
              title="Activity Role Name"
              description={activityRoleName}
            />
            <List.Item title="Service Name" description={serviceName} />
            <List.Item title="HSN / SAC Code" description={hsnsacCode} />
            <List.Item title="GST Rate" description={gstRate} />
            <List.Item title="Unit name" description={unitName} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default CategoryScreen;
