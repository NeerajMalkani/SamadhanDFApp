import React, { useEffect } from "react";
import { Modal, ScrollView, View } from "react-native";
import { ActivityIndicator, Button, Snackbar } from "react-native-paper";
import ImageViewer from "react-native-image-zoom-viewer";
import Provider from "../../../api/Provider";
import NoItems from "../../../components/NoItems";
import CreateSCCards from "../../../components/SCCards";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ImageGalleryWorkLocationScreen = ({ route, navigation }) => {
   //#region Variables

  const [isLoading, setIsLoading] = React.useState(true);
  const [imageGalleryData, setImageGalleryData] = React.useState([]);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);
  const [isZoomShow, setIsZoomShow] = React.useState(false);
  const [imageToZoom, setImageToZoom] = React.useState([]);
  const [imageToZoomData, setImageToZoomData] = React.useState([]);
  const [user, setUser] = React.useState(null);
 //#endregion 

 //#region Functions
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      setUser(JSON.parse(userData));
      FetchImageGalleryData(JSON.parse(userData).UserID, JSON.parse(userData).Sess_group_refno);
    }
  };

  const FetchImageGalleryData = (UserID, Sess_group_refno) => {
    let params = {
      data: {
        Sess_UserRefno: UserID,
        Sess_group_refno: Sess_group_refno,
        service_refno: route.params.data.id
      },
    };
    console.log(params);
    Provider.createDFCommon(Provider.API_URLS.GetserviceimagegalleryByServicerefno, params)
      .then((response) => {
        console.log(response.data);
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
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
    navigation.setOptions({ headerTitle: route.params.headerTitle });
  }, []);

  const CardImageClick = (imageToZoom, data) => {
    setImageToZoom([
      {
        url: imageToZoom,
      },
    ]);
    setImageToZoomData(data);
    setIsZoomShow(true);
  };


  const APIConverter = (response: any) => {
    function renameKey(obj: any, oldKey: string, newKey: string) {
      if (obj.hasOwnProperty(oldKey)) {
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
      }
    }
  
    response.forEach((obj: any) => {
      renameKey(obj, "product_refno", "productID");
      renameKey(obj, "product_name", "productName");
      renameKey(obj, "product_refno", "id");
      renameKey(obj, "category_refno", "id");
      renameKey(obj, "category_name", "categoryName");
      renameKey(obj, "group_refno_name", "activityRoleName");
      renameKey(obj, "group_refno", "id");
      renameKey(obj, "group_name", "activityRoleName");
      renameKey(obj, "service_refno_name", "serviceName");
      renameKey(obj, "service_refno", "id");
      renameKey(obj, "service_name", "serviceName");
      renameKey(obj, "unit_category_names", "unitName");
      renameKey(obj, "unit_category_name", "unitName");
      renameKey(obj, "unit_category_refno", "id");
      renameKey(obj, "unit_name_text", "displayUnit");
      renameKey(obj, "hsn_sac_code", "hsnsacCode");
      renameKey(obj, "gst_rate", "gstRate");
      renameKey(obj, "view_status", "display");
      renameKey(obj, "product_code", "productCode");
      renameKey(obj, "unit_display_name", "displayUnit");
      renameKey(obj, "unit_name", "displayUnit");
      renameKey(obj, "unitcategoryrefno_unitrefno", "id");
      renameKey(obj, "with_material_rate", "rateWithMaterials");
      renameKey(obj, "without_material_rate", "rateWithoutMaterials");
      renameKey(obj, "short_desc", "shortSpecification");
      renameKey(obj, "actual_unitname", "selectedUnit");
      renameKey(obj, "convert_unitname", "convertedUnit");
      renameKey(obj, "service_product_refno", "productID");
      renameKey(obj, "locationtype_refno", "id");
      renameKey(obj, "service_refno_name", "serviceName");
      renameKey(obj, "locationtype_name", "branchType");
      renameKey(obj, "workfloor_refno", "id");
      renameKey(obj, "workfloor_name", "workFloorName");
      renameKey(obj, "worklocation_refno", "id");
      renameKey(obj, "worklocation_name", "workLocationName");
      renameKey(obj, "designtype_refno", "designTypeID");
      renameKey(obj, "designtype_name", "designTypeName");
      renameKey(obj, "designtype_image_url", "designImage");
      renameKey(obj, "materials_setup_refno", "id");
      renameKey(obj, "service_product_name", "productName");
      renameKey(obj, "matrails_cost", "materialCost");
      renameKey(obj, "dealer_product_refno", "productID");
      renameKey(obj, "brand_refno", "brandID");
      renameKey(obj, "brand_name", "brandName");
      renameKey(obj, "company_product_refno", "productID");
      renameKey(obj, "company_product_price", "price");
      renameKey(obj, "company_brand_refno", "brandID");
      renameKey(obj, "company_brand_name", "brandName");
      renameKey(obj, "design_image_url", "designImage");
      
    });
  
    return response;
  };

 //#endregion 
 
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
                  buttonData={{
                    text: "Go to Estimation",
                    disabled: user && (user.RoleID == 1 || user.RoleID == 4 || user.RoleID == 5 || user.RoleID == 6) ? true : false,
                    click: () => {
                      setIsZoomShow(false);
                      navigation.navigate("EstimationPreviewScreen", { data: k, from: route.params.from, isContractor: route.params.isContractor, fetchData: route.params.fetchData });
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
          <Button mode="outlined" style={{ position: "absolute", bottom: 16, zIndex: 20, right: 16, backgroundColor: "white" }} onPress={() => setIsZoomShow(false)}>
            Close
          </Button>
          <Button
            mode="contained"
            style={{ position: "absolute", bottom: 16, zIndex: 20, right: 114 }}
            disabled={user && (user.RoleID == 1 || user.RoleID == 4 || user.RoleID == 5 || user.RoleID == 6) ? true : false}
            onPress={() => {
              setIsZoomShow(false);
              navigation.navigate("EstimationPreviewScreen", { data: imageToZoomData, from: route.params.from, isContractor: route.params.isContractor });
            }}
          >
            Go to Estimation
          </Button>
          <ImageViewer imageUrls={imageToZoom} backgroundColor="transparent" style={{ height: 1920 }} renderIndicator={() => {}} />
        </View>
      </Modal>
    </View>
  );
};

export default ImageGalleryWorkLocationScreen;
