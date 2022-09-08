//import { View } from "react-native";
// import {Stylesone} from "../styles/stylesone";

import React, { useEffect ,useState} from "react";
import { ActivityIndicator, View, LogBox, RefreshControl ,Text,Image,Button,TouchableOpacity} from "react-native";

import { FAB, List, Searchbar, Snackbar, RadioButton } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../api/Provider";
import Header from "../components/Header";
import { RenderHiddenItems } from "../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../components/NoItems";
import { Styles } from "../styles/styles";
import { theme } from "../theme/apptheme";
import { height } from "@fortawesome/free-solid-svg-icons/faBarsStaggered";


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
    const [errorCAT, setErrorCAT] = React.useState(false);
    const [checked, setChecked] = useState('first');

    useEffect(() => {
        //FetchData();
      }, []);
    return (
        <View style={[Styles.flex1]}>
          <Header navigation={navigation} title="Pocket Diary" />
            <View style={[Styles.height40per,Styles.padding32,Styles.backgroundColorWhite]}>
              <View style={[Styles.height100per,Styles.flexJustifyCenter,Styles.flexAlignCenter,Styles.marginTop24,Styles.flexRow,Styles.flexWrap]}>
                <View style={[Styles.width50per,Styles.borderBottom5,Styles.borderRight1,Styles.height50per,Styles.flexJustifyCenter,Styles.flexAlignCenter]}>
                  <TouchableOpacity style={[Styles.flexAlignCenter]}>
                    <Text style={[Styles.fontSize24,Styles.fontBold,Styles.primaryColor]}>200</Text>
                    <Text style={[Styles.fontSize16,Styles.fontBold]}>Add Expense</Text>
                  </TouchableOpacity>
                  
                </View>
                <View style={[Styles.width50per,Styles.borderBottom5,Styles.height50per,Styles.flexJustifyCenter,Styles.flexAlignCenter]}>
                  <TouchableOpacity style={[Styles.flexAlignCenter]}>
                    <Text style={[Styles.fontSize24,Styles.fontBold,Styles.primaryColor]}>1000</Text>
                    <Text style={[Styles.fontSize16,Styles.fontBold]}>Add Source</Text>
                  </TouchableOpacity>
                </View>
                <View style={[Styles.width50per,Styles.borderTop1,Styles.borderRight1,Styles.height50per,Styles.flexJustifyCenter,Styles.flexAlignCenter]}>
                  <TouchableOpacity style={[Styles.flexAlignCenter]}>
                    <Text style={[Styles.fontSize24,Styles.fontBold,Styles.primaryColor]}>5000</Text>
                    <Text style={[Styles.fontSize16,Styles.fontBold]}>Payable</Text>
                  </TouchableOpacity>
                  
                </View>
                <View style={[Styles.width50per,Styles.borderTop1,Styles.height50per,Styles.flexJustifyCenter,Styles.flexAlignCenter]}>
                  <TouchableOpacity style={[Styles.flexAlignCenter]}>
                    <Text style={[Styles.fontSize24,Styles.fontBold,Styles.primaryColor]}>1500</Text>
                   <Text style={[Styles.fontSize16,Styles.fontBold]}>Receviable</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={[Styles.height60per,Styles.backgroundColorWhite,Styles.flexRow,Styles.flexJustifyCenter]}>
              
              <Image source={require("../../assets/pocketDairyHomeScreen.png")} style={[Styles.height71per,Styles.width80per]}/>
              
              
            </View>
            <View style={[Styles.width100per,Styles.height40,Styles.positionAbsolute,Styles.Top70,Styles.backgroundColorDarkGreen]}>
            <RadioButton.Group
              onValueChange={(value) => {
                setValue(value);
                setErrorCAT(false);
                
              }}
              value={value}
            >
            <View style={[Styles.width100per,Styles.flexRow,Styles.flexAlignCenter,Styles.flexJustifyCenter,Styles.whiteColor]}>
                  <RadioButton.Item position="leading" color="white" uncheckedColor="white" style={[Styles.paddingVertical2]} labelStyle={[Styles.textRight, Styles.paddingStart4,Styles.whiteColor]} label="Company" value="1" />
                  <RadioButton.Item position="leading" color="white" uncheckedColor="white" style={[Styles.paddingVertical2]} labelStyle={[Styles.textRight, Styles.paddingStart4,Styles.whiteColor]} label="Self" value="2" />
                  <RadioButton.Item position="leading" color="white" uncheckedColor="white" style={[Styles.paddingVertical2]} labelStyle={[Styles.textRight, Styles.paddingStart4,Styles.whiteColor]} label="Both" value="3" />
            </View>
            </RadioButton.Group>
            </View>
            <View style={[Styles.width100per,Styles.height56,Styles.positionAbsolute,Styles.Bottom10,Styles.backgroundColorDarkGreen,Styles.flexRow,Styles.flexJustifyCenter,Styles.flexAlignCenter]}>
            <TouchableOpacity style={[Styles.backgroundColorYelow,Styles.width50per,Styles.height40,Styles.borderRadius64,Styles.flexJustifyCenter,Styles.flexAlignCenter]} onPress={()=>navigation.navigate("PocketScreenOne")}>
              <Text style={[Styles.fontBold,Styles.fontSize18]}>ADD CATEGORY</Text>
            </TouchableOpacity>
            </View>
          <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
            {snackbarText}
          </Snackbar>
        </View>
      );
}

export default PocketDiaryScreen;