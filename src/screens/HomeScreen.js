import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { ScrollView, TouchableNativeFeedback, View } from "react-native";
import { ActivityIndicator, Avatar, Button, Card, Headline, Subheading, Text, Title } from "react-native-paper";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons/faPowerOff";
import { Styles } from "../styles/styles";
import { theme } from "../theme/apptheme";
import { createNavigationContainerRef, StackActions } from "@react-navigation/native";
import Provider from "../api/Provider";
import { ImageSlider } from "react-native-image-slider-banner";

export const navigationRef = createNavigationContainerRef();

const HomeScreen = () => {
  const [userName, setUserName] = React.useState("");
  const [roleID, setRoleID] = React.useState("");
  const [userCountData, setUserCountData] = React.useState([]);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [roleName, setRoleName] = React.useState("");
  const GetUserDetails = async () => {
    try {
      const value = await AsyncStorage.getItem("user");
      if (value) {
        switch (JSON.parse(value).RoleID) {
          case 1:
            setRoleID("Admin");
            break;
          case 2:
            setRoleID("General User");
            break;
        }
        setUserName(JSON.parse(value).FullName);
      }
    } catch (error) {}
  };
  GetUserDetails();
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
          if (response.data.data[0].generalUsers === null) {
            response.data.data[0].generalUsers = 0;
          }
          if (response.data.data[0].dealers === null) {
            response.data.data[0].dealers = 0;
          }
          if (response.data.data[0].contractors === null) {
            response.data.data[0].contractors = 0;
          }
          if (response.data.data[0].architects === null) {
            response.data.data[0].architects = 0;
          }
          setTotalUsers(response.data.data[0].generalUsers + response.data.data[0].dealers + response.data.data[0].contractors + response.data.data[0].architects);
          setUserCountData(response.data.data);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };
  React.useEffect(() => {
    GetUserCount();
  }, []);
  const onRoleSelected = (role) => {
    setRoleName(role);
  };

  return (
    <View style={[Styles.flex1]}>
      <View style={[Styles.width100per, Styles.height64, Styles.primaryBgColor, Styles.borderBottomRadius8, Styles.flexRow, Styles.flexAlignCenter, Styles.paddingHorizontal16]}>
        <Avatar.Image size={40} style={[Styles.marginEnd16, Styles.backgroundColor]} source={require("../../assets/defaultIcon.png")} />
        <View style={[Styles.flexColumn, Styles.flexGrow]}>
          <Title style={[Styles.textColorWhite, { marginTop: -4 }]}>{userName}</Title>
          <Text style={[Styles.textTertiaryColor, { marginTop: -4 }]}>{roleID}</Text>
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
          {roleID === "General User" ? (
            <View>
              <Title style={[Styles.padding16, Styles.paddingBottom0]}>Switch Role</Title>
              <View style={[Styles.paddingHorizontal16]}>
                <Dropdown label="SELECT" data={["Dealer", "Contractor", "Architect"]} onSelected={onRoleSelected} selectedItem={roleName} />
                <Button mode="contained" style={[Styles.marginTop12]}>
                  Switch
                </Button>
              </View>
            </View>
          ) : null}
          <Title style={[Styles.padding16, Styles.paddingBottom0]}>Total Users ({totalUsers})</Title>
          <View style={[Styles.flexRow, Styles.padding8, Styles.flexAlignStart, Styles.flexWrap]}>
            <View style={[Styles.width50per, Styles.padding4]}>
              <Card>
                <Card.Content>
                  <Subheading>Dealers</Subheading>
                  <Headline>{userCountData[0].dealers}</Headline>
                </Card.Content>
              </Card>
            </View>
            <View style={[Styles.width50per, Styles.padding4]}>
              <Card>
                <Card.Content>
                  <Subheading>Contractors</Subheading>
                  <Headline>{userCountData[0].contractors}</Headline>
                </Card.Content>
              </Card>
            </View>
            <View style={[Styles.width50per, Styles.padding4]}>
              <Card>
                <Card.Content>
                  <Subheading>General Users</Subheading>
                  <Headline>{userCountData[0].generalUsers}</Headline>
                </Card.Content>
              </Card>
            </View>
            <View style={[Styles.width50per, Styles.padding4]}>
              <Card>
                <Card.Content>
                  <Subheading>Architects</Subheading>
                  <Headline>{userCountData[0].architects}</Headline>
                </Card.Content>
              </Card>
            </View>
          </View>
          <Title style={[Styles.paddingHorizontal16]}>Image Gallery</Title>
          <View style={[Styles.padding16, { height: 240 }]}>
            <ImageSlider data={[{ img: "https://www.homepictures.in/wp-content/uploads/2019/10/False-Ceiling-Gypsum-Designs-For-Hall-and-Bedrooms-1.jpg" }, { img: "https://macj-abuyerschoice.com/wp-content/uploads/2019/10/Blog-Images.jpg" }, { img: "https://static.wixstatic.com/media/e5df22_7e8607574d1e4d949a1b45e6f7c2d50c~mv2.jpg/v1/fill/w_600,h_358,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/e5df22_7e8607574d1e4d949a1b45e6f7c2d50c~mv2.jpg" }]} timer={10000} activeIndicatorStyle={{ backgroundColor: theme.colors.primary }} autoPlay={true} closeIconColor="#fff" />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;
