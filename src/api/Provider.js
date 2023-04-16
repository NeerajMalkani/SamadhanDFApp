import axios from "axios";
import { onePixelImage, timeoutLimit } from "../utils/paths";

const BASE_OLD = "https://dfsolutions.in/api";
const BASE_4 = "https://samadhanerp.com/api";
const BASE_ = "https://samadhanerp.com/testkit/api";
const BASE_URL_OLD = "https://api.starselector.com/api";
const BASE_URL_API = `${BASE_}/apiurl/spawu7S4urax/tYjD`;
const BASE_URL = `${BASE_}/apicommon/spawu7S4urax/tYjD`;
const BASE_URL_Admin = `${BASE_}/apiappadmin/spawu7S4urax/tYjD`;
export const BASE_URL_Architect = `${BASE_}/apiarchitect/spawu7S4urax/tYjD`;
export const BASE_URL_Employee = `${BASE_}/apiemployee/spawu7S4urax/tYjD`;
const BASE_URL_Dashboard = `${BASE_}/apidashboard/spawu7S4urax/tYjD`;
const BASE_URL_PocketDiary = `${BASE_}/apipocketdiary/spawu7S4urax/tYjD`;
export const BASE_URL_Contractor = `${BASE_}/apicontractor/spawu7S4urax/tYjD/`;
const BASE_URL_Manufacturer = `${BASE_}/apimanufacturer/spawu7S4urax/tYjD`;
const BASE_URL_CLIENT = `${BASE_}/apiclient/spawu7S4urax/tYjD`;

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
    get_brandconversionvalue_list: "get_brandconversionvalue_list/",
    get_brandconversionvalue_update: "get_brandconversionvalue_update/",
    mfosprefnocheck: "mfosprefnocheck/",
    get_servicename_openingstockform: "get_servicename_openingstockform/",
    ActivityRoleCategory: "getactivityrolecategoryform/",
    get_categoryname_openingstockform: "get_categoryname_openingstockform/",
    get_brandname_openingstockform: "get_brandname_openingstockform/",
    get_productname_openingstockform: "get_productname_openingstockform/",
    openingstockupdate: "openingstockupdate/",
    openingstockcreate: "openingstockcreate/",
    CategoryFromRefNo: "categoryrefnocheck/",
    CategoryNameCreate: "categorynamecreate/",
    CategoryNameUpdate: "categorynameupdate/",
    mfbrandvaluerefnocheck: "mfbrandvaluerefnocheck/",
    shiftproductionrefnocheck_prodS: "shiftproductionrefnocheck/",
    summaryofmaterial_gridlist: "summaryofmaterial_gridlist/",
    ProductFromRefNo: "productrefnocheck/",
    ActivityRoleForProduct: "getactivityroleproductform/",
    ServiceForProduct: "getservicenameproductform/",
    CategoryForProduct: "getcategorynameproductform/",
    CategoryDataForProduct: "getcategorydataproductform/",
    UnitNameSelectedForProduct: "getunitnameserviceproductform/",
    UnitNameForProduct: "getunitnameproductform/",
    ProductNameCreate: "productnamecreate/",
    ProductNameUpdate: "productnameupdate/",
    brandconversionupdate: "brandconversionupdate/",
    gpcoilrefnocheck: "gpcoilrefnocheck/",
    widthofgpcoilupdate: "widthofgpcoilupdate/",
    productforproductionupdate: "productforproductionupdate/",
    widthofgpcoilcreate: "widthofgpcoilcreate/",
    brandconversioncreate: "brandconversioncreate/",
    productforproductioncreate: "productforproductioncreate/",
    get_searchresult_productionachieved_report:
      "get_searchresult_productionachieved_report/",
    shiftproductionrefnocheck: "shiftproductionrefnocheck/",
    vendororder_invoiceformcreate: "vendororder_invoiceformcreate/",
    get_servicename_II_productforproductionform:
      "get_servicename_II_productforproductionform/",
    get_categoryname_II_productforproductionform:
      "get_categoryname_II_productforproductionform/",
    contractor_scdesign_estimation_finallytakeproject_update:
      "contractor_scdesign_estimation_finallytakeproject_update/",
    contractor_quotation_finallytakeproject_update:
      "contractor_quotation_finallytakeproject_update/",
    gsmrefnocheck: "gsmrefnocheck/",
    get_brandname_productforproductionform:
      "get_brandname_productforproductionform/",
    get_productname_productforproductionform:
      "get_productname_productforproductionform/",
    get_productname_shiftproductionform: "get_productname_shiftproductionform/",
    get_expectedproductdata_shiftproductionform:
      "get_expectedproductdata_shiftproductionform/",
    get_shiftdata_shiftproductionform: "get_shiftdata_shiftproductionform/",
    vendororder_invoiceformupdate: "vendororder_invoiceformupdate/",
    get_noofcoilused_shiftproductionform:
      "get_noofcoilused_shiftproductionform/",
    get_supervisor_shiftproductionform: "get_supervisor_shiftproductionform/",
    get_mastry_shiftproductionform: "get_mastry_shiftproductionform/",
    get_helper_shiftproductionform: "get_helper_shiftproductionform/",
    shiftproductionformupdate: "shiftproductionformupdate/",
    shiftproductionformcreate: "shiftproductionformcreate/",
    gsmnamecreate: "gsmnamecreate/",
    gsmnameupdate: "gsmnameupdate/",
    ServiceProductFilter: "serviceproductfilter/",
    ActivityRoleServiceProduct: "getactivityroleserviceproductform/",
    ServiceNameServiceProduct: "getservicenameserviceproductform/",
    CategoryNameServiceProduct: "getcategorynameserviceproductform/",
    CategoryDataServiceProduct: "getcategorydataserviceproductform/",
    ProductServiceProduct: "getproductnameserviceproductform/",
    AlternativeUnitOfSalesServiceProduct:
      "getalternativeunitofsalesserviceproductform/",
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
    shiftproductionrefnocheck: "shiftproductionrefnocheck_op/",
    get_joborderno_productionachieved_report:
      "get_joborderno_productionachieved_report/",

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
    get_categoryname_productforproductionform:
      "get_categoryname_productforproductionform/",
    ActivityRolesMaterialSetup: "getgroupnamematerialsetupform/",
    ServiceNameMaterialSetup: "getservicenamematerialsetupform/",
    get_productname_II_productforproductionform:
      "get_productname_II_productforproductionform/",
    CategoryNameMaterialSetup: "getcategorynamematerialsetupform/",
    ProductNameMaterialSetup: "getproductnamematerialsetupform/",
    ProductDesignTypeMaterialSetup: "getproductdesigntypematerialsetupform/",
    ServiceNamePopupMaterialSetup: "getservicename_popup_materialsetupform/",
    CategoryNamePopupMaterialSetup: "getcategoryname_popup_materialsetupform/",
    ProductListPopupMaterialSetup: "getproductlist_popup_materialsetupform/",
    BrandNamelistPopupMaterialSetup: "getbrandnamelist_materialsetupform/",
    ProductRateBrandRefNoMaterialSetup:
      "getproductrate_by_brandrefno_materialsetupform/",
    get_servicename_productforproductionform:
      "get_servicename_productforproductionform/",
    MaterialsSetupRefNoCheck: "materialssetuprefnocheck/",
    MaterialsSetupCreate: "materialsetupcreate/",
    MaterialsSetupUpdate: "materialsetupupdate/",
    MaterialsSetupList: "materialssetuplist/",
    shiftproductionrefnocheck_op: "shiftproductionrefnocheck_op/",
    mfpprefnocheck: "mfpprefnocheck/",

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
    GetserviceimagegalleryByServicerefno:
      "getserviceimagegallery_by_servicerefno/",
    Getgotoestimation: "contractor_get_gotoestimation/",
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
    BuyerCategoryDiscountDealerBrandSetup:
      "getbuyercategorydiscountdealerbrandsetupform/",
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
    estimation_accept_workallotupdate: "estimation_accept_workallotupdate/",
    DealerCompanyBasicDetailsUpdate: "dealercompanybasicdetailsupdate/",
    GetStateDetails: "getstatedetails/",
    GetDistrictDetailsByStateRefno: "getdistrictdetails_by_state_refno/",
    deliveryaddress_update: "deliveryaddress_update/",
    newdeliveryaddress_add: "newdeliveryaddress_add/",
    client_mydesign_estimation_pendinglist:
      "client_mydesign_estimation_pendinglist/",
    getservicenamematerialcalculatorform:
      "getservicenamematerialcalculatorform/",
    getcategorynamematerialcalculatorform:
      "getcategorynamematerialcalculatorform/",
    getproductnamematerialcalculatorform:
      "getproductnamematerialcalculatorform/",
    getproductdesigntypematerialcalculatorform:
      "getproductdesigntypematerialcalculatorform/",
    getdesigntypeimagematerialcalculatorform:
      "getdesigntypeimagematerialcalculatorform/",
    getsqftcalculation_materialcalculatorform:
      "getservicenamematerialcalculatorform/",
    getviewmaterials_materialcalculatorform:
      "getviewmaterials_materialcalculatorform/",
    getproductrate_by_brandrefno_materialcalculatorform:
      "getproductrate_by_brandrefno_materialcalculatorform/",
    vendororderformupdate: "vendororderformupdate/",
    vendororderformcreate: "vendororderformcreate/",
    getbrandnamelist_materialcalculatorform:
      "getbrandnamelist_materialcalculatorform/",
    get_vendorcompanyname_manufacturer_poform:
      "get_vendorcompanyname_manufacturer_poform/",
    get_suppliername_manufacturer_poform:
      "get_suppliername_manufacturer_poform/",
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
    mfporefnocheck: "mfporefnocheck/",
    myemployeelist: "myemployeelist/",
    aadharnoautocomplete: "aadharnoautocomplete/",
    mobilenoautocomplete: "mobilenoautocomplete/",
    employeesearch: "employeesearch/",
    employeeadd: "employeeadd/",
    employeecreate: "employeecreate/",
    sendotptoemployee: "sendotptoemployee/",
    employeeotpverify: "employeeotpverify/",
    getemployeebasicdata: "getemployeebasicdata/",
    openingstockscrapupdate: "openingstockscrapupdate/",
    openingstockscrapcreate: "openingstockscrapcreate/",
    get_purchaseorderno_vendororder_invoiceform:
      "get_purchaseorderno_vendororder_invoiceform/",
    get_purchaseorderno_otherdata_vendororder_invoiceform:
      "get_purchaseorderno_otherdata_vendororder_invoiceform/",
    get_purchaseorderno_otherdata_vendororderform:
      "get_purchaseorderno_otherdata_vendororderform/",
    employeebasicdataupdate: "employeebasicdataupdate/",
    getbranchnameemployeeworkform: "getbranchnameemployeeworkform/",
    getdepartmentnameemployeeworkform: "getdepartmentnameemployeeworkform/",
    getdesignationnameemployeeworkform: "getdesignationnameemployeeworkform/",
    getreportingtoemployeeworkform: "getreportingtoemployeeworkform/",
    getemptypenameemployeeworkform: "getemptypenameemployeeworkform/",
    deliveryaddress_list: "deliveryaddress_list/",
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
    gettransactiontype_pckcategoryform_appadmin:
      "gettransactiontype_pckcategoryform_appadmin/",
    pckcategorynameupdate_appadmin: "pckcategorynameupdate_appadmin/",
    pcksubcategoryrefnocheck_appadmin: "pcksubcategoryrefnocheck_appadmin/",
    gettransactiontype_pcksubcategoryform_appadmin:
      "gettransactiontype_pcksubcategoryform_appadmin/",
    getpckcategoryname_pcksubcategoryform_appadmin:
      "getpckcategoryname_pcksubcategoryform_appadmin/",
    pcksubcategorynamecreate_appadmin: "pcksubcategorynamecreate_appadmin/",
    pcksubcategorynameupdate_appadmin: "pcksubcategorynameupdate_appadmin/",
    pckcategoryrefnocheck_user: "pckcategoryrefnocheck_user/",
    gettransactiontype_pckcategoryform_user:
      "gettransactiontype_pckcategoryform_user/",
    pckcategorynamecreate_user: "pckcategorynamecreate_user/",
    pckcategorynameupdate_user: "pckcategorynameupdate_user/",
    pcksubcategoryrefnocheck_user: "pcksubcategoryrefnocheck_user/",
    gettransactiontype_pcksubcategoryform_user:
      "gettransactiontype_pcksubcategoryform_user/",
    getpckcategoryname_pcksubcategoryform_user:
      "getpckcategoryname_pcksubcategoryform_user/",
    contractor_scdesign_estimation_edit: "contractor_scdesign_estimation_edit/",
    contractor_dealer_brand_refno_change:
      "contractor_dealer_brand_refno_change/",
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
    getmaterialratedata_unitofsaleonchange_ratecardform:
      "getmaterialratedata_unitofsaleonchange_ratecardform/",
    getmaterialratedata_withmaterialrateblur_ratecardform:
      "getmaterialratedata_withmaterialrateblur_ratecardform/",
    getmaterialratedata_withoutmaterialrateblur_ratecardform:
      "getmaterialratedata_withoutmaterialrateblur_ratecardform/",
    ratecardcreate: "ratecardcreate/",
    ratecardupdate: "ratecardupdate/",
    pcktransrefnocheck: "pcktransrefnocheck/",
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
    pck_companysource_verify_action: "pck_companysource_verify_action/",
    getcategoryname_pckaddexpensesform: "getcategoryname_pckaddexpensesform/",
    getcategorynamebrandconversionform: "getcategorynamebrandconversionform/",
    getsubcategoryname_pckaddexpensesform:
      "getsubcategoryname_pckaddexpensesform/",
    getcardtype_pckaddexpensesform: "getcardtype_pckaddexpensesform/",
    getcardbankname_pckaddexpensesform: "getcardbankname_pckaddexpensesform/",
    pckaddexpensescreate: "pckaddexpensescreate/",
    pckaddexpensesupdate: "pckaddexpensesupdate/",
    pck_companyexpenses_verify_action: "pck_companyexpenses_verify_action/",
    pckdashboard_payablelist: "pckdashboard_payablelist/",
    pckdashboard_receivablelist: "pckdashboard_receivablelist/",
    getbrandnamebrandconversionform: "getbrandnamebrandconversionform/",
    branchbankrefnocheck: "branchbankrefnocheck/",
    getbranchnamebankform: "	getbranchnamebankform/",
    pckaddsource_pdc_cheque_update: "pckaddsource_pdc_cheque_update/",
    branchbankcreate: "branchbankcreate/",
    branchbankupdate: "branchbankupdate/",
    contractor_quotation_cancel: "contractor_quotation_cancel/",
    contractor_quotation_sendtoclient: "contractor_quotation_sendtoclient/",
    userbankrefnocheck: "userbankrefnocheck/",
    userbankcreate: "userbankcreate/",
    userbankupdate: "userbankupdate/",

    pckmypersonalbankrefnocheck: "pckmypersonalbankrefnocheck/",
    pckmypersonalbankupdate: "pckmypersonalbankupdate/",
    get_pckmyclientname: "get_pckmyclientname/",
    get_pckmyclientprojectname: "get_pckmyclientprojectname/",
    getuserapprovelist: "getuserapprovelist/",
    get_pckpaymenttype: "get_pckpaymenttype/",
    pckdashboard_cashinpocket: "pckdashboard_cashinpocket/",
    pckdashboard_cashinbank: "pckdashboard_cashinbank/",
    pckdashboard_cashinbank_gridlist: "pckdashboard_cashinbank_gridlist/",
    pckdashboard_cashinpocket_details: "pckdashboard_cashinpocket_details/",
    pckdashboard_cashinpocket_gridlist: "pckdashboard_cashinpocket_gridlist/",
    get_pckpaymentgroup: "get_pckpaymentgroup/",
    architect_budget_create: "architect_budget_create/",
    pck_companysource_cash_verify_gridlist:
      "pck_companysource_cash_verify_gridlist/",
    pck_companysource_bank_verify_gridlist:
      "pck_companysource_bank_verify_gridlist/",
    pck_companysource_all_verified_gridlist:
      "pck_companysource_all_verified_gridlist/",

    pck_companyexpenses_cash_verify_gridlist:
      "pck_companyexpenses_cash_verify_gridlist/",
    pck_companyexpenses_bank_verify_gridlist:
      "pck_companyexpenses_bank_verify_gridlist/",
    pck_companyexpenses_all_verified_gridlist:
      "pck_companyexpenses_all_verified_gridlist/",
    get_contacttype: "get_contacttype/",
    getsc_estimation: "getsc_estimation/",
    getsc_estimationdetail: "getsc_estimationdetail/",
    getsc_estimationmaterialdetail: "getsc_estimationmaterialdetail/",
    sc_estimationsendenquiry: "sc_estimationsendenquiry/",
    contractor_getsc_estimationdetail: "contractor_getsc_estimationdetail/",
    myestimationlist: "myestimationlist/",
    contractor_sc_estimationsendenquiry: "contractor_sc_estimationsendenquiry/",
    contractor_scdesign_estimation_update:
      "contractor_scdesign_estimation_update/",
    myestimationcontractordetails: "myestimationcontractordetails/",
    get_servicename_manufacturer_poform: "get_servicename_manufacturer_poform/",
    get_categoryname_manufacturer_poform:
      "get_categoryname_manufacturer_poform/",
    get_joborderno_shiftproductionform: "get_joborderno_shiftproductionform/",
    get_widthofgpcoil_manufacturer_poform:
      "get_widthofgpcoil_manufacturer_poform/",
    get_brandname_manufacturer_poform: "get_brandname_manufacturer_poform/",
    get_gsm_manufacturer_poform: "get_gsm_manufacturer_poform/",
    get_numberofgpcoil_manufacturer_poform:
      "get_numberofgpcoil_manufacturer_poform/",
    getpropertytypename_designyourdream_enquiryform:
      "getpropertytypename_designyourdream_enquiryform/",
    getlength: "getlength/",
    getlengthinches: "getlengthinches/",
    getwidthheightfoot: "getwidthheightfoot/",
    getwidthheightinches: "getwidthheightinches/",
    mfporefnocheck: "mfporefnocheck/",
    manufacturerpoupdate: "manufacturerpoupdate/",
    manufacturerpocreate: "manufacturerpocreate/",
    get_productname_manufacturer_poform: "get_productname_manufacturer_poform/",
    get_coil_avg_thickness_calculation_manufacturer_poform:
      "get_coil_avg_thickness_calculation_manufacturer_poform/",
    get_searchresult_joborderform_report:
      "get_searchresult_joborderform_report/",
    getservicename_designyourdream_enquiryform:
      "getservicename_designyourdream_enquiryform/",
    getpropertycategoryname_designyourdream_enquiryform:
      "getpropertycategoryname_designyourdream_enquiryform/",
    getsqftcalculation: "getsqftcalculation/",
    designyourdream_enquiry_create: "designyourdream_enquiry_create/",
    contractor_scdesign_estimation_rejected_list:
      "contractor_scdesign_estimation_rejected_list/",
    getgroupname_designyourdream_enquiryform:
      "getgroupname_designyourdream_enquiryform/",
    getservicenamebrandconversionform: "getservicenamebrandconversionform/",
    pckdashboard_cashinbranch: "pckdashboard_cashinbranch/",
    pckdashboard_cashinbranch_pocket: "pckdashboard_cashinbranch_pocket/",
    pckdashboard_cashinbranch_pocket_gridlist:
      "pckdashboard_cashinbranch_pocket_gridlist/",
    pckdashboard_cashinbranch_bank_gridlist:
      "pckdashboard_cashinbranch_bank_gridlist/",
    contractor_scdesign_estimation_approved_list:
      "contractor_scdesign_estimation_approved_list/",
    pckdashboard_cashinbranch_bank: "pckdashboard_cashinbranch_bank/",
    getjobgroupname_employeeform: "getjobgroupname_employeeform/",
    getemployergroupname_employeeform: "getemployergroupname_employeeform/",
    getdesignationname_employeeform: "getdesignationname_employeeform/",
    employee_job_apply: "employee_job_apply/",
    employer_post_newjob: "employer_post_newjob/",
    appuser_new_enquiry_acceptstatus_update:
      "appuser_new_enquiry_acceptstatus_update/",
    appuser_accepted_enquiry_finallytakeproject_update:
      "appuser_accepted_enquiry_finallytakeproject_update/",
    contractor_scdesign_estimation_pending_list:
      "contractor_scdesign_estimation_pending_list/",
    appuser_accepted_enquiry_cancelandrequotation_update:
      "appuser_accepted_enquiry_cancelandrequotation_update/",
    appuser_accepted_enquiry_remove_update:
      "appuser_accepted_enquiry_remove_update/",
    appuser_rejected_enquiry_remove_update:
      "appuser_rejected_enquiry_remove_update/",
    appuser_rejected_enquiry_cancelandrequotation_update:
      "appuser_rejected_enquiry_cancelandrequotation_update/",
    appuser_accepted_enquiry_cancel_update:
      "appuser_accepted_enquiry_cancel_update/",
    mfvorefnocheck: "mfvorefnocheck/",
    get_purchaseorderno_otherdata_vendororderform:
      "get_purchaseorderno_otherdata_vendororderform/",
    get_coildetails_vendororderform: "get_coildetails_vendororderform/",
    get_slittingdetails_vendororderform: "get_slittingdetails_vendororderform/",

    get_purchaseorderno_vendororderform: "get_purchaseorderno_vendororderform/",
    get_joborderno_vendororder_invoiceform:
      "get_joborderno_vendororder_invoiceform/",
    mfvoinvoicerefnocheck: "mfvoinvoicerefnocheck/",
    get_orderproductioncalculation_vendororder_invoiceform:
      "get_orderproductioncalculation_vendororder_invoiceform/",
    employee_job_search: "employee_job_search/",
    employer_job_search: "employer_job_search/",
    employee_profile_fullview: "employee_profile_fullview/",
    get_availablebalance_cashinbank_sourceform:
      "get_availablebalance_cashinbank_sourceform/",
    get_availablebalance_cashinhand_expensesform:
      "get_availablebalance_cashinhand_expensesform/",
    get_availablebalance_cashinbank_expensesform:
      "get_availablebalance_cashinbank_expensesform/",
    getbranchlist_pckaddexpensesform: "getbranchlist_pckaddexpensesform/",
    getdesignationlist_pckaddexpensesform:
      "getdesignationlist_pckaddexpensesform/",
    client_quotation_approve: "client_quotation_approve/",
    client_quotation_reject: "client_quotation_reject/",
    getemployeelist_pckaddexpensesform: "getemployeelist_pckaddexpensesform/",
    client_mydesign_estimation_approve: "client_mydesign_estimation_approve/",
    client_mydesign_estimation_reject: "client_mydesign_estimation_reject/",
    contractor_scdesign_estimation_sendtoclient:
      "contractor_scdesign_estimation_sendtoclient/",
    contractor_scdesign_estimation_cancel:
      "contractor_scdesign_estimation_cancel/",
    contractor_createquote: "contractor_createquote/",
    contractor_get_clientdetails_quotationform:
      "contractor_get_clientdetails_quotationform/",
    getdistrictdetails_by_state_refno: "getdistrictdetails_by_state_refno/",

    contractor_quotation_send_pendng_list:
      "contractor_quotation_send_pendng_list/",
    contractor_quotation_approved_pendng_list:
      "contractor_quotation_approved_pendng_list/",
    contractor_quotation_approved_list: "contractor_quotation_approved_list/",
    contractor_quotation_rejected_list: "contractor_quotation_rejected_list/",
    contractor_getcategoryname_popup_quotationform:
      "contractor_getcategoryname_popup_quotationform/",
    contractor_getproductlist_popup_quotationform:
      "contractor_getproductlist_popup_quotationform/",
    contractor_getproductlist_quot_unit_type_refno_onchange_quotationform:
      "contractor_getproductlist_quot_unit_type_refno_onchange_quotationform/",
    contractor_quotation_create: "contractor_quotation_create/",
    contractor_quotation_contquotrefnocheck:
      "contractor_quotation_contquotrefnocheck/",
    contractor_quotation_update: "contractor_quotation_update/",
    clientcreate: "clientcreate/",
    contractor_get_clientname_quotationform:
      "contractor_get_clientname_quotationform/",
    getservicename_dealerproductlist: "getservicename_dealerproductlist/",
    filterservicerefno_dealerproductlist:
      "filterservicerefno_dealerproductlist/",
    getcategoryname_dealerproductlist: "getcategoryname_dealerproductlist/",
    getbrandname_dealerproductlist: "getbrandname_dealerproductlist/",
    filtercategoryrefno_dealerproductlist:
      "filtercategoryrefno_dealerproductlist/",
    filterbrandrefno_dealerproductlist: "filterbrandrefno_dealerproductlist/",
    dealercompanybasicdetailscreate: "dealercompanybasicdetailscreate/",
    architect_get_clientname_budgetform: "architect_get_clientname_budgetform/",
    architect_get_unitofsales_budgetform:
      "architect_get_unitofsales_budgetform/",
    architect_budget_send_pendng_list: "architect_budget_send_pendng_list/",
    architect_budget_approved_pendng_list:
      "architect_budget_approved_pendng_list/",
    architect_budgetboq_approved_list: "architect_budgetboq_approved_list/",
    architect_get_clientdetails_budgetform:
      "architect_get_clientdetails_budgetform/",
    architect_getservicename_popup_budgetform:
      "architect_getservicename_popup_budgetform/",
    architect_getcategoryname_popup_budgetform:
      "architect_getcategoryname_popup_budgetform/",
    architect_getproductlist_popup_budgetform:
      "architect_getproductlist_popup_budgetform/",

    contractor_get_clientname_quotationform:
      "contractor_get_clientname_quotationform/",
    getservicename_dealerproductlist: "getservicename_dealerproductlist/",
    filterservicerefno_dealerproductlist:
      "filterservicerefno_dealerproductlist/",
    getcategoryname_dealerproductlist: "getcategoryname_dealerproductlist/",
    getbrandname_dealerproductlist: "getbrandname_dealerproductlist/",
    filtercategoryrefno_dealerproductlist:
      "filtercategoryrefno_dealerproductlist/",
    filterbrandrefno_dealerproductlist: "filterbrandrefno_dealerproductlist/",
    dealercompanybasicdetailscreate: "dealercompanybasicdetailscreate/",
    ratecard_contractorproductrefnocheck:
      "ratecard_contractorproductrefnocheck/",
    getapilist: "getapilist/",
    getapitaskreport: "getapitaskreport/",
    setupoptionidcheck: "setupoptionidcheck/",
    setupupdate: "setupupdate/",
    getreferenceby_clientcreateform: "getreferenceby_clientcreateform/",

    contractor_sendratecard_contrcrefnocheck:
      "contractor_sendratecard_contrcrefnocheck/",
    contractor_get_clientdetails_sendratecardform:
      "contractor_get_clientdetails_sendratecardform/",
    contractor_getcategoryname_popup_sendratecardform:
      "contractor_getcategoryname_popup_sendratecardform/",
    contractor_getproductlist_popup_sendratecardform:
      "contractor_getproductlist_popup_sendratecardform/",
    contractor_getproductlist_rc_unit_type_refno_onchange_sendratecardform:
      "contractor_getproductlist_rc_unit_type_refno_onchange_sendratecardform/",
    contractor_sendratecard_create: "contractor_sendratecard_create/",
    contractor_sendratecard_update: "contractor_sendratecard_update/",
    getexpensesto_pckaddexpensesform: "getexpensesto_pckaddexpensesform/",
    getfollowupcustomerlist_pckaddexpensesform:
      "getfollowupcustomerlist_pckaddexpensesform/",
    employee_mycustomerlist: "employee_mycustomerlist/",
    employee_activity_report: "employee_activity_report/",
    employeeactivity_myemployeeactivityrefnocheck:
      "employeeactivity_myemployeeactivityrefnocheck/",
    architect_budget_budgetrefnocheck: "architect_budget_budgetrefnocheck/",
    architect_budget_sendtoclient: "architect_budget_sendtoclient/",
    employee_create_customerdata: "employee_create_customerdata/",
    client_mybudget_list: "client_mybudget_list/",
    client_budget_view: "client_budget_view/",
    client_budget_popup_approve: "client_budget_popup_approve/",
    client_budget_popup_reject: "client_budget_popup_reject/",
    architect_budget_finallytakeproject_update:
      "architect_budget_finallytakeproject_update/",
    architect_budget_cancel: "architect_budget_cancel/",
    architect_boq_cancel: "architect_boq_cancel/",
    getboqtype_architect_boq_popup_generateform:
      "getboqtype_architect_boq_popup_generateform/",
    architect_boq_generate: "architect_boq_generate/",
    architect_boq_view: "architect_boq_view/",
    client_boq_view: "client_boq_view/",
    getpurposeofvisit_pckaddexpensesform: "getpurposeofvisit_pckaddexpensesform/",
  };

  createDFPocketDairy(resource, params) {
    return axios.post(`${BASE_URL_PocketDiary}/${resource}`, params);
  }
  createDFClient(resource, params) {
    return axios.post(`${BASE_URL_CLIENT}/${resource}`, params);
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
  createDFManufacturer(resource, params) {
    return axios.post(`${BASE_URL_Manufacturer}/${resource}`, params);
  }
  convert(params, isImageReplaced, filePath) {
    const datas = new FormData();
    datas.append("data", JSON.stringify(params));
    datas.append(
      "profile_photo",
      isImageReplaced
        ? {
          name: "appimage1212.jpg",
          type: filePath.type + "/*",
          uri:
            Platform.OS === "android"
              ? filePath.uri
              : filePath.uri.replace("file://", ""),
        }
        : ""
    );
    return datas;
  }
  async updateEmployee(
    basic,
    work,
    pay,
    isImageReplaced,
    filePath,
    logoImage,
    unload
  ) {
    try {
      const empbasicdata = await axios.post(
        `${BASE_URL}/employeebasicdataupdate/`,
        this.convert(basic, isImageReplaced, filePath),
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const workData = await axios.post(`${BASE_URL}/employeeworkdataupdate/`, {
        data: work,
      });
      const payDetails = await axios.post(
        `${BASE_URL}/employeepaydataupdate/`,
        { data: pay }
      );
      return {
        sucess:
          empbasicdata.data.status === "Success" &&
          workData.data.status === "Success" &&
          payDetails.data.status === "Success",
      };
    } catch (e) {
      console.log(e);
      unload();
    }
  }

  async getEmployeebasicDetails(params, unload) {
    try {
      const empdata = await axios.post(
        `${BASE_URL}/getemployeepaydata/`,
        params
      );
      const empbasicdata = await axios.post(
        `${BASE_URL}/getemployeebasicdata/`,
        params
      );
      const workdata = await axios.post(
        `${BASE_URL}/getemployeeworkdata/`,
        params
      );
      const payDetails = await axios.post(
        `${BASE_URL}/getemployeepaydata/`,
        params
      );
      const reportingDetails = await axios.post(
        `${BASE_URL}/getreportingtoemployeeworkform/`,
        params
      );
      return {
        empbasicdata: empbasicdata.data.data,
        workdata: workdata.data.data,
        payDetails: payDetails.data.data,
        reportingDetails: reportingDetails.data.data,
        empdata: empdata.data.data,
      };
    } catch (e) {
      console.log(e);
      unload();
    }
  }

  async getEnquiriesList(params, unload) {
    try {
      const newEnq = await axios.post(
        `${BASE_URL_Contractor}/appuser_new_enquiry_list/`,
        params
      );
      const acceptedEnq = await axios.post(
        `${BASE_URL_Contractor}/appuser_accepted_enquiry_list/`,
        params
      );
      const rejectedEnq = await axios.post(
        `${BASE_URL_Contractor}/appuser_rejected_enquiry_list/`,
        params
      );
      return {
        newEnq: newEnq.data.data ? newEnq.data.data : [],
        acceptedEnq: acceptedEnq.data.data ? acceptedEnq.data.data : [],
        rejectedEnq: rejectedEnq.data.data ? rejectedEnq.data.data : [],
      };
    } catch (e) {
      console.log(e);
      return;
    }
  }

  async getdropdowndata(params, unload) {
    try {
      const clients = await axios.post(
        `${BASE_URL_Contractor}/contractor_get_clientname_quotationform/`,
        params
      );
      const states = await axios.post(`${BASE_URL}/getstatedetails/`, params);
      const units = await axios.post(
        `${BASE_URL_Contractor}/contractor_get_unitofsales_quotationform/`,
        params
      );
      const services = await axios.post(
        `${BASE_URL_Contractor}/contractor_getservicename_popup_quotationform/`,
        params
      );

      return {
        clients: clients.data.data ? clients.data.data : [],
        states: states.data.data ? states.data.data : [],
        units: units.data.data ? units.data.data : [],
        services: services.data.data ? services.data.data : [],
      };
    } catch (e) {
      console.log(e);
      return;
    }
  }

  async getdropdownratecarddata(params, unload) {
    try {
      const clients = await axios.post(
        `${BASE_URL_Contractor}/contractor_get_clientname_sendratecardform/`,
        params
      );
      const states = await axios.post(`${BASE_URL}/getstatedetails/`, params);
      const units = await axios.post(
        `${BASE_URL_Contractor}/contractor_get_unitofsales_sendratecardform/`,
        params
      );
      const services = await axios.post(
        `${BASE_URL_Contractor}/contractor_getservicename_popup_sendratecardform/`,
        params
      );

      return {
        clients: clients.data.data ? clients.data.data : [],
        states: states.data.data ? states.data.data : [],
        units: units.data.data ? units.data.data : [],
        services: services.data.data ? services.data.data : [],
      };
    } catch (e) {
      console.log(e);
      return;
    }
  }

  async getmyestimation(params, unload) {
    try {
      const newEnq = await axios.post(
        `${BASE_URL_CLIENT}/client_mydesign_estimation_pendinglist/`,
        params
      );
      const acceptedEnq = await axios.post(
        `${BASE_URL_CLIENT}/client_mydesign_estimation_approvedlist/`,
        params
      );
      const rejectedEnq = await axios.post(
        `${BASE_URL_CLIENT}/client_mydesign_estimation_rejectedlist/`,
        params
      );

      return {
        newEnq: newEnq.data.data ? newEnq.data.data : [],
        acceptedEnq: acceptedEnq.data.data ? acceptedEnq.data.data : [],
        rejectedEnq: rejectedEnq.data.data ? rejectedEnq.data.data : [],
      };
    } catch (e) {
      console.log(e);
      return;
    }
  }

  async getmyquotation(params, unload) {
    try {
      const newEnq = await axios.post(
        `${BASE_URL_CLIENT}/client_quotation_pendinglist/`,
        params
      );
      const acceptedEnq = await axios.post(
        `${BASE_URL_CLIENT}/client_quotation_approvedlist/`,
        params
      );
      const rejectedEnq = await axios.post(
        `${BASE_URL_CLIENT}/client_quotation_rejectedlist/`,
        params
      );

      return {
        newEnq: newEnq.data.data ? newEnq.data.data : [],
        acceptedEnq: acceptedEnq.data.data ? acceptedEnq.data.data : [],
        rejectedEnq: rejectedEnq.data.data ? rejectedEnq.data.data : [],
      };
    } catch (e) {
      console.log(e);
      return;
    }
  }

  async getcontractordesignwise(params, unload) {
    try {
      const gallery = await axios.post(
        `${BASE_URL_Contractor}/contractor_get_servicewise_design/`,
        params
      );
      // const pending = await axios.post(
      //   `${BASE_URL_Contractor}/contractor_scdesign_estimation_pending_list/`,
      //   params
      // );
      // const accepted = await axios.post(
      //   `${BASE_URL_Contractor}/contractor_scdesign_estimation_approved_list/`,
      //   params
      // );
      // const rejected = await axios.post(
      //   `${BASE_URL_Contractor}/contractor_scdesign_estimation_rejected_list/`,
      //   params
      // );
      const response = await axios.post(
        `${BASE_URL_Contractor}/get_clientresponsetypelist/`,
        params
      );
      return {
        gallery: gallery.data.data ? gallery.data.data : [],
        response: response.data.data ? response.data.data : [],
      };
    } catch (e) {
      console.log(e);
      return;
    }
  }

  async getcontractorquotationwise(params, unload) {
    try {
      // const approvedPending = await axios.post(
      //   `${BASE_URL_Contractor}/contractor_quotation_approved_pendng_list/`,
      //   params,
      // );
      // const sendPending = await axios.post(
      //   `${BASE_URL_Contractor}/contractor_quotation_send_pendng_list/`,
      //   params,
      // );
      // const approved = await axios.post(
      //   `${BASE_URL_Contractor}/contractor_quotation_approved_list/`,
      //   params,
      // );
      // const rejected = await axios.post(
      //   `${BASE_URL_Contractor}/contractor_quotation_rejected_list/`,
      //   params,
      // );
      const response = await axios.post(
        `${BASE_URL_Contractor}/get_clientresponsetypelist/`,
        params
      );
      return {
        response: response.data.data ? response.data.data : [],
      };
    } catch (e) {
      console.log(e);
      return;
    }
  }

  async getpurchaseorderlist(params, unload, error) {
    try {
      const orderdata = await axios.post(
        `${BASE_URL_Manufacturer}/mfporefnocheck/`,
        params
      );
      const vendordata = await axios.post(
        `${BASE_URL_Manufacturer}/get_vendorcompanyname_manufacturer_poform/`,
        params
      );
      const supplierdata = await axios.post(
        `${BASE_URL_Manufacturer}/get_suppliername_manufacturer_poform/`,
        params
      );
      unload();
      return {
        order: orderdata.data.data,
        vendor: vendordata.data.data,
        supplier: supplierdata.data.data,
      };
    } catch (e) {
      console.log(e);
      error();
      unload();
    }
  }

  async getbrandvalueconversion(params, unload) {
    try {
      const servicename = await axios.post(
        `${BASE_}/apimanufacturer/spawu7S4urax/tYjD/getservicenamebrandconversionform/`,
        params
      );
      unload();
      return servicename.data.data;
    } catch (e) {
      console.log(e);
      unload();
    }
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

  createDFArchitect(resource, params) {
    if (params) {
      return axios.post(`${BASE_URL_Architect}/${resource}`, params);
    } else {
      return axios.post(`${BASE_URL_Architect}/${resource}`);
    }
  }

  createDFArchitectWithHeader(resource, params) {
    if (params) {
      return axios.post(`${BASE_URL_Architect}/${resource}`, params, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      return axios.post(`${BASE_URL_Architect}/${resource}`, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
  }

  createDFEmployee(resource, params) {
    if (params) {
      return axios.post(`${BASE_URL_Employee}/${resource}`, params);
    } else {
      return axios.post(`${BASE_URL_Employee}/${resource}`);
    }
  }

  createDFArchitectWithHeader(resource, params) {
    if (params) {
      return axios.post(`${BASE_URL_Architect}/${resource}`, params, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else {
      return axios.post(`${BASE_URL_Architect}/${resource}`, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
  }

  createDFContractor(resource, params) {
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
      return axios.post(`${BASE_URL_Dashboard}/${resource}`, params, {
        timeout: timeoutLimit,
      });
    } else {
      return axios.post(`${BASE_URL_Dashboard}/${resource}`, {
        timeout: timeoutLimit,
      });
    }
  }

  checkServerActive() {
    // axios.get(onePixelImage)
    //   .then(response => {
    //     console.log(response);
    //     if (response.status >= 200 && response.status < 300) {
    //       console.log('Image is available on server');
    //     } else {
    //       console.log('Image is not available on server');
    //     }
    //   })
    //   .catch(error => {
    //     console.log('Error checking image availability', error);
    //   });
    axios
      .get(onePixelImage, { timeout: timeoutLimit })
      .then((response) => {
        // Handle successful response
      })
      .catch((error) => {
        if (error.code === "ECONNABORTED") {
          console.log("Request timed out");
        } else {
          console.log("Error occurred", error);
        }
      });
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
