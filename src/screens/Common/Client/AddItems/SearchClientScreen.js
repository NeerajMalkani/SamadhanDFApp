import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View, ScrollView, Text } from "react-native";
import { HelperText, TextInput, Searchbar, Button, Snackbar } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../../api/Provider";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { List } from "react-native-paper";
import { NullOrEmpty } from "../../../../utils/validations";
import { RenderHiddenItemGeneric } from "../../../../components/ListActions";
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../../components/NoItems";

import DFButton from "../../../../components/Button";
let userID = 0;
const SearchClientScreen = ({ route, navigation }) => {
  const [mobileNo, setMobileNo] = useState("");
  const [mobileNoInvalid, setMobileNoInvalid] = useState("");
  const mobileNoRef = useRef({});

  const [companyName, setCompanyName] = useState(route.params.type === "edit" ? route.params.data.companyName : "");
  const [companyNameInvalid, setCompanyNameInvalid] = useState(false);
  const companyNameRef = useRef({});

  const [isLoading, setIsLoading] = React.useState(false);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
    }
  };

  useEffect(() => {
    if (route.params.type !== "edit") {
      setCompanyName("");
      setMobileNo("");
      setCompanyNameInvalid(false);
      setMobileNoInvalid(false);
      listData[1]([]);
    }
    GetUserID();
  }, []);

  const onMobileNoChanged = (text) => {
    setMobileNo(text);
    setMobileNoInvalid(false);
  };

  const onCompanyNameChanged = (text) => {
    setCompanyName(text);
    setCompanyNameInvalid(false);
  };

  const OnSearchEmployee = () => {
    setIsButtonLoading(true);

    let isValid = true;
    if (NullOrEmpty(companyName) && NullOrEmpty(mobileNo.trim())) {
      setCompanyNameInvalid(true);
      setMobileNoInvalid(true);
      isValid = false;
    }

    if (isValid) {
      setCompanyNameInvalid(false);
      setMobileNoInvalid(false);
      companyNameRef.current.blur();
      mobileNoRef.current.blur();
      setIsLoading(true);
      FetchSearchClient();
    } else {
      listData[1]([]);
    }
  };

  const FetchSearchClient = () => {
    let params = {
      data: {
        Sess_UserRefno: userID,
        mobile_no_s: mobileNo,
        company_name_s: companyName,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.ClientSearch, params)
      .then((response) => {
        setIsButtonLoading(false);
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
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsButtonLoading(false);
        listData[1]([]);
        setIsLoading(false);
      });
  };

  const AddClient = (ID) => {
    const params = {
      data: {
        Sess_UserRefno: userID,
        client_user_refno: ID,
      },
    };
    Provider.createDFCommon(Provider.API_URLS.ClientAdd, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          setSnackbarColor(theme.colors.success);
          setSnackbarText("Client Added successfully");
          setSnackbarVisible(true);
          route.params.fetchData("add");
          navigation.goBack();
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

  const EditCallback = (data) => {
    AddClient(data.item.Search_user_refno);
  };
  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 80 }]}>
        <List.Item title={data.item.Search_company_name} titleStyle={{ fontSize: 18 }} description={`Mob.: ${NullOrEmpty(data.item.Search_mobile_no) ? "" : data.item.Search_mobile_no}`} left={() => <MIcon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="account-group" />} />
      </View>
    );
  };

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 0 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.paddingHorizontal16, Styles.paddingTop16]}>
          <TextInput ref={companyNameRef} mode="outlined"dense label="Name / Company Name" value={companyName} returnKeyType="next" onSubmitEditing={() => mobileNoRef.current.focus()} onChangeText={onCompanyNameChanged} style={{ backgroundColor: "white" }} error={companyNameInvalid} />
          <HelperText type="error" visible={companyNameInvalid}>
            {communication.InvalidCompanyClient}
          </HelperText>
          <TextInput ref={mobileNoRef} mode="outlined" dense keyboardType="number-pad" label="Mobile No" value={mobileNo} returnKeyType="done" onChangeText={onMobileNoChanged} style={{ backgroundColor: "white" }} error={mobileNoInvalid} />
          <HelperText type="error" visible={mobileNoInvalid}>
            {communication.InvalidMobileNumber}
          </HelperText>
          {/* <Button mode="contained" onPress={OnSearchEmployee} style={[Styles.marginTop24]}>
            SEARCH CLIENT
          </Button> */}
          <DFButton mode="contained" onPress={OnSearchEmployee} title="SEARCH CLIENT" loader={isButtonLoading} />
          <View>
            <View style={[Styles.width100per, Styles.borderBottom2, Styles.borderBottom2, Styles.marginTop24]}>
              <Text style={[Styles.fontSize20, Styles.fontBold, Styles.marginBottom4, Styles.primaryColor]}>Client Search Result</Text>
            </View>
            {isLoading ? (
              <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.padding32]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            ) : listData[0].length > 0 ? (
              <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
                <SwipeListView previewDuration={700} previewOpenValue={-72} previewRowKey="1" previewOpenDelay={0} data={listSearchData[0]} useFlatList={true} disableRightSwipe={true} rightOpenValue={-72} renderItem={(data) => RenderItems(data)} renderHiddenItem={(data, rowMap) => RenderHiddenItemGeneric("plus", data, rowMap, [EditCallback])} />
              </View>
            ) : (
              <NoItems icon="format-list-bulleted" text="No clients found." />
            )}
          </View>
        </View>
      </ScrollView>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};
export default SearchClientScreen;
