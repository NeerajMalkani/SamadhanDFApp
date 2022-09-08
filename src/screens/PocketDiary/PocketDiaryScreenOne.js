import React, { useEffect ,useState} from "react";
import { ActivityIndicator, View, LogBox, RefreshControl ,Text,Image,Button,TouchableOpacity, Switch} from "react-native";
import { FAB, List, Searchbar, Snackbar, RadioButton } from "react-native-paper";
import { theme } from "../../theme/apptheme";
import { Styles } from "../../styles/styles";
import Header from '../../components/Header';

const PocketDiaryScreenOne = ({ navigation }) => {
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
      const [isEnabled, setIsEnabled] = useState(false);
      const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    return (
        <View style={[Styles.flex1]}>
          <Header navigation={navigation} title="Pocket Diary" />
            <View style={[Styles.height85per,Styles.borderred]}>
                <Text>one</Text>
            </View>
            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
              {snackbarText}
            </Snackbar>
        </View>
      );
}
export default PocketDiaryScreenOne;