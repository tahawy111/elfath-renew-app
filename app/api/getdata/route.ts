import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import puppeteer, { Page } from "puppeteer";
import { loginToSite } from "@/lib/actions";

interface IUserData {
  serviceData: {
    currentService: string;
  };
  error?: string;
}

interface RenewRequest {
  username: string;
  password: string;
}

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

  // Validate session and cookies
  if (!session?.user?.cookies) {
    return NextResponse.json(
      { error: "No session or cookies found" },
      { status: 401 }
    );
  }

  // Parse request body
  let body: RenewRequest;
  try {
    body = await req.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const { username, password } = body;

  let browser;
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const context = await browser.createBrowserContext();
    const page = await context.newPage();


    // Log in to the site
    const result = (await loginToSite(page, username, password)) as IUserData;
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const { currentService } = result.serviceData;

    // Navigate to change service page
    await page.goto("http://100.100.1.80/user.php?cont=change_service");
    await page.waitForSelector("#newsrvid");

    // Select the new service
    await page.select("#newsrvid", "118");

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
      msg: "تم تجديد الباقة بنجاح. انتظر دقيقة وسيعمل الانترنت",
    });
  } catch (error) {
    console.error("Error occurred during renew:", error);

    // Close the browser in case of error
    if (browser) {
      await browser.close();
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}