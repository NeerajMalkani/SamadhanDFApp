import React from "react";
import { ScrollView, View, Keyboard } from "react-native";
import { Button, Headline, HelperText, Snackbar, TextInput } from "react-native-paper";
import Provider from "../api/Provider";
import { Styles } from "../styles/styles";
import { theme } from "../theme/apptheme";
import { communication } from "../utils/communication";
import { ValidateMobile } from "../utils/validations";

const ForgotPassword = ({ navigation }) => {
  //#region Variables
  const [snackbarText, setSnackbarText] = React.useState("");
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState("");

  const [isButtonLoading, setIsButtonLoading] = React.useState(false);

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
  //#endregion 

  //#region Events
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
  //#endregion 

  //#region API calling
  const GETOTP = () => {
    setIsButtonLoading(true);
    const params = {
      data: {
        Mobileno: mobileNumber
      }
    };
    Provider.create(Provider.API_URLS.ForgotMobileNoCheck, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          let otp = response.data.data.OTP_No;

          setOTP1(otp.toString().substring(0, 1));
          setOTP2(otp.toString().substring(1, 2));
          setOTP3(otp.toString().substring(2, 3));
          setOTP4(otp.toString().substring(3, 4));
          setIsOTPInvalid(false);
          setOTPButtonDisabled(true);
          setIsSnackbarVisible(false);

        } else {
          setSnackbarText(communication.InvalidMobileNotExists);
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
  const VerifyUser = () => {
    setIsButtonLoading(true);
    const params = {
      data: {
        Mobileno: mobileNumber,
        otpno: parseInt(otp1 + otp2 + otp3 + otp4)
      }
    };
    Provider.create(Provider.API_URLS.ForgotPasswordCheck, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          UpdateUser(response.data.data.user_refno);
        } else {
          setSnackbarText(communication.InvalidMobileNotExists);
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
  const UpdateUser = (userid) => {
    setIsButtonLoading(true);
    const params = {
      data: {
        user_refno: userid,
        Mobileno: mobileNumber,
        auth: password,
        confirm_password: password
      }
    };
    Provider.create(Provider.API_URLS.AlterPasswordCheck, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          navigation.goBack();
        } else {
          setSnackbarText(communication.InvalidMobileNotExists);
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
  const ValidateForgotPassword = () => {
    Keyboard.dismiss();
    let isValid = true;
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
        VerifyUser();
      }
    }
  };
  //#endregion 

  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding32, Styles.paddingTop0]}>
          <Headline style={[Styles.padding24, Styles.textCenter, Styles.fontBold]}>Forgot Password</Headline>
          <TextInput mode="flat" dense label="Mobile number" autoComplete="tel" keyboardType="phone-pad" value={mobileNumber} style={[Styles.marginTop8]} onChangeText={onMobileNumberChanged} error={isMobileNumberInvalid} />
          <HelperText type="error" visible={isMobileNumberInvalid}>
            {communication.InvalidMobileNumber}
          </HelperText>
          <View style={[Styles.flexRow, Styles.flexAlignCenter, Styles.paddingTop8]}>
            <TextInput mode="outlined" dense disabled value={otp1} onChangeText={onOTP1Changed} style={[Styles.width48, Styles.height48, Styles.textCenter]} />
            <TextInput mode="outlined" dense disabled value={otp2} onChangeText={onOTP2Changed} style={[Styles.width48, Styles.height48, Styles.textCenter, Styles.marginStart8]} />
            <TextInput mode="outlined" dense disabled value={otp3} onChangeText={onOTP3Changed} style={[Styles.width48, Styles.height48, Styles.textCenter, Styles.marginStart8]} />
            <TextInput mode="outlined" dense disabled value={otp4} onChangeText={onOTP4Changed} style={[Styles.width48, Styles.height48, Styles.textCenter, Styles.marginStart8]} />
            <Button mode="text" uppercase={false} disabled={otpButtonDisabled} style={[Styles.flexAlignEnd, Styles.flexGrow]} onPress={() => GETOTP()}>
              Get OTP
            </Button>
          </View>
          <HelperText type="error" visible={isOTPInvalid}
            {communication.InvalidOTP}
          </HelperText>
          <TextInput mode="flat" dense secureTextEntry={true} label="New Password" value={password} style={[Styles.marginTop8]} onChangeText={onPasswordChanged} error={isPasswordInvalid} />
          <HelperText type="error" visible={isPasswordInvalid}>
            {communication.InvalidPassowrd}
          </HelperText>
          <TextInput mode="flat" dense secureTextEntry={true} label="Confirm Password" value={confirmPassword} style={[Styles.marginTop8]} onChangeText={onConfirmPasswordChanged} error={isConfirmPasswordInvalid} />
          <HelperText type="error" visible={isConfirmPasswordInvalid}>
            {communication.InvalidConfirmPassowrd}
          </HelperText>
          <Button mode="contained" style={[Styles.marginTop24]} loading={isButtonLoading} disabled={isButtonLoading} onPress={() => ValidateForgotPassword()}>
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

export default ForgotPassword;
