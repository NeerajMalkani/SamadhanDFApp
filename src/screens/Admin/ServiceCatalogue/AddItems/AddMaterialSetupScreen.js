import React, { useEffect, useRef } from "react";
import { ScrollView, View, Dimensions } from "react-native";
import { Button, Card, Checkbox, DataTable, HelperText, Snackbar, Subheading, Text, TextInput, Title } from "react-native-paper";
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
  const [designType, setDesignType] = React.useState(route.params.type === "edit" ? route.params.data.designType : "");
  const [errorDT, setDTError] = React.useState(false);
  const designTypeDDRef = useRef({});

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const [lengthFeet, setLengthFeet] = React.useState(route.params.type === "edit" ? route.params.data.lengthFeet : "1");
  const [lengthInches, setLengthInches] = React.useState(route.params.type === "edit" ? route.params.data.lengthInches : "0");

  const [widthFeet, setWidthFeet] = React.useState(route.params.type === "edit" ? route.params.data.widthFeet : "1");
  const [widthInches, setWidthInches] = React.useState(route.params.type === "edit" ? route.params.data.widthInches : "0");

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const windowHeight = Dimensions.get("window").height;
  const refRBSheet = useRef();

  const [showView, setShowView] = React.useState(1);

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

  const ValidateData = () => {};

  const OpenProductDialog = () => {
    refRBSheet.current.open();
    setShowView(1);
  };

  const OpenProductViewDialog = () => {
    refRBSheet.current.open();
    setShowView(2);
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
        </View>
      </ScrollView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content style={[Styles.flexRow, { justifyContent: "space-between" }]}>
          <Button mode="outlined" onPress={OpenProductDialog}>
            Add
          </Button>
          <Button mode="contained" onPress={ValidateData}>
            Submit
          </Button>
          <Button mode="outlined" onPress={OpenProductViewDialog}>
            Show
          </Button>
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={windowHeight - 96} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" } }}>
        <View style={[Styles.flex1]}>
          <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]}>
            <View style={{ display: showView === 1 ? "flex" : "none" }}>
              <AddMaterialSetupProducts arrProductData={arrProductData} />
            </View>
            <View style={[Styles.padding16, { display: showView === 2 ? "flex" : "none" }]}>
              {arrProductData[0].map((k, i) => {
                return (
                  <View key={i} style={[Styles.flexColumn, Styles.border1, Styles.marginTop16]}>
                    <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                      <Title style={[Styles.flex1, Styles.primaryColor]}>{k.productName}</Title>
                    </View>
                    <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                      <Text style={[Styles.flex1]}>Brand Name</Text>
                      <TextInput mode="flat" dense style={[Styles.flex1]} editable={false} />
                    </View>
                    <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                      <Text style={[Styles.flex1]}>Quantity</Text>
                      <TextInput mode="flat" dense style={[Styles.flex1]} editable={false} />
                    </View>
                    <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                      <Text style={[Styles.flex1]}>Rate</Text>
                      <TextInput mode="flat" dense style={[Styles.flex1, { backgroundColor: theme.colors.textLight }]} />
                    </View>
                    <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                      <Text style={[Styles.flex1]}>Amount</Text>
                      <TextInput mode="flat" dense style={[Styles.flex1]} editable={false} />
                    </View>
                    <View style={[Styles.flexRow, Styles.padding4, Styles.flexAlignCenter]}>
                      <Text style={[Styles.flex1]}>Formula</Text>
                      <TextInput mode="flat" dense style={[Styles.flex1, { backgroundColor: theme.colors.textLight }]} />
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
            <Button mode="contained" onPress={() => refRBSheet.current.close()}>
              Done
            </Button>
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

export default AddMaterialSetupScreen;
