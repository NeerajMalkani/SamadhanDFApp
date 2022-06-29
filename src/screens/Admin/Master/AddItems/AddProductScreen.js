import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { Button, Checkbox, Subheading, Text, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";

const AddProductScreen = ({ route, navigation }) => {
  const [activityFullData, setActivityFullData] = React.useState([]);
  const [activityData, setActivityData] = React.useState([]);
  const [acivityName, setActivityName] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [errorAN, setANError] = React.useState(false);

  const [servicesFullData, setServicesFullData] = React.useState([]);
  const [servicesLabel, setServicesLabel] = React.useState("Select Activity Name");
  const [servicesData, setServicesData] = React.useState([]);
  const [serviceName, setServiceName] = React.useState(route.params.type === "edit" ? route.params.data.serviceName : "");
  const [errorSN, setSNError] = React.useState(false);

  const [categoriesFullData, setCategoriesFullData] = React.useState([]);
  const [categoriesLabel, setCategoriesLabel] = React.useState("Select Service Name");
  const [categoriesData, setCategoriesData] = React.useState([]);
  const [categoriesName, setCategoriesName] = React.useState(route.params.type === "edit" ? route.params.data.categoriesName : "");
  const [errorCN, setCNError] = React.useState(false);

  const [hsnError, setHSNError] = React.useState(false);
  const [hsn, setHSN] = React.useState(route.params.type === "edit" ? route.params.data.hsnsacCode : "");

  const [gstError, setGSTError] = React.useState(false);
  const [gst, setGST] = React.useState(route.params.type === "edit" ? route.params.data.gstRate.toString() : "");

  const FetchActvityRoles = () => {
    Provider.getAll("master/getmainactivities")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setActivityFullData(response.data.data);
            const activities = response.data.data.map((data) => data.activityRoleName);
            setActivityData(activities);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchServicesFromActivity = (selectedItem) => {
    let params = {
      ID: activityFullData.find((el) => {
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

  const FetchCategoriesFromServices = (selectedItem) => {
    let params = {
      ID: servicesFullData.find((el) => {
        return el.serviceName === selectedItem;
      }).id,
    };
    Provider.getAll(`master/getcategoriesbyserviceid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setCategoriesFullData(response.data.data);
            const categories = response.data.data.map((data) => data.categoryName);
            setCategoriesData(categories);
          }
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    FetchActvityRoles();
  }, []);

  const onActivityNameSelected = (selectedItem) => {
    setActivityName(selectedItem);
    setANError(false);
    setServicesLabel("Service Name");
    FetchServicesFromActivity(selectedItem);
  };

  const onServiceNameSelected = (selectedItem) => {
    setServiceName(selectedItem);
    setSNError(false);
    setCategoriesLabel("Category Name");
    FetchCategoriesFromServices(selectedItem);
  };

  const onCategoriesNameSelected = (selectedItem) => {
    setCategoriesName(selectedItem);
    setCNError(false);
  };

  const onHSNChanged = (text) => {
    setHSN(text);
    if (text.length === 0) {
      setHSNError(true);
    } else {
      setHSNError(false);
    }
  };

  const onGSTChanged = (text) => {
    setGST(text);
    if (text.length === 0) {
      setGSTError(true);
    } else {
      setGSTError(false);
    }
  };

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16, Styles.paddingTop0]}>
          <Dropdown label="Activity Name" data={activityData} onSelected={onActivityNameSelected} isError={errorAN} selectedItem={acivityName} />
          <Dropdown label={servicesLabel} data={servicesData} onSelected={onServiceNameSelected} isError={errorSN} selectedItem={serviceName} />
          <Dropdown label={categoriesLabel} data={categoriesData} onSelected={onCategoriesNameSelected} isError={errorCN} selectedItem={categoriesName} />
          <TextInput mode="flat" label="HSN / SAC Code" value={hsn} onChangeText={onHSNChanged} error={hsnError} editable={false} dense style={[Styles.marginTop12, Styles.backgroundSecondaryColor]} />
          <TextInput mode="flat" label="GST Rate" value={gst} onChangeText={onGSTChanged} error={gstError} editable={false} dense style={[Styles.marginTop12, Styles.backgroundSecondaryColor]}/>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddProductScreen;
