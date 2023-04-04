import React, { useEffect, useRef } from "react";
import { ScrollView, View, Dimensions, TouchableOpacity, Image } from "react-native";
import { Card, Checkbox, DataTable, Headline, HelperText, IconButton, Snackbar, Subheading, Text, TextInput, Title, Button } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { APIConverter } from "../../../../utils/apiconverter";
import { communication } from "../../../../utils/communication";
import AddMaterialSetupProducts from "./AddMaterialSetupProducts";
import DFButton from "../../../../components/Button";
import { AWSImagePath } from "../../../../utils/paths";

const AddMaterialSetupScreen = ({ route, navigation }) => {
  //#region Variables
  const arrProductData = React.useState(route.params.type === "edit" ? route.params.data.productList === null ? [] : route.params.data.productList : []);

  const [activityID, setActivityID] = React.useState("");

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

  const [designTypeFullData, setDesignTypeFullData] = React.useState([]);
  const [designTypeData, setDesignTypeData] = React.useState([]);
  const [designType, setDesignType] = React.useState(route.params.type === "edit" ? route.params.data.designTypeName : "");
  const [errorDT, setDTError] = React.useState(false);
  const designTypeDDRef = useRef({});

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const [lengthFeet, setLengthFeet] = React.useState(route.params.type === "edit" ? parseInt(route.params.data.lengthfoot).toString() : "1");
  const [lengthInches, setLengthInches] = React.useState(route.params.type === "edit" ? parseInt(route.params.data.lengthinches).toString() : "0");

  const [widthFeet, setWidthFeet] = React.useState(route.params.type === "edit" ? parseInt(route.params.data.widthheightfoot).toString() : "1");
  const [widthInches, setWidthInches] = React.useState(route.params.type === "edit" ? parseInt(route.params.data.widthheightinches).toString() : "0");

  const [totalSqFt, setTotalSqft] = React.useState(route.params.type === "edit" ? route.params.data.totalfoot : "1.0000");

  const [errorPL, setPLError] = React.useState(false);

  const [brandsFullData, setBrandsFullData] = React.useState([]);
  const [uniqueBrandsData, setUniqueBrandsData] = React.useState([]);
  const [brandsData, setBrandsData] = React.useState([]);
  const [brandName, setBrandName] = React.useState([]);

  const [errorBN, setBNError] = React.useState(false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [specification, setSpecification] = React.useState("");
  const [designImage, setDesignImage] = React.useState(AWSImagePath + "placeholder-image.png");

  let amountEdit = 0;
  if (route.params.type === "edit" && route.params.data.productList !== null) {
    const amountEditTemp = route.params.data.productList.map((data) => data.amount);
    amountEdit = amountEditTemp.reduce((a, b) => parseFloat(a ? a : 0) + parseFloat(b ? b : 0), 0).toFixed(4);
  }
  const [total, setTotal] = React.useState(amountEdit);

  const windowHeight = Dimensions.get("window").height;
  const refRBSheet = useRef();
  //#endregion

  //#region Functions
  const FetchActvityRoles = () => {
    Provider.createDFAdmin(Provider.API_URLS.ActivityRolesMaterialSetup)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            if (route.params.type !== "edit") {
              servicesDDRef.current.reset();
              setServiceName("");
              setProductsName("");
              setCategoriesName("");
              setDesignType("");
              setCategoriesData([]);
              setServicesData([]);
              setProductsData([]);
              setDesignTypeData([]);
              setSNError(false);
              setCNError(false);
              setPNError(false);
              setDTError(false);
              setPLError(false);
              setBNError(false);
            }
            setActivityID(response.data.data[0].id);
            FetchServicesFromActivity(response.data.data[0].id);
          }
        }
      })
      .catch((e) => { });
  };

  const FetchServicesFromActivity = (actID) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        group_refno: actID,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.ServiceNameMaterialSetup, params)
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
      .catch((e) => { });
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
    Provider.createDFAdmin(Provider.API_URLS.CategoryNameMaterialSetup, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setCategoriesFullData(response.data.data);
            if (route.params.type === "edit") {
              FetchProductsFromCategory(route.params.data.categoryName, response.data.data, actID);
            }
            const categories = response.data.data.map((data) => data.categoryName);
            setCategoriesData(categories);
          }
        }
      })
      .catch((e) => { });
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
    Provider.createDFAdmin(Provider.API_URLS.ProductNameMaterialSetup, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setProductsFullData(response.data.data);
            if (route.params.type === "edit") {
              FetchDesignTypeFromProduct(route.params.data.productName, response.data.data);
            }
            const products = response.data.data.map((data) => data.productName);
            setProductsData(products);
          }
        }
      })
      .catch((e) => { });
  };

  const FetchDesignTypeFromProduct = (selectedItem, productDataParams) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        product_refno: productDataParams
          ? productDataParams.find((el) => {
            return el.productName === selectedItem;
          }).id
          : productsFullData.find((el) => {
            return el.productName === selectedItem;
          }).id,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.ProductDesignTypeMaterialSetup, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setDesignTypeFullData(response.data.data);
            const designTypes = response.data.data.map((data) => data.designTypeName);
            setDesignTypeData(designTypes);
            if (route.params.type === "edit") {
              let id = response.data.data.find((el) => {
                return el.designTypeName === route.params.data.designTypeName;
              }).id;

              FetchDesignImage(id);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchBrandsFromProductIds = () => {
    const productids = arrProductData[0].map((data) => data.id);
    let params = {
      data: {
        Sess_UserRefno: "2",
        product_refno_Array: productids.join(","),
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.BrandNamelistPopupMaterialSetup, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setBrandsFullData(response.data.data);
            setUniqueBrandsData(response.data.data);
            const formattedData = response.data.data.map((data) => data.brandName + " (" + data.categoryName + ")");
            setBrandsData(formattedData);
          }
        }
      })
      .catch((e) => { });
  };

  const GetProductRateFromMaterialSetup = (index) => {
    const productids = arrProductData[0].map((data) => data.id);
    let params = {
      data: {
        Sess_UserRefno: "2",
        dealer_brand_refno: uniqueBrandsData[parseInt(index)].brandID,
        product_refno_Array: productids.join(","),
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.ProductRateBrandRefNoMaterialSetup, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            const appliedProducts = response.data.data;
            const newData = [...arrProductData[0]];
            newData.map((k) => {
              const foundProduct = appliedProducts.find((el) => el.id == k.id);
              if (foundProduct) {
                k.brandID = foundProduct.brandID;
                k.brandName = foundProduct.brandName;
                k.price = parseFloat(foundProduct.price).toFixed(4);
                if (k.formula) {
                  const quants = parseFloat(totalSqFt.toString()) / parseFloat(k.formula);
                  k.quantity = quants.toFixed(4);
                  if (k.price) {
                    k.amount = (parseFloat(k.quantity) * parseFloat(k.price)).toFixed(4);
                  } else {
                    k.amount = "0.0000";
                  }
                } else {
                  k.quantity = "";
                  k.amount = "0.0000";
                }
              }
            });
            const amounts = appliedProducts.map((data) => data.amount);
            setTotal(amounts.reduce((a, b) => (a ? a : 0 + parseFloat(b ? b : 0)), 0).toFixed(4));
            arrProductData[1](newData);
          }
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const FetchDesignImage = (designID) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        Sess_group_refno: "2",
        designtype_refno: designID,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.getdesigntypeimagematerialcalculatorform, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setSpecification(response.data.data[0].designtype_specification);
            setDesignImage(response.data.data[0].designImage);
          }
        }
      })
      .catch((e) => { });
  };

  useEffect(() => {
    FetchActvityRoles();
    if (route.params.type === "edit" && arrProductData[0].length > 0) {
      FetchBrandsFromProductIds();
    }
  }, []);

  const onServiceNameSelected = (selectedItem) => {
    setServiceName(selectedItem);
    categoriesDDRef.current.reset();
    setCategoriesData([]);
    setProductsData([]);
    setDesignTypeData([]);
    setCategoriesName("");
    setProductsName("");
    setDesignType("");
    setSNError(false);
    FetchCategoriesFromServices(selectedItem);
  };

  const onCategoriesNameSelected = (selectedItem) => {
    setCategoriesName(selectedItem);
    productsDDRef.current.reset();
    setCNError(false);
    setProductsData([]);
    setDesignTypeData([]);
    setProductsName("");
    setDesignType("");
    FetchProductsFromCategory(selectedItem);
  };

  const onProductsNameSelected = (selectedItem) => {
    setProductsName(selectedItem);
    setDesignTypeData([]);
    setDesignType("");
    setPNError(false);
    FetchDesignTypeFromProduct(selectedItem);
  };

  const onDesignTypeSelected = (selectedItem) => {
    setDesignType(selectedItem);
    setDTError(false);

    let id = designTypeFullData.find((el) => {
      return el.designTypeName === selectedItem;
    }).id;

    FetchDesignImage(id);

  };

  const onLengthFeetSelected = (selectedItem) => {
    setLengthFeet(selectedItem);
    CalculateSqFt(selectedItem, lengthInches, widthFeet, widthInches);
  };

  const onLengthInchesSelected = (selectedItem) => {
    setLengthInches(selectedItem);
    CalculateSqFt(lengthFeet, selectedItem, widthFeet, widthInches);
  };

  const onWidthFeetSelected = (selectedItem) => {
    setWidthFeet(selectedItem);
    CalculateSqFt(lengthFeet, lengthInches, selectedItem, widthInches);
  };

  const onWidthInchesSelected = (selectedItem) => {
    setWidthInches(selectedItem);
    CalculateSqFt(lengthFeet, lengthInches, widthFeet, selectedItem);
  };

  const onBrandNameSelected = (selectedItem, index) => {
    setBrandName(selectedItem);
    setBNError(false);
    GetProductRateFromMaterialSetup(index);
  };

  const InsertData = () => {
    let product_refno = new Object();
    let product_name = new Object();
    let brand_name = new Object();
    let brand_refno = new Object();
    let qty = new Object();
    let rate = new Object();
    let amount = new Object();
    let formula_parameter1 = new Object();

    arrProductData[0].map((k, i) => {
      product_refno[(i + 1).toString()] = k.id;
      product_name[(i + 1).toString()] = k.productName;
      brand_name[(i + 1).toString()] = k.brandName;
      brand_refno[(i + 1).toString()] = k.brandID;
      qty[(i + 1).toString()] = k.quantity;
      rate[(i + 1).toString()] = k.price;
      amount[(i + 1).toString()] = k.amount;
      formula_parameter1[(i + 1).toString()] = k.formula;
    });

    const params = {
      data: {
        Sess_UserRefno: "2",
        group_refno: activityID,
        cont_service_refno: servicesFullData.find((el) => {
          return el.serviceName === serviceName;
        }).id,
        cont_category_refno: categoriesFullData.find((el) => {
          return el.categoryName === categoriesName;
        }).id,
        cont_product_refno: productsFullData.find((el) => {
          return el.productName === productsName;
        }).id,
        designtype_refno: designTypeFullData.find((el) => {
          return el.designTypeName === designType;
        }).id,
        view_status: checked ? 1 : 0,
        lengthfoot: lengthFeet,
        lengthinches: lengthInches,
        widthheightfoot: widthFeet,
        widthheightinches: widthInches,
        totalfoot: totalSqFt,
        product_refno: product_refno,
        product_name: product_name,
        brand_name: brand_name,
        brand_refno: brand_refno,
        qty: qty,
        rate: rate,
        amount: amount,
        formula_parameter1: formula_parameter1,
        subtotal: total
      },
    };

    Provider.createDFAdmin(Provider.API_URLS.MaterialsSetupCreate, params)
      .then((response) => {
        setIsButtonLoading(false);
        if (response.data && response.data.code === 200) {
          route.params.fetchData("add");
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

  const UpdateData = () => {
    let product_refno = new Object();
    let product_name = new Object();
    let brand_name = new Object();
    let brand_refno = new Object();
    let qty = new Object();
    let rate = new Object();
    let amount = new Object();
    let formula_parameter1 = new Object();

    arrProductData[0].map((k, i) => {
      product_refno[(i + 1).toString()] = k.id;
      product_name[(i + 1).toString()] = k.productName;
      brand_name[(i + 1).toString()] = k.brandName;
      brand_refno[(i + 1).toString()] = k.brandID;
      qty[(i + 1).toString()] = k.quantity;
      rate[(i + 1).toString()] = k.price;
      amount[(i + 1).toString()] = k.amount;
      formula_parameter1[(i + 1).toString()] = k.formula;
    });

    const params = {
      data: {
        Sess_UserRefno: "2",
        materials_setup_refno: route.params.data.id,
        group_refno: activityID,
        cont_service_refno: servicesFullData.find((el) => {
          return el.serviceName === serviceName;
        }).id,
        cont_category_refno: categoriesFullData.find((el) => {
          return el.categoryName === categoriesName;
        }).id,
        cont_product_refno: productsFullData.find((el) => {
          return el.productName === productsName;
        }).id,
        designtype_refno: designTypeFullData.find((el) => {
          return el.designTypeName === designType;
        }).id,
        view_status: checked ? 1 : 0,
        lengthfoot: lengthFeet,
        lengthinches: lengthInches,
        widthheightfoot: widthFeet,
        widthheightinches: widthInches,
        totalfoot: totalSqFt,
        product_refno: product_refno,
        product_name: product_name,
        brand_name: brand_name,
        brand_refno: brand_refno,
        qty: qty,
        rate: rate,
        amount: amount,
        formula_parameter1: formula_parameter1,
        subtotal: total
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.MaterialsSetupUpdate, params)
      .then((response) => {
        setIsButtonLoading(false);
        if (response.data && response.data.code === 200) {
          route.params.fetchData("add");
          navigation.goBack();
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
    const objProducts = productsFullData.find((el) => {
      return el.productName && el.productName === productsName;
    });
    if (productsName.length === 0 || !objProducts) {
      setPNError(true);
      isValid = false;
    }
    const objDesignType = designTypeFullData.find((el) => {
      return el.designTypeName && el.designTypeName === designType;
    });
    if (designType.length === 0 || !objDesignType) {
      setDTError(true);
      isValid = false;
    }

    if (arrProductData[0].length === 0) {
      setPLError(true);
      setBNError(true);
      isValid = false;
    }

    let amountAdded = true;
    arrProductData[0].map((el) => {
      if (!el.amount || el.amount == 0 || !el.price || el.price == 0 || !el.quantity || el.quantity == 0 || !el.formula || el.formula == 0) {
        if (amountAdded) {
          amountAdded = false;
          setBNError(true);
          isValid = false;
        }
      }
    });

    if (isValid) {
      setIsButtonLoading(true);
      if (route.params.type === "edit") {
        UpdateData();
      } else {
        InsertData();
      }
    }
  };

  const OpenProductDialog = () => {
    refRBSheet.current.open();
  };

  const CreateNumberDropdown = (startCount, endCount) => {
    let arrNumbers = [];
    for (var i = startCount; i <= endCount; i++) {
      arrNumbers.push(i.toString());
    }
    return arrNumbers;
  };

  const CalculateSqFt = (lf, li, wf, wi) => {
    if (lf > 0 && li > -1 && wf > 0 && wi > -1) {
      const inches = ((parseInt(lf) * 12 + parseInt(li)) * (parseInt(wf) * 12 + parseInt(wi))) / 144;
      setTotalSqft(parseFloat(inches).toFixed(4));
      if (arrProductData[0].length > 0) {
        let total = 0;
        const arrMaterialProducts = [...arrProductData[0]];
        arrMaterialProducts.map((k) => {
          if (k.formula) {
            k.quantity = (parseFloat(inches.toString()) / parseFloat(k.formula)).toFixed(4);
            if (k.price) {
              k.amount = (parseFloat(k.quantity) * parseFloat(k.price)).toFixed(4);
            } else {
              k.amount = "0.0000";
            }
            total += parseFloat(k.amount);
          } else {
            k.quantity = "";
            k.amount = "0.0000";
          }
        });
        arrProductData[1](arrMaterialProducts);
        setTotal(parseFloat(total).toFixed(4));
      }
    } else {
      setTotalSqft(0);
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <Dropdown label="Service Name" data={servicesData} onSelected={onServiceNameSelected} isError={errorSN} selectedItem={serviceName} reference={servicesDDRef} />
          <HelperText type="error" visible={errorSN}>
            {communication.InvalidServiceName}
          </HelperText>
          <Dropdown label="Category Name" data={categoriesData} onSelected={onCategoriesNameSelected} isError={errorCN} selectedItem={categoriesName} reference={categoriesDDRef} />
          <HelperText type="error" visible={errorCN}>
            {communication.InvalidCategoryName}
          </HelperText>
          <Dropdown label="Product Name" data={productsData} onSelected={onProductsNameSelected} isError={errorPN} selectedItem={productsName} reference={productsDDRef} />
          <HelperText type="error" visible={errorPN}>
            {communication.InvalidProductName}
          </HelperText>
          <Dropdown label="Design Type Name" data={designTypeData} onSelected={onDesignTypeSelected} isError={errorDT} selectedItem={designType} reference={designTypeDDRef} />
          <HelperText type="error" visible={errorDT}>
            {communication.InvalidDesignTypeName}
          </HelperText>
          <TextInput mode="outlined" multiline={true} disabled={true} label="Specification" value={specification} returnKeyType="done"
            style={{ backgroundColor: "white" }} />
          <View style={[Styles.flexRow, Styles.flexAlignEnd, Styles.marginTop16]}>
          <Image source={{ uri: designImage }} style={[Styles.border1, Styles.width100per, Styles.height250]} />
          </View>
          <View style={{ width: 160 }}>
            <Checkbox.Item label="Display" position="leading" style={{ paddingHorizontal: 2 }} labelStyle={{ textAlign: "left", paddingLeft: 8 }} color={theme.colors.primary} status={checked ? "checked" : "unchecked"} onPress={() => setChecked(!checked)} />
          </View>
          <Subheading style={[Styles.marginTop16]}>Length</Subheading>
          <View style={[Styles.flexRow, Styles.flexAlignCenter]}>
            <View style={[Styles.paddingStart0, Styles.paddingEnd8, Styles.flex5]}>
              <Dropdown label="Feet" data={CreateNumberDropdown(1, 50)} onSelected={onLengthFeetSelected} selectedItem={lengthFeet} />
            </View>
            <Text style={[Styles.flex1, Styles.paddingStart4]}>ft</Text>
            <View style={[Styles.paddingStart8, Styles.paddingEnd0, Styles.flex5]}>
              <Dropdown label="Inches" data={CreateNumberDropdown(0, 11)} onSelected={onLengthInchesSelected} selectedItem={lengthInches} />
            </View>
            <Text style={[Styles.flex1_5, Styles.paddingStart4]}>inch</Text>
          </View>
          <Subheading style={[Styles.marginTop32]}>Width / Height</Subheading>
          <View style={[Styles.flexRow, Styles.flexAlignCenter, Styles.marginBottom32]}>
            <View style={[Styles.paddingStart0, Styles.paddingEnd8, Styles.flex5]}>
              <Dropdown label="Feet" data={CreateNumberDropdown(1, 50)} onSelected={onWidthFeetSelected} selectedItem={widthFeet} />
            </View>
            <Text style={[Styles.flex1, Styles.paddingStart4]}>ft</Text>
            <View style={[Styles.paddingStart8, Styles.paddingEnd0, Styles.flex5]}>
              <Dropdown label="Inches" data={CreateNumberDropdown(0, 11)} onSelected={onWidthInchesSelected} selectedItem={widthInches} />
            </View>
            <Text style={[Styles.flex1_5, Styles.paddingStart4]}>inch</Text>
          </View>
          <TextInput mode="outlined" label="Total (Sq.Ft.)" value={totalSqFt} editable={false} />
          <Button mode="contained" style={[Styles.marginTop16]} onPress={OpenProductDialog}>
            Add Products
          </Button>
          <HelperText type="error" visible={errorPL}>
            {communication.InvalidProductList}
          </HelperText>
          <View style={[Styles.padding16]}>
            <Dropdown label="Brand Name" data={brandsData} onSelected={onBrandNameSelected} selectedItem={brandName} />
            <HelperText type="error" visible={errorBN}>
              {communication.InvalidBrnadSelected}
            </HelperText>
            {arrProductData[0].map((k, i) => {
              return (
                <View key={i} style={[Styles.flexColumn, Styles.border1, Styles.marginTop16, Styles.paddingHorizontal16]}>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Subheading style={[Styles.flex1, Styles.primaryColor, Styles.fontBold]}>{k.productName}</Subheading>
                    <IconButton
                      icon="close"
                      iconColor={theme.colors.text}
                      size={20}
                      onPress={() => {
                        let arrProductsTemp = [...arrProductData[0]];
                        let brandsFullDataTemp = [...brandsFullData];
                        arrProductsTemp.splice(arrProductsTemp.indexOf(k), 1);
                        const allBrandsForProduct = brandsFullDataTemp.filter((el) => {
                          return el.id === k.id;
                        });
                        allBrandsForProduct.map((all) => {
                          const arrTemp = arrProductsTemp.filter((el) => {
                            return el.brandID === all.brandID;
                          });
                          if (arrTemp.length === 0) {
                            brandsFullDataTemp = brandsFullDataTemp.filter((el) => {
                              return el.brandID !== all.brandID;
                            });
                          }
                        });
                        setBrandsFullData(brandsFullDataTemp);
                        const key = "brandID";
                        const uniqueBrands = [...new Map(brandsFullDataTemp.map((item) => [item[key], item])).values()];
                        setUniqueBrandsData(uniqueBrands);
                        const formattedData = uniqueBrands.map((data) => data.brandName + " (" + data.categoryName + ")");
                        setBrandsData(formattedData);
                        arrProductData[1](arrProductsTemp);
                      }}
                    />
                  </View>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Brand Name</Text>
                    <TextInput mode="outlined" dense style={[Styles.flex1]} editable={false} value={k.brandName} />
                  </View>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Quantity</Text>
                    <TextInput mode="outlined" dense style={[Styles.flex1]} editable={false} value={k.quantity ? parseFloat(k.quantity).toFixed(4) : ""} />
                  </View>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Rate</Text>
                    <TextInput
                      mode="outlined"
                      dense
                      keyboardType="decimal-pad"
                      value={k.price}
                      style={[Styles.flex1, { backgroundColor: theme.colors.textLight }]}
                      onChangeText={(text) => {
                        const changeData1 = [...arrProductData[0]];
                        changeData1[parseInt(i)].price = text;
                        if (text && text != 0 && k.formula && k.formula != 0) {
                          const quant = parseFloat(totalSqFt.toString()) / parseFloat(k.formula);
                          changeData1[parseInt(i)].quantity = quant.toFixed(4);
                          changeData1[parseInt(i)].amount = (quant * parseFloat(text)).toFixed(4);
                        }
                        arrProductData[1](changeData1);
                      }}
                    />
                  </View>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Amount</Text>
                    <TextInput mode="outlined" dense style={[Styles.flex1]} editable={false} value={k.amount} />
                  </View>
                  <View style={[Styles.flexRow, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Formula</Text>
                    <TextInput
                      mode="outlined"
                      dense
                      keyboardType="decimal-pad"
                      value={k.formula}
                      style={[Styles.flex1, { backgroundColor: theme.colors.textLight }]}
                      onChangeText={(text) => {
                        const changeData = [...arrProductData[0]];
                        if (text && text != 0) {
                          const quanti = parseFloat(totalSqFt.toString()) / parseFloat(text);
                          changeData[parseInt(i)].quantity = quanti.toFixed(4);
                          if (k.price) {
                            changeData[parseInt(i)].amount = (quanti * parseFloat(k.price)).toFixed(4);
                          } else {
                            changeData[parseInt(i)].amount = "0.0000";
                          }
                        } else {
                          changeData[parseInt(i)].amount = "";
                          changeData[parseInt(i)].quantity = "";
                        }
                        changeData[parseInt(i)].formula = text;
                        setTotal(0);
                        let totalTemp = 0;
                        changeData.map((k) => {
                          if (k.amount) {
                            totalTemp += parseFloat(k.amount);
                          }
                        });
                        setTotal(totalTemp);
                        arrProductData[1](changeData);
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content style={[Styles.flexRow, { justifyContent: "space-between" }]}>
          <Subheading style={[Styles.fontBold, Styles.primaryColor]}>Sub total: {parseFloat(total).toFixed(4)}</Subheading>
          {/* <Button mode="contained" onPress={ValidateData}>
            Submit
          </Button> */}
          <DFButton mode="contained" onPress={ValidateData} title="   Submit" loader={isButtonLoading} />
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={windowHeight - 96} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" } }}>
        <View style={[Styles.flex1]}>
          <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
            <View style={[Styles.flex1]}>
              <AddMaterialSetupProducts arrProductData={arrProductData} />
            </View>
          </ScrollView>
          <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
            <Button
              mode="contained"
              onPress={() => {
                setBrandsData([]);
                setBrandsFullData([]);
                FetchBrandsFromProductIds();
                if (arrProductData[0].length > 0) {
                  setPLError(false);
                }
                refRBSheet.current.close();
              }}
            >
              Done
            </Button>
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

export default AddMaterialSetupScreen;
