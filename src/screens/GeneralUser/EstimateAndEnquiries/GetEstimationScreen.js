import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { Image, ScrollView, View } from "react-native";
import { ActivityIndicator, Button, Card, Snackbar, Subheading, Text, Title } from "react-native-paper";
import Provider from "../../../api/Provider";
import Dropdown from "../../../components/Dropdown";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";

let userID = 0, Sess_group_refno = 0;
const GetEstimationScreen = ({ route, navigation }) => {

  //#region Variables
  const [isLoading, setIsLoading] = React.useState(true);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [estimationData, setEstimationData] = React.useState([]);
  const [estimationDataForMaterialSetup, setEstimationDataForMaterialSetup] = React.useState([]);

  const [subtotal, setSubtotal] = React.useState(0);

  const [showMCLC, setShowMCLC] = React.useState(false);
  const [showMCD, setShowMCD] = React.useState(false);

  const [brandsFullData, setBrandsFullData] = React.useState([]);
  const [uniqueBrandsData, setUniqueBrandsData] = React.useState([]);
  const [brandsData, setBrandsData] = React.useState([]);
  const [brandName, setBrandName] = React.useState([]);
  //#endregion 

  //#region Functions

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      Sess_group_refno = JSON.parse(userData).Sess_group_refno;
      FetchEstimationData();
    }
  };

  const FetchEstimationData = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: Sess_group_refno,
        estimation_refno: route.params.userDesignEstimationID.toString()
      }
    };
    Provider.createDFCommon(Provider.API_URLS.getsc_estimationdetail, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            FetchEstimationMaterialSetupData();
            setEstimationData(response.data.data);
            setIsLoading(false);

          }
        } else {
          setEstimationData([]);
          setSnackbarText("No data found");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setEstimationData([]);
        setSnackbarText("No data found");
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
        setIsLoading(false);
      });
  };

  const FetchEstimationMaterialSetupData = (materialSetupID) => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: Sess_group_refno,
        estimation_refno: route.params.userDesignEstimationID.toString(),
      }
    };

    Provider.createDFCommon(Provider.API_URLS.getsc_estimationmaterialdetail, params)
      .then((response) => {

        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setEstimationDataForMaterialSetup(response.data.data);
            if (route.params.isUpdate) {
              FetchBrandsForMaterialSetup(response.data.data);
            }
          }
        } else {
          setEstimationDataForMaterialSetup([]);
          setSnackbarText("No data found");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
      });
  };

  const InsertDesignEstimationEnquiry = () => {
    let params = {
      // ID: route.params.userDesignEstimationID,
      // SubtotalAmount: parseFloat(subtotal),
      // LabourCost: parseFloat(CalculateSqFt(estimationData[0])) * parseFloat(estimationData[0].total_labours_cost),
      // TotalAmount: (subtotal + subtotal * (5 / 100) + parseFloat(CalculateSqFt(estimationData[0])) * parseFloat(estimationData[0].total_labours_cost)).toFixed(4),
      // Status: true,

      data: {
        Sess_UserRefno: userID,
        Sess_group_refno: Sess_group_refno,
        estimation_refno: route.params.userDesignEstimationID.toString()
      }
    };
    // if (route.params.isContractor) {
    //   params.ClientID = route.params.clientID;
    //   params.ApprovalStatus = 0;
    // }
    Provider.createDFCommon(Provider.API_URLS.sc_estimationsendenquiry, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (route.params.isContractor) {
            if (route.params.fetchData) {
              route.params.fetchData(true);
            }
            navigation.navigate("DesignWiseScreen");
          } else {
            navigation.navigate("YourEstimationsScreen");
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

  const FetchBrandsForMaterialSetup = (productData) => {
    const productids = productData.map((data) => data.productID);
    let params = {
      ProductID: productids.join(","),
    };
    Provider.getAll(`servicecatalogue/getbrandsbyproductids?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setBrandsFullData(response.data.data);
            const key = "brandID";
            const uniqueBrands = [...new Map(response.data.data.map((item) => [item[key], item])).values()];
            setUniqueBrandsData(uniqueBrands);
            const formattedData = uniqueBrands.map((data) => data.brandName + " (" + data.categoryName + ")");
            setBrandsData(formattedData);
          }
        }
      })
      .catch((e) => { });
  };

  const onBrandNameSelected = (selectedItem, index) => {
    setBrandName(selectedItem);
    const selecedBrand = uniqueBrandsData[parseInt(index)];
    const appliedProducts = brandsFullData.filter((el) => {
      return el.brandID === selecedBrand.brandID;
    });
    const totalSqFt = CalculateSqFt(estimationData[0]);
    const newData = [...estimationDataForMaterialSetup];
    newData.map((k) => {
      const foundProduct = appliedProducts.find((el) => el.productID === k.productID);
      if (foundProduct) {
        k.brandID = foundProduct.brandID;
        k.brandName = foundProduct.brandName;
        k.price = foundProduct.price.toFixed(4);
        const quants = parseFloat(totalSqFt.toString()) / parseFloat(k.formula);
        k.quantity = quants.toFixed(4);
        let newAmount = parseFloat(quants) * parseFloat(foundProduct.price);
        newAmount = newAmount - newAmount * (parseFloat(k.generalDiscount) / 100);
        k.amount = newAmount.toFixed(4);
      } else {
        const quants = parseFloat(totalSqFt.toString()) / parseFloat(k.formula);
        k.quantity = quants.toFixed(4);
        let newAmount = parseFloat(quants) * parseFloat(k.rate);
        newAmount = newAmount - newAmount * (parseFloat(k.generalDiscount) / 100);
        k.amount = newAmount.toFixed(4);
      }
    });
    const amounts = newData.map((data) => data.amount);
    const totAmount = amounts.reduce((a, b) => a + parseFloat(b), 0);
    setSubtotal(parseFloat(totAmount));
  };

  useEffect(() => {
    GetUserID();
  }, []);

  const CalculateSqFt = (data) => {
    if (data) {
      const lengthFeetIn = data["length"].toString().split(".");
      const widthFeetIn = data["width"].toString().split(".");
      const lf = lengthFeetIn[0];
      const li = lengthFeetIn.length > 1 ? lengthFeetIn[1] : 0;
      const wf = widthFeetIn[0];
      const wi = widthFeetIn.length > 1 ? widthFeetIn[1] : 0;
      const inches = ((parseInt(lf) * 12 + parseInt(li)) * (parseInt(wf) * 12 + parseInt(wi))) / 144;
      return parseFloat(inches).toFixed(4);
    } else {
      return 0;
    }
  };

  const CreateMaterialsTable = () => {
    if (subtotal === 0 || !route.params.isContractor) {
      //const targetSqFt = estimationData[0].totalfoot;
      //let subtotalCal = 0;
      return (
        <View style={[Styles.flexColumn]}>
          {estimationDataForMaterialSetup[0].material_data.map((k, i) => {

            //const newQuant = parseFloat(parseFloat(targetSqFt) / parseFloat(k.formula));
            //let newAmount = parseFloat(newQuant) * parseFloat(k.rate);
            //let discountedNewAmount = newAmount - newAmount * (parseFloat(k.generalDiscount) / 100);
            //subtotalCal += discountedNewAmount;
            // if (parseInt(i) === estimationDataForMaterialSetup.length - 1) {
            //   setSubtotal(subtotalCal);
            // }
            return (
              <View key={i} style={[Styles.marginTop8, Styles.border1]}>

                <View style={[Styles.flexRow, Styles.borderBottom1, Styles.paddingHorizontal16, Styles.paddingVertical4, Styles.flexAlignCenter]}>
                  <Subheading style={[Styles.fontBold]}>{k.productname + " >> "}</Subheading>
                  <Subheading style={[Styles.fontBold, { color: theme.colors.primary }]}>{k.brand_name}</Subheading>
                </View>

                <View style={[Styles.flexRow, Styles.borderBottom1, Styles.paddingHorizontal16, Styles.paddingVertical4, Styles.flexAlignCenter]}>
                  <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Quantity</Subheading>
                  <Subheading style={[Styles.flex1]}>{k.qty}</Subheading>
                </View>

                <View style={[Styles.flexRow, Styles.borderBottom1, Styles.paddingHorizontal16, Styles.paddingVertical4, Styles.flexAlignCenter]}>
                  <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Rate</Subheading>
                  <Subheading style={[Styles.flex1]}>{k.discount_rate}</Subheading>
                </View>

                <View style={[Styles.flexRow, Styles.borderBottom1, Styles.paddingHorizontal16, Styles.paddingVertical4, Styles.flexAlignCenter]}>
                  <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Amount</Subheading>
                  <Subheading style={[Styles.flex1]}>{k.amount}</Subheading>
                </View>

                {/* <View style={[Styles.flexRow, Styles.paddingHorizontal16, Styles.paddingVertical4, Styles.flexAlignCenter]}>
                  <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>{"Amount (-" + k.generalDiscount.toFixed(0) + "%)"}</Subheading>
                  <Subheading style={[Styles.flex1]}>{discountedNewAmount.toFixed(4)}</Subheading>
                </View> */}
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
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <View style={[Styles.flex1, Styles.backgroundColor]}>
          <Image source={{ uri: route.params.designImage }} style={[Styles.width100per, { height: 192 }]} />
          <ScrollView>
            {estimationData && (
              <View style={[Styles.paddingHorizontal8]}>
                <View style={[Styles.flexRow]}>
                  <View style={[Styles.flex1, Styles.padding8]}>
                    <Card>
                      <Card.Content>
                        <Text>Total Sq.Ft.</Text>
                        <Subheading style={[Styles.fontBold]}>{estimationData[0].totalfoot}</Subheading>
                      </Card.Content>
                    </Card>
                  </View>
                  <View style={[Styles.flex1, Styles.padding8]}>
                    <Card>
                      <Card.Content>
                        <Text>Total Amount</Text>
                        <Subheading style={[Styles.fontBold]}>{estimationData[0].total_amount}</Subheading>
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
                <View style={[Styles.flexRow, { opacity: showMCLC ? 1 : 0, height: showMCLC ? "auto" : 0 }]}>
                  <View style={[Styles.flexJustifyCenter]}>
                    <Title> = </Title>
                  </View>
                  <View style={[Styles.flex1, Styles.padding8, { alignSelf: "stretch" }]}>
                    <Card>
                      <Card.Content style={[Styles.paddingHorizontal0]}>
                        <Text style={[Styles.paddingHorizontal16]}>Material Cost</Text>
                        <Subheading style={[Styles.fontBold, Styles.paddingHorizontal16]}>{estimationData[0].total_materials_cost}</Subheading>
                        {!showMCD && showMCLC && !route.params.isContractor && (
                          <View style={[Styles.flexRow]}>
                            <Button mode="text" style={[Styles.marginStart8]} labelStyle={[Styles.fontSize12]} compact onPress={() => setShowMCD(true)}>
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
                  <View style={[Styles.flex1, Styles.margin8, { alignSelf: "stretch" }]}>
                    <Card style={[Styles.flex1]}>
                      <Card.Content>
                        <Text>Labour Cost</Text>
                        <Subheading style={[Styles.fontBold]}>{estimationData[0].total_labours_cost}</Subheading>
                      </Card.Content>
                    </Card>
                  </View>
                </View>
              </View>
            )}
            {route.params.isUpdate && (
              <View style={[Styles.paddingHorizontal16]}>
                <Dropdown label="Brand Name" data={brandsData} onSelected={onBrandNameSelected} selectedItem={brandName} />
              </View>
            )}
            {(estimationData && estimationData[0] && !estimationData[0].status) || route.params.isContractor ? (
              <View style={[Styles.padding16]}>
                {route.params.isContractor &&
                  <>
                    <Button
                      mode="contained"
                      onPress={() => {
                        InsertDesignEstimationEnquiry();
                      }}
                    >
                      {route.params.isUpdate ? "Update and Send Quote" : "Send Quote to Client"}
                    </Button>
                  </>
                }
                {!route.params.isContractor && !route.params.enquirySent &&
                  <>
                    <Button
                      mode="contained"
                      onPress={() => {
                        InsertDesignEstimationEnquiry();
                      }}
                    >
                      Send Enquiry
                    </Button>
                  </>
                }
                


              </View>
            ) : null}
            {estimationDataForMaterialSetup.length > 0 && (
              <View style={[Styles.flex1, { opacity: showMCD ? 1 : 0, marginBottom: showMCD ? 64 : 0 }]}>
                <Title style={[Styles.paddingHorizontal16]}>Material Details</Title>
                <CreateMaterialsTable />
                <View style={[Styles.flexRow, Styles.borderTop2, Styles.paddingHorizontal16, Styles.paddingVertical8, Styles.flexAlignCenter, { borderTopColor: theme.colors.text }]}>
                  <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Sub Total</Subheading>
                  <Subheading style={[Styles.flex1, Styles.fontBold]}>{estimationDataForMaterialSetup[0].subtotal}</Subheading>
                </View>
                <View style={[Styles.flexRow, Styles.borderTop1, Styles.paddingHorizontal16, Styles.paddingVertical8, Styles.flexAlignCenter]}>
                  <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Transport Charges</Subheading>
                  <Subheading style={[Styles.flex1, Styles.fontBold]}>{estimationDataForMaterialSetup[0].transport_charges}</Subheading>
                </View>
                <View style={[Styles.flexRow, Styles.borderTop1, Styles.paddingHorizontal16, Styles.paddingVertical8, Styles.flexAlignCenter, { borderTopColor: theme.colors.text }]}>
                  <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Total</Subheading>
                  <Subheading style={[Styles.flex1, Styles.fontBold, Styles.primaryColor]}>{estimationDataForMaterialSetup[0].nettotal}</Subheading>
                </View>
              </View>
            )}
          </ScrollView>
          {showMCD && (
            <View style={[Styles.backgroundColor, Styles.width100per, Styles.padding16, Styles.borderTop2, { position: "absolute", bottom: 0, elevation: 50 }]}>
              <Card.Content style={[Styles.flexRow, Styles.flexAlignCenter, { justifyContent: "flex-end" }]}>
                <Subheading style={[Styles.paddingEnd16]}>To buy material</Subheading>
                <Button mode="contained" onPress={() => { }}>
                  Add to Cart
                </Button>
              </Card.Content>
            </View>
          )}
        </View>
      )}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default GetEstimationScreen;
