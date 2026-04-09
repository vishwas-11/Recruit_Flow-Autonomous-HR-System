from playwright.async_api import async_playwright, expect


async def use_computer(day: str, time: str):
    """
    Automates browser to click a calendar slot (ASYNC VERSION)
    """

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=False)
            page = await browser.new_page()

            # Open calendar
            await page.goto("http://localhost:3000/calendar")

            # Wait for UI
            await page.wait_for_selector('[data-day]', timeout=5000)

            # Normalize
            day_attr = day.lower()
            time_attr = time.lower()

            selector = f'[data-day="{day_attr}"][data-time="{time_attr}"]'

            print("🔍 Looking for:", selector)

            # Wait + click
            slot = page.locator(selector)
            await expect(slot).to_be_visible(timeout=5000)
            await slot.click()
            await expect(slot).to_have_text("Booked", timeout=5000)

            await browser.close()

            return {
                "success": True,
                "message": f"Booked {day} at {time}",
            }

    except Exception as e:
        print("❌ TOOL ERROR:", str(e))
        return {
            "success": False,
            "error": str(e),
        }