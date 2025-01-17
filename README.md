# sse-data-service
上海证券交易所公开发行公司债券（含企业债券）公告数据接口

## Get started
### 启动后端接口
```bash
cd api
pip install requirements.txt
uvicorn main:app --reload
```

### 启动前端
```bash
cd web
cp .env.example .env
npm i
npm run dev
```

## Request example
```sh
curl --location 'http://127.0.0.1:8000/?start_date=2025-01-01&end_date=2025-01-02&page=1'
```
