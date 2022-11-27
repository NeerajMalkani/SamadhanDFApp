import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Text, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { APIConverter } from "../../../../utils/apiconverter";
import { communication } from "../../../../utils/communication";

const AddServiceProductScreen = ({ route, navigation }) => {
  //#region Variables
  const [activityFullData, setActivityFullData] = React.useState([]);
  const [activityData, setActivityData] = React.useState([]);
  const [acivityName, setActivityName] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [activityID, setActivityID] = React.useState("");
  const [errorAN, setANError] = React.useState(false);
  const activityDDRef = useRef({});

  const [servicesFullData, setServicesFullData] = React.useState([]);
  const [servicesData, setServicesData] = React.useState([]);
  const [serviceName, setServiceName] = React.useState(route.params.type === "edit" ? route.params.data.serviceName : "");
  const [errorSN, setSNError] = React.useState(false);
  const servicesDDRef = useRef({});

  const [categoriesFullData, setCategoriesFullData] = React.useState([]);
  const [categoriesData, setCategoriesData] = React.useState([]);
  const [categoriesName, setCategoriesName] = React.useState(route.params.type === "edit" ? route.params.data.categoryName : "");
  const [errorCN, setCNError] = React.useState(false);
  const categoriesDDRef = useRef({});

  const [productsFullData, setProductsFullData] = React.useState([]);
  const [productsData, setProductsData] = React.useState([]);
  const [productsName, setProductsName] = React.useState(route.params.type === "edit" ? route.params.data.productName : "");
  const [errorPN, setPNError] = React.useState(false);
  const productsDDRef = useRef({});

  const [unitFullData, setUnitFullData] = React.useState([]);
  const [unitsData, setUnitsData] = React.useState([]);
  const [selectedUnitID, setSelectedUnitID] = React.useState(0);
  const [unitName, setUnitName] = React.useState(route.params.type === "edit" ? route.params.data.unit1Name : "");
  const [errorUN, setUNError] = React.useState(false);
  const unitDDRef = useRef({});

  const [hsnError, setHSNError] = React.useState(false);
  const [hsn, setHSN] = React.useState("");

  const [gstError, setGSTError] = React.useState(false);
  const [gst, setGST] = React.useState("");

  const [errorRUM, setErrorRUM] = React.useState(false);
  const [rum, setRUM] = React.useState(route.params.type === "edit" ? route.params.data.rateWithMaterials : "");
  const [rumht, setRUMHT] = React.useState("Materials + Labour cost");

  const [errorRUWM, setErrorRUWM] = React.useState(false);
  const [ruwm, setRUWM] = React.useState(route.params.type === "edit" ? route.params.data.rateWithoutMaterials : "");
  const [ruwmht, setRUWMHT] = React.useState("Only Labour cost");

  const [errorAUOS, setErrorAUOS] = React.useState(false);
  const [auos, setAUOS] = React.useState("");

  const [unitSelected, setUnitSelected] = React.useState(route.params.type === "edit" ? route.params.data.unit1Name : "");
  const [conversionUnitSelected, setConversionUnitSelected] = React.useState(route.params.type === "edit" ? route.params.data.unit2Name : "");

  const [errorSS, setErrorSS] = React.useState(false);
  const [shortSpec, setShortSpec] = React.useState(route.params.type === "edit" ? route.params.data.shortSpecification : "");

  const [errorS, setErrorS] = React.useState(false);
  const [spec, setSpec] = React.useState(route.params.type === "edit" ? route.params.data.specification : "");

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();
  const ref_input5 = useRef();
  //#endregion

  //#region Functions
  const FetchActvityRoles = () => {
    Provider.createDFAdmin(Provider.API_URLS.ActivityRoleServiceProduct)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setActivityFullData(response.data.data);
            servicesDDRef.current.reset();
            const activities = response.data.data.map((data) => data.activityRoleName);
            setActivityData(activities);
            setActivityName(response.data.data[0].activityRoleName);
            if (route.params.type !== "edit") {
              setServiceName("");
              setCategoriesFullData([]);
              setCategoriesData([]);
              setUnitsData([]);
              setProductsData([]);
              setANError(false);
              setHSN("");
              setGST("");
              setUnitName("");
              setRUM("");
              setRUWM("");
              setUnitSelected("");
              setConversionUnitSelected("");
              setAUOS("");
              setShortSpec("");
              setSpec("");
            }
            setActivityID(response.data.data[0].id);
            FetchServicesFromActivity(response.data.data[0].id);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchServicesFromActivity = (actID) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        group_refno: actID,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.ServiceNameServiceProduct, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            if (route.params.type === "edit") {
              FetchCategoriesFromServices(route.params.data.serviceName, response.data.data, actID);
            }
            setServicesFullData(response.data.data);
            const services = response.data.data.map((data) => data.serviceName);
            setServicesData(services);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchCategoriesFromServices = (selectedItem, servicesDataParam, actID) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        group_refno: actID ? actID : activityID,
        service_refno: servicesDataParam
          ? servicesDataParam.find((el) => {
              return el.serviceName === selectedItem;
            }).id
          : servicesFullData.find((el) => {
              return el.serviceName === selectedItem;
            }).id,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.CategoryNameServiceProduct, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setCategoriesFullData(response.data.data);
            if (route.params.type === "edit") {
              FetchCategoryDataFromCategory(route.params.data.categoryName, response.data.data);
              FetchProductsFromCategory(route.params.data.categoryName, response.data.data, actID);
            }
            const categories = response.data.data.map((data) => data.categoryName);
            setCategoriesData(categories);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchCategoryDataFromCategory = (selectedItem, categoriesDataParam) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        category_refno: categoriesDataParam
          ? categoriesDataParam.find((el) => {
              return el.categoryName === selectedItem;
            }).id
          : categoriesFullData.find((el) => {
              return el.categoryName === selectedItem;
            }).id,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.CategoryDataServiceProduct, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setHSN(response.data.data[0].hsnsacCode);
            setGST(response.data.data[0].gstRate);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchProductsFromCategory = (selectedItem, categoriesDataParam, actID) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        group_refno: actID ? actID : activityID,
        category_refno: categoriesDataParam
          ? categoriesDataParam.find((el) => {
              return el.categoryName === selectedItem;
            }).id
          : categoriesFullData.find((el) => {
              return el.categoryName === selectedItem;
            }).id,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.ProductServiceProduct, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            if (route.params.type === "edit") {
              FetchUnitsFromProductID(route.params.data.productName, response.data.data);
            }
            setProductsFullData(response.data.data);
            const products = response.data.data.map((data) => data.productName);
            setProductsData(products);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchUnitsFromProductID = (selectedItem, productDataParam) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        product_refno: productDataParam
          ? productDataParam.find((el) => {
              return el.productName === selectedItem;
            }).productID
          : productsFullData.find((el) => {
              return el.productName === selectedItem;
            }).productID,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.UnitNameSelectedForProduct, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setUnitFullData(response.data.data);
            const units = response.data.data.map((data) => data.displayUnit);
            setUnitsData(units);
          }
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    FetchActvityRoles();
  }, []);

  const onServiceNameSelected = (selectedItem) => {
    setServiceName(selectedItem);
    categoriesDDRef.current.reset();
    setCategoriesData([]);
    setUnitsData([]);
    setCategoriesName("");
    setHSN("");
    setGST("");
    setUnitName("");
    setProductsName("");
    setUnitSelected("");
    setConversionUnitSelected("");
    setAUOS("");
    setSNError(false);
    FetchCategoriesFromServices(selectedItem);
  };

  const onCategoriesNameSelected = (selectedItem) => {
    setCategoriesName(selectedItem);
    productsDDRef.current.reset();
    setCNError(false);
    setHSNError(false);
    setGSTError(false);
    setUnitName("");
    setProductsName("");
    setUnitSelected("");
    setConversionUnitSelected("");
    setAUOS("");
    if (route.params.type !== "edit") {
      FetchCategoryDataFromCategory(selectedItem, categoriesFullData);
      FetchProductsFromCategory(selectedItem);
    }
  };

  const onProductsNameSelected = (selectedItem) => {
    setProductsName(selectedItem);
    unitDDRef.current.reset();
    setPNError(false);
    setUnitName("");
    setUnitSelected("");
    setConversionUnitSelected("");
    setAUOS("");
    if (route.params.type !== "edit") {
      FetchUnitsFromProductID(selectedItem);
    }
  };

  const onUnitNameSelected = (selectedItem) => {
    setUnitName(selectedItem);
    setUNError(false);
    setSelectedUnitID(
      unitFullData.find((el) => {
        return el.displayUnit === selectedItem;
      }).id
    );
  };

  const onHSNChanged = (text) => {
    setHSN(text);
    setHSNError(false);
  };

  const onGSTChanged = (text) => {
    setGST(text);
    setGSTError(false);
  };

  const onRUMChanged = (text) => {
    setRUM(text);
    setRUMHT("Materials + Labour cost");
    setErrorRUM(false);
  };

  const onRUWMChanged = (text) => {
    setRUWM(text);
    setRUWMHT("Only Labour cost");
    setErrorRUWM(false);
  };

  const onAUOSChanged = (text) => {
    setAUOS(text);
    setErrorAUOS(false);
  };

  const onSSChanged = (text) => {
    setShortSpec(text);
    setErrorSS(false);
  };

  const onSChanged = (text) => {
    setSpec(text);
    setErrorS(false);
  };

  const UpdateData = () => {
    const params = {
      data: {
        Sess_UserRefno: "2",
        group_refno: activityID,
        service_refno: servicesFullData.find((el) => {
          return el.serviceName === serviceName;
        }).id,
        category_refno: categoriesFullData.find((el) => {
          return el.categoryName === categoriesName;
        }).id,
        product_refno: productsFullData.find((el) => {
          return el.productName === productsName;
        }).productID,
        unitcategoryrefno_unitrefno: selectedUnitID,
        with_material_rate: rum,
        without_material_rate: ruwm,
        unit_conversion_value: auos,
        short_desc: shortSpec,
        specification: spec,
        view_status: checked ? 1 : 0,
      },
    };
    if (route.params.type === "edit") {
      params.data.service_product_refno = route.params.data.id;
    }
    Provider.createDFAdmin(route.params.type === "edit" ? Provider.API_URLS.ServiceProductUpdate : Provider.API_URLS.ServiceProductCreate, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData(route.params.type === "edit" ? "update" : "add");
          navigation.goBack();
        } else if (response.data.code === 304) {
          setSnackbarText(communication.AlreadyExists);
          setSnackbarVisible(true);
        } else {
          setSnackbarText(communication.InsertError);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const ValidateData = () => {
    let isValid = true;
    const objActivities = activityFullData.find((el) => {
      return el.activityRoleName && el.activityRoleName === acivityName;
    });
    if (acivityName.length === 0 || !objActivities) {
      setANError(true);
      isValid = false;
    }
    const objServices = servicesFullData.find((el) => {
      return el.serviceName && el.serviceName === serviceName;
    });
    if (serviceName.length === 0 || !objServices) {
      setSNError(true);
      isValid = false;
    }
    const objCategories = categoriesFullData.find((el) => {
      return el.categoryName && el.categoryName === categoriesName;
    });
    if (categoriesName.length === 0 || !objCategories) {
      setCNError(true);
      isValid = false;
    }
    if (hsn.length === 0) {
      setHSNError(true);
      isValid = false;
    }
    if (gst.length === 0) {
      setGSTError(true);
      isValid = false;
    }
    const objProducts = productsFullData.find((el) => {
      return el.productName && el.productName === productsName;
    });
    if (productsName.length === 0 || !objProducts) {
      setPNError(true);
      isValid = false;
    }
    if (rum.length === 0) {
      setRUMHT(communication.InvalidRateWithMaterials);
      setErrorRUM(true);
      isValid = false;
    }
    if (ruwm.length === 0) {
      setRUWMHT(communication.InvalidRateWithoutMaterials);
      setErrorRUWM(true);
      isValid = false;
    }
    if (unitName.length === 0) {
      setUNError(true);
      isValid = false;
    }

    if (isValid) {
      UpdateData();
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <Dropdown label="Activity Name" data={activityData} isError={errorAN} selectedItem={acivityName} reference={activityDDRef} forceDisable={true} />
          <HelperText type="error" visible={errorAN}>
            {communication.InvalidActivityName}
          </HelperText>
          <Dropdown label="Service Name" data={servicesData} onSelected={onServiceNameSelected} isError={errorSN} selectedItem={serviceName} reference={servicesDDRef} />
          <HelperText type="error" visible={errorSN}>
            {communication.InvalidServiceName}
          </HelperText>
          <Dropdown label="Category Name" data={categoriesData} onSelected={onCategoriesNameSelected} isError={errorCN} selectedItem={categoriesName} reference={categoriesDDRef} />
          <HelperText type="error" visible={errorCN}>
            {communication.InvalidCategoryName}
          </HelperText>
          <TextInput mode="flat" label="HSN / SAC Code" value={hsn} onChangeText={onHSNChanged} error={hsnError} editable={false} dense style={[Styles.marginTop12, Styles.backgroundSecondaryColor]} />
          <HelperText type="error" visible={hsnError}>
            {communication.InvalidHSNSAC}
          </HelperText>
          <TextInput mode="flat" label="GST Rate" value={gst} onChangeText={onGSTChanged} error={gstError} editable={false} dense style={[Styles.marginTop12, Styles.backgroundSecondaryColor]} />
          <HelperText type="error" visible={gstError}>
            {communication.InvalidGSTRate}
          </HelperText>
          <Dropdown label="Product Name" data={productsData} onSelected={onProductsNameSelected} isError={errorPN} selectedItem={productsName} reference={productsDDRef} />
          <HelperText type="error" visible={errorPN}>
            {communication.InvalidProductName}
          </HelperText>
          <Dropdown label="Unit Name" data={unitsData} onSelected={onUnitNameSelected} isError={errorUN} selectedItem={unitName} reference={unitDDRef} />
          <HelperText type="error" visible={errorUN}>
            {communication.InvalidUnitName}
          </HelperText>
          <TextInput mode="flat" label="Rate / Unit (with materials)" value={rum} returnKeyType="next" keyboardType="decimal-pad" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onRUMChanged} style={{ backgroundColor: "white" }} error={errorRUM} />
          <HelperText type={errorRUM ? "error" : "info"} visible={true}>
            {rumht}
          </HelperText>
          <TextInput ref={ref_input2} mode="flat" label="Rate / Unit (without materials)" value={ruwm} returnKeyType="next" keyboardType="decimal-pad" onSubmitEditing={() => ref_input3.current.focus()} onChangeText={onRUWMChanged} style={{ backgroundColor: "white" }} error={errorRUWM} />
          <HelperText type={errorRUWM ? "error" : "info"} visible={true}>
            {ruwmht}
          </HelperText>
          <View style={[Styles.flexRow, Styles.flexAlignCenter]}>
            <Text style={[Styles.textCenter, { flex: unitSelected === "" ? 0 : 1 }]}>{unitSelected === "" ? "" : "1 " + unitSelected + " ="}</Text>
            <View style={[Styles.flex3]}>
              <TextInput ref={ref_input3} mode="flat" label="Alternative Unit of Sales" value={auos} returnKeyType="next" keyboardType="decimal-pad" onSubmitEditing={() => ref_input4.current.focus()} onChangeText={onAUOSChanged} style={{ backgroundColor: "white" }} error={errorAUOS} />
              <HelperText type="error" visible={errorAUOS}>
                {communication.InvalidAlternateUnitOfSales}
              </HelperText>
            </View>
            <Text style={[Styles.textCenter, { flex: conversionUnitSelected === "" ? 0 : 1 }]}>{conversionUnitSelected}</Text>
          </View>
          <TextInput ref={ref_input4} multiline mode="flat" label="Short Specification" value={shortSpec} returnKeyType="next" onSubmitEditing={() => ref_input5.current.focus()} onChangeText={onSSChanged} style={{ backgroundColor: "white" }} error={errorSS} />
          <HelperText type="error" visible={errorSS}></HelperText>
          <TextInput ref={ref_input5} multiline mode="flat" label="Specification" value={spec} returnKeyType="done" onChangeText={onSChanged} style={{ backgroundColor: "white" }} error={errorS} />
          <HelperText type="error" visible={errorS}></HelperText>
          <View style={{ width: 160 }}>
            <Checkbox.Item
              label="Display"
              color={theme.colors.primary}
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content>
          <Button mode="contained" onPress={ValidateData}>
            SAVE
          </Button>
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddServiceProductScreen;
