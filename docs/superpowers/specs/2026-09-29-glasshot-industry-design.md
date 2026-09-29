# GlassHot：AIHOT 框架改造为玻璃包装行业热点站 · 设计文档

- 日期：2026-09-29
- 状态：设计已获用户批准（方案 A：标准行业替换）
- 仓库：`C:\Users\erp17\XM\hot\AIHOT`（AIHOT 开源框架的浅克隆）

## 1. 背景与目标

AIHOT 是一个"自动找热点、自动写日报"的网站框架，默认配置为 AI 行业示例站。目标是把它改造成**玻璃包装行业**的热点站 GlassHot：不改 `apps/`、`packages/`、`database/` 任何代码，只按 `docs/customize.md` 的流程替换 `industry/` 里的行业配置与提示词，并适配 `tests/` 中引用示例行业的测试例子。

**已确认的需求决策**（用户逐项选定）：

| 决策点 | 结论 |
|---|---|
| 行业边界 | 玻璃包装全行业：瓶罐玻璃 + 药用玻璃 + 器皿化妆品瓶 + 上游成本信号（纯碱/石英砂/燃料）。建筑玻璃、光伏玻璃、玻纤不属于本站范围 |
| 精选口味 | 四类价值全部正常评价：①产能与产线动态 ②成本与价格行情 ③公司经营与公告 ④政策/技术/下游 |
| 站名 | GlassHot（subject：玻璃包装；mcpPrefix：glasshot） |
| 公众号信源 | 第一期不配（需极致了付费 key），在 sources.json 预留注释配置，二期解开 |

## 2. 站点身份 `industry/site.ts`

| 项 | 值 |
|---|---|
| `name` | GlassHot |
| `subject` | 玻璃包装 |
| `homeTitle` | GlassHot — 玻璃包装行业动态 · 每日精选与日报 |
| `description` | 自动盯住玻璃包装行业的信源，用模型摘要、打分、精选，把同一件事的多篇报道归到一起，每天早上出一份日报。 |
| `tagline` | 值得关注的玻璃包装动态 |
| `mcpPrefix` | `glasshot` |
| `crawlerName` | GlassHotBot |
| `locale` / `defaultUrl` | `zh-CN` / `http://localhost:3000`（不变） |
| `footerNote` | 由 AIHOT 开源框架驱动（不变） |

`ABOUT` 四环节文案（collect/store/select/publish）与 headline 重写为玻璃包装行业经营管理者视角；`copyright` 结构保留。

## 3. 分类体系 `industry/taxonomy.ts`

### 3.1 CATEGORIES（key 上线后不可改）

| key | label | section（日报分节） | guide（模型归类指引） |
|---|---|---|---|
| `capacity` | 产能产线 | 产能与产线 | 窑炉点火/冷修/投产/关停、扩产技改项目、产能变化 |
| `market` | 行情成本 | 行情与成本 | 纯碱/石英砂/燃料等原料价格、瓶罐出厂价、成本与利润 |
| `industry` | 公司动态 | 公司经营 | 财报公告、融资并购、IPO、人事、停产事故、问询函监管函 |
| `policy` | 政策监管 | 政策与监管 | 行业规范条件、环保能耗政策、药典/一致性评价/集采 |
| `tech` | 技术工艺 | 技术与工艺 | 轻量化、中硼硅、节能窑炉、智能制造、模具与装备 |
| `downstream` | 下游需求 | 下游景气 | 白酒/啤酒/饮料/医药/化妆品景气与包装需求变化 |
| `opinion` | 观点分析 | 观点与趋势 | 行业判断、深度分析、访谈、现象与趋势讨论 |

未归类的资料进 `industry` 所在节（框架规则：第一个 key 为 `industry` 的类别所在节；本表 `industry` 在第三位，符合）。

### 3.2 ITEM_TYPES（与评分权重表一一对应）

```
capacity_change（产能变化）、price_market（行情价格）、corp_action（公司经营）、
policy_regulation（政策监管）、tech_process（技术工艺）、downstream_demand（下游景气）、
opinion_analysis（观点分析）
```

### 3.3 标签词表

