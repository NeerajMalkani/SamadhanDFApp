import { FlatList, LogBox, ScrollView, View } from "react-native";
import { Styles } from "../../../../styles/styles";
import { useEffect, useRef, useState } from "react";
import { theme } from "../../../../theme/apptheme";
import Provider from "../../../../api/Provider";
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button, Card, Checkbox, Chip, HelperText, List, Snackbar, Text, TextInput } from "react-native-paper";
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

  const refRBSheet = useRef();

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
                name: k.activityRoleName,
                isChecked: false,
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
                name: k.serviceName,
                isChecked: false,
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

  const onActivityChanged = (id) => {
    let temp = activities.map((activity) => {
      if (id === activity.id) {
        return { ...activity, isChecked: !activity.isChecked };
      }
      return activity;
    });
    setActivities(temp);
  };

  const onServiceChanged = (selectedItems) => {
    setServiceSelectedValue(selectedItems);
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
  const selectedValues = [];
  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
        <View style={[Styles.flex1, Styles.padding16]}>
          <TextInput mode="flat" label="Branch Type" value={branchType} onChangeText={onBranchTypeChanged} style={{ backgroundColor: "white" }} error={branchTypeError} />
          <HelperText type="error" visible={branchTypeError}>
            {communication.InvalidInterStateLimit}
          </HelperText>
          <View
            style={[Styles.flexRow, Styles.width100per, Styles.height48, Styles.marginTop12, Styles.borderBottom1, Styles.flexAlignCenter, Styles.padding12, { borderBottomColor: theme.colors.disabled }]}
            onTouchStart={() => {
              refRBSheet.current.open();
            }}
          >
            {activities.map((item, i) => {
              return item.isChecked ? (
                <Chip
                  key={i}
                  style={[Styles.flexJustifyCenter]}
                  mode="outlined"
                  closeIcon={() => {
                    return <Icon name="close" />;
                  }}
                  onClose={() => {
                    onActivityChanged(item.id);
                  }}
                  onPress={() => {
                    onActivityChanged(item.id);
                  }}
                >
                  {item.name}
                </Chip>
              ) : null;
            })}
            {/* <Text style={[Styles.textSecondaryColor, Styles.fontSize16, { transform: [{ scale: activitySelectedValue.length > 0 ? 1 : 0 }] }]}>Select Activity</Text> */}
          </View>
          {/* <TextInput
            mode="flat"
            label="Select Activity"
            style={{ backgroundColor: "white" }}
            error={activitiesError}
            onTouchStart={() => {
              console.log("here");
              refRBSheet.current.open();
            }}
          /> */}
          {/* <SectionedMultiSelect items={activities} IconRenderer={Icon} uniqueKey="id" subKey="children" styles={{ container: { maxHeight: 360, top: 200 } }} searchPlaceholderText="Search Activities" selectText="Select Activity" showDropDowns={true} onSelectedItemsChange={onActivityChanged} selectedItems={activitySelectedValue} /> */}
          <HelperText type="error" visible={activitiesError}>
            {communication.InvalidInterStateLimit}
          </HelperText>

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
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={400} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View style={[Styles.flex1, Styles.marginBottom16]}>
          <ScrollView style={[Styles.marginBottom48]}>
            <List.Section>
              {activities.map((item, i) => {
                return (
                  <List.Item
                    key={i}
                    title={item.name}
                    onPress={() => {
                      onActivityChanged(item.id);
                    }}
                    style={[Styles.borderBottom1, Styles.height48, Styles.flexAlignCenter, Styles.flexJustifyCenter]}
                    right={(props) => <List.Icon {...props} icon="check" color={theme.colors.success} style={{ opacity: item.isChecked ? 1 : 0 }} />}
                  >
                    <Text>{item.name}</Text>
                  </List.Item>
                );
              })}
            </List.Section>
          </ScrollView>
          <Button
            mode="contained"
            style={[Styles.width104, Styles.flexAlignSelfCenter, { position: "absolute", bottom: 0 }]}
            onPress={() => {
              refRBSheet.current.close();
            }}
          >
            DONE
          </Button>
        </View>
      </RBSheet>
    </View>
  );
};

export default AddLocationTypeScreen;
