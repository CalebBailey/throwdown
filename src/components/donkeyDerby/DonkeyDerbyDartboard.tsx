import React, { useState } from 'react';
import styled from 'styled-components';
import { Player } from '../../context/GameContext';

const SEGMENT_ORDER = [20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5];

interface DonkeyDerbyDartboardProps {
  players: Player[];
  currentPlayer: Player;
  onHitSegment: (segment: number, multiplier: 'single' | 'double' | 'triple') => void;
}

const DartboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const BoardSvg = styled.svg`
  max-width: 500px;
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
`;

const SegmentText = styled.text`
  font-size: 16px;
  font-weight: bold;
  text-anchor: middle;
  dominant-baseline: middle;
  fill: #FFF;
  user-select: none;
`;

const Legend = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
`;

const LegendItem = styled.div<{ color: string; $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 4px;
  background: ${p => p.$active ? 'rgba(233,69,96,0.2)' : 'rgba(255,255,255,0.05)'};
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid ${p => p.$active ? p.theme.colors.highlight : 'transparent'};
`;

const ColorDot = styled.span<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: ${p => p.color};
`;

const MultiplierSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 14px;
`;

const MultBtn = styled.button<{ $active: boolean }>`
  background: ${p => p.$active ? p.theme.colors.highlight : 'rgba(30,30,30,0.7)'};
  color: ${p => p.theme.colors.text};
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: ${p => p.$active ? 'bold' : 400};
  &:hover { background: ${p => !p.$active && 'rgba(60,60,60,0.7)'}; }
`;

const DonkeyDerbyDartboard: React.FC<DonkeyDerbyDartboardProps> = ({ players, currentPlayer, onHitSegment }) => {
  const [mult, setMult] = useState<'single' | 'double' | 'triple'>('single');
  const boardRadius = 220;
  const numberRadius = boardRadius + 26;
  const outerDoubleRingInnerRadius = boardRadius - 8;
  const mainSegmentOuterRadius = outerDoubleRingInnerRadius;
  const innerBullRadius = 32;
  const bullseyeRadius = 15;

  const handleClick = (seg: number) => onHitSegment(seg, mult);
  const segmentBase = '#263d5a';
  const bullOuter = '#19304e';
  const bullInner = '#0c1e36';

  const segmentOwnerMap: Record<number, Player | undefined> = {};
  players.forEach(p => { if (p.segment) segmentOwnerMap[p.segment] = p; });

  return (
    <DartboardContainer>
      <BoardSvg viewBox="0 0 550 550">
        <circle cx="275" cy="275" r={boardRadius + 10} fill="#121212" />
        {SEGMENT_ORDER.map((segmentNumber, index) => {
          const segmentAngle = 18;
          const startAngle = 270 - 9 + (index * segmentAngle);
            const endAngle = startAngle + segmentAngle;
          const startRad = (startAngle % 360) * Math.PI / 180;
          const endRad = (endAngle % 360) * Math.PI / 180;
          const owner = segmentOwnerMap[segmentNumber];
          const isCurrentPlayers = owner && owner.id === currentPlayer.id;
          const textRad = ((startAngle + endAngle) / 2) * Math.PI / 180;
          const textX = 275 + numberRadius * Math.cos(textRad);
          const textY = 275 + numberRadius * Math.sin(textRad);

          const createArcPath = (outerR: number, innerR: number) => {
            const largeArcFlag = Math.abs(endAngle - startAngle) > 180 ? '1' : '0';
            const outerStartX = 275 + outerR * Math.cos(startRad);
            const outerStartY = 275 + outerR * Math.sin(startRad);
            const outerEndX = 275 + outerR * Math.cos(endRad);
            const outerEndY = 275 + outerR * Math.sin(endRad);
            const innerStartX = 275 + innerR * Math.cos(startRad);
            const innerStartY = 275 + innerR * Math.sin(startRad);
            const innerEndX = 275 + innerR * Math.cos(endRad);
            const innerEndY = 275 + innerR * Math.sin(endRad);
            return `M ${outerStartX} ${outerStartY} A ${outerR} ${outerR} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY} L ${innerEndX} ${innerEndY} A ${innerR} ${innerR} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY} Z`;
          };

          const fill = owner ? owner.color : segmentBase;
          const stroke = isCurrentPlayers ? '#E94560' : '#222';
          const strokeWidth = isCurrentPlayers ? 2 : 0.5;

          return (
            <g key={segmentNumber} onClick={() => handleClick(segmentNumber)} style={{ cursor: 'pointer' }}>
              <path d={createArcPath(mainSegmentOuterRadius, innerBullRadius)} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
              <SegmentText x={textX} y={textY} style={{ fill: isCurrentPlayers ? '#E94560' : '#FFF' }}>{segmentNumber}</SegmentText>
            </g>
          );
        })}
        <circle cx="275" cy="275" r={innerBullRadius} fill={bullOuter} />
        <circle cx="275" cy="275" r={bullseyeRadius} fill={bullInner} />
      </BoardSvg>
      <Legend>
        {players.map(p => (
          <LegendItem key={p.id} color={p.color} $active={p.id === currentPlayer.id}>
            <ColorDot color={p.color} /> {p.name}: {p.segment}
          </LegendItem>
        ))}
      </Legend>
      <MultiplierSelector>
        {(['single','double','triple'] as const).map(m => (
          <MultBtn key={m} $active={mult===m} onClick={() => setMult(m)}>
            {m.charAt(0).toUpperCase()+m.slice(1)} {m==='single'?'(1)':m==='double'?'(2)':'(3)'}
          </MultBtn>
        ))}
      </MultiplierSelector>
    </DartboardContainer>
  );
};

export default DonkeyDerbyDartboard;