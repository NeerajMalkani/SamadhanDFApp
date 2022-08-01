import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, TextInput } from "react-native-paper";
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
  const [hsn, setHSN] = React.useState(route.params.type === "edit" ? route.params.data.hsnsacCode : "");

  const [gstError, setGSTError] = React.useState(false);
  const [gst, setGST] = React.useState(route.params.type === "edit" ? route.params.data.gstRate.toString() : "");

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
  const [appProviderPromotion, setAppProviderPromotion] = React.useState(route.params.type === "edit" ? route.params.data.appProviderPromotion : "");

  const [referralPointsError, setReferralPointsError] = React.useState(false);
  const [referralPoints, setReferralPoints] = React.useState(route.params.type === "edit" ? route.params.data.referralPoints : "");

  const [contractorDiscountError, setContractorDiscountError] = React.useState(false);
  const [contractorDiscount, setContractorDiscount] = React.useState(route.params.type === "edit" ? route.params.data.contractorDiscount : "");

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      dealerID = JSON.parse(userData).UserID;
      FetchBrands();
    }
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
              setCategoriesData([]);
              setServicesData([]);
              setBrandData([]);
              setUnitData([]);
            }
            FetchServicesFromActivity("Dealer", response.data.data);
            if (route.params.type === "edit") {
              FetchCategoriesFromServices("Dealer", response.data.data);
            }
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

  const FetchUnitsFromCategory = (selectedItem) => {
    console.log(
      categoriesFullData.find((el) => {
        return el.categoryName === selectedItem;
      }).id
    );
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
        console.log(response.data.data);
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
    setServiceName("");
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

  const InsertBrandSetupName = () => {
    Provider.create("dealerbrand/insertbrandsetup", { BrandSetupName: brandSetupName, DealerID: dealerID, Display: checked })
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

  const UpdateBrandSetupName = () => {
    Provider.create("dealerbrand/updatebrandsetup", { ID: route.params.data.id, BrandSetupName: brandSetupName, DealerID: dealerID, Display: checked })
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

  const ValidateBrandSetupName = () => {
    let isValid = true;
    if (brandSetupName.length === 0) {
      setBrandSetupNameError(true);
      isValid = false;
    }
    if (isValid) {
      if (route.params.type === "edit") {
        UpdateBrandSetupName();
      } else {
        InsertBrandSetupName();
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
          <TextInput mode="flat" label="Brand Prefix Name" value={brandSetupName} onChangeText={onBrandSetupNameChanged} style={{ backgroundColor: "white" }} error={brandSetupNameError} />
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
          <TextInput mode="flat" label="General Discount (%)" value={generalDiscount} onChangeText={onGeneralDiscountChanged} keyboardType="decimal-pad" style={{ backgroundColor: "white" }} error={generalDiscountError} />
          <HelperText type="error" visible={generalDiscountError}>
            {communication.InvalidGeneralDiscount}
          </HelperText>
          <TextInput mode="flat" label="App Provider Promotion (%)" value={appProviderPromotion} onChangeText={onAppProviderPromotionChanged} keyboardType="decimal-pad" style={{ backgroundColor: "white" }} error={referralPointsError} />
          <HelperText type="error" visible={appProviderPromotionError}>
            {communication.InvalidAppProviderPromotion}
          </HelperText>
          <TextInput mode="flat" label="Referral Points (%)" value={referralPoints} onChangeText={onReferralPointsChanged} keyboardType="decimal-pad" style={{ backgroundColor: "white" }} error={appProviderPromotionError} />
          <HelperText type="error" visible={referralPointsError}>
            {communication.InvalidReferralPoints}
          </HelperText>
          <TextInput mode="flat" label="Contractor Discount (%)" value={contractorDiscount} onChangeText={onContractorDiscountChanged} keyboardType="decimal-pad" style={{ backgroundColor: "white" }} error={contractorDiscountError} />
          <HelperText type="error" visible={contractorDiscountError}>
            {communication.InvalidContractorDiscount}
          </HelperText>
          <View style={{ width: 160 }}>
            <Checkbox.Item
              label="Display"
              position="leading"
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
