import AccountInfo from "@/components/AccoutInfo";
import { getAuthSession } from "@/lib/auth";
import puppeteer from "puppeteer";
import getUserData from "@/lib/actions";
import SignOutButton from "@/components/SignOutButton";
import SubscriptionStatus from "@/components/SubscriptionStatus";

export default async function ScrapePage() {
  const session = await getAuthSession();

  if (!session?.user?.cookies) {
    return new Response(
      JSON.stringify({ error: "No session or cookies found" }),
      { status: 401 }
    );
  }

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const context = await browser.createBrowserContext();
  const page = await context.newPage();

  // 🔹 Set cookies using `context.setCookie()`
  await context.setCookie(...session.user.cookies);

  // 🔹 Perform Scraping
  await page.goto("http://100.100.1.80/user.php");

  const userdata = await getUserData(page);

  await browser.close();

  if (!userdata) return;

  return (
    <div className="p-6">
      <div className="flex justify-between flex-wrap gap-2">
        <h1 className="text-xl font-bold">مرحبا</h1>
        <SignOutButton />
      </div>

      <pre className="bg-gray-100 p-4 mt-4 rounded gap-2 flex flex-col">
        <AccountInfo data={userdata as UserData} />
        <SubscriptionStatus data={userdata as UserData} />
      </pre>
    </div>
  );
}
