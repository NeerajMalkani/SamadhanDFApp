import React, { useEffect } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { ActivityIndicator, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../../components/Header";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { TabBar, TabView } from "react-native-tab-view";
import Provider from "../../../../api/Provider";
import DesignPendingTab from "./QuotationTabs";
import DesignApprovedTab from "./QuotationTabs";
import DesignRejectedTab from "./QuotationTabs";

const windowWidth = Dimensions.get("window").width;
let Sess_UserRefno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
const QuotationWise = ({ navigation }) => {
  //#region Variables
  const [index, setIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const pendingData = React.useState([]);
  const pendingSearchData = React.useState([]);
  const approvedData = React.useState([]);
  const approvedSearchData = React.useState([]);
  const rejectedData = React.useState([]);
  const rejectedSearchData = React.useState([]);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );
  //#endregion

  //#region Functions
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      Sess_UserRefno = JSON.parse(userData).UserID;
      Sess_CompanyAdmin_UserRefno =
        JSON.parse(userData).Sess_CompanyAdmin_UserRefno;
      FetchData();
    }
  };
  const unload = (msg) => {
    setIsLoading(false);
    setSnackbarText(msg);
    setSnackbarColor(theme.colors.error);
    setSnackbarVisible(true);
  };
  const FetchData = async (toPending, text) => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        cont_quot_refno: "all",
      },
    };
    try {
      const data = await Provider.getmyquotation(params, () =>
        setIsLoading(false)
      );
      pendingData[1](data.newEnq);
      pendingSearchData[1](data.newEnq);
      approvedData[1](data.acceptedEnq);
      approvedSearchData[1](data.acceptedEnq);
      rejectedData[1](data.rejectedEnq);
      rejectedSearchData[1](data.rejectedEnq);
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
      case "new":
        return (
          <DesignPendingTab
            set={setIsLoading}
            unload={unload}
            listData2={pendingData[0]}
            listSearchData2={pendingSearchData[0]}
            fetch={FetchData}
            type={"new"}
          />
        );
      case "approved":
        return (
          <DesignApprovedTab
            set={setIsLoading}
            unload={unload}
            listData2={approvedData[0]}
            listSearchData2={approvedSearchData[0]}
            fetch={FetchData}
            type="approved"
          />
        );
      case "rejected":
        return (
          <DesignRejectedTab
            set={setIsLoading}
            unload={unload}
            listData2={rejectedData[0]}
            listSearchData2={rejectedSearchData[0]}
            fetch={FetchData}
            type="rejected"
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
    { key: "new", title: "Pending" },
    { key: "approved", title: "Accepted" },
    { key: "rejected", title: "Rejected" },
    /* { key: "rejected", title: "Rejected" }, */
  ]);
  //#endregion

  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <Header navigation={navigation} title="CONTRACTOR QUOTATION - PENDING" />
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
    </View>
  );
};

export default QuotationWise;
