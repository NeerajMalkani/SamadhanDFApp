import { LogBox, ScrollView, View } from "react-native";
import { Styles } from "../../../../styles/styles";
import { useEffect, useState } from "react";
import Provider from "../../../../api/Provider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../../theme/apptheme";
import SelectBox from "react-native-multi-selectbox";
import { xorBy } from "lodash";
import { Button, Card, Checkbox, HelperText, Snackbar, TextInput } from "react-native-paper";
import { communication } from "../../../../utils/communication";

const AddLocationTypeScreen = ({ route, navigation }) => {
  const [branchTypeError, setBranchTypeError] = useState(false);
  const [branchType, setBranchType] = useState(route.params.type === "edit" ? route.params.data.branchType : "");

  const [activitySelectedValue, setActivitySelectedValue] = useState([]);
  const [activities, setActivities] = useState([]);
  const [activitiesError, setActivitiesError] = useState(false);

  const [serviceSelectedValue, setServiceSelectedValue] = useState([]);
  const [services, setServices] = useState([]);
  const [servicesError, setServicesError] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarText, setSnackbarText] = useState("");

  const [checked, setChecked] = useState(route.params.type === "edit" ? route.params.data.display : false);

  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const FetchActivities = () => {
    Provider.getAll("master/getactivityroles")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            let listData = [];
            response.data.data.map((k) => {
              listData.push({
                id: k.id,
                item: k.activityRoleName,
              });
            });
            setActivities(listData);
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
            let listData = [];
            response.data.data.map((k) => {
              listData.push({
                id: k.id,
                item: k.serviceName,
              });
            });
            setServices(listData);
          }
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    FetchActivities();
    FetchServices();
  }, []);

  const onBranchTypeChanged = (text) => {
    setBranchType(text);
    setBranchTypeError(false);
  };

  const onActivityChanged = () => {
    return (item) => {
      setActivitySelectedValue(xorBy(activitySelectedValue, [item], "id"));
    };
  };

  const onServiceChanged = () => {
    return (item) => {
      setServiceSelectedValue(xorBy(serviceSelectedValue, [item], "id"));
    };
  };

  const InsertLocationType = () => {
    console.log(
      JSON.stringify({
        BranchType: branchType,
        ActivityID: activitySelectedValue.map((data) => data.id).toString(),
        ServiceID: serviceSelectedValue.map((data) => data.id).toString(),
        Display: checked,
      })
    );
    Provider.create("master/insertlocationtype", {
      BranchType: branchType,
      ActivityID: activitySelectedValue.map((data) => data.id).toString(),
      ServiceID: serviceSelectedValue.map((data) => data.id).toString(),
      Display: checked,
    })
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("add");
          navigation.goBack();
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

  const UpdateLocationType = () => {};

  const ValidateLocationType = () => {
    let isValid = true;
    if (branchType.length === 0) {
      setBranchTypeError(true);
      isValid = false;
    }
    if (activitySelectedValue.length === 0) {
      setActivitiesError(true);
      isValid = false;
    }
    if (serviceSelectedValue.length === 0) {
      setServicesError(true);
      isValid = false;
    }

    if (isValid) {
      if (route.params.type === "edit") {
        UpdateLocationType();
      } else {
        InsertLocationType();
      }
    }
  };

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
        <View style={[Styles.flex1, Styles.padding16]}>
          <TextInput mode="flat" label="Branch Type" value={branchType} onChangeText={onBranchTypeChanged} style={{ backgroundColor: "white" }} error={branchTypeError} />
          <HelperText type="error" visible={branchTypeError}>
            {communication.InvalidInterStateLimit}
          </HelperText>
          <SelectBox
            selectIcon={<Icon name="menu-down" color={theme.colors.primary} size={24} />}
            inputPlaceholder="Select multiple activity names"
            hideInputFilter={true}
            searchIconColor={theme.colors.primary}
            toggleIconColor={theme.colors.primary}
            containerStyle={{ paddingHorizontal: 16 }}
            optionsLabelStyle={{ color: theme.colors.text, fontSize: 14 }}
            optionContainerStyle={{ backgroundColor: theme.colors.textLight, borderWidth: 1, borderColor: theme.colors.border, elevation: 2, padding: 16 }}
            multiOptionContainerStyle={{ backgroundColor: theme.colors.primary }}
            multiOptionsLabelStyle={{ fontSize: 13 }}
            inputFilterStyle={{ fontSize: 16 }}
            searchInputProps={{ placeholder: "Search", placeholderTextColor: theme.colors.textLightSecondary }}
            label="Select Activity"
            labelStyle={{ paddingHorizontal: 16 }}
            options={activities}
            selectedValues={activitySelectedValue}
            onMultiSelect={onActivityChanged()}
            onTapClose={onActivityChanged()}
            listOptionProps={{ height: 260}}
            isMulti
          />
          <HelperText type="error" visible={activitiesError}>
            {communication.InvalidInterStateLimit}
          </HelperText>
          <SelectBox
            selectIcon={<Icon name="menu-down" color={theme.colors.primary} size={24} />}
            inputPlaceholder="Select multiple service names"
            hideInputFilter={true}
            searchIconColor={theme.colors.primary}
            toggleIconColor={theme.colors.primary}
            containerStyle={{ paddingHorizontal: 16 }}
            optionsLabelStyle={{ color: theme.colors.text, fontSize: 14 }}
            optionContainerStyle={{ backgroundColor: theme.colors.textLight, borderWidth: 1, borderColor: theme.colors.border, elevation: 2, padding: 16 }}
            multiOptionContainerStyle={{ backgroundColor: theme.colors.primary }}
            multiOptionsLabelStyle={{ fontSize: 13 }}
            inputFilterStyle={{ fontSize: 16 }}
            searchInputProps={{ placeholder: "Search", placeholderTextColor: theme.colors.textLightSecondary }}
            label="Select Service"
            labelStyle={{ paddingHorizontal: 16 }}
            options={services}
            selectedValues={serviceSelectedValue}
            onMultiSelect={onServiceChanged()}
            onTapClose={onServiceChanged()}
            isMulti
          />
          <HelperText type="error" visible={servicesError}>
            {communication.InvalidInterStateLimit}
          </HelperText>
          <View style={{ width: 160 }}>
            <Checkbox.Item
              label="Display"
              position="leading"
              style={{ paddingHorizontal: 2 }}
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
          <Button mode="contained" onPress={ValidateLocationType}>
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

export default AddLocationTypeScreen;
