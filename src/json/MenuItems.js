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
        navigation: "LocationTypeScreen",
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
        navigation: "EWayBillScreen",
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
        navigation: "PendingUserScreen",
      },
      {
        title: "Approved",
        type: "accordian",
        index: 21,
        navigation: "ApprovedUserScreen",
      },
      {
        title: "Declined",
        type: "accordian",
        index: 22,
        navigation: "DeclinedUserScreen",
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
        navigation: "WorkFloorScreen",
      },
      {
        title: "Work Location",
        type: "accordian",
        index: 31,
        navigation: "WorkLocationScreen",
      },
      {
        title: "Design Type",
        type: "accordian",
        index: 32,
        navigation: "DesignTypeScreen",
      },
      {
        title: "Materials Setup",
        type: "accordian",
        index: 33,
        navigation: "MaterialSetupScreen",
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
  // {
  //   title: "Profile Update",
  //   icon: "account",
  //   type: "accordian",
  //   index: 1,
  //   roleID: 2,
  //   items: [
  //     {
  //       title: "Profile Update",
  //       type: "accordian",
  //       index: 10,
  //       navigation: "UserProfile",
  //     },
  //   ],
  // },
  {
    title: "Enquiry & Estimation",
    icon: "timetable",
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
    icon: "office-building-cog",
    type: "accordian",
    index: 1,
    roleID: 4,
    items: [
      // {
      //   title: "Basic Details",
      //   type: "accordian",
      //   index: 10,
      //   navigation: "DealerBasicDetailsScreen",
      // },
      {
        title: "My Services",
        type: "accordian",
        index: 10,
        navigation: "DealerMyServicesScreen",
      },
      {
        title: "Presentation",
        type: "accordian",
        index: 11,
        navigation: "DealerPresentationScreen",
      },
    ],
  },
  {
    title: "Brand",
    icon: "watermark",
    type: "accordian",
    index: 2,
    roleID: 4,
    items: [
      {
        title: "Brand Master",
        type: "accordian",
        index: 20,
        navigation: "DealerBrandMasterScreen",
      },
      {
        title: "Brand Setup",
        type: "accordian",
        index: 21,
        navigation: "DealerBrandSetupScreen",
      },
      {
        title: "Buyer Category",
        type: "accordian",
        index: 13,
        navigation: "DealerBuyerCategoryScreen",
      },
    ],
  },
  {
    title: "Product",
    icon: "gift",
    type: "accordian",
    index: 3,
    roleID: 4,
    items: [
      {
        title: "Product",
        type: "accordian",
        index: 31,
        navigation: "DealerProductScreen",
      },
    ],
  },
  {
    title: "Employee",
    icon: "account-tie",
    type: "accordian",
    index: 4,
    roleID: 4,
    items: [
      {
        title: "Employee New / List",
        type: "accordian",
        index: 30,
        navigation: "EmployeeListScreen",
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
    icon: "town-hall",
    type: "accordian",
    index: 5,
    roleID: 4,
    items: [
      {
        title: "Add Department",
        type: "accordian",
        index: 40,
        navigation: "CommonDepartmentScreen",
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
        navigation: "CommonDesignationScreen",
      },
    ],
  },
  {
    title: "Client",
    icon: "tie",
    type: "accordian",
    index: 6,
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
    icon: "hand-coin",
    type: "accordian",
    index: 7,
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
    icon: "office-building-cog",
    type: "accordian",
    index: 1,
    roleID: 3,
    items: [
      // {
      //   title: "Basic Details",
      //   type: "accordian",
      //   index: 10,
      //   navigation: "ContractorBasicDetailsScreen",
      // },
      {
        title: "My Services",
        type: "accordian",
        index: 10,
        navigation: "ContractorMyServicesScreen",
      },
    ],
  },
  {
    title: "Employee",
    icon: "account-tie",
    type: "accordian",
    index: 2,
    roleID: 3,
    items: [
      {
        title: "Employee New / List",
        type: "accordian",
        index: 20,
        navigation: "EmployeeListScreen",
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
    icon: "town-hall",
    type: "accordian",
    index: 3,
    roleID: 3,
    items: [
      {
        title: "Add Department",
        type: "accordian",
        index: 30,
        navigation: "CommonDepartmentScreen",
      },
      {
        title: "Add Branch",
        type: "accordian",
        index: 31,
        navigation: "BranchListScreen",
      },
      {
        title: "Add Designation",
        type: "accordian",
        index: 32,
        navigation: "CommonDesignationScreen",
      },
    ],
  },
  {
    title: "Rate Card",
    icon: "card-bulleted",
    type: "accordian",
    index: 4,
    roleID: 3,
    items: [
      {
        title: "Rate Card Setup",
        type: "accordian",
        index: 40,
        //navigation: "ClientListScreen",
        navigation:"RateCardSetup"
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
    icon: "tie",
    type: "accordian",
    index: 5,
    roleID: 3,
    items: [
      {
        title: "Clients",
        type: "accordian",
        index: 50,
        navigation: "ClientScreen",
      },
    ],
  },
  {
    title: "Quotation & Estimation",
    icon: "newspaper-variant",
    type: "accordian",
    index: 6,
    roleID: 3,
    items: [
      {
        title: "Design Wise",
        type: "accordian",
        index: 60,
        navigation: "DesignWiseScreen",
      },
      {
        title: "Quotation Wise",
        type: "accordian",
        index: 61,
        navigation: "QuotationWiseScreen",
      },
    ],
  },
  {
    title: "Enquiries",
    icon: "information",
    type: "accordian",
    index: 7,
    roleID: 3,
    items: [
      {
        title: "App User Enquiry Wise",
        type: "accordian",
        index: 70,
        navigation: "EnquiryWise",
      },
      {
        title: "Architect & Consultant-Boq",
        type: "accordian",
        index: 71,
        //navigation: "CreatePurchaseOrderScreen",
      },
    ],
  },
  {
    title: "Projects",
    icon: "head-lightbulb",
    type: "accordian",
    index: 8,
    roleID: 3,
    items: [
      {
        title: "Yet Start",
        type: "accordian",
        index: 80,
        //navigation: "CreatePurchaseOrderScreen",
      },
      {
        title: "On Going",
        type: "accordian",
        index: 81,
        //navigation: "CreatePurchaseOrderScreen",
      },
      {
        title: "Completed",
        type: "accordian",
        index: 82,
        //navigation: "CreatePurchaseOrderScreen",
      },
    ],
  },
]
export const MenuItemsArchitect = [
  {
    title: "My Profile",
    icon: "office-building-cog",
    type: "accordian",
    index: 1,
    roleID: 5,
    items: [
      // {
      //   title: "Basic Details",
      //   type: "accordian",
      //   index: 10,
      //   navigation: "ContractorBasicDetailsScreen",
      // },
      // {
      //   title: "My Services",
      //   type: "accordian",
      //   index: 10,
      //   navigation: "ContractorMyServicesScreen",
      // },
    ],
  },
  {
    title: "Production Unit Master",
    icon: "newspaper-variant",
    type: "accordian",
    index: 6,
    roleID: 5,
    items: [
      // {
      //   title: "Design Wise",
      //   type: "accordian",
      //   index: 60,
      //   navigation: "DesignWiseScreen",
      // },
      // {
      //   title: "Quotation Wise",
      //   type: "accordian",
      //   index: 61,
      //   navigation: "QuotationWiseScreen",
      // },
    ],
  },
  {
    title: "Company Profile",
    icon: "office-building-cog",
    type: "accordian",
    index: 1,
    roleID: 5,
    items: [
      // {
      //   title: "Basic Details",
      //   type: "accordian",
      //   index: 70,
      //   navigation: "ContractorBasicDetailsScreen",
      // },
      // {
      //   title: "Architect & Consultant-Boq",
      //   type: "accordian",
      //   index: 71,
      //   //navigation: "CreatePurchaseOrderScreen",
      // },
    ],
  },
  {
    title: "Employee",
    icon: "account-tie",
    type: "accordian",
    index: 2,
    roleID: 5,
    items: [
      {
        title: "Employee New / List",
        type: "accordian",
        index: 20,
        navigation: "EmployeeListScreen",
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
    icon: "town-hall",
    type: "accordian",
    index: 3,
    roleID: 5,
    items: [
      {
        title: "Add Department",
        type: "accordian",
        index: 30,
        navigation: "CommonDepartmentScreen",
      },
      {
        title: "Add Branch",
        type: "accordian",
        index: 31,
        navigation: "BranchListScreen",
      },
      {
        title: "Add Designation",
        type: "accordian",
        index: 32,
        navigation: "CommonDesignationScreen",
      },
    ],
  },
  {
    title: "Rate Card",
    icon: "card-bulleted",
    type: "accordian",
    index: 4,
    roleID: 5,
    items: [
      {
        title: " Architect Rate Card Setup",
        type: "accordian",
        index: 40,
        navigation: "ArchitectRateCardSetup",
        // navigation:"ArchitectRateCardSetup"
      },
      // {
      //   title: "Send Rate Card",
      //   type: "accordian",
      //   index: 41,
      //   //navigation: "ClientListScreen",
      // },
    ],
  },
  {
    title: "Client",
    icon: "tie",
    type: "accordian",
    index: 5,
    roleID: 5,
    items: [
      {
        title: "Clients",
        type: "accordian",
        index: 50,
        navigation: "ClientScreen",
      },
    ],
  },
  {
    title: "Budgets & BOQS",
    icon: "head-lightbulb",
    type: "accordian",
    index: 8,
    roleID: 5,
    items: [
      // {
      //   title: "Yet Start",
      //   type: "accordian",
      //   index: 80,
      //   //navigation: "CreatePurchaseOrderScreen",
      // },
      // {
      //   title: "On Going",
      //   type: "accordian",
      //   index: 81,
      //   //navigation: "CreatePurchaseOrderScreen",
      // },
      // {
      //   title: "Completed",
      //   type: "accordian",
      //   index: 82,
      //   //navigation: "CreatePurchaseOrderScreen",
      // },
    ],
  },
];

