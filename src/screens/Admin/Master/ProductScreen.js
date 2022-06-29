import React, { useEffect } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl } from "react-native";
import { FAB, List, Snackbar, Dialog, Portal, Button } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const ProductScreen = ({ navigation }) => {
    
};

export default ProductScreen;