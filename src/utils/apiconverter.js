export const APIConverter = (response, convertIDs) => {
  function renameKey(obj, oldKey, newKey) {
    if (obj.hasOwnProperty(oldKey)) {
      obj[newKey] = obj[oldKey];
      if (newKey === "display") {
        obj[newKey] = obj[newKey] == "1" ? true : false;
      }
      delete obj[oldKey];
    }
  }

  response.forEach((obj) => {
    if (convertIDs) {
      renameKey(obj, "category_refno", "categoryID");
      renameKey(obj, "service_refno", "serviceID");
      renameKey(obj, "brand_master_refno", "brandMasterID");
      renameKey(obj, "product_refno", "productID");
      renameKey(obj, "designtype_refno", "designTypeID");
      renameKey(obj, "dealer_product_refno", "productID");
      renameKey(obj, "company_product_refno", "productID");
    } else {
      renameKey(obj, "category_refno", "id");
      renameKey(obj, "service_refno", "id");
      renameKey(obj, "brand_master_refno", "id");
      renameKey(obj, "product_refno", "id");
      renameKey(obj, "designtype_refno", "id");
      renameKey(obj, "dealer_product_refno", "id");
      renameKey(obj, "company_product_refno", "id");
    }

    renameKey(obj, "group_refno", "id");
    renameKey(obj, "unit_category_refno", "id");
    renameKey(obj, "locationtype_refno", "id");
    renameKey(obj, "worklocation_refno", "id");
    renameKey(obj, "workfloor_refno", "id");
    renameKey(obj, "materials_setup_refno", "id");
    renameKey(obj, "designgallery_refno", "id");
    renameKey(obj, "department_refno", "id");
    renameKey(obj, "designation_refno", "id");
    renameKey(obj, "buyercategory_refno", "id");
    renameKey(obj, "product_refno", "productID");
    renameKey(obj, "product_name", "productName");
    renameKey(obj, "category_name", "categoryName");
    renameKey(obj, "group_refno_name", "activityRoleName");
    renameKey(obj, "group_name", "activityRoleName");
    renameKey(obj, "service_refno_name", "serviceName");
    renameKey(obj, "service_name", "serviceName");
    renameKey(obj, "unit_category_names", "unitName");
    renameKey(obj, "unit_category_name", "unitName");
    renameKey(obj, "unit_name_text", "displayUnit");
    renameKey(obj, "convert_unit_name", "convertUnitName");
    renameKey(obj, "hsn_sac_code", "hsnsacCode");
    renameKey(obj, "gst_rate", "gstRate");
    renameKey(obj, "view_status", "display");
    renameKey(obj, "product_code", "productCode");
    renameKey(obj, "unit_display_name", "displayUnit");
    renameKey(obj, "unit_name_convert_unit_name", "displayUnitFull");
    renameKey(obj, "unit_name", "displayUnit");
    renameKey(obj, "unitcategoryrefno_unitrefno", "unitId");
    renameKey(obj, "with_material_rate", "rateWithMaterials");
    renameKey(obj, "without_material_rate", "rateWithoutMaterials");
    renameKey(obj, "short_desc", "shortSpecification");
    renameKey(obj, "actual_unitname", "selectedUnit");
    renameKey(obj, "convert_unitname", "convertedUnit");
    renameKey(obj, "service_product_refno", "productID");
    renameKey(obj, "service_refno_name", "serviceName");
    renameKey(obj, "locationtype_name", "branchType");
    renameKey(obj, "workfloor_name", "workFloorName");
    renameKey(obj, "worklocation_name", "workLocationName");
    renameKey(obj, "designtype_name", "designTypeName");
    renameKey(obj, "designtype_image_url", "designImage");
    renameKey(obj, "service_product_name", "productName");
    renameKey(obj, "matrails_cost", "materialCost");
    renameKey(obj, "brand_refno", "brandID");
    renameKey(obj, "brand_name", "brandName");
    renameKey(obj, "company_product_price", "price");
    renameKey(obj, "company_brand_refno", "brandID");
    renameKey(obj, "company_brand_name", "brandName");
    renameKey(obj, "design_image_url", "designImage");
    renameKey(obj, "labour_cost", "labourCost");
    renameKey(obj, "design_no", "designNumber");
    renameKey(obj, "department_name", "departmentName");
    renameKey(obj, "designation_name", "designationName");
    renameKey(obj, "formula_parameter1", "formula");
    renameKey(obj, "qty", "quantity");
    renameKey(obj, "rate", "price");
    renameKey(obj, "buyercategory_name", "buyerCategoryName");
    renameKey(obj, "department_refno_name", "departmentName");
    renameKey(obj, "mydepartment_refno", "departmentID");
    renameKey(obj, "unit_refno", "unitOfSalesID");
    renameKey(obj, "brand_prefix_name", "brandPrefixName");
    renameKey(obj, "promotion_perc", "appProviderDiscount");
    renameKey(obj, "contractor_discount_perc", "contractorDiscount");
    renameKey(obj, "general_discount_perc", "generalDiscount");
    renameKey(obj, "referral_points_perc", "referralPoints");

    renameKey(obj, "address", "addressLine");
    renameKey(obj, "bank_account_no", "accountNumber");
    renameKey(obj, "bank_branch_name", "branchName");
    renameKey(obj, "bank_name", "bankName");
    renameKey(obj, "company_logo_url", "companyLogo");
    renameKey(obj, "company_name", "companyName");
    renameKey(obj, "company_name_prefix", "companyNamePrefix");
    renameKey(obj, "company_refno", "id");
    renameKey(obj, "district_refno", "cityID");
    renameKey(obj, "employee_code_prefix", "employeeCodePrefix");
    renameKey(obj, "firstname", "contactPersonName");
    renameKey(obj, "gst_no", "gstNumber");
    renameKey(obj, "if_create_brand", "showBrand");
    renameKey(obj, "ifsc_code", "ifscCode");
    renameKey(obj, "location_name", "locationName");
    renameKey(obj, "mobile_no", "contactPersonNumber");
    renameKey(obj, "pan_no", "pan");
    renameKey(obj, "po_prefix", "purchaseOrderPrefix");
    renameKey(obj, "quotation_no_prefix", "departmentID");
    renameKey(obj, "so_prefix", "salesOrderPrefix");
    renameKey(obj, "state_refno", "stateID");
    renameKey(obj, "designation_refno_name", "designationName");
    renameKey(obj, "mydesignation_refno", "designationID");
    renameKey(obj, "reporting_status", "reportingAuthority");
    renameKey(obj, "discount_data", "discountData");
    renameKey(obj, "discount_perc", "buyerCategoryDiscount");
    renameKey(obj, "state_name", "stateName");
    renameKey(obj, "state_refno", "stateID");
    renameKey(obj, "district_name", "cityName");
    renameKey(obj, "district_refno", "cityID");
    renameKey(obj, "materital_product_refno", "productID");
    renameKey(obj, "materital_product_name", "productName");
    renameKey(obj, "qty", "quantity");
    renameKey(obj, "myservice_refno", "serviceID");

    renameKey(obj, "actual_unit_name", "unitOfSale");
    renameKey(obj, "actual_unit_name_txt", "unitOfSaleText");
    renameKey(obj, "actual_unit_refno", "unitID");
    renameKey(obj, "brand_prefixname", "brandPrefix");
    renameKey(obj, "convert_unit_refno", "convertedUnitID");
    renameKey(obj, "converted_unit_value", "convertedUnitValue");
    renameKey(obj, "isapprove", "isApprove");
    renameKey(obj, "ispublish", "isPublish");
    renameKey(obj, "product_image_url", "image");
    renameKey(obj, "sales_unit", "unitOfSale");
    
  });

  return response;
};

export const RemoveUnwantedParameters = (response, params) => {
  if (Array.isArray(params)) {
    response.forEach((obj) => {
      for (let i = 0; i < params.length; i++) {
        if (obj.hasOwnProperty(params[i])) {
          delete obj[params[i]];
        }
      }
    });
  }
  return response;
};
