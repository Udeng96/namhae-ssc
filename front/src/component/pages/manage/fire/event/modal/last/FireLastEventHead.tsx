import styled from 'styled-components';
import { CommonModalClsBtn } from '@/component/lib/css';
import { EVENT_IMAGE } from '@/component/lib/eventImage';
import { useFireStore } from '@/component/stores/fireStore';

const FireLastEventHead = () => {
  const setOpenOpt = useFireStore((state) => state.actions.setOpenOpt);

  return (
    <StyledHead>
      <StyledTitle>지난 이벤트 내역</StyledTitle>
      <StyledClsBtn onClick={() => setOpenOpt('')} />
    </StyledHead>
  );
};

export default FireLastEventHead;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  padding: 0 19px 0 24px;
  border-radius: 16px 16px 0 0;
  background: linear-gradient(90deg, #2b245b 0%, #1d1a2f 100%);
  box-shadow: 0.5px 0.5px 0.5px 0 rgba(255, 255, 255, 0.16) inset;
`;

const StyledTitle = styled.h2`
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 22px;
  font-weight: 500;

  &:before {
    content: '';
    display: inline-block;
    width: 26px;
    height: 26px;
    margin-right: 7px;
    background-size: 100%;
    background-image: url('${EVENT_IMAGE.CONTENT.MODAL.ICON}');
  }
`;

const StyledClsBtn = styled.button`
  ${CommonModalClsBtn};
`;
