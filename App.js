import "./src/components/ignoreWarnings";
import { Provider as PaperProvider, Text, List } from "react-native-paper";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { theme } from "./src/theme/apptheme";
import { Styles } from "./src/styles/styles";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  SafeAreaView,
  Platform,
  StatusBar,
  LayoutAnimation,
  View,
} from "react-native";
import DesignYourDreamCategories from "./src/screens/Design Your Dream/Categories";
import DesignYourDreamForm from "./src/screens/Design Your Dream/Form";
import {
  MenuItemsAdmin,
  MenuItemsContractor,
  MenuItemsDealer,
  MenuItemsGeneralUser,
  MenuItemsArchitect,
  MenuItemsManufacture,
  MenuItemsProjectSupervisor,
} from "./src/json/MenuItems";
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
import React, { useEffect, useState } from "react";
import LoginScreen from "./src/screens/LoginScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SignupScreen from "./src/screens/SignupScreen";
import ForgotPassword from "./src/screens/ForgotPassword";
import HomeScreen, { navigationRef } from "./src/screens/HomeScreen";
import PocketDiaryScreen from "./src/screens/PocketDiaryScreen";
import PocketDiaryScreenOne from "./src/screens/PocketDiary/PocketDiaryScreenOne";
import FeedbackScreen from "./src/screens/FeedbackScreen";
import UserProfileScreen from "./src/screens/UserProfile";
import BasicDetailsScreen from "./src/screens/Common/CompanyProfile/BasicDetailsScreen";
import MyServicesScreen from "./src/screens/Common/CompanyProfile/MyServicesScreen";

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
import AddDealerBuyerCategoryScreen from "./src/screens/Dealer/Brand/AddItem/AddBuyerCategoryScreen";
import DealerBrandMasterScreen from "./src/screens/Dealer/Brand/BrandMasterScreen";
import AddDealerBrandMasterScreen from "./src/screens/Dealer/Brand/AddItem/AddBrandMasterScreen";
import DealerBrandSetupScreen from "./src/screens/Dealer/Brand/BrandSetupScreen";
import AddDealerBrandSetupScreen from "./src/screens/Dealer/Brand/AddItem/AddBrandSetupScreen";
import DealerProductScreen from "./src/screens/Dealer/Product/ProductScreen";
import AddDealerProductScreen from "./src/screens/Dealer/Product/AddItem/AddProductScreen";
import MaterialSetupScreen from "./src/screens/Admin/ServiceCatalogue/MaterialSetupScreen";
import AddMaterialSetupScreen from "./src/screens/Admin/ServiceCatalogue/AddItems/AddMaterialSetupScreen";
import AddMyServicesScreen from "./src/screens/Common/CompanyProfile/AddItem/AddMyServicesScreen";
import ImageGalleryWorkLocationScreen from "./src/screens/GeneralUser/EstimateAndEnquiries/ImageGalleryWorkLocationScreen";
import EstimationPreviewScreen from "./src/screens/GeneralUser/EstimateAndEnquiries/EstimationPreviewScreen";
import GetEstimationScreen from "./src/screens/GeneralUser/EstimateAndEnquiries/GetEstimationScreen";

import MaterialCalculatorScreen from "./src/screens/Common/MaterialCalculator/MaterialCalculatorScreen";
import CommonDepartmentScreen from "./src/screens/Common/Organization/DepartmentScreen";
import AddCommonDepartmentScreen from "./src/screens/Common/Organization/AddItem/AddDepartmentScreen";
import CommonDesignationScreen from "./src/screens/Common/Organization/DesignationScreen";
import AddCommonDesignationScreen from "./src/screens/Common/Organization/AddItem/AddDesignationScreen";
import PhoneContacts from "./src/screens/Common/PocketDairy/Setting/AddItems/PhoneContacts";
import DesignWiseScreen from "./src/screens/Contractor/QuotationAndEstimation/DesignWiseScreen";
import QuotationWiseScreen from "./src/screens/Contractor/QuotationAndEstimation/QuotationWiseScreen";
import ClientScreen from "./src/screens/Common/Client/ClientScreen";
import ClientEditScreen from "./src/screens/Common/Client/AddItems/ClientEdit";
import ApprovedUserScreen from "./src/screens/Admin/Users/ApprovedUserScreen";
import DeclinedUserScreen from "./src/screens/Admin/Users/DeclinedUserScreen";
import PendingUserScreen from "./src/screens/Admin/Users/PendingUserScreen";
import SearchNAdd from "./src/screens/Common/Employee/AddItems/SearchNAdd";
import EmployeeListScreen from "./src/screens/Common/Employee/EmployeeList";
import EmployeeEditScreen from "./src/screens/Common/Employee/AddItems/EmployeeEdit";
import BranchListScreen from "./src/screens/Common/Organization/BranchScreen";
import BranchEditScreen from "./src/screens/Common/Organization/AddItem/AddBranchScreen";
import EnquiryWise from "./src/screens/Contractor/Enquiries/Enquiry_Wise";
import UserProfile from "./src/screens/Common/Profile Update/UserProfile";
import RateCardSetUp from "./src/screens/Contractor/RateCard/RateCardSetup";
import AddRateCard from "./src/screens/Contractor/RateCard/AddRateCard";
import ArchitectRateCardSetup from "./src/screens/Architect/ArchitectRateCardSetup";
import Demo from "./src/screens/GeneralUser/Demo";
import SearchClientScreen from "./src/screens/Common/Client/AddItems/SearchClientScreen";
import AddClientScreen from "./src/screens/Common/Client/AddItems/AddClientScreen";
import SearchEmployee from "./src/screens/Common/Employee/AddItems/SearchEmployee";
import AddEmployee from "./src/screens/Common/Employee/AddItems/AddEmployee";
import SendRateCard from "./src/screens/Contractor/RateCard/SendRateCard/sendRateCard";
import AddSendRateCard from "./src/screens/Contractor/RateCard/SendRateCard/AddSendRateCard";

