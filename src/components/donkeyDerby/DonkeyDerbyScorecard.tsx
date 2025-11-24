import React from 'react';
import styled from 'styled-components';
import { Player } from '../../context/GameContext';

const Wrapper = styled.div`
  background: linear-gradient(to bottom, rgba(30,30,30,0.7), rgba(40,40,40,0.7));
  padding:16px;border-radius:12px;
`;
const Row = styled.div<{active:boolean}>`
  display:flex;align-items:center;gap:12px;margin-bottom:8px;padding:8px;border-radius:8px;
  background:${p=>p.active?'rgba(233,69,96,0.15)':'rgba(255,255,255,0.05)'};
`;
const Bar = styled.div`
  flex:1;height:10px;background:rgba(255,255,255,0.1);border-radius:5px;position:relative;overflow:hidden;
`;
const Fill = styled.div<{pct:number;color:string}>`
  position:absolute;left:0;top:0;bottom:0;width:${p=>p.pct}%;background:${p=>p.color};transition:width .3s;
`;
const Avatar = styled.div<{color:string}>`
  width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;background:${p=>p.color};color:#000;
`;

const DonkeyDerbyScorecard: React.FC<{players:Player[];currentId?:string;finishLine:number}> = ({players,currentId,finishLine}) => {
  return (
    <Wrapper>
      <h3 style={{marginTop:0}}>Standings</h3>
      {players.map(p=>{
        const pct=((p.donkeyProgress||0)/finishLine)*100;
        return (
          <Row key={p.id} active={p.id===currentId}>
            <Avatar color={p.color}>{p.name[0]}</Avatar>
            <div style={{width:38}}>{p.segment}</div>
            <Bar><Fill pct={pct} color={p.color} /></Bar>
            <div style={{width:60,textAlign:'right'}}>{p.donkeyProgress||0}/{finishLine}</div>
          </Row>
        );
      })}
    </Wrapper>
  );
};

export default DonkeyDerbyScorecard;