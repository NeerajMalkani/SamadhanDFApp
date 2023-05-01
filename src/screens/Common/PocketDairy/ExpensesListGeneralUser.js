import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  View,
  LogBox,
  RefreshControl,
  ScrollView,
  Image,
} from "react-native";
import { FAB, List, Snackbar, Title, Button } from "react-native-paper";
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
import { projectVariables } from "../../../utils/credentials";
import { AWSImagePath } from "../../../utils/paths";
import Search from "../../../components/Search";

let userID = 0,
  companyID = 0,
  branchID = 0;
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const ExpensesListGeneralUserScreen = ({ navigation }) => {
  //#region Variables

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

  const [transactionID, setTransactionID] = useState("");
  const [entryType, setEntryType] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [receiptMode, setReceiptMode] = useState("");
  const [attachment, setAttachment] = useState("");
  const [display, setDisplay] = useState("");
  const [depositType, setDepositType] = useState("");
  const [PDCStatus, setPDCStatus] = useState("");
  const [date, setDate] = useState(new Date());
  const [attachmentImage, setAttachmentImage] = useState(
    AWSImagePath + "placeholder-image.png"
  );
  const [PDCattachmentImage, setPDCAttachmentImage] = useState(
    AWSImagePath + "placeholder-image.png"
  );

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
            setListData(response.data.data);
            setListSearchData(response.data.data);
          }
        } else {
          setListData([]);
          // setSnackbarText("No data found");
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
    navigation.navigate("AddExpenses", { type: "add", fetchData: FetchData });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddExpenses", {
      type: "edit",
      fetchData: FetchData,
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
      },
    });
  };

  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Expense List" />
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
        height={360}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{entryType}</Title>
          <ScrollView>
            <List.Item title="Date" description={date} />
            <List.Item title="Entry Type " description={entryType} />
            <List.Item title="Category Name" description={categoryName} />
            <List.Item
              title="Sub Category Name"
              description={subCategoryName}
            />
            <List.Item title="Receipt Mode Type" description={receiptMode} />
            <List.Item title="Amount" description={amount} />
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

export default ExpensesListGeneralUserScreen;
