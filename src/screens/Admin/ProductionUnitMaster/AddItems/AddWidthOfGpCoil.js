import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Text, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { APIConverter } from "../../../../utils/apiconverter";
import { communication } from "../../../../utils/communication";

const AddWidthOfGpCoil = ({ route, navigation }) => {
  //#region Variables
  const [widthOfGpCoilError, setWidthOfGpCoilError] = React.useState(false);
  const [widthOfGpCoil, setWidthOfGpCoil] = React.useState("");

  const [descriptionError, setDescriptionError] = React.useState(false);
  const [description, setDescription] = React.useState("");

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

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
              FetchAlternativeUnitOfSalesFromUnit(route.params.data.unitId);
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
            }).id
          : productsFullData.find((el) => {
              return el.productName === selectedItem;
            }).id,
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

  const FetchAlternativeUnitOfSalesFromUnit = (unitID) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        unitcategoryrefno_unitrefno: unitID,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.AlternativeUnitOfSalesServiceProduct, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setUnitSelected(response.data.data[0].actual_unitname.split(" ")[1].split("=")[0]);
            setConversionUnitSelected(response.data.data[0].convert_unitname);
            setAUOS(response.data.data[0].actual_unit_value);
          }
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    FetchActvityRoles();
  }, []);


  const onProductsNameSelected = (selectedItem) => {
    setProductsName(selectedItem);
    unitDDRef.current.reset();
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
    const selectedUnitID = unitFullData.find((el) => {
      return el.displayUnit === selectedItem;
    }).unitId;
    setSelectedUnitID(selectedUnitID);
    FetchAlternativeUnitOfSalesFromUnit(selectedUnitID);
  };

  const onWidthChanged = (text) => {
    setWidthOfGpCoil(text);
    setWidthOfGpCoilError(false);
  };

  const onDescriptionChanged = (text) => {
    setDescription(text);
    setDescriptionError(false);
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
        }).id,
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
        setIsButtonLoading(false);
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
        setIsButtonLoading(false);
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
      setIsButtonLoading(true);
      UpdateData();
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
        <TextInput mode="flat" label="Width Of Gp Coil" value={widthOfGpCoil} onChangeText={onWidthChanged} error={widthOfGpCoilError} editable={false} dense style={[Styles.marginTop12, Styles.backgroundSecondaryColor]} />
          <HelperText type="error" visible={widthOfGpCoilError}>
            {communication.InvalidUnitWidth}
          </HelperText>
          <TextInput mode="flat" label="Description" value={description} onChangeText={onDescriptionChanged} error={descriptionError} editable={false} dense style={[Styles.marginTop12, Styles.backgroundSecondaryColor]} />
          <HelperText type="error" visible={descriptionError}>
            {communication.InvalidUnitDescription}
          </HelperText>
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
          <Button mode="contained" loading={isButtonLoading} disabled={isButtonLoading} onPress={ValidateData}>
           Submit
          </Button>
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddWidthOfGpCoil;

