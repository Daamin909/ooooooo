from pymongo import MongoClient
from dotenv import load_dotenv
import os, random, math
load_dotenv()
try:
    client = MongoClient(os.getenv("MONGO_URL"))
    db = client["url-lengthener"]
    url_collection = db["urls"]
    client.admin.command('ismaster')
    urls_document = url_collection.find_one({})
except Exception as e:
    print(e)


def lengthen():
    letters = list("abcdefghijklmnopqrstuvwxyz")
    nums = [10, 100, 1000, 1000, 100, 100, 100, 100, 100, 100, 1000, 100, 10, 100]

    inTheList = [True]
    path = ""
    while any(inTheList):
        # Ensure length is at least 1 to avoid an empty string
        length = max(1, int(math.floor(random.random() * random.choice(nums))))  # Use max(1, ...) to avoid 0
        letter = random.choice(letters)

        path = letter * length

        urls = urls_document.get("urls", [])
        inTheList = [path in list(url.keys())[0] for url in urls]

    return path


def add_url(original_url):
    lengthened_url = lengthen()
    url_collection.update_one({}, {"$push": {"urls": {lengthened_url: original_url}}})
    return lengthened_url

