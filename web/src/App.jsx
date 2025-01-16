import { useState, useEffect } from 'react';
import { Table, DatePicker, Button, Space } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import './App.css';

const { RangePicker } = DatePicker;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const SSE_BASE_URL = import.meta.env.VITE_SSE_BASE_URL;

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 25,
    total: 0
  });
  const [dateRange, setDateRange] = useState([
    dayjs(),
    dayjs()
  ]);
  const [tempDateRange, setTempDateRange] = useState([
    dayjs(),
    dayjs()
  ]);

  const columns = [
    {
      title: '债券代码',
      dataIndex: 'securityCode',
      key: 'securityCode',
      width: 100,
    },
    {
      title: '债券简称',
      dataIndex: 'securityAbbr',
      key: 'securityAbbr',
      width: 120,
    },
    {
      title: '公告标题',
      dataIndex: 'title',
      key: 'title',
      width: 400,
      render: (text, record) => (
        <a href={`${SSE_BASE_URL}${record.url}`} target="_blank" rel="noopener noreferrer">
          {text}
        </a>
      ),
    },
    {
      title: '公告时间',
      dataIndex: 'sseDate',
      key: 'sseDate',
      width: 180,
      render: (text) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const [startDate, endDate] = dateRange;
      const response = await axios.get(API_BASE_URL, {
        params: {
          start_date: startDate.format('YYYY-MM-DD'),
          end_date: endDate.format('YYYY-MM-DD'),
          page,
        },
      });
      
      setData(response.data.data);
      setPagination({
        current: response.data.pageNo,
        pageSize: response.data.pageSize,
        total: response.data.total,
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const handleTableChange = (pagination) => {
    fetchData(pagination.current);
  };

  const handleDateRangeChange = (dates) => {
    setTempDateRange(dates);
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, current: 1 }));
    setDateRange(tempDateRange);
  };

  return (
    <div className="container">
      <div className="date-picker-container">
        <Space>
          <RangePicker
            value={tempDateRange}
            onChange={handleDateRangeChange}
            format="YYYY-MM-DD"
          />
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={handleTableChange}
        loading={loading}
        rowKey="bulletinId"
        scroll={{ x: 800 }}
      />
    </div>
  );
}

export default App;