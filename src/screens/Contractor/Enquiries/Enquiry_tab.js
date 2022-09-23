import React, { useEffect, useRef } from "react";
import { Image, ActivityIndicator, View, RefreshControl, LogBox, ScrollView,StyleSheet } from "react-native";
import { FAB, List, Searchbar, Snackbar, Title, Dialog, Portal, Paragraph, Button, Text, TextInput, Card, HelperText } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import NoItems from "../../../components/NoItems";
import { theme } from "../../../theme/apptheme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RenderHiddenItems } from "../../../components/ListActions";
import { RenderHiddenMultipleItems } from "../../../components/ListActions";
import { Styles } from "../../../styles/styles";
import {NullOrEmpty} from "../../../utils/validations";
import { width } from "@fortawesome/free-solid-svg-icons/faBarsStaggered";
import { communication } from "../../../utils/communication";
//import SearchNAdd from "../Employee/AddItems/SearchNAdd";
import logo from './test.jpg'; 
LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
let userID = 0;
const Enquiry_tab = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const [visible1, setVisible1] = React.useState(false);
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
  const [closeSheet, setcloseSheet] = React.useState(true);
  const refRBSheet = useRef();

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      FetchData();
    }
  };

  const showDialog = () => {

    refRBSheet.current.close();
    setVisible(true) 
  }

  const hideDialog = () => setVisible(false);

  const showDialog1 = () => {

    refRBSheet.current.close();
    setVisible1(true) 
  }

  const hideDialog1 = () => setVisible1(false);

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
    //navigation.navigate("SearchNAdd", { type: "add", fetchData: FetchData });
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
      {/* <Header navigation={navigation} title="My Employee List" /> */}
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

      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={620} animationType="fade"  customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View>
          <Title style={[Styles.paddingHorizontal16]}>Client Detail</Title>
          <ScrollView style={{marginBottom: 64}}>
          <Image source={logo} style={{ width: 400, height: 159 }} /> 
          <List.Item title="Labour Cost" />
          <TextInput 
              mode="flat"
              value='2323jjlo'
             
              
                  style={[stylesm.input]}  
                />
            <List.Item title="Estimate No" description="AUG00s" />
            <List.Item title="Category" description="GYPSUM & POP" />
            <List.Item title="Product" description={department} />
            <List.Item title="Design Type" description={designation} />
            <List.Item title="Design No" description={NullOrEmpty(profileStatus) ? "" : profileStatus ? "Complete":"Incomplete"} />
            <List.Item title="Total Sq.Ft" description={NullOrEmpty(loginStatus) ? "" : loginStatus ? "Yes":"No"} />
            <List.Item title="Actual Labour Cost" description={NullOrEmpty(verifyStatus) ? "" : verifyStatus ? "Verified":"Not Verified"} />
            <Card.Content style={[Styles.marginTop16]}>
            <Button mode="contained" onPress={showDialog} style={stylesm.button} >
              Accept
            </Button>
            </Card.Content>
            <Card.Content style={[Styles.marginTop16]}>
            <Button mode="contained" onPress={showDialog1} style={stylesm.button1}>
              Reject
            </Button>
            </Card.Content>

          </ScrollView>
        </View>
      </RBSheet>

        <Portal>
          <Dialog visible={visible} onDismiss={hideDialog} style={[Styles.borderRadius8]}>
            <Dialog.Title style={[Styles.fontSize16, Styles.textCenter]}>Confirm to Accept?</Dialog.Title>
            <Dialog.Content>
              <View style={[Styles.flexRow, Styles.flexJustifyCenter,  Styles.flexAlignCenter, Styles.marginTop16]}>
               
            
              </View>
              <View>
            
              </View>
              <Card.Content style={[Styles.marginTop16]}>
          <Button mode="contained" >
          Ok
          </Button>
          
          </Card.Content>
          <Card.Content style={[Styles.marginTop16]}>
          <Button mode="contained" onPress={hideDialog}>
          Cancel
          </Button>
          
          </Card.Content>
            </Dialog.Content>
          </Dialog>

          <Dialog visible={visible1} onDismiss={hideDialog1} style={[Styles.borderRadius8]}>
            <Dialog.Title style={[Styles.fontSize16, Styles.textCenter]}>Confirm to Reject?</Dialog.Title>
            <Dialog.Content>
              <View style={[Styles.flexRow, Styles.flexJustifyCenter,  Styles.flexAlignCenter, Styles.marginTop16]}>
               
            
              </View>
              <View>
            
              </View>
              <Card.Content style={[Styles.marginTop16]}>
          <Button mode="contained" >
          Ok
          </Button>
          
          </Card.Content>
          <Card.Content style={[Styles.marginTop16]}>
          <Button mode="contained" onPress={hideDialog1}>
          Cancel
          </Button>
          
          </Card.Content>
            </Dialog.Content>
          </Dialog>
        </Portal>
        


    </View>
  );
};
const stylesm = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'green',
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'red',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  modalIndex: {
    zIndex:999999999999999999
  },
  input: {
    margin: 15,
    height: 40,
    
    borderColor: 'grey',
    borderWidth: 1
 },
});
export default Enquiry_tab;
