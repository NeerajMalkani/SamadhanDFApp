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
import { FAB, List, Snackbar, Title } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
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

const AddExpensesList = ({ navigation }) => {
  //#region Variables
  const [index, setIndex] = useState(0);
  const [attachmentImage, setAttachmentImage] = useState(
    AWSImagePath + "placeholder-image.png"
  );

  const [isLoading, setIsLoading] = useState(true);

  const [listData_Self, setListData_Self] = useState([]);
  const [listSearchData_Self, setListSearchData_Self] = useState([]);

  const [listData_Company, setListData_Company] = useState([]);
  const [listSearchData_Company, setListSearchData_Company] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.success);

  const [entryType, setEntryType] = useState("");

  // !state never used
  const [date, setDate] = useState(new Date());
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [receiptMode, setReceiptMode] = useState("");
  const [attachment, setAttachment] = useState("");
  const [amount, setAmount] = useState("");
  const [current, setCurrent] = useState({});
  const [display, setDisplay] = useState("");

  const refRBSheet = useRef();
  //#endregion

  //#region Functions

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      companyID = JSON.parse(userData).Sess_company_refno;
      branchID = JSON.parse(userData).Sess_branch_refno;
      FetchData_Self();
      FetchData_Company();
    }
  };

  const FetchData_Self = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        pck_trans_refno: "all",
        Sess_company_refno: companyID.toString(),
        Sess_branch_refno: branchID.toString(),
        pck_transtype_refno:
          projectVariables.DEF_PCKDIARY_TRANSTYPE_EXPENSES_REFNO,
        pck_entrytype_refno: projectVariables.DEF_PCKDIARY_ENTRYTYPE_SELF_REFNO,
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.pcktransrefnocheck, params)
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
          // setSnackbarText("No Self data found");
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

  const FetchData_Company = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        pck_trans_refno: "all",
        Sess_company_refno: companyID.toString(),
        Sess_branch_refno: branchID.toString(),
        pck_transtype_refno:
          projectVariables.DEF_PCKDIARY_TRANSTYPE_EXPENSES_REFNO,
        pck_entrytype_refno:
          projectVariables.DEF_PCKDIARY_ENTRYTYPE_COMPANY_REFNO,
      },
    };
    Provider.createDFPocketDairy(Provider.API_URLS.pcktransrefnocheck, params)
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
          // setSnackbarText("No Company data found");
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
    if (from === "add" || from === "update") {
      setSnackbarText(
        "Item " + (from === "add" ? "added" : "updated") + " successfully"
      );
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    FetchData_Self();
    FetchData_Company();
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
          title={data.item.pck_mode_name}
          titleStyle={{ fontSize: 18 }}
          description={`Category Name.: ${
            NullOrEmpty(data.item.pck_category_name)
              ? ""
              : data.item.pck_category_name
          }\nAmount: ${NullOrEmpty(data.item.amount) ? "" : data.item.amount} `}
          onPress={() => {
            refRBSheet.current.open();
            setDate(data.item.pck_trans_date);
            setEntryType(data.item.pck_entrytype_name);
            setCategoryName(data.item.pck_category_name);
            setSubCategoryName(data.item.pck_sub_category_name);
            setReceiptMode(data.item.pck_mode_name);
            setAmount(data.item.amount);
            setAttachment(data.item.attach_receipt_url);
            setAttachmentImage(data.item.attach_receipt_url);
            setDisplay(data.item.view_status == "1" ? "Yes" : "No");
            setCurrent(data.item);
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
      </View>
    );
  };

  const AddCallback = () => {
    navigation.navigate("AddExpenses", {
      type: "add",
      fetchData: LoadAll,
      tabIndex: index,
    });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddExpenses", {
      type: "edit",
      fetchData: LoadAll,
      data: {
        pck_trans_refno: data.item.pck_trans_refno,
        createby_user_refno: data.item.createby_user_refno,
        pck_trans_date: data.item.pck_trans_date,
        pck_entrytype_refno: data.item.pck_entrytype_refno,
        pck_entrytype_name: data.item.pck_entrytype_name,
        pck_mode_refno: data.item.pck_mode_refno,
        pck_mode_name: data.item.pck_mode_name,
        pck_category_refno: data.item.pck_category_refno,
        pck_category_name: data.item.pck_category_name,
        pck_sub_category_refno: data.item.pck_sub_category_refno,
        pck_sub_category_name: data.item.pck_sub_category_name,
        pck_mycontact_refno: data.item.pck_mycontact_refno,
        pck_mybank_refno: data.item.pck_mybank_refno,
        utr_no: data.item.utr_no,
        deposit_type_refno: data.item.deposit_type_refno,
        pdc_cheque_status: data.item.pdc_cheque_status,
        cheque_date: data.item.cheque_date,
        cheque_no: data.item.cheque_no,
        amount: data.item.amount,
        notes: data.item.notes,
        recurring_status: data.item.recurring_status,
        reminder_date: data.item.reminder_date,
        attach_receipt_url: data.item.attach_receipt_url,
        cardtype_refno: data.item.cardtype_refno,
        pck_card_mybank_refno: data.item.pck_card_mybank_refno,
        due_date: data.item.due_date,
        view_status: data.item.view_status,
        myclient_refno: data.item.myclient_refno,
        cont_project_refno: data.item.cont_project_refno,
        invoice_no: data.item.invoice_no,
        payment_type_refno: data.item.payment_type_refno,
        dynamic_expenses_refno: data.item.dynamic_expenses_refno,
        pck_contacttype_refno: data.item.pck_contacttype_refno,
        pck_sub_category_notes: data.item.pck_sub_category_notes,
        exp_branch_refno: data.item.exp_branch_refno,
        exp_designation_refno: data.item.exp_designation_refno,
        myemployee_refno: data.item.myemployee_refno,
      },
    });
  };

  //#endregion

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "selfDetail":
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
                      setData={setListData_Self}
                      filterFunction={[
                        "pck_trans_refno",
                        "createby_user_refno",
                        "pck_trans_date",
                        "pck_entrytype_refno",
                        "pck_entrytype_name",
                        "pck_mode_refno",
                        "pck_mode_name",
                        "pck_category_refno",
                        "pck_category_name",
                        "pck_sub_category_refno",
                        "pck_sub_category_name",
                        "pck_mycontact_refno",
                        "pck_mybank_refno",
                        "utr_no",
                        "deposit_type_refno",
                        "pdc_cheque_status",
                        "cheque_date",
                        "cheque_no",
                        "amount",
                        "notes",
                        "recurring_status",
                        "reminder_date",
                        "attach_receipt_url",
                        "cardtype_refno",
                        "pck_card_mybank_refno",
                        "due_date",
                        "view_status",
                        "myclient_refno",
                        "cont_project_refno",
                        "invoice_no",
                        "payment_type_refno",
                        "dynamic_expenses_refno",
                        "pck_contacttype_refno",
                        "pck_sub_category_notes",
                        "exp_branch_refno",
                        "exp_designation_refno",
                        "myemployee_refno",
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
                              FetchData_Self();
                            }}
                          />
                        }
                        data={listSearchData_Self}
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
              </View>
            </ScrollView>
          </View>
        );
      case "companyDetail":
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
                      filterFunction={[
                        "BalanceUnPaidPayment",
                        "Collected_ActualAmount",
                        "TotalPaidAmount",
                        "amount",
                        "banktype_refno",
                        "branch_refno",
                        "cardtype_refno",
                        "cheque_date",
                        "cheque_no",
                        "company_refno",
                        "cont_project_refno",
                        "contact_mobileno",
                        "contact_name",
                        "createby_user_refno",
                        "deposit_date",
                        "deposit_type_refno",
                        "due_date",
                        "dynamic_expenses_refno",
                        "exp_branch_refno",
                        "exp_designation_refno",
                        "invoice_no",
                        "is_handloan_autoentry",
                        "is_opening_balance",
                        "key",
                        "myclient_refno",
                        "myemployee_refno",
                        "notes",
                        "payment_group_refno",
                        "payment_type_refno",
                        "pck_card_mybank_refno",
                        "pck_category_name",
                        "pck_category_refno",
                        "pck_contacttype_refno",
                        "pck_entrytype_name",
                        "pck_entrytype_refno",
                        "pck_master_trans_refno",
                        "pck_mode_name",
                        "pck_mode_refno",
                        "pck_mybank_refno",
                        "pck_mycontact_refno",
                        "pck_sub_category_name",
                        "pck_sub_category_notes",
                        "pck_sub_category_refno",
                        "pck_trans_date",
                        "pck_trans_refno",
                        "pck_transtype_refno",
                        "pdc_cheque_status",
                        "personal_bank_account_no",
                        "personal_bank_name",
                        "received_status",
                        "recurring_received_status",
                        "recurring_status",
                        "reminder_date",
                        "remove_status",
                        "utr_no",
                        "verified_datetime",
                        "verified_status",
                        "verified_user_refno",
                        "view_status",
                      ]}
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
                              FetchData_Company();
                            }}
                          />
                        }
                        data={listSearchData_Company}
                        disableRightSwipe={true}
                        rightOpenValue={-72}
                        renderItem={(data) => RenderItems(data)}
                        renderHiddenItem={(data, rowMap) => {
                          if (data.item.verified_status == "1") {
                            return null;
                          } else {
                            return RenderHiddenItems(data, rowMap, [
                              EditCallback,
                            ]);
                          }
                        }}
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
    { key: "selfDetail", title: "Self Details" },
    { key: "companyDetail", title: "Company Details" },
  ]);

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Expenses List" />
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
          swipeEnabled={false}
          renderTabBar={renderTabBar}
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
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
        height={420}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{entryType}</Title>
          <ScrollView>
            <SheetElement current={current} type="fin-list" />
            {/* <List.Item title="Entry Type " description={entryType} />
            <List.Item title="Category Name" description={categoryName} />
            <List.Item
              title="Sub Category Name"
              description={subCategoryName}
            />
            <List.Item title="Receipt Mode Type" description={receiptMode} />
            <List.Item title="Amount" description={amount} /> */}
            <View style={[Styles.width100per, Styles.height200]}>
              <Image
                source={{ uri: attachmentImage }}
                style={([Styles.borderred], { width: "100%", height: "100%" })}
              />
            </View>
            <List.Item title="Display" description={display} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default AddExpensesList;
