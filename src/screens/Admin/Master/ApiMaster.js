import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView, Text } from "react-native";
import { List, Snackbar, Searchbar, Title, DataTable } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const ApiMaster = ({ navigation }) => {
  //#region Variables
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [rbloader, setRbloader] = React.useState(false);
  const listData = React.useState([]);
  const apiDetails = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [apiName, setApiName] = React.useState("");
  const [apiBaseName, setApiBaseName] = React.useState("");
  const [apiPostUrl, setApiPostUrl] = React.useState("");
  const [apiGetUrl, setApiGetUrl] = React.useState("");
  const refRBSheet = useRef();

  const dataAndroid = React.useState([]);
  const dataIOS = React.useState([]);
  const dataWeb = React.useState([]);

  //#endregion

  //#region Functions
  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }

    const params = {
      data: {
        api_id: "all"
      }
    };
    Provider.createDFAdmin(Provider.API_URLS.getapilist, params)
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

  const FetchAPIDetail = (apiID) => {
    setRbloader(true);
    const params = {
      data: {
        Sess_UserRefno: "2",
        api_id: apiID
      }
    };
    Provider.createDFAdmin(Provider.API_URLS.getapitaskreport, params)
      .then((response) => {
        setRbloader(false);
        //console.log('response:', response.data.data);
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            //apiDetails[1](response.data.data);

            const objectArray = Object.entries(response.data.data);
            //console.log('array', objectArray);

            if (objectArray.length > 0) {

              objectArray.map(([key, value]) => {
                console.log('key: ', key);
              });

            }

          }
        } else {

          setSnackbarText("No data found");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
        setRbloader(false);
        setRefreshing(false);
      })
      .catch((e) => {
        setRbloader(false);
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
          return el.api_name.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 72 }]}>
        <List.Item
          title={data.item.api_name}
          titleStyle={{ fontSize: 18 }}
          description={`API Number: ${data.item.api_id}`}
          onPress={() => {
            setRbloader(true);
            setApiName("Name: " + data.item.api_name);
            FetchAPIDetail(data.item.api_id);
            refRBSheet.current.open();
          }}
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="api" />}
          right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
        />
      </View>
    );
  };

  const AddCallback = () => {
    navigation.navigate("AddApiMaster", { type: "add", fetchData: FetchData });
  };

  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Api Master" />
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
          />
        </View>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found" />
      )}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={420} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{apiName}</Title>
          <ScrollView>
            {rbloader ? (
              <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            ) : apiDetails[0] != null ? (
              <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
                {apiDetails.map((data, index) => (
                  <Text>{data[index]}</Text>

                  // <View style={[Styles.padding16]}>
                  //   <DataTable
                  //     style={[
                  //       Styles.backgroundSecondaryColor,
                  //       Styles.borderRadius4,
                  //       Styles.flexJustifyCenter,
                  //       Styles.bordergray,
                  //       Styles.fontBold,
                  //     ]}
                  //   >
                  //     <DataTable.Header>
                  //       <DataTable.Title
                  //         style={[{ flex: 1, justifyContent: "center" }]}
                  //       >
                  //         Collected
                  //       </DataTable.Title>
                  //       <DataTable.Title
                  //         style={[
                  //           Styles.borderLeft1,
                  //           { flex: 1, justifyContent: "center" },
                  //         ]}
                  //         numeric
                  //       >
                  //         Paid
                  //       </DataTable.Title>
                  //       <DataTable.Title
                  //         style={[
                  //           Styles.borderLeft1,
                  //           { flex: 1, justifyContent: "center" },
                  //         ]}
                  //         numeric
                  //       >
                  //         Balance
                  //       </DataTable.Title>
                  //     </DataTable.Header>

                  //     <DataTable.Row style={[Styles.backgroundColor]}>
                  //       <DataTable.Cell
                  //         style={[{ flex: 1, justifyContent: "center" }]}
                  //       >
                  //         {collectedAmount}
                  //       </DataTable.Cell>
                  //       <DataTable.Cell
                  //         style={[
                  //           Styles.borderLeft1,
                  //           { flex: 1, justifyContent: "center" },
                  //         ]}
                  //       >
                  //         {paidAmount}
                  //       </DataTable.Cell>
                  //       <DataTable.Cell
                  //         style={[
                  //           Styles.borderLeft1,
                  //           { flex: 1, justifyContent: "center" },
                  //         ]}
                  //       >
                  //         {balanceAmount}
                  //       </DataTable.Cell>
                  //     </DataTable.Row>
                  //   </DataTable>
                  // </View>


                ))}
              </View>
            ) : (
              <NoItems icon="format-list-bulleted" text="No records found" />
            )}
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default ApiMaster;
