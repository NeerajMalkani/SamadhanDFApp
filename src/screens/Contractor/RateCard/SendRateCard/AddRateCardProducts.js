import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { Checkbox, Title, TextInput, Text, Snackbar, Searchbar } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import NoItems from "../../../../components/NoItems";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Col, Row, Grid } from "react-native-paper-grid";
let userID = 0;

const AddRateCardProducts = ({ arrProductData, inclusiveMaterial, unitSalesName }) => {
    //#region Variables

    const [activityFullData, setActivityFullData] = React.useState([]);

    const [servicesFullData, setServicesFullData] = React.useState([]);
    const [servicesData, setServicesData] = React.useState([]);
    const [serviceName, setServiceName] = React.useState("");
    const servicesDDRef = useRef({});

    const [categoriesFullData, setCategoriesFullData] = React.useState([]);
    const [categoriesData, setCategoriesData] = React.useState([]);
    const [categoriesName, setCategoriesName] = React.useState("");
    const categoriesDDRef = useRef({});
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState("");
    const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);


    const [productsFullData, setProductsFullData] = React.useState([]);
    //#endregion 

    //#region Functions

    const FetchActvityRoles = () => {
        Provider.getAll("master/getmainactivities")
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        response.data.data = response.data.data.filter((el) => {
                            return el.display && el.activityRoleName === "Contractor";
                        });

                        setActivityFullData(response.data.data);
                        servicesDDRef.current.reset();
                        setServiceName("");
                        setCategoriesName("");
                        setCategoriesData([]);
                        setServicesData([]);
                        setProductsFullData([]);

                        FetchServicesFromActivity("Contractor", response.data.data);
                    }
                }
            })
            .catch((e) => { });
    };

    const GetUserID = async () => {
        const
            userData = await AsyncStorage.getItem("user");
        if (userData !== null) {
            userID = JSON.parse(userData).UserID;
            FetchActvityRoles();
        }
    };

    const FetchServicesFromActivity = (selectedItem, activityData) => {
        let params = {
            ContractorID: userID,
        };
        Provider.getAll(`master/getcontractoractiveservices?${new URLSearchParams(params)}`)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        setServicesFullData(response.data.data);
                        const services = response.data.data.map((data) => data.serviceName);
                        setServicesData(services);
                    }
                }
            })
            .catch((e) => { });
    };

    const FetchCategoriesFromServices = (selectedItem) => {
        let params = {
            ActivityID: activityFullData.find((el) => {
                return el.activityRoleName === "Contractor";
            }).id,
            ServiceID: servicesFullData.find((el) => {
                return el.serviceName === selectedItem;
            }).serviceID,
        };
        Provider.getAll(`master/getcategoriesbyserviceid?${new URLSearchParams(params)}`)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        setCategoriesFullData(response.data.data);
                        const categories = response.data.data.map((data) => data.categoryName);
                        setCategoriesData(categories);
                    }
                }
            })
            .catch((e) => { });
    };

    const FetchProductsFromCategory = (selectedItem) => {
        let params = {
            ActivityID: activityFullData.find((el) => {
                return el.activityRoleName === "Contractor";
            }).id,
            ServiceID: servicesFullData.find((el) => {
                return el.serviceName === serviceName;
            }).serviceID,
            CategoryID: categoriesFullData.find((el) => {
                return el.categoryName === selectedItem;
            }).id,
            ContractorID: userID,
            InclusiveMaterial: inclusiveMaterial
        };
        Provider.getAll(`master/getcontractorratecardproductsbycategoryid?${new URLSearchParams(params)}`)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        response.data.data = response.data.data.filter((el) => {
                            return el.display;
                        });
                        const fullData = response.data.data.map((o) => ({
                            ...o,
                            isChecked: arrProductData[0].find((el) => {
                                return el.productID === o.productID;
                            })
                                ? true
                                : false,
                        }));
                        setProductsFullData(fullData);
                    }
                }
            })
            .catch((e) => { });
    };

    useEffect(() => {
        GetUserID();
    }, []);

    const onServiceNameSelected = (selectedItem) => {
        setServiceName(selectedItem);
        categoriesDDRef.current.reset();
        setCategoriesData([]);
        setProductsFullData([]);
        setCategoriesName("");
        FetchCategoriesFromServices(selectedItem);
    };

    const onCategoriesNameSelected = (selectedItem) => {
        setCategoriesName(selectedItem);
        setProductsFullData([]);
        FetchProductsFromCategory(selectedItem);
    };
    //#endregion 

    return (
        <View style={[Styles.flex1]}>
            <View style={[Styles.flexRow, Styles.padding16]}>
                <View style={[Styles.paddingStart0, Styles.paddingEnd8, Styles.flex1]}>
                    <Dropdown label="Service Name" data={servicesData} onSelected={onServiceNameSelected} selectedItem={serviceName} reference={servicesDDRef} />
                </View>
                <View style={[Styles.paddingStart8, Styles.paddingEnd0, Styles.flex1]}>
                    <Dropdown label="Category Name" data={categoriesData} onSelected={onCategoriesNameSelected} selectedItem={categoriesName} reference={categoriesDDRef} />
                </View>
            </View>
            <View style={[Styles.flex1, Styles.padding16]}>
                {productsFullData.length > 0 ? (
                    <Title style={[Styles.paddingHorizontal16, Styles.paddingBottom16, Styles.borderBottom1]}>Products</Title>
                ) : (
                    <View style={[Styles.flex1, Styles.flexAlignCenter, Styles.flexJustifyCenter]}>
                        <NoItems icon="format-list-bulleted" text="No records found." />
                    </View>
                )}

                {productsFullData.map((k, i) => {
                    return (
                        <Grid style={[Styles.bordergray, Styles.border1, { backgroundColor: "#cdcdcd" }]}>
                            <Row style={[Styles.height40]}>
                                <Col size={75}><Text>{k.productName}</Text></Col>
                                <Col size={25}>
                                    <TextInput mode="outlined" dense label="Unit" disabled value={unitSalesName === "Foot" ? k.unit1Name : k.unit2Name}></TextInput>
                                </Col>
                            </Row>
                            <Row>
                                <Col size={50}>
                                    <TextInput mode="outlined" dense label="Rate" value={unitSalesName === "Foot" ? k.footRate : k.meterRate}
                                        style={{ backgroundColor: "white" }} keyboardType="number-pad" maxLength={7}
                                        defaultValue={(unitSalesName === "Foot" ? k.footRate : k.meterRate).toString()}
                                        onChangeText={(e) => {
                                            if (unitSalesName === "Foot") {
                                                k.footRate = e;
                                                if (parseInt(e) > 0) {
                                                    k.meterRate = (parseFloat(e) * parseFloat(k.meterConversion)).toFixed(2).toString();
                                                }
                                                else {
                                                    k.meterRate = "0";
                                                }
                                            }
                                            else {
                                                k.meterRate = e;
                                                if (parseInt(e) > 0) {
                                                    k.footRate = (parseFloat(e) * parseFloat(k.footConversion)).toFixed(2).toString();
                                                }
                                                else {
                                                    k.footRate = "0";
                                                }
                                            }
                                        }}
                                    ></TextInput>
                                </Col>
                                <Col size={50}>
                                    <Checkbox.Item
                                        key={i}
                                        status={k.isChecked ? "checked" : "unchecked"}
                                        style={[Styles.borderBottom1]}
                                        onPress={() => {
                                            let rate = 0;
                                            if (unitSalesName === "Foot") {
                                                rate = k.footRate;
                                            }
                                            else {
                                                rate = k.meterRate;
                                            }

                                            if (rate <= 0) {
                                                k.isChecked = false;
                                                setSnackbarText("Price enter a valid price");
                                                setSnackbarColor(theme.colors.error);
                                                setSnackbarVisible(true);
                                            }
                                            else {
                                                const tempArrProductData = [...arrProductData[0]];
                                                if (!k.isChecked) {

                                                    let newRate = "", newUnit = "", altRate = "", altUnit = "", selectedUnit = 0;
                                                    if (unitSalesName === "Foot") {
                                                        newRate = k.footRate;
                                                        newUnit = k.unit1Name;
                                                        altRate = k.meterRate;
                                                        altUnit = k.unit2Name;
                                                        selectedUnit = k.unit1ID;
                                                    }
                                                    else {
                                                        newRate = k.meterRate;
                                                        newUnit = k.unit2Name;
                                                        altRate = k.footRate;
                                                        altUnit = k.unit1Name;
                                                        selectedUnit = k.unit2ID;
                                                    }

                                                    k.selectedUnitID = selectedUnit;
                                                    k.rate = newRate;
                                                    k.unit = newUnit;
                                                    k.altRate = altRate;
                                                    k.altUnit = altUnit;

                                                    tempArrProductData.push(k);
                                                } else {
                                                    tempArrProductData.splice(tempArrProductData.indexOf(k), 1);
                                                }
                                                arrProductData[1](tempArrProductData);
                                                let temp = productsFullData.map((u) => {
                                                    if (k.productID === u.productID) {
                                                        return { ...u, isChecked: !u.isChecked };
                                                    }
                                                    return u;
                                                });
                                                setProductsFullData(temp);
                                            }
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Grid>
                    );
                })}
            </View>
        </View>
    );
};

export default AddRateCardProducts;
