import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import React, { useEffect } from "react";
import CollapsibleView from "@eliav2/react-native-collapsible-view";
import { View } from "react-native";
import { MenuItemsAdmin, MenuItemsGeneralUser } from "../json/MenuItems";
import ActivityRolesScreen from "../screens/Master/ActivityRolesScreen";
import ServicesScreen from "../screens/Master/ServicesScreen";
import UnitOfSalesScreen from "../screens/Master/UnitOfSalesScreen";
import CategoryScreen from "../screens/Master/CategoryScreen";
import ImageGalleryScreen from "../screens/BrandAndProducts/ImageGalleryScreen";
import YourEstimationsScreen from "../screens/BrandAndProducts/YourEstimationsScreen";

const Drawer = createDrawerNavigator();

const DrawerScreen = () => {
  let menuItems = [];
  menuItems = [...MenuItemsGeneralUser];
  //   const GetRoleID = async () => {
  //     try {
  //       const value = await AsyncStorage.getItem("user");
  //       if (value) {
  //         switch (JSON.parse(value).RoleID) {
  //           case 1:
  //             menuItems = [...MenuItemsAdmin];
  //             break;
  //           case 2:
  //             menuItems = [...MenuItemsGeneralUser];
  //             break;
  //         }
  //         setRoleID(JSON.parse(value).RoleID);
  //       }
  //     } catch (error) {}
  //   };
  //   useEffect(() => {
  //     GetRoleID();
  //   }, [roleID]);

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

  //const DrawerNavigator = () => {
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
  //};
};

export default DrawerScreen;
