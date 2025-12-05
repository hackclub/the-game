import { useEffect, useRef, useState, RefObject, useCallback } from 'react';

const ANIMATION_DURATION = '1.8s';
const ANIMATION_EASING = 'cubic-bezier(0.0, 0.0, 0.4, 1)';

type Point = { x: number; y: number };

type Props = {
  stepCircleRefs: Array<RefObject<HTMLDivElement | null>>;
};

export default function DynamicBackgroundLines({ stepCircleRefs }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const [layout, setLayout] = useState<{
    width: number;
    height: number;
    centers: Point[];
  } | null>(null);
  const [animated, setAnimated] = useState(false);

  const setPathRef = useCallback((index: number) => (el: SVGPathElement | null) => {
    pathRefs.current[index] = el;
  }, []);

  useEffect(() => {
    if (!layout) return;
    
    const paths = pathRefs.current.filter(Boolean) as SVGPathElement[];
    if (paths.length === 0) return;

    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    requestAnimationFrame(() => {
      setAnimated(true);
    });
  }, [layout]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateLayout = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();

      const width = containerRect.width;
      const height = containerRef.current.scrollHeight || containerRect.height;

      const centers: Point[] = stepCircleRefs
        .map((ref) => {
          const el = ref.current;
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return {
            x: r.left + r.width / 2 - containerRect.left,
            y: r.top + r.height / 2 - containerRect.top,
          };
        })
        .filter((p): p is Point => p !== null);

      setLayout({ width, height, centers });
    };

    updateLayout();
    window.addEventListener('resize', updateLayout);
    document.fonts?.ready.then(updateLayout);

    return () => {
      window.removeEventListener('resize', updateLayout);
    };
  }, [stepCircleRefs]);

  if (!layout || layout.centers.length < 3) {
    return (
      <div
        ref={containerRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />
    );
  }

  const { width, height, centers } = layout;
  const [c1, c2, c3] = centers;

  const strokeWidth = 40;
  const rOuter = 84;
  const rInner = rOuter - strokeWidth;

  const greenPath = buildGreenPath(c1, c2, c3, width, height, rOuter, strokeWidth);
  const yellowPath = buildYellowPath(c1, c2, c3, width, height, rInner, strokeWidth);
  const redPath = buildRedPath(width, height, rOuter, strokeWidth);
  const bluePath = buildBluePath(width, height, rInner, strokeWidth);

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    >
      <svg
        className="absolute top-0 left-0"
        width={width}
        height={height}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Inner lines first (underneath) */}
        <path
          ref={setPathRef(0)}
          d={bluePath}
          stroke="#1C6DAF"
          strokeWidth={strokeWidth}
          fill="none"
          style={{
            strokeDashoffset: animated ? 0 : undefined,
            transition: animated ? `stroke-dashoffset ${ANIMATION_DURATION} ${ANIMATION_EASING}` : undefined,
          }}
        />
        <path
          ref={setPathRef(1)}
          d={yellowPath}
          stroke="#ECA82D"
          strokeWidth={strokeWidth}
          fill="none"
          style={{
            strokeDashoffset: animated ? 0 : undefined,
            transition: animated ? `stroke-dashoffset ${ANIMATION_DURATION} ${ANIMATION_EASING}` : undefined,
          }}
        />
        {/* Outer lines on top */}
        <path
          ref={setPathRef(2)}
          d={redPath}
          stroke="#C93919"
          strokeWidth={strokeWidth}
          fill="none"
          style={{
            strokeDashoffset: animated ? 0 : undefined,
            transition: animated ? `stroke-dashoffset ${ANIMATION_DURATION} ${ANIMATION_EASING}` : undefined,
          }}
        />
        <path
          ref={setPathRef(3)}
          d={greenPath}
          stroke="#48A71B"
          strokeWidth={strokeWidth}
          fill="none"
          style={{
            strokeDashoffset: animated ? 0 : undefined,
            transition: animated ? `stroke-dashoffset ${ANIMATION_DURATION} ${ANIMATION_EASING}` : undefined,
          }}
        />
      </svg>
    </div>
  );
}

