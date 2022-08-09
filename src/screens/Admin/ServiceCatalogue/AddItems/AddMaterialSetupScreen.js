import React, { useEffect, useRef } from "react";
import { ScrollView, View, Dimensions } from "react-native";
import { Button, Card, Checkbox, DataTable, Headline, HelperText, Snackbar, Subheading, Text, TextInput, Title } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import AddMaterialSetupProducts from "./AddMaterialSetupProducts";

const AddMaterialSetupScreen = ({ route, navigation }) => {
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

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const [lengthFeet, setLengthFeet] = React.useState(route.params.type === "edit" ? route.params.data.lengthFeet : "1");
  const [lengthInches, setLengthInches] = React.useState(route.params.type === "edit" ? route.params.data.lengthInches : "0");

  const [widthFeet, setWidthFeet] = React.useState(route.params.type === "edit" ? route.params.data.widthFeet : "1");
  const [widthInches, setWidthInches] = React.useState(route.params.type === "edit" ? route.params.data.widthInches : "0");

  const [errorPL, setPLError] = React.useState(false);

  const [brandsFullData, setBrandsFullData] = React.useState([]);
  const [brandsData, setBrandsData] = React.useState([]);
  const [brandName, setBrandName] = React.useState([]);

  const [errorBN, setBNError] = React.useState(false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [total, setTotal] = React.useState(0);

  const windowHeight = Dimensions.get("window").height;
  const refRBSheet = useRef();

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
      .catch((e) => {});
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
      .catch((e) => {});
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
      .catch((e) => {});
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
      .catch((e) => {});
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
      .catch((e) => {});
  };

  const FetchBrandsFromProductIds = () => {
    const productids = arrProductData[0].map((data) => data.productID);
    let params = {
      ProductID: productids.join(","),
    };
    console.log(params);
    Provider.getAll(`servicecatalogue/getbrandsbyproductids?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setBrandsFullData(response.data.data);
            const key = "brandID";
            const uniqueBrands = [...new Map(response.data.data.map((item) => [item[key], item])).values()];
            const formattedData = uniqueBrands.map((data) => data.brandName + " (" + data.categoryName + ")");
            setBrandsData(formattedData);
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
      }).id;
    }
    setPNError(false);
    FetchDesignTypeFromProduct(selectedItem);
  };

  const onDesignTypeSelected = (selectedItem) => {
    setDesignType(selectedItem);
    if (route.params.type === "edit") {
      route.params.data.designType = designTypeFullData.find((el) => {
        return el.designTypeName === selectedItem;
      }).id;
    }
    setDTError(false);
  };

  const onLengthFeetSelected = (selectedItem) => {
    setLengthFeet(selectedItem);
  };

  const onLengthInchesSelected = (selectedItem) => {
    setLengthInches(selectedItem);
  };

  const onWidthFeetSelected = (selectedItem) => {
    setWidthFeet(selectedItem);
  };

  const onWidthInchesSelected = (selectedItem) => {
    setWidthInches(selectedItem);
  };

  const onBrandNameSelected = (selectedItem, index) => {
    setBrandName(selectedItem);
    setBNError(false);
    const selecedBrand = brandsFullData[parseInt(index)];
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
      }
    });
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
      if (!el.amount || el.amount == 0) {
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
            <Text style={[Styles.flex1, Styles.paddingStart4]}>in</Text>
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
            <Text style={[Styles.flex1, Styles.paddingStart4]}>in</Text>
          </View>
          <TextInput mode="flat" label="Total (Sq.Ft.)" value={(parseFloat(lengthFeet + "." + lengthInches) * parseFloat(widthFeet + "." + widthInches)).toFixed(4)} editable={false} />
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
                  </View>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Brand Name</Text>
                    <TextInput mode="flat" dense style={[Styles.flex1]} editable={false} value={k.brandName} />
                  </View>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Quantity</Text>
                    <TextInput mode="flat" dense style={[Styles.flex1]} editable={false} value={k.quantity} />
                  </View>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Rate</Text>
                    <TextInput
                      mode="flat"
                      dense
                      keyboardType="decimal-pad"
                      value={k.price}
                      style={[Styles.flex1, { backgroundColor: theme.colors.textLight }]}
                      onChangeText={(text) => {
                        if (k.brandName) {
                          const changeData1 = [...arrProductData[0]];
                          changeData1[parseInt(i)].price = text;

                          arrProductData[1](changeData1);
                        }
                      }}
                    />
                  </View>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Amount</Text>
                    <TextInput mode="flat" dense style={[Styles.flex1]} editable={false} value={k.amount} />
                  </View>
                  <View style={[Styles.flexRow, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Formula</Text>
                    <TextInput
                      mode="flat"
                      dense
                      keyboardType="decimal-pad"
                      style={[Styles.flex1, { backgroundColor: theme.colors.textLight }]}
                      onChangeText={(text) => {
                        if (k.brandName) {
                          const changeData = [...arrProductData[0]];
                          if (text) {
                            const amount = parseFloat(k.price) / parseFloat(text);
                            changeData[parseInt(i)].amount = amount.toFixed(4);
                            changeData[parseInt(i)].quantity = (amount / parseFloat(k.price)).toFixed(4);
                            changeData[parseInt(i)].formula = text;
                          } else {
                            changeData[parseInt(i)].amount = "";
                            changeData[parseInt(i)].quantity = "";
                            changeData[parseInt(i)].formula = "";
                          }
                          setTotal(0);
                          let totalTemp = 0;
                          changeData.map((k) => {
                            if (k.amount) {
                              totalTemp += parseFloat(k.amount);
                            }
                          });
                          setTotal(totalTemp);
                          arrProductData[1](changeData);
                        }
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
          <Subheading style={[Styles.fontBold, Styles.primaryColor]}>Sub total: {total.toFixed(4)}</Subheading>
          <Button mode="contained" onPress={ValidateData}>
            Submit
          </Button>
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
