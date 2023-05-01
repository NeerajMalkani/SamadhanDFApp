import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  View,
  LogBox,
  RefreshControl,
  ScrollView,
  StyleSheet,
  LayoutAnimation,
} from "react-native";
import {
  FAB,
  List,
  Snackbar,
  Title,
  HelperText,
  Button,
} from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../api/Provider";
import Header from "../../components/Header";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../components/NoItems";
import { Styles } from "../../styles/styles";
import { theme } from "../../theme/apptheme";
import { NullOrEmpty } from "../../utils/validations";
import Dropdown from "../../components/Dropdown";
import { communication } from "../../utils/communication";
import Search from "../../components/Search";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);

const ArchitectRateCardSetup = ({ navigation }) => {
  //#region Variables

  const [isLoading, setIsLoading] = useState(true);
  const [listData, setListData] = useState([]);
  const [listSearchData, setListSearchData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");
  const [snackbarColor, setSnackbarColor] = useState(theme.colors.success);

  const [selectedServiceProductName, setSelectedServiceProductName] =
    useState("");
  const [serviceName, setServiceName] = useState("");

  const [categoryName, setCategoryName] = useState("");
  const [rum, setRUM] = useState("");
  const [ruwm, setRUWM] = useState("");
  const [auos, setAUOS] = useState("");
  const [shortSpec, setShortSpec] = useState("");
  const [spec, setSpec] = useState("");

  const [activityFullData, setActivityFullData] = useState([]);
  const [activityData, setActivityData] = useState([]);
  // const [activityName, setActivityName] = useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [activityName, setActivityName] = useState("");

  const [servicesFullData, setServicesFullData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  // const [servicesName, setServicesName] = useState(route.params.type === "edit" ? route.params.data.serviceName : "");

  const [errorSN, setSNError] = useState(false);
  const servicesDDRef = useRef({});

  const [categoriesFullData, setCategoriesFullData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  //  const [categoriesName, setCategoriesName] = useState(route.params.type === "edit" ? route.params.data.categoryName : "");
  const [categoriesName, setCategoriesName] = useState("");
  const [errorCN, setCNError] = useState(false);
  const categoriesDDRef = useRef({});

  const [productsFullData, setProductsFullData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  // const [productsName, setProductsName] = useState(route.params.type === "edit" ? route.params.data.productName : "");
  const [productsName, setProductsName] = useState("");
  const [errorPN, setPNError] = useState(false);
  const productsDDRef = useRef({});

  const refRBSheet = useRef();
  //#endregion

  //#region Functions

  useEffect(() => {
    FetchData();
    FetchActvityRoles();
  }, []);

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText(
        "Item " + (from === "add" ? "added" : "updated") + " successfully"
      );
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    Provider.getAll("master/getserviceproducts")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const lisData = [...response.data.data];
            lisData.map((k, i) => {
              k.key = (parseInt(i) + 1).toString();
            });
            console.log(response.data.data);
            setListData(response.data.data);
            setListSearchData(response.data.data);
          }
        } else {
          setListData([]);
          setSnackbarText("No data found");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
        setIsLoading(false);
        setRefreshing(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
        setRefreshing(false);
      });
  };

  const FetchActvityRoles = () => {
    Provider.getAll("master/getmainactivities")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display && el.activityRoleName === "Contractor";
            });
            setActivityFullData(response.data.data);
            servicesDDRef.current.reset();
            const activities = response.data.data.map(
              (data) => data.activityRoleName
            );
            setActivityData(activities);
            setActivityName("Contractor");
            FetchServicesFromActivity("Contractor", response.data.data);
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
            setServicesFullData(response.data.data);
            const services = response.data.data.map((data) => data.serviceName);
            setServicesData(services);
          }
          FetchCategoriesFromServices("Contractor", response.data.data);
        }
      })
      .catch((e) => {});
  };

  const FetchCategoriesFromServices = (selectedItem) => {
    let params = {
      ActivityID: activityFullData.find((el) => {
        return el.activityRoleName === activityName;
      }).id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === selectedItem;
      }).id,
    };
    Provider.getAll(
      `master/getcategoriesbyserviceid?${new URLSearchParams(params)}`
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            // response.data.data = response.data.data.filter((el) => {
            //     return el.display;
            // });
            setCategoriesFullData(response.data.data);
            const categories = response.data.data.map(
              (data) => data.categoryName
            );
            setCategoriesData(categories);
          }
          FetchProductsFromCategory("Contractor", response.data.data);
        }
      })
      .catch((e) => {});
  };

  const FetchProductsFromCategory = (selectedItem) => {
    let params = {
      ActivityID: activityFullData.find((el) => {
        return el.activityRoleName === activityName;
      }).id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      CategoryID: categoriesFullData.find((el) => {
        return el.categoryName === selectedItem;
      }).id,
    };
    Provider.getAll(
      `master/getproductsbycategoryid?${new URLSearchParams(params)}`
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            // response.data.data = response.data.data.filter((el) => {
            //     return el.display;
            // });
            setProductsFullData(response.data.data);
            const products = response.data.data.map((data) => data.productName);
            setProductsData(products);
          }
        }
      })
      .catch((e) => {});
  };

  const onServiceNameSelected = (selectedItem) => {
    setServiceName(selectedItem);
    categoriesDDRef.current.reset();
    productsDDRef.current.reset();
    setCategoriesData([]);

    setCategoriesName("");
    setProductsName("");
    setSNError(false);
    FetchCategoriesFromServices(selectedItem);
  };

  const onCategoriesNameSelected = (selectedItem) => {
    setCategoriesName(selectedItem);
    productsDDRef.current.reset();
    setProductsData([]);
    setProductsName("");
    setCNError(false);
    FetchProductsFromCategory(selectedItem);
  };

  const onProductsNameSelected = (selectedItem) => {
    setProductsName(selectedItem);
    setPNError(false);
  };

  // const OnSearchEmployee = () => {
  //     let isValid = false;
  //     if (!NullOrEmpty(aadharNo.trim()) || !NullOrEmpty(mobileNo.trim())) {
  //         isValid = true;
  //     }
  //     else {

  //         if (NullOrEmpty(aadharNo.trim())) {
  //             setAadharNoInvalid(true);
  //         }

  //         if (NullOrEmpty(mobileNo.trim())) {
  //             setMobileNoInvalid(true);
  //         }
  //     }

  //     if (isValid) {
  //         FetchSearchEmployee();
  //     }
  // };

  // const SetFilters = (snText: string, cnText: string, searcText: string) => {
  //     setProductListTemp(serviceProductList);
  //     let ArrOfData: any = [];

  //     if (snText === "--Select--" && cnText === "--Select--" && searcText === "") {
  //         ArrOfData = serviceProductList;
  //     }

  //     if (snText !== "--Select--") {
  //         ArrOfData = serviceProductList.filter((el: ProductModel) => {
  //             return el.serviceName.toString().toLowerCase().includes(snText.toLowerCase());
  //         });
  //     }

  //     if (cnText !== "--Select--") {
  //         ArrOfData = ArrOfData.filter((el: ProductModel) => {
  //             return el.categoryName.toString().toLowerCase().includes(cnText.toLowerCase());
  //         });
  //     }

  //     if (searchQuery !== "") {
  //         if (snText === "--Select--" || cnText === "--Select--") {
  //             ArrOfData = serviceProductList.filter((el: ProductModel) => {
  //                 return el.productName.toString().toLowerCase().includes(searcText.toLowerCase());
  //             });
  //         } else {
  //             ArrOfData = ArrOfData.filter((el: ProductModel) => {
  //                 return el.productName.toString().toLowerCase().includes(searcText.toLowerCase());
  //             });
  //         }
  //     }

  //     setProductListTemp(ArrOfData);
  // };

  const ApplyFilter = () => {
    let isValid = true;
    if (
      serviceName.length === "" &&
      categoriesName.length === "" &&
      productsName.length === ""
    ) {
      setSNError(true);
      setCNError(true);
      setPNError(true);
      isValid = false;
    }
    if (isValid) {
      if (serviceName !== "") {
        listSearchData[1](
          listData[0].filter((el) => {
            return el.serviceName
              .toString()
              .toLowerCase()
              .includes(serviceName.toLowerCase());
          })
        );
      }

      if (categoriesName !== "") {
        listSearchData[1](
          listData[0].filter((el) => {
            return el.categoryName
              .toString()
              .toLowerCase()
              .includes(categoriesName.toLowerCase());
          })
        );
      }

      if (productsName !== "") {
        listSearchData[1](
          listData[0].filter((el) => {
            return el.productName
              .toString()
              .toLowerCase()
              .includes(productsName.toLowerCase());
          })
        );
      }
    }
  };

  const onApplyFilterClick = () => {
    ApplyFilter();
  };

  const ClearFilter = () => {
    servicesDDRef.current.reset();
    categoriesDDRef.current.reset();
    productsDDRef.current.reset();
    setCategoriesData([]);
    setProductsData([]);
    setServiceName("");
    setCategoriesName("");
    setProductsName("");
    listSearchData[1](listData[0]);
  };

  const onClearFileterClick = () => {
    ClearFilter();
  };

  const onStateNameSelected = (selectedItem) => {
    setStateName(selectedItem);
    setSNError(false);
    cityRef.current.reset();
    setCityName("");
    FetchCities(selectedItem);
  };

  const RenderItems = (data) => {
    return (
      <View
        style={[
          Styles.backgroundColor,
          Styles.borderBottom1,
          Styles.paddingStart16,
          Styles.flexJustifyCenter,
          { height: 80 },
        ]}
      >
        <List.Item
          title={data.item.productName}
          titleStyle={{ fontSize: 18 }}
          description={`Service Name: ${
            NullOrEmpty(data.item.serviceName) ? "" : data.item.serviceName
          }\nCategory Name: ${
            NullOrEmpty(data.item.categoryName) ? "" : data.item.categoryName
          } `}
          left={() => (
            <Icon
              style={{ marginVertical: 12, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="bag-checked"
            />
          )}
          onPress={() => {
            refRBSheet.current.open();
            setSelectedServiceProductName(data.item.productName);
            // setActivityRoleName(data.item.activityRoleName);
            setCategoryName(data.item.categoryName);
            setServiceName(data.item.serviceName);
            setRUM(data.item.rateWithMaterials.toFixed(2));
            setRUWM(data.item.rateWithoutMaterials.toFixed(2));
            setAUOS(data.item.conversionRate);
            setShortSpec(data.item.shortSpecification);
            setSpec(data.item.specification);
            // setUnitName(data.item.unit2ID === data.item.selectedUnitID ? data.item.unit2Name : data.item.unit1Name);
          }}
          right={() => (
            <Icon
              style={{ marginVertical: 12, marginRight: 12 }}
              size={30}
              color={theme.colors.textSecondary}
              name="eye"
            />
          )}
        />
      </View>
    );
  };

  /*list accordian*/
  const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);
  const [finish, setFinish] = useState(false);

  const ListOne = () => {
    useEffect(() => {
      FetchData();
      FetchActvityRoles();
    }, []);
    const FetchData = (from) => {
      if (from === "add" || from === "update") {
        setSnackbarText(
          "Item " + (from === "add" ? "added" : "updated") + " successfully"
        );
        setSnackbarColor(theme.colors.success);
        setSnackbarVisible(true);
      }
      Provider.getAll("master/getserviceproducts")
        .then((response) => {
          if (response.data && response.data.code === 200) {
            if (response.data.data) {
              const lisData = [...response.data.data];
              lisData.map((k, i) => {
                k.key = (parseInt(i) + 1).toString();
              });
              listData[1](response.data.data);
              listSearchData[1](response.data.data);
            }
          } else {
            listData[1]([]);
            setSnackbarText("No data found");
            setSnackbarColor(theme.colors.error);
            setSnackbarVisible(true);
          }
          setIsLoading(false);
          setRefreshing(false);
        })
        .catch((e) => {
          setIsLoading(false);
          setSnackbarText(e.message);
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
          setRefreshing(false);
        });
    };

    const FetchActvityRoles = () => {
      Provider.getAll("master/getmainactivities")
        .then((response) => {
          if (response.data && response.data.code === 200) {
            if (response.data.data) {
              response.data.data = response.data.data.filter((el) => {
                return el.display && el.activityRoleName === "Contractor";
              });
              setActivityFullData(response.data.data);
              servicesDDRef.current.reset();
              const activities = response.data.data.map(
                (data) => data.activityRoleName
              );
              setActivityData(activities);
              setActivityName("Contractor");
              FetchServicesFromActivity("Contractor", response.data.data);
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
      Provider.getAll(
        `master/getservicesbyroleid?${new URLSearchParams(params)}`
      )
        .then((response) => {
          if (response.data && response.data.code === 200) {
            if (response.data.data) {
              setServicesFullData(response.data.data);
              const services = response.data.data.map(
                (data) => data.serviceName
              );
              setServicesData(services);
            }
            FetchCategoriesFromServices("Contractor", response.data.data);
          }
        })
        .catch((e) => {});
    };

    const FetchCategoriesFromServices = (selectedItem) => {
      let params = {
        ActivityID: activityFullData.find((el) => {
          return el.activityRoleName === activityName;
        }).id,
        ServiceID: servicesFullData.find((el) => {
          return el.serviceName === selectedItem;
        }).id,
      };
      Provider.getAll(
        `master/getcategoriesbyserviceid?${new URLSearchParams(params)}`
      )
        .then((response) => {
          if (response.data && response.data.code === 200) {
            if (response.data.data) {
              // response.data.data = response.data.data.filter((el) => {
              //     return el.display;
              // });
              setCategoriesFullData(response.data.data);
              const categories = response.data.data.map(
                (data) => data.categoryName
              );
              setCategoriesData(categories);
            }
            FetchProductsFromCategory("Contractor", response.data.data);
          }
        })
        .catch((e) => {});
    };

    const FetchProductsFromCategory = (selectedItem) => {
      let params = {
        ActivityID: activityFullData.find((el) => {
          return el.activityRoleName === activityName;
        }).id,
        ServiceID: servicesFullData.find((el) => {
          return el.serviceName === serviceName;
        }).id,
        CategoryID: categoriesFullData.find((el) => {
          return el.categoryName === selectedItem;
        }).id,
      };
      Provider.getAll(
        `master/getproductsbycategoryid?${new URLSearchParams(params)}`
      )
        .then((response) => {
          if (response.data && response.data.code === 200) {
            if (response.data.data) {
              // response.data.data = response.data.data.filter((el) => {
              //     return el.display;
              // });
              setProductsFullData(response.data.data);
              const products = response.data.data.map(
                (data) => data.productName
              );
              setProductsData(products);
            }
          }
        })
        .catch((e) => {});
    };

    const onServiceNameSelected = (selectedItem) => {
      setServiceName(selectedItem);
      categoriesDDRef.current.reset();
      productsDDRef.current.reset();
      setCategoriesData([]);

      setCategoriesName("");
      setProductsName("");
      setSNError(false);
      FetchCategoriesFromServices(selectedItem);
    };

    const onCategoriesNameSelected = (selectedItem) => {
      setCategoriesName(selectedItem);
      productsDDRef.current.reset();
      setProductsData([]);
      setProductsName("");
      setCNError(false);
      FetchProductsFromCategory(selectedItem);
    };

    const onProductsNameSelected = (selectedItem) => {
      setProductsName(selectedItem);
      setPNError(false);
    };

    const ApplyFilter = () => {
      let isValid = true;
      if (
        serviceName.length === "" &&
        categoriesName.length === "" &&
        productsName.length === ""
      ) {
        setSNError(true);
        setCNError(true);
        setPNError(true);
        isValid = false;
      }
      if (isValid) {
        if (serviceName !== "") {
          listSearchData[1](
            listData[0].filter((el) => {
              return el.serviceName
                .toString()
                .toLowerCase()
                .includes(serviceName.toLowerCase());
            })
          );
        }

        if (categoriesName !== "") {
          listSearchData[1](
            listData[0].filter((el) => {
              return el.categoryName
                .toString()
                .toLowerCase()
                .includes(categoriesName.toLowerCase());
            })
          );
        }

        if (productsName !== "") {
          listSearchData[1](
            listData[0].filter((el) => {
              return el.productName
                .toString()
                .toLowerCase()
                .includes(productsName.toLowerCase());
            })
          );
        }
      }
    };

    const onApplyFilterClick = () => {
      ApplyFilter();
    };

    const ClearFilter = () => {
      servicesDDRef.current.reset();
      categoriesDDRef.current.reset();
      productsDDRef.current.reset();
      setCategoriesData([]);
      setProductsData([]);
      setServiceName("");
      setCategoriesName("");
      setProductsName("");
      listSearchData[1](listData[0]);
    };

    const onClearFileterClick = () => {
      ClearFilter();
    };

    const RenderItems = (data) => {
      return (
        <View
          style={[
            Styles.backgroundColor,
            Styles.borderBottom1,
            Styles.paddingStart16,
            Styles.flexJustifyCenter,
            { height: 80 },
          ]}
        >
          <List.Item
            title={data.item.productName}
            titleStyle={{ fontSize: 18 }}
            description={`Service Name: ${
              NullOrEmpty(data.item.serviceName) ? "" : data.item.serviceName
            }\nCategory Name: ${
              NullOrEmpty(data.item.categoryName) ? "" : data.item.categoryName
            } `}
            left={() => (
              <Icon
                style={{ marginVertical: 12, marginRight: 12 }}
                size={30}
                color={theme.colors.textSecondary}
                name="bag-checked"
              />
            )}
            onPress={() => {
              refRBSheet.current.open();
              setSelectedServiceProductName(data.item.productName);
              // setActivityRoleName(data.item.activityRoleName);
              setCategoryName(data.item.categoryName);
              setServiceName(data.item.serviceName);
              setRUM(data.item.rateWithMaterials.toFixed(2));
              setRUWM(data.item.rateWithoutMaterials.toFixed(2));
              setAUOS(data.item.conversionRate);
              setShortSpec(data.item.shortSpecification);
              setSpec(data.item.specification);
              // setUnitName(data.item.unit2ID === data.item.selectedUnitID ? data.item.unit2Name : data.item.unit1Name);
            }}
            right={() => (
              <Icon
                style={{ marginVertical: 12, marginRight: 12 }}
                size={30}
                color={theme.colors.textSecondary}
                name="eye"
              />
            )}
          />
        </View>
      );
    };

    // const height = new Animated.Value(0)

    const design = (
      <>
        <Dropdown
          label="Service Name"
          data={servicesData}
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
          data={categoriesData}
          onSelected={onCategoriesNameSelected}
          isError={errorCN}
          selectedItem={categoriesName}
          reference={categoriesDDRef}
        />
        <HelperText type="error" visible={errorCN}>
          {communication.InvalidCategoryName}
        </HelperText>
        <Dropdown
          label="Product Name"
          data={productsData}
          onSelected={onProductsNameSelected}
          isError={errorPN}
          selectedItem={productsName}
          reference={productsDDRef}
        />
        <HelperText type="error" visible={errorPN}>
          {communication.InvalidProductName}
        </HelperText>
        <View style={[Styles.flexRow]}>
          <View style={[Styles.width50per, Styles.padding10]}>
            <Button icon="filter" mode="contained" onPress={onApplyFilterClick}>
              Apply Filter
            </Button>
          </View>
          <View style={[Styles.width50per, Styles.padding10]}>
            <Button
              icon="filter-remove"
              mode="outlined"
              onPress={onClearFileterClick}
            >
              Clear Filter
            </Button>
          </View>
        </View>
      </>
    );
    return design;
  };

  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Rate Card Setup" />
      <View style={[Styles.paddingHorizontal16]}>
        <View>
          <List.Section>
            <List.Accordion
              title="Apply Filters"
              // expanded={expanded}
              // onPress={handlePress}
              style={[Styles.backgroundColorWhite]}
              onPress={() => {
                LayoutAnimation.easeInEaseOut();
              }}
            >
              {/* <Animated.View style={[styles.bodyBackground, { height: bodyHeight }]}>
                                <View
                                    style={styles.bodyContainer}
                                    onLayout={event =>setBodySectionHeight(event.nativeEvent.layout.height)}
                                > */}
              <List.Item title={ListOne} style={[Styles.borderBottom1]} />
              {/* </View>
                            </Animated.View> */}
            </List.Accordion>
          </List.Section>
        </View>
      </View>

      {isLoading ? (
        <View
          style={[
            Styles.flex1,
            Styles.flexJustifyCenter,
            Styles.flexAlignCenter,
          ]}
        >
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : listData.length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Search
            data={listData}
            setData={setListSearchData}
            filterFunction={["product_name", "display"]}
          />
          {listSearchData?.length > 0 ? (
            <SwipeListView
              previewDuration={1000}
              previewOpenValue={-72}
              previewRowKey="1"
              previewOpenDelay={1000}
              refreshControl={
                <RefreshControl
                  colors={[theme.colors.primary]}
                  refreshing={refreshing}
                  onRefresh={() => {
                    FetchData();
                  }}
                />
              }
              data={listSearchData}
              disableRightSwipe={true}
              rightOpenValue={-72}
              renderItem={(data) => RenderItems(data)}
              // renderHiddenItem={(data, rowMap) => RenderHiddenItems(data, rowMap, [EditCallback])}
            />
          ) : (
            <NoItems
              icon="format-list-bulleted"
              text="No records found for your query"
            />
          )}
        </View>
      ) : (
        <NoItems
          icon="format-list-bulleted"
          text="No records found. Add records by clicking on plus icon."
        />
      )}
      {/* <FAB style={[Styles.margin16, Styles.primaryBgColor, { position: "absolute", right: 16, bottom: 16 }]} icon="plus" onPress={AddCallback} /> */}
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarColor }}
      >
        {snackbarText}
      </Snackbar>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        dragFromTopOnly={true}
        height={480}
        animationType="fade"
        customStyles={{
          wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
          draggableIcon: { backgroundColor: "#000" },
        }}
      >
        <View style={{ paddingBottom: 64 }}>
          <Title style={[Styles.paddingHorizontal16]}>
            {selectedServiceProductName}
          </Title>
          <ScrollView>
            {/* <List.Item title="Activity Role Name" description={activityRoleName} /> */}
            <List.Item title="Service Name" description={serviceName} />
            <List.Item title="Category Name" description={categoryName} />
            {/* <List.Item title="HSN / SAC Code" description={hsnsacCode} />
                        <List.Item title="GST Rate" description={gstRate} />
                        <List.Item title="Unit name" description={unitName} /> */}
            <List.Item title="Rate / Unit (with materials)" description={rum} />
            <List.Item
              title="Rate / Unit without materials)"
              description={ruwm}
            />
            <List.Item
              title="Alternate Unit Of Sales"
              description={auos === "" ? "NA" : auos}
            />
            <List.Item
              title="Short Specification"
              description={shortSpec === "" ? "NA" : shortSpec}
            />
            <List.Item
              title="Specification"
              description={spec === "" ? "NA" : spec}
            />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default ArchitectRateCardSetup;
const styles = StyleSheet.create({
  bodyBackground: {
    backgroundColor: "#EFEFEF",
    overflow: "hidden",
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    paddingLeft: "1.5rem",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#EFEFEF",
  },
  bodyContainer: {
    padding: "1rem",
    paddingLeft: "1.5rem",
    position: "absolute",
    bottom: 0,
  },
});
