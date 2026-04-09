import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useShallow } from 'zustand/react/shallow';
import { CommonPageBtn } from '@/component/lib/css';
import { PAGE_IMAGE } from '@/component/lib/constImage';
import { useEventStore } from '@/component/stores/eventStore';

interface Props {
  onPageChange: () => void;
}

const LastEventPage = ({ onPageChange }: Props) => {
  const { lastTotalPage, lastParam, setLastParam } = useEventStore(
    useShallow((state) => ({
      lastTotalPage: state.lastTotalPage,
      lastParam:     state.lastParam,
      setLastParam:  state.actions.setLastParam,
    })),
  );

  const [pageList, setPageList] = useState([1]);
  const selectPage = lastParam.pageNumber;

  useEffect(() => {
    const nowPage = lastParam.pageNumber;
    const startPage = Math.floor((nowPage - 1) / 10) * 10 + 1;
    const endPage = Math.min(startPage + 9, lastTotalPage);
    const list = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    setPageList(list);
  }, [lastTotalPage, lastParam.pageNumber]);

  const goTo = (page: number) => {
    setLastParam({ pageNumber: page });
    onPageChange();
  };

  return (
    <StyledPage>
      <StyledPageBox>
        <StyledForemost $isDisabled={selectPage === 1}         onClick={() => selectPage > 1         && goTo(1)} />
        <StyledPrev    $isDisabled={selectPage === 1}         onClick={() => selectPage > 1         && goTo(selectPage - 1)} />
        {pageList.map((p) => (
          <StyledItem key={p} $isActive={selectPage === p} onClick={() => goTo(p)}>
            <a>{p}</a>
          </StyledItem>
        ))}
        <StyledNext    $isDisabled={selectPage === lastTotalPage} onClick={() => selectPage < lastTotalPage && goTo(selectPage + 1)} />
        <StyledLast    $isDisabled={selectPage === lastTotalPage} onClick={() => selectPage < lastTotalPage && goTo(lastTotalPage)} />
      </StyledPageBox>
    </StyledPage>
  );
};

export default LastEventPage;

const StyledPage = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const StyledPageBox = styled.ul`
  display: flex;
  align-items: center;
  gap: 0 4px;
`;

const StyledItem = styled.li<{ $isActive: boolean }>`
  width: 19px;
  height: 19px;
  font-size: 10px;
  font-weight: 500;
  color: #f2f4fc;
  border-radius: 50%;
  border: solid 1px ${({ $isActive }) => ($isActive ? '#7A45FF' : 'transparent')};
  background-color: ${({ $isActive }) => ($isActive ? '#312775' : 'transparent')};

  a {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 1px;
  }

  &:hover {
    color: ${({ $isActive }) => (!$isActive && '#9C7BFF')};
    background-color: rgba(122, 69, 255, 0.2);
    cursor: ${({ $isActive }) => ($isActive ? 'default' : 'pointer')};
  }
`;

const StyledForemost = styled.li<{ $isDisabled: boolean }>`
  ${CommonPageBtn};
  background-image: url(${({ $isDisabled }) => ($isDisabled ? PAGE_IMAGE.FOREMOST.DISABLE : PAGE_IMAGE.FOREMOST.BASE)});
  &:hover { background-image: url(${({ $isDisabled }) => ($isDisabled ? PAGE_IMAGE.FOREMOST.DISABLE : PAGE_IMAGE.FOREMOST.HOVER)}); cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')}; }
`;

const StyledPrev = styled.li<{ $isDisabled: boolean }>`
  ${CommonPageBtn};
  background-image: url(${({ $isDisabled }) => ($isDisabled ? PAGE_IMAGE.PREV.DISABLE : PAGE_IMAGE.PREV.BASE)});
  &:hover { background-image: url(${({ $isDisabled }) => ($isDisabled ? PAGE_IMAGE.PREV.DISABLE : PAGE_IMAGE.PREV.HOVER)}); cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')}; }
`;

const StyledNext = styled.li<{ $isDisabled: boolean }>`
  ${CommonPageBtn};
  background-image: url(${({ $isDisabled }) => ($isDisabled ? PAGE_IMAGE.NEXT.DISABLE : PAGE_IMAGE.NEXT.BASE)});
  &:hover { background-image: url(${({ $isDisabled }) => ($isDisabled ? PAGE_IMAGE.NEXT.DISABLE : PAGE_IMAGE.NEXT.HOVER)}); cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')}; }
`;

const StyledLast = styled.li<{ $isDisabled: boolean }>`
  ${CommonPageBtn};
  background-image: url(${({ $isDisabled }) => ($isDisabled ? PAGE_IMAGE.LAST.DISABLE : PAGE_IMAGE.LAST.BASE)});
  &:hover { background-image: url(${({ $isDisabled }) => ($isDisabled ? PAGE_IMAGE.LAST.DISABLE : PAGE_IMAGE.LAST.HOVER)}); cursor: ${({ $isDisabled }) => ($isDisabled ? 'not-allowed' : 'pointer')}; }
`;
