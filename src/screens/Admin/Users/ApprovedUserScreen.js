import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView, Text } from "react-native";
import { FAB, List, Snackbar, Searchbar, Title, Card, Button } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import {NullOrEmpty} from "../../../utils/validations";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const ApprovedUserScreen = ({ navigation }) => {
   //#region Variables
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [companyDetails, setCompanyDetails] = React.useState("");
  const [activityRole, setActivityRole] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [designation, setDesignation] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const refRBSheet = useRef();
 //#endregion 

 //#region Functions

  useEffect(() => {
    FetchData();
  }, []);

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    
    Provider.createDF("apiappadmin/spawu7S4urax/tYjD/getuserapprovelist/")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const lisData = [...response.data.data];
            lisData.map((k, i) => {
              k.key = (parseInt(i) + 1).toString();
            });
            listData[1](response.data.data);
            listSearchData[1](response.data.data);
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

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      listSearchData[1](listData[0]);
    } else {
      listSearchData[1](
        listData[0].filter((el) => {
          return el.username.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddActivityRolesScreen", {
      type: "edit",
      fetchData: FetchData,
      data: {
        id: data.item.id,
        activityRoleName: data.item.activityRoleName,
        display: data.item.display,
      },
    });
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 84 }]}>
        <List.Item
          title={data.item.firstname}
          titleStyle={{ fontSize: 18 }}
          description={`Department: ${NullOrEmpty(data.item.departmentname) ? "" : data.item.departmentname}\nDesignation: ${NullOrEmpty(data.item.designationname) ? "": data.item.designationname}`}
          
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="account" />}
          onPress={() => {
            refRBSheet.current.open();

            setCompanyDetails(data.item.firstname);
            setActivityRole(data.item.group_name);
            setDepartment(data.item.departmentname);
            setDesignation(data.item.designationname);
            setUsername(data.item.user_name);
            setPassword(data.item.password);
            
          }}
          right={() => (
            <Icon
              style={{ marginVertical: 12, marginRight: 18 }}
              size={30}
              color={theme.colors.textSecondary}
              name="eye"
            />
          )}
        />
      
      </View>
    );
  };
 //#endregion 

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="APPROVED USERS" />
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : listData[0].length > 0 ? (
          <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Searchbar style={[Styles.margin16]} placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
          <SwipeListView
            previewDuration={1000}
            previewOpenValue={-84}
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
            data={listSearchData[0]}
            disableRightSwipe={true}
            rightOpenValue={-84}
            renderItem={(data) => RenderItems(data)}
            renderHiddenItem={(data, rowMap) => RenderHiddenItems(data, rowMap, [EditCallback])}
          />
        </View>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found." />
      )}
      
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>

      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={480} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{companyDetails}</Title>
          <ScrollView>
            <List.Item title="Activity Role Name" description={activityRole} />
            <List.Item title="Department" description={department} />
            <List.Item title="Designation" description={designation} />
            <List.Item title="Username" description={username} />
            <List.Item title="Password" description={password} />
          </ScrollView>
        </View>
        <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
          <Card.Content>
            <Button color={theme.colors.error} mode="contained">
              Decline
            </Button>
          </Card.Content>
        </View>
      </RBSheet>
    </View>
  );
};

export default ApprovedUserScreen;
