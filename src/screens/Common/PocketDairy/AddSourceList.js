import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView, Image, Dimensions } from "react-native";
import { Button, FAB, List, Snackbar, Searchbar, Title } from "react-native-paper";
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
import { creds, projectVariables } from "../../../utils/credentials";
import { useIsFocused } from "@react-navigation/native";
import { TabBar, TabView } from "react-native-tab-view";

let userID = 0, companyID = 0, branchID = 0;
LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const windowWidth = Dimensions.get("window").width;

const AddSourceList = ({ route, navigation }) => {
  //#region Variables
  const isFocused = useIsFocused();
  const [index, setIndex] = useState(0);
  const [attachmentImage, setAttachmentImage] = React.useState(AWSImagePath + "placeholder-image.png");
  const [PDCattachmentImage, setPDCAttachmentImage] = React.useState(AWSImagePath + "placeholder-image.png");
  const [searchQuery_Self, setSearchQuery_Self] = React.useState("");
  const [searchQuery_Company, setSearchQuery_Company] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  const listData_Self = React.useState([]);
  const listSearchData_Self = React.useState([]);

  const listData_Company = React.useState([]);
  const listSearchData_Company = React.useState([]);

  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [date, setDate] = useState(new Date());
  const [dateInvalid, setDateInvalid] = useState("");
  const dateRef = useRef({});

  const [transactionID, setTransactionID] = React.useState("");
  const [entryType, setEntryType] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [subCategoryName, setSubCategoryName] = React.useState("");
  const [receiptMode, setReceiptMode] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [attachment, setAttachment] = React.useState("");
  const [display, setDisplay] = React.useState("");
  const [depositType, setDepositType] = React.useState("");
  const [PDCStatus, setPDCStatus] = React.useState("");
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
      FetchData_Self();
      FetchData_Company();
    }
  };

  const FetchData_Self = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      data: {
        Sess_UserRefno: userID,
        pck_trans_refno: "all",
        Sess_company_refno: companyID.toString(),
        Sess_branch_refno: branchID.toString(),
        pck_transtype_refno: projectVariables.DEF_PCKDIARY_TRANSTYPE_SOURCE_REFNO,
        pck_entrytype_refno: projectVariables.DEF_PCKDIARY_ENTRYTYPE_SELF_REFNO,
      }
    }
    Provider.createDFPocketDairy(Provider.API_URLS.pcktransrefnocheck, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const lisData = [...response.data.data];
            lisData.map((k, i) => {
              k.key = (parseInt(i) + 1).toString();
            });
            listData_Self[1](response.data.data);
            listSearchData_Self[1](response.data.data);
          }
        } else {
          listData_Self[1]([]);
          setSnackbarText("No Self data found");
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
  const FetchData_Company = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      data: {
        Sess_UserRefno: userID,
        pck_trans_refno: "all",
        Sess_company_refno: companyID.toString(),
        Sess_branch_refno: branchID.toString(),
        pck_transtype_refno: projectVariables.DEF_PCKDIARY_TRANSTYPE_SOURCE_REFNO,
        pck_entrytype_refno: projectVariables.DEF_PCKDIARY_ENTRYTYPE_COMPANY_REFNO,
      }
    }
    Provider.createDFPocketDairy(Provider.API_URLS.pcktransrefnocheck, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const lisData = [...response.data.data];
            lisData.map((k, i) => {
              k.key = (parseInt(i) + 1).toString();
            });
            listData_Company[1](response.data.data);
            listSearchData_Company[1](response.data.data);
          }
        } else {
          listData_Company[1]([]);
          setSnackbarText("No Company data found");
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

  const onChangeSearch_Self = (query) => {
    setSearchQuery_Self(query);
    if (query === "") {
      listSearchData_Self[1](listData_Self[0]);
    } else {
      listSearchData_Self[1](
        listData_Self[0].filter((el) => {
          return el.categoryName.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };

  const onChangeSearch_Company = (query) => {
    setSearchQuery_Company(query);
    if (query === "") {
      listSearchData_Company[1](listData_Company[0]);
    } else {
      listSearchData_Company[1](
        listData_Company[0].filter((el) => {
          return el.categoryName.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 72 }]}>
        <List.Item
          title={data.item.pck_mode_name}
          titleStyle={{ fontSize: 18 }}
          description={`Category Name.: ${NullOrEmpty(data.item.pck_category_name) ? "" : data.item.pck_category_name}\nAmount: ${NullOrEmpty(data.item.amount) ? "" : data.item.amount} `}
          onPress={() => {
            refRBSheet.current.open();
            setTransactionID(data.item.pck_trans_refno);
            setDate(data.item.pck_trans_date);
            setEntryType(data.item.pck_entrytype_name);
            setCategoryName(data.item.pck_category_name);
            setSubCategoryName(data.item.pck_sub_category_name);
            setReceiptMode(data.item.pck_mode_name);
            setAmount(data.item.amount);
            setAttachment(data.item.attach_receipt_url);
            setAttachmentImage(data.item.attach_receipt_url);
            setPDCAttachmentImage(data.item.bankchallan_slip_url);
            setDisplay(data.item.view_status == "1" ? "Yes" : "No");
            setDepositType(data.item.deposit_type_refno);
            setPDCStatus(data.item.pdc_cheque_status);

          }}
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="file-tree" />}
          right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
        />
      </View>
    );
  };

  const AddCallback = (type) => {
    if (type == "self") {
      navigation.navigate("AddSource", { type: "add", fetchData: FetchData_Self });
    }
    else {
      navigation.navigate("AddSource", { type: "add", fetchData: FetchData_Company });
    }

  };

  const EditCallback_Self = (data, rowMap) => {
    //console.log(data.item);
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddSource", {
      type: "edit",
      fetchData: FetchData_Self,
      data: {
        amount: data.item.amount,
        attach_receipt_url: data.item.attach_receipt_url,
        bankchallan_slip_url: data.item.bankchallan_slip_url,
        cheque_date: data.item.cheque_date,
        cheque_no: data.item.cheque_no,
        createby_user_refno: data.item.createby_user_refno,
        deposit_type_refno: data.item.deposit_type_refno,
        notes: data.item.notes,
        pck_category_name: data.item.pck_category_name,
        pck_category_refno: data.item.pck_category_refno,
        pck_entrytype_name: data.item.pck_entrytype_name,
        pck_entrytype_refno: data.item.pck_entrytype_refno,
        pck_mode_name: data.item.pck_mode_name,
        pck_mode_refno: data.item.pck_mode_refno,
        pck_mybank_refno: data.item.pck_mybank_refno,
        pck_mycontact_refno: data.item.pck_mycontact_refno,
        pck_sub_category_name: data.item.pck_sub_category_name,
        pck_sub_category_refno: data.item.pck_sub_category_refno,
        pck_trans_date: data.item.pck_trans_date,
        pck_trans_refno: data.item.pck_trans_refno,
        pdc_cheque_status: data.item.pdc_cheque_status,
        reminder_date: data.item.reminder_date,
        utr_no: data.item.utr_no,
        view_status: data.item.view_status,
        myclient_refno: data.item.myclient_refno,
        cont_project_refno: data.item.cont_project_refno,
        invoice_no: data.item.invoice_no,
        payment_type_refno: data.item.payment_type_refno,

      },
    });
  };

  const EditCallback_Company = (data, rowMap) => {
    //console.log(data.item);
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddSource", {
      type: "edit",
      fetchData: FetchData_Company,
      data: {
        amount: data.item.amount,
        attach_receipt_url: data.item.attach_receipt_url,
        bankchallan_slip_url: data.item.bankchallan_slip_url,
        cheque_date: data.item.cheque_date,
        cheque_no: data.item.cheque_no,
        createby_user_refno: data.item.createby_user_refno,
        deposit_type_refno: data.item.deposit_type_refno,
        notes: data.item.notes,
        pck_category_name: data.item.pck_category_name,
        pck_category_refno: data.item.pck_category_refno,
        pck_entrytype_name: data.item.pck_entrytype_name,
        pck_entrytype_refno: data.item.pck_entrytype_refno,
        pck_mode_name: data.item.pck_mode_name,
        pck_mode_refno: data.item.pck_mode_refno,
        pck_mybank_refno: data.item.pck_mybank_refno,
        pck_mycontact_refno: data.item.pck_mycontact_refno,
        pck_sub_category_name: data.item.pck_sub_category_name,
        pck_sub_category_refno: data.item.pck_sub_category_refno,
        pck_trans_date: data.item.pck_trans_date,
        pck_trans_refno: data.item.pck_trans_refno,
        pdc_cheque_status: data.item.pdc_cheque_status,
        reminder_date: data.item.reminder_date,
        utr_no: data.item.utr_no,
        view_status: data.item.view_status,
        myclient_refno: data.item.myclient_refno,
        cont_project_refno: data.item.cont_project_refno,
        invoice_no: data.item.invoice_no,
        payment_type_refno: data.item.payment_type_refno,

      },
    });
  };
  //#endregion 

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "selfDetail":
        return (
          <View style={[Styles.flex1]}>
            <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
              <View style={[Styles.padding16]}>
                {
                  listData_Self[0].length > 0 ? (
                    <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
                      <Searchbar style={[Styles.margin16]} placeholder="Search" onChangeText={onChangeSearch_Self} value={searchQuery_Self} />
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
                        data={listSearchData_Self[0]}
                        disableRightSwipe={true}
                        rightOpenValue={-72}
                        renderItem={(data) => RenderItems(data)}
                        renderHiddenItem={(data, rowMap) => RenderHiddenItems(data, rowMap, [EditCallback_Self])}
                      />
                    </View>
                  ) : (
                    <NoItems icon="format-list-bulleted" text="No records found. Add records by clicking on plus icon." />
                  )
                }
              </View>
            </ScrollView>
          </View>
        );
      case "companyDetail":
        return (
          <View style={[Styles.flex1]}>
            <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
              <View style={[Styles.padding16]}>
                {
                  listData_Company[0].length > 0 ? (
                    <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
                      <Searchbar style={[Styles.margin16]} placeholder="Search" onChangeText={onChangeSearch_Company} value={searchQuery_Company} />
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
                        data={listSearchData_Company[0]}
                        disableRightSwipe={true}
                        rightOpenValue={-72}
                        renderItem={(data) => RenderItems(data)}
                        renderHiddenItem={(data, rowMap) => RenderHiddenItems(data, rowMap, [EditCallback_Company])}
                      />
                    </View>
                  ) : (
                    <NoItems icon="format-list-bulleted" text="No records found. Add records by clicking on plus icon." />
                  )
                }
              </View>
            </ScrollView>
          </View>
        );
      default:
        return null;
    }
  };

  const renderTabBar = (props) =>
    <TabBar {...props} indicatorStyle={{ backgroundColor: theme.colors.primary }}
      style={{ backgroundColor: theme.colors.textLight }} inactiveColor={theme.colors.textSecondary}
      activeColor={theme.colors.primary} scrollEnabled={true} tabStyle={{ width: windowWidth / 2 }}
      labelStyle={[Styles.fontSize12, Styles.fontBold]} />;

  const [routes] = React.useState([
    { key: "selfDetail", title: "Self Details" },
    { key: "companyDetail", title: "Company Details" },
  ]);

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Source List" />
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <TabView swipeEnabled={false} style={{ marginBottom: 64, }}
          renderTabBar={renderTabBar} navigationState={{ index, routes }}
          renderScene={renderScene} onIndexChange={setIndex} />
      )}
      <FAB style={[Styles.margin16, Styles.primaryBgColor, { position: "absolute", right: 16, bottom: 16 }]} icon="plus" onPress={AddCallback} />
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={720} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{entryType}</Title>
          <ScrollView>
            <List.Item title="Date" description={date} />
            <List.Item title="Entry Type " description={entryType} />
            <List.Item title="Category Name" description={categoryName} />
            <List.Item title="Sub Category Name" description={subCategoryName} />
            <List.Item title="Receipt Mode Type" description={receiptMode} />
            <List.Item title="Amount" description={amount} />
            {attachmentImage != "" &&
              <>
                <View style={[Styles.width100per, Styles.height200]}>
                  <Image source={{ uri: attachmentImage }} style={[Styles.borderred], { width: "100%", height: "100%" }} />
                </View>
              </>
            }

            <List.Item title="Display" description={display} />

            {depositType == "2" && PDCStatus == "0" &&
              <>
                <View style={[Styles.width100per, Styles.paddingTop24, Styles.paddingHorizontal32, { elevation: 3 }]}>
                  <Button
                    icon={"plus"}
                    mode="contained"
                    onPress={() => {
                      refRBSheet.current.close();
                      navigation.navigate("PDCDataUpdate", {
                        type: "pdc",
                        data: {
                          transactionID: transactionID
                        }
                      });
                    }}
                  >
                    Update PDC Details
                  </Button>
                </View>
              </>
            }

            {depositType == "2" && PDCStatus == "1" && PDCattachmentImage &&
              <>
                <View style={[Styles.width100per, Styles.height200]}>
                  <Image source={{ uri: PDCattachmentImage }} style={[Styles.borderred], { width: "100%", height: "100%" }} />
                </View>
              </>
            }

          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default AddSourceList;