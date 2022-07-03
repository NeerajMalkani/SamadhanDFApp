export const MenuItemsAdmin = [
  {
    title: "Master",
    icon: "diamond-stone",
    type: "accordian",
    index: 1,
    roleID: 1,
    items: [
      {
        title: "Activity",
        type: "accordian",
        index: 10,
        navigation: "ActivityRolesScreen",
      },
      {
        title: "Service",
        type: "accordian",
        index: 11,
        navigation: "ServicesScreen",
      },
      {
        title: "Unit Of Sales",
        type: "accordian",
        index: 12,
        navigation: "UnitOfSalesScreen",
      },
      {
        title: "Category",
        type: "accordian",
        index: 13,
        navigation: "CategoryScreen",
      },
      {
        title: "Product",
        type: "accordian",
        index: 14,
        navigation: "ProductScreen",
      },
      {
        title: "Service Product",
        type: "accordian",
        index: 15,
        navigation: "ServiceProductScreen",
      },
      {
        title: "Department",
        type: "accordian",
        index: 16,
        navigation: "DepartmentScreen",
      },
      {
        title: "Location Type",
        type: "accordian",
        index: 17,
        //navigation: "LocationTypeScreen",
      },
      {
        title: "Designation",
        type: "accordian",
        index: 18,
        navigation: "DesignationScreen",
      },
      {
        title: "E-Way Bill",
        type: "accordian",
        index: 19,
        //navigation: "EWayBillScreen",
      },
    ],
  },
  {
    title: "Users",
    icon: "account-group-outline",
    type: "accordian",
    index: 2,
    roleID: 1,
    items: [
      {
        title: "Pending",
        type: "accordian",
        index: 20,
        //navigation: "PendingScreen",
      },
      {
        title: "Approved",
        type: "accordian",
        index: 21,
        //navigation: "ApprovedScreen",
      },
      {
        title: "Declined",
        type: "accordian",
        index: 22,
        //navigation: "DeclinedScreen",
      },
    ],
  },
  {
    title: "Service Catalogue",
    icon: "tag-outline",
    type: "accordian",
    index: 3,
    roleID: 1,
    items: [
      {
        title: "Work Floor",
        type: "accordian",
        index: 30,
        //navigation: "WorkFloorScreen",
      },
      {
        title: "Work Location",
        type: "accordian",
        index: 31,
        //navigation: "WorkLocationScreen",
      },
      {
        title: "Design Type",
        type: "accordian",
        index: 32,
        //navigation: "DesignTypeScreen",
      },
      {
        title: "Materials Setup",
        type: "accordian",
        index: 33,
        //navigation: "MaterialsSetupScreen",
      },
      {
        title: "Post New Design",
        type: "accordian",
        index: 34,
        navigation: "PostNewDesignScreen",
      },
    ],
  },
  {
    title: "Enquiries & Status",
    icon: "format-list-bulleted",
    type: "accordian",
    index: 4,
    roleID: 1,
    items: [
      {
        title: "General Enquiry",
        type: "accordian",
        index: 40,
        //navigation: "GeneralEnquiryScreen",
      },
      {
        title: "BOQ Enquiry",
        type: "accordian",
        index: 41,
        //navigation: "BOQEnquiryScreen",
      },
    ],
  },
];

export const MenuItemsGeneralUser = [
  {
    title: "Brands & Prodcuts",
    icon: "gift-outline",
    type: "accordian",
    index: 1,
    roleID: 2,
    items: [
      {
        title: "Image Gallery",
        type: "accordian",
        index: 10,
        navigation: "ImageGalleryScreen",
      },
      {
        title: "Your Estimations",
        type: "accordian",
        index: 11,
        navigation: "YourEstimationsScreen",
      },
    ],
  },
];

