import React, { useEffect } from "react";
import { Modal, ScrollView, View } from "react-native";
import { ActivityIndicator, Button, Snackbar } from "react-native-paper";
import ImageViewer from "react-native-image-zoom-viewer";
import Provider from "../../../api/Provider";
import NoItems from "../../../components/NoItems";
import CreateSCCards from "../../../components/SCCards";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";

const ImageGalleryWorkLocationScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [imageGalleryData, setImageGalleryData] = React.useState([]);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);
  const [isZoomShow, setIsZoomShow] = React.useState(false);
  const [imageToZoom, setImageToZoom] = React.useState([]);
  const [imageToZoomData, setImageToZoomData] = React.useState([]);

  const FetchImageGalleryData = () => {
    let params = {
      CategoryID: route.params.categoryID,
    };
    Provider.getAll(`generaluserenquiryestimations/getimagegallerybycategoryid?${new URLSearchParams(params)}`)
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
    navigation.setOptions({ headerTitle: route.params.headerTitle });
  }, []);

  const SingleCardClick = () => {};

  const CardImageClick = (imageToZoom, data) => {
    setImageToZoom([
      {
        url: imageToZoom,
      },
    ]);
    setImageToZoomData(data);
    setIsZoomShow(true);
  };

  return (
    <View style={[Styles.flex1]}>
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : imageGalleryData.length > 0 ? (
        <ScrollView style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <View style={[Styles.padding16, Styles.paddingTop0]}>
            {imageGalleryData.map((k, i) => {
              return (
                <CreateSCCards
                  key={i}
                  image={k.designImage}
                  title={k.workLocationName}
                  subttitle={k.designTypeName}
                  id={k.designTypeID}
                  data={k}
                  cardImageClick={CardImageClick}
                  cardClick={SingleCardClick}
                  buttonData={{
                    text: "Go to Estimation",
                    click: () => {
                      setIsZoomShow(false);
                      navigation.navigate("EstimationPreviewScreen", { data: k });
                    },
                  }}
                />
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found." />
      )}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
      <Modal visible={isZoomShow} onRequestClose={() => setIsZoomShow(false)} transparent={true}>
        <View style={[Styles.flex1, { backgroundColor: "rgba(0,0,0,0.85)", position: "relative" }]}>
          <Button
            mode="contained"
            style={{ position: "absolute", bottom: 16, zIndex: 20, right: 16 }}
            onPress={() => {
              setIsZoomShow(false);
              navigation.navigate("EstimationPreviewScreen", { data: imageToZoomData });
            }}
          >
            Go to Estimation
          </Button>
          <Button mode="outlined" style={{ position: "absolute", bottom: 16, zIndex: 20, right: 204, backgroundColor: "white" }} onPress={() => setIsZoomShow(false)}>
            Close
          </Button>
          <ImageViewer imageUrls={imageToZoom} backgroundColor="transparent" style={{ height: 1920 }} renderIndicator={() => {}} />
        </View>
      </Modal>
    </View>
  );
};

export default ImageGalleryWorkLocationScreen;
