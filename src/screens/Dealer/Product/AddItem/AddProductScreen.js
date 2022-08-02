import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef } from "react";
import { Image, ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Text, TextInput } from "react-native-paper";
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

let dealerID = 0;

const AddDealerProductScreen = ({ route, navigation }) => {
  const [activityFullData, setActivityFullData] = React.useState([]);

  const [brandFullData, setBrandFullData] = React.useState([]);
  const [brandData, setBrandData] = React.useState([]);
  const [brandName, setBrandName] = React.useState(route.params.type === "edit" ? route.params.data.brandName : "");
  const [errorBN, setBNError] = React.useState(false);
  const brandDDRef = useRef({});

  const [productsFullData, setProductsFullData] = React.useState([]);
  const [productsData, setProductsData] = React.useState([]);
  const [productsName, setProductsName] = React.useState(route.params.type === "edit" ? route.params.data.productName : "");
  const [errorPN, setPNError] = React.useState(false);
  const productsDDRef = useRef({});

  const [productImage, setProductImage] = React.useState(route.params.type === "edit" ? route.params.data.image : "");
  const [image, setImage] = React.useState(route.params.type === "edit" ? route.params.data.image : AWSImagePath + "placeholder-image.png");
  const [filePath, setFilePath] = React.useState(route.params.type === "edit" ? { name: route.params.data.image } : null);
  const [errorPI, setPIError] = React.useState(false);

  const [isImageReplaced, setIsImageReplaced] = React.useState(false);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const [price, setPrice] = React.useState(route.params.type === "edit" ? route.params.data.price : "");
  const [errorP, setPError] = React.useState(false);

  const [unitName, setUnitName] = React.useState("");
  const [errorUN, setUNError] = React.useState(false);
  const [unitName2, setUnitName2] = React.useState("");

  const [unitValue, setUnitValue] = React.useState(route.params.type === "edit" ? route.params.data.unitValue : "");
  const [errorUV, setUVError] = React.useState(false);

  const [description, setDescription] = React.useState(route.params.type === "edit" ? route.params.data.description : "");
  const [errorD, setDError] = React.useState(false);

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.error);

  const ref_input2 = useRef();
  const ref_input3 = useRef();

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      dealerID = JSON.parse(userData).UserID;
      FetchActvityRoles();
    }
  };

  const FetchActvityRoles = () => {
    Provider.getAll("master/getmainactivities")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display && el.activityRoleName === "Dealer";
            });
            setActivityFullData(response.data.data);
            if (route.params.type !== "edit") {
              brandDDRef.current.reset();
              setBrandName("");
              setBrandData([]);
              setBNError(false);
              setProductsName("");
              setProductsData([]);
              setPNError(false);
              setPrice("");
              setPError(false);
              setUnitName("");
              setUnitName2("");
              setProductImage("");
              setImage(AWSImagePath + "placeholder-image.png");
              setIsImageReplaced(false);
              setPIError(false);
              setIsButtonLoading(false);
              setFilePath(null);
              setUNError(false);
              setUnitValue("");
              setUVError(false);
              setDescription("");
              setDError(false);
            }
            FetchBrands(response.data.data);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchBrands = (activityData) => {
    let params = {
      DealerID: dealerID,
    };
    Provider.getAll(`dealerbrand/getbrandsetup?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setBrandFullData(response.data.data);
            const brands = [];
            response.data.data.map((data) => {
              brands.push(data.brandName + " (" + data.categoryName + ")");
            });
            setBrandData(brands);
            if (route.params.type === "edit") {
              const selBrand = response.data.data.find((el) => {
                return el.brandName === route.params.data.brandName;
              });
              setBrandName(selBrand.brandName + " (" + selBrand.categoryName + ")");
              setUnitName(selBrand.unitName);
              setUnitName2(selBrand.unitName2);
              route.params.data.serviceID = selBrand.serviceID;
              route.params.data.categoryID = selBrand.categoryID;
              FetchProductsFromCategory(null, activityData);
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchProductsFromCategory = (selectedItem, activityData) => {
    let params = {
      ActivityID:
        route.params.type === "edit"
          ? activityData.find((el) => {
              return el.activityRoleName === "Dealer";
            }).id
          : activityFullData.find((el) => {
              return el.activityRoleName === "Dealer";
            }).id,
      ServiceID:
        route.params.type === "edit"
          ? route.params.data.serviceID
          : brandFullData.find((el) => {
              return el.brandName + " (" + el.categoryName + ")" === selectedItem;
            }).serviceID,
      CategoryID:
        route.params.type === "edit"
          ? route.params.data.categoryID
          : brandFullData.find((el) => {
              return el.brandName + " (" + el.categoryName + ")" === selectedItem;
            }).categoryID,
    };
    console.log(params);
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

  useEffect(() => {
    GetUserID();
  }, []);

  const onBrandChanged = (text) => {
    setBrandName(text);
    productsDDRef.current.reset();
    setProductsName("");
    setPNError(false);
    setBNError(false);
    const selBrand = brandFullData.find((el) => {
      return el.brandName + " (" + el.categoryName + ")" === text;
    });
    setUnitName(selBrand.unitName);
    setUnitName2(selBrand.unitName2);
    FetchProductsFromCategory(text);
  };

  const onProductsNameSelected = (text) => {
    setProductsName(text);
    setPNError(false);
  };

  const onPriceChanged = (text) => {
    setPrice(text);
    setPError(false);
  };

  const onSalesUnitChanged = (text) => {
    setUnitName(text);
    setUNError(false);
  };

  const onUnitValueChanged = (text) => {
    setUnitValue(text);
    setUVError(false);
  };

  const onDescriptionChanged = (text) => {
    setDescription(text);
    setDError(false);
  };

  const chooseFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setPIError(false);
      const arrExt = result.uri.split(".");
      const unique_id = uuid.v4();
      setProductImage(AWSImagePath + unique_id + "." + arrExt[arrExt.length - 1]);
      setImage(result.uri);
      setFilePath(result);
      if (route.params.type === "edit") {
        setIsImageReplaced(true);
      }
    }
  };

  const InsertData = () => {
    const params = {
      DealerID: dealerID,
      BrandID: brandFullData.find((el) => {
        return el.brandName + " (" + el.categoryName + ")" === brandName;
      }).brandID,
      ProductID: productsFullData.find((el) => {
        return el.productName === productsName;
      }).productID,
      Image: productImage,
      Price: price,
      UnitValue: unitValue,
      Description: description,
      Display: checked,
    };
    Provider.create("dealerproduct/insertproduct", params)
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
    const params = {
      ID: route.params.data.id,
      DealerID: dealerID,
      BrandID: brandFullData.find((el) => {
        return el.brandName + " (" + el.categoryName + ")" === brandName;
      }).brandID,
      ProductID: productsFullData.find((el) => {
        return el.productName === productsName;
      }).productID,
      Image: productImage,
      Price: price,
      UnitValue: unitValue,
      Description: description,
      Display: checked,
    };
    Provider.create("dealerproduct/updateproduct", params)
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

  const uploadFile = () => {
    console.log("here");
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
            name: productImage.split(AWSImagePath)[1],
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

  const ValidateDealerProduct = () => {
    let isValid = true;
    const objBrands = brandFullData.find((el) => {
      return el.brandName && el.brandName + " (" + el.categoryName + ")" === brandName;
    });
    if (brandName.length === 0 || !objBrands) {
      setBNError(true);
      isValid = false;
    }
    const objProducts = productsFullData.find((el) => {
      return el.productName && el.productName === productsName;
    });
    if (productsName.length === 0 || !objProducts) {
      setPNError(true);
      isValid = false;
    }
    if (filePath === null) {
      setPIError(true);
      isValid = false;
    }
    if (price.length === 0) {
      setPError(true);
      isValid = false;
    }
    if (unitName.length === 0) {
      setUNError(true);
      isValid = false;
    }
    if (unitValue.length === 0) {
      setUVError(true);
      isValid = false;
    }
    if (description.length === 0) {
      setDError(true);
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
          <Dropdown label="Brand Name" data={brandData} onSelected={onBrandChanged} isError={errorBN} selectedItem={brandName} reference={brandDDRef} />
          <HelperText type="error" visible={errorBN}>
            {communication.InvalidBrandName}
          </HelperText>
          <Dropdown label="Product Name" data={productsData} onSelected={onProductsNameSelected} isError={errorPN} selectedItem={productsName} reference={productsDDRef} />
          <HelperText type="error" visible={errorPN}>
            {communication.InvalidProductName}
          </HelperText>
          <View style={[Styles.flexRow, Styles.flexAlignEnd, Styles.marginTop16]}>
            <Image source={{ uri: image }} style={[Styles.width104, Styles.height96, Styles.border1]} />
            <Button mode="text" onPress={chooseFile}>
              {filePath !== null ? "Replace" : "Choose Image"}
            </Button>
          </View>
          <HelperText type="error" visible={errorPI}>
            {communication.InvalidDesignImage}
          </HelperText>
          <TextInput mode="flat" label="Price" dense value={price} returnKeyType="next" keyboardType="decimal-pad" onChangeText={onPriceChanged} style={{ backgroundColor: "white" }} error={errorP} />
          <HelperText type="error" visible={errorP}>
            {communication.InvalidPrice}
          </HelperText>
          <TextInput mode="flat" label="Sales Unit" dense value={unitName} editable={false} onChangeText={onSalesUnitChanged} error={errorUN} />
          <HelperText type="error" visible={errorUN}>
            {communication.InvalidUnitName}
          </HelperText>
          <View style={[Styles.flexRow, Styles.flexAlignCenter]}>
            <Text style={[Styles.textCenter, { flex: unitName === "" ? 0 : 1 }]}>{unitName === "" ? "" : "1 " + unitName + " ="}</Text>
            <View style={[Styles.flex3]}>
              <TextInput mode="flat" label="Unit Value" dense value={unitValue} returnKeyType="next" keyboardType="decimal-pad" onChangeText={onUnitValueChanged} style={{ backgroundColor: "white" }} error={errorUV} />
              <HelperText type="error" visible={errorUV}>
                {communication.InvalidUnitValue}
              </HelperText>
            </View>
            <Text style={[Styles.textCenter, { flex: unitName2 === "" ? 0 : 1 }]}>{unitName2}</Text>
          </View>
          <TextInput mode="flat" label="Description" dense value={description} returnKeyType="done" onChangeText={onDescriptionChanged} style={{ backgroundColor: "white" }} error={errorD} />
          <HelperText type="error" visible={errorD}>
            {communication.InvalidDescription}
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
          <Button mode="contained" onPress={ValidateDealerProduct} loading={isButtonLoading}>
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

export default AddDealerProductScreen;
