import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { useEffect, useState } from 'react';
import { EventStatDate } from '@/component/types/stat';

const DateChart = ({ subDate }: { subDate: EventStatDate[] }) => {
  const [series, setSeries]         = useState<{ name: string; data: number[] }[]>([]);
  const [categories, setCategories] = useState<string[]>(['전체']);
  const [max, setMax]               = useState<number>(0);
  const [tick, setTick]             = useState<number[]>([]);

  function roundUpToNearest(num: number) {
    const factor = Math.pow(10, Math.floor(Math.log10(num)));
    return Math.floor(num / factor) * factor + factor;
  }

  useEffect(() => {
    if (subDate.length > 0) {
      const bells: number[] = [], fires: number[] = [];
      let maxTick = 0;
      subDate.forEach((item) => {
        const sum = item.count['01'] + item.count['02'];
        if (sum > maxTick) maxTick = sum;
        bells.push(item.count['01']);
        fires.push(item.count['02']);
      });
      setSeries([{ name: '비상벨', data: bells }, { name: '화재', data: fires }]);
      setCategories(subDate.map((item) => item.date));
      setMax(subDate.length > 4 ? 4 : subDate.length - 1);
      setTick([0, roundUpToNearest(Math.round(maxTick)) / 2, roundUpToNearest(Math.round(maxTick))]);
    } else {
      setSeries([{ name: '비상벨', data: [0] }, { name: '화재', data: [0] }]);
      setCategories(['전체']);
      setTick([0]);
      setMax(0);
    }
  }, [subDate]);

  const options = {
    chart: { type: 'column', height: '164px', spacing: 0, marginTop: 10, marginBottom: 47, backgroundColor: 'transparent' },
    title: { text: '' }, subtitle: { text: '' }, credits: { enabled: false }, legend: { enabled: false },
    tooltip: {
      shared: true, useHTML: true,
      formatter: function () {
        let html = `<div class="tooltip__head"><p>${this.x}</p></div>`;
        this.points?.forEach((pt) => {
          html += `<div class="tooltip__box"><div class="tooltip__name"><i class="tooltip__mark"></i>${pt.series.name}</div><div class="tooltip__value">${pt.y?.toLocaleString()}회</div></div>`;
        });
        return html;
      },
      style: { fontFamily: 'Pretendard' },
      backgroundColor: 'rgba(18, 23, 46, 0.92)', borderColor: '#7A45FF', borderRadius: 10, borderWidth: 1,
    },
    xAxis: {
      useHTML: true, categories, lineColor: '#3A3D59', min: 0, max,
      scrollbar: { enabled: true }, scrollablePlotArea: { minWidth: 300, scrollPositionX: 1 },
      lineWidth: 1, crosshair: true,
      labels: { style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 400, color: '#C8D0E8' } },
    },
    yAxis: {
      useHTML: true, alignTicks: false, title: { enabled: false },
      labels: { enabled: true, style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 400, color: '#C8D0E8' } },
      gridLineColor: '#3A3D59', gridLineWidth: 1, tickPositions: tick,
    },
    plotOptions: {
      borderWidth: 0, column: { stacking: 'normal', borderRadius: 0 },
      dataLabels: { enabled: false },
      series: { pointWidth: 12, borderWidth: 0, shadow: false },
    },
    series,
    colors: ['#D9578F', '#E05F3F'],
  };

  return (
    <div className="allEventChart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default DateChart;
