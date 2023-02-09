import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { List, Searchbar, Text } from "react-native-paper";
import { Styles } from "../../../../../styles/styles";

const PhoneContactDirectUpload = ({ route, navigation }) => {
  const [phonequery, setPhoneQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    setFilteredData(
      route.params.phoneNumbers.filter((item) => {
        if (
          item.name
            .toString()
            .toLowerCase()
            .includes(phonequery.toLowerCase()) ||
          item.number
            .toString()
            .toLowerCase()
            .includes(phonequery.toLowerCase())
        ) {
          return true;
        } else {
          return false;
        }
      })
    );
  }, [route.params.phoneNumbers, phonequery]);

  return (
    <ScrollView style={[Styles.flex1]}>
      <Searchbar
        style={[Styles.margin16]}
        placeholder="Search Phone Book"

        onChangeText={(query) => {
          setPhoneQuery(query);
        }}
        value={phonequery}
      />
      {filteredData.map((k, i) => {
        return (
          <View style={[Styles.padding4]} >
            <View style={[Styles.bordergray, Styles.borderRadius4, Styles.backgroundColorWhite, { elevation: 3 }]}>
              <List.Item
                key={i}
                title={k.name}
                description={k.number}
                onPress={() => {
                  route.params.callback(k);
                  navigation.goBack();
                }}
              />
              {k.Is_SamadhanUser == 1 ? (
                <View style={[Styles.positionAbsolute, Styles.bordergreen, Styles.borderRadius4, Styles.paddingVertical0, Styles.paddingHorizontal2, { top: 12, right: 16 }]}>
                  <Text style={[Styles.primaryColor, Styles.fontSize11, { fontStyle: "italic" }]}>Samadhan User</Text>
                </View>
              ) : (
                <View style={[Styles.positionAbsolute, Styles.borderred, Styles.borderRadius4, Styles.paddingVertical0, Styles.paddingHorizontal2, { top: 12, right: 16 }]}>
                  <Text style={[Styles.errorColor, Styles.fontSize11, { fontStyle: "italic" }]}>Non-Samadhan User</Text>
                </View>
              )

              }

              {1 == 1 &&
                <View style={[Styles.positionAbsolute, Styles.bordergreen, Styles.borderRadius4, Styles.paddingVertical0, Styles.paddingHorizontal2, { bottom: 12, right: 16 }]}>
                  <Text style={[Styles.primaryColor, Styles.fontSize11, { fontStyle: "italic" }]}>{k.Is_MyContactList}</Text>
                </View>


              }


            </View>

          </View>

        );
      })}
    </ScrollView>
  );
};

export default PhoneContactDirectUpload;
