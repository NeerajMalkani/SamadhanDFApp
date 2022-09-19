import "./src/components/ignoreWarnings";
import { Provider as PaperProvider, Text, List } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "./src/theme/apptheme";
import { Styles } from "./src/styles/styles";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SafeAreaView, Platform, StatusBar, LayoutAnimation, View } from "react-native";
import { MenuItemsAdmin, MenuItemsContractor, MenuItemsDealer, MenuItemsGeneralUser } from "./src/json/MenuItems";
import ActivityRolesScreen from "./src/screens/Admin/Master/ActivityRolesScreen";
import ServicesScreen from "./src/screens/Admin/Master/ServicesScreen";
import UnitOfSalesScreen from "./src/screens/Admin/Master/UnitOfSalesScreen";
import AddActivityRolesScreen from "./src/screens/Admin/Master/AddItems/AddActivityRolesScreen";
import AddServicesScreen from "./src/screens/Admin/Master/AddItems/AddServicesScreen";
import AddUnitOfSalesScreen from "./src/screens/Admin/Master/AddItems/AddUnitOfSalesScreen";
import CategoryScreen from "./src/screens/Admin/Master/CategoryScreen";
import AddCategoryScreen from "./src/screens/Admin/Master/AddItems/AddCategoryScreen";
import ImageGalleryScreen from "./src/screens/GeneralUser/EstimateAndEnquiries/ImageGalleryScreen";
import YourEstimationsScreen from "./src/screens/GeneralUser/EstimateAndEnquiries/YourEstimationsScreen";
import React, { useEffect } from "react";
import LoginScreen from "./src/screens/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignupScreen from "./src/screens/SignupScreen";
import ForgotPassword from "./src/screens/ForgotPassword";
import HomeScreen, { navigationRef } from "./src/screens/HomeScreen";
import PocketDiaryScreen from "./src/screens/PocketDiaryScreen";
import PocketDiaryScreenOne from "./src/screens/PocketDiary/PocketDiaryScreenOne";
import FeedbackScreen from "./src/screens/FeedbackScreen";
import UserProfileScreen from "./src/screens/UserProfile";
import DealerBasicDetailsScreen from "./src/screens/Dealer/CompanyProfile/BasicDetailsScreen";
import DealerMyServicesScreen from "./src/screens/Dealer/CompanyProfile/MyServicesScreen";
import ContractorBasicDetailsScreen from "./src/screens/Contractor/CompanyProfile/BasicDetailsScreen";
import ContractorMyServicesScreen from "./src/screens/Contractor/CompanyProfile/MyServicesScreen";
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
import DealerPresentationScreen from "./src/screens/Dealer/CompanyProfile/PresentationScreen";
import DealerBuyerCategoryScreen from "./src/screens/Dealer/Brand/BuyerCategoryScreen";
import AddDealerMyServicesScreen from "./src/screens/Dealer/CompanyProfile/AddItem/AddMyServicesScreen";
import AddDealerBuyerCategoryScreen from "./src/screens/Dealer/Brand/AddItem/AddBuyerCategoryScreen";
import DealerBrandMasterScreen from "./src/screens/Dealer/Brand/BrandMasterScreen";
import AddDealerBrandMasterScreen from "./src/screens/Dealer/Brand/AddItem/AddBrandMasterScreen";
import DealerBrandSetupScreen from "./src/screens/Dealer/Brand/BrandSetupScreen";
import AddDealerBrandSetupScreen from "./src/screens/Dealer/Brand/AddItem/AddBrandSetupScreen";
import DealerProductScreen from "./src/screens/Dealer/Product/ProductScreen";
import AddDealerProductScreen from "./src/screens/Dealer/Product/AddItem/AddProductScreen";
import MaterialSetupScreen from "./src/screens/Admin/ServiceCatalogue/MaterialSetupScreen";
import AddMaterialSetupScreen from "./src/screens/Admin/ServiceCatalogue/AddItems/AddMaterialSetupScreen";
import AddContractorMyServicesScreen from "./src/screens/Contractor/CompanyProfile/AddItem/AddMyServicesScreen";
import ImageGalleryWorkLocationScreen from "./src/screens/GeneralUser/EstimateAndEnquiries/ImageGalleryWorkLocationScreen";
import EstimationPreviewScreen from "./src/screens/GeneralUser/EstimateAndEnquiries/EstimationPreviewScreen";
import GetEstimationScreen from "./src/screens/GeneralUser/EstimateAndEnquiries/GetEstimationScreen";
import ContractorDepartmentScreen from "./src/screens/Contractor/Organization/DepartmentScreen";
import AddContractorDepartmentScreen from "./src/screens/Contractor/Organization/AddItem/AddDepartmentScreen";
import ContractorDesignationScreen from "./src/screens/Contractor/Organization/DesignationScreen";
import AddContractorDesignationScreen from "./src/screens/Contractor/Organization/AddItem/AddDesignationScreen";
import DealerDepartmentScreen from "./src/screens/Dealer/Organization/DepartmentScreen";
import AddDealerDepartmentScreen from "./src/screens/Dealer/Organization/AddItem/AddDepartmentScreen";
import AddDealerDesignationScreen from "./src/screens/Dealer/Organization/AddItem/AddDesignationScreen";
import DealerDesignationScreen from "./src/screens/Dealer/Organization/DesignationScreen";
import DesignWiseScreen from "./src/screens/Contractor/QuotationAndEstimation/DesignWiseScreen";
import QuotationWiseScreen from "./src/screens/Contractor/QuotationAndEstimation/QuotationWiseScreen";
import ClientScreen from "./src/screens/Common/Client/ClientScreen";
import AddClientScreen from "./src/screens/Common/Client/AddClientScreen";
import ApprovedUserScreen from "./src/screens/Admin/Users/ApprovedUserScreen";
import DeclinedUserScreen from "./src/screens/Admin/Users/DeclinedUserScreen";
import PendingUserScreen from "./src/screens/Admin/Users/PendingUserScreen";
import SearchNAdd from "./src/screens/Contractor/Employee/AddItems/SearchNAdd";
import EmployeeListScreen from "./src/screens/Contractor/Employee/EmployeeList";
import EmployeeEditScreen from "./src/screens/Contractor/Employee/AddItems/EmployeeEdit";
import BranchListScreen from "./src/screens/Contractor/Organization/BranchScreen";
import BranchEditScreen from "./src/screens/Contractor/Organization/AddItem/AddBranchScreen";
import EmployeeDlist from "./src/screens/Dealer/Employee/EmployeeDList";
import SearchNDAdd from "./src/screens/Dealer/Employee/AddItem/SearchNDAdd";
import EmployeeDEdit from "./src/screens/Dealer/Employee/AddItem/EmployeeDEdit";
import EnquiryWise from "./src/screens/Contractor/Enquiries/Enquiry_Wise";
import UserProfile from "./src/screens/Common/Profile Update/UserProfile";
const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createMaterialBottomTabNavigator();
let menuItems = [];

