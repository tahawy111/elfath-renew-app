"use client";

import { getError } from "@/lib/actions";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface QuotaData {
  totalDownloadAvailableToYou: string;
  subscriptionExpDate: string;
}

interface PersonalAccountInfo {
  account: string;
}

interface ServiceData {
  currentService: string;
}

interface UserData {
  yourPersonalAccountInfo: PersonalAccountInfo;
  serviceData: ServiceData;
  yourQuota: QuotaData;
}

interface SubscriptionStatusProps {
  data: UserData;
}

const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { yourQuota, yourPersonalAccountInfo, serviceData } = data;
  const router = useRouter();

  // Parse subscription expiration date
  const subscriptionExpDate = new Date(yourQuota.subscriptionExpDate);
  const today = new Date();

  // Check if subscription has ended
  const isSubscriptionDateEnded = new Date(subscriptionExpDate) < today;
  const totalDownloadAvailableToYou = parseFloat(
    yourQuota.totalDownloadAvailableToYou
  );

  const isTheServiceMustBeRenewed =
    isSubscriptionDateEnded ||
    (!isSubscriptionDateEnded && totalDownloadAvailableToYou <= 0);

  // Parse account balance and current service cost
  const accountBalance = parseFloat(yourPersonalAccountInfo.account);
  const currentServiceCost = parseFloat(
    serviceData.currentService.split(" ").at(-2)!
  );

  // Check if the user has enough balance to renew
  const hasSufficientFunds = accountBalance >= currentServiceCost;

  const isTheServiceRenewing = isSubscriptionDateEnded && hasSufficientFunds;

  // Renew Functionality
  async function renew() {
    alert(`هل انت بالفعل تريد تجديد الباقة الان. سيتم خصم ${currentServiceCost}ج من رصيدك`)
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/renew", {
        currentService: serviceData.currentService,
      });
      setIsLoading(true);
      toast.success(data.msg);
    } catch (error) {
      toast.error(getError(error));
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  }

  return (
    <div
      dir="rtl"
      className="max-w-full md:max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg border border-gray-200"
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">حالة الاشتراك</h2>

      {/* تاريخ انتهاء الاشتراك */}
      <div className="mb-4">
        <p className="text-gray-700 whitespace-normal break-words text-wrap">
          <span className="font-semibold">تاريخ انتهاء الاشتراك:</span>{" "}
          {subscriptionExpDate.toLocaleDateString("ar-EG")}
        </p>

        {!isTheServiceRenewing &&
          (isTheServiceMustBeRenewed ? (
            <p className="text-red-600 font-semibold mt-2 whitespace-normal break-words text-wrap">
              انتهى اشتراكك. يرجى تجديده للاستمرار في الخدمة.
            </p>
          ) : (
            <p className="text-green-600 font-semibold mt-2 whitespace-normal break-words text-wrap">
              اشتراكك نشط. يمكنك الاستمتاع بالخدمة حتى{" "}
              {subscriptionExpDate.toLocaleDateString("ar-EG")} .
            </p>
          ))}
      </div>

      {/* الرصيد وتكلفة الخدمة */}
      <div className="mb-4">
        <p className="text-gray-700 whitespace-normal break-words text-wrap">
          <span className="font-semibold">رصيدك الحالي:</span> {accountBalance} ج
        </p>
        <p className="text-gray-700 whitespace-normal break-words text-wrap">
          <span className="font-semibold">تكلفة الخدمة الحالية:</span>{" "}
          {currentServiceCost} ج
        </p>
      </div>

      {/* رسالة التجديد */}
      {isTheServiceMustBeRenewed && !isTheServiceRenewing && (
        <div className="mt-4">
          {hasSufficientFunds ? (
            <p className="text-green-600 font-semibold whitespace-normal break-words text-wrap">
              رصيدك كافٍ لتجديد الاشتراك.{" "}
              <button
                onClick={renew}
                className="text-blue-600 underline hover:text-blue-700"
              >
                اضغط هنا للتجديد
              </button>
            </p>
          ) : (
            <p className="text-red-600 font-semibold whitespace-normal break-words text-wrap">
              رصيدك غير كافٍ لتجديد الاشتراك. يرجى شحن حسابك.
            </p>
          )}
        </div>
      )}

      {/* حالة التجديد */}
      {isLoading && (
        <p className="text-gray-700 whitespace-normal break-words text-wrap">
          جارٍ تجديد الباقة...
        </p>
      )}
      {isTheServiceRenewing && (
        <p className="text-green-600 font-semibold mt-2 whitespace-normal break-words text-wrap">
          تم تجديد الباقة. انتظر من 5 إلى 10 دقائق وسيتم تفعيل الخدمة تلقائيًا.
        </p>
      )}
    </div>
  );
};

export default SubscriptionStatus;
