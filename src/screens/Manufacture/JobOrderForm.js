import React, { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  View,
  LogBox,
  RefreshControl,
  ScrollView,
} from "react-native";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import {
  FAB,
  List,
  Snackbar,
  TextInput,
  Title,
  Button,
  Text,
} from "react-native-paper";
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

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;

function JobOrderform({ navigation }) {
  const [current, setCurrent] = React.useState({});
  const [isLoading, setIsLoading] = React.useState(false);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [total, setTotal] = React.useState("");
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );

  const [date, setDate] = React.useState({
    start_date: new Date(),
    end_date: new Date(),
  });

  const refRBSheet = useRef();

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText(
        "Item " + (from === "add" ? "added" : "updated") + " successfully"
      );
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    if (date.start_date > date.end_date) {
      setSnackbarText("Enter Correct Range");
      setSnackbarColor(theme.colors.error);
      setSnackbarVisible(true);
      return;
    }
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        from_date: date.start_date,
        to_date: date.end_date,
      },
    };
    Provider.createDFManufacturer(
      Provider.API_URLS.get_searchresult_joborderform_report,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const data = [];
            Object.entries(response.data.data)?.map(([key, value]) => {
              if (!isNaN(key)) {
                data.push(value);
              }
            });
            listData[1](data);
            listSearchData[1](data);
            setTotal(response.data.data.total_weight_Total);
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
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    GetUserID();
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
          title={`Job Order No: ${data.item.mf_vo_no}`}
          titleStyle={{ fontSize: 18 }}
          description={`Vendor Name: ${data.item.vendor_company_name}`}
          left={() => (
            <Icon
              style={{ marginVertical: 12, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="file-tree"
            />
          )}
          onPress={() => {
            refRBSheet.current.open();
            setCurrent(data.item);
          }}
        />
      </View>
    );
  };
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Job Order Form" />
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
      ) : (
        <>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, padding: 5 }}>
              <DateTimePicker
                mode="outlined"
                style={Styles.backgroundColorWhite}
                label="Start Date"
                type="date"
                value={date.start_date}
                onChangeDate={(date) => {
                  setDate((prev) => {
                    return { ...prev, start_date: date };
                  });
                }}
              />
            </View>
            <View style={{ flex: 1, padding: 5 }}>
              <DateTimePicker
                style={Styles.backgroundColorWhite}
                label="End Date"
                mode="outlined"
                type="date"
                value={date.end_date}
                onChangeDate={(date) => {
                  setDate((prev) => {
                    return { ...prev, end_date: date };
                  });
                }}
              />
            </View>
          </View>
          <View>
            <View
              style={{ width: "100%", padding: 5, justifyContent: "center" }}
            >
              <Button
                mode="contained"
                onPress={() => {
                  listSearchData[1]([]);
                  listData[1]([]);
                  setTotal("");
                  FetchData();
                }}
              >
                Search
              </Button>
            </View>
          </View>
          <ScrollView
            style={[
              Styles.flex1,
              Styles.flexColumn,
              Styles.backgroundColor,
              { padding: 8 },
            ]}
          >
            {listData[0].length > 0 ? (
              <>
                <View
                  style={[
                    Styles.flex1,
                    Styles.flexColumn,
                    Styles.backgroundColor,
                    { padding: 8 },
                  ]}
                >
                  <Text
                    style={[
                      { marginLeft: 2, marginBottom: 5 },
                      Styles.fontSize18,
                    ]}
                  >{`Total Weight: ${total}`}</Text>
                  {listData[0].map((item, idx) => {
                    return (
                      <View
                        style={{
                          borderRadius: 15,
                          borderWidth: 1,
                          borderColor: theme.colors.primary,
                          padding: 10,
                          marginBottom: 8,
                        }}
                        key={idx}
                      >
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ flex: 1, padding: 5 }}>
                            <TextInput
                              mode="outlined"
                              label="Job Order No"
                              value={item.mf_vo_no}
                              editable={false}
                              returnKeyType="next"
                              style={[{ backgroundColor: "white", height: 40 }]}
                            />
                          </View>
                          <View style={{ flex: 1, padding: 5 }}>
                            <TextInput
                              mode="outlined"
                              label="Job Order Date"
                              value={item.mf_po_date}
                              editable={false}
                              returnKeyType="next"
                              style={[{ backgroundColor: "white", height: 40 }]}
                            />
                          </View>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ flex: 1, padding: 5 }}>
                            <TextInput
                              mode="outlined"
                              label="Vendor Name"
                              value={item.vendor_company_name}
                              editable={false}
                              returnKeyType="next"
                              style={[{ backgroundColor: "white", height: 40 }]}
                            />
                          </View>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                          <View style={{ flex: 1.2, padding: 5 }}>
                            <TextInput
                              mode="outlined"
                              label="Weight"
                              value={item.total_weight}
                              editable={false}
                              style={[{ backgroundColor: "white", height: 40 }]}
                            />
                          </View>
                          <View style={{ flex: 1, padding: 5 }}>
                            <TextInput
                              mode="outlined"
                              label="Width"
                              value={item.gpcoil_width_value}
                              editable={false}
                              returnKeyType="next"
                              style={[{ backgroundColor: "white", height: 40 }]}
                            />
                          </View>
                          <View style={{ flex: 1, padding: 5 }}>
                            <TextInput
                              mode="outlined"
                              label="Thickness"
                              value={item.product_name}
                              editable={false}
                              returnKeyType="next"
                              style={[{ backgroundColor: "white", height: 40 }]}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  })}

                  {/* <SwipeListView
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
                /> */}
                </View>
              </>
            ) : (
              <NoItems
                icon="format-list-bulleted"
                text="No records found"
              />
            )}
          </ScrollView>
        </>
      )}

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
        height={580}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{current.mf_vo_no}</Title>
          <ScrollView>
            <List.Item
              title="Job Order Date"
              description={current.mf_po_date}
            />
            <List.Item title="Job Order No" description={current.mf_vo_no} />
            <List.Item
              title="Vendor Name"
              description={current.vendor_company_name}
            />
            <List.Item title="Weight" description={current.total_weight} />
            <List.Item title="Width" description={current.gpcoil_width_value} />
            <List.Item title="Thickness" description={current.product_name} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
}

export default JobOrderform;
