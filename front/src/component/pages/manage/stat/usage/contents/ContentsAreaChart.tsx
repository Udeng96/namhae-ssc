import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highstock';
import { useEffect, useState } from 'react';
import { useStatStore } from '@/component/stores/statStore';

const ContentsAreaChart = () => {
  const usageResult       = useStatStore((s) => s.usageResult);
  const usageContentArea  = usageResult?.contentAreaUsage ?? [];

  const [series, setSeries]         = useState<number[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    if (usageContentArea.length > 0) {
      setSeries(usageContentArea.map((item) => item.count));
      setCategories(usageContentArea.map((item) => item.key));
    } else {
      setSeries([0]);
      setCategories(['컨텐츠 지역']);
    }
  }, [usageContentArea]);

  const options = {
    chart: { type: 'bar', width: 629, height: 246, spacing: 0, marginTop: 3, marginBottom: 28, marginLeft: 45, marginRight: 4, backgroundColor: 'transparent', zooming: { mouseWheel: false } },
    title: { text: '' }, subtitle: { text: '' }, credits: { enabled: false }, legend: { enabled: false },
    tooltip: { enabled: false },
    xAxis: {
      useHTML: true, categories, lineColor: '#3A3D59', lineWidth: 1,
      crosshair: { enabled: true, color: 'rgba(122, 69, 255, .1)' },
      labels: { align: 'center', style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 400, color: '#C8D0E8' } },
    },
    yAxis: {
      useHTML: true, reversedStacks: false, title: { enabled: false },
      gridLineColor: '#3A3D59', gridLineWidth: 1,
      labels: { enabled: true, y: 20, style: { fontFamily: 'Pretendard', fontSize: 11, fontWeight: 400, color: '#C8D0E8' } },
      stackLabels: {
        enabled: true,
        style: { fontFamily: 'Pretendard', fontSize: 13, fontWeight: 500, textOutline: 0, color: '#fff' },
        formatter: function () { return this.total.toLocaleString(); },
      },
    },
    plotOptions: {
      bar: { stacking: 'normal', height: 12 },
      series: { pointWidth: 12, pointPadding: 0, borderWidth: 0, borderRadius: 0, shadow: false },
    },
    series: [{ name: '시정홍보 및 공지사항', data: series }],
    colors: ['#5A9BD4'],
  };

  return (
    <div className="contentBarChart">
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default ContentsAreaChart;
