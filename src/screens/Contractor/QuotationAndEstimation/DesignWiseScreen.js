import React, { useEffect } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { ActivityIndicator, Snackbar } from "react-native-paper";
import Header from "../../../components/Header";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { TabBar, TabView } from "react-native-tab-view";
import Provider from "../../../api/Provider";
import CreateSCCards from "../../../components/SCCards";
import DesignGalleryTab from "./DesignGalleryTab";

const windowWidth = Dimensions.get("window").width;
const DesignWiseScreen = ({ navigation }) => {
  const [index, setIndex] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [imageGalleryData, setDesignGalleryData] = React.useState([]);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

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

  useEffect(() => {
    FetchDesignGalleryData();
  }, []);

  

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "designGallery":
        return (
          <ScrollView style={[Styles.flex1, Styles.backgroundColor]}>
            <DesignGalleryTab navigation={navigation} designGalleryData={imageGalleryData}/>
          </ScrollView>
        );
      case "pending":
        return <ScrollView style={[Styles.flex1, Styles.backgroundColor]}></ScrollView>;
      case "approved":
        return <ScrollView style={[Styles.flex1, Styles.backgroundColor]}></ScrollView>;
      case "rejected":
        return <ScrollView style={[Styles.flex1, Styles.backgroundColor]}></ScrollView>;
    }
  };

  const renderTabBar = (props) => <TabBar {...props} indicatorStyle={{ backgroundColor: theme.colors.primary }} style={{ backgroundColor: theme.colors.textLight }} inactiveColor={theme.colors.textSecondary} activeColor={theme.colors.primary} scrollEnabled={true} tabStyle={{ width: windowWidth / 4 }} labelStyle={[Styles.fontSize13, Styles.fontBold]} />;
  const [routes] = React.useState([
    { key: "designGallery", title: "Design" },
    { key: "pending", title: "Pending" },
    { key: "approved", title: "Approved" },
    { key: "rejected", title: "Rejected" },
  ]);

  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <Header navigation={navigation} title="Design Wise" />
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <TabView style={{ marginBottom: 64 }} renderTabBar={renderTabBar} navigationState={{ index, routes }} renderScene={renderScene} onIndexChange={setIndex} />
      )}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default DesignWiseScreen;
