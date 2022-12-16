import React from "react";
import { ScrollView, TouchableNativeFeedback, View, Modal, Dimensions, Image } from "react-native";
import { ActivityIndicator, Avatar, Button, Caption, Card, Dialog, Headline, Paragraph, Portal, Snackbar, Text, Title, Divider } from "react-native-paper";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateSCCards from "../components/SCCards";
import FadeCarousel from "rn-fade-carousel";
export const navigationRef = createNavigationContainerRef();
import { APIConverter } from "../utils/apiconverter";

let roleID = 0,
  userID = 0,
  groupRefNo = 0;

const HomeScreen = ({ route, navigation }) => {
  //#region Variables
  const [snackbarText, setSnackbarText] = React.useState("");
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState("");
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [userRoleName, setUserRoleName] = React.useState(route.params.userDetails[0].RoleName);
  const [userRoleID, setUserRoleID] = React.useState("");

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
  const [userRoleData, setUserRoleData] = React.useState([]);
  const [errorRole, setErrorRole] = React.useState(false);
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);

  //#endregion

  //#region Functions

  const slidesTwo = [
    <Image source={require("../../assets/dreamone.jpg")} style={Styles.flex1} resizeMode="cover" />,
    <Image source={require("../../assets/dreamtwo.jpg")} style={Styles.flex1} resizeMode="cover" />,
    <Image source={require("../../assets/dreamthree.jpg")} style={Styles.flex1} resizeMode="cover" />,
    <Image source={require("../../assets/dreamfour.jpg")} style={Styles.flex1} resizeMode="cover" />,
  ];

  const LogoutUser = async () => {
    try {
      await AsyncStorage.setItem("user", "{}");
      navigationRef.dispatch(StackActions.replace("Login"));
    } catch (error) {
      console.log(error);
    }
  };

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

  const GetServiceCatalogue = () => {
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
            response.data.data = APIConverter(response.data.data);
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

  const GetUserCount = (userID, groupRefNo) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupRefNo,
      },
    };
    Provider.createDFDashboard(Provider.API_URLS.GetdashboardTotaluser, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          setTotalUsers(response.data.data[0].TotalUsers);
          let usr_data = [
            {
              roleID: 0,
              roleName: "Dealer",
              roleCount: response.data.data[0].TotalDealer,
            },
            {
              roleID: 1,
              roleName: "Contractor",
              roleCount: response.data.data[0].TotalContractor,
            },
            {
              roleID: 2,
              roleName: "General User",
              roleCount: response.data.data[0].TotalGeneralUser,
            },
            {
              roleID: 3,
              roleName: "Client",
              roleCount: response.data.data[0].TotalClient,
            },
          ];
          setUserCountData(usr_data);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  React.useEffect(() => {
    GetUserData();
  }, []);

  const GetUserData = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      const userDataParsed = JSON.parse(userData);
      roleID = userDataParsed.RoleID;
      userID = userDataParsed.UserID;
      groupRefNo = userDataParsed.Sess_group_refno;
      let roleName = "";
      switch (roleID) {
        case "1":
          roleName = "Super Admin";
          break;
        case "2":
          roleName = "Admin";
          break;
        case "3":
          roleName = "General User";
          break;
        case "4":
          roleName = "Dealer";
          break;
        case "5":
          roleName = "Contractor";
          break;
        case "7":
          roleName = "Employee";
          break;
        case "8":
          roleName = "Client";
          break;
        case "9":
          roleName = "Architect And Consultant (PMC)";
          break;
      }
      setUserRoleID(roleID);
      setUserRoleName(roleName);
      GetServiceCatalogue();
      FetchImageGalleryData();
      GetUserCount(userID, groupRefNo);
      if (roleID == 3) {
        FillUserRoles();
      }
    }
  };

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
      data: {
        Sess_UserRefno: userID,
        switchto_group_refno: userRoleData.filter((el) => {
          return el.roleName === roleName;
        })[0].roleID,
      },
    };
    Provider.createDFDashboard(Provider.API_URLS.Getdashboard_Userswitchto_Proceed, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          setUserRoleName(roleName);
          GetUserCount();
          GetUserDetails(userID);
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

  const GetUserDetails = (user_refno) => {
    setIsButtonLoading(true);
    let params = {
      data: {
        user_refno: user_refno,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.UserFromRefNo, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          const user = {
            UserID: user_refno,
            FullName: response.data.data.Sess_FName === "" ? response.data.data.Sess_Username : "",
            RoleID: response.data.data.Sess_group_refno,
            RoleName: response.data.data.Sess_Username,
            Sess_FName: response.data.data.Sess_FName,
            Sess_MobileNo: response.data.data.Sess_MobileNo,
            Sess_Username: response.data.data.Sess_Username,
            Sess_role_refno: response.data.data.Sess_role_refno,
            Sess_group_refno: response.data.data.Sess_group_refno,
            Sess_designation_refno: response.data.data.Sess_designation_refno,
            Sess_locationtype_refno: response.data.data.Sess_locationtype_refno,
            Sess_group_refno_extra_1: response.data.data.Sess_group_refno_extra_1,
            Sess_User_All_GroupRefnos: response.data.data.Sess_User_All_GroupRefnos,
            Sess_branch_refno: response.data.data.Sess_branch_refno,
            Sess_company_refno: response.data.data.Sess_company_refno,
            Sess_CompanyAdmin_UserRefno: response.data.data.Sess_CompanyAdmin_UserRefno,
            Sess_CompanyAdmin_group_refno: response.data.data.Sess_CompanyAdmin_group_refno,
            Sess_RegionalOffice_Branch_Refno: response.data.data.Sess_RegionalOffice_Branch_Refno,
            Sess_menu_refno_list: response.data.data.Sess_menu_refno_list,
          };

          StoreUserData(user);
        } else {
          setSnackbarText(communication.InvalidUserNotExists);
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

  const FillUserRoles = () => {
    const params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupRefNo,
      },
    };
    Provider.createDFDashboard(Provider.API_URLS.GetdashboardUserswitchto, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          let d = [],
            userRoleNames = [];
          for (var key in response.data.data[0]) {
            if (response.data.data[0].hasOwnProperty(key)) {
              d.push({
                roleID: key,
                roleName: response.data.data[0][key],
              });

              userRoleNames.push(response.data.data[0][key]);
            }
          }

          setUserRoleData(d);
          setSwitchRoleNames(userRoleNames);
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
  //#endregion

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
          <View style={[Styles.flexRow, Styles.paddingHorizontal16, Styles.flexWrap]}>
            {imageGalleryData.map((k, i) => {
              return (
                <View key={i} style={[Styles.width50per, Styles.padding4, Styles.paddingTop0]}>
                  <CreateSCCards key={i} image={k.designImage} title={k.serviceName} id={k.serviceID} subttitle={k.designTypeName} data={k} cardClick={SingleCardClick} />
                </View>
              );
            })}
          </View>
          <View style={[Styles.padding16]}>
            <Text style={[Styles.fontSize18, { color: "green", width: "100%" }, Styles.paddingBottom12]}>SLIDING GALLERY</Text>
            <Divider />
          </View>
          <View style={[Styles.margin16, Styles.marginTop0, Styles.border1, Styles.borderRadius8, Styles.OverFlow, { height: 180 }]}>
            <ImageSlider data={catalogueImages} timer={10000} activeIndicatorStyle={{ backgroundColor: theme.colors.primary }} autoPlay={true} onClick={() => setCatalogueImagesZoomVisible(true)} style={Styles.borderRadius16} />
          </View>
          <View style={[Styles.margin4, Styles.height96, Styles.border1, { position: "relative" }]}>
            <Image source={{ uri: "https://www.wordstream.com/wp-content/uploads/2021/07/banner-ads-examples-ncino.jpg" }} style={{ width: "100%", height: "100%" }} />
            <Caption style={[{ position: "absolute", bottom: 4, right: 4, color: theme.colors.textLight }]}>Sponsered Ads</Caption>
          </View>
          {userRoleID === "3" ? (
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

          <View style={[Styles.width100per, Styles.padding16, Styles.positionRelative]}>
            <View style={[Styles.flex1, Styles.width100per, Styles.height250, Styles.borderRadius8, Styles.OverFlow]}>
              <FadeCarousel elements={slidesTwo} containerStyle={[Styles.flex1, Styles.flexAlignCenter, Styles.flexJustifyCenter]} fadeDuration={2000} stillDuration={2000} start={true} />
              <View style={[Styles.width100per, Styles.height40, { backgroundColor: "rgba(0,0,0,0.4)", position: "absolute" }]}>
                <Text style={[Styles.marginTop8, Styles.marginStart16, Styles.fontSize18, Styles.textColorWhite, Styles.fontBold]}>Design your Dream</Text>
              </View>
            </View>

            <View style={[Styles.width100per, Styles.flexRow, Styles.marginTop16]}>
              <View style={Styles.width50per}>
                <Card
                  onPress={() => {
                    if (roleID == 2) {
                      navigation.navigate("ApprovedUserScreen", { type: "add" });
                    }
                  }}
                  style={[Styles.width100per, Styles.height250, Styles.borderRadius8, Styles.border1, Styles.marginEnd16, { backgroundColor: "#42c6a5" }]}
                >
                  <Card.Title
                    style={[Styles.width100per]}
                    title={
                      <View style={[Styles.flexSpaceBetween, Styles.flexRow, Styles.width100per]}>
                        <View style={[Styles.fontSize16, Styles.fontBold, Styles.textColorWhite]}>
                          <Text style={[Styles.fontSize16, Styles.fontBold, Styles.textColorWhite]}>Users</Text>
                        </View>
                      </View>
                    }
                    right={(props) => (
                      <View style={[Styles.fontSize16, Styles.fontBold, Styles.textColorWhite, Styles.marginEnd8]}>
                        <Text style={[Styles.fontSize16, Styles.fontBold, Styles.textColorWhite]}>{totalUsers}</Text>
                      </View>
                    )}
                    titleStyle={[Styles.textColorWhite]}
                  />
                  <Text style={[Styles.fontSize16, Styles.fontBold, Styles.marginStart12, Styles.textColorWhite]}>{15}</Text>
                  <Text style={[Styles.fontSize12, Styles.fontRegular, Styles.marginStart12, Styles.textColorWhite]}>General Users</Text>
                  <Text style={[Styles.fontSize16, Styles.fontBold, Styles.marginTop8, Styles.marginStart12, Styles.textColorWhite]}>15</Text>
                  <Text style={[Styles.fontSize12, Styles.fontRegular, Styles.marginStart12, Styles.textColorWhite]}>Contractors</Text>
                  <Text style={[Styles.fontSize16, Styles.fontBold, Styles.marginTop8, Styles.marginStart12, Styles.textColorWhite]}>28</Text>
                  <Text style={[Styles.fontSize12, Styles.fontRegular, Styles.marginStart12, Styles.textColorWhite]}>Dealers</Text>
                  <Text style={[Styles.fontSize16, Styles.fontBold, Styles.marginTop8, Styles.marginStart12, Styles.textColorWhite]}>1</Text>
                  <Text style={[Styles.fontSize12, Styles.fontRegular, Styles.marginStart12, Styles.textColorWhite]}>Architechts</Text>
                </Card>
              </View>

              <View style={Styles.width50per}>
                <Card
                  onPress={() => {
                    if (roleID == 2) {
                      navigation.navigate("MaterialSetupScreen", { type: "add" });
                    } else {
                      navigation.navigate("MaterialCalculatorScreen", { type: "add" });
                    }
                  }}
                  style={[Styles.height120, Styles.width100per, Styles.borderRadius8, Styles.border1, Styles.OverFlow, Styles.marginStart4, { backgroundColor: "#55AEF7" }]}
                >
                  {roleID == 2 ? <Text style={[Styles.fontSize16, Styles.fontBold, Styles.marginTop12, Styles.marginStart12, Styles.textColorWhite]}>Material Setup</Text> : <Text style={[Styles.fontSize16, Styles.fontBold, Styles.marginTop12, Styles.marginStart12, Styles.textColorWhite]}>Material Calculator</Text>}
                  {/* <Card.Title title="Material calculator" style={[Styles.fontSize10]}/> */}
                  <Image source={require("../../assets/material-calculator.png")} style={[Styles.width96, Styles.height96, Styles.flexJustifyEnd, Styles.flexRow, Styles.flexAlignEnd, Styles.resizeModeContain, Styles.positionAbsolute, Styles.Bottom_20, Styles.Right_20]} />
                </Card>
                <Card style={[Styles.height120, Styles.width100per, Styles.marginTop8, Styles.borderRadius8, Styles.border1, Styles.marginStart4, Styles.positionRelative, Styles.OverFlow, { backgroundColor: "#D4a311" }]}>
                  <Text style={[Styles.fontSize16, Styles.fontBold, Styles.marginTop12, Styles.marginStart12, Styles.textColorWhite]}>Looking For Job</Text>
                  <Image source={require("../../assets/job-seeker.png")} style={[Styles.width104, Styles.height104, Styles.flexJustifyEnd, Styles.flexRow, Styles.flexAlignEnd, Styles.resizeModeContain, Styles.positionAbsolute, Styles.Bottom_20, Styles.Right_20]} />
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
