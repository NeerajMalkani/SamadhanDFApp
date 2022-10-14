import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef } from "react";
import { Image, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import RBSheet from "react-native-raw-bottom-sheet";
import { Button, Card, HelperText, Snackbar, Subheading, Text, TextInput } from "react-native-paper";
import Provider from "../../../api/Provider";
import Dropdown from "../../../components/Dropdown";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";

let userID = 0;
const EstimationPreviewScreen = ({ route, navigation }) => {
  //#region Variables
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [otherClients, setOtherClients] = React.useState([]);
  const [otherClientsAutocomplete, setOtherClientsAutocomplete] = React.useState([]);
  const [selectedClient, setSelectedClient] = React.useState("");
  const [isButtonDisabled, setIsButtonDisabled] = React.useState(true);
  const [errorSN, setSNError] = React.useState(false);

  const [clientsFullData, setClientsFullData] = React.useState([]);
  const [clients, setClients] = React.useState([]);
  const [clientName, setClientName] = React.useState("");
  const [errorCN, setCNError] = React.useState(false);

  const [lengthFeet, setLengthFeet] = React.useState("1");
  const [lengthInches, setLengthInches] = React.useState("0");

  const [widthFeet, setWidthFeet] = React.useState("1");
  const [widthInches, setWidthInches] = React.useState("0");

  const [totalSqFt, setTotalSqft] = React.useState("1.0000");

  const refRBSheet = useRef();
  //#endregion 

  //#region Functions

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      if (route.params.isContractor) {
        FetchClients();
        FetchOtherClients();
      }
    }
  };

  const FetchClients = () => {
    let params = {
      AddedByUserID: userID,
    };
    Provider.getAll(`contractorquotationestimation/getclients?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.serviceType === 3 || el.serviceType === 13 || el.serviceType === 23 || el.serviceType === 123;
            });
            setClientsFullData(response.data.data);
            let clientData = response.data.data.map((data) => data.companyName);
            setClients(clientData);
          }
        } else {
          setClients([]);
          setClientsFullData([]);
        }
      })
      .catch((e) => {
        setClients([]);
        setClientsFullData([]);
      });
  };

  const FetchOtherClients = () => {
    let params = {
      AddedByUserID: userID,
    };
    Provider.getAll(`contractorquotationestimation/getotherclients?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setOtherClients(response.data.data);
            let clientData = [];
            response.data.data.map((data, i) => {
              clientData.push({
                id: i.toString(),
                title: data.companyName,
                contact: data.contactMobileNumber,
                clientID: data.id,
              });
            });
            setOtherClientsAutocomplete(clientData);
          }
        } else {
          setOtherClients([]);
          setOtherClientsAutocomplete([]);
        }
      })
      .catch((e) => {
        setOtherClients([]);
        setOtherClientsAutocomplete([]);
      });
  };

  useEffect(() => {
    GetUserID();
  }, []);

  const onClientNameSelected = (selectedItem) => {
    setClientName(selectedItem);
    setCNError(false);
  };

  const onLengthFeetSelected = (selectedItem) => {
    setLengthFeet(selectedItem);
    CalculateSqFt(selectedItem, lengthInches, widthFeet, widthInches);
  };

  const onLengthInchesSelected = (selectedItem) => {
    setLengthInches(selectedItem);
    CalculateSqFt(lengthFeet, selectedItem, widthFeet, widthInches);
  };

  const onWidthFeetSelected = (selectedItem) => {
    setWidthFeet(selectedItem);
    CalculateSqFt(lengthFeet, lengthInches, selectedItem, widthInches);
  };

  const onWidthInchesSelected = (selectedItem) => {
    setWidthInches(selectedItem);
    CalculateSqFt(lengthFeet, lengthInches, widthFeet, selectedItem);
  };

  const FetchEstimationMaterialSetupData = (materialSetupID, from, userDesignEstimationID, labourCost) => {
    let params = {
      MaterialSetupID: materialSetupID,
    };
    Provider.getAll(`generaluserenquiryestimations/getdesignestimateenquiriesformaterialsetup?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const targetSqFt = totalSqFt;
            let subtotalCal = 0;
            response.data.data.map((k, i) => {
              const destinationSqFt = CalculateSqFtData(k);
              let newAmount = (parseFloat(targetSqFt) * parseFloat(k.amount)) / parseFloat(destinationSqFt);
              newAmount = newAmount - newAmount * (parseFloat(k.generalDiscount) / 100);
              subtotalCal += newAmount;
            });
            InsertDesignEstimationEnquiry(from, "2", subtotalCal, userDesignEstimationID, labourCost);
          }
        }
      })
      .catch((e) => { });
  };

  const FetchEstimationData = (userDesignEstimationID, from) => {
    let params = {
      UserDesignEstimationID: userDesignEstimationID,
    };
    Provider.getAll(`generaluserenquiryestimations/getdesignestimateenquiries?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            FetchEstimationMaterialSetupData(response.data.data[0].id, from, userDesignEstimationID, response.data.data[0].labourCost);
          }
        }
      })
      .catch((e) => { });
  };

  const InsertDesignEstimationEnquiry = (from, number, subtotal, userDesignEstimationID, labourCost) => {
    console.log('get estimation');
    const totAm = subtotal + subtotal * (5 / 100) + parseFloat(totalSqFt) * parseFloat(labourCost);
    const params = {
      UserID: userID,
      DesignTypeID: route.params.data.designTypeID,
      WorkLocationID: route.params.data.workLocationID,
      Length: lengthFeet + "." + lengthInches,
      Width: widthFeet + "." + widthInches,
      Status: false,
      SubtotalAmount: subtotal ? parseFloat(subtotal) : 0,
      LabourCost: subtotal ? parseFloat(totalSqFt) * parseFloat(labourCost) : 0,
      TotalAmount: subtotal ? totAm : 0,
    };
    if (number === "2") {
      params.ID = userDesignEstimationID;
    }
    if (route.params.isContractor) {
      params.ClientID = clientsFullData.find((el) => {
        return el.companyName === clientName;
      }).id;
      params.ApprovalStatus = 0;
    }
    Provider.create("generaluserenquiryestimations/insertdesignestimateenquiries", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (number === "2") {
            if (from === "add") {
              if (route.params.from === "home") {
                navigation.navigate("HomeScreen");
              } else {
                navigation.navigate("ImageGalleryScreen");
              }
            } else {
              navigation.navigate("GetEstimationScreen", {
                userDesignEstimationID: response.data.data[0].userDesignEstimationID,
                designImage: route.params.data.designImage,
                isContractor: route.params.isContractor,
                fetchData: route.params.fetchData,
                clientID: route.params.isContractor
                  ? clientsFullData.find((el) => {
                    return el.companyName === clientName;
                  }).id
                  : 0,
              });
            }
          } else {
            console.log(response.data.data[0].userDesignEstimationID);
            FetchEstimationData(response.data.data[0].userDesignEstimationID, from);
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

  const InsertOtherClient = () => {
    const params = {
      ID: parseInt(selectedClient),
      AddedByUserID: userID,
    };
    Provider.create("contractorquotationestimation/insertotherclient", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          refRBSheet.current.close();
          FetchClients();
          FetchOtherClients();
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

  const CreateQuote = () => {
    let isValid = true;
    if (clientName.length === 0) {
      isValid = false;
      setCNError(true);
    }
    if (isValid) {
      InsertDesignEstimationEnquiry("get", "1");
    }
  };

  const CalculateSqFt = (lf, li, wf, wi) => {
    if (lf > 0 && li > -1 && wf > 0 && wi > -1) {
      const inches = ((parseInt(lf) * 12 + parseInt(li)) * (parseInt(wf) * 12 + parseInt(wi))) / 144;
      setTotalSqft(parseFloat(inches).toFixed(4));
    } else {
      setTotalSqft(0);
    }
  };

  const CalculateSqFtData = (data) => {
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

  const CreateNumberDropdown = (startCount, endCount) => {
    let arrNumbers = [];
    for (var i = startCount; i <= endCount; i++) {
      arrNumbers.push(i.toString());
    }
    return arrNumbers;
  };

  function pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  //#endregion 

  return (
    <View style={[Styles.flex1]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} enabled>
        <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled" nestedScrollEnabled>
          <Image source={{ uri: route.params.data.designImage }} style={[Styles.width100per, { height: 192 }]} />
          <View style={[Styles.flexColumn, Styles.border1, Styles.marginTop16]}>
            <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding16, Styles.flexAlignCenter]}>
              <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Design Code</Subheading>
              <Subheading style={[Styles.flex1]}>{"DS-" + pad(route.params.data.designTypeID, 4, "0")}</Subheading>
            </View>
            <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding16, Styles.flexAlignCenter]}>
              <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Design Type</Subheading>
              <Subheading style={[Styles.flex1]}>{route.params.data.designTypeName}</Subheading>
            </View>
            <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding16, Styles.flexAlignCenter]}>
              <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Category Name</Subheading>
              <Subheading style={[Styles.flex1]}>{route.params.data.categoryName}</Subheading>
            </View>
            <View style={[Styles.flexRow, Styles.padding16, Styles.flexAlignCenter]}>
              <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Product Name</Subheading>
              <Subheading style={[Styles.flex1]}>{route.params.data.productName}</Subheading>
            </View>
          </View>
          {route.params.isContractor && (
            <View style={[Styles.padding16, Styles.paddingBottom0, { zIndex: 10 }]}>
              <Dropdown label="Client Name" data={clients} onSelected={onClientNameSelected} isError={errorCN} selectedItem={clientName} />
              <HelperText type="error" visible={errorCN}>
                {communication.InvalidClient}
              </HelperText>
              <View style={[Styles.flexRow, Styles.marginTop8, { justifyContent: "space-between" }]}>
                <Button mode="outlined" onPress={() => refRBSheet.current.open()}>
                  Search & Add
                </Button>
                <Button
                  mode="contained"
                  onPress={() => {
                    navigation.navigate("AddClient", {
                      type: "client",
                      fetchData: FetchClients
                    });
                  }}
                >
                  Create New
                </Button>
              </View>
            </View>
          )}
          <View style={[Styles.paddingHorizontal16, Styles.paddingBottom16]}>
            <Subheading style={[Styles.marginTop16]}>Length</Subheading>
            <View style={[Styles.flexRow, Styles.flexAlignCenter]}>
              <View style={[Styles.paddingStart0, Styles.paddingEnd8, Styles.flex5]}>
                <Dropdown label="Feet" data={CreateNumberDropdown(1, 50)} onSelected={onLengthFeetSelected} selectedItem={lengthFeet} />
              </View>
              <Text style={[Styles.flex1, Styles.paddingStart4]}>ft</Text>
              <View style={[Styles.paddingStart8, Styles.paddingEnd0, Styles.flex5]}>
                <Dropdown label="Inches" data={CreateNumberDropdown(0, 11)} onSelected={onLengthInchesSelected} selectedItem={lengthInches} />
              </View>
              <Text style={[Styles.flex1_5, Styles.paddingStart4]}>inch</Text>
            </View>
            <Subheading style={[Styles.marginTop32]}>Width / Height</Subheading>
            <View style={[Styles.flexRow, Styles.flexAlignCenter, Styles.marginBottom32]}>
              <View style={[Styles.paddingStart0, Styles.paddingEnd8, Styles.flex5]}>
                <Dropdown label="Feet" data={CreateNumberDropdown(1, 50)} onSelected={onWidthFeetSelected} selectedItem={widthFeet} />
              </View>
              <Text style={[Styles.flex1, Styles.paddingStart4]}>ft</Text>
              <View style={[Styles.paddingStart8, Styles.paddingEnd0, Styles.flex5]}>
                <Dropdown label="Inches" data={CreateNumberDropdown(0, 11)} onSelected={onWidthInchesSelected} selectedItem={widthInches} />
              </View>
              <Text style={[Styles.flex1_5, Styles.paddingStart4]}>inch</Text>
            </View>
            <TextInput mode="flat" label="Total (Sq.Ft.)" value={totalSqFt} editable={false} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        {route.params.isContractor ? (
          <Card.Content>
            <Button mode="contained" onPress={() => CreateQuote()}>
              Create Quote
            </Button>
          </Card.Content>
        ) : (
          <Card.Content style={[Styles.flexRow, { justifyContent: "space-between" }]}>
            <Button mode="outlined" onPress={() => InsertDesignEstimationEnquiry("add", "1")}>
              Add More
            </Button>
            <Button mode="contained" onPress={() => InsertDesignEstimationEnquiry("get", "1")}>
              Get Estimation
            </Button>
          </Card.Content>
        )}
      </View>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={640} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <ScrollView style={[Styles.flex1, Styles.backgroundColor]} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
          <View style={[Styles.flex1, Styles.backgroundColor, Styles.padding16]}>
            <AutocompleteDropdown
              clearOnFocus={false}
              closeOnBlur={true}
              direction="down"
              suggestionsListContainerStyle={{ borderColor: theme.colors.border, borderWidth: 1 }}
              inputContainerStyle={{ backgroundColor: theme.colors.textLight, borderBottomColor: errorSN ? theme.colors.error : theme.colors.textfield, borderBottomWidth: 1 }}
              textInputProps={{
                placeholder: "Client Name",
                placeholderTextColor: errorSN ? theme.colors.error : theme.colors.textSecondary,
              }}
              renderItem={(item) => (
                <View style={[Styles.paddingVertical8]}>
                  <Text style={{ color: theme.colors.text, paddingHorizontal: 16 }}>{item ? item.title : ""}</Text>
                  <Text style={{ color: theme.colors.textSecondary, paddingHorizontal: 16 }}>{item ? item.contact : ""}</Text>
                </View>
              )}
              onClear={() => {
                setIsButtonDisabled(true);
                setSelectedClient("");
              }}
              onSelectItem={(item) => {
                if (item) {
                  setIsButtonDisabled(false);
                  setSelectedClient(item ? item.clientID.toString() : "");
                }
              }}
              dataSet={otherClientsAutocomplete}
            />
            <Button mode="contained" disabled={isButtonDisabled} style={[Styles.marginTop32]} onPress={() => InsertOtherClient()}>
              Add to Client List
            </Button>
          </View>
        </ScrollView>
      </RBSheet>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default EstimationPreviewScreen;
