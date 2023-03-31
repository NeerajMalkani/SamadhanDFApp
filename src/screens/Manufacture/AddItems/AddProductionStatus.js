import React from "react";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import { useState } from "react";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Styles } from "../../../styles/styles";
import Dropdown from "../../../components/Dropdown";
import Provider from "../../../api/Provider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Card,
  HelperText,
  Snackbar,
  Text,
  TextInput,
} from "react-native-paper";
import { communication } from "../../../utils/communication";
import { theme } from "../../../theme/apptheme";

let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_CompanyAdmin_group_refno = 0;

function AddProductionStatus({ route, navigation }) {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [data, setData] = React.useState({
    mf_vo_no: "",
    productname: "",
    expectedproduct: {},
    shift_name: "",
    production_date:
      route.params.type === "edit"
        ? new Date(
            route.params.data.production_date.substring(6, 11) +
              "/" +
              route.params.data.production_date.substring(3, 5) +
              "/" +
              route.params.data.production_date.substring(0, 2)
          )
        : new Date(),
    total_achieved_products:
      route.params.type === "edit"
        ? route.params.data.total_achieved_products
        : "",
    no_of_coil_used:
      route.params.type === "edit" ? route.params.data.no_of_coil_used : "",
    scrap_wastage:
      route.params.type === "edit" ? route.params.data.scrap_wastage : "",
    supervisor_name:
      route.params.type === "edit" ? route.params.data.supervisor_name : "",
    mastry_name:
      route.params.type === "edit" ? route.params.data.mastry_name : "",
    helper_name:
      route.params.type === "edit" ? route.params.data.helper_name : "",
  });

  const [fullData, setFullData] = React.useState({
    mf_vo_no: [],
    productname: [],
    shift_name: [],
    no_of_coil_used: [],
    supervisor_name: [],
    mastry_name: [],
    helper_name: [],
  });

  const [errors, setErrors] = React.useState({
    mf_vo_no: false,
    productname: false,
    shift_name: false,
    production_date: false,
    total_achieved_products: false,
    no_of_coil_used: false,
    scrap_wastage: false,
    supervisor_name: false,
    mastry_name: false,
    helper_name: false,
  });

  const update = () => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        mf_vo_refno: fullData.mf_vo_no.find(
          (item) => item.mf_vo_no == data.mf_vo_no
        ).mf_vo_refno,
        product_refno: fullData.productname.find(
          (item) => item.productname == data.productname
        ).product_refno,
        shift_refno: fullData.shift_name.find(
          (item) => item.ShiftType_Name == data.shift_name
        ).ShiftTypeKey,
        production_date: data.production_date,
        total_achieved_products: data.total_achieved_products,
        no_of_coil_used: data.no_of_coil_used,
        scrap_wastage: data.scrap_wastage,
        supervisor_user_refno: fullData.supervisor_name.find(
          (item) => item.employee_name == data.supervisor_name
        ).employee_user_refno,
        mastry_user_refno: fullData.mastry_name.find(
          (item) => item.employee_name == data.mastry_name
        ).employee_user_refno,
        helper_user_refno: fullData.helper_name.find(
          (item) => item.employee_name == data.helper_name
        ).employee_user_refno,
      },
    };
    Provider.createDFManufacturer(
      Provider.API_URLS.shiftproductionformcreate,
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
    if (data.mf_vo_no.length === 0) {
      setErrors((prev) => {
        return { ...prev, mf_vo_no: true };
      });
      isValid = false;
    }
    if (data.productname.length === 0) {
      setErrors((prev) => {
        return { ...prev, productname: true };
      });
      isValid = false;
    }
    if (data.shift_name.length === 0) {
      setErrors((prev) => {
        return { ...prev, shift_name: true };
      });
      isValid = false;
    }
    if (data.production_date.length === 0) {
      setErrors((prev) => {
        return { ...prev, production_date: true };
      });
      isValid = false;
    }
    if (data.total_achieved_products.length === 0) {
      setErrors((prev) => {
        return { ...prev, total_achieved_products: true };
      });
      isValid = false;
    }
    if (data.no_of_coil_used.length === 0) {
      setErrors((prev) => {
        return { ...prev, no_of_coil_used: true };
      });
      isValid = false;
    }
    if (data.scrap_wastage.length === 0) {
      setErrors((prev) => {
        return { ...prev, scrap_wastage: true };
      });
      isValid = false;
    }
    if (data.supervisor_name.length === 0) {
      setErrors((prev) => {
        return { ...prev, supervisor_name: true };
      });
      isValid = false;
    }
    if (data.helper_name.length === 0) {
      setErrors((prev) => {
        return { ...prev, helper_name: true };
      });
      isValid = false;
    }
    if (data.mastry_name.length === 0) {
      setErrors((prev) => {
        return { ...prev, mastry_name: true };
      });
      isValid = false;
    }

    if (isValid) {
      setIsButtonLoading(true);
      update();
    }
  };

  const FetchServiceNames = () => {
    const params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
      },
    };

    Provider.createDFManufacturer(
      Provider.API_URLS.get_joborderno_shiftproductionform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            setFullData((prev) => {
              return { ...prev, mf_vo_no: response.data.data };
            });
            console.log(route.params.data);
            setData((prev) => {
              return {
                ...prev,
                mf_vo_no: route.params?.data?.mf_vo_refno
                  ? response.data.data.find(
                      (item) =>
                        item.mf_vo_refno == route.params.data.mf_vo_refno
                    )?.mf_vo_no
                  : "",
              };
            });
          }
        }
      })
      .catch((e) => console.log(e));

    Provider.createDFManufacturer(
      Provider.API_URLS.get_shiftdata_shiftproductionform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            setFullData((prev) => {
              return { ...prev, shift_name: response.data.data };
            });
            setData((prev) => {
              return {
                ...prev,
                shift_name: route.params?.data?.shift_refno
                  ? response.data.data.find(
                      (item) =>
                        item.ShiftTypeKey == route.params.data.shift_refno
                    )?.ShiftType_Name
                  : "",
              };
            });
          }
        }
      })
      .catch((e) => console.log(e));

    Provider.createDFManufacturer(
      Provider.API_URLS.get_noofcoilused_shiftproductionform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            setFullData((prev) => {
              return { ...prev, no_of_coil_used: response.data.data };
            });
          }
        }
      })
      .catch((e) => console.log(e));

    Provider.createDFManufacturer(
      Provider.API_URLS.get_supervisor_shiftproductionform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            setFullData((prev) => {
              return { ...prev, supervisor_name: response.data.data };
            });
          }
        }
      })
      .catch((e) => console.log(e));

    Provider.createDFManufacturer(
      Provider.API_URLS.get_mastry_shiftproductionform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            setFullData((prev) => {
              return { ...prev, mastry_name: response.data.data };
            });
          }
        }
      })
      .catch((e) => console.log(e));

    Provider.createDFManufacturer(
      Provider.API_URLS.get_helper_shiftproductionform,
      params
    )
      .then((response) => {
        if (response.data && response.data.code == "200") {
          if (response.data.data) {
            setFullData((prev) => {
              return { ...prev, helper_name: response.data.data };
            });
          }
        }
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    if (data.mf_vo_no !== "" && data?.mf_vo_no) {
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          mf_vo_refno: fullData.mf_vo_no.find(
            (item) => item.mf_vo_no === data.mf_vo_no
          ).mf_vo_refno,
        },
      };

      Provider.createDFManufacturer(
        Provider.API_URLS.get_productname_shiftproductionform,
        params
      )
        .then((response) => {
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              let filter = response.data.data.map((item) => {
                return {
                  ...item,
                  productname: `${item.productname} >> ${item.brand_name}`,
                };
              });
              setFullData((prev) => {
                return { ...prev, productname: filter };
              });
              setData((prev) => {
                return {
                  ...prev,
                  productname: route.params?.data?.product_refno
                    ? filter.find(
                        (item) =>
                          item.product_refno == route.params.data.product_refno
                      )?.productname
                    : "",
                };
              });
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [data.mf_vo_no]);

  useEffect(() => {
    if (data.mf_vo_no !== "" && data?.mf_vo_no && data.productname !== "") {
      let params = {
        data: {
          Sess_UserRefno: Sess_UserRefno,
          Sess_company_refno: Sess_company_refno,
          Sess_branch_refno: Sess_branch_refno,
          mf_vo_refno: fullData.mf_vo_no.find(
            (item) => item.mf_vo_no === data.mf_vo_no
          ).mf_vo_refno,
          product_refno: fullData.productname.find(
            (item) => item.productname == data.productname
          ).product_refno,
        },
      };
      Provider.createDFManufacturer(
        Provider.API_URLS.get_expectedproductdata_shiftproductionform,
        params
      )
        .then((response) => {
          if (response.data && response.data.code == "200") {
            if (response.data.data) {
              setData((prev) => {
                return {
                  ...prev,
                  expectedproduct: response.data.data[0],
                };
              });
            }
          }
        })
        .catch((e) => console.log(e));
    }
  }, [data.mf_vo_no, data.productname]);

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
              label="Job Order No"
              data={fullData.mf_vo_no.map((item) => item.mf_vo_no)}
              onSelected={(selectedItem) => {
                if (selectedItem !== data.mf_vo_no) {
                  setFullData((prev) => {
                    return { ...prev, productname: [] };
                  });
                  setData((prev) => {
                    return {
                      ...prev,
                      productname: "",
                      expectedproduct: {},
                      mf_vo_no: selectedItem,
                    };
                  });
                  setErrors((prev) => {
                    return {
                      ...prev,
                      mf_vo_no: false,
                      productname: false,
                    };
                  });
                }
              }}
              isError={errors.mf_vo_no}
              selectedItem={data.mf_vo_no}
              style={[Styles.borderred]}
            />
          </View>
          <HelperText type="error" visible={errors.mf_vo_no}>
            {communication.InvalidServiceName}
          </HelperText>

          <View style={[Styles.paddingTop16]}>
            <Dropdown
              label="Product Name"
              data={fullData.productname.map((item) => item.productname)}
              onSelected={(selectedItem) => {
                if (selectedItem !== data.productname) {
                  setData((prev) => {
                    return {
                      ...prev,
                      productname: selectedItem,
                      expectedproduct: {},
                    };
                  });
                  setErrors((prev) => {
                    return {
                      ...prev,
                      productname: false,
                    };
                  });
                }
              }}
              isError={errors.productname}
              selectedItem={data.productname}
              style={[Styles.borderred]}
            />
          </View>
          <HelperText type="error" visible={errors.productname}>
            {communication.InvalidServiceName}
          </HelperText>
          {data.expectedproduct?.balance_products && (
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
                  Expected Products (Qty) To Be Manufactured
                </Text>
              </View>
              <View style={[Styles.border2, Styles.borderBottomRadius4]}>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, padding: 5 }}>
                    <TextInput
                      mode="outlined"
                      label="Total"
                      value={String(data.expectedproduct.total_no_products)}
                      editable={false}
                      returnKeyType="next"
                      style={[{ backgroundColor: "white", height: 40 }]}
                    />
                  </View>
                  <View style={{ flex: 1, padding: 5 }}>
                    <TextInput
                      mode="outlined"
                      label="Used"
                      value={String(data.expectedproduct.manufactured_products)}
                      editable={false}
                      returnKeyType="next"
                      style={[{ backgroundColor: "white", height: 40 }]}
                    />
                  </View>
                  <View style={{ flex: 1, padding: 5 }}>
                    <TextInput
                      mode="outlined"
                      label="Balance"
                      value={String(data.expectedproduct.balance_products)}
                      editable={false}
                      returnKeyType="next"
                      style={[{ backgroundColor: "white", height: 40 }]}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}
          {data.expectedproduct?.balance_products && (
            <View>
              <View
                style={[
                  Styles.borderTopRadius4,
                  { backgroundColor: theme.colors.primary, marginTop: 8 },
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
                  Expected Coils (Qty) To Be Manufactured
                </Text>
              </View>
              <View style={[Styles.border2, Styles.borderBottomRadius4]}>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, padding: 5 }}>
                    <TextInput
                      mode="outlined"
                      label="Total"
                      value={String(data.expectedproduct.coils_received)}
                      editable={false}
                      returnKeyType="next"
                      style={[{ backgroundColor: "white", height: 40 }]}
                    />
                  </View>
                  <View style={{ flex: 1, padding: 5 }}>
                    <TextInput
                      mode="outlined"
                      label="Used"
                      value={String(data.expectedproduct.coils_used)}
                      editable={false}
                      returnKeyType="next"
                      style={[{ backgroundColor: "white", height: 40 }]}
                    />
                  </View>
                  <View style={{ flex: 1, padding: 5 }}>
                    <TextInput
                      mode="outlined"
                      label="Balance"
                      value={String(data.expectedproduct.coils_balance)}
                      editable={false}
                      returnKeyType="next"
                      style={[{ backgroundColor: "white", height: 40 }]}
                    />
                  </View>
                </View>
              </View>
            </View>
          )}

          <View style={[Styles.paddingTop16]}>
            <Dropdown
              label="Shift"
              data={fullData.shift_name.map((item) => item.ShiftType_Name)}
              onSelected={(selectedItem) => {
                if (selectedItem !== data.shift_name) {
                  setData((prev) => {
                    return {
                      ...prev,
                      shift_name: selectedItem,
                    };
                  });
                  setErrors((prev) => {
                    return {
                      ...prev,
                      shift_name: false,
                    };
                  });
                }
              }}
              isError={errors.shift_name}
              selectedItem={data.shift_name}
              style={[Styles.borderred]}
            />
          </View>
          <HelperText type="error" visible={errors.shift_name}>
            {communication.InvalidServiceName}
          </HelperText>

          <View>
            <DateTimePicker
              style={Styles.backgroundColorWhite}
              label="Production Date"
              type="date"
              value={data.production_date}
              onChangeDate={(date) => {
                setData((prev) => {
                  return {
                    ...prev,
                    production_date: date,
                  };
                });
              }}
            />
          </View>
          <View>
            <TextInput
              mode="outlined"
              label="Total Products (Achieved)"
              keyboardType="number-pad"
              value={data.total_achieved_products}
              returnKeyType="next"
              onChangeText={(selectedItem) => {
                if (selectedItem !== data.total_achieved_products) {
                  setData((prev) => {
                    return { ...prev, total_achieved_products: selectedItem };
                  });
                  setErrors((prev) => {
                    return {
                      ...prev,
                      total_achieved_products: false,
                    };
                  });
                }
              }}
              style={[{ backgroundColor: "white" }]}
              error={errors.total_achieved_products}
            />
            <HelperText type="error" visible={errors.total_achieved_products}>
              {"Fill this field."}
            </HelperText>
          </View>

          <View style={[Styles.paddingTop8]}>
            <Dropdown
              label="Number of Coils (Used)"
              data={fullData.no_of_coil_used.map((item) =>
                String(item.no_of_coil)
              )}
              onSelected={(selectedItem) => {
                if (selectedItem !== data.no_of_coil_used) {
                  setData((prev) => {
                    return {
                      ...prev,
                      no_of_coil_used: selectedItem,
                    };
                  });
                  setErrors((prev) => {
                    return {
                      ...prev,
                      no_of_coil_used: false,
                    };
                  });
                }
              }}
              isError={errors.no_of_coil_used}
              selectedItem={data.no_of_coil_used}
              style={[Styles.borderred]}
            />
          </View>
          <HelperText type="error" visible={errors.no_of_coil_used}>
            {communication.InvalidServiceName}
          </HelperText>

          <View>
            <TextInput
             mode="outlined"
              label="Scrap Kg (Production)"
              value={data.scrap_wastage}
              returnKeyType="next"
              keyboardType="number-pad"
              onChangeText={(selectedItem) => {
                if (selectedItem !== data.scrap_wastage) {
                  setData((prev) => {
                    return { ...prev, scrap_wastage: selectedItem };
                  });
                  setErrors((prev) => {
                    return {
                      ...prev,
                      scrap_wastage: false,
                    };
                  });
                }
              }}
              style={[{ backgroundColor: "white" }]}
              error={errors.scrap_wastage}
            />
            <HelperText type="error" visible={errors.scrap_wastage}>
              {"Fill this field."}
            </HelperText>

            <View style={[Styles.paddingTop8]}>
              <Dropdown
                label="Superviser"
                data={fullData.supervisor_name.map((item) =>
                  String(item.employee_name)
                )}
                onSelected={(selectedItem) => {
                  if (selectedItem !== data.supervisor_name) {
                    setData((prev) => {
                      return {
                        ...prev,
                        supervisor_name: selectedItem,
                      };
                    });
                    setErrors((prev) => {
                      return {
                        ...prev,
                        supervisor_name: false,
                      };
                    });
                  }
                }}
                isError={errors.supervisor_name}
                selectedItem={data.supervisor_name}
                style={[Styles.borderred]}
              />
            </View>
            <HelperText type="error" visible={errors.supervisor_name}>
              {communication.InvalidServiceName}
            </HelperText>

            <View style={[Styles.paddingTop8]}>
              <Dropdown
                label="Mastry"
                data={fullData.mastry_name.map((item) =>
                  String(item.employee_name)
                )}
                onSelected={(selectedItem) => {
                  if (selectedItem !== data.mastry_name) {
                    setData((prev) => {
                      return {
                        ...prev,
                        mastry_name: selectedItem,
                      };
                    });
                    setErrors((prev) => {
                      return {
                        ...prev,
                        mastry_name: false,
                      };
                    });
                  }
                }}
                isError={errors.mastry_name}
                selectedItem={data.mastry_name}
                style={[Styles.borderred]}
              />
            </View>
            <HelperText type="error" visible={errors.mastry_name}>
              {communication.InvalidServiceName}
            </HelperText>

            <View style={[Styles.paddingTop8]}>
              <Dropdown
                label="Helper"
                data={fullData.helper_name.map((item) =>
                  String(item.employee_name)
                )}
                onSelected={(selectedItem) => {
                  if (selectedItem !== data.helper_name) {
                    setData((prev) => {
                      return {
                        ...prev,
                        helper_name: selectedItem,
                      };
                    });
                    setErrors((prev) => {
                      return {
                        ...prev,
                        helper_name: false,
                      };
                    });
                  }
                }}
                isError={errors.helper_name}
                selectedItem={data.helper_name}
                style={[Styles.borderred]}
              />
            </View>
            <HelperText type="error" visible={errors.helper_name}>
              {communication.InvalidServiceName}
            </HelperText>
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

export default AddProductionStatus;
