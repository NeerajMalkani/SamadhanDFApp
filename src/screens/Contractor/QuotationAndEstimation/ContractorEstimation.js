import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState, useRef } from "react";
import { Image, ScrollView, View, TouchableOpacity } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  Snackbar,
  Subheading,
  Text,
  Title,
  List,
} from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../api/Provider";
import Dropdown from "../../../components/Dropdown";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";

let userID = 0;
let Sess_group_refno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
let Sess_branch_refno = 0;
let Sess_company_refno = 0;
const ContractorEstimation = ({ route, navigation }) => {
  //#region Variables
  const [isLoading, setIsLoading] = React.useState(true);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );

  const [showBrandCategory, setShowBrandCategory] = React.useState(false);
  const [brandCategoryData, setBrandCategoryData] = React.useState([]);
  const [brandCategoryFullData, setBrandCategoryFullData] = React.useState([]);
  const [categoryWiseBrandData, setCategoryWiseBrandData] = useState([]);
  const [selectedBrandCategoryID, setSelectedBrandCategoryID] = React.useState("");
  const [categoryWiseBrandFullData, setCategoryWiseBrandFullData] = React.useState([]);
  const refBrandRBSheet = useRef();

  const [estimationData, setEstimationData] = React.useState([]);
  const [estimationDataForMaterialSetup, setEstimationDataForMaterialSetup] =
    React.useState([]);

  const [subtotal, setSubtotal] = React.useState(0);
  const [singleLoad, setSingleLoad] = React.useState(0);

  const [showMCLC, setShowMCLC] = React.useState(false);
  const [showMCD, setShowMCD] = React.useState(false);
  const [brandName, setBrandName] = React.useState("");
  //#endregion

  //#region Functions

  const GetUserID = async () => {
    console.log('load page');
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      Sess_group_refno = JSON.parse(userData).Sess_group_refno;
      Sess_CompanyAdmin_UserRefno =
        JSON.parse(userData).Sess_CompanyAdmin_UserRefno;
      Sess_branch_refno = JSON.parse(userData).Sess_branch_refno;
      Sess_company_refno = JSON.parse(userData).Sess_company_refno;
      if (singleLoad == 0) {

        FetchEstimationData();
      }

    }
  };

  const FetchEstimationData = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
        cont_estimation_refno: route.params.userDesignEstimationID.toString(),
        outputformat: "1",
      },
    };
    Provider.createDFContractor(
      Provider.API_URLS.contractor_scdesign_estimation_edit,
      params
    )
      .then((response) => {
        setSingleLoad(1);
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            //console.log('EstimationData:', response.data.data);
            //console.log('dealer_brand_refno:', response.data.data[0].dealer_brand_refno);

            const objectArray = Object.entries(response.data.data[0].dealer_brand_refno);

            if (objectArray.length > 0) {

              let brandCategory = [];
              objectArray.map(([key, value]) => {

                brandCategory.push({
                  brandData: [
                    JSON.stringify(value)
                  ],
                  categoryName: key,
                  categoryNameDisplay: key.split("#")[1],
                });
              });

              const onlyCatName = brandCategory.map((el) => el.categoryNameDisplay);
              //console.log('onlyCatName', onlyCatName);
              setShowBrandCategory(true);
              setBrandCategoryData(onlyCatName);
              setBrandCategoryFullData(brandCategory);
            }
            else {
              setShowBrandCategory(false);
            }
            console.log('step 4');
            setEstimationData(response.data.data);
            setIsLoading(false);
          }
        } else {
          console.log('step 1');
          setEstimationData([]);
          setSnackbarText("No data found");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.log('step 2');
        setEstimationData([]);
        setSnackbarText("No data found");
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
        setIsLoading(false);
      });
  };

  const InsertDesignEstimationEnquiry = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
        cont_estimation_refno: route.params.data.cont_estimation_refno,
        designgallery_refno: estimationData[0].designgallery_refno,
        product_refno: branddata[0].product_refno,
        brand_refno: branddata[0].brand_refno,
        qty: branddata[0].qty,
        rate: branddata[0].rate,
        discount_rate: branddata[0].discount_rate,
        discount_perc: branddata[0].discount_perc,
        amount: branddata[0].amount,
        formula_value: branddata[0].formula_value,
      },
    };

    Provider.createDFContractor(
      Provider.API_URLS.contractor_scdesign_estimation_update,
      params
    )
      .then((response) => {
        //console.log("params", params);
        //console.log("resp", response.data);
        if (response.data && response.data.code === 200) {
          if (route.params.isContractor) {
            if (response.data.data.Updated == 1) {
              route.params.set(true);
              route.params.fetchData(1, "Updated Successfully");
              navigation.navigate("DesignWiseScreen");
            }
          }
        } else {
          setSnackbarText(communication.InsertError);
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
      });
  };
  const [branddata, setBrandData] = useState(null);
  const onBrandNameSelected = (brands) => {

    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
        cont_estimation_refno: route.params.userDesignEstimationID.toString(),
        dealer_brand_refno:
          brands,
      },
    };
    //console.log('Params:', params);
    Provider.createDFContractor(Provider.API_URLS.contractor_dealer_brand_refno_change, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            //console.log("params", params);
            //console.log("response", response.data.data);
            setBrandData(response.data.data);
            console.log('step 3');
            setEstimationData((prev) => {
              return [
                {
                  ...prev[0],
                  temp_total_labours_cost: `${response.data.data[0].temp_labourcost}`,
                  temp_total_materials_cost: `${response.data.data[0].temp_materialcost}`,
                  temp_total_amount: `${response.data.data[0].temp_totalamount}`,
                },
              ];
            });
            //setIsLoading(false);
          }
        } else {
          setSnackbarText("Error Occured");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setSnackbarText("Error Occured");
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
        setIsLoading(false);
      });

  };

  const onBrandItemSelection = (brandID) => {
    setCategoryWiseBrandData([]);

    let brandFullData = categoryWiseBrandFullData;
    const index = brandFullData[selectedBrandCategoryID].findIndex(element => element.brand_refno == brandID);
    let brandItem = brandFullData[selectedBrandCategoryID][index];

    if (brandItem != null) {

      for (var i = 0; i < brandFullData[selectedBrandCategoryID].length; i++) {
        brandFullData[selectedBrandCategoryID][i].isChecked = false;
      }

      if (brandItem.isChecked) {
        brandFullData[selectedBrandCategoryID][index].isChecked = false
      }
      else {
        brandFullData[selectedBrandCategoryID][index].isChecked = true
      }

      const objectArray = Object.entries(brandFullData);

      if (objectArray.length > 0) {

        let brandCategory = [], brandID = [];
        objectArray.map(([key, value]) => {
          value.map((item) => {
            if (item.isChecked) {
              brandID.push(item.brand_refno);
            }
          });
        });

        //console.log('Brand Array:', brandID);
        setCategoryWiseBrandFullData(brandFullData);
        setCategoryWiseBrandData(brandFullData[selectedBrandCategoryID]);
        refBrandRBSheet.current.forceUpdate();
        onBrandNameSelected(brandID);
      }

    }

  };

  const resetBrandSelection = () => {
    console.log('reset call');
    setCategoryWiseBrandData([]);
    console.log('step 1');
    let brandFullData = categoryWiseBrandFullData;
    console.log(brandFullData);

    const objectArray = Object.entries(brandFullData);
    console.log(objectArray.length);

    if (objectArray.length > 0) {

      let brandCategory = [];
      objectArray.map(([key, value]) => {

        console.log("key wise data", brandFullData[key]);
      });

      // const onlyCatName = brandCategory.map((el) => el.categoryNameDisplay);
      // //console.log('onlyCatName', onlyCatName);
      // setShowBrandCategory(true);
      // setBrandCategoryData(onlyCatName);
      // setBrandCategoryFullData(brandCategory);
    }


    // for (var k = 0; k < brandFullData.length; k++) {

    //   // for (var i = 0; i < brandFullData[k][selectedBrandCategoryID].length; i++) {
    //   //   brandFullData[selectedBrandCategoryID][i].isChecked = false;
    //   // }
    //   console.log('kkkkkkkk:', brandFullData[k]);
    // }

    //setCategoryWiseBrandFullData(brandFullData);


  };

  const SetCategoryBrand = (category) => {
    setCategoryWiseBrandData([]);
    let brandData = brandCategoryFullData.filter((item) => item.categoryNameDisplay == category);
    let categoryID = brandData[0].categoryName.split("#")[0].toString();
    setSelectedBrandCategoryID(categoryID);

    let brandUpdatedJson = [];

    JSON.parse(brandData[0].brandData).map((item) => {

      if (categoryWiseBrandFullData.length == 0) {
        brandUpdatedJson.push({
          ...item,
          isChecked: false
        });
      }
      else {

        let brandFullData = categoryWiseBrandFullData;

        if (brandFullData[categoryID] != null && brandFullData[categoryID] != undefined) {
          const index = brandFullData[categoryID].findIndex(element => element.brand_refno == item.brand_refno);
          let brandItem = brandFullData[categoryID][index];

          brandUpdatedJson.push({
            ...item,
            isChecked: brandItem.isChecked == null ? false : brandItem.isChecked
          });
        }
        else {
          brandUpdatedJson.push({
            ...item,
            isChecked: false
          });
        }
      }

    });

    let manageCategoryWiseBrand = {}, x = {};
    if (categoryWiseBrandFullData.length == 0) {
      manageCategoryWiseBrand[categoryID] = brandUpdatedJson;
      setCategoryWiseBrandFullData(manageCategoryWiseBrand);
    }
    else {
      const objectArray = Object.keys(categoryWiseBrandFullData);

      if (!objectArray.includes(categoryID)) {
        manageCategoryWiseBrand[categoryID] = brandUpdatedJson;
        x = {
          ...categoryWiseBrandFullData,
          ...manageCategoryWiseBrand
        }
      }
      else {
        x = {
          ...categoryWiseBrandFullData
        }
      }

      setCategoryWiseBrandFullData(x);
    }

    setCategoryWiseBrandData(brandUpdatedJson);
    refBrandRBSheet.current.open();

  };

  useEffect(() => {
    GetUserID();
  }, [categoryWiseBrandData]);

  const CreateMaterialsTable = () => {
    if (subtotal === 0 || !route.params.isContractor) {
      return (
        <View style={[Styles.flexColumn]}>
          {estimationDataForMaterialSetup[0].material_data.map((k, i) => {
            return (
              <View key={i} style={[Styles.marginTop8, Styles.border1]}>
                <View
                  style={[
                    Styles.flexRow,
                    Styles.borderBottom1,
                    Styles.paddingHorizontal16,
                    Styles.paddingVertical4,
                    Styles.flexAlignCenter,
                  ]}
                >
                  <Subheading style={[Styles.fontBold]}>
                    {k.productname + " >> "}
                  </Subheading>
                  <Subheading
                    style={[Styles.fontBold, { color: theme.colors.primary }]}
                  >
                    {k.brand_name}
                  </Subheading>
                </View>

                <View
                  style={[
                    Styles.flexRow,
                    Styles.borderBottom1,
                    Styles.paddingHorizontal16,
                    Styles.paddingVertical4,
                    Styles.flexAlignCenter,
                  ]}
                >
                  <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>
                    Quantity
                  </Subheading>
                  <Subheading style={[Styles.flex1]}>{k.qty}</Subheading>
                </View>

                <View
                  style={[
                    Styles.flexRow,
                    Styles.borderBottom1,
                    Styles.paddingHorizontal16,
                    Styles.paddingVertical4,
                    Styles.flexAlignCenter,
                  ]}
                >
                  <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>
                    Rate
                  </Subheading>
                  <Subheading style={[Styles.flex1]}>
                    {k.discount_rate}
                  </Subheading>
                </View>

                <View
                  style={[
                    Styles.flexRow,
                    Styles.borderBottom1,
                    Styles.paddingHorizontal16,
                    Styles.paddingVertical4,
                    Styles.flexAlignCenter,
                  ]}
                >
                  <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>
                    Amount
                  </Subheading>
                  <Subheading style={[Styles.flex1]}>{k.amount}</Subheading>
                </View>
              </View>
            );
          })}
        </View>
      );
    } else {
      return null;
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
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
      ) : (
        <View style={[Styles.flex1, Styles.backgroundColor]}>
          <Image
            source={{ uri: route.params.designImage }}
            style={[Styles.width100per, { height: 192 }]}
          />
          <ScrollView>
            {estimationData && (
              <View style={[Styles.paddingHorizontal8]}>
                <View style={[Styles.flexRow]}>
                  <View style={[Styles.flex1, Styles.padding8]}>
                    <Card>
                      <Card.Content>
                        <Text>Total Sq.Ft.</Text>
                        <Subheading style={[Styles.fontBold]}>
                          {estimationData[0].totalfoot}
                        </Subheading>
                      </Card.Content>
                    </Card>
                  </View>
                  <View style={[Styles.flex1, Styles.padding8]}>
                    <Card>
                      <Card.Content>
                        <Text>Total Amount</Text>
                        <Subheading style={[Styles.fontBold]}>
                          {branddata !== null
                            ? estimationData[0].temp_total_amount
                            : estimationData[0].total_amount}
                        </Subheading>
                      </Card.Content>
                    </Card>
                  </View>
                </View>
                {!showMCLC && (
                  <View style={[Styles.flexRow, Styles.flexAlignSelfCenter]}>
                    <Button mode="text" onPress={() => setShowMCLC(true)}>
                      Details
                    </Button>
                  </View>
                )}
                <View
                  style={[
                    Styles.flexRow,
                    {
                      opacity: showMCLC ? 1 : 0,
                      height: showMCLC ? "auto" : 0,
                    },
                  ]}
                >
                  <View style={[Styles.flexJustifyCenter]}>
                    <Title> = </Title>
                  </View>
                  <View
                    style={[
                      Styles.flex1,
                      Styles.padding8,
                      { alignSelf: "stretch" },
                    ]}
                  >
                    <Card>
                      <Card.Content style={[Styles.paddingHorizontal0]}>
                        <Text style={[Styles.paddingHorizontal16]}>
                          Material Cost
                        </Text>
                        <Subheading
                          style={[Styles.fontBold, Styles.paddingHorizontal16]}
                        >
                          {branddata !== null
                            ? estimationData[0].temp_total_materials_cost
                            : estimationData[0].total_materials_cost}
                        </Subheading>
                        {!showMCD && showMCLC && !route.params.isContractor && (
                          <View style={[Styles.flexRow]}>
                            <Button
                              mode="text"
                              style={[Styles.marginStart8]}
                              labelStyle={[Styles.fontSize12]}
                              compact
                              onPress={() => setShowMCD(true)}
                            >
                              Material Details
                            </Button>
                          </View>
                        )}
                      </Card.Content>
                    </Card>
                  </View>
                  <View style={[Styles.flexJustifyCenter]}>
                    <Title>+</Title>
                  </View>
                  <View
                    style={[
                      Styles.flex1,
                      Styles.margin8,
                      { alignSelf: "stretch" },
                    ]}
                  >
                    <Card style={[Styles.flex1]}>
                      <Card.Content>
                        <Text>Labour Cost</Text>
                        <Subheading style={[Styles.fontBold]}>
                          {branddata !== null
                            ? estimationData[0].temp_total_labours_cost
                            : estimationData[0].total_labours_cost}
                        </Subheading>
                      </Card.Content>
                    </Card>
                  </View>
                </View>
              </View>
            )}
            {route.params.isUpdate && (
              <View style={[Styles.paddingHorizontal16]}>
                {/* <Dropdown
                  label="Brand Name"
                  data={estimationData[0]?.dealer_brand_refno?.map(
                    (item) => item.brand_name
                  )}
                  onSelected={onBrandNameSelected}
                  selectedItem={brandName !== "" ? brandName : ""}
                /> */}

                {showBrandCategory &&
                  <>
                    <View style={[Styles.flexRow, Styles.flexWrap, Styles.flexJustifyCenter]}>
                      {brandCategoryData.map((category, index) => (

                        <TouchableOpacity
                          key={index}
                          style={[
                            Styles.borderRadius8,
                            Styles.homeBox,
                            Styles.flexColumn,
                            Styles.flexJustifyCenter,
                            Styles.flexAlignCenter,
                            Styles.marginHorizontal4,
                            Styles.marginBottom8,
                            { width: 100, height: 72 },
                          ]}
                          onPress={() => {
                            SetCategoryBrand(category);
                          }}
                        >
                          <Text style={[Styles.buttonIconLabel, { textTransform: "uppercase" }]}>{category}</Text>
                        </TouchableOpacity>

                      ))}
                    </View>
                  </>
                }

              </View>
            )}

            {branddata !== null && (
              <View style={[Styles.flexRow, Styles.flexAlignSelfCenter]}>
                <Button
                  mode="text"
                  onPress={() => {
                    resetBrandSelection();
                    setBrandName("");
                    setBrandData(null);

                  }}
                >
                  Reset
                </Button>
              </View>
            )}
            {(estimationData &&
              estimationData[0] &&
              !estimationData[0].status) ||
              (route.params.isContractor && branddata !== null) ? (
              <View style={[Styles.padding16]}>
                {route.params.isContractor && branddata !== null && (
                  <>
                    <Button
                      mode="contained"
                      onPress={() => {
                        InsertDesignEstimationEnquiry();
                      }}
                    >
                      {route.params.isUpdate
                        ? "Update and Send Quote"
                        : "Send Quote to Client"}
                    </Button>
                  </>
                )}
              </View>
            ) : null}
          </ScrollView>
        </View>
      )}

      <RBSheet ref={refBrandRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={400} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View style={[Styles.flex1, Styles.marginBottom16]}>
          <ScrollView style={[Styles.marginBottom48]}>
            <List.Section>
              {categoryWiseBrandData.map((item, i) => {
                return (
                  <List.Item
                    key={i}
                    title={item.brand_name}
                    onPress={() => {
                      onBrandItemSelection(item.brand_refno);
                    }}
                    style={[Styles.borderBottom1, Styles.height48, Styles.flexAlignCenter, Styles.flexJustifyCenter]}
                    right={(props) => <List.Icon {...props} icon="check" color={theme.colors.success} style={{ opacity: item.isChecked ? 1 : 0 }} />}
                  >
                    <Text>{item.brand_name}</Text>
                  </List.Item>
                );
              })}
            </List.Section>
          </ScrollView>
          <Button
            mode="contained"
            style={[Styles.width104, Styles.flexAlignSelfCenter, { position: "absolute", bottom: 0 }]}
            onPress={() => {
              refBrandRBSheet.current.close();
            }}
          >
            DONE
          </Button>
        </View>
      </RBSheet>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        style={{ backgroundColor: snackbarColor }}
      >
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default ContractorEstimation;
