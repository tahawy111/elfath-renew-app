interface PersonalAccountInfo {
    username: string;
    subscriptionState: string;
    subscriptionType: string;
    yourDeviceMacAddress: string;
    account: string;
  }
  
  interface ServiceData {
    currentService: string;
  }
  
  interface PersonalData {
    firstName: string;
    familyName: string;
    address: string;
    phoneNumber: string;
    email: string;
  }
  
  interface QuotaData {
    totalDownloadAvailableToYou: string;
    subscriptionExpDate: string;
  }
  
  interface UserData {
    yourPersonalAccountInfo: PersonalAccountInfo;
    serviceData: ServiceData;
    personalData: PersonalData;
    yourQuota: QuotaData;
  }
  
  interface IAccountData {
    userdata: UserData;
  }