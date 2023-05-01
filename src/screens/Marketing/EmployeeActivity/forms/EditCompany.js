import { View, Text } from "react-native";
import React from "react";
import FormInput from "../common/Input";
import { ScrollView } from "react-native-gesture-handler";
import { Styles } from "../../../../styles/styles";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import Provider from "../../../../api/Provider";
import { Button, Snackbar } from "react-native-paper";
import { communication } from "../../../../utils/communication";
import { theme } from "../../../../theme/apptheme";

let userID = 0, compayID = 0, branchID = 0;

const EditCompanyForm = ({ navigation, route }) => {

    const [isButtonLoading, setIsButtonLoading] = React.useState(false);
    const [isSnackbarVisible, setIsSnackbarVisible] = React.useState("");

    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState('');

    const isFocused = useIsFocused();
    const [state, setState] = useState({
        mycustomer_refno: "0",
        company_name: "",
        address: "",
        pincode: "",
        district_refno: "",
        district_name: "",
        state_refno: "",
        state_name: "",
        view_status: "1",
    });

    const [error, setError] = useState({
        company_name: false,
        address: false,
        pincode: false,
        district_refno: false,
        state_refno: false,
    });
    const [states, setStates] = useState([]);
    const [districts, setDistricts] = useState([]);
    const fetchUser = async () => {
        const data = JSON.parse(await AsyncStorage.getItem("user"));
        userID = data.UserID;
        branchID = data.Sess_branch_refno;
        compayID = data.Sess_company_refno;
        if (route.params.type === "edit") {
            setState((state) => ({
                mycustomer_refno: route.params.data.mycustomer_refno,
                company_name: route.params.data.company_name,
                address: route.params.data.address,
                pincode: route.params.data.pincode,
                district_refno: route.params.data.district_refno,
                district_name:route.params.data.district_name,
                state_name:route.params.data.state_name,
                state_refno: route.params.data.state_refno,
                view_status: route.params.data.view_status,
            }));
        }
        fetchState();
    };
    useEffect(() => {
        if (isFocused) {
            fetchUser();
        }
    }, [isFocused]);

    const fetchState = () => {
        Provider.createDFCommon(Provider.API_URLS.GetStateDetails)
            .then((res) => {
                if (res.data.data) setStates(res.data.data);

                if (route.params.type == "edit") {
                    if (route.params.data.state_refno != "" && route.params.data.state_refno != "0") {
                        setState((state) => ({
                            ...state,
                            state_refno: route.params.data.state_refno,
                            state_name: route.params.data.state_name,
                        }));

                        fetchDistricts(route.params.data.state_refno);
                    }
                }
            })
            .catch((error) => console.log(error));
    };

    const fetchDistricts = (state_refno) => {
        Provider.createDFCommon(Provider.API_URLS.GetDistrictDetailsByStateRefno, {
            data: {
                Sess_UserRefno: userID,
                state_refno,
            },
        })
            .then((res) => {
                if (res.data.data) setDistricts(res.data.data);

                if (route.params.type == "edit") {
                    if (route.params.data.district_refno != "" && route.params.data.district_refno != "0") {
                        setState((state) => ({
                            ...state,
                            district_refno: route.params.data.district_refno,
                            district_name: route.params.data.district_name,
                        }));

                        
                    }
                }

            })
            .catch((error) => console.log(error));
    };

    const handleSubmit = () => {
        let errors = false;
        if (state.company_name.length === 0) {
            setError((state) => ({ ...state, company_name: true }));
            errors = true;
        }
        if (!errors) {
            setIsButtonLoading(true);
            let params = {
                data: {
                    Sess_UserRefno: userID,
                    Sess_company_refno: compayID,
                    Sess_branch_refno: branchID,
                    mycustomer_refno:state.mycustomer_refno,
                    company_name:state.company_name,
                    address:state.address,
                    pincode:state.pincode,
                    district_refno:state.district_refno,
                    state_refno:state.state_refno,
                    view_status:state.view_status,
                }
            };
            Provider.createDFEmployee(
                Provider.API_URLS.employee_update_customer_companydata, params
            ).then((response) => {
                setIsButtonLoading(false);
                if (response.data && response.data.code === 200) {
                    if (response.data.data.Updated == 1) {
                        route.params.fetchCustomers("update");
                        navigation.goBack();
                    }
                    else {
                        setSnackbarText(response.data.message);
                        setSnackbarVisible(true);
                    }

                } else if (response.data.code === 304) {
                    setSnackbarText(communication.AlreadyExists);
                    setSnackbarVisible(true);
                } else {
                    setSnackbarText(communication.InsertError);
                    setSnackbarVisible(true);
                }
            }).catch((e) => {
                // console.log(e);
                setIsButtonLoading(false);
                setSnackbarText(communication.NetworkError);
                setSnackbarVisible(true);
            });
        }
    };

    return (
        <View style={[Styles.flex1, Styles.backgroundColor]}>


            <ScrollView keyboardShouldPersistTaps="handled">
                <View style={[Styles.flex1, Styles.padding16, { background: "#fff" }]}>
                    <FormInput
                        label="Company Name"
                        onChangeText={(text) => {
                            setState((state) => ({
                                ...state,
                                company_name: text,
                            }));

                            setError((state) => ({
                                ...state,
                                company_name: false,
                            }));
                        }}
                        error={error.company_name}
                        value={state.company_name}
                    />
                    <FormInput
                        label="Address 1 "
                        onChangeText={(text) => {
                            setState((state) => ({
                                ...state,
                                address: text,
                            }));

                            setError((state) => ({
                                ...state,
                                address: false,
                            }));
                        }}
                        value={state.address}
                        error={error.address}
                    />
                    <FormInput
                        label="State"
                        type="dropdown"
                        data={states.map((obj) => obj.state_name)}
                        onChangeText={(text) => {
                            setState((state) => ({
                                ...state,
                                state_refno: states.find((item) => item.state_name === text).state_refno,
                                district_refno: "",
                            }));

                            setError((state) => ({
                                ...state,
                                state_refno: false,
                            }));
                            fetchDistricts(
                                states.find((item) => item.state_name === text).state_refno
                            );
                        }}
                        value={state.state_name}
                        error={error.state_refno}
                    />
                    <FormInput
                        label="City"
                        type="dropdown"
                        data={districts.map((obj) => obj.district_name)}
                        onChangeText={(text) => {
                            setState((state) => ({
                                ...state,
                                district_refno: districts.find((item) => item.district_name === text).district_refno,
                            }));

                            setError((state) => ({
                                ...state,
                                district_refno: false,
                            }));
                        }}
                        value={state.district_name}
                        error={error.district_refno}
                    />
                    <FormInput
                        label="Pincode"
                        onChangeText={(text) => {
                            setState((state) => ({
                                ...state,
                                pincode: text,
                            }));

                            setError((state) => ({
                                ...state,
                                pincode: false,
                            }));
                        }}
                        error={error.pincode}
                        value={state.pincode}
                        keyboardType="numeric"
                    />
                    <FormInput
                        label="Display"
                        type="check-box"
                        onChangeText={(text) => {
                            setState((state) => ({
                                ...state,
                                view_status: !state.view_status,
                            }));
                        }}
                        value={state.view_status}
                    />

                    <Button
                        onPress={handleSubmit}
                        mode="contained"
                        loading={isButtonLoading}
                        disabled={isButtonLoading}
                        style={{ width: "100%", alignSelf: "center" }}
                    >
                        Update Company
                    </Button>
                </View>
            </ScrollView>
            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                style={{ backgroundColor: theme.colors.error }}
            >
                {snackbarText}
            </Snackbar>
        </View>

    );
};

export default EditCompanyForm;
