import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Card, Checkbox, HelperText, Snackbar, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import DFButton from "../../../../components/Button";

const AddSetupScreen = ({ route, navigation }) => {
    //#region Variables

    const [nameError, setNameError] = React.useState(false);
    const [name, setName] = React.useState(route.params.type === "edit" ? route.params.data.option_name : "");

    const [valueError, setValueError] = React.useState(false);
    const [value, setValue] = React.useState(route.params.type === "edit" ? route.params.data.option_value : "");

    const [description, setDescription] = React.useState(route.params.type === "edit" ? route.params.data.option_desc : "");

    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState("");

    const [isButtonLoading, setIsButtonLoading] = React.useState(false);

    const ref_input2 = useRef();
    //#endregion

    //#region Functions

    const FetchStates = () => {
        Provider.createDFAdmin(Provider.API_URLS.GetStateEWayBillForm, null)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        setStatesFullData(response.data.data);
                        const stateData = [];
                        response.data.data.map((data, i) => {
                            if (data.state_name === stateName) {
                                setStateSelectedID(i.toString());
                            }
                            stateData.push({
                                id: data.state_refno.toString(),
                                title: data.state_name,
                            });
                        });
                        setStatesData(stateData);
                    }
                }
            })
            .catch((e) => { });
    };

    useEffect(() => {
        FetchStates();
    }, []);

    const onStateNameSelected = (selectedItem) => {
        setStateName(selectedItem);
        setSNError(false);
    };

    const onNameChanged = (text) => {
        setName(text);
        setNameError(false);
    };

    const onValueChanged = (text) => {
        setValue(text);
        setValueError(false);
    };

    const onDescriptionChanged = (text) => {
        setDescription(text);
    };


    const updateData = () => {
        Provider.createDFAdmin(Provider.API_URLS.setupupdate, {
            data: {
                Sess_UserRefno: "2",
                option_id: route.params.data.id,
                option_name: name.trim(),
                option_value: value.trim(),
                option_desc: description.trim(),
            },
        })
            .then((response) => {
                setIsButtonLoading(false);
                if (response.data && response.data.code === 200) {
                    route.params.fetchData("update");
                    navigation.goBack();
                } else if (response.data.code === 304) {
                    setSnackbarText(communication.AlreadyExists);
                    setSnackbarVisible(true);
                } else {
                    setSnackbarText(communication.UpdateError);
                    setSnackbarVisible(true);
                }
            })
            .catch((e) => {
                console.log(e);
                setIsButtonLoading(false);
                setSnackbarText(communication.NetworkError);
                setSnackbarVisible(true);
            });
    };

    const validate = () => {
        let isValid = true;

        if (name.trim() == "") {
            setNameError(true);
            isValid = false;
        }
        if (value.trim() == "") {
            setValueError(true);
            isValid = false;
        }

        if (isValid) {
            setIsButtonLoading(true);
            if (route.params.type === "edit") {
                updateData();
            } 
        }
    };
    //#endregion

    return (
        <View style={[Styles.flex1]}>
            <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} contentInsetAdjustmentBehavior="automatic" keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" nestedScrollEnabled>
                <View style={[Styles.padding16]}>

                    <TextInput mode="outlined" label="Option Name" disabled={true} returnKeyType="next"
                        onSubmitEditing={() => ref_input2.current.focus()} value={name}
                        onChangeText={onNameChanged} style={{ backgroundColor: "white" }}
                        error={nameError} />
                    <HelperText type="error" visible={nameError}>
                        Please enter a valid name
                    </HelperText>

                    <TextInput ref={ref_input2} mode="outlined" label="Option Value" value={value}
                        onChangeText={onValueChanged} style={{ backgroundColor: "white" }}
                        error={valueError} />
                    <HelperText type="error" visible={valueError}>
                        Please enter a valid Value
                    </HelperText>

                    <TextInput ref={ref_input2} mode="outlined" label="Description" value={description}
                        onChangeText={onDescriptionChanged} style={{ backgroundColor: "white" }} />

                </View>
            </ScrollView>
            <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
                <Card.Content>
                    <DFButton mode="contained" onPress={validate} title="SAVE" loader={isButtonLoading} />
                </Card.Content>
            </View>
            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
                {snackbarText}
            </Snackbar>
        </View>
    );
};

export default AddSetupScreen;
