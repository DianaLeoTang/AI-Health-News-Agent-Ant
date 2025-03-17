

import React, { useState } from 'react';
import { Layout, Menu, Typography, Steps, Collapse, List, Divider, Card, Tag, Row, Col, Image, Space, Table, Alert } from 'antd';
import {
  BarChartOutlined,
  PieChartOutlined,
  LineChartOutlined,
  ScatterPlotOutlined,
  FileTextOutlined,
  SettingOutlined,
  AreaChartOutlined,
  RadarChartOutlined,
  HeatMapOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;


// 定义图表类型的数据结构
interface ChartType {
  key: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  examples: Array<{
    title: string;
    steps: string[];
    image?: string;
  }>;
}

const SPSSGuide: React.FC = () => {
  const [selectedMenu, setSelectedMenu] = useState('1');

  // 定义左侧菜单项
  const menuItems = [
    { key: '1', icon: <FileTextOutlined />, label: 'CSV文件导入' },
    { key: '2', icon: <SettingOutlined />, label: '数据准备和清洗' },
    { key: '3', icon: <FileTextOutlined />, label: '描述性统计分析' },
    { key: '4', icon: <BarChartOutlined />, label: '图表创建', submenu: [
      { key: '4.1', label: '条形图' },
      { key: '4.2', label: '饼图' },
      { key: '4.3', label: '直方图' },
      { key: '4.4', label: '折线图' },
      { key: '4.5', label: '散点图' },
      { key: '4.6', label: '箱线图' },
      { key: '4.7', label: '面积图' },
      { key: '4.8', label: '雷达图' },
      { key: '4.9', label: '热力图' },
    ]},
    { key: '5', icon: <SettingOutlined />, label: '图表美化与导出' },
    { key: '6', icon: <FileTextOutlined />, label: '数据集特定图表建议' },
  ];

  // 定义各种图表类型及其实现步骤
  const chartTypes: ChartType[] = [
    {
      key: 'bar',
      title: '条形图',
      icon: <BarChartOutlined />,
      description: '用于比较不同类别之间的数量关系',
      examples: [
        {
          title: '单变量条形图',
          steps: [
            '点击"Graphs" → "Legacy Dialogs" → "Bar"',
            '选择"Simple"，点击"Define"',
            '在"Category Axis"中放入分类变量（如COUNTRY_AREA_TERRITORY）',
            '在"Bars Represent"中选择"N of cases"或具体变量的统计量',
            '点击"OK"生成图表'
          ]
        },
        {
          title: '聚类条形图',
          steps: [
            '点击"Graphs" → "Legacy Dialogs" → "Bar"',
            '选择"Clustered"，点击"Define"',
            '在"Category Axis"中放入主分类变量（如WHOREGION）',
            '在"Define Clusters by"中放入子分类变量（如HEMISPHERE）',
            '在"Bars Represent"中选择想要分析的变量（如INF_A）',
            '点击"OK"生成图表'
          ]
        }
      ]
    },
    {
      key: 'pie',
      title: '饼图',
      icon: <PieChartOutlined />,
      description: '展示整体中各部分的占比',
      examples: [
        {
          title: '基本饼图',
          steps: [
            '点击"Graphs" → "Legacy Dialogs" → "Pie"',
            '选择"Summaries for groups of cases"，点击"Define"',
            '在"Define Slices by"中放入分类变量（如WHOREGION）',
            '点击"OK"生成图表'
          ]
        }
      ]
    },
    {
      key: 'histogram',
      title: '直方图',
      icon: <BarChartOutlined />,
      description: '展示连续数据的分布情况',
      examples: [
        {
          title: '单变量直方图',
          steps: [
            '点击"Graphs" → "Legacy Dialogs" → "Histogram"',
            '在"Variable"中选择数值变量（如INF_ALL）',
            '点击"OK"生成图表'
          ]
        }
      ]
    },
    {
      key: 'line',
      title: '折线图',
      icon: <LineChartOutlined />,
      description: '展示数据随时间的变化趋势',
      examples: [
        {
          title: '简单折线图',
          steps: [
            '点击"Graphs" → "Legacy Dialogs" → "Line"',
            '选择"Simple"，点击"Define"',
            '在"Category Axis"中放入时间变量（如ISO_WEEK）',
            '在"Line Represents"中放入需要分析的变量（如INF_A）',
            '点击"OK"生成图表'
          ]
        },
        {
          title: '多折线图',
          steps: [
            '点击"Graphs" → "Legacy Dialogs" → "Line"',
            '选择"Multiple"，点击"Define"',
            '在"Lines"中放入多个变量（如INF_A、INF_B、RSV）',
            '点击"OK"生成图表'
          ]
        }
      ]
    },
    {
      key: 'scatter',
      title: '散点图',
      icon: <ScatterPlotOutlined />,
      description: '展示两个变量之间的相关关系',
      examples: [
        {
          title: '简单散点图',
          steps: [
            '点击"Graphs" → "Legacy Dialogs" → "Scatter/Dot"',
            '选择"Simple Scatter"，点击"Define"',
            '在"Y Axis"放入一个变量（如INF_A）',
            '在"X Axis"放入另一个变量（如RSV）',
            '点击"OK"生成图表'
          ]
        },
        {
          title: '矩阵散点图',
          steps: [
            '点击"Graphs" → "Legacy Dialogs" → "Scatter/Dot"',
            '选择"Matrix Scatter"，点击"Define"',
            '选择多个变量（如INF_A、INF_B、RSV、ADENO）',
            '点击"OK"生成图表'
          ]
        }
      ]
    },
    {
      key: 'boxplot',
      title: '箱线图',
      icon: <BarChartOutlined />,
      description: '展示数据分布的中位数、四分位数和异常值',
      examples: [
        {
          title: '简单箱线图',
          steps: [
            '点击"Graphs" → "Legacy Dialogs" → "Boxplot"',
            '选择"Simple"，点击"Define"',
            '在"Variable"中放入数值变量（如INF_ALL）',
            '在"Category Axis"中放入分组变量（如WHOREGION）',
            '点击"OK"生成图表'
          ]
        },
        {
          title: '聚类箱线图',
          steps: [
            '点击"Graphs" → "Legacy Dialogs" → "Boxplot"',
            '选择"Clustered"，点击"Define"',
            '在"Variable"中放入数值变量（如INF_A）',
            '在"Category Axis"中放入主分组变量（如WHOREGION）',
            '在"Define Clusters by"中放入子分组变量（如HEMISPHERE）',
            '点击"OK"生成图表'
          ]
        }
      ]
    },
    {
      key: 'area',
      title: '面积图',
      icon: <AreaChartOutlined />,
      description: '强调随时间变化的数量，特别适合展示堆叠的部分和整体',
      examples: [
        {
          title: '堆积面积图',
          steps: [
            '点击"Graphs" → "Legacy Dialogs" → "Area"',
            '选择"Stacked"，点击"Define"',
            '在"Category Axis"中放入时间变量（如ISO_WEEK）',
            '在"Stack by"中放入多个变量（如INF_A、INF_B、RSV）',
            '点击"OK"生成图表'
          ]
        }
      ]
    },
    {
      key: 'radar',
      title: '雷达图',
      icon: <RadarChartOutlined />,
      description: '比较多个定量变量，展示多维数据',
      examples: [
        {
          title: '基本雷达图',
          steps: [
            '点击"Graphs" → "Legacy Dialogs" → "Polar"',
            '在变量列表中选择多个变量',
            '点击"OK"生成图表'
          ]
        }
      ]
    },
    {
      key: 'heatmap',
      title: '热力图',
      icon: <HeatMapOutlined />,
      description: '使用颜色深浅表示数值大小，适合展示分类数据交叉的频率',
      examples: [
        {
          title: '使用透视表创建热力图',
          steps: [
            '点击"Analyze" → "Descriptive Statistics" → "Crosstabs"',
            '在"Row(s)"中放入一个分类变量（如WHOREGION）',
            '在"Column(s)"中放入另一个分类变量（如HEMISPHERE）',
            '点击"Cells"，选择"Count"和"Percentages"',
            '点击"OK"生成透视表',
            '双击生成的透视表，进入"SPSS Pivot Table Editor"',
            '右击表格，选择"Table Properties"',
            '在"Cell Formats"选项卡中，设置条件格式以创建热力图效果'
          ]
        }
      ]
    }
  ];

  // 数据集特定图表建议
  const specificChartSuggestions = [
    {
      title: '流感类型分布饼图',
      description: '使用INF_A、INF_B和其他流感类型数据创建饼图，展示不同流感类型的比例',
      chartType: '饼图'
    },
    {
      title: '按地区的流感活动条形图',
      description: 'X轴：WHOREGION或COUNTRY_AREA_TERRITORY，Y轴：INF_ALL的平均值或总和',
      chartType: '条形图'
    },
    {
      title: '流感季节趋势折线图',
      description: 'X轴：ISO_WEEK或MMWR_WEEK，Y轴：INF_A、INF_B、RSV等数据，分组：FLUSEASON或HEMISPHERE',
      chartType: '折线图'
    },
    {
      title: '不同亚型的时间趋势多折线图',
      description: 'X轴：时间（ISO_WEEKSTARTDATE），Y轴：不同的流感亚型（AH1、AH3、AH1N12009等）',
      chartType: '折线图'
    },
    {
      title: '流感与其他呼吸道病毒的相关性散点图',
      description: 'X轴：INF_ALL，Y轴：RSV、ADENO、HUMAN_CORONA等',
      chartType: '散点图'
    },
    {
      title: '按地区和季节的流感检测率热力图',
      description: '行：WHOREGION或COUNTRY_AREA_TERRITORY，列：FLUSEASON，单元格值：INF_ALL/SPEC_PROCESSED_NB（检测率）',
      chartType: '热力图'
    },
    {
      title: '不同呼吸道病毒的季节性箱线图',
      description: 'Y轴：各种病毒数据（INF_A、INF_B、RSV等），X轴：FLUSEASON或HEMISPHERE，分组：WHOREGION',
      chartType: '箱线图'
    },
    {
      title: '流感阳性率的地区比较雷达图',
      description: '多个轴代表不同地区，数值代表INF_ALL占SPEC_PROCESSED_NB的百分比',
      chartType: '雷达图'
    },
    {
      title: '流感与RSV活动的堆积面积图',
      description: 'X轴：时间（ISO_WEEK），Y轴堆积区域：INF_A、INF_B、RSV，分组：HEMISPHERE或FLUSEASON',
      chartType: '面积图'
    },
    {
      title: '病毒检测分布的复合条形图',
      description: 'X轴：WHOREGION，Y轴：各类病毒的检测数量，分组：病毒类型（INF_A、INF_B、RSV、ADENO等）',
      chartType: '条形图'
    }
  ];

  // 渲染内容区域
  const renderContent = () => {
    // CSV文件导入步骤
    if (selectedMenu === '1') {
      return (
        <div>
          <Title level={2}>1. CSV文件导入</Title>
          <Steps direction="vertical" current={-1}>
            <Step title="打开SPSS软件" description="启动SPSS Statistics程序" />
            <Step
              title='点击菜单栏中的"File" → "Open" → "Data"'
              description="打开数据文件导入对话框"
            />
            <Step
              title='在弹出的对话框中，将"Files of type"更改为"CSV(*.csv)"'
              description="确保SPSS能够识别CSV文件格式"
            />
            <Step
              title='浏览并选择VIW_FNT.csv文件，然后点击"Open"'
              description="选择要导入的数据文件"
            />
            <Step
              title='在"Text Import Wizard"中设置导入选项'
              description={
                <div>
                  <p>第一步：选择"Yes, variable names are included at the top of file"（如果CSV第一行是标题），点击"Next"</p>
                  <p>第二步：确认分隔符为"Comma"，点击"Next"</p>
                  <p>第三步：检查每个变量的数据格式，修改任何需要调整的数据类型：</p>
                  <ul>
                    <li>对于日期型变量（如ISO_WEEKSTARTDATE、MMWR_WEEKSTARTDATE）选择"Date"格式</li>
                    <li>对于数值型变量保持"Numeric"格式</li>
                    <li>对于文本型变量（如WHOREGION、COUNTRY_AREA_TERRITORY）选择"String"格式</li>
                  </ul>
                  <p>点击"Finish"完成导入</p>
                </div>
              }
            />
          </Steps>
          <Alert
            message="注意事项"
            description="导入CSV文件时，请特别注意日期格式的设置，确保SPSS正确识别日期列。如果数据包含缺失值，SPSS会自动识别并用系统缺失值标记。"
            type="info"
            showIcon
            style={{ marginTop: 20 }}
          />
        </div>
      );
    }

    // 数据准备和清洗
    else if (selectedMenu === '2') {
      return (
        <div>
          <Title level={2}>2. 数据准备和清洗</Title>
          <Collapse defaultActiveKey={['1']}>
            <Panel header="检查缺失值" key="1">
              <Steps direction="vertical" current={-1}>
                <Step title='点击"Analyze" → "Descriptive Statistics" → "Frequencies"' description="打开频次分析对话框" />
                <Step title='选择所有变量，点击"OK"' description="生成每个变量的频次统计表" />
                <Step title="检查输出中是否有缺失值，如有需要进行处理" description="缺失值在输出中会被标记为'Missing'" />
              </Steps>
            </Panel>
            <Panel header="变量标记和测量水平设置" key="2">
              <Steps direction="vertical" current={-1}>
                <Step
                  title='在"Variable View"中，为每个变量设置适当的"Measure"级别'
                  description={
                    <div>
                      <p>点击SPSS底部的"Variable View"标签，切换到变量视图</p>
                      <p>对于每个变量，在"Measure"列中设置合适的测量级别：</p>
                      <ul>
                        <li>"Nominal"（名义）：适用于无序分类变量，如WHOREGION、COUNTRY_CODE等</li>
                        <li>"Ordinal"（有序）：适用于有序分类变量</li>
                        <li>"Scale"（尺度）：适用于连续数值变量，如各种病毒检测数量、百分比等</li>
                      </ul>
                    </div>
                  }
                />
                <Step
                  title='为分类变量设置值标签'
                  description='右击变量名 → 选择"Define Variable Properties"，添加值标签以提高数据可读性'
                />
              </Steps>
            </Panel>
            <Panel header="数据筛选（如果需要）" key="3">
              <Steps direction="vertical" current={-1}>
                <Step title='点击"Data" → "Select Cases"' description="打开数据筛选对话框" />
                <Step
                  title="选择符合条件的数据"
                  description="可以筛选特定地区、时间段或其他符合分析需求的数据子集"
                />
              </Steps>
            </Panel>
          </Collapse>
        </div>
      );
    }

    // 描述性统计分析
    else if (selectedMenu === '3') {
      return (
        <div>
          <Title level={2}>3. 描述性统计分析</Title>
          <Card title="基本描述统计" style={{ marginBottom: 16 }}>
            <Steps direction="vertical" current={-1}>
              <Step title='点击"Analyze" → "Descriptive Statistics" → "Descriptives"' description="打开描述统计对话框" />
              <Step title="选择数值变量（如INF_A、INF_B、RSV等）" description="添加需要分析的定量变量" />
              <Step
                title='点击"Options"，选择均值、标准差、最小值、最大值等统计量'
                description="根据分析需求选择要计算的统计量"
              />
              <Step title='点击"OK"生成报告' description="SPSS将生成所选变量的描述统计表" />
            </Steps>
          </Card>

          <Card title="频次表分析">
            <Steps direction="vertical" current={-1}>
              <Step title='点击"Analyze" → "Descriptive Statistics" → "Frequencies"' description="打开频次分析对话框" />
              <Step title="选择分类变量（如WHOREGION、HEMISPHERE、COUNTRY_CODE等）" description="添加需要分析的分类变量" />
              <Step title='点击"Statistics"，选择需要的统计指标' description="可选择众数、中位数等统计量" />
              <Step title='点击"OK"生成频次表' description="SPSS将生成包含频数和百分比的频次表" />
            </Steps>
          </Card>
        </div>
      );
    }

    // 图表创建 - 主菜单
    else if (selectedMenu === '4') {
      return (
        <div>
          <Title level={2}>4. 图表创建</Title>
          <Row gutter={[16, 16]}>
            {chartTypes.map(chart => (
              <Col xs={24} sm={12} md={8} key={chart.key}>
                <Card
                  hoverable
                  onClick={() => setSelectedMenu(`4.${chartTypes.findIndex(c => c.key === chart.key) + 1}`)}
                  style={{ height: 200 }}
                >
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, marginBottom: 16 }}>{chart.icon}</div>
                    <Title level={4}>{chart.title}</Title>
                    <Text type="secondary">{chart.description}</Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      );
    }

    // 图表创建 - 各类图表详情
    else if (selectedMenu.startsWith('4.')) {
      const chartIndex = parseInt(selectedMenu.split('.')[1]) - 1;
      const chartType = chartTypes[chartIndex];

      return (
        <div>
          <Title level={2}>{chartType.title}</Title>
          <Paragraph>{chartType.description}</Paragraph>

          {chartType.examples.map((example, index) => (
            <Card
              title={example.title}
              style={{ marginBottom: 16 }}
              key={index}
            >
              <List
                bordered
                dataSource={example.steps}
                renderItem={(item, i) => (
                  <List.Item>
                    <Typography.Text mark>[步骤 {i+1}]</Typography.Text> {item}
                  </List.Item>
                )}
              />
            </Card>
          ))}

          <div style={{ marginTop: 16 }}>
            <Button type="primary" onClick={() => setSelectedMenu('4')}>
              返回图表类型选择
            </Button>
          </div>
        </div>
      );
    }

    // 图表美化与导出
    else if (selectedMenu === '5') {
      return (
        <div>
          <Title level={2}>5. 图表美化与导出</Title>
          <Steps direction="vertical" current={-1}>
            <Step
              title='双击任何图表进入"Chart Editor"'
              description="在输出查看器中双击已创建的图表，打开图表编辑器"
            />
            <Step
              title="修改图表外观"
              description={
                <div>
                  <p>在图表编辑器中，您可以进行以下操作：</p>
                  <ul>
                    <li>添加/修改标题与标签：双击相应部分进行编辑</li>
                    <li>更改颜色：右击图表元素，选择"Properties"，修改颜色</li>
                    <li>调整字体：选择文本元素，右击选择"Properties"，修改字体</li>
                    <li>添加参考线：右击图表区域，选择"Add Reference Line"</li>
                  </ul>
                </div>
              }
            />
            <Step
              title="导出图表"
              description={
                <div>
                  <p>在图表编辑器中，执行以下步骤导出图表：</p>
                  <ol>
                    <li>点击"File" → "Export"</li>
                    <li>选择导出格式（如JPEG、PNG、PDF等）</li>
                    <li>设置分辨率和大小</li>
                    <li>选择保存位置并点击"OK"</li>
                  </ol>
                </div>
              }
            />
          </Steps>

          <Alert
            message="图表美化技巧"
            description="为了使图表更加专业和可读，建议添加清晰的标题、轴标签和图例。对于重要数据点，可以添加数据标签。合理选择颜色方案，避免使用过于鲜艳或相似的颜色，特别是在需要对比数据时。"
            type="info"
            showIcon
            style={{ marginTop: 20 }}
          />
        </div>
      );
    }

    // 数据集特定图表建议
    else if (selectedMenu === '6') {
      return (
        <div>
          <Title level={2}>6. 针对VIW_FNT.csv数据集的特定图表建议</Title>
          <Paragraph>基于您提供的流感监测数据，以下是一些特别推荐的可视化方案：</Paragraph>

          <Table
            dataSource={specificChartSuggestions.map((item, index) => ({...item, key: index}))}
            columns={[
              {
                title: '图表名称',
                dataIndex: 'title',
                key: 'title',
              },
              {
                title: '图表类型',
                dataIndex: 'chartType',
                key: 'chartType',
                render: (text) => <Tag color={text === '条形图' ? 'blue' : text === '饼图' ? 'green' : text === '折线图' ? 'purple' : text === '散点图' ? 'magenta' : text === '箱线图' ? 'orange' : text === '热力图' ? 'red' : text === '雷达图' ? 'cyan' : text === '面积图' ? 'geekblue' : 'default'}>{text}</Tag>
              },
              {
                title: '建议实现方式',
                dataIndex: 'description',
                key: 'description',
              }
            ]}
            pagination={false}
          />

          <Divider />

          <Alert
            message="分析建议"
            description="根据数据特性，建议优先关注时间趋势分析（折线图）和地区分布分析（条形图、热力图）。对于病毒类型之间的比较，饼图和堆积条形图效果较好。分析不同病毒之间的关系时，散点图和相关性分析会更有价值。"
            type="info"
            showIcon
          />
        </div>
      );
    }
  };

  // 递归渲染菜单，支持子菜单
  const renderMenuItems = (items) => {
    return items.map(item => {
      if (item.submenu) {
        return (
          <Menu.SubMenu key={item.key} icon={item.icon} title={item.label}>
            {renderMenuItems(item.submenu)}
          </Menu.SubMenu>
        );
      }
      return <Menu.Item key={item.key} icon={item.icon}>{item.label}</Menu.Item>;
    });
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#001529', padding: '0 16px' }}>
        <div style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
          SPSS操作流程指南
        </div>
      </Header>
      <Layout>
        <Sider width={250} theme="light" breakpoint="lg" collapsedWidth="0">
          <Menu
            mode="inline"
            selectedKeys={[selectedMenu]}
            defaultOpenKeys={['4']}
            style={{ height: '100%', borderRight: 0 }}
            onClick={(e) => setSelectedMenu(e.key)}
          >
            {renderMenuItems(menuItems)}
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
              overflow: 'auto'
            }}
          >
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

// 定义一个简单的Button组件，模拟Ant Design的Button
// 在实际应用中应导入Ant Design的Button组件
const Button = ({ children, type, onClick }) => {
  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '2px',
    cursor: 'pointer',
    fontWeight: 500,
    display: 'inline-block',
    backgroundColor: type === 'primary' ? '#1890ff' : '#fff',
    color: type === 'primary' ? '#fff' : 'rgba(0, 0, 0, 0.65)',
    border: type === 'primary' ? 'none' : '1px solid #d9d9d9',
  };

  return (
    <button style={buttonStyle} onClick={onClick}>
      {children}
    </button>
  );
};

export default SPSSGuide;
