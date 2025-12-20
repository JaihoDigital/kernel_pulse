import requests

response = requests.get(
    "https://kernel-pulse.vercel.app/api/json",
    params={"url": "https://xnxxxxxxxxx.com"}
)

data = response.json()

print("status:", data["status"])
print("up:", data["up"])
print("ms:", data["responseTimeMs"])
print("checked:", data["checkedAt"])
