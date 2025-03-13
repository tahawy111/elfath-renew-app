"use client";

import React from "react";

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

export interface UserData {
  yourPersonalAccountInfo: PersonalAccountInfo;
  serviceData: ServiceData;
  personalData: PersonalData;
  yourQuota: QuotaData;
}

interface AccountInfoProps {
  data?: UserData; // Make the `data` prop optional
  isLoading?: boolean; // Optional loading state
}

// Mapping keys to Arabic labels
const labels: Record<string, string> = {
  username: "اسم المستخدم",
  subscriptionState: "حالة الاشتراك",
  subscriptionType: "نوع الاشتراك",
  yourDeviceMacAddress: "عنوان جهازك",
  account: "الرصيد",
  currentService: "الخدمة الحالية",
  firstName: "الاسم الأول",
  familyName: "اسم العائلة",
  address: "العنوان",
  phoneNumber: "رقم الهاتف",
  email: "البريد الإلكتروني",
  totalDownloadAvailableToYou: "إجمالي التحميل المتاح",
  subscriptionExpDate: "تاريخ انتهاء الاشتراك",
};

// Default data to avoid undefined errors
const defaultData: UserData = {
  yourPersonalAccountInfo: {
    username: "",
    subscriptionState: "",
    subscriptionType: "",
    yourDeviceMacAddress: "",
    account: "",
  },
  serviceData: {
    currentService: "",
  },
  personalData: {
    firstName: "",
    familyName: "",
    address: "",
    phoneNumber: "",
    email: "",
  },
  yourQuota: {
    totalDownloadAvailableToYou: "",
    subscriptionExpDate: "",
  },
};

const AccountInfo: React.FC<AccountInfoProps> = ({ data = defaultData, isLoading = false }) => {
  const { yourPersonalAccountInfo, serviceData, personalData, yourQuota } = data;

  // Loading state
  if (isLoading) {
    return (
      <div className="text-center py-4">
        <p>جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="max-w-full md:max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200"
    >
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-800 border-b pb-3 mb-4 text-center break-words text-wrap">
        معلومات الحساب الشخصي
      </h1>

      {/* Personal Account Info */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">بيانات الحساب</h2>
        <div className="mt-2 space-y-2 text-gray-600">
          {Object.entries(yourPersonalAccountInfo || {}).map(([key, value]) => (
            <p key={key} className="break-words whitespace-normal max-w-full">
              <span className="font-semibold">{labels[key] || key}:</span>{" "}
              {value || "غير متوفر"}
            </p>
          ))}
        </div>
      </div>

      {/* Service Data */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">بيانات الخدمة</h2>
        <p className="mt-2 text-gray-600 break-words whitespace-normal max-w-full">
          {labels["currentService"]}: {serviceData?.currentService || "غير متوفر"}
        </p>
      </div>

      {/* Personal Data */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">البيانات الشخصية</h2>
        <div className="mt-2 space-y-2 text-gray-600">
          {Object.entries(personalData || {}).map(([key, value]) => (
            <p key={key} className="break-words whitespace-normal max-w-full">
              <span className="font-semibold">{labels[key] || key}:</span>{" "}
              {value || "غير متوفر"}
            </p>
          ))}
        </div>
      </div>

      {/* Quota Data */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-700">الاستهلاك</h2>
        <div className="mt-2 space-y-2 text-gray-600">
          {Object.entries(yourQuota || {}).map(([key, value]) => (
            <p key={key} className="break-words whitespace-normal max-w-full">
              <span className="font-semibold">{labels[key] || key}:</span>{" "}
              {value || "غير متوفر"}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;