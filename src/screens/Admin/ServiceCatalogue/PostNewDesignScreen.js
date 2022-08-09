import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView, Image } from "react-native";
import { FAB, List, Snackbar, Searchbar, Title } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const PostNewDesignScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);
  const listData = React.useState([]);
  const listSearchData = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [selectedDesignTypeName, setSelectedDesignTypeName] = React.useState("");
  const [serviceName, setServiceName] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [productName, setProductName] = React.useState("");
  const [designNumber, setDesignNumber] = React.useState("");
  const [designImage, setDesignImage] = React.useState("");
  const [workLocationName, setWorkLocationName] = React.useState("");
  const [labourCost, setLabourCost] = React.useState("");

  const refRBSheet = useRef();

  const FetchData = (from) => {
    if (from === "add" || from === "update") {
      setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
      setSnackbarColor(theme.colors.success);
      setSnackbarVisible(true);
    }
    Provider.getAll("servicecatalogue/getpostnewdesigntypes")
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

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      listSearchData[1](listData[0]);
    } else {
      listSearchData[1](
        listData[0].filter((el) => {
          return el.designTypeName.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };

  const RenderItems = (data) => {
    return (
      <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 72 }]}>
        <List.Item
          title={data.item.designTypeName}
          titleStyle={{ fontSize: 18 }}
          description={"Display: " + (data.item.display ? "Yes" : "No")}
          left={() => <Image source={{ uri: data.item.designImage }} style={[Styles.width56, Styles.height56]} />}
          onPress={() => {
            refRBSheet.current.open();
            setSelectedDesignTypeName(data.item.designTypeName);
            setServiceName(data.item.serviceName);
            setCategoryName(data.item.categoryName);
            setProductName(data.item.productName);
            setDesignNumber(data.item.designNumber);
            setDesignImage(data.item.designImage);
            setWorkLocationName(data.item.workLocationName);
            setLabourCost(data.item.labourCost);
          }}
          right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
        />
      </View>
    );
  };

  const AddCallback = () => {
    navigation.navigate("AddPostNewDesignScreen", { type: "add", fetchData: FetchData, data: { count: listData[0].length } });
  };

  const EditCallback = (data, rowMap) => {
    rowMap[data.item.key].closeRow();
    navigation.navigate("AddPostNewDesignScreen", {
      type: "edit",
      fetchData: FetchData,
      data: {
        id: data.item.id,
        serviceID: data.item.serviceID,
        serviceName: data.item.serviceName,
        categoryID: data.item.categoryID,
        categoryName: data.item.categoryName,
        productID: data.item.productID,
        productName: data.item.productName,
        designTypeID: data.item.designTypeID,
        designTypeName: data.item.designTypeName,
        workLocationID: data.item.workLocationID,
        workLocationName: data.item.workLocationName,
        designNumber: data.item.designNumber,
        designImage: data.item.designImage,
        labourCost: data.item.labourCost,
        display: data.item.display,
        count: listData[0].length,
      },
    });
  };

  return (
    <View style={[Styles.flex1]}>
      <Header navigation={navigation} title="Post New Design" />
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
            renderHiddenItem={(data, rowMap) => RenderHiddenItems(data, rowMap, [EditCallback])}
          />
        </View>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found. Add records by clicking on plus icon." />
      )}
      <FAB style={[Styles.margin16, Styles.primaryBgColor, { position: "absolute", right: 16, bottom: 16 }]} icon="plus" onPress={AddCallback} />
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={620} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View>
          <Title style={[Styles.paddingHorizontal16]}>{selectedDesignTypeName}</Title>
          <ScrollView style={{ paddingBottom: 64 }}>
            <List.Item title="Labour Cost" description={labourCost} />
            <List.Item title="Service Name" description={serviceName} />
            <List.Item title="Category Name" description={categoryName} />
            <List.Item title="Product Name" description={productName} />
            <List.Item title="Work Location Name" description={workLocationName} />
            <List.Item title="Design Number" description={designNumber} />
            <List.Item title="Design Image" />
            <Image source={{ uri: designImage }} style={[Styles.height104, Styles.width104, Styles.marginStart16]} />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default PostNewDesignScreen;
