import styled from 'styled-components';
import { useEventStore } from '@/component/stores/eventStore';
import ConfirmTarget from './ConfirmTarget';

const ConfirmBroad = () => {
  const { broadcast } = useEventStore((state) => ({ broadcast: state.broadcast }));

  return (
    <StyledPanel>
      <StyledHead>마을방송</StyledHead>
      <StyledBody>
        <StyledSectionTitle>전파문구</StyledSectionTitle>
        <StyledField>
          <StyledFieldLabel>TTS 제목</StyledFieldLabel>
          <StyledInput disabled value={broadcast.title} />
        </StyledField>
        <StyledField>
          <StyledFieldLabel>방송 내용</StyledFieldLabel>
          <StyledTextarea disabled value={broadcast.content} />
        </StyledField>
      </StyledBody>
      <ConfirmTarget targetList={broadcast.selectedTargets} />
    </StyledPanel>
  );
};

export default ConfirmBroad;

/* ─── Styled ─────────────────────────────────────────── */
const StyledPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 432px;
  border-radius: 12px;
  border: solid 2px #7A45FF;
  background-color: #3F3F8C;
  padding: 30px 24px;
`;

const StyledHead = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(6,27,38,.5);
  font-size: 18px;
  margin-bottom: 24px;
`;

const StyledBody = styled.div`
  width: 100%;
`;

const StyledSectionTitle = styled.div`
  display: flex;
  height: 34px;
  padding: 11px 10px;
  margin-bottom: 12px;
  justify-content: center;
  align-items: center;
  color: #b4aff3;
  border-radius: 90px;
  background: rgba(204,204,255,.10);
`;

const StyledField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 8px;
`;

const StyledFieldLabel = styled.div`
  position: relative;
  color: #A9A7C0;
  font-size: 13px;
  left: 8px;
  &::before {
    content: '';
    width: 4px;
    height: 4px;
    position: absolute;
    display: inline-block;
    background-color: #5d5ce2;
    top: 50%;
    transform: translateY(-50%);
    left: -8px;
  }
`;

const StyledInput = styled.input`
  height: 32px;
  padding: 10px 15px;
  border-radius: 6px;
  border: 1px solid #5B5BA6;
  background: #3A3A7C;
  color: #fff;
`;

const StyledTextarea = styled.textarea`
  height: 234px;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #5B5BA6;
  background: #3A3A7C;
  color: #fff;
`;
