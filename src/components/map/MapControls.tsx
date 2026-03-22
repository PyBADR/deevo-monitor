/**
 * MapControls — Right-side map overlay controls (worldmonitor parity).
 * Contains: 2D/3D toggle, BETA badge, zoom +/-, notification bell.
 *
 * Architecture Layer: UI (L6)
 */
import { useMapStore } from '@/stores/mapStore';
import { useVariant } from '@/variants';
import { clsx } from 'clsx';

export function MapControls() {
  const { variant } = useVariant();
  const mode = useMapStore((s) => s.mode);
  const setMode = useMapStore((s) => s.setMode);

  return (
    <div className="absolute top-3 right-3 z-20 flex flex-col items-end gap-2">
      {/* 2D / 3D toggle */}
      <div
        className="flex rounded-lg overflow-hidden border shadow-lg"
        style={{ borderColor: variant.colors.border, backgroundColor: `${variant.colors.bg}E0` }}
      >
        <button
          onClick={() => setMode('2d')}
          className={clsx(
            'text-[11px] font-mono font-bold px-3 py-1.5 transition-colors',
            mode === '2d' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          )}
          style={mode === '2d' ? { backgroundColor: variant.colors.primary, color: '#fff' } : undefined}
        >
          2D
        </button>
        <button
          onClick={() => setMode('3d')}
          className={clsx(
            'text-[11px] font-mono font-bold px-3 py-1.5 transition-colors',
            mode === '3d' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
          )}
          style={mode === '3d' ? { backgroundColor: variant.colors.primary, color: '#fff' } : undefined}
        >
          3D
        </button>
      </div>

      {/* BETA badge */}
      <span
        className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border shadow-lg"
        style={{
          backgroundColor: `${variant.colors.primary}20`,
          borderColor: `${variant.colors.primary}40`,
          color: variant.colors.primary,
        }}
      >
        BETA
      </span>

      {/* Zoom controls */}
      <div
        className="flex flex-col rounded-lg overflow-hidden border shadow-lg"
        style={{ borderColor: variant.colors.border, backgroundColor: `${variant.colors.bg}E0` }}
      >
        <button
          className="text-sm px-2.5 py-1.5 hover:bg-white/10 transition-colors"
          style={{ color: variant.colors.textMuted }}
          title="Zoom in"
        >
          +
        </button>
        <div className="h-px" style={{ backgroundColor: variant.colors.border }} />
        <button
          className="text-sm px-2.5 py-1.5 hover:bg-white/10 transition-colors"
          style={{ color: variant.colors.textMuted }}
          title="Zoom out"
        >
          −
        </button>
      </div>

      {/* Notification bell */}
      <button
        className="w-8 h-8 flex items-center justify-center rounded-lg border shadow-lg hover:bg-white/10 transition-colors"
        style={{
          borderColor: variant.colors.border,
          backgroundColor: `${variant.colors.bg}E0`,
          color: variant.colors.textMuted,
        }}
        title="Notifications"
      >
        🔔
      </button>
    </div>
  );
}
