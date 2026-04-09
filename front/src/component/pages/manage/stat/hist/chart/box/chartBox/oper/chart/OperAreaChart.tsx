import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStatStore } from '@/component/stores/statStore';
import { OperTimeResult } from '@/component/types/stat';

const OperAreaChart = ({ timeList }: { timeList: OperTimeResult[] }) => {
  const { startDtm, endDtm } = useStatStore(
    useShallow((s) => ({ startDtm: s.startDtm, endDtm: s.endDtm })),
  );

  const [series, setSeries]         = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [max, setMax]               = useState<number>(0);

  useEffect(() => {
    if (timeList.length > 0) {
      setMax(timeList.length > 4 ? 4 : timeList.length);
      setCategories(timeList.map((item) => item.areaNm.replace('경로당', '')));
      setSeries(timeList.map((item) => item.count));
    } else {
      setMax(0);
      setCategories(['']);
      setSeries([0]);
    }
  }, [timeList]);

  const options = {
    chart: { type: 'column', height: '164px', spacing: 0, marginTop: 10, marginBottom: 67, backgroundColor: 'transparent' },
    title: { text: '' }, subtitle: { text: '' }, credits: { enabled: false }, legend: { enabled: false },
    tooltip: {
      shared: true, useHTML: true,
      headerFormat: `<div class="tooltip__head"><p>${moment(startDtm, 'YYYYMMDD').format('YYYY-MM-DD')} ~ ${moment(endDtm, 'YYYYMMDD').format('YYYY-MM-DD')}</p><div class="tooltip__box"><div class="tooltip__name"><i class="tooltip__mark"></i>{point.key}</div><div class="tooltip__value">{point.y}%</div></div></div>`,
      pointFormat: '',
      style: { fontFamily: 'Pretendard' },
      backgroundColor: 'rgba(18, 23, 46, 0.92)', borderColor: '#7A45FF', borderRadius: 10, borderWidth: 1,
    },
    xAxis: {
      useHTML: true, categories, lineColor: '#3A3D59', lineWidth: 1, crosshair: true,
      scrollbar: { enabled: true }, min: 0,
      max: categories.length < 4 ? categories.length - 1 : 4,
      labels: { style: { fontFamily: 'Pretendard', fontSize: '11', fontWeight: '400', color: '#C8D0E8' } },
    },
    yAxis: {
      useHTML: true, title: { enabled: false },
      labels: { enabled: true, style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 400, color: '#C8D0E8' } },
      gridLineColor: '#3A3D59', gridLineWidth: 1, tickPositions: [0, 8, 16, 24],
    },
    plotOptions: {
      column: { stacking: 'normal', borderRadius: 0 }, borderWidth: 0,
      dataLabels: { enabled: false },
      series: { pointWidth: 12, borderWidth: 0 },
    },
    series: [{
      name: ' 고장률(%)', data: series,
      color: { linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 }, stops: [[0, '#7F7AFF'], [1, '#681CEB']] },
    }],
  };

  return (
    <div className="occurrenceChart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default OperAreaChart;
