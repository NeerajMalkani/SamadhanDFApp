import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView, Text } from "react-native";
import {
  FAB, List, Snackbar, Searchbar, Title, Card, Portal, Dialog,
  Paragraph, Button, Subheading, Divider
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
import AdminUserViewList from "../../../components/AdminUserView";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
let userID = 0;

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
  const [company, setCompanyName] = React.useState("");
  const [firstname, setFirstName] = React.useState("");
  const [mobile, setMobileNo] = React.useState("");
  const [groupname, setGroupName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [selectedID, setSelectedID] = React.useState(0);

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
    if (from === "add" || from === "decline") {
      setSnackbarText("User " + (from === "add" ? "added" : "decline") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      data: {
        Sess_UserRefno: userID,
        group_refno: "all",
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.getuserapprovelist, params)
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
          return el.group_name.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };

  //update
  const hideDialog = () => setIsDialogVisible(false);

  const declineUserStatus = () => {
    hideDialog();
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

  //approveModel
  const openDeclineModel = () => {
    refRBSheet.current.close();
    setIsDialogVisible(true);
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.flexJustifyCenter, Styles.marginBottom8,
      Styles.paddingHorizontal16, Styles.flex1]}>
        <View style={[Styles.bordergray, Styles.borderRadius4, Styles.flex1, Styles.padding8]}>
          <Subheading selectable={true}>{data.item.firstname} <Text style={[Styles.primaryColor]} selectable={true}>{data.item.mobile_no}</Text></Subheading>
          <Subheading style={[Styles.fontSize12, Styles.textSecondaryColor, { height: 20 }]}>Company Name</Subheading>
          <Text>{data.item.company_name}</Text>
          <Divider />
          <Subheading style={[Styles.fontSize12, Styles.textSecondaryColor, { height: 20 }]}>Activity Role</Subheading>
          <Text>{data.item.group_name}</Text>
          <Divider />

          <View style={[Styles.width100per, Styles.flexRow, Styles.flexSpaceBetween]}>
            <View style={[Styles.width50per]}>
              <Subheading style={[Styles.fontSize12, Styles.textSecondaryColor, { height: 20 }]}>Department</Subheading>
              <Text>{data.item.departmentname}</Text>
            </View>
            <View style={[Styles.width50per]}>
              <Subheading style={[Styles.fontSize12, Styles.textSecondaryColor, { height: 20 }]}>Designation</Subheading>
              <Text>{data.item.designationname}</Text>
            </View>
          </View>
          <Divider />
          <View style={[Styles.width100per, Styles.flexRow, Styles.flexSpaceBetween]}>
            <View style={[Styles.width50per]}>
              <Subheading style={[Styles.fontSize12, Styles.textSecondaryColor, { height: 20 }]}>Username</Subheading>
              <Text selectable={true}>{data.item.user_name}</Text>
            </View>
            <View style={[Styles.width50per]}>
              <Subheading style={[Styles.fontSize12, Styles.textSecondaryColor, { height: 20 }]}>Password</Subheading>
              <Text selectable={true}>{data.item.password}</Text>
            </View>
          </View>
        </View>

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
            disableRightSwipe={true}
            rightOpenValue={-72}
            renderItem={(data) => RenderItems(data)}
          />
        </View>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found." />
      )}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={420} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{companyDetails}</Title>
          <ScrollView>
            <List.Item title="Activity Name" description={groupname} />
            <List.Item title="Company Name" description={company} />
            <List.Item title="Mobile No" description={mobile} />
          </ScrollView>
        </View>
        <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
          <Card.Content>
            <Button color={theme.colors.error} mode="contained" onPress={openDeclineModel}>
              Decline
            </Button>

          </Card.Content>
        </View>
      </RBSheet>
      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Confirmation</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Confirm to Decline ? </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <DFButton mode="contained" onPress={declineUserStatus} title="Ok" loader={isButtonLoading} />
            {/* <Button onPress={declineUserStatus}>Ok</Button> */}
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default ApprovedUserScreen;