export const MenuItemsDealer = [
  {
    title: "Company Profile",
    icon: "gift-outline",
    type: "accordian",
    index: 1,
    roleID: 4,
    items: [
      {
        title: "Basic Details",
        type: "accordian",
        index: 10,
        navigation: "BasicDetailsDealerScreen",
      },
      {
        title: "My Services",
        type: "accordian",
        index: 11,
        navigation: "MyServicesDealerScreen",
      },
      {
        title: "Presentation",
        type: "accordian",
        index: 12,
        //navigation: "PresentationScreen",
      },
      {
        title: "Buyer Category",
        type: "accordian",
        index: 13,
        //navigation: "BuyerCategoryScreen",
      },
    ],
  },
  {
    title: "Brand & Product",
    icon: "gift-outline",
    type: "accordian",
    index: 2,
    roleID: 4,
    items: [
      {
        title: "Brand Master",
        type: "accordian",
        index: 20,
        //navigation: "BrandMasterScreen",
      },
      {
        title: "Barnd",
        type: "accordian",
        index: 21,
        //navigation: "BarndScreen",
      },
      {
        title: "Product",
        type: "accordian",
        index: 22,
        //navigation: "ProductScreen",
      },
    ],
  },
  {
    title: "Employee",
    icon: "gift-outline",
    type: "accordian",
    index: 3,
    roleID: 4,
    items: [
      {
        title: "Employee New / List",
        type: "accordian",
        index: 30,
        //navigation: "AddEmployeeScreen",
      },
      {
        title: "Employee Report",
        type: "accordian",
        index: 31,
        //navigation: "EmployeeReportScreen",
      },
    ],
  },
  {
    title: "Organization",
    icon: "gift-outline",
    type: "accordian",
    index: 4,
    roleID: 4,
    items: [
      {
        title: "Add Department",
        type: "accordian",
        index: 40,
        //navigation: "AddDepartmentScreen",
      },
      {
        title: "Add Branch",
        type: "accordian",
        index: 41,
        //navigation: "AddBranchScreen",
      },
      {
        title: "Add Designation",
        type: "accordian",
        index: 42,
        //navigation: "AddDesignationScreen",
      },
    ],
  },
  {
    title: "Client",
    icon: "gift-outline",
    type: "accordian",
    index: 5,
    roleID: 4,
    items: [
      {
        title: "Client List",
        type: "accordian",
        index: 50,
        //navigation: "ClientListScreen",
      },
    ],
  },
  {
    title: "Purchase",
    icon: "gift-outline",
    type: "accordian",
    index: 6,
    roleID: 4,
    items: [
      {
        title: "Create Purchase Order",
        type: "accordian",
        index: 60,
        //navigation: "CreatePurchaseOrderScreen",
      },
    ],
  },
];

export const MenuItemsContractor = [
  {
    title: "Company Profile",
    icon: "gift-outline",
    type: "accordian",
    index: 1,
    roleID: 3,
    items: [
      {
        title: "Basic Details",
        type: "accordian",
        index: 10,
        navigation: "BasicDetailsContractorScreen",
      },
      {
        title: "My Services",
        type: "accordian",
        index: 11,
        navigation: "MyServicesContractorScreen",
      },
    ],
  },
  {
    title: "Employee",
    icon: "gift-outline",
    type: "accordian",
    index: 2,
    roleID: 3,
    items: [
      {
        title: "Employee New / List",
        type: "accordian",
        index: 20,
        //navigation: "AddEmployeeScreen",
      },
      {
        title: "Employee Report",
        type: "accordian",
        index: 21,
        //navigation: "EmployeeReportScreen",
      },
    ],
  },
  {
    title: "Organization",
    icon: "gift-outline",
    type: "accordian",
    index: 3,
    roleID: 3,
    items: [
      {
        title: "Add Department",
        type: "accordian",
        index: 30,
        //navigation: "AddDepartmentScreen",
      },
      {
        title: "Add Branch",
        type: "accordian",
        index: 31,
        //navigation: "AddBranchScreen",
      },
      {
        title: "Add Designation",
        type: "accordian",
        index: 32,
        //navigation: "AddDesignationScreen",
      },
    ],
  },
  {
    title: "Rate Card",
    icon: "gift-outline",
    type: "accordian",
    index: 4,
    roleID: 3,
    items: [
      {
        title: "Rate Card Setup",
        type: "accordian",
        index: 40,
        //navigation: "ClientListScreen",
      },
      {
        title: "Send Rate Card",
        type: "accordian",
        index: 41,
        //navigation: "ClientListScreen",
      },
    ],
  },
  {
    title: "Client",
    icon: "gift-outline",
    type: "accordian",
    index: 5,
    roleID: 3,
    items: [
      {
        title: "Client List",
        type: "accordian",
        index: 50,
        //navigation: "ClientListScreen",
      },
    ],
  },
  {
    title: "Quotation & Enquiries",
    icon: "gift-outline",
    type: "accordian",
    index: 6,
    roleID: 3,
    items: [
      {
        title: "App User Enquiry Wise",
        type: "accordian",
        index: 60,
        //navigation: "CreatePurchaseOrderScreen",
      },
      {
        title: "Contractor Design Wise",
        type: "accordian",
        index: 61,
        //navigation: "CreatePurchaseOrderScreen",
      },
      {
        title: "Contractor Quotation Wise",
        type: "accordian",
        index: 62,
        //navigation: "CreatePurchaseOrderScreen",
      },
    ],
  },
  {
    title: "Projects",
    icon: "gift-outline",
    type: "accordian",
    index: 6,
    roleID: 3,
    items: [
      {
        title: "Yet Start",
        type: "accordian",
        index: 60,
        //navigation: "CreatePurchaseOrderScreen",
      },
      {
        title: "On Going",
        type: "accordian",
        index: 61,
        //navigation: "CreatePurchaseOrderScreen",
      },
      {
        title: "Completed",
        type: "accordian",
        index: 62,
        //navigation: "CreatePurchaseOrderScreen",
      },
    ],
  },
];
