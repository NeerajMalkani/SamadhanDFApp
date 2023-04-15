import { View } from "react-native";
import { Snackbar } from "react-native-paper";

import React from "react";
import { TabBar, TabView } from "react-native-tab-view";
import { Styles } from "../../../styles/styles";
import Header from "../../../components/Header";
import AddUpdate from "./Add&Update";
import SendPending from "./SendPending";
import ApprovePending from "./ApprovePending";
import Approved from "./Approved";
import { theme } from "../../../theme/apptheme";
import { useEffect } from "react";

const renderTabBar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: theme.colors.primary }}
    style={{ backgroundColor: theme.colors.textLight }}
    inactiveColor={theme.colors.textSecondary}
    activeColor={theme.colors.primary}
    scrollEnabled={true}
    // tabStyle={{ width: windowWidth / 4 }}
    labelStyle={[Styles.fontSize13, Styles.fontBold]}
  />
);

const BudgetBOQ = ({ navigation, route }) => {
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );
  const unload = (msg, color = theme.colors.success) => {
    setSnackbarText(msg);
    setSnackbarColor(color);
    setSnackbarVisible(true);
  };
  const routes = [
    { key: "add-update", title: "Create Budget" },
    { key: "send-pending", title: "Budget Send Pending List" },
    { key: "approved-pending", title: "Budget Approve Pending List" },
    { key: "approved", title: "Budget & BOQ Approved List" },
  ];
  const [index, setIndex] = React.useState(0);
  useEffect(() => {
    if (route?.params?.index) {
      setIndex(route.params.index);
    } else {
      setIndex(0);
    }
  }, [setIndex]);
  const renderScene = ({ route }) => {
    switch (route.key) {
      case "add-update":
        return (
          <AddUpdate index={index} navigation={navigation} unload={unload} />
        );
      case "send-pending":
        return (
          <SendPending index={index} navigation={navigation} unload={unload} />
        );
      case "approved-pending":
        return (
          <ApprovePending
            index={index}
            navigation={navigation}
            unload={unload}
          />
        );
      case "approved":
        return (
          <Approved index={index} navigation={navigation} unload={unload} />
        );
    }
  };

  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <Header navigation={navigation} title="Budgets & BOQ's" />
      <TabView
        renderTabBar={renderTabBar}
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarColor }}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default BudgetBOQ;
