import styled from 'styled-components';
import { CommonScheSelectBox } from '@/component/lib/css';
import SelectBox from '@/component/pages/manage/sche/main/board/form/select/SelectBox';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';

const TimeSelect = () => {
  const { startTime, endTime } = useScheStore(
    useShallow((s) => ({ startTime: s.startTime, endTime: s.endTime })),
  );

  const [timeList, setTimeList] = useState<string[]>([]);
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen]     = useState(false);

  useEffect(() => {
    setTimeList(
      Array.from({ length: 24 }, (_, h) => moment({ hour: h }).format('HH:mm')),
    );
  }, []);

  // 상호 배타: 하나 열리면 다른 하나 닫기
  useEffect(() => {
    if (startOpen && endOpen) setEndOpen(false);
  }, [startOpen]);

  useEffect(() => {
    if (endOpen && startOpen) setStartOpen(false);
  }, [endOpen]);

  return (
    <StyledTimeSelect $isOpen={startOpen || endOpen}>
      <SelectBox
        type="startTime"
        isOpen={startOpen}
        setIsOpen={setStartOpen}
        width="82px"
        value={`${startTime}:00`}
        optionList={timeList}
      />
      <p>~</p>
      <SelectBox
        type="endTime"
        isOpen={endOpen}
        setIsOpen={setEndOpen}
        width="82px"
        value={`${endTime}:00`}
        optionList={timeList}
      />
    </StyledTimeSelect>
  );
};

export default TimeSelect;

const StyledTimeSelect = styled.div<{ $isOpen: boolean }>`
  ${CommonScheSelectBox};
`;
