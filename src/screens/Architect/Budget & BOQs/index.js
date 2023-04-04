import { View, Text, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import { TabBar, TabView } from 'react-native-tab-view';
import { Styles } from '../../../styles/styles';
import Header from '../../../components/Header';
import AddUpdate from './Add&Update';
import SendPending from './SendPending';
import ApprovePending from './ApprovePending';
import Approved from './Approved';
import { theme } from '../../../theme/apptheme';
const windowWidth = Dimensions.get('window').width;

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
  const routes = [
    { key: 'add-update', title: 'Create Budget' },
    { key: 'send-pending', title: 'Budget Send Pending List' },
    { key: 'approved-pending', title: 'Budget Approve Pending List' },
    { key: 'approved', title: 'Budget & BOQ Approved List' },
  ];
  const [index, setIndex] = React.useState(0);
  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'add-update':
        return <AddUpdate index={index} />;
      case 'send-pending':
        return <SendPending index={index} />;
      case 'approved-pending':
        return <ApprovePending index={index} />;
      case 'approved':
        return <Approved index={index} />;
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
    </View>
  );
};

export default BudgetBOQ;
