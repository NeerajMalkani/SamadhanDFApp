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
import { RenderHiddenItems, RenderHiddenMultipleItems } from "../../../components/ListActions";
import { Styles } from "../../../styles/styles";
import {NullOrEmpty} from "../../../utils/validations";
import { width } from "@fortawesome/free-solid-svg-icons/faBarsStaggered";
import { communication } from "../../../utils/communication";
import SearchNAdd from "../Employee/AddItems/SearchNAdd";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
let userID = 0;
const EmployeeListScreen = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [employeeID, setEmployeeID] = React.useState("");
  const [otp, setOTP] = React.useState("");
  const [otpError, setOtpError] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const [employeeName, setEmployeeName] = React.useState("");
  
  const [mobileNo, setMobileNo] = React.useState("");
  const [branch, setBranch] = React.useState("");
  const [department, setDepartment] = React.useState("");
  const [designation, setDesignation] = React.useState("");

  const [profileStatus, setProfileStatus] = React.useState("");
  const [loginStatus, setLoginStatus] = React.useState("");
  const [verifyStatus, setVerifyStatus] = React.useState("");

  const refRBSheet = useRef();

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      FetchData();
    }
  };

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      AddedByUserID: userID,
    };
    Provider.getAll(`master/getuseremployeelist?${new URLSearchParams(params)}`)
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

  const SubmitVerify = () => {
    Provider.create("master/updateemployeeverification", 
    { 
      EmployeeID: employeeID, 
      OTP: otp
    })
      .then((response) => {
        console.log(response);
        if (response.data && response.data.code === 200) {
          FetchData();
          hideDialog();
          setSnackbarText(communication.UpdateSuccess);
          setSnackbarVisible(true);
        } else if (response.data.code === 304) {
          setSnackbarText(communication.UpdateError);
          setSnackbarVisible(true);
        } else {
          setSnackbarText(communication.UpdateError);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
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
    navigation.navigate("SearchNAdd", { type: "add", fetchData: FetchData });
  };


  const EditCallback = (data, rowMap, buttonType) => {

    if(buttonType == "otp") {
      setEmployeeID(data.item.id);
      setOTP(data.item.otp.toString());
      showDialog();
    }
    else {
      rowMap[data.item.key].closeRow();
      navigation.navigate("EmployeeEditScreen", {
        type: "edit",
        fetchData: FetchData,
        data: {
           id: data.item.id,
        },
      });
    }
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 80 }]}>
        <List.Item
          title={data.item.employeeName}
          titleStyle={{ fontSize: 18 }}
          description={`Mob.: ${NullOrEmpty(data.item.mobileNo) ? "" : data.item.mobileNo}\nProfile Status: ${NullOrEmpty(data.item.profileStatus) ? "" : data.item.profileStatus} `}
          onPress={() => {
            
            refRBSheet.current.open();
            setEmployeeName(data.item.employeeName);
            setMobileNo(data.item.mobileNo);
            setBranch(data.item.locationName);
            setDepartment(data.item.departmentName);
            setDesignation(data.item.designationName);
            setProfileStatus(data.item.profileStatus);
            setLoginStatus(data.item.loginStatus);
            setVerifyStatus(data.item.verifyStatus);

          }}
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="account-group" />}
          right={() => <Icon style={{ marginVertical: 18, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
        />
        
      </View>
    );
  };

  const OnOTPSend = () => {
    let isValid = true;
    
    if (otp.trim() === "") {
      setOtpError(true);
      isValid = false;
    }
    if (isValid) {
      SubmitVerify();
    }
  };

  const onOTPChange = (text) => {
    setOTP(text);
    setOtpError(false);
  };

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="My Employee List" />
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
            renderHiddenItem={(data, rowMap) => RenderHiddenMultipleItems(data, rowMap, [EditCallback])}
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
          <Title style={[Styles.paddingHorizontal16]}>{employeeName}</Title>
          <ScrollView style={{marginBottom: 64}}>
            <List.Item title="Mobile No" description={mobileNo} />
            <List.Item title="Branch" description={branch} />
            <List.Item title="Department" description={department} />
            <List.Item title="Designation" description={designation} />
            <List.Item title="Profile Status" description={NullOrEmpty(profileStatus) ? "" : profileStatus ? "Complete":"Incomplete"} />
            <List.Item title="Login Status" description={NullOrEmpty(loginStatus) ? "" : loginStatus ? "Yes":"No"} />
            <List.Item title="Verify Status" description={NullOrEmpty(verifyStatus) ? "" : verifyStatus ? "Verified":"Not Verified"} />
          </ScrollView>
        </View>
      </RBSheet>

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog} style={[Styles.borderRadius8]}>
            <Dialog.Title style={[Styles.fontSize16, Styles.textCenter]}>EMPLOYEE OTP NO VERIFICATION & LOGIN ACTIVATION</Dialog.Title>
            <Dialog.Content>
              <View style={[Styles.flexRow, Styles.flexJustifyCenter,  Styles.flexAlignCenter, Styles.marginTop16]}>
                <Text >Enter OTP No:</Text>
              <TextInput 
              mode="flat"
              value={otp} 
              onChangeText={onOTPChange}
              error={otpError}
                  style={[Styles.marginHorizontal12,Styles.width80,Styles.height40,  Styles.borderRadius4, Styles.backgroundSecondaryColor]}  
                />
              </View>
              <View>
              <HelperText type="error" visible={otpError} style={[Styles.textCenter]}>
              {communication.InvalidOTP}
            </HelperText> 
              </View>
              <Card.Content style={[Styles.marginTop16]}>
          <Button mode="contained" onPress={OnOTPSend}>
          Submit & Verify
          </Button>
          </Card.Content>
            </Dialog.Content>
          </Dialog>
        </Portal>
    </View>
  );
};

export default EmployeeListScreen;
