import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useStatStore } from '@/component/stores/statStore';
import { FacStatType } from '@/component/types/stat';

const TypeChart = ({ facList }: { facList: FacStatType[] }) => {
  const { startDtm, endDtm } = useStatStore(
    useShallow((s) => ({ startDtm: s.startDtm, endDtm: s.endDtm })),
  );

  const [series, setSeries]         = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (facList.length > 0) {
      setSeries(facList.map((type) => type.count));
      setCategories(facList.map((type) => type.facNm));
    } else {
      setSeries([0]);
      setCategories(['타입']);
    }
  }, [facList]);

  const options = {
    chart: { type: 'column', height: '164px', spacing: 0, marginTop: 10, marginBottom: 47, backgroundColor: 'transparent' },
    title: { text: '' }, subtitle: { text: '' }, credits: { enabled: false }, legend: { enabled: false },
    tooltip: {
      useHTML: true, shared: true,
      formatter: function () {
        const pt = this.points?.[0];
        return `<div class="tooltip__head"><p>${moment(startDtm, 'YYYYMMDD').format('YYYY-MM-DD')} ~ ${moment(endDtm, 'YYYYMMDD').format('YYYY-MM-DD')}</p><div class="tooltip__box"><div class="tooltip__name"><i class="tooltip__mark" style="background-color:${pt?.point?.color}"></i>${this.x}</div><div class="tooltip__value">${pt?.y?.toLocaleString()}건</div></div></div>`;
      },
      style: { fontFamily: 'Pretendard' },
      backgroundColor: 'rgba(18, 23, 46, 0.92)', borderColor: '#7A45FF', borderRadius: 10, borderWidth: 1,
    },
    xAxis: {
      useHTML: true, categories, lineColor: '#3A3D59', lineWidth: 1, crosshair: true,
      labels: { style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 400, color: '#C8D0E8' } },
    },
    yAxis: {
      useHTML: true, title: { enabled: false },
      labels: { enabled: true, style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 400, color: '#C8D0E8' } },
      gridLineColor: '#3A3D59', gridLineWidth: 1,
    },
    plotOptions: {
      column: { stacking: 'normal', borderRadius: 0 }, borderWidth: 0,
      dataLabels: { enabled: false },
      series: { pointWidth: 20, borderWidth: 0, colorByPoint: true },
    },
    series: [{ data: series }],
    colors: ['#D9578F', '#E05F3F', '#AEBECC', '#58992F', '#72C6D1'],
  };

  return (
    <div className="sortFacChart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default TypeChart;
