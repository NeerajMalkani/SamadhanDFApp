import { View, Text, RefreshControl } from "react-native";
import React, { useState } from "react";
import { Button } from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import Provider from "../../../../api/Provider";
import { SwipeListView } from "react-native-swipe-list-view";
import { useIsFocused } from "@react-navigation/native";

const RenderItems = (data, navigation) => {
  return (
    <View
      style={[
        Styles.backgroundColor,
        Styles.paddingHorizontal16,
        Styles.flexJustifyCenter,
        {
          borderWidth: 1.3,
          marginBottom: 10,
          borderRadius: 8,
          padding: 15,
          borderColor: theme.colors.primary,
        },
      ]}
    >
      <View>
        <Text
          style={[
            { fontWeight: "bold", fontSize: 20, marginBottom: "1%" },
            Styles.primaryColor,
          ]}
        >
          Budget No : {data.item.budget_no}
        </Text>
        <Text>Project Name : {data.item.project_name}</Text>

        <Text>
          Contact Person & Name : {data.item.architect_firstname} &{" "}
          {data.item.architect_mobile_no}
        </Text>
        <Text>Budget Unit : {data.item.quot_unit_type_name}</Text>
      </View>
      <View
        style={{
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
          flexDirection: "row",
        }}
      >
        {/* {data.item.action_button.includes("Edit") && (
          <Button
            mode="outlined"
            onPress={() => {
              navigation.navigate("ContractorEstimation", {
                userDesignEstimationID: data.item?.cont_estimation_refno,
                isContractor: true,
                designImage: data.item?.design_image_url,
                fetchData: fetch,
                isUpdate: true,
                data: data.item,
                set: set,
              });
            }}
            style={{
              borderColor: theme.colors.primary,
              borderWidth: 1.2,
            }}
          >
            Edit
          </Button> 
        )} */}
        <Button
          mode="outlined"
          onPress={() => {
            navigation.navigate("My Budget Preview", { data: data.item });
          }}
          style={{
            borderColor: theme.colors.primary,
            borderWidth: 1.2,
          }}
        >
          View Actions
        </Button>
      </View>
    </View>
  );
};
let Sess_UserRefno = 0;

const ApprovedPending = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const getUserData = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      Sess_UserRefno = JSON.parse(userData).UserID;

      await fetchPending();
      setRefreshing(false);
    }
  };
  const fetchPending = () => {
    Provider.createDFClient(Provider.API_URLS.client_mybudget_list, {
      data: { Sess_UserRefno },
    }).then((res) => {
      console.log(res.data);

      if (res.data.data) {
        setData(res.data.data);
      }
    });
  };
  useEffect(() => {
    if (isFocused) getUserData();
    else {
      setData([]);
    }
  }, [isFocused]);
  console.log(JSON.stringify(data, null, 2));
  return (
    <View>
      <ScrollView>
        <View style={[Styles.flex1, Styles.padding16]}>
          <SwipeListView
            previewDuration={1000}
            previewOpenValue={-160}
            previewRowKey="1"
            previewOpenDelay={1000}
            refreshControl={
              <RefreshControl
                colors={[theme.colors.primary]}
                refreshing={refreshing}
                onRefresh={() => {
                  setRefreshing(true);
                  getUserData();
                }}
              />
            }
            data={data}
            useFlatList={true}
            disableRightSwipe={true}
            rightOpenValue={-160}
            renderItem={(data) => RenderItems(data, navigation)}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ApprovedPending;
