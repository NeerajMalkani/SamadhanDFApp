import { View, Image, ScrollView, Keyboard } from "react-native";
import { Button, Snackbar, TextInput, Title, HelperText, Text } from "react-native-paper";
import { Styles } from "../styles/styles";
import React from "react";
import { theme } from "../theme/apptheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions } from "@react-navigation/native";
import { communication } from "../utils/communication";
import Provider from "../api/Provider";

const LoginScreen = ({ navigation }) => {
  const [snackbarText, setSnackbarText] = React.useState("");
  const [isSnackbarVisible, setIsSnackbarVisible] = React.useState(false);
  const [isUsernameInvalid, setIsUsernameInvalid] = React.useState(false);
  const [isButtonLoading, setIsButtonLoading] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [isPasswordInvalid, setIsPasswordInvalid] = React.useState(false);
  const [password, setPassword] = React.useState("");

  const onUsernameChanged = (text) => {
    setUsername(text);
    setIsSnackbarVisible(false);
    if (text.length > 0) {
      setIsUsernameInvalid(false);
    }
  };

  const onPasswordChanged = (text) => {
    setPassword(text);
    setIsSnackbarVisible(false);
    if (text.length > 0) {
      setIsPasswordInvalid(false);
    }
  };

  StoreUserData = async (user) => {
    try {
      await AsyncStorage.setItem("isLogin", "true");
      await AsyncStorage.setItem("user", JSON.stringify(user));
      navigation.dispatch(StackActions.replace("HomeStack"));
    } catch (error) {}
  };

  const CheckLogin = () => {
    setIsButtonLoading(true);
    let params = {
      Username: username,
      Password: password,
    };
    Provider.getAll(`registration/login?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          const user = {
            UserID: response.data.data[0].userID,
            FullName: response.data.data[0].fullName,
            RoleID: response.data.data[0].roleID,
            RoleName: response.data.data[0].roleName,
          };
          StoreUserData(user, navigation);
        } else {
          setSnackbarText(communication.InvalidUserNotExists);
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

  const ValidateLogin = () => {
    Keyboard.dismiss();
    let isValid = true;
    if (username.length === 0) {
      isValid = false;
      setIsUsernameInvalid(true);
    }
    if (password.length < 3) {
      isValid = false;
      setIsPasswordInvalid(true);
    }
    if (isValid) {
      CheckLogin();
    }
  };

  const NewUser = () => {
    setUsername("");
    setPassword("");
    setIsUsernameInvalid(false);
    setIsPasswordInvalid(false);
    navigation.navigate("Signup");
  };

  const ForgotPassword = () => {
    setUsername("");
    setPassword("");
    setIsUsernameInvalid(false);
    setIsPasswordInvalid(false);
    navigation.navigate("ForgotPassword");
  };

  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding32, { paddingTop: 80 }]}>
          <Image source={require("../../assets/icon.png")} style={[Styles.width104, Styles.height104, Styles.flexAlignSelfCenter]} />
          <Title style={[Styles.padding24, Styles.textCenter]}>Login to continue</Title>
          <TextInput mode="flat" dense label="Username" autoComplete="username" value={username} onChangeText={onUsernameChanged} error={isUsernameInvalid} />
          <HelperText type="error" visible={isUsernameInvalid}>
            {communication.InvalidUsername}
          </HelperText>
          <TextInput mode="flat" dense secureTextEntry={true} label="Password" value={password} style={[Styles.marginTop8]} onChangeText={onPasswordChanged} error={isPasswordInvalid} />
          <HelperText type="error" visible={isPasswordInvalid}>
            {communication.InvalidPassowrd}
          </HelperText>
          <Button mode="text" uppercase={false} style={[Styles.flexAlignEnd, { marginTop: -12 }]} onPress={() => ForgotPassword()}>
            Forgot Password?
          </Button>
          <Button mode="contained" style={[Styles.marginTop16]} loading={isButtonLoading} disabled={isButtonLoading} onPress={() => ValidateLogin()}>
            Login
          </Button>
          <View>
            <View style={[Styles.marginTop32, Styles.marginHorizontal24, Styles.flexJustifyCenter, Styles.flexAlignCenter, Styles.borderBottom1]}></View>
            <View style={[Styles.flexAlignSelfCenter, Styles.flexAlignCenter, Styles.width32, Styles.backgroundColor, { marginTop: -10 }]}>
              <Text>OR</Text>
            </View>
            <Button mode="outlined" style={[Styles.marginTop24]} onPress={() => NewUser()}>
              New User
            </Button>
          </View>
        </View>
      </ScrollView>
      <Snackbar visible={isSnackbarVisible} onDismiss={() => setIsSnackbarVisible(false)} style={{ backgroundColor: theme.colors.error }}>
        {snackbarText}
      </Snackbar>
    </View>
  );
};

export default LoginScreen;
