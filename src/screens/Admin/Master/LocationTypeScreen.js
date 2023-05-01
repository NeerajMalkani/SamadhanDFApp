import { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  View,
  LogBox,
  RefreshControl,
  ScrollView,
} from "react-native";
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
import { APIConverter } from "../../../utils/apiconverter";
import Search from "../../../components/Search";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const LocationTypeScreen = ({ navigation }) => {
  //#region Variables
  const [isLoading, setIsLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [listSearchData, setListSearchData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.success);

  const [selectedBranchType, setSelectedBranchType] = useState("");
  const [activityName, setActivityName] = useState([]);
  const [serviceName, setServiceName] = useState([]);

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
        locationtype_refno: "all",
      },
    };

    Provider.createDFAdmin(Provider.API_URLS.LocationTypeRefNoCheck, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
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
          title={data.item.branchType}
          titleStyle={{ fontSize: 18 }}
          description={"Display: " + (data.item.display ? "Yes" : "No")}
          left={() => (
            <Icon
              style={{ marginVertical: 12, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="google-maps"
            />
          )}
          onPress={() => {
            refRBSheet.current.open();
            setSelectedBranchType(data.item.branchType);
            setActivityName(data.item.activityRoleName.join(", "));
            setServiceName(data.item.serviceName.join(", "));
          }}
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
    navigation.navigate("AddLocationTypeScreen", {
      type: "add",
      fetchData: FetchData,
    });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddLocationTypeScreen", {
      type: "edit",
      fetchData: FetchData,
      data: {
        id: data.item.id,
        branchType: data.item.branchType,
        activityName: data.item.activityRoleName,
        serviceName: data.item.serviceName,
        display: data.item.display,
      },
    });
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Location Type" />
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
            filterFunction={["branchType", "activityName", "display"]}
            // ! can't search on the array field
            // filterFunction={(text) => (item) =>
            //   item?.branchType?.toLowerCase()?.includes(text?.toLowerCase()) ||
            //   item?.activityRoleName[0]
            //     ?.toLowerCase()
            //     ?.includes(text?.toLowerCase()) ||
            //   item?.activityRoleName[1]
            //     ?.toLowerCase()
            //     ?.includes(text?.toLowerCase()) ||
            //   item?.serviceName[0]
            //     ?.toLowerCase()
            //     ?.includes(text?.toLowerCase())}
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
              useFlatList={true}
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
        height={260}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>
            {selectedBranchType}
          </Title>
          <ScrollView>
            <List.Item title="Activity Name" description={activityName} />
            <List.Item title="Service Name" description={serviceName} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default LocationTypeScreen;
