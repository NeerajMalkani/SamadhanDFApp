import { View, Image } from "react-native";
import { Button, Card, Snackbar, TextInput } from "react-native-paper";
import { Styles } from "../styles/styles";
import React from "react";
import { theme } from "../theme/apptheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackActions } from "@react-navigation/native";

const LoginScreen = ({ navigation }) => {
  const [visible, setVisible] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [name, setName] = React.useState("");

  const [passwordError, setPasswordError] = React.useState(false);
  const [password, setPassword] = React.useState("");

  const onDismissSnackBar = () => setVisible(false);

  const onNameChanged = (text) => {
    setName(text);
    if (text.length === 0) {
      setError(true);
    } else {
      setError(false);
    }
  };

  const onPasswordChanged = (text) => {
    setPassword(text);
    if (text.length === 0) {
      setPasswordError(true);
    } else {
      setPasswordError(false);
    }
  };

  _storeData = async () => {
    try {
      await AsyncStorage.setItem("isLogin", "true");
    } catch (error) {
      // Error saving data
    }
  };

  const ValidateLogin = () => {
    let isValid = true;
    if (name.length === 0) {
      isValid = false;
      setError(true);
    }
    if (password.length === 0) {
      isValid = false;
      setPasswordError(true);
    }
    if (isValid) {
      if (name !== "admin" && password !== "admin@DF") {
        setVisible(true);
      } else {
        _storeData();
        navigation.dispatch(StackActions.replace("Home", "Login"));
      }
    }
  };

  return (
    <View style={[Styles.flex1, Styles.backgroundColor, Styles.padding16]}>
      <Card style={{ marginTop: 120, padding: 24 }}>
        <Card.Content>
          <Image source={require("../../assets/icon.png")} style={{ width: 96, height: 96, alignSelf: "center" }} />
          <TextInput mode="flat" label="Username " value={name} onChangeText={onNameChanged} style={{ backgroundColor: "white" }} error={error} />
          <TextInput mode="flat" secureTextEntry={true} label="Password " value={password} onChangeText={onPasswordChanged} style={{ backgroundColor: "white" }} error={passwordError} />
          <Button mode="contained" style={{ marginTop: 24 }} onPress={() => ValidateLogin()}>
            Login
          </Button>
        </Card.Content>
      </Card>
      <Snackbar visible={visible} onDismiss={onDismissSnackBar} style={{ backgroundColor: theme.colors.error }}>
        Username or password incorrect
      </Snackbar>
    </View>
  );
};

export default LoginScreen;
