import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { Styles } from "../../../styles/styles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { creds, projectVariables } from "../../../utils/credentials";
import { theme } from "../../../theme/apptheme";

export const PayableReceivableTransactionListItem = ({ current, type }) => {

    return (
        <>
            <View style={[Styles.width50per, Styles.flexColumn]}>
                <View style={[Styles.width100per, Styles.flexRow, Styles.flexJustifyStart, Styles.flexAlignStart,
                Styles.flexColumn]}>
                    <Text style={[Styles.textSecondaryColor, Styles.fontSize10]}>Trsansaction Date:</Text>
                    <Text>{current.item.pck_trans_date != null ? current.item.pck_trans_date : ""}</Text>
                </View>
                <View style={[Styles.width100per, Styles.flexRow, Styles.flexJustifyStart,
                Styles.flexAlignCenter, Styles.marginTop8, Styles.flexColumn, Styles.flexAlignStart]}>
                    <Text style={[Styles.textSecondaryColor, Styles.fontSize10]}>{type == "pay" ? "Receive From:" : "Pay To"}</Text>
                    <View style={[Styles.flexRow, Styles.flexAlignCenter]}>
                        <Icon name="account-box" size={14} color={theme.colors.textSecondaryColor} style={[Styles.marginEnd4]} />
                        {type == "pay" ? (
                            <Text style={[Styles.textSecondaryColor]}>{current.item.receivedfrom_name != null ? (current.item.receivedfrom_name) : ""} ({current.item.receivedfrom_mobileno != null ? (current.item.receivedfrom_mobileno) : ""}) </Text>
                        )
                            : (
                                <Text style={[Styles.textSecondaryColor]}>{current.item.paidto_name != null ? (current.item.paidto_name) : ""} ({current.item.paidto_mobileno != null ? (current.item.paidto_mobileno) : ""}) </Text>
                            )}

                    </View>
                </View>
            </View >
            <View style={[Styles.width50per, Styles.flexColumn, Styles.flexSpaceBetween]}>
                <View style={[Styles.width100per, Styles.flexRow, Styles.flexJustifyEnd, Styles.flexAlignCenter]}>
                    <Icon name="currency-inr" size={14} /><Text>{current.item.amount != null ? current.item.amount : ""}</Text>
                </View>
                {(type == "pay" && current.item.repayment_reminder_date != null && current.item.repayment_reminder_date != "") &&
                    <>
                        <View style={[Styles.width100per, Styles.flexAlignEnd]}>
                            <Text style={[Styles.textSecondaryColor, Styles.fontSize10]}>Re-Payment Date: </Text>
                            <Text style={[Styles.textRight]}>{(current.item.repayment_reminder_date != null && current.item.repayment_reminder_date != "") ? current.item.repayment_reminder_date : ""}</Text>

                        </View>
                    </>
                }
                {(type == "receive" && current.item.recurring_reminder_date != null && current.item.recurring_reminder_date != "") &&
                    <>
                        <View style={[Styles.width100per, Styles.flexAlignEnd]}>
                            <Text style={[Styles.textSecondaryColor, Styles.fontSize10]}>Recurring Date: </Text>
                            <Text style={[Styles.textRight]}>{(current.item.recurring_reminder_date != null && current.item.recurring_reminder_date != "") ? current.item.recurring_reminder_date : ""}</Text>

                        </View>
                    </>
                }

            </View>
        </>
    );
};