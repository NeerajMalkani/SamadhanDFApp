import React, { useEffect, useRef,useState } from "react";
import { ActivityIndicator, View, RefreshControl, LogBox, ScrollView,Text, Touchable } from "react-native";
import { FAB, List, Searchbar, Snackbar, TextInput, Title,HelperText,Button } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import { theme } from "../../../../theme/apptheme";
import { Styles } from "../../../../styles/styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import {NullOrEmpty} from "../../../../utils/validations";
import { communication } from "../../../../utils/communication";
import Provider from "../../../../api/Provider";
import { RenderHiddenItems } from "../../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RBSheet from "react-native-raw-bottom-sheet";


let userID = 0;

const SearchNAdd = ({ navigation }) => {

const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [employeeName, setEmployeeName] = useState("");
  const [employeeNameInvalid, setEemployeeNameInvalid] = useState("");
  const employeeNameRef = useRef({});

  const [aadharNo, setAadharNo] = useState("");
  const [aadharNoInvalid, setAadharNoInvalid] = useState("");
  const aadharNoRef = useRef({});

  const [mobileNo, setMobileNo] = useState("");
  const [mobileNoInvalid, setMobileNoInvalid] = useState("");
  const mobileNoRef = useRef({});

  const [addAadharNo, setAddAadharNo] = useState("");
  const [addAadharNoInvalid, setAddAadharNoInvalid] = useState("");
  const addAadharNoRef = useRef({});

  const [addMobileNo, setAddMobileNo] = useState("");
  const [addMobileNoInvalid, setAddMobileNoInvalid] = useState("");
  const addMobileNoRef = useRef({});

  const [companyName, setCompanyName] = React.useState("");
  const [RBEmployeeName, setRBEmployeeName] = useState("");
  const [RBMobileNo, setRBMobileNo] = useState("");
  const [RBAadharNo, setRBAadharNo] = useState("");
  
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

    const onAadharNoChanged = (text) => {
      setAadharNo(text);
      setAadharNoInvalid(false);
    };

    const onMobileNoChanged = (text) => {
      setMobileNo(text);
      setMobileNoInvalid(false);
    };

    const onAddAadharNoChanged = (text) => {
      setAddAadharNo(text);
      setAddAadharNoInvalid(false);
    };

    const onAddMobileNoChanged = (text) => {
      setAddMobileNo(text);
      setAddMobileNoInvalid(false);
    };

    const onEmployeeNameChanged = (text) => {
      setEmployeeName(text);
      setEemployeeNameInvalid(false);
    };

    const InsertNewEmployee = () => {
      console.log("adding new employee");
      const params = {
        AddedByUserID:userID,
        EmployeeName:employeeName.trim(),
        MobileNo: addMobileNo.trim(),
        AadharNo: addAadharNo.trim()
              };
      Provider.create("master/insertuseremployees", params)
        .then((response) => {

          if (response.data && response.data.code === 200) {
            // redirect to employee list.
            setSnackbarColor(theme.colors.success);
            setSnackbarText("Employee Added successfully");
            setSnackbarVisible(true);

          } else {

            setSnackbarColor(theme.colors.error);
            setSnackbarText(communication.UpdateError);
            setSnackbarVisible(true);

          }
        })
        .catch((e) => {
          console.log(e);
          setSnackbarColor(theme.colors.error);
          setSnackbarText(communication.NetworkError);
          setSnackbarVisible(true);
        });
    };

    const OnSearchEmployee = () => {
      let isValid = false;
    if(!NullOrEmpty(aadharNo.trim()) || !NullOrEmpty(mobileNo.trim())) {
      isValid=true;
    }
    else {

      if(NullOrEmpty(aadharNo.trim())) {
        setAadharNoInvalid(true);
      }

      if(NullOrEmpty(mobileNo.trim())) {
        setMobileNoInvalid(true);
      }
    }

    if (isValid) {
      FetchSearchEmployee();
    }
    };

    const OnAddNewEmployee = () => {
      let isValid=true;

      if(NullOrEmpty(employeeName.trim())){
        isValid=false;
        setEemployeeNameInvalid(true);
      }
  
      if(NullOrEmpty(addMobileNo.trim())){
        isValid=false;
        setAddMobileNoInvalid(true);
      }
      if(NullOrEmpty(addAadharNo.trim())){
        isValid=false;
        setAddAadharNoInvalid(true);
      }

      if(isValid){
        InsertNewEmployee();
      }

    };




    const FetchSearchEmployee = (from) => {
      let params = {
        AddedByUserID: userID,
        MobileNo: mobileNo.trim(),
        AadharNo: aadharNo.trim()
      };

      Provider.getAll(`master/getemployeesearchlist?${new URLSearchParams(params)}`)
        .then((response) => {
          if (response.data && response.data.code === 200) {
            if (response.data.data) {
              console.log(response.data.data);
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
            description={`Mob.: ${NullOrEmpty(data.item.mobileNo) ? "" : data.item.mobileNo}\nAadhar No: ${NullOrEmpty(data.item.aadharNo) ? "" : data.item.aadharNo} `}
            onPress={() => {
              refRBSheet.current.open();
              setCompanyName(data.item.companyName);
              setRBEmployeeName(data.item.employeeName);
              setRBMobileNo(data.item.mobileNo);
              setRBAadharNo(data.item.aadharNo);
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

              <TextInput ref={aadharNoRef} mode="flat" dense label="Employee Aadhar No" value={aadharNo} returnKeyType="next" onSubmitEditing={() => aadharNoRef.current.focus()} onChangeText={onAadharNoChanged} style={{ backgroundColor: "white" }} error={aadharNoInvalid} />
              <HelperText type="error" visible={aadharNoInvalid}>
                {communication.InvalidAadharNo}
              </HelperText>

              <TextInput ref={mobileNoRef} mode="flat" dense keyboardType="number-pad" label="Mobile No" value={mobileNo} 
              returnKeyType="next" onSubmitEditing={() => mobileNoRef.current.focus()} onChangeText={onMobileNoChanged} style={{ backgroundColor: "white" }} error={mobileNoInvalid} />
              <HelperText type="error" visible={mobileNoInvalid}>
                {communication.mobileNoInvalid}
              </HelperText>

                <TouchableOpacity onPress={OnSearchEmployee} style={[Styles.marginTop32,Styles.primaryBgColor,Styles.padding10,Styles.flexAlignCenter]}>
                     <Text style={[Styles.fontSize14,Styles.textColorWhite]}>SEARCH EMPLOYEE</Text> 
                </TouchableOpacity>

            </View>
            <View style={[Styles.padding16]}>
            <View style={[Styles.width100per,Styles.borderBottom2,Styles.borderBottom2,Styles.marginTop32]}>
                    <Text style={[Styles.fontSize20,Styles.fontBold,Styles.marginBottom4,Styles.primaryColor]}>Employee Search Result</Text>
                </View>
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

              <TextInput ref={employeeNameRef} mode="flat" dense label="Employee Name" value={employeeName} returnKeyType="next" 
              onSubmitEditing={() => employeeNameRef.current.focus()} selectTextOnFocus={false} onChangeText={onEmployeeNameChanged} 
              style={{ backgroundColor: "white" }} error={employeeNameInvalid} />
              <HelperText type="error" visible={employeeNameInvalid}>
                {communication.InvalidEmployeeName}
              </HelperText>

              <TextInput ref={addMobileNoRef} mode="flat" dense keyboardType="number-pad" label="Mobile No" value={addMobileNo} 
              returnKeyType="next" onSubmitEditing={() => addMobileNoRef.current.focus()} onChangeText={onAddMobileNoChanged} style={{ backgroundColor: "white" }} error={addMobileNoInvalid} />
              <HelperText type="error" visible={addMobileNoInvalid}>
                {communication.mobileNoInvalid}
              </HelperText>

              <TextInput ref={addAadharNoRef} mode="flat" dense label="Aadhar No" value={addAadharNo} returnKeyType="next" onSubmitEditing={() => addAadharNoRef.current.focus()} onChangeText={onAddAadharNoChanged} style={{ backgroundColor: "white" }} error={addAadharNoInvalid} />
              <HelperText type="error" visible={addAadharNoInvalid}>
                {communication.InvalidAadharNo}
              </HelperText>

                <TouchableOpacity onPress={OnAddNewEmployee} style={[Styles.marginTop32,Styles.primaryBgColor,Styles.padding10,Styles.flexAlignCenter]}>
                     <Text style={[Styles.fontSize14,Styles.textColorWhite]}>ADD EMPLOYEE</Text> 
                </TouchableOpacity>
            </View>
        </ScrollView>

        <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={620} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{companyName}</Title>
          <ScrollView style={{marginBottom: 64}}>
            <List.Item title="Employee Name" description={RBEmployeeName} />
            <List.Item title="Mobile Number" description={RBMobileNo} />
            <List.Item title="Aadhar Number" description={RBAadharNo} />
          </ScrollView>
        </View>
      </RBSheet>


    </View>
  );
};

export default SearchNAdd;
