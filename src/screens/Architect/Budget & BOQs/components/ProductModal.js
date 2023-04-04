import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { Modal } from 'react-native-paper';
import { Styles } from '../../../../styles/styles';
import Dropdown from '../../../../components/Dropdown';
import { Table, TableWrapper, Row, Col } from 'react-native-table-component';
import { theme } from '../../../../theme/apptheme';
import { useState } from 'react';
import Provider from '../../../../api/Provider';
import { useEffect } from 'react';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  header: { height: 80, backgroundColor: theme.colors.primary },
  subheader: { height: 30, backgroundColor: 'white' },
  text: { textAlign: 'center', fontWeight: '400' },
  headertext: { textAlign: 'center', fontWeight: '800', color: 'white' },
  dataWrapper: { marginTop: -1 },
  row: { height: 50, backgroundColor: 'white' },
});
const ProductModal = ({
  open,
  setOpen,
  Sess_UserRefno,
  quot_type_refno,
  quot_unit_type_refno,
}) => {
  const [state, setState] = useState({
    service_refno: '0',
    category_refno: '0',
  });
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const fetchServices = () => {
    Provider.createDFArchitect(
      Provider.API_URLS.architect_getservicename_popup_budgetform,
      { data: { Sess_UserRefno } },
    )
      .then((res) => {
        setServices(res.data.data);
      })
      .catch((error) => console.log(error));
  };

  const fetchCategories = (service_refno) => {
    Provider.createDFArchitect(
      Provider.API_URLS.architect_getcategoryname_popup_budgetform,
      {
        data: {
          Sess_UserRefno,
          service_refno,
        },
      },
    ).then((res) => {
      if (res.data.data) setCategories(res.data.data);
    });
  };

  useEffect(() => {
    if (open) {
      fetchServices();
    }
  }, [open]);
  const fetchProducts = () => {
    console.log({
      data: {
        Sess_UserRefno,
        service_refno: state.service_refno,
        category_refno: state.category_refno,
        quot_type_refno,
        quot_unit_type_refno,
      },
    });
    Provider.createDFArchitect(
      Provider.API_URLS.architect_getproductlist_popup_budgetform,
      {
        data: {
          Sess_UserRefno,
          service_refno: state.service_refno,
          category_refno: state.category_refno,
          quot_type_refno,
          quot_unit_type_refno,
        },
      },
    ).then((res) => {
      if (res.data.data) setProducts(res.data.data);
    });
  };
  console.log(products);
  return (
    <Modal
      visible={open}
      onDismiss={() => setOpen(false)}
      contentContainerStyle={{
        backgroundColor: 'white',
        padding: 16,
        width: '90%',
        alignSelf: 'center',
        height: 500,
      }}
    >
      <Text
        style={[
          Styles.fontSize20,
          Styles.fontBold,
          Styles.marginBottom4,
          Styles.primaryColor,
          { marginBottom: '3%' },
        ]}
      >
        Product List
      </Text>
      <Dropdown
        label='Service Name'
        data={services.map((obj) => obj.service_name)}
        onSelected={(e) => {
          setState((state) => ({
            ...state,
            service_refno: services.find((item) => item.service_name === e)
              .service_refno,
            category_refno: '0',
          }));
          fetchCategories(
            services.find((item) => item.service_name === e).service_refno,
          );
        }}
        style={{ backgroundColor: 'white', marginBottom: '3%' }}
      />
      <Dropdown
        label='Category Name'
        onSelected={(e) => {
          setState((state) => ({
            ...state,
            category_refno: categories.find((item) => item.category_name === e)
              .category_refno,
          }));
          fetchProducts();
        }}
        data={categories.map((obj) => obj.category_name)}
        style={{ backgroundColor: 'white', marginBottom: '3%' }}
      />
      <View style={styles.container}>
        <ScrollView horizontal={true}>
          <View>
            <Table
              borderStyle={{
                borderWidth: 1,
                borderColor: '#C1C0B9',
              }}
            >
              <Row
                data={[
                  'Product Name',
                  'Unit',
                  'Quantity',
                  'Amount',
                  'Rate',
                  'Remarks',
                  'Action',
                ]}
                widthArr={[100, 80, 80, 80, 120, 140, 190]}
                style={styles.header}
                textStyle={styles.headertext}
              />
            </Table>
            <ScrollView style={styles.dataWrapper}>
              <Table
                borderStyle={{
                  borderWidth: 1,
                  borderColor: '#C1C0B9',
                }}
              ></Table>
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default ProductModal;
