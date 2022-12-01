import React, { useEffect, useRef } from "react";
import FormData from "form-data";
import { Image, ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Subheading, Text, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { RNS3 } from "react-native-aws3";
import * as ImagePicker from "expo-image-picker";
import { creds } from "../../../../utils/credentials";
import uuid from "react-native-uuid";
import { AWSImagePath } from "../../../../utils/paths";
import { APIConverter } from "../../../../utils/apiconverter";

const AddPostNewDesignScreen = ({ route, navigation }) => {
  //#region Variables
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
  const [designTypeName, setDesignTypeName] = React.useState(route.params.type === "edit" ? route.params.data.designTypeName : "");
  const [errorDT, setDTError] = React.useState(false);
  const designTypeDDRef = useRef({});

  const [workLocationFullData, setWorkLocationFullData] = React.useState([]);
  const [workLocationData, setWorkLocationData] = React.useState([]);
  const [workLocationName, setWorkLocationName] = React.useState(route.params.type === "edit" ? route.params.data.workLocationName : "");
  const [errorWL, setWLError] = React.useState(false);
  const workLocationDDRef = useRef({});

  const [error, setError] = React.useState(false);
  const [name, setName] = React.useState(route.params.type === "edit" ? route.params.data.labourCost.toString() : "");

  const [designNumber, setDesignNumber] = React.useState(route.params.type === "edit" ? route.params.data.designNumber : "");
  const [designImage, setDesignImage] = React.useState(route.params.type === "edit" ? route.params.data.designImage : "");

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.error);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [image, setImage] = React.useState(route.params.type === "edit" ? route.params.data.designImage : AWSImagePath + "placeholder-image.png");
  const [filePath, setFilePath] = React.useState(route.params.type === "edit" ? { name: route.params.data.designImage } : null);
  const [errorDI, setDIError] = React.useState(false);

  const [isImageReplaced, setIsImageReplaced] = React.useState(false);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  //#endregion

  //#region Functions
  const FetchDesignNumber = () => {
    Provider.createDFAdmin(Provider.API_URLS.AutoDesignNoNewDesign)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setDesignNumber("DS-" + response.data.data[0].autoincrement_design_no.toString().padStart(4, "0"));
          }
        }
      })
      .catch((e) => {});
  };

  const FetchWorkLocation = () => {
    let params = {
      data: {
        Sess_UserRefno: "2",
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.WorkLocationNameNewDesign, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setWorkLocationFullData(response.data.data);
            const workLocations = response.data.data.map((data) => data.workLocationName);
            setWorkLocationData(workLocations);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchActvityRoles = () => {
    Provider.createDFAdmin(Provider.API_URLS.ActivityRoleNameNewDesign)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            if (route.params.type !== "edit") {
              servicesDDRef.current.reset();
              setName("");
              setServiceName("");
              setProductsName("");
              setCategoriesName("");
              setDesignTypeName("");
              setImage(AWSImagePath + "placeholder-image.png");
              setFilePath(null);
              setCategoriesData([]);
              setServicesData([]);
              setProductsData([]);
              setDesignTypeData([]);
              setError(false);
              setSNError(false);
              setCNError(false);
              setPNError(false);
              setDTError(false);
              setWLError(false);
              setDIError(false);
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
    Provider.createDFAdmin(Provider.API_URLS.ServiceNameNewDesign, params)
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
    Provider.createDFAdmin(Provider.API_URLS.CategoryNameNewDesign, params)
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
    Provider.createDFAdmin(Provider.API_URLS.ProductNameNewDesign, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setProductsFullData(response.data.data);
            if (route.params.type === "edit") {
              FetchProductDataFromProduct(route.params.data.productName, response.data.data);
              FetchDesignTypeFromProduct(route.params.data.productName, response.data.data);
            }
            const products = response.data.data.map((data) => data.productName);
            setProductsData(products);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchProductDataFromProduct = (selectedItem, productDataParams) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        product_refno: productDataParams
          ? productDataParams.find((el) => {
              return el.productName === selectedItem;
            }).productID
          : productsFullData.find((el) => {
              return el.productName === selectedItem;
            }).productID,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.ProductDataNewDesign, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setName(response.data.data[0].labourCost);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchDesignTypeFromProduct = (selectedItem, productDataParams) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        product_refno: productDataParams
          ? productDataParams.find((el) => {
              return el.productName === selectedItem;
            }).productID
          : productsFullData.find((el) => {
              return el.productName === selectedItem;
            }).productID,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.ProductDesignTypeNewDesign, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
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
    FetchWorkLocation();
    if (route.params.type !== "edit") {
      FetchDesignNumber();
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
    setDesignTypeName("");
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
    setDesignTypeName("");
    FetchProductsFromCategory(selectedItem);
  };

  const onProductsNameSelected = (selectedItem) => {
    setProductsName(selectedItem);
    designTypeDDRef.current.reset();
    setPNError(false);
    setDesignTypeData([]);
    setDesignTypeName("");
    FetchProductDataFromProduct(selectedItem);
    FetchDesignTypeFromProduct(selectedItem);
  };

  const onDesignTypeNameSelected = (selectedItem) => {
    setDesignTypeName(selectedItem);
    setDTError(false);
  };

  const onWorkLocationSelected = (selectedItem) => {
    setWorkLocationName(selectedItem);
    setWLError(false);
  };

  const onNameChanged = (text) => {
    setName(text);
    setError(false);
  };

  const chooseFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setDIError(false);
      const arrExt = result.uri.split(".");
      const unique_id = uuid.v4();
      setDesignImage(AWSImagePath + unique_id + "." + arrExt[arrExt.length - 1]);
      setImage(result.uri);
      setFilePath(result);
      if (route.params.type === "edit") {
        setIsImageReplaced(true);
      }
    }
  };

  const InsertData = () => {
    const datas = new FormData();
    const params = {
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
      designtype_refno: designTypeFullData.find((el) => {
        return el.designTypeName === designTypeName;
      }).id,
      worklocation_refno: workLocationFullData.find((el) => {
        return el.workLocationName === workLocationName;
      }).id,
      design_no: parseInt(designNumber.split("-")[1]),
      labour_cost: name,
      view_status: checked ? 1 : 0,
    };
    datas.append("data", JSON.stringify(params));
    datas.append("designtype_image", {
      name: "appimage1212.jpg",
      type: filePath.type + "/*",
      uri: Platform.OS === "android" ? filePath.uri : filePath.uri.replace("file://", ""),
    });
    Provider.createDFAdminWithHeader(Provider.API_URLS.NewDesignCreate, datas)
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
    const datas = new FormData();
    const params = {
      Sess_UserRefno: "2",
      designgallery_refno: route.params.data.id,
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
      designtype_refno: designTypeFullData.find((el) => {
        return el.designTypeName === designTypeName;
      }).id,
      worklocation_refno: workLocationFullData.find((el) => {
        return el.workLocationName === workLocationName;
      }).id,
      design_no: parseInt(designNumber.split("-")[1]),
      labour_cost: name,
      view_status: checked ? 1 : 0,
    };
    datas.append("data", JSON.stringify(params));
    datas.append(
      "designtype_image",
      isImageReplaced
        ? {
            name: "appimage1212.jpg",
            type: filePath.type + "/*",
            uri: Platform.OS === "android" ? filePath.uri : filePath.uri.replace("file://", ""),
          }
        : null
    );
    Provider.createDFAdminWithHeader(Provider.API_URLS.NewDesignUpdate, datas)
      .then((response) => {
        setIsButtonLoading(false);
        if (response.data && response.data.code === 200) {
          route.params.fetchData("update");
          navigation.goBack();
        } else if (response.data.code === 304) {
          setSnackbarText(communication.AlreadyExists);
          setSnackbarVisible(true);
        } else {
          setSnackbarText(communication.UpdateError);
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
    if (name.length === 0) {
      setError(true);
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
    const objProducts = productsFullData.find((el) => {
      return el.productName && el.productName === productsName;
    });
    if (productsName.length === 0 || !objProducts) {
      setPNError(true);
      isValid = false;
    }
    const objDesignType = designTypeFullData.find((el) => {
      return el.designTypeName && el.designTypeName === designTypeName;
    });
    if (designTypeName.length === 0 || !objDesignType) {
      setDTError(true);
      isValid = false;
    }
    const objWorkLocation = workLocationFullData.find((el) => {
      return el.workLocationName && el.workLocationName === workLocationName;
    });
    if (workLocationName.length === 0 || !objWorkLocation) {
      setWLError(true);
      isValid = false;
    }
    if (filePath === null) {
      setDIError(true);
      isValid = false;
    }
    if (isValid) {
      setIsButtonLoading(true);
      if (route.params.type === "edit") {
        UpdateData();
      } else {
        InsertData();
      }
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
          <Dropdown label="Product Design Type" data={designTypeData} onSelected={onDesignTypeNameSelected} isError={errorDT} selectedItem={designTypeName} reference={designTypeDDRef} />
          <HelperText type="error" visible={errorDT}>
            {communication.InvalidDesignTypeName}
          </HelperText>
          <Dropdown label="Work Location" data={workLocationData} onSelected={onWorkLocationSelected} isError={errorWL} selectedItem={workLocationName} reference={workLocationDDRef} />
          <HelperText type="error" visible={errorWL}>
            {communication.InvalidWorkLocationName}
          </HelperText>
          <TextInput mode="flat" label="Design Number" value={designNumber} editable={false} dense style={[Styles.marginVertical12, Styles.backgroundSecondaryColor]} />
          <TextInput mode="flat" label="Labour Cost" value={name} returnKeyType="done" keyboardType="decimal-pad" onChangeText={onNameChanged} style={{ backgroundColor: "white" }} error={error} />
          <HelperText type="error" visible={error}>
            {communication.InvalidLabourCost}
          </HelperText>
          <View style={[Styles.flexRow, Styles.flexAlignEnd, Styles.marginTop16]}>
            <Image source={{ uri: image }} style={[Styles.width104, Styles.height96, Styles.border1]} />
            <Button mode="text" onPress={chooseFile}>
              {filePath !== null ? "Replace" : "Choose Image"}
            </Button>
          </View>
          <HelperText type="error" visible={errorDI}>
            {communication.InvalidDesignImage}
          </HelperText>
          <View style={{ width: 160 }}>
            <Checkbox.Item
              label="Display"
              position="leading"
              style={{ paddingHorizontal: 2 }}
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
              color={theme.colors.primary}
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
          <Button mode="contained" onPress={ValidateData} loading={isButtonLoading} disabled={isButtonLoading}>
            SAVE
          </Button>
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddPostNewDesignScreen;
