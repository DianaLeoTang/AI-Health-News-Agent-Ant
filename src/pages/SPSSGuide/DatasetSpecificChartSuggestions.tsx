import React, { useState } from 'react';
import { Typography, Table, Tag, Divider, Alert, Card, Row, Col, Button, Space, Tabs, Modal,Steps ,StepItem} from 'antd';
import { FileTextOutlined, BarChartOutlined, PieChartOutlined, LineChartOutlined, DotChartOutlined, BoxPlotOutlined, HeatMapOutlined, RadarChartOutlined, AreaChartOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

const DatasetSpecificChartSuggestions = () => {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState({
    title: '',
    chartType: '',
    image: null
  });

  const specificChartSuggestions = [
    {
      title: '流感类型分布饼图',
      chartType: '饼图',
      description: '使用INF_A、INF_B和其他流感类型数据创建饼图，展示不同流感类型的比例',
      button: '饼图',
      buttonType: 'green',
      preview: () => {
        // 这里可以实现预览功能或跳转到可视化工具
        setPreviewContent({
          title: '流感类型分布饼图',
          chartType: '饼图',
          image: null // 实际应用中可以设置预览图片
        });
        setPreviewVisible(true);
      }
    },
    {
      title: '按地区的流感活动条形图',
      chartType: '条形图',
      description: 'X轴: WHOREGION或COUNTRY_AREA_TERRITORY，Y轴: INF_ALL的平均值或总和',
      button: '条形图',
      buttonType: 'blue',
      preview: () => {
        setPreviewContent({
          title: '按地区的流感活动条形图',
          chartType: '条形图',
          image: null
        });
        setPreviewVisible(true);
      }
    },
    {
      title: '流感季节趋势折线图',
      chartType: '折线图',
      description: 'X轴: ISO_WEEK或MMWR_WEEK，Y轴: INF_A、INF_B、RSV等数据，分组: FLUSEASON或HEMISPHERE',
      button: '折线图',
      buttonType: 'purple',
      preview: () => {
        setPreviewContent({
          title: '流感季节趋势折线图',
          chartType: '折线图',
          image: null
        });
        setPreviewVisible(true);
      }
    },
    {
      title: '不同亚型的时间趋势多折线图',
      chartType: '折线图',
      description: 'X轴: 时间（ISO_WEEKSTARTDATE），Y轴: 不同的流感亚型（AH1、AH3、AH1N12009等）',
      button: '折线图',
      buttonType: 'purple',
      preview: () => {
        setPreviewContent({
          title: '不同亚型的时间趋势多折线图',
          chartType: '折线图',
          image: null
        });
        setPreviewVisible(true);
      }
    },
    {
      title: '流感与其他呼吸道病毒的相关性散点图',
      chartType: '散点图',
      description: 'X轴: INF_ALL，Y轴: RSV、ADENO、HUMAN_CORONA等',
      button: '散点图',
      buttonType: 'magenta',
      preview: () => {
        setPreviewContent({
          title: '流感与其他呼吸道病毒的相关性散点图',
          chartType: '散点图',
          image: null
        });
        setPreviewVisible(true);
      }
    },
    {
      title: '按地区和季节的流感检测率热力图',
      chartType: '热力图',
      description: '行: WHOREGION或COUNTRY_AREA_TERRITORY, 列: FLUSEASON, 单元格值: INF_ALL/SPEC_PROCESSED_NB（检测率）',
      button: '热力图',
      buttonType: 'red',
      preview: () => {
        setPreviewContent({
          title: '按地区和季节的流感检测率热力图',
          chartType: '热力图',
          image: null
        });
        setPreviewVisible(true);
      }
    },
    {
      title: '不同呼吸道病毒的季节性箱线图',
      chartType: '箱线图',
      description: 'Y轴: 各种病毒数据（INF_A、INF_B、RSV等），X轴: FLUSEASON或HEMISPHERE，分组: WHOREGION',
      button: '箱线图',
      buttonType: 'orange',
      preview: () => {
        setPreviewContent({
          title: '不同呼吸道病毒的季节性箱线图',
          chartType: '箱线图',
          image: null
        });
        setPreviewVisible(true);
      }
    },
    {
      title: '流感阳性率的地区比较雷达图',
      chartType: '雷达图',
      description: '多个轴代表不同地区，数值代表INF_ALL占SPEC_PROCESSED_NB的百分比',
      button: '雷达图',
      buttonType: 'cyan',
      preview: () => {
        setPreviewContent({
          title: '流感阳性率的地区比较雷达图',
          chartType: '雷达图',
          image: null
        });
        setPreviewVisible(true);
      }
    },
    {
      title: '流感与RSV活动的堆积面积图',
      chartType: '面积图',
      description: 'X轴: 时间（ISO_WEEK），Y轴堆积区域: INF_A、INF_B、RSV，分组: HEMISPHERE或FLUSEASON',
      button: '面积图',
      buttonType: 'geekblue',
      preview: () => {
        setPreviewContent({
          title: '流感与RSV活动的堆积面积图',
          chartType: '面积图',
          image: null
        });
        setPreviewVisible(true);
      }
    },
    {
      title: '病毒检测分布的复合条形图',
      chartType: '条形图',
      description: 'X轴: WHOREGION，Y轴: 各类病毒的检测数量，分组: 病毒类型（INF_A、INF_B、RSV、ADENO等）',
      button: '条形图',
      buttonType: 'blue',
      preview: () => {
        setPreviewContent({
          title: '病毒检测分布的复合条形图',
          chartType: '条形图',
          image: null
        });
        setPreviewVisible(true);
      }
    }
  ];

  // 补充的图表建议
  const additionalChartSuggestions = [
    {
      title: '流感检测率时空热图',
      chartType: '热图网格',
      description: 'X轴: 时间（月或季），Y轴: 国家/地区，颜色强度: INF_ALL/SPEC_PROCESSED_NB',
      button: '热图网格',
      buttonType: 'volcano',
      preview: () => {
        setPreviewContent({
          title: '流感检测率时空热图',
          chartType: '热图网格',
          image: null
        });
        setPreviewVisible(true);
      }
    },
    {
      title: '流感与气候相关性分析图',
      chartType: '双轴图',
      description: 'X轴: 时间，左Y轴: INF_ALL，右Y轴: 平均温度/湿度（需额外数据）',
      button: '双轴图',
      buttonType: 'gold',
      preview: () => {
        setPreviewContent({
          title: '流感与气候相关性分析图',
          chartType: '双轴图',
          image: null
        });
        setPreviewVisible(true);
      }
    },
    {
      title: '不同病毒变异亚型分布桑基图',
      chartType: '桑基图',
      description: '流向: 从病毒类型到亚型到区域的传播流图',
      button: '桑基图',
      buttonType: 'lime',
      preview: () => {
        setPreviewContent({
          title: '不同病毒变异亚型分布桑基图',
          chartType: '桑基图',
          image: null
        });
        setPreviewVisible(true);
      }
    }
  ];

  // 合并所有图表建议
  const allChartSuggestions = [...specificChartSuggestions, ...additionalChartSuggestions];

  // 图表分类
  const chartCategories = {
    '时间趋势分析': allChartSuggestions.filter(chart =>
      chart.description.includes('时间') ||
      chart.description.includes('趋势') ||
      chart.description.includes('ISO_WEEK')),
    '地区分布分析': allChartSuggestions.filter(chart =>
      chart.description.includes('地区') ||
      chart.description.includes('WHOREGION') ||
      chart.description.includes('COUNTRY')),
    '病毒相关性分析': allChartSuggestions.filter(chart =>
      chart.description.includes('相关性') ||
      chart.description.includes('关系')),
    '病毒类型比较': allChartSuggestions.filter(chart =>
      chart.description.includes('类型') ||
      chart.description.includes('亚型') ||
      chart.description.includes('比较'))
  };

  return (
    <div style={{ padding: '20px' }}>
      <Title level={2}>6. 针对VIW_FNT.csv数据集的特定图表建议</Title>
      <Paragraph>基于您提供的流感监测数据，以下是一些特别推荐的可视化方案：</Paragraph>

      <Tabs defaultActiveKey="all" type="card">
        <TabPane tab="所有图表建议" key="all">
          <Table
            dataSource={allChartSuggestions.map((item, index) => ({...item, key: index}))}
            columns={[
              {
                title: '图表名称',
                dataIndex: 'title',
                key: 'title',
                width: '20%'
              },
              {
                title: '图表类型',
                dataIndex: 'chartType',
                key: 'chartType',
                width: '15%',
                render: (text) => <Tag color={text === '条形图' ? 'blue' : text === '饼图' ? 'green' : text === '折线图' ? 'purple' : text === '散点图' ? 'magenta' : text === '箱线图' ? 'orange' : text === '热力图' ? 'red' : text === '雷达图' ? 'cyan' : text === '面积图' ? 'geekblue' : text === '热图网格' ? 'volcano' : text === '双轴图' ? 'gold' : text === '桑基图' ? 'lime' : 'default'}>{text}</Tag>
              },
              {
                title: '建议实现方式',
                dataIndex: 'description',
                key: 'description',
                width: '50%'
              },
              {
                title: '操作',
                key: 'action',
                render: (_, record) => (
                  <Button
                    type="primary"
                    size="small"
                    onClick={record.preview}
                    icon={
                      record.chartType === '条形图' ? <BarChartOutlined /> :
                      record.chartType === '饼图' ? <PieChartOutlined /> :
                      record.chartType === '折线图' ? <LineChartOutlined /> :
                      record.chartType === '散点图' ? <DotChartOutlined /> :
                      record.chartType === '热力图' || record.chartType === '热图网格' ? <HeatMapOutlined /> :
                      record.chartType === '箱线图' ? <BoxPlotOutlined /> :
                      record.chartType === '雷达图' ? <RadarChartOutlined /> :
                      record.chartType === '面积图' ? <AreaChartOutlined /> :
                      <BarChartOutlined />
                    }
                  >
                    预览
                  </Button>
                ),
              }
            ]}
            pagination={false}
          />
        </TabPane>

        {Object.entries(chartCategories).map(([category, charts]) => (
          <TabPane tab={category} key={category}>
            <Table
              dataSource={charts.map((item, index) => ({...item, key: index}))}
              columns={[
                {
                  title: '图表名称',
                  dataIndex: 'title',
                  key: 'title',
                  width: '20%'
                },
                {
                  title: '图表类型',
                  dataIndex: 'chartType',
                  key: 'chartType',
                  width: '15%',
                  render: (text) => <Tag color={text === '条形图' ? 'blue' : text === '饼图' ? 'green' : text === '折线图' ? 'purple' : text === '散点图' ? 'magenta' : text === '箱线图' ? 'orange' : text === '热力图' ? 'red' : text === '雷达图' ? 'cyan' : text === '面积图' ? 'geekblue' : text === '热图网格' ? 'volcano' : text === '双轴图' ? 'gold' : text === '桑基图' ? 'lime' : 'default'}>{text}</Tag>
                },
                {
                  title: '建议实现方式',
                  dataIndex: 'description',
                  key: 'description',
                  width: '50%'
                },
                {
                  title: '操作',
                  key: 'action',
                  render: (_, record) => (
                    <Button
                      type="primary"
                      size="small"
                      onClick={record.preview}
                      icon={
                        record.chartType === '条形图' ? <BarChartOutlined /> :
                        record.chartType === '饼图' ? <PieChartOutlined /> :
                        record.chartType === '折线图' ? <LineChartOutlined /> :
                        record.chartType === '散点图' ? <DotChartOutlined /> :
                        record.chartType === '热力图' || record.chartType === '热图网格' ? <HeatMapOutlined /> :
                        record.chartType === '箱线图' ? <BoxPlotOutlined /> :
                        record.chartType === '雷达图' ? <RadarChartOutlined /> :
                        record.chartType === '面积图' ? <AreaChartOutlined /> :
                        <BarChartOutlined />
                      }
                    >
                      预览
                    </Button>
                  ),
                }
              ]}
              pagination={false}
            />
          </TabPane>
        ))}
      </Tabs>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Alert
            message="分析建议"
            description="根据数据特性，建议优先关注时间趋势分析（折线图）和地区分布分析（条形图、热力图）。对于病毒类型之间的比较，饼图和堆积条形图效果较好。分析不同病毒之间的关系时，散点图和相关性分析会更有价值。"
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
          />
        </Col>
      </Row>

      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="数据可视化最佳实践" bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Card type="inner" title="时间序列分析">
                  <ul>
                    <li>使用折线图显示流感病例随时间的变化趋势</li>
                    <li>考虑季节性因素，按FLUSEASON或HEMISPHERE分组</li>
                    <li>可使用移动平均线平滑短期波动</li>
                  </ul>
                </Card>
              </Col>
              <Col span={8}>
                <Card type="inner" title="地理分布分析">
                  <ul>
                    <li>使用地图或热力图展示不同地区的流感活动</li>
                    <li>考虑规范化数据，使用INF_ALL/SPEC_PROCESSED_NB比率</li>
                    <li>可按WHOREGION或国家层级进行分组</li>
                  </ul>
                </Card>
              </Col>
              <Col span={8}>
                <Card type="inner" title="多变量相关性分析">
                  <ul>
                    <li>使用散点图或热力图展示不同病毒类型之间的相关性</li>
                    <li>考虑添加回归线以突出趋势</li>
                    <li>可计算相关系数矩阵并可视化</li>
                  </ul>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row>
        <Col span={24}>
          <Card title="图表生成步骤" bordered={false}>
            <Steps current={-1} direction="vertical">
              <StepItem title="数据导入与清洗" description="使用SPSS导入CSV文件，检查缺失值并进行必要的数据转换" />
              <StepItem title="数据探索与分析" description="使用描述性统计和简单图表初步了解数据分布和特性" />
              <StepItem title="选择合适的图表类型" description="根据分析目的和数据特性，从推荐列表中选择最合适的图表类型" />
              <StepItem title="图表参数设置" description="在SPSS中设置图表所需的变量、分组和样式参数" />
              <StepItem title="执行图表生成" description="点击确认按钮生成图表，并进行必要的调整" />
              <StepItem title="图表美化与导出" description="调整颜色、标签和布局，并导出为所需格式" />
            </Steps>
          </Card>
        </Col>
      </Row>

      <Modal
        title={`${previewContent.title} (${previewContent.chartType})`}
        visible={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="back" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
          <Button key="generate" type="primary">
            生成图表
          </Button>
        ]}
        width={700}
      >
        <div style={{ textAlign: 'center', padding: '20px' }}>
          {previewContent.image ? (
            <img src={previewContent.image} alt={previewContent.title} style={{ maxWidth: '100%' }} />
          ) : (
            <div style={{ padding: '40px', background: '#f5f5f5', borderRadius: '4px' }}>
              <Title level={4}>图表预览</Title>
              <Paragraph>
                此处将显示 {previewContent.chartType} 预览。在实际应用中，可以根据数据生成实时预览。
              </Paragraph>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default DatasetSpecificChartSuggestions;
