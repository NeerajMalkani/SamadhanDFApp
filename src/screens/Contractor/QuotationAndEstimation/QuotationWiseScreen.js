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
// import DesignPendingTab from "./DesignPendingTab";
import DesignApprovedTab from "./DesignApprovedTab";
import DesignRejectedTab from "./DesignRejectedTab";
import QuotationAddEditTab from "./QuotationAddEdit";
import QuotationSendPendingList from "./QuotationSendPendingList";
import QuotationApprovedList from "./QuotationApprovedList";
import QuotationApprovePendingList from "./QuotationApprovePendingList";
import QuotationRejected from "./QuotationRejected";

const windowWidth = Dimensions.get("window").width;
let userID = 0;
const QuotationWiseScreen = ({ navigation }) => {
   //#region Variables
  const [index, setIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  // const [imageGalleryData, setDesignGalleryData] = React.useState([]);
  const [quotattionAddEdit, setQuotationAddEdit] = React.useState([]);
  const [quotattionSendPending, setQuotationSendPending] = React.useState([]);
  const [quotationApprovedList,setQutationApprovedList] = React.useState([]);
  const [quotationApprovePendingList,setQutationApprovedPendingList] = React.useState([]);
  const [quotationRejected,setQutationRejected] = React.useState([]);
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
      case "quotationAddEdit":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <QuotationAddEditTab navigation={navigation} designGalleryData={quotattionAddEdit} fetchData={FetchData} />
          </ScrollView>
        );
      case "quotationsendpendinglist":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]} contentContainerStyle={[Styles.height100per]}>
            <QuotationSendPendingList navigation={navigation} designGalleryData={quotattionSendPending} fetchData={FetchData} />
            {/* <DesignPendingTab navigation={navigation} listData={pendingData} listSearchData={pendingSearchData} fetchData={FetchData} /> */}
          </ScrollView>
        );
      case "quotationapprovependinglist":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]} contentContainerStyle={[Styles.height100per]}>
             <QuotationApprovePendingList navigation={navigation} designGalleryData={quotationApprovePendingList} fetchData={FetchData} />
            {/* <DesignApprovedTab navigation={navigation} listData={approvedData} listSearchData={approvedSearchData} fetchData={FetchData} /> */}
          </ScrollView>
        );
      case "quotationapprovedlist":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]} contentContainerStyle={[Styles.height100per]}>
             <QuotationApprovedList navigation={navigation} designGalleryData={quotationApprovedList} fetchData={FetchData} />
            {/* <DesignRejectedTab navigation={navigation} listData={rejectedData} listSearchData={rejectedSearchData} fetchData={FetchData} /> */}
          </ScrollView>
        );
        case "rejected":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]} contentContainerStyle={[Styles.height100per]}>
            <QuotationRejected navigation={navigation} designGalleryData={quotationRejected} fetchData={FetchData} />
            {/* <DesignRejectedTab navigation={navigation} listData={rejectedData} listSearchData={rejectedSearchData} fetchData={FetchData} /> */}
          </ScrollView>
        );
    }
  };

  const renderTabBar = (props) => <TabBar {...props} indicatorStyle={{ backgroundColor: theme.colors.primary }} style={{ backgroundColor: theme.colors.textLight }} inactiveColor={theme.colors.textSecondary} activeColor={theme.colors.primary} scrollEnabled={true} tabStyle={{ width: windowWidth / 3 }} labelStyle={[Styles.fontSize13, Styles.fontBold]} />;
  const [routes] = React.useState([
    { key: "quotationAddEdit", title: "Quotation Add /Edit" },
    { key: "quotationsendpendinglist", title: "Quotation Send Pending List" },
    { key: "quotationapprovependinglist", title: "Quotation Approve Pending List" },
    { key: "quotationapprovedlist", title: "Quotation Approved List" },
    { key: "rejected", title: "Rejected" },
  ]);
 //#endregion 
 
  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <Header navigation={navigation} title="Quotation Add / Edit" />
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

export default QuotationWiseScreen;
