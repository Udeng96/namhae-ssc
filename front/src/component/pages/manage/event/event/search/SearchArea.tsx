import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import {
  CommonDropBtn,
  CommonUpBtn,
  CommonSearchBtn,
  CommonSearchSelectBox,
  CommonSearchSelectClsBtn,
  CommonSearchSelectClsBtnArea,
  CommonSearchTokenBox,
  CommonScrollBar,
  CommonScrollBox,
} from '@/component/lib/css';
import { TOKEN_IMAGE } from '@/component/lib/constImage';
import { useEventStore } from '@/component/stores/eventStore';
import { WHOLE_OPTION } from '@/component/constants/eventCode';
import AreaCheck from './check/AreaCheck';
import EventCheck from './check/EventCheck';

interface Props {
  onSearch: () => void;
  isFetching?: boolean;
}

// ── 개별 SearchBox (label + token + dropdown) ────────────────────
interface BoxProps {
  nm: string;
  type: 'area_e' | 'event';
}

const SearchBox = ({ nm, type }: BoxProps) => {
  const { currentFilter, setCurrentFilter, filterOpt, setFilterOpt } = useEventStore(
    useShallow((s) => ({
      currentFilter:    s.currentFilter,
      setCurrentFilter: s.actions.setCurrentFilter,
      filterOpt:        s.filterOpt,
      setFilterOpt:     s.actions.setFilterOpt,
    })),
  );

  const isOpen = filterOpt === type;
  const opts = type === 'area_e' ? currentFilter.areaOpts : currentFilter.typeOpts;

  const handleToggle = () => setFilterOpt(isOpen ? '' : type);

  const handleCancel = (token: string) => {
    const key = type === 'area_e' ? 'areaOpts' : 'typeOpts';
    if (token.includes('all')) {
      setCurrentFilter({ [key]: [] });
    } else {
      setCurrentFilter({ [key]: opts.filter((o) => o !== token) });
    }
  };

  return (
    <StyledSearchBox>
      <StyledSearchBoxNm>{nm}</StyledSearchBoxNm>
      <StyledSearchBoxValue>
        <StyledSearchOption>
          {/* 토큰 + 드롭 버튼 */}
          <StyledSearchTokenBox $isOpen={isOpen}>
            <StyledTokenBox>
              {opts.length === 0 && (
                <StyledTokenNone>
                  {type === 'area_e' ? '지역을' : '이벤트를'} 선택해 주세요
                </StyledTokenNone>
              )}
              {opts.includes(WHOLE_OPTION) && (
                <StyledToken>
                  <div>
                    <p>전체</p>
                    <StyledTokenCancelBtn onClick={() => handleCancel(WHOLE_OPTION)} />
                  </div>
                </StyledToken>
              )}
              {!opts.includes(WHOLE_OPTION) &&
                opts.slice(0, 3).map((o) => (
                  <StyledToken key={o}>
                    <div>
                      <p>{o.split('/')[0]}</p>
                      <StyledTokenCancelBtn onClick={() => handleCancel(o)} />
                    </div>
                  </StyledToken>
                ))}
              {!opts.includes(WHOLE_OPTION) && opts.length > 3 && (
                <StyledPlusToken>
                  <p>+{opts.length - 3}</p>
                </StyledPlusToken>
              )}
            </StyledTokenBox>
            <StyledDropBtn $isOpen={isOpen} onClick={handleToggle} />
          </StyledSearchTokenBox>

          {/* 드롭다운 */}
          <StyledSelectBox $isOpen={isOpen}>
            <StyledScrollBox>
              {type === 'area_e' ? <AreaCheck /> : <EventCheck />}
            </StyledScrollBox>
            <StyledClsBtnArea>
              <StyledClsBtn onClick={() => setFilterOpt('')}>닫기</StyledClsBtn>
            </StyledClsBtnArea>
          </StyledSelectBox>
        </StyledSearchOption>
      </StyledSearchBoxValue>
    </StyledSearchBox>
  );
};

// ── SearchArea ───────────────────────────────────────────────────
const SearchArea = ({ onSearch, isFetching }: Props) => (
  <div>
    <SearchBox nm="경로당 지역" type="area_e" />
    <SearchBox nm="이벤트 유형" type="event" />
    <StyledSearchBtn onClick={onSearch} disabled={isFetching}>
      {isFetching ? '검색 중...' : '검색'}
    </StyledSearchBtn>
  </div>
);

export default SearchArea;

// ── Styled ───────────────────────────────────────────────────────
const StyledSearchBox = styled.div`
  display: flex;
  align-items: center;
  & + div { margin-top: 8px; }
  &:last-of-type { margin-bottom: 12px; }
`;

const StyledSearchBoxNm = styled.div`
  width: 85px;
  font-size: 13px;
  color: #F2F4FC;
`;

const StyledSearchBoxValue = styled.div`
  width: 400px;
  display: flex;
  align-items: center;
  gap: 0 26px;
`;

const StyledSearchOption = styled.div`
  position: relative;
  width: 100%;
`;

const StyledSearchTokenBox = styled.div<{ $isOpen: boolean }>`
  ${CommonSearchTokenBox};
  border: 1px solid ${({ $isOpen }) => ($isOpen ? '#7A45FF' : '#3E4165')};
  background: ${({ $isOpen }) => ($isOpen ? '#19133B' : '#12172E')};
`;

const StyledTokenBox = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0 3px;
  max-width: 728px;
  height: 28px;
  overflow: hidden;
`;

const StyledTokenNone = styled.p`
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
    color: #9C7BFF;
    border-radius: 4px;
    background: #2A2E54;
    p {
      max-width: 119px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      &::before { content: '#'; }
    }
  }
`;

const StyledTokenCancelBtn = styled.button`
  width: 18px;
  height: 18px;
  margin-left: 5px;
  background: url('${TOKEN_IMAGE.CANCEL.BASE}') no-repeat center / 100%;
  &:hover { background-image: url('${TOKEN_IMAGE.CANCEL.HOVER}'); }
`;

const StyledPlusToken = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-left: 3px;
  font-size: 13px;
  color: #9C7BFF;
  border-radius: 5px;
  border: 1px solid #543FAF;
`;

const StyledDropBtn = styled.button<{ $isOpen: boolean }>`
  ${({ $isOpen }) => ($isOpen ? CommonUpBtn : CommonDropBtn)};
`;

const StyledSelectBox = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  z-index: 10;
  ${CommonSearchSelectBox};
`;

const StyledScrollBox = styled.div`
  ${CommonScrollBar};
  ${CommonScrollBox};
  padding: 15px 8px 15px 15px;
  max-height: 188px;
`;

const StyledClsBtnArea = styled.div`
  ${CommonSearchSelectClsBtnArea};
`;

const StyledClsBtn = styled.button`
  ${CommonSearchSelectClsBtn};
`;

const StyledSearchBtn = styled.button`
  ${CommonSearchBtn};
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
