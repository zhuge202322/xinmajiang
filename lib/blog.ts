export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  views: number;
  date: string;
  cover: string; // placeholder color
  image: string;
  content: string[]; // paragraphs
};

export const blogTags = [
  '全部文章',
  '麻将机选购',
  '选购指南',
  '麻将知识',
  '麻将机保养与维护',
  '经常打麻将的好处',
  '家具指南',
  '家庭用品',
  '麻将指南',
  '家庭游戏',
];

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-pick-mahjong-table',
    title: '家用自动麻将机推荐指南：如何选择最佳家用机型',
    excerpt: '从机芯类型、尺寸、噪音、价格四个维度，帮你一文挑出最合适的家用自动麻将机。',
    tag: '麻将机选购',
    views: 38,
    date: '2026-03-12',
    cover: '#a07e5c',
    image: '/img/b1.jpg',
    content: [
      '选购家用自动麻将机时，第一件需要考虑的事情是机芯类型。目前主流分为四口机和旋翼机两大类。',
      '四口机结构经典稳定，故障率低，价格也更友好；旋翼机则胜在出牌效率，且不需要推牌，体验更流畅。',
      '尺寸方面，建议先量好家中麻将间或客厅的可用面积。常见折叠机展开后约 90×90 cm，餐桌款则在 110–120 cm 之间。',
      '噪音是另一个重要指标。ZHONGQUE 全系产品均采用双层降噪结构，运行噪音控制在 45 dB 以下，相当于安静办公室的水平。',
      '最后是预算。$500–$700 的折叠机能满足绝大多数家庭使用，$700+ 的餐桌款则更适合有家居美学要求的用户。',
    ],
  },
  {
    slug: 'mahjong-rules-by-region',
    title: '中国各地麻将玩法指南 | Chinese Mahjong Rules by Region',
    excerpt: '从广东推倒胡到四川血战到底，一文看懂中国 8 大主流麻将玩法的核心区别。',
    tag: '麻将知识',
    views: 57,
    date: '2026-03-08',
    cover: '#7c5a4a',
    image: '/img/b2.jpg',
    content: [
      '中国麻将玩法因地域差异极大。北方多打 136 张全套，南方部分地区只用 108 张（去掉东南西北）。',
      '广东麻将以"推倒胡"为主，简单直接；四川麻将则以"血战到底"闻名，三方一旦有人胡牌，剩下两家继续对战。',
      '上海麻将带百搭，玩法灵活；长沙麻将讲究跑马转牌，对运气依赖更大。',
      '海外华人多以广东麻将和上海麻将为主，因此 ZHONGQUE 默认配置兼顾这两种规则的张数。',
    ],
  },
  {
    slug: 'mahjong-table-maintenance',
    title: '自动麻将机保养指南：让爱机用上 10 年',
    excerpt: '日常清洁、季度保养、年度检修——让你的自动麻将机长寿的全套实用方法。',
    tag: '麻将机保养与维护',
    views: 29,
    date: '2026-02-25',
    cover: '#5d6e4f',
    image: '/img/b3.jpg',
    content: [
      '日常清洁建议每周一次，使用微湿软布擦拭面板，避免使用酒精或溶剂类清洁剂。',
      '季度保养时，需要打开抽屉清理碎屑，并在导轨处涂抹少量硅油以保持顺滑。',
      '年度检修建议联系 ZHONGQUE 售后或当地经销商，对机芯进行专业除尘和润滑。',
    ],
  },
  {
    slug: 'mahjong-benefits',
    title: '经常打麻将的 5 大好处',
    excerpt: '锻炼大脑、社交连接、缓解压力——麻将不只是娱乐。',
    tag: '经常打麻将的好处',
    views: 102,
    date: '2026-02-14',
    cover: '#945c3a',
    image: '/img/b4.jpg',
    content: [
      '第一，锻炼大脑：研究表明，定期玩麻将能显著降低老年痴呆症风险。',
      '第二，社交连接：四人围坐，是华人社区中最自然的家庭与朋友活动。',
      '第三，缓解压力：专注于牌局能让大脑短暂从工作压力中抽离。',
    ],
  },
  {
    slug: 'home-furniture-mahjong',
    title: '家具与麻将桌的搭配美学',
    excerpt: '让自动麻将机融入你的家居风格，而不是格格不入的"机器"。',
    tag: '家具指南',
    views: 41,
    date: '2026-02-02',
    cover: '#6b4f3a',
    image: '/img/b5.jpg',
    content: [
      '现代极简风建议选择灰色或卡其色机身，配合大理石餐桌款。',
      '中式古典风更适合实木饰面的折叠款，搭配木地板与中式椅。',
      '北欧风可选粉色或绿色款，活泼但不抢眼。',
    ],
  },
  {
    slug: 'family-game-night',
    title: '打造家庭游戏之夜：麻将的另一种打开方式',
    excerpt: '从儿童参与到亲子互动，麻将其实是绝佳的家庭游戏。',
    tag: '家庭游戏',
    views: 18,
    date: '2026-01-20',
    cover: '#5a6a8a',
    image: '/img/b6.jpg',
    content: [
      '从 8 岁起，孩子就可以学习简化版麻将规则，培养逻辑思维。',
      '建议父母先教记牌、再教组合，最后再引入"胡"的概念。',
    ],
  },
];

export function getPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
