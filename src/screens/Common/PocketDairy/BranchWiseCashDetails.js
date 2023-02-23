import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView, Image, Dimensions, TouchableOpacity } from "react-native";
import { Button, FAB, List, Snackbar, Searchbar, Title, HelperText, Text, Divider } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { NullOrEmpty } from "../../../utils/validations";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AWSImagePath } from "../../../utils/paths";
import { creds, projectVariables } from "../../../utils/credentials";
import { useIsFocused } from "@react-navigation/native";
import { TabBar, TabView } from "react-native-tab-view";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import moment from "moment";
import { BranchWiseTransactionListItem } from "./BranchWiseTransactionListItem";

let userID = 0, companyID = 0, branchID = 0;
LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const windowWidth = Dimensions.get("window").width;

const BranchWiseCashDetailScreen = ({ route, navigation }) => {
    //#region Variables
    const isFocused = useIsFocused();
    const [index, setIndex] = useState(0);

    const [searchQuery_Self, setSearchQuery_Self] = React.useState("");
    const [searchQuery_Company, setSearchQuery_Company] = React.useState("");

    const [isLoading, setIsLoading] = React.useState(true);

    const listData_Self = React.useState([]);
    const listSearchData_Self = React.useState([]);

    const [refreshing, setRefreshing] = React.useState(false);
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState("");
    const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

    const [date, setDate] = useState(new Date());
    const [dateInvalid, setDateInvalid] = useState("");
    const dateRef = useRef({});

    const refRBSheet = useRef();
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
            }
        }

        if (route.params.type == "bank") {
            params.data.bank_refno = route.params.data.bank_refno;
        }
        Provider.createDFPocketDairy(
            route.params.type == "pocket" ?
                Provider.API_URLS.pckdashboard_cashinbranch_pocket_gridlist
                :
                Provider.API_URLS.pckdashboard_cashinbranch_bank_gridlist,
            params)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        const lisData = [...response.data.data];
                        lisData.map((k, i) => {
                            k.key = (parseInt(i) + 1).toString();
                        });
                        listData_Self[1](response.data.data);
                        listSearchData_Self[1](response.data.data);
                    }
                } else {
                    listData_Self[1]([]);
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

    const onChangeSearch_Self = (query) => {
        setSearchQuery_Self(query);
        if (query === "") {
            listSearchData_Self[1](listData_Self[0]);
        } else {
            listSearchData_Self[1](
                listData_Self[0].filter((el) => {
                    return el.categoryName.toString().toLowerCase().includes(query.toLowerCase());
                })
            );
        }
    };

    const RenderItems = (data) => {
        return (
            <View style={[Styles.backgroundColor, Styles.flexJustifyCenter, Styles.paddingHorizontal4,
            Styles.paddingHorizontal16, { height: 150, }]}>
                <TouchableOpacity activeOpacity={1}
                    style={[Styles.paddingVertical8, Styles.paddingHorizontal8, Styles.flexRow, Styles.borderRadius8,
                    Styles.backgroundSecondaryLightColor, { elevation: 4 }]}>
                    <BranchWiseTransactionListItem current={data} type="fin-list" />
                </TouchableOpacity>
            </View>
        );
    };

    //#endregion 

    return (
        <View style={[Styles.flex1]}>
            <View style={[Styles.flex1]}>
                <ScrollView style={[Styles.flex1, Styles.backgroundColor]} keyboardShouldPersistTaps="handled">
                    <View>
                        {
                            listData_Self[0].length > 0 ? (
                                <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
                                    <Searchbar style={[Styles.margin16]} placeholder="Search" onChangeText={onChangeSearch_Self} value={searchQuery_Self} />
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
                                        data={listSearchData_Self[0]}
                                        disableRightSwipe={true}
                                        rightOpenValue={-72}
                                        renderItem={(data) => RenderItems(data)}
                                    />
                                </View>
                            ) : (
                                <NoItems icon="format-list-bulleted" text="No records found." />
                            )
                        }
                    </View>
                </ScrollView>
            </View>

            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
                {snackbarText}
            </Snackbar>
        </View>
    );
};

export default BranchWiseCashDetailScreen;