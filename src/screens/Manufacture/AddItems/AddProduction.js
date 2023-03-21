import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import { useState, useEffect } from "react";
import { useRef } from "react";
import { ScrollView, View } from "react-native";
import { Styles } from "../../../styles/styles";
import Dropdown from "../../../components/Dropdown";
import Provider from "../../../api/Provider";
import {
  Button,
  Card,
  HelperText,
  Snackbar,
  TextInput,
  Checkbox,
  Text,
} from "react-native-paper";
import { communication } from "../../../utils/communication";
import { theme } from "../../../theme/apptheme";
import { faL } from "@fortawesome/free-solid-svg-icons";

let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_CompanyAdmin_group_refno = 0;

function AddProduction({ route, navigation }) {
  const [dob, setDob] = useState(new Date());

  const [serviceFullData, setServiceFullData] = React.useState([]);
  const [categoryFullData, setCategoryFullData] = React.useState([]);
  const [productFullData, setProductFullData] = React.useState([]);
  const [brandFullData, setBrandFullData] = React.useState([]);

  const [thicknessFullData, setThicknessFullData] = React.useState({});

  const [data, setData] = useState({
    service_name: "",
    category_name: "",
    brand_name: "",
    product_name: "",
    length_mtr_value:
      route.params.type === "edit" ? route.params.data?.length_mtr_value : "",
    thick_service_name: "",
    thick_category_name: "",
    thick_product_name: "",
    width_mm_value:
      route.params.type === "edit" ? route.params?.data?.width_mm_value : "",
    checked:
      route.params.type === "edit"
        ? route.params?.data.view_status == "1"
          ? true
          : false
        : false,
  });
  const [error, setError] = useState({
    service_name: false,
    category_name: false,
    brand_name: false,
    product_name: false,
    length_mtr_value: false,
    thick_service_name: false,
    thick_category_name: false,
    thick_product_name: false,
    width_mm_value: false,
  });

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const update = () => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
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
        length_mtr_value: data.length_mtr_value,
        thick_service_refno: thicknessFullData.service.find(
          (item) => item.thick_service_name === data.thick_service_name
        ).thick_service_refno,
        thick_category_refno: thicknessFullData.category.find(
          (item) => item.thick_category_name === data.thick_category_name
        ).thick_category_refno,
        thick_product_refno: thicknessFullData.product.find(
          (item) => item.product_name === data.thick_product_name
        ).product_refno,
        width_mm_value: data.width_mm_value,
        view_status: data.checked ? "1" : "0",
      },
    };
    console.log(params);

    Provider.createDFManufacturer(
      Provider.API_URLS.productforproductioncreate,
      params
    )
      .then((response) => {
        console.log(response.data);
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
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      })
      .finally(() => setIsButtonLoading(false));
  };
  const ValidateData = () => {
    let isValid = true;
    if (data.service_name.length === 0) {
      setError((prev) => {
        return { ...prev, service_name: true };
      });
      isValid = false;
    }
    if (data.category_name.length === 0) {
      setError((prev) => {
        return { ...prev, category_name: true };
      });
      isValid = false;
    }
    if (data.brand_name.length === 0) {
      setError((prev) => {
        return { ...prev, brand_name: true };
      });
      isValid = false;
    }
    if (data.product_name.length === 0) {
      setError((prev) => {
        return { ...prev, product_name: true };
      });
      isValid = false;
    }
    if (data.length_mtr_value.length === 0) {
      setError((prev) => {
        return { ...prev, length_mtr_value: true };
      });
      isValid = false;
    }
    if (data.thick_service_name.length === 0) {
      setError((prev) => {
        return { ...prev, thick_service_name: true };
      });
      isValid = false;
    }
    if (data.thick_category_name.length === 0) {
      setError((prev) => {
        return { ...prev, thick_category_name: true };
      });
      isValid = false;
    }
    if (data.thick_product_name.length === 0) {
      setError((prev) => {
        return { ...prev, thick_product_name: true };
      });
      isValid = false;
    }
    if (data.width_mm_value.length === 0) {
      setError((prev) => {
        return { ...prev, width_mm_value: true };
      });
      isValid = false;
    }
    if (isValid) {
      setIsButtonLoading(true);
      update();
    }
  };

  const FetchServiceNames = async () => {
    const params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
        Sess_company_refno: Sess_company_refno,
      },
    };

    Provider.createDFManufacturer(
      Provider.API_URLS.get_servicename_productforproductionform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            setServiceFullData(() => {
              return response.data.data;
            });
            let filter = response.data.data.map((item) => item.service_name);
            setData((prev) => {
              return {
                ...prev,
                service_name: filter.includes(route.params.data?.service_name)
                  ? route.params.data?.service_name
                  : "",
              };
            });
          }
        }
      })
      .catch((e) => console.log(e));

    Provider.createDFManufacturer(
      Provider.API_URLS.get_servicename_II_productforproductionform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            setThicknessFullData((prev) => {
              return {
                ...prev,
                service: response.data.data,
              };
            });
            console.log("thick", response.data.data);
            let filter = response.data.data.find(
              (item) =>
                item.thick_service_refno ===
                route.params?.data?.thick_service_refno
            );
            setData((prev) => {
              return {
                ...prev,
                thick_service_name: filter ? filter?.thick_service_name : "",
              };
            });
          }
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    console.log("data.service_name");
    if (data.service_name !== "") {
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          service_refno: serviceFullData.find(
            (item) => item.service_name === data.service_name
          ).service_refno,
        },
      };
      console.log(params);
      Provider.createDFManufacturer(
        Provider.API_URLS.get_categoryname_productforproductionform,
        params
      )
        .then((response) => {
          console.log("resp2", response.data);
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              setCategoryFullData(response.data.data);
              let filter = response.data.data.map((item) => item.category_name);

              setData((prev) => {
                return {
                  ...prev,
                  category_name: filter.includes(
                    route.params.data?.category_name
                  )
                    ? route.params.data?.category_name
                    : "",
                };
              });
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [data.service_name]);

  useEffect(() => {
    if (data.thick_service_name !== "") {
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          thick_service_refno: thicknessFullData.service.find(
            (item) => item.thick_service_name === data.thick_service_name
          ).thick_service_refno,
        },
      };
      Provider.createDFManufacturer(
        Provider.API_URLS.get_categoryname_II_productforproductionform,
        params
      )
        .then((response) => {
          console.log("thick2", response.data);
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              setThicknessFullData((prev) => {
                return { ...prev, category: response.data.data };
              });
              let filter = response.data.data.find(
                (item) =>
                  item.thick_category_refno ===
                  route.params?.data?.thick_category_refno
              );
              setData((prev) => {
                return {
                  ...prev,
                  thick_category_name: filter
                    ? filter?.thick_category_name
                    : "",
                };
              });
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [data.thick_service_name]);

  useEffect(() => {
    if (data.thick_category_name !== "") {
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
          Sess_CompanyAdmin_group_refno: Sess_CompanyAdmin_group_refno,
          thick_category_refno: thicknessFullData.category.find(
            (item) => item.thick_category_name === data.thick_category_name
          ).thick_category_refno,
        },
      };
      console.log("thick3pp", params);
      Provider.createDFManufacturer(
        Provider.API_URLS.get_productname_II_productforproductionform,
        params
      )
        .then((response) => {
          console.log("thick3", response.data);
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              setThicknessFullData((prev) => {
                return { ...prev, product: response.data.data };
              });
              let filter = response.data.data.find(
                (item) =>
                  item.product_refno === route.params?.data?.thick_product_refno
              );
              setData((prev) => {
                return {
                  ...prev,
                  thick_product_name: filter ? filter?.product_name : "",
                };
              });
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [data.thick_category_name]);

  useEffect(() => {
    console.log(data.category_name);
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
        Provider.API_URLS.get_brandname_productforproductionform,
        params
      )
        .then((response) => {
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              setBrandFullData(response.data.data);
              let filter = response.data.data.map((item) => item.brand_name);
              setData((prev) => {
                return {
                  ...prev,
                  brand_name: filter.includes(route.params.data?.brand_name)
                    ? route.params.data?.brand_name
                    : "",
                };
              });
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [data.category_name]);

  useEffect(() => {
    console.log(data.brand_name);
    if (data.brand_name !== "") {
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
          Sess_CompanyAdmin_group_refno: Sess_CompanyAdmin_group_refno,
          brand_refno: brandFullData.find(
            (item) => item.brand_name === data.brand_name
          ).brand_refno,
        },
      };
      Provider.createDFManufacturer(
        Provider.API_URLS.get_productname_productforproductionform,
        params
      )
        .then((response) => {
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              setProductFullData(response.data.data);
              let filter = response.data.data.map((item) => item.product_name);
              setData((prev) => {
                return {
                  ...prev,
                  product_name: filter.includes(route.params.data?.product_name)
                    ? route.params.data?.product_name
                    : "",
                };
              });
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [data.brand_name]);

  const resetErrors = () => {
    setError((prev) => {
      return {
        ...prev,
        service_name: false,
        category_name: false,
        brand_name: false,
        product_name: false,
        supplier_name: false,
        vendor_name: false,
      };
    });
  };
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
          <View style={[Styles.paddingTop16]}>
            <Dropdown
              label="Service Name"
              data={serviceFullData?.map((item) => item.service_name)}
              onSelected={(selectedItem) => {
                if (selectedItem !== data.service_name) {
                  resetErrors();
                  setCategoryFullData([]);
                  setBrandFullData([]);
                  setProductFullData([]);
                  setData((prev) => {
                    return {
                      ...prev,
                      category_name: "",
                      brand_name: "",
                      product_name: "",
                      service_name: selectedItem,
                    };
                  });
                }
              }}
              isError={error.service_name}
              selectedItem={data.service_name}
              style={[Styles.borderred]}
            />
          </View>
          <HelperText type="error" visible={error.service_name}>
            {communication.InvalidServiceName}
          </HelperText>

          <Dropdown
            label="Category Name"
            data={categoryFullData.map((item) => item.category_name)}
            onSelected={(selectedItem) => {
              if (data.category_name !== selectedItem) {
                resetErrors();
                setBrandFullData([]);
                setProductFullData([]);
                setData((prev) => {
                  return {
                    ...prev,
                    brand_name: "",
                    product_name: "",
                    category_name: selectedItem,
                  };
                });
              }
            }}
            isError={error.category_name}
            selectedItem={data.category_name}
            style={[Styles.paddingTop16]}
          />
          <HelperText type="error" visible={error.category_name}>
            {communication.InvalidCategoryName}
          </HelperText>

          <Dropdown
            label="Brand Name"
            data={brandFullData.map((item) => item.brand_name)}
            onSelected={(selectedItem) => {
              if (data.brand_name !== selectedItem) {
                resetErrors();
                setProductFullData([]);
                setData((prev) => {
                  return {
                    ...prev,
                    product_name: "",
                    brand_name: selectedItem,
                  };
                });
              }
            }}
            isError={error.brand_name}
            selectedItem={data.brand_name}
            style={[Styles.paddingTop16]}
          />
          <HelperText type="error" visible={error.brand_name}>
            {communication.InvalidBrandName}
          </HelperText>

          <Dropdown
            label="Product Name"
            data={productFullData.map((item) => item.product_name)}
            onSelected={(selectedItem) => {
              if (data.product_name !== selectedItem) {
                resetErrors();
                setData((prev) => {
                  return {
                    ...prev,
                    product_name: selectedItem,
                  };
                });
              }
            }}
            isError={error.product_name}
            selectedItem={data.product_name}
            style={[Styles.paddingTop16]}
          />
          <HelperText type="error" visible={error.product_name}>
            {communication.InvalidProductName}
          </HelperText>

          <TextInput
            mode="outlined"
            label="Product length in Mtrs"
            value={data.length_mtr_value}
            returnKeyType="next"
            onChangeText={(text) => {
              setError((prev) => {
                return {
                  ...prev,
                  length_mtr_value: false,
                };
              });
              setData((prev) => {
                return {
                  ...prev,
                  length_mtr_value: text,
                };
              });
            }}
            style={[{ backgroundColor: "white" }]}
            error={error.length_mtr_value}
          />
          <HelperText type="error" visible={error.length_mtr_value}>
            {"Enter proper value"}
          </HelperText>
          <View>
            <View
              style={[
                Styles.borderTopRadius4,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text
                style={[
                  Styles.marginBottom24,
                  Styles.marginTop16,
                  Styles.textColorWhite,
                  Styles.marginHorizontal8,
                ]}
              >
                Product Thickness of Raw Material
              </Text>
            </View>
            <View
              style={[
                Styles.border2,
                Styles.borderBottomRadius4,
                Styles.height250,
              ]}
            >
              <View style={[Styles.marginTop24]}>
                <Dropdown
                  label="Select Service"
                  data={
                    thicknessFullData?.service
                      ? thicknessFullData?.service?.map(
                          (item) => item.thick_service_name
                        )
                      : []
                  }
                  onSelected={(selectedItem) => {
                    if (data.thick_service_name !== selectedItem) {
                      setError((prev) => {
                        return {
                          ...prev,
                          thick_service_name: false,
                          thick_category_name: false,
                          thick_product_name: false,
                        };
                      });
                      setThicknessFullData((prev) => {
                        return { ...prev, category: [], product: [] };
                      });
                      setData((prev) => {
                        return {
                          ...prev,
                          thick_category_name: "",
                          thick_product_name: "",
                          thick_service_name: selectedItem,
                        };
                      });
                    }
                  }}
                  isError={error.thick_service_name}
                  selectedItem={data.thick_service_name}
                  style={[Styles.height120]}
                />
                <HelperText type="error" visible={error.thick_service_name}>
                  {communication.InvalidServiceName}
                </HelperText>
              </View>
              <Dropdown
                label="Select Category"
                data={
                  thicknessFullData?.category
                    ? thicknessFullData?.category?.map(
                        (item) => item.thick_category_name
                      )
                    : []
                }
                onSelected={(selectedItem) => {
                  if (data.thick_category_name !== selectedItem) {
                    setError((prev) => {
                      return {
                        ...prev,
                        thick_service_name: false,
                        thick_category_name: false,
                        thick_product_name: false,
                      };
                    });
                    setThicknessFullData((prev) => {
                      return { ...prev, product: [] };
                    });
                    setData((prev) => {
                      return {
                        ...prev,
                        thick_product_name: "",
                        thick_category_name: selectedItem,
                      };
                    });
                  }
                }}
                isError={error.thick_category_name}
                selectedItem={data.thick_category_name}
                style={[Styles.height120]}
              />
              <HelperText type="error" visible={error.thick_category_name}>
                {communication.InvalidServiceName}
              </HelperText>

              <Dropdown
                label="Select Product"
                data={
                  thicknessFullData?.product
                    ? thicknessFullData?.product?.map(
                        (item) => item.product_name
                      )
                    : []
                }
                onSelected={(selectedItem) => {
                  if (data.thick_product_name !== selectedItem) {
                    setError((prev) => {
                      return {
                        ...prev,
                        thick_service_name: false,
                        thick_category_name: false,
                        thick_product_name: false,
                      };
                    });
                    setData((prev) => {
                      return {
                        ...prev,
                        thick_product_name: selectedItem,
                      };
                    });
                  }
                }}
                isError={error.thick_product_name}
                selectedItem={data.thick_product_name}
                style={[Styles.height120]}
              />
              <HelperText type="error" visible={error.thick_product_name}>
                {communication.InvalidServiceName}
              </HelperText>
            </View>
          </View>
          <TextInput
            mode="outlined"
            label="Slitting width in mm"
            value={data.width_mm_value}
            returnKeyType="next"
            onChangeText={(text) => {
              setError((prev) => {
                return {
                  ...prev,
                  width_mm_value: false,
                };
              });
              setData((prev) => {
                return {
                  ...prev,
                  width_mm_value: text,
                };
              });
            }}
            style={[{ backgroundColor: "white" }]}
            error={error.width_mm_value}
          />
          <HelperText type="error" visible={error.width_mm_value}>
            {"Enter proper value"}
          </HelperText>

          <View style={{ width: 160 }}>
            <Checkbox.Item
              label="Display"
              color={theme.colors.primary}
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
              status={data.checked ? "checked" : "unchecked"}
              onPress={() => {
                setData((prev) => {
                  return { ...prev, checked: !prev.checked };
                });
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
          <Button
            mode="contained"
            onPress={ValidateData}
            disabled={isButtonLoading}
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

export default AddProduction;
