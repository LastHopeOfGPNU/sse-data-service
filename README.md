# sse-data-service
上海证券交易所公开发行公司债券（含企业债券）公告数据接口

## Get started
```bash
pip install requirements.txt
cd api
uvicorn main:app --reload
```

## Request example
```sh
curl --location 'http://127.0.0.1:8000/?start_date=2025-01-01&end_date=2025-01-02&page=1'
```