import BudgetSetup from "./src/screens/Common/PocketDairy/Setting/BudgetSetup";
import AddBudgetSetup from "./src/screens/Common/PocketDairy/Setting/AddItems/AddBudgetSetup";
import AddExpensesList from "./src/screens/Common/PocketDairy/AddExpensesList";
import AddExpenses from "./src/screens/Common/PocketDairy/AddItems/AddExpenses";
import AddSourceList from "./src/screens/Common/PocketDairy/AddSourceList";
import VerifyCompanySource from "./src/screens/Common/PocketDairy/VerifyCompanySource";
import VerifyCompanyExpense from "./src/screens/Common/PocketDairy/VerifyCompanyExpense";
import AddSource from "./src/screens/Common/PocketDairy/AddItems/AddSource";
//import Inbox from "./src/screens/GeneralUser/PocketDairy/Inbox";
import BrandConversionValue from "./src/screens/Manufacture/ProductionUnitMaster/BrandConversionValue";
import OpeningStockList from "./src/screens/Manufacture/ProductionUnitMaster/OpeningStockList";
import ApiMaster from "./src/screens/Admin/Master/ApiMaster";
import AddApiMaster from "./src/screens/Admin/Master/AddItems/AddApiMaster";
import openingStockScrap from "./src/screens/Manufacture/openingStockScrap";
import OpeningStockScrap from "./src/screens/Manufacture/openingStockScrap";
import AddOpeningStockScrap from "./src/screens/Manufacture/AddItems/AddOpeningStockScrap";
import AddStockList from "./src/screens/Manufacture/AddItems/AddStockList";
import EditStockList from "./src/screens/Manufacture/AddItems/EditStockList";
import EditStockScrap from "./src/screens/Manufacture/AddItems/EditOpeningStockScrap";
import ProductforProduction from "./src/screens/Manufacture/ProductforProduction";
import AddProduction from "./src/screens/Manufacture/AddItems/AddProduction";
import ProductionStatus from "./src/screens/Manufacture/ProductionStatus";
import AddProductionStatus from "./src/screens/Manufacture/AddItems/AddProductionStatus";
import EditProductionStatus from "./src/screens/Manufacture/AddItems/EditProductionStatus";
import EditProductForProduction from "./src/screens/Manufacture/AddItems/EditProductForProduction";
import ProductionOrderList from "./src/screens/Manufacture/ProductionOrderList";
import AddProductOrderList from "./src/screens/Manufacture/AddItems/AddProductOrderList";
import EditProductOrderList from "./src/screens/Manufacture/AddItems/EditProductOrderList";
import CategoryNameScreen from "./src/screens/Admin/PocketDairyMaster/CategoryName";
import AddCategoryNameScreen from "./src/screens/Admin/PocketDairyMaster/AddCategoryName";
import SubCategoryNameScreen from "./src/screens/Admin/PocketDairyMaster/SubCategoryName";
import AddSubCategoryNameScreen from "./src/screens/Admin/PocketDairyMaster/AddSubCategoryName";
import GCategoryNameScreen from "./src/screens/Common/PocketDairy/Setting/GCategoryName";
import AddGCategoryNameScreen from "./src/screens/Common/PocketDairy/Setting/AddItems/AddGCategoryName";
import GSubCategoryNameScreen from "./src/screens/Common/PocketDairy/Setting/GSubCategoryName";
import AddGSubCategoryNameScreen from "./src/screens/Common/PocketDairy/Setting/AddItems/AddGSubCategoryName";
import GMyContactsScreen from "./src/screens/Common/PocketDairy/Setting/GMyContacts";
import AddGMyContactsScreen from "./src/screens/Common/PocketDairy/Setting/AddItems/AddGMyContacts";
import GMyBankScreen from "./src/screens/Common/PocketDairy/Setting/GMyBank";
import AddGMyBankScreen from "./src/screens/Common/PocketDairy/Setting/AddItems/AddGMyBank";
import ABrandConversationValue from "./src/screens/Admin/ProductionUnitMaster/BrandConversationValue";
import AddBrandConversationValue from "./src/screens/Admin/ProductionUnitMaster/AddItems/AddBrandConversationValue";
import WidthOfGpCoil from "./src/screens/Admin/ProductionUnitMaster/WidthOfGPCoil";
import AddWidthOfGpCoil from "./src/screens/Admin/ProductionUnitMaster/AddItems/AddWidthOfGpCoil";
import MassOfZincCoating from "./src/screens/Admin/ProductionUnitMaster/MassOfZincCoating";
import AddMassOfZincCoating from "./src/screens/Admin/ProductionUnitMaster/AddItems/AddMassOfZincCoating";
import AddBankDetails from "./src/screens/Common/Profile Update/AddBankDetails";
import PayableList from "./src/screens/Common/PocketDairy/PayableList";
import ReceivableList from "./src/screens/Common/PocketDairy/ReceivableList";
import BankListScreen from "./src/screens/Common/Organization/BankScreen";
import AddBankScreen from "./src/screens/Common/Organization/AddItem/AddBankScreen";

