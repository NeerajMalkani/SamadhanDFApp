import { ScrollView, View } from "react-native";
import { Styles } from "../../../../styles/styles";
import DropDownPicker from "react-native-dropdown-picker";
import { useEffect, useState } from "react";
import Provider from "../../../../api/Provider";
import { Badge } from "react-native-paper";

const AddLocationTypeScreen = () => {
  const [activitySelectOpen, setActivitySelectOpen] = useState(false);
  const [activitySelectedValue, setActivitySelectedValue] = useState(null);
  const [activities, setActivities] = useState([]);

  const [serviceSelectOpen, setServiceSelectOpen] = useState(false);
  const [serviceSelectedValue, setServiceSelectedValue] = useState(null);

  const FetchActivities = () => {
    Provider.getAll("master/getactivityroles")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            let listData = [];
            response.data.data.map((k) => {
              listData.push({
                value: k.id,
                label: k.activityRoleName,
              });
            });
            setActivities(listData);
          }
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    FetchActivities();
  }, []);

  const onActivityChanged = (selectedItems) => {
    setSelectedActivities(selectedItems);
  };

  return (
    <View style={[Styles.flex1]}>
      {/* <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled" nestedScrollEnabled={true}> */}
      <View style={[Styles.padding16]}>
        <DropDownPicker mode="BADGE" searchable={true} open={activitySelectOpen} value={activitySelectedValue} items={activities} setOpen={setActivitySelectOpen} setValue={setActivitySelectedValue} setItems={setActivities} />
      </View>
      {/* </ScrollView> */}
    </View>
  );
};

export default AddLocationTypeScreen;
