import styled from 'styled-components';
import { useCommonStore } from '@/component/stores/commonStore';
import { STAT_IMAGE } from '@/component/lib/statImage';
import TotalBox from '@/component/pages/manage/stat/common/cnt/total/TotalBox';
import AreaBox  from '@/component/pages/manage/stat/common/cnt/area/AreaBox';

const CntBody = () => {
  const areas = useCommonStore((s) => s.areaRoles)
    .slice()
    .sort((a, b) => (b.active ? 1 : 0) - (a.active ? 1 : 0));

  const totalSc  = areas.reduce((sum, a) => sum + (a.scCnt  || 0), 0);
  const totalFac = areas.reduce((sum, a) => sum + (a.facCnt || 0), 0);

  return (
    <StyledCntBody>
      <StyledCntTotal>
        <TotalBox title="전체 경로당 현황" cnt={totalSc} />
        <TotalBox title="전체 시설 현황"   cnt={totalFac} />
      </StyledCntTotal>
      <StyledCntNotice>
        <i />
        아래 읍/면정보를 클릭 시 상세 정보를 확인할 수 있습니다.
      </StyledCntNotice>
      <StyledCntArea>
        {areas.map((area, i) => (
          <AreaBox key={i} area={area} />
        ))}
      </StyledCntArea>
    </StyledCntBody>
  );
};

export default CntBody;

const StyledCntBody = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 30px;
  position: relative;

  &:last-child { gap: 15px; }
`;

const StyledCntTotal = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: flex-start;
  align-items: center;
  gap: 0 46px;
`;

const StyledCntNotice = styled.div`
  padding-left: 8px;
  font-size: 11px;
  font-weight: 300;
  color: #C8CBE8;

  i {
    display: inline-block;
    width: 11px;
    height: 11px;
    margin-right: 6px;
    vertical-align: text-top;
    background: url(${STAT_IMAGE.CNT.NOTICE}) no-repeat center / 100%;
  }
`;

const StyledCntArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px 0;
  margin-top: 15px;
`;
