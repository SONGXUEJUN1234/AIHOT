// 这个行业的分类体系：类别、标签词表、公司（主体）名录，以及防止张冠李戴的身份词典。
// 模型按这里的词表打标签，主题页（topics.json）按标签归类，筛选栏按类别分组。
// 换行业时：类别的 key 会出现在网址里（/all?category=…），上线后就不要再改；标签和名录可以随时增减。

/**
 * 网页上的类别（筛选栏、卡片角标、RSS 分类订阅）。key 是网址和接口里的身份，上线后不要改。
 * section 是日报里的分节标题（几个类别可以共用一节，按这里的顺序排）；guide 告诉模型怎么归类。
 * 没归上类的资料在日报里放进第一个 key 为 industry 的类别所在的节（没有就放最后一节）。
 */
export const CATEGORIES = [
  { key: "capacity", label: "产能产线", section: "产能与产线", guide: "窑炉点火、冷修、投产、关停，扩产与技改项目，产能利用率与供给变化" },
  { key: "market", label: "行情成本", section: "行情与成本", guide: "纯碱、石英砂、燃料等原料价格，瓶罐与药用玻璃出厂价，成本与利润变化" },
  { key: "industry", label: "公司动态", section: "公司经营", guide: "公司财报、公告、融资并购、IPO、人事变动、停产事故、问询函与监管函" },
  { key: "policy", label: "政策监管", section: "政策与监管", guide: "行业规范条件、环保能耗与碳排放政策、药典与一致性评价、集采、标准发布" },
  { key: "tech", label: "技术工艺", section: "技术与工艺", guide: "轻量化、中硼硅玻璃、节能窑炉、智能制造、模具与装备的技术进展" },
  { key: "downstream", label: "下游需求", section: "下游景气", guide: "白酒、啤酒、饮料、医药、化妆品等下游行业景气与玻璃包装需求变化" },
  { key: "opinion", label: "观点分析", section: "观点与趋势", guide: "行业判断、深度分析、访谈、现象与趋势讨论" },
] as const;

/**
 * 内容理解一步给每篇资料判的“内容类型”（写在 prompts/content-understanding.md 里，改了类型要同步改那份提示词）。
 * 评分提示词（prompts/selection-score.md）按类型给五个维度不同的权重。
 */
export const ITEM_TYPES = ["capacity_change", "price_market", "corp_action", "policy_regulation", "tech_process", "downstream_demand", "opinion_analysis"] as const;

// ── 标签词表 ────────────────────────────────────────────────────────────────────────────

/** 每篇资料的第一个标签必须是这些“分类标签”之一。 */
export const CATEGORY_TAGS = [
  "产能/产线", "行情/价格", "公司动态", "政策/监管", "技术/工艺", "下游/需求", "海外/国际", "观点/分析", "行业外/其他",
] as const;

/** 可选的主题标签。 */
export const TOPIC_TAGS = [
  "药用玻璃", "中硼硅", "轻量化", "瓶罐", "器皿", "化妆品包装", "窑炉/装备", "模具", "纯碱", "石英砂", "燃料/能源", "环保/碳排",
  "白酒", "啤酒", "饮料", "医药", "集采/医保", "智能工厂", "回收利用",
] as const;

/** 可选的实体标签（公司、机构）。 */
export const ENTITY_TAGS = [
  "山东药玻", "力诺药包", "正川股份", "山东华鹏", "凯盛科技", "德力股份", "四星玻璃", "华兴玻璃",
  "O-I", "Verallia", "Ardagh", "Vidrala", "Gerresheimer", "Stoelzle", "山村硝子",
  "远兴能源", "山东海化", "中盐化工",
] as const;

