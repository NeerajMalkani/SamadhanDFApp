import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  View,
  LogBox,
  RefreshControl,
  ScrollView,
} from "react-native";
import {
  List,
  Snackbar,
  Title,
  Card,
  Portal,
  Dialog,
  Paragraph,
  Button,
} from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { NullOrEmpty } from "../../../utils/validations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DFButton from "../../../components/Button";
import Search from "../../../components/Search";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
let userID = 0;

const PendingUserScreen = ({ navigation }) => {
  //#region Variables
  const [isLoading, setIsLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [listSearchData, setListSearchData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.success);

  const [companyDetails, setCompanyDetails] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [groupname, setGroupName] = useState("");
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isDisableDialogVisible, setIsDisableDialogVisible] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [selectedID, setSelectedID] = useState(0);

  const refRBSheet = useRef();
  //#endregion

  //#region Functions
  useEffect(() => {
    GetUserID();
  }, []);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      FetchData();
    }
  };

  const FetchData = (from) => {
    if (from === "approve" || from === "decline") {
      setSnackbarText(
        "User " +
          (from === "approve" ? "approved" : "declined") +
          " successfully"
      );
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      data: {
        Sess_UserRefno: userID,
        group_refno: "all",
      },
    };
    Provider.createDFAdmin("getuserpendinglist/", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const lisData = [...response.data.data];
            lisData.map((k, i) => {
              k.key = (parseInt(i) + 1).toString();
            });
            console.log(response.data.data);
            setListData(response.data.data);
            setListSearchData(response.data.data);
          }
        } else {
          setListData([]);
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

  const RenderItems = (data) => {
    return (
      <View
        style={[
          Styles.backgroundColor,
          Styles.borderBottom1,
          Styles.paddingStart16,
          Styles.flexJustifyCenter,
          { height: 84 },
        ]}
      >
        <List.Item
          title={
            NullOrEmpty(data.item.firstname)
              ? ""
              : data.item.firstname.split(",")[0]
          }
          titleStyle={{ fontSize: 18 }}
          description={`Activity Role: ${
            NullOrEmpty(data.item.group_name) ? "" : data.item.group_name
          }\nCompany: ${
            NullOrEmpty(data.item.company_name) ? "" : data.item.company_name
          }`}
          left={() => (
            <Icon
              style={{ marginVertical: 12, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="account"
            />
          )}
          onPress={() => {
            refRBSheet.current.open();
            setSelectedID(data.item.user_refno);
            setCompanyDetails(data.item.firstname);
            setGroupName(data.item.group_name);
            setCompanyName(
              NullOrEmpty(data.item.company_name) ? "" : data.item.company_name
            );
            setMobileNo(
              NullOrEmpty(data.item.mobile_no) ? "" : data.item.mobile_no
            );
          }}
          right={() => (
            <Icon
              style={{ marginVertical: 12, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="eye"
            />
          )}
        />
      </View>
    );
  };

  //approveModel
  const hideDialog = () => setIsDialogVisible(false);
  const hideDisableDialog = () => setIsDisableDialogVisible(false);

  const approveUserStatus = () => {
    hideDialog();
    setIsButtonLoading(true);
    const params = {
      data: {
        Sess_UserRefno: userID,
        user_refno: selectedID,
      },
    };
    Provider.createDFAdmin("userapprovestatus/", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          FetchData("approve");
        } else {
          setSnackbarText(communication.NoData);
          setSnackbarVisible(true);
        }
        setIsButtonLoading(false);
      })
      .catch((e) => {
        setSnackbarText(e.message);
        setSnackbarVisible(true);
        setIsButtonLoading(false);
      });
  };

  const declineUserStatus = () => {
    hideDisableDialog();
    setIsButtonLoading(true);
    const params = {
      data: {
        Sess_UserRefno: userID,
        user_refno: selectedID,
      },
    };
    Provider.createDFAdmin("userdeclinestatus/", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          FetchData("decline");
        } else {
          setSnackbarText(communication.NoData);
          setSnackbarVisible(true);
        }
        setIsButtonLoading(false);
      })
      .catch((e) => {
        setSnackbarText(e.message);
        setSnackbarVisible(true);
        setIsButtonLoading(false);
      });
  };

  const openApproveModel = () => {
    refRBSheet.current.close();
    setIsDialogVisible(true);
  };

  const openDeclineModel = () => {
    refRBSheet.current.close();
    setIsDisableDialogVisible(true);
  };

  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="PENDING USERS" />
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
      ) : listData.length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Search
            data={listData}
            setData={setListSearchData}
            filterFunction={[
              "company_name",
              "departmentname",
              "designationname",
              "approve_status",
              "firstname",
              "group_name",
              "mobile_no",
              "password",
              "user_name",
            ]}
          />
          {listSearchData?.length > 0 ? (
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
              data={listSearchData}
              disableRightSwipe={true}
              rightOpenValue={-72}
              renderItem={(data) => RenderItems(data)}
            />
          ) : (
            <NoItems
              icon="format-list-bulleted"
              text="No records found for your query"
            />
          )}
        </View>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found." />
      )}

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
        height={360}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{companyDetails}</Title>
          <ScrollView>
            <List.Item title="Activity Role" description={groupname} />
            <List.Item title="Company Name" description={companyName} />
            <List.Item title="Mobile No" description={mobileNo} />
          </ScrollView>
        </View>
        <View
          style={[
            Styles.backgroundColor,
            Styles.width100per,
            Styles.flexSpaceBetween,
            Styles.flexRow,
            Styles.marginTop32,
            Styles.padding16,
            { position: "absolute", bottom: 0, elevation: 3 },
          ]}
        >
          <View style={[Styles.backgroundColor, Styles.width48per]}>
            <Card.Content>
              <Button
                color={theme.colors.success}
                mode="contained"
                onPress={openApproveModel}
              >
                Approve
              </Button>
            </Card.Content>
          </View>
          <View style={[Styles.backgroundColor, Styles.width48per]}>
            <Card.Content>
              <Button
                color={theme.colors.error}
                mode="contained"
                onPress={openDeclineModel}
              >
                Decline
              </Button>
            </Card.Content>
          </View>
        </View>
      </RBSheet>
      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Confirmation</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Confirm to Approve ? </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            {/* <Button onPress={approveUserStatus}>Ok</Button> */}
            <DFButton
              mode="contained"
              onPress={approveUserStatus}
              title="Ok"
              loader={isButtonLoading}
            />
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog visible={isDisableDialogVisible} onDismiss={hideDisableDialog}>
          <Dialog.Title>Confirmation</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Confirm to Decline ? </Paragraph>
          </Dialog.Content>
          {/* <Dialog.Actions> */}
        </Dialog>
      </Portal>
      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Confirmation</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Confirm to Decline ? </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={declineUserStatus}>Ok</Button>
            <DFButton
              mode="contained"
              onPress={declineUserStatus}
              title="Ok"
              loader={isButtonLoading}
            />
            <Button onPress={hideDisableDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default PendingUserScreen;
