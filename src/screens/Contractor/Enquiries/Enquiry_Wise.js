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
let userID = 0;
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
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);
 //#endregion 

 //#region Functions
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      FetchData();
    }
  };

  const FetchDesignGalleryData = () => {
    Provider.getAll("generaluserenquiryestimations/getimagegallery")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setDesignGalleryData(response.data.data);
          }
        } else {
          setDesignGalleryData([]);
          setSnackbarText("No data found");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
      });
  };

  const FetchData = (toPending) => {
    if (toPending) {
      setIndex(1);
    }
    let params = {
      UserID: userID,
    };
    Provider.getAll(`contractorquotationestimation/getcontractorallestimation?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const pendData = response.data.data.filter((el) => {
              return el.approvalStatus === 0;
            });
            pendingData[1](pendData);
            pendingSearchData[1](pendData);
            const apprData = response.data.data.filter((el) => {
              return el.approvalStatus === 1;
            });
            approvedData[1](apprData);
            approvedSearchData[1](apprData);
            const rejData = response.data.data.filter((el) => {
              return el.approvalStatus === 2;
            });
            rejectedData[1](rejData);
            rejectedSearchData[1](rejData);
          }
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    GetUserID();
    FetchDesignGalleryData();
  }, []);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "designGallery":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <DesignGalleryTab navigation={navigation} designGalleryData={imageGalleryData} fetchData={FetchData} />
          </ScrollView>
        );
      case "pending":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]} contentContainerStyle={[Styles.height100per]}>
            <DesignPendingTab navigation={navigation} listData={pendingData} listSearchData={pendingSearchData} fetchData={FetchData} />
          </ScrollView>
        );
      case "approved":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]} contentContainerStyle={[Styles.height100per]}>
            <DesignApprovedTab navigation={navigation} listData={approvedData} listSearchData={approvedSearchData} fetchData={FetchData} />
          </ScrollView>
        );
      case "rejected":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]} contentContainerStyle={[Styles.height100per]}>
            <DesignRejectedTab navigation={navigation} listData={rejectedData} listSearchData={rejectedSearchData} fetchData={FetchData} />
          </ScrollView>
        );
    }
  };

  const renderTabBar = (props) => <TabBar {...props} indicatorStyle={{ backgroundColor: theme.colors.primary }} style={{ backgroundColor: theme.colors.textLight }} inactiveColor={theme.colors.textSecondary} activeColor={theme.colors.primary} scrollEnabled={true} tabStyle={{ width: windowWidth / 3 }} labelStyle={[Styles.fontSize13, Styles.fontBold]} />;
  const [routes] = React.useState([
    { key: "designGallery", title: "New" },
    { key: "pending", title: "Accepted" },
    { key: "approved", title: "Rejected" },
    /* { key: "rejected", title: "Rejected" }, */
  ]);
 //#endregion 
 
  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <Header navigation={navigation} title="App User Enquiry Wise" />
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <TabView renderTabBar={renderTabBar} navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} />
      )}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default EnquiryWise;
