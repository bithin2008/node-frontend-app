import { environment } from "@env/environment";

export const AppConfig = {
    name: environment.name,
    production: environment.production,
    productName: 'First Premier Home Warranty ',
    copyrightInfo: 'Copyright &copy; 2023 United Exploration India',
    apiBaseUrl: environment.apiBaseUrl,
    useMockServer: environment.useMockServer,
    version: environment.version,
    siteKey: environment.siteKey,
    timestamp: '',
    maintenanceMode: false,
    apiUrl: {
        common: {
            getAllPlans: 'frontend/common/get-plans',
            getAllReviews: 'frontend/common/get-all-reviews',
            verifyRecaptcha: 'frontend/common/verify-recaptcha',
            locationByZip: 'frontend/common/location-by-zip',
            searchZipcode: 'frontend/common/search-zipcode',
            getAllProducts: 'frontend/common/get-all-products',
            getAllAddonProducts: 'frontend/common/get-addon-products',
            getAllPosts: 'frontend/common/get-all-posts',
            getPostsDetails: 'frontend/common/get-post-by-slug',
            getAllpropertyTypes: 'frontend/common/property-type',
            getAllMarketLeaders: 'frontend/common/get-all-market-leaders',
            getPageDetails: 'frontend/common/get-page-details',

        },
        lead: {
            createUpdateLead: 'frontend/customer-funnel/create-update-lead',
            createUpdateLeadByField: 'frontend/customer-funnel/create-update-lead-by-field',
            getLeadDetailsByEmailAndSessionId: 'frontend/customer-funnel/get-lead-details'
        },
        policy: {
            createPolicy: 'frontend/policies/create-policy',
            getPaymentLinkData: 'admin/policy/get-payment-link-data',

        },
        payments: {
            bankDebit: 'admin/secure-payments/debit-bank-account',
            creditCard: 'admin/secure-payments/charge-credit-card',
            linkPayment: 'admin/secure-payments/link-payment'
        },
        policyTerm: {
            getAllPolicyTerms: 'frontend/plan-terms/get-all-plan-terms',
        },
        contractors: {
            createContractor: 'frontend/contractors/create-contractor',
            uploadLicense: 'frontend/contractors/upload-license',
        },
        careers: {
            submitCareer: 'frontend/careers/submit-career',
            uploadResume: 'frontend/careers/upload-resume',
        },
        contacts: {
            submitContact: 'frontend/contacts/submit-contact'
        },
        affiliates: {
            submitAffiliate: 'frontend/affiliates/submit-affiliate'
        },
        realEstate: {
            submitRealEstateProfessional: 'frontend/real-estate-professionals/submit-real-estate-professional',

        },
        customerPortal: {
            // Authentication, JWT Validation
            authenticateCustomerLogin: 'frontend/customer-portal/login-customer-portal',
            validateOTP: 'frontend/customer-portal/validate-customer-login-otp',
            validateToken: 'frontend/customer-portal/verify-customer-portal-token',
            forgotPasswordLink: 'frontend/customer-portal/gen-customer-forgot-pass-link',
            updatePassword: 'frontend/customer-portal/update-customer-password',
            getSystemAdmin: 'frontend/customer-portal/get-all-system-admin',
            logout: 'frontend/customer-portal/customer-portal-logout',
            resendLoginOtp: `frontend/customer-portal/resend-customer-login-otp`,
            changProfilePassword: `frontend/customer-portal/change-profile-password`,
            getCustomerDetails: `frontend/customer-portal/customer-details`,// :customer_id
            updateCustomerProfile: `frontend/customer-portal/update-customer-profile`,

            updatePolicyInfo: `frontend/customer-portal/update-policy-info`,
            getLastLogin: 'frontend/customer-portal/customer-portal-last-login',
            getAllCustomerCards: `frontend/customer-portal/get-all-cards`,
            getAllCustomerClaims: `frontend/customer-portal/get-all-claims`,
            createNewCard: `frontend/customer-portal/create-card`,
            createReferFriend: `frontend/customer-portal/create-refer-friend`,
            policyDetails: `frontend/customer-portal/policy-details`,
            createClaim:`frontend/customer-portal/create-claim`,
            rePayment:`frontend/customer-portal/re-payments`,
            getProductProblems:`frontend/customer-portal/get-product-problems`,
            createPolicy: 'frontend/customer-portal/create-policy',
            updatePrimaryCard: 'frontend/customer-portal/update-primary-card'
            //  changProfilePassword: `frontend/customer-portal/change-profile-password`,
        },
        realtorPortal: {
            // Authentication, JWT Validation
            authenticateRealtorLogin: 'frontend/real-estate-professionals/login-realestate-pro-portal',
            validateOTP: 'frontend/real-estate-professionals/validate-realestate-pro-login-otp',
            validateToken: 'frontend/real-estate-professionals/verify-realestate-pro-portal-token',
            forgotPasswordLink: 'frontend/real-estate-professionals/gen-realestate-pro-forgot-pass-link',
            updatePassword: 'frontend/real-estate-professionals/update-realestate-pro-password',
            getSystemAdmin: 'frontend/customer-portal/get-all-system-admin',
            logout: 'frontend/real-estate-professionals/realestate-pro-portal-logout',
            resendLoginOtp: `frontend/real-estate-professionals/resend-realestate-pro-login-otp`,
            changProfilePassword: `frontend/real-estate-professionals/change-profile-password`,
            getRealtorDetails: `frontend/real-estate-professionals/realtor-details`,// :customer_id
            updateRealtorProfile: `frontend/real-estate-professionals/update-realestate-pro-profile`,
            updatePolicyInfo: `frontend/customer-portal/update-policy-info`,
            getLastLogin: 'frontend/real-estate-professionals/realestate-pro-portal-last-login',
            getAllRealtorPolicies: `frontend/real-estate-professionals/get-all-realestate-pro-policies`,
            getAllCustomerCards: `frontend/customer-portal/get-all-cards`,
            getAllCustomerClaims: `frontend/customer-portal/get-all-claims`,
            createNewCard: `frontend/customer-portal/create-card`,
            createReferFriend: `frontend/customer-portal/create-refer-friend`,
            policyDetails: `frontend/real-estate-professionals/policy-details`,
            createClaim:`frontend/customer-portal/create-claim`,
            rePayment:`frontend/customer-portal/re-payments`,
            createPolicy: 'frontend/real-estate-professionals/create-policy',
            getAllRealtorPolicyPaidAmount: 'frontend/real-estate-professionals/get-all-realtor-policy-paid-amount',
            getAllRealtorPolicyDueAmount: 'frontend/real-estate-professionals/get-all-realtor-policy-due-amount',
            generateEscrowInvoice:`frontend/real-estate-professionals/escrow-invoice-generate`,//:policy_id
            generatePaymentReceipt:`frontend/real-estate-professionals/payment-receipt-generate`//:policy_id
            //  changProfilePassword: `frontend/customer-portal/change-profile-password`,
        },

        // Authentication, JWT Validation
        authenticate: 'auth/authenticate',
        validateToken: 'auth/validateToken',
        validateRolePermissions: 'auth/validateRolePermissions',
        checkEmail: 'auth/checkEmail',
        resetPassword: 'auth/resetPassword',

        // CMS
        dashboardStat: 'cms/getDashboardStat',
        getPosts: 'cms/getPosts',
        getHolidays: 'cms/getHolidays',
        addPost: 'cms/createPost',
        updatePost: 'cms/updatePost',
        deletePost: 'cms/deletePost',
        getContentCalendar: 'cms/getCalendar',
        addContentCalendar: 'cms/addCalendar',
        editContentCalendar: 'cms/editCalendar',
        deleteContentCalendar: 'cms/deleteCalendar',
        addHoliday: 'cms/addHoliday',
        updateHoliday: 'cms/updateHoliday',
        deleteHoliday: 'cms/deleteHoliday',
        getEvents: 'cms/getEvents',

        // User
        getUsers: 'user/getUser',
        userFormData: 'user/userFormData',
        markAsRead: 'cms/markAsRead',
        addUser: 'user/createUser',
        userDetails: 'user/userDetails',
        getMyProfile: 'user/myProfile',
        changePassword: 'user/changePassword',
        userData: 'user/userData',
        updateUserData: 'user/updateUserData',
        updateUser: 'user/updateUser',
        updateUserStatus: 'user/updateUserStatus',
        userDropdown: 'user/userDropdown',
        searchUser: 'user/search',
        approvers: 'user/approvers',
        changeApprovers: 'user/changeApprovers',
        getEmployees: 'user/getEmp',
        getReportees: 'user/getReportees',
        saveLeaveBalance: 'user/saveLeaveBalance',
        userAnalytics: 'user/userAnalytics',

        // Address
        getAddress: 'address/getAddress',
        addAddress: 'address/createAddress',
        updateAddress: 'address/updateAddress',
        deleteAddress: 'address/deleteAddress',


        // Academic
        academicFormData: 'academic/formData',
        getEducation: 'academic/getAcademicRecord',
        addEducation: 'academic/createAcademicRecord',
        updateEducation: 'academic/updateAcademicRecord',
        deleteEducation: 'academic/deleteAcademicRecord',

        // Work Experience
        experienceFormData: 'workexperience/formData',
        getExperience: 'workexperience/getExperience',
        addExperience: 'workexperience/createExperience',
        updateExperience: 'workexperience/updateExperience',
        deleteExperience: 'workexperience/deleteExperience',

        // Payroll
        payrollFormData: 'payroll/formData',
        getPayroll: 'payroll/getPayroll',
        addPayroll: 'payroll/createPayroll',
        updatePayroll: 'payroll/updatePayroll',
        deletePayroll: 'payroll/deletePayroll',

        // Emergency Contact
        emergencyContactFormData: 'contact/formData',
        getEmergencyContact: 'contact/getContact',
        addEmergencyContact: 'contact/createContact',
        updateEmergencyContact: 'contact/updateContact',
        deleteEmergencyContact: 'contact/deleteContact',

        // Timesheet
        timesheetFormData: 'timesheet/formData',
        getTimesheet: 'timesheet/getTimesheet',
        addTimesheet: 'timesheet/createTimesheet',
        updateTimesheet: 'timesheet/updateTimesheet',
        deleteTimesheet: 'timesheet/deleteTimesheet',
        timesheetReport: 'timesheet/getReport',

        // Project Timesheet
        projectDropdown: 'project/projectDropdown',
        getProject: 'project/getProject',
        addProject: 'project/createProject',
        updateProject: 'project/updateProject',
        deleteProject: 'project/deleteProject',
        timesheetChartData: 'timesheet/timesheetChartData',

        // Timesheet Project Tasks
        taskFormData: 'task/formData',
        getTask: 'task/getTask',
        addTask: 'task/createTask',
        updateTask: 'task/updateTask',
        deleteTask: 'task/deleteTask',

        // Leave Management
        getLeaves: 'leave/getLeave',
        applyLeave: 'leave/createLeave',
        updateLeave: 'leave/updateLeave',
        getLeaveFormData: 'leave/getLeaveFormData',
        getEmpLeaveBalance: 'leave/getEmpLeaveBalance',
        uploadLeaveData: 'leave/uploadLeaveData',

        //Settings
        getSettings: 'settings/getSiteSettings',
        updateSiteSettings: 'settings/updateSiteSettings'
    }
};
