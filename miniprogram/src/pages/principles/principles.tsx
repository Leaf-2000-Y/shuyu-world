import { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import './principles.css';

const principles = [
  {
    name: '极端斯坦',
    category: '世界认知',
    desc: '区分平均斯坦与极端斯坦，识别重尾世界的肥尾效应与马太效应',
    apps: ['职业选择', '投资决策', '风险评估'],
  },
  {
    name: '复杂自适应系统',
    category: '世界认知',
    desc: '理解滞后效应、反馈回路、临界点和路径依赖四重特性',
    apps: ['战略规划', '系统设计', '趋势判断'],
  },
  {
    name: '矛盾动力论',
    category: '哲学根基',
    desc: '矛盾是叙事场的底层引擎，抓住主要矛盾即解决问题',
    apps: ['问题分析', '叙事构建', '冲突化解'],
  },
  {
    name: '证伪主义',
    category: '哲学根基',
    desc: '科学的核心不是证实而是证伪，通过排除错误逼近正确',
    apps: ['知识验证', '专家判断', '自我审视'],
  },
  {
    name: '前景理论',
    category: '认知偏误',
    desc: '参照点决定得失感知，S型曲线揭示得与失的不对称',
    apps: ['定价策略', '说服沟通', '风险管理'],
  },
  {
    name: '选择偏差',
    category: '认知偏误',
    desc: '四副面孔——幸存者、自我选择、分组选拔、门槛偏差',
    apps: ['信息筛选', '案例研究', '数据分析'],
  },
  {
    name: '可信度加权',
    category: '决策工具',
    desc: '3次可验证成功+因果逻辑解释=可信者，整合多方观点',
    apps: ['信息评估', '团队决策', '专家咨询'],
  },
  {
    name: '期望价值公式',
    category: '决策工具',
    desc: '收益×概率-损失×概率，永远不做输了就出局的决策',
    apps: ['创业评估', '项目选择', '风险管理'],
  },
  {
    name: '多阶思维',
    category: '决策工具',
    desc: '一阶看直接结果，二阶看后续连锁，三阶看系统级影响',
    apps: ['技能投资', '职业规划', '战略布局'],
  },
  {
    name: '反脆弱',
    category: '决策工具',
    desc: '构建下行风险可控、上行空间无限的非对称结构',
    apps: ['试错策略', '产品迭代', '个人成长'],
  },
  {
    name: '凯利公式',
    category: '决策工具',
    desc: '行动力度匹配认知深度，追求复利而非单次输赢',
    apps: ['资源分配', '下注策略', '时间管理'],
  },
  {
    name: '系统优于目标',
    category: '赋能体系',
    desc: '追求系统而非具体目标，系统持续产生复利效应',
    apps: ['习惯养成', '职业发展', '学习规划'],
  },
  {
    name: '环境预置法',
    category: '赋能体系',
    desc: '能量沿最小阻力之路流动，设计环境让正确行动自动化',
    apps: ['习惯设计', '工作流', '行为改变'],
  },
  {
    name: '结构洞',
    category: '赋能体系',
    desc: '站在不连通网络边界做翻译者，认知在交换中指数增长',
    apps: ['社交策略', '知识获取', '商业机会'],
  },
  {
    name: '斜行定律',
    category: '赋能体系',
    desc: '越直接追求越得不到，走间接路线实现目标',
    apps: ['财富积累', '关系建立', '影响力构建'],
  },
  {
    name: '叙事权',
    category: '叙事行动',
    desc: '谁定义参照点谁就获得权力，框架效应是叙事权的直接体现',
    apps: ['品牌构建', '领导力', '个人IP'],
  },
  {
    name: '自由公式',
    category: '叙事行动',
    desc: '财富=专长×杠杆×判断力，自由=毫无代价地说不',
    apps: ['职业定位', '能力构建', '财富规划'],
  },
  {
    name: '复利思维',
    category: '叙事行动',
    desc: '一切有价值事物遵循复利曲线，拐点之前最考验定力',
    apps: ['长期投资', '技能积累', '品牌建设'],
  },
  {
    name: '痛苦+反思=进步',
    category: '认知偏误',
    desc: '痛苦是认知模型与现实差距的信号，深度反思驱动进化',
    apps: ['个人成长', '复盘机制', '心态管理'],
  },
  {
    name: '内外视角辩证',
    category: '叙事行动',
    desc: '内部视角驱动行动，外部视角校准方向，辩证统一',
    apps: ['决策判断', '自我评价', '战略调整'],
  },
  {
    name: '能耐寻求定理',
    category: '赋能体系',
    desc: '看不见奖励时往增加选项的方向走，最大化未来可能性',
    apps: ['职业探索', '学习路径', '资源投资'],
  },
  {
    name: '规划谬误',
    category: '认知偏误',
    desc: '系统性低估时间和成本，高估收益——因为你用的是内部视角',
    apps: ['项目规划', '时间管理', '预算制定'],
  },
  {
    name: '激进透明',
    category: '决策工具',
    desc: '不过滤坏消息，建立360度全景信息反馈系统',
    apps: ['团队管理', '自我认知', '生态构建'],
  },
  {
    name: '压力测试',
    category: '决策工具',
    desc: '对每个重大决策预演乐观、中性、悲观三种情景',
    apps: ['风险预案', '投资组合', '职业安全'],
  },
];

const categories = [...new Set(principles.map((p) => p.category))];

export default function Principles() {
  const [activeCat, setActiveCat] = useState('全部');

  const filteredPrinciples = useMemo(() => {
    if (activeCat === '全部') return principles;
    return principles.filter((p) => p.category === activeCat);
  }, [activeCat]);

  return (
    <View className="principles-page">
      <View className="principles-header">
        <Text className="principles-title">原则体系</Text>
        <Text className="principles-sub">24个核心原则 · 6大分类</Text>
      </View>

      {/* Category filter */}
      <ScrollView scrollX className="cat-scroll" enhanced showScrollbar={false}>
        <View className="cat-items">
          <View
            className={`cat-item ${activeCat === '全部' ? 'cat-active' : ''}`}
            onClick={() => setActiveCat('全部')}
          >
            <Text>全部</Text>
          </View>
          {categories.map((cat) => (
            <View
              key={cat}
              className={`cat-item ${activeCat === cat ? 'cat-active' : ''}`}
              onClick={() => setActiveCat(cat)}
            >
              <Text>{cat}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Principles grid */}
      <ScrollView scrollY className="principles-content" enhanced showScrollbar={false}>
        <View className="principles-grid">
          {filteredPrinciples.map((p) => (
            <View key={p.name} className="principle-card">
              <Text className="principle-name">{p.name}</Text>
              <Text className="principle-cat">{p.category}</Text>
              <Text className="principle-desc">{p.desc}</Text>
              <View className="principle-apps">
                {p.apps.map((app) => (
                  <View key={app} className="app-tag">
                    <Text>{app}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}