import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  TouchableNativeFeedback,
  View,
} from "react-native";
import {
  ActivityIndicator,
  List,
  Searchbar,
  Snackbar,
  Title,
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
import { communication } from "../../../utils/communication";
import Search from "../../../components/Search";

let userID = 0,
  groupID = 0;
const YourEstimationsScreen = ({ navigation }) => {
  //#region Variables

  const [isLoading, setIsLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [listSearchData, setListSearchData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.success);

  const [designTypeName, setDesignTypeName] = useState("");
  const [estimationNo, setEstimationNo] = useState("");
  const [designCode, setDesignCode] = useState("");
  const [productName, setProductName] = useState("");
  const [totalSqFt, setTotalSqFt] = useState("");
  const [status, setStatus] = useState(false);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [contractorEstimation, setContractorEstimation] = useState(false);
  const [estimationID, setEstimationID] = useState("");

  const refRBSheet = useRef();
  //#endregion

  //#region Functions

  const showDialog = () => setIsDialogVisible(true);
  const hideDialog = () => setIsDialogVisible(false);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      groupID = JSON.parse(userData).Sess_group_refno;
      FetchData();
    }
  };

  const FetchData = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.myestimationlist, params)
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

  const CheckContractorStatusOnEstimation = (userDesignEstimationID) => {
    const params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID,
        estimation_refno: userDesignEstimationID.toString(),
      },
    };
    Provider.createDFCommon(
      Provider.API_URLS.myestimationcontractordetails,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          setContractorEstimation(true);
        } else {
          setContractorEstimation(false);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
        setContractorEstimation(false);
      });
  };

  const InsertDesignEstimationEnquiry = (
    userDesignEstimationID,
    totalAmount
  ) => {
    const params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID,
        estimation_refno: userDesignEstimationID.toString(),
      },
    };
    Provider.createDFCommon(Provider.API_URLS.sc_estimationsendenquiry, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          hideDialog();
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

  const RenderItems = (data) => {
    return (
      <View
        style={[
          Styles.backgroundColor,
          Styles.borderBottom1,
          Styles.paddingStart16,
          Styles.flexJustifyCenter,
          { height: 72 },
        ]}
      >
        <List.Item
          title={data.item.designtype_name}
          titleStyle={{ fontSize: 18 }}
          description={`Product Name: ${data.item.service_product_name}\nTotal Amount: ${data.item.total_amount}`}
          onPress={() => {
            setContractorEstimation(false);
            setEstimationID(data.item.estimation_refno);
            if (data.item.send_enquiry_status == "1") {
              CheckContractorStatusOnEstimation(data.item.estimation_refno);
            }
            refRBSheet.current.open();
            setEstimationNo(data.item.estimation_no_txt);
            setDesignCode(data.item.design_no);
            setDesignTypeName(data.item.designtype_name);
            setProductName(data.item.service_product_name);
            setTotalSqFt(data.item.totalfoot);
            setStatus(data.item.send_enquiry_status);
          }}
          left={() => (
            <Image
              source={{ uri: data.item.design_image_url }}
              style={[Styles.width56, Styles.height56]}
            />
          )}
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

  const SendEnquiryCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    setEstimationID(data.item.estimation_refno);
    showDialog();
  };

  const SendEnquiry = () => {
    InsertDesignEstimationEnquiry(estimationID);
  };

  const ViewDetailsCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("GetEstimationScreen", {
      userDesignEstimationID: data.item.estimation_refno,
      designImage: data.item.design_image_url,
      enquirySent: true,
    });
  };

  const CreateActionButtons = (icon, color, callback) => {
    return (
      <TouchableNativeFeedback onPress={callback}>
        <View
          style={[
            Styles.width72,
            Styles.height72,
            Styles.flexJustifyCenter,
            Styles.flexAlignCenter,
            { backgroundColor: color },
          ]}
        >
          <Icon name={icon} color={theme.colors.textLight} size={28} />
        </View>
      </TouchableNativeFeedback>
    );
  };

  const RenderLocalHiddenItems = (data, rowMap, callbacks) => {
    return (
      <View
        style={[
          Styles.height64,
          Styles.flexRowReverse,
          Styles.flexAlignSelfEnd,
          Styles.flexAlignCenter,
          { width: 60 },
        ]}
      >
        {data.item.send_enquiry_status == "0" &&
          CreateActionButtons(
            "send",
            !data.item.status
              ? theme.multicolors.blue
              : theme.colors.backgroundSecondary,
            !data.item.status ? () => callbacks[0](data, rowMap) : null
          )}

        {CreateActionButtons("newspaper-variant", theme.multicolors.red, () =>
          callbacks[1](data, rowMap)
        )}
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
      const inches =
        ((parseInt(lf) * 12 + parseInt(li)) *
          (parseInt(wf) * 12 + parseInt(wi))) /
        144;
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
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Your Estimations" />
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
              "design_no",
              "designtype_name",
              "estimation_no",
              "estimation_no_txt",
              "service_product_name",
              "total_amount",
              "totalfoot",
            ]}
          />
          {listSearchData?.length > 0 ? (
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
              data={listSearchData}
              disableRightSwipe={true}
              rightOpenValue={-144}
              renderItem={(data) => RenderItems(data)}
              renderHiddenItem={(data, rowMap) =>
                RenderLocalHiddenItems(data, rowMap, [
                  SendEnquiryCallback,
                  ViewDetailsCallback,
                ])
              }
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
        height={420}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View style={[Styles.flex1]}>
          <Title style={[Styles.paddingHorizontal16]}>{designTypeName}</Title>
          <ScrollView>
            <List.Item title="Estimation No." description={estimationNo} />
            <List.Item title="Design Code" description={designCode} />
            <List.Item title="Product Name" description={productName} />
            <List.Item title="Total Sq.Ft." description={totalSqFt} />
            <List.Item
              title="Enquiry Status"
              descriptionStyle={{
                color:
                  status == "1"
                    ? theme.multicolors.green
                    : theme.multicolors.red,
              }}
              description={status == "1" ? "Yes" : "No"}
            />
            {contractorEstimation && (
              <>
                <View
                  style={[
                    Styles.flex1,
                    Styles.marginBottom24,
                    Styles.paddingHorizontal16,
                  ]}
                >
                  <Button
                    mode="contained"
                    onPress={() => {
                      refRBSheet.current.close();
                      navigation.navigate("EstimationContractorStatusScreen", {
                        userDesignEstimationID: estimationID,
                      });
                    }}
                  >
                    Check Contractor List
                  </Button>
                </View>
              </>
            )}
          </ScrollView>
        </View>
      </RBSheet>
      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Confirmation</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Confirm to Send Enquiry?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={SendEnquiry}>Ok</Button>
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default YourEstimationsScreen;
