import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";

let dealerID = 0;
const AddDealerMyServicesScreen = ({ route, navigation }) => {
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : false);

  const [servicesFullData, setServicesFullData] = React.useState([]);
  const [servicesData, setServicesData] = React.useState([]);
  const [serviceName, setServiceName] = React.useState(route.params.type === "edit" ? route.params.data.serviceName : "");
  const [errorSN, setSNError] = React.useState(false);
  const servicesDDRef = useRef({});

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      dealerID = JSON.parse(userData).UserID;
    }
  };

  const FetchActvityRoles = () => {
    Provider.getAll("master/getmainactivities")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display && el.activityRoleName === "Dealer";
            });
            FetchServicesFromActivity("Dealer", response.data.data);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchServicesFromActivity = (selectedItem, activityData) => {
    let params = {
      ID: activityData.find((el) => {
        return el.activityRoleName === selectedItem;
      }).id,
    };
    Provider.getAll(`master/getservicesbyroleid?${new URLSearchParams(params)}`)
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

  useEffect(() => {
    FetchActvityRoles();
    GetUserID();
  }, []);

  const onMyServicesNameChanged = (selectedItem) => {
    setServiceName(selectedItem);
    setSNError(false);
    if (route.params.type === "edit") {
      route.params.data.serviceID = servicesFullData.find((el) => {
        return el.serviceName === selectedItem;
      }).id;
    }
  };

  const InsertMyServicesName = () => {
    Provider.create("dealercompanyprofile/insertmyservices", {
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      DealerID: dealerID,
      Display: checked,
    })
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

  const UpdateMyServicesName = () => {
    Provider.create("dealercompanyprofile/updatemyservices", {
      ID: route.params.data.id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      DealerID: dealerID,
      Display: checked,
    })
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("update");
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

  const ValidateMyServicesName = () => {
    let isValid = true;
    const objServices = servicesFullData.find((el) => {
      return el.serviceName && el.serviceName === serviceName;
    });
    if (serviceName.length === 0 || !objServices) {
      setSNError(true);
      isValid = false;
    }
    if (isValid) {
      if (route.params.type === "edit") {
        UpdateMyServicesName();
      } else {
        InsertMyServicesName();
      }
    }
  };

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <Dropdown label="Service Name" data={servicesData} onSelected={onMyServicesNameChanged} isError={errorSN} selectedItem={serviceName} reference={servicesDDRef} />
          <HelperText type="error" visible={errorSN}>
            {communication.InvalidServiceName}
          </HelperText>
          <View style={{ width: 160 }}>
            <Checkbox.Item
              label="Display"
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
              color={theme.colors.primary}
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
          <Button mode="contained" onPress={ValidateMyServicesName}>
            SAVE
          </Button>
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddDealerMyServicesScreen;
