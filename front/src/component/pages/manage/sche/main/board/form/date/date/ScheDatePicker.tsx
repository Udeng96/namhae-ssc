import moment from 'moment';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';

interface Props {
  type: 'start' | 'end';
}

const ScheDatePicker = ({ type }: Props) => {
  const { startDtm, endDtm, setStartDtm, setEndDtm } = useScheStore(
    useShallow((s) => ({
      startDtm:    s.startDtm,
      endDtm:      s.endDtm,
      setStartDtm: s.actions.setStartDtm,
      setEndDtm:   s.actions.setEndDtm,
    })),
  );

  const [selectedDate, setSelectedDate] = useState<Date>(moment().toDate());
  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);

  useEffect(() => {
    if (type === 'start') {
      setMaxDate(moment(endDtm, 'YYYYMMDD').toDate());
      setMinDate(null);
      setSelectedDate(moment(startDtm, 'YYYYMMDD').toDate());
    } else {
      setMinDate(moment(startDtm, 'YYYYMMDD').toDate());
      setMaxDate(null);
      setSelectedDate(moment(endDtm, 'YYYYMMDD').toDate());
    }
  }, [type, startDtm, endDtm]);

  const handleDate = (e: Date) => {
    if (type === 'start') {
      setStartDtm(moment(e).format('YYYYMMDD'));
    } else {
      setEndDtm(moment(e).format('YYYYMMDD'));
    }
  };

  return (
    <DatePicker
      className="schedule"
      disabled={false}
      onChange={(e) => handleDate(e)}
      dateFormat="yyyy-MM-dd"
      selected={selectedDate}
      minDate={minDate}
      maxDate={maxDate}
      onKeyDown={(e) => e.preventDefault()}
      selectsStart={true}
      startDate={moment(startDtm, 'YYYYMMDD').toDate()}
      endDate={moment(endDtm, 'YYYYMMDD').toDate()}
    />
  );
};

export default ScheDatePicker;
