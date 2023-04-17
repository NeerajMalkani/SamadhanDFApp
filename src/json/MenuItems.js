export const MenuItemsAdmin = [
  {
    title: "Master",
    icon: "diamond-stone",
    type: "accordian",
    index: 1,
    roleID: 2,
    items: [
      {
        title: "Activity",
        type: "accordian",
        index: 10,
        navigation: "ActivityRolesScreen",
      },
      {
        title: "ApiMaster",
        type: "accordian",
        index: 10,
        navigation: "ApiMaster",
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
    roleID: 2,
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
    roleID: 2,
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
    roleID: 2,
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
  {
    title: "Production Unit Master",
    icon: "format-list-bulleted",
    type: "accordian",
    index: 4,
    roleID: 2,
    items: [
      {
        title: "Brand Conversation Value",
        type: "accordian",
        index: 40,
        navigation: "ABrandConversationValue",
      },
      {
        title: "Width Of Gp Coil",
        type: "accordian",
        index: 41,
        navigation: "WidthOfGpCoil",
      },
      {
        title: "Mass Of Zinc Coating",
        type: "accordian",
        index: 41,
        navigation: "MassOfZincCoating",
      },
    ],
  },
  {
    title: "Pockey Dairy Master",
    icon: "format-list-bulleted",
    type: "accordian",
    index: 4,
    roleID: 2,
    items: [
      {
        title: "Category",
        type: "accordian",
        index: 40,
        navigation: "CategoryNameScreen",
      },
      {
        title: "Sub Category",
        type: "accordian",
        index: 41,
        navigation: "SubCategoryNameScreen",
      },
    ],
  },
  {
    title: "Logout",
    icon: "logout-variant",
    type: "item",
    index: 4,
    roleID: 2,
    items: null,
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
    roleID: 3,
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
  {
    title: "Pocket Dairy",
    icon: "calculator-variant",
    type: "accordian",
    index: 1,
    roleID: 3,
    items: [
      // {
      //   title: "Setting",
      //   type: "accordian",
      //   index: 10,
      //   navigation: "Demo",
      // },
      {
        title: "Category Name",
        type: "accordian",
        index: 11,
        navigation: "GCategoryNameScreen",
      },
      {
        title: "Sub Category Name",
        type: "accordian",
        index: 11,
        navigation: "GSubCategoryNameScreen",
      },
      {
        title: "My Contacts",
        type: "accordian",
        index: 11,
        navigation: "GMyContactsScreen",
      },

      {
        title: "My Bank",
        type: "accordian",
        index: 11,
        navigation: "GMyBankScreen",
      },

      {
        title: "Budget Setup",
        type: "accordian",
        index: 11,
        navigation: "BudgetSetup",
      },
      {
        title: "Add Expenses",
        type: "accordian",
        index: 11,
        navigation: "ExpensesListGeneralUserScreen",
      },
      {
        title: "Add Source",
        type: "accordian",
        index: 11,
        navigation: "SourceListGeneralUserScreen",
      },
      {
        title: "Inbox",
        type: "accordian",
        index: 11,
        navigation: "Inbox",
      },
    ],
  },
  // {
  //   title: "Demo",
  //   icon: "timetable",
  //   type: "accordian",
  //   index: 1,
  //   roleID: 3,
  //   items: [
  //     {
  //       title: "DemoPage",
  //       type: "accordian",
  //       index: 10,
  //       navigation: "Demo",
  //     },
  //     // {
  //     //   title: "Your Estimations",
  //     //   type: "accordian",
  //     //   index: 11,
  //     //   navigation: "YourEstimationsScreen",
  //     // },
  //   ],
  // },
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
        navigation: "MyServicesScreen",
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
        navigation: "BranchListScreen",
      },
      {
        title: "Add Designation",
        type: "accordian",
        index: 41,
      },
      {
        title: "Add Bank",
        type: "accordian",
        index: 31,
        navigation: "BankListScreen",
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
        title: "Client",
        type: "accordian",
        index: 50,
        navigation: "ClientScreen",
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
  {
    title: "Pocket Diary",
    icon: "calculator-variant",
    type: "accordian",
    index: 8,
    roleID: 4,
    items: [
      {
        title: "Category",
        type: "accordian",
        index: 80,
        navigation: "GCategoryNameScreen",
      },
      {
        title: "Sub-Category",
        type: "accordian",
        index: 81,
        navigation: "GSubCategoryNameScreen",
      },
      {
        title: "My Contacts",
        type: "accordian",
        index: 82,
        navigation: "GMyContactsScreen",
      },
      {
        title: "My Personal Bank",
        type: "accordian",
        index: 82,
        navigation: "MyPersonalBankScreen",
      },
      {
        title: "Add Source",
        type: "accordian",
        index: 82,
        navigation: "AddSourceList",
      },
      {
        title: "Add Expenses",
        type: "accordian",
        index: 82,
        navigation: "AddExpensesList",
      },
      {
        title: "Cash Check",
        type: "accordian",
        index: 82,
        //navigation: "CreatePurchaseOrderScreen",
      },
      {
        title: "Inbox",
        type: "accordian",
        index: 82,
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
    roleID: 5,
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
        navigation: "MyServicesScreen",
      },
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
        title: "Add Bank",
        type: "accordian",
        index: 31,
        navigation: "BankListScreen",
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
        title: "Rate Card Setup",
        type: "accordian",
        index: 40,
        //navigation: "ClientListScreen",
        navigation: "RateCardSetup",
      },
      {
        title: "Send Rate Card",
        type: "accordian",
        index: 41,
        navigation: "SendRateCard",
      },
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
    title: "Quotation & Estimation",
    icon: "newspaper-variant",
    type: "accordian",
    index: 6,
    roleID: 5,
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
    roleID: 5,
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
    roleID: 5,
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
  {
    title: "Pocket Diary",
    icon: "calculator-variant",
    type: "accordian",
    index: 8,
    roleID: 5,
    items: [
      {
        title: "Category",
        type: "accordian",
        index: 80,
        navigation: "GCategoryNameScreen",
      },
      {
        title: "Sub-Category",
        type: "accordian",
        index: 81,
        navigation: "GSubCategoryNameScreen",
      },
      {
        title: "My Contacts",
        type: "accordian",
        index: 82,
        navigation: "GMyContactsScreen",
      },
      {
        title: "My Personal Bank",
        type: "accordian",
        index: 82,
        navigation: "MyPersonalBankScreen",
      },
      {
        title: "Add Source",
        type: "accordian",
        index: 82,
        navigation: "AddSourceList",
      },
      {
        title: "Add Expenses",
        type: "accordian",
        index: 82,
        navigation: "AddExpensesList",
      },
      {
        title: "Cash Check",
        type: "accordian",
        index: 82,
        //navigation: "CreatePurchaseOrderScreen",
      },
      {
        title: "Inbox",
        type: "accordian",
        index: 82,
        //navigation: "CreatePurchaseOrderScreen",
      },
    ],
  },
];

export const MenuItemsArchitect = [
  {
    title: "My Profile",
    icon: "office-building-cog",
    type: "accordian",
    index: 1,
    roleID: 9,
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
    roleID: 9,
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
    roleID: 9,
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
    roleID: 9,
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
    roleID: 9,
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
        index: 31,
      },
      {
        title: "Add Bank",
        type: "accordian",
        index: 31,
        navigation: "BankListScreen",
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
    roleID: 9,
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
    roleID: 9,
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
    title: "Budgets & BOQs",
    icon: "head-lightbulb",
    type: "item",
    navigation: "Budget&BOQ's",
    index: 8,
    roleID: 9,
  },
];

export const MenuItemsManufacture = [
  {
    title: "Production Unit Master",
    icon: "office-building-cog",
    type: "accordian",
    index: 1,
    roleID: 7,
    items: [
      {
        title: "Brand Conversion Value",
        type: "accordian",
        index: 10,
        navigation: "BrandConversionValue",
      },
      {
        title: "Opening Stock",
        type: "accordian",
        index: 10,
        navigation: "OpeningStockList",
      },
      {
        title: "Opening Stock Scrap",
        type: "accordian",
        index: 10,
        navigation: "OpeningStockScrap",
      },
    ],
  },
  {
    title: "Employee",
    icon: "newspaper-variant",
    type: "accordian",
    index: 6,
    roleID: 7,
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
    title: "Product for Production",
    icon: "office-building-cog",
    type: "accordian",
    index: 1,
    roleID: 7,
    items: [
      // {
      //   title: "Brand Conversion Value",
      //   type: "accordian",
      //   index: 70,
      //   navigation: "BrandConversionValue",
      // },
      {
        title: "Product for Production",
        type: "accordian",
        index: 70,
        navigation: "ProductforProduction",
      },
    ],
  },
  {
    title: "Purchase Order List",
    icon: "account-tie",
    type: "accordian",
    index: 2,
    roleID: 7,
    items: [
      // {
      //   title: "Employee New / List",
      //   type: "accordian",
      //   index: 20,
      //   navigation: "EmployeeListScreen",
      // },
      // {
      //   title: "Production Order List",
      //   type: "accordian",
      //   index: 21,
      //   navigation: "ProductionOrderList",
      // },
      {
        title: "Production Order List",
        type: "accordian",
        index: 21,
        navigation: "ProductionOrderList",
      },
    ],
  },
  {
    title: "Vendor Order Form",
    icon: "town-hall",
    type: "accordian",
    index: 3,
    roleID: 7,
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
        index: 31,
      },
      {
        title: "Add Bank",
        type: "accordian",
        index: 31,
        navigation: "BankListScreen",
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
    title: "Production Status",
    icon: "card-bulleted",
    type: "accordian",
    index: 4,
    roleID: 7,
    items: [
      // {
      //   title: "Production Status",
      //     type: "accordian",
      //     index: 40,
      //     navigation: "ProductionStatus",
      // }
      // {
      //   title: "Send Rate Card",
      //   type: "accordian",
      //   index: 41,
      //   //navigation: "ClientListScreen",
      // },
      {
        title: "Production Status",
        type: "accordian",
        index: 40,
        navigation: "ProductionStatus",
      },
    ],
  },
  {
    title: "Summary Of Materials",
    icon: "tie",
    type: "accordian",
    index: 5,
    roleID: 7,
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
    title: "Reports",
    icon: "head-lightbulb",
    type: "accordian",
    index: 8,
    roleID: 7,
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

export const MenuItemsProjectSupervisor = [
  {
    title: "My Profile",
    icon: "account",
    type: "item",
    index: 4,
    roleID: 7,
    items: null,
  },
  {
    title: "Pocket Diary",
    icon: "calculator-variant",
    type: "accordian",
    index: 8,
    roleID: 7,
    items: [
      {
        title: "Category",
        type: "accordian",
        index: 80,
        navigation: "GCategoryNameScreen",
      },
      {
        title: "Sub-Category",
        type: "accordian",
        index: 81,
        navigation: "GSubCategoryNameScreen",
      },
      {
        title: "My Contacts",
        type: "accordian",
        index: 82,
        navigation: "GMyContactsScreen",
      },
      {
        title: "My Personal Bank",
        type: "accordian",
        index: 82,
        navigation: "MyPersonalBankScreen",
      },
      {
        title: "Add Source",
        type: "accordian",
        index: 82,
        navigation: "AddSourceList",
      },
      {
        title: "Add Expenses",
        type: "accordian",
        index: 82,
        navigation: "AddExpensesList",
      },
      {
        title: "Cash Check",
        type: "accordian",
        index: 82,
        //navigation: "CreatePurchaseOrderScreen",
      },
      {
        title: "Inbox",
        type: "accordian",
        index: 82,
        //navigation: "CreatePurchaseOrderScreen",
      },
    ],
  },
  {
    title: "On Going Projects",
    icon: "tools",
    type: "item",
    index: 5,
    roleID: 7,
    items: null,
  },
  {
    title: "Manufacturer",
    icon: "calculator-variant",
    type: "accordian",
    index: 6,
    roleID: 7,
    items: [
      {
        title: "Brand Coversion Value",
        type: "accordian",
        index: 80,
        navigation: "BrandConversionValue",
      },
      {
        title: "Opening Stock",
        type: "accordian",
        index: 80,
        navigation: "OpeningStockList",
      },
      {
        title: "Opening Stock Scrap",
        type: "accordian",
        index: 80,
        navigation: "OpeningStockScrap",
      },
      {
        title: "Product for Production",
        type: "accordian",
        index: 80,
        navigation: "ProductforProduction",
      },
      {
        title: "Purchase order List",
        type: "accordian",
        index: 80,
        navigation: "ProductionOrderList",
      },
      {
        title: "Job Order Form",
        type: "accordian",
        index: 80,
        navigation: "JobOrderForm",
      },
      {
        title: "Production Achieved",
        type: "accordian",
        index: 80,
        navigation: "ProductionAchieved",
      },
      {
        title: "Production Status",
        type: "accordian",
        index: 80,
        navigation: "ProductionStatus",
      },
      {
        title: "Vendor Order List",
        type: "accordian",
        index: 80,
        navigation: "VendorOrderForm",
      },
      {
        title: "Invoice Receipt List",
        type: "accordian",
        index: 80,
        navigation: "InvoiceReceiptList",
      },
      {
        title: "Summary of Materials",
        type: "accordian",
        index: 80,
        navigation: "SummaryOfMaterials",
      },
    ],
  },
];

export const MenuItemsClient = [
  {
    title: "My Client Role Activity",
    icon: "timetable",
    type: "accordian",
    index: 1,
    roleID: 8,
    items: [
      {
        title: "My Quotation",
        type: "accordian",
        index: 10,
        navigation: "QuotationWise",
      },
      {
        title: "My Design Estimation",
        type: "accordian",
        index: 11,
        navigation: "DesignWise",
      },
      {
        title: "My Budgets",
        type: "accordian",
        index: 11,
        navigation: "My Budget",
      },
      {
        title: "My On-Going Projects",
        type: "accordian",
        index: 11,
        navigation: "YourEstimationsScreen",
      },
    ],
  },
];

export const MenuItemsMarketingExecutive = [
  {
    title: "Employee Activity",
    icon: "office-building-cog",
    type: "accordian",
    index: 1,
    roleID: 7,
    items: [
      {
        title: "My Customer List",
        type: "accordian",
        index: 10,
        navigation: "CustomerList",
      },
      {
        title: "Daily Activity List",
        type: "accordian",
        index: 10,
        navigation: "DailyActivityList",
      },
      {
        title: "Activity Report",
        type: "accordian",
        index: 10,
        navigation: "ActivityReport",
      },
    ],
  },
  {
    title: "Pocket Diary",
    icon: "calculator-variant",
    type: "accordian",
    index: 8,
    roleID: 7,
    items: [
      {
        title: "Category",
        type: "accordian",
        index: 80,
        navigation: "GCategoryNameScreen",
      },
      {
        title: "Sub-Category",
        type: "accordian",
        index: 81,
        navigation: "GSubCategoryNameScreen",
      },
      {
        title: "My Contacts",
        type: "accordian",
        index: 82,
        navigation: "GMyContactsScreen",
      },
      {
        title: "My Personal Bank",
        type: "accordian",
        index: 82,
        navigation: "MyPersonalBankScreen",
      },
      {
        title: "Add Source",
        type: "accordian",
        index: 82,
        navigation: "AddSourceList",
      },
      {
        title: "Add Expenses",
        type: "accordian",
        index: 82,
        navigation: "AddExpensesList",
      },
      {
        title: "Cash Check",
        type: "accordian",
        index: 82,
        //navigation: "CreatePurchaseOrderScreen",
      },
      {
        title: "Inbox",
        type: "accordian",
        index: 82,
        //navigation: "CreatePurchaseOrderScreen",
      },
    ],
  },
];
