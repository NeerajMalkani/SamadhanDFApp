import "./src/components/ignoreWarnings";
import { Provider as PaperProvider, Text, BottomNavigation, List } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "./src/theme/apptheme";
import { Styles } from "./src/styles/styles";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LogBox, SafeAreaView, Platform, StatusBar, LayoutAnimation, View } from "react-native";
import { MenuItemsAdmin, MenuItemsContractor, MenuItemsDealer, MenuItemsGeneralUser } from "./src/json/MenuItems";
import ActivityRolesScreen from "./src/screens/Admin/Master/ActivityRolesScreen";
import ServicesScreen from "./src/screens/Admin/Master/ServicesScreen";
import UnitOfSalesScreen from "./src/screens/Admin/Master/UnitOfSalesScreen";
import AddActivityRolesScreen from "./src/screens/Admin/Master/AddItems/AddActivityRolesScreen";
import AddServicesScreen from "./src/screens/Admin/Master/AddItems/AddServicesScreen";
import AddUnitOfSalesScreen from "./src/screens/Admin/Master/AddItems/AddUnitOfSalesScreen";
import CategoryScreen from "./src/screens/Admin/Master/CategoryScreen";
import AddCategoryScreen from "./src/screens/Admin/Master/AddItems/AddCategoryScreen";
import ImageGalleryScreen from "./src/screens/GeneralUser/BrandAndProducts/ImageGalleryScreen";
import YourEstimationsScreen from "./src/screens/GeneralUser/BrandAndProducts/YourEstimationsScreen";
import React, { useEffect } from "react";
import LoginScreen from "./src/screens/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignupScreen from "./src/screens/SignupScreen";
import ForgotPassword from "./src/screens/ForgotPassword";
import react from "react";
import HomeScreen, { navigationRef } from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/UserProfile";
import { useStateIfMounted } from "use-state-if-mounted";
import BasicDetailsDealerScreen from "./src/screens/Dealer/CompanyProfile/BasicDetailsScreen";
import MyServicesDealerScreen from "./src/screens/Dealer/CompanyProfile/MyServicesScreen";
import BasicDetailsContractorScreen from "./src/screens/Contractor/CompanyProfile/BasicDetailsScreen";
import MyServicesContractorScreen from "./src/screens/Contractor/CompanyProfile/MyServicesScreen";
import AddProductScreen from "./src/screens/Admin/Master/AddItems/AddProductScreen";
import ProductScreen from "./src/screens/Admin/Master/ProductScreen";
import DepartmentScreen from "./src/screens/Admin/Master/DepartmentScreen";
import AddDepartmentScreen from "./src/screens/Admin/Master/AddItems/AddDepartmentScreen";
import AddDesignationScreen from "./src/screens/Admin/Master/AddItems/AddDesignationScreen";
import DesignationScreen from "./src/screens/Admin/Master/DesignationScreen";
import ServiceProductScreen from "./src/screens/Admin/Master/ServiceProductScreen";
import AddServiceProductScreen from "./src/screens/Admin/Master/AddItems/AddServiceProductScreen";
import EWayBillScreen from "./src/screens/Admin/Master/EWayBillScreen";
import AddEWayBillScreen from "./src/screens/Admin/Master/AddItems/AddEWayBillScreen";
import LocationTypeScreen from "./src/screens/Admin/Master/LocationTypeScreen";
import AddLocationTypeScreen from "./src/screens/Admin/Master/AddItems/AddLocationTypeScreen";
import WorkFloorScreen from "./src/screens/Admin/ServiceCatalogue/WorkFloorScreen";
import AddWorkFloorScreen from "./src/screens/Admin/ServiceCatalogue/AddItems/AddWorkFloorScreen";
import WorkLocationScreen from "./src/screens/Admin/ServiceCatalogue/WorkLocationScreen";
import AddWorkLocationScreen from "./src/screens/Admin/ServiceCatalogue/AddItems/AddWorkLocationScreen";
import DesignTypeScreen from "./src/screens/Admin/ServiceCatalogue/DesignTypeScreen";
import AddDesignTypeScreen from "./src/screens/Admin/ServiceCatalogue/AddItems/AddDesignTypeScreen";
import PostNewDesignScreen from "./src/screens/Admin/ServiceCatalogue/PostNewDesignScreen";
import AddPostNewDesignScreen from "./src/screens/Admin/ServiceCatalogue/AddItems/AddPostNewDesignScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

