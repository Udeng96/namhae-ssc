import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import {
  CommonDropBtn,
  CommonScheSelectBtn,
  CommonUpBtn,
} from '@/component/lib/css';
import SelectList from '@/component/pages/manage/sche/main/board/form/select/SelectList';

interface Props {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
  width: string;
  value: string;
  optionList: string[];
}

const SelectBox = ({ isOpen, setIsOpen, type, width, value, optionList }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기 — isOpen 일 때만 리스너 등록
  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [isOpen, setIsOpen]);

  return (
    <StyledSelectBox ref={ref} $isOpen={isOpen} $width={width}>
      <StyledSelectBoxContent>{value}</StyledSelectBoxContent>
      <StyledSelectBoxBtn $isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      {isOpen && optionList.length > 0 && (
        <SelectList setIsOpen={setIsOpen} type={type} width={width} options={optionList} />
      )}
    </StyledSelectBox>
  );
};

export default SelectBox;

const StyledSelectBox = styled.div<{ $isOpen: boolean; $width: string }>`
  ${CommonScheSelectBtn};
  padding-right: 4px;
  border: 1px solid ${({ $isOpen }) => ($isOpen ? '#7A45FF' : '#3E4165')};
  background: ${({ $isOpen }) => ($isOpen ? '#19133B' : '#12172E')};
  width: ${({ $width }) => $width};
`;

const StyledSelectBoxContent = styled.div`
  display: flex;
  margin-left: 10px;
  font-size: 12px;
  font-weight: 300;
  color: #fff;
`;

const StyledSelectBoxBtn = styled.button<{ $isOpen: boolean }>`
  ${({ $isOpen }) => ($isOpen ? CommonUpBtn : CommonDropBtn)};
  margin-left: 0;
`;
