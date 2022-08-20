import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect } from "react";
import { Image, ScrollView, View } from "react-native";
import { Button, Card, Snackbar, Subheading, Text, TextInput } from "react-native-paper";
import Provider from "../../../api/Provider";
import Dropdown from "../../../components/Dropdown";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";

let userID = 0;
const EstimationPreviewScreen = ({ route, navigation }) => {
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [lengthFeet, setLengthFeet] = React.useState("1");
  const [lengthInches, setLengthInches] = React.useState("0");

  const [widthFeet, setWidthFeet] = React.useState("1");
  const [widthInches, setWidthInches] = React.useState("0");

  const [totalSqFt, setTotalSqft] = React.useState("1.0000");

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
    }
  };

  useEffect(() => {
    GetUserID();
  }, []);

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

  const InsertDesignEstimationEnquiry = (from) => {
    const params = {
      UserID: userID,
      DesignTypeID: route.params.data.designTypeID,
      Length: lengthFeet + "." + lengthInches,
      Width: widthFeet + "." + widthInches,
      Status: false,
    };
    Provider.create("generaluserenquiryestimations/insertdesignestimateenquiries", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (from === "add") {
            navigation.goBack();
          } else {
            navigation.navigate("GetEstimationScreen", { userDesignEstimationID: response.data.data[0].userDesignEstimationID });
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

  const CalculateSqFt = (lf, li, wf, wi) => {
    if (lf > 0 && li > -1 && wf > 0 && wi > -1) {
      const inches = ((parseInt(lf) * 12 + parseInt(li)) * (parseInt(wf) * 12 + parseInt(wi))) / 144;
      setTotalSqft(parseFloat(inches).toFixed(4));
    } else {
      setTotalSqft(0);
    }
  };

  const CreateNumberDropdown = (startCount, endCount) => {
    let arrNumbers = [];
    for (var i = startCount; i <= endCount; i++) {
      arrNumbers.push(i.toString());
    }
    return arrNumbers;
  };

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <Image source={{ uri: route.params.data.designImage }} style={[Styles.width100per, { height: 192 }]} />
        <View style={[Styles.flexColumn, Styles.border1, Styles.marginTop16]}>
          <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding16, Styles.flexAlignCenter]}>
            <Subheading style={[Styles.flex1, Styles.textSecondaryColor]}>Design Code</Subheading>
            <Subheading style={[Styles.flex1]}>{route.params.data.designNumber}</Subheading>
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
            <Text style={[Styles.flex1, Styles.paddingStart4]}>in</Text>
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
            <Text style={[Styles.flex1, Styles.paddingStart4]}>in</Text>
          </View>
          <TextInput mode="flat" label="Total (Sq.Ft.)" value={totalSqFt} editable={false} />
        </View>
      </ScrollView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content style={[Styles.flexRow, { justifyContent: "space-between" }]}>
          <Button
            mode="outlined"
            onPress={() => {
              InsertDesignEstimationEnquiry("add");
            }}
          >
            Add More Designs
          </Button>
          <Button
            mode="contained"
            onPress={() => {
              InsertDesignEstimationEnquiry("get");
            }}
          >
            Get Estimation
          </Button>
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default EstimationPreviewScreen;
