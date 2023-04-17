import { View, Text } from "react-native";
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
import { Styles } from "../../../../styles/styles";

const ApproveModal = () => {
  return (
    <Portal>
      <Dialog visible={popupVisible} dismissable={false}>
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
                setErrorR(false);
              }}
              error={errorR}
            />
            <HelperText type="error" visible={errorR}>
              {communication.InvalidRemarks}
            </HelperText>
            <View>
              <Subheading style={[Styles.marginBottom12]}>
                Client Approved Through
              </Subheading>
              <RadioButton.Group
                onValueChange={(value) => {
                  setValue(value);
                  setErrorCAT(false);
                }}
                value={value}
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
              <HelperText type="error" visible={errorCAT}>
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
              setPopupVisible(false);
              setValue("");
              setRemarks("");
              setErrorR(false);
              setErrorCAT(false);
              setDesignImage("");
              setImage(AWSImagePath + "placeholder-image.png");
              setFilePath(null);
            }}
          >
            Close
          </Button>
          <Button
            style={[Styles.marginStart12]}
            loading={isButtonLoading}
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
