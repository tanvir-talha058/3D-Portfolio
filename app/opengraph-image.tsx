import { ImageResponse } from 'next/og';

/**
 * The card that unfurls when the site is pasted into Slack, LinkedIn or a
 * DM. Built from the page's own palette rather than a screenshot, so it
 * stays correct when the scenes change.
 *
 * No custom font is loaded on purpose: next/og bundles a default face, and
 * fetching the display face at build time would make the image a network
 * dependency for something that must never fail to render.
 */
export const runtime = 'edge';
export const alt = 'Tanvir Ahmed — AI/ML Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 88px',
          background: '#05060d',
          position: 'relative',
        }}
      >
        {/* the dichroic field, as flat radials */}
        <div
          style={{
            position: 'absolute',
            top: -200,
            left: -160,
            width: 780,
            height: 780,
            borderRadius: 999,
            background: 'radial-gradient(circle, rgba(120,86,255,0.42), rgba(120,86,255,0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -280,
            right: -140,
            width: 820,
            height: 820,
            borderRadius: 999,
            background: 'radial-gradient(circle, rgba(56,214,214,0.34), rgba(56,214,214,0) 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 180,
            right: 220,
            width: 520,
            height: 520,
            borderRadius: 999,
            background: 'radial-gradient(circle, rgba(224,138,210,0.22), rgba(224,138,210,0) 70%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 30 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 999,
              background: '#9df3e2',
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: 6,
              color: '#9aa4bd',
            }}
          >
            AI / ML ENGINEER · DHAKA
          </div>
        </div>

        <div
          style={{
            fontSize: 82,
            lineHeight: 1.06,
            color: '#edeff5',
            letterSpacing: -2,
            maxWidth: 900,
          }}
        >
          I build systems that turn data into decisions.
        </div>

        <div
          style={{
            marginTop: 34,
            fontSize: 28,
            color: '#9aa4bd',
            maxWidth: 820,
            lineHeight: 1.4,
          }}
        >
          Retrieval, risk, vision and low-resource language — shipped as production software.
        </div>

        <div
          style={{
            marginTop: 46,
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 26,
            color: '#6fd6ee',
          }}
        >
          Tanvir Ahmed
        </div>
      </div>
    ),
    size,
  );
}
