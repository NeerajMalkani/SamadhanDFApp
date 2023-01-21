import axios from "axios";

const BASE_URL_OLD = "https://api.starselector.com/api";
const BASE_URL_API = "https://dfsolutions.in/api/apiurl/spawu7S4urax/tYjD";
const BASE_URL = "https://dfsolutions.in/api/apicommon/spawu7S4urax/tYjD";
const BASE_URL_Admin = "https://dfsolutions.in/api/apiappadmin/spawu7S4urax/tYjD";
const BASE_URL_Dashboard = "https://dfsolutions.in/api/apidashboard/spawu7S4urax/tYjD";
const BASE_URL_PocketDiary = "https://dfsolutions.in/api/apipocketdiary/spawu7S4urax/tYjD";
const BASE_URL_Contractor = "https://dfsolutions.in/api/apicontractor/spawu7S4urax/tYjD/";

class Provider {
  //#region Old API's
  getAll(resource) {
    return axios.get(`${BASE_URL_OLD}/${resource}`, {
      headers: {
        "Content-Type": "application/json",
        XApiKey: "pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp",
      },
    });
  }
  getAllParams(resource, params) {
    return axios.get(
      `${BASE_URL_OLD}/${resource}`,
      { body: params },
      {
        headers: {
          "Content-Type": "application/json",
          XApiKey: "pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp",
        },
      }
    );
  }
  get(resource, id) {
    return axios.get < `${BASE_URL_OLD}/${resource}/${id}`;
  }
  create(resource, params) {
    return axios.post(`${BASE_URL_OLD}/${resource}`, params, {
      headers: {
        "Content-Type": "application/json",
        XApiKey: "pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp",
      },
    });
  }
  update(resource, params, id) {
    return axios.put(`${BASE_URL_OLD}/${resource}/${id}`, params, {
      headers: {
        "Content-Type": "application/json",
        XApiKey: "pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp",
      },
    });
  }
  delete(resource, id) {
    return axios.delete(`${BASE_URL_OLD}/${resource}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        XApiKey: "pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp",
      },
    });
  }
  deleteAll(resource) {
    return axios.delete(`${BASE_URL_OLD}/${resource}`, {
      headers: {
        "Content-Type": "application/json",
        XApiKey: "pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp",
      },
    });
  }
  deleteAllParams(resource, params) {
    return axios.delete(`${BASE_URL_OLD}/${resource}`, {
      headers: {
        "Content-Type": "application/json",
        XApiKey: "pgH7QzFHJx4w46fI~5Uzi4RvtTwlEXp",
      },
      data: params,
    });
  }
  //#endregion

  //#region New API's

  API_URLS = {
    /******************************LOGIN************************************/
    LoginCheck: "logincheck/",
    UserFromRefNo: "userrefnocheck/",

    /******************************SIGN UP************************************/
    NewUserProfile: "newuserprofilecreate/",

    /******************************FORGOT PASSWORD************************************/
    MobileCheck: "mobilenocheck/",
    ForgotMobileNoCheck: "forgotmobilenocheck/",
    ForgotPasswordCheck: "forgotpasswordcheck/",
    AlterPasswordCheck: "alterpasswordcheck/",

    /******************************Admin Master************************************/
    GroupFromRefNo: "grouprefnocheck/",
    GroupNameCreate: "groupnamecreate/",
    GroupNameUpdate: "groupnameupdate/",

    APIURL: "getapiurl/",

    ServiceFromRefNo: "servicerefnocheck/",
    ServiceNameCreate: "servicenamecreate/",
    ServiceNameUpdate: "servicenameupdate/",

    UnitCategoryFromRefNo: "unitcategoryrefnocheck/",
    UnitNameCreate: "unitnamecreate/",
    UnitNameUpdate: "unitnameupdate/",

    ActivityRoleCategory: "getactivityrolecategoryform/",
    CategoryFromRefNo: "categoryrefnocheck/",
    CategoryNameCreate: "categorynamecreate/",
    CategoryNameUpdate: "categorynameupdate/",

    ProductFromRefNo: "productrefnocheck/",
    ActivityRoleForProduct: "getactivityroleproductform/",
    ServiceForProduct: "getservicenameproductform/",
    CategoryForProduct: "getcategorynameproductform/",
    CategoryDataForProduct: "getcategorydataproductform/",
    UnitNameSelectedForProduct: "getunitnameserviceproductform/",
    UnitNameForProduct: "getunitnameproductform/",
    ProductNameCreate: "productnamecreate/",
    ProductNameUpdate: "productnameupdate/",

    ServiceProductFilter: "serviceproductfilter/",
    ActivityRoleServiceProduct: "getactivityroleserviceproductform/",
    ServiceNameServiceProduct: "getservicenameserviceproductform/",
    CategoryNameServiceProduct: "getcategorynameserviceproductform/",
    CategoryDataServiceProduct: "getcategorydataserviceproductform/",
    ProductServiceProduct: "getproductnameserviceproductform/",
    AlternativeUnitOfSalesServiceProduct: "getalternativeunitofsalesserviceproductform/",
    ServiceProductCreate: "serviceproductcreate/",
    ServiceProductUpdate: "serviceproductupdate/",
    ServiceProductrefNoCheck: "serviceproductrefnocheck/",

    DepartmentRefNoCheck: "departmentrefnocheck/",
    DepartmentNameCreate: "departmentnamecreate/",
    DepartmentNameUpdate: "departmentnameupdate/",

    LocationTypeRefNoCheck: "locationtyperefnocheck/",
    LocationTypeCreate: "locationtypecreate/",
    LocationTypeUpdate: "locationtypeupdate/",

    DesignationRefNoCheck: "designationrefnocheck/",
    DesignationNameCreate: "designationnamecreate/",
    DesignationNameUpdate: "designationnameupdate/",

    EWayBillRefNoCheck: "ewaybillrefnocheck/",
    GetStateEWayBillForm: "getstateewaybillform/",
    EWayBillCreate: "ewaybillcreate/",
    EWayBillUpdate: "ewaybillupdate/",

    /******************************Admin Service Catalogue************************************/
    WorkFloorRefNoCheck: "workfloorrefnocheck/",
    WorkFloorCreate: "workfloornamecreate/",
    WorkFloorUpdate: "workfloornameupdate/",

    WorkLocationRefNoCheck: "worklocationrefnocheck/",
    WorkLocationCreate: "worklocationnamecreate/",
    WorkLocationUpdate: "worklocationnameupdate/",

    ActivityRolesDesignType: "getgroupnamedesigntypeform/",
    ServiceNameDesignType: "getservicenamedesigntypeform/",
    CategoryNameDesignType: "getcategorynamedesigntypeform/",
    ProductNameDesignType: "getproductnamedesigntypeform/",
    DesignTypeRefNoCheck: "designtyperefnocheck/",
    DesignTypeCreate: "designtypecreate/",
    DesignTypeUpdate: "designtypeupdate/",

    ActivityRolesMaterialSetup: "getgroupnamematerialsetupform/",
    ServiceNameMaterialSetup: "getservicenamematerialsetupform/",
    CategoryNameMaterialSetup: "getcategorynamematerialsetupform/",
    ProductNameMaterialSetup: "getproductnamematerialsetupform/",
    ProductDesignTypeMaterialSetup: "getproductdesigntypematerialsetupform/",
    ServiceNamePopupMaterialSetup: "getservicename_popup_materialsetupform/",
    CategoryNamePopupMaterialSetup: "getcategoryname_popup_materialsetupform/",
    ProductListPopupMaterialSetup: "getproductlist_popup_materialsetupform/",
    BrandNamelistPopupMaterialSetup: "getbrandnamelist_materialsetupform/",
    ProductRateBrandRefNoMaterialSetup: "getproductrate_by_brandrefno_materialsetupform/",
    MaterialsSetupRefNoCheck: "materialssetuprefnocheck/",
    MaterialsSetupCreate: "materialsetupcreate/",
    MaterialsSetupUpdate: "materialsetupupdate/",
    MaterialsSetupList: "materialssetuplist/",

    DesignGalleryRefNoCheck: "designgalleryrefnocheck/",
    NewDesignCreate: "newdesigncreate/",
    NewDesignUpdate: "newdesignupdate/",
    AutoDesignNoNewDesign: "getautodesignnonewdesignform/",
    ActivityRoleNameNewDesign: "getgroupnamenewdesignform/",
    ServiceNameNewDesign: "getservicenamenewdesignform/",
    CategoryNameNewDesign: "getcategorynamenewdesignform/",
    ProductNameNewDesign: "getproductnamenewdesignform/",
    ProductDesignTypeNewDesign: "getproductdesigntypenewdesignform/",
    ProductDataNewDesign: "getproductdatanewdesignform/",
    WorkLocationNameNewDesign: "getworklocationnamenewdesignform/",

    GetdashboardTotaluser: "getdashboard_totaluser/",
    GetdashboardUserswitchto: "getdashboard_userswitchto/",
    Getdashboard_Userswitchto_Proceed: "getdashboard_userswitchto_proceed/",
    GetdashboardServicecatalogue: "getdashboard_servicecatalogue/",
    GetserviceimagegalleryByServicerefno: "getserviceimagegallery_by_servicerefno/",
    Getgotoestimation: "getgotoestimation/",
    MyDepartmentRefnoCheck: "mydepartmentrefnocheck/",
    MyDesignationRefnoCheck: "mydesignationrefnocheck/",
    MyClientUserRefNoCheck: "myclientuserrefnocheck/",
    CompanyNameAutocompleteClientSearch: "companynameautocompleteclientsearch/",
    MobileNoAutocompleteClientSearch: "mobilenoautocompleteclientsearch/",
    ClientSearch: "clientsearch/",
    ClientAdd: "clientadd/",
    ClientCreate: "clientcreate/",
    ClientUpdate: "clientupdate/",

    /******************************Dealer Brand************************************/
    DealerBrandMasterRefNoCheck: "dealerbrandmasterrefnocheck/",
    DealerBrandMasterCreate: "dealerbrandmastercreate/",
    DealerBrandMasterUpdate: "dealerbrandmasterupdate/",

    DealerBuyerCategoryRefNoCheck: "dealerbuyercategoryrefnocheck/",
    DealerBuyerCategoryCreate: "dealerbuyercategorycreate/",
    DealerBuyerCategoryUpdate: "dealerbuyercategoryupdate/",

    ServiceNameDealerBrandSetup: "getservicenamedealerbrandsetupform/",
    CategoryNameDealerBrandSetup: "getcategorynamedealerbrandsetupform/",
    CategoryDataDealerBrandSetup: "getcategorydatadealerbrandsetupform/",
    UnitOfSaleDealerBrandSetup: "getunitofsaledealerbrandsetupform/",
    BrandNameDealerBrandSetup: "getbrandnamedealerbrandsetupform/",
    BuyerCategoryDiscountDealerBrandSetup: "getbuyercategorydiscountdealerbrandsetupform/",
    DealerBrandRefNoCheck: "dealerbrandrefnocheck/",
    DealerBrandSetupCreate: "dealerbrandsetupcreate/",
    DealerBrandSetupUpdate: "dealerbrandsetupupdate/",

    GetDealerCompanyBasicDetails: "getdealercompanybasicdetails/",
    MyDepartmentRefnocheck: "mydepartmentrefnocheck/",
    DepartmentCreate: "departmentcreate/",
    DepartmentUpdate: "departmentupdate/",
    MyDesignationRefnoCheck: "mydesignationrefnocheck/",
    DesignationCreate: "designationcreate/",
    DesignationUpdate: "designationupdate/",

    DealerCompanyBasicDetailsUpdate: "dealercompanybasicdetailsupdate/",
    GetStateDetails: "getstatedetails/",
    GetDistrictDetailsByStateRefno: "getdistrictdetails_by_state_refno/",

    getservicenamematerialcalculatorform: "getservicenamematerialcalculatorform/",
    getcategorynamematerialcalculatorform: "getcategorynamematerialcalculatorform/",
    getproductnamematerialcalculatorform: "getproductnamematerialcalculatorform/",
    getproductdesigntypematerialcalculatorform: "getproductdesigntypematerialcalculatorform/",
    getdesigntypeimagematerialcalculatorform: "getdesigntypeimagematerialcalculatorform/",
    getsqftcalculation_materialcalculatorform: "getservicenamematerialcalculatorform/",
    getviewmaterials_materialcalculatorform: "getviewmaterials_materialcalculatorform/",
    getproductrate_by_brandrefno_materialcalculatorform: "getproductrate_by_brandrefno_materialcalculatorform/",
    getbrandnamelist_materialcalculatorform: "getbrandnamelist_materialcalculatorform/",

    getservicenamedealermyserviceform: "getservicenamedealermyserviceform/",
    dealermyservicecreate: "dealermyservicecreate/",
    dealermyserviceupdate: "dealermyserviceupdate/",
    dealermyservicerefnocheck: "dealermyservicerefnocheck/",

    dealercompanyproductrefnocheck: "dealercompanyproductrefnocheck/",
    getproductdatadealerproductform: "getproductdatadealerproductform/",
    dealerproductsetupcreate: "dealerproductsetupcreate/",
    dealerproductsetupupdate: "dealerproductsetupupdate/",
    getbrandnamedealerproductform: "getbrandnamedealerproductform/",
    getproductnamedealerproductform: "getproductnamedealerproductform/",

    myemployeelist: "myemployeelist/",
    aadharnoautocomplete: "aadharnoautocomplete/",
    mobilenoautocomplete: "mobilenoautocomplete/",
    employeesearch: "employeesearch/",
    employeeadd: "employeeadd/",
    employeecreate: "employeecreate/",
    sendotptoemployee: "sendotptoemployee/",
    employeeotpverify: "employeeotpverify/",
    getemployeebasicdata: "getemployeebasicdata/",

    employeebasicdataupdate: "employeebasicdataupdate/",
    getbranchnameemployeeworkform: "getbranchnameemployeeworkform/",
    getdepartmentnameemployeeworkform: "getdepartmentnameemployeeworkform/",
    getdesignationnameemployeeworkform: "getdesignationnameemployeeworkform/",
    getreportingtoemployeeworkform: "getreportingtoemployeeworkform/",
    getemptypenameemployeeworkform: "getemptypenameemployeeworkform/",
    getemployeeworkdata: "getemployeeworkdata/",
    employeeworkdataupdate: "employeeworkdataupdate/",
    getwagestypenameemployeeworkform: "getwagestypenameemployeeworkform/",
    getemployeepaydata: "getemployeepaydata/",
    employeepaydataupdate: "employeepaydataupdate/",

    MyBranchRefnocheck: "branchrefnocheck/",
    MyFetchBranchtype: "getbranchtypebranchform/",
    MyFetchBranchAssign: "getassignbranchadminbranchform/",
    AddBranch: "branchcreate/",
    EditBranch: "branchupdate/",
    CompanyBranchForm: "getcompanynamebranchform/",
    getassignbranchadminedit_branchform: "getassignbranchadminedit_branchform/",
    FetchBranchAssignContactNo: "getassignbranchadmin_contactno_branchform/",
    MyFetchRegionalOffice: "getparentbranchrefnobranchform/",
    getuserprofile: "getuserprofile/",
    userprofileupdate: "userprofileupdate/",
    pckcategoryrefnocheck_appadmin: "pckcategoryrefnocheck_appadmin/",
    pckcategorynamecreate_appadmin: "pckcategorynamecreate_appadmin/",
    gettransactiontype_pckcategoryform_appadmin: "gettransactiontype_pckcategoryform_appadmin/",
    pckcategorynameupdate_appadmin: "pckcategorynameupdate_appadmin/",
    pcksubcategoryrefnocheck_appadmin: "pcksubcategoryrefnocheck_appadmin/",
    gettransactiontype_pcksubcategoryform_appadmin: "gettransactiontype_pcksubcategoryform_appadmin/",
    getpckcategoryname_pcksubcategoryform_appadmin: "getpckcategoryname_pcksubcategoryform_appadmin/",
    pcksubcategorynamecreate_appadmin: "pcksubcategorynamecreate_appadmin/",
    pcksubcategorynameupdate_appadmin: "pcksubcategorynameupdate_appadmin/",
    pckcategoryrefnocheck_user: "pckcategoryrefnocheck_user/",
    gettransactiontype_pckcategoryform_user: "gettransactiontype_pckcategoryform_user/",
    pckcategorynamecreate_user: "pckcategorynamecreate_user/",
    pckcategorynameupdate_user: "pckcategorynameupdate_user/",
    pcksubcategoryrefnocheck_user: "pcksubcategoryrefnocheck_user/",
    gettransactiontype_pcksubcategoryform_user: "gettransactiontype_pcksubcategoryform_user/",
    getpckcategoryname_pcksubcategoryform_user: "getpckcategoryname_pcksubcategoryform_user/",
    pcksubcategorynamecreate_user: "pcksubcategorynamecreate_user/",
    pcksubcategorynameupdate_user: "pcksubcategorynameupdate_user/",
    pckmycontactrefnocheck: "pckmycontactrefnocheck/",
    pckmycontactscreate: "pckmycontactscreate/",
    pckmycontactsupdate: "pckmycontactsupdate/",
    contractorproductrefnocheck: "contractorproductrefnocheck/",
    getservicenameratecardform: "getservicenameratecardform/",
    getcategorynameratecardform: "getcategorynameratecardform/",
    getcategorydataratecardform: "getcategorydataratecardform/",
    getproductnameratecardform: "getproductnameratecardform/",
    getunitofsaleratecardform: "getunitofsaleratecardform/",
    getmaterialratedataratecardform: "getmaterialratedataratecardform/",
    getmaterialratedata_unitofsaleonchange_ratecardform: "getmaterialratedata_unitofsaleonchange_ratecardform/",
    getmaterialratedata_withmaterialrateblur_ratecardform: "getmaterialratedata_withmaterialrateblur_ratecardform/",
    getmaterialratedata_withoutmaterialrateblur_ratecardform: "getmaterialratedata_withoutmaterialrateblur_ratecardform/",
    ratecardcreate: "ratecardcreate/",
    ratecardupdate: "ratecardupdate/",
    pckaddsource_pcktransrefnocheck: "pckaddsource_pcktransrefnocheck/",
    get_pckentrytype: "get_pckentrytype/",
    get_pckpaymentmodetype: "get_pckpaymentmodetype/",
    getcategoryname_pckaddsourceform: "getcategoryname_pckaddsourceform/",
    getsubcategoryname_pckaddsourceform: "getsubcategoryname_pckaddsourceform/",
    get_pckmybankname: "get_pckmybankname/",
    get_pckmycontactname: "get_pckmycontactname/",
    get_pckdeposittype: "get_pckdeposittype/",
    pckaddsourcecreate: "pckaddsourcecreate/",
    getcardtype_pckmypersonalbankform: "getcardtype_pckmypersonalbankform/",
    pckmypersonalbankcreate: "pckmypersonalbankcreate/",
    pckaddsourceupdate: "pckaddsourceupdate/",
    pckaddexpenses_pcktransrefnocheck: "pckaddexpenses_pcktransrefnocheck/",
    getcategoryname_pckaddexpensesform: "getcategoryname_pckaddexpensesform/",
    getsubcategoryname_pckaddexpensesform: "getsubcategoryname_pckaddexpensesform/",
    getcardtype_pckaddexpensesform: "getcardtype_pckaddexpensesform/",
    getcardbankname_pckaddexpensesform: "getcardbankname_pckaddexpensesform/",
    pckaddexpensescreate: "pckaddexpensescreate/",
    pckaddexpensesupdate: "pckaddexpensesupdate/",
    pckdashboard_payablelist: "pckdashboard_payablelist/",
    pckdashboard_receivablelist: "pckdashboard_receivablelist/",

    branchbankrefnocheck: "branchbankrefnocheck/",
    getbranchnamebankform: "	getbranchnamebankform/",
    pckaddsource_pdc_cheque_update: "pckaddsource_pdc_cheque_update/",
    branchbankcreate:"branchbankcreate/",
    branchbankupdate:"branchbankupdate/",

    userbankrefnocheck: "userbankrefnocheck/",
    userbankcreate:"userbankcreate/",
    userbankupdate:"userbankupdate/",
  };

  createDFPocketDairy(resource, params) {
    return axios.post(`${BASE_URL_PocketDiary}/${resource}`, params);
  }

  createDFPocketDairyWithHeader(resource, params) {
    if (params) {
      return axios.post(`${BASE_URL_PocketDiary}/${resource}`, params, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      return axios.post(`${BASE_URL_PocketDiary}/${resource}`, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
  }

  createDFCommon(resource, params) {
    return axios.post(`${BASE_URL}/${resource}`, params);
  }

  createDFCommonWithouParam(resource) {
    return axios.post(`${BASE_URL}/${resource}`);
  }

  createDFCommonWithHeader(resource, params) {
    if (params) {
      return axios.post(`${BASE_URL}/${resource}`, params, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      return axios.post(`${BASE_URL}/${resource}`, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
  }

  createDFAdmin(resource, params) {
    if (params) {
      return axios.post(`${BASE_URL_Admin}/${resource}`, params);
    } else {
      return axios.post(`${BASE_URL_Admin}/${resource}`);
    }
  }

  createDFContractor(resource: string, params) {
    return axios.post(`${BASE_URL_Contractor}/${resource}`, params);
  }

  createDFAdminWithHeader(resource, params) {
    if (params) {
      return axios.post(`${BASE_URL_Admin}/${resource}`, params, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      return axios.post(`${BASE_URL_Admin}/${resource}`, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
  }

  createDFDashboard(resource, params = null) {
    if (params) {
      return axios.post(`${BASE_URL_Dashboard}/${resource}`, params);
    } else {
      return axios.post(`${BASE_URL_Dashboard}/${resource}`);
    }
  }

  createDFAPI(resource, params) {
    if (params) {
      return axios.post(`${BASE_URL_API}/${resource}`, params);
    } else {
      return axios.post(`${BASE_URL_API}/${resource}`);
    }
  }
  //#endregion
}
export default new Provider();
