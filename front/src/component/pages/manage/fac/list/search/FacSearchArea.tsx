import { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
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
import { useFacStore } from '@/component/stores/facStore';
import { useHomeStore } from '@/component/stores/homeStore';
import { fetchFacList } from '@/component/api/facApi';
import { WHOLE_OPTION } from '@/component/constants/eventCode';
import { FAC_TOAST, WHOLE_AREA_CODE } from '@/component/constants/facConst';

import FacAreaCheck from './FacAreaCheck';
import FacNameInput from './FacNameInput';

const FacSearchArea = () => {
  const {
    areaOpts,
    centerName,
    setFacList,
    setSelectFac,
    setToastKey,
    setAreaOpts,
  } = useFacStore(
    useShallow((state) => ({
      areaOpts:     state.areaOpts,
      centerName:   state.centerName,
      setFacList:   state.actions.setFacList,
      setSelectFac: state.actions.setSelectFac,
      setToastKey:  state.actions.setToastKey,
      setAreaOpts:  state.actions.setAreaOpts,
    })),
  );

  const setScFacs = useHomeStore((state) => state.actions.setScFacs);

  const [isOpen, setIsOpen] = useState(false);

  const { data: facRes, refetch } = useQuery({
    queryKey: ['facList'],
    queryFn: () => {
      const areaCd = areaOpts.includes(WHOLE_OPTION)
        ? WHOLE_AREA_CODE
        : areaOpts.map((o) => o.split('/')[1]).join(',');
      return fetchFacList({ areaCd, centerName, sortType: 'default' });
    },
    enabled: areaOpts.length > 0,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!facRes?.data) return;
    const list = facRes.data;
    setFacList(list);
    setScFacs(list);
    // WS 재조회 시 기존 선택 유지 (없으면 첫 번째로)
    const currentSelectFac = useFacStore.getState().selectFac;
    const stillSelected = currentSelectFac
      ? list.find((f) => f.mgtNo === currentSelectFac.mgtNo) ?? null
      : null;
    setSelectFac(stillSelected ?? (list.length > 0 ? list[0] : null));
  }, [facRes]);

  const handleSearch = () => {
    if (areaOpts.length === 0) {
      setToastKey(FAC_TOAST.NO_AREA);
      return;
    }
    refetch();
  };

  const handleCancelToken = (token: string) => {
    if (token.includes('all')) {
      setAreaOpts([]);
    } else {
      setAreaOpts(areaOpts.filter((o) => o !== token));
    }
  };

  return (
    <StyledBox>
      {/* 경로당 지역 */}
      <StyledRow>
        <StyledNm>경로당 지역</StyledNm>
        <StyledValue>
          <StyledOption>
            <StyledTokenBox $isOpen={isOpen}>
              <StyledTokenList>
                {areaOpts.length === 0 && (
                  <StyledTokenNone>지역을 선택해 주세요</StyledTokenNone>
                )}
                {areaOpts.includes(WHOLE_OPTION) && (
                  <StyledToken>
                    <div>
                      <p>전체</p>
                      <StyledCancelBtn onClick={() => handleCancelToken(WHOLE_OPTION)} />
                    </div>
                  </StyledToken>
                )}
                {!areaOpts.includes(WHOLE_OPTION) &&
                  areaOpts.slice(0, 3).map((o) => (
                    <StyledToken key={o}>
                      <div>
                        <p>{o.split('/')[0]}</p>
                        <StyledCancelBtn onClick={() => handleCancelToken(o)} />
                      </div>
                    </StyledToken>
                  ))}
                {!areaOpts.includes(WHOLE_OPTION) && areaOpts.length > 3 && (
                  <StyledPlusToken>
                    <p>+{areaOpts.length - 3}</p>
                  </StyledPlusToken>
                )}
              </StyledTokenList>
              <StyledDropBtn $isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
            </StyledTokenBox>

            <StyledSelectBox $isOpen={isOpen}>
              <StyledScrollBox>
                <FacAreaCheck />
              </StyledScrollBox>
              <StyledClsBtnArea>
                <StyledClsBtn onClick={() => setIsOpen(false)}>닫기</StyledClsBtn>
              </StyledClsBtnArea>
            </StyledSelectBox>
          </StyledOption>
        </StyledValue>
      </StyledRow>

      {/* 경로당 이름 */}
      <StyledRow>
        <StyledNm>경로당 이름</StyledNm>
        <StyledValue><FacNameInput /></StyledValue>
      </StyledRow>

      <StyledSearchBtn onClick={handleSearch}>검색</StyledSearchBtn>
    </StyledBox>
  );
};

export default FacSearchArea;

// ── Styled ────────────────────────────────────────────────────────
const StyledBox = styled.div``;

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  & + div { margin-top: 8px; }
  &:last-of-type { margin-bottom: 12px; }
`;

const StyledNm = styled.div`
  width: 85px;
  font-size: 13px;
  color: #f2f4fc;
`;

const StyledValue = styled.div`
  width: 400px;
  display: flex;
  align-items: center;
  gap: 0 26px;
`;

const StyledOption = styled.div`
  position: relative;
  width: 100%;
`;

const StyledTokenBox = styled.div<{ $isOpen: boolean }>`
  ${CommonSearchTokenBox};
  border: 1px solid ${({ $isOpen }) => ($isOpen ? '#7A45FF' : '#3E4165')};
  background: ${({ $isOpen }) => ($isOpen ? '#19133B' : '#12172E')};
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
      &::before { content: '#'; }
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
`;
