"use client";
import { useEffect, useState } from "react";
import { 
  Card, 
  Table, 
  Tag, 
  Statistic, 
  Row, 
  Col, 
  Space,
  Typography,
  Select,
  Input,
  message
} from "antd";
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  WalletOutlined,
  SearchOutlined 
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import statsService from '../../../services/statsService'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
);

const { Title } = Typography;

interface CashFlow {
  total_nap: number;
  total_rut: number;
  balance: number;
}

interface AllRecord {
  id: number;
  user_id: number;
  type: string;
  amount: number;
  create_at: string;
}

const Dashboard = () => {
  const [data, setData] = useState<CashFlow | null>(null);
  const [allRecords, setAllRecords] = useState<AllRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<AllRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [searchText, setSearchText] = useState("");

  
  useEffect(() => {
    const store = localStorage.getItem("currentUser");
    const user = store ? JSON.parse(store) : null;
    const token = user?.access_token || "";
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [cashFlowResult, recordsResult] = await Promise.all([
          statsService.SystemCashFlow(token),
          statsService.AllRecord(token)
        ]);

        if (cashFlowResult.success) {
          setData(cashFlowResult.data);
        } else {
          message.error(cashFlowResult.error);
        }

        if (recordsResult.success) {
          const records = Array.isArray(recordsResult.data) ? recordsResult.data : [];
          console.log(recordsResult);
          setAllRecords(records);
          setFilteredRecords(records);
        } else {
          message.error(recordsResult.error);
          setAllRecords([]);
          setFilteredRecords([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Có lỗi xảy ra khi tải dữ liệu!");
      
        setAllRecords([]);
        setFilteredRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  
  useEffect(() => {
    let filtered = [...allRecords];

    if (typeFilter !== "all") {
      filtered = filtered.filter((record) => record.type === typeFilter);
    }

    if (searchText) {
      filtered = filtered.filter((record) =>
        record.user_id.toString().includes(searchText)
      );
    }

    setFilteredRecords(filtered);
  }, [typeFilter, searchText, allRecords]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const columns: ColumnsType<AllRecord> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      align: "center",
    },
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      width: 100,
      align: "center",
    },
    {
      title: "Loại giao dịch",
      dataIndex: "type",
      key: "type",
      width: 150,
      align: "center",
      render: (type: string) => (
        <Tag color={type === "NAP" ? "green" : "red"} icon={type === "NAP" ? <ArrowUpOutlined /> : <ArrowDownOutlined />}>
          {type === "NAP" ? "Nạp tiền" : "Rút tiền"}
        </Tag>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      width: 200,
      align: "right",
      render: (amount: number, record) => (
        <span style={{ 
          color: record.type === "NAP" ? "#52c41a" : "#ff4d4f",
          fontWeight: "600"
        }}>
          {record.type === "NAP" ? "+" : "-"}{formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "create_at",
      key: "create_at",
      width: 200,
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm:ss"),
      sorter: (a, b) => dayjs(a.create_at).unix() - dayjs(b.create_at).unix(),
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Title level={2} style={{ marginBottom: "24px" }}>
        <WalletOutlined /> Quản lý doanh thu
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} sm={8}>
          <Card variant="borderless" loading={loading}>
            <Statistic
              title="Số dư hiện tại"
              value={data?.balance || 0}
              precision={0}
              styles={{ 
                content: { 
                  color: (data?.balance || 0) >= 0 ? "#3f8600" : "#cf1322",
                  fontSize: "28px"
                }
              }}
              prefix={<WalletOutlined />}
              suffix="₫"
              formatter={(value) => formatCurrency(Number(value)).replace("₫", "")}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" loading={loading}>
            <Statistic
              title="Tổng nạp"
              value={data?.total_nap || 0}
              precision={0}
              styles={{ 
                content: { 
                  color: "#3f8600", 
                  fontSize: "28px" 
                }
              }}
              prefix={<ArrowUpOutlined />}
              suffix="₫"
              formatter={(value) => formatCurrency(Number(value)).replace("₫", "")}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card variant="borderless" loading={loading}>
            <Statistic
              title="Tổng rút"
              value={data?.total_rut || 0}
              precision={0}
              styles={{ 
                content: { 
                  color: "#cf1322", 
                  fontSize: "28px" 
                }
              }}
              prefix={<ArrowDownOutlined />}
              suffix="₫"
              formatter={(value) => formatCurrency(Number(value)).replace("₫", "")}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
        <Col xs={24} lg={14}>
          <Card 
            variant="borderless"
            title={<Title level={4} style={{ margin: 0 }}>Biểu đồ cột thống kê</Title>}
            loading={loading}
          >
            <Bar
              data={{
                labels: ['Tổng nạp', 'Tổng rút'],
                datasets: [
                  {
                    label: 'Số tiền (VNĐ)',
                    data: [data?.total_nap || 0, data?.total_rut || 0],
                    backgroundColor: [
                      'rgba(82, 196, 26, 0.8)',
                      'rgba(255, 77, 79, 0.8)',
                    ],
                    borderColor: [
                      'rgba(82, 196, 26, 1)',
                      'rgba(255, 77, 79, 1)',
                    ],
                    borderWidth: 2,
                    borderRadius: 8,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 2,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.parsed.y || 0;
                        return `${context.label}: ${formatCurrency(value)}`;
                      },
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                      size: 14,
                    },
                    bodyFont: {
                      size: 13,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => {
                        return new Intl.NumberFormat('vi-VN', {
                          notation: 'compact',
                          compactDisplay: 'short',
                        }).format(Number(value)) + 'đ';
                      },
                    },
                    grid: {
                      color: 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
              height={100}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card 
            variant="borderless"
            title={<Title level={4} style={{ margin: 0 }}>Tỷ lệ giao dịch</Title>}
            loading={loading}
          >
            <Pie
              data={{
                labels: ['Tổng nạp', 'Tổng rút'],
                datasets: [
                  {
                    data: [data?.total_nap || 0, data?.total_rut || 0],
                    backgroundColor: [
                      'rgba(82, 196, 26, 0.8)',
                      'rgba(255, 77, 79, 0.8)',
                    ],
                    borderColor: [
                      'rgba(82, 196, 26, 1)',
                      'rgba(255, 77, 79, 1)',
                    ],
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                aspectRatio: 1.5,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 15,
                      font: {
                        size: 13,
                      },
                      usePointStyle: true,
                      pointStyle: 'circle',
                    },
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.parsed || 0;
                        const total = (data?.total_nap || 0) + (data?.total_rut || 0);
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                      },
                    },
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                      size: 14,
                    },
                    bodyFont: {
                      size: 13,
                    },
                  },
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        variant="borderless"
        style={{ marginBottom: "16px" }}
        styles={{ body: { padding: "16px" } }}
      >
        <Space wrap size="middle">
          <Input
            placeholder="Tìm theo User ID"
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select
            style={{ width: 200 }}
            placeholder="Loại giao dịch"
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { label: "Tất cả", value: "all" },
              { label: "Nạp tiền", value: "NAP" },
              { label: "Rút tiền", value: "RUT" },
            ]}
          />
        </Space>
      </Card>

      <Card variant="borderless">
        <Table
          columns={columns}
          dataSource={filteredRecords}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} giao dịch`,
            pageSizeOptions: ["10", "20", "50", "100"],
          }}
          scroll={{ x: 800 }}
          summary={(pageData) => {
            let totalNap = 0;
            let totalRut = 0;

            pageData.forEach(({ type, amount }) => {
              if (type === "NAP") {
                totalNap += amount;
              } else {
                totalRut += amount;
              }
            });

            return (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ background: "#fafafa" }}>
                  <Table.Summary.Cell index={0} colSpan={3} align="right">
                    <strong>Tổng trang này:</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <strong style={{ color: "#52c41a" }}>
                      +{formatCurrency(totalNap)}
                    </strong>
                    {" / "}
                    <strong style={{ color: "#ff4d4f" }}>
                      -{formatCurrency(totalRut)}
                    </strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} />
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default Dashboard;