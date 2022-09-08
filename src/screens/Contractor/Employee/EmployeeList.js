import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, RefreshControl, LogBox, ScrollView } from "react-native";
import { FAB, List, Searchbar, Snackbar, Title } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import NoItems from "../../../components/NoItems";
import { theme } from "../../../theme/apptheme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RenderHiddenItems } from "../../../components/ListActions";
import { Styles } from "../../../styles/styles";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
let userID = 0;
const ClientScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const [companyName, setCompanyName] = React.useState("");
  const [contactPerson, setContactPerson] = React.useState("");
  const [contactMobileNumber, setContactMobileNumber] = React.useState("");
  const [address1, setAddress1] = React.useState("");
  const [stateName, setStateName] = React.useState("");
  const [cityName, setCityName] = React.useState("");
  const [pincode, setPincode] = React.useState("");
  const [gstNumber, setGstNumber] = React.useState("");
  const [pan, setPan] = React.useState("");
  const [serviceType, setServiceType] = React.useState(0);
  const [addedBy, setAddedBy] = React.useState(false);
  const [display, setDisplay] = React.useState(false);

  const refRBSheet = useRef();

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      FetchData();
    }
  };

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      AddedByUserID: userID,
    };
    Provider.getAll(`contractorquotationestimation/getclients?${new URLSearchParams(params)}`)
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
    navigation.navigate("AddClientScreen", { type: "add", fetchData: FetchData });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddClientScreen", {
      type: "edit",
      fetchData: FetchData,
      data: {
        id: data.item.id,
        addedByUserID: data.item.addedByUserID,
        companyName: data.item.companyName,
        contactPerson: data.item.contactPerson,
        contactMobileNumber: data.item.contactMobileNumber,
        address1: data.item.address1,
        stateID: data.item.stateID,
        stateName: data.item.stateName,
        cityID: data.item.cityID,
        cityName: data.item.cityName,
        pincode: data.item.pincode.toString(),
        gstNumber: data.item.gstNumber,
        pan: data.item.pan,
        serviceType: data.item.serviceType,
        addedBy: data.item.addedBy,
        display: data.item.display,
      },
    });
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 72 }]}>
        <List.Item
          title={data.item.companyName}
          titleStyle={{ fontSize: 18 }}
          description={"Mob.: " + data.item.contactMobileNumber}
          onPress={() => {
            let serviceTypeRole = "";
            switch(data.item.serviceType){
              case 1:
                serviceTypeRole = "Vendor";
               break; 
               case 2:
                serviceTypeRole = "Supplier";
               break; 
               case 3:
                serviceTypeRole = "Client";
               break; 
               case 12:
                serviceTypeRole = "Vendor, Supplier";
               break; 
               case 13:
                serviceTypeRole = "Vendor, Client";
               break; 
               case 23:
                serviceTypeRole = "Supplier, Client";
               break; 
               case 123:
                serviceTypeRole = "Vendor, Supplier, Client";
               break; 
            }
            refRBSheet.current.open();
            setCompanyName(data.item.companyName);
            setContactPerson(data.item.contactPerson);
            setContactMobileNumber(data.item.contactMobileNumber);
            setAddress1(data.item.address1);
            setStateName(data.item.stateName);
            setCityName(data.item.cityName);
            setPincode(data.item.pincode);
            setGstNumber(data.item.gstNumber);
            setPan(data.item.pan);
            setServiceType(serviceTypeRole);
            setAddedBy(data.item.addedBy);
            setDisplay(data.item.display);
          }}
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="account-group" />}
          right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
        />
      </View>
    );
  };

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Clients" />
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
      <FAB style={[Styles.margin16, Styles.primaryBgColor, { position: "absolute", right: 16, bottom: 16 }]} icon="plus" onPress={AddCallback} />
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={620} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{companyName}</Title>
          <ScrollView style={{marginBottom: 64}}>
            <List.Item title="Contact Person" description={contactPerson} />
            <List.Item title="Contact Mobile No" description={contactMobileNumber} />
            <List.Item title="Address" description={address1} />
            <List.Item title="State Name" description={stateName} />
            <List.Item title="City Name" description={cityName} />
            <List.Item title="Pincode" description={pincode} />
            <List.Item title="GST" description={gstNumber} />
            <List.Item title="PAN" description={pan} />
            <List.Item title="Service Type" description={serviceType} />
            <List.Item title="Added By" description={addedBy == 1 ? "Create" : "Add"} />
            <List.Item title="Display" description={display ? "Yes" : "No"} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default ClientScreen;
