import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Button, Card, Snackbar, Subheading, Text, Title } from "react-native-paper";
import Provider from "../../../api/Provider";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";

let userID = 0;
const GetEstimationScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [estimationData, setEstimationData] = React.useState([]);
  const [estimationDataForMaterialSetup, setEstimationDataForMaterialSetup] = React.useState([]);

  const [subtotal, setSubtotal] = React.useState(0);

  const [showMCLC, setShowMCLC] = React.useState(false);
  const [showMCD, setShowMCD] = React.useState(false);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
    }
  };

  const FetchEstimationData = () => {
    let params = {
      UserDesignEstimationID: route.params.userDesignEstimationID,
    };
    Provider.getAll(`generaluserenquiryestimations/getdesignestimateenquiries?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            FetchEstimationMaterialSetupData(response.data.data[0].id);
            setEstimationData(response.data.data);
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
      MaterialSetupID: materialSetupID,
    };
    Provider.getAll(`generaluserenquiryestimations/getdesignestimateenquiriesformaterialsetup?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            console.log(response.data.data);
            setEstimationDataForMaterialSetup(response.data.data);
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
    const params = {
      ID: route.params.userDesignEstimationID,
      Status: true,
    };
    Provider.create("generaluserenquiryestimations/insertdesignestimateenquiries", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          const newEst = [...estimationData];
          newEst[0].status = true;
          setEstimationData(newEst);
          setSnackbarText(communication.EstimationSent);
          setSnackbarColor(theme.colors.success);
          setSnackbarVisible(true);
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

  useEffect(() => {
    FetchEstimationData();
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
    const targetSqFt = CalculateSqFt(estimationData[0]);
    let subtotalCal = 0;
    return (
      <View style={[Styles.flexColumn]}>
        {estimationDataForMaterialSetup.map((k, i) => {
          const destinationSqFt = CalculateSqFt(k);
          const newRate = (parseFloat(targetSqFt) * parseFloat(k.rate)) / parseFloat(destinationSqFt);
          const newQuant = (parseFloat(targetSqFt) * parseFloat(k.quantity)) / parseFloat(destinationSqFt);
          let newAmount = (parseFloat(targetSqFt) * parseFloat(k.amount)) / parseFloat(destinationSqFt);
          newAmount = newAmount - newAmount * (parseFloat(k.generalDiscount) / 100);
          subtotalCal += newAmount;
          if (parseInt(i) === estimationDataForMaterialSetup.length - 1) {
            setSubtotal(subtotalCal);
          }
          return (
            <View key={i} style={[Styles.marginTop8, Styles.border1]}>
              <View style={[Styles.flexRow, Styles.borderBottom1, Styles.paddingHorizontal16, Styles.paddingVertical4, Styles.flexAlignCenter]}>
                <Subheading style={[Styles.fontBold]}>{k.productName + " > "}</Subheading>
                <Subheading style={[Styles.fontBold, { color: theme.colors.primary }]}>{k.brandName}</Subheading>
              </View>
              <View style={[Styles.flexRow, Styles.borderBottom1, Styles.paddingHorizontal16, Styles.paddingVertical4, Styles.flexAlignCenter]}>
                <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Quantity</Subheading>
                <Subheading style={[Styles.flex1]}>{newQuant.toFixed(4)}</Subheading>
              </View>
              <View style={[Styles.flexRow, Styles.borderBottom1, Styles.paddingHorizontal16, Styles.paddingVertical4, Styles.flexAlignCenter]}>
                <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Rate</Subheading>
                <Subheading style={[Styles.flex1]}>{newRate.toFixed(4)}</Subheading>
              </View>
              <View style={[Styles.flexRow, Styles.paddingHorizontal16, Styles.paddingVertical4, Styles.flexAlignCenter]}>
                <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Amount</Subheading>
                <Subheading style={[Styles.flex1]}>{newAmount.toFixed(4)}</Subheading>
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <View style={[Styles.flex1, Styles.backgroundColor]}>
          {estimationData && (
            <View style={[Styles.paddingHorizontal8]}>
              <View style={[Styles.flexRow]}>
                <View style={[Styles.flex1, Styles.padding8]}>
                  <Card>
                    <Card.Content>
                      <Text>Total Sq.Ft.</Text>
                      <Subheading style={[Styles.fontBold]}>{CalculateSqFt(estimationData[0])}</Subheading>
                    </Card.Content>
                  </Card>
                </View>
                <View style={[Styles.flex1, Styles.padding8]}>
                  <Card>
                    <Card.Content>
                      <Text>Total Amount</Text>
                      <Subheading style={[Styles.fontBold]}>{(subtotal + subtotal * (5 / 100) + parseFloat(CalculateSqFt(estimationData[0])) * parseFloat(estimationData[0].labourCost)).toFixed(4)}</Subheading>
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
              <View style={[Styles.flexRow, { opacity: showMCLC ? 1 : 0 }]}>
                <View style={[Styles.flexJustifyCenter]}>
                  <Title> = </Title>
                </View>
                <View style={[Styles.flex1, Styles.padding8]}>
                  <Card>
                    <Card.Content>
                      <Text>Material Cost</Text>
                      <Subheading style={[Styles.fontBold]}>{(subtotal + subtotal * (5 / 100)).toFixed(4)}</Subheading>
                    </Card.Content>
                  </Card>
                </View>
                <View style={[Styles.flexJustifyCenter]}>
                  <Title>+</Title>
                </View>
                <View style={[Styles.flex1, Styles.margin8]}>
                  <Card>
                    <Card.Content>
                      <Text>Labour Cost</Text>
                      <Subheading style={[Styles.fontBold]}>{(parseFloat(CalculateSqFt(estimationData[0])) * parseFloat(estimationData[0].labourCost)).toFixed(4)}</Subheading>
                    </Card.Content>
                  </Card>
                </View>
              </View>
              {!showMCD && showMCLC && (
                <View style={[Styles.flexRow, Styles.flexAlignSelfCenter]}>
                  <Button mode="text" onPress={() => setShowMCD(true)}>
                    Details
                  </Button>
                </View>
              )}
            </View>
          )}
          {estimationDataForMaterialSetup && (
            <View style={[Styles.flex1, { opacity: showMCD ? 1 : 0, marginBottom: estimationData && estimationData[0] && !estimationData[0].status ? 64 : 0 }]}>
              <Title style={[Styles.paddingHorizontal16]}>Material Details</Title>
              <ScrollView>
                <CreateMaterialsTable />
              </ScrollView>
              <View style={[Styles.flexRow, Styles.borderTop2, Styles.paddingHorizontal16, Styles.paddingVertical8, Styles.flexAlignCenter, { borderTopColor: theme.colors.text }]}>
                <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Sub Total</Subheading>
                <Subheading style={[Styles.flex1, Styles.fontBold]}>{subtotal.toFixed(4)}</Subheading>
              </View>
              <View style={[Styles.flexRow, Styles.borderTop1, Styles.paddingHorizontal16, Styles.paddingVertical8, Styles.flexAlignCenter]}>
                <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Transport Charges</Subheading>
                <Subheading style={[Styles.flex1, Styles.fontBold]}>{(subtotal * (5 / 100)).toFixed(4)}</Subheading>
              </View>
              <View style={[Styles.flexRow, Styles.borderTop1, Styles.paddingHorizontal16, Styles.paddingVertical8, Styles.flexAlignCenter, { borderTopColor: theme.colors.text }]}>
                <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Total</Subheading>
                <Subheading style={[Styles.flex1, Styles.fontBold, Styles.primaryColor]}>{(subtotal + subtotal * (5 / 100)).toFixed(4)}</Subheading>
              </View>
            </View>
          )}
          {estimationData && estimationData[0] && !estimationData[0].status && (
            <View style={[Styles.backgroundColor, Styles.width100per, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
              <Card.Content>
                <Button
                  mode="contained"
                  onPress={() => {
                    InsertDesignEstimationEnquiry();
                  }}
                >
                  Send Enquiry
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
