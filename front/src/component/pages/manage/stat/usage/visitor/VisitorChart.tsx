import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { useEffect, useState } from 'react';
import { useStatStore } from '@/component/stores/statStore';

const VisitorChart = () => {
  const usageResult  = useStatStore((s) => s.usageResult);
  const usageVisitor = usageResult?.visitorUsage ?? [];

  const [series, setSeries]         = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (usageVisitor.length > 0) {
      setSeries(usageVisitor.map((item) => item.count));
      setCategories(usageVisitor.map((item) => item.key));
    } else {
      setSeries([0]);
      setCategories(['방문자 수']);
    }
  }, [usageVisitor]);

  const options = {
    chart: { type: 'column', width: 646, height: 212, spacing: 0, marginTop: 36, marginLeft: 36, marginBottom: 28, backgroundColor: 'transparent', zooming: { mouseWheel: false } },
    title: { text: '' }, subtitle: { text: '' }, credits: { enabled: false }, legend: { enabled: false },
    tooltip: { enabled: false },
    xAxis: {
      useHTML: true, categories, lineColor: '#3A3D59', lineWidth: 1,
      labels: { y: 20, style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 400, color: '#C8D0E8' } },
      crosshair: { color: 'rgba(122, 69, 255, .1)' },
    },
    yAxis: {
      useHTML: true, title: { enabled: false },
      gridLineColor: '#3A3D59', gridLineWidth: 1,
      labels: { enabled: true, style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 400, color: '#C8D0E8' } },
    },
    plotOptions: {
      borderWidth: 0, column: { stacking: 'normal', borderRadius: 0 },
      series: {
        pointWidth: 19, borderWidth: 0,
        dataLabels: {
          enabled: true, align: 'center', verticalAlign: 'top', y: -27,
          formatter: function () { return this.y.toLocaleString(); },
          style: { fontFamily: 'Pretendard', fontSize: 13, fontWeight: 500, textOutline: 0, color: '#fff' },
        },
      },
    },
    series: [{
      name: '비상벨', data: series,
      color: { linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 }, stops: [[0, '#F186AD'], [1, '#AC2967']] },
    }],
  };

  return (
    <div className="totalChart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default VisitorChart;
