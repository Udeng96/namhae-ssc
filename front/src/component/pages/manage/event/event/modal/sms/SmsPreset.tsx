import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import { SMS_PRESET } from '@/component/constants/eventCode';

interface Props {
  /** 'sms': SMS 채널 / 'broad': 마을방송 채널 */
  type: 'sms' | 'broad';
}

const SmsPreset = ({ type }: Props) => {
  const isSms = type === 'sms';

  const { sms, broadcast, setSms, setBroadcast, setOpenOpt } = useEventStore(
    useShallow((state) => ({
      sms:          state.sms,
      broadcast:    state.broadcast,
      setSms:       state.actions.setSms,
      setBroadcast: state.actions.setBroadcast,
      setOpenOpt:   state.actions.setOpenOpt,
    })),
  );

  const currentPreset = isSms ? sms.preset : broadcast.preset;

  const handleSelect = (preset: typeof SMS_PRESET[number]) => {
    if (preset.cd === SMS_PRESET[0].cd) {
      // 직접입력 선택 → 프리셋 초기화만
      if (isSms) setSms({ preset });
      else       setBroadcast({ preset });
    } else {
      // 프리셋 선택 → 확인 팝업 열기
      if (isSms) { setSms({ preset }); setOpenOpt('preset'); }
      else       { setBroadcast({ preset }); setOpenOpt('presetBroad'); }
    }
  };

  return (
    <StyledPreset>
      <StyledPresetBox>
        {SMS_PRESET.map((preset, idx) => (
          <>
            {idx === 1 && <StyledDivider key={`divider-${idx}`} />}
            <StyledPresetItem
              key={preset.cd}
              $isActive={currentPreset.cd === preset.cd}
              onClick={() => handleSelect(preset)}
            >
              {preset.nm}
            </StyledPresetItem>
          </>
        ))}
      </StyledPresetBox>
    </StyledPreset>
  );
};

export default SmsPreset;

/* ─── Styled ─────────────────────────────────────────── */
const StyledPreset = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 73px;
  margin-top: 8px;
  gap: 5px;
`;

const StyledPresetBox = styled.div`
  display: flex;
  width: 100%;
  height: 34px;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
`;

const StyledPresetItem = styled.button<{ $isActive: boolean }>`
  display: flex;
  width: auto;
  height: 34px;
  padding: 12px 18px;
  background: ${({ $isActive }) => ($isActive ? '#7A45FF' : 'rgba(204,204,255,.15)')};
  border-radius: 90px;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #fff;
  &:hover { background: ${({ $isActive }) => ($isActive ? '#7A45FF' : 'rgba(204,204,255,.30)')}; }
`;

const StyledDivider = styled.div`
  width: 2px;
  height: 14px;
  background-color: #4E5187;
  flex-shrink: 0;
`;
