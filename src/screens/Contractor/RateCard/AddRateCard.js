import React, { useEffect, useRef, useState } from "react";
import Header from "../../../components/Header";
import { Styles } from "../../../styles/styles";
import { View, Text, HelperText, ScrollView } from "react-native";
import { TextInput, Checkbox, Card, Button, Portal, Dialog, Paragraph } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { communication } from "../../../utils/communication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Provider from "../../../api/Provider";
import { theme } from "../../../theme/apptheme";
import { NullOrEmpty } from "../../../utils/validations";
import { APIConverter } from "../../../utils/apiconverter";

let s_ID = 0,
  c_ID = 0,
  p_ID = 0,
  u_ID = 0;
let userID = 0, groupID = 0;
const AddRateCard = ({ route, navigation }) => {

  const [sno, setsno] = React.useState("");
  const [acivityName, setActivityName] = React.useState("Contractor");

  const [servicesFullData, setServicesFullData] = React.useState([]);
  const [servicesData, setServicesData] = React.useState([]);
  const [serviceName, setServiceName] = React.useState(route.params.type === "edit" ? route.params.data.serviceName : "");
  const [serviceID, setServicID] = React.useState(route.params.type === "edit" ? route.params.data.serviceID : 0);
  const [errorSN, setSNError] = React.useState(false);
  const servicesDDRef = useRef({});

  const [categoriesFullData, setCategoriesFullData] = React.useState([]);
  const [categoriesData, setCategoriesData] = React.useState([]);
  const [categoriesName, setCategoriesName] = React.useState(route.params.type === "edit" ? route.params.data.categoryName : "");
  const [categoryID, setCategoryID] = React.useState(route.params.type === "edit" ? route.params.data.categoryID : 0);
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
  const [unitName, setUnitName] = React.useState("");
  const [prevUnitName, setPrevUnitName] = React.useState("");

  const [errorUN, setUNError] = React.useState(false);
  const unitDDRef = useRef({});

  const [hsnError, setHSNError] = React.useState(false);
  const [hsn, setHSN] = React.useState(route.params.type === "edit" ? route.params.data.hsnsacCode : "");

  const [gstError, setGSTError] = React.useState(false);
  const [gst, setGST] = React.useState("");

  const [errorRUM, setErrorRUM] = React.useState(false);
  const [rum, setRUM] = React.useState(route.params.type === "edit" ? route.params.data.rateWithMaterials : "");
  const [rumht, setRUMHT] = React.useState("Materials + Labour cost");

  const [errorRUWM, setErrorRUWM] = React.useState(false);
  const [ruwm, setRUWM] = React.useState(route.params.type === "edit" ? route.params.data.rateWithoutMaterials : "");
  const [ruwmht, setRUWMHT] = React.useState("Only Labour cost");

  const [arum, setARUM] = React.useState(route.params.type === "edit" ? route.params.data.altRateWithMaterials : "");

  const [aruwm, setARUWM] = React.useState(route.params.type === "edit" ? route.params.data.altRateWithoutMaterials : "");

  const [errorAUOS, setErrorAUOS] = React.useState(false);
  const [auos, setAUOS] = React.useState("");

  const [unitSelected, setUnitSelected] = React.useState(route.params.type === "edit" ? route.params.data.unit1Name : "");
  const [conversionUnitSelected, setConversionUnitSelected] = React.useState(route.params.type === "edit" ? route.params.data.unit2Name : "");

  const [errorSS, setErrorSS] = React.useState(false);
  const [shortSpec, setShortSpec] = React.useState(route.params.type === "edit" ? route.params.data.shortSpecification : "");

  const [errorS, setErrorS] = React.useState(false);
  const [spec, setSpec] = React.useState(route.params.type === "edit" ? route.params.data.specification : "");

  const [display, setDisplay] = React.useState("Yes");
  const [arnID, setArnID] = useState(0);

  const [checked, setChecked] = React.useState(true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);
  const [isLoading, setIsLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);

  const [actualUnitName, setactualUnitName] = React.useState("");
  const [convertedUnitName, setconvertedUnitName] = React.useState("");

  const [actualUnitValue, setactualUnitValue] = React.useState("");
  const [convertedUnitValue, setconvertedUnitValue] = React.useState("");
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);



  useEffect(() => {
    GetUserID();
  }, []);

  const showDialog = () => setIsDialogVisible(true);
  const hideDialog = () => setIsDialogVisible(false);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      groupID = JSON.parse(userData).Sess_group_refno;
      if (route.params.type === "edit") {
        FetchData(route.params.data.contractorProductID);
      } else {
        FetchServiceName();
      }
    }
  };

  const FetchServiceName = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
      }
    };
    Provider.createDFContractor(Provider.API_URLS.getservicenameratecardform, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {

            response.data.data = APIConverter(response.data.data);
            setServicesFullData(response.data.data);

            const serviceName = response.data.data.map((data) => data.serviceName);
            setServicesData(serviceName);

            if (s_ID > 0) {
              let b = response.data.data.filter((el) => {
                return el.id === s_ID;
              });
              setServiceName(b[0].serviceName);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchCategory = (serviceNameID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        service_refno: serviceNameID
      }
    };
    Provider.createDFContractor(Provider.API_URLS.getcategorynameratecardform, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setCategoriesFullData(response.data.data);

            const category = response.data.data.map((data) => data.categoryName);
            setCategoriesData(category);

            if (c_ID > 0) {
              let b = response.data.data.filter((el) => {
                return el.id === c_ID;
              });

              setCategoriesName(b[0].categoryName);
              setCategoryID(b[0].id);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchHsnCode = (categoryID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        category_refno: categoryID
      }
    };
    Provider.createDFContractor(Provider.API_URLS.getcategorydataratecardform, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {

            response.data.data = APIConverter(response.data.data);
            setHSN(response.data.data[0].hsnsacCode);
            setGST(response.data.data[0].gstRate);
            setCNError(false);
            setHSNError(false);
            setGSTError(false);
          }
        }
      })
      .catch((e) => { });
  };

  const FetchProductsFromCategory = (categoryID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        category_refno: categoryID
      }
    };
    Provider.createDFContractor(Provider.API_URLS.getproductnameratecardform, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);

            setProductsFullData(response.data.data);
            const products = response.data.data.map((data) => data.productName);
            setProductsData(products);

            if (p_ID > 0) {
              let b = response.data.data.filter((el) => {
                return el.id === p_ID;
              });

              setProductsName(b[0].productName);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchUnitsFromProductID = (serviceProductNameID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        product_refno: serviceProductNameID
      }
    };
    Provider.createDFContractor(Provider.API_URLS.getunitofsaleratecardform, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {

            response.data.data = APIConverter(response.data.data);
            setUnitFullData(response.data.data);
            const units = response.data.data.map((data) => data.displayUnit);
            setUnitsData(units);
            if (u_ID != null) {
              let b = response.data.data.filter((el) => {
                return el.unitId === u_ID;
              });

              setUnitName(b[0].displayUnit);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const fetchServiceProductRate = (categoryID, productID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        category_refno: categoryID,
        product_refno: productID
      }
    };
    Provider.createDFContractor(Provider.API_URLS.getmaterialratedataratecardform, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {

            response.data.data = APIConverter(response.data.data, false, "ratecard");
            setRUM(response.data.data[0].rateWithMaterials);
            setRUWM(response.data.data[0].rateWithoutMaterials);
            setARUM(response.data.data[0].withMaterialAlternateRate.toString());
            setARUWM(response.data.data[0].withoutMaterialAlternateRate.toString());
            setShortSpec(response.data.data[0].shortSpecification);
            setSpec(response.data.data[0].specification);

            setactualUnitName(response.data.data[0].actualUnitName);
            setconvertedUnitName(response.data.data[0].convertUnitName);
            setactualUnitValue(response.data.data[0].actualUnitValue);
            setconvertedUnitValue(response.data.data[0].convertUnitValue);

          }
        }
      })
      .catch((e) => { });
  };

  const fetchUnitOfSaleNameChanges = (categoryID, productID, unitID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        category_refno: categoryID,
        product_refno: productID,
        unitcategoryrefno_unitrefno: unitID
      }
    };


    Provider.createDFContractor(Provider.API_URLS.getmaterialratedata_unitofsaleonchange_ratecardform, params)
      .then((response) => {
        setPrevUnitName(unitName);
        hideDialog();
        if (response.data && response.data.code === 200) {
          if (response.data.data) {

            response.data.data = APIConverter(response.data.data, false, "ratecard");
            setsno(response.data.data[0].sno);

            setRUM(response.data.data[0].rateWithMaterials);
            setRUWM(response.data.data[0].rateWithoutMaterials);

            setARUM(response.data.data[0].withMaterialAlternateRate);
            setARUWM(response.data.data[0].withoutMaterialAlternateRate);
            setactualUnitName(response.data.data[0].actualUnitName);
            setconvertedUnitName(response.data.data[0].convertUnitName);
            setactualUnitValue(response.data.data[0].actualUnitValue);
            setconvertedUnitValue(response.data.data[0].convertUnitValue);

          }
        }
      })
      .catch((e) => { });
  };

  const updateRate = () => {

    fetchUnitOfSaleNameChanges(categoriesFullData.find((el) => {
      return el.categoryName === categoriesName;
    }).id,
      productsFullData.find((el) => {
        return el.productName === productsName;
      }).id,
      unitFullData.filter((el) => {
        return el.displayUnit === unitName;
      })[0].unitId
    );
  }

  const FetchData = (RateCardID) => {
    let params = {
      RateCardID: RateCardID,
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: groupID,
        contractor_product_refno: RateCardID
      }
    };
    Provider.createDFContractor(Provider.API_URLS.contractorproductrefnocheck, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {

            response.data.data = APIConverter(response.data.data, true, "ratecard");

            s_ID = response.data.data[0].serviceID;
            FetchServiceName();
            c_ID = response.data.data[0].categoryID;
            FetchCategory(response.data.data[0].serviceID);
            FetchHsnCode(response.data.data[0].categoryID);
            p_ID = response.data.data[0].productID;
            FetchProductsFromCategory(response.data.data[0].categoryID);
            u_ID = response.data.data[0].unitId;
            FetchUnitsFromProductID(response.data.data[0].productID);

            setRUM(response.data.data[0].rateWithMaterials);
            setRUWM(response.data.data[0].rateWithoutMaterials);

            setARUM(response.data.data[0].with_material_rate_alternate_rate);
            setARUWM(response.data.data[0].without_material_rate_alternate_rate);

            //setsno(response.data.data[0].sno);

            setactualUnitName(response.data.data[0].actualUnitName);
            setconvertedUnitName(response.data.data[0].convertUnitName);
            setactualUnitValue(response.data.data[0].actualUnitValue);
            setconvertedUnitValue(response.data.data[0].convertUnitValue);

            setShortSpec(response.data.data[0].shortSpecification);
            //setSpec(response.data.data[0].specification);

            setChecked(response.data.data[0].display);

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
    }).id;
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
    FetchCategory(serviceID);
  };

  const onCategoriesNameSelected = (selectedItem) => {
    let categoryID = 0;
    setCategoriesName(selectedItem);
    categoryID = categoriesFullData.find((el) => {
      return el.categoryName === selectedItem;
    }).id;

    productsDDRef.current.reset();

    setUnitName("");
    setProductsName("");
    setUnitSelected("");
    setConversionUnitSelected("");
    setAUOS("");
    FetchHsnCode(categoryID);
    FetchProductsFromCategory(categoryID);
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

    FetchUnitsFromProductID(p.id);
    fetchServiceProductRate(categoriesFullData.find((el) => {
      return el.categoryName === categoriesName;
    }).id, p.id);
  };

  const onUnitNameSelected = (selectedItem) => {
    setUnitName(selectedItem);
    setUNError(false);
    showDialog();
  };



  const ChanegRateUnit = (rate, actualUnitValue, convertUnitValue, type) => {
    let params = null;
    let url = Provider.API_URLS.getmaterialratedata_withmaterialrateblur_ratecardform;
    params = {
      data: {
        Sess_UserRefno: userID,
        sno: sno,
        with_material_rate: rate,
        actual_unit_value: actualUnitValue,
        convert_unit_value: convertUnitValue
      }
    };

    if (type == "without_material") {
      url = Provider.API_URLS.getmaterialratedata_withoutmaterialrateblur_ratecardform;
      params = {
        data: {
          Sess_UserRefno: userID,
          sno: sno,
          without_material_rate: rate,
          actual_unit_value: actualUnitValue,
          convert_unit_value: convertUnitValue
        }
      };
    }

    Provider.createDFContractor(url, params)
      .then((response: any) => {

        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data, false, "ratecard");

            if (type == "with_material") {
              setARUM(response.data.data[0].withMaterialAlternateRate);
            }
            else if (type == "without_material") {
              setARUWM(response.data.data[0].withoutMaterialAlternateRate);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const onRUMChanged = (text) => {
    setRUM(text);
    setRUMHT("Materials + Labour cost");
    setErrorRUM(false);

    ChanegRateUnit(text, actualUnitValue, convertedUnitValue, "with_material");

  };

  const onRUWMChanged = (text) => {
    setRUWM(text);
    setRUWMHT("Only Labour cost");
    setErrorRUWM(false);

    ChanegRateUnit(rum, actualUnitValue, convertedUnitValue, "without_material");

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
      } else {
        InsertData();
      }
    }
  };

  const InsertData = () => {
    let x = unitFullData.filter((el) => {
      return el.unitName === unitName;
    });

    const params = {

      data: {
        Sess_UserRefno: userID,
        service_refno: servicesFullData.find((el) => {
          return el.serviceName === serviceName;
        }).id,

        category_refno: categoriesFullData.find((el) => {
          return el.categoryName === categoriesName;
        }).id,
        product_refno: productsFullData.find((el) => {
          return el.productName === productsName;
        }).id,
        unitcategoryrefno_unitrefno: unitFullData.filter((el) => {
          return el.displayUnit === unitName;
        })[0].unitId,
        unit_conversion_value: actualUnitValue,
        with_material_rate: rum,
        with_material_alternate_rate: arum,
        without_material_rate: ruwm,
        without_material_alternate_rate: aruwm,
        short_desc: shortSpec,
        specification: spec,
        view_status: checked ? "1" : "0",
      }

    };
    Provider.createDFContractor(Provider.API_URLS.ratecardcreate, params)
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
      data: {
        Sess_UserRefno: userID,
        contractor_product_refno: route.params.data.contractorProductID,
        service_refno: servicesFullData.find((el) => {
          return el.serviceName === serviceName;
        }).id,
        category_refno: categoriesFullData.find((el) => {
          return el.categoryName === categoriesName;
        }).id,
        product_refno: productsFullData.find((el) => {
          return el.productName === productsName;
        }).id,
        unitcategoryrefno_unitrefno: unitFullData.filter((el) => {
          return el.displayUnit === unitName;
        })[0].unitId,
        unit_conversion_value: actualUnitValue,
        with_material_rate: rum,
        with_material_alternate_rate: arum,
        without_material_rate: ruwm,
        without_material_alternate_rate: aruwm,
        short_desc: shortSpec,
        specification: spec,
        view_status: checked ? "1" : "0"
      }
    };
    Provider.createDFContractor(Provider.API_URLS.ratecardupdate, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("update");
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

  const design = (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
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
              <TextInput value={arum} error={errorRUWM} style={[Styles.width48per, Styles.backgroundColorWhite]} disabled label="Alternate Rate / Unit" />
            </View>
          </View>
          <View style={[Styles.marginTop16, { backgroundColor: "#f2f2f2" }, Styles.bordergray, Styles.borderRadius4]}>
            <Text style={[Styles.fontSize16, Styles.padding4, Styles.textCenter]}>Without Material</Text>
            <View style={[Styles.flexRow, Styles.flexAlignCenter, Styles.flexSpaceBetween, Styles.marginTop16]}>
              <TextInput value={ruwm} onEndEditing={onRUWMChanged} keyboardType="decimal-pad" style={[Styles.width48per, Styles.backgroundColorWhite]} label="Rate / Unit" />
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
      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Confirmation</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Confirm to change Unit of Sales? If OK, then automatically changed all values. Please after changed check the all values</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={updateRate}>Ok</Button>
            <Button onPress={() => {
              hideDialog();

              setUnitName("asdfads");
              setPrevUnitName("");

            }}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
  return design;
};
export default AddRateCard;
