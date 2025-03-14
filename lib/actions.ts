import { Page } from "puppeteer";

export default async function getUserData(page: Page) {
    await page.waitForSelector(".content");
    const userFetchMethods = {
      // yourPersonalAccountInfo
      username: async () => {
        const query = await page.$(
          ".content > table table tbody table tbody tbody tr:nth-child(2) td:nth-child(2)"
        );
        return await query?.evaluate((el) => el.textContent);
      },
      subscriptionType: async () => {
        const query = await page.$(
          ".content > table table tbody table tbody tbody tr:nth-child(3) td:nth-child(2)"
        );
        return await query?.evaluate((el) => el.textContent);
      },
      subscriptionState: async () => {
        const query = await page.$(
          ".content > table table tbody table tbody tbody tr:nth-child(4) td:nth-child(2) strong"
        );
        return await query?.evaluate((el) => el.textContent);
      },
      yourDeviceMacAddress: async () => {
        const query = await page.$(
          ".content > table table tbody table tbody tbody tr:nth-child(6) td:nth-child(2)"
        );
        return await query?.evaluate((el) => el.textContent);
      },
      account: async () => {
        const query = await page.$(
          ".content > table table tbody table tbody tbody tr:nth-child(7) td:nth-child(2)"
        );
        return await query?.evaluate(
          (el) => `${parseInt(el.textContent!).toFixed(2)} L.E`
        );
      },
      // serviceData
      currentService: async () => {
        const query = await page.$(
          ".content > table table tbody table tbody tr:nth-child(2) tbody tr:nth-child(2) strong"
        );
        return await query?.evaluate((el) => el.textContent);
      },
      // personalData
      firstName: async () => {
        const query = await page.$(
          ".content > table table tbody table tbody tr:nth-child(3) tbody tr:nth-child(2) strong"
        );
        return await query?.evaluate((el) => el.textContent);
      },
      familyName: async () => {
        const query = await page.$(
          ".content > table table tbody table tbody tr:nth-child(3) tbody tr:nth-child(3) strong"
        );
        return await query?.evaluate((el) => el.textContent);
      },
      address: async () => {
        const query = await page.$(
          ".content > table table tbody table tbody tr:nth-child(3) tbody tr:nth-child(4) strong"
        );
        return await query?.evaluate((el) => el.textContent);
      },
      phoneNumber: async () => {
        const query = await page.$(
          ".content > table table tbody table tbody tr:nth-child(3) tbody tr:nth-child(10) strong"
        );
        return await query?.evaluate((el) => el.textContent);
      },
      email: async () => {
        const query = await page.$(
          ".content > table table tbody table tbody tr:nth-child(3) tbody tr:nth-child(11) strong"
        );
        return await query?.evaluate((el) => el.textContent);
      },
      // yourQuota
      totalDownloadAvailableToYou: async () => {
        const query = await page.$(
          ".content > table table tbody table tbody tr:nth-child(4) tbody tr:nth-child(4) strong"
        );
        return await query?.evaluate((el) => el.textContent);
      },
      subscriptionExpDate: async () => {
        const query = await page.$(
          ".content > table table tbody table tbody tr:nth-child(4) tbody tr:nth-child(6) strong"
        );
        return await query?.evaluate((el) => el.textContent);
      },
    };
    const userState = {
      yourPersonalAccountInfo: {
        username: await userFetchMethods.username(),
        subscriptionState: await userFetchMethods.subscriptionState(),
        subscriptionType: await userFetchMethods.subscriptionType(),
        yourDeviceMacAddress: await userFetchMethods.yourDeviceMacAddress(),
        account: await userFetchMethods.account(),
      },
      serviceData: {
        currentService: await userFetchMethods.currentService(),
      },
      personalData: {
        firstName: await userFetchMethods.firstName(),
        familyName: await userFetchMethods.familyName(),
        address: await userFetchMethods.address(),
        phoneNumber: await userFetchMethods.phoneNumber(),
        email: await userFetchMethods.email(),
      },
      yourQuota: {
        totalDownloadAvailableToYou:
          await userFetchMethods.totalDownloadAvailableToYou(),
          subscriptionExpDate:
          await userFetchMethods.subscriptionExpDate(),
      },
    };
  
    return userState
  }

export async function loginToSite(page: Page, username: string, password: string) {
    await page.goto("http://100.100.1.80/user.php");
    await page.type("#username", username);
    await page.type("#password", password);
    await page.click("#submit");
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    const checkQueryAfterReloadHandle = await page.$(
      "tbody tr:nth-child(2) td p:nth-child(3) font"
    );

    if (checkQueryAfterReloadHandle) {
      return { error: "اسم المستخدم غير صحيح أو كلمة المرور!" };
    }

    return {}
    // // Assuming getUserData is defined somewhere else
    // const userData = await getUserData(page);
    // return userData;
  }

export function getError(error:any){ 
  return error.response.data.message ||
  error ||
  error.message ||
  error.msg ||
  "فشل الطلب"
}