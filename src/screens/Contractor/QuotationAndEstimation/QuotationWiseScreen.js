import React, { useEffect } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { ActivityIndicator, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../components/Header";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { TabBar, TabView } from "react-native-tab-view";
import Provider from "../../../api/Provider";
import QuotationAddEditTab from "./QuotationAddEdit";
import QuotationSendPendingList from "./QuotationSendPendingList";
import QuotationApprovedList from "./QuotationApprovedList";
import QuotationApprovePendingList from "./QuotationApprovePendingList";
import QuotationRejected from "./QuotationRejected";

const windowWidth = Dimensions.get("window").width;
let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
const QuotationWiseScreen = ({ navigation }) => {
  //#region Variables
  const [index, setIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  // const [imageGalleryData, setDesignGalleryData] = React.useState([]);
  const [quotattionAddEdit, setQuotationAddEdit] = React.useState([]);
  const [type, setType] = React.useState("add");
  const [quotattionSendPending, setQuotationSendPending] = React.useState([]);
  const [quotationApprovePendingList, setQutationApprovedPendingList] =
    React.useState([]);
  const [quotationApprovedList, setQutationApprovedList] = React.useState([]);
  const [quotationRejected, setQutationRejected] = React.useState([]);
  const [response, setResponse] = React.useState([]);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );
  //#endregion

  const unload = (msg) => {
    setIsLoading(false);
    setSnackbarText(msg);
    setSnackbarColor(theme.colors.error);
    setSnackbarVisible(true);
  };
  const snack = (msg,color) => {
    setSnackbarText(msg);
    setSnackbarColor(color);
    setSnackbarVisible(true);
  };
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      Sess_UserRefno = JSON.parse(userData).UserID;
      Sess_company_refno = JSON.parse(userData).Sess_company_refno;
      Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
      Sess_CompanyAdmin_UserRefno =
        JSON.parse(userData).Sess_CompanyAdmin_UserRefno;
      FetchData();
    }
  };

  const FetchData = async (toPending, text) => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
      },
    };
    try {
      const data = await Provider.getcontractorquotationwise(params, () =>
        setIsLoading(false)
      );
      setResponse(data.response);
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
      setSnackbarText(e.message);
      setSnackbarColor(theme.colors.error);
      setSnackbarVisible(true);
    } finally {
      if (toPending !== undefined) {
        setIndex(toPending);
        setSnackbarText(text);
        setSnackbarColor(theme.colors.success);
        setSnackbarVisible(true);
      }
    }
  };

  useEffect(() => {
    GetUserID();
  }, []);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "quotationAddEdit":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <QuotationAddEditTab
              navigation={navigation}
              designGalleryData={quotattionAddEdit}
              set={setIsLoading}
              unload={unload}
              fetch={FetchData}
              index1={index}
              type={type}
              setType={setType}
              snack={snack}
            />
          </ScrollView>
        );
      case "quotationsendpendinglist":
        return (
          <QuotationSendPendingList
            type="QuotationSendPendingList"
            set={setIsLoading}
            unload={unload}
            response={response}
            fetch={FetchData}
            navigation={navigation}
            index1={index}
            setType={setType}
            setIndex={setIndex}
          />
        );
      case "quotationapprovependinglist":
        return (
          <QuotationApprovePendingList
            type="QuotationApprovePendingList"
            set={setIsLoading}
            unload={unload}
            listData2={quotationApprovePendingList}
            response={response}
            fetch={FetchData}
            navigation={navigation}
            index1={index}
            setType={setType}
            setIndex={setIndex}
          />
        );
      case "quotationapprovedlist":
        return (
          <QuotationApprovedList
            type="QuotationApprovedList"
            set={setIsLoading}
            unload={unload}
            response={response}
            fetch={FetchData}
            navigation={navigation}
          />
        );
      case "rejected":
        return (
          <QuotationRejected
            type="QuotationRejectedList"
            set={setIsLoading}
            unload={unload}
            response={response}
            fetch={FetchData}
            navigation={navigation}
          />
        );
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
      tabStyle={{ width: windowWidth / 3 }}
      labelStyle={[Styles.fontSize13, Styles.fontBold]}
    />
  );
  const [routes] = React.useState([
    { key: "quotationAddEdit", title: "Quotation Add /Edit" },
    { key: "quotationsendpendinglist", title: "Quotation Send Pending List" },
    {
      key: "quotationapprovependinglist",
      title: "Quotation Approve Pending List",
    },
    { key: "quotationapprovedlist", title: "Quotation Approved List" },
    { key: "rejected", title: "Rejected" },
  ]);
  //#endregion

  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <Header navigation={navigation} title="Quotation Add / Edit" />
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
          onIndexChange={(index) => {
            setIndex(index);
            setType("add");
          }}
          swipeEnabled={false}
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
    </View>
  );
};

export default QuotationWiseScreen;
