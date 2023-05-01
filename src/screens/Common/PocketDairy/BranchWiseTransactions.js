import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  View,
  LogBox,
  RefreshControl,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import { Button, List, Snackbar, Title } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { NullOrEmpty } from "../../../utils/validations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AWSImagePath } from "../../../utils/paths";
import { projectVariables } from "../../../utils/credentials";
import { TabBar, TabView } from "react-native-tab-view";
import { SheetElement } from "./SheetElements";
import Search from "../../../components/Search";

let userID = 0,
  companyID = 0,
  branchID = 0;

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const windowWidth = Dimensions.get("window").width;

const BranchWiseTransactionScreen = ({ navigation }) => {
  //#region Variables
  const [index, setIndex] = useState(0);
  const [attachmentImage, setAttachmentImage] = useState(
    AWSImagePath + "placeholder-image.png"
  );
  const [PDCattachmentImage, setPDCAttachmentImage] = useState(
    AWSImagePath + "placeholder-image.png"
  );
  const [searchQuery_Self, setSearchQuery_Self] = useState("");
  const [searchQuery_Company, setSearchQuery_Company] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [listData_Self, setListData_Self] = useState([]);
  const [listSearchData_Self, setListSearchData_Self] = useState([]);

  const [listData_Company, setListData_Company] = useState([]);
  const [listSearchData_Company, setListSearchData_Company] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.success);

  const [date, setDate] = useState(new Date());
  const [dateInvalid, setDateInvalid] = useState("");
  const dateRef = useRef({});
  const [current, setCurrent] = useState({});
  const [transactionID, setTransactionID] = useState("");
  const [entryType, setEntryType] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [receiptMode, setReceiptMode] = useState("");
  const [amount, setAmount] = useState("");
  const [attachment, setAttachment] = useState("");
  const [display, setDisplay] = useState("");
  const [depositType, setDepositType] = useState("");
  const [PDCStatus, setPDCStatus] = useState("");
  const [PayToCompanyStatus, setPayToCompanyStatus] = useState(false);
  //

  const refRBSheet = useRef();
  //#endregion

  //#region Functions

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      companyID = JSON.parse(userData).Sess_company_refno;
      branchID = JSON.parse(userData).Sess_branch_refno;
      FetchData_CompanyPocket();
      FetchData_CompanyBank();
    }
  };

  const ResetFields = () => {
    setPDCStatus(false);
    setPayToCompanyStatus(false);
  };

  const FetchData_CompanyPocket = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID.toString(),
        Sess_branch_refno: branchID.toString(),
      },
    };
    Provider.createDFPocketDairy(
      Provider.API_URLS.pckdashboard_cashinbranch_pocket,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const lisData = [...response.data.data];
            lisData.map((k, i) => {
              k.key = (parseInt(i) + 1).toString();
            });
            setListData_Self(response.data.data);
            setListSearchData_Self(response.data.data);
          }
        } else {
          setListData_Self([]);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
        setRefreshing(false);
      });
  };
  const FetchData_CompanyBank = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID.toString(),
        Sess_branch_refno: branchID.toString(),
      },
    };
    Provider.createDFPocketDairy(
      Provider.API_URLS.pckdashboard_cashinbranch_bank,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const lisData = [...response.data.data];
            lisData.map((k, i) => {
              k.key = (parseInt(i) + 1).toString();
            });
            setListData_Company(response.data.data);
            setListSearchData_Company(response.data.data);
          }
        } else {
          setListData_Company([]);
          //setSnackbarText("No Company data found");
          // setSnackbarColor(theme.colors.error);
          // setSnackbarVisible(true);
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

  const LoadAll = (from) => {
    ResetFields();
    if (from === "add" || from === "update") {
      setSnackbarText(
        "Item " + (from === "add" ? "added" : "updated") + " successfully"
      );
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    FetchData_CompanyPocket();
    FetchData_CompanyBank();
  };

  useEffect(() => {
    GetUserID();
  }, []);

  const RenderItems = (data, type) => {
    return (
      <View
        style={[
          Styles.backgroundColor,
          Styles.borderBottom1,
          Styles.paddingStart16,
          Styles.flexJustifyCenter,
          { height: 110 },
        ]}
      >
        {type == "pocket" ? (
          <List.Item
            title={data.item.location_name}
            titleStyle={{ fontSize: 18 }}
            description={`${
              NullOrEmpty(data.item.locationtype_name)
                ? ""
                : data.item.locationtype_name
            }\nCash: ${
              NullOrEmpty(data.item.TotalCashinHand)
                ? ""
                : data.item.TotalCashinHand
            } `}
            onPress={() => {
              if (parseFloat(data.item.TotalCashinHand) != 0) {
                navigation.navigate("BranchWiseCashDetailScreen", {
                  fetchData: LoadAll,
                  type: "pocket",
                  data: {
                    branch_refno: data.item.branch_refno,
                  },
                });
              } else {
                setSnackbarText("No records available where Cash amount is 0.");
                setSnackbarColor(theme.colors.error);
                setSnackbarVisible(true);
              }
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
        ) : (
          <List.Item
            title={data.item.location_name}
            titleStyle={{ fontSize: 18 }}
            descriptionNumberOfLines={4}
            description={`${
              NullOrEmpty(data.item.locationtype_name)
                ? ""
                : data.item.locationtype_name
            }\nBank: ${data.item.bank_name} (${data.item.bank_account_no})
                            \nCash: ${
                              NullOrEmpty(data.item.TotalCashinBank)
                                ? ""
                                : data.item.TotalCashinBank
                            } `}
            onPress={() => {
              if (parseFloat(data.item.TotalCashinBank) != 0) {
                navigation.navigate("BranchWiseCashDetailScreen", {
                  fetchData: LoadAll,
                  type: "bank",
                  data: {
                    bank_refno: data.item.bank_refno,
                    branch_refno: data.item.branch_refno,
                  },
                });
              } else {
                setSnackbarText("No records available where Cash amount is 0.");
                setSnackbarColor(theme.colors.error);
                setSnackbarVisible(true);
              }
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
        )}
      </View>
    );
  };

  //#endregion

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "companyPocket":
        return (
          <View style={[Styles.flex1]}>
            <ScrollView
              style={[Styles.flex1, Styles.backgroundColor]}
              keyboardShouldPersistTaps="handled"
            >
              <View>
                {listData_Self.length > 0 ? (
                  <View
                    style={[
                      Styles.flex1,
                      Styles.flexColumn,
                      Styles.backgroundColor,
                    ]}
                  >
                    <Search
                      data={listData_Self}
                      setData={setSearchQuery_Self}
                      filterFunction={[
                        "TotalCashinBank",
                        "bank_account_no",
                        "bank_name",
                        "bank_refno",
                        "branch_refno",
                        "key",
                        "location_name",
                        "locationtype_name",
                      ]}
                    />
                    {listSearchData_Self?.length > 0 ? (
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
                              FetchData_CompanyPocket();
                            }}
                          />
                        }
                        data={listSearchData_Self}
                        disableRightSwipe={true}
                        rightOpenValue={-72}
                        renderItem={(data) => RenderItems(data, "pocket")}
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
                    text="No records found"
                  />
                )}
              </View>
            </ScrollView>
          </View>
        );
      case "companyBank":
        return (
          <View style={[Styles.flex1]}>
            <ScrollView
              style={[Styles.flex1, Styles.backgroundColor]}
              keyboardShouldPersistTaps="handled"
            >
              <View>
                {listData_Company.length > 0 ? (
                  <View
                    style={[
                      Styles.flex1,
                      Styles.flexColumn,
                      Styles.backgroundColor,
                    ]}
                  >
                    <Search
                      data={listData_Company}
                      setData={setListSearchData_Company}
                      filterFunction={["categoryName", "display"]}
                    />
                    {listSearchData_Company?.length > 0 ? (
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
                              FetchData_CompanyBank();
                            }}
                          />
                        }
                        data={listSearchData_Company}
                        disableRightSwipe={true}
                        rightOpenValue={-72}
                        renderItem={(data) => RenderItems(data, "bank")}
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
                    text="No records found"
                  />
                )}
              </View>
            </ScrollView>
          </View>
        );
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{ backgroundColor: theme.colors.textLight }}
      inactiveColor={theme.colors.textSecondary}
      activeColor={theme.colors.primary}
      scrollEnabled={true}
      tabStyle={{ width: windowWidth / 2 }}
      labelStyle={[Styles.fontSize12, Styles.fontBold]}
    />
  );

  const [routes] = useState([
    { key: "companyPocket", title: "Company Pocket" },
    { key: "companyBank", title: "Company Bank" },
  ]);

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
      ) : (
        <TabView
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
        />
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
        height={720}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{entryType}</Title>
          <ScrollView>
            {/* <List.Item title="Date" description={date} />
            <List.Item title="Entry Type " description={entryType} />
            <List.Item title="Category Name" description={categoryName} />
            <List.Item
              title="Sub Category Name"
              description={subCategoryName}
            />
            <List.Item title="Receipt Mode Type" description={receiptMode} />
            <List.Item title="Amount" description={amount} /> */}
            <SheetElement current={current} type="fin-list" />

            {PayToCompanyStatus && (
              <>
                <View
                  style={[
                    Styles.width100per,
                    Styles.paddingTop24,
                    Styles.paddingHorizontal32,
                    { elevation: 3 },
                  ]}
                >
                  <Button
                    icon={"cash-refund"}
                    mode="contained"
                    onPress={() => {
                      refRBSheet.current.close();
                      navigation.navigate("AddExpenses", {
                        fetchData: LoadAll,
                        type: projectVariables.DEF_PCKDIARY_Dynamic_Expense_ClientAmountGivenToCompany_FlagText,
                        data: {
                          transactionID: transactionID,
                        },
                      });
                    }}
                  >
                    Pay To Company
                  </Button>
                </View>
              </>
            )}

            {attachmentImage != "" && (
              <>
                <View style={[Styles.width100per, Styles.height200]}>
                  <Image
                    source={{ uri: attachmentImage }}
                    style={
                      ([Styles.borderred], { width: "100%", height: "100%" })
                    }
                  />
                </View>
              </>
            )}

            <List.Item title="Display" description={display} />

            {depositType == "2" && PDCStatus == "0" && (
              <>
                <View
                  style={[
                    Styles.width100per,
                    Styles.paddingTop24,
                    Styles.paddingHorizontal32,
                    { elevation: 3 },
                  ]}
                >
                  <Button
                    icon={"plus"}
                    mode="contained"
                    onPress={() => {
                      refRBSheet.current.close();
                      navigation.navigate("PDCDataUpdate", {
                        type: "pdc",
                        data: {
                          transactionID: transactionID,
                        },
                      });
                    }}
                  >
                    Update PDC Details
                  </Button>
                </View>
              </>
            )}

            {depositType == "2" && PDCStatus == "1" && PDCattachmentImage && (
              <>
                <View style={[Styles.width100per, Styles.height200]}>
                  <Image
                    source={{ uri: PDCattachmentImage }}
                    style={
                      ([Styles.borderred], { width: "100%", height: "100%" })
                    }
                  />
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default BranchWiseTransactionScreen;
