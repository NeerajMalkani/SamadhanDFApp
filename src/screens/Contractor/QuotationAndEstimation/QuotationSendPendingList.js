import React, { useEffect, useRef } from "react";
import axios from "axios";
import { BASE_URL_Contractor } from "../../../api/Provider";
import {
  Image,
  ActivityIndicator,
  View,
  RefreshControl,
  LogBox,
  ScrollView,
  StyleSheet,
} from "react-native";
import {
  FAB,
  List,
  Searchbar,
  Snackbar,
  Title,
  Dialog,
  Portal,
  Paragraph,
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
import { creds } from "../../../utils/credentials";
import Provider from "../../../api/Provider";
import NoItems from "../../../components/NoItems";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";
import { RNS3 } from "react-native-aws3";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Styles } from "../../../styles/styles";
import { AWSImagePath } from "../../../utils/paths";
import uuid from "react-native-uuid";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

let userID = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_group_refno = 0;
const QuotationSendPendingList = ({
  set,
  listData2,
  response,
  fetch,
  unload,
  navigation,
}) => {
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [remarks, setRemarks] = React.useState("");
  const [errorR, setErrorR] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [errorCAT, setErrorCAT] = React.useState(false);
  const [designImage, setDesignImage] = React.useState("");
  const [image, setImage] = React.useState(
    AWSImagePath + "placeholder-image.png"
  );
  const [filePath, setFilePath] = React.useState(null);
  const [status, setStatus] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const [text, setText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [current, setCurrent] = React.useState({});
  const refRBSheet = useRef();
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );

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
        `${BASE_URL_Contractor}/contractor_scdesign_estimation_reject/`,
        datas,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (resp.data && resp.data.data.Rejected == "1") {
        fetch(2, "Rejected Successfully");
      } else {
        unload("Error While Rejecting");
      }
    } catch (e) {
      console.log(e);
      unload("Error While Rejecting");
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

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const showDialog = () => {
    refRBSheet.current.close();
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const FetchData = () => {
    fetch();
    listData[1](listData2);
    listSearchData[1](listData2);
    setIsLoading(false);
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
          return el.contactPerson
            .toString()
            .toLowerCase()
            .includes(query.toLowerCase());
        })
      );
    }
  };

  const sendQuotationToClient = () => {
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
        if (res.response.data) fetch(2, "Sent Quotation to Client");
        else {
          throw res;
        }
      })
      .catch((error) => {
        unload("Error while Sending Client");
      });
  };

  const cancelQuotation = () => {
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
        if (res.response.data) fetch(2, "Sent Quotation to Client");
        else {
          throw res;
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
            height: 150,
            borderWidth: 1.3,
            marginBottom: 10,
            borderRadius: 8,
            borderColor: theme.colors.primary,
          },
        ]}
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              Quotation No :
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              Project Name :
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              Contact Person & Number :
            </Text>
          </View>
          <View style={{ flex: 1.3 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item.cont_quot_no}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item.project_name}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item.contact_person} & {data.item.contact_mobile_no}
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
              // console.log(data.item);

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
              console.log(data.item);
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

  const submit = () => {
    hideDialog();
    set(true);
    const params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
        cont_quot_refno: current.cont_quot_refno,
      },
    };
    Provider.createDFContractor(
      text == "Send Quotation to Client"
        ? Provider.API_URLS.contractor_quotation_sendtoclient
        : Provider.API_URLS.contractor_quotation_cancel,
      params
    )
      .then((response) => {
        if (response.data && response.data.data) {
          if (response.data.data.Updated == 1) {
            fetch(1, text + " Successfully!");
          } else {
            unload("Failed");
          }
        } else {
          unload("Failed");
        }
      })
      .catch((e) => {
        set(false);
        unload("Failed");
      });
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
      ) : listData[0]?.length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Searchbar
            style={[Styles.margin16]}
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
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
            />
          </View>
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
        // onClose={() => setCurrent({})}
        height={620}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>
            {current.cont_quot_no}
          </Title>
          <ScrollView style={{ marginBottom: 64 }}>
            <List.Item
              title="Quotation No"
              description={current.cont_quot_no}
            />
            <List.Item
              title="Project Name"
              description={current.project_name}
            />
            <List.Item
              title="Contact Person & Number"
              description={`${current.contact_person} & ${current.contact_mobile_no}`}
            />
            <List.Item
              title="Quotation Unit"
              description={current.quot_unit_type_name}
            />
            <List.Item
              title="Materials"
              description={current.material_status}
            />
            <List.Item title="Status" description={current.quot_status_name} />

            {current?.action_status_name?.includes("Preview Quotation") && (
              <View style={{ alignItems: "center" }}>
                <Button
                  mode="outlined"
                  style={{
                    borderColor: "#d13d94",
                    borderWidth: 1.2,
                    color: "#d13d94",
                    width: "80%",
                    marginBottom: "4%",
                  }}
                  // onPress={showDialog}
                >
                  <Text style={{ color: "#d13d94" }}>Preview Quotation</Text>
                </Button>
              </View>
            )}
            {current?.action_status_name?.includes(
              "Send Quotation to Client"
            ) && (
              <View style={{ alignItems: "center" }}>
                <Button
                  mode="outlined"
                  style={{
                    borderColor: "green",
                    borderWidth: 1.2,
                    color: "green",
                    width: "80%",
                  }}
                  onPress={() => {
                    setText("Send Quotation to Client");
                    showDialog();
                  }}
                >
                  <Text style={{ color: "green" }}>
                    Send Quotation to Client
                  </Text>
                </Button>
              </View>
            )}

            {current?.action_status_name?.includes("Cancel Quotation") && (
              <View style={{ alignItems: "center", marginTop: "4%" }}>
                <Button
                  mode="outlined"
                  style={{
                    borderColor: "red",
                    borderWidth: 1.2,
                    color: "red",
                    width: "80%",
                  }}
                  onPress={() => {
                    setText("Cancel Quotation");
                    showDialog();
                  }}
                >
                  <Text style={{ color: "red" }}>Cancel Quotation</Text>
                </Button>
              </View>
            )}
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
              <Button mode="contained" onPress={submit}>
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
const stylesm = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "green",
  },
  button1: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "red",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  modalIndex: {
    zIndex: 999999,
  },
  input: {
    margin: 15,
    height: 40,

    borderColor: "grey",
    borderWidth: 1,
  },
});
export default QuotationSendPendingList;
