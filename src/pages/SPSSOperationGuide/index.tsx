import {
  ArrowRightOutlined,
  BarChartOutlined,
  CalculatorOutlined,
  ClockCircleOutlined,
  DatabaseOutlined,
  DotChartOutlined,
  FileOutlined,
  LineChartOutlined,
  OrderedListOutlined,
  PieChartOutlined,
  SaveOutlined,
  TableOutlined,
  DownloadOutlined
} from '@ant-design/icons';
import {
  Alert,
  Avatar,
  Breadcrumb,
  Button,
  Card,
  Col,
  Collapse,
  Divider,
  Layout,
  List,
  Menu,
  Row,
  Space,
  Statistic,
  Steps,
  Table,
  Tabs,
  Tag,
  Typography,
  message,
} from 'antd';
import React, { useState } from 'react';

const { Title, Paragraph, Text } = Typography;
const { Step } = Steps;
const { Panel } = Collapse;
const { TabPane } = Tabs;
const { Header, Content, Sider } = Layout;


const SPSSOperationGuide: React.FC = () => {
  const [current, setCurrent] = useState(0);

  const steps = [
    {
      title: '数据导入',
      icon: <FileOutlined />,
      content: (
        <Card title="第一步：数据导入" bordered={false}>
          <List
            bordered
            dataSource={[
              '1. 打开SPSS软件',
              '2. 点击"文件(File)" → "打开(Open)" → "数据(Data)"',
              '3. 在文件浏览对话框中找到并选择"VIW_FNT.csv"文件',
              '4. 在导入对话框中确认"第一行包含变量名(First row contains variable names)"选项已勾选',
              '5. 检查变量格式是否正确(数值型、字符型等)',
              '6. 点击"确定(OK)"导入数据',
            ]}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <Divider />
          <Card type="inner" title="导入提示">
            <Paragraph>
              <Text strong>变量类型确认：</Text>{' '}
              确保WHOREGION、COUNTRY_CODE等为字符型变量，而SPEC_PROCESSED_NB、INF_A等为数值型变量。
            </Paragraph>
            <Paragraph>
              <Text strong>日期处理：</Text>{' '}
              ISO_WEEKSTARTDATE和MMWR_WEEKSTARTDATE需要以日期格式导入，格式应为"YYYY-MM-DD"。
            </Paragraph>
          </Card>
        </Card>
      ),
    },
    {
      title: '数据清理与准备',
      icon: <DatabaseOutlined />,
      content: (
        <Card title="第二步：数据清理与准备" bordered={false}>
          <Collapse defaultActiveKey={['1']} ghost>
            <Panel header="1. 检查缺失值" key="1">
              <List
                bordered
                dataSource={[
                  '点击"分析(Analyze)" → "描述统计(Descriptive Statistics)" → "频次(Frequencies)"',
                  '选择所有关键变量，点击"确定(OK)"',
                  '检查结果中的缺失值情况',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </Panel>
            <Panel header="2. 变量重编码(如需)" key="2">
              <List
                bordered
                dataSource={[
                  '点击"转换(Transform)" → "计算变量(Compute Variable)"',
                  '为分析创建必要的新变量，如季节性分组、区域分类等',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
              <Card type="inner" title="变量重编码示例">
                <pre>
                  {`* 创建总检出率变量.
                    COMPUTE DetectionRate = INF_ALL / SPEC_PROCESSED_NB * 100.
                    EXECUTE.

                    * 创建流感类型分类变量.
                    RECODE INF_A INF_B INF_ALL
                      (0=0) (ELSE=1) INTO InfA_present InfB_present InfAny_present.
                    EXECUTE.`}
                </pre>
              </Card>
            </Panel>
            <Panel header="3. 日期格式处理" key="3">
              <List
                bordered
                dataSource={[
                  '对ISO_WEEKSTARTDATE和MMWR_WEEKSTARTDATE变量',
                  '点击"转换(Transform)" → "日期(Date)"，将字符格式转换为日期格式',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
              <Card type="inner" title="日期处理示例">
                <pre>
                  {`* 转换日期格式.
                  ALTER TYPE ISO_WEEKSTARTDATE MMWR_WEEKSTARTDATE (SDATE10).
                  EXECUTE.

                  * 提取月份信息.
                  COMPUTE ISO_MONTH = XDATE.MONTH(ISO_WEEKSTARTDATE).
                  EXECUTE.`}
                </pre>
              </Card>
            </Panel>
          </Collapse>
        </Card>
      ),
    },
    {
      title: '描述性统计分析',
      icon: <CalculatorOutlined />,
      content: (
        <Card title="第三步：描述性统计分析" bordered={false}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="基本统计量" key="1">
              <List
                bordered
                dataSource={[
                  '点击"分析(Analyze)" → "描述统计(Descriptive Statistics)" → "描述(Descriptives)"',
                  '选择所有数值变量(如SPEC_PROCESSED_NB, AH1N12009, AH3等)',
                  '在"选项(Options)"中选择均值、标准差、最小值、最大值、中位数等',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </TabPane>
            <TabPane tab="频率分析" key="2">
              <List
                bordered
                dataSource={[
                  '点击"分析(Analyze)" → "描述统计(Descriptive Statistics)" → "频次(Frequencies)"',
                  '选择分类变量(如WHOREGION, HEMISPHERE, COUNTRY_CODE等)',
                  '在"统计量(Statistics)"中选择众数',
                  '在"图表(Charts)"中选择条形图或饼图',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </TabPane>
            <TabPane tab="交叉表分析" key="3">
              <List
                bordered
                dataSource={[
                  '点击"分析(Analyze)" → "描述统计(Descriptive Statistics)" → "交叉表(Crosstabs)"',
                  '行变量选择WHOREGION或COUNTRY_AREA_TERRITORY',
                  '列变量选择FLUSEASON或HEMISPHERE',
                  '在"单元格(Cells)"中选择计数和百分比',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </TabPane>
          </Tabs>
        </Card>
      ),
    },
    {
      title: '探索性数据分析',
      icon: <BarChartOutlined />,
      content: (
        <Card title="第四步：探索性数据分析" bordered={false}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="箱线图分析" key="1">
              <List
                bordered
                dataSource={[
                  '点击"图形(Graphs)" → "旧对话框(Legacy Dialogs)" → "箱线图(Boxplot)"',
                  '选择"简单(Simple)"和"摘要独立变量的数据(Summaries of separate variables)"',
                  '添加需要分析的数值变量(如INF_A, INF_B, RSV等)',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
              <Card type="inner" title="示例图表">
                <Space direction="vertical">
                  <Text>箱线图可以展示不同流感病毒类型的分布特征，包括：</Text>
                  <ul>
                    <li>中位数（箱子中间的线）</li>
                    <li>四分位数范围（箱子范围）</li>
                    <li>异常值（离群点）</li>
                    <li>数据分布的偏态</li>
                  </ul>
                </Space>
              </Card>
            </TabPane>
            <TabPane tab="直方图分析" key="2">
              <List
                bordered
                dataSource={[
                  '点击"图形(Graphs)" → "旧对话框(Legacy Dialogs)" → "直方图(Histogram)"',
                  '选择需要分析的数值变量(如SPEC_PROCESSED_NB)',
                  '勾选"显示正态曲线(Display normal curve)"',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
              <Card type="inner" title="分析建议">
                <Paragraph>直方图对于检查数据分布特别有用，可以帮助确定：</Paragraph>
                <ul>
                  <li>数据是否呈正态分布</li>
                  <li>是否存在偏态</li>
                  <li>是否需要进行数据转换（如对数转换）</li>
                </ul>
              </Card>
            </TabPane>
            <TabPane tab="散点图分析" key="3">
              <List
                bordered
                dataSource={[
                  '点击"图形(Graphs)" → "旧对话框(Legacy Dialogs)" → "散点图(Scatter/Dot)"',
                  '选择"简单散点图(Simple Scatter)"',
                  'X轴选择一个数值变量(如ISO_WEEK)',
                  'Y轴选择另一个数值变量(如INF_ALL)',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
              <Card type="inner" title="适用场景">
                <Paragraph>散点图适用于：</Paragraph>
                <ul>
                  <li>检查两个连续变量之间的关系</li>
                  <li>识别潜在的相关性</li>
                  <li>发现异常值或数据模式</li>
                </ul>
                <Paragraph>例如：ISO_WEEK与INF_ALL的散点图可以显示流感活动的季节性模式。</Paragraph>
              </Card>
            </TabPane>
          </Tabs>
        </Card>
      ),
    },
    {
      title: '推断统计分析',
      icon: <CalculatorOutlined />,
      content: (
        <Card title="第五步：推断统计分析" bordered={false}>
          <Collapse defaultActiveKey={['1']} ghost>
            <Panel header="1. 相关性分析" key="1">
              <List
                bordered
                dataSource={[
                  '点击"分析(Analyze)" → "相关(Correlate)" → "双变量(Bivariate)"',
                  '选择多个数值变量(如AH1, AH3, INF_B, RSV等)',
                  '选择Pearson相关系数',
                  '勾选"双尾检验(Two-tailed)"和"标记显著相关性(Flag significant correlations)"',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </Panel>
            <Panel header="2. 独立样本t检验" key="2">
              <List
                bordered
                dataSource={[
                  '点击"分析(Analyze)" → "比较均值(Compare Means)" → "独立样本T检验(Independent-Samples T Test)"',
                  '测试变量选择数值变量(如INF_ALL, RSV等)',
                  '分组变量选择HEMISPHERE(需定义组：如"Northern"=1, "Southern"=2)',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </Panel>
            <Panel header="3. 单因素方差分析(ANOVA)" key="3">
              <List
                bordered
                dataSource={[
                  '点击"分析(Analyze)" → "比较均值(Compare Means)" → "单因素ANOVA(One-Way ANOVA)"',
                  '因变量选择数值变量(如INF_ALL)',
                  '因子变量选择WHOREGION',
                  '在"选项(Options)"中选择描述性统计和方差齐性检验',
                  '在"事后检验(Post Hoc)"中选择Tukey或Bonferroni检验',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </Panel>
            <Panel header="4. 非参数检验" key="4">
              <Paragraph>如数据不符合正态分布，使用Kruskal-Wallis检验:</Paragraph>
              <List
                bordered
                dataSource={[
                  '点击"分析(Analyze)" → "非参数检验(Nonparametric Tests)" → "独立样本(Independent Samples)"',
                  '选择适当的检验和变量',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </Panel>
          </Collapse>
        </Card>
      ),
    },
    {
      title: '回归分析',
      icon: <LineChartOutlined />,
      content: (
        <Card title="第六步：回归分析" bordered={false}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="线性回归分析" key="1">
              <List
                bordered
                dataSource={[
                  '点击"分析(Analyze)" → "回归(Regression)" → "线性(Linear)"',
                  '因变量选择INF_ALL或其他感兴趣的结果变量',
                  '自变量添加ISO_WEEK, ISO_YEAR和其他预测变量',
                  '在"统计量(Statistics)"中选择模型拟合度、系数估计、共线性诊断等',
                  '在"图(Plots)"中选择残差图和正态概率图',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </TabPane>
            <TabPane tab="二元Logistic回归" key="2">
              <Paragraph>如果创建了二分类结果变量:</Paragraph>
              <List
                bordered
                dataSource={[
                  '点击"分析(Analyze)" → "回归(Regression)" → "二元Logistic(Binary Logistic)"',
                  '依变量选择二分类变量(如高/低流感活动)',
                  '协变量添加相关预测变量',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
              <Card type="inner" title="二分类变量创建示例">
                <pre>
                  {`* 创建流感活动高低指标.
                  RECODE INF_ALL
                    (0 thru 10=0) (ELSE=1) INTO HighInfluenzaActivity.
                  EXECUTE.

                  * 进行Logistic回归.
                  LOGISTIC REGRESSION VARIABLES HighInfluenzaActivity
                    /METHOD=ENTER ISO_WEEK ISO_YEAR WHOREGION
                    /CRITERIA=PIN(0.05) POUT(0.10) ITERATE(20) CUT(0.5).`}
                </pre>
              </Card>
            </TabPane>
          </Tabs>
        </Card>
      ),
    },
    {
      title: '时间序列分析',
      icon: <ClockCircleOutlined />,
      content: (
        <Card title="第七步：时间序列分析" bordered={false}>
          <Collapse defaultActiveKey={['1']} ghost>
            <Panel header="1. 创建时间序列" key="1">
              <List
                bordered
                dataSource={[
                  '点击"数据(Data)" → "定义日期(Define Date)"',
                  '设置时间变量为ISO_WEEKSTARTDATE',
                  '指定周期类型为"周(Week)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
              <Card type="inner" title="数据准备提示">
                <Paragraph>确保数据按时间顺序排序：</Paragraph>
                <pre>{`SORT CASES BY ISO_WEEKSTARTDATE.`}</pre>
              </Card>
            </Panel>
            <Panel header="2. 时间序列图" key="2">
              <List
                bordered
                dataSource={[
                  '点击"图形(Graphs)" → "序列(Sequence)"',
                  '添加变量INF_ALL或其他感兴趣的变量',
                  '按WHOREGION或COUNTRY_CODE分组',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Panel>
            <Panel header="3. 时间序列模型" key="3">
              <List
                bordered
                dataSource={[
                  '点击"分析(Analyze)" → "预测(Forecasting)" → "创建模型(Create Models)"',
                  '选择因变量INF_ALL',
                  '选择合适的时间序列模型(如ARIMA)',
                  '在"统计量(Statistics)"中选择模型拟合度、参数估计等',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </Panel>
          </Collapse>
        </Card>
      ),
    },
    {
      title: '保存分析结果',
      icon: <SaveOutlined />,
      content: (
        <Card title="第八步：保存分析结果" bordered={false}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="输出结果保存" key="1">
              <List
                bordered
                dataSource={[
                  '在输出窗口点击"文件(File)" → "导出(Export)"',
                  '选择格式(PDF、Word、Excel等)',
                  '指定保存位置',
                  '点击"确定(OK)"',
                ]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </TabPane>
            <TabPane tab="图表导出" key="2">
              <List
                bordered
                dataSource={['右键点击图表 → "导出(Export)"', '选择格式和分辨率', '点击"确定(OK)"']}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
              <Card type="inner" title="图表格式建议">
                <Table
                  dataSource={[
                    {
                      key: '1',
                      format: 'PNG',
                      usage: '网页和演示文稿',
                      resolution: '96-150 DPI',
                    },
                    {
                      key: '2',
                      format: 'TIFF',
                      usage: '出版物和高质量打印',
                      resolution: '300 DPI以上',
                    },
                    {
                      key: '3',
                      format: 'JPEG',
                      usage: '照片类图像',
                      resolution: '150-300 DPI',
                    },
                    {
                      key: '4',
                      format: 'EPS/SVG',
                      usage: '矢量图形，可缩放',
                      resolution: '不适用',
                    },
                  ]}
                  columns={[
                    {
                      title: '格式',
                      dataIndex: 'format',
                      key: 'format',
                    },
                    {
                      title: '适用场景',
                      dataIndex: 'usage',
                      key: 'usage',
                    },
                    {
                      title: '推荐分辨率',
                      dataIndex: 'resolution',
                      key: 'resolution',
                    },
                  ]}
                  pagination={false}
                />
              </Card>
            </TabPane>
          </Tabs>
          <Divider />
          <Alert
                  message="流程结束"
                  description="流感监测数据集(VIW_FNT.csv)在页面底部下载"
                  type="info"
                  showIcon
                />
        </Card>
      ),
    },
    {
      title: 'SPSS操作快速参考表',
      icon: <SaveOutlined />,
      content: (
        <Card title="SPSS操作快速参考表" style={{ marginTop: 24 }}>
        <Table
          dataSource={[
            {
              key: '1',
              task: '导入CSV数据',
              path: '文件(File) → 打开(Open) → 数据(Data)',
              tips: '确保正确设置分隔符和变量类型',
            },
            {
              key: '2',
              task: '生成描述性统计',
              path: '分析(Analyze) → 描述统计(Descriptive Statistics) → 描述(Descriptives)',
              tips: '可选择均值、中位数、标准差等多种统计量',
            },
            {
              key: '3',
              task: '创建交叉表',
              path: '分析(Analyze) → 描述统计(Descriptive Statistics) → 交叉表(Crosstabs)',
              tips: '在单元格选项中可添加期望计数和百分比',
            },
            {
              key: '4',
              task: '独立样本t检验',
              path: '分析(Analyze) → 比较均值(Compare Means) → 独立样本T检验',
              tips: '需要为分组变量定义具体的组值',
            },
            {
              key: '5',
              task: '绘制箱线图',
              path: '图形(Graphs) → 旧对话框(Legacy Dialogs) → 箱线图(Boxplot)',
              tips: '可按因子层次设置分组变量',
            },
            {
              key: '6',
              task: '时间序列分析',
              path: '分析(Analyze) → 预测(Forecasting) → 创建模型(Create Models)',
              tips: '确保数据已按时间排序',
            },
            {
              key: '7',
              task: '导出结果',
              path: '输出窗口 → 文件(File) → 导出(Export)',
              tips: '可选PDF、Word、Excel等多种格式',
            },
          ]}
          columns={[
            {
              title: '任务',
              dataIndex: 'task',
              key: 'task',
              width: '20%',
            },
            {
              title: '菜单路径',
              dataIndex: 'path',
              key: 'path',
              width: '40%',
            },
            {
              title: '操作提示',
              dataIndex: 'tips',
              key: 'tips',
              width: '40%',
            },
          ]}
          pagination={false}
        />
      </Card>
      ),
    },
    {
      title: 'VIW_FNT.csv数据集特点',
      icon: <SaveOutlined />,
      content: (
        <Card title="VIW_FNT.csv数据集特点" style={{ marginTop: 24 }}>
        <Tabs defaultActiveKey="1">
          <TabPane tab="核心变量说明" key="1">
            <Table
              dataSource={[
                {
                  key: '1',
                  variable: 'WHOREGION',
                  type: '字符型',
                  description: 'WHO区域分类',
                },
                {
                  key: '2',
                  variable: 'FLUSEASON',
                  type: '字符型',
                  description: '流感季节标识',
                },
                {
                  key: '3',
                  variable: 'ISO_WEEKSTARTDATE',
                  type: '日期型',
                  description: '样本采集周开始日期',
                },
                {
                  key: '4',
                  variable: 'SPEC_PROCESSED_NB',
                  type: '数值型',
                  description: '处理样本数量',
                },
                {
                  key: '5',
                  variable: 'AH1N12009',
                  type: '数值型',
                  description: 'H1N1亚型流感阳性数',
                },
                {
                  key: '6',
                  variable: 'AH3',
                  type: '数值型',
                  description: 'H3亚型流感阳性数',
                },
                {
                  key: '7',
                  variable: 'INF_A',
                  type: '数值型',
                  description: 'A型流感阳性总数',
                },
                {
                  key: '8',
                  variable: 'INF_B',
                  type: '数值型',
                  description: 'B型流感阳性总数',
                },
                {
                  key: '9',
                  variable: 'INF_ALL',
                  type: '数值型',
                  description: '所有流感阳性总数',
                },
                {
                  key: '10',
                  variable: 'RSV',
                  type: '数值型',
                  description: '呼吸道合胞病毒阳性数',
                },
              ]}
              columns={[
                {
                  title: '变量名',
                  dataIndex: 'variable',
                  key: 'variable',
                  width: '25%',
                },
                {
                  title: '数据类型',
                  dataIndex: 'type',
                  key: 'type',
                  width: '15%',
                  render: (text) => {
                    let color =
                      text === '数值型' ? 'blue' : text === '字符型' ? 'green' : 'orange';
                    return <Tag color={color}>{text}</Tag>;
                  },
                },
                {
                  title: '描述',
                  dataIndex: 'description',
                  key: 'description',
                  width: '60%',
                },
              ]}
              pagination={false}
            />
          </TabPane>
          <TabPane tab="建议分析方向" key="2">
            <List
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 4,
                xxl: 4,
              }}
              dataSource={[
                {
                  title: '流感季节性趋势',
                  description: '分析各类型流感的季节性变化模式，探究高峰期和低谷期',
                  icon: <LineChartOutlined style={{ fontSize: 24 }} />,
                },
                {
                  title: '地区差异比较',
                  description: '比较不同WHO区域或国家的流感活动水平差异',
                  icon: <PieChartOutlined style={{ fontSize: 24 }} />,
                },
                {
                  title: '流感亚型分布',
                  description: '分析不同流感亚型的相对分布及其随时间的变化',
                  icon: <BarChartOutlined style={{ fontSize: 24 }} />,
                },
                {
                  title: '流感与其他病毒关系',
                  description: '探究流感与RSV等呼吸道病毒之间的关系',
                  icon: <DotChartOutlined style={{ fontSize: 24 }} />,
                },
                {
                  title: '检测率预测模型',
                  description: '建立时间序列模型预测未来流感检测率',
                  icon: <LineChartOutlined style={{ fontSize: 24 }} />,
                },
                {
                  title: '流行病学影响因素',
                  description: '分析可能影响流感活动的因素（如半球、季节）',
                  icon: <CalculatorOutlined style={{ fontSize: 24 }} />,
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Card hoverable>
                    <Card.Meta
                      avatar={
                        <Avatar icon={item.icon} style={{ backgroundColor: '#1890ff' }} />
                      }
                      title={item.title}
                      description={item.description}
                    />
                  </Card>
                </List.Item>
              )}
            />
          </TabPane>
          <TabPane tab="常见分析错误" key="3">
            <Alert
              message="数据分析常见错误及防范"
              description={
                <List
                  bordered
                  dataSource={[
                    '未检查缺失值：使用描述性统计检查缺失值，考虑适当的缺失值处理方法',
                    '忽略数据分布：进行参数检验前检查正态性假设，必要时选择非参数方法',
                    '未规范化比例数据：分析检测率时使用INF_ALL/SPEC_PROCESSED_NB计算比例',
                    '跨季节直接比较：考虑北半球和南半球季节差异，分组分析',
                    '忽略多重比较问题：多重检验时使用Bonferroni等校正方法',
                    '不合理的分组：确保分组变量的分类有实际意义且样本量充足',
                  ]}
                  renderItem={(item) => <List.Item>{item}</List.Item>}
                />
              }
              type="warning"
              showIcon
            />
          </TabPane>
        </Tabs>
      </Card>
      ),
    },
    {
      title: '常见SPSS问题解决',
      icon: <SaveOutlined />,
      content: (
        <Card title="常见SPSS问题解决" style={{ marginTop: 24 }}>
              <Collapse>
                <Panel header="如何处理缺失值？" key="1">
                  <Paragraph>SPSS提供多种缺失值处理方法：</Paragraph>
                  <ul>
                    <li>
                      <strong>列表删除(Listwise deletion)</strong>
                      ：在分析中移除所有含有任何缺失值的案例
                    </li>
                    <li>
                      <strong>成对删除(Pairwise deletion)</strong>
                      ：只在特定变量分析中移除含有该变量缺失值的案例
                    </li>
                    <li>
                      <strong>均值替代(Mean substitution)</strong>：用变量的均值替代缺失值
                    </li>
                    <li>
                      <strong>回归替代(Regression imputation)</strong>：基于其他变量预测缺失值
                    </li>
                    <li>
                      <strong>多重插补(Multiple imputation)</strong>：创建多个已填补的数据集版本
                    </li>
                  </ul>
                  <Paragraph>
                    在菜单中，可以通过{' '}
                    <Text code>分析(Analyze) → 多重插补(Multiple Imputation)</Text> 访问相关功能。
                  </Paragraph>
                </Panel>
                <Panel header="如何检查数据是否符合正态分布？" key="2">
                  <Paragraph>可以通过以下方法检查：</Paragraph>
                  <ol>
                    <li>
                      <strong>描述性统计：</strong>{' '}
                      <Text code>
                        分析(Analyze) → 描述统计(Descriptive Statistics) → 探索(Explore)
                      </Text>
                      ， 在"图"选项中勾选"正态概率图"和"有去趋势的正态图"
                    </li>
                    <li>
                      <strong>正态性检验：</strong>{' '}
                      <Text code>
                        分析(Analyze) → 描述统计(Descriptive Statistics) → 探索(Explore)
                      </Text>
                      ， 查看Kolmogorov-Smirnov和Shapiro-Wilk检验结果
                    </li>
                    <li>
                      <strong>偏度和峰度：</strong> 检查描述性统计中的偏度和峰度值，正态分布应接近0
                    </li>
                    <li>
                      <strong>直方图：</strong>{' '}
                      <Text code>图形(Graphs) → 旧对话框(Legacy Dialogs) → 直方图(Histogram)</Text>
                      ， 勾选"显示正态曲线"
                    </li>
                  </ol>
                </Panel>
                <Panel header="如何在SPSS中进行数据转换？" key="3">
                  <Paragraph>常见的数据转换包括：</Paragraph>
                  <ul>
                    <li>
                      <strong>对数转换：</strong>{' '}
                      <Text code>转换(Transform) → 计算变量(Compute Variable)</Text>，
                      使用LN(x)或LOG10(x)函数
                    </li>
                    <li>
                      <strong>平方根转换：</strong>{' '}
                      <Text code>转换(Transform) → 计算变量(Compute Variable)</Text>，
                      使用SQRT(x)函数
                    </li>
                    <li>
                      <strong>归一化(Z分数)：</strong>{' '}
                      <Text code>
                        分析(Analyze) → 描述统计(Descriptive Statistics) → 描述(Descriptives)
                      </Text>
                      ， 在"保存标准化值为变量"中勾选
                    </li>
                    <li>
                      <strong>重编码：</strong>{' '}
                      <Text code>
                        转换(Transform) → 重编码为不同变量(Recode into Different Variables)
                      </Text>
                    </li>
                  </ul>
                  <Paragraph>对于偏态数据，对数转换和平方根转换常用于改善正态性。</Paragraph>
                </Panel>
                <Panel header="如何解释SPSS中的p值？" key="4">
                  <Paragraph>P值解释指南：</Paragraph>
                  <Table
                    dataSource={[
                      {
                        key: '1',
                        pValue: 'p > 0.05',
                        interpretation: '未达到统计显著性，无充分证据拒绝零假设',
                        action: '无法断定存在效应或差异',
                      },
                      {
                        key: '2',
                        pValue: '0.01 < p ≤ 0.05',
                        interpretation: '达到统计显著性，有证据拒绝零假设',
                        action: '可以报告存在效应或差异，但需谨慎解释',
                      },
                      {
                        key: '3',
                        pValue: '0.001 < p ≤ 0.01',
                        interpretation: '强统计显著性',
                        action: '可较为确信存在效应或差异',
                      },
                      {
                        key: '4',
                        pValue: 'p ≤ 0.001',
                        interpretation: '极强统计显著性',
                        action: '高度确信存在效应或差异',
                      },
                    ]}
                    columns={[
                      {
                        title: 'P值范围',
                        dataIndex: 'pValue',
                        key: 'pValue',
                      },
                      {
                        title: '解释',
                        dataIndex: 'interpretation',
                        key: 'interpretation',
                      },
                      {
                        title: '建议行动',
                        dataIndex: 'action',
                        key: 'action',
                      },
                    ]}
                    pagination={false}
                  />
                  <Paragraph style={{ marginTop: 16 }}>
                    <Text type="warning">注意：</Text>{' '}
                    统计显著性不等同于实际重要性。小样本中的大效应可能不显著，而大样本中的小效应可能显著。始终结合效应量和置信区间解释结果。
                  </Paragraph>
                </Panel>
              </Collapse>
            </Card>
      ),
    },
  ];

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  const handleSteps = (key) => {
    console.log(key,'aaaaa',current)
    setCurrent(key);
  };
  const formatUrl=(basePath, fileName) =>{
    const encodedFileName = encodeURIComponent(fileName);
    return `${basePath}/${encodedFileName}`;
  }
  const handleDownload = () => {
    const basePath = "https://pub-04e1a8056507443a9e433df36f7c0463.r2.dev";
    const fileName='VIW_FNT.csv';
    const fileUrl=formatUrl(basePath,fileName)
    window.open(fileUrl, "_blank");
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{ display: 'flex', alignItems: 'center', background: '#001529', padding: '0 16px' }}
      >
        <div style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
          SPSS操作流程指南
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            onClick={(e) => handleSteps(e.key-1)}
            style={{ height: '100%', borderRight: 0 }}
          >
            <Menu.ItemGroup key="g1" title="数据准备">
              <Menu.Item key="1" icon={<FileOutlined />}>
                数据导入
              </Menu.Item>
              <Menu.Item key="2" icon={<DatabaseOutlined />}>
                数据清理与准备
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup key="g2" title="数据分析">
              <Menu.Item key="3" icon={<CalculatorOutlined />}>
                描述性统计分析
              </Menu.Item>
              <Menu.Item key="4" icon={<BarChartOutlined />}>
                探索性数据分析
              </Menu.Item>
              <Menu.Item key="5" icon={<CalculatorOutlined />}>
                推断统计分析
              </Menu.Item>
              <Menu.Item key="6" icon={<LineChartOutlined />}>
                回归分析
              </Menu.Item>
              <Menu.Item key="7" icon={<ClockCircleOutlined />}>
                时间序列分析
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup key="g3" title="结果处理">
              <Menu.Item key="8" icon={<SaveOutlined />}>
                保存分析结果
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup key="g4" title="其他">
              <Menu.Item key="9" icon={<SaveOutlined />}>
                SPSS操作快速参考表
              </Menu.Item>
              <Menu.Item key="10" icon={<SaveOutlined />}>
                VIW_FNT.csv数据集特点
              </Menu.Item>
              <Menu.Item key="11" icon={<SaveOutlined />}>
                常见SPSS问题解决
              </Menu.Item>
            </Menu.ItemGroup>
          </Menu>
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item>SPSS分析</Breadcrumb.Item>
            <Breadcrumb.Item>VIW_FNT.csv分析流程</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            style={{
              background: '#fff',
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Card style={{ marginBottom: 24 }}>
              <Title level={2}>SPSS分析操作流程：流感监测数据(VIW_FNT.csv)</Title>
              <Paragraph>
                本指南提供了使用SPSS对流感监测数据进行全面分析的详细步骤。按照以下步骤操作，您可以进行从数据导入到结果导出的完整分析流程。数据(VIW_FNT.csv)通过页面底部按钮下载。
              </Paragraph>
              <div style={{ display: 'flex', marginBottom: 16 }}>
                <Card style={{ marginRight: 8, flex: 1 }} hoverable>
                  <Statistic title="分析步骤" value={8} prefix={<OrderedListOutlined />} />
                </Card>
                <Card style={{ marginRight: 8, flex: 1 }} hoverable>
                  <Statistic title="变量数量" value={53} prefix={<DatabaseOutlined />} />
                </Card>
                <Card style={{ marginRight: 8, flex: 1 }} hoverable>
                  <Statistic title="数据行数" value={'168,993'} prefix={<TableOutlined />} />
                </Card>
                <Card style={{ flex: 1 }} hoverable>
                  <Statistic title="分析方法" value={20} prefix={<BarChartOutlined />} />
                </Card>
              </div>
            </Card>

            <Steps current={current}>
              {steps.map((item) => (
                <Step key={item.title} title={item.title} icon={item.icon} />
              ))}
            </Steps>
            <div className="steps-content" style={{ marginTop: 24 }}>
              {steps[current].content}
            </div>

            <div className="steps-action" style={{ marginTop: 24 }}>
              {current < steps.length - 1 && (
                <Button type="primary" onClick={() => next()}>
                  下一步 <ArrowRightOutlined />
                </Button>
              )}
              {current === steps.length - 1 && (
                <Button type="primary" onClick={() => message.success('SPSS分析流程完成!')}>
                  完成
                </Button>
              )}
              {current > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                  上一步
                </Button>
              )}
            </div>

            <Row gutter={16} style={{ marginTop: 24 }}>
              <Col span={24}>
                <Alert
                  message="分析建议"
                  description="流感监测数据集(VIW_FNT.csv)包含大量时间序列和地区分布信息，建议重点关注时间趋势、地区差异和病毒类型之间的关系。完成基本统计分析后，可以尝试更复杂的时间序列模型和多变量分析，以发现更深层次的数据规律。"
                  type="info"
                  showIcon
                />
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 24 }}>
              <Col span={8}>
                <Button type="primary" icon={<DownloadOutlined />} block onClick={() => handleDownload()}>
                  下载VIW_FNT.csv
                </Button>
              </Col>

            </Row>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default SPSSOperationGuide;
