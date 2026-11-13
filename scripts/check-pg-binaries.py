import urllib.request
import json

url = "https://api.github.com/repos/zonkyio/embedded-postgres-binaries/releases/tags/v17.5.0"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
with urllib.request.urlopen(req) as r:
    data = json.load(r)

assets = data.get("assets", [])
if not assets:
    print("No assets found — checking message:")
    print(data.get("message", "No message"))
else:
    for a in assets:
        print(a["name"], "|", a["browser_download_url"])