- `CATEGORY_TAGS`：产能/产线、行情/价格、公司动态、政策/监管、技术/工艺、下游/需求、海外/国际、观点/分析、行业外/其他（第一个标签必须是分类标签）
- `TOPIC_TAGS`：药用玻璃、中硼硅、轻量化、瓶罐、器皿、化妆品包装、窑炉与装备、纯碱、石英砂、燃料/能源、环保与碳排放、白酒、啤酒、饮料、医药、集采与医保、智能工厂
- `TAG_SYNONYMS`：常见近义写法映射（如 药玻→药用玻璃、硼硅→中硼硅（谨慎，中性硼硅/高硼硅按原文）、点火/冷修→产能/产线、纯碱→纯碱 等），实现时按实际信源用语补
- `CATEGORY_BY_ITEM_TYPE`：7 类到分类标签的缺省映射

### 3.4 ENTITIES（公司名录，company 主题页 + 归组用）

- 国内（瓶罐/药玻/器皿）：山东药玻（600529）、力诺药包（301188，原力诺特玻）、正川股份（603976）、山东华鹏（603021）、凯盛科技（600552，凯盛君恒药玻）、德力股份（002571）、沧州四星玻璃、广东华兴玻璃
- 海外：O-I Glass、Verallia、Ardagh、Vidrala、Gerresheimer、Stoelzle、日本山村硝子（Nihon Yamamura）
- 上游（成本关联）：远兴能源、山东海化、中盐化工（纯碱）
- 下游（需求关联，仅 aliases 不建主题页）：贵州茅台、五粮液、青岛啤酒、华润啤酒

每个实体配 aliases（含曾用名：力诺特玻→力诺药包）。

### 3.5 IDENTITY_LEXICON 与 PUBLISHER_DOMAINS

- 只配核心公司（防标题摘要张冠李戴）：山东药玻、力诺药包、正川股份、山东华鹏、凯盛科技、德力股份、O-I、Verallia、Ardagh、Gerresheimer、Vidrala、远兴能源、山东海化等，patterns 用公司名与股票简称的正则
- `PUBLISHER_DOMAINS`：公告类信源域名归到对应公司（如 eastmoney 公告页按 short_name 判断，域名映射只配公司官网类：o-i.com、verallia.com、gerresheimer.com 等）
- 玻璃行业公司简称重复度低于 AI 大厂产品名，词典规模适度即可

## 4. 信源 `industry/sources.json`（第一期免费）

已实测可达性（2026-09-29，本机网络）：

| # | id | 信源 | kind | tier | first_party | 实测 |
|---|---|---|---|---|---|---|
| 1 | `json-em-announcements` | 上市公司公告（东方财富公告 API，600529,301188,603976,603021,600552,002571 一次拉取，含深交所德力股份） | json_list | T1 | true | ✅ 多公司合并返回正常 |
| 2 | `web-oi-news` | O-I Glass Newsroom（o-i.com/news/） | web_list | T1 | true | ✅ 200 |
| 3 | `web-verallia-news` | Verallia Newsroom（uk.verallia.com/newsroom） | web_list | T1 | true | ✅ 200 |
| 4 | `web-gerresheimer-news` | Gerresheimer Newsroom | web_list | T1 | true | 实现时验证 |
| 5 | `web-glass-intl` | Glass International 新闻页（glass-international.com/news/） | web_list | T2 | false | ✅ 200 |
| 6 | `web-glass-com-cn` | 中玻网日用玻璃频道 | web_list | T2 | false | 首页 200；频道 URL 实现时定 |
| 7 | `web-sci99-glass` | 卓创资讯玻璃频道 | web_list | T2 | false | 首页 200；频道 URL 实现时定 |

- 全部 `site_fulltext: false`、`syndicate_fulltext: false`（只展摘要+原文链接）
- 全部 `participation_mode: "editorial"`
- 公告 API 的 url 拼接：`https://data.eastmoney.com/notices/detail/<code>/<art_code>.html`
- 预留（注释块）：协会官网 cnagi.org.cn（阿里云建站 JS 渲染，需 Jina 渲染的 parseMode: markdown，按次计费）、协会/中玻网/企业公众号（mp_account，需极致了 key）、glassglobal（Akamai 拦截，可试 Jina）
- `interval_minutes`：公告 30、海外官网 120、媒体 60–120

**验证过不可用的通道**（不配）：Google News RSS、Bing News RSS（国内网络 302/空）、生意社纯碱频道（JS 反爬挑战）、feve.org（503）、packaging-europe（网络不通）。

## 5. 提示词 `industry/prompts/`（行业 KnowHow 核心）

