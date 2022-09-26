import React,{useRef,useState} from "react";
import Header from "../../../components/Header";
import {Styles} from "../../../styles/styles";
import {View,Text,HelperText,ScrollView,Button} from "react-native";
import { TextInput,Checkbox } from "react-native-paper";
import DropDown from "react-native-paper-dropdown";
import { communication } from "../../../utils/communication";

let s_ID = 0;

const AddRateCard = ({route,navigation}) =>{
    // const [statesData, setStatesData] = React.useState([]);
    
    // const [stateName, setStateName] = React.useState("");
    // const [errorSN, setSNError] = React.useState(false);
    // const [cityName, setCityName] = React.useState("");

    // const [cityData, setCityData] = React.useState([]);
    // const [cityID, setCityID] = React.useState([]);
    // const [errorCN, setCNError] = React.useState(false);
    // const cityRef = useRef({});

    // const [employeeName, setEmployeeName] = useState("");
    // const [employeeNameInvalid, setEemployeeNameInvalid] = useState("");
    // const employeeNameRef = useRef({});

    const [serviceName, setServiceName] = useState("--Select--");
    const [serviceNameID, setServiceNameID] = useState<number>(0);
    const [serviceNameError, setServiceNameError] = useState("");
    const [selectedServiceName, setSelectedServiceName] = useState("");
    const [isServiceNameError, isSetServiceNameError] = useState(false);
    const [serviceNameErrorText, setServiceNameErrorText] = useState("");
    const [serviceNameFullData, setServiceNameFullData] = useState([]);

    const [category, setCategory] = useState("--Select--");
    const [categoryID, setCategoryID] = useState<number>(0);
    const [categoryError, setCategoryError] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [isCategoryError, isSetCategoryError] = useState(false);
    const [categoryErrorText, setCategoryErrorText] = useState("");
    const [categoryFullData, setCategoryFullData] = useState([]);

    const [hsn, setHSN] = React.useState("");
    const [hsnErrorText, setHSNErrorText] = useState("");
    const [isHsnError, isSetHSNError] = useState(false);

    const [gstRate, setGstRate] = React.useState("");
    const [gstRateErrorText, setGstRateErrorText] = useState("");
    const [isGstRateError, isSetGstRateError] = useState(false);

    const [serviceProductName, setServiceProductName] = useState("--Select--");
    const [serviceProductNameID, setServiceProductNameID] = useState<number>(0);
    const [serviceProductNameError, setServiceProductNameError] = useState("");
    const [selectedServiceProductName, setSelectedServiceProductName] = useState("");
    const [isServiceProductNameError, isSetServiceProductNameError] = useState(false);
    const [serviceProductNameErrorText, setServiceProductNameErrorText] = useState("");
    const [serviceProductNameFullData, setServiceProductNameFullData] = useState([]);

    const [unitOfSales, setUnitOfSales] = useState("--Select--");
    const [unitOfSalesID, setUnitOfSalesID] = useState<number>(0);
    const [unitOfSalesError, setUnitOfSalesError] = useState("");
    const [selectedUnitOfSales, setSelectedUnitOfSales] = useState("");
    const [isUnitOfSalesError, isSetUnitOfSalesError] = useState(false);
    const [unitOfSalesErrorText, setUnitOfSalesErrorText] = useState("");
    const [unitOfSalesFullData, setUnitOfSalesFullData] = useState([]);

    const [materialRate, setMaterialRate] = React.useState("");
    const [materialRateErrorText, setMaterialRateErrorText] = useState("");
    const [isMaterialRateError, isSetMaterialRateError] = useState(false);

    const [alternativeRate, setAlternativeRate] = React.useState("");
    const [alternativeRateErrorText, setAlternativeRateErrorText] = useState("");
    const [isAlternativeRateError, isSetAlternativeRateError] = useState(false);

    const [withoutMaterialRate, setWithoutMaterialRate] = React.useState("");
    const [withoutMaterialRateErrorText, setWithoutMaterialRateErrorText] = useState("");
    const [isWithoutMaterialRateError, isSetWithoutMaterialRateError] = useState(false);

    const [alternativeUnit, setAlternativeUnit] = React.useState("");
    const [alternativeUnitErrorText, setAlternativeUnitErrorText] = useState("");
    const [isAlternativeUnitError, isSetAlternativeUnitError] = useState(false);

    const [shortSpecification, setShortSpecification] = React.useState("");
    const [shortSpecificationErrorText, setShortSpecificationErrorText] = useState("");
    const [isShortSpecificationError, isSetShortSpecificationError] = useState(false);

    const [specificationSP, setSpecificationSP] = React.useState("");
    const [specificationSPErrorText, setSpecificationSPErrorText] = useState("");
    const [isSpecificationSPError, isSetSpecificationSPError] = useState(false);

    const [display, setDisplay] = React.useState("Yes");


    // const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);
  
    useEffect(() => {
      if (route.params.type !== "edit") {
        setCompanyName("");
        setContactName("");
        setContactNumber("");
        setAddress("");
        setStateName("");
        setCityName("");
        setPincode("");
        setGSTNumber("");
        setPANNumber("");
        setCompanyNameInvalid(false);
        setContactNameInvalid(false);
        setContactNumberInvalid(false);
        setAddressInvalid(false);
        setSNError(false);
        setCNError(false);
        setPincodeInvalid(false);
        setGSTNumberInvalid(false);
        setPANNumberInvalid(false);
        setServiceTypeInvalid(false);
      }
      FetchStates();
      GetUserID();
    }, []);

    const FetchServiceName = () => {
      let params = {
        ContractorID: cookies.dfc.UserID,
      };
      Provider.getAll(`master/getcontractoractiveservices?${new URLSearchParams(params)}`)
        .then((response) => {
  
          if (response.data && response.data.code === 200) {
            if (response.data.data) {
  
              setServiceProductNameFullData(response.data.data);
  
              const serviceName = response.data.data.map((data) => data.locationName);
              setBranchData(serviceName);
  
              if (s_ID > 0) {
                let b = response.data.data.filter((el) => {
                  return el.id === s_ID;
                });
  
                setServiceName(b[0].locationName);
                setServiceNameID(b[0].id);
              }
            }
          }
        })
        .catch((e) => { });
    };
  
    const FetchActvityRoles = () => {
      Provider.getAll("master/getmainactivities")
        .then((response) => {
          if (response.data && response.data.code === 200) {
            if (response.data.data) {
              response.data.data = response.data.data.filter((el) => {
                return el.display;
              });
              setActivityFullData(response.data.data);
              const activities = response.data.data.map((data) => data.activityRoleName);
              setActivityData(activities);
            }
          }
        })
        .catch((e) => {});
    };

    const FetchCategory = () => {
      let params = {
        ActivityID: arnID,
            ServiceID: serviceNameID,
      };
      Provider.getAll(`master/getcategoriesbyserviceid?${new URLSearchParams(params)}`)
        .then((response) => {
  
          if (response.data && response.data.code === 200) {
            if (response.data.data) {
  
              setCategoryFullData(response.data.data);
  
              const category = response.data.data.map((data) => data.locationName);
              setBranchData(category);
  
              if (s_ID > 0) {
                let b = response.data.data.filter((el) => {
                  return el.id === s_ID;
                });
  
                setCategory(b[0].locationName);
                setCategoryID(b[0].id);
              }
            }
          }
        })
        .catch((e) => { });
    };

    const FetchServiceProductName = () => {
      let params = {
        ActivityID: arnID,
        ServiceID: serviceNameID,
        CategoryID: categoryID,
      };
      Provider.getAll(`master/getproductsbycategoryid?${new URLSearchParams(params)}`)
        .then((response) => {
  
          if (response.data && response.data.code === 200) {
            if (response.data.data) {
  
              setServiceProductNameFullData(response.data.data);
  
              const category = response.data.data.map((data) => data.locationName);
              setBranchData(category);
  
              if (s_ID > 0) {
                let b = response.data.data.filter((el) => {
                  return el.id === s_ID;
                });
  
                setServiceProductName(b[0].locationName);
                setServiceProductNameID(b[0].id);
              }
            }
          }
        })
        .catch((e) => { });
    };

    const FetchUnitOfSalesName = () => {
      let params = {
        ActivityID: arnID,
        ServiceID: serviceNameID,
        CategoryID: categoryID,
      };
      Provider.getAll(`master/getproductsbycategoryid?${new URLSearchParams(params)}`)
        .then((response) => {
  
          if (response.data && response.data.code === 200) {
            if (response.data.data) {
  
              setServiceProductNameFullData(response.data.data);
  
              const category = response.data.data.map((data) => data.locationName);
              setBranchData(category);
  
              if (s_ID > 0) {
                let b = response.data.data.filter((el) => {
                  return el.id === s_ID;
                });
  
                setServiceProductName(b[0].locationName);
                setServiceProductNameID(b[0].id);
              }
            }
          }
        })
        .catch((e) => { });
    };

    const FetchData = (from) => {
      if (from === "add" || from === "update") {
        setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
        setSnackbarColor(theme.colors.success);
        setSnackbarVisible(true);
      }
      let params = {
        AddedByUserID: userID,
      };
      Provider.getAll(`master/getuseremployeelist?${new URLSearchParams(params)}`)
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
  

    const InsertData = () => {
      let arrServiceTypeRole = [];
      serviceTypeRoles.map((k, i) => {
        if (k.isChecked) {
          arrServiceTypeRole.push(parseInt(i) + 1);
        }
      });
      const params = {
        AddedByUserID: userID,
        CompanyName: companyName,
        ContactPerson: contactName,
        ContactMobileNumber: contactNumber,
        Address1: address,
        StateID: statesFullData.find((el) => {
          return el.stateName && el.stateName === stateName;
        }).id,
        CityID: cityFullData.find((el) => {
          return el.cityName && el.cityName === cityName;
        }).id,
        Pincode: pincode,
        GSTNumber: gstNumber,
        PAN: panNumber,
        ServiceType: arrServiceTypeRole.join(""),
        Display: checked,
      };
      Provider.create("contractorquotationestimation/insertclient", params)
        .then((response) => {
          if (response.data && response.data.code === 200) {
            route.params.fetchData("add");
            navigation.goBack();
          } else if (response.data.code === 304) {
            setSnackbarText(communication.ExistsError);
            setSnackbarVisible(true);
          } else {
            setSnackbarText(communication.InsertError);
            setSnackbarVisible(true);
          }
        })
        .catch((e) => {
          console.log(e);
          setSnackbarText(communication.NetworkError);
          setSnackbarVisible(true);
        });
    };
    
    const UpdateData = () => {
      let arrServiceTypeRole = [];
      serviceTypeRoles.map((k, i) => {
        if (k.isChecked) {
          arrServiceTypeRole.push(parseInt(i) + 1);
        }
      });
      const params = {
        ID: route.params.data.id,
        CompanyName: companyName,
        ContactPerson: contactName,
        ContactMobileNumber: contactNumber,
        Address1: address,
        StateID: statesFullData.find((el) => {
          return el.stateName && el.stateName === stateName;
        }).id,
        CityID: cityFullData.find((el) => {
          return el.cityName && el.cityName === cityName;
        }).id,
        Pincode: pincode,
        GSTNumber: gstNumber,
        PAN: panNumber,
        ServiceType: arrServiceTypeRole.join(""),
        Display: checked,
      };
      Provider.create("contractorquotationestimation/updateclient", params)
        .then((response) => {
          if (response.data && response.data.code === 200) {
            route.params.fetchData("add");
            navigation.goBack();
          } else if (response.data.code === 304) {
            setSnackbarText(communication.ExistsError);
            setSnackbarVisible(true);
          } else {
            setSnackbarText(communication.UpdateError);
            setSnackbarVisible(true);
          }
        })
        .catch((e) => {
          console.log(e);
          setSnackbarText(communication.NetworkError);
          setSnackbarVisible(true);
        });
    };
  
   
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

    

      const onEmployeeNameChanged = (text) => {
        setEmployeeName(text);
        setEemployeeNameInvalid(false);
      };
      const [text, onChangeText] = React.useState("Useless Text");
      const [number, onChangeNumber] = React.useState(null);
    const design = (
        <View style={[Styles.flex1]}>
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
                    <Text style={[Styles.fontSize16,Styles.padding4,Styles.textCenter]}>With Material</Text>
                    <View style={[Styles.flexRow,Styles.flexAlignCenter,Styles.flexSpaceBetween,Styles.marginTop16]}>
                        <TextInput style={[Styles.width48per,Styles.backgroundColorWhite]} label="Rate / Unit"/>
                        <TextInput style={[Styles.width48per]} disabled label="Alternate Rate / Unit" />
                    </View>
                </View>
                <View style={[Styles.marginTop16,{backgroundColor:"#f2f2f2"},Styles.bordergray,Styles.borderRadius4]}>
                    <Text style={[Styles.fontSize16,Styles.padding4,Styles.textCenter]}>Without Material</Text>
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
export default AddRateCard;