import { useEffect, useRef } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RenderHiddenItems } from "../../../components/ListActions";
import { Styles } from "../../../styles/styles";
import { NullOrEmpty } from "../../../utils/validations";
import Search from "../../../components/Search";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
let userID = 0,
  companyID = 0,
  groupID = 0;

const BankListScreen = ({ navigation }) => {
  //#region variable

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [listSearchData, setListSearchData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.success);

  const [CompanyBranchName, setCompanyBranchName] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankBranchName, setBankBranchName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [cardType, setCardType] = useState("");
  const [openingBalance, setOpeningBalance] = useState("");
  const [remarks, setRemarks] = useState("");
  const [display, setDisplay] = useState("");

  const refRBSheet = useRef();
  //#endregion

  //#region Functions

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      companyID = JSON.parse(userData).Sess_company_refno;

      FetchData();
    }
  };

  useEffect(() => {
    GetUserID();
  }, []);

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
        Sess_company_refno: companyID,
        bank_refno: "all",
      },
    };
    Provider.createDFCommon(Provider.API_URLS.branchbankrefnocheck, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(
              response.data.data,
              false,
              "contractor_bank"
            );
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
    FetchData();
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
          title={data.item.bankName}
          titleStyle={{ fontSize: 18 }}
          description={`Bank Branch: ${
            NullOrEmpty(data.item.branchName) ? "" : data.item.branchName
          }\nCompany Branch: ${
            NullOrEmpty(data.item.companyBranchName)
              ? ""
              : data.item.companyBranchName
          } `}
          // description={"Branch: " + (data.item.companyBranchName ? "Yes" : "No")}
          onPress={() => {
            refRBSheet.current.open();
            setCompanyBranchName(data.item.companyBranchName);
            setAccountNo(data.item.accountNumber);
            setBankName(data.item.bankName);
            setBankBranchName(data.item.branchName);
            setIfscCode(data.item.ifscCode);
            setCardType(data.item.cardTypeName);
            setOpeningBalance(data.item.openingBalance);
            setRemarks(data.item.remark);
            setDisplay(data.item.display);
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
    navigation.navigate("AddBankScreen", { type: "add", fetchData: FetchData });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddBankScreen", {
      type: "edit",
      fetchData: FetchData,
      data: {
        id: data.item.id,
        companyBranchName: data.item.companyBranchName,
        accountNo: data.item.accountNumber,
        bankName: data.item.bankName,
        bankBranchName: data.item.branchName,
        ifscCode: data.item.ifscCode,
        cardType: data.item.cardTypeName,
        openingBalance: data.item.openingBalance,
        remarks: data.item.remark,
        display: data.item.display,
        cardtypeID: data.item.cardtypeID,
        bankID: data.item.bankID,
        branchID: data.item.branch_refno,
      },
    });
  };

  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Bank" />
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
            filterFunction={(text) => (item) =>
              item?.api_name?.toLowerCase()?.includes(text?.toLowerCase())}
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
        height={420}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>
            {CompanyBranchName}
          </Title>
          <ScrollView>
            <List.Item
              title="Company Branch Name"
              description={CompanyBranchName}
            />
            <List.Item title="A/C No" description={accountNo} />
            <List.Item title="Bank Name" description={bankName} />
            <List.Item title="Branch Name" description={bankBranchName} />
            <List.Item title="IFSC Code" description={ifscCode} />
            <List.Item title="Card Type Name" description={cardType} />
            <List.Item title="Opening Balance" description={openingBalance} />
            <List.Item title="Remarks" description={remarks} />
            <List.Item title="Display" description={display} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default BankListScreen;
