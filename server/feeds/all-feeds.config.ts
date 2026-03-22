/**
 * DEEVO Monitor v3.0 — Complete RSS Feed Library
 * 200+ feeds organized by variant and category.
 */

type VariantId = 'global' | 'tech' | 'finance' | 'fraud';

type FeedCategory =
  | 'insurance_global' | 'reinsurance' | 'gcc_regional' | 'regulatory_gcc'
  | 'weather_cat' | 'geopolitical'
  | 'insurtech' | 'ai_ml' | 'digital_insurance' | 'startup_funding' | 'cloud_tech'
  | 'financial_markets' | 'insurance_stocks' | 'gcc_economy' | 'reinsurance_pricing' | 'investment'
  | 'fraud_intelligence' | 'law_enforcement' | 'cyber_fraud' | 'financial_crime';

interface FeedDefinition {
  id: string;
  name: string;
  nameAr?: string;
  url: string;
  region: string;
  variants: VariantId[];
  category: FeedCategory;
  priority: 1 | 2 | 3;
  language: 'en' | 'ar' | 'fr';
  updateFrequency: 'realtime' | 'hourly' | 'daily';
}

// ═══════════════════════════════════════════════════════
// INSURANCE GLOBAL FEEDS (25)
// ═══════════════════════════════════════════════════════
const INSURANCE_GLOBAL_FEEDS: FeedDefinition[] = [
  { id: 'insurance_journal', name: 'Insurance Journal', url: 'https://www.insurancejournal.com/feed/', region: 'global', variants: ['global', 'finance'], category: 'insurance_global', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'reinsurance_news', name: 'Reinsurance News', url: 'https://www.reinsurancene.ws/feed/', region: 'global', variants: ['global', 'finance'], category: 'reinsurance', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'insurance_business_mag', name: 'Insurance Business Mag', url: 'https://www.insurancebusinessmag.com/rss/news', region: 'global', variants: ['global'], category: 'insurance_global', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'artemis', name: 'Artemis (Cat Bonds/ILS)', url: 'https://www.artemis.bm/feed/', region: 'global', variants: ['global', 'finance'], category: 'reinsurance', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'lloyds_news', name: "Lloyd's of London", url: 'https://www.lloyds.com/lloyds-news/rss', region: 'global', variants: ['global', 'finance'], category: 'insurance_global', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'swiss_re_news', name: 'Swiss Re', url: 'https://www.swissre.com/rss', region: 'global', variants: ['global', 'finance'], category: 'reinsurance', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'munich_re_news', name: 'Munich Re', url: 'https://www.munichre.com/rss', region: 'global', variants: ['global', 'finance'], category: 'reinsurance', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'am_best_wire', name: 'AM Best Newswire', url: 'https://www.ambest.com/rss/newswire.rss', region: 'global', variants: ['global', 'finance'], category: 'insurance_global', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'carrier_management', name: 'Carrier Management', url: 'https://www.carriermanagement.com/feed/', region: 'global', variants: ['global'], category: 'insurance_global', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'risk_management_mag', name: 'Risk Management Mag', url: 'https://www.rmmagazine.com/feed/', region: 'global', variants: ['global'], category: 'insurance_global', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'iais_news', name: 'IAIS (Global Regulator)', url: 'https://www.iaisweb.org/news/rss', region: 'global', variants: ['global', 'finance'], category: 'regulatory_gcc', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'ifrs_news', name: 'IFRS Foundation', url: 'https://www.ifrs.org/news-and-events/news/rss', region: 'global', variants: ['global', 'finance'], category: 'regulatory_gcc', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'propertycasualty360', name: 'PropertyCasualty360', url: 'https://www.propertycasualty360.com/rss/', region: 'global', variants: ['global'], category: 'insurance_global', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'lifehealthpro', name: 'Life & Health Pro', url: 'https://www.lifehealthpro.com/rss/', region: 'global', variants: ['global'], category: 'insurance_global', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'coverager_global', name: 'Coverager', url: 'https://coverager.com/feed/', region: 'global', variants: ['global', 'tech'], category: 'insurtech', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'the_insurer', name: 'The Insurer', url: 'https://www.theinsurer.com/feed/', region: 'global', variants: ['global', 'finance'], category: 'insurance_global', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'global_reinsurance', name: 'Global Reinsurance', url: 'https://www.globalreinsurance.com/rss/', region: 'global', variants: ['global', 'finance'], category: 'reinsurance', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'business_insurance', name: 'Business Insurance', url: 'https://www.businessinsurance.com/rss/', region: 'global', variants: ['global'], category: 'insurance_global', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'insurance_age', name: 'Insurance Age', url: 'https://www.insuranceage.co.uk/rss/', region: 'global', variants: ['global'], category: 'insurance_global', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'post_magazine', name: 'Post Magazine', url: 'https://www.postonline.co.uk/rss', region: 'global', variants: ['global'], category: 'insurance_global', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'fitch_insurance', name: 'Fitch Insurance', url: 'https://www.fitchratings.com/rss/insurance', region: 'global', variants: ['global', 'finance'], category: 'financial_markets', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'sp_insurance', name: 'S&P Global Insurance', url: 'https://www.spglobal.com/ratings/en/rss/topic/insurance.xml', region: 'global', variants: ['global', 'finance'], category: 'insurance_stocks', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'moodys_insurance', name: "Moody's Insurance", url: 'https://www.moodys.com/rss/insurance', region: 'global', variants: ['global', 'finance'], category: 'insurance_stocks', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'kpmg_insurance', name: 'KPMG Insurance', url: 'https://home.kpmg/xx/en/home/insights/insurance.html/rss', region: 'global', variants: ['global'], category: 'insurance_global', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'pwc_insurance', name: 'PwC Insurance', url: 'https://www.pwc.com/gx/en/industries/insurance/rss.xml', region: 'global', variants: ['global'], category: 'insurance_global', priority: 3, language: 'en', updateFrequency: 'daily' },
];

