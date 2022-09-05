import React, { useRef } from "react";
import { Image, ScrollView, TouchableNativeFeedback, View } from "react-native";
import { Button, Dialog, HelperText, List, Portal, RadioButton, Searchbar, Snackbar, Subheading, Text, TextInput, Title } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../api/Provider";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { communication } from "../../../utils/communication";
import { RNS3 } from "react-native-aws3";
import * as ImagePicker from "expo-image-picker";
import { creds } from "../../../utils/credentials";
import uuid from "react-native-uuid";
import { AWSImagePath } from "../../../utils/paths";

const DesignApprovedTab = ({ fetchData, listData, listSearchData, navigation }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [popupVisible, setPopupVisible] = React.useState(false);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

  const [id, setID] = React.useState(0);
  const [clientID, setClientID] = React.useState(0);
  const [fullName, setFullName] = React.useState("");
  const [estimationNo, setEstimationNo] = React.useState("");
  const [serviceName, setServiceName] = React.useState("");
  const [categoryName, setCategoryName] = React.useState("");
  const [productName, setProductName] = React.useState("");
  const [designTypeName, setDesignTypeName] = React.useState("");
  const [designTypeImage, setDesignTypeImage] = React.useState("");
  const [designCode, setDesignCode] = React.useState("");
  const [totalSqFt, setTotalSqFt] = React.useState("");
  const [materialCost, setMaterialCost] = React.useState("");
  const [labourCost, setLabourCost] = React.useState("");

  const [estStatus, setEstStatus] = React.useState(0);
  const [value, setValue] = React.useState("");
  const [errorCAT, setErrorCAT] = React.useState(false);
  const [remarks, setRemarks] = React.useState("");
  const [errorR, setErrorR] = React.useState(false);

  const [designImage, setDesignImage] = React.useState("");
  const [image, setImage] = React.useState(AWSImagePath + "placeholder-image.png");
  const [filePath, setFilePath] = React.useState(null);

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const refRBSheet = useRef();

  const InsertEstimationStatusData = () => {
    const params = {
      UserEstimationID: id,
      Remarks: remarks,
      ApprovedThrough: parseInt(value),
      ApproveProof: designImage,
    };
    Provider.create("contractorquotationestimation/insertapprovedestimations", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          InsertDesignEstimationEnquiry();
        } else {
          setSnackbarText(communication.NoData);
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
      });
  };

  const InsertDesignEstimationEnquiry = () => {
    const params = {
      ID: id,
      ApprovalStatus: estStatus,
    };
    Provider.create("generaluserenquiryestimations/insertdesignestimateenquiries", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          setSnackbarText(estStatus === 1 ? communication.QuoteApproved : communication.QuoteRejected);
          setSnackbarColor(theme.colors.success);
          setSnackbarVisible(true);
          setPopupVisible(false);
          setTimeout(() => {
            fetchData();
          }, 600);
        } else {
          setSnackbarText(communication.NoData);
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
      });
  };

  const ValidateEstimationStatus = () => {
    let isValid = true;

    if (remarks.length === 0) {
      isValid = false;
      setErrorR(true);
    }
    if (value === "") {
      isValid = false;
      setErrorCAT(true);
    }

    if (isValid) {
      setValue("");
      setRemarks("");
      setErrorR(false);
      setErrorCAT(false);
      setDesignImage("");
      setImage(AWSImagePath + "placeholder-image.png");
      setFilePath(null);
      uploadFile();
    }
  };

  const onChangeRemarks = (text) => {
    setRemarks(text);
    setErrorR(false);
  };

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
    setClientID(data.clientID);
    setFullName(data.fullName);
    setEstimationNo("AUG" + pad(data.id.toString(), 4, "0"));
    setServiceName(data.serviceName);
    setCategoryName(data.categoryName);
    setProductName(data.productName);
    setDesignTypeName(data.designTypeName);
    setDesignTypeImage(data.designTypeImage);
    setDesignCode("DS-" + pad(data.designTypeID.toString(), 4, "0"));
    setTotalSqFt(CalculateSqFt(data));
    setMaterialCost(data.subtotalAmount.toFixed(4));
    setLabourCost(data.labourCost.toFixed(4));
  };

  const chooseFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      const arrExt = result.uri.split(".");
      const unique_id = uuid.v4();
      setDesignImage(AWSImagePath + unique_id + "." + arrExt[arrExt.length - 1]);
      setImage(result.uri);
      setFilePath(result);
    }
  };

  const uploadFile = () => {
    if (filePath && filePath.uri) {
      if (Object.keys(filePath).length == 0) {
        setSnackbarText(communication.NoImageSelectedError);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
        return;
      }
      RNS3.put(
        {
          uri: filePath.uri,
          name: designImage.split(AWSImagePath)[1],
          type: "image/*",
        },
        {
          keyPrefix: "",
          bucket: creds.awsBucket,
          region: creds.awsRegion,
          accessKey: creds.awsAccessKey,
          secretKey: creds.awsSecretKey,
          successActionStatus: 201,
        }
      )
        .progress((progress) => {
          setIsButtonLoading(true);
          setSnackbarText(`Uploading: ${progress.loaded / progress.total} (${progress.percent}%)`);
        })
        .then((response) => {
          setIsButtonLoading(false);
          if (response.status !== 201) {
            setSnackbarVisible(true);
            setSnackbarColor(theme.colors.error);
            setSnackbarText(communication.FailedUploadError);
          } else {
            InsertEstimationStatusData();
          }
        })
        .catch((ex) => {
          console.log(ex);
          setIsButtonLoading(false);
          setSnackbarVisible(true);
          setSnackbarColor(theme.colors.error);
          setSnackbarText(communication.FailedUploadError);
        });
    } else {
      InsertEstimationStatusData();
    }
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
          <View style={[Styles.flexRow, Styles.paddingHorizontal16, Styles.marginTop12]}>
            <Button
              mode="contained"
              onPress={() => {
                refRBSheet.current.close();
                setTimeout(() => {
                  navigation.navigate("GetEstimationScreen", {
                    userDesignEstimationID: id,
                    clientID: clientID,
                    isContractor: true,
                    designImage: designTypeImage,
                    fetchData: fetchData,
                    isUpdate: true,
                  });
                }, 300);
              }}
              labelStyle={[{ textTransform: "capitalize" }]}
              style={[Styles.yellowBgColor]}
              icon={() => <Icon name="pencil" size={18} color={theme.colors.textLight} />}
            >
              Edit
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                refRBSheet.current.close();
              }}
              labelStyle={[{ textTransform: "capitalize" }]}
              style={[Styles.marginStart4, Styles.greenBgColor]}
              icon={() => <Icon name="check-circle" size={18} color={theme.colors.textLight} />}
            >
              Take Project
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                setEstStatus(2);
                refRBSheet.current.close();
                setPopupVisible(true);
              }}
              labelStyle={[{ textTransform: "capitalize" }]}
              style={[Styles.marginStart4, Styles.redBgColor]}
              icon={() => <Icon name="cancel" size={18} color={theme.colors.textLight} />}
            >
              Reject
            </Button>
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
                    <Text style={[Styles.greenBgColor, Styles.textColorWhite, Styles.marginTop8, Styles.borderRadius4, Styles.paddingVertical4, Styles.paddingHorizontal12]}>Approved</Text>
                  </View>
                );
              }}
            />
          </ScrollView>
        </View>
      </RBSheet>
      <Portal>
        <Dialog visible={popupVisible} dismissable={false}>
          <Dialog.Title>Estimation Status</Dialog.Title>
          <Dialog.Content>
            <ScrollView keyboardShouldPersistTaps="handled">
              <TextInput mode="flat" dense style={[Styles.backgroundColor]} label="Remarks/Reason" value={remarks} onChangeText={onChangeRemarks} error={errorR} />
              <HelperText type="error" visible={errorR}>
                {communication.InvalidRemarks}
              </HelperText>
              <View>
                <Subheading style={[Styles.marginBottom12]}>Client Approved Through</Subheading>
                <RadioButton.Group
                  onValueChange={(value) => {
                    setValue(value);
                    setErrorCAT(false);
                  }}
                  value={value}
                >
                  <RadioButton.Item position="leading" color="white" style={[Styles.paddingVertical2]} labelStyle={[Styles.textLeft, Styles.paddingStart4]} label="Whatsapp" value="1" />
                  <RadioButton.Item position="leading" style={[Styles.paddingVertical2]} labelStyle={[Styles.textLeft, Styles.paddingStart4]} label="Email" value="2" />
                  <RadioButton.Item position="leading" style={[Styles.paddingVertical2]} labelStyle={[Styles.textLeft, Styles.paddingStart4]} label="SMS" value="3" />
                  <RadioButton.Item position="leading" style={[Styles.paddingVertical2]} labelStyle={[Styles.textLeft, Styles.paddingStart4]} label="Other" value="4" />
                  <RadioButton.Item position="leading" style={[Styles.paddingVertical2]} labelStyle={[Styles.textLeft, Styles.paddingStart4]} label="OwnApproved" value="5" />
                </RadioButton.Group>
                <HelperText type="error" visible={errorCAT}>
                  {communication.InvalidClientApprovedThrough}
                </HelperText>
              </View>

              <Subheading>Attach Client Approved Proof</Subheading>
              <View style={[Styles.flexRow, Styles.flexAlignEnd, Styles.marginTop16]}>
                <Image source={{ uri: image }} style={[Styles.width64, Styles.height64, Styles.border1]} />
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
            <Button style={[Styles.marginStart12]} loading={isButtonLoading} mode="contained" onPress={ValidateEstimationStatus}>
              Confirm
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default DesignApprovedTab;
