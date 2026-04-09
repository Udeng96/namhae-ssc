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
import { useFireStore } from '@/component/stores/fireStore';
import { WHOLE_OPTION } from '@/component/constants/eventCode';
import FireAreaCheck from './FireAreaCheck';

interface Props {
  onSearch:    () => void;
  isFetching?: boolean;
}

const FireSearchArea = ({ onSearch, isFetching }: Props) => {
  const { currentFilter, setCurrentFilter, filterOpt, setFilterOpt } = useFireStore(
    useShallow((s) => ({
      currentFilter:    s.currentFilter,
      setCurrentFilter: s.actions.setCurrentFilter,
      filterOpt:        s.filterOpt,
      setFilterOpt:     s.actions.setFilterOpt,
    })),
  );

  const isOpen = filterOpt === 'f_area_e';
  const opts   = currentFilter.areaOpts;

  const handleToggle = () => setFilterOpt(isOpen ? '' : 'f_area_e');

  const handleCancel = (token: string) => {
    if (token.includes('all')) {
      setCurrentFilter({ areaOpts: [] });
    } else {
      setCurrentFilter({ areaOpts: opts.filter((o) => o !== token) });
    }
  };

  return (
    <div>
      <StyledSearchBox>
        <StyledSearchBoxNm>경로당 지역</StyledSearchBoxNm>
        <StyledSearchBoxValue>
          <StyledSearchOption>
            <StyledSearchTokenBox $isOpen={isOpen}>
              <StyledTokenBox>
                {opts.length === 0 && (
                  <StyledTokenNone>지역을 선택해 주세요</StyledTokenNone>
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

            <StyledSelectBox $isOpen={isOpen}>
              <StyledScrollBox>
                <FireAreaCheck />
              </StyledScrollBox>
              <StyledClsBtnArea>
                <StyledClsBtn onClick={() => setFilterOpt('')}>닫기</StyledClsBtn>
              </StyledClsBtnArea>
            </StyledSelectBox>
          </StyledSearchOption>
        </StyledSearchBoxValue>
      </StyledSearchBox>

      <StyledSearchBtn onClick={onSearch} disabled={isFetching}>
        {isFetching ? '검색 중...' : '검색'}
      </StyledSearchBtn>
    </div>
  );
};

export default FireSearchArea;

const StyledSearchBox = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const StyledSearchBoxNm = styled.div`
  width: 85px;
  font-size: 13px;
  color: #f2f4fc;
`;

const StyledSearchBoxValue = styled.div`
  width: 400px;
  display: flex;
  align-items: center;
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
    color: #9c7bff;
    border-radius: 4px;
    background: #2a2e54;
    p {
      max-width: 119px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      &::before {
        content: '#';
      }
    }
  }
`;

const StyledTokenCancelBtn = styled.button`
  width: 18px;
  height: 18px;
  margin-left: 5px;
  background: url('${TOKEN_IMAGE.CANCEL.BASE}') no-repeat center / 100%;
  &:hover {
    background-image: url('${TOKEN_IMAGE.CANCEL.HOVER}');
  }
`;

const StyledPlusToken = styled.div`
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
