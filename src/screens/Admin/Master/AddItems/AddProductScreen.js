import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Subheading, Text, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";

const AddProductScreen = ({ route, navigation }) => {
  const [activityFullData, setActivityFullData] = React.useState([]);
  const [activityData, setActivityData] = React.useState([]);
  const [acivityName, setActivityName] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [errorAN, setANError] = React.useState(false);
  const activityDDRef = useRef({});

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

  const [unitFullData, setUnitFullData] = React.useState([]);
  const [unitData, setUnitsData] = React.useState([]);
  const [unitName, setUnitName] = React.useState(route.params.type === "edit" ? route.params.data.unitName : "");
  const [errorUN, setUNError] = React.useState(false);
  const unitDDRef = useRef({});

  const [hsnError, setHSNError] = React.useState(false);
  const [hsn, setHSN] = React.useState(route.params.type === "edit" ? route.params.data.hsnsacCode : "");

  const [gstError, setGSTError] = React.useState(false);
  const [gst, setGST] = React.useState(route.params.type === "edit" ? route.params.data.gstRate.toString() : "");

  const [error, setError] = React.useState(false);
  const [name, setName] = React.useState(route.params.type === "edit" ? route.params.data.productName : "");

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const FetchActvityRoles = () => {
    Provider.getAll("master/getmainactivities")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setActivityFullData(response.data.data);
            const activities = response.data.data.map((data) => data.activityRoleName);
            setActivityData(activities);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchServicesFromActivity = (selectedItem) => {
    let params = {
      ID:
        route.params.type === "edit"
          ? route.params.data.activityID
          : activityFullData.find((el) => {
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

  const FetchCategoriesFromServices = (selectedItem) => {
    let params = {
      ActivityID:
        route.params.type === "edit"
          ? route.params.data.activityID
          : activityFullData.find((el) => {
              return el.activityRoleName === acivityName;
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
            const units = response.data.data.map((data) => data.displayUnit);
            setUnitsData(units);
          }
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    FetchActvityRoles();
    if (route.params.type === "edit") {
      FetchServicesFromActivity();
      FetchCategoriesFromServices();
      FetchUnitsFromCategory();
    }
  }, []);

  const onActivityNameSelected = (selectedItem) => {
    setActivityName(selectedItem);
    if (route.params.type === "edit") {
      route.params.data.activityID = activityFullData.find((el) => {
        return el.activityRoleName === selectedItem;
      }).id;
    }
    servicesDDRef.current.reset();
    setServiceName("");
    setCategoriesFullData([]);
    setCategoriesData([]);
    setUnitsData([]);
    setANError(false);
    setHSN("");
    setGST("");
    setUnitName("");
    FetchServicesFromActivity(selectedItem);
  };

  const onServiceNameSelected = (selectedItem) => {
    setServiceName(selectedItem);
    if (route.params.type === "edit") {
      route.params.data.serviceID = servicesFullData.find((el) => {
        return el.serviceName === selectedItem;
      }).id;
    }
    categoriesDDRef.current.reset();
    setCategoriesData([]);
    setUnitsData([]);
    setCategoriesName("");
    setHSN("");
    setGST("");
    setUnitName("");
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
    setCNError(false);
    setHSNError(false);
    setGSTError(false);
    setUnitName("");
    FetchUnitsFromCategory(selectedItem);
  };

  const onUnitNameSelected = (selectedItem) => {
    setUnitName(selectedItem);
    setUNError(false);
  };

  const onHSNChanged = (text) => {
    setHSN(text);
    setHSNError(false);
  };

  const onGSTChanged = (text) => {
    setGST(text);
    setGSTError(false);
  };

  const onNameChanged = (text) => {
    setName(text);
    setError(false);
  };

  const InsertData = () => {
    Provider.create("master/insertproduct", {
      ProductName: name,
      ActivityID: activityFullData.find((el) => {
        return el.activityRoleName === acivityName;
      }).id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      CategoryID: categoriesFullData.find((el) => {
        return el.categoryName && el.categoryName === categoriesName;
      }).id,
      UnitOfSalesID: unitFullData.find((el) => {
        return el.displayUnit && el.displayUnit === unitName;
      }).id,
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
    Provider.create("master/updateproduct", {
      ProductID: route.params.data.id,
      ProductName: name,
      ActivityID: activityFullData.find((el) => {
        return el.activityRoleName === acivityName;
      }).id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      CategoryID: categoriesFullData.find((el) => {
        return el.categoryName && el.categoryName === categoriesName;
      }).id,
      UnitOfSalesID: unitFullData.find((el) => {
        return el.displayUnit && el.displayUnit === unitName;
      }).id,
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
    const objActivities = activityFullData.find((el) => {
      return el.activityRoleName && el.activityRoleName === acivityName;
    });
    if (acivityName.length === 0 || !objActivities) {
      setANError(true);
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
    if (hsn.length === 0) {
      setHSNError(true);
      isValid = false;
    }
    if (gst.length === 0) {
      setGSTError(true);
      isValid = false;
    }
    const objUnitOfSales = unitFullData.find((el) => {
      return el.displayUnit && el.displayUnit === unitName;
    });
    if (unitName.length === 0 || !objUnitOfSales) {
      setUNError(true);
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
          <Dropdown label="Select Activity Name" data={activityData} onSelected={onActivityNameSelected} isError={errorAN} selectedItem={acivityName} reference={activityDDRef} />
          <HelperText type="error" visible={errorAN}>
            {communication.InvalidActivityName}
          </HelperText>
          <Dropdown label="Select Service Name" data={servicesData} onSelected={onServiceNameSelected} isError={errorSN} selectedItem={serviceName} reference={servicesDDRef} />
          <HelperText type="error" visible={errorSN}>
            {communication.InvalidServiceName}
          </HelperText>
          <Dropdown label="Select Category Name" data={categoriesData} onSelected={onCategoriesNameSelected} isError={errorCN} selectedItem={categoriesName} reference={categoriesDDRef} />
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
          <TextInput dense mode="flat" label="Product Name" value={name} onChangeText={onNameChanged} style={{ backgroundColor: "white" }} error={error} />
          <HelperText type="error" visible={error}>
            {communication.InvalidProductName}
          </HelperText>
          <Dropdown label="Select Unit Name" data={unitData} onSelected={onUnitNameSelected} isError={errorUN} selectedItem={unitName} reference={unitDDRef} />
          <HelperText type="error" visible={errorUN}>
            {communication.InvalidUnitName}
          </HelperText>
          <View style={{ width: 160 }}>
            <Checkbox.Item
              label="Display"
              color={theme.colors.primary}
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
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
          <Button mode="contained" onPress={ValidateData}>
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

export default AddProductScreen;
