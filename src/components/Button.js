import React from 'react';
import { Button } from "react-native-paper";
import { Text } from 'react-native';


const DFButton = ({ onPress, title, loader }) => {
    return (
        <Button mode="contained" loading={loader} disabled={loader} onPress={onPress}>
            <Text>{title}</Text>
        </Button>
    );
};

export default DFButton;