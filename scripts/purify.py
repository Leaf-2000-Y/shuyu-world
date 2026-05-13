#!/usr/bin/env python3
import json, re

with open('/Users/yiyirowan/Library/Mobile Documents/iCloud~md~obsidian/Documents/first/原则.canvas', 'r') as f:
    data = json.load(f)

author_names = [
    '万维钢', '瑞·达利欧', '达利欧', '毛泽东', '塔勒布', '纳瓦尔',
    '李笑来', '古典', '罗伯特·弗里茨', '弗里茨', '桥水',
    '斯科特·亚当斯', '亚当斯', '卡尼曼', '特沃斯基', '索罗斯',
    '沃尔夫勒姆', '奈特', '罗伯特·格林', '罗纳德·伯特', '拉杰·切蒂', '切蒂',
    'Dalio', 'Taleb', 'Naval', 'Kahneman', 'Tversky', 'Soros',
    'Wolfram', 'Knight', 'Greene', 'Burt', 'Chetty',
]

brand_lines = [
    r'得到《[^》]*》', r'混沌学园《[^》]*》', r'TEDx[^，,\n]*',
    r'新精英《[^》]*》', r'《[^》]*》.*?原著',
]

def clean(text):
    for name in author_names:
        text = text.replace(name, '')
    for pattern in brand_lines:
        text = re.sub(pattern, '', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    return text.strip()

purified = []
for node in data.get('nodes', []):
    t = node.get('text', '').strip()
    if t:
        pt = clean(t)
        if pt and len(pt) > 5:
            purified.append({'id': node.get('id',''), 'type': node.get('type',''), 'text': pt})

out = '/Users/yiyirowan/Desktop/繁荣概念地图/树语世界/src/data/principles_purified.json'
with open(out, 'w', encoding='utf-8') as f:
    json.dump(purified, f, ensure_ascii=False, indent=2)
print(f'Written {len(purified)} nodes to {out}')