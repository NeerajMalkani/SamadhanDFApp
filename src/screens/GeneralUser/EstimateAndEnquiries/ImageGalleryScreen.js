import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Snackbar } from "react-native-paper";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import NoItems from "../../../components/NoItems";
import CreateSCCards from "../../../components/SCCards";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";

const ImageGalleryScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [imageGalleryData, setImageGalleryData] = React.useState([]);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const FetchImageGalleryData = () => {
    Provider.getAll("generaluserenquiryestimations/getimagegallery")
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
    FetchImageGalleryData();
  }, []);

  const SingleCardClick = (headerTitle, categoryID, data) => {
    navigation.navigate("ImageGalleryWorkLocationScreen", { headerTitle: headerTitle, categoryID: categoryID, data: data });
  };

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
              return <CreateSCCards key={i} image={k.designImage} title={k.serviceName} id={k.serviceID} subttitle={k.designTypeName} data={k} cardClick={SingleCardClick} />;
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
