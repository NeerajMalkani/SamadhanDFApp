import { useEffect, useRef, useState } from "react";
import {
  View,
  LogBox,
  RefreshControl,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Snackbar } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BranchWiseTransactionListItem } from "./BranchWiseTransactionListItem";
import Search from "../../../components/Search";

let userID = 0,
  companyID = 0,
  branchID = 0;
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const BranchWiseCashDetailScreen = ({ route }) => {
  //#region Variables

  const [isLoading, setIsLoading] = useState(true);

  const [listData_Self, setListData_Self] = useState([]);
  const [listSearchData_Self, setListSearchData_Self] = useState([]);

  const [refreshing, setRefreshing] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.success);

  //#endregion

  //#region Functions

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      companyID = JSON.parse(userData).Sess_company_refno;
      branchID = JSON.parse(userData).Sess_branch_refno;
      FetchData();
    }
  };

  const FetchData = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: companyID.toString(),
        branch_refno: route.params.data.branch_refno,
      },
    };

    if (route.params.type == "bank") {
      params.data.bank_refno = route.params.data.bank_refno;
    }
    Provider.createDFPocketDairy(
      route.params.type == "pocket"
        ? Provider.API_URLS.pckdashboard_cashinbranch_pocket_gridlist
        : Provider.API_URLS.pckdashboard_cashinbranch_bank_gridlist,
      params
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const lisData = [...response.data.data];
            lisData.map((k, i) => {
              k.key = (parseInt(i) + 1).toString();
            });
            setListData_Self(response.data.data);
            setListSearchData_Self(response.data.data);
          }
        } else {
          setListData_Self([]);
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

  const RenderItems = (data) => {
    return (
      <View
        style={[
          Styles.backgroundColor,
          Styles.flexJustifyCenter,
          Styles.paddingHorizontal4,
          Styles.paddingHorizontal16,
          { height: 150 },
        ]}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={[
            Styles.paddingVertical8,
            Styles.paddingHorizontal8,
            Styles.flexRow,
            Styles.borderRadius8,
            Styles.backgroundSecondaryLightColor,
            { elevation: 4 },
          ]}
        >
          <BranchWiseTransactionListItem current={data} type="fin-list" />
        </TouchableOpacity>
      </View>
    );
  };

  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <View style={[Styles.flex1]}>
        <ScrollView
          style={[Styles.flex1, Styles.backgroundColor]}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            {listData_Self.length > 0 ? (
              <View
                style={[
                  Styles.flex1,
                  Styles.flexColumn,
                  Styles.backgroundColor,
                ]}
              >
                <Search
                  data={listData_Self}
                  setData={setListSearchData_Self}
                  filterFunction={[
                    "TotalCashinHand",
                    "branch_refno",
                    "location_name",
                    "locationtype_name",
                  ]}
                />
                {listSearchData_Self?.length > 0 ? (
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
                    data={listSearchData_Self}
                    disableRightSwipe={true}
                    rightOpenValue={-72}
                    renderItem={(data) => RenderItems(data)}
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
          </View>
        </ScrollView>
      </View>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarColor }}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default BranchWiseCashDetailScreen;
