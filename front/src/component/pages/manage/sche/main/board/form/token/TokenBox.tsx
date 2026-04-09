import styled from 'styled-components';
import { TOKEN_IMAGE } from '@/component/lib/constImage';
import { CommonDropBtn, CommonUpBtn } from '@/component/lib/css';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const TokenBox = ({ isOpen, setIsOpen }: Props) => {
  const { selectScOpt, setSelectScOpt } = useScheStore(
    useShallow((s) => ({
      selectScOpt:    s.selectScOpt,
      setSelectScOpt: s.actions.setSelectScOpt,
    })),
  );

  return (
    <StyledWrap $isOpen={isOpen}>
      <StyledTokenBox>
        <StyledTokenBoxItem>
          {selectScOpt.length === 0 && (
            <StyledTokenNone>지역을 선택해 주세요</StyledTokenNone>
          )}
          {selectScOpt.length > 0 && selectScOpt.includes('all/전체') && (
            <StyledToken><p>전체</p><button /></StyledToken>
          )}
          {selectScOpt.length > 0 && !selectScOpt.includes('all/전체') &&
            selectScOpt.slice(0, 2).map((item, idx) => (
              <StyledToken key={item.split('/')[0] + idx}>
                <p>{item.split('/')[1]}</p>
                <button onClick={() => setSelectScOpt(selectScOpt.filter((i) => i !== item))} />
              </StyledToken>
            ))}
          {!selectScOpt.includes('all/전체') && selectScOpt.length > 2 && (
            <StyledPlusToken><p>+{selectScOpt.length - 2}</p></StyledPlusToken>
          )}
        </StyledTokenBoxItem>
      </StyledTokenBox>
      <StyledDropBtn $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
    </StyledWrap>
  );
};

export default TokenBox;

const StyledWrap = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  padding: 5px;
  border-radius: 6px;
  border: 1px solid ${({ $isOpen }) => ($isOpen ? '#7A45FF' : '#3E4165')};
  background: ${({ $isOpen }) => ($isOpen ? '#19133B' : '#12172E')};
`;

const StyledTokenBox = styled.ul`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  width: 300px;
  gap: 0 3px;
  max-width: 305px;
  height: 28px;
  overflow: hidden;
`;

const StyledTokenBoxItem = styled.li`
  display: flex;
  gap: 3px;
`;

const StyledTokenNone = styled.p`
  padding-left: 10px;
  font-size: 13px;
  font-weight: 300;
  color: #707287;
  display: block;
`;

const StyledToken = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 5px 5px 10px;
  font-size: 13px;
  color: #9C7BFF;
  border-radius: 4px;
  background: #2A2E54;
  p {
    max-width: 119px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    &:before { content: '#'; }
  }
  button {
    width: 18px;
    height: 18px;
    margin-left: 5px;
    background: url('${TOKEN_IMAGE.CANCEL.BASE}') no-repeat center / 100%;
    &:hover { background: url('${TOKEN_IMAGE.CANCEL.HOVER}'); }
  }
`;

const StyledPlusToken = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: auto;
  padding: 3px;
  height: 28px;
  margin-left: 3px;
  font-size: 13px;
  color: #9C7BFF;
  border-radius: 5px;
  border: 1px solid #543FAF;
`;

const StyledDropBtn = styled.button<{ $isOpen: boolean }>`
  ${({ $isOpen }) => ($isOpen ? CommonUpBtn : CommonDropBtn)};
  width: 30px;
  margin-left: auto;
`;
