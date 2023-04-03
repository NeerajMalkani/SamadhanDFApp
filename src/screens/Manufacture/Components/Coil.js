import React from "react";
import { useState, useEffect } from "react";
import Provider from "../../../api/Provider";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import { theme } from "../../../theme/apptheme";

function Coil({ dataparams, id, data, setData, errors, setErrors }) {
  useEffect(() => {
    if (
      data.coil_details[id].weight.length > 0 &&
      data.coil_details[id].length > 0 &&
      data.brand_name.length > 0 &&
      data.gpcoil_width.length > 0
    ) {
      let params = {
        data: {
          ...dataparams,
          brand_refno: dataparams.brand_refno.find(
            (item) => item.brand_name === data.brand_name
          ).brand_refno,
          weight_value: data.coil_details[id].weight,
          length_value: data.coil_details[id].length,
        },
      };

      Provider.createDFManufacturer(
        Provider.API_URLS
          .get_coil_avg_thickness_calculation_manufacturer_poform,
        params
      )
        .then((response) => {
          if (response.data.data) {
            setData((prev) => {
              return {
                ...prev,
                coil_details: prev.coil_details.map((item, idx) => {
                  return id == idx
                    ? {
                        ...item,
                        avg_thickness: String(
                          response.data.data[0].avg_thickness
                        ),
                      }
                    : item;
                }),
              };
            });
          }
        })
        .catch((e) => console.log(e));
    }
  }, [
    data.coil_details[id].weight,
    data.coil_details[id].length,
    data.brand_name,
    data.gpcoil_width,
  ]);
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: theme.colors.primary,
        marginTop: 8,
        borderRadius: 10,
        padding: 5,
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, padding: 5 }}>
          <TextInput
            mode="outlined"
            label="Weight"
            value={data.coil_details[id].weight}
            keyboardType={"numeric"}
            style={{ borderRadius: 50, backgroundColor: "white", height: 40 }}
            returnKeyType="next"
            // onBlur={() => update(dataparams)}
            onChangeText={(text) => {
              setErrors((prev) => {
                return {
                  ...prev,
                  coil_details: prev.coil_details.map((item, idx) => {
                    return id == idx
                      ? {
                          ...item,
                          weight: false,
                        }
                      : item;
                  }),
                };
              });
              setData((prev) => {
                return {
                  ...prev,
                  coil_details: prev.coil_details.map((item, idx) => {
                    return id == idx
                      ? {
                          ...item,
                          weight: text,
                        }
                      : item;
                  }),
                };
              });
            }}
            error={errors.coil_details[id]?.weight}
          />
        </View>
        <View style={{ flex: 1, padding: 5 }}>
          <TextInput
            mode="outlined"
            label="Length"
            value={data.coil_details[id].length}
            keyboardType={"numeric"}
            returnKeyType="next"
            // onBlur={() => update(dataparams)}
            onChangeText={(text) => {
              setErrors((prev) => {
                return {
                  ...prev,
                  coil_details: prev.coil_details.map((item, idx) => {
                    return id == idx
                      ? {
                          ...item,
                          length: false,
                        }
                      : item;
                  }),
                };
              });
              setData((prev) => {
                return {
                  ...prev,
                  coil_details: prev.coil_details.map((item, idx) => {
                    return id == idx
                      ? {
                          ...item,
                          length: text,
                        }
                      : item;
                  }),
                };
              });
            }}
            style={[{ backgroundColor: "white", height: 40 }]}
            error={errors.coil_details[id]?.length}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <View style={{ flex: 0.8, padding: 5 }}>
          <TextInput
            mode="outlined"
            label="Average Tickness"
            value={data.coil_details[id].avg_thickness}
            editable={false}
            returnKeyType="next"
            style={[{ backgroundColor: "white", height: 40 }]}
          />
        </View>
      </View>
    </View>
  );
}
export default Coil;
