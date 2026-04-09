import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStatStore } from '@/component/stores/statStore';
import { EventStatBell } from '@/component/types/stat';

const BellChart = ({ subBell }: { subBell: EventStatBell[] }) => {
  const { startDtm, endDtm } = useStatStore(
    useShallow((s) => ({ startDtm: s.startDtm, endDtm: s.endDtm })),
  );

  const [series, setSeries]         = useState<number[]>([0]);
  const [categories, setCategories] = useState<string[]>([]);
  const [max, setMax]               = useState<number>(0);

  useEffect(() => {
    if (subBell.length > 0) {
      setSeries(subBell.map((b) => b.count));
      setCategories(subBell.map((b) => b.keyNm.replace('경로당', '')));
      setMax(subBell.length > 4 ? 4 : subBell.length);
    } else {
      setSeries([0]);
      setCategories(['']);
      setMax(0);
    }
  }, [subBell]);

  const options = {
    chart: { type: 'column', height: '164px', spacing: 0, marginTop: 10, marginBottom: 57, backgroundColor: 'transparent' },
    title: { text: '' }, subtitle: { text: '' }, credits: { enabled: false }, legend: { enabled: false },
    tooltip: {
      useHTML: true, shared: true,
      formatter: function () {
        const pt = this.points?.[0];
        return `<div class="tooltip__head"><div class="tooltip__name">${this.x}</div><p>${moment(startDtm, 'YYYYMMDD').format('YYYY-MM-DD')} ~ ${moment(endDtm, 'YYYYMMDD').format('YYYY-MM-DD')}</p></div><div class="tooltip__box"><div class="tooltip__name"><i class="tooltip__mark"></i>${pt?.series?.name}</div><div class="tooltip__value">${pt?.y?.toLocaleString()}회</div></div>`;
      },
      style: { fontFamily: 'Pretendard' },
      backgroundColor: 'rgba(18, 23, 46, 0.92)', borderColor: '#7A45FF', borderRadius: 10, borderWidth: 1,
    },
    xAxis: {
      useHTML: true, categories, lineColor: '#3A3D59', lineWidth: 1, crosshair: true,
      scrollbar: { enabled: true }, min: 0, max,
      labels: { style: { fontFamily: 'Pretendard', fontSize: '11', fontWeight: '400', color: '#C8D0E8' } },
    },
    yAxis: {
      useHTML: true, title: { enabled: false },
      labels: { enabled: true, style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 400, color: '#C8D0E8' } },
      gridLineColor: '#3A3D59', gridLineWidth: 1,
    },
    plotOptions: {
      borderWidth: 0, column: { stacking: 'normal', borderRadius: 0 },
      dataLabels: { enabled: false },
      series: { pointWidth: 23, borderWidth: 0 },
    },
    series: [{
      name: '비상벨', data: series,
      color: { linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 }, stops: [[0, '#F186AD'], [1, '#AC2967']] },
    }],
  };

  return (
    <div className="locationChart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BellChart;
