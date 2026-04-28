export type PolicyDoc = {
  slug: string;
  title: string;
  enTitle: string;
  effective: string;
  intro: string;
  sections: { heading: string; body: string[]; highlight?: string }[];
};

export const policies: Record<string, PolicyDoc> = {
  refund: {
    slug: 'refund',
    title: '退换货与售后政策',
    enTitle: 'Refund & After-sales Policy',
    effective: '2025年1月1日',
    intro:
      '感谢您选择 Luundy 高端麻将机。鉴于海运大型家具的特殊性质（单台重量约 100 公斤），请您在下单前务必仔细阅读以下退换货政策。我们承诺以最优质的售后服务保障您的权益。',
    sections: [
      {
        heading: '一、发货前取消订单',
        body: [
          '若您在订单发货前（状态显示为"处理中"）申请取消订单，我们将收取 15% 的库存恢复费（Restocking Fee），用于覆盖商品再次入库、重新打包以及行政管理成本。',
          '剩余款项将在 5–7 个工作日内原路退回。',
        ],
        highlight: '15% 库存恢复费',
      },
      {
        heading: '二、签收后 30 天内退货',
        body: [
          '签收 30 天内可申请无理由退货。商品需保持全新未使用状态，原包装木架完好。',
          '退货运费由买方承担，运费金额根据州际距离从 $300 起。',
          '验收无误后，款项将在 7 个工作日内退还。',
        ],
      },
      {
        heading: '三、商品质量问题',
        body: [
          '若签收后 30 天内发现明显质量问题，Luundy 将免费安排上门维修或更换部件。',
          '请在签收后 24 小时内拍摄完整开箱视频以备维权使用。',
        ],
      },
      {
        heading: '四、不可退换情形',
        body: [
          '使用超过 30 天且无质量问题的商品；',
          '人为损坏、自行改装或拆解机身后的商品；',
          '定制颜色 / 定制配件等特殊订单。',
        ],
      },
    ],
  },
  warranty: {
    slug: 'warranty',
    title: '质保条款',
    enTitle: 'Warranty Terms',
    effective: '2025年1月1日',
    intro:
      'Luundy 承诺为所有自动麻将机产品提供整机一年质保 + 核心机芯终身质保服务。',
    sections: [
      {
        heading: '一、整机一年质保',
        body: [
          '自签收日起 365 天内，非人为损坏的故障 Luundy 免费维修。',
          '常见配件（电机、传感器、PCB 主板）一年内免费更换。',
        ],
        highlight: '一年整机质保',
      },
      {
        heading: '二、核心机芯终身质保',
        body: [
          '出牌机芯、洗牌机构、升降模块享受终身免费维修。',
          '终身质保仅覆盖人工与运费以外的部件成本。',
        ],
        highlight: '机芯终身质保',
      },
      {
        heading: '三、质保范围外',
        body: [
          '人为撞击、跌落、进水所造成的损坏；',
          '使用非原厂配件导致的故障；',
          '正常使用磨损的台面、抽屉滑轨等。',
        ],
      },
      {
        heading: '四、维修流程',
        body: [
          '联系客服 → 描述故障并提供视频 → 邮寄配件或预约上门 → 维修完成。',
          '常规维修响应时间为 1–3 个工作日。',
        ],
      },
    ],
  },
  shipping: {
    slug: 'shipping',
    title: '配送说明',
    enTitle: 'Shipping Policy',
    effective: '2025年1月1日',
    intro:
      'Luundy 提供两种灵活的配送方式：海运直达与仓库自提，全美 48 州免费配送。',
    sections: [
      {
        heading: '一、海运直达',
        body: [
          '从中国工厂直接海运至您的家门口，全程 30–45 天。',
          '全程物流追踪，可在订单页面实时查看运输状态。',
          '送货上门含开箱、上楼、安装服务。',
        ],
        highlight: '海运 30–45 天',
      },
      {
        heading: '二、仓库自提 / Fedex 派送',
        body: [
          '美国洛杉矶、纽约仓库现货可立即提货。',
          '可选 Fedex 全美派送，3–7 个工作日送达。',
          '自提客户可享额外 $100–$150 优惠。',
        ],
      },
      {
        heading: '三、运费说明',
        body: [
          '海运直达：全美 48 州免费配送（夏威夷、阿拉斯加除外）。',
          '仓库自提：自取免费；Fedex 派送 $250 起。',
          '上楼服务：每层 $25（地面层免费）。',
        ],
      },
      {
        heading: '四、签收注意',
        body: [
          '请在签收时核对包装外观，如有破损请当场拒收。',
          '签收后请在 24 小时内开箱验货，发现问题及时联系客服。',
        ],
      },
    ],
  },
  privacy: {
    slug: 'privacy',
    title: '隐私政策',
    enTitle: 'Privacy Policy',
    effective: '2025年1月1日',
    intro:
      'Luundy 重视您的隐私。本政策说明我们如何收集、使用与保护您的个人信息。',
    sections: [
      {
        heading: '一、我们收集的信息',
        body: [
          '账户信息：姓名、邮箱、电话、收货地址。',
          '订单信息：购买记录、支付方式（不存储完整卡号）。',
          '使用数据：浏览页面、点击事件等匿名分析数据。',
        ],
      },
      {
        heading: '二、信息使用方式',
        body: [
          '处理订单、安排发货、提供客户服务；',
          '发送订单状态更新与售后通知（必需邮件）；',
          '改进网站体验、优化产品推荐。',
        ],
      },
      {
        heading: '三、第三方共享',
        body: [
          'Luundy 不会出售您的个人信息。',
          '仅在以下场景与第三方共享：物流服务商（仅地址 / 电话）、支付网关（PayPal / Stripe）、法律要求。',
        ],
      },
      {
        heading: '四、您的权利',
        body: [
          '随时访问、更新或删除您的账户信息。',
          '随时取消营销邮件订阅。',
          '如需查询所有数据，请发送邮件至 service@example.com。',
        ],
      },
    ],
  },
};

export const policyList = Object.values(policies);