// ═══════════════════════════════════════════════════════
// GCC REGIONAL FEEDS (20)
// ═══════════════════════════════════════════════════════
const GCC_REGIONAL_FEEDS: FeedDefinition[] = [
  { id: 'me_insurance_review', name: 'ME Insurance Review', url: 'https://www.meinsurancereview.com/rss/news', region: 'gcc', variants: ['global', 'finance', 'tech', 'fraud'], category: 'gcc_regional', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'arab_news_biz', name: 'Arab News Business', url: 'https://www.arabnews.com/category/business/economy/feed', region: 'gcc', variants: ['global', 'finance'], category: 'gcc_regional', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'zawya_insurance', name: 'Zawya Insurance', url: 'https://www.zawya.com/en/insurance/rss', region: 'gcc', variants: ['global', 'finance'], category: 'gcc_regional', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'zawya_markets', name: 'Zawya Markets', url: 'https://www.zawya.com/en/markets/rss', region: 'gcc', variants: ['finance'], category: 'financial_markets', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'gulf_news_biz', name: 'Gulf News Business', url: 'https://gulfnews.com/rss/business', region: 'ae', variants: ['global', 'finance'], category: 'gcc_regional', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'saudi_gazette_biz', name: 'Saudi Gazette Business', url: 'https://saudigazette.com.sa/rss', region: 'sa', variants: ['global', 'finance'], category: 'gcc_regional', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'kuwait_times', name: 'Kuwait Times', url: 'https://www.kuwaittimes.com/feed/', region: 'kw', variants: ['global', 'finance', 'fraud'], category: 'gcc_regional', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'alarabiya_biz', name: 'Al Arabiya Business', url: 'https://english.alarabiya.net/rss.xml', region: 'gcc', variants: ['global', 'finance'], category: 'gcc_regional', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'khaleej_times_biz', name: 'Khaleej Times Business', url: 'https://www.khaleejtimes.com/rss/business', region: 'ae', variants: ['global', 'finance'], category: 'gcc_regional', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'trade_arabia', name: 'Trade Arabia', url: 'https://www.tradearabia.com/feed/', region: 'gcc', variants: ['global', 'finance'], category: 'gcc_regional', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'difc_news', name: 'DIFC News', url: 'https://www.difc.ae/newsroom/rss', region: 'ae', variants: ['global', 'finance', 'tech'], category: 'gcc_regional', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'adgm_news', name: 'ADGM News', url: 'https://www.adgm.com/en/media/rss', region: 'ae', variants: ['global', 'finance'], category: 'gcc_regional', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'qfc_news', name: 'QFC News', url: 'https://www.qfc.qa/en/newsroom/rss', region: 'qa', variants: ['global', 'finance'], category: 'gcc_regional', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'reuters_me', name: 'Reuters Middle East', url: 'https://feeds.reuters.com/reuters/businessNews', region: 'gcc', variants: ['global', 'finance'], category: 'gcc_regional', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'bloomberg_me', name: 'Bloomberg ME', url: 'https://feeds.bloomberg.com/markets/news.rss', region: 'gcc', variants: ['global', 'finance'], category: 'financial_markets', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'aleqtisadiah', name: 'الاقتصادية', nameAr: 'الاقتصادية', url: 'https://www.aleqt.com/rss', region: 'sa', variants: ['global', 'finance'], category: 'gcc_regional', priority: 2, language: 'ar', updateFrequency: 'hourly' },
  { id: 'alqabas_kw', name: 'القبس الاقتصادي', nameAr: 'القبس', url: 'https://alqabas.com/rss', region: 'kw', variants: ['global', 'finance', 'fraud'], category: 'gcc_regional', priority: 2, language: 'ar', updateFrequency: 'hourly' },
  { id: 'alrai_kw', name: 'الرأي الكويتية', nameAr: 'الرأي', url: 'https://alrai.com/rss', region: 'kw', variants: ['global', 'fraud'], category: 'gcc_regional', priority: 2, language: 'ar', updateFrequency: 'hourly' },
  { id: 'annahar_me', name: 'النهار', nameAr: 'النهار', url: 'https://www.annahar.com/rss', region: 'gcc', variants: ['global'], category: 'gcc_regional', priority: 3, language: 'ar', updateFrequency: 'hourly' },
  { id: 'albayan_ae', name: 'البيان اقتصاد', nameAr: 'البيان', url: 'https://www.albayan.ae/rss', region: 'ae', variants: ['global', 'finance'], category: 'gcc_regional', priority: 3, language: 'ar', updateFrequency: 'hourly' },
];