替换行业内容、保留原有结构（五维度加权、噪声压制、安全边界、输出契约）：

| 文件 | 改法 |
|---|---|
| `prefilter.md` | AI 相关性 → 玻璃包装相关性（瓶罐/药玻/器皿/窑炉/纯碱石英砂燃料/下游白酒啤酒医药化妆品/协会政策标准）。**建筑玻璃、光伏玻璃、玻纤为 BLOCK**（行业边界）。宽召回原则、PASS/BLOCK/UNKNOWN 契约不变 |
| `selection-score.md` | 读者画像改为"玻璃包装行业经营管理者、财务与投资视角从业者"。7 类 ITEM_TYPES 新权重表（要点：capacity_change 与 corp_action 高 sig 权重，price_market 高 nov，opinion_analysis 高 reson）。**必须正常评价的价值**＝四类（产能产线/成本行情/公司公告/政策技术下游）。**必须压制的噪声**＝展会营销软文、招聘招标流水、广告、无实质参数的预告、多事件打包早报、"仅用了新材料"式趣闻 |
| `content-understanding.md`、`structure.md` | 内容类型、标签词表、公司抽取对齐新 taxonomy |
| `rules-domain.md` | AI 术语规则 → 玻璃术语规则：模制瓶/管制瓶、中性硼硅（5.0/7.0）、轻量化（lightweighting）、料方、冷端/热端喷涂、退火、芒硝、纯碱（soda ash）等中英互译与保留规则 |
| `group-*.md`、`story-digest.md`、`report-*.md` | 检查并替换其中的 AI 行业例子，结构不动 |
| `summarize-*.md`、`translate-*.md` | 检查并替换 AI 例子 |
| `understand.md`、`identity-context.md`、`safety.md`、`rules-*.md`（通用规则类） | 检查是否有 AI 专属表述，按需微调 |

## 6. 门槛与模块开关

- `industry/selection.ts`：门槛沿用默认 `T1 60 / T1_5 65 / T2 76`，`understandFloor 50` 不变。**待用户标注 100–200 条样本后用 `scripts/eval-selection.ts` 校准**（设计不凭感觉改数字）
- `industry/features.ts`：`leaderboard: false`、`codexResetMonitor: false`（不删代码，导航/定时任务/接口自动关闭）

## 7. 其他文件

- `industry/topics.json`：三组主题重做——company（ENTITIES 对应）、field（药用玻璃/中硼硅替代、轻量化、窑炉节能、智能制造、上游成本、海外市场）、genre（财报公告、行情价格、政策标准、深度分析）
- `industry/changelog.json`：加一条 GlassHot 改造记录
- `industry/brand/`：第一期沿用框架默认样式与文字 Logo（站点名会自动变 GlassHot）；报头字 nameplates 用框架脚本重新生成（`node scripts/nameplates.ts package`，需先 npm pack @fontsource/noto-sans-sc）
- `industry/pages/terms.md`、`privacy.md`：保留模板，**上线前需用户本人确认**（AGENTS.md 要求）
- `tests/`：把引用示例行业分类/标签/公司（`ai-models`、"模型发布"、Anthropic 等）的测试例子换成玻璃包装对应项；测规则逻辑，不硬编码行业数据
- `apps/`、`packages/`、`database/`：**零改动**

## 8. 验证口径（交付标准）

1. `npm run typecheck` 通过
2. `npm test` 通过（`DATABASE_URL` 指向 `_test` 结尾空库，先 `node scripts/migrate.ts`）
3. `npm run build -w @aihot/web && node --test apps/web/tests/*.test.ts` 通过
4. 站点跑起来后 `node scripts/smoke.ts --base http://localhost:3000` 通过
5. 信源逐个在后台"试抓"成功（公告 API、三个 newsroom、Glass International、中玻网/卓创频道）
6. 抽查预筛与评分：给几条玻璃新闻（如"某厂窑炉点火""纯碱涨价"）确认 PASS 与正常分数；给建筑玻璃新闻确认 BLOCK

## 9. 不做的事（Out of Scope）

- 不写自研抓取脚本（协会官网/生意社走框架 Jina 渲染或二期公众号付费通道）
- 不配 X（SocialData）与公众号（极致了）付费信源
- 不动 `apps/`、`packages/`、`database/`
- 不用 AIHOT 的名字和 Logo（框架许可要求）
- 门槛校准（需用户标注样本）不在本次实施内，作为后续运营动作
