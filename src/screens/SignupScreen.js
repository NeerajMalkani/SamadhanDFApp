import OTPInputView from "@twotalltotems/react-native-otp-input";
import { Permissions } from "expo";
import axios from "axios";
import { useEffect } from "react";
import { Button, View } from "react-native";
import base64 from "react-native-base64";
// import SmsRetriever from "react-native-sms-retriever";

const SignupScreen = () => {
  const sendsms = async () => {
    // try {
    //   const registered = await SmsRetriever.startSmsRetriever();
    //   if (registered) {
    //     SmsRetriever.addSmsListener((event) => {
    //       console.log(event.message);
    //       SmsRetriever.removeSmsListener();
    //     });
    //   }
    // } catch (error) {
    //   console.log(JSON.stringify(error));
    // }

    const params = {
      To: "+919821528550",
      MessagingServiceSid: "MG45fa0eacf6336b62639aa4aa5d47d01f",
      Body: "Your OTP is 513569",
    };

    const data = Object.keys(params)
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&");

    console.log(data);
    // => format=json&option=value

    const options = {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded", Authorization: "Basic " + base64.encode("AC00edd658ebb774c70df9682cae12401f:af7770254dbf2dfa77e1c5c276680bee") },
      data,
      url: "https://api.twilio.com/2010-04-01/Accounts/AC00edd658ebb774c70df9682cae12401f/Messages.json",
    };

    const response = await axios(options); // wrap in async function
    console.log(response);
  };

  return (
    <View>
      {/* <OTPInputView pinCount={6} autoFocusOnLoad onCodeFilled={(code) => {}} /> */}
      <Button title="Submit" onPress={() => sendsms()} />
    </View>
  );
};

export default SignupScreen;
