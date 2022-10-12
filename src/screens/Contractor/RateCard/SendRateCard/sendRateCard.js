import React from "react";
import {View,Text} from "react-native";
import Styles from "../../../../styles/styles";
import Header from "../../../../components/Header";
const SendRateCard = ({ navigation }) =>{
    const design = (
        <View >
            <Header navigation={navigation} title="Send RateCard" />
            
        </View>
    );
    return design;
}
export default SendRateCard;