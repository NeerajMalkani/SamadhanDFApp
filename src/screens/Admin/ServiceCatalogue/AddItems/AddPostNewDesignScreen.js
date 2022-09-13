import React, { useEffect, useRef } from "react";
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

const AddPostNewDesignScreen = ({ route, navigation }) => {
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

  const designNumber = React.useState("DC-" + (parseInt(route.params.data.count) + 1).toString());
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
            FetchServicesFromActivity("Contractor", response.data.data);
            if (route.params.type === "edit") {
              FetchCategoriesFromServices("Contractor", response.data.data);
              FetchProductsFromCategory("Contractor", response.data.data);
              FetchDesignTypeFromProductID();
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchWorkLocation = () => {
    Provider.getAll("servicecatalogue/getworklocations")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setWorkLocationFullData(response.data.data);
            const workLocations = response.data.data.map((data) => data.workLocationName);
            setWorkLocationData(workLocations);
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

  const FetchDesignTypeFromProductID = (selectedItem) => {
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
    Provider.getAll(`servicecatalogue/getdesigntypebyproductidformaterialsetup?${new URLSearchParams(params)}`)
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
    FetchWorkLocation();
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
    setDesignTypeName("");
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
    setDesignTypeName("");
    FetchProductsFromCategory(selectedItem);
  };

  const onProductsNameSelected = (selectedItem) => {
    setProductsName(selectedItem);
    if (route.params.type === "edit") {
      route.params.data.productID = productsFullData.find((el) => {
        return el.productName === selectedItem;
      }).productID;
    }
    const labCo = productsFullData.find((el) => {
      return el.productName === selectedItem;
    }).rateWithoutMaterials;
    if (labCo) {
      setName(parseFloat(labCo).toFixed(2));
    } else {
      setName("");
    }
    designTypeDDRef.current.reset();
    setPNError(false);
    setDesignTypeData([]);
    setDesignTypeName("");
    FetchDesignTypeFromProductID(selectedItem);
  };

  const onDesignTypeNameSelected = (selectedItem) => {
    setDesignTypeName(selectedItem);
    if (route.params.type === "edit") {
      route.params.data.designTypeID = productsFullData.find((el) => {
        return el.productName === selectedItem;
      }).id;
    }
    setDTError(false);
  };

  const onWorkLocationSelected = (selectedItem) => {
    setWorkLocationName(selectedItem);
    setWLError(false);
    if (route.params.type === "edit") {
      route.params.data.workLocationID = workLocationFullData.find((el) => {
        return el.workLocationName === selectedItem;
      }).id;
    }
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

  const uploadFile = () => {
    if (route.params.type === "edit" && !isImageReplaced) {
      UpdateData();
    } else {
      if (filePath.uri) {
        if (Object.keys(filePath).length == 0) {
          setSnackbarText(communication.NoImageSelectedError);
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
          return;
        }
        RNS3.put(
          {
            uri: filePath.uri,
            name: designImage.split(AWSImagePath)[1],
            type: "image/*",
          },
          {
            keyPrefix: "",
            bucket: creds.awsBucket,
            region: creds.awsRegion,
            accessKey: creds.awsAccessKey,
            secretKey: creds.awsSecretKey,
            successActionStatus: 201,
          }
        )
          .progress((progress) => {
            setIsButtonLoading(true);
            setSnackbarText(`Uploading: ${progress.loaded / progress.total} (${progress.percent}%)`);
          })
          .then((response) => {
            setIsButtonLoading(false);
            if (response.status !== 201) {
              setSnackbarVisible(true);
              setSnackbarColor(theme.colors.error);
              setSnackbarText(communication.FailedUploadError);
            } else {
              if (route.params.type === "edit") {
                UpdateData();
              } else {
                InsertData();
              }
            }
          })
          .catch((ex) => {
            console.log(ex);
            setIsButtonLoading(false);
            setSnackbarVisible(true);
            setSnackbarColor(theme.colors.error);
            setSnackbarText(communication.FailedUploadError);
          });
      } else {
        setSnackbarText(communication.NoImageSelectedError);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
      }
    }
  };

  const InsertData = () => {
    Provider.create("servicecatalogue/insertpostnewdesigntype", {
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      CategoryID: categoriesFullData.find((el) => {
        return el.categoryName === categoriesName;
      }).id,
      ProductID: productsFullData.find((el) => {
        return el.productName === productsName;
      }).productID,
      DesignTypeID: designTypeFullData.find((el) => {
        return el.designTypeName === designTypeName;
      }).id,
      WorkLocationID: workLocationFullData.find((el) => {
        return el.workLocationName === workLocationName;
      }).id,
      DesignNumber: designNumber[0],
      DesignImage: designImage,
      LabourCost: name,
      Display: checked,
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
    Provider.create("servicecatalogue/updatepostnewdesigntype", {
      ID: route.params.data.id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      CategoryID: categoriesFullData.find((el) => {
        return el.categoryName === categoriesName;
      }).id,
      ProductID: productsFullData.find((el) => {
        return el.productName === productsName;
      }).productID,
      DesignTypeID: designTypeFullData.find((el) => {
        return el.designTypeName === designTypeName;
      }).id,
      WorkLocationID: workLocationFullData.find((el) => {
        return el.workLocationName === workLocationName;
      }).id,
      DesignNumber: designNumber[0],
      DesignImage: designImage,
      LabourCost: name,
      Display: checked,
    })
      .then((response) => {
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
      uploadFile();
    }
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
          <Dropdown label="Product Design Type" data={designTypeData} onSelected={onDesignTypeNameSelected} isError={errorDT} selectedItem={designTypeName} reference={designTypeDDRef} />
          <HelperText type="error" visible={errorDT}>
            {communication.InvalidDesignTypeName}
          </HelperText>
          <Dropdown label="Work Location" data={workLocationData} onSelected={onWorkLocationSelected} isError={errorWL} selectedItem={workLocationName} reference={workLocationDDRef} />
          <HelperText type="error" visible={errorWL}>
            {communication.InvalidWorkLocationName}
          </HelperText>
          <TextInput mode="flat" label="Design Number" value={designNumber[0]} editable={false} dense style={[Styles.marginVertical12, Styles.backgroundSecondaryColor]} />
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
          <Button mode="contained" onPress={ValidateData} loading={isButtonLoading}>
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
