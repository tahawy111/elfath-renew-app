import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import puppeteer, { Page } from "puppeteer";


// Helper function to click buttons by value
async function clickButtonByValue(page: Page, value: string) {
  await page.evaluate((buttonValue: any) => {
    const button = document.querySelector(
      `input[type="submit"][value="${buttonValue}"]`
    ) as HTMLInputElement;
    if (button) {
      button.click();
    } else {
      throw new Error(`Button with value "${buttonValue}" not found`);
    }
  }, value);
}

export async function POST(req: Request) {
  const session = await getAuthSession();

  const { currentService } = await req.json();

  // Validate session and cookies
  if (!session?.user?.cookies) {
    return NextResponse.json(
      { error: "No session or cookies found" },
      { status: 401 }
    );
  }
  let browser;
  try {
    // Launch Puppeteer browser
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const context = await browser.createBrowserContext();
    const page = await context.newPage();

    // 🔹 Set cookies using `context.setCookie()`
    await context.setCookie(...session.user.cookies);

    // Navigate to change service page
    await page.goto("http://100.100.1.80/user.php?cont=change_service");
    await page.waitForSelector("#newsrvid");

    // Select the new service
    await page.select("#newsrvid", "148");

    // Click "التالي>" button
    await clickButtonByValue(page, "التالي>");
    await page.waitForNavigation();

    // Click "تأكيد وأنهاء" button
    await clickButtonByValue(page, "تأكيد وأنهاء");
    await page.waitForNavigation();

    // Navigate back to change service page
    await page.goto("http://100.100.1.80/user.php?cont=change_service");
    await page.waitForSelector("#newsrvid");

    // Get all service options
    const options = await page.evaluate(() => {
      const allOptions = document.querySelectorAll("#newsrvid > option");
      return Array.from(allOptions).map((option) => ({
        text: option.textContent?.trim(),
        value: (option as HTMLOptionElement).value,
      }));
    });

    // Find and select the original service
    const optionValue = options.find(
      (option) => option.text === currentService
    )?.value;
    if (!optionValue) {
      throw new Error("Original service option not found");
    }
    await page.select("#newsrvid", optionValue);

    // Click "التالي>" button
    await clickButtonByValue(page, "التالي>");
    await page.waitForNavigation();

    // Click "تأكيد وأنهاء" button
    await clickButtonByValue(page, "تأكيد وأنهاء");
    await page.waitForNavigation();

    // Close the browser
    await browser.close();

    // Return success response
    return NextResponse.json({
      msg: "تم تجديد الباقة. انتظر 5 دقائق وسيتم تفعيل الخدمة تلقائيا",
    });
  } catch (error) {
    console.error("Error occurred during renew:", error);
    if(browser) {
      browser.close()
    }
    // Close the browser in case of error

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
