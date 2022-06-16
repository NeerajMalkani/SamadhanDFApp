import React, { useEffect } from "react";
import { ActivityIndicator, View, LogBox } from "react-native";
import { FAB, List } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../api/Provider";
import Header from "../../components/Header";
import { RenderHiddenItems } from "../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../components/NoItems";
import { Styles } from "../../styles/styles";
import { theme } from "../../theme/apptheme";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const ActivityRolesScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);

  const FetchData = () => {
    Provider.getAll("master/getactivityroles")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            listData[1](response.data.data);
          }
        } else {
          //Show snackbar
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        //Show snackbar
      });
  };

  useEffect(() => {
    FetchData();
  }, []);

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 72 }]}>
        <List.Item
          title={data.item.activityRoleName}
          titleStyle={{ fontSize: 18 }}
          description={"Display: " + (data.item.display ? "Yes" : "No")}
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="account" />}
          right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="pencil" onPress={() => {}} />}
        />
      </View>
    );
  };

  const AddCallback = () => {
    navigation.navigate("AddActivityRolesScreen", { fetchData: FetchData });
  };

  const DeleteCallback = (data, rowMap) => {
    // const arrList = [...listData[0]];
    // const prevIndex = listData[0].findIndex((item) => item.key === data.item.key);
    // if (rowMap[data.item.key]) {
    //   rowMap[data.item.key].closeRow();
    // }
    // setTimeout(() => {
    //   setSnackbarText(data.item.text + " has been deleted successfully");
    //   setSnackbarColor(theme.colors.snackbar);
    //   setVisible(true);
    //   arrList.splice(prevIndex, 1);
    //   RearrangeList(arrList);
    // }, 250);
  };

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Activity Roles" />
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : listData[0].length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <SwipeListView
            data={listData[0]}
            disableRightSwipe={true}
            rightOpenValue={-72}
            renderItem={(data) => RenderItems(data)}
            renderHiddenItem={(data, rowMap) => RenderHiddenItems(data, rowMap, [DeleteCallback])}
          />
        </View>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found. Add records by clicking on plus icon." />
      )}
      <FAB style={[Styles.margin16, Styles.primaryBgColor, { position: "absolute", right: 16, bottom: 16 }]} icon="plus" onPress={AddCallback} />
    </View>
  );
};

export default ActivityRolesScreen;
