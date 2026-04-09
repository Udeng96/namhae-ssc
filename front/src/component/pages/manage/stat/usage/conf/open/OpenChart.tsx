import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useStatStore } from '@/component/stores/statStore';

const OpenChart = () => {
  const usageResult   = useStatStore((s) => s.usageResult);
  const usageOpenConf = usageResult?.openConfUsage ?? [];

  const [max, setMax]               = useState<number>(0);
  const [tick, setTick]             = useState<number[]>([]);
  const [series, setSeries]         = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  function roundUpToNearest(num: number) {
    const factor = Math.pow(10, Math.floor(Math.log10(num)));
    return Math.floor(num / factor) * factor + factor;
  }

  useEffect(() => {
    let maxTick = 0;
    if (usageOpenConf.length > 0) {
      setMax(usageOpenConf.length > 4 ? 4 : usageOpenConf.length);
      setCategories(usageOpenConf.map((item) => item.key));
      setSeries(usageOpenConf.map((item) => item.count));
      const sum = usageOpenConf.reduce((acc, cur) => acc + cur.count, 0);
      if (sum > maxTick) maxTick = sum;
      setTick([0, roundUpToNearest(Math.round(maxTick)) / 2, roundUpToNearest(maxTick)]);
    } else {
      setMax(0);
      setCategories([moment().format('YYYY-MM-DD')]);
      setSeries([0]);
      setTick([]);
    }
  }, [usageOpenConf]);

  const options = {
    chart: { type: 'line', width: 660, height: 197, spacing: 0, marginTop: 27, marginBottom: 62, marginLeft: 30, backgroundColor: 'transparent', scrollablePlotArea: { scrollPositionX: 0 }, zooming: { mouseWheel: false } },
    title: { text: '' }, subtitle: { text: '' }, credits: { enabled: false }, legend: { enabled: false },
    tooltip: { enabled: false },
    xAxis: {
      useHTML: true, categories, lineColor: '#3A3D59', lineWidth: 1,
      labels: { style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 400, color: '#C8D0E8' } },
      crosshair: { enabled: true, color: 'rgba(122, 69, 255, .1)' },
      scrollbar: { enabled: true, showFull: false }, min: 0, max,
    },
    yAxis: {
      useHTML: true, title: { enabled: false },
      gridLineColor: '#3A3D59', gridLineWidth: 1, tickPositions: tick,
      labels: { enabled: true, style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 400, color: '#C8D0E8' } },
    },
    plotOptions: {
      borderWidth: 0,
      series: {
        marker: { symbol: 'circle', fillColor: '#FFE66D', lineWidth: 0, radius: 4 },
        states: { hover: { enabled: false } },
        dataLabels: {
          enabled: true, align: 'center', verticalAlign: 'bottom', x: -2,
          formatter: function () { return this.y.toLocaleString(); },
          style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 600, textOutline: 0, color: '#fff' },
        },
      },
    },
    series: [{ name: '화상회의 개설 건수', data: series, color: '#FFE66D' }],
  };

  return (
    <div className="conferenceChart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default OpenChart;
