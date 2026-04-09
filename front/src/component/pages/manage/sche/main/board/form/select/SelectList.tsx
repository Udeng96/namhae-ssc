import styled from 'styled-components';
import {
  CommonScheSelectList,
  CommonScrollBar,
  CommonScrollBox,
} from '@/component/lib/css';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useState } from 'react';
import { SCHE_EMER_BACK, SCHE_EMER_SHOW_TIME } from '@/component/constants/scheConst';

interface Props {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  width: string;
  type: string;
  options: string[];
}

const SelectList = ({ setIsOpen, width, type, options }: Props) => {
  const {
    activeSche, startTime, endTime, selectDay, selectBack, selectExpire,
    setStartTime, setEndTime, setSelectDay, setSelectBack, setSelectExpire,
  } = useScheStore(useShallow((s) => ({
    activeSche:     s.activeSche,
    startTime:      s.startTime,
    endTime:        s.endTime,
    selectDay:      s.selectDay,
    selectBack:     s.selectBack,
    selectExpire:   s.selectExpire,
    setStartTime:   s.actions.setStartTime,
    setEndTime:     s.actions.setEndTime,
    setSelectDay:   s.actions.setSelectDay,
    setSelectBack:  s.actions.setSelectBack,
    setSelectExpire: s.actions.setSelectExpire,
  })));

  const [selectOption, setSelectOption] = useState('');

  useEffect(() => {
    if (type === 'startTime') {
      setSelectOption(startTime + ':00');
    } else if (type === 'endTime') {
      setSelectOption(endTime + ':00');
    } else if (type === 'day') {
      setSelectOption(selectDay);
    } else if (type === 'back') {
      const cd = activeSche ? activeSche.backImage : selectBack;
      setSelectOption(SCHE_EMER_BACK.find((i) => i.cd === cd)?.nm ?? '');
    } else {
      setSelectOption(SCHE_EMER_SHOW_TIME.find((i) => i.cd === selectExpire)?.nm ?? '');
    }
  }, [startTime, endTime, selectDay, selectBack, selectExpire, type, activeSche]);

  const handleItem = (option: string) => {
    if (type === 'startTime') {
      setStartTime(option.split(':')[0]);
    } else if (type === 'endTime') {
      setEndTime(option.split(':')[0]);
    } else if (type === 'day') {
      setSelectDay(option);
    } else if (type === 'back') {
      const item = SCHE_EMER_BACK.find((i) => i.nm === option);
      if (item) setSelectBack(item.cd);
    } else if (type === 'expire') {
      const item = SCHE_EMER_SHOW_TIME.find((i) => i.nm === option);
      if (item) setSelectExpire(item.cd);
    }
    setIsOpen(false);
  };

  const isDisabled = (option: string): boolean => {
    const h = option.split(':')[0];
    if (type === 'startTime') {
      if (h === '00') return false;
      if (endTime.split(':')[0] === '00') return false;
      return h >= endTime.split(':')[0];
    }
    if (type === 'endTime') {
      if (h === '00') return false;
      if (startTime.split(':')[0] === '00') return false;
      return h <= startTime.split(':')[0];
    }
    return false;
  };

  return (
    <StyledSelectList $width={width}>
      <StyledSelectListScroll>
        <StyledSelectListWrap>
          {options.map((option) => (
            <StyledSelectListItem
              key={option}
              onClick={() => handleItem(option)}
              $isActive={selectOption === option}
            >
              <StyledSelectListItemBtn disabled={isDisabled(option)}>
                {option}
              </StyledSelectListItemBtn>
            </StyledSelectListItem>
          ))}
        </StyledSelectListWrap>
      </StyledSelectListScroll>
    </StyledSelectList>
  );
};

export default SelectList;

const StyledSelectList = styled.div<{ $width: string }>`
  ${CommonScheSelectList};
  width: ${({ $width }) => $width};
`;

const StyledSelectListScroll = styled.div`
  ${CommonScrollBox};
  ${CommonScrollBar};
  height: auto;
  max-height: 167px;
  * { border-radius: 4px; }
`;

const StyledSelectListWrap = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

const StyledSelectListItem = styled.div<{ $isActive: boolean }>`
  position: relative;
  border-radius: 4px;
  background-color: ${({ $isActive }) => ($isActive ? '#7A45FF' : 'transparent')};
  &:hover { background-color: ${({ $isActive }) => ($isActive ? '#7A45FF' : '#2A2E54')}; }
`;

const StyledSelectListItemBtn = styled.button`
  width: 100%;
  height: 31px;
  padding: 0 11px;
  font-size: inherit;
  font-weight: inherit;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  &:disabled { opacity: 0.5; }
`;
