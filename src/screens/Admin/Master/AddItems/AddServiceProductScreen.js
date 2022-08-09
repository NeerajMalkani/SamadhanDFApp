import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Text, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";

const AddServiceProductScreen = ({ route, navigation }) => {
  const [activityFullData, setActivityFullData] = React.useState([]);
  const [activityData, setActivityData] = React.useState([]);
  const [acivityName, setActivityName] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
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
  const [unitData, setUnitsData] = React.useState([]);
  const [selectedUnitID, setSelectedUnitID] = React.useState(0);
  const [unitName, setUnitName] = React.useState(route.params.type === "edit" ? (route.params.data.selectedUnitID == route.params.data.unit2ID ? route.params.data.unit2Name : route.params.data.unit1Name) : "");
  const [errorUN, setUNError] = React.useState(false);
  const unitDDRef = useRef({});

  const [hsnError, setHSNError] = React.useState(false);
  const [hsn, setHSN] = React.useState(route.params.type === "edit" ? route.params.data.hsnsacCode : "");

  const [gstError, setGSTError] = React.useState(false);
  const [gst, setGST] = React.useState(route.params.type === "edit" ? route.params.data.gstRate.toString() : "");

  const [errorRUM, setErrorRUM] = React.useState(false);
  const [rum, setRUM] = React.useState(route.params.type === "edit" ? route.params.data.rateWithMaterials : "");
  const [rumht, setRUMHT] = React.useState("Materials + Labour cost");

  const [errorRUWM, setErrorRUWM] = React.useState(false);
  const [ruwm, setRUWM] = React.useState(route.params.type === "edit" ? route.params.data.rateWithoutMaterials : "");
  const [ruwmht, setRUWMHT] = React.useState("Only Labour cost");

  const [errorAUOS, setErrorAUOS] = React.useState(false);
  const [auos, setAUOS] = React.useState(route.params.type === "edit" ? route.params.data.alternateUnitOfSales : "");

  const [unitSelected, setUnitSelected] = React.useState(route.params.type === "edit" ? route.params.data.unit1Name : "");
  const [conversionUnitSelected, setConversionUnitSelected] = React.useState(route.params.type === "edit" ? route.params.data.unit2Name : "");

  const [errorSS, setErrorSS] = React.useState(false);
  const [shortSpec, setShortSpec] = React.useState(route.params.type === "edit" ? route.params.data.shortSpecification : "");

  const [errorS, setErrorS] = React.useState(false);
  const [spec, setSpec] = React.useState(route.params.type === "edit" ? route.params.data.specification : "");

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();
  const ref_input5 = useRef();
  const ref_input6 = useRef();

  const FetchServicesFromActivity = (selectedItem, activityData) => {
    let params = {
      ID:
        route.params.type === "edit"
          ? route.params.data.activityID
          : activityData.find((el) => {
              return el.activityRoleName === selectedItem;
            }).id,
    };
    Provider.getAll(`master/getservicesbyroleid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setServicesFullData(response.data.data);
            const services = response.data.data.map((data) => data.serviceName);
            setServicesData(services);
          }
        }
      })
      .catch((e) => {});
  };

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
            const activities = response.data.data.map((data) => data.activityRoleName);
            setActivityData(activities);
            setActivityName("Contractor");
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
            FetchServicesFromActivity("Contractor", response.data.data);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchCategoriesFromServices = (selectedItem) => {
    let params = {
      ActivityID:
        route.params.type === "edit"
          ? route.params.data.activityID
          : activityFullData.find((el) => {
              return el.activityRoleName === acivityName;
            }).id,
      ServiceID:
        route.params.type === "edit"
          ? route.params.data.serviceID
          : servicesFullData.find((el) => {
              return el.serviceName === selectedItem;
            }).id,
    };
    Provider.getAll(`master/getcategoriesbyserviceid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setCategoriesFullData(response.data.data);
            const categories = response.data.data.map((data) => data.categoryName);
            setCategoriesData(categories);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchProductsFromCategory = (selectedItem) => {
    let params = {
      ActivityID:
        route.params.type === "edit"
          ? route.params.data.activityID
          : activityFullData.find((el) => {
              return el.activityRoleName === acivityName;
            }).id,
      ServiceID:
        route.params.type === "edit"
          ? route.params.data.serviceID
          : servicesFullData.find((el) => {
              return el.serviceName === serviceName;
            }).id,
      CategoryID:
        route.params.type === "edit"
          ? route.params.data.categoryID
          : categoriesFullData.find((el) => {
              return el.categoryName === selectedItem;
            }).id,
    };
    Provider.getAll(`master/getproductsbycategoryid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setProductsFullData(response.data.data);
            const products = response.data.data.map((data) => data.productName);
            setProductsData(products);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchUnitsFromProductID = (selectedItem) => {
    let params = {
      ProductID:
        route.params.type === "edit"
          ? route.params.data.id
          : productsFullData.find((el) => {
              return el.productName === selectedItem;
            }).productID,
    };
    Provider.getAll(`master/getunitbyproductid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setUnitFullData(response.data.data);
            const units = response.data.data[0].displayUnit.split(" / ");
            setUnitsData(units);
          }
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    FetchActvityRoles();
    if (route.params.type === "edit") {
      FetchCategoriesFromServices();
      FetchProductsFromCategory();
      FetchUnitsFromProductID();
    }
  }, []);

  const onServiceNameSelected = (selectedItem) => {
    setServiceName(selectedItem);
    if (route.params.type === "edit") {
      route.params.data.serviceID = servicesFullData.find((el) => {
        return el.serviceName === selectedItem;
      }).id;
    }
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
    if (route.params.type === "edit") {
      route.params.data.categoryID = categoriesFullData.find((el) => {
        return el.categoryName === selectedItem;
      }).id;
    }
    productsDDRef.current.reset();
    setHSN(
      categoriesFullData.find((el) => {
        return el.categoryName === selectedItem;
      }).hsnsacCode
    );
    setGST(
      categoriesFullData
        .find((el) => {
          return el.categoryName === selectedItem;
        })
        .gstRate.toFixed(2)
    );
    setCNError(false);
    setHSNError(false);
    setGSTError(false);
    setUnitName("");
    setProductsName("");
    setUnitSelected("");
    setConversionUnitSelected("");
    setAUOS("");
    FetchProductsFromCategory(selectedItem);
  };

  const onProductsNameSelected = (selectedItem) => {
    setProductsName(selectedItem);
    unitDDRef.current.reset();
    if (route.params.type === "edit") {
      route.params.data.productID = productsFullData.find((el) => {
        return el.productName === selectedItem;
      }).productID;
    }
    setPNError(false);
    setUnitName("");
    setUnitSelected("");
    setConversionUnitSelected("");
    setAUOS("");
    FetchUnitsFromProductID(selectedItem);
  };

  const onUnitNameSelected = (selectedItem) => {
    setUnitName(selectedItem);
    setUNError(false);
    if (unitFullData[0].unit1Name === selectedItem) {
      setUnitSelected(unitFullData[0].unit1Name);
      setConversionUnitSelected(unitFullData[0].unit2Name);
      setSelectedUnitID(unitFullData[0].unit1ID);
    } else if (unitFullData[0].unit2Name === selectedItem) {
      setUnitSelected(unitFullData[0].unit2Name);
      setConversionUnitSelected(unitFullData[0].unit1Name);
      setSelectedUnitID(unitFullData[0].unit2ID);
    }
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
    Provider.create("master/updateproduct", {
      ProductID: productsFullData.find((el) => {
        return el.productName === productsName;
      }).productID,
      SelectedUnitID: selectedUnitID,
      RateWithMaterials: rum,
      RateWithoutMaterials: ruwm,
      AlternateUnitOfSales: auos,
      ShortSpecification: shortSpec,
      Specification: spec,
      ServiceDisplay: checked,
    })
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
          <Dropdown label="Unit Name" data={unitData} onSelected={onUnitNameSelected} isError={errorUN} selectedItem={unitName} reference={unitDDRef} />
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
