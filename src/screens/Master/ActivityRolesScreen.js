import { View } from "react-native";
import Header from "../../components/Header";
import { Styles } from "../../styles/styles";

const ActivityRolesScreen = ({ navigation }) => {
    return (<View style={[Styles.flex1]}>
        <Header navigation={navigation} title="Activity Roles" />
    </View>);
}

export default ActivityRolesScreen;