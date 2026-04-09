import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { CommonScrollBar, CommonScrollBox } from '@/component/lib/css';
import { MODAL_IMAGE } from '@/component/lib/constImage';
import { useEventStore } from '@/component/stores/eventStore';

interface Props {
  isSms: boolean;
}

const SmsTarget = ({ isSms }: Props) => {
  const { sms, broadcast, setSms, setBroadcast, setOpenOpt } = useEventStore(
    useShallow((state) => ({
      sms:          state.sms,
      broadcast:    state.broadcast,
      setSms:       state.actions.setSms,
      setBroadcast: state.actions.setBroadcast,
      setOpenOpt:   state.actions.setOpenOpt,
    })),
  );

  const targets = isSms ? sms.selectedTargets : broadcast.selectedTargets;

  const handleAdd = () => setOpenOpt(isSms ? 'target' : 'broadTarget');

  const handleRemove = (val: string) => {
    if (isSms) {
      setSms({ selectedTargets: targets.filter((t) => t.split('/')[1] !== val) });
    } else {
      setBroadcast({ selectedTargets: targets.filter((t) => t.split('/')[1] !== val) });
    }
  };

  return (
    <StyledTarget>
      <StyledTitle>전파대상</StyledTitle>
      <StyledContent>
        <StyledScroll>
          <StyledAddBtn onClick={handleAdd} />
          {targets.map((item) => {
            const [namePart, valPart] = item.split('/');
            const label = isSms ? `${namePart}(${valPart})` : valPart;
            return (
              <StyledItem key={item}>
                <p>{label}</p>
                <button onClick={() => handleRemove(valPart)} />
              </StyledItem>
            );
          })}
        </StyledScroll>
      </StyledContent>
    </StyledTarget>
  );
};

export default SmsTarget;

/* ─── Styled ─────────────────────────────────────────── */
const StyledTarget = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 6px;
`;

const StyledTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 33px;
  border-radius: 90px;
  background-color: rgba(167,167,240,.1);
  padding: 11px 10px;
  color: #b4aff3;
`;

const StyledContent = styled.div`
  width: 100%;
  height: 204px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #201E4A;
  background: #262552;
  overflow: hidden;
`;

const StyledScroll = styled.div`
  ${CommonScrollBox};
  ${CommonScrollBar};
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const StyledItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  width: 156px;
  height: 28px;
  padding: 5px;
  border-radius: 4px;
  border: solid 1px #5e6294;
  background-color: #3b3b6b;

  p {
    width: calc(100% - 17px);
    font-size: 11px;
    line-height: 1;
    color: #fff;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  button {
    width: 17px;
    height: 30px;
    margin-left: auto;
    background: url(${MODAL_IMAGE.SMS.TARGET.DELETE.BASE}) no-repeat center / 100%;
    &:hover { background-image: url(${MODAL_IMAGE.SMS.TARGET.DELETE.HOVER}); }
  }
`;

const StyledAddBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 156px;
  height: 28px;
  border-radius: 4px;
  border: solid 1px #5e6294;
  background-color: #3b3b6b;

  &::before {
    content: '';
    width: 16px;
    height: 16px;
    background: url(${MODAL_IMAGE.SMS.TARGET.ADD.BASE}) no-repeat center / 100%;
  }

  &:hover {
    border-color: #6439D1;
    background-color: #1D2340;
    &::before { background-image: url(${MODAL_IMAGE.SMS.TARGET.ADD.HOVER}); }
  }
`;
