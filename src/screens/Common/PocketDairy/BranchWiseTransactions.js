import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView, Image } from "react-native";
import { FAB, List, Snackbar, Searchbar, Title } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";
import { NullOrEmpty } from "../../../utils/validations";
import AsyncStorage from "@react-native-async-storage/async-storage";

let userID = 0;
LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);


const BranchWiseTransactionScreen = ({ route, navigation }) => {

};

export default BranchWiseTransactionScreen;