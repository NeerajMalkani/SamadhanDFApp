import { useState } from "react";
import { View, Text } from "react-native";
import { Subheading, Divider } from "react-native-paper";
import { Styles } from "../styles/styles";
import { theme } from "../theme/apptheme";

const AdminUserViewList = ({ data }) => {
    return (
        <View style={[Styles.bordergray, Styles.borderRadius4, Styles.flex1, Styles.padding8]}>
            <Subheading selectable={true}>{data.firstname} <Text style={[Styles.primaryColor]} selectable={true}>{data.mobile_no}</Text></Subheading>
            <Subheading style={[Styles.fontSize12, Styles.textSecondaryColor, { height: 20 }]}>Company Name</Subheading>
            <Text>{data.company_name}</Text>
            <Divider />
            <View style={[Styles.width100per, Styles.flexRow, Styles.flexSpaceBetween]}>
                <View style={[Styles.width50per]}>
                    <Subheading style={[Styles.fontSize12, Styles.textSecondaryColor, { height: 20 }]}>Department</Subheading>
                    <Text>{data.departmentname}</Text>
                </View>
                <View style={[Styles.width50per]}>
                    <Subheading style={[Styles.fontSize12, Styles.textSecondaryColor, { height: 20 }]}>Designation</Subheading>
                    <Text>{data.designationname}</Text>
                </View>
            </View>
            <Divider />
            <View style={[Styles.width100per, Styles.flexRow, Styles.flexSpaceBetween]}>
                <View style={[Styles.width50per]}>
                    <Subheading style={[Styles.fontSize12, Styles.textSecondaryColor, { height: 20 }]}>Username</Subheading>
                    <Text selectable={true}>{data.user_name}</Text>
                </View>
                <View style={[Styles.width50per]}>
                    <Subheading style={[Styles.fontSize12, Styles.textSecondaryColor, { height: 20 }]}>Password</Subheading>
                    <Text selectable={true}>{data.password}</Text>
                </View>
            </View>
        </View>
    );
};

export default AdminUserViewList;