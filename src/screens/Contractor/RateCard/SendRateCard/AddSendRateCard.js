import React, { useEffect, useRef } from "react";
import { ScrollView, View, Dimensions } from "react-native";
import {
  Button,
  Card,
  Checkbox,
  HelperText,
  IconButton,
  Snackbar,
  Subheading,
  Text,
  TextInput,
  Portal,
  Dialog,
  Paragraph,
} from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RBSheet from "react-native-raw-bottom-sheet";
import AddRateCardProducts from "./AddRateCardProducts";
let userID = 0;

const AddSendRateCard = ({ route, navigation }) => {
  //#region Variables
  const [selectedID, setSelectedID] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showNote, setShowNote] = React.useState(false);
  const [clientNameFullData, setClientNameFullData] = React.useState([]);
  const [clientNameData, setClientNameData] = React.useState([]);
  const [clientName, setClientName] = React.useState("");
  const [clientNameID, setClientNameID] = React.useState(0);
  const [errorCN, setCNError] = React.useState(false);

  const [cName, setCName] = React.useState("");
  const [clientNumber, setClientNumber] = React.useState("");
  const [errorPL, setPLError] = React.useState(false);

  const [unitSalesFullData, setUnitSalesFullData] = React.useState([]);
  const [unitSalesData, setUnitSalesData] = React.useState(["Foot", "Meter"]);
  const [unitSalesName, setUnitSalesName] = React.useState("");
  const [errorUS, setUSError] = React.useState(false);

  const [checked, setChecked] = React.useState(false);
  const arrProductData = React.useState([]);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(
    theme.colors.success
  );
  const [refreshing, setRefreshing] = React.useState(false);
  const refRBSheet = useRef();
  const windowHeight = Dimensions.get("window").height;
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  //#endregion

  useEffect(() => {
    GetUserID();
  }, []);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      if (route.params.type === "edit") {
        setSelectedID(route.params.data.id);
        FetchRateCardByID(route.params.data.id);
      } else {
        FetchCompanyName("");
      }
    }
  };

  const showDialog = () => setIsDialogVisible(true);

  const hideDialog = () => setIsDialogVisible(false);

  //#region Functions

  const FetchRateCardByID = (id) => {
    let params = {
      ID: id,
      AddedByUserID: userID,
    };
    Provider.getAll(
      `master/getcontractorsentratecardbyid?${new URLSearchParams(params)}`
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setClientNameID(response.data.data[0].clientID);
            setUnitSalesName(
              response.data.data[0].selectedUnitID == 1 ? "Foot" : "Meter"
            );
            setChecked(response.data.data[0].inclusiveMaterials);

            FetchCompanyName(response.data.data[0].clientID);
            FetchProductsByID(
              id,
              response.data.data[0].selectedUnitID == 1 ? "Foot" : "Meter"
            );
          }
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

  const FetchCompanyName = (clientID) => {
    let params = {
      AddedByUserID: userID,
    };
    Provider.getAll(
      `master/getcontractorclientlist?${new URLSearchParams(params)}`
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setClientNameFullData(response.data.data);
            const client = response.data.data.map((data) => data.companyName);
            setClientNameData(client);

            if (clientID !== "") {
              let d = response.data.data.filter((el) => {
                return el.id == clientID;
              });
              setClientName(d[0].companyName);
              setClientNameID(d[0].id);
              setCName(d[0].contactPerson);
              setClientNumber(d[0].contactMobileNumber);
            }
          }
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

  const FetchProductsByID = (selectedID, selectedUnit) => {
    let params = {
      ContractorID: userID,
      RateCardMappingID: selectedID,
    };
    Provider.getAll(
      `master/getcontractorratecardproductsbyid?${new URLSearchParams(params)}`
    )
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            let arr = [];
            response.data.data.find(function (item, i) {
              arr.push({
                categoryID: item.categoryID,
                categoryName: item.categoryName,
                footRate: item.footRate,
                meterRate: item.meterRate,
                productID: item.productID,
                productName: item.productName,
                serviceID: item.serviceID,
                serviceName: item.serviceName,
                shortSpecification: item.shortSpecification,
                specification: item.specification,
                unit1ID: item.unit1ID,
                unit1Name: item.unit1Name,
                unit2ID: item.unit2ID,
                unit2Name: item.unit2Name,
                unitOfSalesID: item.unitOfSalesID,
                selectedUnitID:
                  selectedUnit == "Foot" ? item.unit1ID : item.unit2ID,
                unit: selectedUnit == "Foot" ? item.unit1Name : item.unit2Name,
                rate: selectedUnit == "Foot" ? item.footRate : item.meterRate,
                //altRate: selectedUnit == "Foot" ? item.meterRate : item.footRate,
                altUnit:
                  selectedUnit == "Foot" ? item.unit2Name : item.unit1Name,
                altRate:
                  selectedUnit == "Foot"
                    ? (
                        parseFloat(item.footRate) *
                        parseFloat(item.meterConversion)
                      ).toFixed(2)
                    : (
                        parseFloat(item.meterRate) *
                        parseFloat(item.footConversion)
                      ).toFixed(2),
              });
            });
            arrProductData[1](arr);
            setShowNote(true);
          }
        }
      })
      .catch((e) => {});
  };

  const onClientNameSelected = (selectedItem) => {
    setClientName(selectedItem);
    setCNError(false);

    let c = clientNameFullData.filter((el) => {
      return el.companyName === selectedItem;
    });

    setCName(c[0].contactPerson);
    setClientNumber(c[0].contactMobileNumber);
  };

  const onUnitSaleSelected = (selectedItem) => {
    setUnitSalesName(selectedItem);
    if (selectedItem !== unitSalesName) {
      if (arrProductData[0].length > 0) {
        showDialog();
      }

      setUSError(false);
    }
  };

  const resetProducts = () => {
    if (unitSalesName === "Meter") {
      setUnitSalesName("Foot");
      updatedUnit = "Foot";
    } else {
      setUnitSalesName("Meter");
      updatedUnit = "Meter";
    }
    setIsDialogVisible(false);
  };

  const OpenProductDialog = () => {
    refRBSheet.current.open();
  };

  const updateProducts = () => {
    let updatedUnit = "";
    if (unitSalesName === "Meter") {
      setUnitSalesName("Meter");
      updatedUnit = "Meter";
    } else {
      setUnitSalesName("Foot");
      updatedUnit = "Foot";
    }
    arrProductData[0].map((item, i) => {
      let rate = item.rate;
      let unit = item.unit;
      let selectedUnit = 0;
      item.rate = item.altRate;
      item.unit = item.altUnit;
      item.altRate = rate;
      item.altUnit = unit;
      item.selectedUnitID =
        updatedUnit === "Meter" ? item.unit2ID : item.unit1ID;
    });

    setIsDialogVisible(false);
  };

  const ValidateData = () => {
    let isValid = true;

    if (clientName === "") {
      isValid = false;
      setCNError(true);
    }

    if (arrProductData[0].length !== 0 && isValid) {
      InsertUpdateData();
    } else {
      setSnackbarVisible(true);
      setSnackbarColor(theme.colors.error);
      setSnackbarText("Please select all mandatory fields");
    }
  };

  const InsertUpdateData = () => {
    let productArr = [];
    arrProductData[0].find(function (item, i) {
      productArr.push({
        ID: 0,
        RateCardMappingID: selectedID,
        ProductID: item.productID,
        ServiceID: item.serviceID,
        CategoryID: item.categoryID,
        SelectedUnitID: item.selectedUnitID,
        UnitOfSalesID: item.unitOfSalesID,
        Rate: item.rate,
      });
    });

    let contractorRateCardMapping = [
      {
        ID: selectedID,
        ClientID: clientNameFullData.filter((el) => {
          return el.companyName === clientName;
        })[0].id,
        SelectedUnitID: unitSalesName == "Foot" ? 1 : 2,
        UnitOfSalesID: 0,
        InclusiveMaterials: checked,
        AddedByUserID: userID,
      },
    ];

    let contractorRateCardMappingItems = productArr;

    let params = {
      contractorRateCardMapping: contractorRateCardMapping,
      contractorRateCardMappingItems: contractorRateCardMappingItems,
    };

    Provider.create("master/insertupdatesendratecard", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData(
            route.params.type === "edit" ? "update" : "add"
          );
          navigation.goBack();
        } else {
          setSnackbarColor(theme.colors.error);
          setSnackbarText(communication.UpdateError);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarColor(theme.colors.error);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView
        style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[Styles.padding16]}>
          <View
            style={[
              Styles.width100per,
              Styles.borderBottom2,
              Styles.borderBottom2,
              Styles.marginBottom16,
            ]}
          >
            <Text
              style={[
                Styles.fontSize20,
                Styles.fontBold,
                Styles.marginBottom4,
                Styles.blueFontColor,
              ]}
            >
              Client Details
            </Text>
          </View>
          <View
            style={[Styles.width100per, Styles.flexRow, Styles.flexAlignCenter]}
          >
            <View style={[Styles.width75per]}>
              <Dropdown
                label="Client Name"
                data={clientNameData}
                onSelected={onClientNameSelected}
                isError={errorCN}
                selectedItem={clientName}
              />
              <HelperText type="error" visible={errorCN}>
                {communication.InvalidClientName}
              </HelperText>
            </View>
            <View
              style={[
                Styles.width20per,
                Styles.flexAlignSelfCenter,
                Styles.flexJustifyEnd,
                Styles.marginStart16,
                Styles.marginBottom24,
              ]}
            >
              {/* <Button icon={'account-multiple-plus'} style={[Styles.width48,Styles.textCenter]} mode="contained" /> */}
              {/* <IconButton 
              icon={'account-multiple-plus'}
              mode="contained"
              backgroundColor="#000"
              
              ></IconButton> */}
              <IconButton
                style={[Styles.border2, Styles.borderRadius4, Styles.width72]}
                icon={"account-multiple-plus"}
                size={35}
                color="#198754"
              ></IconButton>
            </View>
          </View>
          <TextInput
            mode="outlined"
            dense
            label="Client Name"
            value={cName}
            disabled
          ></TextInput>
          <TextInput
            mode="outlined"
            dense
            label="Client Number"
            value={clientNumber}
            disabled
            style={{ marginTop: 20 }}
          ></TextInput>
        </View>

        <View style={[Styles.padding16]}>
          <View
            style={[
              Styles.width100per,
              Styles.borderBottom2,
              Styles.borderBottom2,
              Styles.marginBottom16,
            ]}
          >
            <Text
              style={[
                Styles.fontSize20,
                Styles.fontBold,
                Styles.marginBottom4,
                Styles.blueFontColor,
              ]}
            >
              Rate Card Prparation Type
            </Text>
          </View>
          <Dropdown
            label="Unit Of Sales"
            data={unitSalesData}
            onSelected={onUnitSaleSelected}
            isError={errorUS}
            selectedItem={unitSalesName}
          />
          <HelperText type="error" visible={errorUS}>
            {communication.InvalidSalesUnit}
          </HelperText>
          <View>
            <Checkbox.Item
              label="Inclusive Material"
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
              color={theme.colors.primary}
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                if (arrProductData[0].length == 0) {
                  setChecked(!checked);
                }
              }}
            />
          </View>
          <Button mode="contained" style={{ marginTop: 20 }} icon="plus">
            Add Product
          </Button>
        </View>

        <View style={[Styles.padding16]}>
          <View
            style={[
              Styles.width100per,
              Styles.borderBottom2,
              Styles.borderBottom2,
              Styles.marginBottom16,
            ]}
          >
            <Text
              style={[
                Styles.fontSize20,
                Styles.fontBold,
                Styles.marginBottom4,
                Styles.blueFontColor,
              ]}
            >
              Product Details
            </Text>
          </View>
        </View>

        <View style={[Styles.padding16]}>
          {arrProductData[0].map((k, i) => {
            return (
              <View
                key={i}
                style={[
                  Styles.flexColumn,
                  Styles.border1,
                  Styles.marginTop16,
                  Styles.paddingHorizontal16,
                ]}
              >
                <View
                  style={[
                    Styles.flexRow,
                    Styles.borderBottom1,
                    Styles.padding4,
                    Styles.flexAlignCenter,
                  ]}
                >
                  <Subheading
                    style={[Styles.flex1, Styles.primaryColor, Styles.fontBold]}
                  >
                    {k.productName}
                  </Subheading>
                </View>
                <View
                  style={[
                    Styles.flexRow,
                    Styles.borderBottom1,
                    Styles.padding4,
                    Styles.flexAlignCenter,
                  ]}
                >
                  <Text style={[Styles.flex1]}>Service Name</Text>
                  <TextInput
                    mode="outlined"
                    dense
                    style={[Styles.flex1]}
                    editable={false}
                    value={k.brandName}
                  />
                </View>
                <View
                  style={[
                    Styles.flexRow,
                    Styles.borderBottom1,
                    Styles.padding4,
                    Styles.flexAlignCenter,
                  ]}
                >
                  <Text style={[Styles.flex1]}>Category Name</Text>
                  <TextInput
                    mode="outlined"
                    dense
                    style={[Styles.flex1]}
                    editable={false}
                    value={k.quantity ? parseFloat(k.quantity).toFixed(4) : ""}
                  />
                </View>
                <View
                  style={[
                    Styles.flexRow,
                    Styles.borderBottom1,
                    Styles.padding4,
                    Styles.flexAlignCenter,
                  ]}
                >
                  <Text style={[Styles.flex1]}>Product Name</Text>
                  <TextInput
                    mode="outlined"
                    dense
                    style={[Styles.flex1]}
                    editable={false}
                    value={k.price ? parseFloat(k.price).toFixed(4) : ""}
                  />
                </View>
                <View
                  style={[
                    Styles.flexRow,
                    Styles.borderBottom1,
                    Styles.padding4,
                    Styles.flexAlignCenter,
                  ]}
                >
                  <Text style={[Styles.flex1]}>Unit</Text>
                  <TextInput
                    mode="outlined"
                    dense
                    style={[Styles.flex1]}
                    editable={false}
                    value={k.price ? parseFloat(k.price).toFixed(4) : ""}
                  />
                </View>
                <View
                  style={[
                    Styles.flexRow,
                    Styles.borderBottom1,
                    Styles.padding4,
                    Styles.flexAlignCenter,
                  ]}
                >
                  <Text style={[Styles.flex1]}>Rate</Text>
                  <TextInput
                    mode="outlined"
                    dense
                    style={[Styles.flex1]}
                    editable={false}
                    value={k.price ? parseFloat(k.price).toFixed(4) : ""}
                  />
                </View>
                <View
                  style={[
                    Styles.flexRow,
                    Styles.borderBottom1,
                    Styles.padding4,
                    Styles.flexAlignCenter,
                  ]}
                >
                  <Text style={[Styles.flex1]}>Action</Text>
                  <TextInput
                    mode="outlined"
                    dense
                    style={[Styles.flex1]}
                    editable={false}
                    value={k.price ? parseFloat(k.price).toFixed(4) : ""}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

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

export default AddSendRateCard;
