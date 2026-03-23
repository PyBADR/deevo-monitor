/**
 * DEEVO Intelligence Monitor — PDPL Compliance Banner
 * Contract C11 / Component 1
 * Layer: Governance (L7) + UI (L6)
 *
 * Saudi Arabia Personal Data Protection Law (PDPL) consent banner.
 * Displays on first visit, persists consent to localStorage.
 * Includes IFRS 17 data retention notice and SHA-256 audit disclosure.
 */
import { useState, useEffect, memo } from 'react';
import { useTranslation } from 'react-i18next';

const CONSENT_KEY = 'deevo_pdpl_consent';
const CONSENT_VERSION = '1.0.0';

interface ConsentRecord {
  version: string;
  accepted: boolean;
  timestamp: string;
  sha256: string;
}

/** Simple SHA-256 hash for audit trail */
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function getStoredConsent(): ConsentRecord | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const record = JSON.parse(raw) as ConsentRecord;
    if (record.version !== CONSENT_VERSION) return null;
    return record;
  } catch {
    return null;
  }
}

const s = {
  overlay: {
    position: 'fixed' as const, bottom: 0, left: 0, right: 0, zIndex: 9999,
    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.6) 100%)',
    padding: '0',
  },
  banner: {
    margin: '0 auto', maxWidth: '900px', padding: '20px 24px',
    background: '#111827', border: '1px solid #f5a623', borderBottom: 'none',
    borderRadius: '12px 12px 0 0',
    fontFamily: "'IBM Plex Mono', monospace",
  },
  title: { fontSize: '14px', fontWeight: 700, color: '#f5a623', marginBottom: '10px', textTransform: 'uppercase' as const, letterSpacing: '1px' },
  text: { fontSize: '12px', color: '#e2e8f0', lineHeight: 1.6, marginBottom: '8px' },
  subtext: { fontSize: '10px', color: '#64748b', lineHeight: 1.5, marginBottom: '12px' },
  actions: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' as const },
  acceptBtn: {
    padding: '8px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer',
    background: '#f5a623', color: '#0a0f1a', fontWeight: 700, fontSize: '12px',
    fontFamily: "'IBM Plex Mono', monospace",
  },
  declineBtn: {
    padding: '8px 20px', borderRadius: '6px', border: '1px solid #475569', cursor: 'pointer',
    background: 'transparent', color: '#94a3b8', fontWeight: 600, fontSize: '12px',
    fontFamily: "'IBM Plex Mono', monospace",
  },
  learnMore: { fontSize: '11px', color: '#f5a623', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', fontFamily: "'IBM Plex Mono', monospace" },
  badge: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '9px', color: '#22c55e', background: '#22c55e22', padding: '2px 8px', borderRadius: '4px', marginLeft: '8px' },
};

function PDPLBannerInner() {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getStoredConsent();
    if (!consent || !consent.accepted) {
      setVisible(true);
    }
  }, []);

  const handleAccept = async () => {
    const timestamp = new Date().toISOString();
    const hash = await sha256(`pdpl_consent_${CONSENT_VERSION}_${timestamp}`);
    const record: ConsentRecord = {
      version: CONSENT_VERSION,
      accepted: true,
      timestamp,
      sha256: hash,
    };
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
    } catch {
      // localStorage unavailable — consent still valid for session
    }
    setVisible(false);
    console.log(`[PDPL] Consent recorded — SHA-256: ${hash.substring(0, 16)}...`);
  };

  const handleDecline = () => {
    setVisible(false);
    console.log('[PDPL] Consent declined — limited functionality mode');
  };

  if (!visible) return null;

  return (
    <div style={s.overlay}>
      <div style={s.banner}>
        <div style={s.title}>
          {t('pdpl.title', 'Data Privacy Notice')}
          <span style={s.badge}>PDPL</span>
        </div>
        <div style={s.text}>{t('pdpl.banner', 'This platform processes data in compliance with Saudi Arabia Personal Data Protection Law (PDPL) and GCC data sovereignty requirements.')}</div>
        <div style={s.text}>{t('pdpl.consent', 'By using this platform, you consent to the processing of operational data for insurance intelligence purposes.')}</div>
        <div style={s.subtext}>
          {t('pdpl.cookieNotice', 'Essential cookies only — no tracking.')} · {t('pdpl.dataRetention', 'Data retention: 7 years per IFRS 17.')} · {t('pdpl.auditTrail', 'SHA-256 audit trail on all actions.')}
        </div>
        <div style={s.actions}>
          <button style={s.acceptBtn} onClick={handleAccept}>{t('pdpl.accept', 'Accept & Continue')}</button>
          <button style={s.declineBtn} onClick={handleDecline}>{t('pdpl.decline', 'Decline')}</button>
          <button style={s.learnMore}>{t('pdpl.learnMore', 'Learn More')}</button>
        </div>
      </div>
    </div>
  );
}

export default memo(PDPLBannerInner);
