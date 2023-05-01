import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View, RefreshControl, LogBox, ScrollView } from "react-native";
import { FAB, List, Searchbar, Snackbar, Title, Button } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import RBSheet from "react-native-raw-bottom-sheet";

import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import NoItems from "../../../components/NoItems";
import { theme } from "../../../theme/apptheme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import EntypoIcon from "react-native-vector-icons/Entypo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RenderHiddenItems } from "../../../components/ListActions";
import { Styles } from "../../../styles/styles";
import { APIConverter } from "../../../utils/apiconverter";
import styles from "react-native-inset-shadow/src/styles";
import LabelInput from "../../Marketing/EmployeeActivity/common/LabelInput";
import HDivider from "../../Marketing/EmployeeActivity/common/HDivider";
import Search from "../../../components/Search";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);
let userID = 0, groupID = 0, companyID = 0, branchID = 0;

const CardComponent = ({ data, Preview }) => {
    return (
        <View
            style={[
                {
                    backgroundColor: "#eee",
                    borderRadius: 8,
                    elevation: 5,
                },
                Styles.paddingHorizontal8,
                Styles.paddingVertical12,
            ]}
        >
            <LabelInput label="Client Name" value={`${data.client_contact_name} - ${data.client_contact_number}`} lg />
            <HDivider />
            <LabelInput label="Brand Name" value={data.brandName} />
            <HDivider />
            <View style={[Styles.flexRow, Styles.flexSpaceBetween]}>
                <LabelInput label="Sent Date" value={data.send_date} />
                <LabelInput label="Sent Status" value={data.send_status == "0" ? "Pending" : "Sent"} />
            </View>
            <HDivider />
            <Button mode="outlined" labelStyle={[Styles.fontSize10]}
                onPress={Preview}
                style={{ borderWidth: 2, borderRadius: 4, borderColor: theme.colors.greenBorder }}>Preview & Send Price List</Button>
        </View >
    );
};

