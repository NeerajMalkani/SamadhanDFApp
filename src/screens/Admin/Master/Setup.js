import React, { useEffect, useRef } from "react";
import { ActivityIndicator, View, LogBox, RefreshControl, ScrollView } from "react-native";
import { FAB, List, Searchbar, Snackbar, Title } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import RBSheet from "react-native-raw-bottom-sheet";
import Provider from "../../../api/Provider";
import Header from "../../../components/Header";
import { RenderHiddenItems } from "../../../components/ListActions";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import NoItems from "../../../components/NoItems";
import { Styles } from "../../../styles/styles";
import { theme } from "../../../theme/apptheme";

LogBox.ignoreLogs(["Non-serializable values were found in the navigation state"]);

const SetupScreen = ({ navigation }) => {
    //#region Variables
    const [searchQuery, setSearchQuery] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(true);
    const listData = React.useState([]);
    const listSearchData = React.useState([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState("");
    const [snackbarColor, setSnackbarColor] = React.useState(theme.colors.success);

    const [variableName, setVariableName] = React.useState("");
    const [variableValue, setVariableValue] = React.useState("");
    const [description, setDescription] = React.useState("");

    const refRBSheet = useRef();

    //#endregion

    //#region Functions

    const FetchData = (from) => {
        if (from === "add" || from === "update") {
            setSnackbarText("Item " + (from === "add" ? "added" : "updated") + " successfully");
            setSnackbarColor(theme.colors.success);
            setSnackbarVisible(true);
        }
        let params = {
            data: {
                Sess_UserRefno: "2",
                option_id: "all",
            },
        };
        Provider.createDFAdmin(Provider.API_URLS.setupoptionidcheck, params)
            .then((response) => {
                if (response.data && response.data.code === 200) {
                    if (response.data.data) {
                        const lisData = [...response.data.data];
                        lisData.map((k, i) => {
                            k.key = (parseInt(i) + 1).toString();
                        });
                        listData[1](response.data.data);
                        listSearchData[1](response.data.data);
                    }
                } else {
                    listData[1]([]);

                }
                setIsLoading(false);
                setRefreshing(false);
            })
            .catch((e) => {
                setIsLoading(false);
                setSnackbarText(e.message);
                setSnackbarColor(theme.colors.error);
                setSnackbarVisible(true);
                setRefreshing(false);
            });
    };

    useEffect(() => {
        FetchData();
    }, []);

    const onChangeSearch = (query) => {
        setSearchQuery(query);
        if (query === "") {
            listSearchData[1](listData[0]);
        } else {
            listSearchData[1](
                listData[0].filter((el) => {
                    return el.state_name.toString().toLowerCase().includes(query.toLowerCase());
                })
            );
        }
    };

    const RenderItems = (data) => {
        return (
            <View style={[Styles.backgroundColor, Styles.borderBottom1, Styles.paddingStart16, Styles.flexJustifyCenter, { height: 72 }]}>
                <List.Item
                    title={data.item.option_name}
                    titleStyle={{ fontSize: 18 }}
                    description={"Value: " + data.item.option_value}
                    left={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="newspaper-variant" />}
                    onPress={() => {
                        refRBSheet.current.open();
                        setVariableName(data.item.option_name);
                        setVariableValue(data.item.option_value);
                        setDescription(data.item.option_desc);
                    }}
                    right={() => <Icon style={{ marginVertical: 12, marginRight: 12 }} size={30} color={theme.colors.textSecondary} name="eye" />}
                />
            </View>
        );
    };

    const EditCallback = (data, rowMap) => {
        rowMap[data.item.key].closeRow();
        navigation.navigate("AddSetupScreen", {
            type: "edit",
            fetchData: FetchData,
            data: {
                id: data.item.option_id,
                option_name: data.item.option_name,
                option_value: data.item.option_value,
                option_desc: data.item.option_desc,
            },
        });
    };
    //#endregion

    return (
        <View style={[Styles.flex1]}>
            <Header navigation={navigation} title="Setup" />
            {isLoading ? (
                <View style={[Styles.flex1, Styles.flexJustifyCenter, Styles.flexAlignCenter]}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : listData[0].length > 0 ? (
                <View style={[Styles.flex1, Styles.flexColumn, Styles.backgroundColor]}>
                    <Searchbar style={[Styles.margin16]} placeholder="Search" onChangeText={onChangeSearch} value={searchQuery} />
                    <SwipeListView
                        previewDuration={1000}
                        previewOpenValue={-72}
                        previewRowKey="1"
                        previewOpenDelay={1000}
                        refreshControl={
                            <RefreshControl
                                colors={[theme.colors.primary]}
                                refreshing={refreshing}
                                onRefresh={() => {
                                    FetchData();
                                }}
                            />
                        }
                        data={listSearchData[0]}
                        useFlatList={true}
                        disableRightSwipe={true}
                        rightOpenValue={-72}
                        renderItem={(data) => RenderItems(data)}
                        renderHiddenItem={(data, rowMap) => RenderHiddenItems(data, rowMap, [EditCallback])}
                    />
                </View>
            ) : (
                <NoItems icon="format-list-bulleted" text="No records found. Add records by clicking on plus icon." />
            )}
            
            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000} style={{ backgroundColor: snackbarColor }}>
                {snackbarText}
            </Snackbar>
            <RBSheet ref={refRBSheet} closeOnDragDown={true} closeOnPressMask={true} dragFromTopOnly={true} height={260} animationType="fade" customStyles={{ wrapper: { backgroundColor: "rgba(0,0,0,0.5)" }, draggableIcon: { backgroundColor: "#000" } }}>
                <View>
                    <Title style={[Styles.paddingHorizontal16]}>{variableName}</Title>
                    <ScrollView>
                        <List.Item title="Value" description={variableValue} />
                        <List.Item title="Description" description={description} />
                    </ScrollView>
                </View>
            </RBSheet>
        </View>
    );
};

export default SetupScreen;
