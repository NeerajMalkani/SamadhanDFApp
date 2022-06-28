import React, { useEffect } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl } from "react-native";
import { FAB, List, Snackbar, Dialog, Portal, Button } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const CategoryScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [dialogVisible, setDialogVisible] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [selectedCategoryName, setSelectedCategoryName] = React.useState("");
  const [serviceName, setServiceName] = React.useState("");
  const [activityRoleName, setActivityRoleName] = React.useState("");
  const [hsnsacCode, setHsnsacCode] = React.useState("");
  const [gstRate, setGstRate] = React.useState("");
  const [unitID, setUnitID] = React.useState("");

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + "  successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    Provider.getAll("master/getcategory")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const lisData = [...response.data.data];
            lisData.map((k, i) => {
              k.key = (parseInt(i) + 1).toString();
            });
            listData[1](response.data.data);
          }
        } else {
          listData[1]([]);
          setSnackbarText("No data found");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
        setIsLoading(false);
        setRefreshing(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    FetchData();
  }, []);

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 72 }]}>
        <List.Item
          title={data.item.categoryName}
          titleStyle={{ fontSize: 18 }}
          description={"Display: " + (data.item.display ? "Yes" : "No")}
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="family-tree" />}
          right={() => (
            <Icon
              style={{ marginVertical: 12, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="eye"
              onPress={() => {
                ShowDialog();
                setActivityRoleName(data.item.activityRoleName);
                setSelectedCategoryName(data.item.categoryName);
                setServiceName(data.item.serviceName);
                setHsnsacCode(data.item.hsnsacCode);
                setGstRate(data.item.gstRate);
                setUnitID(data.item.unitID);
              }}
            />
          )}
        />
      </View>
    );
  };

  const ShowDialog = () => setDialogVisible(true);

  const HideDialog = () => setDialogVisible(false);

  const AddCallback = () => {
    navigation.navigate("AddCategoryScreen", { type: "add", fetchData: FetchData });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddCategoryScreen", {
      type: "edit",
      fetchData: FetchData,
      data: {
        id: data.item.id,
        activityRoleName: data.item.activityRoleName,
        serviceName: data.item.serviceName,
        unitID: data.item.unitID,
        categoryName: data.item.categoryName,
        hsnsacCode: data.item.hsnsacCode,
        gstRate: data.item.gstRate,
        display: data.item.display,
      },
    });
  };

  const DeleteCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    Provider.deleteAllParams("master/deletecategory", { ID: data.item.id })
      .then((response) => {
        if (response.data.code === 200) {
          setSnackbarText("Item deleted successfully");
          setSnackbarColor(theme.colors.success);
          setSnackbarVisible(true);
          FetchData();
        } else {
          setSnackbarText("Something went wrong");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
      });
  };

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Category" />
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : listData[0].length > 0 ? (
        <SwipeListView
          previewDuration={1000}
          previewOpenValue={-144}
          previewRowKey="1"
          previewOpenDelay={1000}
          refreshControl={
            <RefreshControl
              colors={[theme.colors.primary]}
              refreshing={refreshing}
              onRefresh={() => {
                FetchData();
              }}
            />
          }
          data={listData[0]}
          disableRightSwipe={true}
          rightOpenValue={-144}
          renderItem={(data) => RenderItems(data)}
          renderHiddenItem={(data, rowMap) => RenderHiddenItems(data, rowMap, [DeleteCallback, EditCallback])}
        />
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found. Add records by clicking on plus icon." />
      )}
      <FAB style={[Styles.margin16, Styles.primaryBgColor, { position: "absolute", right: 16, bottom: 16 }]} icon="plus" onPress={AddCallback} />
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>

      <Portal>
        <Dialog visible={dialogVisible} onDismiss={HideDialog}>
          <Dialog.Title>{selectedCategoryName}</Dialog.Title>
          <Dialog.Content>
            <List.Item title="Activity Role Name" description={activityRoleName} />
            <List.Item title="Service Name" description={serviceName} />
            <List.Item title="HSN / SAC Code" description={hsnsacCode} />
            <List.Item title="GST Rate" description={gstRate} />
            <List.Item title="Unit name" description={unitID} />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={HideDialog}>Done</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default CategoryScreen;
