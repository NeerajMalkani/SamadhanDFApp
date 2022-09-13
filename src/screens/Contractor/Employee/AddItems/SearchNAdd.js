import React, { useEffect, useRef,useState } from "react";
import { ActivityIndicator, View, RefreshControl, LogBox, ScrollView,Text, Touchable } from "react-native";
import { FAB, List, Searchbar, Snackbar, TextInput, Title,HelperText,Button } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import { theme } from "../../../../theme/apptheme";
import { Styles } from "../../../../styles/styles";
import { TouchableOpacity } from "react-native-gesture-handler";
const SearchNAdd = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);
  
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
      navigation.navigate("SearchNAdd ", { type: "add", fetchData: FetchData });
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
        <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
            <View style={[Styles.padding16]}>
                <TextInput label="Employee Aadhar No" style={[Styles.backgroundColorWhite]} keyboardType="number-pad"/>
                <HelperText type="error" ></HelperText>
                <TextInput label="Mobile No" style={[Styles.backgroundColorWhite]} keyboardType="number-pad"/>
                <HelperText type="error" ></HelperText>
                <TouchableOpacity  style={[Styles.marginTop32,Styles.primaryBgColor,Styles.padding10,Styles.flexAlignCenter]}>
                     <Text style={[Styles.fontSize14,Styles.textColorWhite]}>SEARCH</Text> 
                </TouchableOpacity>
                <View style={[Styles.width100per,Styles.borderBottom2,Styles.borderBottom2,Styles.marginTop32]}>
                    <Text style={[Styles.fontSize20,Styles.fontBold,Styles.marginBottom4,Styles.primaryColor]}>Employee Search</Text>
                </View>
            </View>
            <View style={[Styles.padding16]}>

            {isLoading ? (
                <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : listData[0].length > 0 ? (
                <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
                <Searchbar style={[Styles.margin16]} placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
                <SwipeListView
                    previewDuration={1000}
                    previewOpenValue={-72}
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
                    rightOpenValue={-72}
                    renderItem={(data) => RenderItems(data)}
                    renderHiddenItem={(data, rowMap) => RenderHiddenItems(data, rowMap, [EditCallback])}
                />
                </View>
            ) : (
                <NoItems icon="format-list-bulleted" text="No records found. Add records by clicking on plus icon." />
            )}

            </View>
            <View style={[Styles.flexJustifyCenter,Styles.flexAlignCenter]}>
                <Text style={[Styles.fontSize20,Styles.SpaceEvenly,Styles.flexRow,Styles.textSecondaryColor]}>- - - - - - - - - - - - - - - OR - - - - - - - - - - - - - - - -</Text>
            </View>
            <View style={[Styles.padding16]}>
                <TextInput label="Employee Name" style={[Styles.marginBottom8,Styles.backgroundColorWhite]}/>
                <TextInput label="Mobile No" style={[Styles.marginBottom8,Styles.backgroundColorWhite]} keyboardType="number-pad"/>
                <TextInput label="Aadhar no" style={[Styles.marginBottom8,Styles.backgroundColorWhite]} keyboardType="number-pad"/>
                <TouchableOpacity  style={[Styles.marginTop32,Styles.primaryBgColor,Styles.padding10,Styles.flexAlignCenter]}>
                     <Text style={[Styles.fontSize14,Styles.textColorWhite]}>ADD EMPLOYEE</Text> 
                </TouchableOpacity>
            </View>
        </ScrollView>
    </View>
  );
};

export default SearchNAdd;
