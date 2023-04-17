import { StyleSheet, Text, View, LogBox } from "react-native";
import React from "react";
import Provider from "../../api/Provider";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CreateSCCards from "../../components/SCCards";
import { Styles } from "../../styles/styles";
import { Modal, Portal, Button } from "react-native-paper";

let userID = null;
LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
const Design = ({ route, navigation }) => {
  const [modalOpen, setModalOpen] = useState(null);
  const [categories, setCategories] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(0);
  const isFocused = useIsFocused();
  const GetUserID = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData !== null) {
      userID = JSON.parse(userData).UserID;
      fetchCategories();
      fetchGroups();
    }
  };
  const goToForm = (workgiven) => {
    setModalOpen(false);
    navigation.navigate("DesignYourDreamForm", { selectedProperty, workgiven });
  };

  useEffect(() => {
    if (isFocused) {
      const getuser = async () => await GetUserID();
      getuser();
    }
  }, [isFocused]);

  const fetchGroups = () => {
    const params = {
      data: {
        Sess_UserRefno: userID,
        group_refno: "all",
      },
    };
    Provider.createDFCommon(
      Provider.API_URLS.getgroupname_designyourdream_enquiryform,
      params
    )
      .then((res) => {
        setGroups(res.data.data);
      })
      .catch((error) => console.log(error));
  };
  const fetchCategories = () => {
    const params = {
      data: {
        Sess_UserRefno: userID,
        propertytype_refno: "all",
      },
    };
    Provider.createDFCommon(
      Provider.API_URLS.getpropertytypename_designyourdream_enquiryform,
      params
    )
      .then((res) => {
        if (res.data.data) {
          setCategories(res.data.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <Portal>
        <Modal
          visible={modalOpen}
          contentContainerStyle={{
            backgroundColor: "white",
            padding: 20,
            width: "90%",
            alignSelf: "center",
          }}
          onDismiss={() => setModalOpen(false)}
        >
          <Text
            style={{
              fontWeight: "bold",
              textAlign: "center",
              fontSize: 20,
              marginBottom: 30,
            }}
          >
            Select Type
          </Text>
          {groups.map((obj) => (
            <Button
              mode="contained"
              key={obj.group_refno}
              onPress={() => goToForm(obj)}
              style={{ marginBottom: 15 }}
            >
              <Text>{obj.group_name}</Text>
            </Button>
          ))}
        </Modal>
      </Portal>

      <View
        style={[Styles.flexRow, Styles.paddingHorizontal16, Styles.flexWrap]}
      >
        {categories.map((obj) => {
          return (
            <View
              style={[Styles.width50per, Styles.padding4, Styles.paddingTop0]}
              key={obj.propertytype_refno}
            >
              <CreateSCCards
                image={obj.propertytype_image}
                title={obj.propertytype_name}
                cardClick={() => {
                  setSelectedProperty(obj);
                  setModalOpen(true);
                }}
                id={obj.propertytype_refno}
              />
            </View>
          );
        })}
      </View>
    </>
  );
};

export default Design;
