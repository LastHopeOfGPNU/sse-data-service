import json
import httpx
import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def get_data(start_date: str, end_date: str, page: int = 1):
    """
    Args:
        start_date : query start date in format "YYYY-MM-DD"
        end_date: query end date (included) in format "YYYY-MM-DD"
        page: page number
    """
    url = "https://query.sse.com.cn/commonSoaQuery.do"
    start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d")
    end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d")
    params = {
        "jsonCallBack": "jsonpCallback74421704",
        "isPagination": True,
        "pageHelp.pageSize": 25,
        "pageHelp.cacheSize": 1,
        "type": "inParams",
        "sqlId": "BS_ZQ_GGLL",
        "sseDate": start_date.strftime("%Y-%m-%d 00:00:00"),
        "sseDateEnd": end_date.strftime("%Y-%m-%d 23:59:59"),
        "bondType": "CORPORATE_BOND_BULLETIN,COMPANY_BOND_BULLETIN",
        "order": "sseDate|desc,securityCode|asc,bulletinId|asc",
        "pageHelp.pageNo": page,
        "pageHelp.beginPage": page,
        "pageHelp.endPage": page
    }
    headers = {
        "referer": "https://www.sse.com.cn/"
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params, headers=headers)
        response = json.loads(response.content.decode().strip("jsonpCallback74421704()"))
        return response["pageHelp"]
