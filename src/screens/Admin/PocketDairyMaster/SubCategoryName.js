import React, { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView } from "react-native";
import { FAB, List, Searchbar, Snackbar, Title } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { APIConverter } from "../../../utils/apiconverter";

let userID = 0, groupID = 0;

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const SubCategoryNameScreen = ({ navigation }) => {
  //#region Variables
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [entryTypeName, setEntryTypeName] = React.useState("");
  const [transactionTypeName, setTransactionTypeName] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [subCategoryName, setSubCategoryName] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [display, setDisplay] = React.useState(false);
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
        Sess_UserRefno: userID,
        pck_sub_category_refno: "all",
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.pcksubcategoryrefnocheck_appadmin, params)
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

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      groupID = JSON.parse(userData).Sess_group_refno;

      FetchData();
    }

  };

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

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 72 }]}>
        <List.Item
          title={data.item.subCategoryName}
          titleStyle={{ fontSize: 18 }}
          description={"Display: " + (data.item.display ? "Yes" : "No")}
          description={`Transaction Type: ${data.item.transactionTypeName}\nCategory: ${data.item.categoryName}`}
          onPress={() => {
            refRBSheet.current.open();
            setEntryTypeName(data.item.entrytype_name);
            setTransactionTypeName(data.item.transactionTypeName);
            setCategoryName(data.item.categoryName);
            setSubCategoryName(data.item.subCategoryName);
            setNotes(data.item.notes);
            setDisplay(data.item.display);


          }}
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="file-tree" />}
          right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
        />
      </View>
    );
  };

  const AddCallback = () => {
    navigation.navigate("AddSubCategoryNameScreen", { type: "add", fetchData: FetchData });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddSubCategoryNameScreen", {
      type: "edit",
      fetchData: FetchData,
      data: {
        id: data.item.id,
        transtypeID: data.item.transtypeID,
        entryTypeName: data.item.entrytype_name,
        transactionTypeName: data.item.transactionTypeName,
        categoryName: data.item.categoryName,
        pckCategoryID: data.item.pckCategoryID,
        subCategoryName: data.item.subCategoryName,
        subcategoryID: data.item.subcategoryID,
        notes: data.item.notes,
        display: data.item.display,
      },
    });
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Sub Category" />
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
            refreshControl={<RefreshControl colors={[theme.colors.primary]} refreshing={refreshing} onRefresh={() => FetchData()} />}
            data={listSearchData[0]}
            useFlatList={true}
            disableRightSwipe={true}
            rightOpenValue={-72}
            renderItem={(data) => RenderItems(data)}
            //renderHiddenItem={(data, rowMap) => RenderHiddenItems(data, rowMap, [EditCallback])}

            renderHiddenItem={(data, rowMap) => {

              if (data.item.createbyID == "2") {
                return null;
              }
              else {
                return RenderHiddenItems(data, rowMap, [EditCallback])
              }

            }}

            

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
          <Title style={[Styles.paddingHorizontal16]}>{subCategoryName}</Title>
          <ScrollView style={{ marginBottom: 64 }}>
            <List.Item title="Entry Type" description={entryTypeName} />
            <List.Item title="Transaction Type" description={transactionTypeName} />
            <List.Item title="Category" description={categoryName} />
            <List.Item title="Notes" description={notes} />
            <List.Item title="Display" description={display ? "Yes" : "No"} />
          </ScrollView>
        </View>
      </RBSheet>

    </View>
  );
};

export default SubCategoryNameScreen;
