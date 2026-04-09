import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import { SMS_PRESET } from '@/component/constants/eventCode';
import SmsPreset from './SmsPreset';
import SmsTarget from './SmsTarget';

const SmsBroad = () => {
  const { broadcast, setBroadcast } = useEventStore(
    useShallow((state) => ({
      broadcast:    state.broadcast,
      setBroadcast: state.actions.setBroadcast,
    })),
  );

  const handleContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (broadcast.preset.cd !== SMS_PRESET[0].cd) {
      setBroadcast({ preset: SMS_PRESET[0], content: e.target.value });
    } else {
      setBroadcast({ content: e.target.value });
    }
  };

  const isActive = broadcast.title !== '' || broadcast.content !== '';

  return (
    <StyledPanel $isActive={isActive}>
      <StyledPanelHead>마을방송</StyledPanelHead>
      <StyledPanelBody>
        <StyledSectionTitle>전파문구</StyledSectionTitle>
        <StyledField>
          <StyledFieldLabel>TTS 제목</StyledFieldLabel>
          <StyledInput
            placeholder="제목을 입력해 주세요"
            value={broadcast.title}
            onChange={(e) => setBroadcast({ title: e.target.value })}
          />
        </StyledField>
        <StyledField>
          <StyledFieldLabel>방송 내용</StyledFieldLabel>
          <StyledTextarea
            placeholder="내용을 입력해 주세요"
            value={broadcast.content}
            onChange={handleContent}
          />
        </StyledField>
        <SmsPreset type="broad" />
      </StyledPanelBody>
      <SmsTarget isSms={false} />
    </StyledPanel>
  );
};

export default SmsBroad;

/* ─── Styled ─────────────────────────────────────────── */
const StyledPanel = styled.div<{ $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  width: 432px;
  border-radius: 12px;
  box-shadow: 0 11px 15px 0 rgba(0,0,0,.05);
  border: solid ${({ $isActive }) => ($isActive ? '2px' : '0.96px')}
    ${({ $isActive }) => ($isActive ? '#7A45FF' : '#484d86')};
  background-color: ${({ $isActive }) => ($isActive ? '#3F3F8C' : '#353868')};
  padding: 30px 24px;
`;

const StyledPanelHead = styled.div`
  display: flex;
  justify-content: center;
  padding-bottom: 12px;
  border-bottom: 2px solid rgba(6,27,38,.5);
  font-size: 18px;
  margin-bottom: 24px;
`;

const StyledPanelBody = styled.div`
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
  display: flex;
  height: 32px;
  padding: 10px 15px;
  align-items: center;
  border-radius: 6px;
  border: 1px solid #201E4A;
  background: #262552;
  color: #fff;
  &::placeholder { color: #707287; }
`;

const StyledTextarea = styled.textarea`
  display: flex;
  height: 162px;
  padding: 15px;
  border-radius: 6px;
  border: 1px solid #201E4A;
  background: #262552;
  color: #fff;
  &::placeholder { color: #707287; }
`;
