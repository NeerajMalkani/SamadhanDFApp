import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Snackbar } from "react-native-paper";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import NoItems from "../../../components/NoItems";
import CreateSCCards from "../../../components/SCCards";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

let userID = 0,
  groupRefNo = 0;

const ImageGalleryScreen = ({ navigation }) => {
   //#region Variables
  const [isLoading, setIsLoading] = React.useState(true);
  const [imageGalleryData, setImageGalleryData] = React.useState([]);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);
 //#endregion 

 //#region Functions

  const FetchImageGalleryData = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupRefNo,
      },
    };
    Provider.createDFDashboard(Provider.API_URLS.GetdashboardServicecatalogue, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {

          if (response.data.data) {

            setImageGalleryData(response.data.data);
          }
        } else {
          setImageGalleryData([]);
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
    GetUserID();
  }, []);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      const userDataParsed = JSON.parse(userData);
      userID = userDataParsed.UserID;
      groupRefNo = userDataParsed.Sess_group_refno;
      FetchImageGalleryData();
    }
  };

  const SingleCardClick = (headerTitle, categoryID, data) => {
    navigation.navigate("ImageGalleryWorkLocationScreen", { headerTitle: headerTitle, categoryID: categoryID, data: data });
  };
 //#endregion 
 
  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <Header navigation={navigation} title="Image Gallery" />
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : imageGalleryData.length > 0 ? (
        <ScrollView style={[Styles.flex1, Styles.flexColumn]}>
          <View style={[Styles.padding16, Styles.paddingTop0]}>
            {imageGalleryData.map((k, i) => {
              return <CreateSCCards key={i} image={k.design_image_url} title={k.service_name} id={k.service_refno} subttitle={k.designtype_name} data={k} cardClick={SingleCardClick} />;
            })}
          </View>
        </ScrollView>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found." />
      )}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default ImageGalleryScreen;
