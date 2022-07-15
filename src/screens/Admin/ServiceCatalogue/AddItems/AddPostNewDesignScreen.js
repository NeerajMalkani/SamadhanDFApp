import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Subheading, Text, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { RNS3 } from "react-native-aws3";
import * as ImagePicker from "expo-image-picker";

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
  const [name, setName] = React.useState(route.params.type === "edit" ? route.params.data.designTypeName : "");

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [filePath, setFilePath] = React.useState({});
  const [uploadSuccessMessage, setUploadSuccessMessage] = React.useState("");

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
              setCategoriesData([]);
              setServicesData([]);
              setProductsData([]);
              setDesignTypeData([]);
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
      }).id;
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
    setPNError(false);
  };

  const onWorkLocationSelected = (selectedItem) => {
    setWorkLocationName(selectedItem);
    if (route.params.type === "edit") {
      route.params.data.workLocationID = workLocationFullData.find((el) => {
        return el.workLocationName === selectedItem;
      }).id;
    }
    setWLError(false);
  };

  const onNameChanged = (text) => {
    setName(text);
    setError(false);
  };

  const chooseFile = async () => {
    // let options = {
    //   mediaType: "photo",
    // };
    // launchImageLibrary(options, (response) => {
    //   console.log("Response = ", response);
    //   setUploadSuccessMessage("");
    //   if (response.didCancel) {
    //     console.log("User cancelled camera picker");
    //     return;
    //   } else if (response.errorCode == "camera_unavailable") {
    //     console.log("Camera not available on device");
    //     return;
    //   } else if (response.errorCode == "permission") {
    //     console.log("Permission not satisfied");
    //     return;
    //   } else if (response.errorCode == "others") {
    //     console.log(response.errorMessage);
    //     return;
    //   }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setFilePath(result);
    }

    //});
  };

  const uploadFile = () => {
    console.log(filePath.uri);
    if (filePath.uri) {
      if (Object.keys(filePath).length == 0) {
        alert("Please select image first");
        return;
      }
      RNS3.put(
        {
          uri: filePath.uri,
          name: "asd8sad09as-2387d098-asd97asd98",
          type: "image/jpeg",
        },
        {
          keyPrefix: "/", // Ex. myuploads/
          bucket: "samadhanerp", // Ex. aboutreact
          region: "ap-south-1", // Ex. ap-south-1
          accessKey: "AKIAZGRJKC5EP34PJHE7",
          secretKey: "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",
          successActionStatus: 201,
        }
      )
        .progress((progress) => setUploadSuccessMessage(`Uploading: ${progress.loaded / progress.total} (${progress.percent}%)`))
        .then((response) => {
          if (response.status !== 201) alert("Failed to upload image to S3");
          console.log(response.body);
          setFilePath("");
          let { bucket, etag, key, location } = response.body.postResponse;
          setUploadSuccessMessage(
            `Uploaded Successfully: 
          \n1. bucket => ${bucket}
          \n2. etag => ${etag}
          \n3. key => ${key}
          \n4. location => ${location}`
          );
        })
        .catch((ex) => {
          console.log(ex);
        });
    } else {
    }
  };

  const InsertData = () => {
    console.log(productsFullData);
    Provider.create("servicecatalogue/insertdesigntype", {
      DesignTypeName: name,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      CategoryID: categoriesFullData.find((el) => {
        return el.categoryName === categoriesName;
      }).id,
      ProductID: productsFullData.find((el) => {
        return el.productName === productsName;
      }).productID,
      Display: checked,
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
    Provider.create("servicecatalogue/updatedesigntype", {
      ID: route.params.data.id,
      DesignTypeName: name,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      CategoryID: categoriesFullData.find((el) => {
        return el.categoryName === categoriesName;
      }).id,
      ProductID: productsFullData.find((el) => {
        return el.productName === productsName;
      }).productID,
      Display: checked,
    })
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("update");
          navigation.goBack();
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
    if (isValid) {
      if (route.params.type === "edit") {
        UpdateData();
      } else {
        InsertData();
      }
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
          <TextInput mode="flat" label="Design Number" value="DC-011" editable={false} dense style={[Styles.marginVertical12, Styles.backgroundSecondaryColor]} />
          <TextInput mode="flat" label="Labour Cost" value={name} returnKeyType="done" keyboardType="decimal-pad" onChangeText={onNameChanged} style={{ backgroundColor: "white" }} error={error} />
          <HelperText type="error" visible={error}>
            {communication.InvalidDesignTypeName}
          </HelperText>
          <View>
            <Button mode="contained" onPress={chooseFile}>
              Choose Image
            </Button>
          </View>
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
          <Button mode="contained" onPress={uploadFile}>
            SAVE
          </Button>
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddPostNewDesignScreen;
