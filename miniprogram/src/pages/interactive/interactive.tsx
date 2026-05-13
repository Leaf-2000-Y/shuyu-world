import { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './interactive.css';

const layerData = [
  {
    layer: 5,
    name: '叙事行动层',
    subtitle: 'Narrative Action',
    color: '#e8c97a',
    items: ['叙事权', '框架效应', '使命召唤', '联机学习', '持续输出', '自由公式', '复利系统', '战略三阶段'],
  },
  {
    layer: 4,
    name: '系统设计层',
    subtitle: 'System Design',
    color: '#c8a44e',
    items: ['结构决定行为', '环境预置', '最小阻力之路', '创建型结构', '反馈回路设计', '系统优于目标'],
  },
  {
    layer: 3,
    name: '决策赋能层',
    subtitle: 'Decision & Empowerment',
    color: '#a09060',
    items: ['概率分布', '不对称性', '期权思维', '结构洞', '斜行定律', '期望价值公式', '多阶思维', '凯利公式', '反脆弱', '压力测试'],
  },
  {
    layer: 2,
    name: '认知操作系统',
    subtitle: 'Cognitive OS',
    color: '#809080',
    items: ['参照点管理', '偏误识别', '内部/外部视角', '可信度加权', '激进事实透明', '360度反馈', '痛苦+反思=进步', '掌控者循环'],
  },
  {
    layer: 1,
    name: '世界真相层',
    subtitle: 'Ground Truth',
    color: '#606870',
    items: ['五种不确定性', '四大硬约束', '回归均值', '重尾分布', '极端vs平均斯坦', '幂律分布', '肥尾效应', '复杂自适应系统', '矛盾动力学', '证伪主义'],
  },
];

const concepts = [
  { name: '极端斯坦', layer: 1 },
  { name: '幂律分布', layer: 1 },
  { name: '反身性', layer: 1 },
  { name: '叙事场', layer: 1 },
  { name: '矛盾论', layer: 1 },
  { name: '前景理论', layer: 2 },
  { name: '损失厌恶', layer: 2 },
  { name: '框架效应', layer: 2 },
  { name: '选择偏差', layer: 2 },
  { name: '可信度加权', layer: 2 },
  { name: '期望价值', layer: 3 },
  { name: '多阶思维', layer: 3 },
  { name: '凯利公式', layer: 3 },
  { name: '反脆弱', layer: 3 },
  { name: '非对称风险', layer: 3 },
  { name: '结构洞', layer: 4 },
  { name: '斜行定律', layer: 4 },
  { name: '环境预置', layer: 4 },
  { name: '能耐寻求', layer: 4 },
  { name: '叙事权', layer: 5 },
  { name: '使命召唤', layer: 5 },
  { name: '自由公式', layer: 5 },
  { name: '复利思维', layer: 5 },
  { name: '内外视角', layer: 5 },
];

const colorMap: Record<number, string> = {
  1: 'rgba(96, 104, 112, 0.3)',
  2: 'rgba(128, 144, 128, 0.3)',
  3: 'rgba(160, 144, 96, 0.3)',
  4: 'rgba(200, 164, 78, 0.3)',
  5: 'rgba(232, 201, 122, 0.3)',
};

const borderColorMap: Record<number, string> = {
  1: 'rgba(96, 104, 112, 0.6)',
  2: 'rgba(128, 144, 128, 0.6)',
  3: 'rgba(160, 144, 96, 0.6)',
  4: 'rgba(200, 164, 78, 0.6)',
  5: 'rgba(232, 201, 122, 0.6)',
};

const textColorMap: Record<number, string> = {
  1: '#a0a8b0',
  2: '#a0b0a0',
  3: '#d0c4a0',
  4: '#c8a44e',
  5: '#e8c97a',
};

export default function Interactive() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View className="interactive-page">
      <View className="interactive-header">
        <Text className="interactive-title">交互概念图谱</Text>
        <Text className="interactive-sub">五层世界理解模型 · 25个核心概念</Text>
      </View>

      {/* Tab bar */}
      <View className="tab-bar">
        <View
          className={`tab-item ${activeTab === 0 ? 'tab-active' : ''}`}
          onClick={() => setActiveTab(0)}
        >
          <Text>五层模型</Text>
        </View>
        <View
          className={`tab-item ${activeTab === 1 ? 'tab-active' : ''}`}
          onClick={() => setActiveTab(1)}
        >
          <Text>概念网格</Text>
        </View>
      </View>

      <ScrollView scrollY className="interactive-content" enhanced showScrollbar={false}>
        {activeTab === 0 ? (
          <View className="layers-view">
            {layerData.map((layer) => (
              <View key={layer.layer} className="layer-card" style={{ borderLeftColor: layer.color }}>
                <View className="layer-header">
                  <Text className="layer-name" style={{ color: layer.color }}>{layer.name}</Text>
                  <Text className="layer-subtitle">{layer.subtitle}</Text>
                </View>
                <View className="layer-items">
                  {layer.items.map((item) => (
                    <View key={item} className="layer-tag" style={{
                      backgroundColor: colorMap[layer.layer],
                      borderColor: borderColorMap[layer.layer],
                    }}>
                      <Text style={{ color: textColorMap[layer.layer] }}>{item}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="concepts-view">
            <View className="concepts-grid">
              {concepts.map((concept) => (
                <View key={concept.name} className="concept-card" style={{
                  borderColor: borderColorMap[concept.layer],
                }}>
                  <View className="concept-layer-dot" style={{ backgroundColor: textColorMap[concept.layer] }} />
                  <Text className="concept-name">{concept.name}</Text>
                  <Text className="concept-layer-label" style={{ color: textColorMap[concept.layer] }}>
                    L{concept.layer}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}