LogBox.ignoreLogs(["Can't perform a React state update on an unmounted component", "The action 'CLOSE_DRAWER' was not handled by any navigator."]);

export default function App() {
  const roleID = React.useState(0);
  const [userDetails, setUserDetails] = React.useState("");
  const [isLoggedIn, setIsLoggedIn] = useStateIfMounted(0);

  let menuItems = [];

  useEffect(() => {
    let isMounted = true;
    AsyncStorage.getItem("isLogin").then((value) => {
      if (isMounted) {
        if (value !== null && value === "true") {
          setIsLoggedIn(1);
        } else {
          setIsLoggedIn(2);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [isLoggedIn]);

  const GetRoleID = async () => {
    try {
      const value = await AsyncStorage.getItem("user");
      if (value) {
        //setUserDetails(JSON.parse(value));
        switch (JSON.parse(value).RoleID) {
          case 1:
            menuItems = [...MenuItemsAdmin];
            break;
          case 2:
            menuItems = [...MenuItemsGeneralUser];
            break;
          case 3:
            menuItems = [...MenuItemsContractor];
            break;
          case 4:
            menuItems = [...MenuItemsDealer];
            break;
        }
        roleID[1](JSON.parse(value).RoleID);
      }
    } catch (error) {}
  };
  useEffect(() => {
    GetRoleID();
  }, [roleID[0]]);

  let activeIndex = -1;
  const DrawerContent = (props) => {
    const [expanded1, setExpanded1] = React.useState(false);
    const [expanded2, setExpanded2] = React.useState(false);
    const [expanded3, setExpanded3] = React.useState(false);
    const [expanded4, setExpanded4] = React.useState(false);
    const [expanded5, setExpanded5] = React.useState(false);

    return (
      <DrawerContentScrollView {...props}>
        <DrawerItem
          key="Home"
          focused={activeIndex === -1 ? true : false}
          style={[Styles.borderBottom1]}
          activeBackgroundColor={theme.colors.primary}
          inactiveBackgroundColor={theme.colors.textLight}
          label={({ focused }) => {
            return <Text style={[Styles.textColor, Styles.fontSize16, { color: focused ? theme.colors.textLight : theme.colors.text }]}>Dashboard</Text>;
          }}
          icon={({ focused }) => <Icon color={focused ? theme.colors.textLight : theme.colors.textSecondary} size={24} name="view-dashboard" />}
          onPress={(e) => {
            activeIndex = -1;
            props.navigation.navigate("HomeScreen");
          }}
        />
        {menuItems.map((k, i) => {
          return k.roleID === roleID[0] ? (
            k.type === "item" ? (
              <DrawerItem
                key={i}
                focused={activeIndex === parseInt(i) ? true : false}
                style={[Styles.borderBottom1]}
                label={({ focused }) => {
                  return <Text style={[Styles.textColor, Styles.fontSize16, { color: focused ? theme.colors.primary : theme.colors.text }]}>{k.title}</Text>;
                }}
                icon={({ focused }) => <Icon color={focused ? theme.colors.primary : theme.colors.textSecondary} size={24} name={k.icon} />}
                onPress={(e) => {
                  if (k.navigation !== undefined) {
                    activeIndex = parseInt(i);
                    props.navigation.navigate(k.navigation);
                  }
                }}
              />
            ) : (
              <List.Accordion
                key={i}
                title={k.title}
                expanded={i == 0 ? expanded1 : i == 1 ? expanded2 : i == 2 ? expanded3 : i == 3 ? expanded4 : expanded5}
                left={(props) => <List.Icon {...props} icon={k.icon} />}
                style={[Styles.backgroundColor, Styles.borderBottom1, Styles.height56, { paddingTop: -8 }]}
                onPress={() => {
                  LayoutAnimation.easeInEaseOut();
                  switch (i) {
                    case 0:
                      setExpanded1(!expanded1);
                      setExpanded2(false);
                      setExpanded3(false);
                      setExpanded4(false);
                      setExpanded5(false);
                      break;
                    case 1:
                      setExpanded2(!expanded2);
                      setExpanded1(false);
                      setExpanded3(false);
                      setExpanded4(false);
                      setExpanded5(false);
                      break;
                    case 2:
                      setExpanded3(!expanded3);
                      setExpanded2(false);
                      setExpanded1(false);
                      setExpanded4(false);
                      setExpanded5(false);
                      break;
                    case 3:
                      setExpanded4(!expanded4);
                      setExpanded2(false);
                      setExpanded3(false);
                      setExpanded1(false);
                      setExpanded5(false);
                      break;
                    case 4:
                      setExpanded5(!expanded5);
                      setExpanded2(false);
                      setExpanded3(false);
                      setExpanded4(false);
                      setExpanded1(false);
                      break;
                  }
                }}
              >
                {k.items.map((j, l) => {
                  return (
                    <DrawerItem
                      key={l}
                      style={{ marginVertical: 0, paddingStart: 16, width: "100%", marginLeft: 0, borderRadius: 0, borderBottomColor: theme.colors.textLightSecondary, borderBottomWidth: 1 }}
                      focused={activeIndex === parseInt(i.toString() + l.toString()) ? true : false}
                      label={({ focused }) => <Text style={[Styles.textColor, Styles.fontSize16, { color: focused ? theme.colors.textLight : theme.colors.text }]}>{j.title}</Text>}
                      activeBackgroundColor={theme.colors.primary}
                      inactiveBackgroundColor={theme.colors.backgroundSecondary}
                      onPress={(e) => {
                        if (j.navigation !== undefined) {
                          activeIndex = parseInt(i.toString() + l.toString());
                          props.navigation.navigate(j.navigation);
                        }
                      }}
                    />
                  );
                })}
              </List.Accordion>
            )
          ) : null;
        })}
      </DrawerContentScrollView>
    );
  };

  const DrawerNavigator = () => {
    switch (roleID[0]) {
      case 0:
        return (
          <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="HomeScreen">
            <Drawer.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} initialParams={{ roleID: { GetRoleID }, userDetails: {userDetails} }} />
          </Drawer.Navigator>
        );
        break;
      case 1:
        return (
          <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="HomeScreen">
            <Drawer.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} initialParams={{ roleID: { GetRoleID }, userDetails: {userDetails} }} />
            <Drawer.Screen options={{ headerShown: false }} name="ActivityRolesScreen" component={ActivityRolesScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="ServicesScreen" component={ServicesScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="UnitOfSalesScreen" component={UnitOfSalesScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="CategoryScreen" component={CategoryScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="ProductScreen" component={ProductScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="DepartmentScreen" component={DepartmentScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="LocationTypeScreen" component={LocationTypeScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="DesignationScreen" component={DesignationScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="ServiceProductScreen" component={ServiceProductScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="EWayBillScreen" component={EWayBillScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="WorkFloorScreen" component={WorkFloorScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="WorkLocationScreen" component={WorkLocationScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="DesignTypeScreen" component={DesignTypeScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="PostNewDesignScreen" component={PostNewDesignScreen} />
          </Drawer.Navigator>
        );
      case 2:
        return (
          <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="HomeScreen">
            <Drawer.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} initialParams={{ roleID: { GetRoleID }, userDetails: {userDetails} }} />
            <Drawer.Screen options={{ headerShown: false }} name="ImageGalleryScreen" component={ImageGalleryScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="YourEstimationsScreen" component={YourEstimationsScreen} />
          </Drawer.Navigator>
        );
      case 4:
        return (
          <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="HomeScreen">
            <Drawer.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} initialParams={{ roleID: { GetRoleID }, userDetails: {userDetails} }} />
            <Drawer.Screen options={{ headerShown: false }} name="BasicDetailsDealerScreen" component={BasicDetailsDealerScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="MyServicesDealerScreen" component={MyServicesDealerScreen} />
          </Drawer.Navigator>
        );
      case 3:
        return (
          <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="BasicDetailsContractorScreen">
            <Drawer.Screen options={{ headerShown: false }} name="BasicDetailsContractorScreen" component={BasicDetailsContractorScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="MyServicesContractorScreen" component={MyServicesContractorScreen} />
          </Drawer.Navigator>
        );
    }
  };

  const BottomTabs = ({ navigation }) => {
    React.useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
        GetRoleID();
      });
      return unsubscribe;
    }, [navigation]);
    const [index, setIndex] = react.useState(0);
    const [routes] = React.useState([
      { key: "dashboard", title: "Dashboard", icon: "view-dashboard" },
      { key: "profile", title: "Profile", icon: "account" },
    ]);
    const renderScene = ({ route, jumpTo }) => {
      switch (route.key) {
        case "dashboard":
          return <DrawerNavigator />;
        case "profile":
          return <ProfileScreen />;
      }
    };
    return <BottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={renderScene} barStyle={{ backgroundColor: theme.colors.background }} activeColor={theme.colors.primary} safeAreaInsets={{ bottom: 0 }} />;
  };

  return (
    <SafeAreaView style={[Styles.flex1, Styles.primaryBgColor, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}>
      <PaperProvider theme={theme}>
        {isLoggedIn === 0 ? (
          <View style={[Styles.flex1, Styles.flexGrow, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.backgroundColor]}>
              <Text>Initilizing Application...</Text>
          </View>
        ) : (
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName={isLoggedIn === 1 ? "HomeStack" : "Login"}>
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
              <Stack.Screen name="Signup" component={SignupScreen} options={{ headerTitle: "", headerTintColor: theme.colors.primary, headerBackImage: () => <Icon name="arrow-left-thin" color={theme.colors.primary} size={32} /> }} />
              <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerTitle: "", headerTintColor: theme.colors.primary, headerBackImage: () => <Icon name="arrow-left-thin" color={theme.colors.primary} size={32} /> }} />
              <Stack.Screen name="HomeStack" component={BottomTabs} options={{ headerShown: false }} />
              <Stack.Screen name="AddActivityRolesScreen" component={AddActivityRolesScreen} options={{ headerTitle: "Add Activity Roles", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddServicesScreen" component={AddServicesScreen} options={{ headerTitle: "Add Services", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddUnitOfSalesScreen" component={AddUnitOfSalesScreen} options={{ headerTitle: "Add Unit of Sales", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddCategoryScreen" component={AddCategoryScreen} options={{ headerTitle: "Add Category", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddProductScreen" component={AddProductScreen} options={{ headerTitle: "Add Product", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddDepartmentScreen" component={AddDepartmentScreen} options={{ headerTitle: "Add Department", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddDesignationScreen" component={AddDesignationScreen} options={{ headerTitle: "Add Designation", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddServiceProductScreen" component={AddServiceProductScreen} options={{ headerTitle: "Add Service Product", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddEWayBillScreen" component={AddEWayBillScreen} options={{ headerTitle: "Add E-Way Bill", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddLocationTypeScreen" component={AddLocationTypeScreen} options={{ headerTitle: "Add Location Type", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddWorkFloorScreen" component={AddWorkFloorScreen} options={{ headerTitle: "Add Work Floor", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddWorkLocationScreen" component={AddWorkLocationScreen} options={{ headerTitle: "Add Work Location", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddDesignTypeScreen" component={AddDesignTypeScreen} options={{ headerTitle: "Add Design Type", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddPostNewDesignScreen" component={AddPostNewDesignScreen} options={{ headerTitle: "Add Post New Design", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </PaperProvider>
    </SafeAreaView>
  );
}
