import { View, Text, Image, Platform } from "react-native";
import React from "react";
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  RadioButton,
  Subheading,
  TextInput,
} from "react-native-paper";
import { ScrollView } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";

import { Styles } from "../../../../styles/styles";
import { useState } from "react";
import { communication } from "../../../../utils/communication";
import Provider from "../../../../api/Provider";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/native";
import { AWSImagePath } from "../../../../utils/paths";
let Sess_UserRefno = 0;
let Sess_company_refno = 0;
let Sess_branch_refno = 0;
let Sess_CompanyAdmin_UserRefno = 0;
const ApproveModal = ({ open, setOpen, budget_refno, callback }) => {
  const [remarks, setRemarks] = useState("");
  const [response, setResponse] = useState([]);
  const [approvedThrough, setApprovedThrough] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({
    remarks: false,
    approved_through: false,
  });

  const [designImage, setDesignImage] = useState(null);
  const [image, setImage] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const isFocused = useIsFocused();
  const fetchUser = async () => {
    const data = JSON.parse(await AsyncStorage.getItem("user"));
    Sess_UserRefno = data.UserID;
    Sess_company_refno = data.Sess_company_refno;
    Sess_branch_refno = data.Sess_branch_refno;
    Sess_CompanyAdmin_UserRefno = data.Sess_CompanyAdmin_UserRefno;
    FetchData();
  };

  const FetchData = async (toPending, text) => {
    let params = {
      data: {
        Sess_UserRefno: Sess_UserRefno,
        Sess_company_refno: Sess_company_refno,
        Sess_branch_refno: Sess_branch_refno,
        Sess_CompanyAdmin_UserRefno: Sess_CompanyAdmin_UserRefno,
      },
    };
    try {
      const data = await Provider.getcontractordesignwise(params, () => {});
      setResponse(data.response);
    } catch (e) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, [isFocused]);

  const chooseFile = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.canceled) {
        console.log(result);
        const arrExt = result.assets[0].uri.split(".");
        const unique_id = uuid.v4();
        setDesignImage(
          AWSImagePath + unique_id + "." + arrExt[arrExt.length - 1]
        );

        setImage(result.assets[0].uri);
        setFilePath(result);
      }
    } catch (e) {
      console.log(e);
    }
  };
  console.log(approvedThrough);
  const ValidateEstimationStatus = () => {
    let isValid = true;

    if (remarks.length === 0) {
      isValid = false;
      setErrors((state) => ({ ...state, remarks: true }));
    }
    if (approvedThrough === "") {
      isValid = false;
      setErrors((state) => ({ ...state, approved_through: true }));
    }

    if (isValid) {
      const formdata = new FormData();
      formdata.append(
        "data",
        JSON.stringify({
          Sess_UserRefno,
          budget_refno,
          budget_remarks: remarks,
          reponse_refno: approvedThrough,
        })
      );
      formdata.append(
        "attach_approved_proof",
        JSON.stringify({
          name: "appimage1212.jpg",
          type: filePath.assets[0].type + "/*",
          uri: image,
        })
      );

      Provider.createDFArchitectWithHeader(
        Provider.API_URLS.architect_budget_finallytakeproject_update,
        formdata
      )
        .then((res) => {
          console.log(res.data);
          setOpen(false);
          callback();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };
  return (
    <Portal>
      <Dialog visible={open} dismissable={false}>
        <Dialog.Title>Estimation Status</Dialog.Title>
        <Dialog.Content>
          <ScrollView keyboardShouldPersistTaps="handled">
            <TextInput
              mode="outlined"
              dense
              style={[Styles.backgroundColor]}
              label="Remarks/Reason"
              value={remarks}
              onChangeText={(text) => {
                setRemarks(text);
                setErrors((state) => ({ ...state, remarks: false }));
              }}
              error={errors.remarks}
            />
            <HelperText type="error" visible={errors.remarks}>
              {communication.InvalidRemarks}
            </HelperText>
            <View>
              <Subheading style={[Styles.marginBottom12]}>
                Client Approved Through
              </Subheading>
              <RadioButton.Group
                onValueChange={(value) => {
                  setApprovedThrough(value);
                  setErrors((state) => ({ ...state, approved_through: false }));
                }}
                value={approvedThrough}
              >
                {response?.map((item, idx) => (
                  <RadioButton.Item
                    key={idx}
                    position="leading"
                    style={[Styles.paddingVertical2]}
                    labelStyle={[Styles.textLeft, Styles.paddingStart4]}
                    label={item.reponse_name}
                    value={item.reponse_refno}
                  />
                ))}
              </RadioButton.Group>
              <HelperText type="error" visible={errors.approved_through}>
                {communication.InvalidClientApprovedThrough}
              </HelperText>
            </View>

            <Subheading>Attach Client Approved Proof</Subheading>
            <View
              style={[Styles.flexRow, Styles.flexAlignEnd, Styles.marginTop16]}
            >
              <Image
                source={{ uri: image }}
                style={[Styles.width64, Styles.height64, Styles.border1]}
              />
              <Button mode="text" onPress={chooseFile}>
                {filePath !== null ? "Replace" : "Choose Image"}
              </Button>
            </View>
          </ScrollView>
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
            onPress={ValidateEstimationStatus}
          >
            Confirm
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ApproveModal;
