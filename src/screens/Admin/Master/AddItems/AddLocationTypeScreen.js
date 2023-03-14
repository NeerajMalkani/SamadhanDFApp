import { FlatList, LogBox, ScrollView, View } from "react-native";
import { Styles } from "../../../../styles/styles";
import { useEffect, useRef, useState } from "react";
import { theme } from "../../../../theme/apptheme";
import Provider from "../../../../api/Provider";
import RBSheet from "react-native-raw-bottom-sheet";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Card, Checkbox, Chip, HelperText, List, Snackbar, Text, TextInput,Button } from "react-native-paper";
import { communication } from "../../../../utils/communication";
import { APIConverter } from "../../../../utils/apiconverter";
import DFButton from "../../../../components/Button";

const AddLocationTypeScreen = ({ route, navigation }) => {
  //#region Variables
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

  const [checked, setChecked] = useState(route.params.type === "edit" ? route.params.data.display : true);

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const refActivityRBSheet = useRef();
  const refServicesRBSheet = useRef();
  //#endregion

  //#region Functions
  useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const FetchActivities = () => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        group_refno: "all",
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.GroupFromRefNo, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            let listData = [];
            let selectedData = [];
            response.data.data.map((k) => {
              listData.push({
                id: k.id,
                name: k.activityRoleName,
                isChecked: route.params && route.params.type === "edit" && route.params.data && route.params.data.activityName.indexOf(k.activityRoleName) !== -1 ? true : false,
              });
              if (route.params && route.params.type === "edit" && route.params.data && route.params.data.activityName.indexOf(k.activityRoleName) !== -1) {
                selectedData.push(k.id);
              }
            });

            if (route.params.type === "edit") {
              setActivitySelectedValue(selectedData);
            }
            setActivities(listData);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchServices = () => {
    let params = {
      data: {
        Sess_UserRefno: "2",
        service_refno: "all",
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.ServiceFromRefNo, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            let listData = [];
            let selectedData = [];
            response.data.data.map((k) => {
              listData.push({
                id: k.id,
                name: k.serviceName,
                isChecked: route.params && route.params.type === "edit" && route.params.data && route.params.data.serviceName.indexOf(k.serviceName) !== -1 ? true : false,
              });
              if (route.params && route.params.type === "edit" && route.params.data && route.params.data.serviceName.indexOf(k.serviceName) !== -1) {
                selectedData.push(k.id);
              }
            });
            if (route.params.type === "edit") {
              setServiceSelectedValue(selectedData);
            }
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
    setActivitiesError(false);
    let temp = activities.map((activity) => {
      if (id === activity.id) {
        const activitiesTemp = [...activitySelectedValue];
        if (!activity.isChecked) {
          activitiesTemp.push(id);
        } else if (activity.isChecked) {
          activitiesTemp.splice(activitiesTemp.indexOf(id), 1);
        }
        setActivitySelectedValue(activitiesTemp);
        return { ...activity, isChecked: !activity.isChecked };
      }
      return activity;
    });
    setActivities(temp);
  };

  const onServiceChanged = (id) => {
    setServicesError(false);
    let temp = services.map((service) => {
      if (id === service.id) {
        const servicesTemp = [...serviceSelectedValue];
        if (!service.isChecked) {
          servicesTemp.push(id);
        } else if (service.isChecked) {
          servicesTemp.splice(servicesTemp.indexOf(id), 1);
        }
        setServiceSelectedValue(servicesTemp);
        return { ...service, isChecked: !service.isChecked };
      }
      return service;
    });
    setServices(temp);
  };

  const InsertLocationType = () => {
    const params = {
      data: {
        Sess_UserRefno: "2",
        locationtype_name: branchType,
        group_refno: activitySelectedValue,
        service_refno: serviceSelectedValue,
        view_status: checked ? 1 : 0,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.LocationTypeCreate, params)
      .then((response) => {
        setIsButtonLoading(false);
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
        setIsButtonLoading(false);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const UpdateLocationType = () => {
    const params = {
      data: {
        Sess_UserRefno: "2",
        locationtype_refno: route.params.data.id,
        locationtype_name: branchType,
        group_refno: activitySelectedValue,
        service_refno: serviceSelectedValue,
        view_status: checked ? 1 : 0,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.LocationTypeUpdate, params)
      .then((response) => {
        setIsButtonLoading(false);
        if (response.data && response.data.code === 200) {
          route.params.fetchData("update");
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
        setIsButtonLoading(false);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

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
      setIsButtonLoading(true);
      if (route.params.type === "edit") {
        UpdateLocationType();
      } else {
        InsertLocationType();
      }
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}>
        <View style={[Styles.flex1, Styles.padding16]}>
          <TextInput mode="flat" label="Branch Type" value={branchType} onChangeText={onBranchTypeChanged} style={{ backgroundColor: "white" }} error={branchTypeError} />
          <HelperText type="error" visible={branchTypeError}>
            {communication.InvalidBranchType}
          </HelperText>
          <View
            style={[Styles.flexRow, Styles.width100per, Styles.height48, Styles.marginTop12, Styles.borderBottom1, Styles.flexAlignCenter, Styles.padding12, { position: "relative", borderBottomColor: theme.colors.disabled }]}
            onTouchStart={() => {
              refActivityRBSheet.current.open();
            }}
          >
            <Text style={[Styles.textSecondaryColor, Styles.fontSize16, Styles.paddingStart12, { position: "absolute", zIndex: -2 }]}>{activitySelectedValue.length > 0 ? activitySelectedValue.length + " activities selected" : "Select Activities"}</Text>
          </View>
          <View style={[Styles.flexRow, Styles.flexWrap]}>
            {activities.map((item, i) => {
              return item.isChecked ? (
                <Chip
                  key={i}
                  style={[Styles.flexJustifyCenter, Styles.margin4]}
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
          </View>
          <HelperText type="error" visible={activitiesError}>
            {communication.InvalidActivityName}
          </HelperText>

          <View
            style={[Styles.flexRow, Styles.width100per, Styles.height48, Styles.marginTop12, Styles.borderBottom1, Styles.flexAlignCenter, Styles.padding12, { position: "relative", borderBottomColor: theme.colors.disabled }]}
            onTouchStart={() => {
              refServicesRBSheet.current.open();
            }}
          >
            <Text style={[Styles.textSecondaryColor, Styles.fontSize16, Styles.paddingStart12, { position: "absolute", zIndex: -2 }]}>{serviceSelectedValue.length > 0 ? serviceSelectedValue.length + " services selected" : "Select Services"}</Text>
          </View>
          <View style={[Styles.flexRow, Styles.flexWrap]}>
            {services.map((item, i) => {
              return item.isChecked ? (
                <Chip
                  key={i}
                  style={[Styles.flexJustifyCenter, Styles.margin4]}
                  mode="outlined"
                  closeIcon={() => {
                    return <Icon name="close" />;
                  }}
                  onClose={() => {
                    onServiceChanged(item.id);
                  }}
                  onPress={() => {
                    onServiceChanged(item.id);
                  }}
                >
                  {item.name}
                </Chip>
              ) : null;
            })}
          </View>
          <HelperText type="error" visible={servicesError}>
            {communication.InvalidServiceName}
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
          {/* <Button mode="contained" loading={isButtonLoading} disabled={isButtonLoading} onPress={ValidateLocationType}>
            SAVE
          </Button> */}
          
          <DFButton mode="contained" onPress={ValidateLocationType} title="SAVE" loader={isButtonLoading} />

        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
      <RBSheet ref={refActivityRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={400} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
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
              refActivityRBSheet.current.close();
            }}
          >
            DONE
          </Button>
        </View>
      </RBSheet>
      <RBSheet ref={refServicesRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={400} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View style={[Styles.flex1, Styles.marginBottom16]}>
          <ScrollView style={[Styles.marginBottom48]}>
            <List.Section>
              {services.map((item, i) => {
                return (
                  <List.Item
                    key={i}
                    title={item.name}
                    onPress={() => {
                      onServiceChanged(item.id);
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
              refServicesRBSheet.current.close();
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
