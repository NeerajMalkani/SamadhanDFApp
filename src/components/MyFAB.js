import React, { useState } from 'react';
import { FAB } from "react-native-paper";
import { Styles } from '../styles/styles';

const MyFAB = ({onPress}) => {
    return (
        <FAB
            style={[
                Styles.margin16,
                Styles.primaryBgColor,
                { position: 'absolute', right: 16, bottom: 16 },
            ]}
            icon='plus'
            onPress={onPress}
        />
    );
};

export default MyFAB;