function buildGreenPath(c1: Point, c2: Point, c3: Point, width: number, height: number, r: number, strokeWidth: number): string {
  const lineX = c1.x - strokeWidth / 2;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const cornerY = viewportHeight * 0.65;
  const startX = width * 0.55;
  const bottomTurnY = c3.y;
  const rFirstTurn = r - strokeWidth * 2;

  return [
    `M ${startX} 0`,
    `L ${startX} ${cornerY - rFirstTurn}`,
    `A ${rFirstTurn} ${rFirstTurn} 0 0 1 ${startX - rFirstTurn} ${cornerY}`,
    `L ${lineX + r} ${cornerY}`,
    `A ${r} ${r} 0 0 0 ${lineX} ${cornerY + r}`,
    `L ${lineX} ${bottomTurnY}`,
  ].join(' ');
}

function buildYellowPath(c1: Point, c2: Point, c3: Point, width: number, height: number, r: number, strokeWidth: number): string {
  const lineX = c1.x + strokeWidth / 2;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const cornerY = viewportHeight * 0.65 + strokeWidth;
  const startX = width * 0.55 + strokeWidth;
  const bottomY = c3.y;

  return [
    `M ${width} 35`,
    `L ${startX + r} 35`,
    `A ${r} ${r} 0 0 0 ${startX} ${35 + r}`,
    `L ${startX} ${cornerY - r}`,
    `A ${r} ${r} 0 0 1 ${startX - r} ${cornerY}`,
    `L ${lineX + r} ${cornerY}`,
    `A ${r} ${r} 0 0 0 ${lineX} ${cornerY + r}`,
    `L ${lineX} ${bottomY}`,
  ].join(' ');
}

function buildRedPath(width: number, height: number, r: number, strokeWidth: number): string {
  const startY = 141;
  const firstTurnX = width * 0.48;
  const secondTurnY = startY + 380;
  const thirdTurnX = width * 0.92;
  const fourthTurnY = startY + 900;
  const fifthTurnX = width * 0.78;
  const sixthTurnY = startY + 1470;

  return [
    `M 0 ${startY}`,
    `L ${firstTurnX - r} ${startY}`,
    `A ${r} ${r} 0 0 1 ${firstTurnX} ${startY + r}`,
    `L ${firstTurnX} ${secondTurnY - r}`,
    `A ${r} ${r} 0 0 0 ${firstTurnX + r} ${secondTurnY}`,
    `L ${thirdTurnX - r} ${secondTurnY}`,
    `A ${r} ${r} 0 0 1 ${thirdTurnX} ${secondTurnY + r}`,
    `L ${thirdTurnX} ${fourthTurnY - r}`,
    `A ${r} ${r} 0 0 1 ${thirdTurnX - r} ${fourthTurnY}`,
    `L ${fifthTurnX + r} ${fourthTurnY}`,
    `A ${r} ${r} 0 0 0 ${fifthTurnX} ${fourthTurnY + r}`,
    `L ${fifthTurnX} ${sixthTurnY - r}`,
    `A ${r} ${r} 0 0 0 ${fifthTurnX + r} ${sixthTurnY}`,
    `L ${width + 100} ${sixthTurnY}`,
  ].join(' ');
}

function buildBluePath(width: number, height: number, r: number, strokeWidth: number): string {
  const startY = 141 + strokeWidth;
  const firstTurnX = width * 0.48 - strokeWidth;
  const secondTurnY = 141 + 380 + strokeWidth;
  const thirdTurnX = width * 0.92 - strokeWidth;
  const fourthTurnY = 141 + 900 + strokeWidth;
  const fifthTurnX = width * 0.78 + strokeWidth;
  const sixthTurnY = 141 + 1470 + strokeWidth;

  return [
    `M 0 ${startY}`,
    `L ${firstTurnX - r} ${startY}`,
    `A ${r} ${r} 0 0 1 ${firstTurnX} ${startY + r}`,
    `L ${firstTurnX} ${secondTurnY - r}`,
    `A ${r} ${r} 0 0 0 ${firstTurnX + r} ${secondTurnY}`,
    `L ${thirdTurnX - r} ${secondTurnY}`,
    `A ${r} ${r} 0 0 1 ${thirdTurnX} ${secondTurnY + r}`,
    `L ${thirdTurnX} ${fourthTurnY - r}`,
    `A ${r} ${r} 0 0 1 ${thirdTurnX - r} ${fourthTurnY}`,
    `L ${fifthTurnX + r} ${fourthTurnY}`,
    `A ${r} ${r} 0 0 0 ${fifthTurnX} ${fourthTurnY + r}`,
    `L ${fifthTurnX} ${sixthTurnY - r}`,
    `A ${r} ${r} 0 0 0 ${fifthTurnX + r} ${sixthTurnY}`,
    `L ${width + 100} ${sixthTurnY}`,
  ].join(' ');
}
