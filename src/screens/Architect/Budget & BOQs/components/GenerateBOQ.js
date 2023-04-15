import { View, Text } from "react-native";
import React from "react";
import {
  Button,
  Dialog,
  Portal,
  RadioButton,
  Subheading,
} from "react-native-paper";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Provider from "../../../../api/Provider";
import { useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Styles } from "../../../../styles/styles";
let Sess_UserRefno = 0;
const GenerateBOQ = ({ open, setOpen, budget_refno, callback }) => {
  const [response, setResponse] = useState([]);
  const [boqtype_refno, setBOQ] = useState("1");
  const isFocused = useIsFocused();
  const fetchUser = async () => {
    const data = JSON.parse(await AsyncStorage.getItem("user"));
    Sess_UserRefno = data.UserID;
    fetchTypes();
  };

  const fetchTypes = () => {
    Provider.createDFArchitect(
      Provider.API_URLS.getboqtype_architect_boq_popup_generateform,
      { data: { Sess_UserRefno, budget_refno } }
    ).then((res) => setResponse(res.data.data));
  };
  useEffect(() => {
    if (isFocused) {
      fetchUser();
    }
  }, [isFocused]);

  const generateBOQ = () => {
    Provider.createDFArchitect(Provider.API_URLS.architect_boq_generate, {
      data: { Sess_UserRefno, budget_refno, boqtype_refno },
    })
      .then((res) => {
        setOpen(false);
        callback();
      })
      .catch((error) => console.log(error));
  };

  return (
    <Portal>
      <Dialog visible={open} dismissable={false}>
        <Dialog.Title>Generate BOQ</Dialog.Title>
        <Dialog.Content>
          <Subheading style={[Styles.marginBottom12]}>
            Select BOQ Type:
          </Subheading>
          <RadioButton.Group
            value={boqtype_refno}
            onValueChange={(value) => {
              setBOQ(value);
            }}
          >
            {response?.map((item, idx) => (
              <RadioButton.Item
                key={idx}
                position="leading"
                style={[Styles.paddingVertical2]}
                labelStyle={[Styles.textLeft, Styles.paddingStart4]}
                label={item.boqtype_name}
                value={item.boqtype_refno}
              />
            ))}
          </RadioButton.Group>
        </Dialog.Content>
        <Dialog.Actions style={[Styles.padding16]}>
          <Button
            mode="outlined"
            onPress={() => {
              setOpen(false);
            }}
          >
            Close
          </Button>
          <Button
            style={[Styles.marginStart12]}
            mode="contained"
            onPress={generateBOQ}
          >
            Confirm
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default GenerateBOQ;
