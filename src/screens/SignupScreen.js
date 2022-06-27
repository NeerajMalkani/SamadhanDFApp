import { Headline, TextInput, HelperText, Button, Snackbar } from "react-native-paper";
import { ScrollView, View, Keyboard } from "react-native";
import { Styles } from "../styles/styles";
import React from "react";
import { communication } from "../utils/communication";
import { theme } from "../theme/apptheme";
import Provider from "../api/Provider";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ValidateFullName, ValidateMobile } from "../utils/validations";

const SignupScreen = ({ navigation }) => {
  const [snackbarText, setSnackbarText] = React.useState("");
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState("");

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

  const [isFullNameInvalid, setIsFullNameInvalid] = React.useState(false);
  const [fullName, setFullName] = React.useState("");

  const [isMobileNumberInvalid, setIsMobileNumberInvalid] = React.useState(false);
  const [mobileNumber, setMobileNumber] = React.useState("");

  const [isOTPInvalid, setIsOTPInvalid] = React.useState(false);
  const [otp1, setOTP1] = React.useState("");
  const [otp2, setOTP2] = React.useState("");
  const [otp3, setOTP3] = React.useState("");
  const [otp4, setOTP4] = React.useState("");

  const [otpButtonDisabled, setOTPButtonDisabled] = React.useState(false);

  const [isPasswordInvalid, setIsPasswordInvalid] = React.useState(false);
  const [password, setPassword] = React.useState("");

  const [isConfirmPasswordInvalid, setIsConfirmPasswordInvalid] = React.useState(false);
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const onFullNameChanged = (text) => {
    setFullName(text);
    setIsSnackbarVisible(false);
    if (text.length > 0) {
      setIsFullNameInvalid(false);
    }
  };

  const onMobileNumberChanged = (text) => {
    setMobileNumber(text);
    setIsSnackbarVisible(false);
    if (text.length > 0) {
      setIsMobileNumberInvalid(false);
    } else {
      setOTP1("");
      setOTP2("");
      setOTP3("");
      setOTP4("");
      setOTPButtonDisabled(false);
    }
  };

  const onOTP1Changed = (text) => {
    setOTP1(text);
    if (text.length > 0) {
      setIsOTPInvalid(false);
    }
  };
  const onOTP2Changed = (text) => {
    setOTP2(text);
    if (text.length > 0) {
      setIsOTPInvalid(false);
    }
  };
  const onOTP3Changed = (text) => {
    setOTP3(text);
    if (text.length > 0) {
      setIsOTPInvalid(false);
    }
  };
  const onOTP4Changed = (text) => {
    setOTP4(text);
    if (text.length > 0) {
      setIsOTPInvalid(false);
    }
  };

  const onPasswordChanged = (text) => {
    setPassword(text);
    setIsSnackbarVisible(false);
    if (text.length > 0) {
      setIsPasswordInvalid(false);
    }
  };

  const onConfirmPasswordChanged = (text) => {
    setConfirmPassword(text);
    setIsSnackbarVisible(false);
    if (text.length > 0) {
      setIsConfirmPasswordInvalid(false);
    }
  };

  const ValidateOTP = () => {
    if (mobileNumber.length === 0) {
      setIsMobileNumberInvalid(true);
      setIsOTPInvalid(true);
      setSnackbarText(communication.InvalidMobileBeforeOTP);
      setIsSnackbarVisible(true);
    } else {
      const random4Digits = Math.floor(1000 + Math.random() * 9000);
      setOTP1(random4Digits.toString().substring(0, 1));
      setOTP2(random4Digits.toString().substring(1, 2));
      setOTP3(random4Digits.toString().substring(2, 3));
      setOTP4(random4Digits.toString().substring(3, 4));
      setIsOTPInvalid(false);
      setOTPButtonDisabled(true);
      setIsSnackbarVisible(false);
    }
  };

  const StoreUserData = async (user) => {
    try {
      await AsyncStorage.setItem("isLogin", "true");
      await AsyncStorage.setItem("user", JSON.stringify(user));
      navigation.dispatch(StackActions.replace("HomeStack", "Signup"));
    } catch (error) {}
  };

  const InsertNewUser = () => {
    setIsButtonLoading(true);
    const params = {
      FullName: fullName,
      Password: password,
      RoleID: 2,
      OTP: parseInt(otp1 + otp2 + otp3 + otp4),
      IsVerified: true,
      IsActive: true,
      PhoneNumber: mobileNumber,
      Status: 1,
    };
    Provider.create("registration/insertuser", params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          const user = {
            UserID: response.data.data[0].userID,
            FullName: response.data.data[0].fullName,
            RoleID: response.data.data[0].roleID,
            RoleName: response.data.data[0].roleID == 1 ? "Admin" : "General User", //TBC
          };
          StoreUserData(user);
        } else {
          setSnackbarText(communication.NoData);
          setIsSnackbarVisible(true);
        }
        setIsButtonLoading(false);
      })
      .catch((e) => {
        setSnackbarText(e.message);
        setIsSnackbarVisible(true);
        setIsButtonLoading(false);
      });
  };

  const ValidateSignup = () => {
    Keyboard.dismiss();
    let isValid = true;
    if (fullName.length === 0 || !ValidateFullName(fullName)) {
      isValid = false;
      setIsFullNameInvalid(true);
    }
    if (mobileNumber.length === 0 || !ValidateMobile(mobileNumber)) {
      isValid = false;
      setIsMobileNumberInvalid(true);
    }
    if (otp1.length === 0 && otp2.length === 0 && otp3.length === 0 && otp4.length === 0) {
      isValid = false;
      setIsOTPInvalid(true);
    }
    if (password.length < 3) {
      isValid = false;
      setIsPasswordInvalid(true);
    }
    if (confirmPassword.length < 3) {
      isValid = false;
      setIsConfirmPasswordInvalid(true);
    }
    if (isValid) {
      if (password !== confirmPassword) {
        setIsConfirmPasswordInvalid(true);
        setSnackbarText(communication.InvalidPasswordsMatch);
        setIsSnackbarVisible(true);
      } else {
        InsertNewUser();
      }
    }
  };

  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding32, Styles.paddingTop0]}>
          <Headline style={[Styles.padding24, Styles.textCenter, Styles.fontBold]}>Create New Account</Headline>
          <TextInput mode="flat" dense label="Full Name" autoComplete="name" value={fullName} onChangeText={onFullNameChanged} error={isFullNameInvalid} />
          <HelperText type="error" visible={isFullNameInvalid}>
            {communication.InvalidFullname}
          </HelperText>
          <TextInput mode="flat" dense label="Mobile number" autoComplete="tel" keyboardType="phone-pad" value={mobileNumber} style={[Styles.marginTop8]} onChangeText={onMobileNumberChanged} error={isMobileNumberInvalid} />
          <HelperText type="error" visible={isMobileNumberInvalid}>
            {communication.InvalidMobileNumber}
          </HelperText>
          <View style={[Styles.flexRow, Styles.flexAlignCenter, Styles.paddingTop8]}>
            <TextInput mode="outlined" dense disabled value={otp1} onChangeText={onOTP1Changed} style={[Styles.width48, Styles.height48, Styles.textCenter]} />
            <TextInput mode="outlined" dense disabled value={otp2} onChangeText={onOTP2Changed} style={[Styles.width48, Styles.height48, Styles.textCenter, Styles.marginStart8]} />
            <TextInput mode="outlined" dense disabled value={otp3} onChangeText={onOTP3Changed} style={[Styles.width48, Styles.height48, Styles.textCenter, Styles.marginStart8]} />
            <TextInput mode="outlined" dense disabled value={otp4} onChangeText={onOTP4Changed} style={[Styles.width48, Styles.height48, Styles.textCenter, Styles.marginStart8]} />
            <Button mode="text" uppercase={false} disabled={otpButtonDisabled} style={[Styles.flexAlignEnd, Styles.flexGrow]} onPress={() => ValidateOTP()}>
              Get OTP
            </Button>
          </View>
          <HelperText type="error" visible={isOTPInvalid}>
            {communication.InvalidOTP}
          </HelperText>
          <TextInput mode="flat" dense secureTextEntry={true} label="Enter Password" value={password} style={[Styles.marginTop8]} onChangeText={onPasswordChanged} error={isPasswordInvalid} />
          <HelperText type="error" visible={isPasswordInvalid}>
            {communication.InvalidPassowrd}
          </HelperText>
          <TextInput mode="flat" dense secureTextEntry={true} label="Confirm Password" value={confirmPassword} style={[Styles.marginTop8]} onChangeText={onConfirmPasswordChanged} error={isConfirmPasswordInvalid} />
          <HelperText type="error" visible={isConfirmPasswordInvalid}>
            {communication.InvalidConfirmPassowrd}
          </HelperText>
          <Button mode="contained" style={[Styles.marginTop24]} loading={isButtonLoading} disabled={isButtonLoading} onPress={() => ValidateSignup()}>
            Submit
          </Button>
        </View>
      </ScrollView>
      <Snackbar visible={isSnackbarVisible} onDismiss={() => setIsSnackbarVisible(false)} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default SignupScreen;
