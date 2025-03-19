<Statistic title="变量数量" value={53} prefix={<DatabaseOutlined />} />
                </Card>
                <Card style={{ marginRight: 8, flex: 1 }} hoverable>
                  <Statistic title="数据行数" value={"168,993"} prefix={<TableOutlined />} />
                </Card>
                <Card style={{ flex: 1 }} hoverable>
                  <Statistic title="分析方法" value={20} prefix={<BarChartOutlined />} />
                </Card>
              </div>
            </Card>

            <Steps current={current}>
              {steps.map(item => (
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
                <Button
                  type="primary"
                  onClick={() => message.success('SPSS分析流程完成!')}
                >
                  完成
                </Button>
              )}
              {current > 0 && (
                <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                  上一步
                </Button>
              )}
            </div>

            <Divider />

            <Card title="SPSS操作快速参考表" style={{ marginTop: 24 }}>
              <Table
                dataSource={[
                  {
                    key: '1',
                    task: '导入CSV数据',
                    path: '文件(File) → 打开(Open) → 数据(Data)',
                    tips: '确保正确设置分隔符和变量类型'
                  },
                  {
                    key: '2',
                    task: '生成描述性统计',
                    path: '分析(Analyze) → 描述统计(Descriptive Statistics) → 描述(Descriptives)',
                    tips: '可选择均值、中位数、标准差等多种统计量'
                  },
                  {
                    key: '3',
                    task: '创建交叉表',
                    path: '分析(Analyze) → 描述统计(Descriptive Statistics) → 交叉表(Crosstabs)',
                    tips: '在单元格选项中可添加期望计数和百分比'
                  },
                  {
                    key: '4',
                    task: '独立样本t检验',
                    path: '分析(Analyze) → 比较均值(Compare Means) → 独立样本T检验',
                    tips: '需要为分组变量定义具体的组值'
                  },
                  {
                    key: '5',
                    task: '绘制箱线图',
                    path: '图形(Graphs) → 旧对话框(Legacy Dialogs) → 箱线图(Boxplot)',
                    tips: '可按因子层次设置分组变量'
                  },
                  {
                    key: '6',
                    task: '时间序列分析',
                    path: '分析(Analyze) → 预测(Forecasting) → 创建模型(Create Models)',
                    tips: '确保数据已按时间排序'
                  },
                  {
                    key: '7',
                    task: '导出结果',
                    path: '输出窗口 → 文件(File) → 导出(Export)',
                    tips: '可选PDF、Word、Excel等多种格式'
                  }
                ]}
                columns={[
                  {
                    title: '任务',
                    dataIndex: 'task',
                    key: 'task',
                    width: '20%'
                  },
                  {
                    title: '菜单路径',
                    dataIndex: 'path',
                    key: 'path',
                    width: '40%'
                  },
                  {
                    title: '操作提示',
                    dataIndex: 'tips',
                    key: 'tips',
                    width: '40%'
                  }
                ]}
                pagination={false}
              />
            </Card>

            <Card title="VIW_FNT.csv数据集特点" style={{ marginTop: 24 }}>
              <Tabs defaultActiveKey="1">
                <TabPane tab="核心变量说明" key="1">
                  <Table
                    dataSource={[
                      {
                        key: '1',
                        variable: 'WHOREGION',
                        type: '字符型',
                        description: 'WHO区域分类'
                      },
                      {
                        key: '2',
                        variable: 'FLUSEASON',
                        type: '字符型',
                        description: '流感季节标识'
                      },
                      {
                        key: '3',
                        variable: 'ISO_WEEKSTARTDATE',
                        type: '日期型',
                        description: '样本采集周开始日期'
                      },
                      {
                        key: '4',
                        variable: 'SPEC_PROCESSED_NB',
                        type: '数值型',
                        description: '处理样本数量'
                      },
                      {
                        key: '5',
                        variable: 'AH1N12009',
                        type: '数值型',
                        description: 'H1N1亚型流感阳性数'
                      },
                      {
                        key: '6',
                        variable: 'AH3',
                        type: '数值型',
                        description: 'H3亚型流感阳性数'
                      },
                      {
                        key: '7',
                        variable: 'INF_A',
                        type: '数值型',
                        description: 'A型流感阳性总数'
                      },
                      {
                        key: '8',
                        variable: 'INF_B',
                        type: '数值型',
                        description: 'B型流感阳性总数'
                      },
                      {
                        key: '9',
                        variable: 'INF_ALL',
                        type: '数值型',
                        description: '所有流感阳性总数'
                      },
                      {
                        key: '10',
                        variable: 'RSV',
                        type: '数值型',
                        description: '呼吸道合胞病毒阳性数'
                      }
                    ]}
                    columns={[
                      {
                        title: '变量名',
                        dataIndex: 'variable',
                        key: 'variable',
                        width: '25%'
                      },
                      {
                        title: '数据类型',
                        dataIndex: 'type',
                        key: 'type',
                        width: '15%',
                        render: text => {
                          let color = text === '数值型' ? 'blue' : text === '字符型' ? 'green' : 'orange';
                          return <Tag color={color}>{text}</Tag>;
                        }
                      },
                      {
                        title: '描述',
                        dataIndex: 'description',
                        key: 'description',
                        width: '60%'
                      }
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
                        icon: <LineChartOutlined style={{ fontSize: 24 }} />
                      },
                      {
                        title: '地区差异比较',
                        description: '比较不同WHO区域或国家的流感活动水平差异',
                        icon: <PieChartOutlined style={{ fontSize: 24 }} />
                      },
                      {
                        title: '流感亚型分布',
                        description: '分析不同流感亚型的相对分布及其随时间的变化',
                        icon: <BarChartOutlined style={{ fontSize: 24 }} />
                      },
                      {
                        title: '流感与其他病毒关系',
                        description: '探究流感与RSV等呼吸道病毒之间的关系',
                        icon: <DotChartOutlined style={{ fontSize: 24 }} />
                      },
                      {
                        title: '检测率预测模型',
                        description: '建立时间序列模型预测未来流感检测率',
                        icon: <LineChartOutlined style={{ fontSize: 24 }} />
                      },
                      {
                        title: '流行病学影响因素',
                        description: '分析可能影响流感活动的因素（如半球、季节）',
                        icon: <CalculatorOutlined style={{ fontSize: 24 }} />
                      }
                    ]}
                    renderItem={item => (
                      <List.Item>
                        <Card hoverable>
                          <Card.Meta
                            avatar={<Avatar icon={item.icon} style={{ backgroundColor: '#1890ff' }} />}
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
                          "未检查缺失值：使用描述性统计检查缺失值，考虑适当的缺失值处理方法",
                          "忽略数据分布：进行参数检验前检查正态性假设，必要时选择非参数方法",
                          "未规范化比例数据：分析检测率时使用INF_ALL/SPEC_PROCESSED_NB计算比例",
                          "跨季节直接比较：考虑北半球和南半球季节差异，分组分析",
                          "忽略多重比较问题：多重检验时使用Bonferroni等校正方法",
                          "不合理的分组：确保分组变量的分类有实际意义且样本量充足"
                        ]}
                        renderItem={item => <List.Item>{item}</List.Item>}
                      />
                    }
                    type="warning"
                    showIcon
                  />
                </TabPane>
              </Tabs>
            </Card>

            <Card title="常见SPSS问题解决" style={{ marginTop: 24 }}>
              <Collapse>
                <Panel header="如何处理缺失值？" key="1">
                  <Paragraph>
                    SPSS提供多种缺失值处理方法：
                  </Paragraph>
                  <ul>
                    <li><strong>列表删除(Listwise deletion)</strong>：在分析中移除所有含有任何缺失值的案例</li>
                    <li><strong>成对删除(Pairwise deletion)</strong>：只在特定变量分析中移除含有该变量缺失值的案例</li>
                    <li><strong>均值替代(Mean substitution)</strong>：用变量的均值替代缺失值</li>
                    <li><strong>回归替代(Regression imputation)</strong>：基于其他变量预测缺失值</li>
                    <li><strong>多重插补(Multiple imputation)</strong>：创建多个已填补的数据集版本</li>
                  </ul>
                  <Paragraph>
                    在菜单中，可以通过 <Text code>分析(Analyze) → 多重插补(Multiple Imputation)</Text> 访问相关功能。
                  </Paragraph>
                </Panel>
                <Panel header="如何检查数据是否符合正态分布？" key="2">
                  <Paragraph>
                    可以通过以下方法检查：
                  </Paragraph>
                  <ol>
                    <li>
                      <strong>描述性统计：</strong> <Text code>分析(Analyze) → 描述统计(Descriptive Statistics) → 探索(Explore)</Text>，
                      在"图"选项中勾选"正态概率图"和"有去趋势的正态图"
                    </li>
                    <li>
                      <strong>正态性检验：</strong> <Text code>分析(Analyze) → 描述统计(Descriptive Statistics) → 探索(Explore)</Text>，
                      查看Kolmogorov-Smirnov和Shapiro-Wilk检验结果
                    </li>
                    <li>
                      <strong>偏度和峰度：</strong> 检查描述性统计中的偏度和峰度值，正态分布应接近0
                    </li>
                    <li>
                      <strong>直方图：</strong> <Text code>图形(Graphs) → 旧对话框(Legacy Dialogs) → 直方图(Histogram)</Text>，
                      勾选"显示正态曲线"
                    </li>
                  </ol>
                </Panel>
                <Panel header="如何在SPSS中进行数据转换？" key="3">
                  <Paragraph>
                    常见的数据转换包括：
                  </Paragraph>
                  <ul>
                    <li>
                      <strong>对数转换：</strong> <Text code>转换(Transform) → 计算变量(Compute Variable)</Text>，
                      使用LN(x)或LOG10(x)函数
                    </li>
                    <li>
                      <strong>平方根转换：</strong> <Text code>转换(Transform) → 计算变量(Compute Variable)</Text>，
                      使用SQRT(x)函数
                    </li>
                    <li>
                      <strong>归一化(Z分数)：</strong> <Text code>分析(Analyze) → 描述统计(Descriptive Statistics) → 描述(Descriptives)</Text>，
                      在"保存标准化值为变量"中勾选
                    </li>
                    <li>
                      <strong>重编码：</strong> <Text code>转换(Transform) → 重编码为不同变量(Recode into Different Variables)</Text>
                    </li>
                  </ul>
                  <Paragraph>
                    对于偏态数据，对数转换和平方根转换常用于改善正态性。
                  </Paragraph>
                </Panel>
                <Panel header="如何解释SPSS中的p值？" key="4">
                  <Paragraph>
                    P值解释指南：
                  </Paragraph>
                  <Table
                    dataSource={[
                      {
                        key: '1',
                        pValue: 'p > 0.05',
                        interpretation: '未达到统计显著性，无充分证据拒绝零假设',
                        action: '无法断定存在效应或差异'
                      },
                      {
                        key: '2',
                        pValue: '0.01 < p ≤ 0.05',
                        interpretation: '达到统计显著性，有证据拒绝零假设',
                        action: '可以报告存在效应或差异，但需谨慎解释'
                      },
                      {
                        key: '3',
                        pValue: '0.001 < p ≤ 0.01',
                        interpretation: '强统计显著性',
                        action: '可较为确信存在效应或差异'
                      },
                      {
                        key: '4',
                        pValue: 'p ≤ 0.001',
                        interpretation: '极强统计显著性',
                        action: '高度确信存在效应或差异'
                      }
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
                      }
                    ]}
                    pagination={false}
                  />
                  <Paragraph style={{ marginTop: 16 }}>
                    <Text type="warning">注意：</Text> 统计显著性不等同于实际重要性。小样本中的大效应可能不显著，而大样本中的小效应可能显著。始终结合效应量和置信区间解释结果。
                  </Paragraph>
                </Panel>
              </Collapse>
            </Card>

            <Divider />

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
                <Button type="primary" icon={<DownloadOutlined />} block>
                  下载完整操作指南
                </Button>
              </Col>
              <Col span={8}>
                <Button icon={<ExportOutlined />} block>
                  导出SPSS语法文件
                </Button>
              </Col>
              <Col span={8}>
                <Button icon={<QuestionCircleOutlined />} block>
                  获取更多帮助
                </Button>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

import { OrderedListOutlined, DotChartOutlined } from '@ant-design/icons';
import { Statistic, Avatar, Steps } from 'antd';

export default SPSSOperationGuide;
