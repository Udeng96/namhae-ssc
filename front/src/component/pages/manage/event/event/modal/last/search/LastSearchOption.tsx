import styled from 'styled-components';
import {
  CommonDropBtn,
  CommonSearchSelectBox,
  CommonSearchSelectClsBtn,
  CommonSearchSelectClsBtnArea,
  CommonSearchTokenBox,
  CommonUpBtn,
} from '@/component/lib/css';
import { TOKEN_IMAGE } from '@/component/lib/constImage';
import { useShallow } from 'zustand/react/shallow';
import { useEventStore } from '@/component/stores/eventStore';
import { WHOLE_OPTION } from '@/component/constants/eventCode';
import LastAreaCheck from './check/LastAreaCheck';
import LastEventCheck from './check/LastEventCheck';
import { CommonScrollBar, CommonScrollBox } from '@/component/lib/css';

// type: 'lastArea' | 'lastEvent'
interface Props {
  type: 'lastArea' | 'lastEvent';
}

const LastSearchOption = ({ type }: Props) => {
  const { lastFilter, filterOpt, setFilterOpt } = useEventStore(
    useShallow((state) => ({
      lastFilter:    state.lastFilter,
      filterOpt:     state.filterOpt,
      setFilterOpt:  state.actions.setFilterOpt,
    })),
  );

  const isOpen  = filterOpt === type;
  const opts    = type === 'lastArea' ? lastFilter.areaOpts : lastFilter.typeOpts;
  const maxCnt  = 7;

  const handleToggle = () => setFilterOpt(isOpen ? '' : type);
  const handleClose  = () => setFilterOpt('');

  const removeToken = (token: string) => {
    const key = type === 'lastArea' ? 'areaOpts' : 'typeOpts';
    const next = token.includes('all')
      ? []
      : opts.filter((o) => o !== token);
    useEventStore.getState().actions.setLastFilter({ [key]: next });
  };

  return (
    <StyledOption>
      <StyledTokenBox $isOpen={isOpen}>
        <StyledTokenList>
          {opts.length === 0 && (
            <StyledNone>
              {type === 'lastArea' ? '지역을' : '이벤트를'} 선택해 주세요
            </StyledNone>
          )}
          {opts.includes(WHOLE_OPTION) && (
            <StyledToken>
              <div>
                <p>전체</p>
                <StyledCancelBtn onClick={() => removeToken(WHOLE_OPTION)} />
              </div>
            </StyledToken>
          )}
          {!opts.includes(WHOLE_OPTION) &&
            opts.slice(0, maxCnt).map((o) => (
              <StyledToken key={o}>
                <div>
                  <p>{o.split('/')[0]}</p>
                  <StyledCancelBtn onClick={() => removeToken(o)} />
                </div>
              </StyledToken>
            ))}
          {!opts.includes(WHOLE_OPTION) && opts.length > maxCnt && (
            <StyledPlus><p>+{opts.length - maxCnt}</p></StyledPlus>
          )}
        </StyledTokenList>
        <StyledDropBtn $isOpen={isOpen} onClick={handleToggle} />
      </StyledTokenBox>

      <StyledSelectBox $isOpen={isOpen}>
        <StyledSelectScroll>
          {type === 'lastArea'  && <LastAreaCheck />}
          {type === 'lastEvent' && <LastEventCheck />}
        </StyledSelectScroll>
        <StyledClsBtnWrap>
          <StyledClsBtn onClick={handleClose}>닫기</StyledClsBtn>
        </StyledClsBtnWrap>
      </StyledSelectBox>
    </StyledOption>
  );
};

export default LastSearchOption;

const StyledOption = styled.div`
  position: relative;
  width: 100%;
`;

const StyledTokenBox = styled.div<{ $isOpen: boolean }>`
  ${CommonSearchTokenBox};
  border: 1px solid ${({ $isOpen }) => ($isOpen ? '#7A45FF' : '#3E4165')};
  background: ${({ $isOpen }) => ($isOpen ? '#19133B' : '#0F1223')};
`;

const StyledTokenList = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0 3px;
  max-width: 728px;
  height: 28px;
  overflow: hidden;
`;

const StyledNone = styled.p`
  padding-left: 10px;
  font-size: 13px;
  font-weight: 300;
  color: #707287;
`;

const StyledToken = styled.li`
  div {
    display: flex;
    align-items: center;
    padding: 5px 5px 5px 9px;
    font-size: 13px;
    color: #9c7bff;
    border-radius: 4px;
    background: #2a2e54;
    p {
      max-width: 119px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      &:before { content: '#'; }
    }
  }
`;

const StyledCancelBtn = styled.button`
  width: 18px;
  height: 18px;
  margin-left: 5px;
  background: url('${TOKEN_IMAGE.CANCEL.BASE}') no-repeat center / 100%;
  &:hover { background-image: url('${TOKEN_IMAGE.CANCEL.HOVER}'); }
`;

const StyledPlus = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-left: 3px;
  font-size: 13px;
  color: #9c7bff;
  border-radius: 5px;
  border: 1px solid #543faf;
`;

const StyledDropBtn = styled.button<{ $isOpen: boolean }>`
  ${({ $isOpen }) => ($isOpen ? CommonUpBtn : CommonDropBtn)};
`;

const StyledSelectBox = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  z-index: 17;
  ${CommonSearchSelectBox};
`;

const StyledSelectScroll = styled.div`
  ${CommonScrollBar};
  ${CommonScrollBox};
  padding: 15px 10px 15px 15px;
  padding-right: 8px;
  max-height: 188px;
`;

const StyledClsBtnWrap = styled.div`
  ${CommonSearchSelectClsBtnArea}
`;

const StyledClsBtn = styled.button`
  ${CommonSearchSelectClsBtn}
`;
