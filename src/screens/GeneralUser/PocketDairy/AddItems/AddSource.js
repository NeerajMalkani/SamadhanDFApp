import React, { useEffect, useRef ,useState} from "react";
import { ScrollView,Image, View } from "react-native";
import { Button, Card, Checkbox, HelperText, Snackbar, Subheading, Text, TextInput } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import { Styles } from "../../../../styles/styles";
import { theme } from "../../../../theme/apptheme";
import { communication } from "../../../../utils/communication";
import { DateTimePicker } from "@hashiprobr/react-native-paper-datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { AWSImagePath } from "../../../../utils/paths";

const AddSource = ({ route, navigation }) => {

  //#region Variables

  const [date, setDate] = useState(new Date());
  const [dateInvalid, setDateInvalid] = useState("");
  const dateRef = useRef({});

  const [entryTypeNameData, setEntryTypeNameData] = React.useState([]);
  const [entryTypeName, setEntryTypeName] = React.useState([]);
  //   const [entryTypeName, setEntryTypeName] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [errorET, setETError] = React.useState(false);

 
  const [categoryNameData, setCategoryNameData] = React.useState([]);
  const [categoryName, setCategoryName] = React.useState([]);
  //   const [categoryName, setCategoryName] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [errorCN, setCNError] = React.useState(false);

  const [subCategoryNameData, setSubCategoryNameData] = React.useState([]);
  const [subCategoryName, setSubCategoryName] = React.useState([]);
  //   const [subCategoryName, setSubCategoryName] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [errorSCN, setSCNError] = React.useState(false);

  const [payModeData, setpayModeData] = React.useState([]);
  const [payMode, setPayMode] = React.useState([]);
  //   const [payMode, setPayMode] = React.useState(route.params.type === "edit" ? route.params.data.activityRoleName : "");
  const [errorPM, setPMError] = React.useState(false);

  const [amountError, setAmountError] = React.useState(false);
  const [amount, settAmount] = React.useState(route.params.type === "edit" ? route.params.data.amount : "");

  const [notesError, setNotesError] = React.useState(false);
  const [notes, setNotes] = React.useState(route.params.type === "edit" ? route.params.data.notes : "");

  const [logoImage, setLogoImage] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [image, setImage] = useState(AWSImagePath + "placeholder-image.png");
  const [filePath, setFilePath] = useState(null);
  const [errorLogo, setLogoError] = useState(false);

  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarText, setSnackbarText] = React.useState("");
  const [checked, setChecked] = React.useState(route.params.type === "edit" ? route.params.data.display : true);
  const ref_input2 = useRef();
  const ref_input3 = useRef();
  //#endregion 

  //#region Functions
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
      .catch((e) => { });
  };

  const FetchServices = () => {
    Provider.getAll("master/getservices")
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
      .catch((e) => { });
  };

  const FetchUnitOfSales = () => {
    Provider.getAll("master/getunitofsales")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            let allUnits = "";
            if (route.params.type === "edit") {
              const arrunitOfSalesNameNew = [];
              unitOfSalesName.split(",").map((o) => {
                const objTemp = response.data.data.find((el) => {
                  return o.trim() === el.displayUnit;
                });
                if (objTemp) {
                  arrunitOfSalesNameNew.push(objTemp.id);
                }
              });
              allUnits = arrunitOfSalesNameNew.length > 0 ? arrunitOfSalesNameNew.join(",") : "";
            }
            const unitofsales = response.data.data.map((o) => ({
              ...o,
              isChecked: allUnits !== "" ? allUnits.split(",").indexOf(o.id.toString()) !== -1 : false,
            }));

            setUnitOfSalesData(unitofsales);
          }
        }
      })
      .catch((e) => { });
  };

  useEffect(() => {
    FetchActvityRoles();
    FetchServices();
    FetchUnitOfSales();
  }, []);

  const onEntryTypeName = (selectedItem) => {
    setEntryTypeName(selectedItem);
    setETError(false);
  };

  const onCategoryNameChanged = (selectedItem) => {
    setCNError(selectedItem);
    setCNError(false);
  };

  const onSubCategoryNameChanged = (text) => {
    setSubCategoryName(text);
    setSCNError(false);
  };

  const onPayModeChanged = (text) => {
    setPayMode(text);
    setPMError(false);
  };

  const onAmount = (text) => {
    setAmount(text);
    setAmountError(false);
  };

  const onNotes = (text) => {
    setNotes(text);
    notesError(false);
  };

  const InsertData = () => {
    let arrunitOfSalesName = [];
    unitOfSalesData.map((o) => {
      if (o.isChecked) {
        arrunitOfSalesName.push(o.id);
      }
    });
    Provider.create("master/insertcategory", {
      CategoryName: name,
      RoleID: activityFullData.find((el) => {
        return el.activityRoleName === acivityName;
      }).id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      HSNSACCode: hsn,
      GSTRate: parseFloat(gst),
      UnitID: arrunitOfSalesName.join(","),
      Display: checked,
    })
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("add");
          navigation.goBack();
        } else if (response.data.code === 304) {
          setSnackbarText(communication.AlreadyExists);
          setSnackbarVisible(true);
        } else {
          setSnackbarText(communication.InsertError);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const UpdateData = () => {
    let arrunitOfSalesName = [];
    unitOfSalesData.map((o) => {
      if (o.isChecked) {
        arrunitOfSalesName.push(o.id);
      }
    });
    const params = {
      ID: route.params.data.id,
      CategoryName: name,
      RoleID: activityFullData.find((el) => {
        return el.activityRoleName === acivityName;
      }).id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      HSNSACCode: hsn,
      GSTRate: parseFloat(gst),
      UnitID: arrunitOfSalesName.join(","),
      Display: checked,
    };
    Provider.create("master/updatecategory", {
      ID: route.params.data.id,
      CategoryName: name,
      RoleID: activityFullData.find((el) => {
        return el.activityRoleName === acivityName;
      }).id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      HSNSACCode: hsn,
      GSTRate: parseFloat(gst),
      UnitID: arrunitOfSalesName.join(","),
      Display: checked,
    })
      .then((response) => {
        if (response.data && response.data.code === 200) {
          route.params.fetchData("update");
          navigation.goBack();
        } else if (response.data.code === 304) {
          setSnackbarText(communication.AlreadyExists);
          setSnackbarVisible(true);
        } else {
          setSnackbarText(communication.UpdateError);
          setSnackbarVisible(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setSnackbarText(communication.NetworkError);
        setSnackbarVisible(true);
      });
  };

  const ValidateData = () => {
    let isValid = true;
    if (name.length === 0) {
      setError(true);
      isValid = false;
    }
    const objActivities = activityFullData.find((el) => {
      return el.activityRoleName && el.activityRoleName === acivityName;
    });
    if (acivityName.length === 0 || !objActivities) {
      setANError(true);
      isValid = false;
    }
    const objServices = servicesFullData.find((el) => {
      return el.serviceName && el.serviceName === serviceName;
    });
    if (serviceName.length === 0 || !objServices) {
      setSNError(true);
      isValid = false;
    }
    if (hsn.length === 0) {
      setHSNError(true);
      isValid = false;
    }
    if (gst.length === 0) {
      setGSTError(true);
      isValid = false;
    }
    const objUnitOfSales = unitOfSalesData.find((el) => {
      return el.isChecked;
    });
    if (!objUnitOfSales) {
      setUNError(true);
      isValid = false;
    }
    if (isValid) {
      if (route.params.type === "edit") {
        UpdateData();
      } else {
        InsertData();
      }
    }
  };

  const chooseFile = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setLogoError(false);
      const arrExt = result.uri.split(".");
      const unique_id = uuid.v4();
      setLogoImage(AWSImagePath + unique_id + "." + arrExt[arrExt.length - 1]);
      setImage(result.uri);
      setFilePath(result);
      setIsImageReplaced(true);
    }
  };

  const uploadFile = () => {
    if (!isImageReplaced) {
      UpdateData();
    } else {
      if (filePath.uri) {
        if (Object.keys(filePath).length == 0) {
          setSnackbarText(communication.NoImageSelectedError);
          setSnackbarColor(theme.colors.error);
          setSnackbarVisible(true);
          return;
        }
        RNS3.put(
          {
            uri: filePath.uri,
            name: logoImage.split(AWSImagePath)[1],
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
              UpdateData();
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
        setSnackbarText(communication.NoImageSelectedError);
        setSnackbarColor(theme.colors.error);
        setSnackbarVisible(true);
      }
    }
  };
  //#endregion 

  return (
    <View style={[Styles.flex1]}>
      <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 }]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <View>
            <DateTimePicker style={Styles.backgroundColorWhite} label="Date" type="date" value={date} onChangeDate={setDate} />
          </View>

          <Dropdown label="Entry Type Name" data={entryTypeNameData} onSelected={onEntryTypeName} isError={errorET} selectedItem={entryTypeName} />
          <HelperText type="error" visible={errorET}>
            {communication.InvalidModeTypeName}
          </HelperText>

          <Dropdown label="Category Name" data={categoryNameData} onSelected={onCategoryNameChanged} isError={errorCN} selectedItem={categoryName} />
          <HelperText type="error" visible={errorCN}>
            {communication.InvalidCategoryName}
          </HelperText>

          <Dropdown label="Sub Category Name" data={subCategoryNameData} onSelected={onSubCategoryNameChanged} isError={errorSCN} selectedItem={subCategoryName} />
          <HelperText type="error" visible={errorSCN}>
            {communication.InvalidSubCategoryName}
          </HelperText>

          <Dropdown label="Pay Mode" data={payModeData} onSelected={onPayModeChanged} isError={errorPM} selectedItem={payMode} />
          <HelperText type="error" visible={errorPM}>
            {communication.InvalidSubCategoryName}
          </HelperText>


          <TextInput mode="flat" label="Amount" value={amount} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onAmount} style={{ backgroundColor: "white" }} error={amountError} />
          <HelperText type="error" visible={amountError}>
            {communication.InvalidBudgetAmount}
          </HelperText>

          <TextInput mode="flat" label="Notes" value={notes} returnKeyType="next" onSubmitEditing={() => ref_input2.current.focus()} onChangeText={onNotes} style={{ backgroundColor: "white" }} error={notesError} />
          <HelperText type="error" visible={notesError}>
            {communication.InvalidBudgetAmount}
          </HelperText>

          <View style={[Styles.flexRow, Styles.flexAlignEnd, Styles.marginTop16]}>
              <Image source={{ uri: image }} style={[Styles.width104, Styles.height96, Styles.border1]} />
              <Button mode="text" onPress={chooseFile}>
                {filePath !== null ? "Replace" : "Choose Image"}
              </Button>
            </View>
            <HelperText type="error" visible={errorLogo}>
              {communication.InvalidDesignImage}
            </HelperText>

          <View style={{ width: 160 }}>
            <Checkbox.Item
              label="Display"
              color={theme.colors.primary}
              position="leading"
              labelStyle={{ textAlign: "left", paddingLeft: 8 }}
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          </View>

        </View>
      </ScrollView>
      <View style={[Styles.backgroundColor, Styles.width100per, Styles.marginTop32, Styles.padding16, { position: "absolute", bottom: 0, elevation: 3 }]}>
        <Card.Content>
          <Button mode="contained" onPress={ValidateData}>
            Submit
          </Button>
        </Card.Content>
      </View>
      <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default AddSource;
