import os, re

files = sorted([f for f in os.listdir('.') if f.endswith('.html')])
for f in files:
    with open(f, 'r', encoding='utf-8', errors='ignore') as fh:
        content = fh.read()
    links = re.findall(r'<a\s[^>]*href=["\']([^"\']+)["\']', content)
    valid = [l for l in links if not l.startswith('#') and not l.startswith('javascript:')]
    tag = ''
    if 'index.html' in f:
        tag = '[HOME]'
    elif f == 'about.html':
        tag = '[ABOUT]'
    elif f == 'contact.html':
        tag = '[CONTACT]'
    print(f'=== {f} {tag} ({len(valid)} links) ===')
    for l in valid:
        print(f'  {l}')
    print()