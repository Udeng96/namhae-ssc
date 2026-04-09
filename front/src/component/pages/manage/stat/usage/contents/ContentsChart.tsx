import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { useEffect, useState } from 'react';
import { useStatStore } from '@/component/stores/statStore';

const ContentsChart = () => {
  const usageResult  = useStatStore((s) => s.usageResult);
  const usageContent = usageResult?.contentUsage ?? [];

  const [series, setSeries]         = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (usageContent.length > 0) {
      setSeries(usageContent.map((item) => item.count));
      setCategories(usageContent.map((item) => item.key));
    } else {
      setSeries([0]);
      setCategories(['컨텐츠']);
    }
  }, [usageContent]);

  const options = {
    chart: { type: 'column', width: 623, height: 215, spacing: 0, marginTop: 28, marginLeft: 41, marginBottom: 28, backgroundColor: 'transparent', zooming: { mouseWheel: false } },
    title: { text: '' }, subtitle: { text: '' }, credits: { enabled: false }, legend: { enabled: false },
    tooltip: { enabled: false },
    xAxis: {
      useHTML: true, categories, lineColor: '#3A3D59', lineWidth: 1,
      labels: { style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 400, color: '#C8D0E8' } },
      crosshair: { enabled: true, color: 'rgba(122, 69, 255, .1)' },
    },
    yAxis: {
      useHTML: true, title: { enabled: false },
      gridLineColor: '#3A3D59', gridLineWidth: 1,
      labels: { enabled: true, style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 400, color: '#C8D0E8' } },
    },
    plotOptions: {
      borderWidth: 0, column: { stacking: 'normal', borderRadius: 0 },
      series: {
        pointWidth: 42, borderWidth: 0,
        dataLabels: {
          enabled: true, align: 'center', verticalAlign: 'top', crop: false, overflow: 'none', y: -27,
          formatter: function () { return this.y.toLocaleString(); },
          style: { fontFamily: 'Pretendard', fontSize: 13, fontWeight: 500, textOutline: 0, color: '#fff' },
        },
      },
    },
    series: [{ name: '콘텐츠 정보 제공', data: series, colorByPoint: true }],
    colors: ['#5A9BD4'],
  };

  return (
    <div className="contentChart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ContentsChart;
