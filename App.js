import { Provider as PaperProvider, Snackbar, Text, BottomNavigation } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "./src/theme/apptheme";
import { Styles } from "./src/styles/styles";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import { View } from "react-native";
import { MenuItemsAdmin, MenuItemsGeneralUser } from "./src/json/MenuItems";
import ActivityRolesScreen from "./src/screens/Master/ActivityRolesScreen";
import ServicesScreen from "./src/screens/Master/ServicesScreen";
import UnitOfSalesScreen from "./src/screens/Master/UnitOfSalesScreen";
import AddActivityRolesScreen from "./src/screens/Master/AddItems/AddActivityRolesScreen";
import AddServicesScreen from "./src/screens/Master/AddItems/AddServicesScreen";
import AddUnitOfSalesScreen from "./src/screens/Master/AddItems/AddUnitOfSalesScreen";
import CategoryScreen from "./src/screens/Master/CategoryScreen";
import AddCategoryScreen from "./src/screens/Master/AddItems/AddCategoryScreen";
import React, { useEffect } from "react";
import LoginScreen from "./src/screens/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignupScreen from "./src/screens/SignupScreen";
import ForgotPassword from "./src/screens/ForgotPassword";
import react from "react";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/UserProfile";
import ImageGalleryScreen from "./src/screens/BrandAndProducts/ImageGalleryScreen";
import YourEstimationsScreen from "./src/screens/BrandAndProducts/YourEstimationsScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const navigationRef = createNavigationContainerRef();

export default function App() {
  const [visible, setVisible] = React.useState(false);
  const [roleID, setRoleID] = React.useState(0);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  let menuItems = [];

  const onDismissSnackBar = () => setVisible(false);

  const CheckUserLogin = async () => {
    try {
      const value = await AsyncStorage.getItem("isLogin");
      if (value !== null && value === "true") {
        setIsLoggedIn(true);
      }
    } catch (error) {}
  };
  CheckUserLogin();

  const GetRoleID = async () => {
    try {
      const value = await AsyncStorage.getItem("user");
      if (value) {
        switch (JSON.parse(value).RoleID) {
          case 1:
            console.log("1");
            menuItems = [...MenuItemsAdmin];
            break;
          case 2:
            console.log("2");
            menuItems = [...MenuItemsGeneralUser];
            break;
        }
        setRoleID(JSON.parse(value).RoleID);
      }
    } catch (error) {}
  };
  useEffect(() => {
    GetRoleID();
  }, [roleID]);

  let activeIndex = 0;
  const DrawerContent = (props) => {
    return (
      <DrawerContentScrollView {...props}>
        {menuItems.map((k, i) => {
          return k.roleID === roleID ? (
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
                initExpanded={i == 0 ? true : false}
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
                          setVisible(true);
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
    return roleID == 1 ? (
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="ActivityRolesScreen">
        <Drawer.Screen options={{ headerShown: false }} name="ActivityRolesScreen" component={ActivityRolesScreen} />
        <Drawer.Screen options={{ headerShown: false }} name="ServicesScreen" component={ServicesScreen} />
        <Drawer.Screen options={{ headerShown: false }} name="UnitOfSalesScreen" component={UnitOfSalesScreen} />
        <Drawer.Screen options={{ headerShown: false }} name="CategoryScreen" component={CategoryScreen} />
      </Drawer.Navigator>
    ) : (
      <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="ImageGalleryScreen">
        <Drawer.Screen options={{ headerShown: false }} name="ImageGalleryScreen" component={ImageGalleryScreen} />
        <Drawer.Screen options={{ headerShown: false }} name="YourEstimationsScreen" component={YourEstimationsScreen} />
      </Drawer.Navigator>
    );
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
      { key: "home", title: "Home", icon: "home" },
      { key: "dashboard", title: "Dashboard", icon: "view-dashboard" },
      { key: "profile", title: "Profile", icon: "account" },
    ]);
    const renderScene = BottomNavigation.SceneMap({
      home: HomeScreen,
      dashboard: DrawerNavigator,
      profile: ProfileScreen,
    });
    return <BottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={renderScene} barStyle={{ backgroundColor: theme.colors.background }} activeColor={theme.colors.primary} />;
  };

  return (
    <SafeAreaView style={[Styles.flex1]}>
      <PaperProvider theme={theme}>
        {roleID === 0 ? null : (
          <NavigationContainer ref={navigationRef}>
            {isLoggedIn ? (
              <Stack.Navigator initialRouteName="HomeStack">
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Signup" component={SignupScreen} options={{ headerTitle: "", headerTintColor: theme.colors.primary, headerBackImage: () => <Icon name="arrow-left-thin" color={theme.colors.primary} size={32} /> }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerTitle: "", headerTintColor: theme.colors.primary, headerBackImage: () => <Icon name="arrow-left-thin" color={theme.colors.primary} size={32} /> }} />
                <Stack.Screen name="HomeStack" component={BottomTabs} options={{ headerShown: false }} />
                <Stack.Screen name="AddActivityRolesScreen" component={AddActivityRolesScreen} options={{ headerTitle: "Add Activity Roles", headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
                <Stack.Screen name="AddServicesScreen" component={AddServicesScreen} options={{ headerTitle: "Add Services", headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
                <Stack.Screen name="AddUnitOfSalesScreen" component={AddUnitOfSalesScreen} options={{ headerTitle: "Add Unit of Sales", headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
                <Stack.Screen name="AddCategoryScreen" component={AddCategoryScreen} options={{ headerTitle: "Add Category", headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              </Stack.Navigator>
            ) : (
              <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Signup" component={SignupScreen} options={{ headerTitle: "", headerTintColor: theme.colors.primary, headerBackImage: () => <Icon name="arrow-left-thin" color={theme.colors.primary} size={32} /> }} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} options={{ headerTitle: "", headerTintColor: theme.colors.primary, headerBackImage: () => <Icon name="arrow-left-thin" color={theme.colors.primary} size={32} /> }} />
                <Stack.Screen name="HomeStack" component={BottomTabs} options={{ headerShown: false }} />
                <Stack.Screen name="AddActivityRolesScreen" component={AddActivityRolesScreen} options={{ headerTitle: "Add Activity Roles", headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
                <Stack.Screen name="AddServicesScreen" component={AddServicesScreen} options={{ headerTitle: "Add Services", headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
                <Stack.Screen name="AddUnitOfSalesScreen" component={AddUnitOfSalesScreen} options={{ headerTitle: "Add Unit of Sales", headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
                <Stack.Screen name="AddCategoryScreen" component={AddCategoryScreen} options={{ headerTitle: "Add Category", headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              </Stack.Navigator>
            )}
          </NavigationContainer>
        )}
        <Snackbar visible={visible} onDismiss={onDismissSnackBar}>
          Coming soon
        </Snackbar>
      </PaperProvider>
    </SafeAreaView>
  );
}
