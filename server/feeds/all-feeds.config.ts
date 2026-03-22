/**
 * DEEVO Monitor v4.0 — Complete RSS Feed Library
 * 435+ feeds organized by variant and category across 15 categories.
 */

type VariantId = 'global' | 'tech' | 'finance' | 'fraud' | 'commodity' | 'happy';

type FeedCategory =
  | 'insurance_global' | 'reinsurance' | 'gcc_regional' | 'regulatory_gcc'
  | 'weather_cat' | 'geopolitical'
  | 'insurtech' | 'ai_ml' | 'digital_insurance' | 'startup_funding' | 'cloud_tech'
  | 'financial_markets' | 'insurance_stocks' | 'gcc_economy' | 'reinsurance_pricing' | 'investment'
  | 'fraud_intelligence' | 'law_enforcement' | 'cyber_fraud' | 'financial_crime'
  | 'energy_commodity' | 'maritime_shipping' | 'climate_environment'
  | 'health_wellness' | 'esg_sustainability' | 'crypto_defi'
  | 'military_defense' | 'cyber_security' | 'space_satellite';

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

// ═══════════════════════════════════════════════════════
// v4.0 EXPANDED FEEDS — ENERGY & COMMODITY (30)
// ═══════════════════════════════════════════════════════

const ENERGY_COMMODITY_FEEDS: FeedDefinition[] = [
  { id: 'ec-1', name: 'OPEC News', url: 'https://www.opec.org/opec_web/en/press_room/28.htm', region: 'global', variants: ['global', 'commodity', 'finance'], category: 'energy_commodity', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-2', name: 'S&P Global Platts', url: 'https://www.spglobal.com/commodityinsights/en/rss-feed', region: 'global', variants: ['commodity', 'finance'], category: 'energy_commodity', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'ec-3', name: 'IEA News', url: 'https://www.iea.org/news/rss', region: 'global', variants: ['global', 'commodity'], category: 'energy_commodity', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-4', name: 'EIA Today in Energy', url: 'https://www.eia.gov/todayinenergy/rss.xml', region: 'us', variants: ['commodity', 'finance'], category: 'energy_commodity', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-5', name: 'ADNOC News', url: 'https://www.adnoc.ae/en/news-and-media/rss', region: 'ae', variants: ['global', 'commodity'], category: 'energy_commodity', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-6', name: 'Saudi Aramco', url: 'https://www.aramco.com/en/news-media/rss', region: 'sa', variants: ['global', 'commodity'], category: 'energy_commodity', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-7', name: 'LME News', url: 'https://www.lme.com/News/rss', region: 'global', variants: ['commodity'], category: 'energy_commodity', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'ec-8', name: 'CME Group Energy', url: 'https://www.cmegroup.com/rss/energy.rss', region: 'us', variants: ['commodity', 'finance'], category: 'energy_commodity', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'ec-9', name: 'ICE Futures', url: 'https://www.theice.com/rss/news', region: 'global', variants: ['commodity'], category: 'energy_commodity', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'ec-10', name: 'QatarEnergy News', url: 'https://www.qatarenergy.qa/en/rss', region: 'qa', variants: ['global', 'commodity'], category: 'energy_commodity', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-11', name: 'KPC Kuwait', url: 'https://www.kpc.com.kw/rss', region: 'kw', variants: ['global', 'commodity'], category: 'energy_commodity', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-12', name: 'PDO Oman', url: 'https://www.pdo.co.om/en/news/rss', region: 'om', variants: ['global', 'commodity'], category: 'energy_commodity', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-13', name: 'Rigzone', url: 'https://www.rigzone.com/news/rss/rigzone_latest.aspx', region: 'global', variants: ['commodity'], category: 'energy_commodity', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'ec-14', name: 'OilPrice.com', url: 'https://oilprice.com/rss/main', region: 'global', variants: ['commodity', 'finance'], category: 'energy_commodity', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'ec-15', name: 'World Oil', url: 'https://www.worldoil.com/rss', region: 'global', variants: ['commodity'], category: 'energy_commodity', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-16', name: 'Upstream Online', url: 'https://www.upstreamonline.com/rss', region: 'global', variants: ['commodity'], category: 'energy_commodity', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-17', name: 'BAPCO Bahrain', url: 'https://www.bapco.net/en/news/rss', region: 'bh', variants: ['global', 'commodity'], category: 'energy_commodity', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-18', name: 'Middle East Economic Survey', url: 'https://www.mees.com/rss', region: 'mena', variants: ['commodity', 'finance'], category: 'energy_commodity', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-19', name: 'IRENA News', url: 'https://www.irena.org/rss', region: 'global', variants: ['commodity', 'happy'], category: 'energy_commodity', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-20', name: 'Natural Gas World', url: 'https://www.naturalgasworld.com/rss', region: 'global', variants: ['commodity'], category: 'energy_commodity', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-21', name: 'Bloomberg Commodities', url: 'https://www.bloomberg.com/feed/commodity', region: 'global', variants: ['commodity', 'finance'], category: 'energy_commodity', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'ec-22', name: 'Reuters Commodities', url: 'https://feeds.reuters.com/reuters/commoditiesNews', region: 'global', variants: ['commodity', 'finance'], category: 'energy_commodity', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'ec-23', name: 'Argus Media', url: 'https://www.argusmedia.com/rss', region: 'global', variants: ['commodity'], category: 'energy_commodity', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'ec-24', name: 'Mining.com', url: 'https://www.mining.com/feed/', region: 'global', variants: ['commodity'], category: 'energy_commodity', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-25', name: 'AgriCensus', url: 'https://www.agricensus.com/rss', region: 'global', variants: ['commodity'], category: 'energy_commodity', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-26', name: 'Fastmarkets', url: 'https://www.fastmarkets.com/rss', region: 'global', variants: ['commodity'], category: 'energy_commodity', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-27', name: 'JODI Oil Data', url: 'https://www.jodidata.org/rss', region: 'global', variants: ['commodity'], category: 'energy_commodity', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-28', name: 'Gulf Intelligence', url: 'https://www.thegulfintelligence.com/rss', region: 'gcc', variants: ['global', 'commodity'], category: 'energy_commodity', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'ec-29', name: 'Tanker Trackers', url: 'https://tankertrackers.com/rss', region: 'global', variants: ['commodity'], category: 'energy_commodity', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'ec-30', name: 'Energy Voice', url: 'https://www.energyvoice.com/rss', region: 'global', variants: ['commodity'], category: 'energy_commodity', priority: 3, language: 'en', updateFrequency: 'daily' },
];

// ═══════════════════════════════════════════════════════
// v4.0 EXPANDED FEEDS — MARITIME & SHIPPING (20)
// ═══════════════════════════════════════════════════════

const MARITIME_FEEDS: FeedDefinition[] = [
  { id: 'mar-1', name: 'Lloyd\'s List', url: 'https://www.lloydslist.com/ll/rss', region: 'global', variants: ['global', 'commodity'], category: 'maritime_shipping', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'mar-2', name: 'TradeWinds', url: 'https://www.tradewindsnews.com/rss', region: 'global', variants: ['commodity'], category: 'maritime_shipping', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'mar-3', name: 'Splash 247', url: 'https://splash247.com/rss', region: 'global', variants: ['commodity'], category: 'maritime_shipping', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-4', name: 'Hellenic Shipping', url: 'https://www.hellenicshippingnews.com/rss', region: 'global', variants: ['commodity'], category: 'maritime_shipping', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-5', name: 'Freightos Index', url: 'https://fbx.freightos.com/rss', region: 'global', variants: ['commodity', 'finance'], category: 'maritime_shipping', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'mar-6', name: 'DP World News', url: 'https://www.dpworld.com/rss', region: 'ae', variants: ['global', 'commodity'], category: 'maritime_shipping', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-7', name: 'IMB Piracy Center', url: 'https://www.icc-ccs.org/piracy-reporting-centre/rss', region: 'global', variants: ['global', 'commodity'], category: 'maritime_shipping', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-8', name: 'Suez Canal Authority', url: 'https://www.suezcanal.gov.eg/rss', region: 'mena', variants: ['global', 'commodity'], category: 'maritime_shipping', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-9', name: 'BIMCO Shipping', url: 'https://www.bimco.org/rss', region: 'global', variants: ['commodity'], category: 'maritime_shipping', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-10', name: 'Maritime Executive', url: 'https://www.maritime-executive.com/rss', region: 'global', variants: ['commodity'], category: 'maritime_shipping', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-11', name: 'gCaptain', url: 'https://gcaptain.com/feed/', region: 'global', variants: ['commodity'], category: 'maritime_shipping', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-12', name: 'Seatrade Maritime', url: 'https://www.seatrade-maritime.com/rss', region: 'global', variants: ['commodity'], category: 'maritime_shipping', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-13', name: 'Drewry Shipping', url: 'https://www.drewry.co.uk/rss', region: 'global', variants: ['commodity', 'finance'], category: 'maritime_shipping', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-14', name: 'UKMTO', url: 'https://www.ukmto.org/rss', region: 'mena', variants: ['global', 'commodity'], category: 'maritime_shipping', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'mar-15', name: 'Xeneta Rates', url: 'https://www.xeneta.com/rss', region: 'global', variants: ['commodity'], category: 'maritime_shipping', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-16', name: 'Port Technology', url: 'https://www.porttechnology.org/rss', region: 'global', variants: ['commodity', 'tech'], category: 'maritime_shipping', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-17', name: 'Jebel Ali Port', url: 'https://www.dpworld.ae/rss', region: 'ae', variants: ['global', 'commodity'], category: 'maritime_shipping', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-18', name: 'King Abdullah Port', url: 'https://www.kingabdullahport.com.sa/rss', region: 'sa', variants: ['global', 'commodity'], category: 'maritime_shipping', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-19', name: 'Hamad Port Qatar', url: 'https://www.mwani.com.qa/en/rss', region: 'qa', variants: ['global', 'commodity'], category: 'maritime_shipping', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'mar-20', name: 'The Loadstar', url: 'https://theloadstar.com/feed/', region: 'global', variants: ['commodity'], category: 'maritime_shipping', priority: 3, language: 'en', updateFrequency: 'daily' },
];

// ═══════════════════════════════════════════════════════
// v4.0 EXPANDED FEEDS — CYBER SECURITY (25)
// ═══════════════════════════════════════════════════════

const CYBER_SECURITY_FEEDS: FeedDefinition[] = [
  { id: 'cyb-1', name: 'The Hacker News', url: 'https://feeds.feedburner.com/TheHackersNews', region: 'global', variants: ['global', 'tech', 'fraud'], category: 'cyber_security', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'cyb-2', name: 'Krebs on Security', url: 'https://krebsonsecurity.com/feed/', region: 'global', variants: ['global', 'tech', 'fraud'], category: 'cyber_security', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-3', name: 'Bleeping Computer', url: 'https://www.bleepingcomputer.com/feed/', region: 'global', variants: ['tech', 'fraud'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'cyb-4', name: 'Dark Reading', url: 'https://www.darkreading.com/rss_simple.asp', region: 'global', variants: ['tech', 'fraud'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'cyb-5', name: 'SecurityWeek', url: 'https://www.securityweek.com/feed', region: 'global', variants: ['tech', 'fraud'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'cyb-6', name: 'CISA Alerts', url: 'https://www.cisa.gov/uscert/ncas/alerts.xml', region: 'us', variants: ['global', 'tech'], category: 'cyber_security', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'cyb-7', name: 'NCSC UK', url: 'https://www.ncsc.gov.uk/api/1/services/v1/report-rss-feed.xml', region: 'uk', variants: ['global', 'tech'], category: 'cyber_security', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-8', name: 'UAE CERT', url: 'https://www.tra.gov.ae/aecert/en/rss', region: 'ae', variants: ['global', 'tech'], category: 'cyber_security', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-9', name: 'Saudi NCA', url: 'https://nca.gov.sa/en/rss', region: 'sa', variants: ['global', 'tech'], category: 'cyber_security', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-10', name: 'Mandiant Threat Intel', url: 'https://www.mandiant.com/resources/rss', region: 'global', variants: ['tech', 'fraud'], category: 'cyber_security', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-11', name: 'CrowdStrike Blog', url: 'https://www.crowdstrike.com/blog/feed/', region: 'global', variants: ['tech'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-12', name: 'Recorded Future', url: 'https://www.recordedfuture.com/feed', region: 'global', variants: ['tech', 'fraud'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-13', name: 'Threat Post', url: 'https://threatpost.com/feed/', region: 'global', variants: ['tech'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'cyb-14', name: 'Kaspersky Securelist', url: 'https://securelist.com/feed/', region: 'global', variants: ['tech'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-15', name: 'Sophos Naked Security', url: 'https://nakedsecurity.sophos.com/feed/', region: 'global', variants: ['tech'], category: 'cyber_security', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-16', name: 'SANS ISC', url: 'https://isc.sans.edu/rssfeed.xml', region: 'global', variants: ['tech'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'cyb-17', name: 'Microsoft Security', url: 'https://www.microsoft.com/security/blog/feed/', region: 'global', variants: ['tech'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-18', name: 'Google Project Zero', url: 'https://googleprojectzero.blogspot.com/feeds/posts/default', region: 'global', variants: ['tech'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-19', name: 'Palo Alto Unit 42', url: 'https://unit42.paloaltonetworks.com/feed/', region: 'global', variants: ['tech', 'fraud'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-20', name: 'Cisco Talos', url: 'https://blog.talosintelligence.com/feeds/posts/default', region: 'global', variants: ['tech'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-21', name: 'Check Point Research', url: 'https://research.checkpoint.com/feed/', region: 'global', variants: ['tech'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-22', name: 'SentinelOne Blog', url: 'https://www.sentinelone.com/blog/feed/', region: 'global', variants: ['tech'], category: 'cyber_security', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-23', name: 'Qatar NCSA', url: 'https://www.ncsa.gov.qa/en/rss', region: 'qa', variants: ['global', 'tech'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-24', name: 'Bahrain NCEA', url: 'https://www.ncea.gov.bh/en/rss', region: 'bh', variants: ['global', 'tech'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cyb-25', name: 'Kuwait CITRA', url: 'https://www.citra.gov.kw/en/rss', region: 'kw', variants: ['global', 'tech'], category: 'cyber_security', priority: 2, language: 'en', updateFrequency: 'daily' },
];

// ═══════════════════════════════════════════════════════
// v4.0 EXPANDED FEEDS — MILITARY & DEFENSE (20)
// ═══════════════════════════════════════════════════════

const MILITARY_DEFENSE_FEEDS: FeedDefinition[] = [
  { id: 'mil-1', name: 'Jane\'s Defence', url: 'https://www.janes.com/feeds/news', region: 'global', variants: ['global'], category: 'military_defense', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'mil-2', name: 'Defense News', url: 'https://www.defensenews.com/arc/outboundfeeds/rss/?outputType=xml', region: 'global', variants: ['global'], category: 'military_defense', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'mil-3', name: 'The War Zone', url: 'https://www.thedrive.com/the-war-zone/feed', region: 'global', variants: ['global'], category: 'military_defense', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'mil-4', name: 'Breaking Defense', url: 'https://breakingdefense.com/feed/', region: 'global', variants: ['global'], category: 'military_defense', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'mil-5', name: 'IISS Analysis', url: 'https://www.iiss.org/rss', region: 'global', variants: ['global'], category: 'military_defense', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'mil-6', name: 'SIPRI News', url: 'https://www.sipri.org/rss.xml', region: 'global', variants: ['global'], category: 'military_defense', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'mil-7', name: 'CENTCOM News', url: 'https://www.centcom.mil/rss', region: 'mena', variants: ['global'], category: 'military_defense', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'mil-8', name: 'Naval News', url: 'https://www.navalnews.com/feed/', region: 'global', variants: ['global'], category: 'military_defense', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'mil-9', name: 'Army Recognition', url: 'https://www.armyrecognition.com/rss', region: 'global', variants: ['global'], category: 'military_defense', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'mil-10', name: 'C4ISRNET', url: 'https://www.c4isrnet.com/rss', region: 'global', variants: ['global', 'tech'], category: 'military_defense', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'mil-11', name: 'Middle East Eye Defence', url: 'https://www.middleeasteye.net/rss', region: 'mena', variants: ['global'], category: 'military_defense', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'mil-12', name: 'Al Monitor Military', url: 'https://www.al-monitor.com/rss', region: 'mena', variants: ['global'], category: 'military_defense', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'mil-13', name: 'GCC Military Forces', url: 'https://www.gcc-sg.org/en-us/rss', region: 'gcc', variants: ['global'], category: 'military_defense', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'mil-14', name: 'UAE Armed Forces', url: 'https://www.uaeaf.gov.ae/rss', region: 'ae', variants: ['global'], category: 'military_defense', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'mil-15', name: 'RUSI Commentary', url: 'https://rusi.org/rss', region: 'global', variants: ['global'], category: 'military_defense', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'mil-16', name: 'RAND Corporation', url: 'https://www.rand.org/news/rss.xml', region: 'global', variants: ['global'], category: 'military_defense', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'mil-17', name: 'Bellingcat', url: 'https://www.bellingcat.com/feed/', region: 'global', variants: ['global'], category: 'military_defense', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'mil-18', name: 'ISW Iraq/Syria', url: 'https://www.understandingwar.org/rss', region: 'mena', variants: ['global'], category: 'military_defense', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'mil-19', name: 'Long War Journal', url: 'https://www.longwarjournal.org/feed', region: 'global', variants: ['global'], category: 'military_defense', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'mil-20', name: 'Arms Control Assoc', url: 'https://www.armscontrol.org/rss', region: 'global', variants: ['global'], category: 'military_defense', priority: 2, language: 'en', updateFrequency: 'daily' },
];

// ═══════════════════════════════════════════════════════
// v4.0 EXPANDED FEEDS — CLIMATE & ESG (20)
// ═══════════════════════════════════════════════════════

const CLIMATE_ESG_FEEDS: FeedDefinition[] = [
  { id: 'cli-1', name: 'Climate Home News', url: 'https://www.climatechangenews.com/feed/', region: 'global', variants: ['global', 'happy'], category: 'climate_environment', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-2', name: 'Carbon Brief', url: 'https://www.carbonbrief.org/feed/', region: 'global', variants: ['global', 'happy'], category: 'climate_environment', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-3', name: 'NOAA Climate', url: 'https://www.climate.gov/rss.xml', region: 'global', variants: ['global', 'commodity'], category: 'climate_environment', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-4', name: 'WMO News', url: 'https://public.wmo.int/en/rss.xml', region: 'global', variants: ['global'], category: 'climate_environment', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-5', name: 'Munich Re NatCat', url: 'https://www.munichre.com/rss', region: 'global', variants: ['global', 'finance'], category: 'climate_environment', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-6', name: 'Swiss Re sigma', url: 'https://www.swissre.com/rss', region: 'global', variants: ['global', 'finance'], category: 'climate_environment', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-7', name: 'ESG Today', url: 'https://www.esgtoday.com/feed/', region: 'global', variants: ['global', 'happy', 'finance'], category: 'esg_sustainability', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-8', name: 'Responsible Investor', url: 'https://www.responsible-investor.com/feed/', region: 'global', variants: ['finance', 'happy'], category: 'esg_sustainability', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-9', name: 'PRI News', url: 'https://www.unpri.org/rss', region: 'global', variants: ['finance', 'happy'], category: 'esg_sustainability', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-10', name: 'MSCI ESG', url: 'https://www.msci.com/rss', region: 'global', variants: ['finance'], category: 'esg_sustainability', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-11', name: 'CDP News', url: 'https://www.cdp.net/en/rss', region: 'global', variants: ['happy'], category: 'esg_sustainability', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-12', name: 'MASDAR News', url: 'https://masdar.ae/en/news/rss', region: 'ae', variants: ['global', 'happy'], category: 'climate_environment', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-13', name: 'NEOM Updates', url: 'https://www.neom.com/en-us/rss', region: 'sa', variants: ['global', 'happy', 'tech'], category: 'esg_sustainability', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-14', name: 'GCC Environment', url: 'https://www.gcc-environment.org/rss', region: 'gcc', variants: ['global', 'happy'], category: 'climate_environment', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-15', name: 'UNEP News', url: 'https://www.unep.org/rss', region: 'global', variants: ['global', 'happy'], category: 'climate_environment', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-16', name: 'Bloomberg Green', url: 'https://www.bloomberg.com/feed/green', region: 'global', variants: ['finance', 'happy'], category: 'climate_environment', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'cli-17', name: 'Saudi Green Initiative', url: 'https://www.greeninitiatives.gov.sa/rss', region: 'sa', variants: ['global', 'happy'], category: 'esg_sustainability', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-18', name: 'ACWA Power', url: 'https://www.acwapower.com/rss', region: 'sa', variants: ['global', 'commodity', 'happy'], category: 'esg_sustainability', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-19', name: 'Gulf News Sustainability', url: 'https://gulfnews.com/uae/environment/rss', region: 'ae', variants: ['global', 'happy'], category: 'climate_environment', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'cli-20', name: 'WHO EMRO', url: 'https://www.emro.who.int/rss', region: 'mena', variants: ['global', 'happy'], category: 'health_wellness', priority: 2, language: 'en', updateFrequency: 'daily' },
];

// ═══════════════════════════════════════════════════════
// v4.0 EXPANDED FEEDS — CRYPTO & DeFi (20)
// ═══════════════════════════════════════════════════════

const CRYPTO_DEFI_FEEDS: FeedDefinition[] = [
  { id: 'cryp-1', name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', region: 'global', variants: ['finance', 'tech'], category: 'crypto_defi', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'cryp-2', name: 'CoinTelegraph', url: 'https://cointelegraph.com/rss', region: 'global', variants: ['finance', 'tech'], category: 'crypto_defi', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'cryp-3', name: 'The Block', url: 'https://www.theblock.co/rss.xml', region: 'global', variants: ['finance', 'tech'], category: 'crypto_defi', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'cryp-4', name: 'Decrypt', url: 'https://decrypt.co/feed', region: 'global', variants: ['tech'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'cryp-5', name: 'DeFi Llama', url: 'https://defillama.com/rss', region: 'global', variants: ['finance', 'tech'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'cryp-6', name: 'Messari', url: 'https://messari.io/rss', region: 'global', variants: ['finance'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cryp-7', name: 'Chainalysis Blog', url: 'https://blog.chainalysis.com/feed/', region: 'global', variants: ['fraud', 'finance'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cryp-8', name: 'Elliptic Blog', url: 'https://www.elliptic.co/blog/rss', region: 'global', variants: ['fraud'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cryp-9', name: 'UAE VARA', url: 'https://www.vara.ae/en/rss', region: 'ae', variants: ['global', 'finance'], category: 'crypto_defi', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'cryp-10', name: 'Bahrain CBB Crypto', url: 'https://www.cbb.gov.bh/rss', region: 'bh', variants: ['global', 'finance'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cryp-11', name: 'Binance Blog', url: 'https://www.binance.com/en/blog/rss', region: 'global', variants: ['finance', 'tech'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cryp-12', name: 'Ethereum Foundation', url: 'https://blog.ethereum.org/feed.xml', region: 'global', variants: ['tech'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cryp-13', name: 'Bitcoin Magazine', url: 'https://bitcoinmagazine.com/feed', region: 'global', variants: ['finance'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cryp-14', name: 'Rekt News', url: 'https://rekt.news/feed/', region: 'global', variants: ['fraud', 'tech'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cryp-15', name: 'Web3 is Going Great', url: 'https://web3isgoinggreat.com/feed.xml', region: 'global', variants: ['fraud'], category: 'crypto_defi', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'cryp-16', name: 'QFC Digital Assets', url: 'https://www.qfc.qa/en/rss', region: 'qa', variants: ['global', 'finance'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cryp-17', name: 'DIFC Innovation', url: 'https://www.difc.ae/rss', region: 'ae', variants: ['global', 'tech', 'finance'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cryp-18', name: 'ADGM RegLab', url: 'https://www.adgm.com/rss', region: 'ae', variants: ['global', 'finance'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cryp-19', name: 'Saudi CMA Digital', url: 'https://cma.org.sa/en/rss', region: 'sa', variants: ['global', 'finance'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'cryp-20', name: 'CBK Kuwait Digital', url: 'https://www.cbk.gov.kw/en/rss', region: 'kw', variants: ['global', 'finance'], category: 'crypto_defi', priority: 2, language: 'en', updateFrequency: 'daily' },
];

// ═══════════════════════════════════════════════════════
// v4.0 EXPANDED FEEDS — GLOBAL NEWS (30)
// ═══════════════════════════════════════════════════════

const GLOBAL_NEWS_FEEDS: FeedDefinition[] = [
  { id: 'gn-1', name: 'Reuters World', url: 'https://feeds.reuters.com/reuters/worldNews', region: 'global', variants: ['global', 'finance', 'commodity'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'gn-2', name: 'AP News', url: 'https://rsshub.app/apnews/topics/apf-topnews', region: 'global', variants: ['global'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'gn-3', name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', region: 'global', variants: ['global'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'gn-4', name: 'CNN World', url: 'http://rss.cnn.com/rss/edition_world.rss', region: 'global', variants: ['global'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'gn-5', name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', region: 'mena', variants: ['global'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'gn-6', name: 'Sky News', url: 'https://feeds.skynews.com/feeds/rss/world.xml', region: 'global', variants: ['global'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'gn-7', name: 'France 24', url: 'https://www.france24.com/en/rss', region: 'global', variants: ['global'], category: 'geopolitical', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-8', name: 'DW News', url: 'https://rss.dw.com/rdf/rss-en-all', region: 'global', variants: ['global'], category: 'geopolitical', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-9', name: 'Euronews', url: 'https://www.euronews.com/rss', region: 'europe', variants: ['global'], category: 'geopolitical', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-10', name: 'Al Arabiya EN', url: 'https://english.alarabiya.net/tools/rss', region: 'mena', variants: ['global'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'gn-11', name: 'Bloomberg', url: 'https://www.bloomberg.com/feed/podcast/decrypted.xml', region: 'global', variants: ['global', 'finance'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'gn-12', name: 'Financial Times', url: 'https://www.ft.com/rss/home/international', region: 'global', variants: ['global', 'finance'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-13', name: 'CNBC World', url: 'https://www.cnbc.com/id/100727362/device/rss/rss.html', region: 'global', variants: ['global', 'finance'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'gn-14', name: 'NHK World', url: 'https://www3.nhk.or.jp/nhkworld/en/news/rss', region: 'asia', variants: ['global'], category: 'geopolitical', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-15', name: 'ABC Australia', url: 'https://www.abc.net.au/news/feed/51120/rss.xml', region: 'asia', variants: ['global'], category: 'geopolitical', priority: 3, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-16', name: 'RT News', url: 'https://www.rt.com/rss/', region: 'global', variants: ['global'], category: 'geopolitical', priority: 3, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-17', name: 'TASS', url: 'https://tass.com/rss/v2.xml', region: 'global', variants: ['global'], category: 'geopolitical', priority: 3, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-18', name: 'Xinhua', url: 'https://www.xinhuanet.com/english/rss/worldrss.xml', region: 'asia', variants: ['global'], category: 'geopolitical', priority: 3, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-19', name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeeds/296589292.cms', region: 'asia', variants: ['global'], category: 'geopolitical', priority: 3, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-20', name: 'Dawn Pakistan', url: 'https://www.dawn.com/feed', region: 'asia', variants: ['global'], category: 'geopolitical', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'gn-21', name: 'Haaretz', url: 'https://www.haaretz.com/cmlink/1.4498498', region: 'mena', variants: ['global'], category: 'geopolitical', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-22', name: 'Tehran Times', url: 'https://www.tehrantimes.com/rss', region: 'mena', variants: ['global'], category: 'geopolitical', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-23', name: 'TRT World', url: 'https://www.trtworld.com/rss', region: 'mena', variants: ['global'], category: 'geopolitical', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-24', name: 'Gulf News', url: 'https://gulfnews.com/rss', region: 'ae', variants: ['global'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'gn-25', name: 'Arab News', url: 'https://www.arabnews.com/rss.xml', region: 'sa', variants: ['global'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'realtime' },
  { id: 'gn-26', name: 'Khaleej Times', url: 'https://www.khaleejtimes.com/rss', region: 'ae', variants: ['global'], category: 'geopolitical', priority: 2, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-27', name: 'The National UAE', url: 'https://www.thenationalnews.com/rss', region: 'ae', variants: ['global'], category: 'geopolitical', priority: 1, language: 'en', updateFrequency: 'hourly' },
  { id: 'gn-28', name: 'Kuwait Times', url: 'https://www.kuwaittimes.com/feed/', region: 'kw', variants: ['global'], category: 'geopolitical', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'gn-29', name: 'Qatar Tribune', url: 'https://www.qatar-tribune.com/rss', region: 'qa', variants: ['global'], category: 'geopolitical', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'gn-30', name: 'Oman Observer', url: 'https://www.omanobserver.om/rss', region: 'om', variants: ['global'], category: 'geopolitical', priority: 2, language: 'en', updateFrequency: 'daily' },
];

// ═══════════════════════════════════════════════════════
// v4.0 EXPANDED FEEDS — SPACE & SATELLITE (10)
// ═══════════════════════════════════════════════════════

const SPACE_SATELLITE_FEEDS: FeedDefinition[] = [
  { id: 'spa-1', name: 'SpaceNews', url: 'https://spacenews.com/feed/', region: 'global', variants: ['tech'], category: 'space_satellite', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'spa-2', name: 'NASA News', url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss', region: 'global', variants: ['tech'], category: 'space_satellite', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'spa-3', name: 'ESA News', url: 'https://www.esa.int/rssfeed/Our_Activities/Space_News', region: 'europe', variants: ['tech'], category: 'space_satellite', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'spa-4', name: 'UAE Space Agency', url: 'https://space.gov.ae/en/rss', region: 'ae', variants: ['global', 'tech'], category: 'space_satellite', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'spa-5', name: 'Saudi Space Agency', url: 'https://www.ssa.gov.sa/en/rss', region: 'sa', variants: ['global', 'tech'], category: 'space_satellite', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'spa-6', name: 'Maxar Technologies', url: 'https://www.maxar.com/rss', region: 'global', variants: ['tech'], category: 'space_satellite', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'spa-7', name: 'Planet Labs', url: 'https://www.planet.com/rss', region: 'global', variants: ['tech'], category: 'space_satellite', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'spa-8', name: 'Ars Technica Space', url: 'https://arstechnica.com/tag/space/feed/', region: 'global', variants: ['tech'], category: 'space_satellite', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'spa-9', name: 'SpaceX Updates', url: 'https://www.spacex.com/rss', region: 'global', variants: ['tech'], category: 'space_satellite', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'spa-10', name: 'N2YO Satellite Tracker', url: 'https://www.n2yo.com/rss', region: 'global', variants: ['tech'], category: 'space_satellite', priority: 3, language: 'en', updateFrequency: 'hourly' },
];

// ═══════════════════════════════════════════════════════
// v4.0 EXPANDED FEEDS — HEALTH & WELLNESS (15)
// ═══════════════════════════════════════════════════════

const HEALTH_WELLNESS_FEEDS: FeedDefinition[] = [
  { id: 'hw-1', name: 'WHO News', url: 'https://www.who.int/rss-feeds/news-english.xml', region: 'global', variants: ['global', 'happy'], category: 'health_wellness', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'hw-2', name: 'The Lancet', url: 'https://www.thelancet.com/rssfeed/lancet_current.xml', region: 'global', variants: ['happy'], category: 'health_wellness', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'hw-3', name: 'BMJ', url: 'https://www.bmj.com/rss/recent.xml', region: 'global', variants: ['happy'], category: 'health_wellness', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'hw-4', name: 'CCHI Saudi Health', url: 'https://www.cchi.gov.sa/en/rss', region: 'sa', variants: ['global', 'happy'], category: 'health_wellness', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'hw-5', name: 'DHA Dubai Health', url: 'https://www.dha.gov.ae/en/rss', region: 'ae', variants: ['global', 'happy'], category: 'health_wellness', priority: 1, language: 'en', updateFrequency: 'daily' },
  { id: 'hw-6', name: 'HAAD Abu Dhabi', url: 'https://www.haad.ae/rss', region: 'ae', variants: ['global', 'happy'], category: 'health_wellness', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'hw-7', name: 'Kuwait MOH', url: 'https://www.moh.gov.kw/en/rss', region: 'kw', variants: ['global', 'happy'], category: 'health_wellness', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'hw-8', name: 'Qatar MOPH', url: 'https://www.moph.gov.qa/english/rss', region: 'qa', variants: ['global', 'happy'], category: 'health_wellness', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'hw-9', name: 'Bahrain MOH', url: 'https://www.moh.gov.bh/en/rss', region: 'bh', variants: ['global', 'happy'], category: 'health_wellness', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'hw-10', name: 'Oman MOH', url: 'https://www.moh.gov.om/en/rss', region: 'om', variants: ['global', 'happy'], category: 'health_wellness', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'hw-11', name: 'Global Health Security', url: 'https://www.ghsindex.org/rss', region: 'global', variants: ['global', 'happy'], category: 'health_wellness', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'hw-12', name: 'Nature Medicine', url: 'https://www.nature.com/nm.rss', region: 'global', variants: ['happy'], category: 'health_wellness', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'hw-13', name: 'STAT News', url: 'https://www.statnews.com/feed/', region: 'global', variants: ['happy'], category: 'health_wellness', priority: 2, language: 'en', updateFrequency: 'daily' },
  { id: 'hw-14', name: 'Telemedicine Magazine', url: 'https://www.telemedmag.com/feed/', region: 'global', variants: ['happy', 'tech'], category: 'health_wellness', priority: 3, language: 'en', updateFrequency: 'daily' },
  { id: 'hw-15', name: 'McKinsey Healthcare', url: 'https://www.mckinsey.com/industries/healthcare/rss', region: 'global', variants: ['happy', 'finance'], category: 'health_wellness', priority: 2, language: 'en', updateFrequency: 'daily' },
];

// ═══════════════════════════════════════════════════════
// MASTER FEED REGISTRY (435+)
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
  // v4.0 expanded feeds
  ...ENERGY_COMMODITY_FEEDS,
  ...MARITIME_FEEDS,
  ...CYBER_SECURITY_FEEDS,
  ...MILITARY_DEFENSE_FEEDS,
  ...CLIMATE_ESG_FEEDS,
  ...CRYPTO_DEFI_FEEDS,
  ...GLOBAL_NEWS_FEEDS,
  ...SPACE_SATELLITE_FEEDS,
  ...HEALTH_WELLNESS_FEEDS,
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
      commodity: getFeedsForVariant('commodity').length,
      happy: getFeedsForVariant('happy').length,
    },
    byCategory: Object.fromEntries(
      [...new Set(ALL_FEEDS.map(f => f.category))].map(cat => [cat, getFeedsByCategory(cat).length])
    ),
  };
}

export type { FeedDefinition, FeedCategory, VariantId };