/** 模型常写的近义词，统一成词表里的写法。 */
export const TAG_SYNONYMS: Readonly<Record<string, string>> = {
  产能: "产能/产线", 产线: "产能/产线", 点火: "产能/产线", 冷修: "产能/产线", 扩产: "产能/产线", 技改: "产能/产线", 停产: "产能/产线", 关停: "产能/产线",
  行情: "行情/价格", 价格: "行情/价格", 涨价: "行情/价格", 降价: "行情/价格", 成本: "行情/价格", 原料: "行情/价格",
  公司: "公司动态", 财报: "公司动态", 融资: "公司动态", 并购: "公司动态", 收购: "公司动态", 人事: "公司动态", 公告: "公司动态",
  政策: "政策/监管", 监管: "政策/监管", 法规: "政策/监管", 标准: "政策/监管",
  技术: "技术/工艺", 工艺: "技术/工艺", "技术/装备": "窑炉/装备", 装备: "窑炉/装备",
  下游: "下游/需求", 需求: "下游/需求", 景气: "下游/需求",
  观点: "观点/分析", 分析: "观点/分析", 趋势: "观点/分析", 判断: "观点/分析",
  海外: "海外/国际", 国际: "海外/国际",
  药玻: "药用玻璃", 药用玻瓶: "药用玻璃", 中性硼硅: "中硼硅",
  白酒包装: "白酒", 玻璃瓶: "瓶罐", 瓶罐玻璃: "瓶罐", 化妆品瓶: "化妆品包装",
  环保: "环保/碳排", 碳排放: "环保/碳排", 双碳: "环保/碳排", 节能: "燃料/能源", 能源: "燃料/能源",
  带量采购: "集采/医保", 回收: "回收利用",
  非行业: "行业外/其他", 无关: "行业外/其他",
};

/** 模型漏了分类标签时，按内容类型补一个。 */
export const CATEGORY_BY_ITEM_TYPE: Readonly<Record<string, string>> = {
  capacity_change: "产能/产线", price_market: "行情/价格", corp_action: "公司动态", policy_regulation: "政策/监管",
  tech_process: "技术/工艺", downstream_demand: "下游/需求", opinion_analysis: "观点/分析",
};

// ── 公司与主体 ──────────────────────────────────────────────────────────────────────────

/** 公司主题：id → 显示名、卡片上显示的标签（null 表示只用 entity:<id> 归类）、别名。 */
export const ENTITIES: Record<string, { name: string; displayTag: string | null; aliases: string[] }> = {
  "shandong-yaobo": { name: "山东药玻", displayTag: "山东药玻", aliases: ["山东药玻", "山东省药用玻璃", "600529"] },
  "linuo-yaobao": { name: "力诺药包", displayTag: "力诺药包", aliases: ["力诺药包", "力诺特玻", "力诺", "301188"] },
  zhengchuan: { name: "正川股份", displayTag: "正川股份", aliases: ["正川股份", "重庆正川", "603976"] },
  "shandong-huapeng": { name: "山东华鹏", displayTag: "山东华鹏", aliases: ["山东华鹏", "华鹏玻璃", "603021"] },
  "kaisheng-tech": { name: "凯盛科技", displayTag: "凯盛科技", aliases: ["凯盛科技", "凯盛君恒", "600552"] },
  deli: { name: "德力股份", displayTag: "德力股份", aliases: ["德力股份", "安徽德力", "002571"] },
  "sixing-glass": { name: "四星玻璃", displayTag: "四星玻璃", aliases: ["四星玻璃", "沧州四星"] },
  "huaxing-glass": { name: "华兴玻璃", displayTag: "华兴玻璃", aliases: ["华兴玻璃", "广东华兴"] },
  "oi-glass": { name: "O-I", displayTag: "O-I", aliases: ["O-I", "O-I Glass", "Owens-Illinois", "欧文斯伊利诺伊"] },
  verallia: { name: "Verallia", displayTag: "Verallia", aliases: ["Verallia"] },
  ardagh: { name: "Ardagh", displayTag: "Ardagh", aliases: ["Ardagh", "Ardagh Group"] },
  vidrala: { name: "Vidrala", displayTag: "Vidrala", aliases: ["Vidrala"] },
  gerresheimer: { name: "Gerresheimer", displayTag: "Gerresheimer", aliases: ["Gerresheimer", "格雷斯海默"] },
  stoelzle: { name: "Stoelzle", displayTag: "Stoelzle", aliases: ["Stoelzle", "Stoelzle Glass"] },
  yamamura: { name: "山村硝子", displayTag: "山村硝子", aliases: ["山村硝子", "Nihon Yamamura"] },
  "yuanxing-energy": { name: "远兴能源", displayTag: "远兴能源", aliases: ["远兴能源", "远兴"] },
  "shandong-haihua": { name: "山东海化", displayTag: "山东海化", aliases: ["山东海化", "海化集团"] },
  "zhongyan-chem": { name: "中盐化工", displayTag: "中盐化工", aliases: ["中盐化工"] },
};

