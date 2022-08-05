import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { HelperText } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { communication } from "../../../../utils/communication";

const AddMaterialSetupScreen = ({ route, navigation }) => {
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

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

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

  const FetchDesignTypeFromProduct = (selectedItem, activityData) => {
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
      ProductID:
        route.params.type === "edit"
          ? route.params.data.productID
          : productsFullData.find((el) => {
              return el.productName === selectedItem;
            }).id,
    };
    Provider.getAll(`master/getdesigntypebyproductid?${new URLSearchParams(params)}`)
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
        </View>
      </ScrollView>
    </View>
  );
};

export default AddMaterialSetupScreen;
