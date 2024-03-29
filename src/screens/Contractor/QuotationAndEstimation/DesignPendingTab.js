import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { BASE_URL_Contractor } from "../../../api/Provider";
import {
  Image,
  ActivityIndicator,
  View,
  RefreshControl,
  LogBox,
  ScrollView,
} from "react-native";
import {
  List,
  Snackbar,
  Title,
  Dialog,
  Portal,
  Button,
  Text,
  TextInput,
  Card,
  HelperText,
  Subheading,
  RadioButton,
} from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import RBSheet from "react-native-raw-bottom-sheet";

import Provider from "../../../api/Provider";
import NoItems from "../../../components/NoItems";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";

import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Styles } from "../../../styles/styles";
import { AWSImagePath } from "../../../utils/paths";
import uuid from "react-native-uuid";
import { useIsFocused } from "@react-navigation/native";
import Search from "../../../components/Search";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

let userID = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
const DesignPendingTab = ({ response, navigation, fetch, set, unload }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [errorR, setErrorR] = useState(false);
  const [value, setValue] = useState("");
  const [errorCAT, setErrorCAT] = useState(false);
  const [designImage, setDesignImage] = useState("");
  const [image, setImage] = useState(AWSImagePath + "placeholder-image.png");
  const [filePath, setFilePath] = useState(null);
  const [status, setStatus] = useState(false);
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState(() => {});
  const [isLoading, setIsLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [listSearchData, setListSearchData] = useState([]);
  const [current, setCurrent] = useState({});
  const refRBSheet = useRef();
  const [snackbarVisible, setSnackbarVisible] = useState(false);

  // ! some unused setStates
  const [refreshing, setRefreshing] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.success);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      Sess_CompanyAdmin_UserRefno =
        JSON.parse(userData).Sess_CompanyAdmin_UserRefno;
      Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
      Sess_company_refno = JSON.parse(userData).Sess_company_refno;
      FetchData();
    }
  };

  const chooseFile = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        const arrExt = result.uri.split(".");
        const unique_id = uuid.v4();
        setDesignImage(
          AWSImagePath + unique_id + "." + arrExt[arrExt.length - 1]
        );
        setImage(result.uri);
        setFilePath(result);
        setStatus(true);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const update = async () => {
    const params = {
      Sess_UserRefno: userID,
      cont_estimation_refno: current.cont_estimation_refno,
      estimation_remarks: remarks,
      reponse_refno: value,
    };
    try {
      set(true);
      const datas = new FormData();
      datas.append("data", JSON.stringify(params));
      datas.append(
        "attach_approved_proof",
        status == true
          ? {
              name: designImage?.split(AWSImagePath)[1],
              type: filePath?.type + "/*",
              uri:
                Platform.OS === "android"
                  ? filePath?.uri
                  : filePath?.uri.replace("file://", ""),
            }
          : ""
      );
      const resp = await axios.post(
        `${BASE_URL_Contractor}/${
          text == "Reject"
            ? "contractor_scdesign_estimation_reject"
            : "contractor_scdesign_estimation_selfapprove"
        }/`,
        datas,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (
        resp.data &&
        (resp.data.data.Rejected == "1" ||
          resp.data.data["Self Approved"] == "1")
      ) {
        fetch(2, text + " Successfully!");
      } else {
        unload("Error While " + text);
      }
    } catch (e) {
      console.log(e);
      unload("Error While " + text);
    }
  };
  const ValidateEstimationStatus = () => {
    let isValid = true;

    if (remarks.length === 0) {
      isValid = false;
      setErrorR(true);
    }
    if (value === "") {
      isValid = false;
      setErrorCAT(true);
    }

    if (isValid) {
      setPopupVisible(false);
      update();
    }
  };

  const showDialog = () => {
    refRBSheet.current.close();
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const FetchData = () => {
    setIsLoading(true);
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
      },
    };
    Provider.createDFContractor(
      Provider.API_URLS.contractor_scdesign_estimation_pending_list,
      params
    )
      .then((response) => {
        //console.log('response:', JSON.stringify(response.data));
        if (response.data && response.data.data) {
          console.log(response.data.data);
          setListData(response.data.data);
          setListSearchData(response.data.data);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      GetUserID();
    }
  }, [isFocused]);

  const sendQuotationToClient = () => {
    set(true);
    Provider.createDFContractor(
      Provider.API_URLS.contractor_scdesign_estimation_sendtoclient,
      {
        data: {
          Sess_UserRefno: userID,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
          cont_estimation_refno: current.cont_estimation_refno,
        },
      }
    )
      .then((res) => {
        if (res.data && res.data.data.Send == 1) {
          fetch(2, "Sent Quotation to Client");
        } else {
          unload("Error while Sending Client");
        }
      })
      .catch((error) => {
        unload("Error while Sending Client");
      });
  };

  const cancelQuotation = () => {
    set(true);
    Provider.createDFContractor(
      Provider.API_URLS.contractor_scdesign_estimation_cancel,
      {
        data: {
          Sess_UserRefno: userID,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
          cont_estimation_refno: current.cont_estimation_refno,
        },
      }
    )
      .then((res) => {
        if (res.data && res.data.data.Updated == "1") {
          fetch(2, "Cancel Quotation Successfully!");
        } else {
          unload("Error while Cancelling quotation");
        }
      })
      .catch((error) => {
        unload("Error while Cancelling quotation");
      });
  };
  const RenderItems = (data) => {
    return (
      <View
        style={[
          Styles.backgroundColor,
          Styles.paddingHorizontal16,
          Styles.flexJustifyCenter,
          {
            height: 230,
            borderWidth: 1.3,
            marginBottom: 10,
            borderRadius: 8,
            borderColor: theme.colors.primary,
          },
        ]}
      >
        <View style={{ justifyContent: "center", alignItems: "flex-start" }}>
          <Image
            source={{ uri: data.item.design_image_url }}
            style={{ width: 50, height: 50 }}
          />
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              Client Details :
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              Estimation No :
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              Product :
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              Design No :
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              Total Sq.Ft. :
            </Text>
          </View>
          <View style={{ flex: 1.3 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item?.customer_data[0]} ({data.item?.customer_data[1]})
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item.cont_estimation_no}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item.product_name}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item.design_no}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item.totalfoot}
            </Text>
          </View>
        </View>
        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
            flexDirection: "row",
          }}
        >
          <Button
            mode="outlined"
            onPress={() => {
              navigation.navigate("ContractorEstimation", {
                userDesignEstimationID: data.item?.cont_estimation_refno,
                isContractor: true,
                designImage: data.item?.design_image_url,
                fetchData: fetch,
                isUpdate: true,
                data: data.item,
                set: set,
              });
            }}
            style={{
              borderColor: theme.colors.primary,
              borderWidth: 1.2,
            }}
          >
            Edit
          </Button>
          <Button
            mode="outlined"
            onPress={() => {
              refRBSheet.current.open();

              setCurrent(data.item);
            }}
            style={{
              borderColor: theme.colors.primary,
              borderWidth: 1.2,
            }}
          >
            View Actions
          </Button>
        </View>
      </View>
    );
  };

  return (
    <View style={[Styles.flex1]}>
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
      ) : listData?.length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Search
            data={listData}
            setData={setListSearchData}
            filterFunction={[
              // !how we add search on this?
              // "customer_data[0]"
              // "customer_data[1]"
              "category_name",
              "client_approve_status",
              "cont_estimation_no",
              "cont_estimation_refno",
              "design_no",
              "designtype_name",
              "estimation_approve_status",
              "product_name",
              "send_to_clientstatus",
              "service_name",
              "total_labours_cost",
              "total_materials_cost",
              "totalfoot",
            ]}
          />
          {listSearchData?.length > 0 ? (
            <View style={{ padding: 10 }}>
              <SwipeListView
                previewDuration={1000}
                previewOpenValue={-160}
                previewRowKey="1"
                previewOpenDelay={1000}
                refreshControl={
                  <RefreshControl
                    colors={[theme.colors.primary]}
                    refreshing={refreshing}
                    onRefresh={FetchData}
                  />
                }
                data={listSearchData}
                useFlatList={true}
                disableRightSwipe={true}
                rightOpenValue={-160}
                renderItem={(data) => RenderItems(data)}
              />
            </View>
          ) : (
            <NoItems
              icon="format-list-bulleted"
              text="No records found for your query"
            />
          )}
        </View>
      ) : (
        <NoItems
          icon="format-list-bulleted"
          text="No records found. Add records by clicking on plus icon."
        />
      )}
      <View style={{ height: 80 }}></View>
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
          <Title style={[Styles.paddingHorizontal16]}>Client Detail</Title>
          <ScrollView style={{ marginBottom: 64 }}>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Image
                source={{ uri: current.design_image_url }}
                style={{ width: 350, height: 159 }}
              />
            </View>
            <List.Item
              title="Estimate No"
              description={current.cont_estimation_no}
            />
            <List.Item title="Service" description={current.service_name} />
            <List.Item title="Category" description={current.category_name} />
            <List.Item title="Product" description={current.product_name} />
            <List.Item
              title="Design Type"
              description={current.designtype_name}
            />
            <List.Item title="Design No" description={current.design_no} />
            <List.Item title="Total Sq.Ft" description={current.totalfoot} />
            <List.Item
              title="Actual Materials Cost"
              description={current.total_materials_cost}
            />
            <List.Item
              title="Actual Labour Cost"
              description={current.total_labours_cost}
            />
            {current?.estimation_status !== undefined && (
              <List.Item
                title="Estimation Status"
                description={current.estimation_status}
              />
            )}
            <>
              <Card.Content style={[Styles.marginTop16]}>
                {current?.action_status_name?.includes(
                  "Waiting for Client Approval"
                ) ? (
                  <Text
                    style={{ textAlign: "center", color: "red", fontSize: 20 }}
                  >
                    Waiting for Client Approval
                  </Text>
                ) : (
                  <>
                    {current.action_status_name?.includes("Reject") && (
                      <Button
                        mode="outlined"
                        style={{
                          borderColor: "red",
                          borderWidth: 1.2,
                          color: "red",
                        }}
                        onPress={() => {
                          refRBSheet.current.close();
                          setText("Reject");
                          setPopupVisible(true);
                        }}
                      >
                        <Text style={{ color: "red" }}> Reject</Text>
                      </Button>
                    )}
                    {current.action_status_name?.includes("Send to Client") && (
                      <Button
                        mode="outlined"
                        style={{
                          borderColor: "green",
                          borderWidth: 1.2,
                          color: "green",
                        }}
                        onPress={() => {
                          setText(`sendQuotationToClient`);
                          showDialog();
                        }}
                      >
                        <Text style={{ color: "green" }}>Send to Client</Text>
                      </Button>
                    )}
                    {current.action_status_name?.includes(
                      "Cancel Quotation"
                    ) && (
                      <Button
                        onPress={() => {
                          setText(`cancelQuotation`);
                          showDialog();
                        }}
                        mode="outlined"
                        style={[
                          Styles.marginTop16,
                          {
                            borderColor: "red",
                            borderWidth: 1.2,
                            color: "red",
                          },
                        ]}
                      >
                        <Text style={{ color: "red" }}>Cancel Quotation</Text>
                      </Button>
                    )}
                    {current.action_status_name?.includes(
                      "Self & Final Approve"
                    ) && (
                      <Button
                        mode="outlined"
                        style={{
                          borderColor: "green",
                          borderWidth: 1.2,
                          color: "green",
                        }}
                        onPress={() => {
                          refRBSheet.current.close();
                          setText("Self & Final Approve");
                          setPopupVisible(true);
                        }}
                      >
                        <Text style={{ color: "green" }}>
                          Self & Final Approve
                        </Text>
                      </Button>
                    )}
                  </>
                )}
              </Card.Content>
            </>
            <View style={{ height: 20 }}></View>
          </ScrollView>
        </View>
      </RBSheet>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{
          backgroundColor: snackbarColor,
          zIndex: 99999999,
        }}
        zIndex={99999999}
      >
        {snackbarText}
      </Snackbar>

      {/* For 
      -send quotation to client (button in list):379
    -cancel quotation(button in list): 380
    -reject(button click): opens same popup */}
      <Portal>
        <Dialog
          visible={visible}
          onDismiss={hideDialog}
          style={[Styles.borderRadius8]}
        >
          <Dialog.Title style={[Styles.fontSize16, Styles.textCenter]}>
            Confirm to {text}?
          </Dialog.Title>
          <Dialog.Content>
            <View
              style={[
                Styles.flexRow,
                Styles.flexJustifyCenter,
                Styles.flexAlignCenter,
                Styles.marginTop16,
              ]}
            ></View>
            <View></View>
            <Card.Content style={[Styles.marginTop16]}>
              <Button
                mode="contained"
                onPress={
                  text == "cancelQuotation"
                    ? cancelQuotation
                    : sendQuotationToClient
                }
              >
                Ok
              </Button>
            </Card.Content>
            <Card.Content style={[Styles.marginTop16]}>
              <Button mode="contained" onPress={hideDialog}>
                Cancel
              </Button>
            </Card.Content>
          </Dialog.Content>
        </Dialog>
      </Portal>

      {/* for
    -self & final approve(button click): opens a popup */}
      <Portal>
        <Dialog visible={popupVisible} dismissable={false}>
          <Dialog.Title>Estimation Status</Dialog.Title>
          <Dialog.Content>
            <ScrollView keyboardShouldPersistTaps="handled">
              <TextInput
                mode="outlined"
                dense
                style={[Styles.backgroundColor]}
                label="Remarks/Reason"
                value={remarks}
                onChangeText={(text) => {
                  setRemarks(text);
                  setErrorR(false);
                }}
                error={errorR}
              />
              <HelperText type="error" visible={errorR}>
                {communication.InvalidRemarks}
              </HelperText>
              <View>
                <Subheading style={[Styles.marginBottom12]}>
                  Client Approved Through
                </Subheading>
                <RadioButton.Group
                  onValueChange={(value) => {
                    setValue(value);
                    setErrorCAT(false);
                  }}
                  value={value}
                >
                  {response?.map((item, idx) => (
                    <RadioButton.Item
                      key={idx}
                      position="leading"
                      style={[Styles.paddingVertical2]}
                      labelStyle={[Styles.textLeft, Styles.paddingStart4]}
                      label={item.reponse_name}
                      value={item.reponse_refno}
                    />
                  ))}
                </RadioButton.Group>
                <HelperText type="error" visible={errorCAT}>
                  {communication.InvalidClientApprovedThrough}
                </HelperText>
              </View>

              <Subheading>Attach Client Approved Proof</Subheading>
              <View
                style={[
                  Styles.flexRow,
                  Styles.flexAlignEnd,
                  Styles.marginTop16,
                ]}
              >
                <Image
                  source={{ uri: image }}
                  style={[Styles.width64, Styles.height64, Styles.border1]}
                />
                <Button mode="text" onPress={chooseFile}>
                  {filePath !== null ? "Replace" : "Choose Image"}
                </Button>
              </View>
            </ScrollView>
          </Dialog.Content>
          <Dialog.Actions style={[Styles.padding16]}>
            <Button
              mode="outlined"
              onPress={() => {
                setPopupVisible(false);
                setValue("");
                setRemarks("");
                setErrorR(false);
                setErrorCAT(false);
                setDesignImage("");
                setImage(AWSImagePath + "placeholder-image.png");
                setFilePath(null);
              }}
            >
              Close
            </Button>
            <Button
              style={[Styles.marginStart12]}
              loading={isButtonLoading}
              mode="contained"
              onPress={ValidateEstimationStatus}
            >
              Confirm
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};
export default DesignPendingTab;
