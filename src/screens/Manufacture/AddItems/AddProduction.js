import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import Provider from "../../../api/Provider";
import { useRef } from "react";
import { ScrollView, View } from "react-native";
import { Styles } from "../../../styles/styles";
import Dropdown from "../../../components/Dropdown";
import Coil from "../Components/Coil";
import {
  Button,
  Card,
  HelperText,
  Snackbar,
  TextInput,
  Text,
  Checkbox,
} from "react-native-paper";
import { communication } from "../../../utils/communication";
import { theme } from "../../../theme/apptheme";

let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_CompanyAdmin_group_refno = 0;

function AddProduction({ route, navigation }) {
  const [error, setError] = React.useState(false);
  const [name, setName] = React.useState("");
  const [servicesData, setServicesData] = React.useState([]);
  const [errorSN, setSNError] = React.useState(false);
  const [serviceName, setServiceName] = React.useState("");
  const [hsnError, setHSNError] = React.useState(false);
  const [hsn, setHSN] = React.useState("");
  const [gstError, setGSTError] = React.useState(false);
  const [gst, setGST] = React.useState("");
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [serviceFullData, setServiceFullData] = React.useState([]);
  const [categoryFullData, setCategoryFullData] = React.useState([]);
  const [productFullData, setProductFullData] = React.useState([]);
  const [widthFullData, setWidthFullData] = React.useState([]);
  const [brandFullData, setBrandFullData] = React.useState([]);
  const [zincFullData, setZincFullData] = React.useState([]);
  const [coilnumFullData, setCoilnumFullData] = React.useState([]);

  const ref_input2 = useRef();
  const ref_input3 = useRef();
  const [dob, setDob] = useState(new Date());

  const [data, setData] = useState({
    service_name: "",
    category_name: "",
    brand_name: "",
    product_name: "",
    gpcoil_width: "",
    mass_of_zinc_coating: "",
    no_gpcoil: "",
    coil_details: [],
    total_weight: "",
    total_length: "",
    vendor_name:
      route.params.type == "edit"
        ? route.params.data?.vendor?.find(
            (item) =>
              item.client_user_refno === route.params.data.vendor_user_refno
          )?.client_name
        : "",
    supplier_name:
      route.params.type == "edit"
        ? route.params.data?.supplier?.find(
            (item) =>
              item.client_user_refno === route.params.data.supplier_user_refno
          )?.client_name
        : "",
    rate: route.params.type === "edit" ? route.params.data.rate : "",
    amount: route.params.type === "edit" ? route.params.data.amount : "",
    checked:
      route.params.type === "edit"
        ? route.params.data.view_status == "1"
          ? true
          : false
        : true,
  });

  const [errors, setErrors] = useState({
    service_name: false,
    category_name: false,
    brand_name: false,
    product_name: false,
    gpcoil_width: false,
    mass_of_zinc_coating: false,
    no_gpcoil: false,
    supplier_name: false,
    vendor_name: false,
    coil_details: [],
    rate: false,
  });

  useEffect(() => {
    if (data.coil_details.length > 0) {
      let total_weight = 0;
      let total_length = 0;
      data.coil_details.map((item) => {
        total_weight =
          total_weight + (item.weight === "" ? 0 : parseFloat(item.weight));
        total_length =
          total_length + (item.length === "" ? 0 : parseFloat(item.length));
      });
      setData((prev) => {
        return {
          ...prev,
          total_length: String(total_length),
          total_weight: String(total_weight),
        };
      });
    }
  }, [data.coil_details]);

  useEffect(() => {
    if (data.total_weight.length > 0 && data.rate.length > 0) {
      setData((prev) => {
        return {
          ...prev,
          amount:
            parseFloat(data.total_weight) * parseFloat(data.rate)
              ? String(parseFloat(data.total_weight) * parseFloat(data.rate))
              : "0",
        };
      });
    }
  }, [data.rate, data.total_weight]);

  const resetErrors = () => {
    setErrors((prev) => {
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
  // console.log(route.params.data);
  const FetchServiceNames = () => {
    const params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        mf_po_refno: "all",
      },
    };

    Provider.createDFManufacturer(
      Provider.API_URLS.get_servicename_manufacturer_poform,
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
                  : filter[0],
              };
            });
          }
        }
      })
      .catch((e) => console.log(e));
    Provider.createDFManufacturer(
      Provider.API_URLS.get_widthofgpcoil_manufacturer_poform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            console.log(response.data.data);
            setWidthFullData(() => {
              return response.data.data;
            });
            let filter = response.data.data.map((item) => item.gpcoil_width);
            setData((prev) => {
              return {
                ...prev,
                gpcoil_width: filter.includes(route.params.data?.gpcoil_width)
                  ? route.params.data?.gpcoil_width
                  : filter[0],
              };
            });
          }
        }
      })
      .catch((e) => console.log(e));

    Provider.createDFManufacturer(
      Provider.API_URLS.get_gsm_manufacturer_poform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            console.log(response.data.data);
            setZincFullData(() => {
              return response.data.data;
            });
            let filter = response.data.data.find(
              (item) => item.gsm_refno === route.params?.data?.gsm_refno
            );
            setData((prev) => {
              return {
                ...prev,
                mass_of_zinc_coating: filter
                  ? filter.gsm_name
                  : response.data.data[0].gsm_name,
              };
            });
          }
        }
      })
      .catch((e) => console.log(e));

    Provider.createDFManufacturer(
      Provider.API_URLS.get_numberofgpcoil_manufacturer_poform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            console.log(response.data.data);
            setCoilnumFullData(() => {
              return response.data.data;
            });
            if (route.params.type == "edit") {
              setData((prev) => {
                return {
                  ...prev,
                  no_gpcoil: parseInt(route.params.data.no_gpcoil),
                };
              });
            }
          }
        }
      })
      .catch((e) => console.log(e));
    if (route.params.type == "edit") {
      Provider.createDFManufacturer(Provider.API_URLS.mfporefnocheck, params)
        .then((response) => {
          if (response.data?.data) {
            let temp = response.data.data.find(
              (item) =>
                item.brand_name === route.params.data.brand_name &&
                item.category_name === route.params.data.category_name &&
                item.total_length === route.params.data.total_length &&
                item.total_weight === route.params.data.total_weight &&
                item.amount === route.params.data.amount &&
                item.mf_po_refno === route.params.data.mf_po_refno &&
                item.no_gpcoil === route.params.data.no_gpcoil
            );
            console.log(response.data.data[0]);
            console.log("gpcoilrefno", route.params.data);
            setData((prev) => {
              return {
                ...prev,
                coil_details: temp.coilsdetails_data,
              };
            });
            setErrors((prev) => {
              return {
                ...prev,
                coil_details: Array(parseInt(route.params.data.no_gpcoil)).fill(
                  {
                    weight: false,
                    length: false,
                  }
                ),
              };
            });
          }
        })
        .catch((e) => console.log(e));
    }
  };

  useEffect(() => {
    console.log(data.service_name);
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
        Provider.API_URLS.get_categoryname_manufacturer_poform,
        params
      )
        .then((response) => {
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
                    : filter[0],
                };
              });
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [data.service_name]);

  useEffect(() => {
    console.log(data.category_name);
    if (data.category_name !== "") {
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          Sess_CompanyAdmin_group_refno: Sess_CompanyAdmin_group_refno,
          Sess_company_refno: Sess_company_refno,
          category_refno: categoryFullData.find(
            (item) => item.category_name === data.category_name
          ).category_refno,
        },
      };
      Provider.createDFManufacturer(
        Provider.API_URLS.get_productname_manufacturer_poform,
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
                    : filter[0],
                };
              });
            }
          }
        })
        .catch((e) => console.log(e));

      Provider.createDFManufacturer(
        Provider.API_URLS.get_brandname_manufacturer_poform,
        params
      )
        .then((response) => {
          console.log("res", response.data);
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              setBrandFullData(response.data.data);
              let filter = response.data.data.map((item) => item.brand_name);
              setData((prev) => {
                return {
                  ...prev,
                  brand_name: filter.includes(route.params.data?.brand_name)
                    ? route.params.data?.brand_name
                    : filter[0],
                };
              });
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [data.category_name]);

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
  const [isbuttonLoading, setIsButtonLoading] = useState(false);
  const update = () => {
    console.log(widthFullData);
    setIsButtonLoading(false);

    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        service_refno: serviceFullData.find(
          (item) => item.service_name === data.service_name
        ).service_refno,
        supplier_user_refno: route.params.data.supplier.find(
          (item) => item.client_name === data.supplier_name
        ).client_user_refno,
        vendor_user_refno: route.params.data.vendor.find(
          (item) => item.client_name === data.vendor_name
        ).client_user_refno,
        category_refno: categoryFullData.find(
          (item) => item.category_name === data.category_name
        ).category_refno,
        product_refno: productFullData.find(
          (item) => item.product_name === data.product_name
        ).product_refno,
        gpcoil_refno: widthFullData.find(
          (item) => item.gpcoil_width === data.gpcoil_width
        ).gpcoil_refno,
        brand_refno: brandFullData.find(
          (item) => item.brand_name === data.brand_name
        ).brand_refno,
        gsm_refno: zincFullData.find(
          (item) => item.gsm_name === data.mass_of_zinc_coating
        ).gsm_refno,
        no_gpcoil: data.no_gpcoil,
        total_weight: data.total_weight,
        total_length: data.total_length,
        rate: data.rate,
        amount: data.amount,
        weight: {},
        length: {},
        avg_thickness: {},
        view_status: data.current ? "1" : "0",
      },
    };
    data.coil_details.map((item, i) => {
      params.data.weight[i] = item.weight;
      params.data.length[i] = item.length;
      params.data.avg_thickness[i] = item.avg_thickness;
    });
    Provider.createDFManufacturer(
      Provider.API_URLS.manufacturerpocreate,
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
      setErrors((prev) => {
        return { ...prev, service_name: true };
      });
      isValid = false;
    }
    if (data.category_name.length === 0) {
      setErrors((prev) => {
        return { ...prev, category_name: true };
      });
      isValid = false;
    }
    if (data.product_name.length === 0) {
      setErrors((prev) => {
        return { ...prev, product_name: true };
      });
      isValid = false;
    }
    if (data.brand_name.length === 0) {
      setErrors((prev) => {
        return { ...prev, brand_name: true };
      });
      isValid = false;
    }
    if (data.gpcoil_width.length === 0) {
      setErrors((prev) => {
        return { ...prev, gpcoil_width: true };
      });
      isValid = false;
    }
    if (data.mass_of_zinc_coating.length === 0) {
      setErrors((prev) => {
        return { ...prev, mass_of_zinc_coating: true };
      });
      isValid = false;
    }
    if (data.no_gpcoil.length === 0) {
      setErrors((prev) => {
        return { ...prev, no_gpcoil: true };
      });
      isValid = false;
    }
    data.coil_details.map((item, idx) => {
      if (item.length.length === 0) {
        setErrors((prev) => {
          return {
            ...prev,
            coil_details: data.coil_details.map((item, i) => {
              return idx === i
                ? { ...prev.coil_details[i], length: true }
                : item;
            }),
          };
        });
        isValid = false;
      }
      if (item.weight.length === 0) {
        setErrors((prev) => {
          return {
            ...prev,
            coil_details: data.coil_details.map((item, i) => {
              return idx === i
                ? { ...prev.coil_details[i], weight: true }
                : item;
            }),
          };
        });
        isValid = false;
      }
    });
    if (data.total_length == 0 || data.total_weight == 0) {
      isValid = false;
    }
    if (data.rate.length === 0) {
      setErrors((prev) => {
        return { ...prev, rate: true };
      });
      isValid = false;
    }
    if (data.vendor_name.length === 0) {
      setErrors((prev) => {
        return { ...prev, vendor_name: true };
      });
      isValid = false;
    }
    if (data.supplier_name.length === 0) {
      setErrors((prev) => {
        return { ...prev, supplier_name: true };
      });
      isValid = false;
    }
    if (isValid) {
      setIsButtonLoading(true);
      update();
    }
  };

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
                  setProductFullData([]);
                  setBrandFullData([]);
                  setData((prev) => {
                    return {
                      ...prev,
                      category_name: "",
                      product_name: "",
                      brand_name: "",
                      service_name: selectedItem,
                    };
                  });
                }
              }}
              isError={errors.service_name}
              selectedItem={data.service_name}
              style={[Styles.borderred]}
            />
          </View>
          <HelperText type="error" visible={errors.service_name}>
            {communication.InvalidServiceName}
          </HelperText>
          <Dropdown
            label="Category Name"
            data={categoryFullData.map((item) => item.category_name)}
            onSelected={(selectedItem) => {
              if (selectedItem !== data.category_name) {
                resetErrors();
                setProductFullData([]);
                setBrandFullData([]);
                setData((prev) => {
                  return {
                    ...prev,
                    product_name: "",
                    brand_name: "",
                    category_name: selectedItem,
                  };
                });
              }
            }}
            isError={errors.category_name}
            selectedItem={data.category_name}
            style={[Styles.paddingTop16]}
          />
          <HelperText type="error" visible={errors.category_name}>
            {communication.InvalidCategoryName}
          </HelperText>

          <Dropdown
            label="Product Name"
            data={productFullData.map((item) => item.product_name)}
            onSelected={(selectedItem) => {
              if (selectedItem !== data.product_name) {
                resetErrors();
                setData((prev) => {
                  return {
                    ...prev,
                    product_name: selectedItem,
                  };
                });
              }
            }}
            isError={errors.product_name}
            selectedItem={data.product_name}
            style={[Styles.paddingTop16]}
          />

          <HelperText type="error" visible={errors.product_name}>
            {communication.InvalidProductName}
          </HelperText>

          <Dropdown
            label="Width of Coil"
            data={widthFullData.map((item) => item.gpcoil_width)}
            onSelected={(selectedItem) => {
              if (selectedItem !== data.gpcoil_width) {
                setErrors((prev) => {
                  return { ...prev, gpcoil_width: false };
                });
                setData((prev) => {
                  return {
                    ...prev,
                    gpcoil_width: selectedItem,
                  };
                });
              }
            }}
            isError={errors.gpcoil_width}
            selectedItem={data.gpcoil_width}
            style={[Styles.paddingTop16]}
          />

          <HelperText type="error" visible={errors.gpcoil_width}>
            {"Enter valid amount"}
          </HelperText>

          <Dropdown
            label="Brand Name"
            data={brandFullData.map((item) => item.brand_name)}
            onSelected={(selectedItem) => {
              if (selectedItem !== data.brand_name) {
                resetErrors();
                setData((prev) => {
                  return {
                    ...prev,
                    brand_name: selectedItem,
                  };
                });
              }
            }}
            isError={errors.brand_name}
            selectedItem={data.brand_name}
            style={[Styles.paddingTop16]}
          />
          <HelperText type="error" visible={errors.gpcoil_width}>
            {communication.InvalidBrandName}
          </HelperText>

          <Dropdown
            label="Mass of Zinc Coating"
            data={zincFullData?.map((item) => item.gsm_name)}
            onSelected={(selectedItem) => {
              if (selectedItem !== data.mass_of_zinc_coating) {
                setErrors((prev) => {
                  return { ...prev, mass_of_zinc_coating: false };
                });
                setData((prev) => {
                  return {
                    ...prev,
                    mass_of_zinc_coating: selectedItem,
                  };
                });
              }
            }}
            isError={errors.mass_of_zinc_coating}
            selectedItem={data.mass_of_zinc_coating}
            style={[Styles.paddingTop16]}
          />
          <HelperText type="error" visible={errors.mass_of_zinc_coating}>
            {communication.InvalidServiceName}
          </HelperText>

          <Dropdown
            label="Number of GP coil"
            data={coilnumFullData?.map((item) => item.no_gpcoil)}
            onSelected={(selectedItem) => {
              if (selectedItem !== data.no_gpcoil) {
                setErrors((prev) => {
                  return {
                    ...prev,
                    no_gpcoil: false,
                    coil_details: Array(parseInt(selectedItem)).fill({
                      weight: false,
                      length: false,
                    }),
                  };
                });
                setData((prev) => {
                  return {
                    ...prev,
                    no_gpcoil: selectedItem,
                    coil_details: Array(parseInt(selectedItem)).fill({
                      weight: "",
                      length: "",
                      avg_thickness: "",
                    }),
                  };
                });
              }
            }}
            isError={errors.no_gpcoil}
            selectedItem={data.no_gpcoil}
            style={[Styles.paddingTop16]}
          />
          <HelperText type="error" visible={errors.no_gpcoil}>
            {communication.InvalidServiceName}
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
                Coil Details
              </Text>
            </View>
            {data.coil_details !== [] &&
              data.coil_details !== undefined &&
              data.coil_details.map((_, idx) => (
                <View key={idx}>
                  <Coil
                    dataparams={{
                      Sess_UserRefno: Sess_UserRefno,
                      Sess_company_refno: Sess_company_refno,
                      brand_refno: brandFullData,
                      gpcoil_width_value: data.gpcoil_width,
                    }}
                    id={idx}
                    data={data}
                    setData={setData}
                    errors={errors}
                    setErrors={setErrors}
                  />
                </View>
              ))}
          </View>
          <TextInput
            mode="flat"
            label="Total Weight"
            value={data.total_weight}
            editable={false}
            returnKeyType="next"
            onSubmitEditing={() => ref_input2.current.focus()}
            style={[{ backgroundColor: "white" }]}
          />
          <TextInput
            mode="flat"
            label="Total Length"
            value={data.total_length}
            editable={false}
            returnKeyType="next"
            onSubmitEditing={() => ref_input2.current.focus()}
            style={[{ backgroundColor: "white" }]}
          />

          <TextInput
            mode="flat"
            label="Rate per Unit"
            value={data.rate}
            keyboardType={"numeric"}
            onChangeText={(text) => {
              setErrors((prev) => {
                return { ...prev, rate: false };
              });
              setData((prev) => {
                return {
                  ...prev,
                  rate: text,
                };
              });
            }}
            style={{ backgroundColor: "white" }}
            error={errors.rate}
          />
          <HelperText type="error" visible={errors.rate}>
            {communication.InvalidHSNSAC}
          </HelperText>

          <TextInput
            mode="flat"
            label="Amount"
            value={data.amount}
            editable={false}
            returnKeyType="next"
            onSubmitEditing={() => ref_input2.current.focus()}
            style={[{ backgroundColor: "white" }]}
          />

          <Dropdown
            label="Supplier Name"
            data={route.params.data.supplier.map((item) => item.client_name)}
            onSelected={(selectedItem) => {
              setErrors((prev) => {
                return { ...prev, supplier_name: false };
              });
              setData((prev) => {
                return { ...prev, supplier_name: selectedItem };
              });
            }}
            isError={error.supplier_name}
            selectedItem={data.supplier_name}
            style={[Styles.paddingTop16]}
          />
          <HelperText type="error" visible={errors.supplier_name}>
            {communication.InvalidServiceName}
          </HelperText>

          <Dropdown
            label="Vendor Name"
            data={route.params.data.vendor.map((item) => item.client_name)}
            onSelected={(selectedItem) => {
              setErrors((prev) => {
                return { ...prev, vendor_name: false };
              });
              setData((prev) => {
                return { ...prev, vendor_name: selectedItem };
              });
            }}
            isError={error.vendor_name}
            selectedItem={data.vendor_name}
            style={[Styles.paddingTop16]}
          />
          <HelperText type="error" visible={errors.vendor_name}>
            {communication.InvalidServiceName}
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
                  return {
                    ...prev,
                    checked: !prev.checked,
                  };
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
            disabled={isbuttonLoading}
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

export default AddProduction;
