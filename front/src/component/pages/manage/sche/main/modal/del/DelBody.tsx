import styled from 'styled-components';
import { useCommonStore } from '@/component/stores/commonStore';
import { useScheStore }   from '@/component/stores/scheStore';

const DelBody = () => {
  const userInfo   = useCommonStore((s) => s.userInfo);
  const activeSche = useScheStore((s) => s.activeSche);

  const isDifferentType =
    userInfo && activeSche && userInfo.userType !== activeSche.editorType;

  return (
    <StyledBody>
      {isDifferentType
        ? '다른 타입의 사용자가 등록한 스케쥴입니다. 정말 삭제하시겠습니까?'
        : '선택한 일정을 완전히 삭제하시겠습니까?'}
    </StyledBody>
  );
};

export default DelBody;

const StyledBody = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  padding: 26px 101px 66px 32px;
  font-size: 17px;
  font-weight: 400;
  color: #F2F4FC;
  line-height: normal;

  &::before, &::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    width: 100%;
    height: 1px;
  }
  &::before {
    top: 0;
    background: linear-gradient(90deg, #543FAF, #2A2E54);
  }
  &::after {
    bottom: 0;
    background: linear-gradient(90deg, #2A2E54, #543FAF);
  }
`;
