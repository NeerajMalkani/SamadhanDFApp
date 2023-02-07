import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { List, Searchbar } from "react-native-paper";
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
          item.phoneNumbers[0].number
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
        
        on={(query) => {
          setPhoneQuery(query);
        }}
        value={phonequery}
      />
      {filteredData.map((k, i) => {
        return (
          <List.Item
            key={i}
            title={k.name}
            description={k.phoneNumbers[0].number}
            onPress={() => {
              route.params.callback(k);
              navigation.goBack();
            }}
          />
        );
      })}
    </ScrollView>
  );
};

export default PhoneContactDirectUpload;
