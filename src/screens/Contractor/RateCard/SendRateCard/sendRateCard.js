import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, RefreshControl, LogBox, ScrollView } from "react-native";
import { FAB, List, Searchbar, Snackbar, Title, Dialog, Portal, Paragraph, Button, Text, TextInput, Card, HelperText, DataTable } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../../api/Provider";
import Header from "../../../../components/Header";
import NoItems from "../../../../components/NoItems";
import { theme } from "../../../../theme/apptheme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RenderHiddenItems, RenderHiddenMultipleItems } from "../../../../components/ListActions";
import { Styles } from "../../../../styles/styles";
import { NullOrEmpty } from "../../../../utils/validations";
import { width } from "@fortawesome/free-solid-svg-icons/faBarsStaggered";
import { communication } from "../../../../utils/communication";
// import SearchNAdd from "../../../AddItems/SearchNAdd";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
let userID = 0;

const SendRateCard = ({ navigation }) => {

   //#region Variables
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [clientName, setClientName] = React.useState("");
  const [clientNumber, setClientNumber] = React.useState("");
  const [unit,setUnit] = React.useState("");
  const [material,setMaterial]=React.useState("");
  const [status,setStatus]=React.useState("");
  const refRBSheet = useRef();



 //#endregion 

 //#region Functions

 const GetUserID = async () => {
  const 
  userData = await AsyncStorage.getItem("user");
  if (userData !== null) {
    userID = JSON.parse(userData).UserID;
    FetchData("");
  }
};

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      AddedByUserID: userID
    };

    Provider.getAll(`master/getcontractorratecardsentlist?${new URLSearchParams(params)}`)
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
    GetUserID();
  }, []);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      listSearchData[1](listData[0]);
    } else {
      listSearchData[1](
        listData[0].filter((el) => {
          return el.activityRoleName.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };

  const AddCallback = () => {
    navigation.navigate("AddSendRateCard", { type: "add", fetchData: FetchData });
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 80 }]}>
      <List.Item
        title={data.item.clientName}
        titleStyle={{ fontSize: 18 }}
        description={`Client Number: ${NullOrEmpty(data.item.contactNo) ? "" : data.item.contactNo}\nUnit: ${NullOrEmpty(data.item.unit) ? "" : data.item.unit} `}
        onPress={() => {

          refRBSheet.current.open(); 
          setClientName(data.item.clientName);
          setClientNumber(data.item.contactNo);
          setUnit(data.item.unit);
          setMaterial(data.item.inclusiveMaterials ? "Yes": "No");
          setStatus(data.item.sendStatus ? "Yes": "No");

        }}
        left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="cards" />}
        right={() => <Icon style={{ marginVertical: 18, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
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
                  FetchData("");
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
      <FAB style={[Styles.fabStyle]} icon="plus" onPress={AddCallback} />
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>

      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={380} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
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
