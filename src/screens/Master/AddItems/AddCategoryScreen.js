import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Button, Checkbox, Subheading, Text, TextInput } from "react-native-paper";
import Provider from "../../../api/Provider";
import Dropdown from "../../../components/Dropdown";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";

const AddCategoryScreen = ({ route, navigation }) => {
  const [activityData, setActivityData] = React.useState([]);
  const [acivityName, setActivityName] = React.useState("");
  const [errorAN, setANError] = React.useState(false);

  const [servicesData, setServicesData] = React.useState([]);
  const [serviceName, setServiceName] = React.useState("");
  const [errorSN, setSNError] = React.useState(false);

  const [unitOfSalesData, setUnitOfSalesData] = React.useState([]);
  const [unitOfSalesName, setUnitOfSalesName] = React.useState("");
  const [errorUN, setUNError] = React.useState(false);

  const [error, setError] = React.useState(false);
  const [name, setName] = React.useState(route.params.type === "edit" ? route.params.data.categoryName : "");

  const [hsnError, setHSNError] = React.useState(false);
  const [hsn, setHSN] = React.useState(route.params.type === "edit" ? route.params.data.hsnsacCode : "");

  const [gstError, setGSTError] = React.useState(false);
  const [gst, setGST] = React.useState(route.params.type === "edit" ? route.params.data.gstRate : "");

  const [conversion, setConversion] = React.useState(route.params.type === "edit" ? route.params.data.categoryName : "");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const FetchActvityRoles = () => {
    Provider.getAll("master/getactivityroles")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const activities = response.data.data.map((data) => data.activityRoleName);
            setActivityData(activities);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchServices = () => {
    Provider.getAll("master/getservices")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const services = response.data.data.map((data) => data.serviceName);
            setServicesData(services);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchUnitOfSales = () => {
    Provider.getAll("master/getunitofsales")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            const unitofsales = response.data.data.map((o) => ({
                ...o,
                isChecked: false,
              }));
            setUnitOfSalesData(unitofsales);
          }
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    FetchActvityRoles();
    FetchServices();
    FetchUnitOfSales();
  }, []);

  const onActivityNameSelected = (selectedItem) => {
    setActivityName(selectedItem);
    setANError(false);
  };

  const onServiceNameSelected = (selectedItem) => {
    setServiceName(selectedItem);
    setSNError(false);
  };

  const onNameChanged = (text) => {
    setName(text);
    if (text.length === 0) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const onHSNChanged = (text) => {
    setHSN(text);
    if (text.length === 0) {
      setHSNError(true);
    } else {
        setHSNError(false);
    }
  };

  const onGSTChanged = (text) => {
    setGST(text);
    if (text.length === 0) {
      setGSTError(true);
    } else {
      setGSTError(false);
    }
  };

  const onConversionChanged = (text) => {
    setConversion(text);
    if (text.length === 0) {
      setCError(true);
    } else {
      setCError(false);
    }
  };

  const InsertData = () => {
    Provider.create("master/insertunitofsales", {
      UnitName: name + " / " + conversion,
      Display: checked,
    })
      .then((response) => {
        console.log(name);
        console.log(response.data);
        if (response.data && response.data.code === 200) {
          route.params.fetchData("add");
          navigation.goBack();
        } else {
          //Show snackbar
        }
      })
      .catch((e) => {
        console.log(e);
        //Show snackbar
      });
  };

  const UpdateData = () => {
    Provider.create("master/updateservices", {
      ID: route.params.data.id,
      UnitName: name + " / " + conversion,
      Display: checked,
    })
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("update");
          navigation.goBack();
        } else {
          //Show snackbar
        }
      })
      .catch((e) => {
        console.log(e);
        //Show snackbar
      });
  };

  const ValidateData = () => {
    let isValid = true;
    if (name.length === 0) {
      setError(true);
      isValid = false;
    }
    if (acivityName.length === 0) {
      setANError(true);
      isValid = false;
    }
    if (serviceName.length === 0) {
      setSNError(true);
      isValid = false;
    }
    if (isValid) {
      if (route.params.type === "edit") {
        UpdateData();
      } else {
        InsertData();
      }
    } else {
      //setVisible(true);
    }
  };

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.padding16, Styles.backgroundColor]} keyboardShouldPersistTaps="handled">
        <Dropdown label="Activity Name" data={activityData} onSelected={onActivityNameSelected} isError={errorAN} />
        <Dropdown label="Service Name" data={servicesData} onSelected={onServiceNameSelected} isError={errorSN} />
        <TextInput mode="flat" label="Category Name" value={name} onChangeText={onNameChanged} style={{ backgroundColor: "white" }} error={error} />
        <TextInput mode="flat" label="HSN / SAC Code" value={hsn} onChangeText={onHSNChanged} style={{ backgroundColor: "white" }} error={hsnError} />
        <TextInput mode="flat" label="GST Rate" value={gst} onChangeText={onGSTChanged} style={{ backgroundColor: "white" }} error={gstError} />
        <Subheading style={{paddingTop: 24, fontWeight: "bold"}}>Unit of Sales</Subheading>
        <View style={[Styles.flexRow, { flexWrap: "wrap" }]}>
          {unitOfSalesData.map((k, i) => {
            return (
              <Checkbox.Item
                key={i}
                label={k.unitName}
                color={theme.colors.primary}
                status={k.isChecked ? "checked" : "unchecked"}
                onPress={() => {
                    let temp = unitOfSalesData.map((u) => {
                        if (k.unitName === u.unitName) {
                          return { ...u, isChecked: !u.isChecked };
                        }
                        return u;
                      });
                  setUnitOfSalesData(temp);
                }}
              />
            );
          })}
        </View>
        {/* <TextInput mode="flat" label="Unit Name" value={name} onChangeText={onNameChanged} style={{ backgroundColor: "white" }} error={error} />
        <TextInput mode="flat" label="Conversion Unit" value={conversion} onChangeText={onConversionChanged} style={{ backgroundColor: "white" }} error={errorC} /> */}
        <View style={{ paddingTop: 24, width: 160 }}>
          <Checkbox.Item
            label="Display"
            color={theme.colors.primary}
            status={checked ? "checked" : "unchecked"}
            onPress={() => {
              setChecked(!checked);
            }}
          />
        </View>
        <Button style={{ marginTop: 32 }} mode="contained" onPress={ValidateData}>
          SAVE
        </Button>
      </ScrollView>
    </View>
  );
};

export default AddCategoryScreen;
