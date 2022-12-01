import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import { Checkbox, Title } from "react-native-paper";
import Provider from "../../../../api/Provider";
import Dropdown from "../../../../components/Dropdown";
import NoItems from "../../../../components/NoItems";
import { Styles } from "../../../../styles/styles";
import { APIConverter } from "../../../../utils/apiconverter";

const AddMaterialSetupProducts = ({ arrProductData }) => {
  //#region Variables
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
  const FetchServices = () => {
    Provider.createDFAdmin(Provider.API_URLS.ServiceNamePopupMaterialSetup)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
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
      data: {
        Sess_UserRefno: "2",
        service_refno: servicesFullData.find((el) => {
          return el.serviceName === selectedItem;
        }).id,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.CategoryNamePopupMaterialSetup, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
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
      data: {
        Sess_UserRefno: "2",
        category_refno: categoriesFullData.find((el) => {
          return el.categoryName === selectedItem;
        }).id,
      },
    };
    Provider.createDFAdmin(Provider.API_URLS.ProductListPopupMaterialSetup, params)
      .then((response) => {
        if (response.data && response.data.code === 200) {
          if (response.data.data) {
            response.data.data = APIConverter(response.data.data);
            const fullData = response.data.data.map((o) => ({
              ...o,
              isChecked: arrProductData[0].find((el) => {
                return el.productID == o.productID;
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
    FetchServices();
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
