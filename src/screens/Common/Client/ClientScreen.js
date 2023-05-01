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
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import NoItems from "../../../components/NoItems";
import { theme } from "../../../theme/apptheme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RenderHiddenItems } from "../../../components/ListActions";
import { Styles } from "../../../styles/styles";
import { APIConverter } from "../../../utils/apiconverter";
import Search from "../../../components/Search";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
let userID = 0,
  Sess_group_refno = 0;
const ClientScreen = ({ navigation }) => {
  //#region Variables

  const [isLoading, setIsLoading] = useState(true);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.success);
  const [listData, setListData] = useState([]);
  const [listSearchData, setListSearchData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactMobileNumber, setContactMobileNumber] = useState("");
  const [address1, setAddress1] = useState("");
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [pincode, setPincode] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [pan, setPan] = useState("");
  const [addedBy, setAddedBy] = useState(false);
  const [display, setDisplay] = useState(false);

  const refRBSheet = useRef();
  //#endregion

  //#region Functions
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      const userDataParsed = JSON.parse(userData);
      userID = userDataParsed.UserID;
      Sess_group_refno = userDataParsed.Sess_group_refno;
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
        Sess_group_refno: Sess_group_refno,
        client_user_refno: "all",
      },
    };
    Provider.createDFCommon(Provider.API_URLS.MyClientUserRefNoCheck, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            const lisData = [...response.data.data];
            lisData.map((k, i) => {
              k.key = (parseInt(i) + 1).toString();
            });
            console.log(response.data.data);
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
    GetUserID();
  }, []);

  const SearchClient = () => {
    navigation.navigate("SearchClientScreen", {
      type: "add",
      fetchData: FetchData,
    });
  };
  const AddClient = () => {
    navigation.navigate("AddClientScreen", {
      type: "add",
      fetchData: FetchData,
    });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddClientScreen", {
      type: "edit",
      fetchData: FetchData,
      data: {
        id: data.item.client_user_refno,
        companyName: data.item.companyName,
        contactPerson: data.item.contactPersonName,
        contactMobileNumber: data.item.Mobile,
        address1: data.item.addressLine,
        cityName: data.item.cityName,
        stateName: data.item.stateName,
        pincode: data.item.pincode,
        gstNumber: data.item.gstNumber,
        pan: data.item.pan,
        serviceType: data.item.client_role_refno,
        addedBy: data.item.createbyID == 0 ? true : false,
        display: data.item.display,
      },
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
          { height: 72 },
        ]}
      >
        <List.Item
          title={
            data.item.companyName !== ""
              ? data.item.companyName
              : data.item.contactPersonName
          }
          titleStyle={{ fontSize: 18 }}
          description={"Mob.: " + data.item.Mobile}
          onPress={() => {
            refRBSheet.current.open();
            setCompanyName(data.item.companyName);
            setContactPerson(data.item.contactPersonName);
            setContactMobileNumber(data.item.Mobile);
            setAddress1(data.item.addressLine);
            setStateName(data.item.stateName);
            setCityName(data.item.cityName);
            setPincode(data.item.pincode);
            setGstNumber(data.item.gstNumber);
            setPan(data.item.pan);
            setAddedBy(data.item.createbyID);
            setDisplay(data.item.display);
          }}
          left={() => (
            <Icon
              style={{ marginVertical: 12, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="account-group"
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

  const [state, setState] = useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Clients" />
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
              "companyName",
              "contactPerson",
              "contactMobileNumber",
              "address1",
              "cityName",
              "stateName",
              "pincode",
              "gstNumber",
              "pan",
              "serviceType",
              "addedBy",
              "display",
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
      <FAB.Group
        open={open}
        icon={
          open
            ? () => (
                <EntypoIcon
                  name="cross"
                  color={theme.colors.textLight}
                  size={24}
                ></EntypoIcon>
              )
            : () => (
                <EntypoIcon
                  name="plus"
                  color={theme.colors.textLight}
                  size={24}
                ></EntypoIcon>
              )
        }
        actions={[
          {
            icon: "magnify",
            small: false,
            color: theme.colors.text,
            labelTextColor: theme.colors.text,
            label: "Search Client",
            onPress: SearchClient,
          },
          {
            icon: "account-plus-outline",
            color: theme.colors.text,
            labelTextColor: theme.colors.text,
            small: false,
            label: "Add Client",
            onPress: AddClient,
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
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
        height={620}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{companyName}</Title>
          <ScrollView style={{ marginBottom: 64 }}>
            <List.Item title="Contact Person" description={contactPerson} />
            <List.Item
              title="Contact Mobile No"
              description={contactMobileNumber}
            />
            <List.Item title="Address" description={address1} />
            <List.Item title="State Name" description={stateName} />
            <List.Item title="City Name" description={cityName} />
            <List.Item title="Pincode" description={pincode} />
            <List.Item title="GST" description={gstNumber} />
            <List.Item title="PAN" description={pan} />
            <List.Item
              title="Created Or Added"
              description={addedBy == 0 ? "Add" : "Create"}
            />
            <List.Item title="Display" description={display ? "Yes" : "No"} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default ClientScreen;
