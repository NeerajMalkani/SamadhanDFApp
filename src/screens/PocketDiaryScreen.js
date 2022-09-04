//import { View } from "react-native";
// import {Stylesone} from "../styles/stylesone";

import React, { useEffect } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl ,Text} from "react-native";

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
    return (
        <View style={[Styles.flex1]}>
          <Header navigation={navigation} title="Pocket Diary" />
            <View style={[Styles.borderred,Styles.height50per,Styles.padding32]}>
              <View style={[Styles.borderyellow,Styles.height100per,Styles.flexJustifyCenter,Styles.flexAlignCenter,Styles.flexRow,Styles.flexWrap]}>
                <View style={[Styles.width50per,Styles.borderBottom5,Styles.borderRight1,Styles.height50per,Styles.flexJustifyCenter,Styles.flexAlignCenter]}>
                  <Text style={[Styles.fontSize24,Styles.fontBold,Styles.primaryColor]}>200</Text>
                  <Text style={[Styles.fontSize16,Styles.fontBold]}>Add Expense</Text>
                </View>
                <View style={[Styles.width50per,Styles.borderBottom5,Styles.height50per,Styles.flexJustifyCenter,Styles.flexAlignCenter]}>
                  <Text style={[Styles.fontSize24,Styles.fontBold,Styles.primaryColor]}>1000</Text>
                  <Text style={[Styles.fontSize16,Styles.fontBold]}>Add Source</Text>
                </View>
                <View style={[Styles.width50per,Styles.borderTop1,Styles.borderRight1,Styles.height50per,Styles.flexJustifyCenter,Styles.flexAlignCenter]}>
                  <Text style={[Styles.fontSize24,Styles.fontBold,Styles.primaryColor]}>5000</Text>
                  <Text style={[Styles.fontSize16,Styles.fontBold]}>Payable</Text>
                </View>
                <View style={[Styles.width50per,Styles.borderTop1,Styles.height50per,Styles.flexJustifyCenter,Styles.flexAlignCenter]}>
                  <Text style={[Styles.fontSize24,Styles.fontBold,Styles.primaryColor]}>1500</Text>
                  <Text style={[Styles.fontSize16,Styles.fontBold]}>Receviable</Text>
                </View>
              </View>
            </View>
          <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
            {snackbarText}
          </Snackbar>
        </View>
      );
}

export default PocketDiaryScreen;