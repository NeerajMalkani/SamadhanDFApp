import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Card,
  Checkbox,
  HelperText,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { APIConverter } from "../../../../utils/apiconverter";
import { communication } from "../../../../utils/communication";
import DFButton from "../../../../components/Button";

let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
const AddBrandConversationValue = ({ route, navigation }) => {
  //#region Variables

  const [servicesFullData, setServicesFullData] = React.useState([]);
  const [servicesData, setServicesData] = React.useState([]);
  const [serviceName, setServiceName] = React.useState("");
  const [errorSN, setSNError] = React.useState(false);
  const servicesDDRef = useRef({});

  const [categoriesFullData, setCategoriesFullData] = React.useState([]);
  const [categoriesData, setCategoriesData] = React.useState([]);
  const [categoriesName, setCategoriesName] = React.useState("");
  const [errorCN, setCNError] = React.useState(false);
  const categoriesDDRef = useRef({});

  const [brandFullData, setBrandFullData] = React.useState([]);
  const [brandData, setBrandData] = React.useState([]);
  const [brandName, setBrandName] = React.useState("");
  const [errorBN, setBNError] = React.useState(false);
  const brandDDRef = useRef({});

  const [conversionvalueError, setConversionValueError] = React.useState(false);
  const [conversionvalue, setConversionValue] = React.useState(
    route.params.type === "edit" ? route.params.data?.conversion_value : ""
  );

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [checked, setChecked] = React.useState(
    route.params.type === "edit"
      ? route.params.data.view_status === "1"
        ? true
        : false
      : true
  );

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const ref_input4 = useRef();
  const ref_input5 = useRef();
  //#endregion

  const [serviceFullD, setServiceFullD] = React.useState([]);
  const [serviceArray, setServiceArray] = React.useState([]);

  const [categoryFullD, setCategoryFullD] = React.useState([]);
  const [categoryArray, setCategoryArray] = React.useState([]);

  const [brandFullD, setBrandFullD] = React.useState([]);
  const [brandArray, setBrandArray] = React.useState([]);
  const FetchActvityRoles = () => {
    const params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
      },
    };
    Provider.createDFManufacturer(
      Provider.API_URLS.getservicenamebrandconversionform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            setServiceFullD(() => {
              return response.data.data;
            });
            let filter = response.data.data.map((item) => item.service_name);
            setServiceArray(filter);
            setServiceName(
              filter.includes(route.params.data.service_name)
                ? route.params.data.service_name
                : filter[0]
            );
          }
        }
      })
      .catch((e) => console.log(e));
  };

  const GetUserID = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData !== null) {
        Sess_UserRefno = JSON.parse(userData).UserID;
        Sess_company_refno = JSON.parse(userData).Sess_company_refno;
        Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
        FetchActvityRoles();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    GetUserID();
  }, []);

  useEffect(() => {
    if (serviceName !== "") {
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          service_refno: serviceFullD.find(
            (item) => item.service_name === serviceName
          ).service_refno,
        },
      };
      Provider.createDFManufacturer(
        Provider.API_URLS.getcategorynamebrandconversionform,
        params
      )
        .then((response) => {
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              setCategoryFullD(response.data.data);
              let filter = response.data.data.map((item) => item.category_name);
              setCategoryArray(filter);
              setCategoriesName(
                filter.includes(route.params.data.category_name)
                  ? route.params.data.category_name
                  : filter[0]
              );
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [serviceName]);

  useEffect(() => {
    if (categoriesName !== "") {
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          category_refno: categoryFullD.find(
            (item) => item.category_name === categoriesName
          ).category_refno,
        },
      };
      Provider.createDFManufacturer(
        Provider.API_URLS.getbrandnamebrandconversionform,
        params
      )
        .then((response) => {
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              setBrandFullD(response.data.data);
              let filter = response.data.data.map((item) => item.brand_name);
              setBrandArray(filter);
              setBrandName(
                filter.includes(route.params.data.brand_name)
                  ? route.params.data.brand_name
                  : filter[0]
              );
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [categoriesName]);

  const onServiceNameSelected = (selectedItem) => {
    setCategoriesName("");
    setBrandName("");
    setBrandArray([]);
    setSNError(false);
    setCategoryArray([]);
    setServiceName(selectedItem);
    setSNError(false);
    setCNError(false);
    setBNError(false);
    categoriesDDRef.current.reset();
  };

  const onCategoriesNameSelected = (selectedItem) => {
    setBrandArray([]);
    setBrandName("");
    setSNError(false);
    setCNError(false);
    setBNError(false);
    setCategoriesName(selectedItem);
    // productsDDRef.current.reset();
  };

  const onBrandNameSelected = (selectedItem) => {
    setSNError(false);
    setCNError(false);
    setBNError(false);
    setBrandName(selectedItem);
    // productsDDRef.current.reset();
  };

  const onCVChanged = (text) => {
    setConversionValue(text);
    setConversionValueError(false);
  };

  const UpdateData = () => {
    if (route.params.type === "edit") {
      const params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          mf_brandvalue_refno: route.params.data.mf_brandvalue_refno,
          service_refno: serviceFullD.find(
            (item) => item.service_name === serviceName
          ).service_refno,
          category_refno: categoryFullD.find(
            (item) => item.category_name === categoriesName
          ).category_refno,
          brand_refno: brandFullD.find((item) => item.brand_name === brandName)
            .brand_refno,
          conversion_value: conversionvalue,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          view_status: checked ? "1" : "0",
        },
      };
      Provider.createDFManufacturer(
        Provider.API_URLS.brandconversionupdate,
        params
      )
        .then((response) => {
          setIsButtonLoading(false);
          if (response.data && response.data.data.Updated == 1) {
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
          setIsButtonLoading(false);
          setSnackbarText(communication.NetworkError);
          setSnackbarVisible(true);
        })
        .finally(() => setIsButtonLoading(false));
    } else {
      const params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          service_refno: serviceFullD.find(
            (item) => item.service_name === serviceName
          ).service_refno,
          category_refno: categoryFullD.find(
            (item) => item.category_name === categoriesName
          ).category_refno,
          brand_refno: brandFullD.find((item) => item.brand_name === brandName)
            .brand_refno,
          conversion_value: conversionvalue,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          view_status: checked ? "1" : "0",
        },
      };
      Provider.createDFManufacturer(
        Provider.API_URLS.brandconversioncreate,
        params
      )
        .then((response) => {
          setIsButtonLoading(false);
          if (response.data && response.data.data.Created == 1) {
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
          setIsButtonLoading(false);
          setSnackbarText(communication.NetworkError);
          setSnackbarVisible(true);
        })
        .finally(() => setIsButtonLoading(false));
    }
  };

  const ValidateData = () => {
    let isValid = true;

    if (serviceName.length === 0) {
      setSNError(true);
      isValid = false;
    }

    if (categoriesName.length === 0) {
      setCNError(true);
      isValid = false;
    }
    if (brandName.length === 0) {
      setBNError(true);
      isValid = false;
    }
    if (conversionvalue.length === 0) {
      setConversionValueError(true);
      isValid = false;
    }
    if (isValid) {
      setIsButtonLoading(true);
      UpdateData();
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView
        style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[Styles.padding16]}>
          <Dropdown
            label="Service Name"
            data={serviceArray}
            onSelected={onServiceNameSelected}
            isError={errorSN}
            selectedItem={serviceName}
            reference={servicesDDRef}
          />
          <HelperText type="error" visible={errorSN}>
            {communication.InvalidServiceName}
          </HelperText>
          <Dropdown
            label="Category Name"
            data={categoryArray}
            onSelected={onCategoriesNameSelected}
            isError={errorCN}
            selectedItem={categoriesName}
            reference={categoriesDDRef}
          />
          <HelperText type="error" visible={errorCN}>
            {communication.InvalidCategoryName}
          </HelperText>
          <Dropdown
            label="Brand Name (Raw Material)"
            data={brandArray}
            onSelected={onBrandNameSelected}
            isError={errorBN}
            selectedItem={brandName}
            reference={brandDDRef}
          />
          <HelperText type="error" visible={errorBN}>
            {communication.InvalidBrandName}
          </HelperText>
          <TextInput
            mode="outlined"
            label="Conversion Value"
            value={conversionvalue}
            onChangeText={onCVChanged}
            error={conversionvalueError}
            dense
            style={[Styles.marginTop12, Styles.backgroundSecondaryColor]}
          />
          <HelperText type="error" visible={conversionvalueError}>
            {communication.InvalidUnitConversionValue}
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
      <View
        style={[
          Styles.backgroundColor,
          Styles.width100per,
          Styles.marginTop32,
          Styles.padding16,
          { position: "absolute", bottom: 0, elevation: 3 },
        ]}
      >
        <Card.Content>
           <DFButton mode="contained" onPress={ValidateData} title="SAVE" loader={isButtonLoading} />
        </Card.Content>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: theme.colors.error }}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddBrandConversationValue;
