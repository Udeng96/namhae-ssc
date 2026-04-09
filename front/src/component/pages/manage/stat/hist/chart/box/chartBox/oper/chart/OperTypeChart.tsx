import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { useEffect, useState } from 'react';
import { FacStatType } from '@/component/types/stat';

const OperTypeChart = ({ facTypeList }: { facTypeList: FacStatType[] }) => {
  const [series, setSeries]         = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (facTypeList.length !== 0) {
      setCategories(facTypeList.map((item) => item.facNm));
      setSeries(facTypeList.map((item) => item.count));
    } else {
      setCategories(['시설물']);
      setSeries([0]);
    }
  }, [facTypeList]);

  const options = {
    chart: { type: 'column', height: '164px', spacing: 0, marginTop: 10, marginBottom: 47, backgroundColor: 'transparent' },
    title: { text: '' }, subtitle: { text: '' }, credits: { enabled: false }, legend: { enabled: false },
    tooltip: {
      shared: true, useHTML: true,
      headerFormat: '<div class="tooltip__head"><div class="tooltip__box"><div class="tooltip__name"><i class="tooltip__mark"></i>{point.key}</div><div class="tooltip__value">{point.y}%</div></div></div>',
      pointFormat: '',
      style: { fontFamily: 'Pretendard' },
      backgroundColor: 'rgba(18, 23, 46, 0.92)', borderColor: '#7A45FF', borderRadius: 10, borderWidth: 1,
    },
    xAxis: {
      useHTML: true, categories, lineColor: '#3A3D59', lineWidth: 1, crosshair: true,
      labels: { style: { fontFamily: 'Pretendard', fontSize: '11', fontWeight: '400', color: '#C8D0E8' } },
    },
    yAxis: {
      useHTML: true, title: { enabled: false },
      labels: { enabled: true, style: { fontFamily: 'Pretendard', fontSize: '11', fontWeight: '400', color: '#C8D0E8' } },
      gridLineColor: '#3A3D59', gridLineWidth: 1, tickPositions: [0, 25, 50, 75, 100],
    },
    plotOptions: {
      column: { stacking: 'normal', borderRadius: 0 }, borderWidth: 0,
      dataLabels: { enabled: false },
      series: { pointWidth: 20, borderWidth: 0 },
    },
    series: [{
      name: ' 가동률(%)', data: series,
      color: { linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 }, stops: [[0, '#6E64FF'], [1, '#BF89F5']] },
    }],
  };

  return (
    <div className="operateDateChart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default OperTypeChart;
