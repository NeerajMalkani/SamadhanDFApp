import React, { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  View,
  RefreshControl,
  LogBox,
  ScrollView,
} from "react-native";
import {
  FAB,
  List,
  Searchbar,
  Snackbar,
  Title,
  Dialog,
  Portal,
  Paragraph,
  Button,
  Text,
  TextInput,
  Card,
  HelperText,
  DataTable,
} from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../../api/Provider";
import Header from "../../../../components/Header";
import NoItems from "../../../../components/NoItems";
import { theme } from "../../../../theme/apptheme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  RenderHiddenItems,
  RenderHiddenMultipleItems,
} from "../../../../components/ListActions";
import { Styles } from "../../../../styles/styles";
import { NullOrEmpty } from "../../../../utils/validations";
import { width } from "@fortawesome/free-solid-svg-icons/faBarsStaggered";
import { communication } from "../../../../utils/communication";
// import SearchNAdd from "../../../AddItems/SearchNAdd";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
let userID = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_group_refno = 0;
const SendRateCard = ({ navigation }) => {
  //#region Variables
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
  const [current, setCurrent] = React.useState({});
  const [clientName, setClientName] = React.useState("");
  const [clientNumber, setClientNumber] = React.useState("");
  const [unit, setUnit] = React.useState("");
  const [material, setMaterial] = React.useState("");
  const [status, setStatus] = React.useState("");
  const refRBSheet = useRef();

  //#endregion

  //#region Functions

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      Sess_group_refno = JSON.parse(userData).Sess_group_refno;
      Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
      Sess_company_refno = JSON.parse(userData).Sess_company_refno;
      FetchData();
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
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_group_refno: Sess_group_refno,
        cont_rc_refno: "all",
      },
    };

    Provider.createDFContractor(
      Provider.API_URLS.contractor_sendratecard_contrcrefnocheck,
      params
    )
      .then((response) => {
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
          return el.activityRoleName
            .toString()
            .toLowerCase()
            .includes(query.toLowerCase());
        })
      );
    }
  };

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
          title={data.item.client_firstname}
          titleStyle={{ fontSize: 18 }}
          description={`Client Number: ${
            NullOrEmpty(data.item.client_mobile_no)
              ? ""
              : data.item.client_mobile_no
          }\nUnit: ${
            NullOrEmpty(data.item.rc_unit_type_name)
              ? ""
              : data.item.rc_unit_type_name
          } `}
          onPress={() => {
            setCurrent(data.item);
            refRBSheet.current.open();
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
        ...data.item,
      },
    });
  };

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
                  FetchData("");
                }}
              />
            }
            data={listSearchData[0]}
            useFlatList={true}
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
      <FAB style={[Styles.fabStyle]} icon="plus" onPress={AddCallback} />
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
        height={500}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>
            {current.client_firstname}
          </Title>
          <ScrollView style={{ marginBottom: 64 }}>
            <List.Item
              title="Client Number"
              description={current.client_mobile_no}
            />
            <List.Item title="Unit" description={current.rc_unit_type_name} />
            <List.Item title="Material" description={current.material_status} />
            <List.Item title="Status" description={current.rc_status} />
            {current?.action_button?.includes("Preview Rate Card") && (
              <View style={{ alignItems: "center", marginTop: "4%" }}>
                <Button
                  mode="outlined"
                  style={{
                    borderColor: "pink",
                    borderWidth: 1.2,
                    color: "pink",
                    width: "80%",
                  }}
                  // onPress={() => {
                  //   refRBSheet.current.close();
                  // }}
                >
                  <Text style={{ color: "pink" }}>Preview Rate Card</Text>
                </Button>
              </View>
            )}
            {current?.action_button?.includes("Send Rate Card") && (
              <View style={{ alignItems: "center", marginTop: "4%" }}>
                <Button
                  mode="outlined"
                  style={{
                    borderColor: "green",
                    borderWidth: 1.2,
                    color: "green",
                    width: "80%",
                  }}
                  // onPress={() => {
                  //   refRBSheet.current.close();
                  // }}
                >
                  <Text style={{ color: "green" }}>Send Rate Card</Text>
                </Button>
              </View>
            )}
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default SendRateCard;
