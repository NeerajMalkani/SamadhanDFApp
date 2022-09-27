import React from "react";
import { ScrollView, TouchableNativeFeedback, View, Modal, Dimensions, Image } from "react-native";
import { ActivityIndicator, Avatar, Button, Caption, Card, Dialog, Headline, Paragraph, Portal, Snackbar, Subheading, Text, Title } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons/faPowerOff";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons/faBarsStaggered";
import { Styles } from "../styles/styles";
import { theme } from "../theme/apptheme";
import { createNavigationContainerRef, StackActions } from "@react-navigation/native";
import Provider from "../api/Provider";
import { ImageSlider } from "react-native-image-slider-banner";
import { communication } from "../utils/communication";
import ImageViewer from "react-native-image-zoom-viewer";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateSCCards from "../components/SCCards";
import FadingSlides from 'react-native-fading-slides';
import { ImageBackground } from "react-native-web";
import { Touchable } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

export const navigationRef = createNavigationContainerRef();
const windowWidth = Dimensions.get("window").width;

const HomeScreen = ({ route, navigation }) => {
  const [snackbarText, setSnackbarText] = React.useState("");
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState("");
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [userRoleName, setUserRoleName] = React.useState(route.params.userDetails[0].RoleName);

  const [imageGalleryData, setImageGalleryData] = React.useState([]);
  const [catalogueCategoryImages, setCatalogueCategoryImages] = React.useState([]);
  const [catalogueImagesZoom, setCatalogueImagesZoom] = React.useState([]);
  const [catalogueImagesZoomVisible, setCatalogueImagesZoomVisible] = React.useState(false);
  const [catalogueImages, setCatalogueImages] = React.useState([]);

  const [userCountData, setUserCountData] = React.useState([]);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [roleName, setRoleName] = React.useState("");
  const [switchRoleNames, setSwitchRoleNames] = React.useState([]);
  const [errorRole, setErrorRole] = React.useState(false);
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);

  const LogoutUser = async () => {
    try {
      await AsyncStorage.setItem("user", "{}");
      navigationRef.dispatch(StackActions.replace("Login"));
    } catch (error) {
      console.log(error);
    }
  };

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

  const GetServiceCatalogue = () => {
    Provider.getAll("servicecatalogue/getpostnewdesigntypes")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const categoryImageData = [];
            const sliderImageData = [];
            const sliderImageZoomData = [];
            response.data.data.map((data) => {
              categoryImageData.push({
                image: data.designImage,
                text: data.categoryName,
              });
              sliderImageData.push({
                img: data.designImage,
              });
              sliderImageZoomData.push({
                url: data.designImage,
              });
            });
            setCatalogueCategoryImages(categoryImageData);
            setCatalogueImages(sliderImageData);
            setCatalogueImagesZoom(sliderImageZoomData);
          }
        } else {
          listData[1]([]);
          setSnackbarText("No data found");
          setIsSnackbarVisible(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setSnackbarText(e.message);
        setIsSnackbarVisible(true);
      });
  };

  const GetUserCount = () => {
    Provider.getAll("registration/getusers")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          let totalUserCount = 0;
          response.data.data.map((k) => {
            totalUserCount += parseInt(k.roleCount);
          });
          setTotalUsers(totalUserCount);
          setUserCountData(response.data.data);
          let switchRolesData = [];
          response.data.data.map((data) => {
            data.roleName !== "General User" ? switchRolesData.push(data.roleName) : null;
          });
          setSwitchRoleNames(switchRolesData);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    GetServiceCatalogue();
    FetchImageGalleryData();
    GetUserCount();
  }, []);

  const showDialog = () => setIsDialogVisible(true);

  const hideDialog = () => setIsDialogVisible(false);

  const SingleCardClick = (headerTitle, categoryID, data) => {
    navigation.navigate("ImageGalleryWorkLocationScreen", { headerTitle: headerTitle, categoryID: categoryID, data: data, from: "home", isContractor: userRoleName === "Contractor" ? true : false });
  };

  const onRoleSelected = (role) => {
    setErrorRole(false);
    setRoleName(role);
  };

  const ValidateSwitchRole = () => {
    if (roleName.length === 0) {
      setErrorRole(true);
    } else {
      showDialog();
    }
  };

  const StoreUserData = async (user) => {
    await AsyncStorage.setItem("user", JSON.stringify(user));
    route.params.setUserFunc();
  };

  const UpdateUserRole = () => {
    hideDialog();
    setIsButtonLoading(true);
    const params = {
      UserID: route.params.userDetails[0].UserID,
      RoleID: userCountData.filter((el) => {
        return el.roleName === roleName;
      })[0].roleID,
    };
    Provider.create("registration/updateuserrole", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          setUserRoleName(roleName);
          GetUserCount();
          const user = {
            UserID: route.params.userDetails[0].UserID,
            FullName: route.params.userDetails[0].FullName,
            RoleID: userCountData.filter((el) => {
              return el.roleName === roleName;
            })[0].roleID,
            RoleName: roleName, //TBC
          };
          StoreUserData(user);
        } else {
          setSnackbarText(communication.NoData);
          setIsSnackbarVisible(true);
        }
        setIsButtonLoading(false);
      })
      .catch((e) => {
        setSnackbarText(e.message);
        setIsSnackbarVisible(true);
        setIsButtonLoading(false);
      });
  };

  const slides = [
    {
      image: require('../../assets/dreamone.jpg'),
      imageWidth: 350,
      imageHeight: 170,
      imageborder:10
      // title: 'Hello World',
      // subtitle: 'This is a beautiful world',
      // titleColor: '#fff',
      // subtitleColor: '#fff',
    },
    {
      image: require('../../assets/dreamtwo.jpg'),
      imageWidth: 350,
      imageHeight: 170,
      imageborder:10
      // title: 'Hello World',
      // subtitle: 'This is a beautiful world',
      // titleColor: '#fff',
      // subtitleColor: '#fff',
    }
  ];
  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <View style={[Styles.width100per, Styles.height64, Styles.primaryBgColor, Styles.borderBottomRadius8, Styles.flexRow, Styles.flexAlignCenter, Styles.paddingHorizontal16]}>
        <TouchableNativeFeedback>
          <View style={[Styles.width48, Styles.height48, Styles.flexJustifyCenter, Styles.flexAlignCenter]} onTouchStart={() => navigation.toggleDrawer()}>
            <FontAwesomeIcon icon={faBarsStaggered} size={24} color={theme.colors.textLight} />
          </View>
        </TouchableNativeFeedback>
        <Avatar.Image size={40} style={[Styles.marginEnd16, Styles.backgroundColor]} source={require("../../assets/defaultIcon.png")} />
        <View style={[Styles.flexColumn, Styles.flexGrow]}>
          <Title style={[Styles.textColorWhite, { marginTop: -4 }]}>{route.params.userDetails[0].FullName}</Title>
          <Text style={[Styles.textTertiaryColor, { marginTop: -4 }]}>{userRoleName}</Text>
        </View>
        <TouchableNativeFeedback>
          <View style={[Styles.width48, Styles.height48, Styles.flexJustifyCenter, Styles.flexAlignCenter]} onTouchStart={() => LogoutUser()}>
            <FontAwesomeIcon icon={faPowerOff} size={24} color={theme.colors.textLight} />
          </View>
        </TouchableNativeFeedback>
      </View>
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexGrow, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView>
          <View style={[Styles.flexRow, Styles.padding4, Styles.flexWrap]}>
            {imageGalleryData.map((k, i) => {
              return (
                <View key={i} style={[Styles.width50per, Styles.padding16, Styles.paddingTop0]}>
                  <CreateSCCards key={i} image={k.designImage} title={k.serviceName} id={k.serviceID} subttitle={k.designTypeName} data={k} cardClick={SingleCardClick} />
                </View>
              );
            })}
          </View>
          <View style={[Styles.margin4, Styles.marginTop0, Styles.border1, { height: 180 }]}>
            <ImageSlider data={catalogueImages} timer={10000} activeIndicatorStyle={{ backgroundColor: theme.colors.primary }} autoPlay={true} onClick={() => setCatalogueImagesZoomVisible(true)} />
          </View>
          <View style={[Styles.margin4, Styles.height96, Styles.border1, { position: "relative" }]}>
            <Image source={{ uri: "https://www.wordstream.com/wp-content/uploads/2021/07/banner-ads-examples-ncino.jpg" }} style={{ width: "100%", height: "100%" }} />
            <Caption style={[{ position: "absolute", bottom: 4, right: 4, color: theme.colors.textLight }]}>Sponsered Ads</Caption>
          </View>
          {userRoleName === "General User" ? (
            <View style={[Styles.marginBottom16]}>
              <Title style={[Styles.padding16, Styles.paddingBottom0]}>Switch Role</Title>
              <View style={[Styles.paddingHorizontal16]}>
                <Dropdown label="SELECT" data={switchRoleNames} onSelected={onRoleSelected} isError={errorRole} selectedItem={roleName} />
                <Button mode="contained" style={[Styles.marginTop12]} loading={isButtonLoading} disabled={isButtonLoading} onPress={ValidateSwitchRole}>
                  Switch
                </Button>
              </View>
              <Portal>
                <Dialog visible={isDialogVisible} onDismiss={hideDialog}>
                  <Dialog.Title>Confirmation</Dialog.Title>
                  <Dialog.Content>
                    <Paragraph>Do you really want to switch your role to {roleName}? If OK, then your active role will get automatically changed</Paragraph>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={UpdateUserRole}>Ok</Button>
                    <Button onPress={hideDialog}>Cancel</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
            </View>
          ) : null}
          {/* <Subheading style={[Styles.padding16, Styles.paddingBottom0]}>Total Users ({totalUsers})</Subheading> */}
          <View style={[Styles.flexRow, Styles.flexAlignStart]}>
            {userCountData.map((k, i) => {
              //
              return (
                <View key={i} style={[Styles.flex1, Styles.padding2, Styles.paddingBottom16]}>
                  <Card style={[Styles.padding2, Styles.flexAlignCenter, Styles.paddingVertical16]}>
                    <Caption style={[Styles.textCenter]}>{k.roleName}s</Caption>
                    <Headline style={[Styles.textCenter]}>{k.roleCount}</Headline>
                  </Card>
                </View>
              );
            })}
          </View>
          <View style={[Styles.width100per,Styles.padding16,]}>
            {/* <View style={[Styles.border1,Styles.width100per,Styles.height200,Styles.backgroundColorWhite,Styles.borderRadius16]}></View> */}
            <Card elevation={3} style={[Styles.width100per,Styles.height200,Styles.borderRadius16]}>
              {/* <Card.Content>
                <Title snumberOfLines={1} style={[Styles.fontSize20,Styles.fontRegular]}>Design Your Dream</Title>
              </Card.Content> */}
              {/* <Text>Design Your Dream</Text> */}
              {/* <Card.Title title="Design Your Dream"/> */}
              <FadingSlides
                slides={slides}
                fadeDuration={100}
                stillDuration={1000}
                // height={500}
                startAnimation={true}
                style={[Styles.width100per,Styles.borderRadius16,Styles.height100per]}
              />
            </Card>
            <View style={[Styles.flexRow]}>
              <Card style={[Styles.width48per,Styles.height250,Styles.marginTop16,Styles.borderRadius16,Styles.marginEnd16,Styles.border1,{backgroundColor:"#42c6a5"}]}>
                {/* <Card.Content>
                  <Title snumberOfLines={1} style={[Styles.fontSize20,Styles.fontRegular]}>User</Title>
                </Card.Content> */}
                {/* <Text style={[Styles.fontSize14]}>User</Text> */}
                <Card.Title title="Users" titleStyle={[Styles.textColorWhite]}/>
              </Card>
              <View style={[Styles.width48per,Styles.height200,Styles.marginTop16,Styles.borderRadius16]}>
                <Card style={[Styles.height120,Styles.width100per,Styles.borderRadius16,Styles.border1,{backgroundColor:"#55AEF7"}]}>
                  {/* <Card.Content>
                    <Title snumberOfLines={1} style={[Styles.fontSize20,Styles.fontRegular,Styles.fontSize14]}>Material calculator</Title>
                  </Card.Content> */}
                   <Text style={[Styles.fontSize16,Styles.fontBold,Styles.marginTop12,Styles.marginStart12,Styles.textColorWhite]}>Material calculator</Text> 
                  {/* <Card.Title title="Material calculator" style={[Styles.fontSize10]}/> */}
                </Card>
                <Card style={[Styles.height120,Styles.width100per,Styles.marginTop12,Styles.borderRadius16,Styles.border1,{backgroundColor:"#D4a311"}]}>
                  {/* <Card.Content>
                    <Title snumberOfLines={1} style={[Styles.fontSize20,Styles.fontRegular]}>Job Your Dream</Title>
                  </Card.Content> */}
                  {/* <Card.Title title="Job Your Dream"/> */}
                  <Text style={[Styles.fontSize16,Styles.fontBold,Styles.marginTop12,Styles.marginStart12,Styles.textColorWhite]}>Looking For Job</Text>
                  
                  <Image source={require('../../assets/job-seeker.png')} style={[Styles.width40,Styles.height40,Styles.backgroundColorWhite]}/>
                  
                    
                  
                </Card>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
      <Snackbar visible={isSnackbarVisible} onDismiss={() => setIsSnackbarVisible(false)} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
      <Modal visible={catalogueImagesZoomVisible} onRequestClose={() => setCatalogueImagesZoomVisible(false)} transparent={true}>
        <View style={[Styles.flex1, { backgroundColor: "rgba(0,0,0,0.85)", position: "relative" }]}>
          <Button mode="contained" style={{ position: "absolute", bottom: 16, zIndex: 20, right: 16 }} onPress={() => {}}>
            View
          </Button>
          <Button mode="outlined" style={{ position: "absolute", bottom: 16, zIndex: 20, right: 104, backgroundColor: "white" }} onPress={() => setCatalogueImagesZoomVisible(false)}>
            Close one
          </Button>
          <ImageViewer imageUrls={catalogueImagesZoom} backgroundColor="transparent" style={{ height: 1920 }} />
        </View>
      </Modal>
      
    </View>
  );
};

export default HomeScreen;