/**
 * 身份词典：摘要和标题里出现的公司，必须在原文里也出现过，否则退回原标题、丢掉摘要（防止模型张冠李戴）。
 * 行业没有这个问题时可以留空数组。
 */
export const IDENTITY_LEXICON: ReadonlyArray<{ id: string; name: string; patterns: RegExp[] }> = [
  { id: "shandong-yaobo", name: "山东药玻", patterns: [/山东(?:省)?药用玻璃|山东药玻|\b600529\b/i] },
  { id: "linuo-yaobao", name: "力诺药包", patterns: [/力诺(?:药包|特玻)|\b301188\b/] },
  { id: "zhengchuan", name: "正川股份", patterns: [/正川|\b603976\b/] },
  { id: "shandong-huapeng", name: "山东华鹏", patterns: [/山东华鹏|华鹏玻璃|\b603021\b/] },
  { id: "kaisheng-tech", name: "凯盛科技", patterns: [/凯盛(?:科技|君恒)|\b600552\b/] },
  { id: "deli", name: "德力股份", patterns: [/德力股份|安徽德力|\b002571\b/] },
  { id: "sixing-glass", name: "四星玻璃", patterns: [/四星玻璃|沧州四星/] },
  { id: "huaxing-glass", name: "华兴玻璃", patterns: [/华兴玻璃|广东华兴/] },
  { id: "oi-glass", name: "O-I", patterns: [/\bo-?i(\s?glass)?\b|owens[-\s]illinois|欧文斯伊利诺伊/i] },
  { id: "verallia", name: "Verallia", patterns: [/verallia/i] },
  { id: "ardagh", name: "Ardagh", patterns: [/ardagh/i] },
  { id: "vidrala", name: "Vidrala", patterns: [/vidrala/i] },
  { id: "gerresheimer", name: "Gerresheimer", patterns: [/gerresheimer|格雷斯海默/i] },
  { id: "stoelzle", name: "Stoelzle", patterns: [/stoelzle/i] },
  { id: "yamamura", name: "山村硝子", patterns: [/山村硝子|yamamura/i] },
  { id: "yuanxing-energy", name: "远兴能源", patterns: [/远兴能源|远兴/] },
  { id: "shandong-haihua", name: "山东海化", patterns: [/山东海化|海化集团/] },
  { id: "zhongyan-chem", name: "中盐化工", patterns: [/中盐化工/] },
];

/** 这些域名上的文章，发布方就是对应的公司（托管平台不算）。 */
export const PUBLISHER_DOMAINS: ReadonlyArray<{ entityId: string; domains: readonly string[] }> = [
  { entityId: "oi-glass", domains: ["o-i.com"] },
  { entityId: "verallia", domains: ["verallia.com"] },
  { entityId: "gerresheimer", domains: ["gerresheimer.com"] },
  { entityId: "stoelzle", domains: ["stoelzle.com"] },
];

/** 原文里的这些写法也算提到了对应公司。 */
export const IDENTITY_CONTEXT_ALIASES: ReadonlyArray<{ entityId: string; pattern: RegExp }> = [];
