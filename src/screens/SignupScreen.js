import { Button, View } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

const SignupScreen = () => {
  const triggerNotifications = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You’ve got mail! 📬",
        body: "Here is the notification body",
      },
      trigger: { seconds: 1 },
    });
  };

  return (
    <View>
      <Button onPress={triggerNotifications} title="Trigger Local Notifications" color="#841584" accessibilityLabel="Trigger Local Notifications" />
    </View>
  );
};

export default SignupScreen;
