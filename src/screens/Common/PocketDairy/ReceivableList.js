import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  View,
  LogBox,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { List, Title } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";

import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { PayableReceivableTransactionListItem } from "./PayableReceivableTransactionListItem";

let userID = 0;
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const ReceivableList = ({ navigation }) => {
  //#region Variables

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [listSearchData, setListSearchData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.success);

  const [contactName, setContactName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setpaymentMode] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [recurringDate, setRecurringDate] = useState("");

  const refRBSheet = useRef();
  //#endregion

  //#region Functions

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      FetchData();
    }
  };

  const FetchData = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
      },
    };
    Provider.createDFPocketDairy(
      Provider.API_URLS.pckdashboard_receivablelist,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
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
    GetUserID();
  }, []);

  const RenderItems = (data) => {
    return (
      <View
        style={[
          Styles.backgroundColor,
          Styles.paddingHorizontal16,
          Styles.flexJustifyCenter,
          { height: 100 },
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            refRBSheet.current.open();

            setContactName(data.item.contact_name);
            setContactNo(data.item.contact_phoneno);
            setAmount(data.item.amount);
            setpaymentMode(data.item.pck_mode_name);
            setPaymentDate(data.item.pck_trans_date);
            setRecurringDate(data.item.reminder_date);
          }}
          style={[
            Styles.paddingVertical8,
            Styles.paddingHorizontal8,
            Styles.flexRow,
            Styles.borderRadius8,
            Styles.backgroundSecondaryLightColor,
            { elevation: 4 },
          ]}
        >
          <PayableReceivableTransactionListItem current={data} type="receive" />
        </TouchableOpacity>
      </View>
    );
  };

  //#endregion

  return (
    <View style={[Styles.flex1]}>
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
            filterFunction={["categoryName"]}
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
            />
          ) : (
            <NoItems
              icon="format-list-bulleted"
              text="No records found for your query"
            />
          )}
        </View>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found" />
      )}

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={440}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{contactName}</Title>
          <ScrollView>
            <List.Item title="Contact No." description={contactNo} />
            <List.Item title="Amount " description={amount} />
            <List.Item title="Payment Mode" description={paymentMode} />
            <List.Item title="Payment Date" description={paymentDate} />
            <List.Item title="Recurring Date" description={recurringDate} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default ReceivableList;
