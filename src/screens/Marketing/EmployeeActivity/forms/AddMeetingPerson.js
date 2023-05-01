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

const AddMeetingPerson = ({ navigation, route }) => {

    const [isButtonLoading, setIsButtonLoading] = React.useState(false);
    const [isSnackbarVisible, setIsSnackbarVisible] = React.useState("");

    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState('');

    const isFocused = useIsFocused();
    const [state, setState] = useState({
        mycustomer_detail_refno: "0",
        contact_name: "",
        designation: "",
        mobile: "",
        telephone: "",
        email: "",
    });

    const [error, setError] = useState({
        contact_name: false,
        designation: false,
        mobile: false,
        telephone: false,
        email: false,
    });

    const fetchUser = async () => {
        const data = JSON.parse(await AsyncStorage.getItem("user"));
        userID = data.UserID;
        branchID = data.Sess_branch_refno;
        compayID = data.Sess_company_refno;

        if (route.params.type === "edit") {
            setState((state) => ({
                mycustomer_detail_refno: route.params.data.mycustomer_detail_refno,
                contact_name:route.params.data.contact_person,
                designation: route.params.data.designation,
                mobile: route.params.data.mobile_no,
                telephone: route.params.data.phone_no,
                email: route.params.data.email_id,
            }));
        }
    };
    useEffect(() => {
        if (isFocused) {
            fetchUser();
        }
    }, [isFocused]);

    const handleSubmit = () => {
        let errors = false;
        if (state.mobile.length !== 10) {
            setError((state) => ({ ...state, mobile: true }));
            errors = true;
        }
        if (state.email.trim() != ""  &&
            !String(state.email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )
        ) {
            setError((state) => ({ ...state, email: true }));
            errors = true;
        }
        if (!errors) {
            setIsButtonLoading(true);
            let params = {
                data: {
                    Sess_UserRefno: userID,
                    Sess_company_refno: compayID,
                    Sess_branch_refno: branchID,
                    mycustomer_detail_refno: state.mycustomer_detail_refno,
                    contact_person: state.contact_name,
                    designation: state.designation,
                    mobile_no: state.mobile,
                    phone_no: state.telephone,
                    email_id: state.email,
                }
            };
            Provider.createDFEmployee(
                Provider.API_URLS.employee_update_customer_contactdata, params
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
                        label="Contact Person"
                        onChangeText={(text) => {
                            setState((state) => ({
                                ...state,
                                contact_name: text,
                            }));
                        }}
                        value={state.contact_name}
                    />
                    <FormInput
                        label="Designtion"
                        onChangeText={(text) => {
                            setState((state) => ({
                                ...state,
                                designation: text,
                            }));
                        }}
                        value={state.designation}
                    />

                    <FormInput
                        label="Mobile Number"
                        onChangeText={(text) => {
                            if (text.length < 11)
                                setState((state) => ({
                                    ...state,
                                    mobile: text,
                                }));
                        }}
                        keyboardType={"phone-pad"}
                        value={state.mobile}
                    />
                    <FormInput
                        value={state.telephone}
                        label="Telephone Number"
                        onChangeText={(text) => {
                            if (text.length < 11)
                                setState((state) => ({
                                    ...state,
                                    telephone: text,
                                }));
                        }}
                        keyboardType={"phone-pad"}
                    />
                    <FormInput
                        label="Email ID"
                        onChangeText={(text) => {
                            setState((state) => ({
                                ...state,
                                email: text,
                            }));
                        }}
                        value={state.email}
                    />

                    <Button
                        onPress={handleSubmit}
                        mode="contained"
                        loading={isButtonLoading}
                        disabled={isButtonLoading}
                        style={[Styles.marginTop16, { width: "100%", alignSelf: "center" }]}
                    >
                        Update Contact
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

export default AddMeetingPerson;