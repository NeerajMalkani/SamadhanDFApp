import { Provider as PaperProvider, Snackbar, Text, BottomNavigation } from "react-native-paper";
// import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "./src/theme/apptheme";
import { Styles } from "./src/styles/styles";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import { LogBox, View, SafeAreaView, Platform, StatusBar } from "react-native";
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

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

LogBox.ignoreLogs(["Can't perform a React state update on an unmounted component", "The action 'CLOSE_DRAWER' was not handled by any navigator."]);

export default function App() {
  const [visible, setVisible] = React.useState(false);
  const roleID = React.useState(0);
  const [isLoggedIn, setIsLoggedIn] = useStateIfMounted(0);

  let menuItems = [];

  const onDismissSnackBar = () => setVisible(false);

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
                  setExpanded(false);
                }}
              />
            ) : (
              <CollapsibleView
                key={i}
                isRTL={true}
                arrowStyling={{ size: 18, svgProps: { transform: [{ rotate: "-90deg" }] } }}
                collapsibleContainerStyle={{ width: "100%" }}
                initExpanded={false}
                style={[Styles.borderBottom1, Styles.border0, Styles.flexAlignStart, Styles.padding0, Styles.margin0]}
                title={
                  <View style={[Styles.padding8, Styles.paddingBottom12, Styles.flex1, Styles.flexRow]}>
                    <Icon name={k.icon} color={theme.colors.textSecondary} size={24} />
                    <Text style={[Styles.textColor, Styles.fontSize16, { paddingLeft: 34 }]}>{k.title}</Text>
                  </View>
                }
              >
                {k.items.map((j, l) => {
                  return (
                    <DrawerItem
                      key={l}
                      style={{ marginVertical: 0, paddingHorizontal: 0, width: "100%", marginLeft: 0, borderRadius: 0, borderBottomColor: theme.colors.textLightSecondary, borderBottomWidth: 1 }}
                      focused={activeIndex === parseInt(i.toString() + l.toString()) ? true : false}
                      label={({ focused }) => <Text style={[Styles.textColor, Styles.fontSize16, { color: focused ? theme.colors.textLight : theme.colors.text }]}>{j.title}</Text>}
                      activeBackgroundColor={theme.colors.primary}
                      inactiveBackgroundColor={theme.colors.backgroundSecondary}
                      onPress={(e) => {
                        if (j.navigation !== undefined) {
                          activeIndex = parseInt(i.toString() + l.toString());
                          props.navigation.navigate(j.navigation);
                        } else {
                          //setVisible(true);
                        }
                      }}
                    />
                  );
                })}
              </CollapsibleView>
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
            <Drawer.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} initialParams={{ roleID: { GetRoleID } }} />
          </Drawer.Navigator>
        );
        break;
      case 1:
        return (
          <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="HomeScreen">
            <Drawer.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} initialParams={{ roleID: { GetRoleID } }} />
            <Drawer.Screen options={{ headerShown: false }} name="ActivityRolesScreen" component={ActivityRolesScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="ServicesScreen" component={ServicesScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="UnitOfSalesScreen" component={UnitOfSalesScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="CategoryScreen" component={CategoryScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="ProductScreen" component={ProductScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="DepartmentScreen" component={DepartmentScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="DesignationScreen" component={DesignationScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="ServiceProductScreen" component={ServiceProductScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="EWayBillScreen" component={EWayBillScreen} />
          </Drawer.Navigator>
        );
      case 2:
        return (
          <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="HomeScreen">
            <Drawer.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} initialParams={{ roleID: { GetRoleID } }} />
            <Drawer.Screen options={{ headerShown: false }} name="ImageGalleryScreen" component={ImageGalleryScreen} />
            <Drawer.Screen options={{ headerShown: false }} name="YourEstimationsScreen" component={YourEstimationsScreen} />
          </Drawer.Navigator>
        );
      case 4:
        return (
          <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="HomeScreen">
            <Drawer.Screen options={{ headerShown: false }} name="HomeScreen" component={HomeScreen} initialParams={{ roleID: { GetRoleID } }} />
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

  const CreateStacks = () => {
    if (isLoggedIn === 1) {
      return (
        <Stack.Navigator initialRouteName="HomeStack">
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
        </Stack.Navigator>
      );
    } else if (isLoggedIn === 2) {
      return (
        <Stack.Navigator initialRouteName="Login">
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
        </Stack.Navigator>
      );
    }
  };

  return (
    <SafeAreaView style={[Styles.flex1, Styles.primaryBgColor, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}>
      <PaperProvider theme={theme}>
        {roleID[0] === -1 ? null : <NavigationContainer ref={navigationRef}>{CreateStacks()}</NavigationContainer>}
        <Snackbar visible={visible} onDismiss={onDismissSnackBar}>
          Coming soon
        </Snackbar>
      </PaperProvider>
    </SafeAreaView>
  );
}