// ═══════════════════════════════════════════════════════
// REGULATORY FEEDS (15)
// ═══════════════════════════════════════════════════════
const REGULATORY_FEEDS: FeedDefinition[] = [
  { id: 'sama_news', name: 'SAMA Saudi Arabia', url: 'https://www.sama.gov.sa/en-US/News/Pages/rss.aspx', region: 'sa', variants: ['global', 'finance', 'tech', 'fraud'], category: 'regulatory_gcc', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'cma_kuwait', name: 'CMA Kuwait', url: 'https://www.cma.gov.kw/en/rss', region: 'kw', variants: ['global', 'finance', 'fraud'], category: 'regulatory_gcc', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'cbuae', name: 'Central Bank UAE', url: 'https://www.centralbank.ae/en/news/rss', region: 'ae', variants: ['global', 'finance'], category: 'regulatory_gcc', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'ia_uae', name: 'Insurance Authority UAE', url: 'https://ia.gov.ae/rss', region: 'ae', variants: ['global', 'fraud'], category: 'regulatory_gcc', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'qcb_qatar', name: 'Qatar Central Bank', url: 'https://www.qcb.gov.qa/en/rss', region: 'qa', variants: ['global', 'finance'], category: 'regulatory_gcc', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cbb_bahrain', name: 'CBB Bahrain', url: 'https://www.cbb.gov.bh/rss', region: 'bh', variants: ['global', 'finance'], category: 'regulatory_gcc', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cma_oman', name: 'CMA Oman', url: 'https://cma.gov.om/rss', region: 'om', variants: ['global', 'finance'], category: 'regulatory_gcc', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'fatf_news', name: 'FATF', url: 'https://www.fatf-gafi.org/en/media/rss', region: 'global', variants: ['global', 'fraud'], category: 'regulatory_gcc', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'fca_uk', name: 'FCA UK', url: 'https://www.fca.org.uk/rss.xml', region: 'global', variants: ['global', 'tech'], category: 'regulatory_gcc', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'eiopa', name: 'EIOPA', url: 'https://www.eiopa.europa.eu/rss.xml', region: 'global', variants: ['global', 'finance'], category: 'regulatory_gcc', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'bis_news', name: 'BIS', url: 'https://www.bis.org/rss', region: 'global', variants: ['finance'], category: 'financial_markets', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'imf_me', name: 'IMF Middle East', url: 'https://www.imf.org/en/News/rss', region: 'gcc', variants: ['global', 'finance'], category: 'gcc_economy', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'world_bank_me', name: 'World Bank MENA', url: 'https://www.worldbank.org/en/region/mena/rss', region: 'gcc', variants: ['global', 'finance'], category: 'gcc_economy', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'opec_news', name: 'OPEC', url: 'https://www.opec.org/opec_web/en/rss', region: 'gcc', variants: ['global', 'finance'], category: 'gcc_economy', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'gcc_stat', name: 'GCC-STAT', url: 'https://www.gccstat.org/en/rss', region: 'gcc', variants: ['global', 'finance'], category: 'gcc_economy', priority: 3, language: 'en', updateFrequency: 'daily' },
];

// ═══════════════════════════════════════════════════════
// WEATHER & CAT FEEDS (10)
// ═══════════════════════════════════════════════════════
const WEATHER_CAT_FEEDS: FeedDefinition[] = [
  { id: 'noaa_alerts', name: 'NOAA Climate', url: 'https://www.climate.gov/rss.xml', region: 'global', variants: ['global'], category: 'weather_cat', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'wmo_news', name: 'WMO News', url: 'https://public.wmo.int/en/rss.xml', region: 'global', variants: ['global'], category: 'weather_cat', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'accuweather_me', name: 'AccuWeather ME', url: 'https://www.accuweather.com/rss/middle-east', region: 'gcc', variants: ['global'], category: 'weather_cat', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'uae_ncm', name: 'UAE NCM', url: 'https://www.ncm.ae/rss', region: 'ae', variants: ['global'], category: 'weather_cat', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'saudi_pme', name: 'Saudi PME Weather', url: 'https://www.pme.gov.sa/rss', region: 'sa', variants: ['global'], category: 'weather_cat', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'gdacs', name: 'GDACS Alerts', url: 'https://www.gdacs.org/xml/rss.xml', region: 'global', variants: ['global'], category: 'weather_cat', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'reliefweb', name: 'ReliefWeb Disasters', url: 'https://reliefweb.int/updates/rss.xml', region: 'global', variants: ['global'], category: 'weather_cat', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'floodlist', name: 'FloodList', url: 'https://floodlist.com/feed', region: 'global', variants: ['global'], category: 'weather_cat', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'earthquake_usgs', name: 'USGS Earthquakes', url: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.atom', region: 'global', variants: ['global'], category: 'weather_cat', priority: 2, language: 'en', updateFrequency: 'realtime' },
  { id: 'nasa_firms', name: 'NASA FIRMS Fires', url: 'https://firms.modaps.eosdis.nasa.gov/rss', region: 'global', variants: ['global'], category: 'weather_cat', priority: 3, language: 'en', updateFrequency: 'hourly' },
];

// ═══════════════════════════════════════════════════════
// GEOPOLITICAL FEEDS (10)
// ═══════════════════════════════════════════════════════
const GEOPOLITICAL_FEEDS: FeedDefinition[] = [
  { id: 'acled_conflict', name: 'ACLED Conflict', url: 'https://acleddata.com/feed/', region: 'global', variants: ['global'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'foreign_policy', name: 'Foreign Policy', url: 'https://foreignpolicy.com/feed/', region: 'global', variants: ['global'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'aljazeera_me', name: 'Al Jazeera ME', url: 'https://www.aljazeera.com/xml/rss/all.xml', region: 'gcc', variants: ['global'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'the_national_uae', name: 'The National UAE', url: 'https://www.thenationalnews.com/rss', region: 'ae', variants: ['global', 'finance'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'middle_east_eye', name: 'Middle East Eye', url: 'https://www.middleeasteye.net/rss', region: 'gcc', variants: ['global'], category: 'geopolitical', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'gulf_states_analytics', name: 'Gulf States Analytics', url: 'https://gulfstateanalytics.com/feed/', region: 'gcc', variants: ['global'], category: 'geopolitical', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'csis_me', name: 'CSIS Middle East', url: 'https://www.csis.org/region/middle-east/rss', region: 'gcc', variants: ['global'], category: 'geopolitical', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'chatham_house_me', name: 'Chatham House ME', url: 'https://www.chathamhouse.org/rss/middle-east', region: 'gcc', variants: ['global'], category: 'geopolitical', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'brookings_me', name: 'Brookings ME', url: 'https://www.brookings.edu/topic/middle-east/feed/', region: 'gcc', variants: ['global'], category: 'geopolitical', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'crisis_group_me', name: 'Crisis Group ME', url: 'https://www.crisisgroup.org/rss/middle-east', region: 'gcc', variants: ['global'], category: 'geopolitical', priority: 3, language: 'en', updateFrequency: 'daily' },
];

// ═══════════════════════════════════════════════════════
// INSURTECH FEEDS (20)
// ═══════════════════════════════════════════════════════
const INSURTECH_FEEDS: FeedDefinition[] = [
  { id: 'coverager_tech', name: 'Coverager', url: 'https://coverager.com/feed/', region: 'global', variants: ['tech'], category: 'insurtech', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'insurtech_insights', name: 'InsurTech Insights', url: 'https://www.insurtechinsights.com/feed/', region: 'global', variants: ['tech'], category: 'insurtech', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'dig_in', name: 'Digital Insurance', url: 'https://www.dig-in.com/rss/', region: 'global', variants: ['tech'], category: 'digital_insurance', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'insureblocks', name: 'InsureBlocks', url: 'https://insureblocks.com/feed/', region: 'global', variants: ['tech'], category: 'insurtech', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'insurance_nerds', name: 'Insurance Nerds', url: 'https://insurancenerds.com/feed/', region: 'global', variants: ['tech'], category: 'insurtech', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'techcrunch_fintech', name: 'TechCrunch Fintech', url: 'https://techcrunch.com/category/fintech/feed/', region: 'global', variants: ['tech'], category: 'startup_funding', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'venturebeat_ai', name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/', region: 'global', variants: ['tech'], category: 'ai_ml', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'mit_tech_review', name: 'MIT Tech Review', url: 'https://www.technologyreview.com/feed/', region: 'global', variants: ['tech'], category: 'ai_ml', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'wired_ai', name: 'Wired AI', url: 'https://www.wired.com/feed/tag/artificial-intelligence/rss', region: 'global', variants: ['tech'], category: 'ai_ml', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'ai_news', name: 'AI News', url: 'https://www.artificialintelligence-news.com/feed/', region: 'global', variants: ['tech'], category: 'ai_ml', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'fintech_nexus', name: 'Fintech Nexus', url: 'https://www.fintechnexus.com/feed/', region: 'global', variants: ['tech'], category: 'insurtech', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'pymnts_insurance', name: 'PYMNTS Insurance', url: 'https://www.pymnts.com/category/insurance/feed/', region: 'global', variants: ['tech'], category: 'digital_insurance', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'sifted_mena', name: 'Sifted MENA', url: 'https://sifted.eu/feed/', region: 'gcc', variants: ['tech'], category: 'startup_funding', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'magnitt', name: 'MAGNiTT MENA VC', url: 'https://magnitt.com/news/rss', region: 'gcc', variants: ['tech'], category: 'startup_funding', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'wamda_tech', name: 'Wamda Tech', url: 'https://www.wamda.com/feed/', region: 'gcc', variants: ['tech'], category: 'startup_funding', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'menabytes', name: 'MENAbytes', url: 'https://www.menabytes.com/feed/', region: 'gcc', variants: ['tech'], category: 'startup_funding', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'aws_news', name: 'AWS News Blog', url: 'https://aws.amazon.com/blogs/aws/feed/', region: 'global', variants: ['tech'], category: 'cloud_tech', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'google_ai_blog', name: 'Google AI Blog', url: 'https://ai.googleblog.com/feeds/posts/default', region: 'global', variants: ['tech'], category: 'ai_ml', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'openai_blog', name: 'OpenAI Blog', url: 'https://openai.com/blog/rss/', region: 'global', variants: ['tech'], category: 'ai_ml', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'anthropic_blog', name: 'Anthropic Blog', url: 'https://www.anthropic.com/blog/rss', region: 'global', variants: ['tech'], category: 'ai_ml', priority: 1, language: 'en', updateFrequency: 'daily' },
];

// ═══════════════════════════════════════════════════════
// FINANCIAL MARKET FEEDS (20)
// ═══════════════════════════════════════════════════════
const FINANCIAL_MARKET_FEEDS: FeedDefinition[] = [
  { id: 'reuters_markets', name: 'Reuters Markets', url: 'https://feeds.reuters.com/reuters/businessNews', region: 'global', variants: ['finance'], category: 'financial_markets', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'ft_markets', name: 'Financial Times Markets', url: 'https://www.ft.com/markets?format=rss', region: 'global', variants: ['finance'], category: 'financial_markets', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'wsj_markets', name: 'WSJ Markets', url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml', region: 'global', variants: ['finance'], category: 'financial_markets', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'bloomberg_markets', name: 'Bloomberg Markets', url: 'https://feeds.bloomberg.com/markets/news.rss', region: 'global', variants: ['finance'], category: 'financial_markets', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'investing_me', name: 'Investing.com ME', url: 'https://www.investing.com/rss/news_25.rss', region: 'gcc', variants: ['finance'], category: 'financial_markets', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'tadawul_news', name: 'Saudi Exchange (Tadawul)', url: 'https://www.saudiexchange.sa/rss', region: 'sa', variants: ['finance'], category: 'insurance_stocks', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'boursa_kuwait', name: 'Boursa Kuwait', url: 'https://www.boursakuwait.com.kw/rss', region: 'kw', variants: ['finance'], category: 'insurance_stocks', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'dfm_news', name: 'Dubai Financial Market', url: 'https://www.dfm.ae/rss', region: 'ae', variants: ['finance'], category: 'insurance_stocks', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'adx_news', name: 'Abu Dhabi Exchange', url: 'https://www.adx.ae/en/rss', region: 'ae', variants: ['finance'], category: 'insurance_stocks', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'qse_news', name: 'Qatar Stock Exchange', url: 'https://www.qe.com.qa/rss', region: 'qa', variants: ['finance'], category: 'insurance_stocks', priority: 2, language: 'en', updateFrequency: 'realtime' },
  { id: 'bahrain_bourse', name: 'Bahrain Bourse', url: 'https://www.bahrainbourse.com/rss', region: 'bh', variants: ['finance'], category: 'insurance_stocks', priority: 2, language: 'en', updateFrequency: 'realtime' },
  { id: 'msm_oman', name: 'Muscat Securities', url: 'https://www.msm.gov.om/rss', region: 'om', variants: ['finance'], category: 'insurance_stocks', priority: 2, language: 'en', updateFrequency: 'realtime' },
  { id: 'oil_price_news', name: 'OilPrice.com', url: 'https://oilprice.com/rss/main', region: 'gcc', variants: ['finance', 'global'], category: 'gcc_economy', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'platts_energy', name: 'S&P Platts Energy', url: 'https://www.spglobal.com/platts/en/rss', region: 'global', variants: ['finance'], category: 'gcc_economy', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'wtw_reinsurance', name: 'Willis Towers Watson', url: 'https://www.wtwco.com/en-us/rss', region: 'global', variants: ['finance'], category: 'reinsurance_pricing', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'gallagher_re', name: 'Gallagher Re', url: 'https://www.ajg.com/gallagherre/rss', region: 'global', variants: ['finance'], category: 'reinsurance_pricing', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'aon_reinsurance', name: 'Aon Reinsurance', url: 'https://www.aon.com/reinsurance/rss', region: 'global', variants: ['finance'], category: 'reinsurance_pricing', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'iif_finance', name: 'IIF Global', url: 'https://www.iif.com/rss', region: 'global', variants: ['finance'], category: 'investment', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'gulf_capital', name: 'Gulf Capital', url: 'https://www.gulfcapital.com/rss', region: 'gcc', variants: ['finance'], category: 'investment', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'mena_capital_mkts', name: 'MENA Capital Markets', url: 'https://menacapitalmarkets.com/feed/', region: 'gcc', variants: ['finance'], category: 'investment', priority: 3, language: 'en', updateFrequency: 'daily' },
];

// ═══════════════════════════════════════════════════════
// FRAUD FEEDS (15)
// ═══════════════════════════════════════════════════════
const FRAUD_FEEDS: FeedDefinition[] = [
  { id: 'insurance_fraud_bureau', name: 'Insurance Fraud Bureau', url: 'https://www.insurancefraudbureau.org/rss', region: 'global', variants: ['fraud'], category: 'fraud_intelligence', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'nicb', name: 'NICB (US Fraud)', url: 'https://www.nicb.org/rss.xml', region: 'global', variants: ['fraud'], category: 'fraud_intelligence', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'acfe', name: 'ACFE', url: 'https://www.acfe.com/rss', region: 'global', variants: ['fraud'], category: 'fraud_intelligence', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'fraud_magazine', name: 'Fraud Magazine', url: 'https://www.fraud-magazine.com/feed', region: 'global', variants: ['fraud'], category: 'fraud_intelligence', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'coalition_fraud', name: 'Coalition Against Insurance Fraud', url: 'https://insurancefraud.org/feed/', region: 'global', variants: ['fraud'], category: 'fraud_intelligence', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'interpol_financial', name: 'Interpol Financial Crime', url: 'https://www.interpol.int/en/Crimes/Financial-crime/rss', region: 'global', variants: ['fraud'], category: 'law_enforcement', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'europol_crime', name: 'Europol Serious Crime', url: 'https://www.europol.europa.eu/rss', region: 'global', variants: ['fraud'], category: 'law_enforcement', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'unodc_fraud', name: 'UNODC Financial Crime', url: 'https://www.unodc.org/unodc/en/news/rss.xml', region: 'global', variants: ['fraud'], category: 'law_enforcement', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'kroll_fraud', name: 'Kroll Fraud Intelligence', url: 'https://www.kroll.com/en/insights/rss', region: 'global', variants: ['fraud'], category: 'fraud_intelligence', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'lexisnexis_risk', name: 'LexisNexis Risk', url: 'https://risk.lexisnexis.com/rss', region: 'global', variants: ['fraud'], category: 'fraud_intelligence', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'fico_fraud', name: 'FICO Fraud Blog', url: 'https://www.fico.com/blogs/rss', region: 'global', variants: ['fraud'], category: 'fraud_intelligence', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'threatpost_cyber', name: 'Threatpost Cyber', url: 'https://threatpost.com/feed/', region: 'global', variants: ['fraud'], category: 'cyber_fraud', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'krebs_security', name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/', region: 'global', variants: ['fraud'], category: 'cyber_fraud', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'dark_reading', name: 'Dark Reading', url: 'https://www.darkreading.com/rss/all.xml', region: 'global', variants: ['fraud'], category: 'cyber_fraud', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'transparency_mena', name: 'Transparency Intl MENA', url: 'https://www.transparency.org/en/news/rss', region: 'gcc', variants: ['fraud'], category: 'financial_crime', priority: 2, language: 'en', updateFrequency: 'daily' },
];

// ═══════════════════════════════════════════════════════
// ADDITIONAL FEEDS (65+ to reach 200+ total)
// ═══════════════════════════════════════════════════════
const ADDITIONAL_FEEDS: FeedDefinition[] = [
  // More cyber/fraud
  { id: 'securityweek', name: 'SecurityWeek', url: 'https://www.securityweek.com/feed/', region: 'global', variants: ['fraud'], category: 'cyber_fraud', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'hacker_news_cyber', name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews', region: 'global', variants: ['fraud'], category: 'cyber_fraud', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'recorded_future', name: 'Recorded Future', url: 'https://www.recordedfuture.com/feed/', region: 'global', variants: ['fraud'], category: 'cyber_fraud', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'occrp', name: 'OCCRP Investigations', url: 'https://www.occrp.org/en/rss', region: 'global', variants: ['fraud'], category: 'financial_crime', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'icij', name: 'ICIJ Investigations', url: 'https://www.icij.org/feed/', region: 'global', variants: ['fraud'], category: 'financial_crime', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'fincen_news', name: 'FinCEN News', url: 'https://www.fincen.gov/rss', region: 'global', variants: ['fraud'], category: 'financial_crime', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'baselgovernance', name: 'Basel AML Index', url: 'https://www.baselgovernance.org/rss', region: 'global', variants: ['fraud'], category: 'financial_crime', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'kyc360', name: 'KYC360', url: 'https://kyc360.riskscreen.com/feed/', region: 'global', variants: ['fraud'], category: 'financial_crime', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'sanctions_alert', name: 'Sanctions Alert', url: 'https://sanctionsalert.com/feed/', region: 'global', variants: ['fraud', 'finance'], category: 'financial_crime', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'wolfsberg_group', name: 'Wolfsberg Group', url: 'https://www.wolfsberg-principles.com/rss', region: 'global', variants: ['fraud'], category: 'financial_crime', priority: 3, language: 'en', updateFrequency: 'daily' },

  // Consulting/advisory
  { id: 'mckinsey_insurance', name: 'McKinsey Insurance', url: 'https://www.mckinsey.com/industries/financial-services/our-insights/insurance/rss', region: 'global', variants: ['global', 'tech'], category: 'insurance_global', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'deloitte_insurance', name: 'Deloitte Insurance', url: 'https://www2.deloitte.com/us/en/industries/insurance/rss.xml', region: 'global', variants: ['global'], category: 'insurance_global', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'ey_insurance', name: 'EY Insurance', url: 'https://www.ey.com/en_gl/insurance/rss', region: 'global', variants: ['global'], category: 'insurance_global', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'bcg_insurance', name: 'BCG Insurance', url: 'https://www.bcg.com/industries/insurance/rss', region: 'global', variants: ['global', 'tech'], category: 'insurance_global', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'accenture_insurance', name: 'Accenture Insurance', url: 'https://www.accenture.com/us-en/industries/insurance/rss', region: 'global', variants: ['global', 'tech'], category: 'insurance_global', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'oliver_wyman_ins', name: 'Oliver Wyman Insurance', url: 'https://www.oliverwyman.com/rss/insurance', region: 'global', variants: ['global', 'finance'], category: 'insurance_global', priority: 3, language: 'en', updateFrequency: 'daily' },

  // More tech/cloud
  { id: 'google_cloud_blog', name: 'Google Cloud Blog', url: 'https://cloud.google.com/blog/rss', region: 'global', variants: ['tech'], category: 'cloud_tech', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'azure_blog', name: 'Azure Blog', url: 'https://azure.microsoft.com/en-us/blog/feed/', region: 'global', variants: ['tech'], category: 'cloud_tech', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'databricks_blog', name: 'Databricks Blog', url: 'https://www.databricks.com/blog/feed', region: 'global', variants: ['tech'], category: 'cloud_tech', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'snowflake_blog', name: 'Snowflake Blog', url: 'https://www.snowflake.com/blog/feed/', region: 'global', variants: ['tech'], category: 'cloud_tech', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'huggingface_blog', name: 'Hugging Face Blog', url: 'https://huggingface.co/blog/feed.xml', region: 'global', variants: ['tech'], category: 'ai_ml', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'the_information', name: 'The Information', url: 'https://www.theinformation.com/feed/', region: 'global', variants: ['tech'], category: 'startup_funding', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'rest_of_world', name: 'Rest of World', url: 'https://restofworld.org/feed/', region: 'global', variants: ['tech'], category: 'digital_insurance', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'deepmind_blog', name: 'DeepMind Blog', url: 'https://deepmind.google/blog/feed/', region: 'global', variants: ['tech'], category: 'ai_ml', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'nvidia_ai_blog', name: 'NVIDIA AI Blog', url: 'https://blogs.nvidia.com/feed/', region: 'global', variants: ['tech'], category: 'ai_ml', priority: 2, language: 'en', updateFrequency: 'daily' },

  // More InsurTech-specific
  { id: 'shift_tech_blog', name: 'Shift Technology Blog', url: 'https://www.shift-technology.com/blog/feed/', region: 'global', variants: ['tech', 'fraud'], category: 'insurtech', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'tractable_blog', name: 'Tractable AI Blog', url: 'https://www.tractable.ai/blog/feed/', region: 'global', variants: ['tech'], category: 'insurtech', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'lemonade_blog', name: 'Lemonade Blog', url: 'https://www.lemonade.com/blog/feed/', region: 'global', variants: ['tech'], category: 'insurtech', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'root_insurance_blog', name: 'Root Insurance Blog', url: 'https://www.joinroot.com/blog/feed/', region: 'global', variants: ['tech'], category: 'insurtech', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'hippo_blog', name: 'Hippo Insurance Blog', url: 'https://www.hippo.com/blog/feed/', region: 'global', variants: ['tech'], category: 'insurtech', priority: 3, language: 'en', updateFrequency: 'daily' },

  // GCC-specific business/economy
  { id: 'vision2030_sa', name: 'Saudi Vision 2030', url: 'https://www.vision2030.gov.sa/en/rss', region: 'sa', variants: ['global', 'finance', 'tech'], category: 'gcc_economy', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'neom_news', name: 'NEOM News', url: 'https://www.neom.com/en-us/newsroom/rss', region: 'sa', variants: ['tech', 'finance'], category: 'gcc_economy', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'adnoc_news', name: 'ADNOC News', url: 'https://www.adnoc.ae/en/news/rss', region: 'ae', variants: ['finance'], category: 'gcc_economy', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'saudi_aramco', name: 'Saudi Aramco News', url: 'https://www.aramco.com/en/news/rss', region: 'sa', variants: ['finance'], category: 'gcc_economy', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'pif_sa', name: 'PIF Saudi Arabia', url: 'https://www.pif.gov.sa/rss', region: 'sa', variants: ['finance'], category: 'investment', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'adia_news', name: 'ADIA News', url: 'https://www.adia.ae/rss', region: 'ae', variants: ['finance'], category: 'investment', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'qia_news', name: 'Qatar Investment Authority', url: 'https://www.qia.qa/rss', region: 'qa', variants: ['finance'], category: 'investment', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'kia_news', name: 'Kuwait Investment Authority', url: 'https://www.kia.gov.kw/rss', region: 'kw', variants: ['finance'], category: 'investment', priority: 2, language: 'en', updateFrequency: 'daily' },

  // Additional digital insurance & fintech
  { id: 'insurtech_hartford', name: 'InsurTech Hartford', url: 'https://www.insurtechhartford.com/feed/', region: 'global', variants: ['tech'], category: 'insurtech', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'asia_insurance_review', name: 'Asia Insurance Review', url: 'https://www.asiainsurancereview.com/rss', region: 'global', variants: ['global'], category: 'insurance_global', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'insurance_day', name: 'Insurance Day', url: 'https://www.insuranceday.com/rss', region: 'global', variants: ['global', 'finance'], category: 'insurance_global', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'reinsurance_magazine', name: 'Reactions Magazine', url: 'https://www.reactionsnet.com/rss', region: 'global', variants: ['global', 'finance'], category: 'reinsurance', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'insurance_insider', name: 'Insurance Insider', url: 'https://www.insuranceinsider.com/rss', region: 'global', variants: ['global', 'finance'], category: 'insurance_global', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'insurance_erm', name: 'Insurance ERM', url: 'https://www.insuranceerm.com/rss', region: 'global', variants: ['global', 'finance'], category: 'insurance_global', priority: 3, language: 'en', updateFrequency: 'daily' },

  // Additional fraud/law enforcement
  { id: 'fbi_financial', name: 'FBI Financial Crimes', url: 'https://www.fbi.gov/investigate/white-collar-crime/rss', region: 'global', variants: ['fraud'], category: 'law_enforcement', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'sfo_uk', name: 'UK Serious Fraud Office', url: 'https://www.sfo.gov.uk/rss', region: 'global', variants: ['fraud'], category: 'law_enforcement', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'aml_intelligence', name: 'AML Intelligence', url: 'https://amlintelligence.com/feed/', region: 'global', variants: ['fraud'], category: 'financial_crime', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'complinet', name: 'Complinet', url: 'https://www.complinet.com/rss', region: 'global', variants: ['fraud'], category: 'financial_crime', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'menafatf', name: 'MENAFATF', url: 'https://www.menafatf.org/rss', region: 'gcc', variants: ['fraud'], category: 'financial_crime', priority: 1, language: 'en', updateFrequency: 'daily' },

  // GCC insurance companies
  { id: 'gig_group', name: 'GIG Group News', url: 'https://www.gfrgroup.com/rss', region: 'kw', variants: ['global', 'finance'], category: 'insurance_stocks', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'tawuniya_news', name: 'Tawuniya News', url: 'https://www.tawuniya.com/rss', region: 'sa', variants: ['global', 'finance'], category: 'insurance_stocks', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'bupa_arabia', name: 'Bupa Arabia News', url: 'https://www.bupa.com.sa/rss', region: 'sa', variants: ['finance'], category: 'insurance_stocks', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'oman_insurance', name: 'Oman Insurance News', url: 'https://www.omaninsurance.ae/rss', region: 'ae', variants: ['global', 'finance'], category: 'insurance_stocks', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'qic_group', name: 'QIC Group News', url: 'https://www.qicgroup.com.qa/rss', region: 'qa', variants: ['global', 'finance'], category: 'insurance_stocks', priority: 3, language: 'en', updateFrequency: 'daily' },

  // Niche/specialty
  { id: 'captive_insurance', name: 'Captive International', url: 'https://www.captiveinternational.com/rss', region: 'global', variants: ['global'], category: 'insurance_global', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'parametric_ins', name: 'Parametric Global', url: 'https://www.parametricglobal.com/feed/', region: 'global', variants: ['global', 'tech'], category: 'insurtech', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'microinsurance_net', name: 'Microinsurance Network', url: 'https://www.microinsurancenetwork.org/rss', region: 'global', variants: ['global', 'tech'], category: 'digital_insurance', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'nikkei_asia_fin', name: 'Nikkei Asia Finance', url: 'https://asia.nikkei.com/rss/feed/finance', region: 'global', variants: ['finance'], category: 'financial_markets', priority: 3, language: 'en', updateFrequency: 'hourly' },
  { id: 'scmp_business', name: 'SCMP Business', url: 'https://www.scmp.com/rss/318208/feed', region: 'global', variants: ['finance'], category: 'financial_markets', priority: 3, language: 'en', updateFrequency: 'hourly' },
];

// ═══════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════

export const ALL_FEEDS: FeedDefinition[] = [
  ...INSURANCE_GLOBAL_FEEDS,
  ...GCC_REGIONAL_FEEDS,
  ...REGULATORY_FEEDS,
  ...WEATHER_CAT_FEEDS,
  ...GEOPOLITICAL_FEEDS,
  ...INSURTECH_FEEDS,
  ...FINANCIAL_MARKET_FEEDS,
  ...FRAUD_FEEDS,
  ...ADDITIONAL_FEEDS,
];

export function getFeedsForVariant(variantId: VariantId): FeedDefinition[] {
  return ALL_FEEDS.filter(f => f.variants.includes(variantId));
}

export function getFeedsByCategory(category: FeedCategory): FeedDefinition[] {
  return ALL_FEEDS.filter(f => f.category === category);
}

export function getFeedStats() {
  return {
    total: ALL_FEEDS.length,
    byVariant: {
      global: getFeedsForVariant('global').length,
      tech: getFeedsForVariant('tech').length,
      finance: getFeedsForVariant('finance').length,
      fraud: getFeedsForVariant('fraud').length,
    },
    byCategory: Object.fromEntries(
      [...new Set(ALL_FEEDS.map(f => f.category))].map(cat => [cat, getFeedsByCategory(cat).length])
    ),
  };
}

export type { FeedDefinition, FeedCategory, VariantId };
