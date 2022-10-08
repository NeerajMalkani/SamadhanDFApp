import React, { useRef } from "react";
import { Image, ScrollView, TouchableNativeFeedback, View } from "react-native";
import { List, Searchbar, Snackbar, Text, Title } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../api/Provider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";

const DesignRejectedTab = ({ fetchData, listData, listSearchData, navigation }) => {
   //#region Variables
  const [searchQuery, setSearchQuery] = React.useState("");
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [id, setID] = React.useState(0);
  const [fullName, setFullName] = React.useState("");
  const [estimationNo, setEstimationNo] = React.useState("");
  const [serviceName, setServiceName] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [productName, setProductName] = React.useState("");
  const [designTypeName, setDesignTypeName] = React.useState("");
  const [designCode, setDesignCode] = React.useState("");
  const [totalSqFt, setTotalSqFt] = React.useState("");
  const [materialCost, setMaterialCost] = React.useState("");
  const [labourCost, setLabourCost] = React.useState("");

  const refRBSheet = useRef();
 //#endregion 

 //#region Functions

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    if (query === "") {
      listSearchData[1](listData[0]);
    } else {
      listSearchData[1](
        listData[0].filter((el) => {
          return el.fullName.toString().toLowerCase().includes(query.toLowerCase());
        })
      );
    }
  };

  const ClickRow = (data) => {
    refRBSheet.current.open();
    setID(data.id);
    setFullName(data.fullName);
    setEstimationNo("AUG" + pad(data.id.toString(), 4, "0"));
    setServiceName(data.serviceName);
    setCategoryName(data.categoryName);
    setProductName(data.productName);
    setDesignTypeName(data.designTypeName);
    setDesignCode("DS-" + pad(data.designTypeID.toString(), 4, "0"));
    setTotalSqFt(CalculateSqFt(data));
    setMaterialCost(data.subtotalAmount.toFixed(4));
    setLabourCost(data.labourCost.toFixed(4));
  };

  const CalculateSqFt = (data) => {
    if (data) {
      const lengthFeetIn = data["length"].toString().split(".");
      const widthFeetIn = data["width"].toString().split(".");
      const lf = lengthFeetIn[0];
      const li = lengthFeetIn.length > 1 ? lengthFeetIn[1] : 0;
      const wf = widthFeetIn[0];
      const wi = widthFeetIn.length > 1 ? widthFeetIn[1] : 0;
      const inches = ((parseInt(lf) * 12 + parseInt(li)) * (parseInt(wf) * 12 + parseInt(wi))) / 144;
      return parseFloat(inches).toFixed(4);
    } else {
      return 0;
    }
  };

  function pad(n, width, z) {
    z = z || "0";
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
 //#endregion 
 
  return (
    <View style={[Styles.flex1]}>
      {listData[0].length > 0 ? (
        <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
          <Searchbar style={[Styles.margin16]} placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
          <ScrollView>
            {listSearchData[0].map((k, i) => {
              return (
                <View key={i} style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter]}>
                  <List.Item title={k.fullName} titleStyle={{ fontSize: 18 }} description={k.username} onPress={() => ClickRow(k)} left={() => <Image source={{ uri: k.designTypeImage }} style={[Styles.width56, Styles.height56]} />} right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />} />
                </View>
              );
            })}
          </ScrollView>
        </View>
      ) : (
        <NoItems icon="format-list-bulleted" text="No records found." />
      )}
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
        {snackbarText}
      </Snackbar>
      <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={620} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
        <View style={[Styles.flex1]}>
          <View style={[Styles.flexRow, { justifyContent: "flex-end" }]}>
            <Title numberOfLines={1} style={[Styles.flex1, Styles.paddingHorizontal16]}>
              {fullName}
            </Title>
          </View>
          <ScrollView>
            <List.Item title="Estimation No." description={estimationNo} />
            <List.Item title="Service" description={serviceName} />
            <List.Item title="Category" description={categoryName} />
            <List.Item title="Product" description={productName} />
            <List.Item title="Design Type" description={designTypeName} />
            <List.Item title="Design No." description={designCode} />
            <List.Item title="Total Sq.Ft." description={totalSqFt} />
            <List.Item title="Material Cost" description={materialCost} />
            <List.Item title="Labour Cost" description={labourCost} />
            <List.Item
              title="Approval Status"
              description={() => {
                return (
                  <View style={[Styles.flexRow]}>
                    <Text style={[Styles.redBgColor, Styles.textColorWhite, Styles.marginTop8, Styles.borderRadius4, Styles.paddingVertical4, Styles.paddingHorizontal12]}>Rejected</Text>
                  </View>
                );
              }}
            />
          </ScrollView>
        </View>
      </RBSheet>
    </View>
  );
};

export default DesignRejectedTab;
