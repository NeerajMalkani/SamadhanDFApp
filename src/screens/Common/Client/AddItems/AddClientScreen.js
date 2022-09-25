import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View, RefreshControl, LogBox, ScrollView, Text, Touchable } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Subheading, TextInput, Searchbar } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { List } from 'react-native-paper';
import { TouchableOpacity } from "react-native-gesture-handler";
import { NullOrEmpty } from "../../../../utils/validations";
import { RenderHiddenItems, RenderHiddenItemGeneric } from "../../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
let userID = 0;
const AddClientScreen = ({ route, navigation }) => {
  let addedBy = false;
  if (route.params.data) {
    addedBy = !route.params.data.addedBy;
  }
  const [refreshing, setRefreshing] = React.useState(false);
  const [aadharNo, setAadharNo] = useState("");
  const [aadharNoInvalid, setAadharNoInvalid] = useState("");
  const aadharNoRef = useRef({});

  const [mobileNo, setMobileNo] = useState("");
  const [mobileNoInvalid, setMobileNoInvalid] = useState("");
  const mobileNoRef = useRef({});

  const [companyName, setCompanyName] = useState(route.params.type === "edit" ? route.params.data.companyName : "");
  const [companyNameInvalid, setCompanyNameInvalid] = useState(false);
  const companyNameRef = useRef({});

  const [contactName, setContactName] = useState(route.params.type === "edit" ? route.params.data.contactPerson : "");
  const [contactNameInvalid, setContactNameInvalid] = useState(false);
  const contactNameRef = useRef({});

  const [contactNumber, setContactNumber] = useState(route.params.type === "edit" ? route.params.data.contactMobileNumber : "");
  const [contactNumberInvalid, setContactNumberInvalid] = useState(false);
  const contactNumberRef = useRef({});

  const [address, setAddress] = useState(route.params.type === "edit" ? route.params.data.address1 : "");
  const [addressInvalid, setAddressInvalid] = useState("");
  const addressRef = useRef({});

  const [cityFullData, setCityFullData] = React.useState([]);
  const [cityData, setCityData] = React.useState([]);
  const [cityName, setCityName] = React.useState(route.params.type === "edit" ? route.params.data.cityName : "");
  const [errorCN, setCNError] = React.useState(false);
  const cityRef = useRef({});

  const [statesFullData, setStatesFullData] = React.useState([]);
  const [statesData, setStatesData] = React.useState([]);
  const [stateName, setStateName] = React.useState(route.params.type === "edit" ? route.params.data.stateName : "");
  const [errorSN, setSNError] = React.useState(false);

  const [pincode, setPincode] = useState(route.params.type === "edit" ? route.params.data.pincode : "");
  const [pincodeInvalid, setPincodeInvalid] = useState(false);
  const pincodenRef = useRef({});

  const [gstNumber, setGSTNumber] = useState(route.params.type === "edit" ? route.params.data.gstNumber : "");
  const [gstNumberInvalid, setGSTNumberInvalid] = useState(false);
  const gstNumberRef = useRef({});

  const [panNumber, setPANNumber] = useState(route.params.type === "edit" ? route.params.data.pan : "");
  const [panNumberInvalid, setPANNumberInvalid] = useState(false);
  const panNumberRef = useRef({});

  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const [displayLoader, setDisplayLoader] = React.useState(false);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);


  const [serviceTypeRoles, setServiceTypeRoles] = useState([
    {
      title: "Vendor",
      isChecked: route.params.type === "edit" && route.params.data.serviceType && route.params.data.serviceType.toString().includes("1") ? true : false,
    },
    {
      title: "Supplier",
      isChecked: route.params.type === "edit" && route.params.data.serviceType && route.params.data.serviceType.toString().includes("2") ? true : false,
    },
    {
      title: "Client",
      isChecked: route.params.type === "edit" && route.params.data.serviceType && route.params.data.serviceType.toString().includes("3") ? true : false,
    },
  ]);
  const [serviceTypeInvalid, setServiceTypeInvalid] = useState(false);

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
    }
  };

  const FetchStates = () => {
    Provider.getAll("master/getstates")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setStatesFullData(response.data.data);
            const states = response.data.data.map((data) => data.stateName);
            setStatesData(states);
            if (route.params.type === "edit") {
              FetchCities(route.params.data.stateName, response.data.data);
            }
          }
        }
      })
      .catch((e) => { });
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
            const cities = response.data.data.map((data) => data.cityName);
            setCityData(cities);
          }
        }
      })
      .catch((e) => { });
  };

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

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      listSearchData[1](listData[0]);
    } else {
      listSearchData[1](
        listData[0].filter((el) => {
          return el.contactPerson.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };

  const onAadharNoChanged = (text) => {
    setAadharNo(text);
    setAadharNoInvalid(false);
  };

  const onMobileNoChanged = (text) => {
    setMobileNo(text);
    setMobileNoInvalid(false);
  };

  const onCompanyNameChanged = (text) => {
    setCompanyName(text);
    setCompanyNameInvalid(false);
  };
  const onContactNameChanged = (text) => {
    setContactName(text);
    setContactNameInvalid(false);
  };
  const onContactNumberChanged = (text) => {
    setContactNumber(text);
    setContactNumberInvalid(false);
  };
  const onAddressChanged = (text) => {
    setAddress(text);
    setAddressInvalid(false);
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
  const onPincodeChanged = (text) => {
    setPincode(text);
    setPincodeInvalid(false);
  };
  const onGSTNumberChanged = (text) => {
    setGSTNumber(text);
    setGSTNumberInvalid(false);
  };
  const onPANNumberChanged = (text) => {
    setPANNumber(text);
    setPANNumberInvalid(false);
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
  const InsertExistingEmployee = (ID) => {
    const params = {
      AddedByUserID: userID,
      EmployeeID: ID,
    };

    Provider.create("master/insertnewemployee", params)
      .then((response) => {

        if (response.data && response.data.code === 200) {
          // redirect to employee list.
          setSnackbarColor(theme.colors.success);
          setSnackbarText("Employee Added successfully");
          setSnackbarVisible(true);
          navigation.navigate("EmployeeListScreen", { type: "add", fetchData: FetchData });

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

  const ValidateData = () => {
    let isValid = true;
    if (companyName.length === 0) {
      setCompanyNameInvalid(true);
      isValid = false;
    }
    if (contactNumber.length === 0) {
      setContactNumberInvalid(true);
      isValid = false;
    }
    if (address.length === 0) {
      setAddressInvalid(true);
      isValid = false;
    }
    const objState = statesFullData.find((el) => {
      return el.stateName && el.stateName === stateName;
    });
    if (stateName.length === 0 || !objState) {
      setSNError(true);
      isValid = false;
    }
    const objCity = cityFullData.find((el) => {
      return el.cityName && el.cityName === cityName;
    });
    if (cityName.length === 0 || !objCity) {
      setCNError(true);
      isValid = false;
    }

    const objServiceTypeRoles = serviceTypeRoles.find((el) => {
      return el.isChecked;
    });
    if (!objServiceTypeRoles) {
      setServiceTypeInvalid(true);
      isValid = false;
    }

    if (isValid) {
      if (route.params.type === "edit") {
        InsertData();
      }
    }
  };

  const OnSearchEmployee = () => {
    let isValid = false;
    if (!NullOrEmpty(aadharNo.trim()) || !NullOrEmpty(mobileNo.trim())) {
      isValid = true;
    }
    else {

      if (NullOrEmpty(aadharNo.trim())) {
        setAadharNoInvalid(true);
      }

      if (NullOrEmpty(mobileNo.trim())) {
        setMobileNoInvalid(true);
      }
    }

    if (isValid) {
      FetchSearchEmployee();
    }
  };

  const FetchSearchEmployee = (from) => {
    let params = {
      AddedByUserID: userID,
      MobileNo: mobileNo.trim(),
      AadharNo: aadharNo.trim()
    };

    Provider.getAll(`contractorquotationestimation/getotherclients?${new URLSearchParams(params)}`)
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

  const EditCallback = (data, rowMap, buttonType) => {
    InsertExistingEmployee(data.item.id);
  };
  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 80 }]}>
        <List.Item
          title={data.item.employeeName}
          titleStyle={{ fontSize: 18 }}
          description={`Mob.: ${NullOrEmpty(data.item.mobileNo) ? "" : data.item.mobileNo}\nAadhar No: ${NullOrEmpty(data.item.aadharNo) ? "" : data.item.aadharNo} `}
          onPress={() => {
            refRBSheet.current.open();
            setCompanyName(data.item.companyName);
            setRBEmployeeName(data.item.employeeName);
            setRBMobileNo(data.item.mobileNo);
            setRBAadharNo(data.item.aadharNo);
          }}
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="account-group" />}
          right={() => <Icon style={{ marginVertical: 18, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
        />
      </View>
    );
  };

  /*list accordian*/
  const [expanded, setExpanded] = React.useState(true);

  const handlePress = () => setExpanded(!expanded);


  const ListOne = () => {

    const design = (
      <>
        <TextInput ref={aadharNoRef} mode="flat" dense label="Name / Company Name" value={aadharNo} returnKeyType="next" onSubmitEditing={() => aadharNoRef.current.focus()} onChangeText={onAadharNoChanged} style={{ backgroundColor: "white" }} error={aadharNoInvalid} />
        <HelperText type="error" visible={aadharNoInvalid}>
          {communication.InvalidCompanyClient}
        </HelperText>
        <TextInput ref={mobileNoRef} mode="flat" dense keyboardType="number-pad" label="Mobile No" value={mobileNo}
          returnKeyType="next" onSubmitEditing={() => mobileNoRef.current.focus()} onChangeText={onMobileNoChanged} style={{ backgroundColor: "white" }} error={mobileNoInvalid} />
        <HelperText type="error" visible={mobileNoInvalid}>
          {communication.InvalidMobileNumber}
        </HelperText>
        <TouchableOpacity onPress={OnSearchEmployee} style={[Styles.marginTop32, Styles.primaryBgColor, Styles.padding10, Styles.flexAlignCenter]}>
          <Text style={[Styles.fontSize14, Styles.textColorWhite]}>SEARCH CLIENT</Text>
        </TouchableOpacity>
        <View >
          <View style={[Styles.width100per, Styles.borderBottom2, Styles.borderBottom2, Styles.marginTop8]}>
            <Text style={[Styles.fontSize20, Styles.fontBold, Styles.marginBottom4, Styles.primaryColor]}>Client Search Result</Text>
          </View>
          {isLoading ? (
            <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
              {displayLoader ? (

                <ActivityIndicator size="large" color={theme.colors.secondary} />
              ) : null}

            </View>
          ) : listData[0].length > 0 ? (
            <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
              <Searchbar style={[Styles.margin16]} placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
              <SwipeListView
                previewDuration={1000}
                previewOpenValue={-72}
                previewRowKey="1"
                previewOpenDelay={1000}
                refreshControl={
                  <RefreshControl
                    colors={[theme.colors.primary]}
                    refreshing={refreshing}
                    onRefresh={() => {
                      FetchData();
                    }}
                  />
                }
                data={listSearchData[0]}
                useFlatList={true}
                disableRightSwipe={true}
                rightOpenValue={-72}
                renderItem={(data) => RenderItems(data)}
                renderHiddenItem={(data, rowMap) => RenderHiddenItemGeneric("eye", data, rowMap, [EditCallback])}
              />
            </View>
          ) : (
            <NoItems icon="format-list-bulleted" text="No records found. Add records by clicking on plus icon." />
          )}

        </View>
      </>
    )
    return design;
  }
  const ListTwo = () => (
    <>
      <TextInput ref={companyNameRef} disabled={addedBy} mode="flat" dense label="Name / Company Name" value={companyName} returnKeyType="next" onSubmitEditing={() => contactNameRef.current.focus()} onChangeText={onCompanyNameChanged} style={{ backgroundColor: "white" }} error={companyNameInvalid} />
      <HelperText type="error" visible={companyNameInvalid}>
        {communication.InvalidCompanyName}
      </HelperText>
      <TextInput ref={contactNameRef} disabled={addedBy} mode="flat" dense label="Contact Person" value={contactName} returnKeyType="next" onSubmitEditing={() => contactNumberRef.current.focus()} onChangeText={onContactNameChanged} style={{ backgroundColor: "white" }} error={contactNameInvalid} />
      <HelperText type="error" visible={contactNameInvalid}>
        {communication.InvalidContactPerson}
      </HelperText>
      <TextInput ref={contactNumberRef} disabled={addedBy} mode="flat" dense keyboardType="number-pad" label="Contact Mobile No." value={contactNumber} returnKeyType="next" onSubmitEditing={() => addressRef.current.focus()} onChangeText={onContactNumberChanged} style={{ backgroundColor: "white" }} error={contactNumberInvalid} />
      <HelperText type="error" visible={contactNumberInvalid}>
        {communication.InvalidContactMobileNo}
      </HelperText>
      <TextInput ref={addressRef} disabled={addedBy} mode="flat" dense label="Address" value={address} returnKeyType="next" onSubmitEditing={() => pincodenRef.current.focus()} onChangeText={onAddressChanged} style={{ backgroundColor: "white" }} error={addressInvalid} />
      <HelperText type="error" visible={addressInvalid}>
        {communication.InvalidAddress}
      </HelperText>
      <Dropdown label="State" data={statesData} forceDisable={addedBy} onSelected={onStateNameSelected} isError={errorSN} selectedItem={stateName} />
      <HelperText type="error" visible={errorSN}>
        {communication.InvalidState}
      </HelperText>
      <Dropdown label="City" data={cityData} forceDisable={addedBy} onSelected={onCityNameSelected} isError={errorCN} selectedItem={cityName} reference={cityRef} />
      <HelperText type="error" visible={errorCN}>
        {communication.InvalidCity}
      </HelperText>
      <TextInput ref={pincodenRef} mode="flat" disabled={addedBy} dense keyboardType="number-pad" label="Pincode" value={pincode} returnKeyType="next" onSubmitEditing={() => gstNumberRef.current.focus()} onChangeText={onPincodeChanged} style={{ backgroundColor: "white" }} error={pincodeInvalid} />
      <HelperText type="error" visible={pincodeInvalid}>
        {communication.InvalidPincode}
      </HelperText>
      <TextInput ref={gstNumberRef} mode="flat" disabled={addedBy} dense label="GST No." value={gstNumber} returnKeyType="next" onSubmitEditing={() => panNumberRef.current.focus()} onChangeText={onGSTNumberChanged} style={{ backgroundColor: "white" }} error={gstNumberInvalid} />
      <HelperText type="error" visible={gstNumberInvalid}>
        {communication.InvalidGSTNo}
      </HelperText>
      <TextInput ref={panNumberRef} mode="flat" disabled={addedBy} dense label="PAN No." value={panNumber} returnKeyType="done" onChangeText={onPANNumberChanged} style={{ backgroundColor: "white" }} error={panNumberInvalid} />
      <HelperText type="error" visible={panNumberInvalid}>
        {communication.InvalidPANNo}
      </HelperText>
      <Subheading style={{ paddingTop: 24, fontWeight: "bold" }}>Service Provider Roles</Subheading>
      <View style={[Styles.flexRow]}>
        {serviceTypeRoles.map((k, i) => {
          return (
            <View key={i} style={[Styles.flex1]}>
              <Checkbox.Item
                label={k.title}
                position="leading"
                style={[Styles.paddingHorizontal0]}
                labelStyle={[Styles.textLeft, Styles.paddingStart4, Styles.fontSize14]}
                color={theme.colors.primary}
                status={k.isChecked ? "checked" : "unchecked"}
                onPress={() => {
                  let temp = serviceTypeRoles.map((u) => {
                    if (k.title === u.title) {
                      return { ...u, isChecked: !u.isChecked };
                    }
                    return u;
                  });
                  setServiceTypeInvalid(false);
                  setServiceTypeRoles(temp);
                }}
              />
            </View>

          );

        })}

      </View>
      <View style={{ width: 160 }}>
        <Checkbox.Item label="Display" position="leading" style={[Styles.paddingHorizontal0]} labelStyle={[Styles.textLeft, Styles.paddingStart4]} color={theme.colors.primary} status={checked ? "checked" : "unchecked"} onPress={() => setChecked(!checked)} />
      </View>
      <View>
        <TouchableOpacity onPress={ValidateData} style={[Styles.marginTop32, Styles.primaryBgColor, Styles.padding10, Styles.flexAlignCenter]}>
          <Text style={[Styles.fontSize14, Styles.textColorWhite]}>Save</Text>
        </TouchableOpacity>
      </View>
    </>
  )
  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>

          <View>
            <List.Section>
              <List.Accordion
                title="Search Client"
                expanded={expanded}
                onPress={handlePress}
              >
                <List.Item title={ListOne} style={[Styles.borderBottom1]} />
              </List.Accordion>
              <List.Accordion
                title="Add Client"
              >
                <List.Item title={ListTwo} />
              </List.Accordion>

            </List.Section>
          </View>
          <HelperText type="error" visible={serviceTypeInvalid}>
            {communication.InvalidServiceTypeRole}
          </HelperText>
          {/* <View style={{ width: 160 }}>
            <Checkbox.Item label="Display" position="leading" style={[Styles.paddingHorizontal0]} labelStyle={[Styles.textLeft, Styles.paddingStart4]} color={theme.colors.primary} status={checked ? "checked" : "unchecked"} onPress={() => setChecked(!checked)} />
          </View>*/}
        </View>
      </ScrollView>
      {/* <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
            <Card.Content>
              <Button mode="contained" onPress={ValidateData}>
                SAVE
              </Button>
            </Card.Content>
          </View> */}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddClientScreen;
