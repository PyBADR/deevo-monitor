/**
 * DEEVO Monitor — Complete RSS Feed Configuration
 * 435+ feeds across 15 categories covering GCC insurance intelligence
 * v5.0.0 — Full worldmonitor parity
 */

export type FeedCategory =
  | 'insurance_global'
  | 'gcc_regional'
  | 'regulatory'
  | 'insurtech'
  | 'financial_markets'
  | 'fraud_intelligence'
  | 'energy_commodity'
  | 'geopolitical'
  | 'weather_cat'
  | 'cryptocurrency'
  | 'stock_market'
  | 'central_bank'
  | 'development'
  | 'healthcare'
  | 'maritime_trade';

export interface FeedDef {
  id: string;
  name: string;
  url: string;
  category: FeedCategory;
  language: 'en' | 'ar' | 'fr';
  region: string;
  priority: 1 | 2 | 3;
  tags: string[];
}

const INSURANCE_GLOBAL: FeedDef[] = [
  { id: 'insurance-journal', name: 'Insurance Journal', url: 'https://www.insurancejournal.com/feed/', category: 'insurance_global', language: 'en', region: 'global', priority: 1, tags: ['claims', 'underwriting'] },
  { id: 'reinsurance-news', name: 'Reinsurance News', url: 'https://www.reinsurancene.ws/feed/', category: 'insurance_global', language: 'en', region: 'global', priority: 1, tags: ['reinsurance', 'ILS'] },
  { id: 'artemis-ils', name: 'Artemis ILS', url: 'https://www.artemis.bm/feed/', category: 'insurance_global', language: 'en', region: 'global', priority: 1, tags: ['ILS', 'cat-bonds'] },
  { id: 'the-insurer', name: 'The Insurer', url: 'https://www.theinsurer.com/feed/', category: 'insurance_global', language: 'en', region: 'global', priority: 1, tags: ['reinsurance', 'specialty'] },
  { id: 'carrier-management', name: 'Carrier Management', url: 'https://www.carriermanagement.com/feed/', category: 'insurance_global', language: 'en', region: 'global', priority: 1, tags: ['carriers', 'strategy'] },
  { id: 'business-insurance', name: 'Business Insurance', url: 'https://www.businessinsurance.com/rss/', category: 'insurance_global', language: 'en', region: 'global', priority: 1, tags: ['commercial', 'risk'] },
  { id: 'claims-journal', name: 'Claims Journal', url: 'https://www.claimsjournal.com/feed/', category: 'insurance_global', language: 'en', region: 'global', priority: 1, tags: ['claims', 'litigation'] },
  { id: 'risk-management-mag', name: 'Risk Management Magazine', url: 'https://www.rmmagazine.com/feed/', category: 'insurance_global', language: 'en', region: 'global', priority: 1, tags: ['risk', 'ERM'] },
  { id: 'insurance-business-mag', name: 'Insurance Business', url: 'https://www.insurancebusinessmag.com/rss/news/', category: 'insurance_global', language: 'en', region: 'global', priority: 1, tags: ['brokers', 'distribution'] },
  { id: 'pc360', name: 'PropertyCasualty360', url: 'https://www.propertycasualty360.com/rss/', category: 'insurance_global', language: 'en', region: 'global', priority: 1, tags: ['property', 'casualty'] },
  { id: 'post-magazine', name: 'Post Magazine', url: 'https://www.postonline.co.uk/rss', category: 'insurance_global', language: 'en', region: 'europe', priority: 2, tags: ['UK', 'market'] },
  { id: 'global-reinsurance', name: 'Global Reinsurance', url: 'https://www.globalreinsurance.com/rss/', category: 'insurance_global', language: 'en', region: 'global', priority: 2, tags: ['reinsurance', 'renewals'] },
  { id: 'insurance-age', name: 'Insurance Age', url: 'https://www.insuranceage.co.uk/rss/', category: 'insurance_global', language: 'en', region: 'europe', priority: 2, tags: ['brokers', 'UK'] },
  { id: 'actuarial-post', name: 'Actuarial Post', url: 'https://www.actuarialpost.co.uk/feed/', category: 'insurance_global', language: 'en', region: 'global', priority: 2, tags: ['actuarial', 'pricing'] },
  { id: 'sp-insurance', name: 'S&P Insurance', url: 'https://www.spglobal.com/ratings/en/rss/topic/insurance.xml', category: 'insurance_global', language: 'en', region: 'global', priority: 1, tags: ['ratings', 'solvency'] },
  { id: 'am-best-news', name: 'AM Best', url: 'https://news.ambest.com/newscontent.aspx?altSrc=108&refnum=rss', category: 'insurance_global', language: 'en', region: 'global', priority: 1, tags: ['ratings', 'financials'] },
  { id: 'lloyds-news', name: "Lloyd's News", url: 'https://www.lloyds.com/news-and-insights/rss', category: 'insurance_global', language: 'en', region: 'europe', priority: 1, tags: ['specialty', 'London'] },
  { id: 'swiss-re', name: 'Swiss Re', url: 'https://www.swissre.com/risk-knowledge/rss.xml', category: 'insurance_global', language: 'en', region: 'global', priority: 1, tags: ['research', 'sigma'] },
  { id: 'munich-re', name: 'Munich Re', url: 'https://www.munichre.com/topics-online/en/rss.xml', category: 'insurance_global', language: 'en', region: 'global', priority: 1, tags: ['natcat', 'research'] },
  { id: 'me-insurance-review', name: 'ME Insurance Review', url: 'https://www.meinsurancereview.com/rss/news', category: 'insurance_global', language: 'en', region: 'gcc', priority: 1, tags: ['gcc', 'takaful'] },
  { id: 'asia-insurance-review', name: 'Asia Insurance Review', url: 'https://www.asiainsurancereview.com/rss/news', category: 'insurance_global', language: 'en', region: 'asia', priority: 2, tags: ['asia', 'market'] },
  { id: 'insurance-insider', name: 'Insurance Insider', url: 'https://www.insuranceinsider.com/rss', category: 'insurance_global', language: 'en', region: 'global', priority: 2, tags: ['specialty', 'London'] },
  { id: 'insurance-day', name: 'Insurance Day', url: 'https://insuranceday.maritimeintelligence.informa.com/rss', category: 'insurance_global', language: 'en', region: 'global', priority: 2, tags: ['marine', 'specialty'] },
  { id: 'coverager-ins', name: 'Coverager', url: 'https://coverager.com/feed/', category: 'insurance_global', language: 'en', region: 'global', priority: 2, tags: ['insurtech', 'digital'] },
  { id: 'dig-in-ins', name: 'Digital Insurance', url: 'https://www.dig-in.com/rss/', category: 'insurance_global', language: 'en', region: 'global', priority: 2, tags: ['digital', 'technology'] },
  { id: 'canadian-underwriter', name: 'Canadian Underwriter', url: 'https://www.canadianunderwriter.ca/feed/', category: 'insurance_global', language: 'en', region: 'global', priority: 3, tags: ['canada', 'P&C'] },
  { id: 'insurance-times-uk', name: 'Insurance Times UK', url: 'https://www.insurancetimes.co.uk/rss', category: 'insurance_global', language: 'en', region: 'europe', priority: 2, tags: ['UK', 'brokers'] },
  { id: 'national-underwriter', name: 'National Underwriter', url: 'https://www.nationalunderwriter.com/rss/', category: 'insurance_global', language: 'en', region: 'global', priority: 3, tags: ['life', 'health'] },
  { id: 'insurance-news-net', name: 'Insurance News Net', url: 'https://insurancenewsnet.com/feed/', category: 'insurance_global', language: 'en', region: 'global', priority: 3, tags: ['life', 'annuities'] },
  { id: 'captive-intl', name: 'Captive International', url: 'https://www.captiveinternational.com/rss', category: 'insurance_global', language: 'en', region: 'global', priority: 3, tags: ['captives', 'ART'] },
  { id: 'reactions-mag', name: 'Reactions', url: 'https://www.reactionsnet.com/rss', category: 'insurance_global', language: 'en', region: 'global', priority: 2, tags: ['reinsurance', 'analysis'] },
  { id: 'risk-global', name: 'Risk.net Insurance', url: 'https://www.risk.net/rss/insurance', category: 'insurance_global', language: 'en', region: 'global', priority: 2, tags: ['risk', 'capital'] },
  { id: 'insurance-thought', name: 'Insurance Thought Leadership', url: 'https://www.insurancethoughtleadership.com/feed/', category: 'insurance_global', language: 'en', region: 'global', priority: 3, tags: ['thought-leadership'] },
  { id: 'ins-regulation', name: 'Insurance Regulation', url: 'https://www.insuranceregulation.com/feed/', category: 'insurance_global', language: 'en', region: 'global', priority: 3, tags: ['regulation', 'compliance'] },
  { id: 'insurance-networking', name: 'Insurance Networking', url: 'https://www.insurancenetworking.com/feed/', category: 'insurance_global', language: 'en', region: 'global', priority: 3, tags: ['technology', 'IT'] },
];

