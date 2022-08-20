import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Button, Card, Headline, Snackbar, Subheading, Title } from "react-native-paper";
import Provider from "../../../api/Provider";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";

const GetEstimationScreen = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [estimationData, setEstimationData] = React.useState([]);
  const [estimationDataForMaterialSetup, setEstimationDataForMaterialSetup] = React.useState([]);

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

  useEffect(() => {
    FetchEstimationData();
  }, []);

  const CalculateSqFt = () => {
    if (estimationData[0]) {
      const lengthFeetIn = estimationData[0]["length"].toString().split(".");
      const widthFeetIn = estimationData[0]["width"].toString().split(".");
      const lf = lengthFeetIn[0];
      const li = lengthFeetIn.length > 1 ? lengthFeetIn[1] : 0;
      const wf = widthFeetIn[0];
      const wi = widthFeetIn.length > 1 ? widthFeetIn[1] : 0;
      const inches = ((parseInt(lf) * 12 + parseInt(li)) * (parseInt(wf) * 12 + parseInt(wi))) / 144;
      return parseFloat(inches).toFixed(4);
      return 0;
    } else {
      return 0;
    }
  };

  const CreateMaterialsTable = () => {
    return (
      <View style={[Styles.flexColumn]}>
        {estimationDataForMaterialSetup.map((k, i) => {
          return (
            <View key={i} style={[Styles.marginTop16, Styles.border1]}>
              <View style={[Styles.flexRow, Styles.borderBottom1, Styles.paddingHorizontal16, Styles.paddingVertical8, Styles.flexAlignCenter]}>
                <Subheading style={[Styles.fontBold]}>{k.productName + " > "}</Subheading>
                <Subheading style={[Styles.fontBold, { color: theme.colors.primary }]}>{k.brandName}</Subheading>
              </View>
              <View style={[Styles.flexRow, Styles.borderBottom1, Styles.paddingHorizontal16, Styles.paddingVertical8, Styles.flexAlignCenter]}>
                <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Quantity</Subheading>
                <Subheading style={[Styles.flex1]}>{k.quantity.toFixed(4)}</Subheading>
              </View>
              <View style={[Styles.flexRow, Styles.borderBottom1, Styles.paddingHorizontal16, Styles.paddingVertical8, Styles.flexAlignCenter]}>
                <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Rate</Subheading>
                <Subheading style={[Styles.flex1]}>{k.rate.toFixed(4)}</Subheading>
              </View>
              <View style={[Styles.flexRow, Styles.paddingHorizontal16, Styles.paddingVertical8, Styles.flexAlignCenter]}>
                <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Amount</Subheading>
                <Subheading style={[Styles.flex1]}>{k.amount.toFixed(4)}</Subheading>
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
        <View style={[Styles.flex1, Styles.padding8]}>
          {estimationData && (
            <View>
              <View style={[Styles.flexRow]}>
                <View style={[Styles.flex1, Styles.padding8]}>
                  <Card>
                    <Card.Content>
                      <Subheading>Total Sq.Ft.</Subheading>
                      <Title>{CalculateSqFt()}</Title>
                    </Card.Content>
                  </Card>
                </View>
                <View style={[Styles.flex1, Styles.margin8]}>
                  <Card>
                    <Card.Content>
                      <Subheading>Total Amount</Subheading>
                      <Title>{estimationData[0].materialCostPerSqFeet.toFixed(4)}</Title>
                    </Card.Content>
                  </Card>
                </View>
              </View>
              <View style={[Styles.flexRow]}>
                <View style={[Styles.flexJustifyCenter]}>
                  <Title> = </Title>
                </View>
                <View style={[Styles.flex1, Styles.padding8]}>
                  <Card>
                    <Card.Content>
                      <Subheading>Material Cost</Subheading>
                      <Title>{estimationData[0].materialCostPerSqFeet.toFixed(4)}</Title>
                    </Card.Content>
                  </Card>
                </View>
                <View style={[Styles.flexJustifyCenter]}>
                  <Title>+</Title>
                </View>
                <View style={[Styles.flex1, Styles.margin8]}>
                  <Card>
                    <Card.Content>
                      <Subheading>Labour Cost</Subheading>
                      <Title>{estimationData[0].labourCost.toFixed(4)}</Title>
                    </Card.Content>
                  </Card>
                </View>
              </View>
            </View>
          )}
          {estimationDataForMaterialSetup && (
            <View style={[Styles.flex1, { marginBottom: 64 }]}>
              <Title style={[Styles.paddingHorizontal8, Styles.marginTop16]}>Material Details</Title>
              <ScrollView>
                <CreateMaterialsTable />
              </ScrollView>
              <View style={[Styles.flexRow, Styles.borderTop2, Styles.paddingHorizontal16, Styles.paddingVertical8, Styles.flexAlignCenter, { borderTopColor: theme.colors.text }]}>
                <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Sub Total</Subheading>
                <Subheading style={[Styles.flex1, Styles.fontBold]}>250.0000</Subheading>
              </View>
              <View style={[Styles.flexRow, Styles.borderTop1, Styles.paddingHorizontal16, Styles.paddingVertical8, Styles.flexAlignCenter]}>
                <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Transport Charges</Subheading>
                <Subheading style={[Styles.flex1, Styles.fontBold]}>250.0000</Subheading>
              </View>
            </View>
          )}
        </View>
      )}
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content style={[Styles.flexRow, { justifyContent: "space-between" }]}>
          <Subheading style={[Styles.fontBold]}>
            Total: <Subheading style={[Styles.fontBold, Styles.primaryColor]}>2005.5515</Subheading>
          </Subheading>
          {estimationData && estimationData[0] && !estimationData[0].status && (
            <Button mode="contained" onPress={() => {}}>
              Send Enquiry
            </Button>
          )}
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default GetEstimationScreen;
