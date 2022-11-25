import React from 'react'
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import { useState } from 'react';
import { useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { Styles } from '../../../styles/styles';
import Dropdown from '../../../components/Dropdown';
import { Button, Card, HelperText, Snackbar, TextInput } from 'react-native-paper';
import { communication } from '../../../utils/communication';
import { theme } from '../../../theme/apptheme';

function EditStockList({ route, navigation }) {
    const [dob, setDob] = useState(new Date());
    const [error, setError] = React.useState(false);
    const [name, setName] = React.useState(route.params.type === "edit" ? route.params.data.categoryName : "");
    const [servicesData, setServicesData] = React.useState([]);
    const [errorSN, setSNError] = React.useState(false);
    const [serviceName, setServiceName] = React.useState(route.params.type === "edit" ? route.params.data.serviceName : "");
    const [hsnError, setHSNError] = React.useState(false);
    const [hsn, setHSN] = React.useState(route.params.type === "edit" ? route.params.data.hsnsacCode : "");
    const [gstError, setGSTError] = React.useState(false);
    const [gst, setGST] = React.useState(route.params.type === "edit" ? route.params.data.gstRate.toString() : "");
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState("");

    const ref_input2 = useRef();
    const ref_input3 = useRef();
    const onServiceNameSelected = (selectedItem) => {
        setServiceName(selectedItem);
        setSNError(false);
    };
    const ValidateData = () => {
        let isValid = true;
        if (name.length === 0) {
            setError(true);
            isValid = false;
        }

        if (hsn.length === 0) {
            setHSNError(true);
            isValid = false;
        }

        if (serviceName.length === 0 || !objServices) {
            setSNError(true);
            isValid = false;
        }
    }
    const onNameChanged = (text) => {
        setName(text);
        setError(false);
    };

    const onHSNChanged = (text) => {
        setHSN(text);
        setHSNError(false);
    };
    const onGSTChanged = (text) => {
        setGST(text);
        setGSTError(false);
    };
    return (
        <View style={[Styles.flex1]}>
            <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
                <View style={[Styles.padding16]}>
                    <View>
                        <DateTimePicker style={[Styles.backgroundColorWhite, Styles.borderred]} label=" * Date" type="date" value={dob} onChangeDate={setDob} />
                    </View>
                    <View style={[Styles.paddingTop16]}>
                        <Dropdown label="Service Name" data={servicesData} onSelected={onServiceNameSelected} isError={errorSN} selectedItem={serviceName} style={[ Styles.borderred]} />
                    </View>
                    <HelperText type="error" visible={errorSN}>
                        {communication.InvalidServiceName}
                    </HelperText>
                    <Dropdown label="Category Name" data={servicesData} onSelected={onServiceNameSelected} isError={errorSN} selectedItem={serviceName} style={[Styles.paddingTop16]} />
                    <HelperText type="error" visible={errorSN}>
                        {communication.InvalidServiceName}
                    </HelperText>
                    <Dropdown label="Brand Name" data={servicesData} onSelected={onServiceNameSelected} isError={errorSN} selectedItem={serviceName} style={[Styles.paddingTop16]} />
                    <HelperText type="error" visible={errorSN}>
                        {communication.InvalidServiceName}
                    </HelperText>
                    <Dropdown label="Product Name" data={servicesData} onSelected={onServiceNameSelected} isError={errorSN} selectedItem={serviceName} style={[Styles.paddingTop16]} />
                    <HelperText type="error" visible={errorSN}>
                        {communication.InvalidServiceName}
                    </HelperText>

                    <TextInput mode="flat" label="Category Name" value={name} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onNameChanged} style={[ { backgroundColor: "white" }]} error={error} />
                    <HelperText type="error" visible={error}>
                        {communication.InvalidCategoryName}
                    </HelperText>
                    <TextInput ref={ref_input2} mode="flat" label="Total Products" value={hsn} returnKeyType="next" onSubmitEditing={() => ref_input3.current.focus()} onChangeText={onHSNChanged} style={{ backgroundColor: "white" }} error={hsnError} />
                    <HelperText type="error" visible={hsnError}>
                        {communication.InvalidHSNSAC}
                    </HelperText>
                    <TextInput ref={ref_input3} mode="flat" label="Wieght per piece" value={gst} returnKeyType="done" keyboardType="decimal-pad" onChangeText={onGSTChanged} style={{ backgroundColor: "white" }} error={gstError} />
                    <HelperText type="error" visible={gstError}>
                        {communication.InvalidGSTRate}
                    </HelperText>
                </View>
            </ScrollView>
            <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
                <Card.Content>
                    <Button mode="contained" onPress={ValidateData}>
                        Save
                    </Button>
                </Card.Content>
            </View>
            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
                {snackbarText}
            </Snackbar>

        </View>
    )
}

export default EditStockList