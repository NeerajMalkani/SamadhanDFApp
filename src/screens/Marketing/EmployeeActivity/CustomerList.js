import { ScrollView, View, LogBox, ActivityIndicator, RefreshControl } from "react-native";
import React from "react";
import {
  FAB, List, Searchbar, Snackbar, Title, Dialog, Portal, Paragraph, Button, Text, TextInput,
  Card, HelperText
} from "react-native-paper";
import { theme } from "../../../theme/apptheme";
import { Styles } from "../../../styles/styles";
import LabelInput from "./common/LabelInput";
import HDivider from "./common/HDivider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { useEffect, useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import { SwipeListView } from "react-native-swipe-list-view";
import { RenderHiddenItems, RenderHiddenItemGeneric } from "../../../components/ListActions";
import EditCompanyForm from "./forms/EditCompany";
import NoItems from '../../../components/NoItems';
import Search from "../../../components/Search";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
let userID = 0, companyID = 0, groupID = 0, branchID = 0;

const isNo = false;
const CardComponent = ({ companyName, address, display, navigation, EditCompany, MeetingPerson }) => {
  return (
    <View
      style={[
        {
          backgroundColor: "#eee",
          borderRadius: 8,
          elevation: 5,
        },
        Styles.paddingHorizontal8,
        Styles.paddingVertical12,
      ]}
    >
      <LabelInput label="Company Name" value={companyName} lg />
      <HDivider />
      <LabelInput label="Address" value={address} />
      <HDivider />
      <Text
        style={[
          Styles.marginBottom8,
          Styles.fontSize10,
          Styles.textSecondaryColor,
        ]}
      >
        Display
      </Text>
      <View style={[Styles.flexRow, Styles.flexSpaceBetween]}>
        <Button mode="outlined" labelStyle={[Styles.fontSize10, { color: display == 1 ? theme.colors.greenBorder : theme.colors.error }]}
          style={[{ borderWidth: 2, borderRadius: 4, borderColor: display == 1 ? theme.colors.greenBorder : theme.colors.error }]} >{`${display == 1 ? "YES" : "NO"}`}</Button>
        <Button mode="outlined" labelStyle={[Styles.fontSize10]}
          onPress={EditCompany}

          style={{ borderWidth: 2, borderRadius: 4, borderColor: theme.colors.greenBorder }}>Edit Company</Button>
        <Button mode="outlined" labelStyle={[Styles.fontSize10]}
          onPress={MeetingPerson}
          style={{ borderWidth: 2, borderRadius: 4, borderColor: theme.colors.greenBorder }}>acquaintance</Button>
      </View>
    </View >
  );
};

const CustomerList = ({ navigation }) => {

  const isFocused = useIsFocused();

  //#region variable
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [listData, setListData] = useState([]);
  const [listSearchData, setListSearchData] = useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  //#endregion

  //#region Functions
  const fetchCustomers = (from) => {
    if (from == "add" || from == "update") {
      setSnackbarText("Item " + (from == "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID,
        Sess_branch_refno: branchID,
        Sess_group_refno: groupID,
        mycustomer_refno: "all"
      }
    };
    Provider.createDFEmployee(Provider.API_URLS.employee_mycustomerlist, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const lisData = [...response.data.data];
            lisData.map((k, i) => {
              k.key = (parseInt(i) + 1).toString();
            });
            setListData(response.data.data);
            setListSearchData(response.data.data);

          }
        } else {
          setListData([]);
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

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      companyID = JSON.parse(userData).Sess_company_refno;
      groupID = JSON.parse(userData).Sess_group_refno;
      branchID = JSON.parse(userData).Sess_branch_refno;
      fetchCustomers();
    }
  };

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    // if (query === "") {
    //   listSearchData[1](listData[0]);
    // } else {
    //   listSearchData[1](
    //     listData[0].filter((el) => {
    //       return el.companyBranchName.toString().toLowerCase().includes(query.toLowerCase());
    //     })
    //   );
    // }
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.paddingHorizontal16,
      Styles.flexJustifyCenter, Styles.flex1, Styles.marginBottom12]}>
        <CardComponent
          key={data.item.key}
          companyName={data.item.company_name}
          address={data.item.address}
          display={data.item.view_status}
          navigation={navigation}
          EditCompany={() => {
            EditCompany(data.item)
          }}
          MeetingPerson={() => {
            MeetingPerson(data.item)
          }}

        />

      </View>
    );
  };

  const AddCallback = () => {
    navigation.navigate("EmployeeCustomerForm", { type: "add", fetchCustomers: fetchCustomers });
  };

  const EditCompany = (data) => {
    navigation.navigate("EditCompanyForm", {
      type: "edit",
      fetchCustomers: fetchCustomers,
      data: data,
    });
  };

  const MeetingPerson = (data) => {
    navigation.navigate("MeetingPerson", {
      headerTitle: data.company_name,
      type: "edit",
      fetchCustomers: fetchCustomers,
      data: data,
    });
  };

  //#endregion

  useEffect(() => {
    if (isFocused) {
      GetUserID();
    }
  }, [isFocused]);

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="My Customer List" />
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : listData.length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Search
            data={listData}
            setData={setListSearchData}
            filterFunction={[
              "company_name",
              "address",
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
                    fetchCustomers();
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
        <NoItems icon="format-list-bulleted" text="No records found. Add records by clicking on plus icon." />
      )}
      <FAB style={[Styles.fabStyle]} icon="plus" onPress={AddCallback} />
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000}
        style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>

    </View>
  );
};

export default CustomerList;
