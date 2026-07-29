import random
import time
import sys
from playwright.sync_api import sync_playwright

TARGET_URL = "https://ailearning-nba8.onrender.com/"
MAX_PAGES = 50
MIN_SCROLL_PAUSE = 0.8
MAX_SCROLL_PAUSE = 3.5
MIN_READ_PAUSE = 2.0
MAX_READ_PAUSE = 7.0
MIN_CLICK_DELAY = 1.0
MAX_CLICK_DELAY = 3.5
MIN_TYPING_DELAY = 0.05
MAX_TYPING_DELAY = 0.25


def human_delay(min_val, max_val):
    time.sleep(random.uniform(min_val, max_val))


def human_scroll(page, min_px=100, max_px=400):
    pixels = random.randint(min_px, max_px)
    direction = "down" if random.random() > 0.1 else "up"
    if direction == "down":
        page.mouse.wheel(0, pixels)
    else:
        page.mouse.wheel(0, -pixels)
    human_delay(MIN_SCROLL_PAUSE, MAX_SCROLL_PAUSE)


def human_type_text(page, selector, text):
    element = page.query_selector(selector)
    if element:
        element.click()
        for char in text:
            element.type(char, delay=random.uniform(MIN_TYPING_DELAY, MAX_TYPING_DELAY))
        human_delay(0.3, 0.8)


def safe_click_link(page, link):
    try:
        href = link.get_attribute("href")
        if href and not href.startswith("javascript:"):
            link.scroll_into_view_if_needed()
            human_delay(0.3, 1.0)
            link.click()
            human_delay(1.5, 4.0)
            return True
    except Exception:
        pass
    return False


def handle_ad_popups(page, context):
    pages = context.pages
    for p in pages:
        if p.url != page.url and not p.is_closed():
            try:
                p.wait_for_load_state("domcontentloaded", timeout=5000)
                human_delay(2.0, 5.0)
                p.close()
            except Exception:
                pass


def simulate_reading(page):
    scrolls = random.randint(2, 6)
    for _ in range(scrolls):
        lo = random.randint(80, 350)
        hi = random.randint(200, 500)
        human_scroll(page, min(lo, hi), max(lo, hi))
        human_delay(1.0, 3.5)


def simulate_page_interaction(page, context):
    actions = [
        "scroll",
        "scroll",
        "scroll",
        "click_link",
        "scroll",
        "wait",
    ]
    action = random.choice(actions)

    if action == "scroll":
        simulate_reading(page)

    elif action == "click_link":
        links = page.query_selector_all('a[href]')
        valid_links = []
        for link in links:
            href = link.get_attribute("href")
            if href and not href.startswith("javascript:") and not href.startswith("#"):
                valid_links.append(link)

        if valid_links:
            chosen = random.choice(valid_links)
            safe_click_link(page, chosen)

            new_pages = context.pages
            current_url = page.url
            for p in new_pages:
                if p.url != current_url and not p.is_closed():
                    try:
                        p.wait_for_load_state("domcontentloaded", timeout=10000)
                        human_delay(3.0, 8.0)
                        if "ad" in p.url.lower() or "click" in p.url.lower():
                            p.close()
                            page.bring_to_front()
                            human_delay(0.5, 1.5)
                        else:
                            simulate_reading(p)
                            p.close()
                            page.bring_to_front()
                            human_delay(0.5, 1.5)
                    except Exception:
                        try:
                            p.close()
                        except Exception:
                            pass
                    break

    elif action == "wait":
        simulate_reading(page)
        human_delay(1.0, 3.0)


def main():
    print(f"[Automation] Starting human-like browser simulation...")
    print(f"[Automation] Target: {TARGET_URL}")

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,
            args=[
                "--disable-blink-features=AutomationControlled",
                "--disable-infobars",
                "--disable-notifications",
                "--disable-default-apps",
                "--no-first-run",
                "--no-default-browser-check",
            ]
        )

        context = browser.new_context(
            viewport={"width": random.choice([1366, 1440, 1536, 1920]), "height": random.randint(768, 1080)},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
            locale="en-US",
            timezone_id="America/New_York",
        )

        page = context.new_page()

        try:
            print(f"[Automation] Opening {TARGET_URL}")
            page.goto(TARGET_URL, wait_until="domcontentloaded", timeout=30000)
            human_delay(2.0, 5.0)

            page_run_count = 0

            while page_run_count < MAX_PAGES:
                page_run_count += 1
                current_url = page.url
                print(f"\n[Page {page_run_count}] URL: {current_url}")

                simulate_page_interaction(page, context)

                current_page_url = page.url
                if current_page_url != TARGET_URL and "render.com" in current_page_url:
                    print(f"[Automation] Navigated to {current_page_url}, going back...")
                    page.go_back(wait_until="domcontentloaded", timeout=15000)
                    human_delay(1.0, 3.0)

                handle_ad_popups(page, context)

                if page.is_closed():
                    print("[Automation] Page was closed, reopening...")
                    page = context.new_page()
                    page.goto(TARGET_URL, wait_until="domcontentloaded", timeout=30000)
                    human_delay(2.0, 4.0)
                    continue

                next_action = random.choice(["continue", "scroll_more", "click_random"])
                if next_action == "scroll_more":
                    simulate_reading(page)
                elif next_action == "click_random":
                    links = page.query_selector_all('a[href]')
                    valid_links = [
                        l for l in links
                        if l.get_attribute("href")
                        and not l.get_attribute("href").startswith("javascript:")
                    ]
                    if valid_links:
                        safe_click_link(page, random.choice(valid_links))
                        human_delay(2.0, 5.0)
                        if len(context.pages) > 1:
                            for new_page in context.pages:
                                if new_page != page and not new_page.is_closed():
                                    try:
                                        new_page.close()
                                    except Exception:
                                        pass
                            page.bring_to_front()

                print(f"[Automation] Waiting before next action...")
                human_delay(MIN_CLICK_DELAY, MAX_CLICK_DELAY)

            print(f"\n[Automation] Completed {MAX_PAGES} page interactions.")

        except KeyboardInterrupt:
            print("\n[Automation] Stopped by user.")

        except Exception as e:
            print(f"[Automation] Error: {e}")

        finally:
            print("[Automation] Closing browser...")
            browser.close()
            print("[Automation] Done.")


if __name__ == "__main__":
    main()