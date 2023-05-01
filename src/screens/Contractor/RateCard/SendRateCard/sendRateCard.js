import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  View,
  RefreshControl,
  LogBox,
  ScrollView,
} from "react-native";
import { FAB, List, Snackbar, Title } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../../api/Provider";
import Header from "../../../../components/Header";
import NoItems from "../../../../components/NoItems";
import { theme } from "../../../../theme/apptheme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RenderHiddenItems } from "../../../../components/ListActions";
import { Styles } from "../../../../styles/styles";
import { NullOrEmpty } from "../../../../utils/validations";
import Search from "../../../../components/Search";
// import SearchNAdd from "../../../AddItems/SearchNAdd";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
let userID = 0;

const SendRateCard = ({ navigation }) => {
  //#region Variables
  const [isLoading, setIsLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [listSearchData, setListSearchData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.success);

  const [clientName, setClientName] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [unit, setUnit] = useState("");
  const [material, setMaterial] = useState("");
  const [status, setStatus] = useState("");
  const refRBSheet = useRef();

  //#endregion

  //#region Functions

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      FetchData("");
    }
  };

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText(
        "Item " + (from === "add" ? "added" : "updated") + " successfully"
      );
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      AddedByUserID: userID,
    };

    Provider.getAll(
      `master/getcontractorratecardsentlist?${new URLSearchParams(params)}`
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const lisData = [...response.data.data];
            lisData.map((k, i) => {
              k.key = (parseInt(i) + 1).toString();
            });
            console.log(response.data.data);
            setListData(response.data.data);
            setListSearchData(response.data.data);

            listData[1](response.data.data);
            listSearchData[1](response.data.data);
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
    GetUserID();
  }, []);

  const AddCallback = () => {
    navigation.navigate("AddSendRateCard", {
      type: "add",
      fetchData: FetchData,
    });
  };

  const RenderItems = (data) => {
    return (
      <View
        style={[
          Styles.backgroundColor,
          Styles.borderBottom1,
          Styles.paddingStart16,
          Styles.flexJustifyCenter,
          { height: 80 },
        ]}
      >
        <List.Item
          title={data.item.clientName}
          titleStyle={{ fontSize: 18 }}
          description={`Client Number: ${
            NullOrEmpty(data.item.contactNo) ? "" : data.item.contactNo
          }\nUnit: ${NullOrEmpty(data.item.unit) ? "" : data.item.unit} `}
          onPress={() => {
            setCurrent(data.item);

            refRBSheet.current.open();
            setClientName(data.item.clientName);
            setClientNumber(data.item.contactNo);
            setUnit(data.item.unit);
            setMaterial(data.item.inclusiveMaterials ? "Yes" : "No");
            setStatus(data.item.sendStatus ? "Yes" : "No");
          }}
          left={() => (
            <Icon
              style={{ marginVertical: 12, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="cards"
            />
          )}
          right={() => (
            <Icon
              style={{ marginVertical: 18, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="eye"
            />
          )}
        />
      </View>
    );
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddSendRateCard", {
      type: "edit",
      fetchData: FetchData,
      data: {
        id: data.item.id,
      },
    });
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Send Rate Card" />
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
            filterFunction={["accountHolderName"]}
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
                    FetchData("");
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
        height={380}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{clientName}</Title>
          <ScrollView style={{ marginBottom: 64 }}>
            <List.Item title="Client Number" description={clientNumber} />
            <List.Item title="Unit" description={unit} />
            <List.Item title="Material" description={material} />
            <List.Item title="Status" description={status} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default SendRateCard;
