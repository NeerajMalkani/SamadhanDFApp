import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Subheading, Text, TextInput } from "react-native-paper";
import Provider from "../../../../../api/Provider";
import Dropdown from "../../../../../components/Dropdown";
import { Styles } from "../../../../../styles/styles";
import { theme } from "../../../../../theme/apptheme";
import { communication } from "../../../../../utils/communication";

const AddBudgetSetup = ({ route, navigation }) => {

   //#region Variables

   const [entryTypeNameData, setEntryTypeNameData] = React.useState([]);
  const [entryTypeName, setEntryTypeName] = React.useState([]);
//   const [entryTypeName, setEntryTypeName] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [errorET, setETError] = React.useState(false);

  const [modeTypeNameData, setModeTypeNameData] = React.useState([]);
  const [modeTypeName, setModeTypeName] = React.useState([]);
//   const [modeTypeName, setModeTypeName] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [errorMT, setMTError] = React.useState(false);
  
  const [categoryNameData, setCategoryNameData] = React.useState([]);
  const [categoryName, setCategoryName] = React.useState([]);
//   const [categoryName, setCategoryName] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [errorCN, setCNError] = React.useState(false);

  const [subCategoryNameData, setSubCategoryNameData] = React.useState([]);
  const [subCategoryName, setSubCategoryName] = React.useState([]);
//   const [subCategoryName, setSubCategoryName] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [errorSCN, setSCNError] = React.useState(false);

  const [budgetAmountError, setBudgetAmountError] = React.useState(false);
  const [budgetAmount, setBudgetAmount] = React.useState(route.params.type === "edit" ? route.params.data.budgetAmount : "");
  
  const [notesError, setNotesError] = React.useState(false);
  const [notes, setNotes] = React.useState(route.params.type === "edit" ? route.params.data.notes : "");
  
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);
  const ref_input2 = useRef();
  const ref_input3 = useRef();
   //#endregion 

 //#region Functions
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
                  return o.trim() === el.displayUnit;
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

  const onEntryTypeName = (selectedItem) => {
    setEntryTypeName(selectedItem);
    setETError(false);
  };

  const onModeTypeName = (selectedItem) => {
    setModeTypeName(selectedItem);
    setMTErrorError(false);
  };

  const onCategoryNameChanged = (selectedItem) => {
    setCNError(selectedItem);
    setCNError(false);
  };

  const onSubCategoryNameChanged = (text) => {
    setSubCategoryName(text);
    setSCNError(false);
  };

  const onBudgetAmount = (text) => {
    setBudgetAmount(text);
    setBudgetAmountError(false);
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
        } else if (response.data.code === 304) {
          setSnackbarText(communication.AlreadyExists);
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
    let arrunitOfSalesName = [];
    unitOfSalesData.map((o) => {
      if (o.isChecked) {
        arrunitOfSalesName.push(o.id);
      }
    });
    const params = {
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
    };
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
        } else if (response.data.code === 304) {
          setSnackbarText(communication.AlreadyExists);
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
    if (hsn.length === 0) {
      setHSNError(true);
      isValid = false;
    }
    if (gst.length === 0) {
      setGSTError(true);
      isValid = false;
    }
    const objUnitOfSales = unitOfSalesData.find((el) => {
      return el.isChecked;
    });
    if (!objUnitOfSales) {
      setUNError(true);
      isValid = false;
    }
    if (isValid) {
      if (route.params.type === "edit") {
        UpdateData();
      } else {
        InsertData();
      }
    }
  };
 //#endregion 
 
  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
        <Dropdown label="Entry Type Name" data={entryTypeNameData} onSelected={onEntryTypeName} isError={errorET} selectedItem={entryTypeName} />
          <HelperText type="error" visible={errorMT}>
            {communication.InvalidModeTypeName}
          </HelperText>

          <Dropdown label="Mode Type Name" data={modeTypeNameData} onSelected={onModeTypeName} isError={errorMT} selectedItem={modeTypeName} />
          <HelperText type="error" visible={errorMT}>
            {communication.InvalidModeTypeName}
          </HelperText>
         
          <Dropdown label="Category Name" data={categoryNameData} onSelected={onCategoryNameChanged} isError={errorCN} selectedItem={categoryName} />
          <HelperText type="error" visible={errorCN}>
            {communication.InvalidCategoryName}
          </HelperText>

          <Dropdown label=" Sub Category Name" data={subCategoryNameData} onSelected={onSubCategoryNameChanged} isError={errorSCN} selectedItem={subCategoryName} />
          <HelperText type="error" visible={errorSCN}>
            {communication.InvalidSubCategoryName}
          </HelperText>

         
          <TextInput mode="flat" label=" Budget Amount" value={budgetAmount} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onBudgetAmount} style={{ backgroundColor: "white" }} error={notesError} />
          <HelperText type="error" visible={budgetAmountError}>
            {communication.InvalidBudgetAmount}
          </HelperText>
          
          <View style={{ width: 160 }}>
            <Checkbox.Item
              label="Display"
              color={theme.colors.primary}
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          </View>
          
        </View>
      </ScrollView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content>
          <Button mode="contained" onPress={ValidateData}>
            Submit
          </Button>
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddBudgetSetup;
