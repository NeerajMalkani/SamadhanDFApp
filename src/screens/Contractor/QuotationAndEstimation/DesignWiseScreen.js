import React, { useEffect } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { ActivityIndicator, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../../components/Header";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { TabBar, TabView } from "react-native-tab-view";
import Provider from "../../../api/Provider";
import DesignGalleryTab from "./DesignGalleryTab";
import DesignPendingTab from "./DesignPendingTab";
import DesignApprovedTab from "./DesignApprovedTab";
import DesignRejectedTab from "./DesignRejectedTab";

const windowWidth = Dimensions.get("window").width;
let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
const DesignWiseScreen = ({ navigation }) => {
  //#region Variables
  const [index, setIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [imageGalleryData, setDesignGalleryData] = React.useState([]);
  const [response, setResponse] = React.useState([]);
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
  const unload = (msg) => {
    setIsLoading(false);
    setSnackbarText(msg);
    setSnackbarColor(theme.colors.error);
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
      const data = await Provider.getcontractordesignwise(params, () =>
        setIsLoading(false)
      );
      pendingData[1](data.pending);
      pendingSearchData[1](data.pending);
      approvedData[1](data.accepted);
      approvedSearchData[1](data.accepted);
      rejectedData[1](data.rejected);
      rejectedSearchData[1](data.rejected);
      setDesignGalleryData(data.gallery);
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
      case "designGallery":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <DesignGalleryTab
              navigation={navigation}
              designGalleryData={imageGalleryData}
              fetchData={FetchData}
            />
          </ScrollView>
        );
      case "pending":
        return (
          <ScrollView
            style={[Styles.flex1, Styles.backgroundColor]}
            contentContainerStyle={[Styles.height100per]}
          >
            <DesignPendingTab
              type={"pending"}
              response={response}
              set={setIsLoading}
              unload={unload}
              listData2={pendingData[0]}
              listSearchData2={pendingSearchData[0]}
              fetch={FetchData}
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
              type={"approved"}
              response={response}
              set={setIsLoading}
              unload={unload}
              listData2={approvedData[0]}
              listSearchData2={approvedSearchData[0]}
              fetch={FetchData}
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
              type={"rejected"}
              set={setIsLoading}
              unload={unload}
              listData2={rejectedData[0]}
              listSearchData2={rejectedSearchData[0]}
              fetch={FetchData}
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
      tabStyle={{ width: windowWidth / 4 }}
      labelStyle={[Styles.fontSize13, Styles.fontBold]}
    />
  );
  const [routes] = React.useState([
    { key: "designGallery", title: "Design" },
    { key: "pending", title: "Pending" },
    { key: "approved", title: "Approved" },
    { key: "rejected", title: "Rejected" },
  ]);
  //#endregion

  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <Header navigation={navigation} title="Design Wise" />
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

export default DesignWiseScreen;
