import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, RefreshControl, LogBox, ScrollView } from "react-native";
import { FAB, List, Searchbar, Snackbar, Title, Dialog, Portal, Paragraph, Button, Text, TextInput, Card, HelperText, DataTable } from "react-native-paper";
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
import { NullOrEmpty } from "../../../utils/validations";
import { width } from "@fortawesome/free-solid-svg-icons/faBarsStaggered";
import { communication } from "../../../utils/communication";
// import SearchNAdd from "../../../AddItems/SearchNAdd";


LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
let userID = 0;

const RateCardSetup = ({ navigation }) => {
   //#region Variables

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

  const [serviceName, setServiceName] = React.useState("");

  const [category, setCategory] = React.useState("");
  const [serviceProductName, setServiceProductName] = React.useState("");
  const [unit, setUnit] = React.useState("");
  const [rate, setRate] = React.useState("");

  const [rateWithMaterials, setRateWithMaterials] = React.useState("");
  const [rateWithoutMaterials, setRateWithoutMaterials] = React.useState("");

  const [altRateWithMaterials, setAltRateWithMaterials] = React.useState("");
  const [altRateWithoutMaterials, setAltRateWithoutMaterials] = React.useState("");

  const [specification, setSpecification] = React.useState("");
  const [shortSpecification, setShortSpecification] = React.useState("");

  const [alternativeRate, setAlternativeRate] = React.useState("");
  const [material, setMaterial] = React.useState("");
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

  const showDialog = () => setVisible(true);

  const hideDialog = () => setVisible(false);

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      ContractorID: userID,
    };
    Provider.getAll(`master/getcontractorratecardlist?${new URLSearchParams(params)}`)
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

  // const AddCallback = () => {
  //   navigation.navigate("SearchNAdd", { type: "add", fetchData: FetchData });
  // };

  const AddCallback = () => {
    navigation.navigate("AddRateCard", { type: "add", fetchData: FetchData });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddRateCard", {
      type: "edit",
      fetchData: FetchData,
      data: {
        rateCardID: data.item.id,
        id: data.item.productID,
        activityRoleName: data.item.activityRoleName,
        activityID: data.item.activityID,
        serviceName: data.item.serviceName,
        serviceID: data.item.serviceID,
        unitName: data.item.unitName,
        unitOfSalesID: data.item.unitOfSalesID,
        categoryName: data.item.categoryName,
        productName: data.item.productName,
        categoryID: data.item.categoryID,
        hsnsacCode: data.item.hsnsacCode,
        unit1ID: data.item.unit1ID,
        unit2ID: data.item.unit2ID,
        unit1Name: data.item.unit1Name,
        unit2Name: data.item.unit2Name,
        selectedUnitID: data.item.selectedUnitID,
        // gstRate: data.item.gstRate.toFixed(2),
        rateWithMaterials: data.item.rateWithMaterials.toFixed(2),
        rateWithoutMaterials: data.item.rateWithoutMaterials.toFixed(2),
        altRateWithMaterials: data.item.altRateWithMaterials.toFixed(2),
        altRateWithoutMaterials: data.item.altRateWithoutMaterials.toFixed(2),
        shortSpecification: data.item.shortSpecification,
        specification: data.item.specification,
        display: data.item.display,
      },
    });
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 80 }]}>
        <List.Item
          title={data.item.productName}
          titleStyle={{ fontSize: 18 }}
          description={`Service Name: ${NullOrEmpty(data.item.serviceName) ? "" : data.item.serviceName}\nCategory Name: ${NullOrEmpty(data.item.categoryName) ? "" : data.item.categoryName} `}
          onPress={() => {

            refRBSheet.current.open();
            setServiceName(data.item.serviceName);
            setCategory(data.item.categoryName);
            setServiceProductName(data.item.serviceProductName);

            setSpecification(data.item.specification);
            setShortSpecification(data.item.shortSpecification);

            setUnit(data.item.selectedUnitName);

            setRateWithMaterials(data.item.rateWithMaterials);
            setRateWithoutMaterials(data.item.rateWithoutMaterials);
            setAltRateWithMaterials(data.item.altRateWithMaterials);
            setAltRateWithoutMaterials(data.item.altRateWithoutMaterials);

            setRate(data.item.rate);
            setAlternativeRate(data.item.alternativeRate);
            setMaterial(data.item.material);
            setDispaly(data.item.display == true ? "Yes" : "No");

          }}
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="cards" />}
          right={() => <Icon style={{ marginVertical: 18, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
        />

      </View>
    );
  };


 //#endregion 
 
  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Rate Card List" />
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
          <Title style={[Styles.paddingHorizontal16]}>{serviceName}</Title>
          <ScrollView style={{ marginBottom: 64 }}>
            <List.Item title="Service Name" description={serviceName} />
            <List.Item title="Category" description={category} />
            <List.Item title="Service Product Name" description={serviceProductName} />
            <List.Item title="Unit" description={unit} />
            <View style={[Styles.padding16]}>
              <DataTable style={[Styles.backgroundSecondaryColor, Styles.borderRadius4, Styles.flexJustifyCenter]} >
                <DataTable.Header>
                  <DataTable.Title style={[{ flex: 1, justifyContent: 'center' }]}>Rate Unit</DataTable.Title>
                  <DataTable.Title style={[{ flex: 1, justifyContent: 'center' }]} numeric>Alt Rate Unit</DataTable.Title>
                  <DataTable.Title style={[{ flex: 1, justifyContent: 'center' }]} numeric>Material</DataTable.Title>
                </DataTable.Header>

                <DataTable.Row>
                  <DataTable.Cell style={[{ flex: 1, justifyContent: 'center' }]}>{rateWithMaterials}</DataTable.Cell>
                  <DataTable.Cell style={[{ flex: 1, justifyContent: 'center' }]} numeric>{altRateWithMaterials}</DataTable.Cell>
                  <DataTable.Cell style={[{ flex: 1, justifyContent: 'center' }]} numeric><Button
                    mode="contained"
                    labelStyle={[{ textTransform: "capitalize" }]}
                    style={[Styles.marginStart4, Styles.greenBgColor]}
                    icon={() => <Icon name="checkbox-marked-circle" size={18} color={theme.colors.textLight} />}
                  >
                    Yes
                  </Button></DataTable.Cell>
                </DataTable.Row>

                <DataTable.Row>
                  <DataTable.Cell style={[{ flex: 1, justifyContent: 'center' }]}>{rateWithoutMaterials}</DataTable.Cell>
                  <DataTable.Cell style={[{ flex: 1, justifyContent: 'center' }]} numeric>{altRateWithoutMaterials}</DataTable.Cell>
                  <DataTable.Cell style={[{ flex: 1, justifyContent: 'center' }]} numeric><Button
                    mode="contained"
                    labelStyle={[{ textTransform: "capitalize" }]}
                    style={[Styles.marginStart4, Styles.redBgColor]}
                    icon={() => <Icon name="close-circle" size={18} color={theme.colors.textLight} />}
                  >
                    No
                  </Button></DataTable.Cell>
                </DataTable.Row>

              </DataTable>
            </View>
            <List.Item title="Short Specification" description={shortSpecification} />
            <List.Item title="Specification" description={specification} />
            <List.Item title="Display" description={display} />
            {/* <List.Item title="Verify Status" description={NullOrEmpty(action) ? "" : verifyStatus ? "Verified":"Not Verified"} /> */}
          </ScrollView>
        </View>
      </RBSheet>

    </View>
  );
};

export default RateCardSetup;
