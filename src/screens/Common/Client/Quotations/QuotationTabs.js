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
import Provider from "../../../../api/Provider";
import NoItems from "../../../../components/NoItems";
import { theme } from "../../../../theme/apptheme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Styles } from "../../../../styles/styles";
import { NullOrEmpty } from "../../../../utils/validations";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

let userID = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
const QuotationTabs = ({
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
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item.cont_quot_no}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item.project_name}
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "700", color: "grey" }}>
              {data.item?.contact_person} & {data.item?.contact_mobile_no}
            </Text>
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
              console.log(data.item);
              setCurrent(data.item);
            }}
            style={{
              width: "80%",
              borderColor: theme.colors.primary,
              borderWidth: 1.2,
            }}
          >
            {type == "new" ? "View Actions" : "View Details"}
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
        cont_quot_refno: current.cont_quot_refno,
      },
    };
    Provider.createDFClient(
      text === "Approve"
        ? Provider.API_URLS.client_quotation_approve
        : Provider.API_URLS.client_quotation_reject,
      params
    )
      .then((response) => {
        if (response.data && response.data.data) {
          if (response.data.data.Updated == 1) {
            fetch(0, text + "Successfully!");
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
        height={620}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View>
          <Title style={[Styles.paddingHorizontal16]}>Details</Title>
          <ScrollView style={{ marginBottom: 64 }}>
            <List.Item
              title="Quotation No."
              description={current.cont_quot_no}
            />
            <List.Item
              title="Project Name"
              description={current.project_name}
            />
            <List.Item
              title="Contact Person"
              description={current.contact_person}
            />
            <List.Item
              title="Contact Person Number"
              description={current.contact_mobile_no}
            />
            <List.Item
              title="Quotation Unit"
              description={current.quot_unit_type_name}
            />
            <List.Item
              title="Materials"
              description={current.material_status}
            />
            {current.quot_status_name !== undefined && (
              <List.Item
                title="Quotation Status"
                description={current.quot_status_name}
              />
            )}
            {current?.estimation_status !== undefined && (
              <List.Item
                title="Estimation Status"
                description={current.estimation_status}
              />
            )}
            {current?.action_status_name?.map((item, index) => (
              <Card.Content style={[Styles.marginTop16]} key={index}>
                <Button
                  mode="contained"
                  onPress={() => {
                    showDialog();
                    setText(item);
                  }}
                  style={item == "Reject" ? stylesm.button1 : stylesm.button}
                >
                  {item}
                </Button>
              </Card.Content>
            ))}

            <View style={{ height: 15 }}></View>
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
export default QuotationTabs;
