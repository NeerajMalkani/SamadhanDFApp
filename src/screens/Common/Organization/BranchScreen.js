import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, RefreshControl, LogBox, ScrollView } from "react-native";
import { FAB, List, Searchbar, Snackbar, Title, Dialog, Portal, Paragraph, Button, Text, TextInput, Card, HelperText } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import NoItems from "../../../components/NoItems";
import { theme } from "../../../theme/apptheme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RenderHiddenItems, RenderHiddenItemGeneric } from "../../../components/ListActions";
import { Styles } from "../../../styles/styles";
import { NullOrEmpty } from "../../../utils/validations";
import { width } from "@fortawesome/free-solid-svg-icons/faBarsStaggered";
import { communication } from "../../../utils/communication";


LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
let userID = 0;

const BranchListScreen = ({ navigation }) => {

   //#region Variables
  const [visible, setVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [employeeID, setEmployeeID] = React.useState("");
 // const [otp, setOTP] = React.useState("");
  //const [otpError, setOtpError] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const [employeeName, setEmployeeName] = React.useState("");

  const [locationType, setLocationType] = React.useState("");
  
  const [locationName, setLocationName] = React.useState("");
  const [branchAdmin, setBranchAdmin] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [gstNo, setGSTNo] = React.useState("");


  const [panNo, setPANNo] = React.useState("");
  const [display, setDispaly] = React.useState("");
  const [action, setAction] = React.useState("");


  const refRBSheet = useRef();
 //#endregion 

 //#region Functions

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      FetchData();
    }
  };

  // const showDialog = () => setVisible(true);

  // const hideDialog = () => setVisible(false);

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      AddedByUserID: userID,
    };
    Provider.getAll(`master/getuserbranches?${new URLSearchParams(params)}`)
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

  useEffect(() => {
    GetUserID();
    
  }, []);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      listSearchData[1](listData[0]);
    } else {
      listSearchData[1](
        listData[0].filter((el) => {
          return el.contactPerson.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };
 

  const AddCallback = () => {
    navigation.navigate("BranchEditScreen", { type: "add", fetchData: FetchData });
  };

  const EditCallback = (data, rowMap, buttonType) => {

    rowMap[data.item.key].closeRow();
    navigation.navigate("BranchEditScreen", {
      type: "edit",
      fetchData: FetchData,
      data: {
         id: data.item.id,
       
      },
    });
    
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 80 }]}>
        <List.Item
           title={data.item.locationName}
          titleStyle={{ fontSize: 18 }}
          description={`Location Type: ${NullOrEmpty(data.item.branchType) ? "" : data.item.branchType}\nAdmin: ${NullOrEmpty(data.item.branchAdmin) ? "" : data.item.branchAdmin} `}
          onPress={() => {
            
            refRBSheet.current.open();
            setLocationName(data.item.locationName);
            setLocationType(data.item.branchType);
            setBranchAdmin(data.item.branchAdmin);
            setAddress(data.item.address);
            setGSTNo(data.item.gstNo);
            setPANNo(data.item.panNo);
            setDispaly(data.item.display ? "Yes" : "No");

          }}
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="office-building" />}
          right={() => <Icon style={{ marginVertical: 18, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
        />
        
      </View>
    );
  };

 //#endregion 
 
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="My Branch List" />
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : listData[0].length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Searchbar style={[Styles.margin16]} placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
          <SwipeListView
            previewDuration={1000}
            previewOpenValue={-160}
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
            useFlatList={true}
            disableRightSwipe={true}
            rightOpenValue={-160}
            renderItem={(data) => RenderItems(data)}
            renderHiddenItem={(data, rowMap) => RenderHiddenItemGeneric("edit", data, rowMap, [EditCallback])}
          />
        </View>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found. Add records by clicking on plus icon." />
      )}

      <FAB style={[Styles.margin16, Styles.primaryBgColor, { position: "absolute", right: 16, bottom: 16 }]} icon="account-search" onPress={AddCallback} />

      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>

      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={620} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{locationName}</Title>
          <ScrollView style={{marginBottom: 64}}>
            <List.Item title="Location Type" description={locationType} />
            <List.Item title="Branch Admin" description={branchAdmin} />
            <List.Item title="Address" description={address} />
            <List.Item title="GST No" description={gstNo} />
            <List.Item title="PAN No" description={panNo} />
            <List.Item title="Dispaly" description={display} />
          </ScrollView>
        </View>
      </RBSheet>
       
    </View>
  );
};

export default BranchListScreen;
