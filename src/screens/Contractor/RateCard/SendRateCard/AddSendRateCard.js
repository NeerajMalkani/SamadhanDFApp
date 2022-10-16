import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, IconButton, Snackbar, Subheading, Text, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const AddSendRateCard = ({ route, navigation }) => {

  //#region Variables
  const [clientNameFullData, setClientNameFullData] = React.useState([]);
  const [clientNameData, setClientNameData] = React.useState([]);
  const [clientName, setClientName] = React.useState("");
  const [errorCN, setCNError] = React.useState(false);

  const [cName, setCName] = React.useState("");
  const [clientNumber, setClientNumber] = React.useState("");

  const [unitSalesFullData, setUnitSalesFullData] = React.useState([]);
  const [unitSalesData, setUnitSalesData] = React.useState(["Foot", "Meter"]);
  const [unitSalesName, setUnitSalesName] = React.useState("");
  const [errorUS, setUSError] = React.useState(false);

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);
  const arrProductData = React.useState([]);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  //#endregion 

  //#region Functions

  const onClientNameSelected = (selectedItem) => {
    setClientName(selectedItem);
    setCNError(false);
  };

  const onUnitSaleSelected = (selectedItem) => {
    unitSalesName(selectedItem);
    setUSError(false);
  };


  //#endregion 

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
        <View style={[Styles.width100per,Styles.borderBottom2,Styles.borderBottom2, Styles.marginBottom16]}>
                    <Text style={[Styles.fontSize20,Styles.fontBold,Styles.marginBottom4,Styles.blueFontColor]}>Client Details</Text>
                </View>
          <View style={[Styles.width100per, Styles.flexRow, Styles.flexAlignCenter]}>
            <View style={[Styles.width75per]}>
              <Dropdown label="Client Name" data={clientNameData} onSelected={onClientNameSelected} isError={errorCN} selectedItem={clientName} />
              
              <HelperText type="error" visible={errorCN}>
                {communication.InvalidClientName}
              </HelperText>

            </View>
            <View style={[Styles.width20per, Styles.flexAlignSelfCenter, Styles.flexJustifyEnd, Styles.marginStart16]}>
              <Button icon={'account-multiple-plus'} style={[Styles.width48,Styles.textCenter]} mode="contained" />
              {/* <IconButton 
              icon={'account-multiple-plus'}
              mode="contained"
              backgroundColor="#000"
              
              ></IconButton> */}
            </View>
          </View>

          <TextInput mode="flat" dense label="Client Name" value={cName} disabled></TextInput>

          <TextInput mode="flat" dense label="Client Number" value={clientNumber} disabled style={{ marginTop: 20 }}></TextInput>
        </View>

        <View style={[Styles.padding16]}>
        <View style={[Styles.width100per,Styles.borderBottom2,Styles.borderBottom2, Styles.marginBottom16]}>
                    <Text style={[Styles.fontSize20,Styles.fontBold,Styles.marginBottom4,Styles.blueFontColor]}>Rate Card Prparation Type</Text>
                </View>
                <Dropdown label="Unit Of Sales" data={unitSalesData} onSelected={onUnitSaleSelected} isError={errorUS} selectedItem={unitSalesName} />
              <HelperText type="error" visible={errorUS}>
                {communication.InvalidSalesUnit}
              </HelperText>
              <View >
            <Checkbox.Item
              label="Inclusive Material"
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
              color={theme.colors.primary}
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          </View>
          <Button mode="contained" style={{marginTop:20}} icon="plus">
            Add Product
          </Button>
        </View>

        <View style={[Styles.padding16]}>
        <View style={[Styles.width100per,Styles.borderBottom2,Styles.borderBottom2, Styles.marginBottom16]}>
                    <Text style={[Styles.fontSize20,Styles.fontBold,Styles.marginBottom4,Styles.blueFontColor]}>Product Details</Text>
                </View>
        </View>

        <View style={[Styles.padding16]}>
       
          {arrProductData[0].map((k, i) => {
        return (
                <View key={i} style={[Styles.flexColumn, Styles.border1, Styles.marginTop16, Styles.paddingHorizontal16]}>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Subheading style={[Styles.flex1, Styles.primaryColor, Styles.fontBold]}>{k.productName}</Subheading>
                  </View>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Service Name</Text>
                    <TextInput mode="flat" dense style={[Styles.flex1]} editable={false} value={k.brandName}/>
                  </View>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Category Name</Text>
                    <TextInput mode="flat" dense style={[Styles.flex1]} editable={false} value={k.quantity ? parseFloat(k.quantity).toFixed(4) : ""} />
                  </View>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Product Name</Text>
                    <TextInput mode="flat" dense style={[Styles.flex1]} editable={false} value={k.price ? parseFloat(k.price).toFixed(4) : ""} />
                  </View>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Unit</Text>
                    <TextInput mode="flat" dense style={[Styles.flex1]} editable={false} value={k.price ? parseFloat(k.price).toFixed(4) : ""} />
                  </View>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Rate</Text>
                    <TextInput mode="flat" dense style={[Styles.flex1]} editable={false} value={k.price ? parseFloat(k.price).toFixed(4) : ""} />
                  </View>
                  <View style={[Styles.flexRow, Styles.borderBottom1, Styles.padding4, Styles.flexAlignCenter]}>
                    <Text style={[Styles.flex1]}>Action</Text>
                    <TextInput mode="flat" dense style={[Styles.flex1]} editable={false} value={k.price ? parseFloat(k.price).toFixed(4) : ""} />
                  </View>
                </View>
              );
        })}
          </View>
      </ScrollView>
    
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar> 
    </View>
  );

};

export default AddSendRateCard;