import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Subheading, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { APIConverter } from "../../../../utils/apiconverter";
import { communication } from "../../../../utils/communication";

let dealerID = 0;
const AddDealerBrandSetupScreen = ({ route, navigation }) => {
  //#region Variables

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

  const [hsnError, setHSNError] = React.useState(false);
  const [hsn, setHSN] = React.useState("");

  const [gstError, setGSTError] = React.useState(false);
  const [gst, setGST] = React.useState("");

  const [brandSetupNameError, setBrandSetupNameError] = React.useState(false);
  const [brandSetupName, setBrandSetupName] = React.useState(route.params.type === "edit" ? route.params.data.brandPrefixName : "");

  const [brandFullData, setBrandFullData] = React.useState([]);
  const [brandData, setBrandData] = React.useState([]);
  const [brandName, setBrandName] = React.useState(route.params.type === "edit" ? route.params.data.brandName : "");
  const [errorBN, setBNError] = React.useState(false);
  const brandDDRef = useRef({});

  const [unitFullData, setUnitFullData] = React.useState([]);
  const [unitData, setUnitData] = React.useState([]);
  const [unitName, setUnitName] = React.useState(route.params.type === "edit" ? route.params.data.unitName : "");
  const [errorUN, setUNError] = React.useState(false);
  const unitDDRef = useRef({});

  const [generalDiscountError, setGeneralDiscountError] = React.useState(false);
  const [generalDiscount, setGeneralDiscount] = React.useState(route.params.type === "edit" ? route.params.data.generalDiscount : "");

  const [appProviderPromotionError, setAppProviderPromotionError] = React.useState(false);
  const [appProviderPromotion, setAppProviderPromotion] = React.useState(route.params.type === "edit" ? route.params.data.appProviderDiscount : "");

  const [referralPointsError, setReferralPointsError] = React.useState(false);
  const [referralPoints, setReferralPoints] = React.useState(route.params.type === "edit" ? route.params.data.referralPoints : "");

  const [contractorDiscountError, setContractorDiscountError] = React.useState(false);
  const [contractorDiscount, setContractorDiscount] = React.useState(route.params.type === "edit" ? route.params.data.contractorDiscount : "");

  const [buyerCategoryFullData, setBuyerCategoryFullData] = React.useState([]);
  const [selectedBuyerCategoryFullData, setSelectedBuyerCategoryFullData] = React.useState([]);

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const ref_input1 = useRef();
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();
  const ref_input5 = useRef();
  const myRefs = useRef([]);
  //#endregion

  //#region Functions
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      dealerID = JSON.parse(userData).UserID;
      FetchServices();
      FetchBrands();
      if (route.params.type === "edit") {
        setBuyerCategoryFullData(route.params.data.discountData);
        setSelectedBuyerCategoryFullData(route.params.data.discountData);
      } else {
        FetchBuyerCategories();
      }
    }
  };

  const FetchServices = () => {
    let params = {
      data: {
        Sess_UserRefno: dealerID,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.ServiceNamePopupMaterialSetup, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setServicesFullData(response.data.data);
            if (route.params.type === "edit") {
              FetchCategoriesFromServices(route.params.data.serviceName, response.data.data);
            }
            const services = response.data.data.map((data) => data.serviceName);
            setServicesData(services);
            if (route.params.type !== "edit") {
              setBrandSetupName("");
              setCategoriesName("");
              setHSN("");
              setGST("");
              setUnitName("");
              setGeneralDiscount("");
              setAppProviderPromotion("");
              setReferralPoints("");
              setContractorDiscount("");
              setCategoriesData([]);
              setUnitData([]);
              setSNError(false);
              setCNError(false);
              setUNError(false);
              setHSNError(false);
              setGSTError(false);
              setGeneralDiscountError(false);
              setAppProviderPromotionError(false);
              setReferralPointsError(false);
              setContractorDiscountError(false);
              setBrandSetupNameError(false);
            }
          }
        }
      })
      .catch((e) => {});
  };
  const FetchCategoriesFromServices = (selectedItem, servicesDataParam) => {
    let params = {
      data: {
        Sess_UserRefno: dealerID,
        service_refno: servicesDataParam
          ? servicesDataParam.find((el) => {
              return el.serviceName === selectedItem;
            }).id
          : servicesFullData.find((el) => {
              return el.serviceName === selectedItem;
            }).id,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.CategoryNamePopupMaterialSetup, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setCategoriesFullData(response.data.data);
            const categories = response.data.data.map((data) => data.categoryName);
            setCategoriesData(categories);
            if (route.params.type === "edit") {
              FetchCategoryDataFromCategory(route.params.data.categoryName, response.data.data);
              FetchUnitsFromCategory(route.params.data.categoryName, response.data.data);
            }
          }
        }
      })
      .catch((e) => {});
  };
  const FetchCategoryDataFromCategory = (selectedItem, categoriesDataParam) => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        category_refno: categoriesDataParam
          ? categoriesDataParam.find((el) => {
              return el.categoryName === selectedItem;
            }).id
          : categoriesFullData.find((el) => {
              return el.categoryName === selectedItem;
            }).id,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.CategoryDataServiceProduct, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setHSN(response.data.data[0].hsnsacCode);
            setGST(response.data.data[0].gstRate);
          }
        }
      })
      .catch((e) => {});
  };
  const FetchBrands = () => {
    let params = {
      data: {
        Sess_UserRefno: dealerID,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.BrandNameDealerBrandSetup, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setBrandFullData(response.data.data);
            const brands = response.data.data.map((data) => data.brandName);
            setBrandData(brands);
          }
        }
      })
      .catch((e) => {});
  };
  const FetchUnitsFromCategory = (selectedItem, categoriesDataParam) => {
    let params = {
      data: {
        Sess_UserRefno: dealerID,
        category_refno: categoriesDataParam
          ? categoriesDataParam.find((el) => {
              return el.categoryName === selectedItem;
            }).id
          : categoriesFullData.find((el) => {
              return el.categoryName === selectedItem;
            }).id,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.UnitOfSaleDealerBrandSetup, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setUnitFullData(response.data.data);
            const units = response.data.data.map((data) => data.displayUnit);
            setUnitData(units);
          }
        }
      })
      .catch((e) => {});
  };
  const FetchBuyerCategories = () => {
    let params = {
      data: {
        Sess_UserRefno: dealerID,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.BuyerCategoryDiscountDealerBrandSetup, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            setBuyerCategoryFullData(response.data.data);
          }
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    GetUserID();
  }, []);

  const onServiceNameSelected = (selectedItem) => {
    setServiceName(selectedItem);
    categoriesDDRef.current.reset();
    setCategoriesName("");
    setHSN("");
    setGST("");
    setUnitName("");
    setCategoriesData([]);
    setUnitData([]);
    setSNError(false);
    setCNError(false);
    setHSNError(false);
    setGSTError(false);
    setUNError(false);
    FetchCategoriesFromServices(selectedItem);
  };
  const onCategoriesNameSelected = (selectedItem) => {
    setCategoriesName(selectedItem);
    unitDDRef.current.reset();
    setUnitName("");
    setCNError(false);
    setHSNError(false);
    setGSTError(false);
    setUNError(false);
    setUnitData([]);
    FetchCategoryDataFromCategory(selectedItem);
    FetchUnitsFromCategory(selectedItem);
  };
  const onHSNChanged = (text) => {
    setHSN(text);
    setHSNError(false);
  };
  const onGSTChanged = (text) => {
    setGST(text);
    setGSTError(false);
  };
  const onBrandSetupNameChanged = (text) => {
    setBrandSetupName(text);
    setBrandSetupNameError(false);
  };
  const onBrandChanged = (text) => {
    setBrandName(text);
    setBNError(false);
  };
  const onGeneralDiscountChanged = (text) => {
    setGeneralDiscount(text);
    setGeneralDiscountError(false);
  };
  const onAppProviderPromotionChanged = (text) => {
    setAppProviderPromotion(text);
    setAppProviderPromotionError(false);
  };
  const onReferralPointsChanged = (text) => {
    setReferralPoints(text);
    setReferralPointsError(false);
  };
  const onContractorDiscountChanged = (text) => {
    setContractorDiscount(text);
    setContractorDiscountError(false);
  };
  const onUnitChanged = (text) => {
    setUnitName(text);
    setUNError(false);
  };

  const InsertBrandSetup = () => {
    const objBuyerCatRefNo = new Object();
    const objDiscountPerc = new Object();
    selectedBuyerCategoryFullData.map((k, i) => {
      objBuyerCatRefNo[(i + 1).toString()] = k.id;
      objDiscountPerc[(i + 1).toString()] = k.buyerCategoryDiscount;
    });
    const params = {
      data: {
        Sess_UserRefno: dealerID,
        service_refno: servicesFullData.find((el) => {
          return el.serviceName === serviceName;
        }).id,
        category_refno: categoriesFullData.find((el) => {
          return el.categoryName === categoriesName;
        }).id,
        brand_master_refno: brandFullData.find((el) => {
          return el.brandName === brandName;
        }).id,
        unit_refno: unitFullData.find((el) => {
          return el.displayUnit === unitName;
        }).unitOfSalesID,
        brand_prefix_name: brandSetupName,
        general_discount_perc: generalDiscount === "" ? 0 : generalDiscount,
        promotion_perc: appProviderPromotion === "" ? 0 : appProviderPromotion,
        referral_points_perc: referralPoints === "" ? 0 : referralPoints,
        contractor_discount_perc: contractorDiscount === "" ? 0 : contractorDiscount,
        view_status: checked,
        buyercategory_refno: objBuyerCatRefNo,
        discount_perc: objDiscountPerc,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.DealerBrandSetupCreate, params)
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
  const UpdateBrandSetup = () => {
    const objBuyerCatRefNo = new Object();
    const objDiscountPerc = new Object();
    selectedBuyerCategoryFullData.map((k, i) => {
      objBuyerCatRefNo[(i + 1).toString()] = k.id;
      objDiscountPerc[(i + 1).toString()] = k.buyerCategoryDiscount;
    });
    const params = {
      data: {
        Sess_UserRefno: dealerID,
        brand_refno: route.params.data.id,
        service_refno: servicesFullData.find((el) => {
          return el.serviceName === serviceName;
        }).id,
        category_refno: categoriesFullData.find((el) => {
          return el.categoryName === categoriesName;
        }).id,
        brand_master_refno: brandFullData.find((el) => {
          return el.brandName === brandName;
        }).id,
        unit_refno: unitFullData.find((el) => {
          return el.displayUnit === unitName;
        }).unitOfSalesID,
        brand_prefix_name: brandSetupName,
        general_discount_perc: generalDiscount === "" ? 0 : generalDiscount,
        promotion_perc: appProviderPromotion === "" ? 0 : appProviderPromotion,
        referral_points_perc: referralPoints === "" ? 0 : referralPoints,
        contractor_discount_perc: contractorDiscount === "" ? 0 : contractorDiscount,
        view_status: checked,
        buyercategory_refno: objBuyerCatRefNo,
        discount_perc: objDiscountPerc,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.DealerBrandSetupUpdate, params)
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
  const ValidateBrandSetupName = () => {
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
    if (hsn.length === 0) {
      setHSNError(true);
      isValid = false;
    }
    if (gst.length === 0) {
      setGSTError(true);
      isValid = false;
    }
    const objUnits = unitFullData.find((el) => {
      return el.displayUnit === unitName;
    });
    if (unitName.length === 0 || !objUnits) {
      setUNError(true);
      isValid = false;
    }
    const objBrands = brandFullData.find((el) => {
      return el.brandName && el.brandName === brandName;
    });
    if (brandName.length === 0 || !objBrands) {
      setBNError(true);
      isValid = false;
    }
    if (brandSetupName.length === 0) {
      setBrandSetupNameError(true);
      isValid = false;
    }
    if (generalDiscount.length === 0) {
      setGeneralDiscountError(true);
      isValid = false;
    }
    if (appProviderPromotion.length === 0) {
      setAppProviderPromotionError(true);
      isValid = false;
    }
    if (referralPoints.length === 0) {
      setReferralPointsError(true);
      isValid = false;
    }
    if (contractorDiscount.length === 0) {
      setContractorDiscountError(true);
      isValid = false;
    }

    if (isValid) {
      setIsButtonLoading(true);
      if (route.params.type === "edit") {
        UpdateBrandSetup();
      } else {
        InsertBrandSetup();
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
          <TextInput mode="outlined" label="HSN / SAC Code" value={hsn} onChangeText={onHSNChanged} error={hsnError} editable={false} dense style={[Styles.marginTop12, Styles.backgroundSecondaryColor]} />
          <HelperText type="error" visible={hsnError}>
            {communication.InvalidHSNSAC}
          </HelperText>
          <TextInput mode="outlined" label="GST Rate" value={gst} onChangeText={onGSTChanged} error={gstError} editable={false} dense style={[Styles.marginTop12, Styles.backgroundSecondaryColor]} />
          <HelperText type="error" visible={gstError}>
            {communication.InvalidGSTRate}
          </HelperText>
          <TextInput ref={ref_input1} mode="outlined" label="Brand Prefix Name" returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} value={brandSetupName} onChangeText={onBrandSetupNameChanged} style={{ backgroundColor: "white" }} error={brandSetupNameError} />
          <HelperText type="error" visible={brandSetupNameError}>
            {communication.InvalidBrandPrefixName}
          </HelperText>
          <Dropdown label="Brand Name" data={brandData} onSelected={onBrandChanged} isError={errorBN} selectedItem={brandName} reference={brandDDRef} />
          <HelperText type="error" visible={errorBN}>
            {communication.InvalidBrandName}
          </HelperText>
          <Dropdown label="Unit of Sales" data={unitData} onSelected={onUnitChanged} isError={errorUN} selectedItem={unitName} reference={unitDDRef} />
          <HelperText type="error" visible={errorUN}>
            {communication.InvalidUnitName}
          </HelperText>
          <TextInput ref={ref_input2} mode="outlined" label="General Discount (%)" returnKeyType="next" onSubmitEditing={() => ref_input3.current.focus()} value={generalDiscount} onChangeText={onGeneralDiscountChanged} keyboardType="decimal-pad" style={{ backgroundColor: "white" }} error={generalDiscountError} />
          <HelperText type="error" visible={generalDiscountError}>
            {communication.InvalidGeneralDiscount}
          </HelperText>
          <TextInput ref={ref_input3} mode="outlined" label="App Provider Promotion (%)" returnKeyType="next" onSubmitEditing={() => ref_input4.current.focus()} value={appProviderPromotion} onChangeText={onAppProviderPromotionChanged} keyboardType="decimal-pad" style={{ backgroundColor: "white" }} error={referralPointsError} />
          <HelperText type="error" visible={appProviderPromotionError}>
            {communication.InvalidAppProviderPromotion}
          </HelperText>
          <TextInput ref={ref_input4} mode="outlined" label="Referral Points (%)" returnKeyType="next" onSubmitEditing={() => ref_input5.current.focus()} value={referralPoints} onChangeText={onReferralPointsChanged} keyboardType="decimal-pad" style={{ backgroundColor: "white" }} error={appProviderPromotionError} />
          <HelperText type="error" visible={referralPointsError}>
            {communication.InvalidReferralPoints}
          </HelperText>
          <TextInput ref={ref_input5} mode="outlined" label="Contractor Discount (%)" returnKeyType="done" value={contractorDiscount} onChangeText={onContractorDiscountChanged} keyboardType="decimal-pad" style={{ backgroundColor: "white" }} error={contractorDiscountError} />
          <HelperText type="error" visible={contractorDiscountError}>
            {communication.InvalidContractorDiscount}
          </HelperText>
          {buyerCategoryFullData.length > 0 ? (
            <View>
              <Subheading>Buyer's Category Discount</Subheading>
              {buyerCategoryFullData.map((k, i) => {
                return (
                  <TextInput
                    key={i}
                    mode="outlined"
                    value={k.buyerCategoryDiscount}
                    returnKeyType={i == buyerCategoryFullData.length - 1 ? "done" : "next"}
                    onSubmitEditing={() => {
                      i < buyerCategoryFullData.length - 1 ? myRefs.current[parseInt(i) + 1].focus() : null;
                    }}
                    ref={(el) => (myRefs.current[parseInt(i)] = el)}
                    label={k.buyerCategoryName}
                    onChangeText={(text) => {
                      let tempSelectedBuyerCats = [...selectedBuyerCategoryFullData];
                      tempSelectedBuyerCats.map((a) => {
                        if (a.id === k.id) {
                          k.buyerCategoryDiscount = text;
                        }
                      });
                      setSelectedBuyerCategoryFullData(tempSelectedBuyerCats);
                      // for (let i = 0; i < tempSelectedBuyerCats.length; i++) {
                      //   if (tempSelectedBuyerCats[i].buyerCategoryID === k.id) {
                      //     tempSelectedBuyerCats.splice(i, 1);
                      //   }
                      // }
                      // if (text !== "") {
                      //   tempSelectedBuyerCats.push({
                      //     buyerCategoryID: k.id,
                      //     buyerCategoryDiscount: text,
                      //   });
                      // }
                      // k.buyerCategoryDiscount = text;
                      // setSelectedBuyerCategoryFullData(tempSelectedBuyerCats);
                    }}
                    keyboardType="decimal-pad"
                    style={{ backgroundColor: "white" }}
                  />
                );
              })}
            </View>
          ) : null}
          <View style={{ width: 160, marginTop: 16 }}>
            <Checkbox.Item label="Display" position="leading" labelStyle={{ textAlign: "left", paddingLeft: 8 }} color={theme.colors.primary} status={checked ? "checked" : "unchecked"} onPress={() => setChecked(!checked)} />
          </View>
        </View>
      </ScrollView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content>
          <Button mode="contained" loading={isButtonLoading} disabled={isButtonLoading} onPress={ValidateBrandSetupName}>
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

export default AddDealerBrandSetupScreen;
