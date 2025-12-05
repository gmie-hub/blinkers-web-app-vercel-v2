
export const routes = {
  // home: "/",
  page: {
    home: "/",
    // market: "/market/:search?",
    market: "/product-listing/:search?",
    
    productDetails: "/product-details/:id/:user_id/:title?/:description?",
    newproductDetails: "/product-details/:id",
    relatedAds: "/related-ads/:id",
    review: "/review/:id",
    productReview: "/product-review/:id",
    sellersProfile: "/seller-profile/:id",
    posetedAdsBySeller: "/seller-ads/:id",
    writeReviewSeller: "/review-seller/:id",
    writeReviewForBusiness: "/write-review/:id",
    ContactUs: "/contact-us",
    AboutUS: "/about-us",
    faq: "/faq",
    notifications:"/notifications",
    viewNotification:"/notifications/:id",
    terms:"/terms-conditions",
    safetyTips:"/safety-tips",
    howToBuy:"/how-to-buy",
    howToSell:"/how-to-sell",
    PrivacyPolicy:"/privacy-policy",

  },
  job: {  
    job: "/jobs",
    homeJob: "/jobs/:search",
    jobDetails: "/jobs/job-details/:id/:title?/:description?",
    newjobDetails: "/jobs/job-details/:id/:title?",
    JobLikeThis: "/jobs/job/more-jobs-like-this/:id",
    images: "/jobs/images/:id",
    videos: "/jobs/videos/:id",
    RegAsApplicant: "/jobs/register-as-applicant",
    AddBusiness: "/jobs/add-business",
    applyForJob: "/jobs/apply/:id",
    postJob: "/jobs/post-job",
    editJob: "/jobs/edit-job/:id",
    popular:'/jobs/popular-jobs',
    forYou:'/jobs/jobs-for-you',
  },

  directory: {
    directory: "/directory",
    homeDirectory: "/directory/:search",
    NotClaimed: "/directory-details/:id/:name?/:about?",
    newNotClaimed: "/directory-details/:id/:name?",
    relatedBusinesses: "/related-businesses/:id",
    Subscription: "/subscription",
    SubscriptionPricing: "/subscription-pricing/:id",
    ClaimedBusiness: "/claimed-business",
    ClaimBusiness: "/claim-business/:id",
    SubmittedSuccessfully: "/submittedsuccessfully",
    topBusinesses:"/top-businesses",
    recommendedBusinesses:'/recommended-businesses'
  },
  profile: {
    profile: "/profile/:id?",
    editBusiness: "/edit-business",
    viewJobDetails: "/jobs/view-job-details/:id",
    applicants: "/jobs/applicants/:id",
    viewApplicant: "/jobs/view-applicant/:id",
    createAd: "ads/create-ad",
    editAds: "ads/edit-ad/:id",
    myAds:'ads/my-ads',
    myapplicationDetails:'/jobs/my-application-details/:id/:applicationDetailsId'
  },
  pricing:{
    pricing:'/pricing'

  },

  auth: {
    signUp: "/sign-up",
    SellerSignUp: "/seller-signUp",
    login: "/login",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password/:email",
    passwordResetSuccessful: "/password-reset-successful",
    VerificationCode: "/verification-code/:email?/:phoneNumber?",
    ResetVerificationCode: "/reset-password-verification-code/:email/",
    sellerVerification:'/seller-verification'
  },
};

export const routeParts = {
  [routes.page.market]: {
    route: routes.page.home,
    name: "All Business",
    params: "",
    isRoot: true,
  },
  // [routes.directory.viewBusiness]: {
  //   route: routes.directory.viewBusiness,
  //   name: 'View Business',
  //   params: '1',
  //   isRoot: false,
  // },
  // [routes.directory.editBusiness]: {
  //   route: routes.directory.editBusiness,
  //   name: 'Edit Business',
  //   params: '1',
  // },

  // [routes.jobs.viewJobDetails]: {
  //   route: routes.jobs.viewJobDetails,
  //   name: 'View Job Details',
  //   params: '',
  //   isRoot: false,
  // },
  // [routes.jobs.editJob]: {
  //   route: routes.jobs.editJob,
  //   name: 'Edit Job',
  //   params: '1',
  //   isRoot: false,
  // },
  // [routes.jobs.jobs]: {
  //   route: routes.jobs.jobs,
  //   name: 'Jobs',
  //   params: '',
  //   isRoot: true,
  // },
};
