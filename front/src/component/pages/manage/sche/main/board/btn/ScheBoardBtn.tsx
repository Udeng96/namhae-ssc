import styled from 'styled-components';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';
import { SCHE_MODE, SCHE_TYPE } from '@/component/constants/scheConst';
import SaveBtn   from '@/component/pages/manage/sche/main/board/btn/SaveBtn';
import SubmitBtn from '@/component/pages/manage/sche/main/board/btn/SubmitBtn';
import EditBtn   from '@/component/pages/manage/sche/main/board/btn/EditBtn';
import DelBtn    from '@/component/pages/manage/sche/main/board/btn/DelBtn';

const ScheBoardBtn = () => {
  const { scheMode, activeType } = useScheStore(
    useShallow((s) => ({ scheMode: s.scheMode, activeType: s.activeType })),
  );

  return (
    <StyledBoardBtn>
      {scheMode === SCHE_MODE.DEFAULT && activeType === SCHE_TYPE.CONTENT && <SaveBtn />}
      {scheMode === SCHE_MODE.DEFAULT && activeType !== SCHE_TYPE.CONTENT && <SubmitBtn />}
      {scheMode !== SCHE_MODE.DEFAULT && activeType !== SCHE_TYPE.EMER && (
        <>
          <EditBtn />
          <DelBtn isEmer={false} />
        </>
      )}
      {scheMode === SCHE_MODE.READ && activeType === SCHE_TYPE.EMER && (
        <DelBtn isEmer={true} />
      )}
    </StyledBoardBtn>
  );
};

export default ScheBoardBtn;

const StyledBoardBtn = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 24px;
  padding-top: 24px;
  border-top: solid 1px #2A2E54;
`;
