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
import { APIConverter } from "../../../../utils/apiconverter";

let dealerID = 0,
  groupID = 0;

const AddDealerProductScreen = ({ route, navigation }) => {
  //#region Variables
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

  const [unitID, setUnitID] = React.useState("");
  const [convertedUnitID, setConvertedUnitID] = React.useState("");
  const [unitName, setUnitName] = React.useState("");
  const [errorUN, setUNError] = React.useState(false);
  const [unitName2, setUnitName2] = React.useState("");

  const [unitValue, setUnitValue] = React.useState(route.params.type === "edit" ? route.params.data.unitValue : "");
  const [errorUV, setUVError] = React.useState(false);

  const [description, setDescription] = React.useState(route.params.type === "edit" ? route.params.data.description : "");
  const [errorD, setDError] = React.useState(false);

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.error);

  const ref_input2 = useRef();
  const ref_input3 = useRef();
  //#endregion

  //#region Functions

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      dealerID = JSON.parse(userData).UserID;
      groupID = JSON.parse(userData).Sess_group_refno;
      FetchBrands();
    }
  };

  const FetchBrands = () => {
    let params = {
      data: {
        Sess_UserRefno: dealerID,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.getbrandnamedealerproductform, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            const brandData = [];
            response.data.data.map((data, i) => {
              brandData.push({
                brandID: data.brandID,
                brandName: data.brandName,
                brandNameDisplay: `${data.brandName} (${data.categoryName})`,
              });
            });

            setBrandFullData(brandData);
            const brands = [];
            response.data.data.map((data) => {
              brands.push(`${data.brandName} (${data.categoryName})`);
            });
            setBrandData(brands);
            if (route.params.type === "edit") {
              const selBrand = response.data.data.find((el) => {
                return el.brandID === route.params.data.brandID;
              });

              setBrandName(`${selBrand.brandName} (${selBrand.categoryName})`);
              FetchProductsFromCategory(selBrand.brandID);
              FetchUnitsFromProduct(selBrand.brandID);
            }
          }
        }
      })
      .catch((e) => {});
  };

  const FetchProductsFromCategory = (brandID) => {
    let params = {
      data: {
        Sess_UserRefno: dealerID,
        Sess_group_refno: groupID,
        brand_refno: brandID,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.getproductnamedealerproductform, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setProductsFullData(response.data.data);
            const products = response.data.data.map((data) => data.productName);
            setProductsData(products);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchUnitsFromProduct = (brandID) => {
    let params = {
      data: {
        Sess_UserRefno: dealerID,
        Sess_group_refno: groupID,
        brand_refno: brandID,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.getproductdatadealerproductform, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setUnitID(response.data.data[0].unitID);
            setUnitName(response.data.data[0].unitOfSale);
            setUnitName2(response.data.data[0].convertedUnit);
            setConvertedUnitID(response.data.data[0].convertedUnitID);
            unitValue(response.data.data[0].convertedUnitID);
            //setUnitValue(response.data.data[0].convertedUnitValue);
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
      return el.brandNameDisplay === text;
    });

    FetchProductsFromCategory(selBrand.brandID);
    FetchUnitsFromProduct(selBrand.brandID);
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
    const datas = new FormData();
    const params = {
      Sess_UserRefno: dealerID,
      brand_refno: brandFullData.find((el) => {
        return el.brandNameDisplay === brandName;
      }).brandID,
      product_refno: productsFullData.find((el) => {
        return el.productName === productsName;
      }).id,
      price: price,
      sales_unit: unitName,
      converted_unit_value: unitValue,
      actual_unit_refno: unitID,
      convert_unit_refno: convertedUnitID,
      description: description,
      view_status: checked ? "1" : "0",
    };
    datas.append("data", JSON.stringify(params));
    datas.append(
      "product_image",
      filePath != null && filePath != undefined && filePath.type != undefined && filePath.type != null
        ? {
            name: "appimage1212.jpg",
            type: filePath.type + "/*",
            uri: Platform.OS === "android" ? filePath.uri : filePath.uri.replace("file://", ""),
          }
        : ""
    );
    Provider.createDFCommonWithHeader(Provider.API_URLS.dealerproductsetupcreate, datas)
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
    const datas = new FormData();
    const params = {
      Sess_UserRefno: dealerID,
      company_product_refno: route.params.data.id,
      brand_refno: brandFullData.find((el) => {
        return el.brandNameDisplay === brandName;
      }).brandID,
      product_refno: productsFullData.find((el) => {
        return el.productName === productsName;
      }).id,
      price: price,
      sales_unit: unitName,
      converted_unit_value: unitValue,
      actual_unit_refno: unitID,
      convert_unit_refno: convertedUnitID,
      description: description,
      view_status: checked ? "1" : "0",
    };
    datas.append("data", JSON.stringify(params));
    datas.append(
      "product_image",
      filePath != null && filePath != undefined && filePath.type != undefined && filePath.type != null
        ? {
            name: "appimage1212.jpg",
            type: filePath.type + "/*",
            uri: Platform.OS === "android" ? filePath.uri : filePath.uri.replace("file://", ""),
          }
        : ""
    );
    Provider.createDFCommonWithHeader(Provider.API_URLS.dealerproductsetupupdate, params)
      .then((response) => {
        console.log(response.data);
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
    if (route.params.type === "edit" && !isImageReplaced) {
      UpdateData();
    } else {
      if (filePath != null && filePath.uri) {
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
        if (route.params.type === "edit") {
          UpdateData();
        } else {
          InsertData();
        }
        // setSnackbarText(communication.NoImageSelectedError);
        // setSnackbarColor(theme.colors.error);
        // setSnackbarVisible(true);
      }
    }
  };

  const ValidateDealerProduct = () => {
    let isValid = true;
    const objBrands = brandFullData.find((el) => {
      return el.brandName && el.brandNameDisplay === brandName;
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
    // if (filePath === null) {
    //   setPIError(true);
    //   isValid = false;
    // }
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
  //#endregion

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
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddDealerProductScreen;
