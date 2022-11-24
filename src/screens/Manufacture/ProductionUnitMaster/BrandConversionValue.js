import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView, Card } from "react-native";
import { FAB, List, Snackbar, Searchbar, Title, Button, Portal, Paragraph, Dialog, Text, TextInput, HelperText } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { NullOrEmpty } from "../../../utils/validations";


LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const BrandConversionValue = ({ navigation }) => {
  const openBrandModel = () => {
    refRBSheet.current.close();
    setIsDialogVisible(true);
  }

  const hideDialog = () => setIsDialogVisible(false);

  const updateBrand = () => {
    hideDialog();
    setIsButtonLoading(true);
    const params = {
      data: {
        Sess_UserRefno: userID,
        user_refno: selectedID
      }
    };
    Provider.createDF("apiappadmin/spawu7S4urax/tYjD/userdeclinestatus/", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          FetchData("decline");
        } else {
          setSnackbarText(communication.NoData);
          setSnackbarVisible(true);
        }
        setIsButtonLoading(false);
      })
      .catch((e) => {
        setSnackbarText(e.message);
        setSnackbarVisible(true);
        setIsButtonLoading(false);
      });
  };
  //#region Variables
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);


  const [serviceName, setServiceName] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [brandName, setBrandName] = React.useState("");
  const [conversionValue, setConversionValue] = React.useState("");
  const [isDialogVisible, setIsDialogVisible] = React.useState(false);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const [conversionValueError, setConversionValueError] = React.useState(false);


  const refRBSheet = useRef();
  //#endregion 

  //#region Functions
  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    Provider.getAll("master/getcategory")
      .then((response) => {
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
          setSnackbarText("No data found");
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
        setIsLoading(false);
        setRefreshing(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setSnackbarText(e.message);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    FetchData();
  }, []);

  const onConversionValueChanged = (text) => {
    setConversionValue(text);
    setConversionValueError(false);
  };

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      listSearchData[1](listData[0]);
    } else {
      listSearchData[1](
        listData[0].filter((el) => {
          return el.categoryName.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 72 }]}>
        <List.Item
          title={data.item.serviceName}
          titleStyle={{ fontSize: 18 }}
          description={`Category Name: ${NullOrEmpty(data.item.categoryName) ? "" : data.item.categoryName}\nBrand Name: ${NullOrEmpty(data.item.brandName) ? "" : data.item.brandName} `}


          onPress={() => {
            refRBSheet.current.open();
            setServiceName(data.item.serviceName);
            setCategoryName(data.item.categoryName);
            setBrandName(data.item.brandName);
            setConversionValue(data.item.conversionValue);
          }}
          left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="file-tree" />}
          right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
        />
      </View>
    );
  };

  //   const AddCallback = () => {
  //     navigation.navigate("AddCategoryScreen", { type: "add", fetchData: FetchData });
  //   };

  //   const EditCallback = (data, rowMap) => {
  //     rowMap[data.item.key].closeRow();
  //     navigation.navigate("AddCategoryScreen", {
  //       type: "edit",
  //       fetchData: FetchData,
  //       data: {
  //         id: data.item.id,
  //         activityRoleName: data.item.activityRoleName,
  //         serviceName: data.item.serviceName,
  //         unitName: data.item.unitName,
  //         categoryName: data.item.categoryName,
  //         hsnsacCode: data.item.hsnsacCode,
  //         gstRate: data.item.gstRate.toFixed(2),
  //         display: data.item.display,
  //       },
  //     });
  //   };




  //#endregion 

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Brand Coversion Value" />
      {isLoading ? (
        <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : listData[0].length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Searchbar style={[Styles.margin16]} placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
          <SwipeListView
            previewDuration={1000}
            previewOpenValue={-72}
            previewRowKey="1"
            previewOpenDelay={1000}
            refreshControl={
              <RefreshControl
                colors={[theme.colors.primary]}
                refreshing={refreshing}
                onRefresh={() => {
                  FetchData();
                }}
              />
            }
            data={listSearchData[0]}
            disableRightSwipe={true}
            rightOpenValue={-72}
            renderItem={(data) => RenderItems(data)}
          // renderHiddenItem={(data, rowMap) => RenderHiddenItems(data, rowMap, [EditCallback])}
          />
        </View>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found. Add records by clicking on plus icon." />
      )}
      {/* <FAB style={[Styles.margin16, Styles.primaryBgColor, { position: "absolute", right: 16, bottom: 16 }]} icon="plus" onPress={AddCallback} /> */}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={520} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{serviceName}</Title>
          <ScrollView>
            <List.Item title="Service Name" description={serviceName} />
            <List.Item title="Category Name" description={categoryName} />
            <List.Item title="Brand Name" description={brandName} />
          </ScrollView>
        </View>
        <View style={[Styles.paddingHorizontal16]}>
          <Text style={[Styles.paddingBottom8]}>Conversion Value</Text>
          <TextInput mode="outlined" label="Conversion Value" value={conversionValue} onChangeText={onConversionValueChanged} style={{ backgroundColor: "white" }} error={conversionValueError} />
          <HelperText type="error" visible={conversionValueError}>
            please entery valid conversion value
          </HelperText>
            <Button color={theme.colors.success} mode="contained" onPress={openBrandModel}>
              Update
            </Button>
        </View>
        
      </RBSheet>
      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={hideDialog}>
          <Dialog.Title>Confirmation</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Confirm to Decline ? </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button >Ok</Button> 
            {/* There will be update function called oncPress */}
            <Button onPress={hideDialog}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default BrandConversionValue;
