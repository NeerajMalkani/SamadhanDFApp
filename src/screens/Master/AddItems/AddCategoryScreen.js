import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Button, Checkbox, Subheading, Text, TextInput } from "react-native-paper";
import Provider from "../../../api/Provider";
import Dropdown from "../../../components/Dropdown";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";

const AddCategoryScreen = ({ route, navigation }) => {
  const [activityFullData, setActivityFullData] = React.useState([]);
  const [activityData, setActivityData] = React.useState([]);
  const [acivityName, setActivityName] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [errorAN, setANError] = React.useState(false);

  const [servicesFullData, setServicesFullData] = React.useState([]);
  const [servicesData, setServicesData] = React.useState([]);
  const [serviceName, setServiceName] = React.useState(route.params.type === "edit" ? route.params.data.serviceName : "");
  const [errorSN, setSNError] = React.useState(false);

  const [unitOfSalesData, setUnitOfSalesData] = React.useState([]);
  const [unitOfSalesName, setUnitOfSalesName] = React.useState(route.params.type === "edit" ? route.params.data.unitID : "");
  const [errorUN, setUNError] = React.useState(false);

  const [error, setError] = React.useState(false);
  const [name, setName] = React.useState(route.params.type === "edit" ? route.params.data.categoryName : "");

  const [hsnError, setHSNError] = React.useState(false);
  const [hsn, setHSN] = React.useState(route.params.type === "edit" ? route.params.data.hsnsacCode : "");

  const [gstError, setGSTError] = React.useState(false);
  const [gst, setGST] = React.useState(route.params.type === "edit" ? route.params.data.gstRate.toString() : "");

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const FetchActvityRoles = () => {
    Provider.getAll("master/getactivityroles")
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

  const FetchServices = () => {
    Provider.getAll("master/getservices")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setServicesFullData(response.data.data);
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
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            let allUnits = "";
            if (route.params.type === "edit") {
              const arrunitOfSalesNameNew = [];
              unitOfSalesName.split(",").map((o) => {
                const objTemp = response.data.data.find((el) => {
                  return o === el.unitName;
                });
                if (objTemp) {
                  arrunitOfSalesNameNew.push(objTemp.id);
                }
              });

              allUnits = arrunitOfSalesNameNew.length > 0 ? arrunitOfSalesNameNew.join(",") : "";
            }
            const unitofsales = response.data.data.map((o) => ({
              ...o,
              isChecked: allUnits !== "" ? allUnits.split(",").indexOf(o.id.toString()) !== -1 : false,
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

  const InsertData = () => {
    let arrunitOfSalesName = [];
    unitOfSalesData.map((o) => {
      if (o.isChecked) {
        arrunitOfSalesName.push(o.id);
      }
    });
    Provider.create("master/insertcategory", {
      CategoryName: name,
      RoleID: activityFullData.find((el) => {
        return el.activityRoleName === acivityName;
      }).id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      HSNSACCode: hsn,
      GSTRate: parseFloat(gst),
      UnitID: arrunitOfSalesName.join(","),
      Display: checked,
    })
      .then((response) => {
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
    let arrunitOfSalesName = [];
    unitOfSalesData.map((o) => {
      if (o.isChecked) {
        arrunitOfSalesName.push(o.id);
      }
    });
    Provider.create("master/updatecategory", {
      ID: route.params.data.id,
      CategoryName: name,
      RoleID: activityFullData.find((el) => {
        return el.activityRoleName === acivityName;
      }).id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      HSNSACCode: hsn,
      GSTRate: parseFloat(gst),
      UnitID: arrunitOfSalesName.join(","),
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
    const objActivities = activityFullData.find((el) => {
      return el.activityRoleName && el.activityRoleName === acivityName;
    });
    if (acivityName.length === 0 || !objActivities) {
      setANError(true);
      isValid = false;
    }
    const objServices = servicesFullData.find((el) => {
      return el.serviceName && el.serviceName === serviceName;
    });
    if (serviceName.length === 0 || !objServices) {
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
      <ScrollView style={[Styles.flex1, Styles.backgroundColor]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <Dropdown label="Activity Name" data={activityData} onSelected={onActivityNameSelected} isError={errorAN} selectedItem={acivityName} />
          <Dropdown label="Service Name" data={servicesData} onSelected={onServiceNameSelected} isError={errorSN} selectedItem={serviceName} />
          <TextInput mode="flat" label="Category Name" value={name} onChangeText={onNameChanged} style={{ backgroundColor: "white" }} error={error} />
          <TextInput mode="flat" label="HSN / SAC Code" value={hsn} onChangeText={onHSNChanged} style={{ backgroundColor: "white" }} error={hsnError} />
          <TextInput mode="flat" label="GST Rate" value={gst} onChangeText={onGSTChanged} style={{ backgroundColor: "white" }} error={gstError} />
          <Subheading style={{ paddingTop: 24, fontWeight: "bold" }}>Unit of Sales</Subheading>
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
                      if (k.id === u.id) {
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
        </View>
      </ScrollView>
    </View>
  );
};

export default AddCategoryScreen;
