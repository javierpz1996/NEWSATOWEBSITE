/** Organic two-tone blotch tile for the portal menu rule (viewBox height = 16). */

const TILE_WIDTH = 136;
const TILE_HEIGHT = 16;

const BLOTCH_LIGHT = "#c6c6c6";
const BLOTCH_DARK = "var(--home-hero-stage)";

type Blotch = readonly [cx: number, cy: number, rx: number, ry: number];

const LIGHT_BLOTS: Blotch[] = [
  [10, 4.5, 11, 5.5],
  [34, 12, 12, 5],
  [58, 3.5, 10, 4.5],
  [82, 11.5, 11, 5],
  [106, 5, 10, 4.5],
  [128, 13, 9, 4],
];

const DARK_BLOTS: Blotch[] = [
  [22, 9, 7, 5],
  [46, 4, 6, 4],
  [70, 12, 7, 4.5],
  [94, 6, 6.5, 4],
  [118, 10, 7, 4.5],
  [8, 14, 5.5, 3.5],
];

type PortalMenuRuleBlotchPatternProps = {
  patternId: string;
  edgeFilterId: string;
};

function BlotchEllipses({
  blobs,
  fill,
  filterId,
  xOffsets,
}: {
  blobs: Blotch[];
  fill: string;
  filterId: string;
  xOffsets: number[];
}) {
  return (
    <>
      {xOffsets.flatMap((offsetX) =>
        blobs.map(([cx, cy, rx, ry], index) => (
          <ellipse
            key={`${offsetX}-${index}`}
            cx={cx + offsetX}
            cy={cy}
            rx={rx}
            ry={ry}
            fill={fill}
            filter={`url(#${filterId})`}
          />
        )),
      )}
    </>
  );
}

export function PortalMenuRuleBlotchPattern({
  patternId,
  edgeFilterId,
}: PortalMenuRuleBlotchPatternProps) {
  const seamOffsets = [-TILE_WIDTH, 0, TILE_WIDTH];

  return (
    <>
      <filter
        id={edgeFilterId}
        x="-15%"
        y="-120%"
        width="130%"
        height="340%"
        colorInterpolationFilters="sRGB"
      >
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.92 0.22"
          numOctaves={2}
          seed={14}
          result="noise"
        />
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale={2.4}
          xChannelSelector="R"
          yChannelSelector="G"
        />
      </filter>
      <pattern
        id={patternId}
        patternUnits="userSpaceOnUse"
        patternContentUnits="userSpaceOnUse"
        width={TILE_WIDTH}
        height={TILE_HEIGHT}
      >
        <rect width={TILE_WIDTH} height={TILE_HEIGHT} fill="#fff" />
        <BlotchEllipses
          blobs={LIGHT_BLOTS}
          fill={BLOTCH_LIGHT}
          filterId={edgeFilterId}
          xOffsets={seamOffsets}
        />
        <BlotchEllipses
          blobs={DARK_BLOTS}
          fill={BLOTCH_DARK}
          filterId={edgeFilterId}
          xOffsets={seamOffsets}
        />
      </pattern>
    </>
  );
}

export const PORTAL_MENU_RULE_BLOTCH_TILE_WIDTH = TILE_WIDTH;
