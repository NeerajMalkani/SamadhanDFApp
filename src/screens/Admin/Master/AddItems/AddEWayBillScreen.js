import React, { useEffect, useRef } from "react";
import { ScrollView, View } from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import { Card, Checkbox, HelperText, Snackbar, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import DFButton from "../../../../components/Button";

const AddEWayBillScreen = ({ route, navigation }) => {
  //#region Variables
  const [statesFullData, setStatesFullData] = React.useState([]);
  const [statesData, setStatesData] = React.useState([]);
  const [stateName, setStateName] = React.useState(route.params.type === "edit" ? route.params.data.state_name : "");
  const [stateSelectedID, setStateSelectedID] = React.useState("");
  const [errorSN, setSNError] = React.useState(false);

  const [inStateLimitError, setInStateLimitError] = React.useState(false);
  const [inStateLimit, setInStateLimit] = React.useState(route.params.type === "edit" ? route.params.data.in_state_limit : "");

  const [interStateLimitError, setInterStateLimitError] = React.useState(false);
  const [interStateLimit, setInterStateLimit] = React.useState(route.params.type === "edit" ? route.params.data.inter_state_limit : "");

  const [checked, setChecked] = React.useState(route.params.type === "edit" ? (route.params.data.view_status === "1" ? true : false) : true);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const ref_input2 = useRef();
  //#endregion

  //#region Functions

  const FetchStates = () => {
    Provider.createDFAdmin(Provider.API_URLS.GetStateEWayBillForm, null)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            setStatesFullData(response.data.data);
            const stateData = [];
            response.data.data.map((data, i) => {
              if (data.state_name === stateName) {
                setStateSelectedID(i.toString());
              }
              stateData.push({
                id: data.state_refno.toString(),
                title: data.state_name,
              });
            });
            setStatesData(stateData);
          }
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    FetchStates();
  }, []);

  const onStateNameSelected = (selectedItem) => {
    setStateName(selectedItem);
    setSNError(false);
  };

  const onInStateLimitChanged = (text) => {
    setInStateLimit(text);
    setInStateLimitError(false);
  };

  const onInterStateLimitChanged = (text) => {
    setInterStateLimit(text);
    setInterStateLimitError(false);
  };

  const InsertEWayBill = () => {
    Provider.createDFAdmin(Provider.API_URLS.EWayBillCreate, {
      data: {
        Sess_UserRefno: "2",
        group_refno: "2",
        state_refno: statesFullData.find((el) => {
          return el.state_name === stateName;
        }).state_refno,
        in_state_limit: inStateLimit,
        inter_state_limit: interStateLimit,
        view_status: checked ? 1 : 0,
      },
    })
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

  const UpdateEWayBill = () => {
    Provider.createDFAdmin(Provider.API_URLS.EWayBillUpdate, {
      data: {
        Sess_UserRefno: "2",
        ewaybill_refno: route.params.data.id,
        group_refno: "2",
        state_refno: statesFullData.find((el) => {
          return el.state_name === stateName;
        }).state_refno,
        in_state_limit: inStateLimit,
        inter_state_limit: interStateLimit,
        view_status: checked ? 1 : 0,
      },
    })
      .then((response) => {
        setIsButtonLoading(false);
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
        setIsButtonLoading(false);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const ValidateEWayBillName = () => {
    let isValid = true;
    const objStates = statesFullData.find((el) => {
      return el.state_name === stateName;
    });
    if (stateName.length === 0 || !objStates) {
      setSNError(true);
      isValid = false;
    }
    if (inStateLimit.length === 0) {
      setInStateLimitError(true);
      isValid = false;
    }
    if (interStateLimit.length === 0) {
      setInterStateLimitError(true);
      isValid = false;
    }
    if (isValid) {
      setIsButtonLoading(true);
      if (route.params.type === "edit") {
        UpdateEWayBill();
      } else {
        InsertEWayBill();
      }
    }
  };
  //#endregion

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} contentInsetAdjustmentBehavior="automatic" keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" nestedScrollEnabled>
        <View style={[Styles.padding16]}>
          <AutocompleteDropdown
            clearOnFocus={false}
            closeOnBlur={true}
            initialValue={{ id: parseInt(stateSelectedID) }} //{stateSelectedID}//
            inputContainerStyle={{ backgroundColor: theme.colors.textLight, borderBottomColor: errorSN ? theme.colors.error : theme.colors.textfield, borderBottomWidth: 1 }}
            textInputProps={{
              value: stateName,
              placeholder: "State",
              placeholderTextColor: errorSN ? theme.colors.error : theme.colors.textSecondary,
            }}
            onClear={() => {
              onStateNameSelected("");
            }}
            onChangeText={(item) => {
              if (item) {
                onStateNameSelected(item.title);
              }
            }}
            onSelectItem={(item) => {
              if (item) {
                onStateNameSelected(item.title);
              }
            }}
            dataSet={statesData}
          />
          <HelperText type="error" visible={errorSN}>
            {communication.InvalidStateName}
          </HelperText>
          <TextInput mode="outlined" label="In State Limit" keyboardType="decimal-pad" returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} value={inStateLimit} onChangeText={onInStateLimitChanged} style={{ backgroundColor: "white" }} error={inStateLimitError} />
          <HelperText type="error" visible={inStateLimitError}>
            {communication.InvalidInStateLimit}
          </HelperText>
          <TextInput ref={ref_input2} mode="outlined" label="Inter State Limit" keyboardType="decimal-pad" value={interStateLimit} onChangeText={onInterStateLimitChanged} style={{ backgroundColor: "white" }} error={interStateLimitError} />
          <HelperText type="error" visible={interStateLimitError}>
            {communication.InvalidInterStateLimit}
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
          <DFButton mode="contained" onPress={ValidateEWayBillName} title="SAVE" loader={isButtonLoading} />
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddEWayBillScreen;
