import { View, ScrollView } from 'react-native';
import {
    Card,
    Checkbox,
    HelperText,
    Snackbar,
    Subheading,
    TextInput,
    Button,
    Text,
} from 'react-native-paper';
import {
    AsyncStorage, React, RadioGroup, RBSheet, AutocompleteDropdown, Styles,
    theme, Dropdown, Provider, DFButton, useEffect, useRef, useState, communication,
    APIConverter, projectLoginTypes,
} from '../../../components/CommonImports'

let userID = 0, companyID = 0, branchID = 0, Sess_designation_refno = 0, groupID = 0, companyAdminID = 0;

const AddProductPriceList = ({ route, navigation }) => {


    const [clientsFullData, setClientsFullData] = React.useState([]);
    const [clientData, setClientData] = React.useState([]);
    const [clientName, setClientName] = React.useState("");
    const [errorCN, setCNError] = React.useState(false);

    const refRBSheet = useRef();

    const [companyData, setCompanyData] = React.useState([]);
    const [companyName, setCompanyName] = React.useState("");
    const [errorCON, setCONError] = React.useState(false);

    const [otherClients, setOtherClients] = React.useState([]);
    const [selectedData, setSelectedData] = React.useState([]);
    const [selectedClient, setSelectedClient] = React.useState("");
    const [isButtonDisabled, setIsButtonDisabled] = React.useState(false);

    const [mobilenoData, setMobileNoData] = React.useState([]);
    const [mobileno, setMobileNo] = React.useState("");
    const [errorMN, setMNError] = React.useState(false);

    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState("");
    const [snackbarColor, setSnackbarColor] = React.useState(
        theme.colors.success
    );

    const [terms, setTerms] = React.useState("");
    const [termsInvalid, setTermsInvalid] = useState(false);
    const termsRef = useRef({});

    const [brandID, setBrandID] = useState(0);
    const [BrandRadioButtons, setBrandRadioButtons] = useState([]);

    function onPressBrandRadioButton(radioButtonsArray) {
        setBrandRadioButtons(radioButtonsArray);
        setIsBrandError(false);
        radioButtonsArray.map((r) => {
            if (r.selected === true) {
                setBrandID(r.value);
            }
        });
    }

    const [serviceTypeInvalid, setServiceTypeInvalid] = useState(false);

    const [checked, setChecked] = React.useState(
        route.params.type === 'edit' ? route.params.data.display : true,
    );

    const [isButtonLoading, setIsButtonLoading] = React.useState(false);
    const [isDealer, setIsDealer] = React.useState(false);
    const [isServiceProvideOnlyClient, setIsServiceProvideOnlyClient] = React.useState(false);
    const [isBrandError, setIsBrandError] = React.useState(false);


    useEffect(() => {
        GetUserID();
    }, []);

    const GetUserID = async () => {
        const userData = await AsyncStorage.getItem('user');
        if (userData !== null) {
            userID = JSON.parse(userData).UserID;
            companyID = JSON.parse(userData).Sess_company_refno;
            branchID = JSON.parse(userData).Sess_branch_refno;
            groupID = JSON.parse(userData).Sess_group_refno;
            companyAdminID = JSON.parse(userData).Sess_CompanyAdmin_UserRefno;
            FetchClients();
            FetchBrandNames();
        }
    };

    const FetchClients = () => {
        let params = {
            data: {
                Sess_UserRefno: userID,
                Sess_company_refno: companyID,
                Sess_branch_refno: branchID,
                Sess_group_refno: groupID,
                client_user_refno: "all",
            },
        };
        Provider.createDFCommon(Provider.API_URLS.MyClientUserRefNoCheck, params)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        setClientsFullData(response.data.data);
                        let clientData = response.data.data.map((data) => data.company_name);
                        setClientData(clientData);
                    }
                } else {
                    setClientData([]);
                    setClientsFullData([]);
                }
            })
            .catch((e) => {
                setClientData([]);
                setClientsFullData([]);
            });
    };

    const FetchOtherClients = (selectedItem, type) => {
        let params = {
            data: {
                Sess_UserRefno: userID,
                company_name: selectedItem,
            },
        };
        if (type === "company") {
            params.data.company_name = selectedItem;
        } else {
            params.data.mobile_no = selectedItem;
        }
        Provider.createDFCommon(
            type === "company"
                ? Provider.API_URLS.CompanyNameAutocompleteClientSearch
                : Provider.API_URLS.MobileNoAutocompleteClientSearch,
            params
        )
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        let clientData = [];
                        response.data.data.map((data, i) => {
                            clientData.push({
                                id: i,
                                title:
                                    type === "company"
                                        ? data.companyname_Result
                                        : data.mobile_no_Result,
                            });
                        });
                        if (type === "company") {
                            setCompanyData(clientData);
                        } else {
                            setMobileNoData(clientData);
                        }
                    }
                } else {
                    setCompanyData([]);
                    setMobileNoData([]);
                }
            })
            .catch((e) => {
                setCompanyData([]);
                setMobileNoData([]);
            });
    };

    const FetchBrandNames = () => {
        let params = {
            data: {
                Sess_UserRefno: userID,
                Sess_company_refno: companyID,
                Sess_branch_refno: branchID,
                Sess_group_refno: groupID,
                Sess_CompanyAdmin_UserRefno: companyAdminID
            },
        };
        Provider.createDFDealer(Provider.API_URLS.get_brandname_sendproductpriceform, params)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {

                        let brandName = [];
                        response.data.data.map((data) => {

                            brandName.push({
                                id: data.brand_refno,
                                label: `${data.brand_name} (${data.category_name})`,
                                selected: false,
                                value: data.brand_refno,
                            });

                        });
                        setBrandRadioButtons(brandName);
                    }
                }
            })
            .catch((e) => { });
    };

    const onCompanyNameSelected = (selectedItem) => {
        setCompanyName(selectedItem);
        setCONError(false);
        FetchOtherClients(selectedItem, "company");
    };

    const onMobileNumberSelected = (selectedItem) => {
        setMobileNo(selectedItem);
        setMNError(false);
        FetchOtherClients(selectedItem, "mobile");
    };

    const SearchClient = () => {
        setIsButtonDisabled(true);
        let params = {
            data: {
                Sess_UserRefno: userID,
                Sess_company_refno: companyID,
                company_name_s: companyName,
                mobile_no_s: mobileno,
            },
        };
        Provider.createDFCommon(Provider.API_URLS.ClientSearch, params)
            .then((response) => {
                setIsButtonDisabled(false);
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        setOtherClients(response.data.data);
                    }
                } else {
                    setOtherClients([]);
                }
            })
            .catch((e) => {
                setIsButtonDisabled(false);
                setOtherClients([]);
            });
    };

    const InsertOtherClient = (selectedID) => {
        const params = {
            data: {
                Sess_UserRefno: userID,
                Sess_company_refno: companyID,
                Sess_branch_refno: branchID,
                client_user_refno: selectedID,
                search_client_role_refnos: ["8"]// for client TBD
            },
        };
        Provider.createDFCommon(Provider.API_URLS.ClientAdd, params)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    refRBSheet.current.close();
                    FetchClients();
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

    const InsertData = () => {
        
        const params = {
            data: {
                Sess_UserRefno: userID,
                Sess_company_refno: companyID,
                Sess_branch_refno: branchID,
                client_user_refno: clientsFullData.find((el) => {
                    return el.company_name === clientName;
                }).client_user_refno,
                brand_refno: brandID,
                terms_condition: terms.trim()
            },
        };
        Provider.createDFDealer(Provider.API_URLS.sendproductprice_create, params)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    route.params.fetchData('add');
                    navigation.goBack();
                } else {
                    setSnackbarText(communication.InsertError);
                    setSnackbarVisible(true);
                }
                setIsButtonLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setSnackbarText(communication.NetworkError);
                setSnackbarVisible(true);
                setIsButtonLoading(false);
            });
    };

    const ValidateData = () => {
        let isValid = true;
        if (clientName.trim().length == 0) {
            setCNError(true);
            isValid = false;
        }
        if (brandID == 0) {
            isValid = false;
            setIsBrandError(true);
        }

        if (terms.trim().length === 0) {
            setTermsInvalid(true);
            isValid = false;
        }
        if (isValid) {
            setIsButtonLoading(true);
            InsertData();
        }
    };

    const onClientNameSelected = (selectedItem) => {
        setClientName(selectedItem);
        setCNError(false);
    };

    const onTermsChanged = (text) => {
        setTerms(text);
        setTermsInvalid(false);
    };

    return (
        <View style={[Styles.flex1]}>
            <ScrollView
                style={[Styles.flex1, Styles.backgroundColor]}
                keyboardShouldPersistTaps='handled'
            >
                <View style={[Styles.paddingHorizontal16, Styles.paddingTop16, Styles.paddingBottom32]}>

                    <View
                        style={[Styles.padding8, Styles.border1, Styles.borderRadius4, { zIndex: 10 }]}
                    >
                        <Dropdown
                            label="Client Name"
                            data={clientData}
                            onSelected={onClientNameSelected}
                            isError={errorCN}
                            selectedItem={clientName}
                        />
                        <HelperText type="error" visible={errorCN}>
                            {communication.InvalidClient}
                        </HelperText>
                        <View
                            style={[
                                Styles.flexRow,
                                Styles.marginTop4,
                                { justifyContent: "space-between" },
                            ]}
                        >
                            <Button
                                mode="outlined"
                                onPress={() => {

                                    setCompanyName("");
                                    setCONError(false);
                                    setMobileNo("");
                                    setMNError(false);

                                    setOtherClients([]);
                                    setIsButtonDisabled(false);

                                    setMobileNoData([]);
                                    setCompanyData([]);

                                    refRBSheet.current.open();
                                }}
                            >
                                Search & Add
                            </Button>
                            <Button
                                mode="contained"
                                onPress={() => {
                                    navigation.navigate("AddClientScreen", {
                                        type: "client",
                                        fetchData: FetchClients,
                                    });
                                }}
                            >
                                Create New
                            </Button>
                        </View>
                    </View>

                    <View
                        style={[Styles.padding8, Styles.border1, Styles.borderRadius4, Styles.marginTop16, { zIndex: 10 }]}
                    >
                        <Subheading style={{ fontWeight: 'bold' }}>
                            Brand Name
                        </Subheading>
                        <View>
                            <RadioGroup
                                containerStyle={[Styles.marginTop16, Styles.flexAlignStart]}
                                radioButtons={BrandRadioButtons}
                                onPress={onPressBrandRadioButton}
                                isError
                            />
                            <HelperText type='error' visible={isBrandError}>
                                Please select brand
                            </HelperText>
                        </View>
                    </View>

                    <TextInput
                        ref={termsRef}
                        mode='outlined'
                        dense
                        maxLength={1000}
                        label='Terms & Conditions'
                        value={terms}
                        multiline={true}
                        numberOfLines={5}
                        returnKeyType='done'
                        onChangeText={onTermsChanged}
                        style={[Styles.marginTop16, { backgroundColor: 'white' }]}
                        error={termsInvalid}
                        autoCapitalize='characters'
                        autoCorrect={false}
                    />
                    <HelperText type='error' visible={termsInvalid}>
                        Please enter Terms & Conditions
                    </HelperText>

                    <View style={[Styles.marginTop16]}>
                        <DFButton
                            mode='contained'
                            onPress={ValidateData}
                            title='SAVE'
                            loader={isButtonLoading}
                        />
                    </View>
                </View>
            </ScrollView >

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                dragFromTopOnly={true}
                height={640}
                animationType="fade"
                customStyles={{
                    wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
                    draggableIcon: { backgroundColor: "#000" },
                }}
            >
                <ScrollView
                    style={[Styles.flex1, Styles.backgroundColor]}
                    contentContainerStyle={{ flexGrow: 1 }}
                    keyboardShouldPersistTaps="handled"
                    nestedScrollEnabled
                >
                    <View
                        style={[Styles.flex1, Styles.backgroundColor, Styles.padding16]}
                    >
                        <View style={[Styles.flexColumn]}>
                            <AutocompleteDropdown
                                clearOnFocus={false}
                                closeOnBlur={true}
                                direction="down"
                                suggestionsListContainerStyle={{
                                    borderColor: theme.colors.border,
                                    borderWidth: 1,
                                }}
                                inputContainerStyle={{
                                    backgroundColor: theme.colors.textLight,
                                    borderBottomColor: errorCON
                                        ? theme.colors.error
                                        : theme.colors.textfield,
                                    borderBottomWidth: 1,
                                }}
                                textInputProps={{
                                    placeholder: "Company Name",
                                    value: companyName,
                                    placeholderTextColor: errorCON
                                        ? theme.colors.error
                                        : theme.colors.textSecondary,
                                    onChangeText: onCompanyNameSelected,
                                }}
                                renderItem={(item) => (
                                    <View style={[Styles.paddingVertical16]}>
                                        <Text
                                            style={{
                                                color: theme.colors.text,
                                                paddingHorizontal: 16,
                                            }}
                                        >
                                            {item ? item.title : ""}
                                        </Text>
                                    </View>
                                )}
                                onClear={() => {
                                    setIsButtonDisabled(true);
                                    setCompanyName("");
                                    setCompanyData([]);
                                }}
                                onSelectItem={(item) => {
                                    if (item) {
                                        setIsButtonDisabled(false);
                                        setCompanyName(item.title);
                                    }
                                }}
                                dataSet={companyData}
                            />
                            <HelperText type="error" visible={errorCON}>
                                {communication.InvalidClient}
                            </HelperText>
                            <AutocompleteDropdown
                                clearOnFocus={false}
                                closeOnBlur={true}
                                direction="down"
                                suggestionsListContainerStyle={{
                                    borderColor: theme.colors.border,
                                    borderWidth: 1,
                                }}
                                inputContainerStyle={{
                                    backgroundColor: theme.colors.textLight,
                                    borderBottomColor: errorMN
                                        ? theme.colors.error
                                        : theme.colors.textfield,
                                    borderBottomWidth: 1,
                                }}

                                textInputProps={{
                                    keyboardType: 'number-pad',
                                    placeholder: "Mobile No",
                                    value: mobileno,
                                    placeholderTextColor: errorMN
                                        ? theme.colors.error
                                        : theme.colors.textSecondary,
                                    onChangeText: onMobileNumberSelected,
                                }}
                                renderItem={(item) => (
                                    <View style={[Styles.paddingVertical8]}>
                                        <Text
                                            style={{
                                                color: theme.colors.text,
                                                paddingHorizontal: 16,
                                            }}
                                        >
                                            {item ? item.title : ""}
                                        </Text>
                                        <Text
                                            style={{
                                                color: theme.colors.textSecondary,
                                                paddingHorizontal: 16,
                                            }}
                                        >
                                            {item ? item.contact : ""}
                                        </Text>
                                    </View>
                                )}
                                onClear={() => {
                                    setIsButtonDisabled(true);
                                    setMobileNo("");
                                    setMobileNoData([]);
                                }}
                                onSelectItem={(item) => {
                                    if (item) {
                                        setIsButtonDisabled(false);
                                        setMobileNo(item.title);
                                    }
                                }}
                                dataSet={mobilenoData}
                            />
                            <HelperText type="error" visible={errorMN}>
                                {communication.InvalidClient}
                            </HelperText>
                        </View>
                        <Button
                            mode="contained"
                            disabled={isButtonDisabled}
                            loading={isButtonDisabled}
                            style={[Styles.marginTop32, { zIndex: -1 }]}
                            onPress={SearchClient}
                        >
                            Search
                        </Button>
                        <View
                            style={[Styles.flexColumn, Styles.border1, Styles.marginTop16]}
                        >
                            {otherClients &&
                                otherClients.map((v, k) => {
                                    return (
                                        <View
                                            style={[
                                                Styles.flexRow,
                                                Styles.padding16,
                                                Styles.flexAlignCenter,
                                                Styles.borderBottom1,
                                                { justifyContent: "space-between" },
                                            ]}
                                        >
                                            <View style={[Styles.flexColumn]}>
                                                <Text style={{ color: theme.colors.text }}>
                                                    {v.Search_company_name}
                                                </Text>
                                                <Text style={{ color: theme.colors.text }}>
                                                    {v.Search_mobile_no}
                                                </Text>
                                            </View>
                                            <Button
                                                mode="contained"
                                                disabled={isButtonDisabled}
                                                onPress={() => InsertOtherClient(v.Search_user_refno)}
                                            >
                                                Add
                                            </Button>
                                        </View>
                                    );
                                })}
                        </View>
                    </View>
                </ScrollView>
            </RBSheet>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
                style={{ backgroundColor: theme.colors.error }}
            >
                {snackbarText}
            </Snackbar>
        </View >
    );
};
export default AddProductPriceList;
