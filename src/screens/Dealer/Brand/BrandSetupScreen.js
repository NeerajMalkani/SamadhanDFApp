import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView } from "react-native";
import { Button, FAB, List, Searchbar, Snackbar, Subheading, Title } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import RBSheet from "react-native-raw-bottom-sheet";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcon from "react-native-vector-icons/MaterialIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { APIConverter } from "../../../utils/apiconverter";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
let dealerID = 0;

const DealerBrandSetupScreen = ({ navigation }) => {
  //#region Variables

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [shouldShow, setShouldShow] = React.useState(false);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [appProviderDiscount, setAppProviderDiscount] = React.useState("");
  const [brandName, setBrandName] = React.useState("");
  const [brandPrefixName, setBrandPrefixName] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [contractorDiscount, setContractorDiscount] = React.useState("");
  const [generalDiscount, setGeneralDiscount] = React.useState("");
  const [referralPoints, setReferralPoints] = React.useState("");
  const [serviceName, setServiceName] = React.useState("");
  const [unitName, setUnitName] = React.useState("");
  const [isApprove, setIsApprove] = React.useState(0);
  const [isPublish, setIsPublish] = React.useState(0);

  const refRBSheet = useRef();

  //#endregion

  //#region Functions
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      const parsedUserData = JSON.parse(userData);
      companyAdminID = parsedUserData.Sess_CompanyAdmin_UserRefno;
      dealerID = parsedUserData.UserID;
      if (parsedUserData.Sess_if_create_brand == 1) {
        setShouldShow(true);
        FetchData();
      } else {
        setShouldShow(false);
      }
    }
  };

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      data: {
        Sess_UserRefno: dealerID,
        brand_refno: "all",
      },
    };
    Provider.createDF(Provider.API_URLS.DealerBrandRefNoCheck, params)
      .then((response) => {
        console.log(response.data);
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
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
          return el.brandName.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 72 }]}>
        <List.Item
          title={data.item.brandName}
          titleStyle={{ fontSize: 18 }}
          description={"Display: " + (data.item.display ? "Yes" : "No")}
          onPress={() => {
            refRBSheet.current.open();
            setBrandName(data.item.brandName);
            setBrandPrefixName(data.item.brandPrefixName);
            setServiceName(data.item.serviceName);
            setCategoryName(data.item.categoryName);
            setGeneralDiscount(data.item.generalDiscount + "%");
            setAppProviderDiscount(data.item.appProviderDiscount + "%");
            setReferralPoints(data.item.referralPoints + "%");
            setContractorDiscount(data.item.contractorDiscount + "%");
            setUnitName(data.item.unitName);
            setIsApprove(data.item.isapprove);
            setIsPublish(data.item.ispublish);
          }}
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="account-group" />}
          right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
        />
      </View>
    );
  };

  const AddCallback = () => {
    navigation.navigate("AddDealerBrandSetupScreen", { type: "add", fetchData: FetchData });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddDealerBrandSetupScreen", {
      type: "edit",
      fetchData: FetchData,
      data: {
        id: data.item.brandID,
        appProviderDiscount: data.item.appProviderDiscount,
        brandID: data.item.brandMasterID,
        brandName: data.item.brandName,
        brandPrefixName: data.item.brandPrefixName,
        categoryID: data.item.categoryID,
        categoryName: data.item.categoryName,
        contractorDiscount: data.item.contractorDiscount,
        generalDiscount: data.item.generalDiscount,
        referralPoints: data.item.referralPoints,
        serviceID: data.item.serviceID,
        serviceName: data.item.serviceName,
        unitName: data.item.displayUnit,
        unitOfSalesID: data.item.unitOfSalesID,
        display: data.item.display,
      },
    });
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Brand Setup" />
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : !shouldShow ? (
        <View style={[Styles.flex1, Styles.flexAlignCenter, Styles.flexJustifyCenter, Styles.flexColumn, Styles.backgroundColor]}>
          <MaterialIcon name="error" color={theme.colors.error} size={48} />
          <Subheading style={[Styles.textSecondaryColor, Styles.paddingTop8, Styles.textCenter, { padding: 32 }]}>Would like to create brand and product? Please activate this option</Subheading>
          <Button
            mode="contained"
            onPress={() => {
              navigation.navigate("UserProfile", { from: "brand" });
            }}
          >
            Activate
          </Button>
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
      {!shouldShow ? null : <FAB style={[Styles.margin16, Styles.primaryBgColor, { position: "absolute", right: 16, bottom: 16 }]} icon="plus" onPress={AddCallback} />}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={420} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{brandName}</Title>
          <ScrollView>
            <List.Item title="Brand Prefix Name" description={brandPrefixName} />
            <List.Item title="Service Name" description={serviceName} />
            <List.Item title="Category Name" description={categoryName} />
            <List.Item title="General Discount" description={generalDiscount} />
            <List.Item title="App Provider Promotion" description={appProviderDiscount} />
            <List.Item title="Referral Points" description={referralPoints} />
            <List.Item title="Contractor Discount" description={contractorDiscount} />
            <List.Item title="Sale Unit" description={unitName} />
            <List.Item title="Approved" description={isApprove == 1 ? "Yes" : "No"} />
            <List.Item title="Announced" description={isPublish == 1 ? "Yes" : "No"} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};
export default DealerBrandSetupScreen;
