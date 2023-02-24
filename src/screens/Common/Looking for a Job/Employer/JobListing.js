import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { Styles } from "../../../../styles/styles";
import { Button, HelperText, List, Chip } from "react-native-paper";
import Dropdown from "../../../../components/Dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Jobs = () => {
  return (
    <View
      style={[
        Styles.padding10,
        Styles.border1,
        { position: "relative" },
        Styles.marginBottom16,
      ]}
    >
      <View style={[Styles.width100per, Styles.flexRow]}>
        <View
          style={[
            { width: 50, height: 50 },
            Styles.backgroundSecondaryLightColor,
            { marginRight: 15 },
          ]}
        >
          <Icon
            name="account"
            style={{ alignSelf: "center" }}
            color="#D5DBDF"
            size={50}
          />
        </View>
        <View style={[Styles.width70per]}>
          <Text
            style={{
              fontSize: 17,
            }}
          >
            Project Supervisor
          </Text>
          <Text>Diamond Frames Pvt Ltd</Text>
        </View>
      </View>
      <View style={[Styles.flexRow, Styles.marginTop16]}>
        <Chip style={{ width: "50%" }} mode="outlined">
          <Text style={{ fontSize: 12 }}>Min Experience: 3 years</Text>
        </Chip>

        <Chip style={{ width: "50%" }} mode="outlined">
          <Text style={{ fontSize: 12 }}>Salary: 40000/month</Text>
        </Chip>
      </View>
      <Text style={{ marginTop: 16 }}>Job Location:Mumbai</Text>
      <View style={{ marginBottom: 50 }} />
      <Text
        style={{ position: "absolute", bottom: 5, left: 200, color: "gray" }}
      >
        posted 5 days ago
      </Text>
    </View>
  );
};
const JobListing = () => {
  return (
    <View style={[Styles.flex1, Styles.backgroundColor]}>
      <ScrollView style={[Styles.flex1]} keyboardShouldPersistTaps="handled">
        <View style={[Styles.padding16]}>
          <List.Section>
            <Dropdown label="Designation" data={[]} />

            <Button mode="contained">Search</Button>
            <List.Accordion title="More Filters">
              <Dropdown label="State" data={[]} />
              <Dropdown label="City" data={[]} />
            </List.Accordion>
            <HelperText>
              Filling One Field is Mandatory to view Jobs{" "}
            </HelperText>
          </List.Section>
        </View>
        <View style={[Styles.padding16]}>
          <Jobs />
          <Jobs />
          <Jobs />
          <Jobs />
          <Jobs />
        </View>
      </ScrollView>
    </View>
  );
};

export default JobListing;

const styles = StyleSheet.create({});
