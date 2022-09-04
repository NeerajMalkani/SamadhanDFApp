//import { View } from "react-native";
//import { Styles } from "../styles/styles";

import React, { useEffect } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl } from "react-native";

import { FAB, List, Searchbar, Snackbar, RadioButton } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../api/Provider";
import Header from "../components/Header";
import { RenderHiddenItems } from "../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../components/NoItems";
import { Styles } from "../styles/styles";
import { theme } from "../theme/apptheme";


LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const PocketDiaryScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = React.useState(true);
    const listData = React.useState([]);
    const listSearchData = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState("");
    const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);
    const [value, setValue] = React.useState("");

    useEffect(() => {
        //FetchData();
      }, []);

    //return <View style={[Styles.flex1]}></View>;

    return (
        <View style={[Styles.flex1]}>
          <Header navigation={navigation} title="Pocket Diary" />
          
          <RadioButton.Group
          style={[Styles.width100per]}
                  onValueChange={(value) => {
                    setValue(value);
                    //setErrorCAT(false);
                  }}
                  value={value}
                >
                  <RadioButton.Item position="leading" style={[Styles.paddingHorizontal2]} labelStyle={[Styles.textLeft, Styles.paddingStart4]} label="Company" value="1" />
                  <RadioButton.Item position="leading" style={[Styles.paddingHorizontal2]} labelStyle={[Styles.textLeft, Styles.paddingStart4]} label="Self" value="2" />
                  <RadioButton.Item position="leading" style={[Styles.paddingHorizontal2]} labelStyle={[Styles.textLeft, Styles.paddingStart4]} label="Both" value="3" />
                </RadioButton.Group>

          <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
            {snackbarText}
          </Snackbar>
        </View>
      );
}

export default PocketDiaryScreen;