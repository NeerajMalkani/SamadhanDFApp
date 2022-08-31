import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef } from "react";
import { Image, RefreshControl, ScrollView, TouchableNativeFeedback, View } from "react-native";
import { ActivityIndicator, List, Searchbar, Snackbar, Text, Title } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";

let userID = 0;
const DesignPendingTab = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [fullName, setFullName] = React.useState("");
  const [estimationNo, setEstimationNo] = React.useState("");
  const [serviceName, setServiceName] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [productName, setProductName] = React.useState("");
  const [designTypeName, setDesignTypeName] = React.useState("");
  const [designCode, setDesignCode] = React.useState("");
  const [totalSqFt, setTotalSqFt] = React.useState("");
  const [materialCost, setMaterialCost] = React.useState("");
  const [labourCost, setLabourCost] = React.useState("");

  const refRBSheet = useRef();

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      FetchData();
    }
  };
  const FetchData = () => {
    let params = {
      UserID: userID,
    };
    Provider.getAll(`contractorquotationestimation/getcontractorallestimation?${new URLSearchParams(params)}`)
      .then((response) => {
        console.log(response.data);
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
  const InsertDesignEstimationEnquiry = (userDesignEstimationID, totalAmount) => {
    const params = {
      ID: userDesignEstimationID,
      TotalAmount: totalAmount,
      Status: true,
    };
    Provider.create("generaluserenquiryestimations/insertdesignestimateenquiries", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          setSnackbarText(communication.EstimationSent);
          setSnackbarColor(theme.colors.success);
          setSnackbarVisible(true);
          FetchData();
        } else {
          setSnackbarText(communication.InsertError);
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarColor(theme.colors.error);
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
          return el.fullName.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };

  const ClickRow = (data) => {
    refRBSheet.current.open();
    setFullName(data.fullName);
    setEstimationNo("AUG" + pad(data.id.toString(), 4, "0"));
    setServiceName(data.serviceName);
    setCategoryName(data.categoryName);
    setProductName(data.productName);
    setDesignTypeName(data.designTypeName);
    setDesignCode("DS-" + pad(data.designTypeID.toString(), 4, "0"));
    setTotalSqFt(CalculateSqFt(data));
    setMaterialCost(data.subtotalAmount.toFixed(4));
    setLabourCost(data.labourCost.toFixed(4));
  };

  const CalculateSqFt = (data) => {
    if (data) {
      const lengthFeetIn = data["length"].toString().split(".");
      const widthFeetIn = data["width"].toString().split(".");
      const lf = lengthFeetIn[0];
      const li = lengthFeetIn.length > 1 ? lengthFeetIn[1] : 0;
      const wf = widthFeetIn[0];
      const wi = widthFeetIn.length > 1 ? widthFeetIn[1] : 0;
      const inches = ((parseInt(lf) * 12 + parseInt(li)) * (parseInt(wf) * 12 + parseInt(wi))) / 144;
      return parseFloat(inches).toFixed(4);
    } else {
      return 0;
    }
  };

  function pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  return (
    <View style={[Styles.flex1]}>
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : listData[0].length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Searchbar style={[Styles.margin16]} placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
          <ScrollView refreshControl={<RefreshControl colors={[theme.colors.primary]} refreshing={refreshing} onRefresh={() => FetchData()} />}>
            {listSearchData[0].map((k, i) => {
              return (
                <View key={i} style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter]}>
                  <List.Item title={k.fullName} titleStyle={{ fontSize: 18 }} description={k.username} onPress={() => ClickRow(k)} left={() => <Image source={{ uri: k.designTypeImage }} style={[Styles.width56, Styles.height56]} />} right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />} />
                </View>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found." />
      )}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={620} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View style={[Styles.flex1]}>
          <View style={[Styles.flexRow, { justifyContent: "flex-end" }]}>
            <Title numberOfLines={1} style={[Styles.flex1, Styles.paddingHorizontal16]}>
              {fullName}
            </Title>
            <View style={[Styles.flexRow, Styles.paddingEnd8]}>
              <TouchableNativeFeedback>
                <View style={[Styles.padding12]}>
                  <Icon name="pencil" size={24} color={theme.multicolors.yellow} />
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback>
                <View style={[Styles.padding12]}>
                  <Icon name="check-circle" size={24} color={theme.multicolors.green} />
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback>
                <View style={[Styles.padding12]}>
                  <Icon name="cancel" size={24} color={theme.multicolors.red} />
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>
          <ScrollView>
            <List.Item title="Estimation No." description={estimationNo} />
            <List.Item title="Service" description={serviceName} />
            <List.Item title="Category" description={categoryName} />
            <List.Item title="Product" description={productName} />
            <List.Item title="Design Type" description={designTypeName} />
            <List.Item title="Design No." description={designCode} />
            <List.Item title="Total Sq.Ft." description={totalSqFt} />
            <List.Item title="Material Cost" description={materialCost} />
            <List.Item title="Labour Cost" description={labourCost} />
            <List.Item
              title="Approval Status"
              description={() => {
                return (
                  <View style={[Styles.flexRow]}>
                    <Text style={[Styles.redBgColor, Styles.textColorWhite, Styles.marginTop8, Styles.borderRadius4, Styles.paddingVertical4, Styles.paddingHorizontal12]}>Pending</Text>
                  </View>
                );
              }}
            />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default DesignPendingTab;
