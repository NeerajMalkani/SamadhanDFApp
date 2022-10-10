import React, { useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { Styles } from "../../../styles/styles";
import { View, Text, HelperText, ScrollView } from "react-native";
import { TextInput, Checkbox, Card, Button } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { communication } from "../../../utils/communication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Provider from "../../../api/Provider";
import { theme } from "../../../theme/apptheme";

let s_ID = 0, c_ID = 0, p_ID = 0, u_ID = 0;
let userID = 0;
const AddRateCard = ({ route, navigation }) => {
  // const [statesData, setStatesData] = React.useState([]);

  // const [stateName, setStateName] = React.useState("");
  // const [errorSN, setSNError] = React.useState(false);
  // const [cityName, setCityName] = React.useState("");

  // const [cityData, setCityData] = React.useState([]);
  // const [cityID, setCityID] = React.useState([]);
  // const [errorCN, setCNError] = React.useState(false);
  // const cityRef = useRef({});

  // const [employeeName, setEmployeeName] = useState("");
  // const [employeeNameInvalid, setEemployeeNameInvalid] = useState("");
  // const employeeNameRef = useRef({});
 //#region Variables
  const [serviceName, setServiceName] = useState("--Select--");
  const [serviceNameID, setServiceNameID] = useState < number > (0);
  const [serviceNameError, setServiceNameError] = useState("");
  const [selectedServiceName, setSelectedServiceName] = useState("");
  const [isServiceNameError, isSetServiceNameError] = useState(false);
  const [serviceNameErrorText, setServiceNameErrorText] = useState("");
  const [serviceNameFullData, setServiceNameFullData] = useState([]);

  const [category, setCategory] = useState("--Select--");
  const [categoryID, setCategoryID] = useState < number > (0);
  const [categoryError, setCategoryError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoryError, isSetCategoryError] = useState(false);
  const [categoryErrorText, setCategoryErrorText] = useState("");
  const [categoryFullData, setCategoryFullData] = useState([]);

  const [hsn, setHSN] = React.useState("");
  const [hsnErrorText, setHSNErrorText] = useState("");
  const [isHsnError, isSetHSNError] = useState(false);

  const [gstRate, setGstRate] = React.useState("");
  const [gstRateErrorText, setGstRateErrorText] = useState("");
  const [isGstRateError, isSetGstRateError] = useState(false);

  const [serviceProductName, setServiceProductName] = useState("--Select--");
  const [serviceProductNameID, setServiceProductNameID] = useState < number > (0);
  const [serviceProductNameError, setServiceProductNameError] = useState("");
  const [selectedServiceProductName, setSelectedServiceProductName] = useState("");
  const [isServiceProductNameError, isSetServiceProductNameError] = useState(false);
  const [serviceProductNameErrorText, setServiceProductNameErrorText] = useState("");
  const [serviceProductNameFullData, setServiceProductNameFullData] = useState([]);

  const [unitOfSales, setUnitOfSales] = useState("--Select--");
  const [unitOfSalesID, setUnitOfSalesID] = useState < number > (0);
  const [unitOfSalesError, setUnitOfSalesError] = useState("");
  const [selectedUnitOfSales, setSelectedUnitOfSales] = useState("");
  const [isUnitOfSalesError, isSetUnitOfSalesError] = useState(false);
  const [unitOfSalesErrorText, setUnitOfSalesErrorText] = useState("");
  const [unitOfSalesFullData, setUnitOfSalesFullData] = useState([]);

  const [materialRate, setMaterialRate] = React.useState("");
  const [materialRateErrorText, setMaterialRateErrorText] = useState("");
  const [isMaterialRateError, isSetMaterialRateError] = useState(false);

  const [alternativeRate, setAlternativeRate] = React.useState("");
  const [alternativeRateErrorText, setAlternativeRateErrorText] = useState("");
  const [isAlternativeRateError, isSetAlternativeRateError] = useState(false);

  const [withoutMaterialRate, setWithoutMaterialRate] = React.useState("");
  const [withoutMaterialRateErrorText, setWithoutMaterialRateErrorText] = useState("");
  const [isWithoutMaterialRateError, isSetWithoutMaterialRateError] = useState(false);

  const [alternativeUnit, setAlternativeUnit] = React.useState("");
  const [alternativeUnitErrorText, setAlternativeUnitErrorText] = useState("");
  const [isAlternativeUnitError, isSetAlternativeUnitError] = useState(false);

  const [shortSpecification, setShortSpecification] = React.useState("");
  const [shortSpecificationErrorText, setShortSpecificationErrorText] = useState("");
  const [isShortSpecificationError, isSetShortSpecificationError] = useState(false);

  const [specificationSP, setSpecificationSP] = React.useState("");
  const [specificationSPErrorText, setSpecificationSPErrorText] = useState("");
  const [isSpecificationSPError, isSetSpecificationSPError] = useState(false);

  const [display, setDisplay] = React.useState("Yes");
  const [arnID, setArnID] = useState(0);

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

 //#endregion 

 //#region Functions

  useEffect(() => {
    GetUserID();
  }, []);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      if (route.params.type === "edit") {
        FetchData("edit", route.params.data.rateCardID);
      }
      else {
        FetchServiceName();
      }
    }
  };

  const FetchServiceName = () => {
    let params = {
      ContractorID: userID,
    };
    Provider.getAll(`master/getcontractoractiveservices?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setServicesFullData(response.data.data);

            const serviceName = response.data.data.map((data) => data.serviceName);
            setServicesData(serviceName);

            if (s_ID > 0) {
              let b = response.data.data.filter((el) => {
                return el.id === s_ID;
              });

              setServiceName(b[0].locationName);
              setServiceNameID(b[0].id);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchCategory = (arnID, serviceNameID, callbackFunction = null) => {

    let params = {
      ActivityID: arnID,
      ServiceID: serviceNameID,
    };
    Provider.getAll(`master/getcategoriesbyserviceid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {

            setCategoriesFullData(response.data.data);

            const category = response.data.data.map((data) => data.categoryName);
            setCategoriesData(category);
            if (callbackFunction !== null) {
              callbackFunction(response.data.data);
            }
            // if (c_ID > 0) {
            //   let b = response.data.data.filter((el) => {
            //     return el.id === c_ID;
            //   });

            //   setCategory(b[0].locationName);
            //   setCategoryID(b[0].id);
            // }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchProductsFromCategory = (selectedItem) => {
    let params = {
      ActivityID: 4,
      ServiceID:
        route.params.type === "edit"
          ? route.params.data.serviceID
          : servicesFullData.find((el) => {
            return el.serviceName === serviceName;
          }).serviceID,
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

            setProductsFullData(response.data.data);
            const products = response.data.data.map((data) => data.productName);
            setProductsData(products);
          }
        }
      })
      .catch((e) => { });
  };

  const FetchUnitsFromProductID = (selectedItem, selectedUnitID) => {
    let params = {
      ProductID:
        route.params.type === "edit"
          ? route.params.data.id
          : productsFullData.find((el) => {
            return el.productName === selectedItem;
          }).productID,
    };
    Provider.getAll(`master/getproductunitbyid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setUnitFullData(response.data.data);
            const units = response.data.data.map((data) => data.unitName);
            setUnitsData(units);

            let product = productsFullData.filter((el: any) => {
              return el.productName === selectedItem;
            });
            if (selectedUnitID == response.data.data[0].unitID) {
              setUnitName(response.data.data[0].unitName);
              setSelectedUnitID(response.data.data[0].unitID);

              setRUM(product[0].rateWithMaterials.toString());
              setRUWM(product[0].rateWithoutMaterials.toString());

              setARUM((parseFloat(product[0].rateWithMaterials) * response.data.data[1].conversionRate).toFixed(2).toString());
              setARUWM((parseFloat(product[0].rateWithoutMaterials) * response.data.data[1].conversionRate).toFixed(2).toString());
            }
            else if (selectedUnitID == response.data.data[1].unitID) {
              setUnitName(response.data.data[1].unitName);
              setSelectedUnitID(response.data.data[1].unitID);

              setRUM((parseFloat(product[0].rateWithMaterials) * response.data.data[1].conversionRate).toFixed(2).toString());
              setRUWM((parseFloat(product[0].rateWithoutMaterials) * response.data.data[1].conversionRate).toFixed(2).toString());

              setARUM(((parseFloat(product[0].rateWithMaterials) * response.data.data[1].conversionRate) * response.data.data[0].conversionRate).toFixed(2).toString());
              setARUWM(((parseFloat(product[0].rateWithoutMaterials) * response.data.data[1].conversionRate) * response.data.data[0].conversionRate).toFixed(2).toString());
            }

          }
        }
      })
      .catch((e) => { });
  };

  const FetchData = (from, RateCardID) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    let params = {
      RateCardID: RateCardID,
    };
    Provider.getAll(`master/getcontractorratecardbyid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            FetchServiceName();
            FetchCategory(4, response.data.data[0].serviceID, (categoryList: any) => {
              let ca: CategoryModel | undefined = categoryList.find((el: any) => el.categoryName === route.params.data.categoryName);
              if (ca !== undefined) {

                setHSN(ca.hsnsacCode);
                setGST(ca.gstRate.toString());
              }

              FetchProductsFromCategory(categoriesName);
            });

            FetchUnitsFromProductID(route.params.data.productName, route.params.data.selectedUnitID);

          }
        } else {
          listData[1]([]);
          setSnackbarText("No data found");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
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

  const onServiceNameSelected = (selectedItem) => {
    let serviceID = 0;
    setServiceName(selectedItem);
    serviceID = servicesFullData.find((el) => {
      return el.serviceName === selectedItem;
    }).serviceID;
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
    FetchCategory(4, serviceID);
  };

  const onCategoriesNameSelected = (selectedItem) => {
    let categoryID = 0;
    setCategoriesName(selectedItem);
    categoryID = categoriesFullData.find((el) => {
      return el.categoryName === selectedItem;
    }).id;

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
    let productID = 0;
    unitDDRef.current.reset();
    let p = productsFullData.find((el) => {
      return el.productName === selectedItem;
    });

    setPNError(false);
    setUnitName("");
    setUnitSelected("");
    setConversionUnitSelected("");
    setAUOS("");

    setShortSpec(p.shortSpecification);
    setSpec(p.specification);

    FetchUnitsFromProductID(selectedItem, p.selectedUnitID);
  };

  const onUnitNameSelected = (selectedItem) => {
    setUnitName(selectedItem);
    setUNError(false);

    let unit = unitFullData.filter((el: any) => {
      return el.unitName === selectedItem;
    });
    let product = productsFullData.filter((el: any) => {
      return el.productName === productsName;
    });

    if (unit[0].unitID == unitFullData[0].unitID) {

      setRUM(product[0].rateWithMaterials.toString());
      setRUWM(product[0].rateWithoutMaterials.toString());

      setARUM((parseFloat(product[0].rateWithMaterials) * unitFullData[1].conversionRate).toFixed(2).toString());
      setARUWM((parseFloat(product[0].rateWithoutMaterials) * unitFullData[1].conversionRate).toFixed(2).toString());
    }
    else if (unit[0].unitID == unitFullData[1].unitID) {

      setRUM((parseFloat(product[0].rateWithMaterials) * unitFullData[1].conversionRate).toFixed(2).toString());
      setRUWM((parseFloat(product[0].rateWithoutMaterials) * unitFullData[1].conversionRate).toFixed(2).toString());

      setARUM(((parseFloat(product[0].rateWithMaterials) * unitFullData[1].conversionRate) * unitFullData[0].conversionRate).toFixed(2).toString());
      setARUWM(((parseFloat(product[0].rateWithoutMaterials) * unitFullData[1].conversionRate) * unitFullData[0].conversionRate).toFixed(2).toString());
    }

  };

  const ChanegRateUnit = (rum, ruwm) => {
    let unit = unitFullData.filter((el: any) => {
      return el.unitName === unitName;
    });

    let ratewithmaterial = rum, ratewithoutmaterial = ruwm;

    if (unit[0].unitID == unitFullData[0].unitID) {

      setRUM(ratewithmaterial.toString());
      setRUWM(ratewithoutmaterial.toString());

      setARUM((parseFloat(ratewithmaterial) * unitFullData[1].conversionRate).toFixed(2).toString());
      setARUWM((parseFloat(ratewithoutmaterial) * unitFullData[1].conversionRate).toFixed(2).toString());
    }
    else if (unit[0].unitID == unitFullData[1].unitID) {

      setRUM((parseFloat(ratewithmaterial) * unitFullData[1].conversionRate).toFixed(2).toString());
      setRUWM((parseFloat(ratewithoutmaterial) * unitFullData[1].conversionRate).toFixed(2).toString());

      setARUM(((parseFloat(ratewithmaterial) * unitFullData[1].conversionRate) * unitFullData[0].conversionRate).toFixed(2).toString());
      setARUWM(((parseFloat(ratewithoutmaterial) * unitFullData[1].conversionRate) * unitFullData[0].conversionRate).toFixed(2).toString());
    }


  }

  const onRUMChanged = (text) => {

    setRUM(text);
    setRUMHT("Materials + Labour cost");
    setErrorRUM(false);
    // if (text > 0) {
    //   ChanegRateUnit(text, ruwm);
    // }
  };

  const onRUWMChanged = (text) => {
    setRUWM(text);
    setRUWMHT("Only Labour cost");
    setErrorRUWM(false);
    // if (text > 0) {
    //   ChanegRateUnit(rum, text);
    // }
  };

  const ValidateData = () => {
    let isValid = true;

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
      if (route.params.type === "edit") {
        UpdateData();
      }
      else {
        InsertData();
      }

    }
  };

  const InsertData = () => {
    let x = unitFullData.filter((el: any) => {
      return el.unitName === unitName;
    });

    const params = {
      RateCardID: 0,
      ProductID: productsFullData.find((el) => {
        return el.productName === productsName;
      }).productID,
      ActivityID: 4,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).serviceID,
      CategoryID: categoriesFullData.find((el) => {
        return el.categoryName === categoriesName;
      }).id,
      SelectedUnitID: unitFullData.filter((el: any) => {
        return el.unitName === unitName;
      })[0].unitID,
      UnitOfSalesID: 0,
      RateWithMaterials: rum,
      RateWithoutMaterials: ruwm,
      AltRateWithMaterials: arum,
      AltRateWithoutMaterials: aruwm,
      AlternateUnitOfSales: 0,
      ShortSpecification: shortSpec,
      Specification: spec,
      Display: display === "Yes" ? true : false,
      ContractorID: userID
    };
    Provider.create("master/insertupdatecontractorratecard", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("add");
          navigation.goBack();
        } else if (response.data.code === 304) {
          setSnackbarText(communication.ExistsError);
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

  const UpdateData = () => {

    const params = {
      RateCardID: route.params.data.rateCardID,
      ProductID: productsFullData.find((el) => {
        return el.productName === productsName;
      }).productID,
      ActivityID: 4,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).serviceID,
      CategoryID: categoriesFullData.find((el) => {
        return el.categoryName === categoriesName;
      }).id,
      SelectedUnitID: unitFullData.filter((el: any) => {
        return el.unitName === unitName;
      })[0].unitID,
      UnitOfSalesID: 0,
      RateWithMaterials: rum,
      RateWithoutMaterials: ruwm,
      AltRateWithMaterials: arum,
      AltRateWithoutMaterials: aruwm,
      AlternateUnitOfSales: 0,
      ShortSpecification: shortSpec,
      Specification: spec,
      Display: display === "Yes" ? true : false,
      ContractorID: userID
    };
    Provider.create("master/insertupdatecontractorratecard", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("add");
          navigation.goBack();
        } else if (response.data.code === 304) {
          setSnackbarText(communication.ExistsError);
          setSnackbarVisible(true);
        } else {
          setSnackbarText(communication.UpdateError);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };



  const onEmployeeNameChanged = (text) => {
    setEmployeeName(text);
    setEemployeeNameInvalid(false);
  };
  const [text, onChangeText] = React.useState("Useless Text");
  const [number, onChangeNumber] = React.useState(null);

  //#endregion  
  
  const design = (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled" >
        <View style={[Styles.padding16, Styles.backgroundColorWhite]}>
          <Dropdown label="Service Name" data={servicesData} onSelected={onServiceNameSelected} isError={errorSN} selectedItem={serviceName} reference={servicesDDRef} />

          <Dropdown label="Category Name" data={categoriesData} onSelected={onCategoriesNameSelected} isError={errorCN} selectedItem={categoriesName} reference={categoriesDDRef} />

          <View style={[Styles.flexRow, Styles.flexAlignCenter, Styles.flexSpaceBetween, Styles.marginTop16]}>
            <TextInput value={hsn} style={[Styles.width48per]} label="HSN / SAC Code" disabled />
            <TextInput value={gst} style={[Styles.width48per]} label="GST Rate (%)" disabled />
          </View>

          <Dropdown label="Service Product Name" data={productsData} onSelected={onProductsNameSelected} isError={errorPN} selectedItem={productsName} reference={productsDDRef} />

          <Dropdown label="Unit Name" data={unitsData} onSelected={onUnitNameSelected} isError={errorUN} selectedItem={unitName} reference={unitDDRef} />

          <View style={[Styles.marginTop16, { backgroundColor: "#f2f2f2" }, Styles.bordergray, Styles.borderRadius4]}>
            <Text style={[Styles.fontSize16, Styles.padding4, Styles.textCenter]}>With Material</Text>
            <View style={[Styles.flexRow, Styles.flexAlignCenter, Styles.flexSpaceBetween, Styles.marginTop16]}>
              <TextInput value={rum} keyboardType="decimal-pad" onEndEditing={onRUMChanged} error={errorRUM} style={[Styles.width48per, Styles.backgroundColorWhite]} label="Rate / Unit" />
              {/* <HelperText type={errorRUM ? "error" : "info"} visible={true}>
                {rumht}
              </HelperText> */}
              <TextInput value={arum} error={errorRUWM} style={[Styles.width48per, Styles.backgroundColorWhite]} disabled label="Alternate Rate / Unit" />
            </View>
          </View>
          <View style={[Styles.marginTop16, { backgroundColor: "#f2f2f2" }, Styles.bordergray, Styles.borderRadius4]}>
            <Text style={[Styles.fontSize16, Styles.padding4, Styles.textCenter]}>Without Material</Text>
            <View style={[Styles.flexRow, Styles.flexAlignCenter, Styles.flexSpaceBetween, Styles.marginTop16]}>
              <TextInput value={ruwm} onEndEditing={onRUWMChanged} keyboardType="decimal-pad" style={[Styles.width48per, Styles.backgroundColorWhite]} label="Rate / Unit" />
              {/* <HelperText type={errorRUWM ? "error" : "info"} visible={true}>
                {ruwmht}
              </HelperText> */}
              <TextInput value={aruwm} style={[Styles.width48per, Styles.backgroundColorWhite]} disabled label="Alternate Rate / Unit" />
            </View>
          </View>
          <TextInput multiline value={shortSpec} label="Short Specification" style={[Styles.backgroundColorWhite, Styles.marginTop16]} />
          <TextInput multiline value={spec} label="Specification of Service Provider" style={[Styles.backgroundColorWhite, Styles.marginTop16]} />

          <Checkbox.Item
            label="Display"

            position="leading"
            labelStyle={{ textAlign: "left", paddingLeft: 8 }}
            status={checked ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(!checked);
            }}

          />

        </View>

      </ScrollView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content>
          <Button mode="contained" onPress={ValidateData}>
            Submit
          </Button>
        </Card.Content>
      </View>
    </View>
  );
  return design;
}
export default AddRateCard;