export default function App() {
  const userDetails = React.useState(null);

  const SetUser = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      const ud = JSON.parse(userData);
      switch (parseInt(ud.RoleID)) {
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
      userDetails[1](ud);
    } else {
      userDetails[1]({});
    }
  };

  useEffect(() => {
    SetUser();
  }, []);

  let activeIndex = -1;
  const DrawerContent = (props) => {
    const [expanded1, setExpanded1] = React.useState(false);
    const [expanded2, setExpanded2] = React.useState(false);
    const [expanded3, setExpanded3] = React.useState(false);
    const [expanded4, setExpanded4] = React.useState(false);
    const [expanded5, setExpanded5] = React.useState(false);
    const [expanded6, setExpanded6] = React.useState(false);
    const [expanded7, setExpanded7] = React.useState(false);
    const [expanded8, setExpanded8] = React.useState(false);
    const [expanded9, setExpanded9] = React.useState(false);
    const masterExpanded = [expanded1, expanded2, expanded3, expanded4, expanded5, expanded6, expanded7, expanded8, expanded9];
    const masterSetExpanded = [setExpanded1, setExpanded2, setExpanded3, setExpanded4, setExpanded5, setExpanded6, setExpanded7, setExpanded8, setExpanded9];
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
          return k.roleID === userDetails[0].RoleID ? (
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
                expanded={i == 0 ? expanded1 : i == 1 ? expanded2 : i == 2 ? expanded3 : i == 3 ? expanded4 : i == 4 ? expanded5 : i == 5 ? expanded6 : i == 6 ? expanded7 : i == 7 ? expanded8 : expanded9}
                left={(props) => <List.Icon {...props} icon={k.icon} />}
                style={[Styles.backgroundColor, Styles.borderBottom1, Styles.height56, { paddingTop: -8 }]}
                onPress={() => {
                  LayoutAnimation.easeInEaseOut();
                  for (let a = 0; a < masterExpanded.length; a++) {
                    masterSetExpanded[a](false);
                  }
                  masterSetExpanded[i](!masterExpanded[i]);
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
    if (Object.keys(userDetails[0]).length === 0) {
      return (
        <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="HomeScreen">
          <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="HomeScreen" component={HomeScreen} initialParams={{ userDetails: userDetails, setUserFunc: SetUser }} />
        </Drawer.Navigator>
      );
    } else {
      switch (parseInt(userDetails[0].RoleID)) {
        case 0:
          return (
            <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="HomeScreen">
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="HomeScreen" component={HomeScreen} initialParams={{ userDetails: userDetails, setUserFunc: SetUser }} />
            </Drawer.Navigator>
          );
        case 1:
          return (
            <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="HomeScreen">
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="HomeScreen" component={HomeScreen} initialParams={{ userDetails: userDetails, setUserFunc: SetUser }} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="ActivityRolesScreen" component={ActivityRolesScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="ServicesScreen" component={ServicesScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="UnitOfSalesScreen" component={UnitOfSalesScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="CategoryScreen" component={CategoryScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="ProductScreen" component={ProductScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="DepartmentScreen" component={DepartmentScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="LocationTypeScreen" component={LocationTypeScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="DesignationScreen" component={DesignationScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="ServiceProductScreen" component={ServiceProductScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="EWayBillScreen" component={EWayBillScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="WorkFloorScreen" component={WorkFloorScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="WorkLocationScreen" component={WorkLocationScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="DesignTypeScreen" component={DesignTypeScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="MaterialSetupScreen" component={MaterialSetupScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="PostNewDesignScreen" component={PostNewDesignScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="ApprovedUserScreen" component={ApprovedUserScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="DeclinedUserScreen" component={DeclinedUserScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="PendingUserScreen" component={PendingUserScreen} />
            </Drawer.Navigator>
          );
        case 2:
          return (
            <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="HomeScreen">
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="HomeScreen" component={HomeScreen} initialParams={{ userDetails: userDetails, setUserFunc: SetUser }} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="ImageGalleryScreen" component={ImageGalleryScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="YourEstimationsScreen" component={YourEstimationsScreen} />
            </Drawer.Navigator>
          );
        case 3:
          return (
            <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="HomeScreen">
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="HomeScreen" component={HomeScreen} initialParams={{ userDetails: userDetails, setUserFunc: SetUser }} />
              {/* <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="ContractorBasicDetailsScreen" component={ContractorBasicDetailsScreen} /> */}
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="ContractorMyServicesScreen" component={ContractorMyServicesScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="ContractorDepartmentScreen" component={ContractorDepartmentScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="ContractorDesignationScreen" component={ContractorDesignationScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="DesignWiseScreen" component={DesignWiseScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="QuotationWiseScreen" component={QuotationWiseScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="ClientScreen" component={ClientScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="EmployeeListScreen" component={EmployeeListScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="BranchListScreen" component={BranchListScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="BranchEditScreen" component={BranchEditScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="EnquiryWise" component={EnquiryWise} />
            </Drawer.Navigator>
          );
        case 4:
          return (
            <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />} initialRouteName="HomeScreen">
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="HomeScreen" component={HomeScreen} initialParams={{ userDetails: userDetails, setUserFunc: SetUser }} />
              {/* <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="DealerBasicDetailsScreen" component={DealerBasicDetailsScreen} /> */}
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="DealerMyServicesScreen" component={DealerMyServicesScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="DealerPresentationScreen" component={DealerPresentationScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="DealerBrandMasterScreen" component={DealerBrandMasterScreen} initialParams={{ activeIndex: activeIndex }} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="DealerBrandSetupScreen" component={DealerBrandSetupScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="DealerBuyerCategoryScreen" component={DealerBuyerCategoryScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="DealerProductScreen" component={DealerProductScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="DealerDepartmentScreen" component={DealerDepartmentScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="DealerDesignationScreen" component={DealerDesignationScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="ClientScreen" component={ClientScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="EmployeeDlist" component={EmployeeDlist} />
            </Drawer.Navigator>
          );
      }
    }
  };

  const BottomTabs = ({ navigation }) => {
    React.useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {});
      return unsubscribe;
    }, [navigation]);
    return (
      <Tab.Navigator shifting={true} initialRouteName="dashboard" activeColor={theme.colors.primary} barStyle={{ backgroundColor: theme.colors.textLight }}>
        <Tab.Screen name="Dashboard" component={DrawerNavigator} options={{ unmountOnBlur: true, tabBarLabel: "Dashboard", tabBarIcon: ({ color }) => <Icon name="view-dashboard" color={color} size={26} /> }} />
        <Tab.Screen name="PocketDiary" component={PocketDiaryScreen} options={{ unmountOnBlur: true, tabBarLabel: "Pocket Diary", tabBarIcon: ({ color }) => <Icon name="calculator-variant" color={color} size={26} /> }} />
        <Tab.Screen name="Feedbacks" component={FeedbackScreen} options={{ unmountOnBlur: true, tabBarLabel: "Suggestions", tabBarIcon: ({ color }) => <Icon name="comment-alert" color={color} size={26} /> }} />
        <Tab.Screen name="UserProfile" component={parseInt(userDetails[0].RoleID) === 4 ? DealerBasicDetailsScreen : parseInt(userDetails[0].RoleID) === 3 ? ContractorBasicDetailsScreen : parseInt(userDetails[0].RoleID) === 2 ? UserProfile : parseInt(userDetails[0].RoleID) === 6 ? UserProfile  : UserProfileScreen} options={{ unmountOnBlur: true, tabBarLabel: "User Profile", tabBarIcon: ({ color }) => <Icon name="account" color={color} size={26} /> }} />
      </Tab.Navigator>
    );
  };

  return (
    <SafeAreaView style={[Styles.flex1, Styles.primaryBgColor, { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 }]}>
      <PaperProvider theme={theme}>
        {userDetails[0] === null ? (
          <View style={[Styles.flex1, Styles.flexGrow, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.backgroundColor]}>
            <Text>Initilizing Application...</Text>
          </View>
        ) : (
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName={Object.keys(userDetails[0]).length !== 0 ? "HomeStack" : "Login"}>
              <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} initialParams={{ setUserFunc: SetUser }} />
              <Stack.Screen name="Signup" component={SignupScreen} options={{ headerTitle: "", headerTintColor: theme.colors.primary, headerBackImage: () => <Icon name="arrow-left-thin" color={theme.colors.primary} size={32} /> }} initialParams={{ setUserFunc: SetUser }} />
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
              <Stack.Screen name="AddDealerMyServicesScreen" component={AddDealerMyServicesScreen} options={{ headerTitle: "Add My Services", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddDealerBrandMasterScreen" component={AddDealerBrandMasterScreen} options={{ headerTitle: "Add Brand", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddDealerBrandSetupScreen" component={AddDealerBrandSetupScreen} options={{ headerTitle: "Add Brand Setup", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddDealerBuyerCategoryScreen" component={AddDealerBuyerCategoryScreen} options={{ headerTitle: "Add Buyer Category", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddDealerProductScreen" component={AddDealerProductScreen} options={{ headerTitle: "Add Product", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddDealerDepartmentScreen" component={AddDealerDepartmentScreen} options={{ headerTitle: "Add Department", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddDealerDesignationScreen" component={AddDealerDesignationScreen} options={{ headerTitle: "Add Designation", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddMaterialSetupScreen" component={AddMaterialSetupScreen} options={{ headerTitle: "Add Material Setup", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddContractorMyServicesScreen" component={AddContractorMyServicesScreen} options={{ headerTitle: "Add My Services", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddContractorDepartmentScreen" component={AddContractorDepartmentScreen} options={{ headerTitle: "Add Department", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddContractorDesignationScreen" component={AddContractorDesignationScreen} options={{ headerTitle: "Add Designation", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="ImageGalleryWorkLocationScreen" component={ImageGalleryWorkLocationScreen} options={{ headerTitle: "Image Gallery", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="EstimationPreviewScreen" component={EstimationPreviewScreen} options={{ headerTitle: "Design Estimation", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="GetEstimationScreen" component={GetEstimationScreen} options={{ headerTitle: "Design Estimation", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="AddClientScreen" component={AddClientScreen} options={{ headerTitle: "Add Client", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="EmployeeEditScreen" component={EmployeeEditScreen} options={{ headerTitle: "Employee Basic Edit", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="PocketScreenOne" component={PocketDiaryScreenOne} options={{ headerShown: false }} />
              <Stack.Screen name="SearchNAdd" component={SearchNAdd} options={{ headerTitle: "Search & Add", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="SearchNDAdd" component={SearchNDAdd} options={{ headerTitle: "Search & Add", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="EmployeeDEdit" component={EmployeeDEdit} options={{ headerTitle: "Employee Basic Edit", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
              <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerTitle: "Basic Details", headerBackTitleVisible: false, headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} />
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </PaperProvider>
    </SafeAreaView>
  );
}
