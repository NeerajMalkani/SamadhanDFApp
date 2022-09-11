import React, { useEffect, useRef,useState } from "react";
import { ActivityIndicator, View, RefreshControl, LogBox, ScrollView,Text, Touchable, TouchableNativeFeedback } from "react-native";
import { FAB, List, Searchbar, Snackbar, TextInput, Title,HelperText,Button } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";

import { Styles } from "../../../../styles/styles";



const SearchNAdd = ({ navigation }) => {
    const [listData,setListData] = useState(
        Array(30).fill('').map((__, i) => ({key: `${i}`, text: 'item #${i}' }))
    );

    const closeRow = (rowMap,rowKey) =>{
            if (rowMap[rowKey]) {
                rowMap[rowKey].closeRow();
            }
        };
    const deleteRow = (rowMap,rowKey) =>{
        closeRow(rowMap, rowKey);
        const newData = [...listData]
        const prevIndex = listData.findIndex(item =>item.key === rowKey);
        newData.splice(prevIndex,1);
        setListData(newData);
    }
    const onRowDidOpen = rowKey =>{
        console.log("this row opened",rowKey);
    }
    const renderItems = data =>(
        <TouchableNativeFeedback
            onPress={()=>console.log("youtouchme")}
            style={[Styles.flexAlignCenter,{backgroundColor:"#ccc"},Styles.borderBottom1,Styles.flexJustifyCenter,Styles.height56]}
            underlayColor={"#AAA"}
         >
            <View>
                <Text>i am {data.item.text} in a SwipListView</Text>
            </View>
        </TouchableNativeFeedback>
    );
    const renderHiddenItem = (data,rowMap) =>(
        <View style={[Styles.flexAlignCenter,{backgroundColor:"#DDD"},Styles.flex1,Styles.flexRow,Styles.flexJustifyCenter]}>
            <Text style={[Styles.backgroundColorred]}>Left</Text>
            <TouchableNativeFeedback
                style={[Styles.flexAlignCenter,Styles.Bottom0,Styles.flexJustifyCenter,Styles.positionAbsolute,{top:0},Styles.width72,Styles.backgroundColorDarkGreen,Styles.Right75]}
                onPress={()=>closeRow(rowMap,data.item.key)}
            >
                <Text style={[Styles.textColorWhite]}>Close</Text>
            </TouchableNativeFeedback>

            <TouchableNativeFeedback
                style={[Styles.flexAlignCenter,Styles.Bottom0,Styles.flexJustifyCenter,Styles.positionAbsolute,{top:0},Styles.width72,Styles.backgroundColorred,Styles.Right0]}
                onPress={()=>deleteRow(rowMap,data.item.key)}
            >
                <Text style={[Styles.textColorWhite]}>Delete</Text>
            </TouchableNativeFeedback>
        </View>
    )
     return (
    <View style={[Styles.flex1]}>
        <ScrollView style={[Styles.flex1, Styles.backgroundColor, { marginBottom: 64 },Styles.borderred]} keyboardShouldPersistTaps="handled">
            <View style={[Styles.padding16]}>
                <TextInput label="Employee Aadhar No" style={{ backgroundColor: "white" }}/>
                <HelperText type="error" >Employee Aadhar no</HelperText>
                <TextInput label="Mobile No" style={{ backgroundColor: "white" }}/>
                <HelperText type="error" >Mobile No</HelperText>
                <TouchableNativeFeedback  style={[Styles.marginTop32,Styles.primaryBgColor,Styles.padding10,Styles.flexAlignCenter]}>
                     <Text style={[Styles.fontSize14,Styles.textColorWhite]}>SEARCH</Text> 
                    
                </TouchableNativeFeedback>
                <View style={[Styles.width100per,Styles.borderBottom2,Styles.borderBottom2,Styles.marginTop12]}>
                    <Text style={[Styles.fontSize20,Styles.fontBold,Styles.marginBottom4,Styles.primaryColor]}>Employee Search</Text>
                </View>
            </View>
            <View style={[Styles.padding16]}>
                <SwipeListView 
                    data={listData}
                    renderItem={renderItems}
                    renderHiddenItem={renderHiddenItem}
                    leftOpenValue={75}
                    rightOpenValue={-150}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    onRowDidOpen={onRowDidOpen}
                />
            </View>
            <View style={[Styles.flexJustifyCenter,Styles.flexAlignCenter]}>
                <Text style={[Styles.fontSize20,Styles.SpaceEvenly,Styles.flexRow]}>- - - - - - - - - - - - - - - - OR - - - - - - - - - - - - - - - - - </Text>
            </View>
            <View style={[Styles.padding16]}>
                <TextInput label="Employee Name" style={[Styles.marginBottom8]}/>
                <TextInput label="Mobile No"/>
            </View>
        </ScrollView>
    </View>
  );
};

export default SearchNAdd;
