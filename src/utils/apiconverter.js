export const APIConverter = (response) => {
  function renameKey(obj, oldKey, newKey) {
    if (obj.hasOwnProperty(oldKey)) {
      obj[newKey] = obj[oldKey];
      if (newKey === "display") {
        obj[newKey] = obj[newKey] === "1" ? true : false;
      }
      delete obj[oldKey];
    }
  }

  response.forEach((obj) => {
    renameKey(obj, "product_refno", "productID");
    renameKey(obj, "product_name", "productName");
    renameKey(obj, "product_refno", "id");
    renameKey(obj, "category_refno", "id");
    renameKey(obj, "category_name", "categoryName");
    renameKey(obj, "group_refno_name", "activityRoleName");
    renameKey(obj, "group_refno", "id");
    renameKey(obj, "group_name", "activityRoleName");
    renameKey(obj, "service_refno_name", "serviceName");
    renameKey(obj, "service_refno", "id");
    renameKey(obj, "service_name", "serviceName");
    renameKey(obj, "unit_category_names", "unitName");
    renameKey(obj, "unit_category_name", "unitName");
    renameKey(obj, "unit_category_refno", "id");
    renameKey(obj, "unit_name_text", "displayUnit");
    renameKey(obj, "hsn_sac_code", "hsnsacCode");
    renameKey(obj, "gst_rate", "gstRate");
    renameKey(obj, "view_status", "display");
    renameKey(obj, "product_code", "productCode");
    renameKey(obj, "unit_display_name", "displayUnit");
    renameKey(obj, "unit_name", "displayUnit");
    renameKey(obj, "unitcategoryrefno_unitrefno", "id");
    renameKey(obj, "with_material_rate", "rateWithMaterials");
    renameKey(obj, "without_material_rate", "rateWithoutMaterials");
    renameKey(obj, "short_desc", "shortSpecification");
    renameKey(obj, "actual_unitname", "selectedUnit");
    renameKey(obj, "convert_unitname", "convertedUnit");
    renameKey(obj, "service_product_refno", "productID");
    renameKey(obj, "locationtype_refno", "id");
    renameKey(obj, "service_refno_name", "serviceName");
    renameKey(obj, "locationtype_name", "branchType");
    renameKey(obj, "workfloor_refno", "id");
    renameKey(obj, "workfloor_name", "workFloorName");
    renameKey(obj, "worklocation_refno", "id");
    renameKey(obj, "worklocation_name", "workLocationName");
    renameKey(obj, "designtype_refno", "id");
    renameKey(obj, "designtype_name", "designTypeName");
    renameKey(obj, "designtype_image_url", "designImage");
    renameKey(obj, "materials_setup_refno", "id");
    renameKey(obj, "service_product_name", "productName");
    renameKey(obj, "matrails_cost", "materialCost");
    renameKey(obj, "dealer_product_refno", "productID");
    renameKey(obj, "brand_refno", "brandID");
    renameKey(obj, "brand_name", "brandName");
    renameKey(obj, "company_product_refno", "productID");
    renameKey(obj, "company_product_price", "price");
    renameKey(obj, "company_brand_refno", "brandID");
    renameKey(obj, "company_brand_name", "brandName");
  });

  return response;
};
