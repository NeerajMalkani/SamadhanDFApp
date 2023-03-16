import React, { useEffect } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { ActivityIndicator, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../components/Header";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { TabBar, TabView } from "react-native-tab-view";
import Provider from "../../../api/Provider";
import DesignGalleryTab from "./Enquiry_tab";
import DesignPendingTab from "./Enquiry_tab";
import DesignApprovedTab from "./Enquiry_tab";
import DesignRejectedTab from "./Enquiry_tab";

const windowWidth = Dimensions.get("window").width;
let Sess_UserRefno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
const EnquiryWise = ({ navigation }) => {
  //#region Variables
  const [index, setIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [imageGalleryData, setDesignGalleryData] = React.useState([]);
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
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
      },
    };
    try {
      const data = await Provider.getEnquiriesList(params, () =>
        setIsLoading(false)
      );
      if (data.newEnq) {
        pendingData[1](data.newEnq);
        pendingSearchData[1](data.newEnq);
        approvedData[1](data.acceptedEnq);
        approvedSearchData[1](data.acceptedEnq);
        rejectedData[1](data.rejectedEnq);
        rejectedSearchData[1](data.rejectedEnq);
        setIsLoading(false);
      }
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
          <ScrollView
            style={[Styles.flex1, Styles.backgroundColor]}
            contentContainerStyle={[Styles.height100per]}
          >
            <DesignPendingTab
              set={setIsLoading}
              unload={unload}
              listData2={pendingData[0]}
              listSearchData2={pendingSearchData[0]}
              fetch={FetchData}
              type={"new"}
            />
          </ScrollView>
        );
      case "approved":
        return (
          <ScrollView
            style={[Styles.flex1, Styles.backgroundColor]}
            contentContainerStyle={[Styles.height100per]}
          >
            <DesignApprovedTab
              set={setIsLoading}
              unload={unload}
              listData2={approvedData[0]}
              listSearchData2={approvedSearchData[0]}
              fetch={FetchData}
              type="approved"
            />
          </ScrollView>
        );
      case "rejected":
        return (
          <ScrollView
            style={[Styles.flex1, Styles.backgroundColor]}
            contentContainerStyle={[Styles.height100per]}
          >
            <DesignRejectedTab
              set={setIsLoading}
              unload={unload}
              listData2={rejectedData[0]}
              listSearchData2={rejectedSearchData[0]}
              fetch={FetchData}
              type="rejected"
            />
          </ScrollView>
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
    { key: "new", title: "New" },
    { key: "approved", title: "Accepted" },
    { key: "rejected", title: "Rejected" },
    /* { key: "rejected", title: "Rejected" }, */
  ]);
  //#endregion

  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <Header navigation={navigation} title="App User Enquiry Wise" />
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

export default EnquiryWise;
