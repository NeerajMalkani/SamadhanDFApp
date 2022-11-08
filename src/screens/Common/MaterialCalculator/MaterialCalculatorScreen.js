import React, { useEffect, useRef } from "react";
import { ScrollView, Dimensions, Image, View, useWindowDimensions, InteractionManager } from "react-native";
import { Button, Card, Checkbox, DataTable, Headline, HelperText, IconButton, Snackbar, Subheading, Text, TextInput, Title, MD3Colors } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../api/Provider";
import Dropdown from "../../../components/Dropdown";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";
import AddMaterialSetupProducts from "../../Admin/ServiceCatalogue/AddItems/AddMaterialSetupProducts";
import { AWSImagePath } from "../../../utils/paths";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import styles from "react-native-inset-shadow/src/styles";
import { scrollTo } from "react-native-reanimated/lib/reanimated2/NativeMethods";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";



const MaterialCalculatorScreen = ({ route, navigation }) => {


  const scrollRef = useRef();

  //#region Variables
  const arrProductData = React.useState([]);
  const [activityFullData, setActivityFullData] = React.useState([]);

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

  const [lengthFeet, setLengthFeet] = React.useState(route.params.type === "edit" ? route.params.data.lengthFeet.toString() : "1");
  const [lengthInches, setLengthInches] = React.useState(route.params.type === "edit" ? route.params.data.lengthInches.toString() : "0");

  const [widthFeet, setWidthFeet] = React.useState(route.params.type === "edit" ? route.params.data.widthFeet.toString() : "1");
  const [widthInches, setWidthInches] = React.useState(route.params.type === "edit" ? route.params.data.widthInches.toString() : "0");

  const [totalSqFt, setTotalSqft] = React.useState(route.params.type === "edit" ? (((parseInt(route.params.data.lengthFeet.toString()) * 12 + parseInt(route.params.data.lengthInches.toString())) * (parseInt(route.params.data.widthFeet.toString()) * 12 + parseInt(route.params.data.widthInches.toString()))) / 144).toFixed(4) : "1.0000");

  const [totalArea, setTotalArea] = React.useState("");

  const [errorPL, setPLError] = React.useState(false);

  const [brandsFullData, setBrandsFullData] = React.useState([]);
  const [uniqueBrandsData, setUniqueBrandsData] = React.useState([]);
  const [brandsData, setBrandsData] = React.useState([]);
  const [brandName, setBrandName] = React.useState([]);

  const [errorBN, setBNError] = React.useState(false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [total, setTotal] = React.useState(0);

  const windowHeight = Dimensions.get("window").height;
  const refRBSheet = useRef();
  const [designImage, setDesignImage] = React.useState(AWSImagePath + "placeholder-image.png");
  //#endregion 

  //#region Functions
  const LengthRoute = () => (
    <>
      <View style={[Styles.height250, Styles.border1, Styles.borderBottomRadius4]} >
        <View style={[Styles.flexAlignSelfStart]}>
          <IconButton
            icon="gesture-swipe-left"
            color={theme.colors.textfield}
            size={22}
          />
        </View>
        <View style={Styles.paddingHorizontal16}>
          <Subheading>Length</Subheading>

          <View style={[Styles.flexRow, Styles.flexAlignCenter,]}>
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
        </View>


      </View>

    </>
  );

  const TotalRoute = () => (
    <>
      <View style={[Styles.height250, Styles.border1, Styles.borderBottomRadius4]} >
        <View style={[Styles.flexAlignSelfEnd]}>
          <IconButton
            icon="gesture-swipe-right"
            color={theme.colors.textfield}
            size={22}

          />
        </View>
        <View style={Styles.paddingHorizontal16}>
          <Subheading style={[Styles.marginTop16]}>Add Total Area (Sq.Ft)</Subheading>
          <View style={[Styles.flexRow, Styles.flexAlignCenter, Styles.marginBottom32]}>
            <TextInput mode="flat" keyboardType="number-pad" label="Total Sq.Ft" maxLength={10} value={totalArea}
              returnKeyType="done" dense onChangeText={onTotalAreaChanged} style={[Styles.width50per, { backgroundColor: "white" }]}
            />
          </View>
        </View>
      </View>
    </>
  );

  const renderTabBar = props => (
    <TabBar
      {...props}

      indicatorStyle={{ backgroundColor: '#FFF89A' }}
      style={[Styles.borderTopRadius4, { backgroundColor: theme.colors.primary }]}
      activeColor={'#F5CB44'}
      inactiveColor={'#F4F4F4'}
    />
  );

  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'length', title: 'Length / Width' },
    { key: 'total', title: 'Total Area' },
  ]);

  const renderScene = SceneMap({
    length: LengthRoute,
    total: TotalRoute,
  });

  const FetchActvityRoles = () => {
    Provider.getAll("master/getmainactivities")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display && el.activityRoleName === "Contractor";
            });
            setActivityFullData(response.data.data);

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
            FetchServicesFromActivity("Contractor", response.data.data);
            if (route.params.type === "edit") {
              FetchCategoriesFromServices("Contractor", response.data.data);
              FetchProductsFromCategory("Contractor", response.data.data);
              FetchDesignTypeFromProduct("Contractor", response.data.data);
            }
          }
        }
      })
      .catch((e) => { });
  };

  const FetchServicesFromActivity = (selectedItem, activityData) => {
    let params = {
      ID: activityData.find((el) => {
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
      .catch((e) => { });
  };

  const FetchCategoriesFromServices = (selectedItem, activityData) => {
    let params = {
      ActivityID: activityData
        ? activityData.find((el) => {
          return el.activityRoleName === "Contractor";
        }).id
        : activityFullData.find((el) => {
          return el.activityRoleName === "Contractor";
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
      .catch((e) => { });
  };

  const FetchDesignImage = (designID) => {
    let params = {
      ID: designID
    };
    Provider.getAll(`master/getdesigntypeimage?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setDesignImage(response.data.data[0].designImage);
          }
        }
      })
      .catch((e) => { });
  };

  const FetchProductsFromCategory = (selectedItem, activityData) => {
    let params = {
      ActivityID: activityData
        ? activityData.find((el) => {
          return el.activityRoleName === "Contractor";
        }).id
        : activityFullData.find((el) => {
          return el.activityRoleName === "Contractor";
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
      .catch((e) => { });
  };

  const FetchDesignTypeFromProduct = (selectedItem) => {
    let params = {
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
            return el.categoryName === categoriesName;
          }).id,
      ProductID:
        route.params.type === "edit"
          ? route.params.data.productID
          : productsFullData.find((el) => {
            return el.productName === selectedItem;
          }).productID,
    };
    Provider.getAll(`servicecatalogue/getdesigntypebyproductid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setDesignTypeFullData(response.data.data);
            const designTypes = response.data.data.map((data) => data.designTypeName);
            setDesignTypeData(designTypes);
          }
        }
      })
      .catch((e) => { });
  };

  const FetchBrandsFromProductIds = (productData) => {
    const productids = productData ? productData.map((data) => data.productID) : arrProductData[0].map((data) => data.productID);
    let params = {
      ProductID: productids.join(","),
    };
    Provider.getAll(`servicecatalogue/getbrandsbyproductids?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setBrandsFullData(response.data.data);
            const key = "brandID";
            const uniqueBrands = [...new Map(response.data.data.map((item) => [item[key], item])).values()];
            setUniqueBrandsData(uniqueBrands);
            const formattedData = uniqueBrands.map((data) => data.brandName + " (" + data.categoryName + ")");
            setBrandsData(formattedData);
          }
        }
      })
      .catch((e) => { });
  };

  const FetchProductsFromMaterialSetup = (callback) => {
    let params = {
      DesignTypeID: designTypeFullData.find((el) => {
        return el.designTypeName === designType;
      }).id,
    };
    Provider.getAll(`servicecatalogue/getmaterialbydesigntypeid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const tempArr = [];
            setTotal(0);
            let totalTemp = 0;
            response.data.data.map((k) => {
              tempArr.push({
                productID: k.productID,
                productName: k.productName,
                brandID: 0,
                brandName: "",
                price: 0,
                amount: 0,
                quantity: parseFloat(k.quantity),
                formula: k.formula.toFixed(4),
              });
            });
            setTotal(totalTemp);
            arrProductData[1](tempArr);


            setBrandsData([]);
            setBrandsFullData([]);
            CalculateSqFt(0, 0, 0, 0, "ta", totalSqFt);
            FirstCalculationSqFt(totalSqFt, response.data.data);
            FetchBrandsFromProductIds(tempArr);
            scrollRef.current?.scrollTo({
              y: 0,
              animated: true,
            });
          }
        }
        else {
          setSnackbarText(communication.NoMaterial);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => { });
  };

  useEffect(() => {
    FetchActvityRoles();
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
    if (route.params.type === "edit") {
      route.params.data.categoryID = categoriesFullData.find((el) => {
        return el.categoryName === selectedItem;
      }).id;
    }
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
    if (route.params.type === "edit") {
      route.params.data.productID = productsFullData.find((el) => {
        return el.productName === selectedItem;
      }).productID;
    }
    setPNError(false);
    FetchDesignTypeFromProduct(selectedItem);
  };

  const onDesignTypeSelected = (selectedItem) => {
    setDesignType(selectedItem);
    let id = designTypeFullData.find((el) => {
      return el.designTypeName === selectedItem;
    }).id;
    setDTError(false);
    FetchDesignImage(id);
  };

  const onLengthFeetSelected = (selectedItem) => {
    setLengthFeet(selectedItem);
    ResetTotalArea();
    CalculateSqFt(selectedItem, lengthInches, widthFeet, widthInches, "lw");
  };

  const onLengthInchesSelected = (selectedItem) => {
    setLengthInches(selectedItem);
    ResetTotalArea();
    CalculateSqFt(lengthFeet, selectedItem, widthFeet, widthInches, "lw");
  };

  const onWidthFeetSelected = (selectedItem) => {
    setWidthFeet(selectedItem);
    ResetTotalArea();
    CalculateSqFt(lengthFeet, lengthInches, selectedItem, widthInches, "lw");
  };

  const onWidthInchesSelected = (selectedItem) => {
    setWidthInches(selectedItem);
    ResetTotalArea();
    CalculateSqFt(lengthFeet, lengthInches, widthFeet, selectedItem, "lw");
  };

  const onBrandNameSelected = (selectedItem, index) => {
    setBrandName(selectedItem);
    setBNError(false);
    const selecedBrand = uniqueBrandsData[parseInt(index)];
    const appliedProducts = brandsFullData.filter((el) => {
      return el.brandID === selecedBrand.brandID;
    });
    const newData = [...arrProductData[0]];
    newData.map((k) => {
      const foundProduct = appliedProducts.find((el) => el.productID === k.productID);
      if (foundProduct) {
        k.brandID = foundProduct.brandID;
        k.brandName = foundProduct.brandName;
        k.price = foundProduct.price.toFixed(4);
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
    const amounts = newData.map((data) => data.amount);
    if (isNaN(amounts.reduce((a, b) => a + parseFloat(b), 0).toFixed(4))) {
      setTotal(0);
    }
    else {
      setTotal(amounts.reduce((a, b) => a + parseFloat(b), 0).toFixed(4));
    }
    arrProductData[1](newData);
  };

  const InsertData = () => {
    const arrMaterialProducts = [];
    arrProductData[0].map((k) => {
      arrMaterialProducts.push({
        ProductID: k.productID,
        BrandID: k.brandID,
        Rate: k.price,
        Amount: k.amount,
        Quantity: k.quantity,
        Formula: k.formula,
      });
    });
    Provider.create("servicecatalogue/insertmaterialsetup", {
      MaterialSetupMaster: {
        DesignTypeID: designTypeFullData.find((el) => {
          return el.designTypeName === designType;
        }).id,
        Length: parseFloat(lengthFeet + "." + lengthInches),
        Width: parseFloat(widthFeet + "." + widthInches),
        Subtotal: parseFloat(total),
        Display: checked,
      },
      MaterialProductMappings: arrMaterialProducts,
    })
      .then((response) => {
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
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const UpdateData = () => {
    const arrMaterialProducts = [];
    arrProductData[0].map((k) => {
      arrMaterialProducts.push({
        ProductID: k.productID,
        BrandID: k.brandID,
        Rate: k.price,
        Amount: k.amount,
        Quantity: k.quantity,
        Formula: k.formula,
      });
    });
    Provider.create("servicecatalogue/updatematerialsetup", {
      MaterialSetupMaster: {
        ID: route.params.data.id,
        DesignTypeID: designTypeFullData.find((el) => {
          return el.designTypeName === designType;
        }).id,
        Length: parseFloat(lengthFeet + "." + lengthInches),
        Width: parseFloat(widthFeet + "." + widthInches),
        Subtotal: parseFloat(total),
        Display: checked,
      },
      MaterialProductMappings: arrMaterialProducts,
    })
      .then((response) => {
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
      if (route.params.type === "edit") {
        UpdateData();
      } else {
        InsertData();
      }
    }
  };

  const GetMaterialDetails = () => {
    FetchProductsFromMaterialSetup();
  }

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

  const onTotalAreaChanged = (text) => {
    ResetLengthWidth();
    setTotalArea(text);
    CalculateSqFt(0, 0, 0, 0, "ta", text, true);
  };

  const onTotalSqFtChange = (text) => {
    setTotalArea(text);
  };

  const ResetTotalArea = () => {
    setTotalArea("");
  }

  const ResetLengthWidth = () => {
    setWidthFeet("1");
    setLengthFeet("1");
    setLengthInches("0");
    setWidthInches("0");
  }

  const FirstCalculationSqFt = (totArea, productData) => {
    if (productData.length > 0) {
      let total = 0;
      const arrMaterialProducts = [...productData];
      arrMaterialProducts.map((k) => {
        if (k.formula) {
          k.quantity = (parseFloat(totArea.toString()) / parseFloat(k.formula)).toFixed(4);
          if (k.price) {
            k.amount = (0).toFixed(4);
          } else {
            k.amount = "0.0000";
          }

          total += parseFloat(k.amount);
        } else {
          k.quantity = "";
          k.amount = "0.0000";
        }

        k.brandID = 0;
        k.brandName = "";
      });
      arrProductData[1](arrMaterialProducts);
      if (total > 0) {
        setTotal(parseFloat(total).toFixed(4));
      }
      else {
        setTotal(0);
      }
    }
  }

  const CalculateSqFt = (lf, li, wf, wi, type, ta, txtChange) => {
    if (type == "lw") {
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
    }
    else if (type == "ta") {
      if (ta > 0) {
        setTotalSqft(parseFloat(ta).toFixed(4));
        if (txtChange == true) {
          if (arrProductData[0].length > 0) {
            let total = 0;
            const arrMaterialProducts = [...arrProductData[0]];
            arrMaterialProducts.map((k) => {
              if (k.formula) {
                k.quantity = (parseFloat(ta.toString()) / parseFloat(k.formula)).toFixed(4);
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
        }
      }
    }
    else {
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

          <View style={[Styles.flexRow, Styles.flexAlignEnd]}>
            <Image source={{ uri: designImage }} style={[Styles.border1, Styles.width100per, Styles.height250]} />
          </View>

          <View style={[Styles.height325, Styles.marginTop16]}>
            <TabView
              renderTabBar={renderTabBar}
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={{ width: layout.width }}

            />

          </View>
          <TextInput mode="flat" label="Total (Sq.Ft.)"
            onChangeText={onTotalSqFtChange} value={totalSqFt}
            editable={false} />
          <Button mode="contained" style={[Styles.marginTop16]} onPress={GetMaterialDetails}>
            View Materials
          </Button>

          <HelperText type="error" visible={errorPL}>
            {communication.InvalidProductList}
          </HelperText>
          <View>
            <Dropdown label="Select Product Brand" data={brandsData} onSelected={onBrandNameSelected} selectedItem={brandName} />
            <HelperText type="error" visible={errorBN}>
              {communication.InvalidBrnadSelected}
            </HelperText>
            {arrProductData[0].map((k, i) => {
              return (

                <Card key={i} elevation={3} style={[Styles.marginTop16]}>
                  <Card.Content>
                    <View style={[Styles.flexRow, Styles.borderBottom1, Styles.marginBottom4, Styles.paddingHorizontal4, Styles.flexAlignStart]}>
                      <Subheading style={[Styles.flex2, Styles.primaryColor, Styles.fontBold]}>{k.productName}</Subheading>
                      <Subheading style={[Styles.flex1, Styles.bFontColor, Styles.fontBold, { textAlign: "right" }]}>{k.brandName === "" ? "" : k.brandName}</Subheading>
                    </View>
                    <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter, Styles.flexSpaceBetween]}>
                      <View style={[Styles.width48per]}>
                        <TextInput mode="outlined" dense style={[Styles.flex1]} disabled={true} label="Quantity"
                          value={k.quantity ? parseFloat(k.quantity).toFixed(4) : ""} />
                      </View>
                      <View style={[Styles.width48per]}>
                        {
                          k.price > 0 ? <TextInput mode="outlined" dense style={[Styles.flex1]}  disabled={true} label="Rate" value={k.price ? parseFloat(k.price).toFixed(4) : ""} /> : null
                        }
                      </View>

                    </View>
                    {
                      k.brandName != "" ?
                        <View style={[Styles.flexRow, Styles.padding4, Styles.flexAlignCenter, Styles.flexSpaceBetween]}>
                          <View style={[Styles.width100per]}>
                            <TextInput mode="outlined"  dense style={[Styles.flex1]} disabled={true} label="Product Amount"
                              value={k.amount} />
                          </View>
                        </View> : null
                    }
                  </Card.Content>
                </Card>

                // removed from here
              );
            })}
          </View>
        </View>
      </ScrollView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content style={[Styles.flexAlignCenter]}>
          <Subheading style={[Styles.fontBold, Styles.primaryColor]}>Sub total: {parseFloat(total).toFixed(4)}</Subheading>
          {/* <Button mode="contained" onPress={ValidateData}>
            Submit
          </Button> */}
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={windowHeight - 96} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" } }}>
        <View style={[Styles.flex1]}>
          <ScrollView ref={scrollRef}
            style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
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

export default MaterialCalculatorScreen;
