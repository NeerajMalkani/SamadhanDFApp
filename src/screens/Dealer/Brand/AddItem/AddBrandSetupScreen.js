import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Subheading, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";

let dealerID = 0;
const AddBrandSetupScreen = ({ route, navigation }) => {
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

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const ref_input1 = useRef();
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();
  const ref_input5 = useRef();
  const myRefs = useRef([]);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      dealerID = JSON.parse(userData).UserID;
      FetchServices();
      FetchBrands();
      FetchBuyerCategories();
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
              servicesDDRef.current.reset();
              setServiceName("");
              setBrandName("");
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
              setServicesData([]);
              setBrandData([]);
              setUnitData([]);
              setSNError(false);
              setCNError(false);
              setBNError(false);
              setUNError(false);
              setHSNError(false);
              setGSTError(false);
              setGeneralDiscountError(false);
              setAppProviderPromotionError(false);
              setReferralPointsError(false);
              setContractorDiscountError(false);
              setBrandSetupNameError(false);
            }
            if (route.params.type === "edit") {
              FetchCategoriesFromServices("Dealer", response.data.data);
            }
          }
        }
      })
      .catch((e) => {});
  };
  const FetchServices = () => {
    let params = {
      DealerID: dealerID,
    };
    Provider.getAll(`dealercompanyprofile/getmyservices?${new URLSearchParams(params)}`)
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
            return el.activityRoleName === "Dealer";
          }).id
        : activityFullData.find((el) => {
            return el.activityRoleName === "Dealer";
          }).id,
      ServiceID:
        route.params.type === "edit"
          ? route.params.data.serviceID
          : servicesFullData.find((el) => {
              return el.serviceName === selectedItem;
            }).serviceID,
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
            if (route.params.type === "edit") {
              setHSN(
                response.data.data.find((el) => {
                  return el.categoryName === categoriesName;
                }).hsnsacCode
              );
              setGST(
                response.data.data
                  .find((el) => {
                    return el.categoryName === categoriesName;
                  })
                  .gstRate.toFixed(2)
              );
              FetchUnitsFromCategory();
            }
          }
        }
      })
      .catch((e) => {});
  };
  const FetchBrands = () => {
    let params = {
      DealerID: dealerID,
    };
    Provider.getAll(`dealerbrand/getbrand?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setBrandFullData(response.data.data);
            const brands = response.data.data.map((data) => data.brandName);
            setBrandData(brands);
          }
        }
      })
      .catch((e) => {});
  };
  const FetchUnitsFromCategory = (selectedItem) => {
    let params = {
      ID:
        route.params.type === "edit"
          ? route.params.data.categoryID
          : categoriesFullData.find((el) => {
              return el.categoryName === selectedItem;
            }).id,
    };
    Provider.getAll(`master/getunitbycategoryid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setUnitFullData(response.data.data);
            const units = [];
            response.data.data.map((el) => {
              units.push(el.unit1Name);
              units.push(el.unit2Name);
            });
            setUnitData(units);
          }
        }
      })
      .catch((e) => {});
  };
  const FetchBuyerCategories = () => {
    let params = {
      DealerID: dealerID,
    };
    Provider.getAll(`dealerbrand/getbuyercategory?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setBuyerCategoryFullData(response.data.data);
            if (route.params.type === "edit") {
              FetchBuyerCategoriesDiscounts(response.data.data);
            }
          }
        }
      })
      .catch((e) => {});
  };
  const FetchBuyerCategoriesDiscounts = (buyerData) => {
    let params = {
      DealerID: dealerID,
      DealerBrandID: route.params.data.brandID,
    };
    Provider.getAll(`dealerbrand/getbrandbuyermapping?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const arrBuyerDiscountData = [];
            const arrSelectedBuyerDiscountData = [];
            buyerData.map((el) => {
              const matchingData = response.data.data.find((a) => {
                return a.buyerCategoryID === el.id;
              });
              if (matchingData) {
                arrSelectedBuyerDiscountData.push({
                  buyerCategoryID: matchingData.buyerCategoryID,
                  buyerCategoryDiscount: matchingData.buyerCategoryDiscount,
                });
                el.buyerCategoryDiscount = matchingData.buyerCategoryDiscount.toFixed(2);
              }
              arrBuyerDiscountData.push(el);
            });
            setBuyerCategoryFullData(arrBuyerDiscountData);
            setSelectedBuyerCategoryFullData(arrSelectedBuyerDiscountData);
          }
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    GetUserID();
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
    FetchCategoriesFromServices(selectedItem, activityFullData);
  };
  const onCategoriesNameSelected = (selectedItem) => {
    setCategoriesName(selectedItem);
    unitDDRef.current.reset();
    setHSN(
      categoriesFullData.find((el) => {
        return el.categoryName === selectedItem;
      }).hsnsacCode
    );
    setGST(
      categoriesFullData
        .find((el) => {
          return el.categoryName === selectedItem;
        })
        .gstRate.toFixed(2)
    );
    setUnitName("");
    setCNError(false);
    setHSNError(false);
    setGSTError(false);
    setUNError(false);
    setUnitData([]);
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

  const InsertBrandBuyerMapping = () => {
    let arrBrandBuyerMapping = [...selectedBuyerCategoryFullData];
    for (let i = 0; i < arrBrandBuyerMapping.length; i++) {
      arrBrandBuyerMapping[i]["dealerID"] = dealerID;
      arrBrandBuyerMapping[i]["dealerBrandID"] = brandFullData.find((el) => {
        return el.brandName === brandName;
      }).id;
    }
    Provider.create(route.params.type === "edit" ? "dealerbrand/updatebrandbuyermapping" : "dealerbrand/insertbrandbuyermapping", arrBrandBuyerMapping)
      .then((response) => {
        if (response.data && (response.data.code === 200 || response.data.code === 204)) {
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
  const InsertBrandSetup = () => {
    let uosid = 0;
    let uosid2 = 0;
    const objUnits1 = unitFullData.find((el) => {
      return el.unit1Name && el.unit1Name === unitName;
    });
    const objUnits2 = unitFullData.find((el) => {
      return el.unit2Name && el.unit2Name === unitName;
    });
    if (objUnits1) {
      uosid = objUnits1.unit1ID;
      uosid2 = objUnits1.unit2ID;
    } else if (objUnits2) {
      uosid = objUnits2.unit2ID;
      uosid2 = objUnits2.unit2ID;
    }
    const params = {
      DealerID: dealerID,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).serviceID,
      CategoryID: categoriesFullData.find((el) => {
        return el.categoryName === categoriesName;
      }).id,
      BrandID: brandFullData.find((el) => {
        return el.brandName === brandName;
      }).id,
      UnitOfSalesID: uosid,
      UnitOfSalesID2: uosid2,
      BrandPrefixName: brandSetupName,
      GeneralDiscount: generalDiscount === "" ? 0 : generalDiscount,
      AppProviderDiscount: appProviderPromotion === "" ? 0 : appProviderPromotion,
      ReferralPoints: referralPoints === "" ? 0 : referralPoints,
      ContractorDiscount: contractorDiscount === "" ? 0 : contractorDiscount,
      Display: checked,
    };
    Provider.create("dealerbrand/insertbrandsetup", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          InsertBrandBuyerMapping();
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
  const UpdateBrandSetup = () => {
    let uosid = 0;
    let uosid2 = 0;
    const objUnits1 = unitFullData.find((el) => {
      return el.unit1Name && el.unit1Name === unitName;
    });
    const objUnits2 = unitFullData.find((el) => {
      return el.unit2Name && el.unit2Name === unitName;
    });
    if (objUnits1) {
      uosid = objUnits1.unit1ID;
      uosid2 = objUnits1.unit2ID;
    } else if (objUnits2) {
      uosid = objUnits2.unit2ID;
      uosid2 = objUnits2.unit2ID;
    }
    const params = {
      ID: route.params.data.id,
      DealerID: dealerID,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).serviceID,
      CategoryID: categoriesFullData.find((el) => {
        return el.categoryName === categoriesName;
      }).id,
      BrandID: brandFullData.find((el) => {
        return el.brandName === brandName;
      }).id,
      UnitOfSalesID: uosid,
      UnitOfSalesID2: uosid2,
      BrandPrefixName: brandSetupName,
      GeneralDiscount: generalDiscount === "" ? 0 : generalDiscount,
      AppProviderDiscount: appProviderPromotion === "" ? 0 : appProviderPromotion,
      ReferralPoints: referralPoints === "" ? 0 : referralPoints,
      ContractorDiscount: contractorDiscount === "" ? 0 : contractorDiscount,
      Display: checked,
    };
    Provider.create("dealerbrand/updatebrandsetup", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          InsertBrandBuyerMapping();
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
    const objUnits1 = unitFullData.find((el) => {
      return el.unit1Name && el.unit1Name === unitName;
    });
    const objUnits2 = unitFullData.find((el) => {
      return el.unit2Name && el.unit2Name === unitName;
    });
    if (unitName.length === 0 || (!objUnits1 && !objUnits2)) {
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
      if (route.params.type === "edit") {
        UpdateBrandSetup();
      } else {
        InsertBrandSetup();
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
          <TextInput mode="flat" label="HSN / SAC Code" value={hsn} onChangeText={onHSNChanged} error={hsnError} editable={false} dense style={[Styles.marginTop12, Styles.backgroundSecondaryColor]} />
          <HelperText type="error" visible={hsnError}>
            {communication.InvalidHSNSAC}
          </HelperText>
          <TextInput mode="flat" label="GST Rate" value={gst} onChangeText={onGSTChanged} error={gstError} editable={false} dense style={[Styles.marginTop12, Styles.backgroundSecondaryColor]} />
          <HelperText type="error" visible={gstError}>
            {communication.InvalidGSTRate}
          </HelperText>
          <TextInput ref={ref_input1} mode="flat" label="Brand Prefix Name" returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} value={brandSetupName} onChangeText={onBrandSetupNameChanged} style={{ backgroundColor: "white" }} error={brandSetupNameError} />
          <HelperText type="error" visible={brandSetupNameError}>
            {communication.InvalidBrandPrefixName}
          </HelperText>
          <Dropdown label="Brand Name" data={brandData} onSelected={onBrandChanged} isError={errorBN} selectedItem={brandName} reference={brandDDRef} />
          <HelperText type="error" visible={errorBN}>
            {communication.InvalidBrandName}
          </HelperText>
          <Dropdown label="Unit Name" data={unitData} onSelected={onUnitChanged} isError={errorUN} selectedItem={unitName} reference={unitDDRef} />
          <HelperText type="error" visible={errorUN}>
            {communication.InvalidUnitName}
          </HelperText>
          <TextInput ref={ref_input2} mode="flat" label="General Discount (%)" returnKeyType="next" onSubmitEditing={() => ref_input3.current.focus()} value={generalDiscount} onChangeText={onGeneralDiscountChanged} keyboardType="decimal-pad" style={{ backgroundColor: "white" }} error={generalDiscountError} />
          <HelperText type="error" visible={generalDiscountError}>
            {communication.InvalidGeneralDiscount}
          </HelperText>
          <TextInput ref={ref_input3} mode="flat" label="App Provider Promotion (%)" returnKeyType="next" onSubmitEditing={() => ref_input4.current.focus()} value={appProviderPromotion} onChangeText={onAppProviderPromotionChanged} keyboardType="decimal-pad" style={{ backgroundColor: "white" }} error={referralPointsError} />
          <HelperText type="error" visible={appProviderPromotionError}>
            {communication.InvalidAppProviderPromotion}
          </HelperText>
          <TextInput ref={ref_input4} mode="flat" label="Referral Points (%)" returnKeyType="next" onSubmitEditing={() => ref_input5.current.focus()} value={referralPoints} onChangeText={onReferralPointsChanged} keyboardType="decimal-pad" style={{ backgroundColor: "white" }} error={appProviderPromotionError} />
          <HelperText type="error" visible={referralPointsError}>
            {communication.InvalidReferralPoints}
          </HelperText>
          <TextInput ref={ref_input5} mode="flat" label="Contractor Discount (%)" returnKeyType="done" value={contractorDiscount} onChangeText={onContractorDiscountChanged} keyboardType="decimal-pad" style={{ backgroundColor: "white" }} error={contractorDiscountError} />
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
                    mode="flat"
                    value={k.buyerCategoryDiscount}
                    returnKeyType={i == buyerCategoryFullData.length - 1 ? "done" : "next"}
                    onSubmitEditing={() => {
                      i < buyerCategoryFullData.length - 1 ? myRefs.current[parseInt(i) + 1].focus() : null;
                    }}
                    ref={(el) => (myRefs.current[parseInt(i)] = el)}
                    label={k.buyerCategoryName}
                    onChangeText={(text) => {
                      let tempSelectedBuyerCats = [...selectedBuyerCategoryFullData];
                      for (let i = 0; i < tempSelectedBuyerCats.length; i++) {
                        if (tempSelectedBuyerCats[i].buyerCategoryID === k.id) {
                          tempSelectedBuyerCats.splice(i, 1);
                        }
                      }
                      if (text !== "") {
                        tempSelectedBuyerCats.push({
                          buyerCategoryID: k.id,
                          buyerCategoryDiscount: text,
                        });
                      }
                      k.buyerCategoryDiscount = text;
                      setSelectedBuyerCategoryFullData(tempSelectedBuyerCats);
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
          <Button mode="contained" onPress={ValidateBrandSetupName}>
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

export default AddBrandSetupScreen;
