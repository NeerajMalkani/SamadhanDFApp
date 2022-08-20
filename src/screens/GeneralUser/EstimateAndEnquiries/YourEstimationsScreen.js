import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef } from "react";
import { RefreshControl, ScrollView, TouchableNativeFeedback, View } from "react-native";
import { ActivityIndicator, List, Searchbar, Snackbar, Title } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";

let userID = 0;
const YourEstimationsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [designTypeName, setDesignTypeName] = React.useState("");
  const [estimationNo, setEstimationNo] = React.useState("");
  const [designCode, setDesignCode] = React.useState("");
  const [productName, setProductName] = React.useState("");
  const [totalSqFt, setTotalSqFt] = React.useState("");
  const [status, setStatus] = React.useState(false);

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
    Provider.getAll(`generaluserenquiryestimations/getuserallestimation?${new URLSearchParams(params)}`)
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
          return el.designTypeName.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 72 }]}>
        <List.Item
          title={data.item.designTypeName}
          titleStyle={{ fontSize: 18 }}
          description={data.item.totalAmount}
          onPress={() => {
            refRBSheet.current.open();
            setDesignTypeName(data.item.designTypeName);
            setEstimationNo("AUG" + pad(data.item.id.toString(), 4, "0"));
            setDesignCode("DS-" + pad(data.item.designTypeID.toString(), 4, "0"));
            setProductName(data.item.productName);
            setTotalSqFt(CalculateSqFt(data.item));
            setStatus(data.item.status);
          }}
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="calculator" />}
          right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
        />
      </View>
    );
  };

  const SendEnquiryCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    InsertDesignEstimationEnquiry(data.item.id, data.item.totalAmount);
  };

  const ViewDetailsCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("GetEstimationScreen", { userDesignEstimationID: data.item.id });
  };

  const CreateActionButtons = (icon, color, callback) => {
    return (
      <TouchableNativeFeedback onPress={callback}>
        <View style={[Styles.width72, Styles.height72, Styles.flexJustifyCenter, Styles.flexAlignCenter, { backgroundColor: color }]}>
          <Icon name={icon} color={theme.colors.textLight} size={28} />
        </View>
      </TouchableNativeFeedback>
    );
  };

  const RenderLocalHiddenItems = (data, rowMap, callbacks) => {
    return (
      <View style={[Styles.height64, Styles.flexRowReverse, Styles.flexAlignSelfEnd, Styles.flexAlignCenter, { width: 60 }]}>
        {CreateActionButtons("send", !data.item.status ? theme.multicolors.blue : theme.colors.backgroundSecondary, !data.item.status ? () => callbacks[0](data, rowMap) : null)}
        {CreateActionButtons("newspaper-variant", theme.multicolors.red, () => callbacks[1](data, rowMap))}
      </View>
    );
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
      <Header navigation={navigation} title="Your Estimations" />
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : listData[0].length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Searchbar style={[Styles.margin16]} placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
          <SwipeListView
            previewDuration={1000}
            previewOpenValue={-144}
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
            rightOpenValue={-144}
            renderItem={(data) => RenderItems(data)}
            renderHiddenItem={(data, rowMap) => RenderLocalHiddenItems(data, rowMap, [SendEnquiryCallback, ViewDetailsCallback])}
          />
        </View>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found. Add records by clicking on plus icon." />
      )}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={420} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View style={[Styles.flex1]}>
          <Title style={[Styles.paddingHorizontal16]}>{designTypeName}</Title>
          <ScrollView>
            <List.Item title="Estimation No." description={estimationNo} />
            <List.Item title="Design Code" description={designCode} />
            <List.Item title="Product Name" description={productName} />
            <List.Item title="Total Sq.Ft." description={totalSqFt} />
            <List.Item title="Enquiry Status" descriptionStyle={{ color: status ? theme.multicolors.green : theme.multicolors.red }} description={status ? "Yes" : "No"} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default YourEstimationsScreen;
