import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { Checkbox, Title } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import NoItems from "../../../../components/NoItems";
import { Styles } from "../../../../styles/styles";

const AddMaterialSetupProducts = ({ arrProductData }) => {
  //#region Variables

  const [activityFullData, setActivityFullData] = React.useState([]);

  const [servicesFullData, setServicesFullData] = React.useState([]);
  const [servicesData, setServicesData] = React.useState([]);
  const [serviceName, setServiceName] = React.useState("");
  const servicesDDRef = useRef({});

  const [categoriesFullData, setCategoriesFullData] = React.useState([]);
  const [categoriesData, setCategoriesData] = React.useState([]);
  const [categoriesName, setCategoriesName] = React.useState("");
  const categoriesDDRef = useRef({});

  const [productsFullData, setProductsFullData] = React.useState([]);
 //#endregion 

 //#region Functions

  const FetchActvityRoles = () => {
    Provider.getAll("master/getmainactivities")
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display && el.activityRoleName === "Dealer";
            });
            setActivityFullData(response.data.data);
            servicesDDRef.current.reset();
            setServiceName("");
            setCategoriesName("");
            setCategoriesData([]);
            setServicesData([]);
            setProductsFullData([]);
            FetchServicesFromActivity("Dealer", response.data.data);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchServicesFromActivity = (selectedItem, activityData) => {
    let params = {
      ID: activityData.find((el) => {
        return el.activityRoleName === selectedItem;
      }).id,
    };
    Provider.getAll(`master/getservicesbyroleid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setServicesFullData(response.data.data);
            const services = response.data.data.map((data) => data.serviceName);
            setServicesData(services);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchCategoriesFromServices = (selectedItem) => {
    let params = {
      ActivityID: activityFullData.find((el) => {
        return el.activityRoleName === "Dealer";
      }).id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === selectedItem;
      }).id,
    };
    Provider.getAll(`master/getcategoriesbyserviceid?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            setCategoriesFullData(response.data.data);
            const categories = response.data.data.map((data) => data.categoryName);
            setCategoriesData(categories);
          }
        }
      })
      .catch((e) => {});
  };

  const FetchProductsFromCategory = (selectedItem) => {
    let params = {
      ActivityID: activityFullData.find((el) => {
        return el.activityRoleName === "Dealer";
      }).id,
      ServiceID: servicesFullData.find((el) => {
        return el.serviceName === serviceName;
      }).id,
      CategoryID: categoriesFullData.find((el) => {
        return el.categoryName === selectedItem;
      }).id,
    };
    Provider.getAll(`master/getproductsbycategoryidforbrands?${new URLSearchParams(params)}`)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = response.data.data.filter((el) => {
              return el.display;
            });
            const fullData = response.data.data.map((o) => ({
              ...o,
              isChecked: arrProductData[0].find((el) => {
                return el.productID === o.productID;
              })
                ? true
                : false,
            }));
            setProductsFullData(fullData);
          }
        }
      })
      .catch((e) => {});
  };

  useEffect(() => {
    FetchActvityRoles();
  }, []);

  const onServiceNameSelected = (selectedItem) => {
    setServiceName(selectedItem);
    categoriesDDRef.current.reset();
    setCategoriesData([]);
    setProductsFullData([]);
    setCategoriesName("");
    FetchCategoriesFromServices(selectedItem);
  };

  const onCategoriesNameSelected = (selectedItem) => {
    setCategoriesName(selectedItem);
    setProductsFullData([]);
    FetchProductsFromCategory(selectedItem);
  };
 //#endregion 

  return (
    <View style={[Styles.flex1]}>
      <View style={[Styles.flexRow, Styles.padding16]}>
        <View style={[Styles.paddingStart0, Styles.paddingEnd8, Styles.flex1]}>
          <Dropdown label="Service Name" data={servicesData} onSelected={onServiceNameSelected} selectedItem={serviceName} reference={servicesDDRef} />
        </View>
        <View style={[Styles.paddingStart8, Styles.paddingEnd0, Styles.flex1]}>
          <Dropdown label="Category Name" data={categoriesData} onSelected={onCategoriesNameSelected} selectedItem={categoriesName} reference={categoriesDDRef} />
        </View>
      </View>
      <View style={[Styles.flex1, Styles.padding16]}>
        {productsFullData.length > 0 ? (
          <Title style={[Styles.paddingHorizontal16, Styles.paddingBottom16, Styles.borderBottom1]}>Products</Title>
        ) : (
          <View style={[Styles.flex1, Styles.flexAlignCenter, Styles.flexJustifyCenter]}>
            <NoItems icon="format-list-bulleted" text="No records found." />
          </View>
        )}
        {productsFullData.map((k, i) => {
          return (
            <Checkbox.Item
              key={i}
              status={k.isChecked ? "checked" : "unchecked"}
              style={[Styles.borderBottom1]}
              label={k.productName}
              onPress={() => {
                const tempArrProductData = [...arrProductData[0]];
                if (!k.isChecked) {
                  tempArrProductData.push(k);
                } else {
                  tempArrProductData.splice(tempArrProductData.indexOf(k), 1);
                }
                arrProductData[1](tempArrProductData);
                let temp = productsFullData.map((u) => {
                  if (k.productID === u.productID) {
                    return { ...u, isChecked: !u.isChecked };
                  }
                  return u;
                });
                setProductsFullData(temp);
              }}
            />
          );
        })}
      </View>
    </View>
  );
};

export default AddMaterialSetupProducts;