const GCC_REGIONAL: FeedDef[] = [
  { id: 'arab-news-biz', name: 'Arab News Business', url: 'https://www.arabnews.com/cat/business/economy/feed', category: 'gcc_regional', language: 'en', region: 'SA', priority: 1, tags: ['saudi', 'economy'] },
  { id: 'gulf-news-biz', name: 'Gulf News Business', url: 'https://gulfnews.com/rss/business', category: 'gcc_regional', language: 'en', region: 'AE', priority: 1, tags: ['uae', 'business'] },
  { id: 'khaleej-times-biz', name: 'Khaleej Times', url: 'https://www.khaleejtimes.com/rss/business', category: 'gcc_regional', language: 'en', region: 'AE', priority: 1, tags: ['uae', 'business'] },
  { id: 'kuwait-times', name: 'Kuwait Times', url: 'https://www.kuwaittimes.com/feed/', category: 'gcc_regional', language: 'en', region: 'KW', priority: 1, tags: ['kuwait', 'news'] },
  { id: 'alarabiya-en', name: 'Al Arabiya English', url: 'https://english.alarabiya.net/rss.xml', category: 'gcc_regional', language: 'en', region: 'gcc', priority: 1, tags: ['gcc', 'politics'] },
  { id: 'trade-arabia', name: 'Trade Arabia', url: 'https://www.tradearabia.com/news/feed.xml', category: 'gcc_regional', language: 'en', region: 'gcc', priority: 1, tags: ['trade', 'business'] },
  { id: 'zawya-insurance', name: 'Zawya Insurance', url: 'https://www.zawya.com/en/insurance/rss.xml', category: 'gcc_regional', language: 'en', region: 'gcc', priority: 1, tags: ['insurance', 'gcc'] },
  { id: 'zawya-markets', name: 'Zawya Markets', url: 'https://www.zawya.com/en/markets/rss.xml', category: 'gcc_regional', language: 'en', region: 'gcc', priority: 1, tags: ['markets', 'stocks'] },
  { id: 'reuters-me', name: 'Reuters ME', url: 'https://feeds.reuters.com/reuters/businessNews', category: 'gcc_regional', language: 'en', region: 'gcc', priority: 1, tags: ['reuters', 'global'] },
  { id: 'saudi-gazette', name: 'Saudi Gazette', url: 'https://saudigazette.com.sa/rss', category: 'gcc_regional', language: 'en', region: 'SA', priority: 1, tags: ['saudi', 'news'] },
  { id: 'the-national-ae', name: 'The National UAE', url: 'https://www.thenationalnews.com/rss', category: 'gcc_regional', language: 'en', region: 'AE', priority: 1, tags: ['uae', 'business'] },
  { id: 'arabian-business', name: 'Arabian Business', url: 'https://www.arabianbusiness.com/rss', category: 'gcc_regional', language: 'en', region: 'gcc', priority: 1, tags: ['business', 'gcc'] },
  { id: 'qatar-tribune', name: 'Qatar Tribune', url: 'https://www.qatar-tribune.com/rss', category: 'gcc_regional', language: 'en', region: 'QA', priority: 2, tags: ['qatar', 'news'] },
  { id: 'times-of-oman', name: 'Times of Oman', url: 'https://timesofoman.com/rss', category: 'gcc_regional', language: 'en', region: 'OM', priority: 2, tags: ['oman', 'news'] },
  { id: 'bahrain-news', name: 'Bahrain News Agency', url: 'https://www.bna.bh/en/rss', category: 'gcc_regional', language: 'en', region: 'BH', priority: 2, tags: ['bahrain', 'news'] },
  { id: 'difc-news', name: 'DIFC News', url: 'https://www.difc.ae/newsroom/rss', category: 'gcc_regional', language: 'en', region: 'AE', priority: 2, tags: ['difc', 'finance'] },
  { id: 'argaam-ar', name: 'أرقام', url: 'https://www.argaam.com/ar/rss', category: 'gcc_regional', language: 'ar', region: 'SA', priority: 1, tags: ['أسواق', 'سعودية'] },
  { id: 'mubasher-ar', name: 'مباشر', url: 'https://www.mubasher.info/rss', category: 'gcc_regional', language: 'ar', region: 'gcc', priority: 1, tags: ['أسواق', 'خليج'] },
  { id: 'aleqtisadiah-ar', name: 'الاقتصادية', url: 'https://www.aleqt.com/rss', category: 'gcc_regional', language: 'ar', region: 'SA', priority: 1, tags: ['اقتصاد', 'سعودية'] },
  { id: 'alqabas-ar', name: 'القبس', url: 'https://alqabas.com/rss', category: 'gcc_regional', language: 'ar', region: 'KW', priority: 1, tags: ['كويت', 'اقتصاد'] },
  { id: 'alrai-ar', name: 'الراي', url: 'https://www.alraimedia.com/rss', category: 'gcc_regional', language: 'ar', region: 'KW', priority: 1, tags: ['كويت', 'أخبار'] },
  { id: 'alanba-ar', name: 'الأنباء', url: 'https://www.alanba.com.kw/rss', category: 'gcc_regional', language: 'ar', region: 'KW', priority: 2, tags: ['كويت', 'محلية'] },
  { id: 'sabq-ar', name: 'صحيفة سبق', url: 'https://sabq.org/rss', category: 'gcc_regional', language: 'ar', region: 'SA', priority: 2, tags: ['سعودية', 'أخبار'] },
  { id: 'okaz-ar', name: 'عكاظ', url: 'https://www.okaz.com.sa/rss', category: 'gcc_regional', language: 'ar', region: 'SA', priority: 2, tags: ['سعودية', 'اقتصاد'] },
  { id: 'alittihad-ar', name: 'الاتحاد', url: 'https://www.alittihad.ae/rss', category: 'gcc_regional', language: 'ar', region: 'AE', priority: 2, tags: ['إمارات', 'أخبار'] },
  { id: 'albayan-ar', name: 'البيان', url: 'https://www.albayan.ae/rss', category: 'gcc_regional', language: 'ar', region: 'AE', priority: 2, tags: ['إمارات', 'اقتصاد'] },
  { id: 'alwatan-qa-ar', name: 'الوطن القطرية', url: 'https://al-watan.com/rss', category: 'gcc_regional', language: 'ar', region: 'QA', priority: 2, tags: ['قطر', 'أخبار'] },
  { id: 'alayam-bh-ar', name: 'الأيام', url: 'https://www.alayam.com/rss', category: 'gcc_regional', language: 'ar', region: 'BH', priority: 2, tags: ['بحرين', 'أخبار'] },
  { id: 'oman-daily-ar', name: 'عُمان', url: 'https://www.omandaily.om/rss', category: 'gcc_regional', language: 'ar', region: 'OM', priority: 2, tags: ['عمان', 'أخبار'] },
  { id: 'gulf-business', name: 'Gulf Business', url: 'https://gulfbusiness.com/feed/', category: 'gcc_regional', language: 'en', region: 'gcc', priority: 1, tags: ['gcc', 'business'] },
];

const REGULATORY: FeedDef[] = [
  { id: 'sama-sa', name: 'SAMA', url: 'https://www.sama.gov.sa/en-US/News/Pages/rss.aspx', category: 'regulatory', language: 'en', region: 'SA', priority: 1, tags: ['SAMA', 'regulation'] },
  { id: 'cbuae', name: 'CBUAE', url: 'https://www.centralbank.ae/en/news/rss', category: 'regulatory', language: 'en', region: 'AE', priority: 1, tags: ['CBUAE', 'regulation'] },
  { id: 'cma-kuwait', name: 'CMA Kuwait', url: 'https://www.cma.gov.kw/en/rss', category: 'regulatory', language: 'en', region: 'KW', priority: 1, tags: ['CMA', 'regulation'] },
  { id: 'ia-uae', name: 'IA UAE', url: 'https://ia.gov.ae/rss', category: 'regulatory', language: 'en', region: 'AE', priority: 1, tags: ['insurance-authority'] },
  { id: 'qcb-qatar', name: 'QCB', url: 'https://www.qcb.gov.qa/en/news/rss', category: 'regulatory', language: 'en', region: 'QA', priority: 1, tags: ['QCB', 'regulation'] },
  { id: 'cbb-bahrain', name: 'CBB', url: 'https://www.cbb.gov.bh/rss', category: 'regulatory', language: 'en', region: 'BH', priority: 1, tags: ['CBB', 'regulation'] },
  { id: 'cma-oman', name: 'CMA Oman', url: 'https://cma.gov.om/rss', category: 'regulatory', language: 'en', region: 'OM', priority: 1, tags: ['CMA', 'regulation'] },
  { id: 'fatf', name: 'FATF', url: 'https://www.fatf-gafi.org/en/publications/rss.xml', category: 'regulatory', language: 'en', region: 'global', priority: 1, tags: ['AML', 'CFT'] },
  { id: 'iais', name: 'IAIS', url: 'https://www.iaisweb.org/news/feed/', category: 'regulatory', language: 'en', region: 'global', priority: 1, tags: ['IAIS', 'standards'] },
  { id: 'ifrs', name: 'IFRS Foundation', url: 'https://www.ifrs.org/news-and-events/rss/', category: 'regulatory', language: 'en', region: 'global', priority: 1, tags: ['IFRS17', 'accounting'] },
  { id: 'fca-uk', name: 'FCA UK', url: 'https://www.fca.org.uk/news/rss.xml', category: 'regulatory', language: 'en', region: 'europe', priority: 2, tags: ['FCA', 'UK'] },
  { id: 'eiopa', name: 'EIOPA', url: 'https://www.eiopa.europa.eu/rss_en', category: 'regulatory', language: 'en', region: 'europe', priority: 2, tags: ['solvencyII', 'EU'] },
  { id: 'opec', name: 'OPEC', url: 'https://www.opec.org/opec_web/en/press_room/28.htm', category: 'regulatory', language: 'en', region: 'global', priority: 1, tags: ['OPEC', 'oil'] },
  { id: 'imf-me', name: 'IMF', url: 'https://www.imf.org/en/News/rss', category: 'regulatory', language: 'en', region: 'global', priority: 1, tags: ['IMF', 'macro'] },
  { id: 'world-bank-mena', name: 'World Bank MENA', url: 'https://www.worldbank.org/en/region/mena/rss.xml', category: 'regulatory', language: 'en', region: 'gcc', priority: 2, tags: ['development', 'economic'] },
  { id: 'bis', name: 'BIS', url: 'https://www.bis.org/rss/press.xml', category: 'regulatory', language: 'en', region: 'global', priority: 2, tags: ['BIS', 'banking'] },
  { id: 'naic', name: 'NAIC', url: 'https://content.naic.org/rss.xml', category: 'regulatory', language: 'en', region: 'global', priority: 3, tags: ['NAIC', 'US'] },
  { id: 'pra-uk', name: 'PRA UK', url: 'https://www.bankofengland.co.uk/rss/publications', category: 'regulatory', language: 'en', region: 'europe', priority: 2, tags: ['PRA', 'prudential'] },
  { id: 'oecd-insurance', name: 'OECD', url: 'https://www.oecd.org/finance/insurance/rss/', category: 'regulatory', language: 'en', region: 'global', priority: 3, tags: ['OECD', 'policy'] },
  { id: 'geneva-association', name: 'Geneva Association', url: 'https://www.genevaassociation.org/feed/', category: 'regulatory', language: 'en', region: 'global', priority: 2, tags: ['research', 'policy'] },
];

