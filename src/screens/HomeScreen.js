import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { ScrollView, TouchableNativeFeedback, View } from "react-native";
import { ActivityIndicator, Avatar, Button, Card, Dialog, Headline, Paragraph, Portal, Snackbar, Subheading, Text, Title } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons/faPowerOff";
import { faBarsStaggered } from "@fortawesome/free-solid-svg-icons/faBarsStaggered";
import { Styles } from "../styles/styles";
import { theme } from "../theme/apptheme";
import { createNavigationContainerRef, StackActions, DrawerActions } from "@react-navigation/native";
import Provider from "../api/Provider";
import { ImageSlider } from "react-native-image-slider-banner";
import { communication } from "../utils/communication";

export const navigationRef = createNavigationContainerRef();

const HomeScreen = ({ navigation, roleID }) => {
  const [snackbarText, setSnackbarText] = React.useState("");
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState("");
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const [userFullName, setUserFullName] = React.useState("");
  const [userRoleName, setUserRoleName] = React.useState("");
  const [userCountData, setUserCountData] = React.useState([]);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [roleName, setRoleName] = React.useState("");
  const [userId, setUserID] = React.useState(0);
  const [switchRoleNames, setSwitchRoleNames] = React.useState(false);
  const [errorRole, setErrorRole] = React.useState(false);
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);

  const GetUserDetails = async () => {
    try {
      const value = await AsyncStorage.getItem("user");
      if (value) {
        const parsedUser = JSON.parse(value);
        setUserFullName(parsedUser.FullName);
        setUserRoleName(parsedUser.RoleName);
        setUserName(parsedUser.FullName);
        setUserID(parsedUser.UserID);
      }
    } catch (error) {}
  };

  const LogoutUser = async () => {
    try {
      await AsyncStorage.setItem("isLogin", "false");
      navigationRef.dispatch(StackActions.replace("Login"));
    } catch (error) {
      console.log(error);
    }
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
    GetUserDetails();
    GetUserCount();
  }, []);

  const showDialog = () => setIsDialogVisible(true);

  const hideDialog = () => setIsDialogVisible(false);

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
    try {
      await AsyncStorage.setItem("user", JSON.stringify(user));
      roleID();
    } catch (error) {}
  };

  const UpdateUserRole = () => {
    hideDialog();
    setIsButtonLoading(true);
    const params = {
      UserID: userId,
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
            UserID: userId,
            FullName: userFullName,
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

  return (
    <View style={[Styles.flex1]}>
      <View style={[Styles.width100per, Styles.height64, Styles.primaryBgColor, Styles.borderBottomRadius8, Styles.flexRow, Styles.flexAlignCenter, Styles.paddingHorizontal16]}>
      <TouchableNativeFeedback>
        <View
          style={[Styles.width48, Styles.height48, Styles.flexJustifyCenter, Styles.flexAlignCenter]}
          onTouchStart={() => {
            navigation.dispatch(DrawerActions.toggleDrawer());
          }}
        >
          <FontAwesomeIcon icon={faBarsStaggered} size={24} color={theme.colors.textLight} />
        </View>
      </TouchableNativeFeedback>
        <Avatar.Image size={40} style={[Styles.marginEnd16, Styles.backgroundColor]} source={require("../../assets/defaultIcon.png")} />
        <View style={[Styles.flexColumn, Styles.flexGrow]}>
          <Title style={[Styles.textColorWhite, { marginTop: -4 }]}>{userName}</Title>
          <Text style={[Styles.textTertiaryColor, { marginTop: -4 }]}>{userRoleName}</Text>
        </View>
        <TouchableNativeFeedback>
          <View
            style={[Styles.width48, Styles.height48, Styles.flexJustifyCenter, Styles.flexAlignCenter]}
            onTouchStart={() => {
              LogoutUser();
            }}
          >
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
          {userRoleName === "General User" ? (
            <View>
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
          <Title style={[Styles.padding16, Styles.paddingBottom0]}>Total Users ({totalUsers})</Title>
          <View style={[Styles.flexRow, Styles.padding8, Styles.flexAlignStart, Styles.flexWrap]}>
            {userCountData.map((k, i) => {
              //
              return (
                <View key={i} style={[Styles.width50per, Styles.padding4]}>
                  <Card>
                    <Card.Content>
                      <Subheading>{k.roleName}s</Subheading>
                      <Headline>{k.roleCount}</Headline>
                    </Card.Content>
                  </Card>
                </View>
              );
            })}
          </View>
          <Title style={[Styles.paddingHorizontal16]}>Sliding Gallery</Title>
          <View style={[Styles.padding16, { height: 240 }]}>
            <ImageSlider
              data={[
                { img: "https://www.homepictures.in/wp-content/uploads/2019/10/False-Ceiling-Gypsum-Designs-For-Hall-and-Bedrooms-1.jpg" },
                { img: "https://macj-abuyerschoice.com/wp-content/uploads/2019/10/Blog-Images.jpg" },
                { img: "https://static.wixstatic.com/media/e5df22_7e8607574d1e4d949a1b45e6f7c2d50c~mv2.jpg/v1/fill/w_600,h_358,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/e5df22_7e8607574d1e4d949a1b45e6f7c2d50c~mv2.jpg" },
              ]}
              timer={10000}
              activeIndicatorStyle={{ backgroundColor: theme.colors.primary }}
              autoPlay={true}
              closeIconColor="#fff"
            />
          </View>
        </ScrollView>
      )}
      <Snackbar visible={isSnackbarVisible} onDismiss={() => setIsSnackbarVisible(false)} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default HomeScreen;
