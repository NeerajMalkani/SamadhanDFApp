import React, { useEffect, useState, useRef } from "react";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import { ScrollView, View } from "react-native";
import { Styles } from "../../../styles/styles";
import Dropdown from "../../../components/Dropdown";
import Provider from "../../../api/Provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment/moment";
import {
  Button,
  Card,
  HelperText,
  Snackbar,
  TextInput,
} from "react-native-paper";
import { communication } from "../../../utils/communication";
import { theme } from "../../../theme/apptheme";

let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_CompanyAdmin_group_refno = 0;

function AddStockList({ route, navigation }) {
  const [dob, setDob] = useState(
    route.params.type === "edit"
      ? new Date(`
              ${route.params.data?.added_date.substring(6, 10)}/
              ${route.params.data?.added_date.substring(3, 5)}/
              ${route.params.data?.added_date.substring(0, 2)}
             `)
      : new Date()
  );
  const [name, setName] = React.useState("");

  const [serviceFullData, setServiceFullData] = React.useState({});
  const [serviceArray, setServiceArray] = React.useState([]);

  const [categoryFullData, setCategoryFullData] = React.useState({});
  const [categoryArray, setCategoryArray] = React.useState([]);

  const [brandFullData, setBrandFullData] = React.useState({});
  const [brandArray, setBrandArray] = React.useState([]);

  const [productFullData, setProductFullData] = React.useState({});
  const [productArray, setProductArray] = React.useState([]);

  const [data, setData] = useState({
    service_name: "",
    category_name: "",
    brand_name: "",
    product_name: "",
    total_products:
      route.params.type == "edit" ? route.params.data?.total_products : "",
    opstock_weightper_piece:
      route.params.type == "edit"
        ? route.params.data?.opstock_weightper_piece
        : "",
  });

  const [error, setError] = useState({
    service_name: false,
    category_name: false,
    brand_name: false,
    product_name: false,
    total_products: false,
    opstock_weightper_piece: false,
  });

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const onServiceNameSelected = (selectedItem) => {
    if (selectedItem !== data.service_name) {
      setData((prev) => {
        return {
          ...prev,
          service_name: selectedItem,
          category_name: "",
          brand_name: "",
          product_name: "",
        };
      });
      setCategoryArray([]);
      setCategoryFullData({});
      setBrandArray([]);
      setBrandFullData({});
      setProductArray([]);
      setProductFullData({});
      setError((prev) => {
        return {
          ...prev,
          service_name: false,
          category_name: false,
          brand_name: false,
          product_name: false,
          total_products: false,
          opstock_weightper_piece: false,
        };
      });
    }
  };
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const ValidateData = () => {
    let isValid = true;
    if (data.service_name.length === 0) {
      setError((prev) => {
        return {
          ...prev,
          service_name: true,
        };
      });
      isValid = false;
    }
    if (data.category_name.length === 0) {
      setError((prev) => {
        return {
          ...prev,
          category_name: true,
        };
      });
      isValid = false;
    }
    if (data.brand_name.length === 0) {
      setError((prev) => {
        return {
          ...prev,
          brand_name: true,
        };
      });
      isValid = false;
    }
    if (data.product_name.length === 0) {
      setError((prev) => {
        return {
          ...prev,
          product_name: true,
        };
      });
      isValid = false;
    }
    if (data.total_products.length === 0) {
      setError((prev) => {
        return {
          ...prev,
          total_products: true,
        };
      });
      isValid = false;
    }
    if (data.opstock_weightper_piece.length === 0) {
      setError((prev) => {
        return {
          ...prev,
          opstock_weightper_piece: true,
        };
      });
      isValid = false;
    }

    if (isValid) {
      setIsButtonLoading(true);
      update();
    }
  };

  const update = () => {
    if (route.params.type === "edit") {
      const params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          mfosp_refno: route.params.data.mfosp_refno,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          added_date: dob,
          service_refno: serviceFullData.find(
            (item) => item.service_name === data.service_name
          ).service_refno,
          category_refno: categoryFullData.find(
            (item) => item.category_name === data.category_name
          ).category_refno,
          brand_refno: brandFullData.find(
            (item) => item.brand_name === data.brand_name
          ).brand_refno,
          product_refno: productFullData.find(
            (item) => item.product_name === data.product_name
          ).product_refno,
          total_products: data.total_products,
          opstock_weightper_piece: data.opstock_weightper_piece,
          view_status: "1",
        },
      };
      Provider.createDFManufacturer(
        Provider.API_URLS.openingstockupdate,
        params
      )
        .then((response) => {
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
          setSnackbarText(communication.NetworkError);
          setSnackbarVisible(true);
        })
        .finally(() => setIsButtonLoading(false));
    } else {
      const params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          added_date: dob,
          service_refno: serviceFullData.find(
            (item) => item.service_name === data.service_name
          ).service_refno,
          category_refno: categoryFullData.find(
            (item) => item.category_name === data.category_name
          ).category_refno,
          brand_refno: brandFullData.find(
            (item) => item.brand_name === data.brand_name
          ).brand_refno,
          product_refno: productFullData.find(
            (item) => item.product_name === data.product_name
          ).product_refno,
          total_products: data.total_products,
          opstock_weightper_piece: data.opstock_weightper_piece,
          view_status: "1",
        },
      };
      Provider.createDFManufacturer(
        Provider.API_URLS.openingstockcreate,
        params
      )
        .then((response) => {
          if (response.data && response.data.data.Created == 1) {
            route.params.fetchData("add");
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
          setSnackbarText(communication.NetworkError);
          setSnackbarVisible(true);
        })
        .finally(() => setIsButtonLoading(false));
    }
  };

  const FetchServiceNames = () => {
    const params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
      },
    };

    Provider.createDFManufacturer(
      Provider.API_URLS.get_servicename_openingstockform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            setServiceFullData(() => {
              return response.data.data;
            });
            let filter = response.data.data.map((item) => item.service_name);
            setServiceArray(filter);
          }
        }
      })
      .catch((e) => console.log(e));
  };
  useEffect(() => {
    if (data.service_name !== "") {
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          service_refno: serviceFullData.find(
            (item) => item.service_name === data.service_name
          ).service_refno,
        },
      };
      Provider.createDFManufacturer(
        Provider.API_URLS.get_categoryname_openingstockform,
        params
      )
        .then((response) => {
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              setCategoryFullData(response.data.data);
              let filter = response.data.data.map((item) => item.category_name);
              setCategoryArray(filter);
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [data.service_name]);

  useEffect(() => {
    if (data.category_name !== "") {
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
          category_refno: categoryFullData.find(
            (item) => item.category_name === data.category_name
          ).category_refno,
        },
      };
      Provider.createDFManufacturer(
        Provider.API_URLS.get_brandname_openingstockform,
        params
      )
        .then((response) => {
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              setBrandFullData(response.data.data);
              let filter = response.data.data.map((item) => item.brand_name);
              setBrandArray(filter);
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [data.category_name]);

  useEffect(() => {
    if (data.brand_name !== "") {
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
          Sess_CompanyAdmin_group_refno: "0",
          brand_refno: brandFullData.find(
            (item) => item.brand_name === data.brand_name
          ).brand_refno,
        },
      };
      Provider.createDFManufacturer(
        Provider.API_URLS.get_productname_openingstockform,
        params
      )
        .then((response) => {
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              setProductFullData(response.data.data);
              let filter = response.data.data.map((item) => item.product_name);
              setProductArray(filter);
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [data.brand_name]);

  const GetUserID = async () => {
    try {
      const userData = await AsyncStorage.getItem("user");
      if (userData !== null) {
        Sess_UserRefno = JSON.parse(userData).UserID;
        Sess_company_refno = JSON.parse(userData).Sess_company_refno;
        Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
        Sess_CompanyAdmin_UserRefno =
          JSON.parse(userData).Sess_CompanyAdmin_UserRefno;
        Sess_CompanyAdmin_group_refno =
          JSON.parse(userData).Sess_CompanyAdmin_group_refno;
        FetchServiceNames();
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    GetUserID();
  }, []);
  return (
    <View style={[Styles.flex1]}>
      <ScrollView
        style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[Styles.padding16]}>
          <View>
            <DateTimePicker
              style={[Styles.backgroundColorWhite, Styles.borderred]}
              label=" * Date"
              type="date"
              value={dob}
              onChangeDate={setDob}
            />
          </View>
          <View style={[Styles.paddingTop16]}>
            <Dropdown
              label="Service Name"
              data={serviceArray}
              onSelected={onServiceNameSelected}
              isError={error.service_name}
              selectedItem={data.service_name}
            />
          </View>
          <HelperText type="error" visible={error.service_name}>
            {communication.InvalidServiceName}
          </HelperText>
          <Dropdown
            label="Category Name"
            data={categoryArray}
            onSelected={(selectedItem) => {
              if (selectedItem !== data.category_name) {
                setBrandArray([]);
                setBrandFullData({});
                setProductArray([]);
                setProductFullData({});
                setData((prev) => {
                  return { ...prev, category_name: selectedItem };
                });
                setError((prev) => {
                  return {
                    ...prev,
                    category_name: false,
                    brand_name: false,
                    product_name: false,
                    total_products: false,
                    opstock_weightper_piece: false,
                  };
                });
              }
            }}
            isError={error.category_name}
            selectedItem={data.category_name}
          />
          <HelperText type="error" visible={error.category_name}>
            {communication.InvalidCategoryName}
          </HelperText>
          <Dropdown
            label="Brand Name"
            data={brandArray}
            onSelected={(selectedItem) => {
              if (selectedItem !== data.brand_name) {
                setProductArray([]);
                setProductFullData({});
                setData((prev) => {
                  return { ...prev, brand_name: selectedItem };
                });
                setError((prev) => {
                  return {
                    ...prev,
                    brand_name: false,
                    product_name: false,
                    total_products: false,
                    opstock_weightper_piece: false,
                  };
                });
              }
            }}
            isError={error.brand_name}
            selectedItem={data.brand_name}
          />
          <HelperText type="error" visible={error.brand_name}>
            {communication.InvalidBrandName}
          </HelperText>
          <Dropdown
            label="Product Name"
            data={productArray}
            onSelected={(selectedItem) => {
              if (selectedItem !== data.product_name) {
                setData((prev) => {
                  return { ...prev, product_name: selectedItem };
                });
                setError((prev) => {
                  return {
                    ...prev,
                    product_name: false,
                    total_products: false,
                    opstock_weightper_piece: false,
                  };
                });
              }
            }}
            isError={error.product_name}
            selectedItem={data.product_name}
          />
          <HelperText type="error" visible={error.product_name}>
            {communication.InvalidProductName}
          </HelperText>

          <TextInput
           mode="outlined"
            label="Total Products"
            value={data.total_products}
            keyboardType="number-pad"
            returnKeyType="next"
            onChangeText={(selectedItem) => {
              if (selectedItem !== data.total_products) {
                setData((prev) => {
                  return { ...prev, total_products: selectedItem };
                });
                setError((prev) => {
                  return {
                    ...prev,
                    total_products: false,
                  };
                });
              }
            }}
            style={[{ backgroundColor: "white" }]}
            error={error.total_products}
          />
          <HelperText type="error" visible={error.total_products}>
            {communication.InvalidProductList}
          </HelperText>
          <TextInput
            mode="outlined"
            label="Weight Per Piece"
            value={data.opstock_weightper_piece}
            returnKeyType="next"
            keyboardType="number-pad"
            onChangeText={(selectedItem) => {
              if (selectedItem !== data.opstock_weightper_piece) {
                setData((prev) => {
                  return { ...prev, opstock_weightper_piece: selectedItem };
                });
                setError((prev) => {
                  return {
                    ...prev,
                    opstock_weightper_piece: false,
                  };
                });
              }
            }}
            style={[{ backgroundColor: "white" }]}
            error={error.opstock_weightper_piece}
          />
          <HelperText type="error" visible={error.opstock_weightper_piece}>
            {"Fill this field."}
          </HelperText>
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
          <Button
            mode="contained"
            disabled={isButtonLoading}
            onPress={ValidateData}
          >
            Save
          </Button>
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
}

export default AddStockList;
