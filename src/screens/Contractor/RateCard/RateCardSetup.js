import React,{useRef,useState} from "react";
import Header from "../../../components/Header";
import {Styles} from "../../../styles/styles";
import {View,Text,HelperText,ScrollView,Button} from "react-native";
import { TextInput,Checkbox } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { communication } from "../../../utils/communication";
const RateCardSetUp = ({route,navigation}) =>{
    const [statesData, setStatesData] = React.useState([]);
    
    const [stateName, setStateName] = React.useState("");
    const [errorSN, setSNError] = React.useState(false);
    const [cityName, setCityName] = React.useState("");

    const [cityData, setCityData] = React.useState([]);
    const [cityID, setCityID] = React.useState([]);
    const [errorCN, setCNError] = React.useState(false);
    const cityRef = useRef({});

    const [employeeName, setEmployeeName] = useState("");
    const [employeeNameInvalid, setEemployeeNameInvalid] = useState("");
    const employeeNameRef = useRef({});

    // const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

    const onStateNameSelected = (selectedItem) => {
        setStateName(selectedItem);
        setSNError(false);
        cityRef.current.reset();
        setCityName("");
        FetchCities(selectedItem);
      };
      const onCityNameSelected = (selectedItem) => {
        setCityName(selectedItem);
        setCNError(false);
      };

    const FetchCities = (stateName, stateData) => {
        let params = {
          ID: stateData
            ? stateData.find((el) => {
              return el.stateName === stateName;
            }).id
            : statesFullData.find((el) => {
              return el.stateName === stateName;
            }).id,
        };
        Provider.getAll(`master/getcitiesbyid?${new URLSearchParams(params)}`)
          .then((response) => {
            if (response.data && response.data.code === 200) {
              if (response.data.data) {
                setCityFullData(response.data.data);
    
                let ct = cityFullData.filter((el) => {
                  return el.id.toString() === cityID.toString();
                });
                const cities = response.data.data.map((data) => data.cityName);
                setCityData(cities);
                setCityName(ct[0].cityName);
              }
            }
          })
          .catch((e) => { });
      };

      const onEmployeeNameChanged = (text) => {
        setEmployeeName(text);
        setEemployeeNameInvalid(false);
      };
      const [text, onChangeText] = React.useState("Useless Text");
      const [number, onChangeNumber] = React.useState(null);
    const design = (
        <View style={[Styles.flex1]}>
          <Header navigation={navigation} title="RateCardSetUp" />
          <ScrollView >
            <View style={[Styles.padding16,Styles.backgroundColorWhite]}>
                <Dropdown label="Service Name" data={statesData} onSelected={onStateNameSelected} isError={errorSN} selectedItem={stateName} />
                <Dropdown label="Category Name" data={cityData} onSelected={onCityNameSelected} isError={errorCN} selectedItem={cityName} reference={cityRef} />
                <View style={[Styles.flexRow,Styles.flexAlignCenter,Styles.flexSpaceBetween,Styles.marginTop16]}>
                <TextInput style={[Styles.width48per]} label="HSN / SAC Code" disabled />
                <TextInput style={[Styles.width48per]} label="GST Rate (%)" disabled />
                </View>
                <Dropdown label="Service Product Name" data={statesData} onSelected={onStateNameSelected} isError={errorSN} selectedItem={stateName} />
                <Dropdown label="Unit of Sales" data={cityData} onSelected={onCityNameSelected} isError={errorCN} selectedItem={cityName} reference={cityRef} />
                <View style={[Styles.marginTop16,{backgroundColor:"#f2f2f2"},Styles.bordergray,Styles.borderRadius4]}>
                    <Text style={[Styles.fontSize16,Styles.padding4]}>With Material</Text>
                    <View style={[Styles.flexRow,Styles.flexAlignCenter,Styles.flexSpaceBetween,Styles.marginTop16]}>
                        <TextInput style={[Styles.width48per,Styles.backgroundColorWhite]} label="Rate / Unit"/>
                        <TextInput style={[Styles.width48per]} disabled label="Alternate Rate / Unit" />
                    </View>
                </View>
                <View style={[Styles.marginTop16,{backgroundColor:"#f2f2f2"},Styles.bordergray,Styles.borderRadius4]}>
                    <Text style={[Styles.fontSize16,Styles.padding4]}>Without Material</Text>
                    <View style={[Styles.flexRow,Styles.flexAlignCenter,Styles.flexSpaceBetween,Styles.marginTop16]}>
                        <TextInput style={[Styles.width48per,Styles.backgroundColorWhite]} label="Rate / Unit"/>
                        <TextInput style={[Styles.width48per]} disabled label="Alternate Rate / Unit"/>
                    </View>
                </View>
                <TextInput multiline label="Short Specification" style={[Styles.backgroundColorWhite,Styles.marginTop16]}/>
                <TextInput multiline label="Specification of Service Provider" style={[Styles.backgroundColorWhite,Styles.marginTop16]}/>

                <Checkbox.Item
                    label="Display"
                    
                    position="leading"
                    labelStyle={{ textAlign: "left", paddingLeft: 8 }}
                    // status={checked ? "checked" : "unchecked"}
                    // onPress={() => {
                    //     setChecked(!checked);
                    //     }}
                    status={true}
                    
            />
            <Button title="submit" style={[Styles.backgroundColorDarkGreen]}/>
            </View>

          </ScrollView>
            
        </View>
    );
    return design;
}
export default RateCardSetUp;