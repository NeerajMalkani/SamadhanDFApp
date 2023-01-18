//import { View } from "react-native";
// import {Stylesone} from "../styles/stylesone";

import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, Text, Image, Button, TouchableOpacity } from "react-native";

import { FAB, List, Searchbar, Snackbar, RadioButton } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../api/Provider";
import Header from "../components/Header";
import { RenderHiddenItems } from "../components/ListActions";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../components/NoItems";
import { Styles } from "../styles/styles";
import { theme } from "../theme/apptheme";
import { height } from "@fortawesome/free-solid-svg-icons/faBarsStaggered";
// import Dashboard from 'react-native-dashboard';
import { FontAwesome } from 'react-native-vector-icons';

const Icon = ({ icon, item, background }) => (
  <FontAwesome
    name={icon}
    size={40}
    color={
      item.iconColor || (!item.background || !background ? '#fff' : '#fff')
    }
    style={item.styleIcon}
  />
);


const data = [
  {
    name: 'SOURCE',
    background: '#03BBB0',
    icon: (item, background) => Icon({ icon: 'arrow-circle-down', item, background }),
    iconColor: '#FFF',
    link:'AddSourceList',
  },
  {
    name: 'EXPENSE',
    background: '#03BBB0',
    icon: (item, background) => Icon({ icon: 'arrow-circle-up', item, background }),
    styleIcon: { color: '#FFF' },
    link:'AddExpensesList',
  },
  {
    name: 'PAYABLE',
    background: '#03BBB0',
    icon: (item, background) => Icon({ icon: 'level-up', item, background }),
    link:'PayableList',
  },
  {
    name: 'RECEIVABLE',
    background: '#03BBB0',
    icon: (item, background) => Icon({ icon: 'level-down', item, background }),
    styleName: { color: '#FFF', fontWeight: 'bold' },
    link:'ReceivableList',
  },
  {
    name: 'POCKET',
    nameColor: '#FFF',
    background: '#03BBB0',
    icon: (item, background) => Icon({ icon: 'get-pocket', item, background }),
    link:'ApprovedUserScreen',
  },
  {
    name: 'BANK',
    background: '#03BBB0',
    icon: (item, background) => Icon({ icon: 'bank', item, background }),
    link:'ApprovedUserScreen',
  },
];

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const PocketDiaryScreen = ({ navigation }) => {
  //#region Variables
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);
  const [value, setValue] = React.useState("");
  const [errorCAT, setErrorCAT] = React.useState(false);
  const [checked, setChecked] = useState('first');

  //const card = ({ name }) => console.log('Card: ' + name);
  const card = ({ link }) => navigation.navigate(link);
  ;
  //#endregion 

  //#region Functions

  useEffect(() => {
    //FetchData();
  }, []);
  //#region Functions

  //#endregion 

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Pocket Diary" />
      <Dashboard
        data={data}
        background={true}
        card={card}
        column={2}
        rippleColor={'#3498db'}
      />

    </View>
  );
}

export default PocketDiaryScreen;