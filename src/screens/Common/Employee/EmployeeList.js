import React, { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  ActivityIndicator,
  View,
  RefreshControl,
  LogBox,
  ScrollView,
} from "react-native";
import {
  FAB,
  List,
  Searchbar,
  Snackbar,
  Title,
  Dialog,
  Portal,
  Paragraph,
  Text,
  TextInput,
  Card,
  HelperText,
} from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import NoItems from "../../../components/NoItems";
import { theme } from "../../../theme/apptheme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  RenderHiddenItemsConditional,
  RenderHiddenMultipleItems,
} from "../../../components/ListActions";
import { Styles } from "../../../styles/styles";
import { NullOrEmpty } from "../../../utils/validations";
import { width } from "@fortawesome/free-solid-svg-icons/faBarsStaggered";
import { communication } from "../../../utils/communication";
import SearchNAdd from "./AddItems/SearchNAdd";
import DFButton from "../../../components/Button";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
let userID = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_designation_refno = 0;
const EmployeeListScreen = ({ navigation }) => {
  //#region Variables
  const [visible, setVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [employeeID, setEmployeeID] = React.useState("");
  const [otp, setOTP] = React.useState("");
  const [otpError, setOtpError] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );
  const [empcode, setEmpCode] = useState("");
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
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const refRBSheet = useRef();

  //#endregion

  //#region Functions
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      Sess_company_refno = JSON.parse(userData).Sess_company_refno;
      Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
      Sess_designation_refno = JSON.parse(userData).Sess_designation_refno;
      FetchData();
    }
  };

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText(
        "Employee " + (from === "add" ? "added" : "updated") + " successfully"
      );
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_designation_refno: Sess_designation_refno,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.myemployeelist, params)
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
    let params = {
      data: {
        Sess_UserRefno: userID,
        employee_otp_no: otp,
        employee_mobile_no: current.employee_mobile_no,
        myemployee_refno: current.myemployee_refno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.employeeotpverify, params)
      .then((response) => {
        setIsButtonLoading(false);
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
        setIsButtonLoading(false);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      GetUserID();
    }
  }, [isFocused]);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      listSearchData[1](listData[0]);
    } else {
      listSearchData[1](
        listData[0].filter((el) => {
          return el.employee_name
            .toString()
            .toLowerCase()
            .includes(query.toLowerCase());
        })
      );
    }
  };

  const AddCallback = () => {
    navigation.navigate("SearchNAdd", { type: "add", fetchData: FetchData });
  };
  const SearchEmployee = () => {
    navigation.navigate("SearchEmployee", {
      type: "add",
      fetchData: FetchData,
    });
  };
  const AddEmployee = () => {
    navigation.navigate("AddEmployee", { type: "add", fetchData: FetchData });
  };
  const [current, setCurrent] = React.useState();
  const EditCallback = (data, rowMap, buttonType) => {
    if (buttonType == "otp") {
      let params = {
        data: {
          Sess_UserRefno: userID,
          myemployee_refno: data.item.myemployee_refno,
          employee_mobile_no: data.item.employee_mobile_no,
        },
      };
      Provider.createDFCommon(Provider.API_URLS.sendotptoemployee, params)
        .then((response) => {
          if (response && response.data && response.data.status === "Success") {
            let x =
              response.data.data["OTP Send"] == 1
                ? response.data.data.employee_otp_no
                : "";
            console.log(x);
            setOTP(x.toString());
            setCurrent(data.item);
            setEmployeeID(data.item.employee_user_refno);
            showDialog();
          }
        })
        .catch((e) => console.log(e));
    } else {
      rowMap[data.item.key].closeRow();
      navigation.navigate("EmployeeEditScreen", {
        type: "edit",
        fetchData: FetchData,
        data: {
          myemployee_refno: data.item.myemployee_refno,
          Sess_UserRefno: userID,
        },
        call: () => {
          setSnackbarColor(theme.colors.success);
          setSnackbarText("Data updated successfully");
          setSnackbarVisible(true);
          navigation.navigate("EmployeeListScreen");
        },
      });
    }
  };

  const RenderItems = (data) => {
    return (
      <View
        style={[
          Styles.backgroundColor,
          Styles.borderBottom1,
          Styles.paddingStart16,
          Styles.flexJustifyCenter,
          { height: 80 },
        ]}
      >
        <List.Item
          title={data.item.employee_name}
          titleStyle={{ fontSize: 18 }}
          description={`Mob.: ${
            NullOrEmpty(data.item.employee_mobile_no)
              ? ""
              : data.item.employee_mobile_no
          }\nProfile Status: ${
            NullOrEmpty(data.item.profie_update_status)
              ? ""
              : data.item.profie_update_status == "0"
              ? "incomplete"
              : "complete"
          } `}
          onPress={() => {
            refRBSheet.current.open();
            setEmpCode(data.item.common_employee_code);
            setEmployeeName(data.item.employee_name);
            setMobileNo(data.item.employee_mobile_no);
            setBranch(data.item.branchname);
            setDepartment(data.item.departmentname);
            setDesignation(data.item.designationname);
            setProfileStatus(data.item.profie_update_status);
            setLoginStatus(data.item.employee_active_status);
            setVerifyStatus(data.item.mobile_OTP_verify_status);
          }}
          left={() => (
            <Icon
              style={{ marginVertical: 12, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="account-group"
            />
          )}
          right={() => (
            <Icon
              style={{ marginVertical: 18, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="eye"
            />
          )}
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
      setIsButtonLoading(true);
      SubmitVerify();
    }
  };

  const onOTPChange = (text) => {
    setOTP(text);
    setOtpError(false);
  };

  const [state, setState] = React.useState({ open: false });

  const onStateChange = ({ open }) => setState({ open });

  const { open } = state;
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="My Employee List" />
      {isLoading ? (
        <View
          style={[
            Styles.flex1,
            Styles.flexJustifyCenter,
            Styles.flexAlignCenter,
          ]}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : listData[0].length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Searchbar
            style={[Styles.margin16]}
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
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
            renderHiddenItem={(data, rowMap) =>
              RenderHiddenItemsConditional(data, rowMap, [EditCallback])
            }
          />
        </View>
      ) : (
        <NoItems
          icon="format-list-bulleted"
          text="No records found. Add records by clicking on plus icon."
        />
      )}

      {/* <FAB style={[Styles.margin16, Styles.primaryBgColor, { position: "absolute", right: 16, bottom: 16 }]} icon="account-search" onPress={AddCallback} /> */}
      <FAB.Group
        open={open}
        icon={open ? "window-minimize" : "account-search"}
        actions={[
          {
            icon: "magnify-plus",
            label: "Search Employee",
            onPress: SearchEmployee,
          },
          {
            icon: "account-plus",
            label: "Add Employee",
            onPress: AddEmployee,
          },
        ]}
        onStateChange={onStateChange}
        onPress={() => {
          if (open) {
            // do something if the speed dial is open
          }
        }}
      />

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarColor }}
      >
        {snackbarText}
      </Snackbar>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={620}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{employeeName}</Title>
          <ScrollView style={{ marginBottom: 64 }}>
            <List.Item title="Mobile No" description={mobileNo} />
            <List.Item title="Branch" description={branch} />
            <List.Item title="Department" description={department} />
            <List.Item title="Designation" description={designation} />
            <List.Item title="Employee Code" description={empcode} />
            <List.Item
              title="Profile Status"
              description={
                NullOrEmpty(profileStatus)
                  ? ""
                  : profileStatus
                  ? "Complete"
                  : "Incomplete"
              }
            />
            <List.Item
              title="Login Status"
              description={
                NullOrEmpty(loginStatus) ? "" : loginStatus ? "Yes" : "No"
              }
            />
            <List.Item
              title="Verify Status"
              description={
                NullOrEmpty(verifyStatus)
                  ? ""
                  : verifyStatus == "1"
                  ? "Verified"
                  : "Not Verified"
              }
            />
          </ScrollView>
        </View>
      </RBSheet>

      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={[Styles.borderRadius8]}
        >
          <Dialog.Title style={[Styles.fontSize16, Styles.textCenter]}>
            EMPLOYEE OTP NO VERIFICATION & LOGIN ACTIVATION
          </Dialog.Title>
          <Dialog.Content>
            <View
              style={[
                Styles.flexRow,
                Styles.flexJustifyCenter,
                Styles.flexAlignCenter,
                Styles.marginTop16,
              ]}
            >
              <Text>Enter OTP No:</Text>
              <TextInput
                mode="outlined"
                value={otp}
                onChangeText={onOTPChange}
                error={otpError}
                style={[
                  Styles.marginHorizontal12,
                  Styles.width80,
                  Styles.height40,
                  Styles.borderRadius4,
                  Styles.backgroundSecondaryColor,
                ]}
              />
            </View>
            <View>
              <HelperText
                type="error"
                visible={otpError}
                style={[Styles.textCenter]}
              >
                {communication.InvalidOTP}
              </HelperText>
            </View>
            <Card.Content style={[Styles.marginTop16]}>
              {/* <Button mode="contained" onPress={OnOTPSend}>
                Submit & Verify
              </Button> */}
              <DFButton
                mode="contained"
                onPress={OnOTPSend}
                title="Submit & Verify"
                loader={isButtonLoading}
              />
            </Card.Content>
          </Dialog.Content>
        </Dialog>
      </Portal>
    </View>
  );
};

export default EmployeeListScreen;
