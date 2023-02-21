import React from "react";
import {
  ScrollView,
  TouchableNativeFeedback,
  View,
  Modal,
  Image,
  ImageBackground,
  LogBox,
} from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Caption,
  Card,
  Dialog,
  Paragraph,
  Portal,
  Snackbar,
  Text,
  Title,
  Divider,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Styles } from "../styles/styles";
import { theme } from "../theme/apptheme";
import {
  createNavigationContainerRef,
  StackActions,
} from "@react-navigation/native";
import Provider from "../api/Provider";
import { ImageSlider } from "react-native-image-slider-banner";
import { communication } from "../utils/communication";
import ImageViewer from "react-native-image-zoom-viewer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateSCCards from "../components/SCCards";
import FadeCarousel from "rn-fade-carousel";
import { APIConverter } from "../utils/apiconverter";
import { Hidden } from "@material-ui/core";
import { LinearGradient } from "expo-linear-gradient";
import { TouchableOpacity } from "react-native-gesture-handler";

export const navigationRef = createNavigationContainerRef();
let roleID = 0,
  userID = 0,
  groupRefNo = 0;
var _user_count = null;

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "Material-UI: The `css` function is deprecated. Use the `styleFunctionSx` instead",
]);

const HomeScreen = ({ route, navigation }) => {
  //#region Variables
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState("");
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [userRoleName, setUserRoleName] = React.useState(
    route.params.userDetails[0].RoleName
  );
  const [userRoleID, setUserRoleID] = React.useState("");

  const [imageGalleryData, setImageGalleryData] = React.useState([]);
  const [catalogueCategoryImages, setCatalogueCategoryImages] = React.useState(
    []
  );
  const [catalogueImagesZoom, setCatalogueImagesZoom] = React.useState([]);
  const [catalogueImagesZoomVisible, setCatalogueImagesZoomVisible] =
    React.useState(false);
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
    <Image
      source={require("../../assets/dreamone.jpg")}
      style={Styles.flex1}
      resizeMode="cover"
    />,
    <Image
      source={require("../../assets/dreamtwo.jpg")}
      style={Styles.flex1}
      resizeMode="cover"
    />,
    <Image
      source={require("../../assets/dreamthree.jpg")}
      style={Styles.flex1}
      resizeMode="cover"
    />,
    <Image
      source={require("../../assets/dreamfour.jpg")}
      style={Styles.flex1}
      resizeMode="cover"
    />,
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
    Provider.createDFDashboard(
      Provider.API_URLS.GetdashboardServicecatalogue,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            //response.data.data = APIConverter(response.data.data);
            setImageGalleryData(response.data.data);
          }
        } else {
          setImageGalleryData([]);
          setSnackbarText("No data found");
          setSnackbarColor(theme.colors.error);
          setIsSnackbarVisible(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setIsSnackbarVisible(true);
      });
  };

  const GetServiceCatalogue = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupRefNo,
      },
    };
    Provider.createDFDashboard(
      Provider.API_URLS.GetdashboardServicecatalogue,
      params
    )
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
          setSnackbarText("No data found");
          setIsSnackbarVisible(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        if (e.code === "ECONNABORTED") {
          console.log("Request timed out");
        } else {
          console.log("Error occurred", e);
        }
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

          _user_count = usr_data;
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
    navigation.navigate("ImageGalleryWorkLocationScreen", {
      headerTitle: headerTitle,
      categoryID: categoryID,
      data: data,
      from: "home",
      isContractor: userRoleName === "Contractor" ? true : false,
    });
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
    Provider.createDFDashboard(
      Provider.API_URLS.Getdashboard_Userswitchto_Proceed,
      params
    )
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
            FullName:
              response.data.data.Sess_FName === ""
                ? response.data.data.Sess_Username
                : "",
            RoleID: response.data.data.Sess_group_refno,
            RoleName: response.data.data.Sess_Username,
            Sess_FName: response.data.data.Sess_FName,
            Sess_MobileNo: response.data.data.Sess_MobileNo,
            Sess_Username: response.data.data.Sess_Username,
            Sess_role_refno: response.data.data.Sess_role_refno,
            Sess_group_refno: response.data.data.Sess_group_refno,
            Sess_designation_refno: response.data.data.Sess_designation_refno,
            Sess_locationtype_refno: response.data.data.Sess_locationtype_refno,
            Sess_group_refno_extra_1:
              response.data.data.Sess_group_refno_extra_1,
            Sess_User_All_GroupRefnos:
              response.data.data.Sess_User_All_GroupRefnos,
            Sess_branch_refno: response.data.data.Sess_branch_refno,
            Sess_company_refno: response.data.data.Sess_company_refno,
            Sess_CompanyAdmin_UserRefno:
              response.data.data.Sess_CompanyAdmin_UserRefno,
            Sess_CompanyAdmin_group_refno:
              response.data.data.Sess_CompanyAdmin_group_refno,
            Sess_RegionalOffice_Branch_Refno:
              response.data.data.Sess_RegionalOffice_Branch_Refno,
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
    Provider.createDFDashboard(
      Provider.API_URLS.GetdashboardUserswitchto,
      params
    )
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
    <View style={[Styles.flex1, Styles.backgroundSecondaryLightColor]}>
      <View
        style={[
          Styles.width100per,
          Styles.height64,
          Styles.backgroundColorWhite,
          Styles.flexRow,
          Styles.flexAlignCenter,
          Styles.paddingHorizontal16,
          Styles.BottomShadow,
        ]}
      >
        {/* menu icon */}
        <TouchableNativeFeedback>
          <View
            style={[
              Styles.width48,
              Styles.height48,
              Styles.flexJustifyCenter,
              Styles.flexAlignCenter,
            ]}
            onTouchStart={() => navigation.toggleDrawer()}
          >
            <Icon name="menu" size={24} color={theme.colors.primary} />
          </View>
        </TouchableNativeFeedback>
        {/* menu icon */}

        <Avatar.Image
          size={40}
          style={[
            Styles.marginEnd16,
            Styles.backgroundSecondaryLightColor,
            Styles.borderCD,
            { overflow: "hidden" },
          ]}
          source={require("../../assets/defaultIcon.png")}
        />
        <View style={[Styles.flexColumn, Styles.flexGrow]}>
          <Title style={[Styles.textColorDark, { marginTop: -4 }]}>
            {route.params.userDetails[0].FullName}
          </Title>
          <Text style={[Styles.textColorDarkSecondary, { marginTop: -4 }]}>
            {userRoleName}
          </Text>
        </View>
        <TouchableNativeFeedback>
          <View
            style={[
              Styles.width48,
              Styles.height48,
              Styles.flexJustifyCenter,
              Styles.flexAlignCenter,
            ]}
          >
            <Icon
              name="bell-outline"
              size={24}
              color={theme.colors.iconOutline}
            />
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback>
          <View
            style={[
              Styles.width48,
              Styles.height48,
              Styles.flexJustifyCenter,
              Styles.flexAlignCenter,
            ]}
            onTouchStart={() => LogoutUser()}
          >
            <Icon name="logout" size={24} color={theme.colors.iconOutline} />
          </View>
        </TouchableNativeFeedback>
      </View>
      {isLoading ? (
        <View
          style={[
            Styles.flex1,
            Styles.flexGrow,
            Styles.flexJustifyCenter,
            Styles.flexAlignCenter,
          ]}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <ScrollView>
          {userRoleID === "2" ? (
            <View>
              <View
                style={[
                  Styles.paddingTop16,
                  Styles.paddingHorizontal16,
                  Styles.paddingBottom24,
                ]}
              >
                <Text style={[Styles.HomeTitle]}>Enquiries and Status</Text>
                <View
                  style={[
                    Styles.marginTop16,
                    Styles.flexSpaceBetween,
                    Styles.flexRow,
                  ]}
                >
                  <View
                    style={[
                      Styles.height80,
                      Styles.borderRadius8,
                      Styles.backgroundGreen,
                      Styles.padding14,
                      Styles.boxElevation,
                      { width: 156 },
                    ]}
                  >
                    <Icon
                      name="microsoft-xbox-controller-menu"
                      size={24}
                      color={theme.colors.textLight}
                    />
                    <Text
                      style={[
                        Styles.fontSize16,
                        {
                          color: "#fff",
                          width: "100%",
                          fontWeight: "bold",
                          position: "absolute",
                          bottom: 14,
                          left: 14,
                        },
                      ]}
                    >
                      General Enquiry
                    </Text>
                  </View>
                  <View
                    style={[
                      Styles.height80,
                      Styles.borderRadius8,
                      Styles.backgroundGreen,
                      Styles.padding14,
                      Styles.boxElevation,
                      { width: 156 },
                    ]}
                  >
                    <Icon
                      name="clipboard-list"
                      size={24}
                      color={theme.colors.textLight}
                    />
                    <Text
                      style={[
                        Styles.fontSize16,
                        {
                          color: "#fff",
                          width: "100%",
                          fontWeight: "bold",
                          position: "absolute",
                          bottom: 14,
                          left: 14,
                        },
                      ]}
                    >
                      BOQ Enquiry
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={[
                  Styles.width100per,
                  Styles.boxTopElevation,
                  Styles.borderTopRadius24,
                  Styles.paddingTop12,
                  Styles.paddingBottom16,
                ]}
              >
                <View style={[Styles.paddingHorizontal16]}>
                  <View
                    style={[
                      Styles.horizontalArrowLineBG,
                      Styles.flexAlignSelfCenter,
                      Styles.borderRadius16,
                      Styles.marginBottom16,
                      { width: "20%", height: 6 },
                    ]}
                  ></View>
                  <View>
                    <Text style={[Styles.HomeTitle]}>Users</Text>
                  </View>
                  <View style={[Styles.paddingTop16]}>
                    <View
                      style={[
                        Styles.borderRadius8,
                        Styles.homeBox,
                        Styles.paddingHorizontal12,
                        Styles.paddingVertical8,
                        Styles.flexRow,
                        Styles.flexAlignCenter,
                        { height: 92 },
                      ]}
                    >
                      <View style={[Styles.width70]}>
                        <Text style={[Styles.userCount]}>
                          {_user_count != null ? _user_count[2].roleCount : "0"}
                        </Text>
                        <Text
                          style={[Styles.userCountLabel, Styles.marginTop4]}
                        >
                          {_user_count != null ? _user_count[2].roleName : ""}
                        </Text>
                      </View>
                      <View style={[Styles.userCountDevider]}></View>
                      <View style={[Styles.width70]}>
                        <Text style={[Styles.userCount]}>
                          {_user_count != null ? _user_count[1].roleCount : "0"}
                        </Text>
                        <Text
                          style={[Styles.userCountLabel, Styles.marginTop4]}
                        >
                          {_user_count != null ? _user_count[1].roleName : ""}
                        </Text>
                      </View>
                      <View style={[Styles.userCountDevider]}></View>
                      <View style={[Styles.width70]}>
                        <Text style={[Styles.userCount]}>
                          {_user_count != null ? _user_count[0].roleCount : "0"}
                        </Text>
                        <Text
                          style={[Styles.userCountLabel, Styles.marginTop4]}
                        >
                          {_user_count != null ? _user_count[0].roleName : ""}
                        </Text>
                      </View>
                      <View style={[Styles.userCountDevider]}></View>
                      <View style={[Styles.width70]}>
                        <Text style={[Styles.userCount]}>
                          {_user_count != null ? _user_count[3].roleCount : "0"}
                        </Text>
                        <Text
                          style={[Styles.userCountLabel, Styles.marginTop4]}
                        >
                          {_user_count != null ? _user_count[3].roleName : ""}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        Styles.marginTop16,
                        Styles.flexRow,
                        Styles.flexSpaceBetween,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("ApprovedUserScreen", {
                            type: "add",
                          });
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          Styles.homeBox,
                          { width: 100, height: 56 },
                        ]}
                      >
                        <Icon
                          name="check-decagram"
                          size={22}
                          color={theme.colors.success}
                        />
                        <Text style={[Styles.buttonIconLabel]}>Approved ></Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("PendingUserScreen", {
                            type: "add",
                          });
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          Styles.homeBox,
                          { width: 100, height: 56 },
                        ]}
                      >
                        <Icon
                          name="clock-alert"
                          size={22}
                          color={theme.colors.pendingIcon}
                        />
                        <Text style={[Styles.buttonIconLabel]}>Pending ></Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("DeclinedUserScreen", {
                            type: "add",
                          });
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          Styles.homeBox,
                          { width: 100, height: 56 },
                        ]}
                      >
                        <Icon
                          name="close-circle"
                          size={22}
                          color={theme.colors.error}
                        />
                        <Text style={[Styles.buttonIconLabel]}>Decline ></Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[Styles.paddingTop16]}>
                    <Text style={[Styles.HomeTitle]}>Service Catlogue</Text>
                    <View
                      style={[
                        Styles.marginTop16,
                        Styles.flexRow,
                        Styles.flexSpaceBetween,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("WorkFloorScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 100, height: 72 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.serviceCatelogueIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>Work Floor</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("WorkLocationScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 100, height: 72 },
                        ]}
                      >
                        <Icon
                          name="map-marker-radius"
                          size={22}
                          color={theme.colors.serviceCatelogueIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>
                          Work Location
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("DesignTypeScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 100, height: 72 },
                        ]}
                      >
                        <Icon
                          name="drawing-box"
                          size={22}
                          color={theme.colors.serviceCatelogueIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>
                          Design Type
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={[
                        Styles.marginTop16,
                        Styles.flexRow,
                        Styles.flexSpaceBetween,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("MaterialSetupScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 156, height: 72 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.serviceCatelogueIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>
                          Materials Setup
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("PostNewDesignScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 156, height: 72 },
                        ]}
                      >
                        <Icon
                          name="home-city"
                          size={22}
                          color={theme.colors.serviceCatelogueIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>
                          Post New Design
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[Styles.paddingTop16]}>
                    <Text style={[Styles.HomeTitle]}>Masters</Text>
                    <View
                      style={[
                        Styles.marginTop16,
                        Styles.flexRow,
                        Styles.flexSpaceBetween,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("ActivityRolesScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 100, height: 72 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.masterIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>Activity</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("ServicesScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 100, height: 72 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.masterIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>Service</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("UnitOfSalesScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 100, height: 72 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.masterIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>
                          Unit of Sales
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={[
                        Styles.marginTop16,
                        Styles.flexRow,
                        Styles.flexSpaceBetween,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("CategoryScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 100, height: 72 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.masterIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>Category</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("ProductScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 100, height: 72 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.masterIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>Product</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("ServiceProductScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 100, height: 72 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.masterIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>
                          Service Product
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={[
                        Styles.marginTop16,
                        Styles.flexRow,
                        Styles.flexSpaceBetween,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("DepartmentScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 100, height: 72 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.masterIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>Department</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("LocationTypeScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 100, height: 72 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.masterIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>
                          Location Type
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("DesignationScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 100, height: 72 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.masterIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>
                          Designation
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View
                      style={[
                        Styles.marginTop16,
                        Styles.flexRow,
                        Styles.flexSpaceBetween,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("EWayBillScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          { width: 100, height: 72 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.masterIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>E-Way Bill</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[Styles.paddingTop16]}>
                    <Text style={[Styles.HomeTitle]}>
                      Production Unit Master
                    </Text>
                    <View
                      style={[
                        Styles.marginTop16,
                        Styles.flexRow,
                        Styles.flexSpaceBetween,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("ABrandConversationValue");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          Styles.paddingHorizontal12,
                          { width: 100, height: 108 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.productionIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>
                          Brand Conversion Value
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("WidthOfGpCoil");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          Styles.paddingHorizontal12,
                          { width: 100, height: 108 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.productionIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>
                          Width of GP Coil
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("MassOfZincCoating");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          Styles.paddingHorizontal12,
                          { width: 100, height: 108 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.productionIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>
                          Mass of zinc coting
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[Styles.paddingTop16]}>
                    <Text style={[Styles.HomeTitle]}>Pocket Dairy</Text>
                    <View style={[Styles.marginTop16, Styles.flexRow]}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("CategoryNameScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          Styles.paddingHorizontal12,
                          { width: 100, height: 72 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.pocketDiaryIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>Category</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("SubCategoryNameScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          Styles.paddingHorizontal12,
                          { width: 100, height: 72, marginLeft: 16 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.pocketDiaryIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>
                          Sub-Category
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View
                    style={[
                      Styles.paddingTop12,
                      Styles.marginTop24,
                      Styles.padding16,
                      Styles.width100per,
                      Styles.borderRadius8,
                      Styles.jobBG,
                      { height: 110, elevation: 5 },
                    ]}
                  >
                    <View style={[Styles.width100per, Styles.marginTop4]}>
                      <Text style={[Styles.fontSize20, { color: "#FAFAFA" }]}>
                        Job Updates
                      </Text>
                    </View>
                    <View
                      style={[
                        Styles.width100per,
                        Styles.flexRow,
                        Styles.flexSpaceBetween,
                        Styles.marginTop12,
                      ]}
                    >
                      <Button
                        mode="contained-tonal"
                        style={[
                          Styles.whiteColor,
                          {
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            buttonColor: "#FFF",
                          },
                        ]}
                      >
                        Employer
                      </Button>
                      <Button
                        mode="contained-tonal"
                        style={[
                          {
                            backgroundColor: "rgba(255, 255, 255, 0.7)",
                            buttonColor: "#FFF",
                          },
                        ]}
                      >
                        Employee
                      </Button>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View>
              {/* Estimation Start */}
              <View
                style={[
                  Styles.flexRow,
                  Styles.paddingHorizontal16,
                  Styles.flexWrap,
                ]}
              >
                {imageGalleryData.map((k, i) => {
                  return (
                    <View
                      key={i}
                      style={[
                        Styles.width50per,
                        Styles.padding4,
                        Styles.paddingTop0,
                      ]}
                    >
                      <CreateSCCards
                        key={i}
                        image={k.design_image_url}
                        title={k.service_name}
                        id={k.service_refno}
                        subttitle={k.designtype_name}
                        data={k}
                        cardClick={SingleCardClick}
                      />
                    </View>
                  );
                })}
              </View>
              {/* Estimation End */}
              <View style={[Styles.padding16]}>
                <Text
                  style={[
                    Styles.fontSize18,
                    { color: "green", width: "100%" },
                    Styles.paddingBottom12,
                  ]}
                >
                  SLIDING GALLERY
                </Text>
                <Divider />
              </View>

              <View
                style={[
                  Styles.margin16,
                  Styles.marginTop0,
                  Styles.border1,
                  Styles.borderRadius8,
                  Styles.OverFlow,
                  { height: 180 },
                ]}
              >
                <ImageSlider
                  data={catalogueImages}
                  timer={10000}
                  activeIndicatorStyle={{
                    backgroundColor: theme.colors.primary,
                  }}
                  autoPlay={true}
                  onClick={() => setCatalogueImagesZoomVisible(true)}
                  style={Styles.borderRadius16}
                />
              </View>

              <View
                style={[
                  Styles.margin4,
                  Styles.height96,
                  Styles.border1,
                  { position: "relative" },
                ]}
              >
                <Image
                  source={{
                    uri: "https://www.wordstream.com/wp-content/uploads/2021/07/banner-ads-examples-ncino.jpg",
                  }}
                  style={{ width: "100%", height: "100%" }}
                />
                <Caption
                  style={[
                    {
                      position: "absolute",
                      bottom: 4,
                      right: 4,
                      color: theme.colors.textLight,
                    },
                  ]}
                >
                  Sponsered Ads
                </Caption>
              </View>

              {userRoleID === "3" ? (
                <View style={[Styles.padding16]}>
                  <View
                    style={[
                      Styles.bordergray,
                      Styles.bordergray,
                      Styles.borderRadius8,
                      Styles.paddingBottom8,
                    ]}
                  >
                    <Title style={[Styles.padding16, Styles.paddingBottom0]}>
                      Switch Role
                    </Title>
                    <View style={[Styles.paddingHorizontal16]}>
                      <Dropdown
                        label="SELECT"
                        data={switchRoleNames}
                        onSelected={onRoleSelected}
                        isError={errorRole}
                        selectedItem={roleName}
                      />
                      <Button
                        mode="contained"
                        style={[Styles.marginTop12]}
                        loading={isButtonLoading}
                        disabled={isButtonLoading}
                        onPress={ValidateSwitchRole}
                      >
                        Switch
                      </Button>
                    </View>
                    <Portal>
                      <Dialog visible={isDialogVisible} onDismiss={hideDialog}>
                        <Dialog.Title>Confirmation</Dialog.Title>
                        <Dialog.Content>
                          <Paragraph>
                            Do you really want to switch your role to {roleName}
                            ? If OK, then your active role will get
                            automatically changed
                          </Paragraph>
                        </Dialog.Content>
                        <Dialog.Actions>
                          <Button onPress={UpdateUserRole}>Ok</Button>
                          <Button onPress={hideDialog}>Cancel</Button>
                        </Dialog.Actions>
                      </Dialog>
                    </Portal>
                  </View>
                </View>
              ) : null}

              <View
                style={[
                  Styles.width100per,
                  Styles.padding16,
                  Styles.positionRelative,
                ]}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate("DesignYourDreamScreen")}
                >
                  <View
                    style={[
                      Styles.flex1,
                      Styles.width100per,
                      Styles.height250,
                      Styles.borderRadius8,
                      Styles.OverFlow,
                    ]}
                  >
                    <FadeCarousel
                      elements={slidesTwo}
                      containerStyle={[
                        Styles.flex1,
                        Styles.flexAlignCenter,
                        Styles.flexJustifyCenter,
                      ]}
                      fadeDuration={2000}
                      stillDuration={2000}
                      start={true}
                    />
                    <View
                      style={[
                        Styles.width100per,
                        Styles.height40,
                        {
                          backgroundColor: "rgba(0,0,0,0.4)",
                          position: "absolute",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          Styles.marginTop8,
                          Styles.marginStart16,
                          Styles.fontSize18,
                          Styles.textColorWhite,
                          Styles.fontBold,
                        ]}
                      >
                        Design your Dream
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
                {/* Material Calculator */}
                <TouchableOpacity
                  onPress={() => {
                    if (roleID == 2) {
                      navigation.navigate("MaterialSetupScreen", {
                        type: "add",
                      });
                    } else {
                      navigation.navigate("MaterialCalculatorScreen", {
                        type: "add",
                      });
                    }
                  }}
                  style={[
                    Styles.width100per,
                    Styles.height150,
                    Styles.flexRow,
                    Styles.marginTop16,
                    Styles.borderRadius8,
                    { elevation: 4 },
                  ]}
                >
                  <ImageBackground
                    source={require("../../assets/material-calculator-with-element-bg.jpg")}
                    resizeMode="cover"
                    style={[{ flex: 1, justifyContent: "center" }]}
                    imageStyle={{ borderRadius: 8 }}
                  >
                    <Text
                      style={[
                        Styles.positionAbsolute,
                        Styles.marginTop8,
                        Styles.marginStart16,
                        Styles.fontSize18,
                        Styles.textColorWhite,
                        Styles.fontBold,
                        { top: 8 },
                      ]}
                    >
                      Material Calculator
                    </Text>
                  </ImageBackground>
                </TouchableOpacity>
                {/* Material Calculator */}
                <View style={[Styles.paddingTop16]}>
                  <View
                    style={[
                      Styles.bordergray,
                      Styles.padding16,
                      Styles.borderRadius8,
                    ]}
                  >
                    <Text style={[Styles.HomeTitle]}>Enquiry & Estimation</Text>
                    <View
                      style={[
                        Styles.marginTop16,
                        Styles.flexRow,
                        Styles.flexSpaceBetween,
                      ]}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("ImageGalleryScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          Styles.paddingHorizontal12,
                          { width: 140, height: 72 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.productionIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>
                          Image Gallery
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("YourEstimationsScreen");
                        }}
                        style={[
                          Styles.borderRadius8,
                          Styles.homeBox,
                          Styles.flexColumn,
                          Styles.flexJustifyCenter,
                          Styles.flexAlignCenter,
                          Styles.paddingHorizontal12,
                          { width: 140, height: 72, marginLeft: 16 },
                        ]}
                      >
                        <Icon
                          name="archive-arrow-down"
                          size={22}
                          color={theme.colors.productionIcons}
                        />
                        <Text style={[Styles.buttonIconLabel]}>
                          Your Estimations
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {/* Pocket Diary */}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("PocketDiary", { type: "add" });
                  }}
                  style={[
                    Styles.width100per,
                    Styles.height150,
                    Styles.flexRow,
                    Styles.marginTop16,
                    Styles.borderRadius8,
                    { elevation: 4 },
                  ]}
                >
                  <ImageBackground
                    source={require("../../assets/pocket-diary-bg.png")}
                    resizeMode="cover"
                    style={[{ flex: 1, justifyContent: "center" }]}
                    imageStyle={{ borderRadius: 8 }}
                  >
                    <Text
                      style={[
                        Styles.positionAbsolute,
                        Styles.marginTop8,
                        Styles.marginStart16,
                        Styles.fontSize18,
                        Styles.textColorWhite,
                        Styles.fontBold,
                        { top: 8 },
                      ]}
                    >
                      Pocket Diary
                    </Text>
                  </ImageBackground>
                </TouchableOpacity>
                {/* Pocket Diary */}

                {/* Looking For Jobs */}
                <View
                  style={[
                    Styles.width100per,
                    Styles.height150,
                    Styles.flexRow,
                    Styles.marginTop16,
                    Styles.borderRadius8,
                    { elevation: 4 },
                  ]}
                >
                  <ImageBackground
                    source={require("../../assets/jobs-bg.jpg")}
                    resizeMode="cover"
                    style={[{ flex: 1, justifyContent: "center" }]}
                    imageStyle={{ borderRadius: 8 }}
                  >
                    <Text
                      style={[
                        Styles.positionAbsolute,
                        Styles.marginTop8,
                        Styles.marginStart16,
                        Styles.fontSize18,
                        Styles.textColorWhite,
                        Styles.fontBold,
                        { top: 8 },
                      ]}
                    >
                      Looking For Jobs ?
                    </Text>
                  </ImageBackground>
                </View>
                {/* Looking For Jobs */}

                {/* <View style={[Styles.width100per, Styles.flexRow, Styles.marginTop16]}>
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
                      <Image source={require("../../assets/material-calculator.png")} style={[Styles.width96, Styles.height96, Styles.flexJustifyEnd, Styles.flexRow, Styles.flexAlignEnd, Styles.resizeModeContain, Styles.positionAbsolute, Styles.Bottom_20, Styles.Right_20]} />
                    </Card>
                    <Card style={[Styles.height120, Styles.width100per, Styles.marginTop8, Styles.borderRadius8, Styles.border1, Styles.marginStart4, Styles.positionRelative, Styles.OverFlow, { backgroundColor: "#D4a311" }]}>
                      <Text style={[Styles.fontSize16, Styles.fontBold, Styles.marginTop12, Styles.marginStart12, Styles.textColorWhite]}>Looking For Job</Text>
                      <Image source={require("../../assets/job-seeker.png")} style={[Styles.width104, Styles.height104, Styles.flexJustifyEnd, Styles.flexRow, Styles.flexAlignEnd, Styles.resizeModeContain, Styles.positionAbsolute, Styles.Bottom_20, Styles.Right_20]} />
                    </Card>
                  </View>
                </View> */}
              </View>
            </View>
          )}
        </ScrollView>
      )}
      <Snackbar
        visible={isSnackbarVisible}
        onDismiss={() => setIsSnackbarVisible(false)}
        style={{ backgroundColor: theme.colors.error }}
      >
        {snackbarText}
      </Snackbar>
      <Modal
        visible={catalogueImagesZoomVisible}
        onRequestClose={() => setCatalogueImagesZoomVisible(false)}
        transparent={true}
      >
        <View
          style={[
            Styles.flex1,
            { backgroundColor: "rgba(0,0,0,0.85)", position: "relative" },
          ]}
        >
          <Button
            mode="contained"
            style={{ position: "absolute", bottom: 16, zIndex: 20, right: 16 }}
            onPress={() => {}}
          >
            View
          </Button>
          <Button
            mode="outlined"
            style={{
              position: "absolute",
              bottom: 16,
              zIndex: 20,
              right: 104,
              backgroundColor: "white",
            }}
            onPress={() => setCatalogueImagesZoomVisible(false)}
          >
            Close one
          </Button>
          <ImageViewer
            imageUrls={catalogueImagesZoom}
            backgroundColor="transparent"
            style={{ height: 1920 }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
