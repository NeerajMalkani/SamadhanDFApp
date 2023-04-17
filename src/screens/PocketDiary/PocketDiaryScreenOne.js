import React, { useEffect ,useState} from "react";
import { ActivityIndicator, View, LogBox, RefreshControl ,Text,Image,Button,TouchableOpacity, Switch} from "react-native";
import { FAB, List, Searchbar, Snackbar, RadioButton } from "react-native-paper";
import { theme } from "../../theme/apptheme";
import { Styles } from "../../styles/styles";
import Header from '../../components/Header';

const PocketDiaryScreenOne = ({ navigation }) => {
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
 //#endregion 

    useEffect(() => {
        //FetchData();
      }, []);
      const [isEnabled, setIsEnabled] = useState(false);
      const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
        <View style={[Styles.flex1]}>
          <Header navigation={navigation} title="Pocket Diary" />
            <View style={[Styles.height85per,Styles.borderred]}>
                <View style={[Styles.width100per,Styles.height40,Styles.backgroundColorDarkGreen,Styles.flexJustifyCenter,Styles.flexAlignCenter,Styles.marginTop4]}>
                  <Text style={[Styles.textColorWhite,Styles.fontSize20]}>Expanse</Text>
                </View>
                <RadioButton.Group
              onValueChange={(value) => {
                setValue(value);
                setErrorCAT(false);
                
              }}
              value={value}
            >
              <View style={[Styles.width100per,Styles.height40,Styles.backgroundColorYelow,Styles.marginTop4,Styles.flexRow,Styles.flexJustifyCenter,Styles.flexAlignCenter]}>
                  <RadioButton.Item position="leading" color="white" uncheckedColor="white" style={[Styles.paddingVertical2]} labelStyle={[Styles.textRight, Styles.paddingStart4,Styles.whiteColor]} label="Company" value="1" onPress={()=>console.log("one")}/>
                  <RadioButton.Item position="leading" color="white" uncheckedColor="white" style={[Styles.paddingVertical2]} labelStyle={[Styles.textRight, Styles.paddingStart4,Styles.whiteColor]} label="Self" value="2" onPress={()=>console.log("one")} />
              </View>
              <View style={[Styles.marginTop4]}>
                <Text>one</Text>
              </View>
            </RadioButton.Group>
                
            </View>
            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
              {snackbarText}
            </Snackbar>
        </View>
      );
}
export default PocketDiaryScreenOne;