import PDCDataUpdate from "./src/screens/Common/PocketDairy/PDCDataUpdate";
import MyPersonalBankScreen from "./src/screens/Common/PocketDairy/Setting/MyPersonalBank";
import AddMyPersonalBank from "./src/screens/Common/PocketDairy/Setting/AddItems/AddMyPersonalBank";
import BankTransactionScreen from "./src/screens/Common/PocketDairy/BankTransactions";
import PocketTransactionScreen from "./src/screens/Common/PocketDairy/PocketTransactions";
import SourceListGeneralUserScreen from "./src/screens/Common/PocketDairy/SourceListGeneralUser";
import ExpensesListGeneralUserScreen from "./src/screens/Common/PocketDairy/ExpensesListGeneralUser";
import PocketTransactionGeneralUserScreen from "./src/screens/Common/PocketDairy/PocketTransactionGeneralUser";
import BranchWiseTransactionScreen from "./src/screens/Common/PocketDairy/BranchWiseTransactions";
import PhoneContactDirectUpload from "./src/screens/Common/PocketDairy/Setting/AddItems/PhoneContactDirectUpload";
import EstimationContractorStatusScreen from "./src/screens/GeneralUser/EstimateAndEnquiries/EstimationContractorStatus";
import BranchWiseCashDetailScreen from "./src/screens/Common/PocketDairy/BranchWiseCashDetails";
import SelectGroupType from "./src/screens/Common/Looking for a Job/SelectGroupType";
import AreaOfInterest from "./src/screens/Common/Looking for a Job/Employee/AreaOfInterest";
import JobSeekerForm from "./src/screens/Common/Looking for a Job/Employee/JobSeekerForm";
import JobListing from "./src/screens/Common/Looking for a Job/Employee/JobListing";
import JobPostingForm from "./src/screens/Common/Looking for a Job/Employer/JobPostingForm";
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
        case 2:
          menuItems = [...MenuItemsAdmin];
          break;
        case 3:
          menuItems = [...MenuItemsGeneralUser];
          break;
        case 5:
          menuItems = [...MenuItemsContractor];
          break;
        case 4:
          menuItems = [...MenuItemsDealer];
          break;
        case 6:
          menuItems = [...MenuItemsArchitect];
          break;
        case 7:
          menuItems = [...MenuItemsProjectSupervisor];
          break;
        case 8:
          menuItems = [...MenuItemsManufacture];
          break;
        case 9:
          menuItems = [...MenuItemsArchitect];
          break;
      }
      userDetails[1](ud);
    } else {
      userDetails[1]({});
    }
  };

  const LogoutUser = async () => {
    try {
      await AsyncStorage.setItem("user", "{}");
      navigationRef.dispatch(StackActions.replace("Login"));
    } catch (error) {
      console.log(error);
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
    const masterExpanded = [
      expanded1,
      expanded2,
      expanded3,
      expanded4,
      expanded5,
      expanded6,
      expanded7,
      expanded8,
      expanded9,
    ];
    const masterSetExpanded = [
      setExpanded1,
      setExpanded2,
      setExpanded3,
      setExpanded4,
      setExpanded5,
      setExpanded6,
      setExpanded7,
      setExpanded8,
      setExpanded9,
    ];
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItem
          key="Home"
          focused={activeIndex === -1 ? true : false}
          style={[Styles.borderBottom1]}
          activeBackgroundColor={theme.colors.primary}
          inactiveBackgroundColor={theme.colors.textLight}
          label={({ focused }) => {
            return (
              <Text
                style={[
                  Styles.textColor,
                  Styles.fontSize16,
                  {
                    color: focused ? theme.colors.textLight : theme.colors.text,
                  },
                ]}
              >
                Dashboard
              </Text>
            );
          }}
          icon={({ focused }) => (
            <Icon
              color={
                focused ? theme.colors.textLight : theme.colors.textSecondary
              }
              size={24}
              name="view-dashboard"
            />
          )}
          onPress={(e) => {
            activeIndex = -1;
            props.navigation.navigate("HomeScreen");
          }}
        />
        {menuItems.map((k, i) => {
          return k.roleID === parseInt(userDetails[0].RoleID) ? (
            k.type === "item" && k.title != "Logout" ? (
              <DrawerItem
                key={i}
                focused={activeIndex === parseInt(i) ? true : false}
                style={[Styles.borderBottom1]}
                label={({ focused }) => {
                  return (
                    <Text
                      style={[
                        Styles.textColor,
                        Styles.fontSize16,
                        {
                          color: focused
                            ? theme.colors.primary
                            : theme.colors.text,
                        },
                      ]}
                    >
                      {k.title}
                    </Text>
                  );
                }}
                icon={({ focused }) => (
                  <Icon
                    color={
                      focused
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                    size={24}
                    name={k.icon}
                  />
                )}
                onPress={(e) => {
                  if (k.navigation !== undefined) {
                    activeIndex = parseInt(i);
                    props.navigation.navigate(k.navigation);
                  }
                }}
              />
            ) : k.type === "item" && k.title == "Logout" ? (
              <DrawerItem
                key={i}
                focused={activeIndex === parseInt(i) ? true : false}
                style={[Styles.borderBottom1]}
                label={({ focused }) => {
                  return (
                    <Text
                      style={[
                        Styles.textColor,
                        Styles.fontSize16,
                        {
                          color: focused
                            ? theme.colors.primary
                            : theme.colors.text,
                        },
                      ]}
                    >
                      {k.title}
                    </Text>
                  );
                }}
                icon={({ focused }) => (
                  <Icon
                    color={
                      focused
                        ? theme.colors.primary
                        : theme.colors.textSecondary
                    }
                    size={24}
                    name={k.icon}
                  />
                )}
                onPress={(e) => {
                  LogoutUser();
                }}
              />
            ) : (
              <List.Accordion
                key={i}
                title={k.title}
                expanded={
                  i == 0
                    ? expanded1
                    : i == 1
                    ? expanded2
                    : i == 2
                    ? expanded3
                    : i == 3
                    ? expanded4
                    : i == 4
                    ? expanded5
                    : i == 5
                    ? expanded6
                    : i == 6
                    ? expanded7
                    : i == 7
                    ? expanded8
                    : expanded9
                }
                left={(props) => <List.Icon {...props} icon={k.icon} />}
                style={[
                  Styles.backgroundColor,
                  Styles.borderBottom1,
                  Styles.height56,
                  { paddingTop: -8 },
                ]}
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
                      style={{
                        marginVertical: 0,
                        paddingStart: 16,
                        width: "100%",
                        marginLeft: 0,
                        borderRadius: 0,
                        borderBottomColor: theme.colors.textLightSecondary,
                        borderBottomWidth: 1,
                      }}
                      focused={
                        activeIndex === parseInt(i.toString() + l.toString())
                          ? true
                          : false
                      }
                      label={({ focused }) => (
                        <Text
                          style={[
                            Styles.textColor,
                            Styles.fontSize16,
                            {
                              color: focused
                                ? theme.colors.textLight
                                : theme.colors.text,
                            },
                          ]}
                        >
                          {j.title}
                        </Text>
                      )}
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
        <Drawer.Navigator
          drawerContent={(props) => <DrawerContent {...props} />}
          initialRouteName="HomeScreen"
        >
          <Drawer.Screen
            options={{ headerShown: false, unmountOnBlur: true }}
            name="HomeScreen"
            component={HomeScreen}
            initialParams={{ userDetails: userDetails, setUserFunc: SetUser }}
          />
        </Drawer.Navigator>
      );
    } else {
      switch (parseInt(userDetails[0].RoleID)) {
        case 0:
          return (
            <Drawer.Navigator
              drawerContent={(props) => <DrawerContent {...props} />}
              initialRouteName="HomeScreen"
            >
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="HomeScreen"
                component={HomeScreen}
                initialParams={{
                  userDetails: userDetails,
                  setUserFunc: SetUser,
                }}
              />
            </Drawer.Navigator>
          );
        case 2:
          return (
            <Drawer.Navigator
              drawerContent={(props) => <DrawerContent {...props} />}
              initialRouteName="HomeScreen"
            >
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="HomeScreen"
                component={HomeScreen}
                initialParams={{
                  userDetails: userDetails,
                  setUserFunc: SetUser,
                }}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ActivityRolesScreen"
                component={ActivityRolesScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ServicesScreen"
                component={ServicesScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="UnitOfSalesScreen"
                component={UnitOfSalesScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="CategoryScreen"
                component={CategoryScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ProductScreen"
                component={ProductScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="DepartmentScreen"
                component={DepartmentScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="LocationTypeScreen"
                component={LocationTypeScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="DesignationScreen"
                component={DesignationScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ServiceProductScreen"
                component={ServiceProductScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="EWayBillScreen"
                component={EWayBillScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="WorkFloorScreen"
                component={WorkFloorScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="WorkLocationScreen"
                component={WorkLocationScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="DesignTypeScreen"
                component={DesignTypeScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="MaterialSetupScreen"
                component={MaterialSetupScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="PostNewDesignScreen"
                component={PostNewDesignScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ApprovedUserScreen"
                component={ApprovedUserScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="DeclinedUserScreen"
                component={DeclinedUserScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="PendingUserScreen"
                component={PendingUserScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ApiMaster"
                component={ApiMaster}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="CategoryNameScreen"
                component={CategoryNameScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="SubCategoryNameScreen"
                component={SubCategoryNameScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ABrandConversationValue"
                component={ABrandConversationValue}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="WidthOfGpCoil"
                component={WidthOfGpCoil}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="MassOfZincCoating"
                component={MassOfZincCoating}
              />
            </Drawer.Navigator>
          );
        case 3:
          return (
            <Drawer.Navigator
              drawerContent={(props) => <DrawerContent {...props} />}
              initialRouteName="HomeScreen"
            >
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="HomeScreen"
                component={HomeScreen}
                initialParams={{
                  userDetails: userDetails,
                  setUserFunc: SetUser,
                }}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ImageGalleryScreen"
                component={ImageGalleryScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="YourEstimationsScreen"
                component={YourEstimationsScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GCategoryNameScreen"
                component={GCategoryNameScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GSubCategoryNameScreen"
                component={GSubCategoryNameScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GMyContactsScreen"
                component={GMyContactsScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GMyBankScreen"
                component={GMyBankScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="BudgetSetup"
                component={BudgetSetup}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ExpensesListGeneralUserScreen"
                component={ExpensesListGeneralUserScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="SourceListGeneralUserScreen"
                component={SourceListGeneralUserScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="BankTransactionScreen"
                component={BankTransactionScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="PocketTransactionGeneralUserScreen"
                component={PocketTransactionGeneralUserScreen}
              />

              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="Demo"
                component={Demo}
              />
            </Drawer.Navigator>
          );
        case 5: // Contractor
          return (
            <Drawer.Navigator
              drawerContent={(props) => <DrawerContent {...props} />}
              initialRouteName="HomeScreen"
            >
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="HomeScreen"
                component={HomeScreen}
                initialParams={{
                  userDetails: userDetails,
                  setUserFunc: SetUser,
                }}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="MyServicesScreen"
                component={MyServicesScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="CommonDepartmentScreen"
                component={CommonDepartmentScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="CommonDesignationScreen"
                component={CommonDesignationScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="DesignWiseScreen"
                component={DesignWiseScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="QuotationWiseScreen"
                component={QuotationWiseScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ClientScreen"
                component={ClientScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="EmployeeListScreen"
                component={EmployeeListScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="BranchListScreen"
                component={BranchListScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="EnquiryWise"
                component={EnquiryWise}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="RateCardSetUp"
                component={RateCardSetUp}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GCategoryNameScreen"
                component={GCategoryNameScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GSubCategoryNameScreen"
                component={GSubCategoryNameScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GMyContactsScreen"
                component={GMyContactsScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GMyBankScreen"
                component={GMyBankScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="BudgetSetup"
                component={BudgetSetup}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="AddExpensesList"
                component={AddExpensesList}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="AddSourceList"
                component={AddSourceList}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="VerifyCompanySource"
                component={VerifyCompanySource}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="VerifyCompanyExpense"
                component={VerifyCompanyExpense}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="AddBankScreen"
                component={AddBankScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="BankListScreen"
                component={BankListScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="MyPersonalBankScreen"
                component={MyPersonalBankScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="BankTransactionScreen"
                component={BankTransactionScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="PocketTransactionScreen"
                component={PocketTransactionScreen}
              />
            </Drawer.Navigator>
          );
        case 4:
          return (
            <Drawer.Navigator
              drawerContent={(props) => <DrawerContent {...props} />}
              initialRouteName="HomeScreen"
            >
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="HomeScreen"
                component={HomeScreen}
                initialParams={{
                  userDetails: userDetails,
                  setUserFunc: SetUser,
                }}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="MyServicesScreen"
                component={MyServicesScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="DealerPresentationScreen"
                component={DealerPresentationScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="DealerBrandMasterScreen"
                component={DealerBrandMasterScreen}
                initialParams={{ activeIndex: activeIndex }}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="DealerBrandSetupScreen"
                component={DealerBrandSetupScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="DealerBuyerCategoryScreen"
                component={DealerBuyerCategoryScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="DealerProductScreen"
                component={DealerProductScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="CommonDepartmentScreen"
                component={CommonDepartmentScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="CommonDesignationScreen"
                component={CommonDesignationScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ClientScreen"
                component={ClientScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="EmployeeListScreen"
                component={EmployeeListScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="BranchListScreen"
                component={BranchListScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="BankTransactionScreen"
                component={BankTransactionScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="PocketTransactionScreen"
                component={PocketTransactionScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="AddSourceList"
                component={AddSourceList}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="AddExpensesList"
                component={AddExpensesList}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="VerifyCompanySource"
                component={VerifyCompanySource}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="VerifyCompanyExpense"
                component={VerifyCompanyExpense}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GCategoryNameScreen"
                component={GCategoryNameScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GSubCategoryNameScreen"
                component={GSubCategoryNameScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GMyContactsScreen"
                component={GMyContactsScreen}
              />
            </Drawer.Navigator>
          );
        case 9:
          return (
            <Drawer.Navigator
              drawerContent={(props) => <DrawerContent {...props} />}
              initialRouteName="HomeScreen"
            >
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="HomeScreen"
                component={HomeScreen}
                initialParams={{
                  userDetails: userDetails,
                  setUserFunc: SetUser,
                }}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="CommonDepartmentScreen"
                component={CommonDepartmentScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="CommonDesignationScreen"
                component={CommonDesignationScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ClientScreen"
                component={ClientScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="EmployeeListScreen"
                component={EmployeeListScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ArchitectRateCardSetup"
                component={ArchitectRateCardSetup}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="BranchListScreen"
                component={BranchListScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="PocketTransactionScreen"
                component={PocketTransactionScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="BankTransactionScreen"
                component={BankTransactionScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="AddExpensesList"
                component={AddExpensesList}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="AddSourceList"
                component={AddSourceList}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GCategoryNameScreen"
                component={GCategoryNameScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GSubCategoryNameScreen"
                component={GSubCategoryNameScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GMyContactsScreen"
                component={GMyContactsScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="VerifyCompanySource"
                component={VerifyCompanySource}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="VerifyCompanyExpense"
                component={VerifyCompanyExpense}
              />
            </Drawer.Navigator>
          );
        case 7:
          return (
            <Drawer.Navigator
              drawerContent={(props) => <DrawerContent {...props} />}
              initialRouteName="HomeScreen"
            >
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="HomeScreen"
                component={HomeScreen}
                initialParams={{
                  userDetails: userDetails,
                  setUserFunc: SetUser,
                }}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="BrandConversionValue"
                component={BrandConversionValue}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="OpeningStockList"
                component={OpeningStockList}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="OpeningStockScrap"
                component={OpeningStockScrap}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ProductforProduction"
                component={ProductforProduction}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ProductionStatus"
                component={ProductionStatus}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ProductionOrderList"
                component={ProductionOrderList}
              />

              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GCategoryNameScreen"
                component={GCategoryNameScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GSubCategoryNameScreen"
                component={GSubCategoryNameScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="GMyContactsScreen"
                component={GMyContactsScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="MyPersonalBankScreen"
                component={MyPersonalBankScreen}
              />

              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="AddExpensesList"
                component={AddExpensesList}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="AddSourceList"
                component={AddSourceList}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="VerifyCompanySource"
                component={VerifyCompanySource}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="VerifyCompanyExpense"
                component={VerifyCompanyExpense}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="BankTransactionScreen"
                component={BankTransactionScreen}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="PocketTransactionScreen"
                component={PocketTransactionScreen}
              />
              {/* <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="GMyBankScreen" component={GMyBankScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="BudgetSetup" component={BudgetSetup} />
              
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="AddBankScreen" component={AddBankScreen} />
              <Drawer.Screen options={{ headerShown: false, unmountOnBlur: true }} name="BankListScreen" component={BankListScreen} /> */}
            </Drawer.Navigator>
          );
        case 8:
          return (
            <Drawer.Navigator
              drawerContent={(props) => <DrawerContent {...props} />}
              initialRouteName="HomeScreen"
            >
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="HomeScreen"
                component={HomeScreen}
                initialParams={{
                  userDetails: userDetails,
                  setUserFunc: SetUser,
                }}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="BrandConversionValue"
                component={BrandConversionValue}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="OpeningStockList"
                component={OpeningStockList}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="OpeningStockScrap"
                component={OpeningStockScrap}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ProductforProduction"
                component={ProductforProduction}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ProductionStatus"
                component={ProductionStatus}
              />
              <Drawer.Screen
                options={{ headerShown: false, unmountOnBlur: true }}
                name="ProductionOrderList"
                component={ProductionOrderList}
              />
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

    switch (parseInt(userDetails[0].RoleID)) {
      case 2:
        return (
          <Tab.Navigator
            shifting={false}
            initialRouteName="dashboard"
            activeColor={theme.colors.primary}
            inactiveColor="#696969"
            barStyle={{
              backgroundColor: theme.colors.textLight,
              height: 70,
              paddingTop: 8,
            }}
          >
            <Tab.Screen
              name="Dashboard"
              component={DrawerNavigator}
              options={{
                unmountOnBlur: false,
                tabBarLabel: "Dashboard",
                tabBarIcon: ({ color }) => (
                  <Icon name="view-dashboard" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="Feedbacks"
              component={FeedbackScreen}
              options={{
                unmountOnBlur: true,
                tabBarLabel: "Suggestions",
                tabBarIcon: ({ color }) => (
                  <Icon name="comment-alert" color={color} size={26} />
                ),
              }}
            />
          </Tab.Navigator>
        );
      default:
        return (
          <Tab.Navigator
            shifting={false}
            initialRouteName="dashboard"
            activeColor={theme.colors.primary}
            inactiveColor="#696969"
            barStyle={{
              backgroundColor: theme.colors.textLight,
              height: 70,
              paddingTop: 8,
            }}
          >
            <Tab.Screen
              name="Dashboard"
              component={DrawerNavigator}
              options={{
                unmountOnBlur: false,
                tabBarLabel: "Dashboard",
                tabBarIcon: ({ color }) => (
                  <Icon name="view-dashboard" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="PocketDiary"
              component={PocketDiaryScreen}
              initialParams={{ userDetails: userDetails, setUserFunc: SetUser }}
              options={{
                unmountOnBlur: true,
                tabBarLabel: "Pocket Diary",
                tabBarIcon: ({ color }) => (
                  <Icon name="calculator-variant" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="Feedbacks"
              component={FeedbackScreen}
              options={{
                unmountOnBlur: true,
                tabBarLabel: "Suggestions",
                tabBarIcon: ({ color }) => (
                  <Icon name="comment-alert" color={color} size={26} />
                ),
              }}
            />
            <Tab.Screen
              name="UserProfile"
              component={
                parseInt(userDetails[0].RoleID) === 4
                  ? BasicDetailsScreen
                  : parseInt(userDetails[0].RoleID) === 3
                  ? UserProfile
                  : parseInt(userDetails[0].RoleID) === 2
                  ? UserProfile
                  : parseInt(userDetails[0].RoleID) === 5
                  ? BasicDetailsScreen
                  : parseInt(userDetails[0].RoleID) === 6
                  ? UserProfile
                  : UserProfileScreen
              }
              options={{
                unmountOnBlur: true,
                tabBarLabel: "User Profile",
                tabBarIcon: ({ color }) => (
                  <Icon name="account" color={color} size={26} />
                ),
              }}
            />
          </Tab.Navigator>
        );
    }
  };

  return (
    <SafeAreaView
      style={[
        Styles.flex1,
        Styles.backgroundColorWhite,
        { paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0 },
      ]}
    >
      <PaperProvider theme={theme}>
        {userDetails[0] === null ? (
          <View
            style={[
              Styles.flex1,
              Styles.flexGrow,
              Styles.flexJustifyCenter,
              Styles.flexAlignCenter,
              Styles.backgroundColor,
            ]}
          >
            <Text>Initilizing Application...</Text>
          </View>
        ) : (
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
              initialRouteName={
                Object.keys(userDetails[0]).length !== 0 ? "HomeStack" : "Login"
              }
            >
              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{ headerShown: false }}
                initialParams={{ setUserFunc: SetUser }}
              />
              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{
                  headerTitle: "",
                  headerTintColor: theme.colors.primary,
                  headerBackImage: () => (
                    <Icon
                      name="arrow-left-thin"
                      color={theme.colors.primary}
                      size={32}
                    />
                  ),
                }}
                initialParams={{ setUserFunc: SetUser }}
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPassword}
                options={{
                  headerTitle: "",
                  headerTintColor: theme.colors.primary,
                  headerBackImage: () => (
                    <Icon
                      name="arrow-left-thin"
                      color={theme.colors.primary}
                      size={32}
                    />
                  ),
                }}
              />
              <Stack.Screen
                name="HomeStack"
                component={BottomTabs}
                options={{ headerShown: false }}
              />{" "}
              <Stack.Screen
                name="JobPostingForm"
                component={JobPostingForm}
                options={{
                  headerTitle: "Post a Job",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="LookingForAJobJobGroup"
                component={SelectGroupType}
                options={{
                  headerTitle: "Select Job Group",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AreaOfInterest"
                component={AreaOfInterest}
                options={{
                  headerTitle: "Area Of Interest",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="JobListingEmployee"
                component={JobListing}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="JobSeekerForm"
                component={JobSeekerForm}
                options={{
                  headerTitle: "Job Seeker Form",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="DesignYourDreamCategories"
                component={DesignYourDreamCategories}
                options={{
                  headerTitle: "Design Your Dream",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="DesignYourDreamForm"
                component={DesignYourDreamForm}
                options={{
                  headerTitle: "Property Details",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddActivityRolesScreen"
                component={AddActivityRolesScreen}
                options={{
                  headerTitle: "Add Activity Roles",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddApiMaster"
                component={AddApiMaster}
                options={{
                  headerTitle: "Add Api Master",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddServicesScreen"
                component={AddServicesScreen}
                options={{
                  headerTitle: "Add Services",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddUnitOfSalesScreen"
                component={AddUnitOfSalesScreen}
                options={{
                  headerTitle: "Add Unit of Sales",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddCategoryScreen"
                component={AddCategoryScreen}
                options={{
                  headerTitle: "Add Category",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddProductScreen"
                component={AddProductScreen}
                options={{
                  headerTitle: "Add Product",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddDepartmentScreen"
                component={AddDepartmentScreen}
                options={{
                  headerTitle: "Add Department",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddDesignationScreen"
                component={AddDesignationScreen}
                options={{
                  headerTitle: "Add Designation",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddServiceProductScreen"
                component={AddServiceProductScreen}
                options={{
                  headerTitle: "Add Service Product",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddEWayBillScreen"
                component={AddEWayBillScreen}
                options={{
                  headerTitle: "Add E-Way Bill",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddLocationTypeScreen"
                component={AddLocationTypeScreen}
                options={{
                  headerTitle: "Add Location Type",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddWorkFloorScreen"
                component={AddWorkFloorScreen}
                options={{
                  headerTitle: "Add Work Floor",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddWorkLocationScreen"
                component={AddWorkLocationScreen}
                options={{
                  headerTitle: "Add Work Location",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddDesignTypeScreen"
                component={AddDesignTypeScreen}
                options={{
                  headerTitle: "Add Design Type",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddPostNewDesignScreen"
                component={AddPostNewDesignScreen}
                options={{
                  headerTitle: "Add Post New Design",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddDealerBrandMasterScreen"
                component={AddDealerBrandMasterScreen}
                options={{
                  headerTitle: "Add Brand",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddDealerBrandSetupScreen"
                component={AddDealerBrandSetupScreen}
                options={{
                  headerTitle: "Add Brand Setup",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddDealerBuyerCategoryScreen"
                component={AddDealerBuyerCategoryScreen}
                options={{
                  headerTitle: "Add Buyer Category",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddDealerProductScreen"
                component={AddDealerProductScreen}
                options={{
                  headerTitle: "Add Product",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddMaterialSetupScreen"
                component={AddMaterialSetupScreen}
                options={{
                  headerTitle: "Add Material Setup",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddMyServicesScreen"
                component={AddMyServicesScreen}
                options={{
                  headerTitle: "Add My Services",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddCommonDepartmentScreen"
                component={AddCommonDepartmentScreen}
                options={{
                  headerTitle: "Add Department",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddCommonDesignationScreen"
                component={AddCommonDesignationScreen}
                options={{
                  headerTitle: "Add Designation",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="ImageGalleryWorkLocationScreen"
                component={ImageGalleryWorkLocationScreen}
                options={{
                  headerTitle: "Image Gallery",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="EstimationPreviewScreen"
                component={EstimationPreviewScreen}
                options={{
                  headerTitle: "Design Estimation",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="GetEstimationScreen"
                component={GetEstimationScreen}
                options={{
                  headerTitle: "Design Estimation",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="EmployeeEditScreen"
                component={EmployeeEditScreen}
                options={{
                  headerTitle: "Employee Basic Edit",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="ClientEditScreen"
                component={ClientEditScreen}
                options={{
                  headerTitle: "Client Basic Edit",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="PocketScreenOne"
                component={PocketDiaryScreenOne}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="SearchNAdd"
                component={SearchNAdd}
                options={{
                  headerTitle: "Search & Add Employee",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{
                  headerTitle: "Basic Details",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="RateCardSetup"
                component={RateCardSetUp}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="AddRateCard" component={AddRateCard} />
              <Stack.Screen
                name="ArchitectRateCardSetup"
                component={ArchitectRateCardSetup}
              />
              <Stack.Screen
                name="MaterialCalculatorScreen"
                component={MaterialCalculatorScreen}
                options={{
                  headerTitle: "Material Calculator",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen name="Demo" component={Demo} />
              <Stack.Screen
                name="SearchClientScreen"
                component={SearchClientScreen}
                options={{
                  headerTitle: "Search Client",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddClientScreen"
                component={AddClientScreen}
                options={{
                  headerTitle: "Add Client",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="SearchEmployee"
                component={SearchEmployee}
                options={{
                  headerTitle: "Search Employee",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddEmployee"
                component={AddEmployee}
                options={{
                  headerTitle: "Add Employee",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="SendRateCard"
                component={SendRateCard}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="BranchEditScreen"
                component={BranchEditScreen}
                options={{
                  headerTitle: "Add Branch",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddSendRateCard"
                component={AddSendRateCard}
                options={{
                  headerTitle: "Add Send Rate card ",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="BudgetSetup"
                component={BudgetSetup}
                options={{
                  headerTitle: "Budget Setup ",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddBudgetSetup"
                component={AddBudgetSetup}
                options={{
                  headerTitle: " Add Budget Setup ",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddExpenses"
                component={AddExpenses}
                options={{
                  headerTitle: " Add Expenses ",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddSource"
                component={AddSource}
                options={{
                  headerTitle: " Add Source ",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              {/* <Stack.Screen name="Inbox" component={Inbox} options={{ headerTitle: "Inbox ", headerStyle: [Styles.primaryBgColor, Styles.height64], headerTitleStyle: { color: theme.colors.textLight }, headerTintColor: theme.colors.textLight }} /> */}
              <Stack.Screen
                name="BrandConversionValue"
                component={BrandConversionValue}
                options={{
                  headerTitle: "Brand Conversion Value ",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="OpeningStockList"
                component={OpeningStockList}
                options={{
                  headerTitle: "Opening Stock List ",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddStockList"
                component={AddStockList}
                options={{
                  headerTitle: "Add Stock List ",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="EditStockList"
                component={EditStockList}
                options={{
                  headerTitle: "Edit Stock List ",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="OpeningStockScrap"
                component={openingStockScrap}
                options={{
                  headerTitle: "Opening Stock Scrap ",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddOpeningStockScrap"
                component={AddOpeningStockScrap}
                options={{
                  headerTitle: "Add Opening Stock Scrap",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="EditStockScrap"
                component={EditStockScrap}
                options={{
                  headerTitle: "Edit  Stock Scrap",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="ApiMaster"
                component={ApiMaster}
                options={{
                  headerTitle: "Api Master",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="ProductforProduction"
                component={ProductforProduction}
                options={{
                  headerTitle: "Product For Production ",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddProduction"
                component={AddProduction}
                options={{
                  headerTitle: "Add Production For Production",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="EditProductForProduction"
                component={EditProductForProduction}
                options={{
                  headerTitle: "Edit Production For Production",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="EditProductionStatus"
                component={EditProductionStatus}
                options={{
                  headerTitle: "Edit  Production Status",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="ProductionOrderList"
                component={ProductionOrderList}
                options={{
                  headerTitle: "Production Order List ",
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddProductOrderList"
                component={AddProductOrderList}
                options={{
                  headerTitle: "Add Product Order List",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="EditProductOrderList"
                component={EditProductOrderList}
                options={{
                  headerTitle: "Edit Product Order List ",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddProductionStatus"
                component={AddProductionStatus}
                options={{
                  headerTitle: "Add Production Status",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="CategoryNameScreen"
                component={CategoryNameScreen}
                options={{
                  headerTitle: "Category",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddCategoryNameScreen"
                component={AddCategoryNameScreen}
                options={{
                  headerTitle: "Add Category",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddGCategoryNameScreen"
                component={AddGCategoryNameScreen}
                options={{
                  headerTitle: "Add Category",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddGSubCategoryNameScreen"
                component={AddGSubCategoryNameScreen}
                options={{
                  headerTitle: "Add Sub Category",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="SubCategoryNameScreen"
                component={SubCategoryNameScreen}
                options={{
                  headerTitle: "Sub Category",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddSubCategoryNameScreen"
                component={AddSubCategoryNameScreen}
                options={{
                  headerTitle: "Add Sub Category",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddGMyContactsScreen"
                component={AddGMyContactsScreen}
                options={{
                  headerTitle: "Add Contacts",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="GMyBankScreen"
                component={GMyBankScreen}
                options={{
                  headerTitle: " My Bank",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="PhoneContacts"
                component={PhoneContacts}
                options={{
                  headerTitle: "Phone Contacts",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="PhoneContactDirectUpload"
                component={PhoneContactDirectUpload}
                options={{
                  headerTitle: "Phone Contacts",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddGMyBankScreen"
                component={AddGMyBankScreen}
                options={{
                  headerTitle: " Add Bank Account",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="ABrandConversationValue"
                component={ABrandConversationValue}
                options={{
                  headerTitle: "Brand Conversation Value",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddBrandConversationValue"
                component={AddBrandConversationValue}
                options={{
                  headerTitle: "Add Brand Conversation Value",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="WidthOfGpCoil"
                component={WidthOfGpCoil}
                options={{
                  headerTitle: "Width Of Gp Coil",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddWidthOfGpCoil"
                component={AddWidthOfGpCoil}
                options={{
                  headerTitle: "Add Width Of Gp Coil",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="MassOfZincCoating"
                component={MassOfZincCoating}
                options={{
                  headerTitle: "Mass Of Zinc Coating",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddMassOfZincCoating"
                component={AddMassOfZincCoating}
                options={{
                  headerTitle: "Add Mass Of Zinc Coating",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddBankDetails"
                component={AddBankDetails}
                options={{
                  headerTitle: "Add Bank Details",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="PayableList"
                component={PayableList}
                options={{
                  headerTitle: "Payable List",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="ReceivableList"
                component={ReceivableList}
                options={{
                  headerTitle: "Receivable List",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="BankListScreen"
                component={BankListScreen}
                options={{
                  headerTitle: "Bank List Screen",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="PDCDataUpdate"
                component={PDCDataUpdate}
                options={{
                  headerTitle: "Update PDC Details",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="AddMyPersonalBank"
                component={AddMyPersonalBank}
                options={{
                  headerTitle: "Add My Personal Bank",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="BranchWiseTransactionScreen"
                component={BranchWiseTransactionScreen}
                options={{
                  headerTitle: "BRANCH WISE CASH",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="EstimationContractorStatusScreen"
                component={EstimationContractorStatusScreen}
                options={{
                  headerTitle: "Estimation Contractor List",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
              <Stack.Screen
                name="BranchWiseCashDetailScreen"
                component={BranchWiseCashDetailScreen}
                options={{
                  headerTitle: "Branch Cash Details",
                  headerBackTitleVisible: false,
                  headerStyle: [Styles.primaryBgColor, Styles.height64],
                  headerTitleStyle: { color: theme.colors.textLight },
                  headerTintColor: theme.colors.textLight,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        )}
      </PaperProvider>
    </SafeAreaView>
  );
}