const ProductPriceList = ({ navigation }) => {
    //#region Variables

    const [isLoading, setIsLoading] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState("");
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState("");
    const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);
    const [listData, setListData] = useState([]);
    const [listSearchData, setListSearchData] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const [companyName, setCompanyName] = React.useState("");
    const [contactPerson, setContactPerson] = React.useState("");
    const [contactMobileNumber, setContactMobileNumber] = React.useState("");
    const [address1, setAddress1] = React.useState("");
    const [stateName, setStateName] = React.useState("");
    const [cityName, setCityName] = React.useState("");
    const [pincode, setPincode] = React.useState("");
    const [gstNumber, setGstNumber] = React.useState("");
    const [pan, setPan] = React.useState("");
    const [serviceProviderRole, setServiceProviderRole] = React.useState("");
    const [buyerCategoryName, setBuyerCategoryName] = React.useState("");
    const [addedBy, setAddedBy] = React.useState(false);
    const [display, setDisplay] = React.useState(false);

    const refRBSheet = useRef();
    //#endregion

    //#region Functions

    useEffect(() => {
        GetUserID();
    }, []);

    const GetUserID = async () => {
        const userData = await AsyncStorage.getItem("user");
        if (userData !== null) {
            const userDataParsed = JSON.parse(userData);
            userID = userDataParsed.UserID;
            companyID = userDataParsed.Sess_company_refno;
            FetchData();
        }
    };

    const FetchData = (from) => {
        if (from === "add" || from === "update") {
            setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
            setSnackbarColor(theme.colors.success);
            setSnackbarVisible(true);
        }
        let params = {
            data: {
                Sess_UserRefno: userID,
                Sess_company_refno: companyID,
                sendpricelist_refno: "all",
            },
        };
        Provider.createDFDealer(Provider.API_URLS.sendpricelistrefnocheck, params)
            .then((response) => {

                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        response.data.data = APIConverter(response.data.data);
                        const lisData = [...response.data.data];
                        lisData.map((k, i) => {
                            k.key = (parseInt(i) + 1).toString();
                        });
                        setListData(response.data.data);
                        setListSearchData(response.data.data);

                    }
                } else {
                    setListData([]);
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

    const onChangeSearch = (query) => {
        setSearchQuery(query);
        if (query === "") {
            listSearchData[1](listData[0]);
        } else {
            listSearchData[1](
                listData[0].filter((el) => {
                    return el.contactPerson.toString().toLowerCase().includes(query.toLowerCase());
                })
            );
        }
    };

    const SearchClient = () => {
        navigation.navigate("SearchClientScreen", { type: "add", fetchData: FetchData });
    };

    const AddClient = () => {
        navigation.navigate("AddProductPriceList", { type: "add", fetchData: FetchData });
    };

    const EditCallback = (data, rowMap) => {
        rowMap[data.item.key].closeRow();
        navigation.navigate("AddClientScreen", {
            type: "edit",
            fetchData: FetchData,
            data: {
                id: data.item.client_user_refno,
                companyName: data.item.companyName,
                contactPerson: data.item.contactPersonName,
                contactMobileNumber: data.item.Mobile,
                address1: data.item.addressLine,
                cityName: data.item.cityName,
                stateName: data.item.stateName,
                pincode: data.item.pincode,
                gstNumber: data.item.gstNumber,
                pan: data.item.pan,
                serviceType: data.item.client_role_refno,
                buyerCategoryName: data.item.buyerCategoryName,
                addedBy: data.item.createbyID == 0 ? true : false,
                display: data.item.display,
                refer_user_refno: data.item.refer_user_refno,
            },
        });
    };

    const RenderItems = (data) => {
        return (
            <View style={[Styles.backgroundColor, Styles.paddingHorizontal16,
            Styles.flexJustifyCenter, Styles.flex1, Styles.marginBottom12]}>
                <CardComponent
                    key={data.item.key}
                    data={data.item}
                    Preview={() => {
                        Preview(data.item)
                    }}
                />
            </View>
        );
    };

    const Preview = (data) => {
        // navigation.navigate("MeetingPerson", {
        //   headerTitle: data.company_name,
        //   type: "edit",
        //   fetchCustomers: fetchCustomers,
        //   data: data,
        // });
    };

    const AddCallback = () => {
        navigation.navigate("AddProductPriceList", { type: "add", fetchData: FetchData });
    };
    //#endregion

    return (
        <View style={[Styles.flex1]}>
            <Header navigation={navigation} title="Product Price List" />
            {isLoading ? (
                <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : listData.length > 0 ? (
                <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
                    <Search
                        data={listData}
                        setData={setListSearchData}
                        filterFunction={[
                            "brandName",
                            "client_contact_name",
                            "client_contact_number",
                        ]}
                    />
                    {listSearchData?.length > 0 ? (
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
                            data={listSearchData}
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
                <NoItems icon="format-list-bulleted" text="No records found. Add records by clicking on plus icon." />
            )}
            <FAB style={[Styles.fabStyle]} icon="plus" onPress={AddCallback} />
            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
                {snackbarText}
            </Snackbar>
            <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={620} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
                <View>
                    <Title style={[Styles.paddingHorizontal16]}>{companyName}</Title>
                    <ScrollView style={{ marginBottom: 64 }}>
                        <List.Item title="Contact Person" description={contactPerson} />
                        <List.Item title="Contact Mobile No" description={contactMobileNumber} />
                        <List.Item title="Address" description={address1} />
                        <List.Item title="State Name" description={stateName} />
                        <List.Item title="City Name" description={cityName} />
                        <List.Item title="Pincode" description={pincode} />
                        <List.Item title="GST" description={gstNumber} />
                        <List.Item title="PAN" description={pan} />
                        <List.Item title="Service Provider Role" description={serviceProviderRole} />
                        {buyerCategoryName != "" &&
                            <>
                                <List.Item title="Buyer Category" description={buyerCategoryName} />
                            </>
                        }
                        <List.Item title="Created Or Added" description={addedBy == 0 ? "Add" : "Create"} />
                        <List.Item title="Display" description={display ? "Yes" : "No"} />
                    </ScrollView>
                </View>
            </RBSheet>
        </View>
    );
};

export default ProductPriceList;