const INSURTECH: FeedDef[] = [
  { id: 'coverager-tech', name: 'Coverager', url: 'https://coverager.com/feed/', category: 'insurtech', language: 'en', region: 'global', priority: 1, tags: ['insurtech', 'digital'] },
  { id: 'insurtech-insights', name: 'InsurTech Insights', url: 'https://www.insurtechinsights.com/feed/', category: 'insurtech', language: 'en', region: 'global', priority: 1, tags: ['insurtech', 'innovation'] },
  { id: 'techcrunch-fintech', name: 'TechCrunch Fintech', url: 'https://techcrunch.com/category/fintech/feed/', category: 'insurtech', language: 'en', region: 'global', priority: 1, tags: ['fintech', 'startup'] },
  { id: 'venturebeat-ai', name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', category: 'insurtech', language: 'en', region: 'global', priority: 1, tags: ['AI', 'ML'] },
  { id: 'mit-tech-review', name: 'MIT Technology Review', url: 'https://www.technologyreview.com/feed/', category: 'insurtech', language: 'en', region: 'global', priority: 1, tags: ['technology', 'research'] },
  { id: 'huggingface-blog', name: 'Hugging Face', url: 'https://huggingface.co/blog/feed.xml', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['AI', 'NLP'] },
  { id: 'wired-ai', name: 'Wired AI', url: 'https://www.wired.com/feed/tag/artificial-intelligence/rss', category: 'insurtech', language: 'en', region: 'global', priority: 1, tags: ['AI', 'technology'] },
  { id: 'pymnts-insurance', name: 'PYMNTS Insurance', url: 'https://www.pymnts.com/category/insurance/feed/', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['payments', 'insurance'] },
  { id: 'magnitt', name: 'MAGNiTT', url: 'https://magnitt.com/news/rss', category: 'insurtech', language: 'en', region: 'gcc', priority: 1, tags: ['startup', 'MENA'] },
  { id: 'ars-technica', name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['technology', 'science'] },
  { id: 'the-verge', name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['technology', 'AI'] },
  { id: 'hacker-news', name: 'Hacker News', url: 'https://hnrss.org/frontpage', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['tech', 'startup'] },
  { id: 'openai-blog', name: 'OpenAI Blog', url: 'https://openai.com/blog/rss/', category: 'insurtech', language: 'en', region: 'global', priority: 1, tags: ['AI', 'GPT'] },
  { id: 'anthropic-news', name: 'Anthropic News', url: 'https://www.anthropic.com/news/rss', category: 'insurtech', language: 'en', region: 'global', priority: 1, tags: ['AI', 'Claude'] },
  { id: 'google-ai-blog', name: 'Google AI', url: 'https://blog.google/technology/ai/rss/', category: 'insurtech', language: 'en', region: 'global', priority: 1, tags: ['AI', 'Gemini'] },
  { id: 'deepmind', name: 'DeepMind', url: 'https://deepmind.google/blog/rss.xml', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['AI', 'research'] },
  { id: 'nvidia-blog', name: 'NVIDIA', url: 'https://blogs.nvidia.com/feed/', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['GPU', 'AI'] },
  { id: 'fintech-futures', name: 'Fintech Futures', url: 'https://www.fintechfutures.com/feed/', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['fintech', 'banking'] },
  { id: 'finovate', name: 'Finovate', url: 'https://finovate.com/feed/', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['fintech', 'demo'] },
  { id: 'sifted', name: 'Sifted', url: 'https://sifted.eu/feed/', category: 'insurtech', language: 'en', region: 'europe', priority: 2, tags: ['startup', 'europe'] },
  { id: 'the-fintech-times', name: 'Fintech Times', url: 'https://thefintechtimes.com/feed/', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['fintech', 'payments'] },
  { id: 'cbinsights', name: 'CB Insights', url: 'https://www.cbinsights.com/rss/', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['research', 'fintech'] },
  { id: 'a16z', name: 'a16z', url: 'https://a16z.com/feed/', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['VC', 'fintech'] },
  { id: 'dig-in-tech', name: 'Digital Insurance', url: 'https://www.dig-in.com/rss/', category: 'insurtech', language: 'en', region: 'global', priority: 1, tags: ['digital', 'insurance'] },
  { id: 'ai-news', name: 'AI News', url: 'https://www.artificialintelligence-news.com/feed/', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['AI', 'enterprise'] },
  { id: 'zdnet', name: 'ZDNet', url: 'https://www.zdnet.com/rss.xml', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['enterprise', 'cloud'] },
  { id: 'towards-data-science', name: 'Towards Data Science', url: 'https://towardsdatascience.com/feed', category: 'insurtech', language: 'en', region: 'global', priority: 3, tags: ['data-science', 'ML'] },
  { id: 'insuretech-connect', name: 'ITC', url: 'https://www.insuretechconnect.com/feed/', category: 'insurtech', language: 'en', region: 'global', priority: 2, tags: ['conference', 'insurtech'] },
  { id: 'sequoia', name: 'Sequoia', url: 'https://www.sequoiacap.com/feed/', category: 'insurtech', language: 'en', region: 'global', priority: 3, tags: ['VC', 'startup'] },
  { id: 'techradar', name: 'TechRadar', url: 'https://www.techradar.com/rss', category: 'insurtech', language: 'en', region: 'global', priority: 3, tags: ['technology', 'AI'] },
];

const FINANCIAL_MARKETS: FeedDef[] = [
  { id: 'reuters-biz', name: 'Reuters Business', url: 'https://feeds.reuters.com/reuters/businessNews', category: 'financial_markets', language: 'en', region: 'global', priority: 1, tags: ['reuters', 'business'] },
  { id: 'bloomberg-markets', name: 'Bloomberg Markets', url: 'https://feeds.bloomberg.com/markets/news.rss', category: 'financial_markets', language: 'en', region: 'global', priority: 1, tags: ['bloomberg', 'markets'] },
  { id: 'wsj-markets', name: 'WSJ Markets', url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', category: 'financial_markets', language: 'en', region: 'global', priority: 1, tags: ['WSJ', 'markets'] },
  { id: 'ft-markets', name: 'FT Markets', url: 'https://www.ft.com/markets?format=rss', category: 'financial_markets', language: 'en', region: 'global', priority: 1, tags: ['FT', 'markets'] },
  { id: 'investing-com', name: 'Investing.com', url: 'https://www.investing.com/rss/news_25.rss', category: 'financial_markets', language: 'en', region: 'global', priority: 1, tags: ['investing', 'markets'] },
  { id: 'cnbc', name: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', category: 'financial_markets', language: 'en', region: 'global', priority: 1, tags: ['CNBC', 'markets'] },
  { id: 'marketwatch', name: 'MarketWatch', url: 'https://feeds.marketwatch.com/marketwatch/topstories/', category: 'financial_markets', language: 'en', region: 'global', priority: 1, tags: ['markets', 'stocks'] },
  { id: 'oilprice', name: 'OilPrice.com', url: 'https://oilprice.com/rss/main', category: 'financial_markets', language: 'en', region: 'global', priority: 1, tags: ['oil', 'energy'] },
  { id: 'barrons', name: "Barron's", url: 'https://www.barrons.com/feed', category: 'financial_markets', language: 'en', region: 'global', priority: 1, tags: ['investing', 'analysis'] },
  { id: 'economist-finance', name: 'Economist Finance', url: 'https://www.economist.com/finance-and-economics/rss.xml', category: 'financial_markets', language: 'en', region: 'global', priority: 1, tags: ['economist', 'macro'] },
  { id: 'yahoo-finance', name: 'Yahoo Finance', url: 'https://finance.yahoo.com/rss/', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['stocks', 'markets'] },
  { id: 'forexlive', name: 'ForexLive', url: 'https://www.forexlive.com/feed/', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['forex', 'currencies'] },
  { id: 'zerohedge', name: 'ZeroHedge', url: 'https://feeds.feedburner.com/zerohedge/feed', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['markets', 'macro'] },
  { id: 'sp-global', name: 'S&P Global', url: 'https://www.spglobal.com/rss', category: 'financial_markets', language: 'en', region: 'global', priority: 1, tags: ['ratings', 'credit'] },
  { id: 'fitch-ratings', name: 'Fitch Ratings', url: 'https://www.fitchratings.com/rss', category: 'financial_markets', language: 'en', region: 'global', priority: 1, tags: ['ratings', 'credit'] },
  { id: 'moodys', name: "Moody's", url: 'https://www.moodys.com/rss', category: 'financial_markets', language: 'en', region: 'global', priority: 1, tags: ['ratings', 'credit'] },
  { id: 'kitco', name: 'Kitco', url: 'https://www.kitco.com/rss/feed.xml', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['gold', 'silver'] },
  { id: 'nasdaq-news', name: 'Nasdaq', url: 'https://www.nasdaq.com/feed/rssoutbound', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['nasdaq', 'tech-stocks'] },
  { id: 'morningstar', name: 'Morningstar', url: 'https://www.morningstar.com/rss/all', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['funds', 'ratings'] },
  { id: 'benzinga', name: 'Benzinga', url: 'https://www.benzinga.com/feed', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['markets', 'earnings'] },
  { id: 'business-insider-mkts', name: 'Business Insider', url: 'https://www.businessinsider.com/sai/rss', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['markets', 'finance'] },
  { id: 'risk-net-fin', name: 'Risk.net', url: 'https://www.risk.net/rss', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['risk', 'derivatives'] },
  { id: 'euromoney', name: 'Euromoney', url: 'https://www.euromoney.com/rss', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['banking', 'finance'] },
  { id: 'ft-commodities', name: 'FT Commodities', url: 'https://www.ft.com/commodities?format=rss', category: 'financial_markets', language: 'en', region: 'global', priority: 1, tags: ['commodities', 'oil'] },
  { id: 'tradingview-ideas', name: 'TradingView', url: 'https://www.tradingview.com/feed/', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['charts', 'analysis'] },
  { id: 'iif', name: 'IIF', url: 'https://www.iif.com/feed/', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['IIF', 'banking'] },
  { id: 'financial-news-london', name: 'Financial News', url: 'https://www.fnlondon.com/rss', category: 'financial_markets', language: 'en', region: 'europe', priority: 2, tags: ['London', 'finance'] },
  { id: 'me-investor', name: 'ME Investor', url: 'https://www.meinvestor.com/feed/', category: 'financial_markets', language: 'en', region: 'gcc', priority: 2, tags: ['gcc', 'investing'] },
  { id: 'arabian-money', name: 'Arabian Money', url: 'https://www.arabianmoney.net/feed/', category: 'financial_markets', language: 'en', region: 'gcc', priority: 2, tags: ['gcc', 'investing'] },
  { id: 'investing-stocks', name: 'Investing.com Stocks', url: 'https://www.investing.com/rss/news_14.rss', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['stocks', 'earnings'] },
  { id: 'forex-factory', name: 'Forex Factory', url: 'https://www.forexfactory.com/feed.php', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['forex', 'calendar'] },
  { id: 'institutional-investor', name: 'Institutional Investor', url: 'https://www.institutionalinvestor.com/rss', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['institutional', 'asset-mgmt'] },
  { id: 'pe-wire', name: 'PE Wire', url: 'https://www.privatequitywire.co.uk/rss', category: 'financial_markets', language: 'en', region: 'global', priority: 3, tags: ['private-equity', 'M&A'] },
  { id: 'reuters-wealth', name: 'Reuters Wealth', url: 'https://feeds.reuters.com/news/wealth', category: 'financial_markets', language: 'en', region: 'global', priority: 2, tags: ['wealth', 'investing'] },
  { id: 'gulf-business-fin', name: 'Gulf Business Finance', url: 'https://gulfbusiness.com/category/finance/feed/', category: 'financial_markets', language: 'en', region: 'gcc', priority: 1, tags: ['gcc', 'finance'] },
];

const FRAUD_INTELLIGENCE: FeedDef[] = [
  { id: 'coalition-fraud', name: 'Coalition Against Fraud', url: 'https://insurancefraud.org/feed/', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 1, tags: ['fraud', 'SIU'] },
  { id: 'acfe', name: 'ACFE', url: 'https://www.acfe.com/rss', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 1, tags: ['fraud', 'forensics'] },
  { id: 'ifb', name: 'Insurance Fraud Bureau', url: 'https://www.insurancefraudbureau.org/rss', category: 'fraud_intelligence', language: 'en', region: 'europe', priority: 1, tags: ['fraud', 'UK'] },
  { id: 'nicb', name: 'NICB', url: 'https://www.nicb.org/rss.xml', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 1, tags: ['vehicle-fraud', 'theft'] },
  { id: 'krebs-security', name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 1, tags: ['cyber', 'fraud'] },
  { id: 'dark-reading', name: 'Dark Reading', url: 'https://www.darkreading.com/rss.xml', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 1, tags: ['cyber', 'threats'] },
  { id: 'the-hacker-news', name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 1, tags: ['cyber', 'hacking'] },
  { id: 'bleeping-computer', name: 'Bleeping Computer', url: 'https://www.bleepingcomputer.com/feed/', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 2, tags: ['cyber', 'ransomware'] },
  { id: 'cert-us', name: 'US-CERT', url: 'https://www.cisa.gov/news-events/cybersecurity-advisories/rss.xml', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 1, tags: ['CISA', 'alerts'] },
  { id: 'fraud-magazine', name: 'Fraud Magazine', url: 'https://www.fraud-magazine.com/feed/', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 1, tags: ['fraud', 'forensics'] },
  { id: 'interpol-fc', name: 'INTERPOL', url: 'https://www.interpol.int/en/Crimes/Financial-crime/rss', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 1, tags: ['interpol', 'financial-crime'] },
  { id: 'europol', name: 'Europol', url: 'https://www.europol.europa.eu/rss.xml', category: 'fraud_intelligence', language: 'en', region: 'europe', priority: 2, tags: ['organized-crime', 'cybercrime'] },
  { id: 'occrp', name: 'OCCRP', url: 'https://www.occrp.org/en/feed', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 2, tags: ['corruption', 'investigation'] },
  { id: 'compliance-week', name: 'Compliance Week', url: 'https://www.complianceweek.com/rss', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 2, tags: ['compliance', 'governance'] },
  { id: 'chainalysis', name: 'Chainalysis', url: 'https://www.chainalysis.com/blog/feed/', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 2, tags: ['crypto-fraud', 'blockchain'] },
  { id: 'security-week', name: 'Security Week', url: 'https://www.securityweek.com/feed/', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 2, tags: ['cyber', 'enterprise'] },
  { id: 'threatpost', name: 'Threatpost', url: 'https://threatpost.com/feed/', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 2, tags: ['cyber', 'vulnerabilities'] },
  { id: 'infosec-magazine', name: 'Infosecurity', url: 'https://www.infosecurity-magazine.com/rss/news/', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 2, tags: ['security', 'privacy'] },
  { id: 'fcpa-blog', name: 'FCPA Blog', url: 'https://fcpablog.com/feed/', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 2, tags: ['bribery', 'corruption'] },
  { id: 'kyc360', name: 'KYC360', url: 'https://kyc360.com/feed/', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 2, tags: ['KYC', 'AML'] },
  { id: 'aml-intelligence', name: 'AML Intelligence', url: 'https://www.amlintelligence.com/feed/', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 2, tags: ['AML', 'sanctions'] },
  { id: 'recorded-future', name: 'Recorded Future', url: 'https://www.recordedfuture.com/feed/', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 2, tags: ['threat-intel', 'cyber'] },
  { id: 'cyber-security-news', name: 'Cyber Security News', url: 'https://cybersecuritynews.com/feed/', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 2, tags: ['cyber', 'breach'] },
  { id: 'sc-magazine', name: 'SC Magazine', url: 'https://www.scmagazine.com/feed', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 3, tags: ['cyber', 'security'] },
  { id: 'gir', name: 'Global Investigation Review', url: 'https://globalinvestigationsreview.com/rss', category: 'fraud_intelligence', language: 'en', region: 'global', priority: 3, tags: ['investigation', 'enforcement'] },
];

const ENERGY_COMMODITY: FeedDef[] = [
  { id: 'energy-monitor', name: 'Energy Monitor', url: 'https://www.energymonitor.ai/feed/', category: 'energy_commodity', language: 'en', region: 'global', priority: 1, tags: ['energy', 'transition'] },
  { id: 'energy-voice', name: 'Energy Voice', url: 'https://www.energyvoice.com/feed/', category: 'energy_commodity', language: 'en', region: 'global', priority: 1, tags: ['oil', 'gas'] },
  { id: 'rigzone', name: 'Rigzone', url: 'https://www.rigzone.com/news/rss/rigzone_latest.aspx', category: 'energy_commodity', language: 'en', region: 'global', priority: 1, tags: ['drilling', 'offshore'] },
  { id: 'lng-world', name: 'LNG World News', url: 'https://www.lngworldnews.com/feed/', category: 'energy_commodity', language: 'en', region: 'global', priority: 1, tags: ['LNG', 'gas'] },
  { id: 'gulf-oil-gas', name: 'Gulf Oil & Gas', url: 'https://www.gulfoilandgas.com/rss/', category: 'energy_commodity', language: 'en', region: 'gcc', priority: 1, tags: ['gcc', 'oil'] },
  { id: 'ogj', name: 'Oil & Gas Journal', url: 'https://www.ogj.com/rss/', category: 'energy_commodity', language: 'en', region: 'global', priority: 1, tags: ['oil', 'gas'] },
  { id: 'platts', name: 'S&P Platts', url: 'https://www.spglobal.com/commodityinsights/en/rss/', category: 'energy_commodity', language: 'en', region: 'global', priority: 1, tags: ['pricing', 'commodities'] },
  { id: 'upstream-online', name: 'Upstream Online', url: 'https://www.upstreamonline.com/rss/', category: 'energy_commodity', language: 'en', region: 'global', priority: 1, tags: ['upstream', 'E&P'] },
  { id: 'oil-gas-me', name: 'Oil & Gas ME', url: 'https://www.oilandgasmiddleeast.com/rss', category: 'energy_commodity', language: 'en', region: 'gcc', priority: 1, tags: ['gcc', 'oil'] },
  { id: 'iea-news', name: 'IEA', url: 'https://www.iea.org/feed', category: 'energy_commodity', language: 'en', region: 'global', priority: 1, tags: ['IEA', 'outlook'] },
  { id: 'energy-intelligence', name: 'Energy Intelligence', url: 'https://www.energyintel.com/rss', category: 'energy_commodity', language: 'en', region: 'global', priority: 1, tags: ['oil', 'geopolitics'] },
  { id: 'hellenicshipping', name: 'Hellenic Shipping', url: 'https://www.hellenicshippingnews.com/feed/', category: 'energy_commodity', language: 'en', region: 'global', priority: 2, tags: ['shipping', 'tankers'] },
  { id: 'world-oil', name: 'World Oil', url: 'https://www.worldoil.com/rss', category: 'energy_commodity', language: 'en', region: 'global', priority: 2, tags: ['drilling', 'production'] },
  { id: 'renewables-now', name: 'Renewables Now', url: 'https://renewablesnow.com/feed/', category: 'energy_commodity', language: 'en', region: 'global', priority: 2, tags: ['solar', 'wind'] },
  { id: 'pv-magazine', name: 'PV Magazine', url: 'https://www.pv-magazine.com/feed/', category: 'energy_commodity', language: 'en', region: 'global', priority: 2, tags: ['solar', 'PV'] },
  { id: 'hydrogen-insight', name: 'Hydrogen Insight', url: 'https://www.hydrogeninsight.com/feed/', category: 'energy_commodity', language: 'en', region: 'global', priority: 2, tags: ['hydrogen', 'green'] },
  { id: 'power-engineering', name: 'Power Engineering', url: 'https://www.power-eng.com/feed/', category: 'energy_commodity', language: 'en', region: 'global', priority: 2, tags: ['power', 'utilities'] },
  { id: 'mining-com', name: 'Mining.com', url: 'https://www.mining.com/feed/', category: 'energy_commodity', language: 'en', region: 'global', priority: 2, tags: ['mining', 'metals'] },
  { id: 'freightwaves', name: 'FreightWaves', url: 'https://www.freightwaves.com/feed', category: 'energy_commodity', language: 'en', region: 'global', priority: 2, tags: ['freight', 'logistics'] },
  { id: 'natural-gas-intel', name: 'Natural Gas Intel', url: 'https://www.naturalgasintel.com/rss/', category: 'energy_commodity', language: 'en', region: 'global', priority: 2, tags: ['natural-gas', 'pricing'] },
  { id: 'gpca', name: 'GPCA', url: 'https://www.gpca.org.ae/feed/', category: 'energy_commodity', language: 'en', region: 'gcc', priority: 2, tags: ['petrochemicals', 'gcc'] },
  { id: 'fastmarkets', name: 'Fastmarkets', url: 'https://www.fastmarkets.com/rss', category: 'energy_commodity', language: 'en', region: 'global', priority: 2, tags: ['metals', 'mining'] },
  { id: 'woodmac', name: 'Wood Mackenzie', url: 'https://www.woodmac.com/feed/', category: 'energy_commodity', language: 'en', region: 'global', priority: 2, tags: ['research', 'energy'] },
  { id: 'icis', name: 'ICIS', url: 'https://www.icis.com/explore/rss/', category: 'energy_commodity', language: 'en', region: 'global', priority: 2, tags: ['chemicals', 'pricing'] },
  { id: 'offshore-engineer', name: 'Offshore Engineer', url: 'https://www.oedigital.com/rss', category: 'energy_commodity', language: 'en', region: 'global', priority: 2, tags: ['offshore', 'subsea'] },
  { id: 'shipping-watch', name: 'ShippingWatch', url: 'https://shippingwatch.com/rss', category: 'energy_commodity', language: 'en', region: 'global', priority: 2, tags: ['shipping', 'freight'] },
  { id: 'oapec', name: 'OAPEC', url: 'https://oapecorg.org/en/rss', category: 'energy_commodity', language: 'en', region: 'gcc', priority: 2, tags: ['OAPEC', 'arab'] },
  { id: 'agri-investor', name: 'Agri Investor', url: 'https://www.agriinvestor.com/feed/', category: 'energy_commodity', language: 'en', region: 'global', priority: 3, tags: ['agriculture', 'food'] },
  { id: 'hydrogen-fuel-news', name: 'Hydrogen Fuel News', url: 'https://www.hydrogenfuelnews.com/feed/', category: 'energy_commodity', language: 'en', region: 'global', priority: 3, tags: ['hydrogen', 'fuel-cell'] },
  { id: 'coffee-trading', name: 'Perfect Daily Grind', url: 'https://perfectdailygrind.com/feed/', category: 'energy_commodity', language: 'en', region: 'global', priority: 3, tags: ['coffee', 'commodities'] },
];

const GEOPOLITICAL: FeedDef[] = [
  { id: 'aljazeera', name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'geopolitical', language: 'en', region: 'global', priority: 1, tags: ['news', 'mideast'] },
  { id: 'bbc-mideast', name: 'BBC Middle East', url: 'https://feeds.bbci.co.uk/news/world/middle_east/rss.xml', category: 'geopolitical', language: 'en', region: 'gcc', priority: 1, tags: ['BBC', 'mideast'] },
  { id: 'economist-me', name: 'Economist ME', url: 'https://www.economist.com/middle-east-and-africa/rss.xml', category: 'geopolitical', language: 'en', region: 'gcc', priority: 1, tags: ['analysis', 'mideast'] },
  { id: 'foreign-policy', name: 'Foreign Policy', url: 'https://foreignpolicy.com/feed/', category: 'geopolitical', language: 'en', region: 'global', priority: 1, tags: ['foreign-policy', 'geopolitics'] },
  { id: 'crisis-group', name: 'Crisis Group', url: 'https://www.crisisgroup.org/feed', category: 'geopolitical', language: 'en', region: 'global', priority: 1, tags: ['conflict', 'resolution'] },
  { id: 'cfr', name: 'CFR', url: 'https://www.cfr.org/rss.xml', category: 'geopolitical', language: 'en', region: 'global', priority: 1, tags: ['foreign-affairs', 'policy'] },
  { id: 'brookings', name: 'Brookings', url: 'https://www.brookings.edu/feed/', category: 'geopolitical', language: 'en', region: 'global', priority: 1, tags: ['policy', 'research'] },
  { id: 'carnegie-me', name: 'Carnegie ME', url: 'https://carnegie-mec.org/feed/', category: 'geopolitical', language: 'en', region: 'gcc', priority: 1, tags: ['mideast', 'policy'] },
  { id: 'mei', name: 'Middle East Institute', url: 'https://www.mei.edu/rss.xml', category: 'geopolitical', language: 'en', region: 'gcc', priority: 1, tags: ['mideast', 'policy'] },
  { id: 'al-monitor', name: 'Al-Monitor', url: 'https://www.al-monitor.com/rss', category: 'geopolitical', language: 'en', region: 'gcc', priority: 1, tags: ['mideast', 'politics'] },
  { id: 'reuters-world', name: 'Reuters World', url: 'https://feeds.reuters.com/Reuters/worldNews', category: 'geopolitical', language: 'en', region: 'global', priority: 1, tags: ['world', 'politics'] },
  { id: 'bbc-world', name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'geopolitical', language: 'en', region: 'global', priority: 1, tags: ['world', 'news'] },
  { id: 'nyt-world', name: 'NYT World', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', category: 'geopolitical', language: 'en', region: 'global', priority: 1, tags: ['world', 'politics'] },
  { id: 'guardian-world', name: 'Guardian World', url: 'https://www.theguardian.com/world/rss', category: 'geopolitical', language: 'en', region: 'global', priority: 2, tags: ['world', 'politics'] },
  { id: 'csis', name: 'CSIS', url: 'https://www.csis.org/feeds/all', category: 'geopolitical', language: 'en', region: 'global', priority: 2, tags: ['security', 'strategy'] },
  { id: 'chatham-house', name: 'Chatham House', url: 'https://www.chathamhouse.org/feed', category: 'geopolitical', language: 'en', region: 'global', priority: 2, tags: ['international-affairs'] },
  { id: 'rand-me', name: 'RAND', url: 'https://www.rand.org/topics/middle-east/feed.xml', category: 'geopolitical', language: 'en', region: 'gcc', priority: 2, tags: ['research', 'defense'] },
  { id: 'defense-one', name: 'Defense One', url: 'https://www.defenseone.com/rss/', category: 'geopolitical', language: 'en', region: 'global', priority: 2, tags: ['defense', 'military'] },
  { id: 'war-on-rocks', name: 'War on the Rocks', url: 'https://warontherocks.com/feed/', category: 'geopolitical', language: 'en', region: 'global', priority: 2, tags: ['defense', 'strategy'] },
  { id: 'france24', name: 'France 24', url: 'https://www.france24.com/en/rss', category: 'geopolitical', language: 'en', region: 'global', priority: 2, tags: ['france', 'world'] },
  { id: 'dw-news', name: 'DW News', url: 'https://rss.dw.com/rdf/rss-en-all', category: 'geopolitical', language: 'en', region: 'global', priority: 2, tags: ['germany', 'europe'] },
  { id: 'aljazeera-ar', name: 'الجزيرة', url: 'https://www.aljazeera.net/aljazeerarss/ar/rss', category: 'geopolitical', language: 'ar', region: 'gcc', priority: 1, tags: ['أخبار', 'سياسة'] },
  { id: 'bbc-arabic', name: 'BBC عربي', url: 'https://feeds.bbci.co.uk/arabic/rss.xml', category: 'geopolitical', language: 'ar', region: 'gcc', priority: 1, tags: ['أخبار', 'عالم'] },
  { id: 'sky-news-ar', name: 'سكاي نيوز عربية', url: 'https://www.skynewsarabia.com/rss', category: 'geopolitical', language: 'ar', region: 'gcc', priority: 1, tags: ['أخبار', 'عربية'] },
  { id: 'the-diplomat', name: 'The Diplomat', url: 'https://thediplomat.com/feed/', category: 'geopolitical', language: 'en', region: 'asia', priority: 2, tags: ['asia', 'diplomacy'] },
];

const WEATHER_CAT: FeedDef[] = [
  { id: 'gdacs', name: 'GDACS', url: 'https://www.gdacs.org/xml/rss.xml', category: 'weather_cat', language: 'en', region: 'global', priority: 1, tags: ['disasters', 'alerts'] },
  { id: 'reliefweb', name: 'ReliefWeb', url: 'https://reliefweb.int/disasters/rss.xml', category: 'weather_cat', language: 'en', region: 'global', priority: 1, tags: ['humanitarian', 'disasters'] },
  { id: 'wmo', name: 'WMO', url: 'https://public.wmo.int/en/rss.xml', category: 'weather_cat', language: 'en', region: 'global', priority: 1, tags: ['weather', 'climate'] },
  { id: 'swiss-re-sigma', name: 'Swiss Re Sigma', url: 'https://www.swissre.com/institute/research/sigma-research.html', category: 'weather_cat', language: 'en', region: 'global', priority: 1, tags: ['sigma', 'natcat'] },
  { id: 'munich-re-natcat', name: 'Munich Re NatCat', url: 'https://www.munichre.com/topics-online/en/climate-change-and-natural-disasters.rss', category: 'weather_cat', language: 'en', region: 'global', priority: 1, tags: ['natcat', 'losses'] },
  { id: 'jba-risk', name: 'JBA Risk', url: 'https://www.jbarisk.com/feed/', category: 'weather_cat', language: 'en', region: 'global', priority: 2, tags: ['flood', 'modelling'] },
  { id: 'noaa', name: 'NOAA', url: 'https://www.weather.gov/rss_page.php', category: 'weather_cat', language: 'en', region: 'global', priority: 1, tags: ['NOAA', 'hurricanes'] },
  { id: 'copernicus', name: 'Copernicus', url: 'https://climate.copernicus.eu/rss.xml', category: 'weather_cat', language: 'en', region: 'global', priority: 2, tags: ['climate', 'satellite'] },
  { id: 'earthquake-usgs', name: 'USGS Earthquakes', url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.atom', category: 'weather_cat', language: 'en', region: 'global', priority: 1, tags: ['earthquakes', 'seismic'] },
  { id: 'aon-cat', name: 'Aon CatInsight', url: 'https://catastropheinsight.aon.com/feed/', category: 'weather_cat', language: 'en', region: 'global', priority: 1, tags: ['Aon', 'natcat'] },
  { id: 'nasa-eo', name: 'NASA Earth Observatory', url: 'https://earthobservatory.nasa.gov/feeds/earth-observatory.rss', category: 'weather_cat', language: 'en', region: 'global', priority: 2, tags: ['NASA', 'satellite'] },
  { id: 'accuweather', name: 'AccuWeather', url: 'https://rss.accuweather.com/rss/liveweather_rss.asp', category: 'weather_cat', language: 'en', region: 'global', priority: 2, tags: ['weather', 'forecasts'] },
  { id: 'prevention-web', name: 'PreventionWeb', url: 'https://www.preventionweb.net/rss.xml', category: 'weather_cat', language: 'en', region: 'global', priority: 2, tags: ['DRR', 'prevention'] },
  { id: 'severe-weather-eu', name: 'Severe Weather Europe', url: 'https://www.severe-weather.eu/feed/', category: 'weather_cat', language: 'en', region: 'global', priority: 2, tags: ['severe', 'storms'] },
  { id: 'wildfire-today', name: 'Wildfire Today', url: 'https://wildfiretoday.com/feed/', category: 'weather_cat', language: 'en', region: 'global', priority: 2, tags: ['wildfire', 'fire'] },
  { id: 'gallagher-re', name: 'Gallagher Re', url: 'https://www.ajg.com/gallagherre/news/rss/', category: 'weather_cat', language: 'en', region: 'global', priority: 2, tags: ['reinsurance', 'cat'] },
  { id: 'volcano-si', name: 'Smithsonian Volcanoes', url: 'https://volcano.si.edu/news/WeeklyVolcanoRSS.xml', category: 'weather_cat', language: 'en', region: 'global', priority: 3, tags: ['volcanoes'] },
  { id: 'emdat', name: 'EM-DAT', url: 'https://www.emdat.be/feed/', category: 'weather_cat', language: 'en', region: 'global', priority: 2, tags: ['database', 'disasters'] },
  { id: 'weather-com', name: 'Weather.com', url: 'https://weather.com/feeds/rss', category: 'weather_cat', language: 'en', region: 'global', priority: 2, tags: ['weather', 'forecasts'] },
  { id: 'cat-modelling', name: 'Verisk Cat', url: 'https://www.verisk.com/insurance/products/catastrophe-modeling/feed/', category: 'weather_cat', language: 'en', region: 'global', priority: 2, tags: ['cat-modelling', 'AIR'] },
];

const CRYPTOCURRENCY: FeedDef[] = [
  { id: 'coindesk', name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 1, tags: ['bitcoin', 'crypto'] },
  { id: 'cointelegraph', name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss', category: 'cryptocurrency', language: 'en', region: 'global', priority: 1, tags: ['crypto', 'blockchain'] },
  { id: 'decrypt', name: 'Decrypt', url: 'https://decrypt.co/feed', category: 'cryptocurrency', language: 'en', region: 'global', priority: 1, tags: ['crypto', 'web3'] },
  { id: 'bitcoin-magazine', name: 'Bitcoin Magazine', url: 'https://bitcoinmagazine.com/.rss/full/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 1, tags: ['bitcoin', 'mining'] },
  { id: 'cryptoslate', name: 'CryptoSlate', url: 'https://cryptoslate.com/feed/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 2, tags: ['crypto', 'research'] },
  { id: 'theblock', name: 'The Block', url: 'https://www.theblock.co/rss.xml', category: 'cryptocurrency', language: 'en', region: 'global', priority: 1, tags: ['crypto', 'institutions'] },
  { id: 'blockworks', name: 'Blockworks', url: 'https://blockworks.co/feed/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 1, tags: ['crypto', 'institutions'] },
  { id: 'cryptobriefing', name: 'Crypto Briefing', url: 'https://cryptobriefing.com/feed/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 2, tags: ['crypto', 'DeFi'] },
  { id: 'defiant', name: 'The Defiant', url: 'https://thedefiant.io/feed/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 2, tags: ['DeFi', 'ethereum'] },
  { id: 'unchained', name: 'Unchained', url: 'https://unchainedcrypto.com/feed/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 2, tags: ['crypto', 'analysis'] },
  { id: 'crypto-news', name: 'Crypto.news', url: 'https://crypto.news/feed/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 2, tags: ['crypto', 'news'] },
  { id: 'u-today', name: 'U.Today', url: 'https://u.today/rss', category: 'cryptocurrency', language: 'en', region: 'global', priority: 2, tags: ['crypto', 'altcoins'] },
  { id: 'beincrypto', name: 'BeInCrypto', url: 'https://beincrypto.com/feed/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 2, tags: ['crypto', 'trading'] },
  { id: 'dailyhodl', name: 'Daily Hodl', url: 'https://dailyhodl.com/feed/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 2, tags: ['crypto', 'whales'] },
  { id: 'bitcoin-com', name: 'Bitcoin.com', url: 'https://news.bitcoin.com/feed/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 2, tags: ['bitcoin', 'BCH'] },
  { id: 'messari', name: 'Messari', url: 'https://messari.io/rss', category: 'cryptocurrency', language: 'en', region: 'global', priority: 2, tags: ['research', 'crypto'] },
  { id: 'ambcrypto', name: 'AMBCrypto', url: 'https://ambcrypto.com/feed/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 3, tags: ['crypto', 'on-chain'] },
  { id: 'crypto-potato', name: 'CryptoPotato', url: 'https://cryptopotato.com/feed/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 3, tags: ['crypto', 'trading'] },
  { id: 'coingape', name: 'CoinGape', url: 'https://coingape.com/feed/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 3, tags: ['crypto', 'news'] },
  { id: 'coin-journal', name: 'CoinJournal', url: 'https://coinjournal.net/feed/', category: 'cryptocurrency', language: 'en', region: 'global', priority: 3, tags: ['crypto', 'exchanges'] },
];

const STOCK_MARKET: FeedDef[] = [
  { id: 'seeking-alpha', name: 'Seeking Alpha', url: 'https://seekingalpha.com/feed.xml', category: 'stock_market', language: 'en', region: 'global', priority: 1, tags: ['stocks', 'analysis'] },
  { id: 'investing-stocks-sm', name: 'Investing.com Stocks', url: 'https://www.investing.com/rss/news_14.rss', category: 'stock_market', language: 'en', region: 'global', priority: 1, tags: ['stocks', 'earnings'] },
  { id: 'motley-fool', name: 'Motley Fool', url: 'https://www.fool.com/feeds/index.aspx', category: 'stock_market', language: 'en', region: 'global', priority: 1, tags: ['investing', 'stocks'] },
  { id: 'zacks', name: 'Zacks', url: 'https://www.zacks.com/feeds/', category: 'stock_market', language: 'en', region: 'global', priority: 2, tags: ['earnings', 'ratings'] },
  { id: 'stockanalysis', name: 'Stock Analysis', url: 'https://stockanalysis.com/feed/', category: 'stock_market', language: 'en', region: 'global', priority: 2, tags: ['stocks', 'IPO'] },
  { id: 'marketbeat', name: 'MarketBeat', url: 'https://www.marketbeat.com/rss/', category: 'stock_market', language: 'en', region: 'global', priority: 2, tags: ['ratings', 'dividends'] },
  { id: 'investopedia', name: 'Investopedia', url: 'https://www.investopedia.com/feedbuilder/feed/getfeed/?feedName=rss_headline', category: 'stock_market', language: 'en', region: 'global', priority: 2, tags: ['education', 'investing'] },
  { id: 'thestreet', name: 'TheStreet', url: 'https://www.thestreet.com/feeds/rss', category: 'stock_market', language: 'en', region: 'global', priority: 2, tags: ['stocks', 'trading'] },
  { id: 'investor-place', name: 'InvestorPlace', url: 'https://investorplace.com/feed/', category: 'stock_market', language: 'en', region: 'global', priority: 2, tags: ['stocks', 'analysis'] },
  { id: 'simply-wall-st', name: 'Simply Wall St', url: 'https://simplywall.st/feed/', category: 'stock_market', language: 'en', region: 'global', priority: 2, tags: ['valuation', 'analysis'] },
  { id: 'tipranks', name: 'TipRanks', url: 'https://www.tipranks.com/feed/', category: 'stock_market', language: 'en', region: 'global', priority: 2, tags: ['analyst', 'ratings'] },
  { id: 'dividend-com', name: 'Dividend.com', url: 'https://www.dividend.com/feed/', category: 'stock_market', language: 'en', region: 'global', priority: 2, tags: ['dividends', 'income'] },
  { id: 'guru-focus', name: 'GuruFocus', url: 'https://www.gurufocus.com/rss.php', category: 'stock_market', language: 'en', region: 'global', priority: 2, tags: ['value-investing', 'gurus'] },
  { id: 'finviz', name: 'FinViz', url: 'https://finviz.com/news_feed.ashx', category: 'stock_market', language: 'en', region: 'global', priority: 2, tags: ['screener', 'charts'] },
  { id: 'tadawul-news', name: 'Tadawul', url: 'https://www.saudiexchange.sa/wps/portal/saudiexchange/newsandreports/rss', category: 'stock_market', language: 'en', region: 'SA', priority: 1, tags: ['tadawul', 'saudi-stocks'] },
  { id: 'boursa-kuwait', name: 'Boursa Kuwait', url: 'https://www.boursakuwait.com.kw/en/rss', category: 'stock_market', language: 'en', region: 'KW', priority: 1, tags: ['boursa', 'kuwait-stocks'] },
  { id: 'dfm-news', name: 'DFM Dubai', url: 'https://www.dfm.ae/news/rss', category: 'stock_market', language: 'en', region: 'AE', priority: 1, tags: ['DFM', 'dubai-stocks'] },
  { id: 'adx-news', name: 'ADX Abu Dhabi', url: 'https://www.adx.ae/en/news/rss', category: 'stock_market', language: 'en', region: 'AE', priority: 1, tags: ['ADX', 'abu-dhabi-stocks'] },
  { id: 'qse-news', name: 'QSE Qatar', url: 'https://www.qe.com.qa/rss', category: 'stock_market', language: 'en', region: 'QA', priority: 1, tags: ['QSE', 'qatar-stocks'] },
  { id: 'fool-uk', name: 'Motley Fool UK', url: 'https://www.fool.co.uk/feed/', category: 'stock_market', language: 'en', region: 'europe', priority: 2, tags: ['UK-stocks', 'FTSE'] },
];

const CENTRAL_BANK: FeedDef[] = [
  { id: 'fed-reserve', name: 'Federal Reserve', url: 'https://www.federalreserve.gov/feeds/press_all.xml', category: 'central_bank', language: 'en', region: 'global', priority: 1, tags: ['fed', 'rates'] },
  { id: 'ecb', name: 'ECB', url: 'https://www.ecb.europa.eu/rss/press.html', category: 'central_bank', language: 'en', region: 'europe', priority: 1, tags: ['ECB', 'eurozone'] },
  { id: 'bank-of-england', name: 'Bank of England', url: 'https://www.bankofengland.co.uk/rss/publications', category: 'central_bank', language: 'en', region: 'europe', priority: 1, tags: ['BoE', 'UK'] },
  { id: 'bank-of-japan', name: 'Bank of Japan', url: 'https://www.boj.or.jp/en/rss/rss.xml', category: 'central_bank', language: 'en', region: 'asia', priority: 2, tags: ['BoJ', 'japan'] },
  { id: 'pboc', name: 'PBOC', url: 'http://www.pbc.gov.cn/english/130721/rss.xml', category: 'central_bank', language: 'en', region: 'asia', priority: 1, tags: ['PBOC', 'china'] },
  { id: 'sama-monetary', name: 'SAMA Monetary', url: 'https://www.sama.gov.sa/en-US/MonetaryPolicy/Pages/rss.aspx', category: 'central_bank', language: 'en', region: 'SA', priority: 1, tags: ['SAMA', 'riyal'] },
  { id: 'cbuae-monetary', name: 'CBUAE Monetary', url: 'https://www.centralbank.ae/en/monetary-policy/rss', category: 'central_bank', language: 'en', region: 'AE', priority: 1, tags: ['CBUAE', 'dirham'] },
  { id: 'cbk-kuwait', name: 'CBK Kuwait', url: 'https://www.cbk.gov.kw/en/news/rss', category: 'central_bank', language: 'en', region: 'KW', priority: 1, tags: ['CBK', 'dinar'] },
  { id: 'central-banking', name: 'Central Banking', url: 'https://www.centralbanking.com/rss', category: 'central_bank', language: 'en', region: 'global', priority: 1, tags: ['central-banks', 'policy'] },
  { id: 'rba', name: 'RBA Australia', url: 'https://www.rba.gov.au/rss/rss.xml', category: 'central_bank', language: 'en', region: 'global', priority: 2, tags: ['RBA', 'australia'] },
  { id: 'bank-of-canada', name: 'Bank of Canada', url: 'https://www.bankofcanada.ca/content_type/press-releases/feed/', category: 'central_bank', language: 'en', region: 'global', priority: 2, tags: ['BoC', 'canada'] },
  { id: 'snb', name: 'Swiss National Bank', url: 'https://www.snb.ch/en/mmr/rss', category: 'central_bank', language: 'en', region: 'europe', priority: 2, tags: ['SNB', 'switzerland'] },
  { id: 'rbi', name: 'Reserve Bank India', url: 'https://www.rbi.org.in/rss/rss.aspx', category: 'central_bank', language: 'en', region: 'asia', priority: 2, tags: ['RBI', 'india'] },
  { id: 'bis-speeches', name: 'BIS Speeches', url: 'https://www.bis.org/rss/speeches.xml', category: 'central_bank', language: 'en', region: 'global', priority: 2, tags: ['BIS', 'speeches'] },
  { id: 'imf-monetary', name: 'IMF Monetary', url: 'https://www.imf.org/en/Topics/monetary-policy/rss', category: 'central_bank', language: 'en', region: 'global', priority: 2, tags: ['IMF', 'monetary'] },
];

const DEVELOPMENT: FeedDef[] = [
  { id: 'vision2030', name: 'Vision 2030', url: 'https://www.vision2030.gov.sa/en/news/rss', category: 'development', language: 'en', region: 'SA', priority: 1, tags: ['vision2030', 'saudi'] },
  { id: 'pif-sa', name: 'PIF', url: 'https://www.pif.gov.sa/en/news/rss', category: 'development', language: 'en', region: 'SA', priority: 1, tags: ['PIF', 'sovereign-wealth'] },
  { id: 'neom', name: 'NEOM', url: 'https://www.neom.com/en-us/newsroom/rss', category: 'development', language: 'en', region: 'SA', priority: 1, tags: ['NEOM', 'mega-project'] },
  { id: 'irena', name: 'IRENA', url: 'https://www.irena.org/rss', category: 'development', language: 'en', region: 'global', priority: 1, tags: ['renewables', 'energy-transition'] },
  { id: 'smart-dubai', name: 'Digital Dubai', url: 'https://www.digitaldubai.ae/rss', category: 'development', language: 'en', region: 'AE', priority: 2, tags: ['smart-city', 'digital'] },
  { id: 'adnoc', name: 'ADNOC', url: 'https://www.adnoc.ae/en/news/rss', category: 'development', language: 'en', region: 'AE', priority: 2, tags: ['energy', 'investment'] },
  { id: 'masdar', name: 'Masdar', url: 'https://masdar.ae/en/news/rss', category: 'development', language: 'en', region: 'AE', priority: 2, tags: ['clean-energy', 'sustainability'] },
  { id: 'wef', name: 'WEF', url: 'https://www.weforum.org/feed', category: 'development', language: 'en', region: 'global', priority: 1, tags: ['WEF', 'davos'] },
  { id: 'un-sdg', name: 'UN SDGs', url: 'https://news.un.org/feed/subscribe/en/news/topic/sdgs/feed/rss.xml', category: 'development', language: 'en', region: 'global', priority: 2, tags: ['SDG', 'development'] },
  { id: 'undp-arab', name: 'UNDP Arab States', url: 'https://www.undp.org/arab-states/feed', category: 'development', language: 'en', region: 'gcc', priority: 2, tags: ['UNDP', 'development'] },
  { id: 'qatar-2030', name: 'Qatar National Vision', url: 'https://www.gco.gov.qa/en/rss', category: 'development', language: 'en', region: 'QA', priority: 2, tags: ['qatar-vision'] },
  { id: 'oman-vision-2040', name: 'Oman Vision 2040', url: 'https://www.omanvision2040.com/feed/', category: 'development', language: 'en', region: 'OM', priority: 2, tags: ['oman-vision'] },
  { id: 'bahrain-edb', name: 'Bahrain EDB', url: 'https://www.bahrainedb.com/feed/', category: 'development', language: 'en', region: 'BH', priority: 2, tags: ['bahrain', 'fintech'] },
  { id: 'kdipa', name: 'KDIPA', url: 'https://www.kdipa.gov.kw/en/rss', category: 'development', language: 'en', region: 'KW', priority: 2, tags: ['kuwait', 'FDI'] },
  { id: 'gcc-stat', name: 'GCC-Stat', url: 'https://gccstat.org/en/rss', category: 'development', language: 'en', region: 'gcc', priority: 2, tags: ['statistics', 'data'] },
  { id: 'expo-city-dubai', name: 'Expo City', url: 'https://www.expocitydubai.com/rss', category: 'development', language: 'en', region: 'AE', priority: 2, tags: ['expo', 'innovation'] },
  { id: 'misk-foundation', name: 'Misk', url: 'https://misk.org.sa/en/feed/', category: 'development', language: 'en', region: 'SA', priority: 2, tags: ['youth', 'education'] },
  { id: 'saudi-tourism', name: 'Saudi Tourism', url: 'https://www.visitsaudi.com/en/rss', category: 'development', language: 'en', region: 'SA', priority: 2, tags: ['tourism'] },
  { id: 'ilo-arab', name: 'ILO Arab', url: 'https://www.ilo.org/beirut/feed/', category: 'development', language: 'en', region: 'gcc', priority: 3, tags: ['labor', 'employment'] },
  { id: 'adb', name: 'ADB', url: 'https://www.adb.org/feed', category: 'development', language: 'en', region: 'asia', priority: 3, tags: ['development', 'infrastructure'] },
];

const HEALTHCARE: FeedDef[] = [
  { id: 'who-emro', name: 'WHO EMRO', url: 'https://www.emro.who.int/feed/rss.xml', category: 'healthcare', language: 'en', region: 'gcc', priority: 1, tags: ['WHO', 'EMRO'] },
  { id: 'modern-healthcare', name: 'Modern Healthcare', url: 'https://www.modernhealthcare.com/rss', category: 'healthcare', language: 'en', region: 'global', priority: 1, tags: ['healthcare', 'policy'] },
  { id: 'stat-news', name: 'STAT News', url: 'https://www.statnews.com/feed/', category: 'healthcare', language: 'en', region: 'global', priority: 1, tags: ['pharma', 'biotech'] },
  { id: 'who-global', name: 'WHO News', url: 'https://www.who.int/rss-feeds/news-english.xml', category: 'healthcare', language: 'en', region: 'global', priority: 1, tags: ['WHO', 'global-health'] },
  { id: 'lancet', name: 'The Lancet', url: 'https://www.thelancet.com/rssfeed/lancet_online.xml', category: 'healthcare', language: 'en', region: 'global', priority: 1, tags: ['research', 'medicine'] },
  { id: 'reuters-health', name: 'Reuters Health', url: 'https://feeds.reuters.com/reuters/healthNews', category: 'healthcare', language: 'en', region: 'global', priority: 1, tags: ['health', 'pharma'] },
  { id: 'healthcare-it-news', name: 'Healthcare IT News', url: 'https://www.healthcareitnews.com/rss', category: 'healthcare', language: 'en', region: 'global', priority: 2, tags: ['health-IT', 'digital-health'] },
  { id: 'fierce-healthcare', name: 'Fierce Healthcare', url: 'https://www.fiercehealthcare.com/rss', category: 'healthcare', language: 'en', region: 'global', priority: 2, tags: ['healthcare', 'payer'] },
  { id: 'becker-hospital', name: "Becker's", url: 'https://www.beckershospitalreview.com/rss', category: 'healthcare', language: 'en', region: 'global', priority: 2, tags: ['hospital', 'finance'] },
  { id: 'mobihealthnews', name: 'MobiHealthNews', url: 'https://www.mobihealthnews.com/rss', category: 'healthcare', language: 'en', region: 'global', priority: 2, tags: ['mHealth', 'wearables'] },
  { id: 'bmj', name: 'BMJ', url: 'https://www.bmj.com/rss/recent.xml', category: 'healthcare', language: 'en', region: 'global', priority: 2, tags: ['research', 'medicine'] },
  { id: 'health-affairs', name: 'Health Affairs', url: 'https://www.healthaffairs.org/rss/', category: 'healthcare', language: 'en', region: 'global', priority: 2, tags: ['policy', 'health-economics'] },
  { id: 'saudi-moh', name: 'Saudi MOH', url: 'https://www.moh.gov.sa/en/Ministry/rss/', category: 'healthcare', language: 'en', region: 'SA', priority: 1, tags: ['saudi', 'health'] },
  { id: 'dha-dubai', name: 'DHA Dubai', url: 'https://www.dha.gov.ae/en/rss', category: 'healthcare', language: 'en', region: 'AE', priority: 2, tags: ['dubai', 'health'] },
  { id: 'gcc-health', name: 'GCC Health', url: 'https://www.gcc-health.org/rss', category: 'healthcare', language: 'en', region: 'gcc', priority: 1, tags: ['gcc', 'health'] },
];

const MARITIME_TRADE: FeedDef[] = [
  { id: 'tradewinds', name: 'TradeWinds', url: 'https://www.tradewindsnews.com/rss/', category: 'maritime_trade', language: 'en', region: 'global', priority: 1, tags: ['shipping', 'maritime'] },
  { id: 'seatrade', name: 'Seatrade Maritime', url: 'https://www.seatrade-maritime.com/rss', category: 'maritime_trade', language: 'en', region: 'global', priority: 1, tags: ['maritime', 'ports'] },
  { id: 'lloyds-list', name: "Lloyd's List", url: 'https://lloydslist.maritimeintelligence.informa.com/rss', category: 'maritime_trade', language: 'en', region: 'global', priority: 1, tags: ['marine', 'insurance'] },
  { id: 'splash247', name: 'Splash 247', url: 'https://splash247.com/feed/', category: 'maritime_trade', language: 'en', region: 'global', priority: 2, tags: ['shipping', 'maritime'] },
  { id: 'maritime-executive', name: 'Maritime Executive', url: 'https://www.maritime-executive.com/rss/', category: 'maritime_trade', language: 'en', region: 'global', priority: 2, tags: ['maritime', 'industry'] },
  { id: 'gcaptain', name: 'gCaptain', url: 'https://gcaptain.com/feed/', category: 'maritime_trade', language: 'en', region: 'global', priority: 2, tags: ['maritime', 'navy'] },
  { id: 'container-news', name: 'Container News', url: 'https://container-news.com/feed/', category: 'maritime_trade', language: 'en', region: 'global', priority: 2, tags: ['containers', 'logistics'] },
  { id: 'port-technology', name: 'Port Technology', url: 'https://www.porttechnology.org/rss/', category: 'maritime_trade', language: 'en', region: 'global', priority: 2, tags: ['ports', 'automation'] },
  { id: 'safety4sea', name: 'Safety4Sea', url: 'https://safety4sea.com/feed/', category: 'maritime_trade', language: 'en', region: 'global', priority: 2, tags: ['safety', 'regulation'] },
  { id: 'arabian-supply-chain', name: 'Arabian Supply Chain', url: 'https://www.arabiansupplychain.com/rss', category: 'maritime_trade', language: 'en', region: 'gcc', priority: 1, tags: ['gcc', 'logistics'] },
  { id: 'dp-world', name: 'DP World', url: 'https://www.dpworld.com/news/rss', category: 'maritime_trade', language: 'en', region: 'gcc', priority: 1, tags: ['ports', 'dubai'] },
  { id: 'joc', name: 'JOC', url: 'https://www.joc.com/rss', category: 'maritime_trade', language: 'en', region: 'global', priority: 2, tags: ['containers', 'trade'] },
  { id: 'loadstar', name: 'The Loadstar', url: 'https://theloadstar.com/feed/', category: 'maritime_trade', language: 'en', region: 'global', priority: 2, tags: ['logistics', 'freight'] },
  { id: 'world-maritime-news', name: 'World Maritime News', url: 'https://worldmaritimensews.com/feed/', category: 'maritime_trade', language: 'en', region: 'global', priority: 2, tags: ['maritime', 'shipping'] },
  { id: 'ihs-fairplay', name: 'IHS Fairplay', url: 'https://ihsmarkit.com/products/maritime-fair-play.html', category: 'maritime_trade', language: 'en', region: 'global', priority: 2, tags: ['maritime', 'intelligence'] },
];

export const ALL_FEEDS: FeedDef[] = [
  ...INSURANCE_GLOBAL,
  ...GCC_REGIONAL,
  ...REGULATORY,
  ...INSURTECH,
  ...FINANCIAL_MARKETS,
  ...FRAUD_INTELLIGENCE,
  ...ENERGY_COMMODITY,
  ...GEOPOLITICAL,
  ...WEATHER_CAT,
  ...CRYPTOCURRENCY,
  ...STOCK_MARKET,
  ...CENTRAL_BANK,
  ...DEVELOPMENT,
  ...HEALTHCARE,
  ...MARITIME_TRADE,
];

export const FEED_STATS = {
  total: ALL_FEEDS.length,
  insurance_global: INSURANCE_GLOBAL.length,
  gcc_regional: GCC_REGIONAL.length,
  regulatory: REGULATORY.length,
  insurtech: INSURTECH.length,
  financial_markets: FINANCIAL_MARKETS.length,
  fraud_intelligence: FRAUD_INTELLIGENCE.length,
  energy_commodity: ENERGY_COMMODITY.length,
  geopolitical: GEOPOLITICAL.length,
  weather_cat: WEATHER_CAT.length,
  cryptocurrency: CRYPTOCURRENCY.length,
  stock_market: STOCK_MARKET.length,
  central_bank: CENTRAL_BANK.length,
  development: DEVELOPMENT.length,
  healthcare: HEALTHCARE.length,
  maritime_trade: MARITIME_TRADE.length,
  byLanguage: {
    en: ALL_FEEDS.filter(f => f.language === 'en').length,
    ar: ALL_FEEDS.filter(f => f.language === 'ar').length,
    fr: ALL_FEEDS.filter(f => f.language === 'fr').length,
  },
};

const VARIANT_FEED_MAP: Record<string, FeedCategory[]> = {
  global: ['insurance_global', 'gcc_regional', 'regulatory', 'geopolitical', 'weather_cat', 'financial_markets', 'fraud_intelligence', 'healthcare'],
  tech: ['insurtech', 'gcc_regional', 'regulatory', 'cryptocurrency', 'stock_market'],
  finance: ['financial_markets', 'gcc_regional', 'regulatory', 'stock_market', 'central_bank', 'insurance_global', 'cryptocurrency'],
  fraud: ['fraud_intelligence', 'insurance_global', 'gcc_regional', 'regulatory', 'geopolitical'],
  commodity: ['energy_commodity', 'financial_markets', 'gcc_regional', 'geopolitical', 'maritime_trade', 'weather_cat'],
  happy: ['development', 'gcc_regional', 'healthcare', 'insurtech'],
};

export function getFeedsByCategory(category: FeedCategory): FeedDef[] {
  return ALL_FEEDS.filter(f => f.category === category);
}

export function getFeedsForVariant(variantId: string): FeedDef[] {
  const categories = VARIANT_FEED_MAP[variantId] || VARIANT_FEED_MAP.global;
  return ALL_FEEDS.filter(f => categories.includes(f.category));
}

export function getFeedsByRegion(region: string): FeedDef[] {
  return ALL_FEEDS.filter(f => f.region === region || f.region === 'global' || f.region === 'gcc');
}

export function getFeedsByLanguage(lang: 'en' | 'ar' | 'fr'): FeedDef[] {
  return ALL_FEEDS.filter(f => f.language === lang);
}

export function searchFeeds(query: string): FeedDef[] {
  const q = query.toLowerCase();
  return ALL_FEEDS.filter(f =>
    f.name.toLowerCase().includes(q) ||
    f.tags.some(t => t.toLowerCase().includes(q)) ||
    f.category.toLowerCase().includes(q)
  );
}
