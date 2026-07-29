import random
import time
import sys
from playwright.sync_api import sync_playwright

TARGET_URL = "https://ailearning-nba8.onrender.com/"
MAX_PAGES = 100
MAX_STORIES = 15
MIN_SCROLL_PAUSE = 0.8
MAX_SCROLL_PAUSE = 3.5
MIN_READ_PAUSE = 2.0
MAX_READ_PAUSE = 7.0
MIN_CLICK_DELAY = 1.0
MAX_CLICK_DELAY = 3.5

INTERNAL_LINKS = [
    "index.html",
    "about.html",
    "contact.html",
    "what-is-artificial-intelligence.html",
    "machine-learning-vs-deep-learning.html",
    "how-neural-networks-work.html",
    "what-is-a-large-language-model.html",
    "how-chatgpt-claude-gemini-work.html",
    "prompt-engineering-complete-guide.html",
    "ai-agents-explained.html",
    "computer-vision-basics.html",
    "natural-language-processing-explained.html",
    "generative-ai-vs-traditional-ai.html",
    "ai-ethics-and-bias.html",
    "how-to-start-a-career-in-ai.html",
    "best-ai-tools-for-beginners.html",
    "ai-in-everyday-life.html",
    "future-of-ai-trends-to-watch.html",
    "glossary-of-ai-terms.html",
    "ai-robotics-and-automation.html",
]

SITE_DOMAINS = ["ailearning-nba8.onrender.com", "ai-academy-hub.com"]


def is_internal(url):
    for domain in SITE_DOMAINS:
        if domain in url:
            return True
    return url.startswith("/") or not url.startswith("http")


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


def simulate_reading(page):
    scrolls = random.randint(2, 6)
    for _ in range(scrolls):
        lo = random.randint(80, 350)
        hi = random.randint(200, 500)
        human_scroll(page, min(lo, hi), max(lo, hi))
        human_delay(1.0, 3.5)


def simulate_whole_page_read(page):
    phases = [
        ("scroll_half", lambda: human_scroll(page, 100, 300)),
        ("scroll_half", lambda: human_scroll(page, 100, 300)),
        ("pause", lambda: human_delay(1.0, 3.0)),
        ("scroll_rest", lambda: human_scroll(page, 150, 400)),
        ("pause", lambda: human_delay(0.5, 2.0)),
        ("scroll_end", lambda: human_scroll(page, 100, 350)),
    ]
    random.shuffle(phases)
    for name, action in phases:
        action()


def safe_click_link(page, link):
    try:
        href = link.get_attribute("href")
        if href and not href.startswith("javascript:"):
            link.scroll_into_view_if_needed()
            human_delay(0.3, 1.0)
            link.click()
            human_delay(1.5, 4.0)
            return href
    except Exception:
        pass
    return None


def handle_ad_popups(page, context):
    pages = context.pages
    for p in pages:
        if p.url != page.url and not p.is_closed():
            try:
                p.wait_for_load_state("domcontentloaded", timeout=5000)
                human_delay(1.0, 3.0)
                p.close()
                print(f"  [Ad Popup] Closed: {p.url}")
            except Exception:
                pass


def navigate_to_random_article(page, base_url):
    link = random.choice(INTERNAL_LINKS)
    url = base_url.rstrip("/") + "/" + link
    print(f"  [Navigate] -> {link}")
    page.goto(url, wait_until="domcontentloaded", timeout=20000)
    human_delay(2.0, 5.0)


def simulate_page_interaction(page, context, base_url):
    actions = [
        "scroll",
        "scroll",
        "click_article",
        "scroll",
        "wait",
        "click_article",
        "scroll",
    ]
    action = random.choice(actions)

    if action == "scroll":
        simulate_reading(page)

    elif action == "click_article":
        all_links = page.query_selector_all('a[href]')
        internal = []
        for link in all_links:
            href = link.get_attribute("href")
            if href and is_internal(href):
                internal.append((link, href))

        if internal:
            chosen_link, href = random.choice(internal)
            clicked = safe_click_link(page, chosen_link)
            if clicked:
                full_url = clicked if clicked.startswith("http") else base_url.rstrip("/") + "/" + clicked.lstrip("/")
                if full_url != page.url and "render.com" in full_url:
                    new_pages = context.pages
                    for p in new_pages:
                        if p.url != page.url and not p.is_closed():
                            try:
                                p.wait_for_load_state("domcontentloaded", timeout=10000)
                                human_delay(3.0, 8.0)
                                p.close()
                                page.bring_to_front()
                                human_delay(1.0, 2.0)
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
    print(f"[Automation] Total internal articles: {len(INTERNAL_LINKS)}")

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
        stories_done = 0

        try:
            print(f"[Automation] Opening {TARGET_URL}")
            page.goto(TARGET_URL, wait_until="domcontentloaded", timeout=30000)
            human_delay(2.0, 5.0)
            simulate_reading(page)

            page_run_count = 0

            while page_run_count < MAX_PAGES and stories_done < MAX_STORIES:
                page_run_count += 1
                current_url = page.url
                print(f"\n[Page {page_run_count}] URL: {current_url}")

                simulate_page_interaction(page, context, TARGET_URL)

                current_page_url = page.url
                if current_page_url != TARGET_URL and "render.com" in current_page_url:
                    print(f"  [Back] Returning to main site...")
                    page.goto(TARGET_URL, wait_until="domcontentloaded", timeout=20000)
                    human_delay(1.0, 3.0)
                    stories_done += 1
                    simulate_reading(page)

                handle_ad_popups(page, context)

                if page.is_closed():
                    print("[Automation] Page was closed, reopening...")
                    page = context.new_page()
                    page.goto(TARGET_URL, wait_until="domcontentloaded", timeout=30000)
                    human_delay(2.0, 4.0)
                    continue

                remaining_articles = [a for a in INTERNAL_LINKS if a not in current_page_url]
                if remaining_articles and random.random() > 0.3:
                    next_article = random.choice(remaining_articles)
                    url = TARGET_URL.rstrip("/") + "/" + next_article
                    print(f"  [Next Article] -> {next_article}")
                    page.goto(url, wait_until="domcontentloaded", timeout=20000)
                    human_delay(2.0, 5.0)
                    simulate_whole_page_read(page)
                    stories_done += 1

                print(f"[Automation] Waiting before next action...")
                human_delay(MIN_CLICK_DELAY, MAX_CLICK_DELAY)

            print(f"\n[Automation] Completed {page_run_count} interactions across {stories_done} stories.")

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