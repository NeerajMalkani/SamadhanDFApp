import React, { useEffect, useRef } from "react";
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
} from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import NoItems from "../../../components/NoItems";
import { theme } from "../../../theme/apptheme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Styles } from "../../../styles/styles";
import { NullOrEmpty } from "../../../utils/validations";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

let userID = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
const Enquiry_tab = ({
  set,
  listData2,
  listSearchData2,
  type,
  fetch,
  unload,
}) => {
  const [visible, setVisible] = React.useState(false);
  const [text, setText] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [current, setCurrent] = React.useState({});
  const refRBSheet = useRef();
  //#endregion

  //#region Functions

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

  const showDialog = () => {
    refRBSheet.current.close();
    setVisible(true);
  };

  const hideDialog = () => setVisible(false);

  const FetchData = () => {
    listData[1](listData2);
    listSearchData[1](listSearchData2);
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

  const RenderItems = (data) => {
    return (
      <View
        style={[
          Styles.backgroundColor,
          Styles.paddingStart16,
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
            {type == "approved" && (
              <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
                Status :
              </Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item.estimation_no}
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
            {type == "approved" && (
              <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
                {data.item?.status_name?.length > 0 &&
                  data.item?.status_name[0]}
              </Text>
            )}
          </View>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Button
            mode="outlined"
            onPress={() => {
              refRBSheet.current.open();
              setCurrent(data.item);
              console.log(data.item);
            }}
            style={{
              width: "80%",
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
    console.log(current);
    if (text == "Accept" || text == "Reject") {
      const params = {
        data: {
          Sess_UserRefno: userID,
          Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
          estimation_enquiry_refno: current.estimation_enquiry_refno,
          accept_status: text == "Accept" ? "1" : "2",
          alter_labours_cost: current.alter_labours_cost,
        },
      };
      Provider.createDFContractor(
        Provider.API_URLS.appuser_new_enquiry_acceptstatus_update,
        params
      )
        .then((response) => {
          console.log(response.data.data);
          if (response.data && response.data.data) {
            if (response.data.data.Updated == 1) {
              fetch(
                0,
                text == "Accept"
                  ? "Accepted Successfully"
                  : "Rejected Successfully!"
              );
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
    } else if (text == "Finally Take Project") {
      console.log(3);
      const params = {
        data: {
          Sess_UserRefno: userID,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
          estimation_enquiry_refno: current.estimation_enquiry_refno,
        },
      };
      Provider.createDFContractor(
        Provider.API_URLS.appuser_accepted_enquiry_finallytakeproject_update,
        params
      )
        .then((response) => {
          console.log(response.data.data);
          if (response.data && response.data.data) {
            if (response.data.data.Updated == 1) {
              fetch(1, `${text} Successfully!`);
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
    } else if (text == "Cancel My Quotation") {
      console.log(4);
      const params = {
        data: {
          Sess_UserRefno: userID,
          Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
          estimation_enquiry_refno: current.estimation_enquiry_refno,
        },
      };
      Provider.createDFContractor(
        Provider.API_URLS.appuser_accepted_enquiry_cancel_update,
        params
      )
        .then((response) => {
          if (response.data && response.data.data) {
            if (response.data.data.Updated == 1) {
              fetch(1, `${text} Successfully!`);
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
    } else if (text == "Cancel & Re-Quotation" && type == "approved") {
      console.log(5);
      const params = {
        data: {
          Sess_UserRefno: userID,
          Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
          estimation_enquiry_refno: current.estimation_enquiry_refno,
        },
      };
      Provider.createDFContractor(
        Provider.API_URLS.appuser_accepted_enquiry_cancelandrequotation_update,
        params
      )
        .then((response) => {
          if (response.data && response.data.data) {
            if (response.data.data.Updated == 1) {
              fetch(1, `${text} Successfully!`);
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
    } else if (text == "Remove My List" && type == "approved") {
      console.log(6);
      const params = {
        data: {
          Sess_UserRefno: userID,
          Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
          estimation_enquiry_refno: current.estimation_enquiry_refno,
        },
      };
      Provider.createDFContractor(
        Provider.API_URLS.appuser_accepted_enquiry_remove_update,
        params
      )
        .then((response) => {
          if (response.data && response.data.data) {
            if (response.data.data.Updated == 1) {
              fetch(1, `${text} Successfully!`);
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
    } else if (text == "Remove My List" && type == "rejected") {
      console.log(7);
      const params = {
        data: {
          Sess_UserRefno: userID,
          Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
          estimation_enquiry_refno: current.estimation_enquiry_refno,
        },
      };
      Provider.createDFContractor(
        Provider.API_URLS.appuser_rejected_enquiry_remove_update,
        params
      )
        .then((response) => {
          if (response.data && response.data.data) {
            if (response.data.data.Updated == 1) {
              fetch(2, `${text} Successfully!`);
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
    } else if (text == "Cancel & Re-Quotation" && type == "rejected") {
      console.log(8);
      const params = {
        data: {
          Sess_UserRefno: userID,
          Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
          estimation_enquiry_refno: current.estimation_enquiry_refno,
        },
      };
      Provider.createDFContractor(
        Provider.API_URLS.appuser_rejected_enquiry_cancelandrequotation_update,
        params
      )
        .then((response) => {
          if (response.data && response.data.data) {
            if (response.data.data.Updated == 1) {
              fetch(2, `${text} Successfully!`);
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
    }
  };
  return (
    <View style={[Styles.flex1]}>
      {/* <Header navigation={navigation} title="My Employee List" /> */}
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
      ) : listData[0].length > 0 ? (
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
              description={current.estimation_no}
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
            {type == "approved" && (
              <List.Item
                title="Status"
                description={
                  current?.status_name?.length > 0 && current?.status_name[0]
                }
              />
            )}
            {type !== "rejected" && (
              <>
                <List.Item title="Labour Cost" />
                <TextInput
                  mode="flat"
                  disabled={type === "new" ? false : true}
                  value={current.alter_labours_cost}
                  onChangeText={(text) => {
                    setCurrent((prev) => {
                      return {
                        ...prev,
                        alter_labours_cost: text,
                      };
                    });
                  }}
                  style={[stylesm.input]}
                />
              </>
            )}

            {type == "new" ? (
              <>
                <Card.Content style={[Styles.marginTop16]}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      showDialog();
                      setText("Accept");
                    }}
                    style={stylesm.button}
                  >
                    Accept
                  </Button>
                </Card.Content>
                <Card.Content style={[Styles.marginTop16]}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      showDialog();
                      setText("Reject");
                    }}
                    style={stylesm.button1}
                  >
                    Reject
                  </Button>
                </Card.Content>
              </>
            ) : (
              current?.action_status_name?.map((item, idx) => (
                <Card.Content style={[Styles.marginTop16]} key={idx}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      showDialog();
                      setText(item);
                    }}
                    style={
                      item == "Finally Take Project"
                        ? stylesm.button
                        : stylesm.button1
                    }
                  >
                    {item}
                  </Button>
                </Card.Content>
              ))
            )}
            <View style={{ height: 20 }}></View>
          </ScrollView>
        </View>
      </RBSheet>

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
    zIndex: 999999999999999999,
  },
  input: {
    margin: 15,
    height: 40,

    borderColor: "grey",
    borderWidth: 1,
  },
});
export default Enquiry_tab;
