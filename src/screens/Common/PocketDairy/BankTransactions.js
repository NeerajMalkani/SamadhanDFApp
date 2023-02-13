import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import { FAB, List, Searchbar, Snackbar, Title, HelperText, Divider, Text, Button, DataTable } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { APIConverter } from "../../../utils/apiconverter";
import RBSheet from "react-native-raw-bottom-sheet";
import Dropdown from "../../../components/Dropdown";
import { projectVariables } from "../../../utils/credentials";
import AsyncStorage from "@react-native-async-storage/async-storage";
import styles from "react-native-inset-shadow/src/styles";


let userID = 0, groupID = 0, companyID = 0, branchID = 0, designID = 0, roleID = 0;

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const BankTransactionScreen = ({ navigation }) => {
    //#region Variables
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);

    const listData = React.useState([]);
    const listSearchData = React.useState([]);

    const [refreshing, setRefreshing] = React.useState(false);

    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState("");
    const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

    const [categoryName, setCategoryName] = React.useState("");
    const [subCategoryName, setSubCategoryName] = React.useState("");
    const [transactionTypeName, setTransactionTypeName] = React.useState("");
    const [amount, setAmount] = React.useState("");
    const [notes, setNotes] = React.useState("");
    const [currentBalance, setCurrentBalance] = React.useState("");
    const [transactionDate, setTransactionDate] = React.useState("");
    const refRBSheet = useRef();

    const [myBankListFullData, setMyBankListFullData] = React.useState([]);
    const [myBankListData, setMyBankListData] = React.useState([]);
    const [myBankList, setMyBankList] = React.useState([]);
    const [errorBL, setBLError] = React.useState(false);

    const [entryTypeData, setEntryTypeData] = React.useState([]);
    const [entryTypeFullData, setEntryTypeFullData] = React.useState([]);
    const [entryType, setEntryType] = React.useState("");
    const [entryTypeError, setEntryTypeError] = React.useState(false);

    const [entryTypeStatus, setEntryTypeStatus] = React.useState(false);
    const [pktEntryTypeID, setPktEntryTypeID] = React.useState("");

    const [bankName, setBankName] = React.useState("");
    const [availableBalance, setAvailableBalance] = React.useState("0");

    //#endregion

    //#region Functions

    const FetchBankList = (pktEntryTypeID) => {
        let params = {
            data: {
                Sess_UserRefno: userID,
                Sess_company_refno: companyID.toString(),
                Sess_branch_refno: branchID.toString(),
                Sess_group_refno: groupID.toString(),
                Sess_designation_refno: designID.toString(),
                pck_entrytype_refno: pktEntryTypeID,
                pck_transtype_refno: projectVariables.DEF_PCKDIARY_TRANSTYPE_SOURCE_REFNO
            }
        }
        Provider.createDFPocketDairy(Provider.API_URLS.get_pckmybankname, params)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        response.data.data = APIConverter(response.data.data, "pkt_subcat");
                        const bankList = [];
                        response.data.data.map((data) => {
                            bankList.push(
                                {
                                    accountNumber: data.accountNumber,
                                    bankName: data.bankName,
                                    bank_refno: data.bank_refno,
                                    bankDisplay: data.bankName + " >> " + data.accountNumber
                                }
                            );
                        });

                        setMyBankListFullData(bankList);
                        const bank = bankList.map((data) => data.bankDisplay);
                        setMyBankListData(bank);
                    }
                }
            })
            .catch((e) => { });
    };

    const FetchData = () => {

        let params = {
            data: {
                Sess_UserRefno: userID,
                Sess_group_refno: groupID,
                pck_entrytype_refno: pktEntryTypeID,
                pck_mybank_refno: myBankListFullData.filter((el) => {
                    return el.bankDisplay === myBankList;
                })[0].bank_refno
            },
        };
        Provider.createDFPocketDairy(Provider.API_URLS.pckdashboard_cashinbank_gridlist, params)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        console.log(response.data.data);
                        //response.data.data = APIConverter(response.data.data);
                        
                        setBankName(response.data.data[0].pck_mybank_name);
                        setAvailableBalance(response.data.data[0].pck_mybank_amount);
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

    const FetchEntryType = (roleID) => {
        let params = {
            data: {
                Sess_UserRefno: userID,
                Sess_group_refno: groupID
            }
        }
        Provider.createDFPocketDairy(Provider.API_URLS.get_pckentrytype, params)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {

                        setEntryTypeFullData(response.data.data);

                        const entryTypeData = response.data.data.map((data) => data.pck_entrytype_name);
                        setEntryTypeData(entryTypeData);

                        if (response.data.data.length == 1 && roleID == "3") {
                            setPktEntryTypeID(response.data.data[0].pck_entrytype_refno);
                            setEntryTypeStatus(false);
                            FetchBankList(response.data.data[0].pck_entrytype_refno);
                        }
                        else {
                            setEntryTypeStatus(true);
                        }

                    }
                }
            })
            .catch((e) => { });
    };

    useEffect(() => {
        GetUserID();
    }, []);

    const GetUserID = async () => {
        const userData = await AsyncStorage.getItem("user");
        if (userData !== null) {
            userID = JSON.parse(userData).UserID;
            groupID = JSON.parse(userData).Sess_group_refno;
            companyID = JSON.parse(userData).Sess_company_refno;
            branchID = JSON.parse(userData).Sess_branch_refno;
            designID = JSON.parse(userData).Sess_designation_refno;
            roleID = JSON.parse(userData).RoleID;
            FetchEntryType(JSON.parse(userData).RoleID);

        }
    };

    const onChangeSearch = (query) => {
        setSearchQuery(query);
        if (query === "") {
            listSearchData[1](listData[0]);
        } else {
            listSearchData[1](
                listData[0].filter((el) => {
                    return el.activityRoleName.toString().toLowerCase().includes(query.toLowerCase());
                })
            );
        }
    };

    const ValidateData = () => {
        let isValid = true;

        if (entryTypeStatus && entryType == "") {
            isValid = false;
            setEntryTypeError(true);
        }

        if (myBankList == "") {
            isValid = false;
            setBLError(true);
        }

        if (isValid) {
            FetchData();
        }
    };

    const onBankListChanged = (text) => {
        setMyBankList(text);
        setBLError(false);
    };

    const onEntryTypeChanged = (selectedItem) => {
        setEntryType(selectedItem);
        setEntryTypeError(false);


        let a = entryTypeFullData.filter((el) => {
            return el.pck_entrytype_name === selectedItem;
        });

        setPktEntryTypeID(a[0].pck_entrytype_refno);
        FetchBankList(a[0].pck_entrytype_refno);
    };

    const RenderItems = (data) => {
        return (
            <View style={[Styles.backgroundColor, Styles.flexJustifyCenter, Styles.paddingHorizontal4,
            { height: 92, }]}>
                <TouchableOpacity activeOpacity={1}
                    onPress={() => {
                        refRBSheet.current.open();
                        setCategoryName(data.item.pck_category_name);
                        setSubCategoryName(data.item.pck_sub_category_name);
                        setTransactionTypeName(data.item.pck_transtype_name);
                        setAmount(data.item.amount);
                        setCurrentBalance(data.item.current_balance);
                        setNotes(data.item.notes);
                        setTransactionDate(data.item.pck_trans_date);

                    }}
                    style={[Styles.paddingVertical8, Styles.paddingHorizontal8, Styles.flexRow, Styles.borderRadius8,
                    Styles.backgroundSecondaryLightColor, { elevation: 4 }]}>
                    <View style={[Styles.width50per, Styles.flexColumn]}>
                        <View style={[Styles.width100per, Styles.flexRow, Styles.flexJustifyStart, Styles.flexAlignCenter]}>
                            <Text>{data.item.is_opening_balance == "1" ? "Opening Balance" : data.item.pck_category_name}</Text>
                        </View>
                        <View style={[Styles.width100per, Styles.flexRow, Styles.flexJustifyStart,
                        Styles.flexAlignCenter, Styles.marginTop4]}>
                            <Text>{data.item.pck_sub_category_name}</Text>
                        </View>
                        <View style={[Styles.width100per, Styles.marginTop4]}>
                            <Text style={[Styles.textLeft]}>{data.item.pck_trans_date}</Text>
                        </View>
                    </View>
                    <View style={[Styles.width50per, Styles.flexColumn, Styles.flexSpaceBetween]}>
                        <View style={[Styles.width100per, Styles.flexRow, Styles.flexJustifyEnd, Styles.flexAlignCenter]}>
                            <Icon name="currency-inr" size={14} /><Text>{data.item.amount}</Text><Icon style={[Styles.marginStart4]} color={data.item.pck_transtype_refno == projectVariables.DEF_PCKDIARY_TRANSTYPE_SOURCE_REFNO ? theme.multicolors.green : theme.multicolors.red} name={data.item.pck_transtype_refno == projectVariables.DEF_PCKDIARY_TRANSTYPE_SOURCE_REFNO ? "plus-circle" : "minus-circle"} size={14} />
                        </View>
                        <View style={[Styles.width100per,]}>
                            <Text style={[Styles.textRight]}>Balance: <Icon name="currency-inr" size={14} />{data.item.current_balance}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {/* <List.Item
                    title={data.item.pck_category_name}
                    titleStyle={{ fontSize: 18 }}
                    description={`Transaction Type: ${data.item.pck_sub_category_name}\nAmount: ${data.item.amount}`}
                    onPress={() => {
                        refRBSheet.current.open();

                        setTransactionTypeName(data.item.pck_transtype_name);
                        setCategoryName(data.item.pck_category_name);
                        setCreateBy(data.item.createbyID == "2" ? "Created By Admin" : "Created By You");
                        setDisplay(data.item.display);
                    }}
                    left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="file-tree" />}
                    //left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name={data.item.transtypeID == } />}
                    right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
                /> */}
            </View>
        );
    };

    const AddCallback = () => {
        navigation.navigate("AddGCategoryNameScreen", { type: "add", fetchData: FetchData });
    };

    const EditCallback = (data, rowMap) => {
        rowMap[data.item.key].closeRow();
        navigation.navigate("AddGCategoryNameScreen", {
            type: "edit",
            fetchData: FetchData,
            data: {
                id: data.item.id,
                categoryName: data.item.pck_category_name,
                display: data.item.display,
                pckCategoryID: data.item.pck_category_refno,
                transactionTypeName: data.item.pck_transtype_name,
            },
        });
    };
    //#endregion

    return (
        <View style={[Styles.flex1]}>
            <Header navigation={navigation} title="Cash In Bank" />
            <View style={[Styles.flex1]}>
                <ScrollView style={[Styles.flex1, Styles.backgroundColor]} keyboardShouldPersistTaps="handled">

                    <View style={[Styles.padding16]}>
                        {entryTypeStatus &&
                            <>
                                <Dropdown label="Entry Type" data={entryTypeData} onSelected={onEntryTypeChanged} isError={entryTypeError} selectedItem={entryType} />
                                <HelperText type="error" visible={entryTypeError}>
                                    Please select a valid entry type
                                </HelperText>
                            </>
                        }

                        <Dropdown label="My Bank List" data={myBankListData} onSelected={onBankListChanged} isError={errorBL} selectedItem={myBankList} />
                        <HelperText type="error" visible={errorBL}>
                            Please select a bank name
                        </HelperText>

                        <View style={[Styles.backgroundColor, Styles.width100per]}>
                            <Button mode="contained" onPress={ValidateData}>
                                Submit
                            </Button>
                        </View>

                        <View style={[Styles.marginTop16]}>
                            <DataTable style={[Styles.backgroundSecondaryColor, Styles.borderRadius4, Styles.flexJustifyCenter, Styles.bordergray, Styles.fontBold]} >
                                <DataTable.Header>
                                    <DataTable.Title style={[{ flex: 1, justifyContent: 'center' }]}>Bank Name</DataTable.Title>
                                    <DataTable.Title style={[Styles.borderLeft1, { flex: 1, justifyContent: 'center' }]} numeric>Available Balance</DataTable.Title>
                                </DataTable.Header>

                                <DataTable.Row style={[Styles.backgroundColor]}>
                                    <DataTable.Cell style={[{ flex: 1, justifyContent: 'center' }]}>{bankName}</DataTable.Cell>
                                    <DataTable.Cell style={[Styles.borderLeft1, { flex: 1, justifyContent: 'center' }]}> <Icon name="currency-inr" size={14} />{availableBalance}</DataTable.Cell>
                                </DataTable.Row>

                            </DataTable>
                        </View>

                        <View style={[Styles.marginTop24]}>
                            <Text style={[Styles.fontSize18, { color: "green", width: "100%" }, Styles.paddingBottom12]}>Search Result</Text>
                            <Divider />
                        </View>

                        <View style={[Styles.flex1]}>
                            {listData[0].length > 0 ? (
                                <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
                                    <Searchbar style={[Styles.margin16]} placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
                                    <SwipeListView
                                        previewDuration={1000}
                                        previewOpenValue={-72}
                                        previewRowKey="1"
                                        previewOpenDelay={1000}
                                        refreshControl={<RefreshControl colors={[theme.colors.primary]} refreshing={refreshing} onRefresh={() => FetchData()} />}
                                        data={listSearchData[0]}
                                        useFlatList={true}
                                        disableRightSwipe={true}
                                        rightOpenValue={-72}
                                        renderItem={(data) => RenderItems(data)}
                                    />
                                </View>
                            ) : (
                                <NoItems icon="format-list-bulleted" text="No records found." />
                            )}
                        </View>

                    </View>

                </ScrollView>
            </View>

            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
                {snackbarText}
            </Snackbar>
            <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={460} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
                <View>
                    <Title style={[Styles.paddingHorizontal16]}><Icon name="currency-inr" size={20} />{amount}</Title>
                    <ScrollView style={{ marginBottom: 64 }}>
                        <View style={[Styles.paddingStart16]}>

                            {transactionTypeName == projectVariables.DEF_PCKDIARY_TRANSTYPE_SOURCE_REFNO_TXT ?
                                (
                                    <>
                                        <View style={[Styles.flexRow, Styles.flexAlignCenter]}>
                                            <View>
                                                <Icon name="plus-circle" color={transactionTypeName == projectVariables.DEF_PCKDIARY_TRANSTYPE_SOURCE_REFNO_TXT ? theme.multicolors.green : theme.multicolors.red} size={18} style={[Styles.marginEnd8]} />
                                            </View>
                                            <View>
                                                <Text style={[Styles.fontSize16]}>{transactionTypeName}</Text>
                                            </View>
                                        </View>
                                    </>
                                ) :
                                (
                                    <>
                                        <View style={[Styles.flexRow, Styles.flexAlignCenter]}>
                                            <View>
                                                <Icon name="minus-circle" color={transactionTypeName == projectVariables.DEF_PCKDIARY_TRANSTYPE_SOURCE_REFNO_TXT ? theme.multicolors.green : theme.multicolors.red} size={18} style={[Styles.marginEnd8]} />
                                            </View>
                                            <View>
                                                <Text style={[Styles.fontSize16]}>{transactionTypeName}</Text>
                                            </View>

                                        </View>
                                    </>
                                )
                            }

                        </View>
                        <List.Item title="Transaction Date" description={transactionDate} />
                        <List.Item title="Category" description={categoryName} />
                        <List.Item title="Sub Category" description={subCategoryName} />
                        <List.Item title="Notes" description={notes} />
                        <List.Item title="Current Balance" description={currentBalance} />

                    </ScrollView>
                </View>
            </RBSheet>
        </View>
    );
};

export default BankTransactionScreen;